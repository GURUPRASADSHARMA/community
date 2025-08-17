
import io from 'socket.io-client'

let socket;


export const connectSocket = (token)=>{
if(!socket){
    socket = io("http://localhost:8999",{
              auth: { token },
      transports: ["websocket"], 
    })
}
return socket
}

export const disconnectSocket = ()=>{
    if(socket){
        socket.disconnect();
        socket = null;
    }
}

export const getSocket  = ()=>socket