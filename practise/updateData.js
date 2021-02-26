const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser : true}, (error, client) => {
    if(error)
    {
        return console.log('Fail to connect to database');
    }
    const db = client.db('task-manager');

    // return promise if no callback is present
    // const updatePromise = db.collection('users').updateOne({ 
    //     _id : new ObjectID("602a947dc479e053046848e1")
    // },
    // {
    //     $set : {
    //         name : 'Andrew',
    //         age : 28
    //     }
    // })

    // updatePromise.then((data => {
    //     console.log(data);
    // }))
    // .catch( err => {
    //     console.log(err)
    // })

    //incrementing age
    // db.collection('users').updateOne(
    //     { 
    //         _id : new ObjectID("602a947dc479e053046848e1") 
    //     },
    //     {
    //         $inc : 
    //         {
    //             age : 2
    //         }
    //     }
    // )
    // .then(data => 
    // {
    //     console.log(data);
    // }).catch(error => 
    // {
    //     console.log(error);
    // })

    // Update many
    db.collection('tasks').updateMany({
        isCompleted : false
    },
    {
        $set : {
            isCompleted : true
        }
    }).then(data => {
        console.log(data)
    }).catch(err => {
        console.log(err);
    })
})