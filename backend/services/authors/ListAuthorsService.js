const Author = require("../../models/Authors");

module.exports.ListAuthorsService = async () => {
  const authors = await Author.find().sort({ name: 1 });

  return authors
}