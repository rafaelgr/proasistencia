const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const moment = require('moment');

// Aislar las funciones evita cargar el servidor y abrir conexiones reales.
const source = fs.readFileSync(require.resolve('../lib/liquidaciones/liquidaciones_db_mysql'), 'utf8');
const context = vm.createContext({ moment, Map });
vm.runInContext(source.slice(source.indexOf('var sqlLiberarAnticiposObras ='),
    source.indexOf('var fnFacturasFromDbToJson =')), context);

function obra(overrides = {}) {
    return Object.assign({ contratoId: 1, comercialId: 2, importeObra: 10000,
        abonado: 5000, certificacionFinal: 0, porComer: 10, anticipo: 200,
        firmaActa: 0, fechaFirmaActa: null, baseAnterior: 0,
        pagadoPeriodo30: 0, pagadoAnterior30: 0, pagadoPeriodo20: 0,
        pagadoAnterior20: 0, pagadoPeriodo50: 0, pagadoAnterior50: 0 }, overrides);
}

test('descuenta el anticipo integro sin completar los hitos y conserva la base', () => {
    const r = context.calculaLiquidacionObras(obra(), '2026-01-01', '2026-03-31');
    assert.equal(r.basePeriodo, 3000);
    assert.equal(r.comision, 100);
    assert.equal(r.anticipo, 200);
});

test('no descuenta el anticipo cuando la comision del periodo es cero', () => {
    const r = context.calculaLiquidacionObras(obra({ abonado: 0 }), '2026-01-01', '2026-03-31');
    assert.equal(r.basePeriodo, 0);
    assert.equal(r.comision, 0);
    assert.equal(r.anticipo, 0);
});

test('todos los hitos tampoco reducen la base por el anticipo', () => {
    const r = context.calculaLiquidacionObras(obra({ abonado: 10000, firmaActa: 1,
        fechaFirmaActa: '2026-02-01' }), '2026-01-01', '2026-03-31');
    assert.equal(r.basePeriodo, 10000);
    assert.equal(r.comision, 800);
});

for (const adicional of [1000, -1000]) {
    for (const porcentaje of [0, 10]) {
        test(`adicional ${adicional} al ${porcentaje}% se liquida una sola vez`, () => {
            let r = obra({ certificacionFinal: 10000 + adicional,
                abonado: 10000 + adicional, porComer: porcentaje, anticipo: 0,
                baseAnterior: 10000, pagadoAnterior30: 3000,
                pagadoAnterior20: 2000, pagadoAnterior50: 5000 });
            r = context.calculaLiquidacionObras(r, '2026-01-01', '2026-03-31');
            assert.equal(r.basePeriodo, adicional);
            assert.equal(r.comision, adicional * porcentaje / 100);
            assert.equal(r.adicionalPagadoPeriodo, adicional * porcentaje / 100);
            for (let mes of ['04', '07', '10']) {
                // Tambien debe mantenerse liquidado si el porcentaje pasa de cero a diez.
                r.porComer = 10;
                r = context.calculaLiquidacionObras(r, `2026-${mes}-01`, `2026-${mes}-28`);
                assert.equal(r.basePeriodo, 0);
                assert.equal(r.baseAnterior, 10000 + adicional);
                assert.equal(r.comision, 0);
                assert.equal(r.adicionalPagadoAnterior, adicional * porcentaje / 100 || 0);
            }
        });
    }
}

test('traslada juntos los hitos y el adicional con porcentaje cero', () => {
    let r = obra({ certificacionFinal: 11000, abonado: 11000, porComer: 0,
        firmaActa: 1, fechaFirmaActa: '2026-02-01', anticipo: 0 });
    r = context.calculaLiquidacionObras(r, '2026-01-01', '2026-03-31');
    assert.equal(r.basePeriodo, 11000);
    for (const mes of ['04', '07']) {
        r = context.calculaLiquidacionObras(r, `2026-${mes}-01`, `2026-${mes}-28`);
        assert.equal(r.baseAnterior, 11000);
        assert.equal(r.basePeriodo, 0);
    }
});

test('el adicional espera al cobro de certificacion conservando la tolerancia de centimos', () => {
    const pendiente = obra({ certificacionFinal: 11000.90, abonado: 10000,
        baseAnterior: 10000, pagadoAnterior30: 3000,
        pagadoAnterior20: 2000, pagadoAnterior50: 5000, anticipo: 0 });
    let r = context.calculaLiquidacionObras(pendiente, '2026-01-01', '2026-03-31');
    assert.equal(r.basePeriodo, 0);
    r.abonado = 11000.10;
    r = context.calculaLiquidacionObras(r, '2026-04-01', '2026-06-30');
    assert.equal(Math.round(r.basePeriodo * 100), 100090);
    assert.equal(r.comision, 100.09);
});

function guardar(anticipos, failInsert) {
    const calls = [];
    const con = { query(sql, params, cb) {
        calls.push({ sql, params });
        if (sql.startsWith('SELECT')) return cb(null, anticipos);
        if (failInsert && sql.startsWith('INSERT')) return cb(new Error('insert fallido'));
        cb(null, {});
    } };
    return new Promise(resolve => context.guardarLiquidacionObrasConAnticipos(
        obra({ anticipo: 999 }), '2026-01-01', '2026-03-31', con,
        err => resolve({ err, calls })));
}

test('usa los anticipos del origen sin arrastrar el importe del resumen anterior', async () => {
    const { err, calls } = await guardar([]);
    assert.ifError(err);
    assert.equal(calls[1].params.anticipo, 0);
    assert.equal(calls[1].params.comision, 300);
    assert.equal(calls.length, 2);
});

test('suma varios anticipos una vez y marca exclusivamente sus identificadores', async () => {
    const { err, calls } = await guardar([
        { antproveServiciadoId: 11, importe: '120.00' },
        { antproveServiciadoId: 12, importe: '80.00' },
        { antproveServiciadoId: 11, importe: '120.00' }
    ]);
    assert.ifError(err);
    assert.equal(calls[1].params.anticipo, 200);
    assert.equal(calls[1].params.comision, 100);
    assert.deepEqual(Array.from(calls[2].params[2]), [11, 12]);
    assert.match(calls[0].sql, /an.liquidado = 0 OR \(an.liquidado = 1 AND an.dFecha = \? AND an.hFecha = \?\)/);
    assert.match(context.sqlLiberarAnticiposObras, /l.dFecha = an.dFecha AND l.hFecha = an.hFecha/);
    assert.match(context.sqlLiberarAnticiposObras, /l.comercialId = c.comercialId/);
});

test('un fallo al insertar no marca los anticipos como liquidados', async () => {
    const { err, calls } = await guardar([{ antproveServiciadoId: 11, importe: 200 }], true);
    assert.equal(err.message, 'insert fallido');
    assert.equal(calls.length, 2);
});
