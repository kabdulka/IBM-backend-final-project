import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt';

export const createJWT = (user: JwtPayload) => {
    const expirationTime = Math.floor(Date.now() / 1000) + 900; // Set expiration time 15 seconds from now

    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({
        username: user.username,
        userID: user.userID,
        exp: expirationTime
    },
        process.env.JWT_SECRET,
    );

    return token;
};

// hash password
export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 5);
}

// 
export const comparePasswords = (password: string, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

// middleware to authenticate token. called to verify token 
export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    // bearer: describes someone is sending a token
    if (!bearer) {
        res.status(401);
        res.json({message: "Not Authorized"});
        return;
    }

    // bearer contains info like the token
    const [, token] = bearer.split(' ');

    if (!token) {
        res.status(401);
        res.json({message: "Not valid token"});
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        req.session.authorization = user;
        next();
    } catch(error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error(error);
        res.status(401).json({ message: 'Failed to authenticate token' });

    }

}