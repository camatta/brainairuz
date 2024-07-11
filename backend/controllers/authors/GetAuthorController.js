const { GetAuthorService } = require("../../services/authors/GetAuthorService");

module.exports.GetAuthorController = async (req, res) => {
  try {
    const { email } = req.params;
    const author = await GetAuthorService( email );

    res.status(200).send({ author });
  } catch(error) {
    res.status(400).send({ message: "Autor inválido ou não existe." });
  }
}