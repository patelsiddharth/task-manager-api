const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tasks = require('./tasks')
const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },
        email : {
            // type of value email accepts
            type : String,
            unique : true,
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
        },
        avatar : {
            type : Buffer
        },
        token : [{
            token : {
                type : String,
                required : true
            }
        }]
    },
    {
        timestamps : true
    }
)

userSchema.virtual('tasks', {
    ref : 'tasks',
    localField : '_id',
    foreignField : 'owner'
})

// method on user instance
userSchema.methods.toJSON = function()
{
    const userObject = this.toObject();

    // delete private properties
    delete userObject.password;
    delete userObject.token;
    delete userObject.avatar;

    console.log(userObject)
    // return updated user
    return userObject;
}

userSchema.methods.GenerateAuthToken = async function ()
{
    const user = this;
    const token = await jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET , { expiresIn : '7 days'});
    user.token.push({token})
    await user.save()
    return token
}

// Defining custom methods. Only possible when schema was created before creating model
userSchema.statics.findByCredentials = async function (email, password)
{
    const user = await User.findOne({email});
    if(!user)
    {
        console.log('User not found. Unable to login');
        throw new Error('User not found. Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
    {
        console.log('Incorrect password. Please try again');
        throw new Error('Incorrect password. Please try again');
    }

    return user;
}

// Mongoose Middleware : This will run before an event
// 1st parameter is method name for which below code will execute before that method is executed
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next(); // this will require to ensure save method(1st parameter) is executed
})

userSchema.pre('remove', async function(next)
{
    // delete all task if user is deleted    
    await tasks.deleteMany({owner : this._id})
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;