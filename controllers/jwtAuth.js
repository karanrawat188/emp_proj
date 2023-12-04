const jwt = require('jsonwebtoken');

function createToken(data,maxAge)
    {
    return jwt.sign(data,process.env.secret_key ,{
     expiresIn:maxAge,
    });
}
 
module.exports={
    createToken,
}
