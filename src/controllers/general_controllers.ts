import { Response, Request } from "express"
import { books, users } from "../data.ts/data";
import axios from 'axios';
import { createJWT, hashPassword } from "../modules/auth";
import { uuid } from 'uuidv4';

const removeAccents = str =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');


const register = async (req: Request, res: Response)=> {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).send(`username and/or password are missing`);
    }

    // check if username exists
    const user = users.find(user => user.username === username);

    // user not found
    if (!user) {
        // create/add user
        const user = {
            userID: uuid(),
            username: username,
            password: await hashPassword(password),
        }
        users.push( user );
        // console.log(users);

        const token = createJWT(user);
        return res.status(200).json({ token }) // ==> res.json({ token: token })
        // return res.status(200).send("User created!");
    } else {
        return res.status(500).send(`User with username: ${username} already exists`);
    }
};

// Get the book list available in the shop
const getBookList = async (req: Request, res: Response) => {

    try {
        // This would usually be an API call using Axios
        // get books after a short delay as if it's fetched from an external service
        const fetchedBooks = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(books); // Resolving the books object
          }, 250); 
        });
    
        return res.status(200).send(fetchedBooks); // Sending the fetched books
      } catch (error) {
        return res.status(500).send("Error fetching books");
      }
}
  
// Get book details based on ISBN
const getBookDetailsByISBN = async (req: Request, res: Response) => {
    const {isbn} = req.params;


    const book = books[isbn];
    if (!book) {
      return res.status(401).send(`No book found with the ISBN of ${isbn}`)
    }
    return res.status(201).send(books[isbn]);
};

// Get book details based on author
// TODO return an array of all books that have the same author name
const getBookDetailsByAuthor = (req: Request, res: Response) => {
    const {author} = req.params;

    for (const [isbn, book] of Object.entries(books)) {
      console.log(removeAccents(book['author']), author)
      if (removeAccents(book['author']) === author) {
        return res.status(201).send(book)
      }
    }
  
    return res.status(404).send(`book with author ${author} not found`);
};

// Get all books based on title
const getAllBooksByTitle = (req: Request, res: Response) => {
    const {title} = req.params;
    const targetBooks = [];
    for (const book of Object.entries(books)) {
        return res.status(201).send(book)
    }

    return res.status(404).send(`book with title ${title} not found`);
};

// Get book review by isbn
const getBookReviewByISBN = (req: Request, res: Response) => {
    const {isbn} = req.params;
    const book = books[isbn]
    if (!book) return res.status(404).send(`Book with ISBN ${isbn} could not be found`);
    return res.status(201).send(book.reviews) 
}

export {
    getBookList,
    getBookDetailsByISBN,
    getBookDetailsByAuthor,
    getAllBooksByTitle,
    getBookReviewByISBN,
    register,
}