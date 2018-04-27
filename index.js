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


// Users
//

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

  const User = mongoose.model('User', userSchema); 

  User.find((err, result) => {
    if (err) {
      console.log(err);
    } else if (result.length) {
      res.json(result);
    } else {
      res.send('Нет документов с данным условием поиска');
    }
  });
   
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



// Tasks
//

app.post('/tasks/', (req, res) => {

  mongoose.connect(url);

  const Task = mongoose.model('Task', taskSchema);

  Task.create({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    user: req.body.user
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });

});



app.get('/tasks/', (req, res) => { 

  mongoose.connect(url);

  const Task = mongoose.model('Task', taskSchema);

  if (req.query.q) {

    const regex = `.*${req.query.q}.*`;

    Task.find({$or: [{name: {$regex: regex}}, {description: {$regex: regex}}]}, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length) {
        res.json(result);
      } else {
        res.send('Нет документов с данным условием поиска');
      }
    });

  } else {

    Task.find((err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length) {
        res.json(result);
      } else {
        res.send('Нет документов с данным условием поиска');
      }
    });

  }    
});



app.put('/tasks/:id', (req, res) => {

  mongoose.connect(url);

  const Task = mongoose.model('Task', taskSchema); 

  const ObjectId = mongoose.Types.ObjectId;
  const id = new ObjectId(req.params.id);    

  Task.update({_id: id}, {$set: {status: req.body.status, user: req.body.user}}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }    
  });
});



app.delete('/tasks/:id', (req, res) => {

  mongoose.connect(url);

  const Task = mongoose.model('Task', taskSchema); 

  const ObjectId = mongoose.Types.ObjectId;
  const id = new ObjectId(req.params.id);    

  Task.remove({_id: id}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }    
  });
});



app.listen(3000, () => console.log('App started on 3000 port'));

