const generateMessages=(username,text)=>{
    return {
        username,
        text:text,
        createdAt:new Date().getTime()
    }
}

const generateLocationMessages=(username,url)=>{
   return {
       username,
       url:url,
       createdAt:new Date().getTime()
       
   }
}

module.exports={
    generateMessages,
    generateLocationMessages
}