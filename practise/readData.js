const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser : true}, (error, client) => {
    if(error)
    {
        return console.log('Fail to connect to database');
    }
    const db = client.db('task-manager');

    // return one result
    db.collection('users').findOne({name : 'John'}, (error, result) => {
        if(error)
        {
            return console.log('Unable to fetch from database');
        }
        console.log(result);
    })

    // find by object id
    db.collection('users').findOne({ _id : new mongodb.ObjectID("602a9776cadd5b5224d37630")}, (error, user) => {
        if(error)
        {
            return console.log('Unable to fetch from database');
        }
        console.log(user);
    })

    //find : this will return pointer. So need to use toArray or similar methods to get value
    db.collection('users').find({name : 'Siddharth'}).toArray((error, users) => {
        console.log(users)
    })

    db.collection('users').find({name : 'Siddharth'}).count((error, users) => {
        console.log(users)
    })

    // Get task by ID
    db.collection('tasks').findOne({ _id : new mongodb.ObjectID("602a9884d856a268f8f6b50a")}, (error, task) => {
        console.log(task);
    })

    // Get complete task
    db.collection('tasks').find({ isCompleted : true}).toArray((error, response) => {
        console.log(response)
    })
})