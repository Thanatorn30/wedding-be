# Wedding Website Backend

A comprehensive backend API for wedding website management built with Express.js, Sequelize ORM, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 💒 **Wedding Management**: Create, update, and manage wedding events
- 👥 **Guest Management**: Comprehensive guest list management with RSVP tracking
- 📊 **RSVP Statistics**: Track attendance rates and guest responses
- 🔒 **Security**: Password hashing, input validation, and CORS protection
- 📝 **API Documentation**: Complete REST API with detailed endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-web-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wedding_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb wedding_db
   
   # Run migrations
   npm run db:migrate
   
   # Seed data (optional)
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Weddings
- `GET /api/weddings` - Get all weddings (public)
- `GET /api/weddings/:id` - Get wedding by ID (public)
- `POST /api/weddings` - Create wedding (protected)
- `GET /api/weddings/user/weddings` - Get user weddings (protected)
- `PUT /api/weddings/:id` - Update wedding (protected)
- `DELETE /api/weddings/:id` - Delete wedding (protected)
- `PATCH /api/weddings/:id/publish` - Publish wedding (protected)

### Guests
- `POST /api/weddings/:weddingId/guests` - Add guest (protected)
- `GET /api/weddings/:weddingId/guests` - Get wedding guests (protected)
- `GET /api/guests/:id` - Get guest by ID (protected)
- `PUT /api/guests/:id` - Update guest (protected)
- `DELETE /api/guests/:id` - Delete guest (protected)
- `PUT /api/guests/:id/rsvp` - Update RSVP (public)
- `POST /api/weddings/:weddingId/guests/bulk` - Bulk import guests (protected)
- `GET /api/weddings/:weddingId/guests/stats` - Get RSVP stats (protected)

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `role` (Enum: admin, user, guest)
- `isActive` (Boolean)
- `lastLogin` (DateTime)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Weddings
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `title` (String)
- `description` (Text)
- `date` (DateTime)
- `location` (String)
- `address` (Text)
- `brideName` (String)
- `groomName` (String)
- `maxGuests` (Integer)
- `isPublic` (Boolean)
- `status` (Enum: draft, published, cancelled)
- `theme` (String)
- `budget` (Decimal)
- `notes` (Text)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Guests
- `id` (UUID, Primary Key)
- `weddingId` (UUID, Foreign Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String)
- `phone` (String)
- `relationship` (String)
- `plusOne` (Boolean)
- `plusOneName` (String)
- `dietaryRestrictions` (Text)
- `rsvpStatus` (Enum: pending, attending, not_attending, maybe)
- `rsvpDate` (DateTime)
- `notes` (Text)
- `isInvited` (Boolean)
- `invitationSent` (Boolean)
- `invitationSentDate` (DateTime)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Run database seeders
- `npm run db:reset` - Reset database (drop, create, migrate, seed)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | wedding_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | your_password |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 24h |
| `CORS_ORIGIN` | CORS origin | http://localhost:3000 |

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- CORS protection
- Helmet security headers
- Rate limiting (can be added)
- SQL injection protection via Sequelize

## Development

### Project Structure
```
wedding-web-be/
├── config/
│   ├── database.js
│   └── sequelize.js
├── controllers/
│   ├── authController.js
│   ├── weddingController.js
│   └── guestController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Wedding.js
│   ├── Guest.js
│   └── index.js
├── routes/
│   ├── auth.js
│   ├── weddings.js
│   ├── guests.js
│   └── index.js
├── utils/
│   └── jwt.js
├── server.js
├── package.json
└── README.md
```

### Adding New Features

1. **Create Model**: Add new model in `models/` directory
2. **Create Controller**: Add controller logic in `controllers/` directory
3. **Create Routes**: Add routes in `routes/` directory
4. **Update Relationships**: Update `models/index.js` if needed
5. **Add Validation**: Add validation rules in controller
6. **Test**: Test the new endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 