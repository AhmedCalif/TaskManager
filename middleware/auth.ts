import { Request, Response, NextFunction } from 'express';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && (req.session as any).userId) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
