import express from 'express';
import { protect } from "../modules/auth";
import { 
    addReview,
    deleteReview,
    login,

} from '../controllers/authUser_controller';

const registered_users = express.Router();

//only registered users can login
registered_users.post("/login", login);

registered_users.put("/auth/review/:isbn", protect, addReview);

registered_users.delete("/auth/review/:isbn", protect, deleteReview);

export default registered_users;