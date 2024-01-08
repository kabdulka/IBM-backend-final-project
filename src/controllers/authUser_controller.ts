import { Response, Request } from "express"
import { books, users } from "../data.ts/data";
import { comparePasswords, createJWT } from "../modules/auth";

const authenticatedUser = async (username, password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username);
    // if username exists check if associated password matches that of the param
    if (!user) {
        return false
    } else {
        console.log(user.password + " , " + password)
        let isValid =  await comparePasswords(password, user.password);
        return isValid;
    }
}

const login = async (req, res) => {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    
    const {username, password} = req.body;
    console.log(users)
    const user = users.find(user => user.username === username);
    // let ans = await comparePasswords(password, user.password);
    // console.log(ans)
    // console.log(username, password)
    let isValid = await authenticatedUser(username, password);
    console.log(isValid);

    if (!isValid) {
        res.status(401).json({message: "Passowrds don't match"});
        return;
    }

    const token = createJWT(user);
    req.session.token = token;
    console.log("expiration time: ", req.session.exp)
    console.log(token);
    return res.status(200).json({ token });
    // console.log(ans.then((data) => console.log(data) ));
    // res.send(ans)

    // const { username, password } = req.body;
    // const user = users.find(user => user.username === username);

    // if (!user) {
    //     return res.status(401).json({ message: 'Invalid username or password' });
    // }

    // bcrypt.compare(password, user.password, (err, result) => {
    //     if (err) {
    //         // Handle error
    //         console.error(err);
    //         return res.status(500).json({ message: 'Internal server error' });
    //     }
    //     if (result) {
    //         // Passwords match
    //         return res.status(200).json({ message: 'Login successful' });
    //     } else {
    //         // Passwords do not match
    //         return res.status(401).json({ message: 'Invalid username or password' });
    //     }
    // });
};

// Add a book review
const addReview = (req, res) => {
   
    // res.send("hello!");
    const {isbn} = req.params;
    const {review} = req.body;
    // get logged in user stored in session
    // const username = req.user.username;
    const username = req.session.authorization.username;
    console.log(username);

    if (!isbn) {
        return res.status(400).send("Please provide an isbn");
    }

    if (!review) {
        return res.status(400).send("Please provide a review");
    }

    // retrive book by isbn
    let book = books[isbn];

    book.reviews[username] = review;


    return res.status(200).send(book)
};

const deleteReview = async (req, res) => {
    const {isbn} = req.params;
    const username = req.session.authorization.username;

    // get book
    const book = books[isbn];

    if (!book) {
        return res.status(400).send("Book not found");
    }

    try {
        // delete the review for logged in user in session
        delete book.reviews[username];
        res.status(200).send(book);
    } catch (error) {
        return res.status(500).send("Couldn't delete book");
    }
};

export {
    login,
    addReview,
    deleteReview,
}
