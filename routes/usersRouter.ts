import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { users } from '../db/schema';
import {eq} from 'drizzle-orm'


const router = Router();

interface UserRequestBody {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

router.get('/login', (req: Request, res: Response) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = (req as any).db;

        const userResult = await db.select().from(users).where(eq(users.username, username));
        const user = userResult[0]; 

        if (user && await bcrypt.compare(password, user.password)) {
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred during login');
    }
});
router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});



router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const db = (req as any).db;

        await db.insert(users).values({
            username,
            email,
            password: hashedPassword
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('An error occurred during registration');
    }
});

export default router;



