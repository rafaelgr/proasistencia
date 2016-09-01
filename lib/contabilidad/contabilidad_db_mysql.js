/*
 * contabilidad_db_mysql.js
 * Funciones de utilidad para enlace contable con aricontas
 * en MYSQL
*/

var comun = require('../comun/comun.js'),
    mysql = require('mysql'),
    async = require('async');


var contabilidadApi = {
    // getContas
    // devuelve un vector con los nombres de base de datos de todas
    // las contabilidades asociadas a empresas.
    getContas: function (done) {
        var connection = comun.getConnection();
        var sql = "SELECT DISTINCT contabilidad FROM empresas WHERE NOT contabilidad IS NULL";
        connection.query(sql, function (err, result) {
            comun.closeConnection(connection);
            if (err) return done(err);
            // si no hay ninguna contabilidad lanzamos un error
            if (result.length == 0) return done(new Error('No hay ninguna empresa ligada a la contabilidad'));
            done(null, result);
        });
    },
    getNumDigitos: function (done) {
        async.waterfall([
            // obtiene una contabilidad 
            function (callback) {
                module.exports.getContas(function (err, result) {
                    if (err) return callback(err);
                    // le pasamos la contabilidad a la siguiente
                    callback(null, result[0].contabilidad);
                });
            },
            // de esa contabilidad se obtiene el máximo número de dígitos
            // se suponen que todas son iguales
            function (conta, callback) {
                var connection = comun.getConnectionDb(conta);
                sql = "SELECT * FROM empresa";
                connection.query(sql, function (err, result) {
                    if (err) return callback(err);
                    // suponemos hay dada de alta una empresa
                    var empresa = result[0];
                    var numDigitos = empresa['numdigi' + empresa.numnivel];
                    callback(null, numDigitos);
                });
            }
        ],
            // después de ejecutar la cascada esta es la funcion resumen
            function (err, result) {
                if (err) return done(err);
                done(null, result);
            })
    },
    getInfContable: function (done) {
        async.series([
            function (callback) {
                module.exports.getContas(function (err, result) {
                    if (err) return callback(err);
                    callback(null, result);
                });
            },
            function (callback) {
                module.exports.getNumDigitos(function (err, result) {
                    if (err) return callback(err);
                    callback(null, result);
                });
            }
        ],
            function (err, result) {
                if (err) return done(err);
                done(null, {
                    contas: result[0],
                    numDigitos: result[1]
                })
            })
    }
};



module.exports = contabilidadApi;