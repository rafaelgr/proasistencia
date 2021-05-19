var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");

//  leer la configurción de MySQL

var sql = "";



// getConnection 
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

module.exports.getCobrosFactura = function (id, done) {
    fnCobrosDeUnaFactura(id, null, null, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

module.exports.getCobrosCliente = function (id, done) {
    fnCobrosDeUnCliente(id, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

module.exports.getCobrosContrato = function (id, done) {
    fnCobrosDeUnContrato(id, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

module.exports.isFacturaCobrada = function (id, dFecha, hFecha, done) {
    fnFacturaCobradaSegura(id, dFecha, hFecha, function (err, cobrada) {
        if (err) return done(err);
        done(null, cobrada);
    });
}


// zona de funciones auxiliares

var fnCobrosDeUnCliente = function (id, done) {
    var cobros = [];
    var con = getConnection();
    sql = "SELECT * FROM facturas WHERE clienteId = ?";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        async.eachSeries(rows, function (f, callback) {
            fnCobrosDeUnaFactura(f.facturaId, null, null, function (err, cobs) {
                if (err) return callback(err);
                cobs.forEach(function (c) {
                    cobros.push(c);
                });
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            var cobrosOrdenados = fnOrdenarCobrosPorFechaVencimiento(cobros);
            done(null, cobrosOrdenados);
        });
    })
};


var fnCobrosDeUnContrato = function (id, done) {
    var cobros = [];
    var con = getConnection();
    sql = "SELECT * FROM facturas WHERE contratoId = ?";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        async.eachSeries(rows, function (f, callback) {
            fnCobrosDeUnaFactura(f.facturaId, null, null, function (err, cobs) {
                if (err) return callback(err);
                cobs.forEach(function (c) {
                    cobros.push(c);
                });
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            var cobrosOrdenados = fnOrdenarCobrosPorFechaVencimiento(cobros);
            done(null, cobrosOrdenados);
        });
    })
};

var fnCobrosDeUnaFactura = function (id, dFecha, hFecha, done) {
    var cobros = null;
    fnFacturaConta(id, function (err, rows) {
        if (err) return done(err);
        if (rows.length == 0) return done(null, cobros);
        var f = rows[0];
        var numserie = f.serie;
        var numfactu = f.numfac;
        var fecfactu = f.fecha;
        var conta = f.contabilidad;
        var facturaId = f.facturaId;
        fnCobroEnConta(conta, numserie, numfactu, fecfactu, facturaId,function (err, rows) {
            if (err) return done(err);
            cobros = fnCobroSeguro(rows, dFecha, hFecha);
            done(null, cobros, f);
        });
    });
};


// fnFacturaConta
// devuelve la información sobre la factura y la contabilidad
// en la que debe estar su cobro según la empresa emisora
var fnFacturaConta = function (facturaId, done) {
    var con = getConnection();
    sql = "SELECT f.facturaId, ano, numero, CONCAT(ano, LPAD(f.numero,6, '0')) AS numfac, serie, fecha, f.empresaId, e.nombre, e.contabilidad, f.total, f.totalConIva";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"
    sql += " WHERE f.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        done(null, rows);
    })
}

// fnCobroEnConta
// Obtiene los cobros de la factura pasada en la contabilidad indicada
var fnCobroEnConta = function (conta, numserie, numfactu, fecfactu, facturaId, done) {
    numfactu = numfactu.toString();
    var nums = [];
    //comprobamos si hay anticipos
    var conection = getConnection();
    var sql = "SELECT CONCAT(ano,LPAD(numero, 6, 0)) AS numfactu";
    sql += " FROM factura_antcliens AS fa";
    sql += " LEFT JOIN antClien AS a ON a.antclienId = fa.antclienId";
    sql += " WHERE fa.facturaId =  ?";
    sql = mysql.format(sql, facturaId);
    conection.query(sql, function (err, rows) {
        conection.end();
        if (err) return done(err);
        if(rows.length > 0) {
            for(var i = 0; i < rows.length; i++) {
                var n = rows[i].numfactu.toString();
                nums.push(n);
            }
        }
        var con = getConnection();
        sql = "SELECT c.*, fp.nomforpa ";
        sql += " FROM " + conta + ".cobros AS c";
        sql += " LEFT JOIN " + conta + ".formapago AS fp ON fp.codforpa = c.codforpa";
        sql += " WHERE ";
        sql += "(numserie =  ?";
        sql += " AND numfactu = ?)";
        sql = mysql.format(sql, [numserie, numfactu]);
        if(nums.length > 0) {
            sql += " OR";
            sql += " (numserie = 'ANT'";
            sql += " AND numfactu IN (?))";
            sql = mysql.format(sql, [nums]);
        }
        sql += " ORDER BY c.fecvenci DESC";
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    });
}

var fnCobroSeguro = function (cobros, dFecha, hFecha,) {
    var c2 = [];
    cobros.forEach(function (c) {
        c.seguro = false;
        if (c.fecultco) {
            var df = moment().diff(c.fecultco, 'days');
            if (df > 65) {
                c.seguro = true;
            }
        }
        c2.push(c);
    });
    return c2;
    /* var c2 = [];
    var fec = new Date(hFecha);
    fec.setDate(fec.getDate() + 90)
    cobros.forEach(function (c) {
        c.seguro = false;
        if (c.fecultco) {
            var df = moment(fec).diff(c.fecultco, 'days');
            if (df > 65) {
                c.seguro = true;
            }
        }
        c2.push(c);
    });
    return c2; */
};


// fnOrdenarCobrosPorFechaVencimiento
var fnOrdenarCobrosPorFechaVencimiento = function (cobros) {
    if (!cobros || cobros.length == 0) return cobros;
    cobros.sort(function (a, b) { return (a.fecvenci < b.fecvenci) ? 1 : ((b.fecvenci < a.fecvenci) ? -1 : 0); });
    return cobros;
};

var fnFacturaCobradaSegura = function (facturaId, dFecha, hFecha, done) {
    fnCobrosDeUnaFactura(facturaId,  dFecha, hFecha, function (err, cobros, factura) {
        if (err) return done(err);
        var facturado = factura.totalConIva;
        var cobrado = 0;
        var seguro = true;
        if(cobros.length == 0) { 
            seguro = false;
        } else {
            for(var i= 0; i < cobros.length; i++) {
                var gastos = 0
                if(cobros[i].seguro == false) {
                    seguro = false;
                    break;
                }
                /* if(!cobros[i].impcobro) cobros[i].impcobro = 0;
                if(cobros[i].gastos) gastos = cobros[i].gastos;
                cobrado += cobros[i].impcobro - gastos; */
            }
        }
       /*  cobrado = cobrado.toFixed(2);
        cobrado = parseFloat(cobrado);

        var cobradoRedMas = cobrado+0.01;
        cobradoRedMas = cobradoRedMas.toFixed(2);
        cobradoRedMas = parseFloat(cobradoRedMas);

        var cobradoRedMenos = cobrado-0.01;
        cobradoRedMenos = cobradoRedMenos.toFixed(2);
        cobradoRedMenos = parseFloat(cobradoRedMenos); */
        if(!seguro) {
            done(null, false);
        } else {
            done(null, true);
        }


      /*   else if (facturado == cobrado || facturado == cobradoRedMas ||  facturado == cobradoRedMenos) {
            done(null, true);
        } else {
            done(null, false);
        } */
    });
}