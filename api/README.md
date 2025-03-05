# Whichcraft API

This is the backend API for the Whichcraft application. It provides endpoints
for managing beverages and searching for beers using the Untappd Algolia search.

## Setup

1. Create a virtual environment:

   ```bash
   cd api
   python -m venv .venv
   ```

2. Activate the virtual environment:

   - On Windows: `.venv\Scripts\activate`
   - On macOS/Linux: `source .venv/bin/activate`

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

## Running the API

You can run the API using the provided restart script:

```bash
./restart.sh
```

Or manually:

```bash
python app.py
```

The API will be available at `http://localhost:5001`.

## API Endpoints

### Beer Search

- **GET /api/search/beer?q={search_term}**
  - Searches for beers using the Untappd Algolia search
  - Does not require authentication
  - Returns a list of beers matching the search term

### Beverages

- **GET /api/beverages**

  - Get all beverages for the authenticated user
  - Requires authentication

- **POST /api/beverages**

  - Create a new beverage
  - Requires authentication

- **GET /api/beverages/{id}**

  - Get a specific beverage
  - Requires authentication

- **PUT /api/beverages/{id}**

  - Update a specific beverage
  - Requires authentication

- **DELETE /api/beverages/{id}**
  - Delete a specific beverage
  - Requires authentication

### User

- **GET /api/users/me**
  - Get the current user's information
  - Requires authentication

## Authentication

The API uses JWT tokens for authentication. Include the token in the
Authorization header:

```
Authorization: Bearer <token>
```

## Development

When developing, the Next.js frontend will proxy API requests to this Flask
backend. Make sure the API is running on port 5001.
