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
import requests
from flask_migrate import Migrate

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = timedelta(days=7)
# Supabase configuration - we'll keep JWT constants for compatibility
# but we're only using Supabase tokens now


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

    # Untappd specific data
    untappd_beer_id = db.Column(db.Integer)
    untappd_brewery_id = db.Column(db.Integer)
    image_url = db.Column(db.String(512))

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
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "untappd_beer_id": self.untappd_beer_id,
            "untappd_brewery_id": self.untappd_brewery_id,
            "image_url": self.image_url,
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
            # Decode Supabase token without verification
            # In production, you should properly verify the token with Supabase's public key
            payload = jwt.decode(token, options={"verify_signature": False})

            # Check if it's a valid Supabase token by looking for specific claims
            if "sub" not in payload or "aud" not in payload:
                raise jwt.InvalidTokenError("Not a valid Supabase token format")

            user_id = payload["sub"]

            # Get user from database or create if not exists
            current_user = User.query.filter_by(id=uuid.UUID(user_id)).first()

            if not current_user:
                # For development: auto-create user if not found
                print(f"User {user_id} not found, creating new user")
                email = payload.get("email", f"{user_id}@example.com")
                current_user = User(id=uuid.UUID(user_id), email=email)
                db.session.add(current_user)
                db.session.commit()

            if not current_user:
                return jsonify({"message": "User not found"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            print(f"Invalid token error: {str(e)}")
            return jsonify({"message": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return jsonify({"message": f"Error processing token: {str(e)}"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# Routes
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


@app.route("/api/beverages", methods=["GET"])
@token_required
def get_beverages(current_user):
    # Start with base query filtered by user
    query = Beverage.query.filter_by(user_id=current_user.id)

    # Log request parameters
    print(f"GET /api/beverages - Request args: {request.args}")

    # Apply type filter if provided
    type_filter = request.args.get("type")
    if type_filter:
        print(f"Filtering by type: {type_filter}")
        query = query.filter(Beverage.type == type_filter)

    # Apply liked filter if provided
    liked_filter = request.args.get("liked")
    if liked_filter is not None:
        # Convert string 'true'/'false' to boolean
        liked_bool = liked_filter.lower() == "true"
        print(f"Filtering by liked: {liked_bool}")
        query = query.filter(Beverage.liked == liked_bool)

    # Apply sorting if provided
    sort_by = request.args.get("sort_by", "created_at")  # Default sort by created_at
    sort_order = request.args.get("sort_order", "desc")  # Default descending

    # Validate sort_by parameter to prevent SQL injection
    valid_sort_fields = ["name", "type", "producer", "created_at"]
    if sort_by not in valid_sort_fields:
        sort_by = "created_at"  # Default to created_at if invalid

    # Apply sorting
    if sort_order.lower() == "asc":
        query = query.order_by(getattr(Beverage, sort_by).asc())
    else:
        query = query.order_by(getattr(Beverage, sort_by).desc())

    # Execute query and return results
    beverages = query.all()
    print(f"Found {len(beverages)} beverages matching filters")
    return jsonify([beverage.to_dict() for beverage in beverages]), 200


@app.route("/api/beverages", methods=["POST"])
@token_required
def create_beverage(current_user):
    data = request.get_json()

    # Validate required fields
    if not data.get("name") or not data.get("type"):
        return jsonify({"message": "Name and type are required"}), 400

    # Handle empty strings for integer fields
    untappd_beer_id = data.get("untappd_beer_id")
    if untappd_beer_id == "":
        untappd_beer_id = None

    untappd_brewery_id = data.get("untappd_brewery_id")
    if untappd_brewery_id == "":
        untappd_brewery_id = None

    # Create new beverage
    new_beverage = Beverage(
        user_id=current_user.id,
        name=data.get("name"),
        type=data.get("type"),
        style=data.get("style"),
        producer=data.get("producer"),
        abv=data.get("abv"),
        year=data.get("year"),
        liked=bool(data.get("liked", False)),  # Convert to boolean
        notes=data.get("notes"),
        location=data.get("location"),
        untappd_beer_id=untappd_beer_id,
        untappd_brewery_id=untappd_brewery_id,
        image_url=data.get("image_url"),
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
    if "untappd_beer_id" in data:
        beverage.untappd_beer_id = data.get("untappd_beer_id")
    if "untappd_brewery_id" in data:
        beverage.untappd_brewery_id = data.get("untappd_brewery_id")
    if "image_url" in data:
        beverage.image_url = data.get("image_url")

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


@app.route("/api/search/beer", methods=["GET"])
def search_beer():
    """
    Proxy endpoint for searching beers using Untappd's Algolia search.
    This endpoint doesn't require authentication as it's just for searching.
    """
    search_term = request.args.get("q", "")

    if not search_term:
        return jsonify({"message": "Search term is required"}), 400

    try:
        # Untappd Algolia search endpoint
        url = "https://9wbo4rq3ho-dsn.algolia.net/1/indexes/beer/query"

        # Headers required for the Algolia API
        headers = {
            "Content-Type": "application/json",
            "X-Algolia-API-Key": "1d347324d67ec472bb7132c66aead485",
            "X-Algolia-Application-ID": "9WBO4RQ3HO",
        }

        # Prepare the search payload
        payload = {
            "query": search_term,
            "hitsPerPage": 5,  # Limit results to 5
        }

        # Make the request to Algolia
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors

        data = response.json()

        # Transform the response to match our expected format
        if "hits" in data:
            transformed_results = []

            for hit in data["hits"]:
                transformed_results.append(
                    {
                        "id": hit.get("bid", 0),
                        "name": hit.get("beer_name", ""),
                        "type_name": hit.get("type_name", ""),
                        "rating": hit.get("rating_score", 0),
                        "rating_count": hit.get("rating_count", 0),
                        "image_url": hit.get("beer_label", ""),
                        "abv": hit.get("beer_abv", 0),
                        "brewery_name": hit.get("brewery_name", "Unknown Brewery"),
                        "brewery_id": hit.get("brewery_id"),
                    }
                )

            return jsonify(transformed_results), 200
        else:
            return jsonify([]), 200

    except requests.exceptions.RequestException as e:
        print(f"Error searching for beers: {str(e)}")
        return jsonify({"message": f"Error searching for beers: {str(e)}"}), 500


if __name__ == "__main__":
    # Create database tables if they don't exist
    print("Creating database tables...")
    with app.app_context():
        db.create_all()
        print("Database tables created successfully")

    # Use the port from environment variable or default to 5001
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting Flask app on port {port}")
    app.run(debug=True, host="0.0.0.0", port=port)
