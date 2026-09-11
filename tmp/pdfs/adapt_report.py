import xml.etree.ElementTree as E
from copy import deepcopy

path='public/reports/liquidacion_agente_obras.mrt'
tree=E.parse(path); root=tree.getroot(); pages=root.find('Pages')
old=pages[0]; logo=deepcopy(next(n for n in old.iter() if n.get('type')=='Image')); fmt=deepcopy(old.find('.//TextFormat'))
pages.clear(); pages.attrib.update(isList='true',count='2'); seq=400
def prop(n,k,v):
    e=n.find(k)
    if e is None: e=E.SubElement(n,k)
    e.text=str(v); return e
def obj(parent,name,kind):
    global seq
    seq+=1; return E.SubElement(parent,name,Ref=str(seq),type=kind,isKey='true')
def page(name,w,h):
    p=obj(pages,name,'Page'); prop(p,'Name',name); prop(p,'Margins','1,1,1,1'); prop(p,'Orientation','Landscape' if w>h else 'Portrait'); prop(p,'PageWidth',w); prop(p,'PageHeight',h); E.SubElement(p,'Report',isRef='0'); E.SubElement(p,'Components',isList='true',count='0'); return p
def band(p,name,kind,height):
    b=obj(p.find('Components'),name,kind); prop(b,'Name',name); prop(b,'ClientRectangle',f'0,0,{float(p.findtext("PageWidth"))-2},{height}'); prop(b,'Brush','Transparent'); E.SubElement(b,'Page',isRef=p.get('Ref')); E.SubElement(b,'Parent',isRef=p.get('Ref')); E.SubElement(b,'Components',isList='true',count='0'); return b
def text(b,x,y,w,h,s,bold=False,size=9,align='Left',fill='Transparent',border=False,money=False):
    global seq
    n=obj(b.find('Components'),'Text'+str(seq+1),'Text'); prop(n,'Name',n.tag); prop(n,'ClientRectangle',f'{x},{y},{w},{h}'); prop(n,'Text',s); prop(n,'Font',f'Arial,{size}'+(',Bold' if bold else '')); prop(n,'Brush',fill); prop(n,'TextBrush','Black'); prop(n,'Margins','2,0,2,0'); prop(n,'VertAlignment','Center'); prop(n,'HorAlignment',align); prop(n,'WordWrap','True'); prop(n,'Type','Expression'); E.SubElement(n,'Page',isRef=b.find('Page').get('isRef')); E.SubElement(n,'Parent',isRef=b.get('Ref'))
    prop(n,'TextOptions',',,,,WordWrap=True,A=0')
    if border: prop(n,'Border','All;Black;1;Solid;False;4;Black')
    if money:
        f=deepcopy(fmt); seq+=1; f.set('Ref',str(seq)); n.append(f)
    return n
def expr(f): return '{liqAgente.'+f+'}'
def group(p,name,width,detail=False):
    b=band(p,name,'GroupHeaderBand',1.65 if detail else 3.5); prop(b,'Condition',expr('nomComercial')); prop(b,'KeepGroupHeaderTogether','True'); prop(b,'PrintOnAllPages','True'); prop(b,'NewPageBefore','True')
    text(b,0,0,width-3,.5,'DETALLE DE LIQUIDACIONES' if detail else 'Liquidación de Agente:',detail,10)
    text(b,0,.6,width-3,.5,'AGENTE: '+expr('nomComercial'),True,9)
    text(b,0,1.1,width-3,.45,'Fecha liquidación: '+expr('dFecha')+' - '+expr('hFecha'),True,9)
    im=deepcopy(logo); seqref=str(int(b.get('Ref'))+10000); im.set('Ref',seqref); im.tag='Logo'+name; prop(im,'Name',im.tag); prop(im,'ClientRectangle',f'{width-2.6},0,2.4,1.4'); im.find('Page').set('isRef',p.get('Ref')); im.find('Parent').set('isRef',b.get('Ref')); b.find('Components').append(im)
    return b

p=page('Resumen',29.7,21); g=group(p,'GrupoResumen',27.7)
widths=[2.3,4.5,2.35,2.35,2.35,2.35,2.35,1.1,2.85,2.5,2.7]
labels=['Ref. contrato','Cliente','Importe\ncontrato','Importe\ncertificación','Imp. abonado','Liquidado ant.','Liquidación\nperíodo','%','Abono a percibir\nperíodo actual','Pago a cuenta','Líquido a\npercibir']
fields=['referencia','nomCliente','importeObra','certificacionFinal','abonado','baseAnterior','basePeriodo','porComer','comisionBruta','anticipo','comision']
# Fit the full table to the printable landscape width.
widths=[w*27.7/sum(widths) for w in widths]
d=band(p,'DatosResumen','DataBand',.65); prop(d,'DataSourceName','LiqAgente'); prop(d,'CanGrow','True'); prop(d,'CanBreak','False')
sort=E.SubElement(d,'Sort',isList='true',count='4')
for v in ['ASC','nomComercial','ASC','referencia']: E.SubElement(sort,'value').text=v
f=band(p,'TotalResumen','GroupFooterBand',4.1)
x=0
for i,(w,label,field) in enumerate(zip(widths,labels,fields)):
    fill='252,232,216' if i==8 else '242,242,242' if i==10 else 'Transparent'
    text(g,x,2.3,w,1.2,label,True,8,'Center',fill,True)
    n=text(d,x,0,w,.65,expr(field)+(' %' if i==7 else ''),False,8,'Left' if i<2 else 'Right',fill,True,i>1 and i!=7); prop(n,'CanGrow','True'); prop(n,'GrowToHeight','True')
    text(f,x,0,w,.6,'TOTAL' if i==0 else '' if i in [1,7] else '{Sum(GrupoResumen,liqAgente.'+field+')}',True,8,'Left' if i<2 else 'Right',fill,True,i>1 and i!=7)
    x+=w
text(f,0,1.6,27.7,.5,'BASES LIQUIDABLES',True)
for i,s in enumerate(['30% del importe total del presupuesto inicial, cuando la obra esté abonada en un 50%.','20% del importe total del presupuesto inicial, cuando esté firmada el acta de recepción de obra.','50% del importe total del presupuesto inicial, cuando la obra esté abonada en un 100%.','Adicional: diferencia de certificación final incluida en la liquidación final.']): text(f,0,2.2+i*.4,27.7,.4,s,size=9)

p=page('Detalle',21,29.7); group(p,'GrupoDetalle',19,True)
d=band(p,'DataLiqAgente','DataBand',8.25); prop(d,'DataSourceName','LiqAgente'); prop(d,'CanBreak','False'); d.append(deepcopy(sort))
text(d,0,0,19,.5,'CLIENTE: '+expr('nomCliente'),True,9,fill='242,242,242')
for y,label,field in [(.5,'Ref. contrato','referencia'),(1,'Importe contratado','importeObra'),(1.5,'Importe certificación final','certificacionFinal'),(2.3,'Importe facturado','facturado'),(2.8,'Importe abonado','abonado')]:
    text(d,0,y,6.5,.5,label); text(d,6.5,y,3.4,.5,expr(field),align='Right',money=field!='referencia')
text(d,10,.5,3,.5,'Direc. obra:'); text(d,13,.5,6,1,expr('direccion'),size=8)
text(d,10,1.5,3,.5,'Adicional:'); text(d,13,1.5,6,.5,'{liqAgente.certificacionFinal - liqAgente.importeObra}',money=True)
text(d,10,2.8,3,.5,'% Abonado:'); text(d,13,2.8,6,.5,'{IIF(liqAgente.importeObra == 0, 0, Round(liqAgente.abonado / liqAgente.importeObra * 100, 0))} %')
cols=[0,6.5,9.9,13.1,19]
for i,s in enumerate(['','LIQUIDADO ANT.','LIQUID. PERÍODO','Liquidable']): text(d,cols[i],3.6,cols[i+1]-cols[i],.5,s,i==2,8,fill='242,242,242',border=True)
conditions=['% Abonado ≥ 50%: {IIF(liqAgente.abonado >= liqAgente.importeObra * 0.5, "Sí", "No")}','Acta firmada: {liqAgente.firmaActa}','% Abonado ≥ 100%: {IIF(liqAgente.abonado >= liqAgente.importeObra, "Sí", "No")}','Liquidación final: {IIF(liqAgente.certificacionFinal > 0 && liqAgente.pendienteAbono <= 0, "Sí", "No")}']
for i,suffix in enumerate(['30','20','50','ADICIONAL']):
    a=expr('pagadoAnterior'+suffix) if i<3 else '{liqAgente.baseAnterior - liqAgente.pagadoAnterior30 - liqAgente.pagadoAnterior20 - liqAgente.pagadoAnterior50}'
    b=expr('pagadoPeriodo'+suffix) if i<3 else '{liqAgente.basePeriodo - liqAgente.pagadoPeriodo30 - liqAgente.pagadoPeriodo20 - liqAgente.pagadoPeriodo50}'
    for j,s in enumerate(['BASE LIQUIDABLE '+suffix+('%' if i<3 else ''),a,b,conditions[i]]): text(d,cols[j],4.1+i*.5,cols[j+1]-cols[j],.5,s,size=8,align='Right' if j in [1,2] else 'Left',fill='242,242,242' if j==2 else 'Transparent',border=True,money=j in [1,2])
for j,s in enumerate(['TOTAL',expr('baseAnterior'),expr('basePeriodo'),'']): text(d,cols[j],6.1,cols[j+1]-cols[j],.5,s,True,9,'Right' if j in [1,2] else 'Left',border=True,money=j in [1,2])
for i,(label,field) in enumerate([('Abono a percibir período actual   '+expr('porComer')+' %','comisionBruta'),('Pago a cuenta','anticipo'),('Líquido a percibir','comision')]):
    fill=['252,232,216','Transparent','242,242,242'][i]
    text(d,0,6.6+i*.5,9.9,.5,label,i!=1,9,fill=fill,border=True)
    text(d,9.9,6.6+i*.5,3.2,.5,expr(field),i!=1,9,'Right',fill,True,True)
    text(d,13.1,6.6+i*.5,5.9,.5,'',fill=fill,border=True)
for c in root.iter('Components'): c.set('count',str(len(c)))
E.indent(tree,space='  '); tree.write(path,encoding='utf-8',xml_declaration=True)
from pathlib import Path
p=Path(path)
s=p.read_text(encoding='utf-8')
p.write_text(s.replace(s.splitlines()[0], '<?xml version="1.0" encoding="utf-8" standalone="yes"?>', 1),encoding='utf-8')
