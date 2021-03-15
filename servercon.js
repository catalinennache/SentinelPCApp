


// var path = require('path');
// var socket = io.connect('http://localhost:3000', {reconnect: true});

// // Add a connect listener
// socket.on('connect', function (sck) {
//     console.log('Connected!',arguments);
//     setTimeout(()=>{socket.emit("message",{token:"ads"});console.log("done")},1000);
// });

// socket.on('connection', function(socket) {
//   ss(socket).on('profile-image', function(stream, data) {
//     var filename = path.basename(data.name);
//     stream.pipe(fs.createWriteStream(filename));
//   });
// });





module.exports = (
   function(){
    var token;
    var callbackManager = 
    {registry:{},
      setCallback:function(event,clb){
                    if(!this.registry[event])
                        this.registry[event]=[]
                    this.registry[event].push(clb);
      },
      getCallbacks:function(event){return  this.registry[event] = this.registry[event]?this.registry[event]:[];
      },
      trigger:function(event,data){ 
        this.getCallbacks(event).forEach(callback => {
          setTimeout(()=>{callback(event,data);},1);
      })}
    }; 
    var io = require('socket.io-client')
    var ss = require('socket.io-stream');
    var socket = undefined;

    

    init = (url,cred) => {socket = io.connect(url); socket.emit("appinit",{token:cred}); token = cred;
    
  
    socket.on('connect', function (sck) {
      console.log("inited with ",socket.id)
      socket.on("message",(data)=>{ console.log("message rcvd");callbackManager.trigger(data.event, data);});

    })
    }
    sendEvent = (event,data) =>{data.token = token;data.event = event;  socket.emit("message",data);   }
    on = (peerEvent, callback)=>{callbackManager.setCallback(peerEvent,callback)}
    
    shareScreen = (screenStream)=>{
      var stream = ss.createStream();
      screenStream.pipe(stream);
      ss(socket).emit("screen-broadcast",stream);
      sendEvent("streamRequestACK",{});
      console.log("screen shared")
     }
    return {
        init:init,
        sendEvent:sendEvent,
        shareScreen:shareScreen,
        on:on
    }
})()