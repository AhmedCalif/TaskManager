import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { users } from '../db/schema';

const router = Router();

interface UserRequestBody {
    username: string;
    email: string;
    password: string;
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

router.post('/login', async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
    const { email, password } = req.body;

    try {
        const user: User | undefined = await (req as any).db
            .select()
            .from(users)
            .where({ email })
            .first();

        if (user && await bcrypt.compare(password, user.password)) {
            (req.session as any).userId = user.id;
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});

router.post('/register', async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [id] = await (req as any)
            .insert({ username, email, password: hashedPassword })
            .into(users);

        (req.session as any).userId = id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Internal server error');
    }
});

export default router;
