'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/test';
mongoose.connect(url);

const userSchema = new mongoose.Schema({
	name: String
});

const taskSchema = new mongoose.Schema({
	name: String,
	description: String,
	status: String,
	user: String
});


app.post('/users/', (req, res) => {

	mongoose.connect(url);

	const User = mongoose.model('User', userSchema);

	User.create({name: req.body.name}, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}
	});

});



app.get('/users/', (req, res) => { 

	mongoose.connect(url);

  if (req.query.q) {

		const User = mongoose.model('User', userSchema); 

		const regex = `.*${req.query.q}.*`;

		User.find({name: {$regex: regex}}, (err, result) => {
			res.send(result);
		});

  } else {

		const User = mongoose.model('User', userSchema); 

		User.find((err, result) => {
			res.send(result);
		});

  }    
});



app.put('/users/:id', (req, res) => {

	mongoose.connect(url);

	const User = mongoose.model('User', userSchema);

	const ObjectId = mongoose.Types.ObjectId;
  const id = new ObjectId(req.params.id);    

	User.update({_id: id}, {$set: {name: req.body.name}}, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}		
	});
});



app.delete('/users/:id', (req, res) => {

	mongoose.connect(url);

	const User = mongoose.model('User', userSchema);

	const ObjectId = mongoose.Types.ObjectId;
  const id = new ObjectId(req.params.id);    

	User.remove({_id: id}, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}		
	});
});



app.listen(3000, () => console.log('App started on 3000 port'));

