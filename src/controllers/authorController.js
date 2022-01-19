const AuthorModel = require("../models/authorModel.js")
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    let authorDetails = req.body
    let savedAuthorData = await AuthorModel.create(authorDetails)
    res.status(200).send({ msg: savedAuthorData })
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message });

  }

}

module.exports.createAuthor = createAuthor


//phase 2 login
const login = async function (req, res) {
  try {
    let email = req.body.email
    let password = req.body.password

    if (email && password) {
      let user = await AuthorModel.findOne({ email: email, password: password })

      if (user) {
        let payload = { authorId: user["_id"] }
        var token = jwt.sign(payload, "radium-secret");
        res.status(200).send({ status: true, data: user, token: token })
      } else {
        res.status(400).send({ message: 'email or password are invalid or user is deleted' })
      }
    } else {
      res.status(400).send({ msg: "email and password are not given" })
    }
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message });

  }

};

module.exports.login = login

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6IjYxYTRiY2ZjODBmMWI4NmE1ZGNi
