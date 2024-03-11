const express = require('');
const cors = require('cors');
const dal = require('./dal.js');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(cors());

app.get('/account/create/:name/:email/:password', async (req, res) => {
    try {
        const users = await dal.find(req.params.email);
        if (users.length > 0) {
            console.log('User already exists');
            res.send('User already exists');
        } else {
            const user = await dal.create(req.params.name, req.params.email, req.params.password);
            console.log(user);
            res.send(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/account/login/:email/:password', async (req, res) => {
    try {
        const user = await dal.find(req.params.email);
        if (user.length > 0) {
            if (user[0].password === req.params.password) {
                res.send(user[0]);
            } else {
                res.send('Login failed: wrong password');
            }
        } else {
            res.send('Login failed: user not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/account/find/:email', async (req, res) => {
    try {
        const user = await dal.find(req.params.email);
        console.log(user);
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/account/findOne/:email', async (req, res) => {
    try {
        const user = await dal.findOne(req.params.email);
        console.log(user);
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/account/update/:email/:amount', async (req, res) => {
    try {
        const response = await dal.update(req.params.email, Number(req.params.amount));
        console.log(response);
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/account/all', async (req, res) => {
    try {
        const docs = await dal.all();
        console.log(docs);
        res.send(docs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
