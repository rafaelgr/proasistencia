var partesDb = require("../../partes/partes_db_mysql");
var mensajesDb = require("../../mensajes/mensajes_db_mysql");
var new_date;
var timerUpdate;
var parteId

var cuentaAtrasApi =  {
    init(mensaje) {
        var horas = 0;
        partesDb.getParte(mensaje.parteId, function(err, parte) {
            if (err) {
                console.log("SEND (ERR): ", err);
            } else {
                horas = 3
                if(mensaje.urgente) horas = 1
                // obtenemos la fecha actual
                var date = new Date()
                new_date = new Date(date);
    
                new_date.setDate(date.getDate() + 0);
                new_date.setHours(date.getHours()  + horas);
        
                //parametros mas cortos para pruebas
                //new_date.setMinutes(date.getMinutes() + 1);
        
                countdown(new_date, parte); 
            }
        });
    },

    setStop() {
        clearInterval(timerUpdate);
        //alert('El proveedor no ha aceptado el servicio '+ element);
    }
}

const getTime = dateTo => {
    let now = new Date(),
        time = (new Date(dateTo) - now + 1000) / 1000,
        seconds = ('0' + Math.floor(time % 60)).slice(-2),
        minutes = ('0' + Math.floor(time / 60 % 60)).slice(-2),
        hours = ('0' + Math.floor(time / 3600 % 24)).slice(-2),
        days = Math.floor(time / (3600 * 24));
 
    return {
        seconds,
        minutes,
        hours,
        days,
        time
    }
};
 
const countdown = (dateTo, parte) => {
   
    timerUpdate = setInterval( () => {
        let currenTime = getTime(dateTo);
        console.log('Horas:' + currenTime.hours + ' Minutos:' + currenTime.minutes + ' Segundos:' +currenTime.seconds);
        
        if (currenTime.time <= 1) {
            clearInterval(timerUpdate);
            if(parte.confirmado == 0) {
                var datos = {
                    proveedorNombre: parte.nombreproveedor,
                    numParte: parte.numParte,
                    opcion: null
                }
                mensajesDb.postSendMensajeWebPush( datos, function(err, mensaje) {
                    if (err) {
                        console.log("SEND (ERR): ", err);
                        //res.status(500).send(err.message);
                    } 
                });
            }
        }
 
    }, 1000);
    return timerUpdate;
};

module.exports = cuentaAtrasApi;



