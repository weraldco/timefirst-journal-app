# Backend API Gateway Documentation

## Overview
This backend is built with Node.js, Express, TypeScript, Prisma, and Supabase. It provides a RESTful API gateway with full CRUD operations.

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Prisma schema configuration
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client configuration
│   │   └── supabase.ts        # Supabase client configuration
│   ├── controllers/
│   │   └── exampleController.ts  # Request handlers for examples
│   ├── middleware/
│   │   ├── errorHandler.ts    # Global error handling
│   │   └── notFound.ts        # 404 handler
│   ├── routes/
│   │   ├── index.ts           # Main router (API gateway)
│   │   └── exampleRoutes.ts   # Example CRUD routes
│   ├── services/
│   │   └── exampleService.ts  # Business logic layer
│   ├── utils/
│   │   └── logger.ts          # Logging utility
│   └── index.ts               # Express app entry point
├── .env.example               # Environment variables template
└── package.json
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   - Copy `env.example` to `.env`
   - Fill in your Supabase credentials:
     - `DATABASE_URL`: Your Supabase PostgreSQL connection string
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. **Initialize Prisma**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Base URL: `http://localhost:8080/api`

### Examples Resource

- **GET** `/api/examples` - Get all examples
- **GET** `/api/examples/:id` - Get single example by ID
- **POST** `/api/examples` - Create new example
  ```json
  {
    "name": "Example Name",
    "email": "example@email.com" // optional
  }
  ```
- **PUT** `/api/examples/:id` - Update example
  ```json
  {
    "name": "Updated Name",
    "email": "updated@email.com" // optional
  }
  ```
- **DELETE** `/api/examples/:id` - Delete example

## Adding New Resources

To add a new resource with CRUD operations:

1. **Create Prisma Model** in `prisma/schema.prisma`
2. **Create Service** in `src/services/`
3. **Create Controller** in `src/controllers/`
4. **Create Routes** in `src/routes/`
5. **Register Routes** in `src/routes/index.ts`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Technologies

- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **Supabase** - Backend as a Service (PostgreSQL + Auth + Storage)
- **CORS** - Cross-origin resource sharing
