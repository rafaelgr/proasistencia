var edge = require('edge');
var config = require("../../config.json");


module.exports.test = function(callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("test", function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        console.log("RES: " + result);
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.test2 = function(callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("test2", function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        console.log("RES: " + result);
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.empresas = function(callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("empresas#" + config.dsn, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.empresa = function(codigo, callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("empresa#" + config.dsn + "#" + codigo, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.clientes = function(callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("clientes#" + config.dsn, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.cliente = function(codigo, callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("cliente#" + config.dsn + "#" + codigo, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.comerciales = function(callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("comerciales#" + config.dsn, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.comercial = function(codigo, callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("comercial#" + config.dsn + "#" + codigo, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.agentes = function(callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("agentes#" + config.dsn, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.agente = function(codigo, callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("agente#" + config.dsn + "#" + codigo, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};