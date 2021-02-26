const express = require('express')
const Users = require("../models/user");
const routers = new express.Router();
const auth = require('../middleware/auth')
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeMail, sendDeletionMail} = require('../emails/accounts')

routers.get('/users/me', auth , async (req, res) => 
{
    try 
    {
        // const user = await Users.find({});
        // auth will perform user authentication and return current user if authentication is successful
        res.status(200).send(req.user);
    }
    catch (error) 
    {
        res.status(500).send(error);
    }
});

routers.get('/users' , async (req, res) => 
{
    try 
    {
        const user = await Users.find({});
        res.status(200).send(user);
    }
    catch (error) 
    {
        res.status(500).send(error);
    }
});

routers.get('/users/:id', async (req, res) => 
{
    try 
    {
        const user = await Users.findById(req.params.id);
        if (!user) 
        {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (error) 
    {
        res.status(500).send(error);
    }
});

routers.patch('/users/me', auth, async (req, res) => 
{
    const updates = Object.keys(req.body);
    const updatesAllowed = ['name', 'email', 'password', 'age'];
    const customValidation = updates.every(update => updatesAllowed.includes(update));

    if (!customValidation) 
    {
        res.status(400).send({ error: 'Invalid update' });
    }

    try 
    {
        console.log('--UPDATE IN PROGRESS---')
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send({ Message : 'User Updated', user : req.user});
    }
    catch (error) 
    {
        res.status(400).send({Message : 'Error in Update', error});
    }
});

// routers.patch('/users/:id', async (req, res) => 
// {
//     const updates = Object.keys(req.body);
//     const updatesAllowed = ['name', 'email', 'password', 'age'];
//     const customValidation = updates.every(update => updatesAllowed.includes(update));

//     if (!customValidation) 
//     {
//         res.status(400).send({ error: 'Invalid update' });
//     }

//     try 
//     {
//         // const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         const user = await User.findById(req.params.id)
//         updates.forEach(update =>  user[update] = req.body[uppdate])
//         await user.save()

//         if (!user) 
//         {
//             return res.status(404).send();
//         }
//         res.send(user);
//     }
//     catch (error) 
//     {
//         res.status(500).send(error);
//     }
// });

routers.post('/users', async (req, res) => 
{
    const user = new Users(req.body);
    try 
    {
        await user.save();
        sendWelcomeMail(user.email, user.name)
        const token = await user.GenerateAuthToken();
        res.status(201).send({user, token});
    }
    catch (error) 
    {
        res.status(400);
        res.send({ Error: error });
    }
});

routers.post('/users/login', async (req, res) => {
    try
    {
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.GenerateAuthToken();
        
        // Using GetPublicProfile() method we will return only public data
        res.send({user, token})
    }
    catch(error)
    {
        res.status(500).send({error})
    }
});

routers.post('/users/logout', auth, async (req, res) => 
{
    try
    {
        const user = req.user;
        user.token = user.token.filter(token => {
            return token.token !== req.token
        })
        await user.save();
        res.status(200).send('User logged out successfully')
    }
    catch(error)
    {
        console.log('Logout Error')
        res.status(500).send(error)
    }
})

routers.post('/users/logoutAll', auth, async (req, res) => 
{
    try
    {
        req.user.token = [];
        await req.user.save();
        res.status(200).send('Logged out of all Sessions successfully')
    }
    catch(error)
    {
        console.log('LogoutAll Error')
        res.status(500).send(error)
    }
})

routers.delete('/users/me', auth, async (req, res) => 
{
    try 
    {
        await req.user.remove();
        sendDeletionMail(req.user.email, req.user.name)
        res.send(req.user);
    }
    catch (error) 
    {
        res.status(500).send(error);
    }
});

// routers.delete('/users/:id', async (req, res) => 
// {
//     try 
//     {
//         const deletedUser = await Users.findByIdAndDelete(req.params.id);
//         if (!deletedUser) 
//         {
//             return res.status(400).send();
//         }
//         res.send(deletedUser);
//     }
//     catch (error) 
//     {
//         res.status(500).send(error);
//     }
// });

const upload = multer({
    // This is destination where uploaded image will be saved
    // Removing dest will return image binary data to request handler
    // 'dest' : 'avatar',
    limits : {
        fileSize: 1000000
    },
    fileFilter(req, file, cb)
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('Invalid file format. Please upload jpg, jpeg or png file'))
        }
        cb(undefined, true);
    }
})

// Upload avatar
// Single takes key whose value is the image selected from postman
routers.post('/users/me/avatar',  auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 300, height : 300}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send('File Uploaded')
}, (error, req, res, next) => {
    // error route allows to catch any unhandled error occured in route handler
    res.status(400).send({error : error.message})
})

// Delete avatar
routers.delete('/users/me/avatar', auth, async (req,res) => {
    try
    {
        if(!req.user.avatar)
        {
            return res.status(404).send('No avatar present.')
        }
        req.user.avatar = undefined;
        req.user.save();
        res.send('Profile avatar removed.');
    }
    catch(error)
    {
        console.log('Error in deleting avatar');
        res.status(500).send('Error in deleting avatar');
    }
})

//Get avatar
routers.get('/users/:id/avatar', async (req, res) => {
    try
    {
        const user = await Users.findById(req.params.id);
        if(!user || !user.avatar)
        {
            return res.status(404).send('No avatar present.')
        }
        res.set('content-type', 'image/jpg');
        res.send(user.avatar);
    }
    catch(error)
    {
        console.log('Error in deleting avatar');
        res.status(500).send('Error in deleting avatar');
    }
})


module.exports = routers;