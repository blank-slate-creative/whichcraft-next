from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv

# Import routers
from .routers import beverages, health, search, users

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# Create FastAPI app
app = FastAPI(
    title="WhichCraft API",
    description="API for tracking and rating beverages",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(users.router)
app.include_router(beverages.router)
app.include_router(search.router)


# Add root endpoint that redirects to docs
@app.get("/", include_in_schema=False)
async def root():
    """
    Redirect to API documentation
    """
    return {"message": "WhichCraft API - See /docs for documentation"}
