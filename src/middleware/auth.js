const User = require("../models/user");
const jwt = require('jsonwebtoken')

// Middleware
// Without middleware :    new request -> run route handler
// With middleware    :    new request -> run code in middleware -> run route handler
// app.use((req, res, next) => {
//     console.log(req.method, req.path)
//     if(req.method === "GET")
//     {
//         res.send('GET requests are disabeld')
//     }
//     // This will ensure route handler run after middleware is completed. 
//     // Without next() routes will never run and no response will be returned
//     next(); 
// })

//maintenance middleware
// app.use((req, res, next) => {
//     res.status(503).send('Site under maintenance. Please try again after sometime')
// })

const auth = async (req, res, next) => 
{
    try
    {
        console.log('Middleware running')
        const token = req.header('Authorization').replace('Bearer ','');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decodedToken)
        // tokens.token is required to ensure the current token generated is not expired.
        // if current token is present in tokens array then it is not expired.
        const user = await User.findOne({ _id : decodedToken._id, 'token.token' : token})

        // console.log(user)
        if(!user)
        {
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();
    }
    catch(e)
    {
        res.status(401).send('Please provide token to get authenticate.')
    }
}

module.exports = auth;