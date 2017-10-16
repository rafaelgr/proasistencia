var mio;
var msocket;

var ioApi = {
    init: (io) => {
        mio = io; 
        mio.on('connection', (socket)=>{
            msocket = socket;
        });   
    },
    sendMessage:(message) => {
        msocket.emit('message', message);
    },
    sendProgress:(titleReg, numReg, totalReg) => {
        msocket.emit('progress',{
            titleReg: titleReg,
            numReg: numReg,
            totalReg: totalReg
        });
    }
}

module.exports = ioApi;