const express = require('express');
const uuid = require('uuid');

const app = express();

app.use(express.json()); // for parsing json in request body

const data = require('./books.json');

// console.log(data); // Array from ./books.json

app.post('/books', function (req, res) {
  createBook(req, res);
});

function createBook(req, res) {
  const { title, author } = req.body;
  if (isInvalid(req)) {
    res.status(400);
    res.send('invalid request');
    return;
  }
  const id = uuid.v4();
  let newBook = {
    id: id,
    title: title,
    author: author,
  };
  data.push(newBook);
  res.status(201);
  res.send(id);
}

app.get('/books', function (req, res) {
  readBooks(req, res);
});

function readBooks(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}

app.put('/books/:id', function (req, res) {
  updateBook(req, res);
});

function updateBook(req, res) {
  const { title, author } = req.body;
  if (isInvalid(req)) {
    res.status(400);
    res.send('invalid request');
    return;
  }
  const bookToUpdate = data.find((book) => book.id === req.params.id);
  if (typeof bookToUpdate === 'undefined') {
    res.status(404);
    res.send('No such book');
    return;
  }
  bookToUpdate.title = title;
  bookToUpdate.author = author;
  res.send('ok');
}

app.delete('/books/:id', function (req, res) {
  deleteBook(req, res);
});

function deleteBook(req, res) {
  const bookToDelete = data.find((book) => book.id === req.params.id);
  if (typeof bookToDelete === 'undefined') {
    res.status(404);
    res.send('No such book');
    return;
  }
  data.splice(data.indexOf(bookToDelete), 1);
  res.send('ok');
}

function isInvalid(req) {
  const { title, author } = req.body;
  if (
    typeof req.body === 'undefined' ||
    typeof title === 'undefined' ||
    typeof author === 'undefined'
  ) {
    return true;
  } else {
    return false;
  }
}

app.listen(3000);
