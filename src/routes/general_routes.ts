import express, { Router } from "express";
import { 
    getBookDetailsByISBN, 
    getBookDetailsByAuthor, 
    getAllBooksByTitle, 
    getBookList,
    getBookReviewByISBN,
    register
} 
from "../controllers/general_controllers";

const general_routes = Router();

// Get
general_routes.get('/', getBookList);
general_routes.get('/isbn/:isbn', getBookDetailsByISBN);
general_routes.get('/author/:author', getBookDetailsByAuthor);
general_routes.get('/title/:title', getAllBooksByTitle);
general_routes.get("/review/:isbn", getBookReviewByISBN)

// Post
general_routes.post("/register", register);

export default general_routes;

