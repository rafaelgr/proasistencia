const S=require('../../node_modules/stimulsoft-reports-js');
const fs=require('fs');
const r=new S.Report.StiReport();
r.loadFile('public/reports/liquidacion_agente_obras.mrt');
let rows=JSON.parse(fs.readFileSync('public/reports/liquidacion_agente_obras.json','utf8')).liqAgente;
rows=rows.filter(x=>x.comercialId===43).slice(0,3);
for(const x of rows) {x.comisionBruta=x.comision+(x.anticipo||0);}
if(process.argv.includes('--reference')) {
 rows=[
  ['5CP_2872_10','C.P. HERMOSILLA, 108',18940.70,21153.84,12131.43,0,3788.14,0,5682.21,0,0,280],
  ['5P_2745_10','C.P. NUÑEZ DE BALBOA 94',16671.60,16671.60,12225.84,5001.48,3334.32,0,0,0,0,0],
  ['4CP_1874_10','C.P. HERMOSILLA 102',29849.72,33833.12,33833.12,8954.92,5969.94,14924.86,0,0,0,0]
 ].map((a,i)=>({contratoId:i,comercialId:43,nomComercial:'(B485) INMACULADA HERNANDO AGUILAR',dFecha:'01/01/2026',hFecha:'31/03/2026',referencia:a[0],nomCliente:a[1],direccion:a[1].replace('C.P. ',''),importeObra:a[2],certificacionFinal:a[3],abonado:a[4],facturado:a[4],pagadoAnterior30:a[5],pagadoAnterior20:a[6],pagadoAnterior50:a[7],pagadoPeriodo30:a[8],pagadoPeriodo20:a[9],pagadoPeriodo50:a[10],baseAnterior:a[5]+a[6]+a[7]+(i===2?3983.40:0),basePeriodo:a[8],comisionBruta:i===0?568.22:0,anticipo:a[11],comision:i===0?288.22:0,porComer:10,firmaActa:'Sí',pendienteAbono:a[3]-a[4]}));
}
if(process.argv.includes('--many')) rows=Array.from({length:15},(_,i)=>({...rows[i%3],referencia:'CONTRATO-'+i,contratoId:i}));
const ds=new S.System.Data.DataSet('liq_col3');ds.readJson({liqAgente:rows});r.regData(ds.dataSetName,'',ds);r.dictionary.synchronize();
r.renderAsync(()=>{const pdf=r.exportDocument(S.Report.StiExportFormat.Pdf);fs.writeFileSync('tmp/pdfs/preview'+(process.argv.includes('--many')?'-many':'')+'.pdf',Buffer.from(pdf)); console.log('Pages',r.renderedPages.count);},e=>{console.error(e);process.exitCode=1;});
