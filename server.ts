import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import userRoutes from './routes/usersRouter';
import { ensureAuthenticated } from './middleware/auth';
import { createDatabase } from './db/schema';
import dashboardRoutes from './routes/dashboardRoute';  

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(
    session({
        secret: 'secret-key',
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

    app.set('view engine', 'ejs')

    app.use('/auth', userRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.get('/', (req, res)=> {
        res.redirect('/auth/login')
    })

    // Example of a protected route
    app.get('/protected', ensureAuthenticated, (req, res) => {
        res.send('This is a protected route');
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();

