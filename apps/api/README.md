# Whichcraft API

This is the backend API for the Whichcraft application, which helps users track
and rate beverages they've tried.

## Data Model

The application uses the following data model:

- **User**: Represents a user of the application
- **BeverageType**: Represents a type of beverage (Beer, Wine, etc.)
- **Producer**: Represents a producer/brewery/winery
- **Beverage**: Represents a specific beverage
- **Entry**: Represents a user's entry/rating for a beverage

## Migration Guide

The data model has been updated to separate the `Beverage` model from the
`Entry` model, and to extract `Producer` and `BeverageType` models from the
`Beverage` model. This allows for better scalability and data normalization.

### Migration Steps

1. **Backup your database**: Always backup your database before running
   migrations

   ```
   pg_dump -U your_username -d your_database > backup.sql
   ```

2. **Run the migrations**: The migrations will:

   - Create the new tables (`beverage_types`, `producers`, `entries`)
   - Add new columns to the `beverages` table
   - Migrate data from the old model to the new model
   - Remove legacy columns

   ```
   flask db upgrade
   ```

3. **Verify the migration**: Check that all data has been properly migrated
   ```
   flask shell
   >>> from app import db, User, Beverage, BeverageType, Producer, Entry
   >>> Entry.query.count()  # Should match the previous Beverage count
   >>> BeverageType.query.count()  # Should have one entry per unique beverage type
   >>> Producer.query.count()  # Should have one entry per unique producer
   ```

### API Changes

The API endpoints have been updated to work with the new data model:

- `/api/beverages` now returns user entries with their associated beverages
- When creating a new beverage, the API now creates entries in the appropriate
  tables
- The API maintains backward compatibility by returning the same response format
  as before while also including additional structured data for new clients.
  Specifically:
  - Entry IDs are used as the primary IDs in responses
  - Beverage information is included directly in the root of entry objects
  - The full beverage object is also included as a nested property for new
    clients

## Development

### Setup

1. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Set up environment variables:

   ```
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

4. Run the application:
   ```
   flask run
   ```

### Database Migrations

To create a new migration:

```
flask db migrate -m "Description of changes"
```

To apply migrations:

```
flask db upgrade
```

To revert a migration:

```
flask db downgrade
```

## Running the API

You can run the API using the provided restart script:

```bash
./restart.sh
```
