require('dotenv').config();

const fs = require('fs');
const path = require('path');

const facturasProveedoresDb = require(
    '../lib/facturas_proveedores/facturasProveedores_db_mysql'
);

async function prueba() {

    try {

        const rutaPdf = path.join(__dirname, 'abanca.pdf');

        const buffer = fs.readFileSync(rutaPdf);

        const resultado = await facturasProveedoresDb.conciliarPdfAbanca(
            buffer
        );

        console.log('----------------------------------------');
        console.log('RESULTADO CONCILIACION ABANCA');
        console.log('----------------------------------------');

        console.log('Empresa ID:', resultado.empresaId);
        console.log('Empresa:', resultado.empresaNombre);
        console.log('NIF:', resultado.empresaNif);
        console.log('Fecha documento:', resultado.fechaDocumento);
        console.log('Número de operaciones:', resultado.numeroOperaciones);
        console.log('Importe total:', resultado.importeTotal);
        console.log('Facturas localizadas:', resultado.localizadas);
        console.log('Facturas no localizadas:', resultado.noLocalizadas);
        console.log('Pendientes de revisión:', resultado.pendientesRevision);
        console.log('Importe facturas:', resultado.importeFacturas);
        console.log('Diferencia:', resultado.diferencia);
        console.log('Facturas con incidencias:', resultado.facturasConIncidencias);
        console.log('Puede crear documento:', resultado.puedeCrear);

        console.table(resultado.operaciones.map(op => ({
            numeroFactura: op.numeroFactura,
            importe: op.importe,
            estado: op.estado,

            facproveId: op.factura
                ? op.factura.facproveId : null,

            referencia: op.factura
                ? op.factura.ref : null,

            contabilizada: op.factura
                ? op.factura.contabilizada : null,

            documentosAsociados: op.factura
                ? op.factura.documentosAsociados : null,

            incidencias: op.incidencias.join(', ')
        })));

        // Mostrar el detalle de las operaciones no localizadas
        for (const op of resultado.operaciones) {

            if (op.estado !== 'LOCALIZADA') {

                console.log('\nREVISAR FACTURA:', op.numeroFactura);

                console.table(op.candidatas);
            }
        }

    } catch (err) {

        console.error('Error:', err);

    }
}

prueba();