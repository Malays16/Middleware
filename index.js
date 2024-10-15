const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const fileMiddleware = require('./middleware/file');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const router = express.Router();

const books = [
  {
    id: '1',
    title: 'Book 1',
    description: 'Описание 1',
    authors: 'Author 1',
    favorite: false,
    fileCover: 'image1.jpg',
    fileName: 'book1.pdf',
    fileBook: './public/books/book1.pdf',
  },
  {
    id: '2',
    title: 'Book 2',
    description: 'Описание 2',
    authors: 'Author 2',
    favorite: true,
    fileCover: 'image2.jpg',
    fileName: 'book2.pdf',
    fileBook: './public/books/book2.pdf',
  },
];

router.get('/', (req, res) => {
  res.render('index', { books });
});

router.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  if (!book) {
    res.status(404);
    res.json({ status: 'Book not found' });
  } else {
    res.render('view', { book });
  }
});

router.get('/book/create', (req, res) => {
  const book = {
    description: '',
    authors: '',
    fileCover: ''
  };
  res.render('create', { book });
});

router.post('/book/create', (req, res) => {
  const { title, description, authors, fileCover, fileBook } = req.body;
  const id = uuid();
  const fileName = fileBook.split('/').pop();
  const newBook = { id, title, description, authors, favorite: false, fileCover, fileName, fileBook };
  if (!title) {
    res.status(400).render('create', {
      error: 'Title is required',
      book: newBook,
    });
    return;
  }
  books.push(newBook);
  res.redirect('/');
});

router.get('/book/update/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  if (!book) {
    res.status(404);
    res.json({ status: 'Book not found' });
  } else {
    res.render('update', { book });
  }
});

router.post('/book/update/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  const { title, description, authors, fileCover, fileBook } = req.body;
  if (!book) {
    res.status(404);
    res.json({ status: 'Book not found' });
  } else {
    book.title = title;
    book.description = description;
    book.authors = authors;
    book.fileCover = fileCover;
    book.fileName = fileBook.split('/').pop();
    book.fileBook = fileBook;
    res.redirect('/');
  }
});

router.post('/book/upload-book', fileMiddleware.single('fileBookInput'), (req, res) => {
  if (req.file) {
    const { path } = req.file;
    res.json(path);
  } else {
    res.json(null);
  }
}
);

router.get('/api/books/:id/download', (req, res, next) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);

  if (!book) {
    res.status(404);
    res.json({ status: 'Book not found' });
  } else {
    res.download(book.fileBook, err => {
      if (err) {
        console.error(err);
        next(err);
      }
    });
  }
});

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on ${PORT}`));