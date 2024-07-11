const Author = require("../../models/Authors");

module.exports.CreateAuthorService = async ( author ) => {
  try {
    const newAuthor = new Author(author);

    const response = await newAuthor.save();

    if(response.errors) {
      throw new Error('Algo deu errado ao salvar o novo Autor.', response.errors);
    }

    return newAuthor;

  } catch(err) {
    return { message: "Erro ao salvar Autor", error: err.message };
  }
}