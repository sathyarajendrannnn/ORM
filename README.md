# Online Review Management System (ORMS)

A full-stack web application for managing product/service reviews with fake review detection, admin moderation, and JWT authentication.

## Features

- ✅ User registration and JWT-based authentication
- ✅ Review submission with real-time fake review detection
- ✅ **Anonymous Reviews**: Option for users to hide their identity in public posts
- ✅ Admin dashboard for managing users and moderating reviews
- ✅ Role-based access control (USER / ADMIN)
- ✅ CORS-enabled for local development on multiple ports
- ✅ MySQL database with JPA/Hibernate ORM
- ✅ React frontend with Vite build tool
- ✅ Spring Boot backend with REST API

## Tech Stack

### Frontend
- **React 19** with React Router v7
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Axios** for API calls
- **JWT Decode** for token management

### Backend
- **Spring Boot** 3.x
- **Spring Security** with JWT authentication
- **JPA/Hibernate** for database ORM
- **MySQL** database
- **Lombok** for boilerplate reduction

## Project Structure

```
.
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API service layer
│   │   └── utils/              # Helper utilities
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── reviewmanagement/           # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/reviewmanagement/
│   │       ├── config/         # Security, CORS, JWT config
│   │       ├── controller/     # API endpoints
│   │       ├── service/        # Business logic
│   │       ├── model/          # JPA entities
│   │       └── repository/     # Data access layer
│   ├── .env                    # Backend environment variables
│   ├── scripts/                # Helper scripts (load-env, start-backend)
│   └── pom.xml
│
└── .gitignore                  # Root git ignore rules
```

## Setup Instructions

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **MySQL 8.0+** (database)
- **Maven** (included via `mvnw.cmd`)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd reviewmanagement
   ```

2. Create a `.env` file (already provided) with:
   ```properties
   FRONTEND_URLS=http://localhost:3000,http://localhost:3002,http://localhost:3003
   ```

3. Load environment variables and start the backend:
   ```powershell
   # From reviewmanagement folder
   .\scripts\start-backend.ps1
   ```
   
   Or manually:
   ```powershell
   # Load env variables
   Get-Content .env | ForEach-Object {
     $pair = $_ -split '=', 2
     if ($pair.Length -eq 2) { 
       $name = $pair[0].Trim()
       $value = $pair[1].Trim()
       [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
     }
   }
   
   # Run backend
   .\mvnw.cmd spring-boot:run
   ```

4. Backend will start on **http://localhost:8080**

5. Default admin credentials (created on first run):
   - Email: `admin@orms.com`
   - Password: `admin123`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (already provided) with:
   ```properties
   PORT=3000
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Frontend will run on **http://localhost:3000** (or next available port like 3002, 3003)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login and receive JWT token

### Reviews (`/api/reviews`)
- `POST /` - Create a review (authenticated)
- `GET /my` - Get current user's reviews (authenticated)
- `GET /approved` - Get all approved reviews (public)
- `PUT /{id}` - Update a review (authenticated, own reviews only)
- `DELETE /{id}` - Delete a review (authenticated, own reviews only)

### Admin (`/api/admin`)
- `GET /users` - Get all users (admin only)
- `PUT /users/{id}/role` - Update user role (admin only)
- `DELETE /users/{id}` - Delete a user (admin only)
- `GET /reviews/pending` - Get pending reviews (admin only)
- `PUT /reviews/{id}/status` - Moderate review status (admin only)
- `GET /dashboard` - Get dashboard statistics (admin only)

## Database Configuration

Located in `reviewmanagement/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/review_management_db...
spring.datasource.username=root
spring.datasource.password=root123
spring.jpa.hibernate.ddl-auto=update
```

Adjust `username` and `password` to match your MySQL setup.

## CORS Configuration

The backend uses environment-based CORS configuration in `reviewmanagement/.env`:

```properties
FRONTEND_URLS=http://localhost:3000,http://localhost:3002,http://localhost:3003
```

This allows multiple frontend dev ports. To add more ports, update the `.env` file.

## Deployment Notes

Before pushing to GitHub:

1. ✅ `.gitignore` files are configured to exclude:
   - `node_modules/`, `dist/`, `build/` (frontend)
   - `target/`, `.class` files, logs (backend)
   - `.env` files (sensitive credentials)
   - IDE files (`.idea/`, `.vscode/`)

2. 🔐 **Environment Variables**: 
   - `.env` files are git-ignored
   - Create `.env.example` files documenting required variables
   - Database credentials should never be committed

3. 📝 **Documentation**: Keep `README.md` updated with setup instructions
4. 🚀 **Vercel Deployment**: Use the provided `vercel.json` in the `frontend` directory for SPA routing and API proxying.
5. 🌐 **Base URL**: Ensure `VITE_API_URL` in the frontend and `FRONTEND_URLS` in the backend are updated to your production domains.

## Running the Full Stack

### Terminal 1 - Backend
```powershell
cd reviewmanagement
.\scripts\start-backend.ps1
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000** in your browser

## Troubleshooting

### Backend won't start
- Check Java is installed: `java -version`
- Ensure MySQL is running
- Check port 8080 is not in use

### Frontend won't start
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules/` and `package-lock.json`, then run `npm install` again
- Check VITE_API_URL in `.env` points to running backend

### CORS errors
- Verify frontend URL is in `reviewmanagement/.env` `FRONTEND_URLS`
- Restart backend after changing `.env`

### Admin endpoints return 403 Forbidden
- Confirm you're logged in as admin user
- Check JWT token is valid and includes admin role
- Verify Authorization header is sent with requests

## License

This project is provided as-is for educational purposes.

## Contributing

Feel free to fork, modify, and improve this project. Submit pull requests for enhancements or bug fixes.
