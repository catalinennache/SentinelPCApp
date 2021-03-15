
var STATES = {"UNINITED":0,"INITED":1,"WATCHING":2,"AWAITING":3,"DETECTED":4,"SLEEPING":4,"STOPPED":4}
var STATES_MAP = {"UNINITED":["INITED"],
                  "INITED":["WORKING"],
                  "WORKING":["DETECTED","SLEEPING","AWAITING"]
                }
Object.freeze(STATES);

class ScreenTool{
    constructor(){
       
    }

    killStream(){
        if(this.process){
            this.spawn("taskkill", ["/pid", this.process.pid, '/f', '/t']);
            this.process = undefined;
            this.stream = undefined;
            console.log("process killed")
        }
    }

    pipeToScreen(tp){
        this.getScreenStream().pipe(tp)
    }

    startStreaming(){
        if(!this.stream){
            var ffmpeg = this.ffmpeg
            var spawn = this.spawn
            if(!ffmpeg){
                ffmpeg = require("ffmpeg-static");
                this.ffmpeg = ffmpeg;
            }
            if(!spawn){
                var { spawn } = require("child_process");
                this.spawn = spawn;
            }
           
            this.process = spawn(
                ffmpeg,
            ["-probesize", "1M", "-f", "gdigrab", "-framerate", "30", "-i", "desktop", "-f", "webm", "-"],
            { stdio: "pipe" }
            );
            this.stream = this.process.stdout;
        }
        return this.stream
    }

}


module.exports = (function(){
    const props = {
        mouseIsMoving:false,
        keyboardTyping:false,
    }
    const screenTool = new ScreenTool()
    const timeoutRegistry = {}
    const iohook = require('iohook')
    const peerConnector = require('./servercon')
    let current_state = STATES.UNINITED
    let token;


    init = (cred) => { token = peerConnector.init("http://localhost:3000",cred);
                       current_state = STATES.INITED
                     }

    start = () =>{
        if(current_state != STATES.INITED){
            throw new Error("Not inited!");
        }

        iohook.on('mousemove', event => {
            if(!props.mouseIsMoving){}
                //peerConnector.sendEvent("mouseIsMoving",event);
            props.mouseIsMoving = true
            clearTimeout(timeoutRegistry['mousemove']);
            timeoutRegistry['mousemove'] = setTimeout(()=>{ props.mouseIsMoving = false;// peerConnector.sendEvent("mouseStopped",{}) 
            },300);
            
        });

        iohook.on('keydown', event =>{
            if(!props.keyboardTyping){}
                //peerConnector.sendEvent("keyboardTyping",event);
            props.keyboardTyping = true
            clearTimeout(timeoutRegistry['keyboardTyping']);
            timeoutRegistry['keyboardTyping'] = setTimeout(()=>{ props.keyboardTyping = false; //peerConnector.sendEvent("keyboardStopped",{})
             },500); 

        })
        iohook.start()

        peerConnector.on("streamRequest",()=>{ peerConnector.shareScreen(screenTool.startStreaming()) })
        peerConnector.on("streamRequestEND",()=>{screenTool.killStream()})

    }

    SS = ()=>{
       
        // ...
        stream.stopCapture();
        svConnector.shareScreen(screenTool.getScreenStream())
    }

    empty = ()=>{}
    return {init:init,
            fetchConfig:empty,
            start:start,
            SS:SS}
})()