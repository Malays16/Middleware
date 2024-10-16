const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();

const books = [
  {
    id: '1',
    title: 'Book 1',
    description: 'Описание 1',
    authors: 'Author 1',
    favorite: true,
    fileCover: 'image1.jpg',
    fileName: 'book1.pdf',
    fileBook: './public/books/book1.pdf',
  }
];

router.get('/', (_, res) => {
  res.render('index', { books });
});

router.get('/books/:id', (req, res, next) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  if (!book) {
    next();
  } else {
    res.render('view', { book });
  }
});

router.get('/book/create', (_, res) => {
  const book = {
    description: '',
    authors: '',
    fileCover: ''
  };
  res.render('create', { book });
});

router.post('/book/create', (req, res, next) => {
  const { title, description, authors, fileCover, fileBook } = req.body;
  const id = uuid();
  const fileName = fileBook.split('/').pop();
  const newBook = { id, title, description, authors, favorite: false, fileCover, fileName, fileBook };
  if (!title) {
    res.status(400).render('create', {
      error: 'Title is required',
      book: newBook,
    });
    next();
  } else {
    books.push(newBook);
    res.redirect('/');
  }
});

router.get('/book/update/:id', (req, res, next) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  if (!book) {
    next();
  } else {
    res.render('update', { book });
  }
});

router.post('/book/update/:id', (req, res, next) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  if (!book) {
    next();
  } else {
    const { title, description, authors, fileCover, fileBook } = req.body;
    book.title = title;
    book.description = description;
    book.authors = authors;
    book.fileCover = fileCover;
    book.fileName = fileBook.split('/').pop();
    book.fileBook = fileBook;
    res.redirect('/');
  }
});

module.exports = router;