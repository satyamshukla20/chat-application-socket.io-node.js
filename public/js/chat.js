const socket=io();

const messageForm=document.querySelector('#message-form');
const messageFormInput=messageForm.querySelector('input');
const messageFormButton=messageForm.querySelector('button');
const sendLocationButton=document.querySelector('#send-location')
const messages=document.querySelector('#messages');//<--the position in html where i want to render the template.
const messagelocation=document.querySelector('#messagelocation')

const messageTemplates=document.querySelector('#message-template').innerHTML//<--this is the template to render.
const locationmessageTemplates=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate =document.querySelector('#sidebar-template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoscroll=()=>{
    const newMessage=messages.lastElementChild
    const newMessageStyles=getComputedStyle(newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=newMessage.offsetHeight+newMessageMargin
    const visibleHeight=messages.offsetHeight
    const containerHeight=messages.scrollHeight
    const scrollOffset=messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset)
    {
        messages.scrollTop=messages.scrollHeight
    }
   
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplates,{
        username:message.username,
        messageplace:message.text,
        createdAt:moment(message.createdAt).format('hh:mm a')
    })
    messages.insertAdjacentHTML("beforeend",html)
     autoscroll()
})
socket.on('locationmessage',(message)=>{
      console.log(message);
      const html2=Mustache.render(locationmessageTemplates,{
          username:message.username,
          locationplace:message.url,
          createdAt:moment(message.createdAt).format('hh:mm a')
      })
      messages.insertAdjacentHTML("beforeend",html2)
      autoscroll()
  })

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html

})

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    messageFormButton.setAttribute('disabled','disabled');
    const message=e.target.elements.message.value;

    
    socket.emit('sendmessage',message,(error)=>{
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value='';
        messageFormInput.focus();
        if(error)
        {
            return console.log(error)
        }
        console.log('message delivered');
    });
})


sendLocationButton.addEventListener('click',()=>{
  if(!navigator.geolocation)
  {
      return alert('you browser does not support geolocation');
  }

  sendLocationButton.setAttribute('disabled','disabled');



  navigator.geolocation.getCurrentPosition((position)=>{
     

     let lat=position.coords.latitude;
     let long=position.coords.longitude;

     socket.emit('send-location',{lat,long},()=>{
         sendLocationButton.removeAttribute('disabled')
         console.log('location shared');
     })
  })

  
})

socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})

