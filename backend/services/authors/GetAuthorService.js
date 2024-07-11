const Author = require('../../models/Authors');

module.exports.GetAuthorService = async ( authorEmail ) => {
  try {
    const author = await Author.findOne({ email: authorEmail })

    if(author === null) {
      return new Error({ message: "Erro ao consultar Autor", error });
    }
    
    return author
  } catch(error) {
    throw new Error({ message: "Erro ao consultar Autor", error: error.message });
  }
}