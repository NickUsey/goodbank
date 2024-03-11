const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dal = require('./dal.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 

function authenticate(req, res, next) {
    next();
}

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    dal.find(email)
        .then(users => {
            if (users.length === 0) {
                res.status(401).json({ error: 'Login failed: user not found' });
            } else {
                const user = users[0];
                if (user.password === password) {
                    const token = jwt.sign({ email: user.email }, 'secretKey', { expiresIn: '1h' });
                    res.status(200).json({ token: token });
                } else {
                    res.status(401).json({ error: 'Login failed: wrong password' });
                }
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/create-account', (req, res) => {
    const { name, email, password } = req.body;
    
    dal.find(email)
        .then(users => {
            if (users.length > 0) {
                res.status(400).json({ error: 'User already exists' });
            } else {
                dal.create(name, email, password)
                    .then(user => {
                        res.status(201).json(user);
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get('/protected-route', authenticate, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
