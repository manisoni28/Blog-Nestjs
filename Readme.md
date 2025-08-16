## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Project Structure
```
rpg-assignment/
├── backend/          # NestJS GraphQL server
├── frontend/         # Vue 3 application
└── README.md
```

## 🏃‍♂️ Running the Application

### 1. Backend Server (NestJS)

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Start the backend server:
```bash
npm run start:dev
```

The backend server will start on `http://localhost:3200` with:
- GraphQL endpoint: `http://localhost:3200/graphql`
- GraphQL Playground: `http://localhost:3200/graphql` (for testing queries)
- WebSocket endpoint: `ws://localhost:3200/graphql` (for real-time subscriptions)

**Available Backend Scripts:**
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### 2. Frontend Application (Vue 3)

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

**Available Frontend Scripts:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test:unit` - Run unit tests

## 🌐 Accessing the Application

1. **Frontend**: Open `http://localhost:5173` in your browser
2. **Backend GraphQL**: Access `http://localhost:3200/graphql` for the GraphQL playground
3. **Database**: SQLite database file is located at `backend/database.sqlite`

## 🔧 Development

### Backend Features
- **Authentication**: JWT-based user registration and login
- **Blog Management**: Create, read blog posts with real-time updates
- **GraphQL Subscriptions**: Real-time notifications for new blog posts
- **Database**: SQLite with TypeORM for data persistence

### Frontend Features
- **Vue 3 Composition API**: Modern Vue.js development
- **Pinia State Management**: Reactive state management
- **Apollo Client**: GraphQL client with real-time subscriptions
- **Responsive Design**: Mobile-friendly UI with modern styling

### Real-time Features
- **WebSocket Subscriptions**: Instant notifications when new blogs are published
- **Live Updates**: Blog list updates automatically without page refresh
- **Cross-user Notifications**: All users see new blogs in real-time

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `backend/src/main.ts` (default: 3200)
   - Frontend: Change port in `frontend/vite.config.ts` (default: 5173)

2. **Database Issues**
   - Delete `backend/database.sqlite` to reset the database
   - The database will be automatically recreated on server restart

3. **Authentication Issues**
   - Clear browser localStorage if experiencing login problems
   - Check browser console for error messages

4. **Real-time Notifications Not Working**
   - Ensure WebSocket connection is established
   - Check browser console for subscription errors
   - Verify backend WebSocket endpoint is accessible

### Logs
- **Backend**: Check terminal where backend is running
- **Frontend**: Check browser console (F12 → Console tab)

## 📝 API Endpoints

### GraphQL Queries
- `blogs` - Get all blog posts
- `me` - Get current user information

### GraphQL Mutations
- `register` - User registration
- `login` - User authentication
- `createBlog` - Create new blog post

### GraphQL Subscriptions
- `blogCreated` - Real-time notification for new blog posts

## 🚀 Production Deployment

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with your preferred web server
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [GraphQL Documentation](https://graphql.org/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
