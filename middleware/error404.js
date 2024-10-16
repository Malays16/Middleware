module.exports = (req, res, next) => {
  res.status(404);
  res.json('404 | not found');
};