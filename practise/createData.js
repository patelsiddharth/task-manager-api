const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser : true} , (error, client) => {
    if(error)
    {
        return console.log('Fail to connect to database');
    }
    console.log('Connected Successfully');

    const db = client.db(databaseName);
    // db.collection('users').insertOne({
    //     name : 'Siddharth',
    //     age : 24
    // }, (error, result) => {
    //     if(error)
    //     {
    //         return console.log('Unable to insert user');
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('users').insertMany([
    //     {
    //         name : 'John',
    //         age : 30
    //     }, 
    //     {
    //         name : 'Mark',
    //         age : 28
    //     }
    // ], (error, result) => 
    // {
    //     if(error)
    //     {
    //         return console.log('Unable to insert documents');
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description : 'Had lunch',
    //         isCompleted : true
    //     },
    //     {
    //         description : 'Completed Work',
    //         isCompleted : true
    //     },
    //     {
    //         description : 'Had dinner',
    //         isCompleted : false
    //     }
    // ], (error, result) => {
    //     if(error)
    //     {
    //         return console.log('Fail to perform insert operation');
    //     }
    //     console.log(result.ops);
    // })
})