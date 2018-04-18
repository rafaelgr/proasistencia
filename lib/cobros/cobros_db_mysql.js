var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";


// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function (err) {
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
    fnCobrosDeUnaFactura(id, function (err, rows) {
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




// zona de funciones auxiliares

var fnCobrosDeUnCliente = function (id, done) {
    done(null, []);
};


var fnCobrosDeUnaFactura = function (id, done) {
    var cobros = null;
    fnFacturaConta(id, function (err, rows) {
        if (err) return done(err);
        if (rows.length == 0) return done(null, cobros);
        var f = rows[0];
        var numserie = f.serie;
        var numfactu = f.numfac;
        var fecfactu = f.fecha;
        var conta = f.contabilidad;
        fnCobroEnConta(conta, numserie, numfactu, fecfactu, function (err, rows) {
            if (err) return done(err);
            cobros = fnCobroSeguro(rows);
            done(null, cobros);
        });
    });
};


// fnFacturaConta
// devuelve la información sobre la factura y la contabilidad
// en la que debe estar su cobro según la empresa emisora
var fnFacturaConta = function (facturaId, done) {
    var con = getConnection();
    sql = "SELECT f.facturaId, ano, numero, CONCAT(ano, LPAD(f.numero,6, '0')) AS numfac, serie, fecha, f.empresaId, e.nombre, e.contabilidad";
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
var fnCobroEnConta = function (conta, numserie, numfactu, fecfactu, done) {
    var con = getConnection();
    sql = "SELECT c.*, fp.nomforpa ";
    sql += " FROM " + conta + ".cobros AS c";
    sql += " LEFT JOIN " + conta + ".formapago AS fp ON fp.codforpa = c.codforpa";
    sql += " WHERE numserie =  ?";
    sql += " AND numfactu = ?";
    sql += " AND fecfactu = ?";
    sql += " ORDER BY c.fecvenci DESC";
    sql = mysql.format(sql, [numserie, numfactu, fecfactu]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        done(null, rows);
    })
}

var fnCobroSeguro = function (cobros) {
    var c2 = [];
    cobros.forEach(function (c) {
        c.seguro = false;
        if (c.fecultco) {
            var df = moment().diff(c.fecultco, 'days');
            if (df > 60) {
                c.seguro = true;
            }
        }
        c2.push(c);
    });
    return c2;
};
