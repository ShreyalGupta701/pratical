const session = require('express-session');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.use(session({
    secret: 'secretkey12345',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

mongoose
    .connect("mongodb://localhost:27017/session")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Connection error", err));

const dummyuser = {
    username: 'admin',
    password: '1234'
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;   
    
    if (username === dummyuser.username && password === dummyuser.password) {
        req.session.user = { username: username }; 
        return res.json({ msg: 'Login successful', sessionId: req.sessionID });
    }
    res.status(401).json({ msg: 'Invalid credentials' });
});

app.get("/dashboard", (req, res) => {
    if (req.session.user) {
        return res.json({ msg: 'Profile data', user: req.session.user });
    }
    res.status(401).json({ msg: 'Unauthorized' });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {    
        if (err) {
            return res.status(500).json({ msg: 'Logout failed' });
        }   
        res.clearCookie('connect.sid');
        res.json({ msg: 'Logout successful' });
    });
});

app.listen(9000, () => {
    console.log('Server running on 9000');
});