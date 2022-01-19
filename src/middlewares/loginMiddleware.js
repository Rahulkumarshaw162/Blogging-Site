const jwt = require("jsonwebtoken");

const authenticate = function (req, res, next) {
    try {
        let authToken= req.headers["x-api-key"];
        // console.log(authToken,"token")

        if (!authToken) {
            res.status(401).send({ status: false, message: "Mandatory authentication header missing" });
        }
        else {
            let decodedToken = jwt.verify(authToken, "radium-secret");
            // console.l og(decodedToken,"decodedtoken")
            if (decodedToken) {

                req.email = decodedToken
                req.password = decodedToken
                // console.log("Token:- ",decodedToken)
                next();

            } else {
                res.status(401).send({ status: false, message: "The authentication token is invalid" });
            }
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


//const autho
module.exports.authenticate = authenticate;