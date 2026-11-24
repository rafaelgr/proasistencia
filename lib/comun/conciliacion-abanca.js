const pdf = require('pdf-parse');

async function leerPdfAbanca(buffer) {

    const documento = await pdf(buffer);

    // Obtener la fecha del justificante bancario
    const cabeceraFecha = documento.text.match(
        /SEPA Viewer[^\r\n]*?-\s*(\d{2})\/(\d{2})\/(\d{4})\s+\d{2}:\d{2}:\d{2}/i
    );

    let fechaDocumento = null;

    if (cabeceraFecha) {
        fechaDocumento = `${cabeceraFecha[3]}-${cabeceraFecha[2]}-${cabeceraFecha[1]}`;
    }

    // Identificar el ordenante del documento
    const cabeceraOrdenante = documento.text.match(
        /Ordenante:\s*(.+?)(?=\s*N[º°]\s*operaciones:|\r?\n|$)/i
    );

    // Identificar el código del ordenante
    const cabeceraIdOrdenante = documento.text.match(
        /Id\.\s*Ordenante:\s*([A-Z0-9]+)/i
    );

    if (!cabeceraOrdenante || !cabeceraIdOrdenante) {
        throw new Error(
            'No se ha podido identificar el ordenante del PDF'
        );
    }

    const ordenante = cabeceraOrdenante[1].trim();

    const idOrdenante = cabeceraIdOrdenante[1].trim().toUpperCase();

    // Los primeros 9 caracteres corresponden al NIF español
    const nifOrdenante = idOrdenante.substring(0, 9);

    if (!/^[A-Z0-9]{9}$/.test(nifOrdenante)) {
        throw new Error('Identificador del ordenante incorrecto');
    }

    const operaciones = [];

    const patron = /^([^\r\n]+?)\s+(ES\d{22})\s*([\d.,]+)\s*€\s*TRAD\s*(.+?)\s+de\s+(\d{2}\/\d{2}\/\d{4})\s*N\s*(\d+)/gm;

    let coincidencia;

    while ((coincidencia = patron.exec(documento.text)) !== null) {

        const fecha = coincidencia[5].split('/');

        operaciones.push({
            beneficiario: coincidencia[1].trim(),
            iban: coincidencia[2],
            importe: Number(
                coincidencia[3]
                    .replace(/\./g, '')
                    .replace(',', '.')
            ),
            numeroFactura: coincidencia[4].trim(),
            fechaFactura: `${fecha[2]}-${fecha[1]}-${fecha[0]}`
        });
    }

    if (operaciones.length === 0) {
        console.log(documento.text);

        throw new Error(
            'No se han encontrado operaciones en el PDF'
        );
    }

    const importeTotal = operaciones.reduce(
        (total, operacion) =>
            total + Math.round(operacion.importe * 100),
        0
    ) / 100;

    // Extraer número de operaciones de la cabecera
    const cabeceraOperaciones = documento.text.match(
        /N[º°]\s*operaciones:\s*(\d+)/i
    );

    // Extraer importe total de la cabecera
    const cabeceraImporte = documento.text.match(
        /Importe total:\s*([\d.,]+)\s*€/i
    );

    if (!cabeceraOperaciones || !cabeceraImporte) {
        throw new Error(
            'No se han podido identificar los totales del PDF'
        );
    }

    const numeroOperacionesPdf = Number(cabeceraOperaciones[1]);

    const importeTotalPdf = Number(
        cabeceraImporte[1]
            .replace(/\./g, '')
            .replace(',', '.')
    );

    // Comprobar número de operaciones
    if (numeroOperacionesPdf !== operaciones.length) {
        throw new Error(
            'El número de operaciones no coincide con el PDF'
        );
    }

    // Comprobar importe total
    if (
        Math.round(importeTotalPdf * 100) !==
        Math.round(importeTotal * 100)
    ) {
        throw new Error(
            'El importe total no coincide con el PDF'
        );
    }

    return {
        validado: true,
        ordenante: ordenante,
        idOrdenante: idOrdenante,
        nifOrdenante: nifOrdenante,
        fechaDocumento: fechaDocumento,
        numeroOperaciones: operaciones.length,
        numeroOperacionesPdf: numeroOperacionesPdf,
        importeTotal: importeTotal,
        importeTotalPdf: importeTotalPdf,
        operaciones: operaciones
    };
}

module.exports = {
    leerPdfAbanca
};