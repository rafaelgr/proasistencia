var mio;
var msocket;

var ioApi = {
    init: (io) => {
        mio = io; 
        mio.on('connection', (socket)=>{
            msocket = socket;
            console.log('Alquien se ha conectado');
        });   
    },
    sendMessage:(message) => {
        msocket.emit('message', message);
    },
    sendProgress:(numReg, totalReg) => {
        msocket.emit('progress',{
            numReg: numReg,
            totalReg: totalReg
        });
    }
}

module.exports = ioApi;