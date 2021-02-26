const jwt = require('jsonwebtoken')

const myFunc = async () => {
    // sign takes 2 parameter : object and a string. Others are optional
    // 1st parameter object contains the data which will be embedded in token and '
    // 2nd parameter a secret (this could be any string)
    // Whole point of using jwt is to create data which can be verified by secret 
    const token = jwt.sign({ _id : 'abc123'}, 'CustomSecret', {expiresIn : '7 days'});
    console.log(token)

    // verify token
    // if secret is wrong, error will be returned
    const data = jwt.verify(token, 'CustomSecret')
    console.log(data)
}
myFunc()