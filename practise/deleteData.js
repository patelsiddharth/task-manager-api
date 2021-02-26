const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser : true}, (error, client) => {
    if(error)
    {
        return console.log('Fail to connect to database');
    }
    const db = client.db('task-manager');

    db.collection('users').deleteOne({name : 'Siddharth'}).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    })
})