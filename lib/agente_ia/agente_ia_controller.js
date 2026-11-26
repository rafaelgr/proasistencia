
var express = require('express');
var router = express.Router();

var agenteIA = require('./agente_ia_service');
var agenteAuth = require('./agente_ia_auth');

const formidable = require('formidable');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Proteger todas las rutas del agente
router.use(agenteAuth.validarToken);

async function recibirMensaje(req) {

    // Petición normal sin archivo adjunto

    if (!req.is('multipart/form-data')) {

        return {
            mensaje: req.body?.mensaje,
            contexto: {}
        };

    }

    // Crear carpeta temporal independiente para la petición

    const carpetaTemporal = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'proas-ia-')
    );

    try {

        const form = new formidable.IncomingForm();

        form.uploadDir = carpetaTemporal;
        form.keepExtensions = false;
        form.multiples = false;
        form.maxFileSize = 10 * 1024 * 1024;
        form.maxFieldsSize = 64 * 1024;
        form.maxFields = 5;

        const { fields, files } = await new Promise(
            (resolve, reject) => {

                form.parse(req, function (err, fields, files) {

                    if (err) {
                        return reject(err);
                    }

                    resolve({ fields, files });

                });

            }
        );

        const mensaje = fields.mensaje;
        const archivo = files.archivo;

        const contexto = {};

        // Comprobar que solo se recibe el archivo esperado

        const archivosRecibidos = await fs.promises.readdir(
            carpetaTemporal
        );

        if (
            archivosRecibidos.length > 1 ||
            Object.keys(files).some(key => key !== 'archivo')
        ) {

            throw new Error('Solo se permite adjuntar un PDF');

        }

        if (archivo) {

            if (Array.isArray(archivo)) {

                throw new Error('Solo se permite adjuntar un PDF');

            }

            const nombreArchivo = path.basename(
                String(archivo.name || '').replace(/\\/g, '/')
            );

            if (!/\.pdf$/i.test(nombreArchivo)) {

                throw new Error('El archivo debe ser un PDF');

            }

            if (
                archivo.size <= 0 ||
                archivo.size > 10 * 1024 * 1024
            ) {

                throw new Error('El tamaño del PDF no es válido');

            }

            const buffer = await fs.promises.readFile(
                archivo.path
            );

            // Comprobar la cabecera real del PDF

            if (buffer.subarray(0, 5).toString() !== '%PDF-') {

                throw new Error('El archivo no es un PDF válido');

            }

            contexto.archivo = {
                nombre: nombreArchivo,
                buffer: buffer
            };

        }

        return {
            mensaje,
            contexto
        };

    } finally {

        // Eliminar todos los archivos temporales

        await fs.promises.rm(carpetaTemporal, {
            recursive: true,
            force: true
        }).catch(err => {

            console.error(
                'Error eliminando archivos temporales IA:',
                err.message
            );

        });

    }

}

// Enviar mensaje al agente IA
router.post('/mensaje', async function (req, res, next) {

    try {

        let datos;

        try {

            datos = await recibirMensaje(req);

        } catch (err) {

            console.error(
                'Error recibiendo archivo IA:',
                err.message
            );

            return res.status(400).json({
                error: 'No se ha podido recibir el mensaje o el PDF'
            });

        }

        const { mensaje, contexto } = datos;

        if (typeof mensaje !== 'string' || !mensaje.trim()) {

            return res.status(400).json({
                error: 'Debe introducir un mensaje'
            });

        }

        if (mensaje.length > 10000) {

            return res.status(400).json({
                error: 'El mensaje es demasiado largo'
            });

        }

        // Usuario obtenido mediante la autenticación

        const usuarioId = req.usuarioIA.usuarioId;

        // Identificar el tipo de operación

        const operacion = contexto.archivo
            ? 'DOCUMENTOS_PAGO'
            : 'CONSULTA_GENERAL';

        // Enviar mensaje y contexto al agente

        const resultado = await agenteIA.enviarMensaje(
            mensaje,
            usuarioId,
            operacion,
            contexto
        );

        res.json(resultado);

    } catch (err) {

        console.error('Error agente IA:', err.message);

        res.status(500).json({
            error: 'Error al procesar la petición del agente'
        });

    }

});

module.exports = router;
