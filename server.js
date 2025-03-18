const express = require('express');
const app = express();
const bodyParser = require('body-paerser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			password: "cookies",
			email: 'john@gmail.com'
			entries: 0, 
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			password: "bananas",
			email: 'sally@gmail.com'
			entries: 1, 
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: ' ',
			email: 'john@gmail.com'
		}
	]

}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
	if (req.body.email === database.users[0].email 
		&& req.body.password ===database.users[0].password) {
		res.json('sucess');
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
	});
database.users.push({
	id: '125',
			name: name,
			email: email,
			password: password,
			entries: 0, 
			joined: new Date()
})
res.json(database.users[database.users.lenght-1]);
})


app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	const found = false; 
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}
})

app.put('/image', (req, res) => {
const { id } = req.body;
	const found = false; 
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++
			return res.json(user.entries);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}
})
})


app.listen(3000, ()=> {
	console.log('App is running on port 3000');
})

/* 
/ Svarar: This is working
/signin så att man kan logga in --> POST (För att skydda lösenord)
/register --> POST --> Användare
/profile/userID --> GET --> Användare
/image --> PUT --> Användare
*/