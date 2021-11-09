const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const Filter=require('bad-words')
const {generateMessages}=require('./utils/messages.js');
const {generateLocationMessages}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const app=express();
const server=http.createServer(app);//app does this anways its just another way of writing.
const io=socketio(server);
const port=process.env.PORT|| 3000;

const publicDirectoryPath=path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

let chatmessage='hello';

io.on('connection',(socket)=>{

    socket.on('join',({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room})
        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message',generateMessages('Admin','welcome'));
        socket.broadcast.to(user.room).emit('message',generateMessages('Admin',`${user.username} has joined`))
         io.to(user.room).emit('roomData',{
             room:user.room,
             users:getUsersInRoom(user.room)
         })
        callback()
    })
     

     socket.on('sendmessage',(message,callback)=>{
         const filter=new Filter();
        const user=getUser(socket.id)
       
         if(filter.isProfane(message))
         {
              return callback('Profanity is not allowed');
         }

           io.to(user.room).emit('message',generateMessages(user.username,message));
           callback();
     })

     socket.on('send-location',(location,callback)=>{
         const user=getUser(socket.id);
         io.to(user.room).emit('locationmessage',generateLocationMessages(user.username,`https://google.com/maps?q=${location.lat},${location.long}`));
         callback();
     })


     socket.on('disconnect',()=>{
         const user=removeUser(socket.id)
         if(user)
         {
            io.to(user.room).emit('message',generateMessages('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData'),{
                   room:user.room,
                   users:getUsersInRoom(user.room)
                   }
        }
      
     })
})



server.listen(port,()=>{
    console.log(`server is up at ${port}`)
})