// contratosClientesMantenimiento_db_mysql
// Funciones de uso comun
var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async'),
    moment = require('moment');

// necesitamos consultar empresas / clientes / artículos
var clientesDb = require('../clientes/clientes_db_mysql'),
    empresasDb = require('../empresas/empresas_db_mysql'),
    articulosDb = require('../articulos/articulos_db_mysql'),
    prefacturasDb = require('../prefacturas/prefacturas_db_mysql')


// comprobarContratoClienteMantenimiento
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarContratoClienteMantenimiento(contratoClienteMantenimiento) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof contratoClienteMantenimiento;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("contratoClienteMantenimientoId"));
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("empresaId"));
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("clienteId"));
    return comprobado;
}


// getContratosClientesMantenimiento
// lee todos los registros de la tabla contratosClientesMantenimiento y
// los devuelve como una lista de objetos
module.exports.getContratosClientesMantenimiento = function (callback) {
    var connection = cm.getConnection();
    var contratosClientesMantenimiento = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS cliente, m.nombre as mantenedor, a.nombre as articulo, c.proId as codCliente, m.proId as codMantenedor, t.nombre as tipo";
    sql += " FROM contrato_cliente_mantenimiento AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.mantenedorId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = cc.articuloId";
    sql += " LEFT JOIN tipos_mantenimiento AS t ON t.tipoMantenimientoId = cc.tipoMantenimientoId";
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        contratosClientesMantenimiento = result;
        callback(null, contratosClientesMantenimiento);
    });
}


// getContratoClienteMantenimiento
// busca  el contrato comercial con id pasado
module.exports.getContratoClienteMantenimiento = function (id, callback) {
    var connection = cm.getConnection();
    var contratosClientesMantenimiento = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS cliente, m.nombre AS mantenedor, a.nombre as articulo, c.proId as codCliente, m.proId as codMantenedor, t.nombre AS tipo";
    sql += " FROM contrato_cliente_mantenimiento AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.mantenedorId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = cc.articuloId";
    sql += " LEFT JOIN tipos_mantenimiento AS t ON t.tipoMantenimientoId = cc.tipoMantenimientoId";
    sql += " WHERE cc.contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

module.exports.getContratoClienteMantenimientoEmpresaCliente = function(empresaId, clienteId, callback){
        var connection = cm.getConnection();
    var contratosClientesMantenimiento = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS cliente, m.nombre AS mantenedor, a.nombre as articulo, c.proId as codCliente, m.proId as codMantenedor, t.nombre AS tipo";
    sql += " FROM contrato_cliente_mantenimiento AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.mantenedorId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = cc.articuloId";
    sql += " LEFT JOIN tipos_mantenimiento AS t ON t.tipoMantenimientoId = cc.tipoMantenimientoId";
    sql += " WHERE cc.empresaId = ? AND cc.clienteId = ?";
    sql = mysql.format(sql, [empresaId, clienteId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// postContratoClienteMantenimiento
// crear en la base de datos el contrato comercial pasado
module.exports.postContratoClienteMantenimiento = function (contratoClienteMantenimiento, callback) {
    if (!comprobarContratoClienteMantenimiento(contratoClienteMantenimiento)) {
        var err = new Error("El contrato pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = cm.getConnection();
    contratoClienteMantenimiento.contratoClienteMantenimientoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contrato_cliente_mantenimiento SET ?";
    sql = mysql.format(sql, contratoClienteMantenimiento);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        contratoClienteMantenimiento.contratoClienteMantenimientoId = result.insertId;
        callback(null, contratoClienteMantenimiento);
    });
}

// putContratoClienteMantenimiento
// Modifica el contrato comercial según los datos del objeto pasao
module.exports.putContratoClienteMantenimiento = function (id, contratoClienteMantenimiento, callback) {
    if (!comprobarContratoClienteMantenimiento(contratoClienteMantenimiento)) {
        var err = new Error("El contato pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != contratoClienteMantenimiento.contratoClienteMantenimientoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE contrato_cliente_mantenimiento SET ? WHERE contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, [contratoClienteMantenimiento, contratoClienteMantenimiento.contratoClienteMantenimientoId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, contratoClienteMantenimiento);
    });
}

// deleteContratoClienteMantenimiento
// Elimina el contrato comercial con el id pasado
module.exports.deleteContratoClienteMantenimiento = function (id, contratoClienteMantenimiento, callback) {
    var connection = cm.getConnection();
    // primero borramos las líneas 
    sql = "DELETE from contrato_cliente_mantenimiento_comisionistas WHERE contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        if (err) {
            return callback(err);
        }
        // ahora borramos la cabecera
        sql = "DELETE from contrato_cliente_mantenimiento WHERE contratoClienteMantenimientoId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            cm.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
}

/*-------------------------------------------------------------------
    Manejo de la generación de las prefacturas de 
    los cmantenimientos
---------------------------------------------------------------------*/

// postGenerarPrefacturas
// Generar las prefacturas asociadas a un contrato.
module.exports.postGenerarPrefacturas = function (lista, articuloId, contratoClienteMantenimientoId, callback) {
    var listaPrefacturas = []; // nueva lista a devolver    
    // la lista lleva prefacturas previas
    async.eachSeries(lista, function (pf, callback2) {
        fnCreaUnaPrefactura(pf, articuloId, contratoClienteMantenimientoId, function (err, prefactura) {
            if (err) return callback2(err);
            listaPrefacturas.push(prefactura);
            callback2();
        })
    }, function (err) {
        if (err) return callback(err);
        callback(null, listaPrefacturas);
    })
}

var fnCreaUnaPrefactura = function (prefactura, articuloId, contratoClienteMantenimientoId, callback) {
    var pf = prefactura;
    var importe = pf.importe;
    var importeCliente = pf.importeCliente;
    pf.totalAlCliente = importeCliente;
    var importeCoste = pf.importeCoste;
    var porcentajeBeneficio = 0;
    var porcentajeAgente = 0;
    delete pf.importe;
    delete pf.importeCliente;
    delete pf.importeCoste;
    pf.contratoClienteMantenimientoId = contratoClienteMantenimientoId;
    async.series({
        pfCabecera: function (cbk) {
            // 
            pf.ano = moment(pf.fecha, 'DD/MM/YYYY').year();
            pf.fecha = moment(pf.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            var c = cm.getConnection();
            pf.prefacturaId = 0; // fuerza el uso de autoincremento
            // PROAS-158
            // Hay que buscar la forma de pago desde el contrato de mantenimiento.
            module.exports.getContratoClienteMantenimiento(contratoClienteMantenimientoId, function (err, res) {
                if (err) return cbk(err);
                var contrato = res;
                // buscamos la empresa
                empresasDb.getEmpresa(pf.empresaId, function (err, result) {
                    if (err) return cbk(err);
                    if (!result) {
                        return cbk(new Error('No se ha encontrado la empresa: ' + pf.empresaId));
                    }
                    // cargamos los datos de cabecera emisor
                    var e = result;
                    pf.empresaId = e.empresaId;
                    pf.emisorNombre = e.nombre;
                    pf.emisorNif = e.nif;
                    pf.emisorDireccion = e.direccion;
                    pf.emisorCodPostal = e.codPostal;
                    pf.emisorPoblacion = e.poblacion;
                    pf.emisorProvincia = e.provincia;
                    porcentajeBeneficio = e.margen;
                    porcentajeAgente = e.manPorComer;
                    var clienteId = pf.clienteId;
                    if (pf.mantenedorId) clienteId = pf.mantenedorId;
                    clientesDb.getCliente(clienteId, function (err, result) {
                        if (err) return cbk(err);
                        if (!result) {
                            return cbk(new Error('No se ha encontrado el cliente: ' + pf.clienteId));
                        }
                        // cargamos los datos del receptor
                        var c = result;
                        pf.clienteId = c.clienteId;
                        pf.receptorNombre = c.nombreComercial;
                        if (!c.nombreComercial || c.nombreComercial == '')
                            pf.receptorNombre = c.nombre;
                        pf.receptorNif = c.nif;
                        if (c.direccion && c.direccion != '') {
                            pf.receptorDireccion = c.direccion;
                            pf.receptorCodPostal = c.codPostal;
                            pf.receptorPoblacion = c.poblacion;
                            pf.receptorProvincia = c.provincia;
                        } else {
                            pf.receptorDireccion = c.direccion2;
                            pf.receptorCodPostal = c.codPostal2;
                            pf.receptorPoblacion = c.poblacion2;
                            pf.receptorProvincia = c.provincia2;
                        }
                        if (contrato.formaPagoId) {
                            pf.formaPagoId = contrato.formaPagoId;
                        } else {
                            pf.formaPagoId = c.formaPagoId;
                        }
                        pf.totalAlCliente = importeCliente;
                        pf.coste = importeCoste;
                        // damos de alta la cabecera
                        prefacturasDb.postPrefactura(pf, function (err, result) {
                            if (err) return cbk(err);
                            cbk(null, pf);
                        })
                    })
                })
            })

        },
        pfLineas: function (cbk) {
            // Crear las líneas, en este caso sólo habrá una
            // Lo primero es buscar el artículo asociado
            articulosDb.getArticulo(articuloId, function (err, result) {
                if (err) return cbk(err);
                if (!result) return cbk(new Error('Artículo no encontrado'));
                // montamos la línea de prefactura
                var pfl = {
                    prefacturaLineaId: 0,
                    linea: 1,
                    prefacturaId: pf.prefacturaId,
                    articuloId: result.articuloId,
                    tipoIvaId: result.tipoIvaId,
                    porcentaje: result.porcentaje,
                    descripcion: result.nombre,
                    cantidad: 1,
                    importe: importe,
                    totalLinea: importe,
                    coste: importeCoste,
                    porcentajeBeneficio: porcentajeBeneficio,
                    porcentajeAgente: porcentajeAgente
                };
                // ya hora damos de alta la línea propiamente dicha
                // implícitamente se crean las bases
                prefacturasDb.postPrefacturaLinea(pfl, function (err, result) {
                    if (err) return cbk(err);
                    cbk();
                })
            });
        }
    }, function (err, result) {
        if (err) return callback(err);
        callback(null);
    });
};

