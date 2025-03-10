# WhichCraft

WhichCraft is an application that helps users keep track of which beers and
wines they've tried and whether they liked them or not. It provides a simple and
intuitive interface for recording and rating beverages, making it easy to
remember your favorites and avoid repeating mistakes.

## Features

- **Track Your Tastings**: Log beers and wines you've tried
- **Rate & Review**: Record your impressions and ratings
- **Search & Filter**: Easily find beverages by name, type, or rating
- **User Authentication**: Secure login via Supabase
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI Components**: Built with Shadcn UI and Radix UI
- **Simplified Authentication Flow**: Streamlined login, registration, and
  password reset
- **Dynamic Route Protection**: Intelligent middleware for secure access control
- **Intuitive Dashboard**: Redesigned with improved statistics and beverage
  management

## Tech Stack

- **Frontend**: React with Next.js, TypeScript, and TailwindCSS
- **UI Components**: Shadcn UI and Radix UI
- **Icons**: Lucide React
- **Typography**: Space Grotesk font
- **Backend API**: Python with Flask and SQLAlchemy
- **Database**: PostgreSQL managed by Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Docker container on Fly.io
- **Development**: Turbopack for faster development experience

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Python 3.9+
- Docker
- Supabase account
- Fly.io account

### Local Development

#### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/whichcraft.git
   cd whichcraft
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

#### Backend Setup

1. Navigate to the API directory:

   ```bash
   cd api
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:

   ```
   DATABASE_URL=your-supabase-postgres-connection-string
   JWT_SECRET=your-jwt-secret
   ```

5. Run the Flask development server:
   ```bash
   flask run
   ```

### Docker Deployment

1. Build the Docker image:

   ```bash
   docker build -t whichcraft .
   ```

2. Test the Docker image locally:

   ```bash
   docker run -p 8080:8080 whichcraft
   ```

3. Deploy to Fly.io:
   ```bash
   fly launch
   fly deploy
   ```

## Database Schema

The application uses the following main tables:

- **Users**: User accounts and profiles
- **Beverages**: Beer and wine entries with details
- **Ratings**: User ratings and reviews for beverages

## API Endpoints

The backend provides the following main endpoints:

- `GET /api/beverages`: List all beverages
- `POST /api/beverages`: Create a new beverage
- `GET /api/beverages/{id}`: Get a specific beverage
- `PUT /api/beverages/{id}`: Update a beverage
- `DELETE /api/beverages/{id}`: Delete a beverage
- `POST /api/ratings`: Add a rating to a beverage
- `GET /api/users/me/ratings`: Get all ratings by the current user

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

# Whichcraft Next Monorepo

This is a monorepo for the Whichcraft Next project, built with [Turborepo](https://turbo.build/repo).

## What's inside?

This monorepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following packages/apps:

### Apps

- `web`: a [Next.js](https://nextjs.org/) app
- `api`: a [Flask](https://flask.palletsprojects.com/) app

### Packages

- `turbo`: [Turborepo](https://turbo.build/repo) for monorepo management

## Setup

### Install dependencies

```
npm install
```

### Development

To develop all apps and packages, run the following command:

```
npm run dev
```

### Build

To build all apps and packages, run the following command:

```
npm run build
```

### Deployment

Each app can be deployed independently to its respective platform.

#### Web App (Next.js)

The web app can be deployed to Vercel.

#### API (Flask)

The API can be deployed to Fly.io using the deploy script.

```
cd apps/api
./restart.sh
```
