module.exports = (req, res, next) => {
  res.status(400);
  res.json('Bad Request');
};