const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send('success')});
app.post('/signin',  signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

const PORT = process.env.PORT
app.listen(PORT || 3001, () => {
	console.log(`app runs on ${PORT}`);
})


/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/

//Local database in case the db doesn't work
// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'John',
// 			password: 'cookies',
// 			email: 'john@gmail.com',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'Enerelt',
// 			password: 'apples',
// 			email: 'enerelt@gmail.com',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	],
// 	login: [
// 		{
// 			id: '987',
// 			hash: '',
// 			email: 'john@gmail.com'
// 		}
// 	]
// }

//Asynchronous way to hash using bcrypt
	// bcrypt.hash(password, null, null, function(err, hash) {
 	//    	console.log(hash);
	// });

//Simple way to test /image if the database is local
	// let found = false;
	// database.users.forEach(user => {
	// 	if (user.id === id){
	// 		found = true;
	// 		user.entries++;
	// 		return res.json(user.entries);
	// 	}
	// });
	// if (!found){
	// 	res.status(404).json('no such user');
	// }

//Simple way to test /signin if the database is local
	// if (req.body.email === database.users[0].email && 
	// 	req.body.password === database.users[0].password){
	// 	res.json(database.users[0]);
	// } else{
	// 	res.status(400).json('error logging in');
	// }