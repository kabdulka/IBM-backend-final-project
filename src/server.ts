import express from 'express';
import session from 'express-session';
import { Response, Request, NextFunction, Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import general_routes from './routes/general_routes';
import { protect } from './modules/auth';
import registered_users from './routes/auth_user';

const app: Express = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(session({secret: process.env.JWT_SECRET, resave: true, saveUninitialized: true}));

app.use("/", general_routes);
app.use("/customer", registered_users);

export default app;