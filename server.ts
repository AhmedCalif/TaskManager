import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import userRoutes from './routes/usersRouter';
import { ensureAuthenticated } from './middleware/auth';
import { createDatabase } from './db/schema';
import dashboardRoutes from './routes/dashboardRoute';

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true if using https
    })
);

// Initialize the database and start the server
(async () => {
    const db = await createDatabase();

    // Make the db instance available in request object
    app.use((req, res, next) => {
        (req as any).db = db;
        next();
    });

    // Set up view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));

    // Use routes
    app.use('/auth', userRoutes);
    app.use('/dashboard', dashboardRoutes);

    // Redirect root to login page
    app.get('/', (req, res) => {
        res.redirect('/auth/login');
    });

    // Example of a protected route
    app.get('/protected', ensureAuthenticated, (req, res) => {
        res.send('This is a protected route');
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
