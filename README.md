# Notes Application - Complete Setup Guide

## Project Overview
A full-stack notes application with user authentication and role-based access control built with Next.js (React) frontend and Spring Boot backend.

## Technology Stack

### Frontend
- React with Next.js
- Tailwind CSS for styling
- Lucide React for icons
- Local Storage for token persistence

### Backend
- Java 17+
- Spring Boot 3.2.0
- Spring Security with JWT
- PostgreSQL Database
- Maven for dependency management

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) and npm
2. **Java Development Kit (JDK)** 17 or higher
3. **PostgreSQL** 12 or higher
4. **Maven** 3.8 or higher
5. **Git** (optional, for version control)

---

## Backend Setup (Spring Boot)

### Step 1: Install PostgreSQL

#### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

Open PostgreSQL command line (psql) and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE notesdb;

```


### Step 3: Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notesdb
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### Step 4: Project Structure

Create the following directory structure:

```
notes-app-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── notes/
│   │   │           └── app/
│   │   │               ├── NotesApplication.java
│   │   │               ├── config/
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── AuthController.java
│   │   │               │   └── NoteController.java
│   │   │               ├── dto/
│   │   │               │   ├── AuthResponse.java
│   │   │               │   ├── LoginRequest.java
│   │   │               │   ├── NoteRequest.java
│   │   │               │   ├── SignupRequest.java
│   │   │               │   └── UserDTO.java
│   │   │               ├── entity/
│   │   │               │   ├── Note.java
│   │   │               │   └── User.java
│   │   │               ├── repository/
│   │   │               │   ├── NoteRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── security/
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   └── JwtUtil.java
│   │   │               └── service/
│   │   │                   ├── AuthService.java
│   │   │                   ├── CustomUserDetailsService.java
│   │   │                   └── NoteService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

### Step 5: Build and Run Backend

```bash
# Navigate to backend directory
cd notes-app-backend

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

---

## Frontend Setup (Next.js/React)


### Step 1: Install Dependencies

```bash
cd notes-app-frontend
npm install lucide-react
```

### Step 2: Run Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### 1. Sign Up
**POST** `/auth/signup`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

Response:
```json
"User registered successfully"
```

#### 2. Sign In
**POST** `/auth/signin`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Notes Endpoints

**All notes endpoints require JWT authentication**

Add header: `Authorization: Bearer <your_token>`

#### 1. Get All Notes
**GET** `/notes`

Response:
```json
[
  {
    "id": 1,
    "title": "First Note",
    "description": "This is my first note",
    "createdAt": "2024-12-04T10:30:00",
    "updatedAt": "2024-12-04T10:30:00",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

#### 2. Get Note by ID
**GET** `/notes/{id}`

Response: Single note object

#### 3. Create Note
**POST** `/notes`

Request Body:
```json
{
  "title": "New Note",
  "description": "Note description"
}
```

Response: Created note object

#### 4. Update Note
**PUT** `/notes/{id}`

Request Body:
```json
{
  "title": "Updated Note",
  "description": "Updated description"
}
```

Response: Updated note object

#### 5. Delete Note
**DELETE** `/notes/{id}`

Response:
```json
"Note deleted successfully"
```

---

## Role-Based Access Control

### USER Role
- Can create notes
- Can view only their own notes
- Can update only their own notes
- Can delete only their own notes

### ADMIN Role
- Can view ALL notes from all users
- Can update ANY note
- Can delete ANY note
- Full CRUD access to the entire system

---

## Testing the Application

### Test User Accounts

After running the database setup script, you'll have:

1. **Admin Account**
   - Email: admin@example.com
   - Password: password123
   - Role: ADMIN

2. **Regular User Account**
   - Email: user@example.com
   - Password: password123
   - Role: USER

### Test Scenarios

1. **Sign Up**: Create a new user account
2. **Sign In**: Log in with credentials
3. **Create Note**: Add a new note
4. **View Notes**: See all your notes (or all notes if admin)
5. **Edit Note**: Update an existing note
6. **Delete Note**: Remove a note
7. **Role Testing**: 
   - Login as USER and try to access another user's notes (should fail)
   - Login as ADMIN and access all notes (should succeed)

---

## Troubleshooting

### Backend Issues

1. **Maven Build Fails**
   ```bash
   \.mvn clean install -U
   ```

### Frontend Issues

1. **CORS Errors**
   - Backend SecurityConfig already includes CORS configuration
   - Ensure frontend URL matches allowed origins

2. **API Connection Failed**
   - Verify backend is running on port 8081
   - Check API_URL in frontend code

3. **Token Expiration**
   - JWT tokens expire after 10 hours
   - Sign in again to get a new token

---

## Security Features

1. **Password Encryption**: BCrypt hashing
2. **JWT Authentication**: Secure token-based auth
3. **Role-Based Authorization**: Access control per endpoint
4. **CSRF Protection**: Disabled for API usage (stateless)
5. **Input Validation**: Server-side validation on all inputs

---

## Production Deployment Checklist

- [x] User Authentication (Sign Up/Sign In)
- [x] JWT Token Management
- [x] Role-Based Access Control
- [x] CRUD Operations for Notes
- [x] User-specific Note Management
- [x] Admin Full Access
- [x] Input Validation
- [x] Error Handling
- [x] Responsive Design
- [x] PostgreSQL Integration
- [x] Security Best Practices

---

## Additional Features to Implement

1. Password reset functionality
2. Email verification
3. User profile management
4. Note categories/tags
5. Note sharing between users
6. Search and filter notes
7. Pagination for large datasets
8. File attachments to notes
9. Rich text editor
10. Dark mode

---

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Verify all prerequisites are installed
- Check application logs for error details

---

## License

This project is for educational purposes.
