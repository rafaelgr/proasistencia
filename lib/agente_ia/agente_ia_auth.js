
const jwt = require('jsonwebtoken');
const usuariosDb = require('./agente_ia_usuarios_db_mysql');

const EMISOR = 'PROASISTENCIA';
const DESTINATARIO = 'PROASISTENCIA-IA';

// Obtener clave privada
function obtenerClave() {

    const clave = process.env.AGENTE_IA_JWT_SECRET;

    if (!clave || clave.length < 64) {
        throw new Error(
            'AGENTE_IA_JWT_SECRET no configurada correctamente'
        );
    }

    return clave;

}

// Generar token de acceso al agente
module.exports.generarToken = function (usuarioId) {

    usuarioId = Number(usuarioId);

    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
        throw new Error('Identificador de usuario incorrecto');
    }

    return jwt.sign(
        {
            usuarioId: usuarioId
        },
        obtenerClave(),
        {
            algorithm: 'HS256',
            expiresIn: process.env.AGENTE_IA_JWT_EXPIRACION || '8h',
            issuer: EMISOR,
            audience: DESTINATARIO
        }
    );

};

// Middleware de autenticación
module.exports.validarToken = async function (req, res, next) {

    const authorization = req.headers.authorization || '';

    const coincidencia = authorization.match(
        /^Bearer\s+(\S+)$/i
    );

    if (!coincidencia) {

        return res.status(401).json({
            error: 'No se ha proporcionado un token de acceso'
        });

    }

    const token = coincidencia[1];

    let clave;

    try {

        clave = obtenerClave();

    } catch (err) {

        console.error('Error configuración agente IA:', err.message);

        return res.status(500).json({
            error: 'Error de configuración del agente'
        });

    }

    let datos;

    try {

        datos = jwt.verify(
            token,
            clave,
            {
                algorithms: ['HS256'],
                issuer: EMISOR,
                audience: DESTINATARIO
            }
        );

    } catch (err) {

        return res.status(401).json({
            error: 'Token incorrecto o caducado'
        });

    }

    if (!Number.isSafeInteger(datos.usuarioId) ||
        datos.usuarioId <= 0) {

        return res.status(401).json({
            error: 'Usuario no válido'
        });

    }

    try {

        const usuario = await usuariosDb.getUsuarioAutorizado(
            datos.usuarioId
        );

        if (!usuario) {

            return res.status(403).json({
                error: 'Usuario no autorizado para utilizar el agente IA'
            });

        }

        // Usuario autenticado y autorizado
        req.usuarioIA = usuario;

        next();

    } catch (err) {

        console.error('Error autenticación IA:', err.message);

        return res.status(500).json({
            error: 'Error al comprobar los permisos del usuario'
        });

    }

};
