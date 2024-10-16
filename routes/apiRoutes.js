const express = require('express');
const fileMiddleware = require('../middleware/file');
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

router.post('/book/upload-book', fileMiddleware.single('fileBookInput'), (req, res) => {
  if (req.file) {
    const { path } = req.file;
    res.json(path);
  } else {
    res.json(null);
  }
});

router.get('/books/:id/download', (req, res, next) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);

  if (!book) {
    next();
  } else {
    res.download(book.fileBook, err => {
      if (err) {
        console.error(err);
        next(err);
      }
    });
  }
});

module.exports = router;