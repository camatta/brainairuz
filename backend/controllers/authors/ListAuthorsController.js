const { ListAuthorsService } = require("../../services/authors/ListAuthorsService");

module.exports.ListAuthorsController = async (req, res) => {
  try {
    const authors = await ListAuthorsService();

    res.status(200).send({ authors });
  } catch(error) {
    res.status(500).send({ message: "Erro ao consultar Autores!", error });
  }
}