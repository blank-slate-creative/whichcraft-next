from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid
import os
from datetime import datetime, timedelta
import jwt
from functools import wraps
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = timedelta(days=7)


# Models
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    beverages = db.relationship("Beverage", backref="user", lazy=True)

    def __repr__(self):
        return f"<User {self.email}>"


class Beverage(db.Model):
    __tablename__ = "beverages"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # Beer, Wine, etc.
    style = db.Column(db.String(100))
    producer = db.Column(db.String(255))
    abv = db.Column(db.Float)
    year = db.Column(db.String(50))
    liked = db.Column(db.Boolean, nullable=False)  # True for liked, False for disliked
    notes = db.Column(db.Text)
    location = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Beverage {self.name}>"

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "type": self.type,
            "style": self.style,
            "producer": self.producer,
            "abv": self.abv,
            "year": self.year,
            "liked": self.liked,
            "notes": self.notes,
            "location": self.location,
            "created_at": self.created_at.isoformat(),
        }


# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            # Decode token
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload["sub"]

            # Get user from database
            current_user = User.query.filter_by(id=uuid.UUID(user_id)).first()
            if not current_user:
                return jsonify({"message": "User not found"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# Routes
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


@app.route("/api/beverages", methods=["GET"])
@token_required
def get_beverages(current_user):
    beverages = Beverage.query.filter_by(user_id=current_user.id).all()
    return jsonify([beverage.to_dict() for beverage in beverages]), 200


@app.route("/api/beverages", methods=["POST"])
@token_required
def create_beverage(current_user):
    data = request.get_json()

    # Validate required fields
    if not data.get("name") or not data.get("type"):
        return jsonify({"message": "Name and type are required"}), 400

    # Create new beverage
    new_beverage = Beverage(
        user_id=current_user["id"],
        name=data.get("name"),
        type=data.get("type"),
        style=data.get("style"),
        producer=data.get("producer"),
        abv=data.get("abv"),
        year=data.get("year"),
        liked=bool(data.get("liked", False)),  # Convert to boolean
        notes=data.get("notes"),
        location=data.get("location"),
    )

    db.session.add(new_beverage)
    db.session.commit()

    return jsonify(
        {"message": "Beverage created successfully", "id": str(new_beverage.id)}
    ), 201


@app.route("/api/beverages/<uuid:beverage_id>", methods=["GET"])
@token_required
def get_beverage(current_user, beverage_id):
    beverage = Beverage.query.filter_by(id=beverage_id, user_id=current_user.id).first()

    if not beverage:
        return jsonify({"message": "Beverage not found"}), 404

    return jsonify(beverage.to_dict()), 200


@app.route("/api/beverages/<uuid:beverage_id>", methods=["PUT"])
@token_required
def update_beverage(current_user, beverage_id):
    beverage = Beverage.query.filter_by(id=beverage_id, user_id=current_user.id).first()

    if not beverage:
        return jsonify({"message": "Beverage not found"}), 404

    data = request.get_json()

    # Update fields
    if data.get("name"):
        beverage.name = data.get("name")
    if data.get("type"):
        beverage.type = data.get("type")
    if "style" in data:
        beverage.style = data.get("style")
    if "producer" in data:
        beverage.producer = data.get("producer")
    if "abv" in data:
        beverage.abv = data.get("abv")
    if "year" in data:
        beverage.year = data.get("year")
    if "liked" in data:
        beverage.liked = data.get("liked")
    if "notes" in data:
        beverage.notes = data.get("notes")
    if "location" in data:
        beverage.location = data.get("location")

    db.session.commit()

    return jsonify(beverage.to_dict()), 200


@app.route("/api/beverages/<uuid:beverage_id>", methods=["DELETE"])
@token_required
def delete_beverage(current_user, beverage_id):
    beverage = Beverage.query.filter_by(id=beverage_id, user_id=current_user.id).first()

    if not beverage:
        return jsonify({"message": "Beverage not found"}), 404

    db.session.delete(beverage)
    db.session.commit()

    return jsonify({"message": "Beverage deleted"}), 200


@app.route("/api/users/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify(
        {
            "id": str(current_user.id),
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat(),
        }
    ), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
