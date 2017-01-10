// Funciones de uso comun
var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async'),
    moment = require('moment'),
    numeral = require('numeral');

// ponemos numeral en español
numeral.language('es', cm.numeralSpanish());
numeral.language('es');

// getPrefactura
// obtiene los datos de una única prefactura
module.exports.getPrefactura = function (id, fcallback) {
    // construimos tres llamadas asícronas para 
    // cabecera, lineas y bases
    async.series([
        function (callback) {
            // Obtener la cabecera
            var c = cm.getConnection();
            var sql = "SELECT";
            sql += " pf.prefacturaId, pf.ano, pf.numero, pf.serie, pf.fecha,";
            sql += " pf.empresaId, pf.clienteId, pf.contratoClienteMantenimientoId,";
            sql += " pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal, pf.emisorPoblacion, pf.emisorProvincia,";
            sql += " pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion, pf.receptorProvincia,";
            sql += " pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones";
            sql += " FROM prefacturas AS pf";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId";
            sql += " WHERE pf.prefacturaId = ?";
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                if (data.length == 0) {
                    // no ha encontrado la cabecera
                    return callback(null, null);
                }
                // devuelve un único objeto
                callback(null, data[0]);
            })
        },
        function (callback) {
            // Obtener las líneas
            var c = cm.getConnection();
            var sql = "SELECT pfl.*, t.nombre AS tipoIva, ga.nombre AS grupo";
            sql += " FROM prefacturas_lineas AS pfl";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
            sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
            sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
            sql += " WHERE pfl.prefacturaId = ?";
            sql += " ORDER BY pfl.linea"
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                // devuelve un vector de objectos
                callback(null, obtenerCapitulos(data));
            })
        },
        function (callback) {
            // Obtener las líneas
            var c = cm.getConnection();
            var sql = "SELECT pfb.*, t.nombre AS tipoIva";
            sql += " FROM prefacturas_bases AS pfb";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
            sql += " WHERE pfb.prefacturaId = ?";
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                // devuelve un vector de objectos
                callback(null, data);
            })
        }
    ],
        function (err, datos) {
            // Si se ha producido un error lo devolvemos directamente
            if (err) {
                return fcallback(err);
            }
            // datos es un vector con tres elementos
            // (1) La cabecera o nulo si no ha encontrado la prefactura
            // (2) las lineas de esa prefactura
            // (3) las bases de esa prefactura
            var cabecera = datos[0],
                capitulos = datos[1],
                bases = datos[2],
                prefactura = {};
            // formatear los resultados
            cabecera.fecha = moment(cabecera.fecha).format('DD/MM/YYYY');
            cabecera.total = numeral(cabecera.total).format('0,0.00 $');
            cabecera.totalConIva = numeral(cabecera.totalConIva).format('0,0.00 $');
            for (var i = 0; i < capitulos.length; i++) {
                capitulos[i].lineas.forEach(function (linea) {
                    linea.importe = numeral(linea.importe).format('0,0.00 $');
                    linea.totalLinea = numeral(linea.totalLinea).format('0,0.00 $');
                    linea.cantidad = numeral(linea.cantidad).format('0,0.00');
                });
                capitulos[i].total = numeral(capitulos[i].total).format('0,0.00 $');
            }
            for (var i = 0; i < bases.length; i++) {
                bases[i].base = numeral(bases[i].base).format('0,0.00 $');
                bases[i].cuota = numeral(bases[i].cuota).format('0,0.00 $');
                bases[i].porcentaje = numeral(bases[i].porcentaje).format('0,0.00');
            }
            if (!cabecera) {
                prefactura = null;
            } else {
                prefactura.cabecera = cabecera;
                prefactura.capitulos = capitulos;
                prefactura.bases = bases;
            }
            fcallback(null, prefactura);
        }
    );
}

// getOferta
// obtiene los datos de una única prefactura
module.exports.getOferta = function (id, fcallback) {
    // construimos tres llamadas asícronas para 
    // cabecera, lineas y bases
    async.series([
        function (callback) {
            // Obtener la cabecera
            var c = cm.getConnection();
            var sql = "SELECT";
            sql += " pf.ofertaId, pf.referencia, pf.fechaOferta, pf.observaciones,";
            sql += " pf.empresaId, pf.clienteId,";
            sql += " e.nif AS emisorNif, e.nombre AS emisorNombre, e.direccion AS emisorDireccion, e.codPostal AS emisorCodPostal, e.poblacion AS emisorPoblacion, e.provincia AS emisorProvincia,";
            sql += " c.nif AS receptorNif, c.nombre AS receptorNombre, c.direccion AS receptorDireccion, c.codPostal AS receptorCodPostal, c.poblacion AS receptorPoblacion, c.provincia AS receptorProvincia,";
            sql += " pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones";
            sql += " FROM ofertas AS pf";
            sql += " LEFT JOIN empresas as e ON e.empresaId = pf.empresaId";
            sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId";
            sql += " WHERE pf.ofertaId = ?";
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                if (data.length == 0) {
                    // no ha encontrado la cabecera
                    return callback(null, null);
                }
                // devuelve un único objeto
                callback(null, data[0]);
            })
        },
        function (callback) {
            // Obtener las líneas
            var c = cm.getConnection();
            var sql = "SELECT pfl.*, t.nombre AS tipoIva, ga.nombre AS grupo";
            sql += " FROM ofertas_lineas AS pfl";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
            sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
            sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
            sql += " WHERE pfl.ofertaId = ?";
            sql += " ORDER BY pfl.linea"
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                // devuelve un vector de objectos
                callback(null, obtenerCapitulos(data));
            })
        },
        function (callback) {
            // Obtener las líneas
            var c = cm.getConnection();
            var sql = "SELECT pfb.*, t.nombre AS tipoIva";
            sql += " FROM ofertas_bases AS pfb";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
            sql += " WHERE pfb.ofertaId = ?";
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                // devuelve un vector de objectos
                callback(null, data);
            })
        }
    ],
        function (err, datos) {
            // Si se ha producido un error lo devolvemos directamente
            if (err) {
                return fcallback(err);
            }
            // datos es un vector con tres elementos
            // (1) La cabecera o nulo si no ha encontrado la oferta
            // (2) las lineas de esa oferta
            // (3) las bases de esa oferta
            var cabecera = datos[0],
                capitulos = datos[1],
                bases = datos[2],
                oferta = {};
            // formatear los resultados
            cabecera.fecha = moment(cabecera.fechaOferta).format('DD/MM/YYYY');
            cabecera.total = numeral(cabecera.total).format('0,0.00 $');
            cabecera.totalConIva = numeral(cabecera.totalConIva).format('0,0.00 $');
            for (var i = 0; i < capitulos.length; i++) {
                capitulos[i].lineas.forEach(function (linea) {
                    linea.importe = numeral(linea.totalLinea / linea.cantidad).format('0,0.00 $');
                    linea.totalLinea = numeral(linea.totalLinea).format('0,0.00 $');
                    linea.cantidad = numeral(linea.cantidad).format('0,0.00');
                });
                capitulos[i].total = numeral(capitulos[i].total).format('0,0.00 $');
            }
            for (var i = 0; i < bases.length; i++) {
                bases[i].base = numeral(bases[i].base).format('0,0.00 $');
                bases[i].cuota = numeral(bases[i].cuota).format('0,0.00 $');
                bases[i].porcentaje = numeral(bases[i].porcentaje).format('0,0.00');
            }
            if (!cabecera) {
                oferta = null;
            } else {
                oferta.cabecera = cabecera;
                oferta.capitulos = capitulos;
                oferta.bases = bases;
            }
            fcallback(null, oferta);
        }
    );
}



var obtenerCapitulos = function (lineas) {
    var capitulos = [],
        capitulo = null,
        capituloActual = 0,
        capituloAnterior = 0;
    lineas.forEach(function (linea) {
        capituloActual = Math.floor(linea.linea);
        if (capituloActual != capituloAnterior) {
            if (capitulo != null) capitulos.push(capitulo);
            capitulo = {
                nombre: linea.capituloLinea,
                lineas: [],
                total: 0
            }
            capituloAnterior = capituloActual;
        }
        capitulo.lineas.push(linea);
        capitulo.total += linea.totalLinea;
    });
    // con este tratamiento el último capítulo queda por asignar
    if (capitulo != null) capitulos.push(capitulo);
    return capitulos;
}