const documentosPagoDb = require(
    '../documentos_pago/documentos_pago_db_mysql'
);

// Herramientas disponibles para OpenAI

const herramientas = [

    {
        type: 'function',

        name: 'analizar_documento_pago',

        description: `
            Analiza un justificante bancario PDF adjuntado
            por el usuario, identifica la empresa,
            localiza las facturas de proveedores y comprueba
            si se puede crear el documento de pago.

            Esta herramienta no modifica la base de datos.
        `,

        parameters: {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false
        },

        strict: true
    }

];

module.exports.herramientas = herramientas;


// Ejecutar herramienta solicitada por OpenAI

module.exports.ejecutarHerramienta = async function (
    nombre,
    argumentos,
    contexto
) {

    switch (nombre) {

        case 'analizar_documento_pago':

            return await analizarDocumentoPago(contexto);

        default:

            throw new Error(
                'Herramienta no disponible: ' + nombre
            );
    }
};


// Analizar documento de pago

async function analizarDocumentoPago(contexto) {

    if (!contexto || !contexto.archivo) {

        return {
            correcto: false,
            mensaje: 'Debe adjuntar un justificante bancario PDF'
        };
    }

    const resultado =
        await documentosPagoDb.analizarDocumentoPago(
            contexto.archivo.buffer,
            contexto.archivo.nombre
        );

    return {
        correcto: true,
        empresaId: resultado.empresaId,
        fechaDocumento: resultado.fechaDocumento,
        importeTotal: resultado.importeTotal,
        localizadas: resultado.localizadas,
        documentoDuplicado: resultado.documentoDuplicado,
        documentoPago: resultado.documentoPago,
        puedeCrear: resultado.puedeCrear,
        incidencias: resultado.incidencias || [],
        avisos: resultado.avisos || [],

        operaciones: (resultado.operaciones || []).map(op => ({
            beneficiario: op.beneficiario,
            numeroFactura: op.numeroFactura,
            fechaFactura: op.fechaFactura,
            importe: op.importe,
            estado: op.estado,

            factura: op.factura ? {
                facproveId: op.factura.facproveId,
                ref: op.factura.ref
            } : null
        }))
    };
}