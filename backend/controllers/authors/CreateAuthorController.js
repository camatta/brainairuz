const { CreateAuthorService } = require("../../services/authors/CreateAuthorService");

module.exports.CreateAuthorController = async (req, res) => {
  try {
    const { author } = req.body;
  
    const newAuthor = await CreateAuthorService( author );
    
    if(newAuthor.error) {
      res.status(400).send({ message: "Algo deu errado ao criar o Autor", error: newAuthor.error });
    }

    res.status(201).send( newAuthor )

  } catch(err) {
    res.status(500).send({ message: "Erro ao criar um novo Autor", error: err.message })
  }
}