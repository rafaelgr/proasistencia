
const mysql2 = require('mysql2/promise') ;


// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}
// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function (err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function (err) {
        if (err) callback(err);
    });
}

const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}

// comprobarArticulo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPropuesta(propuesta) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof articulo;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && propuesta.hasOwnProperty("propuestaId"));
    comprobado = (comprobado && propuesta.hasOwnProperty("proveedorId"));
    comprobado = (comprobado && propuesta.hasOwnProperty("tipoProveedorId"));
    return comprobado;
}

// getArticulo
// busca  el articulo con id pasado
module.exports.getPropuestasSubcontrata = async (id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT p.*, e.titulo"; 
            sql += " FROM propuestas AS p"
            sql += " LEFT JOIN subcontrata_propuestas AS sp ON sp.propuestaId = p.propuestaId";
            sql += " LEFT JOIN ofertas as o On o.ofertaId = sp.subcontrataId"
            sql += " LEFT JOIN expedientes as e ON e.expedienteId =  o.expedienteId"
            sql += " WHERE sp.subcontrataId = ?";
            sql = mysql2.format(sql, id);
            let [result] = await connection.query(sql);
            await connection.end();
            resolve(result);

        } catch(e) {
            if(connection) {
                if (!connection.connection._closing) {
                    await connection.end();
                } 
            }
            reject(e);
        }
    });
}
