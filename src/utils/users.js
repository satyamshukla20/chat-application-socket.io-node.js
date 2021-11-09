const users=[];

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username||!room)
    {
        return {
            error:'Username and room are required!'
        }
    }

    //check for the existing user
    const existingUser=users.find((user)=>{
        return user.room===room&&user.username===username
    }
    )

    //validating the username
    if(existingUser)
    {
        return {
            error:'username is already in use!'
        }
    }

    //storing user
    const user={id,username,room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    
    if(index !== -1)
    {
        return users.splice(index, 1)[0]
    }
    
}

const getUser=(id)=>{
  return users.find((user)=>user.id===id)
    }

const getUsersInRoom=(room)=>{
    return users.filter((user)=>user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
