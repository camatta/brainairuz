const Author = require('../../models/Authors');

module.exports.GetAuthorService = async ( authorEmail ) => {
  try {
    const author = await Author.findOne({ email: authorEmail })
    
    return author
  } catch(error) {
    throw new Error({ message: "Erro ao consultar Autor", error: error.message });
  }
}