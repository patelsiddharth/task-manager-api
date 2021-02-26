const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-API', {
    useNewUrlParser : true,
    useCreateIndex : true
})

const User = mongoose.model('User', {
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        // type of value email accepts
        type : String,
        // ensure this field is required
        required : true,
        // trims leading and trailing spaces
        trim : true,
        // Converts value of the field to lowercase
        lowercase : true,
        // This value will be used if no value is provided for this field
        default : 'defaultEmail@xyc.com',
        // adding custom validation on this field
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email address entered')
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 7,
        trim : true,
        validate(value)
        {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error(`Password cannot contain "password" in its text`)
            }
        }
    },
    age : {
        type : Number,
        default : 0,
        validate(value)
        {
            if(value < 0)
            {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

 const me = new User({
     name : "Drew",
     email : 'Drew@new.io',
     password : '      Password   '
 })

//  me.save().then( () => {
//     console.log(me)
//  }).catch(error => {
//      console.log(`Error : ${error}`);
//  })

 const tasks = mongoose.model('tasks', {
     description : {
         type : String,
         required : true,
         trim : true
     },
     isCompleted : {
         type : Boolean,
         default : false
     }
 });

 const task = new tasks({
     description : 'Complete homeword'
 })

task.save().then( () => {
    console.log(task);
}).catch(err => {
    console.log(err);
})