// Using object destructuring
const {MongoClient, ObjectID} = require('mongodb')

const id = new ObjectID();
console.log(id)
console.log(id.id)
console.log(id.getTimestamp())