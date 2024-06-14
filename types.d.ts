import { DrizzleInstance } from 'drizzle-orm';

declare module 'express-serve-static-core' {
    interface Request {
        db: DrizzleInstance;
    }
}

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}
