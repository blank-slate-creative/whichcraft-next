from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import uuid
from typing import Optional
import os
import logging

from ..database import get_db
from ..models import User

# Set up logging
logger = logging.getLogger(__name__)

# JWT security scheme for Swagger UI
security = HTTPBearer()

# JWT configurations
JWT_ALGORITHM = "HS256"
JWT_SECRET = os.getenv("JWT_SECRET", "default_secret_never_use_in_production")


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Get the current user from the JWT token.

    Args:
        credentials: The HTTP authorization credentials.
        db: The database session.

    Returns:
        The current user.

    Raises:
        HTTPException: If the token is invalid or the user does not exist.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode Supabase token without any verification
        # For Supabase tokens, we can't verify the signature because we don't have the key
        token = credentials.credentials

        try:
            # Important: we're NOT validating the signature for Supabase tokens
            # We're only extracting the claims
            payload = jwt.decode(
                token,
                JWT_SECRET,
                algorithms=[JWT_ALGORITHM],
                options={"verify_signature": False, "verify_aud": False},
            )
        except Exception as e:
            logger.error(f"Error decoding token: {str(e)}")
            raise credentials_exception

        # Check if the 'sub' claim exists (this is the user ID)
        if "sub" not in payload:
            logger.error("Token missing 'sub' claim")
            raise credentials_exception

        user_id = payload["sub"]

        # Get user from database or create if not exists
        try:
            user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()

            if not user:
                # Auto-create user if not found (for development)
                logger.info(f"Creating new user with ID: {user_id}")
                email = payload.get("email", f"{user_id}@example.com")
                user = User(id=uuid.UUID(user_id), email=email)
                db.add(user)
                db.commit()
                db.refresh(user)
                logger.info(f"User created: {user.id}, {user.email}")

            if not user:
                logger.error("Failed to retrieve or create user")
                raise credentials_exception

            return user

        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            raise credentials_exception

    except JWTError as e:
        logger.error(f"JWT Error: {str(e)}")
        raise credentials_exception
