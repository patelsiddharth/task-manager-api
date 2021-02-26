const express = require('express')
const Tasks = require('../models/tasks')
const routers = new express.Router();
const auth = require('../middleware/auth')

// Get All Task - No Auth
routers.get('/tasks/All', async (req, res) => 
{
    try
    {
        const tasks = await Tasks.find({})
        res.send(tasks)
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})

// Get Current User Tasks
// /tasks                   => return all task
// /tasks?isCompleted=false => return all incomplete task
// /tasks?limit=2            =>  return first 2 task
// /tasks?skip=2             =>  skips first 2 task and return rest all the tasks
// /tasks?limit=3&skip=2     =>  skips first 2 task and return next 3 tasks
// /tasks?sortBy=createdAt:desc => sort tasks by createdAt descending
routers.get('/tasks', auth, async (req, res) => 
{
    const match = {}
    if(req.query.isCompleted)
    {
        match.isCompleted = req.query.isCompleted === 'true'
    }

    const sort = {}
    if(req.query.sortBy)
    {
        const parameter = req.query.sortBy.split(':');
        sort[parameter[0]] = parameter[1] === 'asc' ? 1 : -1;
    }
    
    try
    {
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(req.user.tasks)
    }
    catch(err)
    {
        console.log('Error in fetching tasks')
        res.status(500).send('Error in fetching tasks')
    }
})

// Get Task by ID
routers.get('/tasks/:id', auth, async (req, res) => 
{
    const _id = req.params.id;
    try
    {
        const task = await Tasks.findOne({_id, owner : req.user._id})
        if(!task)
        {
            return res.status(404).send('Task Not Found')
        }
        res.send(task)
    }
    catch(err)
    {
        console.log('Error in fetching user\'s task')
        res.status(500).send(err)
    }
})

routers.post('/tasks', auth, async (req, res) => 
{
    const tasks = new Tasks({
        ...req.body,
        owner : req.user._id
    })

    try
    {
        await tasks.save()
        res.status(201).send(tasks);
    }
    catch( error )
    {
        res.status(400).send(error)
    }
})

routers.patch('/tasks/:id', auth, async (req, res) => {
    const keysAllowed = ['description', 'isCompleted']
    const requestKeys = Object.keys(req.body)
    const isAllowed = requestKeys.every( key => keysAllowed.includes(key))
    if(!isAllowed)
    {
        res.status(500).send({error : 'Invalid Update'})
    }
    try
    {  
        const task = await Tasks.findOne({_id : req.params.id, owner : req.user._id});  
        if(!task)
        {
            return res.status(404).send('Task not found')
        }
        requestKeys.forEach( update => task[update] = req.body[update])
        await task.save();
        res.send({Message : 'Task Updated' ,task});
    }
    catch(error)
    {
        res.status(500).send(error);
    }
})

routers.delete('/tasks/:id', auth, async (req,res) => 
{
    try
    {
        const deletedTask = await Tasks.findOneAndDelete({_id : req.params.id, owner : req.user._id})
        if(!deletedTask)
        {
            return res.status(404).send({error : "Not Found"})
        }
        res.send(deletedTask)
    }
    catch(error)
    {
        res.status(500).send(error);
    }
})

module.exports = routers;