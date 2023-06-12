/*-------------------------------------------------------------------------- 
contratoDetalle.js
Funciones js par la página ContratoDetalle.html
---------------------------------------------------------------------------*/
var contratoId = 0;
var lineaEnEdicion = false;

var dataContratosLineas;
var dataBases;
var dataComisionistas;
var dataGenerarPrefacturas;
var dataPrefacturas;
var dataFacturas;
var dataFacProves;
var dataAntProves;
var dataAscContratos;
var dataContratosCobros;
var dataFactCol;
var dataAntCol;
var ContratoId = 0;
var cmd;
var usuario;
var dataConceptosLineas;
var dataPlanificacionLineas;
var numConceptos = 0;
var dataConceptos; 
var numPrefacturas = 0;
var importePrefacturas = 0;
var importePrefacturasPlanificacion = 0;
var usaCalculadora;
var calcInv = false;
var DesdeContrato
var AscContratoId;
var esVinculado = false;
var numLineas = 0;
var antClienteId = null;
var antClienteNombre = "";
var RegPlanificacion = null;
var tablaPrefacturas;
var a = null;
var _recepcionGestion;
var dataDocumentacion;
var subCarpeta = '';
var carpetaTipo = null;

datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();

    vm = new admData();
    ko.applyBindings(vm);

    // Eventos de la calculadora de costes
    $('#txtCoste').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeBeneficio').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeAgente').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtNumPagos2').on('blur', verPrefacturasAGenerarPlanificacion);

    // asignación de eventos al clic
    $("#btnAceptar").click(clicAceptar);
    $("#btnAceptar2").click(function() {
        clicAceptar(false);
    });

    $("#btnSalir").click(salir());
    //$("#btnImprimir").click(imprimir);
    $('#txtPrecio').focus( function () {
        $('#txtPrecio').val(null);
    });

     //Evento dfel modal de la documentación
     $('#modalUploadDoc').on('hidden.bs.modal', function (event) {
        vm.files([]);
      });
      
    $("#frmContrato").submit(function () {
        return false;
    });
    $("#frmPrefacturas").submit(function () {
        return false;
    });
    $('#frmFacprove').submit(function () {
        return false;
    });
    $('#frmFactcol').submit(function () {
        return false;
    });

    $("#frmRenovarContratos").submit(function () {
        return false;
    });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });
    $("#frmComisionista").submit(function () {
        return false;
    });
    $("#comisionista-form").submit(function () {
        return false;
    });
    $("#renovarContratos-form").submit(function () {
        return false;
    });
    $("#concepto-form").submit(function () {
        return false;
    });

    $("#conceptoObras-form").submit(function () {
        return false;
    });
    
    $("#frmLineaConceptos").submit(function () {
        return false;
    });

    $("#frmLineaPlanificacionObras").submit(function () {
        return false;
    });

    $("#frmAscContratos").submit(function () {
        return false;
    });
    $("#frmAntprove").submit(function () {
        return false;
    });
    $("#btnAltaAntprove").submit(function () {
        return false;
    });
    $("#frmAntcol").submit(function () {
        return false;
    });
    $("#btnAltaAntcol").submit(function () {
        return false;
    });
    $("#generarPrefacturasObras-form").submit(function () {
        return false;
    });

    $("#generarRecepcionGestion-form").submit(function () {
        return false;
    });

    $("#creacionCarpetas-form").submit(function () {
        return false;
    });

    $("#creacionSubcarpetas-form").submit(function () {
        return false;
    });


    $("#frmDoc").submit(function () {
        return false;
    });

    $("#frmloadDoc").submit(function () {
        return false;
    });

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioEmpresa(e.added);
    });

    $("#txtPorcentajeCobro").focus(function () {
        $('#txtPorcentajeCobro').val(null);
    });
    $("#txtImporteCalculado").focus(function () {
        var imp =  $('#txtImporteCalculado').val();
        if(imp == 0) $('#txtImporteCalculado').val(null);
    });

    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();

    $("#cmbTipoProyecto").select2(select2Spanish());
    //loadTipoProyecto();

    $("#cmbTipoProyecto").select2().on('change', function (e) {
        cambioTipoProyecto(e.added);
    });

    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();


    $("#cmbTiposContrato").select2(select2Spanish());
    loadTiposContrato(null);
    $("#cmbTiposContrato").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if(e.added) {
            cambioTipoContrato(e.added);
            loadDepartamento(e.added.id);
            if(e.added.id == 8) {
                $('#labObras').show();
                $('#labNoObras').hide();
            } else{
                $('#labObras').hide();
                $('#labNoObras').show();
            }
        }
    });

    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {  
        var dt = $('#dt_prefactura').DataTable(); 
        if (e.target.hash == '#s3'){
                a = new $.fn.dataTable.FixedHeader(dt, { header: true, alwayCloneTop: true });
        } else {
            $('.fixedHeader').remove();
            a = null;
        }

    /* if (e.target.hash == '#tab1'){
        table1.fixedHeader.enable().fixedHeader.adjust();
      table2.fixedHeader.enable().fixedHeader.adjust();  
    }
    else if (e.target.hash == '#tab2'){  	  
        table3.fixedHeader.enable().fixedHeader.adjust();
      table4.fixedHeader.enable().fixedHeader.adjust(); 
    }]]*/
});

 $(window).resize(function(){
    //aqui el codigo que se ejecutara cuando se redimencione la ventana
    if(a) {
        $('.fixedHeader').remove();
        var dt = $('#dt_prefactura').DataTable(); 
        a = new $.fn.dataTable.FixedHeader(dt, { header: true, alwayCloneTop: true });
    }
})

    $("#txtPorcentajeCobro").on('blur', function (e) {
        var totalContrato = vm.importeCliente();
        var porcentaje = parseFloat($("#txtPorcentajeCobro").val());
        var restoPorcentaje = 0;
        var restoContraro = 0;
        var importePorcentaje = 0;
        if(isNaN(porcentaje)) return;

        if(importePrefacturasConcepto > 0) {
            restoContraro = totalContrato - importePrefacturasConcepto
            restoPorcentaje = restoContraro / totalContrato * 100//nuevo porcentaje sobre el resto
            porcentaje = ((porcentaje/100)/(restoPorcentaje/100)) * 100
             
        } else {
            restoContraro = totalContrato;
        }

        porcentaje = porcentaje / 100;
        importePorcentaje = porcentaje * restoContraro;

        if(restoContraro == 0 || restoContraro < 0) {
            mensError("Se ha superado el total del contrato");
           //vm.importeCalculado(null);
        }
        vm.importeCalculado(roundToSix(importePorcentaje));
        if((importePrefacturasConcepto +  vm.importeCalculado()) > totalContrato) {
            mensError("Se ha superado el total del contrato, se ha asignado la cantidad que queda a repartir");
            vm.importeCalculado(totalContrato - importePrefacturasConcepto);
            var porcentaje = ((totalContrato - importePrefacturasConcepto) * 100) / totalContrato;
            vm.porcentajeCobro(roundToSix(porcentaje));
            //vm.importeCalculado(null);
            //vm.porcentajeCobro(null);
            //return;
        }
    });

    $("#txtPorcentajePlanificacion").on('blur', function (e) {
        var totalContrato = vm.importeCliente();
        var porcentaje = parseFloat($("#txtPorcentajePlanificacion").val());
        var restoPorcentaje = 0;
        var restoContraro = 0;
        var importePorcentaje = 0;
        if(isNaN(porcentaje)) return;
        restoContraro = totalContrato;
        porcentaje = porcentaje / 100;
        importePorcentaje = porcentaje * restoContraro;        
        vm.importeCalculadoPlanificacion(roundToSix(importePorcentaje));
    });

    $("#txtImporteCalculado").on('blur', function (e) {
        var totalContrato = vm.importeCliente();
        var importeCalculado = parseFloat($("#txtImporteCalculado").val());
        var porcentaje = 0;
        if(isNaN(importeCalculado)) return;
        if(importeCalculado+importePrefacturasConcepto > totalContrato) {
            mensError("Se ha superado el total del contrato, se ha asignado la cantidad que queda a repartir");
            vm.importeCalculado(totalContrato - importePrefacturasConcepto);
            porcentaje = ((totalContrato - importePrefacturasConcepto) * 100) / totalContrato;
            vm.porcentajeCobro(roundToSix(porcentaje));
        } else {
            porcentaje = (importeCalculado * 100) / totalContrato;
            vm.porcentajeCobro(roundToSix(porcentaje));
        }
    });

    $("#txtImporteCalculadoPlanificacion").on('blur', function (e) {
        var totalContrato = vm.importeCliente();
        var importeCalculado = parseFloat($("#txtImporteCalculadoPlanificacion").val());
        var porcentaje = 0;
        if(isNaN(importeCalculado)) return;
        porcentaje = (importeCalculado * 100) / totalContrato;
        vm.porcentajePlanificacion(roundToSix(porcentaje));
        
    });

     //Evento de marcar/desmarcar todos los checks
     $('#checkMain').click(
        function(e){
            var e = $('#checkMain').prop('checked');
            console.log(e);
            if($('#checkMain').prop('checked')) {
                $('.checkAll').prop('checked', true);
                updateAllPreFacturas(true);
              
            } else {
                $('.checkAll').prop('checked', false);
                updateAllPreFacturas(false);
            }
        }
    );


    $("#cmbTextosPredeterminados").select2(select2Spanish());
    loadTextosPredeterminados();
    $("#cmbTextosPredeterminados").select2().on('change', function (e) {
        cambioTextosPredeterminados(e.added);
    });

    $("#cmbTextosPredeterminados2").select2(select2Spanish());
    loadTextosPredeterminados2();
    $("#cmbTextosPredeterminados2").select2().on('change', function (e) {
        cambioTextosPredeterminados2(e.added);
    });

    $('#dt_documentacion').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = tablaDocumentacion.row(tr);
 
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(formatData(row.data())).show();
            tr.addClass('shown');
        }
    });

    $('#dt_contratosCobros').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = tablaContratoCobros.row(tr);
 
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(formatDataCobros(row.data())).show();
            tr.addClass('shown');
        }
    });

   /*  $('#upload-input').on('change', function () {
        if(vm.documNombre() == '') return mensError("Se tiene que asignar un nombre al documento.");
        var encontrado = false;
        var id = 0;
        var files = $(this).get(0).files;
        var file = files[0];
        var ext = file.name.split('.').pop().toLowerCase();
        var blob = file.slice(0, file.size, file.type); 
        var newFile = new File([blob], {type: file.type});
        var nom = vm.documNombre() + "." + ext;
        nom = nom.replace(/\//g, "-");
        var fileKey =  carpeta + "/" + nom
        //buscamos si el documento ya existe en la carpeta de destino
        llamadaAjax('GET', "/api/documentacion/documentos/de/la/carpeta/" + carpetaId, null, function (err, docums) {
            if (err) return;
            if(docums && docums.length > 0) {
                for(var i = 0; i < docums.length; i++) {
                    var d = docums[i];
                    var n = d.key.split('/');
                    if(n[1] == nom) {
                        encontrado = true;
                        id = d.documentoId
                        break;
                    }
                }
                if(encontrado) {

                    var mens = "Ya existe un documento con este nombre en esta carpeta, se reemplazará con el que está apunto de subir. ¿Desea continuar?";
                    $.SmartMessageBox({
                        title: "<i class='fa fa-info'></i> Mensaje",
                        content: mens,
                        buttons: '[Aceptar][Cancelar]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Aceptar") {
                            method = 'PUT';
                            uploadDocum(newFile, fileKey, id);
                        }
                        if (ButtonPressed === "Cancelar") {
                            $('#upload-input').val([]);
                        }
                    });

                } else {
                    uploadDocum(newFile, fileKey, id);
                }
            } else {
                uploadDocum(newFile, fileKey, id);
            }
        }); 
    }); */



    initAutoCliente();
    initAutoMantenedor();
    initAutoAgente();


    $("#cmbFormasPagoLinea").select2(select2Spanish());
    $("#cmbFormasPagoLineaObras").select2(select2Spanish());
    loadFormasPagoLinea();


    $("#cmbGrupoArticulos").select2(select2Spanish());
    loadGrupoArticulos();
    $("#cmbGrupoArticulos").select2().on('change', function (e) {
        cambioGrupoArticulo(e.added);
    });

    $("#cmbUnidades").select2(select2Spanish());
    loadUnidades();

    $("#cmbArticulos").select2(select2Spanish());
    // loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioArticulo(e.added);
    });

    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();
    $("#cmbTiposIva").select2().on('change', function (e) {
        cambioTiposIva(e.added);
    });

    $("#txtCantidad").blur(cambioPrecioCantidad);
    $("#txtPrecio").blur(cambioPrecioCantidad);

    initTablaContratosLineas();
    initTablaBases();
    initTablaComisionistas();
    initTablaGenerarPrefacturas();
    initTablaGenerarPrefacturasPlanificacion();

    
    initTablaFacturas();
    initTablaFacproves();
    initTablaAntproves();
    initTablaAntcols();
    initTablaContratosCobros();
    initTablaAscContratos();
    initTablaFactcol();
    initTablaConceptosLineas();
    initTablaPlanificacionLineasObras();
    initTablaDocumentacion();

    $("#cmbComerciales").select2(select2Spanish());
    loadComerciales();
    $("#cmbComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioComercial(e.added);
    });

    $("#btnAltaPrefactura").click(nuevaPrefactura);

    $('#btnAltaFacprove').click(nuevaFacprove);

    $('#btnAltaFactcol').click(nuevaFactcol);

    $('#btnAltaAntprove').click(nuevaAntprove);

    $('#btnAltaAntcol').click(nuevaAntcol);

    reglasDeValidacionAdicionales();

    cmd = gup('CMD');
    ContratoId = gup('ContratoId');
    DesdeContrato = gup('DesdeContrato');
    AscContratoId = gup('AscContratoId')

    if (cmd) mostrarMensajeEnFuncionDeCmd(cmd);

      $('#btnNuevaCarpeta').show();
    if(!usuario.puedeEditar) {
        $('#btnNuevaCarpeta').hide();
    } 
   

    $('#btnNuevaLinea').prop('disabled', false);
    $('#btnAceptarLinea').prop('disabled', false);

    //abrir en pestaña de facturas de proveedores
    if (gup('doc') != "") {
        $('.nav-tabs a[href="#s5"]').tab('show');
    } 
    //abrir en pestaña  de prefacturas
    if (gup('docPre') != "") {
        $('.nav-tabs a[href="#s3"]').tab('show');
    } 

    if (gup('docFac') != "") {
        $('.nav-tabs a[href="#s4"]').tab('show');
    } 

    //abrir en pestaña de contratos vinculados
    if (gup('docAsc') != "") {
        $('.nav-tabs a[href="#s7"]').tab('show');
    } 

    //abrir en pestaña de anticipos de gastos
    if (gup('docAnt') != "") {
        $('.nav-tabs a[href="#s8"]').tab('show');
    } 
    
    //abrir en pestaña de anticipos de colaboradores
    if (gup('docAntcol') != "") {
        $('.nav-tabs a[href="#s9"]').tab('show');
    } 

    //abrir en pestaña de anticipos de colaboradores
    if (gup('docFactcol') != "") {
        $('.nav-tabs a[href="#s10"]').tab('show');
    } 


    contratoId = gup('ContratoId');
    if (contratoId != 0) {
        llamadaAjax('GET', myconfig.apiUrl + "/api/contratos/uno/campo/departamento/" + contratoId, null, function (err, data) {
            if (err) return;
            

            loadData(data);
          
                initTablaPrefacturas(data.tipoContratoId);
            
            
            loadLineasContrato(data.contratoId);
            loadBasesContrato(data.contratoId);
           
            //loadComisionistas(data.contratoId);
            if(data.tipoContratoId != 8) {
                loadPrefacturasDelContrato(data.contratoId);
            }
            loadFacturasDelContrato(data.contratoId);
            loadFacproveDelContrato(data.contratoId);
            loadAntproveDelContrato(data.contratoId);
            loadAntcolDelContrato(data.contratoId);
            loadContratosCobros(data.contratoId);
            buscaComisionistas(data.contratoId);
            loadAscContratos(data.contratoId);
            loadFactcolDelContrato(contratoId);
            if(data.tipoContratoId == 8) {
                $('#labObras').show();
                $('#labNoObras').hide();
            } else{
                $('#labObras').hide();
                $('#labNoObras').show();
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        $("#labObras").hide();
        vm.firmaActa("0");
        vm.contratoId(0);
        vm.porcentajeRetencion(0);
        obtenerPorcentajeBeneficioPorDefecto();
        // ocultamos líneas y bases
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
        $('#btnAltaFacprove').hide();
        $('#btnAltaAntprove').hide();
        $('#btnAltaAntcol').hide();
        $('#btnAltaPrefactura').hide();
        $('#btnContratoAsociado').hide();
        
        //
        document.title = "NUEVO CONTRATO";
    }


     
    
    //metodo de validacion de fechas
    $.validator.addMethod("greaterThan",
        function (value, element, params) {
            var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
            if (!/Invalid|NaN/.test(new Date(fv))) {
                return new Date(fv) >= new Date(fp);
            } 
        }, 'La fecha de la factura debe ser mayor o igual que la fecha de inicio de contrato.');

        $.validator.addMethod("lessThan",
        function (value, element, params) {
            var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
            if (!/Invalid|NaN/.test(new Date(fv))) {
                return new Date(fv) <= new Date(fp);
            } 
        }, 'La fecha de la factura debe ser menor o igual que la fecha de fin de contrato.');
}

var mostrarMensajeEnFuncionDeCmd = function (cmd) {
    var mens = null;
    switch (cmd) {
        case 'NEW':
            mens = "La cabecera del contrato se ha creado correctamente, recuerde que debe dar de alta las diferentes líneas y asignar los colaboradores relacionados";
            break;
        case 'GEN':
            mens = "Este contrato ha sido generado desde una oferta. Compruebe que sus datos y colaboradores asociados son correctos";
            break;
        case 'REN':
            mens = "Este contrato es una renovación de un contrato anterio. Repase que las condiciones del mismo son correctas para este periodo";
            break;
        default:
            mens = null;
            break;
    }
    mensNormal(mens);
}

function admData() {
    var self = this;
    self.contratoId = ko.observable();
    self.tipoContratoId = ko.observable();
    self.referencia = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.nombreComercial = ko.observable();
    self.nombreCliente = ko.observable();
    self.mantenedorId = ko.observable();
    self.agenteId = ko.observable();
    self.fechaContrato = ko.observable();
    self.empresaId = ko.observable();
    self.servicioId = ko.observable();
    self.ofertaId = ko.observable();
    // calculadora
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.antPorcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.antPorcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeCliente = ko.observable();
    self.importeClienteFormat = ko.observable();
    self.certificacionFinal = ko.observable();
    self.importeMantenedor = ko.observable();
    //
    self.fechaInicio = ko.observable();
    self.fechaFirmaActa = ko.observable();
    self.fechaFinal = ko.observable();
    self.fechaPrimeraFactura = ko.observable();
    //self.fechaUltimaFactura = ko.observable();
    self.fechaSiguientesFacturas = ko.observable();
    self.fechaOriginal = ko.observable();
    self.facturaParcial = ko.observable();
    self.liquidarBase = ko.observable();
    self.contratoCerrado = ko.observable();
    self.contratoIntereses = ko.observable();
    self.firmaActa = ko.observable();
    self.preaviso = ko.observable();
    self.iban = ko.observable();
    //
    self.formaPagoId = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.tipoProyectoId = ko.observable();
    self.stipoProyectoId = ko.observable();
    //
    self.posiblesTipoProyecto = ko.observableArray([]);
    self.elegidosTipoProyecto = ko.observableArray([]);
    //
    self.tipoContratoId = ko.observable();
    self.stipoContratoId = ko.observable();
    //
    self.posiblesTiposContrato = ko.observableArray([]);
    self.elegidosTiposContrato = ko.observableArray([]);
    //
    //
    self.stextoPredeterminadoId = ko.observable();
    //
    self.posiblesTextosPredeterminados = ko.observableArray([]);
    self.elegidosTextosPredeterminados = ko.observableArray([]);
    //
    self.stextoPredeterminadoId2 = ko.observable();
    //
    self.posiblesTextosPredeterminados2 = ko.observableArray([]);
    self.elegidosTextosPredeterminados2 = ko.observableArray([]);
    //    
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    //
    self.scontratoId = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
    self.observaciones = ko.observable();
    //
    self.total = ko.observable();
    self.totalConIva = ko.observable();
    //radio buttons
    self.firmaActa = ko.observable();
    //
    self.porRetenGarantias = ko.observable();
    

    //-- Valores para la generación de prefacturas
    self.posiblesPeriodosPagos = ko.observableArray([]);
    self.elegidosPeriodosPagos = ko.observableArray([]);
    self.speriodoPagoId = ko.observableArray([]);

    self.importeAFacturar = ko.observable();
    self.numPagos = ko.observable();
    self.listaPagos = ko.observableArray([]);

    // -- Valores para las líneas
    self.contratoLineaId = ko.observable();
    self.linea = ko.observable();
    self.articuloId = ko.observable();
    self.tipoIvaId = ko.observable();
    self.porcentaje = ko.observable();
    self.descripcion = ko.observable();
    self.cantidad = ko.observable();
    self.importe = ko.observable();
    self.costeLinea = ko.observable();
    self.totalLinea = ko.observable();
    self.capituloLinea = ko.observable();
    //
    self.sgrupoArticuloId = ko.observable();
    //
    self.posiblesGrupoArticulos = ko.observableArray([]);
    self.elegidosGrupoArticulos = ko.observableArray([]);
    //
    self.sunidadId = ko.observable();
    //
    self.posiblesUnidades = ko.observableArray([]);
    self.elegidosUnidades = ko.observableArray([]);
    //
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);
    //
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);
    //
    // Nuevo Total de coste para la contrato
    self.totalCoste = ko.observable();
    //
    self.generada = ko.observable();
    // Valores para comisionistas
    self.contratoComisionistaId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    self.porcentajeComision = ko.observable();
    //
    self.prefacturasAGenerar = ko.observableArray([]);
    // modal de renovación del contrato
    self.nuevaFechaInicio = ko.observable();
    self.nuevaFechaFinal = ko.observable();
    self.nuevaFechaContrato = ko.observable();
    self.nuevaFacturaParcial = ko.observable();
    //
    self.obsFactura = ko.observable();
    //
    self.direccion = ko.observable();
    self.codPostal = ko.observable();
    self.poblacion = ko.observable();
    self.provincia = ko.observable();
    //
    self.tipoViaId = ko.observable();
    self.stipoViaId = ko.observable();
    //
    self.posiblesTiposVia = ko.observableArray([]);
    self.elegidosTiposVia = ko.observableArray([]);
    //
    self.porcentajeRetencion = ko.observable();

    //CONCEPTOS
    self.conceptoCobro = ko.observable();
    self.porcentajeCobro = ko.observable();
    self.contratoPorcenId = ko.observable();
    self.fechaConcepto = ko.observable();
    self.importeCalculado = ko.observable();
    //
    self.sformaPagoIdLinea = ko.observable();
    self.posiblesFormasPagoLinea = ko.observableArray([]);
    self.elegidosFormasPagoLinea = ko.observableArray([]);

    //PLANIFICACIÓN
    self.contPlanificacionId = ko.observable();
    self.conceptoPlanificacion = ko.observable();
    self.porcentajePlanificacion = ko.observable();
    self.importeCalculadoPlanificacion = ko.observable();
    self.fechaPlanificacionObras = ko.observable();
    self.fechaPlanificacionObras2 = ko.observable();
    self.importeFacturado = ko.observable();
    self.importeCobrado = ko.observable();
    self.importePlanificado = ko.observable();
    self.diferencia = ko.observable();
    self.importePrefacturado = ko.observable();
    self.diferenciaPrefacturado = ko.observable();
    self.certificacionFinalFormat = ko.observable();
    //
    self.fechaRecepcionGestion = ko.observable();
    self.emitidas = ko.observable();
    self.numEmitidas = ko.observable();

    self.totEmitidas = ko.observable();
    self.numEmitidas = ko.observable();
    //
    self.totRecibidas = ko.observable();
    self.numRecibidas = ko.observable();
    //
    self.totGestionCobros = ko.observable();
    self.numGestionCobros = ko.observable();
    //
    self.totLetrasPlanificadas = ko.observable();
    self.numLetrasPlanificadas = ko.observable();
    //
    self.difPlanificadoLetras = ko.observable();
    self.difNumPlanificadoLetras = ko.observable()
    //
    self.difRecibidasLetras = ko.observable();
    self.difNumRecibidasLetras = ko.observable();
    //
    self.difGestionCobroLetras = ko.observable();
    self.difNumGestionCobroLetras = ko.observable();

    //CARPETAS  Y DOCUMENTOS
    self.carpetaNombre = ko.observable();
    self.subCarpetaNombre = ko.observable();
    self.documNombre = ko.observable();
    //
    self.files = ko.observable();

}

function loadData(data) {  
    $('#btnNuevaLinea').show(); 
    vm.contratoId(data.contratoId);
    vm.ofertaId(data.ofertaId);
    vm.tipoContratoId(data.tipoContratoId);
    loadTiposContrato(data.tipoContratoId);
    vm.stipoContratoId(data.tipoContratoId);    
    vm.referencia(data.referencia);
    loadEmpresas(data.empresaId);
    cargaCliente(data.clienteId);
    cargaMantenedor(data.mantenedorId);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.antPorcentajeAgente(data.porcentajeAgente);
    cargaAgente(data.agenteId, true);
    vm.fechaContrato(spanishDate(data.fechaContrato));
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.antPorcentajeBeneficio(data.porcentajeBeneficio);
    vm.importeCliente(data.importeCliente);
    vm.importeClienteFormat(data.importeCliente);
    vm.certificacionFinal(data.certificacionFinal);
    loadTipoProyecto(data.tipoProyectoId);
    
    vm.importeMantenedor(data.importeMantenedor);
    vm.importeBeneficio(data.importeBeneficio);
    vm.observaciones(data.observaciones);
    vm.obsFactura(data.obsFactura);
    vm.formaPagoId(data.formaPagoId);
    loadFormasPago(data.formaPagoId);
    //
    vm.fechaInicio(spanishDate(data.fechaInicio));
    vm.fechaFirmaActa(spanishDate(data.fechaFirmaActa));
    var firma = data.firmaActa.toString();
    vm.firmaActa(firma);

   
    vm.fechaFinal(spanishDate(data.fechaFinal));
    vm.fechaPrimeraFactura(spanishDate(data.fechaPrimeraFactura));
    //vm.fechaUltimaFactura(spanishDate(data.fechaUltimaFactura));
    vm.fechaSiguientesFacturas(spanishDate(data.fechaSiguientesFacturas));
    vm.fechaOriginal(spanishDate(data.fechaOriginal));
    vm.facturaParcial(data.facturaParcial);
    vm.contratoCerrado(data.contratoCerrado);
    vm.contratoIntereses(data.contratoIntereses);
    vm.liquidarBase(data.liquidarBasePrefactura);
    vm.preaviso(data.preaviso);
    //
    vm.direccion(data.direccion);
    vm.codPostal(data.codPostal);
    vm.poblacion(data.poblacion);
    vm.provincia(data.provincia);
    loadTiposVia(data.tipoViaId);
    document.title = "CONTRATO: " + vm.referencia();
    vm.porcentajeRetencion(data.porcentajeRetencion);
    vm.servicioId(data.servicioId);

    //src del iframe con los datos del cliente
    var url = "ClienteDetalle.html?ClienteId=" + data.clienteId + "&frContrato=true"
    $('#frCliente').attr('src', url)
   

    if(data.tipoContratoId != 8) {
        $('.obras').hide()
        loadConceptosLineas(data.contratoId);
        $('#lineasPagoObras').hide();
        $('#lineasPago').show();
        $('#btnGenerarPrefacturas').show();

    } else {
        $('.obras').show()
        actualizaCobrosPlanificacion(data.contratoId);
        //loadPlanificacionLineasObras(data.contratoId);
        $('#lineasPagoObras').show();
        $('#lineasPago').hide();
        $('#btnGenerarPrefacturas').hide();
        $('#btnAltaPrefactura').hide();
    }
    loadDepartamento(data.tipoContratoId);
    recalcularCostesImportesDesdeCoste();
    cargaTablaDocumentacion();
    
    if(data.tipoContratoId == 8) {
        $('#txtNumPagos').prop('disabled', false);
        //$('#txtGFechaInicio').datepicker('disabled', true);
    } else {
        $('#txtNumPagos').prop('disabled', true);
        //$('#txtGFechaInicio').datepicker('disabled', false);
        
    }
    if(data.ascContratoId) {
        $("#tabAscContratos").hide();
        $("#radioFirmaActa1").prop('disabled', true);
        $("#radioFirmaActa2").prop('disabled', true);
        $("#radioFirmaActa3").prop('disabled', true);
        $('#txtFechaFirmaActa').prop('disabled', true);
        esVinculado = true;
    } else {
        $("#tabAscContratos").show();
        $("#radioFirmaActa1").prop('disabled', false);
        $("#radioFirmaActa2").prop('disabled', false);
        $("#radioFirmaActa3").prop('disabled', false);
        $('#txtFechaFirmaActa').prop('disabled', false);
        esVinculado = false;
    }
    if(data.tipoContratoId != 8) {
        $("#tabAscContratos").hide();
    }

    if(data.contratoCerrado && usuario.puedeAbrir) {
       $('#chkContratoCerrado').prop('disabled' , false)
    } else if (!data.contratoCerrado) {
        $('#chkContratoCerrado').prop('disabled' , false);
    }else if (data.contratoCerrado && !usuario.puedeAbrir) {
        $('#chkContratoCerrado').prop('disabled' , true);
    }

    

   if(data.contratoCerrado){
        ocualtaBotonesContratoCerrado();
    }
   
}


function datosOK() {
    $('#frmContrato').validate({
        rules: {
            txtReferencia: {
                required: true
            },
            cmbEmpresas: {
                required: true
            },
            cmbTipoProyecto: {
                required: true,
            },
            txtFechaContrato: {
                required: true
            },
            cmbFormasPago: {
                required: true
            },
            cmbTipoProyecto: {
                required: true
            },
            cmbTiposContrato: {
                required: true
            },
            txtCliente: {
                clienteNecesario: false
            },
            txtAgente: {
                agenteNecesario: true
            },
            txtFechaInicio: {
                required: true
            },
            txtFechaFinal: {
                required: true,
                fechaFinalSuperiorAInicial: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            txtFechaContrato: {
                required: 'Debe elegir una fecha'
            },
            cmbTipoProyecto: {
                required: "Debe elegir un tipo de proyecto"
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbTiposContrato: {
                required: "Debe elegir un tipo de contrato"
            },
            txtFechaInicio: {
                required: "Debe escoger una fecha inicial"
            },
            txtFechaFinal: {
                required: "Debe escoger una fecha final"
            },
            cmbTipoProyecto: {
                required: "Debe elegir un tipo de proyecto"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmContrato').valid();
}

function salir() {
    var mf = function () {
        var url = "ContratoGeneral.html";
        if(DesdeContrato == "true" && AscContratoId != 0){
            url = 'ContratoDetalle.html?ContratoId='+ AscContratoId +'&docAsc=true', '_self';
            window.open(url, '_self');
        } 
        window.open(url, '_self');
    }
    return mf;
}

var clicAceptar = function (salir) {
        guardarContrato(function (err, tipo) {
            if (err) return mensError(err);
            var url;
            if(DesdeContrato == "true" && AscContratoId != 0){
                url = 'ContratoDetalle.html?ContratoId='+ AscContratoId +'&docAsc=true';
            } else {
                url = "ContratoGeneral.html?ContratoId=" + vm.contratoId(); // default PUT
            }
            if (tipo == 'POST') {
                url = "ContratoDetalle.html?ContratoId=" + vm.contratoId() + "&CMD=NEW"; // POST
            }
            if(salir) {
                window.open(url, '_self');
            } else {
                mensNormal('Contrato guardado.')
            }
        })
    
}

var guardarContrato = function (done) {
    var firma = parseInt(vm.firmaActa());
    if (!datosOK()) return errorGeneral(new Error('Datos del formulario incorrectos'), done);
    if(firma) {
        if(!vm.fechaFirmaActa() || vm.fechaFirmaActa() == '') {
            return errorGeneral(new Error('Se requiere una fecha para la firma del acta'), done);
        }
    }
    comprobarSiHayMantenedor();
    vm.porcentajeBeneficio((vm.porcentajeBeneficio()));
   
    var data = generarContratoDb();

    if (contratoId == 0) {
        llamadaAjax('POST', myconfig.apiUrl + "/api/contratos", data, function (err, data) {
            if (err) return errorGeneral(err, done);
            loadData(data);
            done(null, 'POST');
        });
    } else {
        if( (vm.porcentajeBeneficio() != vm.antPorcentajeBeneficio() ||  vm.porcentajeAgente() !=  vm.antPorcentajeAgente()) && numLineas > 0) {
                // mensaje de confirmación
                var mens = "Al cambiar los porcentajes con lineas creadas se modificarán los importes de estas en arreglo a los nuevos porcentajes introducidos, ¿ Desea continuar ?.";
                $.SmartMessageBox({
                    title: "<i class='fa fa-info'></i> Mensaje",
                    content: mens,
                    buttons: '[Aceptar][Cancelar]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Aceptar") {
                        actualizarLineasDeLaContratoTrasCambioCostes(function(err, result) {
                            if (err) return errorGeneral(err, done);
                            recalcularImportesGuardar(function(err, result) {
                                if (err) return errorGeneral(err, done);
                                var data  = generarContratoDb();
                                llamadaAjax('PUT', myconfig.apiUrl + "/api/contratos/" + contratoId, data, function (err, data) {
                                    if (err) return errorGeneral(err, done);
                                    actualizaAsociados(vm.firmaActa(), function(err, result) {
                                        if (err) return errorGeneral(err, done);
                                        done(null, 'PUT');
                                    });
                                });
                            });
                        });
                    }
                    
                    if (ButtonPressed === "Cancelar") {
                        salir()();
                    }
                });
        } else {
            llamadaAjax('PUT', myconfig.apiUrl + "/api/contratos/" + contratoId, data, function (err, data) {
                if (err) return errorGeneral(err, done);
                actualizaAsociados(vm.firmaActa(), function(err, result) {
                    if (err) return errorGeneral(err, done);
                    done(null, 'PUT');
                });
            });
        }
        
    }
}


var generarContratoDb = function () {
    var data = {
        contrato: {
            "contratoId": vm.contratoId(),
            "tipoContratoId": vm.stipoContratoId(),
            "tipoProyectoId": vm.stipoProyectoId(),
            "referencia": vm.referencia(),
            "empresaId": vm.sempresaId(),
            "agenteId": vm.agenteId(),
            "clienteId": vm.clienteId(),
            "mantenedorId": vm.mantenedorId(),
            "fechaContrato": spanishDbDate(vm.fechaContrato()),
            "coste": vm.coste(),
            "porcentajeBeneficio": vm.porcentajeBeneficio(),
            "importeBeneficio": vm.importeBeneficio(),
            "ventaNeta": vm.ventaNeta(),
            "porcentajeAgente": vm.porcentajeAgente(),
            "importeAgente": vm.importeAgente(),
            "importeCliente": vm.importeCliente(),
            "certificacionFinal": vm.certificacionFinal(),
            "importeMantenedor": vm.importeMantenedor(),
            "observaciones": vm.observaciones(),
            "formaPagoId": vm.sformaPagoId(),
            "fechaInicio": spanishDbDate(vm.fechaInicio()),
            "fechaFirmaActa": spanishDbDate(vm.fechaFirmaActa()),
            "fechaFinal": spanishDbDate(vm.fechaFinal()),
            "fechaPrimeraFactura": spanishDbDate(vm.fechaPrimeraFactura()),
            //"fechaUltimaFactura": spanishDbDate(vm.fechaUltimaFactura()),
            "fechaSiguientesFacturas": spanishDbDate(vm.fechaSiguientesFacturas()),
            "fechaOriginal": spanishDbDate(vm.fechaOriginal()),
            "facturaParcial": vm.facturaParcial(),
            "preaviso": vm.preaviso(),
            "obsFactura": vm.obsFactura(),
            "tipoViaId": vm.stipoViaId(),
            "direccion": vm.direccion(),
            "codPostal": vm.codPostal(),
            "poblacion": vm.poblacion(),
            "provincia": vm.provincia(),
            "porcentajeRetencion": vm.porcentajeRetencion(),
            "contratoCerrado": vm.contratoCerrado(),
            "contratoIntereses": vm.contratoIntereses(),
            "firmaActa": vm.firmaActa(),
            "liquidarBasePrefactura": vm.liquidarBase()
        }
    };
    return data;
}

function loadEmpresas(id) {
    llamadaAjax('GET', "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{
            empresaId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}


function loadTiposContrato(id) {
    llamadaAjax('GET', "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var tipos = [{
            departamentoId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesTiposContrato(tipos);

        if(id) {
            $("#cmbTiposContrato").val([id]).trigger('change');
            vm.stipoContratoId(id);
        }
    });
}

function loadTipoProyecto(id) {
    if(id == undefined) id = 0;
    var url = "/api/tipos_proyectos/departamento/activos/" + usuario.usuarioId + "/" + vm.stipoContratoId()  + "/" + id;
    llamadaAjax('GET', url, null, function (err, data) {
        if (err) return;
        var tipos = [{
            tipoProyectoId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesTipoProyecto(tipos);
        $("#cmbTipoProyecto").val([id]).trigger('change');
    });
}

function loadTextosPredeterminados(id) {
    llamadaAjax('GET', "/api/textos_predeterminados", null, function (err, data) {
        if (err) return;
        var textos = [{
            textoPredeterminadoId: 0,
            texto: "",
            abrev: ""
        }].concat(data);
        vm.posiblesTextosPredeterminados(textos);
        $("#cmbTextPredeterminados").val([id]).trigger('change');
    });
}

function loadTextosPredeterminados2(id) {
    llamadaAjax('GET', "/api/textos_predeterminados", null, function (err, data) {
        if (err) return;
        var textos = [{
            textoPredeterminadoId2: 0,
            texto: "",
            abrev: ""
        }].concat(data);
        vm.posiblesTextosPredeterminados2(textos);
        $("#cmbTextPredeterminados2").val([id]).trigger('change');
    });
}

function loadFormasPago(id) {
    llamadaAjax('GET', '/api/formas_pago', null, function (err, data) {
        if (err) return;
        var formasPago = [{
            formaPagoId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([id]).trigger('change');
    });
}

function loadFormasPagoLinea(id) {
    llamadaAjax('GET', '/api/formas_pago', null, function (err, data) {
        if (err) return;
        var formasPago = [{
            formaPagoId: null,
            nombre: ""
        }].concat(data);
        vm.posiblesFormasPagoLinea(formasPago);
        vm.sformaPagoIdLinea(id);
        $("#cmbFormasPagoLinea").val([id]).trigger('change');
        $("#cmbFormasPagoLineaObras").val([id]).trigger('change');
    });
}

function loadContratos(id) {
    if (id) {
        // caso de un contrato en concreto
        llamadaAjax('GET', "/api/contratos_cliente_mantenimiento/" + id, null, function (err, data) {
            if (err) return;
            var contratos = [{
                contratoId: 0,
                referencia: ""
            }].concat(data);
            vm.posiblesContratos(contratos);
            $("#cmbContratos").val([id]).trigger('change');
        });
    } else {
        // caso cargar contratos de empreas / cliente
        llamadaAjax('GET',
            "/api/contratos_cliente_mantenimiento/empresa_cliente/" + vm.sempresaId() + "/" + vm.sclienteId(), null,
            function (err, data) {
                if (err) return;
                var contratos = [{
                    contratoId: 0,
                    referencia: ""
                }].concat(data);
                vm.posiblesContratos(contratos);
                $("#cmbContratos").val([id]).trigger('change');
            });
    }
}


var cambioCliente = function (datos) {
    //
    if (!datos) {
        return;
    }
    var clienteId = datos.id;
    llamadaAjax('GET', "/api/clientes/" + clienteId, null, function (err, data) {
        if (err) {
            mensError("Se ha producido un error en el proceso, el cliente no ha cambiado, revise los datos del contrato.");
            vm.clienteId(antClienteId);
            $("#txtCliente").val(antClienteNombre)
            return;
        }
        cargaAgente(data.comercialId, false);
        vm.agenteId(data.comercialId);
        loadFormasPago(data.formaPagoId);
        //
        loadTiposVia(data.tipoViaId2);
        vm.direccion(data.direccion2);
        vm.codPostal(data.codPostal2);
        vm.poblacion(data.poblacion2);
        vm.provincia(data.provincia2);
        vm.iban(data.iban);
        vm.nombreComercial(data.nombreComercial)
        antClienteId = datos.id;
        antClienteNombre = datos.value;
    });
}

function cambioEmpresa(data) {
    //
    if (!data) {
        return;
    }
    var empresaId = data.id;
    llamadaAjax('GET', "/api/empresas/" + empresaId, null, function (err, data) {
        if (err) return;
    });
}


function cambioTipoProyecto(data) {
    //
    if (!data) {
        return;
    }
    var tipoProyectoId = data.id;
    var arquitectura = false;
    if(vm.stipoContratoId() == 5) arquitectura = true;
    llamadaAjax('GET', myconfig.apiUrl + "/api/tipos_proyectos/" + tipoProyectoId, null, function (err, data) {
        if (err) return;
        llamadaAjax('GET', myconfig.apiUrl + "/api/contratos/siguiente_referencia/" + data.abrev + "/" + arquitectura, null, function (err, nuevaReferencia) {
            if (err) return;
           
            if(vm.stipoContratoId() == 5) {
                var a = spanishDbDate(vm.fechaContrato());
                var y =  moment(a).year().toString();
                y = y.substring(2);
                nuevaReferencia = nuevaReferencia + "-0/" + y
                vm.referencia(nuevaReferencia);
                
                if(vm.porcentajeAgente()) {
                    cargaPorcenRef(vm.porcentajeAgente());
                    return;
                }
            }
            vm.referencia(nuevaReferencia);
        });
    });
}

function cambioTipoContrato(data) {
    //
    if (!data) return;
    var tipoContratoId = data.id;
    if(tipoContratoId == undefined) tipoContratoId = 0;
    var url = "/api/tipos_proyectos/departamento/activos/" + usuario.usuarioId + "/" + vm.stipoContratoId()  + "/" + tipoContratoId;
    llamadaAjax('GET', myconfig.apiUrl + url, null, function (err, data) {
        if (err) return;
        var tipos = [{
            tipoProyectoId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesTipoProyecto(tipos);
        $("#cmbTipoProyecto").val([0]).trigger('change');
    });
}

function loadDepartamento(departamentoId) {
    if(!departamentoId) return;
        llamadaAjax("GET", "/api/departamentos/" + departamentoId, null, function (err, data) {
            if (err) return;
            if(data) {
                vm.stipoContratoId(departamentoId);
                usaCalculadora = data.usaCalculadora;
                if(!data.usaCalculadora) {
                    $('#calculadora').hide();
                    vm.porcentajeAgente(0);
                    vm.porcentajeBeneficio(0);
                    vm.importeAgente(0);
                    vm.importeBeneficio(0);
                } else {
                    $('#calculadora').show();
                }
            }

        });
}


function cambioTextosPredeterminados(data) {
    //
    if (!data) {
        return;
    }
    var textoPredeterminadoId = data.id;
    llamadaAjax('GET', myconfig.apiUrl + "/api/textos_predeterminados/" + textoPredeterminadoId, null, function (err, data) {
        if (err) return;
        var observaciones = ""
        if (vm.observaciones()) observaciones = vm.observaciones();
        observaciones += data.texto;
        vm.observaciones(observaciones);
    });
}

function cambioTextosPredeterminados2(data) {
    //
    if (!data) {
        return;
    }
    var textoPredeterminadoId = data.id;
    llamadaAjax('GET', myconfig.apiUrl + "/api/textos_predeterminados/" + textoPredeterminadoId, null, function (err, data) {
        if (err) return;
        var observaciones = ""
        if (vm.obsFactura()) observaciones = vm.obsFactura();
        observaciones += data.texto;
        vm.obsFactura(observaciones);
    });
}


/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de contratos
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea(); // es un alta
    lineaEnEdicion = false;
    llamadaAjax('GET', "/api/contratos/nextlinea/" + vm.contratoId(), null, function (err, data) {
        if (err) return;
        vm.linea(data);
        vm.total(0);
        vm.totalConIva(0);
    });
}

function limpiaDataLinea(data) {
    vm.contratoLineaId(0);
    vm.capituloLinea('')
    vm.linea('');
    vm.articuloId(null);
    vm.tipoIvaId(null);
    vm.porcentaje(null);
    vm.descripcion(null);
    vm.cantidad(null);
    vm.importe(null);
    vm.costeLinea(null);
    vm.totalLinea(null);
    vm.sgrupoArticuloId(null);
    vm.sarticuloId(null);
    loadGrupoArticulos();
    loadArticulos();
    //
    /* if (vm.sgrupoArticuloId()) {
        loadGrupoArticulos(vm.sgrupoArticuloId());
        var data = {
            id: vm.sgrupoArticuloId()
        };
        cambioGrupoArticulo(data);
    } else {
        loadGrupoArticulos();
        loadArticulos();
    }
 */
    loadTiposIva();
    loadUnidades();
}

var guardarLinea = function () {
    if (!datosOKLineas()) {
        return;
    }
    var data = {
        contratoLinea: {
            contratoLineaId: vm.contratoLineaId(),
            linea: vm.linea(),
            contratoId: vm.contratoId(),
            articuloId: vm.sarticuloId(),
            unidadId: vm.sunidadId(),
            tipoIvaId: vm.tipoIvaId(),
            porcentaje: vm.porcentaje(),
            descripcion: vm.descripcion(),
            cantidad: vm.cantidad(),
            importe: vm.importe(),
            totalLinea: vm.totalLinea(),
            coste: vm.costeLinea(),
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            capituloLinea: vm.capituloLinea(),
        }
    }
    var verboAjax = '';
    var urlAjax = '';
    if (!lineaEnEdicion) {
        verbo = 'POST';
        urlAjax = myconfig.apiUrl + "/api/contratos/lineas";
    } else {
        verbo = 'PUT';
        urlAjax = myconfig.apiUrl + "/api/contratos/lineas/" + vm.contratoLineaId();
    }
    llamadaAjax(verbo, urlAjax, data, function (err, data) {
        if (err) return;
        $('#modalLinea').modal('hide');
        recargaCabeceraLineasBases();
    });
}


function datosOKLineas() {
    $('#linea-form').validate({
        rules: {
            txtCapitulo: {
                required: true
            },
            txtLinea: {
                required: true
            },
            cmbArticulos: {
                required: true
            },
            cmbUnidades: {
                required: true
            },
            cmbTiposIva: {
                required: true
            },
            txtDescripcion: {
                required: true
            },
            txtPrecio: {
                required: true
            },
            txtCantidad: {
                required: true
            },
            txtTotalLinea: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtCapitulo: {
                required: "Debe dar un texto al capítulo"
            },
            cmbUnidades: {
                required: "Debe elegir una unidad"
            },
            cmbArticulos: {
                required: "Debe elegir un articulo"
            },
            cmbTiposIva: {
                required: 'Debe elegir un tipo de IVA'
            },
            txtLinea: {
                required: 'Necesita un número de linea'
            },
            txtDescripcion: {
                required: 'Necesita una descripcion'
            },
            txtCantidad: {
                required: 'Necesita una cantidad'
            },
            txtPrecio: {
                required: 'Necesita un precio'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#linea-form").validate().settings;
    return $('#linea-form').valid();
}

function initTablaContratosLineas() {
    tablaContratosLineas = $('#dt_lineas').DataTable({
        autoWidth: true,
        responsive: true,
        drawCallback: function (oSettings) {
            var api = this.api();
            var rows = api.rows({
                page: 'current'
            }).nodes();
            var last = null;
            api.column(1, {
                page: 'current'
            }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="8">' + group + '</td></tr>'
                    );
                    last = group;
                }
            });
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataContratosLineas,
        columns: [{
            data: "linea"
        }, {
            data: "capituloLinea",
            "visible": false,
            render: function (data, type, row) {
                return "";
            }
        }, {
            data: "unidades"
        }, {
            data: "descripcion",
            render: function (data, type, row) {
                if (data) {
                    return data.replace('\n', '<br/>');
                }

            }
        }, {
            data: "importe",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "cantidad",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "coste",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "contratoLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "";
                if(!vm.contratoCerrado()) bt1 = "<button class='btn btn-circle btn-danger btn-sm' onclick='deleteContratoLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-sm' data-toggle='modal' data-target='#modalLinea' onclick='editContratoLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                if (!vm.generada())
                    html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
    tablaContratosLineas.columns(1).visible(false);
}

function loadDataLinea(data) {
    vm.contratoLineaId(data.contratoLineaId);
    vm.linea(data.linea);
    vm.articuloId(data.articuloId);
    vm.tipoIvaId(data.tipoIvaId);
    vm.porcentaje(data.porcentaje);
    vm.descripcion(data.descripcion);
    vm.cantidad(data.cantidad);
    vm.importe(data.importe);
    vm.totalLinea(data.totalLinea);
    vm.costeLinea(data.coste);
    vm.capituloLinea(data.capituloLinea);
    //
    loadGrupoArticulos(data.grupoArticuloId);
    loadArticulos(data.articuloId);
    loadTiposIva(data.tipoIvaId);
    loadUnidades(data.unidadId);
    //
}



function loadTablaContratoLineas(data) {
    numLineas = data.length;
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    if(!data) numLineas = 0
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasContrato(id) {
    llamadaAjax('GET', "/api/contratos/lineas/" + id, null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        })
        loadTablaContratoLineas(data);
    });
}

function loadArticulos(id) {
    llamadaAjax('GET', "/api/articulos", null, function (err, data) {
        if (err) return;
        var articulos = [{
            articuloId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesArticulos(articulos);
        if (id) {
            $("#cmbArticulos").val([id]).trigger('change');
        } else {
            $("#cmbArticulos").val([0]).trigger('change');
        }
    });
}

function loadGrupoArticulos(id) {
    llamadaAjax('GET', "/api/grupo_articulo", null, function (err, data) {
        if (err) return;
        var grupos = [{
            grupoArticuloId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesGrupoArticulos(grupos);
        if (id) {
            $("#cmbGrupoArticulos").val([id]).trigger('change');
        } else {
            $("#cmbGrupoArticulos").val([0]).trigger('change');
        }
    });
}

function loadUnidades(id) {
    llamadaAjax('GET', "/api/unidades", null, function (err, data) {
        if (err) return;
        var unidades = [{
            unidadId: 0,
            nombre: "  ",
            abrev: "  "
        }].concat(data);
        vm.posiblesUnidades(unidades);
        if (id) {
            $("#cmbUnidades").val([id]).trigger('change');
        } else {
            $("#cmbUnidades").val([0]).trigger('change');
        }
    });
}


function loadTiposIva(id) {
    llamadaAjax('GET', "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{
            tipoIvaId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([0]).trigger('change');
        }
    });
}

function cambioArticulo(data) {
    //
    if (!data) {
        return;
    }
    var articuloId = data.id;
    llamadaAjax('GET', "/api/articulos/" + articuloId, null, function (err, data) {
        if (err) return;
        // cargamos los campos por defecto de receptor
        if (data.descripcion == null) {
            vm.descripcion(data.nombre);
        } else {
            vm.descripcion(data.nombre + ':\n' + data.descripcion);
        }
        vm.cantidad(1);
        vm.importe(data.precioUnitario);
        //valores para IVA por defecto a partir del  
        // articulo seleccionado.
        $("#cmbTiposIva").val([data.tipoIvaId]).trigger('change');
        var data2 = {
            id: data.tipoIvaId
        };
        // poner la unidades por defecto de ese artículo
        $("#cmbUnidades").val([data.unidadId]).trigger('change');
        cambioTiposIva(data2);
        cambioPrecioCantidad();
    });
}

function cambioGrupoArticulo(data) {
    if (!data) return;
    var grupoArticuloId = data.id;
    if (!vm.capituloLinea()) {
        crearTextoDeCapituloAutomatico(grupoArticuloId);
    }
    cargarArticulosRelacionadosDeUnGrupo(grupoArticuloId);
}

var crearTextoDeCapituloAutomatico = function (grupoArticuloId) {
    var numeroCapitulo = Math.floor(vm.linea());
    var nombreCapitulo = "Capitulo " + numeroCapitulo + ": ";
    // ahora hay que buscar el nombre del capitulo para concatenarlo
    llamadaAjax('GET', "/api/grupo_articulo/" + grupoArticuloId, null, function (err, data) {
        if (err) return;
        nombreCapitulo += data.nombre;
        vm.capituloLinea(nombreCapitulo);
    });
}

var cargarArticulosRelacionadosDeUnGrupo = function (grupoArticuloId) {
    llamadaAjax('GET', "/api/articulos/grupo/" + grupoArticuloId, null, function (err, data) {
        if (err) return;
        var articulos = [{
            articuloId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesArticulos(articulos);
    });
}

function cambioTiposIva(data) {
    if (!data) return;
    var tipoIvaId = data.id;
    llamadaAjax('GET', "/api/tipos_iva/" + tipoIvaId, null, function (err, data) {
        if (err) return;
        vm.tipoIvaId(data.tipoIvaId);
        vm.porcentaje(data.porcentaje);
    });
}

var cambioPrecioCantidad = function () {
    vm.costeLinea(vm.cantidad() * vm.importe());
    recalcularCostesImportesDesdeCoste();
    vm.totalLinea(obtenerImporteAlClienteDesdeCoste(vm.costeLinea()));
}

function editContratoLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax('GET', "/api/contratos/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) {
            loadDataLinea(data[0]);
        }
    });
}

function deleteContratoLinea(id) {
    // mensaje de confirmación
    var mensaje = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mensaje, function () {
        // aceptar borra realmente la línea
        var data = {
            contratoLinea: {
                contratoId: vm.contratoId()
            }
        };
        llamadaAjax('DELETE', myconfig.apiUrl + "/api/contratos/lineas/" + id, data, function (err, data) {
            if (err) return;
            recargaCabeceraLineasBases();
        });
    }, function () {
        // cancelar no hace nada
    });
}

var recargaCabeceraLineasBases = function () {
    llamadaAjax('GET', myconfig.apiUrl + "/api/contratos/" + vm.contratoId(), null, function (err, data) {
        if (err) return;
        loadData(data);
        loadLineasContrato(data.contratoId);
        loadBasesContrato(data.contratoId);
        
        recalcularCostesImportesDesdeCoste();
        
    });
}

var recargaLineasBases = function () {
    llamadaAjax('GET', myconfig.apiUrl + "/api/contratos/" + vm.contratoId(), null, function (err, data) {
        if (err) return;
        loadLineasContrato(data.contratoId);
        loadBasesContrato(data.contratoId);
    });
}

/*
    Funciones relacionadas con la gestión de bases
    y cuotas
*/

function initTablaBases() {
    tablaCarro = $('#dt_bases').dataTable({
        autoWidth: true,
        responsive: true,
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataBases,
        columns: [{
            data: "tipo"
        }, {
            data: "porcentaje",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "base",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "cuota",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }]
    });
}


function loadTablaBases(data) {
    var dt = $('#dt_bases').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function loadBasesContrato(id) {
    llamadaAjax('GET', "/api/contratos/bases/" + id, null, function (err, data) {
        if (err) return;
        // actualizamos los totales
        var t1 = 0; // total sin iva
        var t2 = 0; // total con iva
        for (var i = 0; i < data.length; i++) {
            t1 += data[i].base;
            t2 += data[i].base + data[i].cuota;
        }
        vm.total(numeral(t1).format('0,0.00'));
        vm.totalConIva(numeral(t2).format('0,0.00'));
        loadTablaBases(data);
    })
}

// ----------- Funciones relacionadas con el manejo de autocomplete

var cargaCliente = function (id) {
    if (!id) return;
    llamadaAjax('GET', "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.clienteId(data.clienteId);
        vm.nombreCliente(data.nombre);
        vm.nombreComercial(data.nombreComercial);
        vm.iban(data.iban);
        antClienteId = data.clienteId;
        antClienteNombre = data.nombre;
    });
};

var cargaMantenedor = function (id) {
    if (!id) return;
    llamadaAjax('GET', "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtMantenedor').val(data.nombre);
        vm.mantenedorId(id);
    });
};

var cargaAgente = function (id, encarga) {
    llamadaAjax('GET', "/api/comerciales/" + id, null, function (err, data) {
        if (err) return;
        $('#txtAgente').val(data.nombre);
        vm.agenteId(data.comercialId);
        if(!encarga) {
            obtenerPorcentajeDelAgenteColaborador(vm.agenteId(), vm.clienteId(), vm.sempresaId(), vm.stipoContratoId(), function (err, comision) {
                if (err) return;
                //var por = vm.porcentajeAgente()
                if(!comision) comision = 0;
                vm.porcentajeAgente(comision);
                //if(por == 0 && contratoId != 0) { vm.porcentajeAgente(0)}
                if(!usaCalculadora) vm.porcentajeAgente(0);
                if(vm.stipoContratoId() == 5) cargaPorcenRef(comision);
            });
        }
        if(contratoId != 0) {
                    
        } else {
            recalcularCostesImportesDesdeCoste();
        }
    });
};

var initAutoCliente = function () {
    vm.clienteId(null);
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            llamadaAjax('GET', "/api/clientes/clientes_activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.clienteId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.clienteId(ui.item.id);
         
            cambioCliente(ui.item);
        }
    });
    // regla de validación para el  inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.clienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};

var initAutoMantenedor = function () {
    $("#txtMantenedor").autocomplete({
        source: function (request, response) {
            llamadaAjax('GET', "/api/clientes/mantenedores_activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.clienteId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.mantenedorId(ui.item.id);
            recalcularCostesImportesDesdeCoste();
        }
    });
    // regla de validación para el  inicializado
    jQuery.validator.addMethod("mantenedorNecesario", function (value, element) {
        var r = false;
        if (vm.mantenedorId()) r = true;
        return r;
    }, "Debe seleccionar un mantenedor válido");
};

var initAutoAgente = function () {
    $("#txtAgente").autocomplete({
        source: function (request, response) {
            llamadaAjax('GET', "/api/comerciales/agentes_activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.comercialId,
                        porcentajeAgente: d.porcentajeComision
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.agenteId(ui.item.id);
            obtenerPorcentajeDelAgenteColaborador(vm.agenteId(), vm.clienteId(), vm.sempresaId(), vm.stipoContratoId(), function (err, comision) {
                if (err) return;
                if(!comision) comision = 0;
                vm.porcentajeAgente(comision);
                if(!usaCalculadora) vm.porcentajeAgente(0);
                recalcularCostesImportesDesdeCoste();

                if(vm.stipoContratoId() == 5) {
                    cargaPorcenRef(comision);
                 }
            });
        }
    });
    // regla de validación para el  inicializado
    jQuery.validator.addMethod("agenteNecesario", function (value, element) {
        var r = false;
        if (vm.agenteId()) r = true;
        return r;
    }, "Debe seleccionar un agente válido");
};

var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    if(vm.porcentajeBeneficio() != vm.antPorcentajeBeneficio() || vm.porcentajeAgente() != vm.antPorcentajeAgente()) {
        $('#btnNuevaLinea').prop('disabled', true);
        $('#btnAceptarLinea').prop('disabled', true)
    } else {
        $('#btnNuevaLinea').prop('disabled', false);
        $('#btnAceptarLinea').prop('disabled', false)
    }
    
};


var recalcularCostesImportesDesdeCoste = function () {
    if (!vm.coste()) vm.coste(0);
    if (!vm.porcentajeAgente()) vm.porcentajeAgente(0);
    if (vm.coste() != null) {
        if (vm.porcentajeBeneficio())  {
            vm.importeBeneficio(vm.porcentajeBeneficio() * vm.coste() / 100);
        }
        if(!vm.porcentajeBeneficio()) {
            vm.porcentajeBeneficio(0);
            vm.importeBeneficio(0);
        }
        var imp = vm.importeBeneficio();
        if(imp == undefined) vm.importeBeneficio(0);
        vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
    }
    //if(!usaCalculadora) vm.porcentajeAgente(0);
    if  (vm.porcentajeAgente() != null) {
        vm.importeCliente(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100));
        vm.importeAgente(vm.importeCliente() * (vm.porcentajeAgente() / 100));
    }
    //if (!usaCalculadora) vm.importeAgente(0);//si no se usa calculadora el imporrte del agente es 0
    vm.importeCliente(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    if (vm.mantenedorId()) {
        vm.importeMantenedor(vm.importeCliente() - vm.ventaNeta() + vm.importeBeneficio());
        vm.importeMantenedor(roundToTwo(vm.importeMantenedor()));
    }

     
    vm.importeCliente(roundToTwo(vm.importeCliente()));
    vm.importeClienteFormat(numeral(vm.importeCliente()).format('0,0.00'));
    vm.importeBeneficio(roundToTwo(vm.importeBeneficio()));
    vm.ventaNeta(roundToTwo(vm.ventaNeta()));
    vm.importeAgente(roundToTwo(vm.importeAgente()));
    vm.porcentajeBeneficio(roundToSix(vm.porcentajeBeneficio()));
};

var calcularInverso = function(carga) {
    if(!carga) {
        if(!vm.importeCliente()) vm.importeCliente(0)
        if(!vm.porcentajeAgente()) vm.porcentajeAgente(0);
    
        if(!vm.porcentajeBeneficio()) {
            vm.importeBeneficio(0);
            vm.porcentajeBeneficio(0);
        }
    
    }
   
    if  (vm.porcentajeAgente() != null) {
        vm.importeAgente(vm.importeCliente() * (vm.porcentajeAgente() / 100));
        vm.ventaNeta(vm.importeCliente()-vm.importeAgente());
    }
    if (vm.porcentajeBeneficio() != null)  {
        vm.coste(vm.ventaNeta()/((vm.porcentajeBeneficio()/100)+1));
        vm.importeBeneficio(vm.ventaNeta()-vm.coste());
    }

    if (vm.mantenedorId()) {
        vm.importeMantenedor(vm.importeCliente() - vm.ventaNeta() + vm.importeBeneficio());
        vm.importeMantenedor(roundToTwo(vm.importeMantenedor()));
    }

    vm.coste(roundToFour(vm.coste()));
    vm.importeBeneficio(roundToTwo(vm.importeBeneficio()));
    vm.ventaNeta(roundToTwo(vm.ventaNeta()));
    vm.importeAgente(roundToTwo(vm.importeAgente()));
}



var recalcularCostesImportesDesdeBeneficio = function () {
    if (vm.porcentajeBeneficio() && vm.coste()) {
        if (vm.importeBeneficio()) {
            vm.porcentajeBeneficio(roundToSix(((100 * vm.importeBeneficio()) / vm.coste())));
        }
    }
    recalcularCostesImportesDesdeCoste();
};

var actualizarLineasDeLaContratoTrasCambioCostes = function (done) {
    llamadaAjax('PUT',
        "/api/contratos/recalculo/" + vm.contratoId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente(),
        null,
        function (err, data) {
            if (err) return errorGeneral(err, done);
            done(null, 'OK');
        });
};

var recalcularImportesGuardar = function(done) {
        llamadaAjax('GET', "/api/contratos/lineas/" + vm.contratoId(), null, function (err, data) {
            if (err) return errorGeneral(err, done);
            var totalCoste = 0;
            data.forEach(function (linea) {
                totalCoste += (linea.coste * linea.cantidad);
                vm.totalCoste(numeral(totalCoste).format('0,0.00'));
            })
            llamadaAjax('GET', "/api/contratos/bases/" + vm.contratoId(), null, function (err, data) {
                if (err) return errorGeneral(err, done);
                // actualizamos los totales
                var t1 = 0; // total sin iva
                var t2 = 0; // total con iva
                for (var i = 0; i < data.length; i++) {
                    t1 += data[i].base;
                    t2 += data[i].base + data[i].cuota;
                }
                vm.total(numeral(t1).format('0,0.00'));
                vm.totalConIva(numeral(t2).format('0,0.00'));
                vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
                done(null, 'OK')
            })
        });
}

var ocultarCamposContratosGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}
var obtenerImporteAlClienteDesdeCoste = function (coste) {
    if(usaCalculadora == 0) return coste;
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = vm.porcentajeBeneficio() * coste / 100;
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente()) {
        importeCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = importeCliente * (vm.porcentajeAgente() / 100);
    } 
    importeCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));

    return importeCliente;
}
var cargaPorcenRef = function(comision) {
    if(!comision) comision = 0;
    var ref = vm.referencia();
    if(ref && ref != '') {
        ref = ref.toString();
        var com = comision.toString();
        ref = ref.replace(/-[0-9]*\//, "-" + com + "/");
        vm.referencia(ref);
    }
}
/* var imprimir = function () {
    guardarContrato(function (err) {
        if (err) return;
        printContrato(vm.contratoId());
    })
}

function printContrato(id) {
    llamadaAjax('GET', myconfig.apiUrl + "/api/informes/contratos/" + id, null, function (err, data) {
        if (err) return;
        informePDF(data);
    });
}

function informePDF(data) {
    var shortid = "rySBxKzIe";
    var data = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
} */

/* var f_open_post = function (verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_blank";

    var input = document.createElement("textarea");
    input.name = "template[shortid]";
    input.value = data.template.shortid;
    form.appendChild(input);

    input = document.createElement("textarea");
    input.name = "data";
    input.value = JSON.stringify(data.data);
    form.appendChild(input);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
}; */

var apiReport = function (verb, url, data) {
    $.ajax({
        type: verb,
        url: url,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            var a = 1;
        },
        error: function (err) {
            //mensErrorAjax(err);
            var file = new Blob([err.responseText], {
                type: 'application/pdf'
            });
            var fileURL = URL.createObjectURL(file);
            //var base64EncodedPDF = window.btoa(err.responseText);
            window.open("data:application/pdf " + err.responseText);
            //window.open(fileURL);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

/*----------------------------------------------------------
    Funciones relacionadas con las lineas de colaboradores
    comisionistas 
 -----------------------------------------------------------*/
function nuevoComisionista() {
    limpiaComisionista(); // es un alta
    lineaEnEdicion = false;
}

function aceptarComisionista() {
    if (!datosOKComisionistas()) {
        return;
    }
   
    if (!vm.contratoComisionistaId()) {
        // es alta
        vm.contratoComisionistaId(0);
    }
    var data = {
        contratoComisionista: {
            contratoComisionistaId: vm.contratoComisionistaId(),
            contratoId: vm.contratoId(),
            comercialId: vm.scomercialId(),
            porcentajeComision: vm.porcentajeComision()
        }
    }
    if (!lineaEnEdicion) {
        data.contratoComisionista.contratoComisionistaId = 0;
        llamadaAjax('POST', myconfig.apiUrl + "/api/contratos/comisionista/comprueba/tipo", data, function (err, data) {
            if (err) return;
            $('#modalComisionista').modal('hide');
            loadComisionistas(vm.clienteId());
        });
    } else {
        llamadaAjax('PUT', myconfig.apiUrl + "/api/contratos/comisionista/" + vm.contratoComisionistaId(), data, function (err, data) {
            if (err) return;
            $('#modalComisionista').modal('hide');
            loadComisionistas(vm.clienteId());
        });
    }
}

function datosOKComisionistas() {
    $('#comisionista-form').validate({
        rules: {
            cmbComerciales: {
                required: true
            },
            txtPorComer: {
                required:true,
                number: true
            }
        },
        // Messages for form validation
        messages: {
            cmbComerciales: {
                required: "Debe elegir un colaborador"
            },
            txtPorComer: {
                number: "Debe ser un número válido",
                required: "Debe elegir un porcentaje"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#comisionista-form").validate().settings;
    return $('#comisionista-form').valid();
}

function initTablaComisionistas() {
    tablaCarro = $('#dt_comisiones').dataTable({
        autoWidth: true,
        responsive: true,
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataComisionistas,
        columnDefs: [{
            "width": "20%",
            "targets": 2
        }],
        columns: [{
            data: "colaborador"
        }, {
            data: "porcentajeComision",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "contratoComisionistaId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!vm.contratoCerrado())  bt1 = "<button  class='btn btn-circle btn-danger btn-sm' onclick='deleteComisionista(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-sm' data-toggle='modal' data-target='#modalComisionista' onclick='editComisionista(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function editComisionista(id) {
    lineaEnEdicion = true;
    $.ajax({
        type: "GET",
        url: "/api/contratos/comisionista/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if (data) {
                loadComisionista(data);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function deleteComisionista(id) {
    var mensaje = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mensaje, function () {
        // aceptar borra realmente la línea
        var data = {
            contratoComisionista: {
                contratoComisionistaId: id
            }
        };
        llamadaAjax('DELETE', myconfig.apiUrl + "/api/contratos/comisionista/" + id, data, function (err, data) {
            if (err) return;
            loadComisionistas(vm.clienteId());
        });
    }, function () {
        // cancelar no hace nada
    });
}

function loadComisionista(data) {
    vm.contratoComisionistaId(data.contratoComisionistaId);
    vm.contratoId(data.contratoId);
    vm.scomercialId(data.comercialId);
    vm.porcentajeComision(data.porcentajeComision);
    //
    loadComerciales(data.comercialId);
}

function limpiaComisionista(data) {
    vm.contratoComisionistaId(0);
    vm.scomercialId(null);
    vm.porcentajeComision(null);
    loadComerciales(0);
}

function loadTablaComisionistas(data) {
    var dt = $('#dt_comisiones').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data) dt.fnAddData(data);
    dt.fnDraw();
}

function loadComisionistas(id) {
    llamadaAjax('GET', "/api/contratos/comisionistas/" + vm.contratoId(), null, function (err, data) {
        if (err) return;
        loadTablaComisionistas(data);
    });
}

function buscaComisionistas(id) {
    var encontrado = false;
    llamadaAjax('GET', "/api/contratos/comisionistas/" + vm.contratoId(), null, function (err, data1) {
        if (err) return;
        if(data1) {
            llamadaAjax('GET', "/api/contratos/colaborador/asociado/defecto/" + vm.agenteId() + "/" + vm.sempresaId() + "/" + vm.tipoContratoId(), null, function (err, data2) {
                if (err) return;
                if(data2.length  > 0) {
                    for(var i = 0; i< data1.length; i++){
                        if(data1[i].comercialId == data2[0].ascComercialId){
                            encontrado = true;
                        }
                    }
                    
                    if(!encontrado && cmd == "NEW" && data2[0]){
                        if(data2[0].ascComercialId) {
                            var data = {
                                contratoComisionista: {
                                    contratoId: vm.contratoId(),
                                    comercialId: data2[0].ascComercialId,
                                    porcentajeComision: data2[0].porcomer,
                                }
                            }
                            llamadaAjax('POST', myconfig.apiUrl + "/api/contratos/comisionista" , data, function (err, data) {
                                if (err) return;
                                loadComisionistas(vm.contratoId());
                            });
                        }
                    }else {
                        loadComisionistas(vm.contratoId());
                    }
                } else {
                    loadComisionistas(vm.contratoId());
                }
            });
        }
    });
}

function loadComerciales(id) {
    llamadaAjax('GET', "/api/comerciales/comerciales_activos", null, function (err, data) {
        if (err) return;
        var comerciales = [{
            comercialId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesComerciales(comerciales);
        $("#cmbComerciales").val([id]).trigger('change');
    });
}

function cambioComercial(data) {
    //
    if (!data) {
        return;
    }
    var comercialId = data.id;
    // hay que buscar el porcentaje
    obtenerPorcentajeDelAgenteColaborador(comercialId, vm.clienteId(), vm.sempresaId(), vm.stipoContratoId(), function (err, comision) {
        if (err) return;
        if(!comision) {
            mensError('El colaborador asociado no tiene una comision por defecto');
            comision = 0
        } 
        vm.porcentajeComision(comision);
        recalcularCostesImportesDesdeCoste();
        //recalcularCostesImportesDesdeCoste();
    });
}

/*----------------------------------------------------------
    Funciones relacionadas con la generación de prefacturas
 -----------------------------------------------------------*/

var loadPeriodosPagos = function (periodoPagoId) {
    var periodosPagos = [{
        periodoPagoId: 0,
        nombre: ""
    },
    {
        periodoPagoId: 1,
        nombre: "Anual"
    },
    {
        periodoPagoId: 2,
        nombre: "Semestral"
    },
    {
        periodoPagoId: 5,
        nombre: "Cuatrimestral"
    },
    {
        periodoPagoId: 3,
        nombre: "Trimestral"
    },
    {
        periodoPagoId: 4,
        nombre: "Mensual"
    },
    {
        periodoPagoId: 6,
        nombre: "Puntual"
    }
    ];
    vm.posiblesPeriodosPagos(periodosPagos);
    $("#cmbPeriodosPagos").val([periodoPagoId]).trigger('change');
    $("#cmbPeriodosPagos2").val([periodoPagoId]).trigger('change');
}

var generarPrefacturas = function () {
   /*  if(importePrefacturas > vm.importeCliente()) {
        mensError("Ya se ha prefacturado el total del contrato");
        setTimeout(function(){ $('#modalGenerarPrefacturas').modal('hide');; }, 100);
        return;
    }
 */
    var resto = 0;
    $("#cmbPeriodosPagos").select2(select2Spanish());
    $("#cmbPeriodosPagos2").select2(select2Spanish());
    loadPeriodosPagos(vm.speriodoPagoId());
    $("#cmbPeriodosPagos").select2().on('change', function (e) {
        cambioPeriodosPagos(e.added);
    });
    $("#cmbPeriodosPagos2").select2().on('change', function (e) {
        cambioPeriodosPagosPlanificacion(e.added);
    });
    if (vm.mantenedorId()) {
        var importeMantenedor = vm.importeMantenedor();
        resto = importeMantenedor - importePrefacturasConcepto;
        vm.importeAFacturar(roundToSix(resto));
    } else {
        var importeCliente = vm.importeCliente();
        resto = importeCliente - importePrefacturasConcepto;
        vm.importeAFacturar(roundToSix(resto));
    }
    //si no hay fecha de primera factura establecemos la del día de hoy
    if(!vm.fechaPrimeraFactura()) {
        var f = new Date();
        f = moment(f).format('DD/MM/YYYY');
        vm.fechaPrimeraFactura(f);
    }
    $("#generar-prefacturas-form").submit(function () {
        return false;
    });
    $("#generar-prefacturas-form-planificacion").submit(function () {
        return false;
    });
}

var generarPrefacturasPlanificacion = function (data) {
     var resto = data[0].importe;
     vm.importeAFacturar(roundToSix(resto));
     $("#cmbPeriodosPagos2").select2(select2Spanish());
     loadPeriodosPagos(vm.speriodoPagoId());
     $("#cmbPeriodosPagos2").select2().on('change', function (e) {
         cambioPeriodosPagosPlanificacion(e.added);
     });
    
    
     if(vm.fechaPlanificacionObras2()) {
        vm.fechaPrimeraFactura(vm.fechaPlanificacionObras2());
     }
     else if(!vm.fechaPrimeraFactura()) {
         var f = new Date();
         f = moment(f).format('DD/MM/YYYY');
         vm.fechaPrimeraFactura(f);
     }
     $("#generar-prefacturas-form-planificacion").submit(function () {
         return false;
     });
 }

var cambioPeriodosPagos = function (data) {
    vm.numPagos(calcularNumPagos());
}

var cambioPeriodosPagosPlanificacion = function (data) {
    vm.numPagos(calcularNumPagosPlanificacion());
}

var obtenerDivisor = function () {
    var divisor = 1;
    switch (vm.speriodoPagoId()) {
        case 1:
            divisor = 12;
            break;
        case 2:
            divisor = 6;
            break;
        case 3:
            divisor = 3;
            break;
        case 4:
            divisor = 1;
            break;
        case 5:
            divisor = 4;
            break;
        case 6:
            divisor = 0;
            break;
    }
    return divisor;
}

var verPrefacturasAGenerar = function () {
    if (!generarPrefacturasOK()) return;

    //comprobamos que le cliente tenga un nombre comercial
    var d = vm.nombreComercial();
    if(!d || d == '') return mensError("El cliente no tiene un nombre fiscal establecido en su ficha.");
    
    // comprobamos si es de mantenedor o cliente final.
    var importe = vm.importeCliente(); // importe real de la factura;
    var importeAlCliente = vm.importeCliente(); // importe al cliente final;
    var clienteId = vm.clienteId();
    var cliente = vm.nombreComercial();
    var empresa = $("#cmbEmpresas").select2('data').text;
    // si es un mantenedor su importe de factura es el calculado para él.
    if (vm.mantenedorId()) {
        importe = vm.importeMantenedor();
        clienteId = vm.mantenedorId();
        cliente = $("#txtMantenedor").val();
    }
    if(numConceptos > 0 && importePrefacturas == 0) {
        var prefacturas = crearPrefacturasConceptos(importe, importeAlCliente, vm.coste(), spanishDbDate(dataConceptos[0].fecha), spanishDbDate(vm.fechaSiguientesFacturas()), numConceptos, vm.sempresaId(), clienteId, empresa, cliente, null);
    } else {
        var divisor = (importe - importePrefacturasConcepto) / importe;
        var coste = vm.coste() * divisor;
        var prefacturas = crearPrefacturasRestoDepartamentos(importe - importePrefacturasConcepto, importeAlCliente - importePrefacturasConcepto, coste, spanishDbDate(vm.fechaPrimeraFactura()), spanishDbDate(vm.fechaSiguientesFacturas()), calcularNumPagos(), vm.sempresaId(), clienteId, empresa, cliente);
    }
    vm.prefacturasAGenerar(prefacturas);
    loadTablaGenerarPrefacturas(prefacturas);
}

var verPrefacturasAGenerarPlanificacion = function () {
    if (!generarPrefacturasOK()) return;

    //comprobamos que le cliente tenga un nombre comercial
    var d = vm.nombreComercial();
    if(!d || d == '') return mensError("El cliente no tiene un nombre fiscal establecido en su ficha.");
    
    // comprobamos si es de mantenedor o cliente final.
    var importe = vm.importeAFacturar(); // importe real de la factura;
    var importeAlCliente = vm.importeAFacturar(); // importe al cliente final;
    var clienteId = vm.clienteId();
    var cliente = vm.nombreComercial();
    var empresa = $("#cmbEmpresas").select2('data').text;
    // si es un mantenedor su importe de factura es el calculado para él.
    if (vm.mantenedorId()) {
        importe = vm.importeMantenedor();
        clienteId = vm.mantenedorId();
        cliente = $("#txtMantenedor").val();
    }
    var divisor = importe / vm.importeCliente();
    var coste = vm.coste() * divisor;
    var porRetenGarantias = RegPlanificacion[0].porRetenGarantias;
    var prefacturas = crearPrefacturas2(importe, importeAlCliente, coste, spanishDbDate(vm.fechaPrimeraFactura()), porRetenGarantias, $('#txtNumPagos').val(), vm.sempresaId(), clienteId, empresa, cliente);
    
    vm.prefacturasAGenerar(prefacturas);
    loadTablaGenerarPrefacturasPlanificacion(prefacturas);
}

var aceptarGenerarPrefacturas = function () {
    if (!generarPrefacturasOK()) return;
    if (vm.prefacturasAGenerar().length == 0) {
        return;
    }
    $('#btnAceptarGenerarPrefacturas').prop('disabled', true);
    var data = {
        prefacturas: vm.prefacturasAGenerar(),
    };
  
        controlDePrefacturasYaGeneradas(vm.contratoId(), function (err, result) {
            if (err) return;
            if (!result) {
                $('#modalGenerarPrefacturas').modal('hide');
                return;
            }
            llamadaAjax('POST', myconfig.apiUrl + "/api/contratos/generar-prefactura/" + vm.contratoId(), data, function (err) {
                if (err){
                    $('#btnAceptarGenerarPrefacturas').prop('disabled', false);
                    return;
                }
                $('#btnAceptarGenerarPrefacturas').prop('disabled', false);
                mostrarMensajeSmart('Prefacturas creadas correctamente. Puede consultarlas en la solapa correspondiente.');
                $('#modalGenerarPrefacturas').modal('hide');
                loadPrefacturasDelContrato(vm.contratoId());
            });
        });
    
}

var aceptarGenerarPrefacturaPlanificacion = function () {
    if (vm.prefacturasAGenerar().length == 0) {
        return;
    }
    var data = {
        prefacturas: vm.prefacturasAGenerar(),
    };
  
    controlDePrefacturasYaGeneradasPlanificacion(vm.contratoId(),  RegPlanificacion[0].contPlanificacionId, function (err, result) {
            if (err) return;
            if (!result) {
                $('#modalGenerarPrefacturas').modal('hide');
                return;
            }
            llamadaAjax('POST', myconfig.apiUrl + "/api/contratos/generar-prefactura/" + vm.contratoId(), data, function (err) {
                if (err){
                    mensError('Error al crear la prefactura');
                    return;
                }
                mostrarMensajeSmart('Prefacturas creadas correctamente. Puede consultarlas en la solapa correspondiente.');
                $('#modalGenerarPrefacturas').modal('hide');
                loadPrefacturasDelContrato(vm.contratoId());
                actualizaCobrosPlanificacion(vm.contratoId());
            });
    });
    
}

var aceptarGenerarPrefacturasPlanificacion = function () {
    if (!generarPrefacturasOK()) return;
    if (vm.prefacturasAGenerar().length == 0) {
        return;
    }
    $('#btnAceptarGenerarPrefacturasPlanificacion').prop('disabled', true);
    var data = {
        prefacturas: vm.prefacturasAGenerar(),
    };
        controlDePrefacturasYaGeneradasPlanificacion(vm.contratoId(), RegPlanificacion[0].contPlanificacionId, function (err, result) {
            if (err) return;
            if (!result) {
                $('#modalGenerarPrefacturasPlanificacion').modal('hide');
                return;
            }
            llamadaAjax('POST', myconfig.apiUrl + "/api/contratos/generar-prefactura/" + vm.contratoId(), data, function (err) {
                if (err){
                    $('#btnAceptarGenerarPrefacturasPlanificacion').prop('disabled', false);
                    return;
                }
                $('#btnAceptarGenerarPrefacturasPlanificacion').prop('disabled', false);
                mostrarMensajeSmart('Prefacturas creadas correctamente. Puede consultarlas en la solapa correspondiente.');
                $('#modalGenerarPrefacturasPlanificacion').modal('hide');
                loadPrefacturasDelContrato(vm.contratoId());
                actualizaCobrosPlanificacion(vm.contratoId());
                limpiarModalGenerarPrefacturasObras();
            });
        });
}

var aceptarModificarPrefacturas = function () {
    //primero borramos la prefactura
    llamadaAjax('DELETE', myconfig.apiUrl + "/api/contratos/borrar-prefactura/concepto/" + vm.contratoPorcenId(), null, function (err) {
        if (err) return;
        //una vez borrada borramos todas las prefacturas del contrato no generadas mediante conceptos y porcentajes
        llamadaAjax('DELETE', myconfig.apiUrl + "/api/contratos/borrar-prefacturas/concepto/todas/" + vm.contratoId(), null, function (err) {
            if (err) return;
            //una vez borrada la volvemos a crear con los parametros modificados
            aceptarGenerarPrefacturas();
        });
    });
}

var generarPrefacturasOK = function () {
    $('#generar-prefacturas-form').validate({
        rules: {
            cmbPeriodosPagos: {
                required: true
            },
            txtGFechaInicio: {
                required: true
            },
            txtGFechaFinal: {
                required: true,
                fechaFinalSuperiorAInicial: true
            },
            txtGFechaPrimeraFactura: {
                required: true
            },
           /*  txtGFechaUltimaFactura: {
                required: true
            } */
        },
        // Messages for form validation
        messages: {
            cmbPeriodosPagos: {
                required: "Debe elegir un periodo"
            },
            txtGFechaInicio: {
                number: "Debe elegir una fecha"
            },
            txtGFechaFinal: {
                required: "Debe elegir una fecha"
            },
            txtGFechaPrimeraFactura: {
                required: "Debe elegir una fecha"
            },
            /* txtGFechaUltimaFactura: {
                required: "Debe elegir una fecha"
            } */
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    // var opciones = $("#generar-prefacturas-form").validate().settings;
    return $('#generar-prefacturas-form').valid();
}

var generarPrefacturasPlanificacionOK = function () {
    $('#generar-prefacturas-form-planificacion').validate({
        rules: {
            cmbPeriodosPagos2: {
                required: true
            },
            txtGFechaPrimeraFactura2: {
                required: true
            },
           /*  txtGFechaUltimaFactura: {
                required: true
            } */
        },
        // Messages for form validation
        messages: {
            cmbPeriodosPagos2: {
                required: "Debe elegir un periodo"
            },
            txtGFechaPrimeraFactura2: {
                required: "Debe elegir una fecha"
            },
            /* txtGFechaUltimaFactura: {
                required: "Debe elegir una fecha"
            } */
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    // var opciones = $("#generar-prefacturas-form").validate().settings;
    return $('#generar-prefacturas-form-planificacion').valid();
}

var controlDePrefacturasYaGeneradas = function (contratoId, done) {
    llamadaAjax('GET', myconfig.apiUrl + "/api/prefacturas/contrato/generadas/" + contratoId, null, function (err, data) {
        if (err) return done(err);
        if (data.length == 0) return done(null, true);
        var mensaje = "Ya hay prefacturas generadas para este contrato. ¿Desea borrarlas y volverlas a generar?";
        mensajeAceptarCancelar(mensaje, function () {
            llamadaAjax('DELETE', myconfig.apiUrl + "/api/prefacturas/contrato/generadas/" + contratoId, null, function (err, data) {
                if (err) return done(err);
                done(null, true);
            });
        }, function () {
            done(null, false);
        });
    });
}

var controlDePrefacturasYaGeneradasPlanificacion = function (contratoId, contPlanificacionId, done) {
    llamadaAjax('GET', myconfig.apiUrl + "/api/prefacturas/contrato/generadas/planificacion/" + contratoId + "/" + contPlanificacionId, null, function (err, data) {
        if (err) return done(err);
        if (data.length == 0) return done(null, true);
        var mensaje = "Ya hay prefacturas generadas para este contrato. ¿Desea borrarlas y volverlas a generar?";
        //sumamos los importes que se van a eliminar
        var importe = 0
        data.forEach(function (pf) {
            importe = importe + pf.totalAlCliente;
        });
        var datos = {
            importe: importe
        }
        mensajeAceptarCancelar(mensaje, function () {
            llamadaAjax('DELETE', myconfig.apiUrl + "/api/prefacturas/contrato/generadas/planificacion/" + contratoId + "/" + contPlanificacionId, datos, function (err, data) {
                if (err) return done(err);
                done(null, true);
            });
        }, function () {
            done(null, false);
        });
    });
}

function crearPrefacturas(importe, importeAlCliente, coste, fechaInicial, fechaSiguientesFacturas, numPagos, empresaId, clienteId, empresa, cliente) {
   
    var divisor = obtenerDivisor();
    // si hay parcial el primer pago será por la diferencia entre el inicio de contrato y el final
    // de mes 
    var inicioContrato = new Date(spanishDbDate(vm.fechaInicio()));
    var iniContrato = moment(inicioContrato).format('YYYY-MM-DD');
    var finMesInicioContrato = moment(inicioContrato).endOf('month');
    var diffDias = finMesInicioContrato.diff(inicioContrato, 'days');

    var importePagoCliente = roundToSix(importeAlCliente / numPagos);
    var importeCoste = roundToSix(coste / numPagos);

    // como la división puede no dar las cifras hay que calcular los restos.
    var restoImportePago = importe - (importePago * numPagos);
    var restoImportePagoCliente = importeAlCliente - (importePagoCliente * numPagos);
    var restoImporteCoste = coste - (importeCoste * numPagos);

    var import1 = (importePago / 30) * diffDias;
    var import11 = (importePagoCliente / 30) * diffDias;
    var import12 = (importeCoste / 30) * diffDias;
    var import2 = importePago - import1;
    var import21 = importePagoCliente - import11;
    var import22 = importeCoste - import12;
    var pagos = [];
    for (var i = 0; i < numPagos; i++) {
        var f = moment(fechaSiguientesFacturas).add(i * divisor, 'month').format('DD/MM/YYYY');
        if (i == 0) {
            f = moment(fechaInicial).add(i * divisor, 'month').format('DD/MM/YYYY');
        }
        var p = {
            fecha: f,
            importe: importePago,
            importeCliente: importePagoCliente,
            importeCoste: importeCoste,
            empresaId: empresaId,
            clienteId: clienteId,
            retenGarantias: 0,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            empresa: empresa,
            cliente: cliente,
            periodo: moment(f, 'DD/MM/YYYY').add(-1, 'month').format('DD/MM/YYYY') + "-" + f
        };
        if (vm.facturaParcial() && i == 0) {
            p.importe = import1;
            p.importeCliente = import11;
            p.importeCoste = import12;
            p.periodo = moment(iniContrato).format('DD/MM/YYYY') + "-" + moment(fechaInicial).add(i * divisor, 'month').format('DD/MM/YYYY');
        }
        pagos.push(p);
    }
    if (vm.facturaParcial()) {
        var f = moment(fechaInicial).add(numPagos * divisor, 'month').format('DD/MM/YYYY');
        var p = {
            fecha: f,
            importe: import2,
            importeCliente: import21,
            importeCoste: import22,
            empresaId: empresaId,
            retenGarantias: 0,
            clienteId: clienteId,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            empresa: empresa,
            cliente: cliente,
            periodo: moment(iniContrato).add(i * divisor, 'month').format('DD/MM/YYYY') + "-" + moment(iniContrato).add(((i + 1) * divisor), 'month').format('DD/MM/YYYY')
        };
        pagos.push(p);
    }
    if (pagos.length > 1) {
        // en la última factura ponemos los restos
        pagos[pagos.length - 1].importe = pagos[pagos.length - 1].importe + restoImportePago;
        pagos[pagos.length - 1].importeCliente = pagos[pagos.length - 1].importeCliente + restoImportePagoCliente;
        pagos[pagos.length - 1].importeCoste = pagos[pagos.length - 1].importeCoste + restoImporteCoste;
        var mperiodo = pagos[pagos.length - 1].periodo;
        var mperiodo2 = pagos[pagos.length - 2].periodo;
        var p1 = mperiodo.split('-')[0];
        var p2 = mperiodo2.split('-')[1];
        pagos[pagos.length - 1].periodo = p2 + "-" + p1;
    }
    return pagos;
}



function initTablaGenerarPrefacturas() {
    tablaGenerarPrefcaturas = $('#dt_generar_prefacturas').dataTable({
        bSort: false,
        autoWidth: true,
        responsive: true,
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataGenerarPrefacturas,
        columnDefs: [{
            "width": "20%",
            "targets": [2, 3]
        }],
        columns: [{
            data: "fecha"
        },{
            data: "importeCoste",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "importe",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "empresa",
            className: "text-center"
        }, {
            data: "cliente",
            className: "text-center"
        }, {
            data: "periodo",
            className: "text-center"
        }]
    });
}

function loadTablaGenerarPrefacturas(data) {
    var dt = $('#dt_generar_prefacturas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function initTablaGenerarPrefacturasPlanificacion() {
    tablaGenerarPrefcaturas = $('#dt_generar_prefacturas2').dataTable({
        bSort: false,
        autoWidth: true,
        responsive: true,
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataGenerarPrefacturas,
        columnDefs: [{
            "width": "20%",
            "targets": [2, 3]
        }],
        columns: [{
            data: "fecha"
        },{
            data: "importeCoste",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "importe",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "empresa",
            className: "text-center"
        }, {
            data: "cliente",
            className: "text-center"
        }, {
            data: "periodo",
            className: "text-center"
        }]
    });
}

function loadTablaGenerarPrefacturasPlanificacion(data) {
    var dt = $('#dt_generar_prefacturas2').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

//------------------------------------------------------------------------------------------

// funciones de apoyo
var obtenerPorcentajeBeneficioPorDefecto = function (done) {
    llamadaAjax('GET', myconfig.apiUrl + "/api/parametros/0", null, function (err, data) {
        if (err) return done(err);
        vm.porcentajeBeneficio(data.margenMantenimiento);
        recalcularCostesImportesDesdeCoste();
        if (done) done(null);
    })
}

var comprobarSiHayMantenedor = function () {
    if ($('#txtMantenedor').val() == '') {
        vm.mantenedorId(null);
        vm.importeMantenedor(0);
    }
}

var obtenerPorcentajeDelAgenteColaborador = function (comercialId, clienteId, empresaId, tipoContratoId, done) {
    var url = myconfig.apiUrl + "/api/comerciales/comision";
    url += "/" + comercialId;
    url += "/" + empresaId;
    url += "/" + tipoContratoId;
    llamadaAjax('GET', url, null, function (err, data) {
        if (err) return done(err);
        done(null, data);
    })
}

var mostrarMensajeNuevoContrato = function () {
    var mens = "Contrato correctamente dado de alta, introduzca las líneas del mismo. Recuerde la importancia de dar de alta los colaboradores asociados.";
    mensNormal(mens);
}

var reglasDeValidacionAdicionales = function () {
    jQuery.validator.addMethod("fechaFinalSuperiorAInicial", function (value, element) {
        var fechaInicial = new Date(spanishDbDate(vm.fechaInicio()));
        var fechaFinal = new Date(spanishDbDate(vm.fechaFinal()));
        return (fechaFinal >= fechaInicial);
    }, "La fecha final debe ser superior a la inicial");
}

// --------------- Solapa de prefacturas
function initTablaPrefacturas(departamentoId) {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 8 || column === 9 || column === 10 || column === 11 || column === 12 || column === 13 || column === 14 ) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 18) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 8 || row === 9 || row === 10 || row === 11 || row === 12 || row === 13 || row === 14 ) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                       if(row === 7) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        },
        
    };
    var buttonCommon2 = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    if(column === 0 || column === 18) {
                        return "";
                    } else {
                        return data;
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 8 || row === 9 || row === 10 || row === 11 || row === 12 || row === 13 || row === 14 ) {
                        return data;
                    } else {
                       if(row === 7) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }

    }
    tablaPrefacturas = $('#dt_prefactura').DataTable({
        paging: false,
        responsive: true,
        "bDestroy": true,
        fnCreatedRow : 
        function (nRow, aData, iDataIndex) {
            //registro facturado
            if(aData.facturaId) {
                $(nRow).attr('style', 'background: #81F889'); 
            }
             //letra recibida
             if(aData.fechaRecibida) {
                $(nRow).attr('style', 'background: #68ACCD'); 
            }

            //letra en gestión de cobros
            if(aData.fechaGestionCobros) {
                $(nRow).attr('style', 'background: #FFC281'); 
            }
            
        },
        
       
        bSort: false,
       
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C Br>r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            },{footer: true} ), 
            $.extend( true, {}, buttonCommon2, {
                extend: 'pdf'
            },{
                orientation: 'landscape',
                pageSize: 'LEGAL',
                footer: true
                } ), 
            
            'print'
        ],
        autoWidth: false,
        
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
           
            // Total over all pages
            total8 = api
            .column( 8 )
            .data()
            .reduce( function (a, b) {
                return Math.round((intVal(a) + intVal(b)) * 100) / 100;
            }, 0 );

            total9 = api
                .column( 9 )
                .data()
                .reduce( function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0 );
          
             // Total over all pages
             total10 = api
             .column( 10 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

             // Total over all pages
             total11 = api
             .column( 11 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

           
             // Total over all pages
             total12 = api
             .column( 12 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

              // Total over all pages
              total13 = api
              .column( 13 )
              .data()
              .reduce( function (a, b) {
                  return Math.round((intVal(a) + intVal(b)) * 100) / 100;
              }, 0 );

               // Total over all pages
               total14 = api
               .column( 14 )
               .data()
               .reduce( function (a, b) {
                   return Math.round((intVal(a) + intVal(b)) * 100) / 100;
               }, 0 );


            // Update footer
            $( api.columns(8).footer() ).html(
                numeral(total8).format('0,0.00')
                
            );
            $( api.columns(9).footer() ).html(
                numeral(total9).format('0,0.00')
                
            );

            $( api.columns(10).footer() ).html(
                numeral(total10).format('0,0.00')
            );
            $( api.columns(11).footer() ).html(
                numeral(total11).format('0,0.00')
            );
            $( api.columns(12).footer() ).html(
                numeral(total12).format('0,0.00')
            );
            $( api.columns(13).footer() ).html(
                numeral(total13).format('0,0.00')
            );
            $( api.columns(14).footer() ).html(
                numeral(total14).format('0,0.00')
            );

            //////

             //importes informaticos de las letras
             if(vm.tipoContratoId() == 8) {
                var c = api.data();
                calculaImportesInformativosPrefacturas(c)
            }
            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataPrefacturas,
        columns: [{
            data: "prefacturaId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if(row.esLetra != 1) {
                    html = "<i class='fa fa-file-o'></i>";
                    if (row.facturaId) {
                        html = "<i class='fa fa-files-o'></i>";
                    }
                } else {
                    html = '<label class="input">';
                    html += sprintf('<input id="chk%s" type="checkbox" class="checkAll" name="chk%s">', data, data);
                    //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                    html += '</label>';
                }
                return html;
            }
        },{
            data: "referencia"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "vNum"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },
        {
            data: "fechaRecibida",
            render: function (data, type, row) {
                if(data) {
                    return moment(data).format('DD/MM/YYYY');
                } else {
                    return null
                }
            }
        },
        {
            data: "fechaGestionCobros",
            render: function (data, type, row) {
                if(data) {
                    return moment(data).format('DD/MM/YYYY');
                } else {
                    return null
                }
            }
        }, {
            data: "coste",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "total",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        },{
            data: "noFacturado",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        },{
            data: "facturado",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "retenGarantias",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "restoCobrar",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "vFac"
        }, {
            data: "vFPago"
        }, {
            data: "observaciones"
        }, {
            data: "prefacturaId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!row.contratoPorcenId) {
                    if(row.departamentoId != 8) {
                        bt1 = "<button class='btn btn-circle btn-danger' onclick='deletePrefactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    }
                    else if(row.departamentoId == 8 && !row.facturaId) {
                        bt1 = "<button class='btn btn-circle btn-danger' onclick='deletePrefactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    }
                }
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editPrefactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printPrefactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
       
    });

   
    // Apply the filter
    $("#dt_prefactura thead th input[type=text]").on('keyup change', function () {
        tablaPrefacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaPrefacturas.columns(1).visible(false);
    tablaPrefacturas.columns(8).visible(false);
    tablaPrefacturas.columns(13).visible(false);
    tablaPrefacturas.columns(14).visible(false);
    tablaPrefacturas.columns(15).visible(false);
    tablaPrefacturas.columns(17).visible(false);
   /*  if(departamentoId != 8) {
        tablaPrefacturas.columns(6).visible(false);
        tablaPrefacturas.columns(7).visible(false);
    } */
    
}

function calculaImportesInformativosPrefacturas(c) {
    if(!c) return;
    if(c.length > 0 && vm.tipoContratoId() == 8) {
        var totEmitidas = 0;
         var numEmitidas = 0;
         var totRecibidas = 0;
         var numRecibidas = 0;
         var totGestionCobros = 0;
         var numGestionCobros = 0;
         for(var i = 0; i < c.length; i++) {
             var s = c[i];
             if(s.esLetra == 1) {
                 //LETRAS EMITIDAS
                 totEmitidas = totEmitidas + s.total;
                 numEmitidas++
                 //LETRAS RECIBIDAS
                 if(s.fechaRecibida) {
                     totRecibidas = totRecibidas + s.total;
                     numRecibidas++
                 }
                  //LETRAS EN GESTION DE COBROS
                  if(s.fechaGestionCobros) {
                     totGestionCobros = totGestionCobros + s.total;
                     numGestionCobros++
                 }
             }
         }
         if(totEmitidas) {
            vm.totEmitidas(numeral(Math.round(totEmitidas * 100)/100).format('0,0.00'));
            vm.numEmitidas(numEmitidas);
         } else {
            vm.totEmitidas(0);
            vm.numEmitidas(0);
         }
         //
         if(totRecibidas) {
            vm.totRecibidas(numeral(Math.round(totRecibidas * 100)/100).format('0,0.00'));
            vm.numRecibidas(numRecibidas);
         } else {
            vm.totRecibidas(0);
            vm.numRecibidas(0);
         }
         
         //
         if(totGestionCobros) {
            vm.totGestionCobros(numeral(Math.round(totGestionCobros * 100)/100).format('0,0.00'));
            vm.numGestionCobros(numGestionCobros);
         } else {
            vm.totGestionCobros(0);
            vm.numGestionCobros(0);
         }
         
         //calculo de las diferencias

         if(vm.totEmitidas()) {
            var a =  numeroDbf(vm.totEmitidas());
            var na = vm.numEmitidas();
            var totLetrasPlanificadas = vm.totLetrasPlanificadas();
            var numLetrasPlanificadas = vm.numLetrasPlanificadas();

            vm.difPlanificadoLetras(numeral(Math.round((totLetrasPlanificadas - a) * 100)/100).format('0,0.00'));
            vm.difNumPlanificadoLetras(numeral(Math.round((numLetrasPlanificadas - na) * 100)/100).format('0'));
        } else {
            var a =  0
            var na = 0
            var totLetrasPlanificadas = vm.totLetrasPlanificadas();
            var numLetrasPlanificadas = vm.numLetrasPlanificadas();

            vm.difPlanificadoLetras(numeral(Math.round((totLetrasPlanificadas - a) * 100)/100).format('0,0.00'));
            vm.difNumPlanificadoLetras(numeral(Math.round((numLetrasPlanificadas - na) * 100)/100).format('0'));
        }
        
       
        //diferencia entre letras prefacturadas y recibidas
        if(vm.totRecibidas()) {
            var b = numeroDbf(vm.totRecibidas());
            var nb = vm.numRecibidas();
            vm.difRecibidasLetras(numeral(Math.round((b - a) * 100)/100).format('0,0.00'));
            vm.difNumRecibidasLetras(numeral(Math.round((nb - na) * 100)/100).format('0'));
        } else {
            var b = 0;
            var nb = 0;
            vm.difRecibidasLetras(numeral(Math.round((b - a) * 100)/100).format('0,0.00'));
            vm.difNumRecibidasLetras(numeral(Math.round((nb - na) * 100)/100).format('0'));
        }
        //diferencia entre recibidas y en gestión de cobros
        if(vm.totGestionCobros()) {
            var c = numeroDbf(vm.totGestionCobros());
            var nc = vm.numGestionCobros();
            vm.difGestionCobroLetras(numeral(Math.round((c - b) * 100)/100).format('0,0.00'));
            vm.difNumGestionCobroLetras(numeral(Math.round((nc - nb) * 100)/100).format('0'));
        }
     }
}

function loadPrefacturasDelContrato(contratoId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/prefacturas/contrato/" + contratoId, null, function (err, data) {
        if (err) return;
        loadTablaPrefacturas(data);
    });
}

function loadTablaPrefacturas(data) {
    var dt = $('#dt_prefactura').dataTable();
    //new $.fn.dataTable.FixedHeader(dt, { header: true, alwayCloneTop: true });
    
   
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) {
        dt.fnAddData(data);
        numPrefacturas = data.length;
        importePrefacturas = 0;
        importePrefacturasConcepto = 0
        for( var i = 0; i < data.length; i++) {
            importePrefacturas = importePrefacturas + data[i].total;
            if(data[i].contratoPorcenId) importePrefacturasConcepto = importePrefacturasConcepto + data[i].total;
        }
        if(numPrefacturas > 0) {
            $('#cmbEmpresas').prop('disabled', true);
            $('#cmbTiposContrato').prop('disabled', true);
            $('#cmbTipoProyecto').prop('disabled', true);
            $('#txtReferencia').prop('disabled', true);
            $('#txtCliente').prop('disabled', true);
            $('#txtAgente').prop('disabled', true);
        } else {
            $('#cmbEmpresas').prop('disabled', false);
            $('#cmbTiposContrato').prop('disabled', false);
            $('#cmbTipoProyecto').prop('disabled', false);
            $('#txtReferencia').prop('disabled', false);
            $('#txtCliente').prop('disabled', false);
            $('#txtAgente').prop('disabled', false);
           
        }
    } else {
        importePrefacturas = 0;
        numPrefacturas = 0;
        importePrefacturasConcepto = 0
        $('#cmbEmpresas').prop('disabled', false);
        $('#cmbTiposContrato').prop('disabled', false);
        $('#cmbTipoProyecto').prop('disabled', false);
        $('#txtReferencia').prop('disabled', false);
        $('#txtCliente').prop('disabled', false);
        $('#txtAgente').prop('disabled', false);
    }
    dt.fnDraw();
    if(data) {
        data.forEach(function (v) {
            var field = "#chk" + v.prefacturaId;
            if (v.sel == 1) {
                $(field).attr('checked', true);
            }
            $(field).change(function () {
                var quantity = 0;
                var data = {
                    prefactura: {
                        prefacturaId: v.prefacturaId,
                        empresaId: v.empresaId,
                        clienteId: v.clienteId,
                        fecha: moment(v.fecha).format('YYYY-MM-DD'),
                        sel: 0
                    }
                };
                if (this.checked) {
                    data.prefactura.sel = 1;
                }
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/api/prefacturas/%s', myconfig.apiUrl, v.prefacturaId);
                $.ajax({
                    type: type,
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
    
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                    }
                });
            });
        });
    }
}



printPrefactura = function(id){
    var url = "InfPrefacturas.html?prefacturaId=" + id;
    window.open(url, '_blank');
}


function borrarPrefacturas() {
    // mensaje de confirmación
    var mens = "Al cerrar El contrato se borrarán las prefacturas que no esten facturadas, ¿ desea continuar ?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/prefacturas/contrato/sin/facturar/" + vm.contratoId(),
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    loadPrefacturasDelContrato(vm.contratoId());
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            $('#chkContratoCerrado').prop('checked', false);
        }
    });
}

function updateAllPreFacturas(opcion) {
    var datos = null;
    var sel = 0;
    var tb = $('#dt_prefactura').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(opcion)  sel = 1
    
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
            if(datos[i].esLetra == 1) {
                var data = {
                    prefactura: {
                        prefacturaId: datos[i].prefacturaId,
                        empresaId: datos[i].empresaId,
                        clienteId: datos[i].clienteId,
                        fecha: moment(datos[i].fecha).format('YYYY-MM-DD'),
                        sel: sel
                    }
                };
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/api/prefacturas/%s', myconfig.apiUrl, datos[i].prefacturaId);
                   $.ajax({
                       type: type,
                       url: url,
                       contentType: "application/json",
                       data: JSON.stringify(data),
                       success: function (data, status) {
       
                       },
                       error: function (err) {
                           mensErrorAjax(err);
                       }
                   });
            }
        }
    }
}

//---- Solapa facturas
function initTablaFacturas() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 6 || column === 7 || column === 8 || column === 9 || column === 10) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 14) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 6 || row === 7 || row === 8 || row === 9 || row === 10) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                       if(row === 5) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    var buttonCommon2 = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    if(column === 0 || column === 14) {
                        return "";
                    } else {
                        return data;
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 6 || row === 7 || row === 8 || row === 9 || row === 10) {
                        return data;
                    } else {
                       if(row === 5) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    tablaFacturas = $('#dt_factura').DataTable({
        bSort: false,
        responsive: true,
        "paging": false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C Br >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        autoWidth: true,
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            },{footer: true} ), 
            $.extend( true, {}, buttonCommon2,{
                extend: 'pdf'
            },{
                orientation: 'landscape',
                pageSize: 'LEGAL',
                footer: true
                } ), 
            
            'print'
        ],
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total1 = api
            .column( 6 )
            .data()
            .reduce( function (a, b) {
                return Math.round((intVal(a) + intVal(b)) * 100) / 100;
            }, 0 );

            //
            total = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0 );

              
            

            ///////

             // Total over all pages
             total2 = api
             .column( 8 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

              // Total over all pages
              total9 = api
              .column( 9 )
              .data()
              .reduce( function (a, b) {
                  return Math.round((intVal(a) + intVal(b)) * 100) / 100;
              }, 0 );

               // Total over all pages
               total10 = api
               .column( 10 )
               .data()
               .reduce( function (a, b) {
                   return Math.round((intVal(a) + intVal(b)) * 100) / 100;
               }, 0 );
 

           


            // Update footer
            $( api.columns(6).footer() ).html(
                numeral(total1).format('0,0.00')
            );
            $( api.columns(7).footer() ).html(
                numeral(total).format('0,0.00')
            );

            $( api.columns(8).footer() ).html(
                numeral(total2).format('0,0.00')
            );

            $( api.columns(9).footer() ).html(
                numeral(total9).format('0,0.00')
            );

            $( api.columns(10).footer() ).html(
                numeral(total10).format('0,0.00')
            );

            //////

            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataFacturas,
        columns: [{
            data: "facturaId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "referencia"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "vNum"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "coste",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        },  {
            data: "total",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "retenGarantias",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "restoCobrar",
            render: function (data, type, row) {
                return  numeral(data).format('0,0.00')
            }
        }, {
            data: "vFac"
        }, {
            data: "vFPago"
        }, {
            data: "observaciones"
        }, {
            data: "facturaId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!vm.contratoCerrado()) bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_factura thead th input[type=text]").on('keyup change', function () {
        tablaFacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaFacturas.columns(9).visible(false);
    tablaFacturas.columns(10).visible(false);
    tablaFacturas.columns(11).visible(false);
   
    tablaFacturas.columns(13).visible(false);

    //tablaFacturas.columns(6).data().sum();
}

function loadFacturasDelContrato(contratoId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/facturas/contrato/" + contratoId, null, function (err, data) {
        if (err) return;
        loadTablaFacturas(data);
    });
}

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function deleteFactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                facturaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadFacturasDelContrato(vm.contratoId());
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editFactura(id) {
    var url = "facturaDetalle.html?desdeContrato=true&FacturaId=" + id + "&ContratoId="+ contratoId;
    window.open(url, '_new');
}

printFactura = function(id){
    var url = "InfFacturas.html?facturaId=" + id;
    window.open(url, '_blank');
}

//---- Solapa facturas de gastos
function initTablaFacproves() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 6 || column === 7 || column === 8) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 10) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 6 || row === 7 || row === 8) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                       if(row === 5) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    var buttonCommon2 = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    if(column === 0 || column === 10) {
                        return "";
                    } else {
                        return data;
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 6 || row === 7 || row === 8) {
                        return data;
                    } else {
                       if(row === 5) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    tablaFacproves = $('#dt_facprove').DataTable({
        bSort: false,
        responsive: true,
        "paging": false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C Br>r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            },{footer: true} ), 
            $.extend( true, {}, buttonCommon2,{
                extend: 'pdf'
            },{
                orientation: 'landscape',
                pageSize: 'LEGAL',
                footer: true
                } ), 
            
            'print'
        ],
        
        autoWidth: true,
        
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0 );

              
            

            ///////

             // Total over all pages
             total2 = api
             .column( 7 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

             // Total over all pages
              total3 = api
              .column( 8 )
              .data()
              .reduce( function (a, b) {
                  return Math.round((intVal(a) + intVal(b)) * 100) / 100;
              }, 0 );


           


            // Update footer
            $( api.columns(6).footer() ).html(
                numeral(total).format('0,0.00')
            );

            $( api.columns(7).footer() ).html(
                numeral(total2).format('0,0.00')
            );

            $( api.columns(8).footer() ).html(
                numeral(total3).format('0,0.00')
            ); 


            //////

            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataFacProves,
        columns: [{
            data: "facproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        },  {
            data: "referencia"
        },{
            data: "ref"
        },{
            data: "numeroFacturaProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, 
        {
            data: "importeServiciado",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        },{
            data: "total",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        },  {
            data: "vFPago"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!vm.contratoCerrado()) bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFacprove(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFacprove(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_facprove thead th input[type=text]").on('keyup change', function () {
        tablaFacproves
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
}


function loadFacproveDelContrato(contratoId) {
    var esColaborador = 0
    llamadaAjax("GET", myconfig.apiUrl +  "/api/facturasProveedores/contrato/" + contratoId + "/" + esColaborador, null, function (err, data) {
        if (err) return;
        loadTablaFacproves(data);
    });
}

function loadTablaFacproves(data) {
    var dt = $('#dt_facprove').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editFacprove(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaProveedorDetalle.html?desdeContrato=true&facproveId=" + id + "&ContratoId=" +ContratoId;
    url += "&EmpresaId=" + vm.sempresaId();
    window.open(url, '_new');
}

var nuevaFacprove = function () {
    var url = "FacturaProveedorDetalle.html?desdeContrato=true&facproveId=0";
    url += "&EmpresaId=" + vm.sempresaId();
    url += "&ContratoId=" + vm.contratoId();
    window.open(url, '_new');
}

function deleteFacprove(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                   if(data.nombreFacprovePdf){
                    $.ajax({
                        type: "DELETE",
                        url: myconfig.apiUrl + "/api/doc/" + data.nombreFacprovePdf,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (data, status) {
                        },
                        error: function (err) {
                            mensErrorAjax(err);
                            // si hay algo más que hacer lo haremos aquí.
                        }
                    });
                   }
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
           
            var data = {
                facproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarFacproves();
                    fn();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function buscarFacproves() {
    var mf = function () {
        loadFacproveDelContrato(contratoId);
    };
    return mf;
}

//---- Solapa anticipos de gastos
function initTablaAntproves() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 5 || column === 6) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 8) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 5 || row === 6) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                       if(row === 4) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    var buttonCommon2 = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    if(column === 0 || column === 8) {
                        return "";
                    } else {
                        return data;
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 5 || row === 6) {
                        return data;
                    } else {
                       if(row === 4) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    tablaAntproves = $('#dt_antprove').DataTable({
        bSort: false,
        responsive: true,
        "paging": false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C Br >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            },{footer: true} ), 
            $.extend( true, {}, buttonCommon2,{
                extend: 'pdf'
            },{
                orientation: 'landscape',
                pageSize: 'LEGAL',
                footer: true
                } ), 
            
            'print'
        ],
       
        autoWidth: true,
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0 );

              
            

            ///////

             // Total over all pages
             total2 = api
             .column( 6 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

             
           


            // Update footer
            $( api.columns(5).footer() ).html(
                numeral(total).format('0,0.00')
            );

            $( api.columns(6).footer() ).html(
                numeral(total2).format('0,0.00')
            );

      

            //////

            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataAntProves,
        columns: [{
            data: "antproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "ref"
        },{
            data: "numeroAnticipoProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, 
        {
            data: "importeServiciado",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        },  {
            data: "vFPago"
        }, {
            data: "antproveId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!vm.contratoCerrado()) bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteAntprove(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editAntprove(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_antprove thead th input[type=text]").on('keyup change', function () {
        tablaAntproves
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
}


function loadAntproveDelContrato(contratoId) {
    var esColaborador = 0
    llamadaAjax("GET", myconfig.apiUrl +  "/api/anticiposProveedores/contrato/" + contratoId + "/" + esColaborador, null, function (err, data) {
        if (err) return;
        loadTablaAntproves(data);
    });
}

function loadTablaAntproves(data) {
    var dt = $('#dt_antprove').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editAntprove(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "AnticipoProveedorDetalle.html?desdeContrato=true&antproveId=" + id + "&ContratoId=" +ContratoId;
    url += "&EmpresaId=" + vm.sempresaId();
    window.open(url, '_new');
}

var nuevaAntprove = function () {
    var url = "AnticipoProveedorDetalle.html?desdeContrato=true&antproveId=0";
    url += "&EmpresaId=" + vm.sempresaId();
    url += "&ContratoId=" + vm.contratoId();
    window.open(url, '_new');
}

function deleteAntprove(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                antproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/anticiposProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarAntprocves();
                    fn();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function buscarAntprocves() {
    var mf = function () {
        loadAntproveDelContrato(contratoId);
    };
    return mf;
}

//---- Solapa anticipos de colaboradores

function initTablaAntcols() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 5 || column === 6) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 8) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 5 || row === 6) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                       if(row === 4) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    var buttonCommon2 = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    if(column === 0 || column === 8) {
                        return "";
                    } else {
                        return data;
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 5 || row === 6) {
                        return data;
                    } else {
                       if(row === 4) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    tablaAntproves = $('#dt_antcol').DataTable({
        bSort: false,
        responsive: true,
        "paging": false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C Br >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            },{footer: true} ), 
            $.extend( true, {}, buttonCommon2,{
                extend: 'pdf'
            },{
                orientation: 'landscape',
                pageSize: 'LEGAL',
                footer: true
                } ), 
            
            'print'
        ],

        autoWidth: true,
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0 );

              
            

            ///////

             // Total over all pages
             total2 = api
             .column( 6 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

             
           


            // Update footer
            $( api.columns(5).footer() ).html(
                numeral(total).format('0,0.00')
            );

            $( api.columns(6).footer() ).html(
                numeral(total2).format('0,0.00')
            );

      

            //////

            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataAntCol,
        columns: [{
            data: "antproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "ref"
        },{
            data: "numeroAnticipoProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, 
        {
            data: "importeServiciado",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        },  {
            data: "vFPago"
        }, {
            data: "antproveId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!vm.contratoCerrado())  bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteAntcol(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editAntcol(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_antcol thead th input[type=text]").on('keyup change', function () {
        tablaAntproves
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
}
function loadAntcolDelContrato(contratoId) {
    var esColaborador = 1
    llamadaAjax("GET", myconfig.apiUrl +  "/api/anticiposProveedores/contrato/" + contratoId + "/" + esColaborador, null, function (err, data) {
        if (err) return;
        loadTablaAntcols(data);
    });
}

function loadTablaAntcols(data) {
    var dt = $('#dt_antcol').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editAntcol(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "AnticipoColaboradorDetalle.html?desdeContrato=true&antproveId=" + id + "&ContratoId=" +ContratoId;
    url += "&EmpresaId=" + vm.sempresaId();
    window.open(url, '_new');
}

var nuevaAntcol = function () {
    var url = "AnticipoColaboradorDetalle.html?desdeContrato=true&antproveId=0";
    url += "&EmpresaId=" + vm.sempresaId();
    url += "&ContratoId=" + vm.contratoId();
    window.open(url, '_new');
}

function deleteAntcol(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/anticiposProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    var fn = buscarAntCols();
                    fn();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function buscarAntCols() {
    var mf = function () {
        loadAntcolDelContrato(contratoId);
    };
    return mf;
}

//---- Solapa facturas de colaboradores
function initTablaFactcol() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 5 || column === 6 || column === 7) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 9) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 5 || row === 6 || row === 7) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                       if(row === 4) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    var buttonCommon2 = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    if(column === 0 || column === 9) {
                        return "";
                    } else {
                        return data;
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 5 || row === 6 || row === 7) {
                        return data;
                    } else {
                       if(row === 4) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    tablaFacproves = $('#dt_factcol').DataTable({
        bSort: false,
        responsive: true,
        "paging": false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C Br >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            },{footer: true} ), 
            $.extend( true, {}, buttonCommon2,{
                extend: 'pdf'
            },{
                orientation: 'landscape',
                pageSize: 'LEGAL',
                footer: true
                } ), 
            
            'print'
        ],
        autoWidth: true,
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0 );

              
            

            ///////

             // Total over all pages
             total2 = api
             .column( 6 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

             // Total over all pages
              total3 = api
              .column( 7 )
              .data()
              .reduce( function (a, b) {
                  return Math.round((intVal(a) + intVal(b)) * 100) / 100;
              }, 0 );


           


            // Update footer
            $( api.columns(5).footer() ).html(
                numeral(total).format('0,0.00')
            );

            $( api.columns(6).footer() ).html(
                numeral(total2).format('0,0.00')
            );

            $( api.columns(7).footer() ).html(
                numeral(total3).format('0,0.00')
            ); 


            //////

            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataFactCol,
        columns: [{
            data: "facproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "ref"
        },{
            data: "numeroFacturaProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, 
        {
            data: "importeServiciado",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        },{
            data: "total",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        },  {
            data: "vFPago"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!vm.contratoCerrado()) bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactcol(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactcol(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_factcol thead th input[type=text]").on('keyup change', function () {
        tablaFacproves
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
}


function loadFactcolDelContrato(contratoId) {
    var esColaborador = 1;
    llamadaAjax("GET", myconfig.apiUrl +  "/api/facturasProveedores/contrato/" + contratoId + "/" + esColaborador, null, function (err, data) {
        if (err) return;
        loadTablaFactcol(data);
    });
}

function loadTablaFactcol(data) {
    var dt = $('#dt_factcol').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editFactcol(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaColaboradorDetalle.html?desdeContrato=true&facproveId=" + id + "&ContratoId=" +ContratoId;
    url += "&EmpresaId=" + vm.sempresaId();
    window.open(url, '_new');
}

var nuevaFactcol = function () {
    var url = "FacturaColaboradorDetalle.html?desdeContrato=true&facproveId=0";
    url += "&EmpresaId=" + vm.sempresaId();
    url += "&ContratoId=" + vm.contratoId();
    window.open(url, '_new');
}

function deleteFactcol(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                   if(data.nombreFacprovePdf){
                    $.ajax({
                        type: "DELETE",
                        url: myconfig.apiUrl + "/api/doc/" + data.nombreFacprovePdf,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (data, status) {
                        },
                        error: function (err) {
                            mensErrorAjax(err);
                            // si hay algo más que hacer lo haremos aquí.
                        }
                    });
                   }
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
           
            var data = {
                facproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarFactcols();
                    fn();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function buscarFactcols() {
    var mf = function () {
        loadFactcolDelContrato(contratoId);
    };
    return mf;
}

// -- Modal renovacion del contrato

var prepararRenovacion = function () {
    proponerFechasRenovacion();
};

var prepararRecepcionGestion = function(opcion) {
    f = moment(new Date()).format('DD/MM/YYYY');
    _recepcionGestion = opcion;
    vm.fechaRecepcionGestion(f);
    $('#recepcion').show();
    $('#gestionCobros').show();
    if(!opcion) {
        $('#recepcion').hide();
    } else {
        $('#gestionCobros').hide()
    }
} 

var aceptarGenerarRecepcionGestion = function() {
    //if(!datosOKRecepcionGestion()) return;
    var data = {};
    var url = myconfig.apiUrl + "/api/prefacturas/recepcionGestion/planificacion/" + vm.contratoId();
    //recuperamos primero las fechas de recepción y gestión de cobros de las prefcaturas seleccionadas
    llamadaAjax("GET", url, null, function (err, datos) {
        if (err) return;
        if(datos.length == 0) {
            $('#modalGenerarRecepcionGestion').modal('hide');
           return mensError("No se han seleccionado registros");
            
        }
        data = {
            recepcionGestion:{
                fechaRecibida:  null
            }
        }
        if(vm.fechaRecepcionGestion() != '') {
            data = {
                recepcionGestion:{
                    fechaRecibida:  spanishDbDate(vm.fechaRecepcionGestion())
                }
            }
        }
       if(!_recepcionGestion) {
            //comprobamos que la fecha seleccionada para gestión de cobros no sea inferior que la fecha de recepción
            delete data.recepcionGestion.fechaRecibida
            data.recepcionGestion.fechaGestionCobros =  spanishDbDate(vm.fechaRecepcionGestion())
            var resultado = compruebaFechaGestionCobros(datos,  data.recepcionGestion.fechaGestionCobros);
            if(resultado) {
                mensError("La fecha de gestión de cobros no puede ser menor que la de recepción");
                return;
            } 
       } else {
            var resultado = compruebaFechaRecepcion(datos,  data.recepcionGestion.fechaRecibida);
            if(resultado) {
                mensError("La fecha recepción no puede ser mayor que la de gestión de cobros");
                return;
            }
    }
       llamadaAjax("PUT", url, data, function (err, data) {
            if (err) return;
            $('#modalGenerarRecepcionGestion').modal('hide');
            loadPrefacturasDelContrato(vm.contratoId());
            actualizaCobrosPlanificacion(vm.contratoId());
        }); 
    });
} 

var compruebaFechaGestionCobros = function(datos, fecha) {
    var opcion = false;
    for(var i = 0; i < datos.length; i++) {
        var f = datos[i];
        if(f.fechaRecibida) {
            opcion = fecha < f.fechaRecibida;
            
        } else {
            opcion = true;
        }

    }
    return opcion;
}

var compruebaFechaRecepcion = function(datos, fecha) {
    var opcion = false;
    for(var i = 0; i < datos.length; i++) {
        var f = datos[i];
        if(f.fechaGestionCobros && fecha) {
            opcion = fecha > f.fechaGestionCobros;
            if(opcion) {
                break;
            }
        } else if(!f.fechaGestionCobros && !fecha) {
            opcion = false;
        } else if(!f.fechaGestionCobros && fecha) {
            opcion = false;
        }  else {
            opcion = true;
            break;
        }
    }
    return opcion;
}


var proponerFechasRenovacion = function () {
    var _fechaInicio = moment(vm.fechaInicio(), 'DD/MM/YYYY');
    var _fechaFinal = moment(vm.fechaFinal(), 'DD/MM/YYYY');
    var _diasDiferencia = _fechaFinal.diff(_fechaInicio, 'days');

    //var _nuevaFechaInicio = _fechaFinal;
    //var _nuevaFechaFinal = _nuevaFechaInicio.add(_diasDiferencia, 'days');

    vm.nuevaFechaInicio(_fechaFinal.format('DD/MM/YYYY'));
    vm.nuevaFechaFinal(_fechaFinal.add(_diasDiferencia, 'days').format('DD/MM/YYYY'));
    vm.nuevaFechaContrato(moment(new Date()).format('DD/MM/YYYY'));

}

var aceptarNuevoContrato = function () {
    if (!nuevoContratoOK()) return;
    var url = myconfig.apiUrl + "/api/contratos/renovar/" + vm.contratoId();
    url += "/" + spanishDbDate(vm.nuevaFechaInicio());
    url += "/" + spanishDbDate(vm.nuevaFechaFinal());
    url += "/" + spanishDbDate(vm.nuevaFechaContrato());
    llamadaAjax("POST", url, null, function (err, data) {
        if (err) return;
        window.open("ContratoDetalle.html?ContratoId=" + data + "&CMD=REN", '_new');
    })
};

var nuevoContratoOK = function () {
    $('#frmRenovarContratos').validate({
        rules: {
            txtNFechaInicio: {
                required: true
            },
            txtNFechaFinal: {
                required: true,
                fechaFinalSuperiorAInicial: true
            },
            txtNFechaNuevoContrato: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNFechaInicio: {
                number: "Debe elegir una fecha"
            },
            txtNFechaFinal: {
                required: "Debe elegir una fecha"
            },
            txtNFechaNuevoContrato: {
                required: "Debe elegir una fecha"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmRenovarContratos").validate().settings;
    return $('#frmRenovarContratos').valid();
}

var editPrefactura = function (id) {
    $('#dt_prefactura').dataTable().fnDestroy();
    var url = "PrefacturaDetalle.html?desdeContrato=true&PrefacturaId=" + id + "&ContratoId="+ contratoId;
    window.open(url, '_new');
}

var nuevaPrefactura = function () {
    var url = "PrefacturaDetalle.html?desdeContrato=true&PrefacturaId=0";
    url += "&EmpresaId=" + vm.sempresaId();
    if (vm.mantenedorId()) {
        url += "&ClienteId=" + vm.mantenedorId();
    } else {
        url += "&ClienteId=" + vm.sclienteId();
    }


    url += "&ContratoId=" + vm.contratoId();
    window.open(url, '_new');
}

function loadTiposVia(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposVia = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposVia(tiposVia);
            $("#cmbTiposVia").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function deletePrefactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                prefacturaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/prefacturas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadPrefacturasDelContrato(vm.contratoId());
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}
function crearPrefacturas2(importe, importeAlCliente, coste, fechaPrimeraFactura, porRetenGarantias, numPagos, empresaId, clienteId, empresa, cliente) {
    var divisor = obtenerDivisor();
    var numLetra = '';


    // si hay parcial el primer pago será por la diferencia entre el inicio de contrato y la fecha de primera factura
    // de mes 
    var inicioFactura = new Date(spanishDbDate(vm.fechaPrimeraFactura()));
    //var finFactura = new Date(spanishDbDate(vm.fechaUltimaFactura()));
    var iniContrato = moment(inicioFactura).format('YYYY-MM-DD');
    //var fFactura = moment(finFactura).format('YYYY-MM-DD');
    var finMesinicioFactura = moment(inicioFactura).endOf('month');
    var aux = iniContrato.split('-');
    var inicioMesinicioFactura = aux[0] + "-" + aux[1] + "-01";
    var diffDias = finMesinicioFactura.diff(inicioFactura, 'days');

    var importePago = roundToTwo(importe / numPagos);
    var importePagoCliente = roundToTwo(importeAlCliente / numPagos);
    var importeCoste = roundToTwo(coste / numPagos);
    porRetenGarantias = parseFloat(porRetenGarantias);
    
   

    // como la división puede no dar las cifras hay que calcular los restos.
    var restoImportePago = importe - (importePago * numPagos);
    var restoImportePagoCliente = importeAlCliente - (importePagoCliente * numPagos);
    var restoImporteCoste = coste - (importeCoste * numPagos);

    var import1 = (importePago / 30) * diffDias;
    var import11 = (importePagoCliente / 30) * diffDias;
    var import12 = (importeCoste / 30) * diffDias;
    var import2 = importePago - import1;
    var import21 = importePagoCliente - import11;
    var import22 = importeCoste - import12;
    var pagos = [];
    var nPagos = numPagos;
    if(importe == 0 || importe < 0) return pagos;
    if (vm.facturaParcial()) {
        nPagos++
    }
    for (var i = 0; i < nPagos; i++) {
        // sucesivas fechas de factura
        var f = moment(fechaPrimeraFactura).add(i * divisor, 'month').format('DD/MM/YYYY');
        // inicio de periodo
        var f0 = moment(iniContrato).add(i * divisor, 'month').format('DD/MM/YYYY');
        // fin de periodo
        var f2 = moment(inicioFactura).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        if (vm.facturaParcial()) {
            if (i > 0) {
                f0 = moment(inicioMesinicioFactura).add(i * divisor, 'month').format('DD/MM/YYYY');
            }
            f2 = moment(inicioMesinicioFactura).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        }
       /*  if (i == (nPagos - 1)) {
            f2 = moment(fFactura).format('DD/MM/YYYY');
        } */
        var n =  i+1 
            numLetra = n + "/" + nPagos
        
        var p = {
            fecha: f,
            importe: importePago,
            importeCliente: importePagoCliente,
            importeCoste: importeCoste,
            retenGarantias: 0,
            empresaId: empresaId,
            clienteId: clienteId,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            empresa: empresa,
            cliente: cliente,
            periodo: f0 + "-" + f2,
            contPlanificacionId: RegPlanificacion[0].contPlanificacionId,
            formaPagoId: RegPlanificacion[0].formaPagoId,
            numLetra: numLetra
        };
        if (vm.facturaParcial() && i == 0) {
            p.importe = import1;
            p.importeCliente = import11;
            p.importeCoste = import12;
        }
        if (vm.facturaParcial() && i == (nPagos - 1)) {
            p.importe = import2;
            p.importeCliente = import21;
            p.importeCoste = import22;
        }
        //calculamos la retención de garantia si existe
        if(porRetenGarantias) {
            var por = roundToTwo(porRetenGarantias / 100)
            p.retenGarantias = roundToTwo(p.importe * por);
        } 
        

        pagos.push(p);
    }
    if (pagos.length > 1) {
        // en la última factura ponemos los restos
        pagos[pagos.length - 1].importe = pagos[pagos.length - 1].importe + restoImportePago;
        pagos[pagos.length - 1].importeCliente = pagos[pagos.length - 1].importeCliente + restoImportePagoCliente;
        pagos[pagos.length - 1].importeCoste = pagos[pagos.length - 1].importeCoste + restoImporteCoste;
        if(porRetenGarantias) {
            pagos[pagos.length - 1].retenGarantias = roundToTwo( pagos[pagos.length - 1].importe * por);
        }
        /* pagos[pagos.length - 1].importe = importe - (importePago * (numPagos-1));
        pagos[pagos.length - 1].importeCliente = importeAlCliente - (importePagoCliente * (numPagos-1));
        pagos[pagos.length - 1].importeCoste = coste - (importeCoste * (numPagos-1)); */
    }
    return pagos;
}
function crearPrefacturasRestoDepartamentos(importe, importeAlCliente, coste, fechaPrimeraFactura, fechaSiguientesFacturas, numPagos, empresaId, clienteId, empresa, cliente) {
    var divisor = obtenerDivisor();
    // si hay parcial el primer pago será por la diferencia entre el inicio de contrato y la fecha de primera factura
    // de mes 
    var inicioContrato = new Date(spanishDbDate(vm.fechaInicio()));
    var finContrato = new Date(spanishDbDate(vm.fechaFinal()));
    var iniContrato = moment(inicioContrato).format('YYYY-MM-DD');
    var fContrato = moment(finContrato).format('YYYY-MM-DD');
    var finMesInicioContrato = moment(inicioContrato).endOf('month');
    var aux = iniContrato.split('-');
    var inicioMesInicioContrato = aux[0] + "-" + aux[1] + "-01";
    var diffDias = finMesInicioContrato.diff(inicioContrato, 'days');

    var importePago = roundToTwo(importe / numPagos);
    var importePagoCliente = roundToTwo(importeAlCliente / numPagos);
    var importeCoste = roundToTwo(coste / numPagos);

    // como la división puede no dar las cifras hay que calcular los restos.
    var restoImportePago = importe - (importePago * numPagos);
    var restoImportePagoCliente = importeAlCliente - (importePagoCliente * numPagos);
    var restoImporteCoste = coste - (importeCoste * numPagos);

    var import1 = (importePago / 30) * diffDias;
    var import11 = (importePagoCliente / 30) * diffDias;
    var import12 = (importeCoste / 30) * diffDias;
    var import2 = importePago - import1;
    var import21 = importePagoCliente - import11;
    var import22 = importeCoste - import12;
    var pagos = [];
    var nPagos = numPagos;
    if(importe == 0 || importe < 0) return pagos;
    if (vm.facturaParcial()) {
        nPagos++
    }
    for (var i = 0; i < nPagos; i++) {
        var n =  i+1 
        numLetra = n + "/" + nPagos
        // sucesivas fechas de factura
        var f = moment(fechaPrimeraFactura).add(i * divisor, 'month').format('DD/MM/YYYY');
        // inicio de periodo
        var f0 = moment(iniContrato).add(i * divisor, 'month').format('DD/MM/YYYY');
        // fin de periodo
        var f2 = moment(inicioContrato).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        if (vm.facturaParcial()) {
            if (i > 0) {
                f0 = moment(inicioMesInicioContrato).add(i * divisor, 'month').format('DD/MM/YYYY');
            }
            f2 = moment(inicioMesInicioContrato).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        }
        if (i == (nPagos - 1)) {
            f2 = moment(fContrato).format('DD/MM/YYYY');
        }
        var p = {
            fecha: f,
            importe: importePago,
            importeCliente: importePagoCliente,
            importeCoste: importeCoste,
            empresaId: empresaId,
            retenGarantias: 0,
            clienteId: clienteId,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            empresa: empresa,
            cliente: cliente,
            periodo: f0 + "-" + f2,
            numLetra: numLetra
        };
        if (vm.facturaParcial() && i == 0) {
            p.importe = import1;
            p.importeCliente = import11;
            p.importeCoste = import12;
        }
        if (vm.facturaParcial() && i == (nPagos - 1)) {
            p.importe = import2;
            p.importeCliente = import21;
            p.importeCoste = import22;
        }
        pagos.push(p);
    }
    if (pagos.length > 1) {
        // en la última factura ponemos los restos
        pagos[pagos.length - 1].importe = pagos[pagos.length - 1].importe + restoImportePago;
        pagos[pagos.length - 1].importeCliente = pagos[pagos.length - 1].importeCliente + restoImportePagoCliente;
        pagos[pagos.length - 1].importeCoste = pagos[pagos.length - 1].importeCoste + restoImporteCoste;
        /* pagos[pagos.length - 1].importe = importe - (importePago * (numPagos-1));
        pagos[pagos.length - 1].importeCliente = importeAlCliente - (importePagoCliente * (numPagos-1));
        pagos[pagos.length - 1].importeCoste = coste - (importeCoste * (numPagos-1)); */
    }
    return pagos;
}
function crearPrefacturasConceptos(importe, importeAlCliente, coste, fechaPrimeraFactura, fechaSiguientesFacturas, numPagos, empresaId, clienteId, empresa, cliente, data) {
    var divisor = dataConceptos.length
    if(data) {
        dataConceptos = [];
        dataConceptos.push(data);
        divisor = 1;
    }
    // si hay parcial el primer pago será por la diferencia entre el inicio de contrato y la fecha de primera factura
    // de mes 
    var inicioContrato = new Date(spanishDbDate(vm.fechaInicio()));
    var iniContrato = moment(inicioContrato).format('YYYY-MM-DD');
    var finContrato = new Date(spanishDbDate(vm.fechaFinal()));
    var pagos = [];
    var nPagos = numPagos;
    var acumulado = 0;
    var copiaDataConceptos = dataConceptos.slice();
    for (var j =0; j< nPagos; j++) {
        acumulado += roundToSix((importe * dataConceptos[j].porcentaje) / 100) ;
    }
    for (var i = 0; i < nPagos; i++) {
        var importePago = roundToSix(dataConceptos[i].importe);
        var importePagoCliente = roundToSix(dataConceptos[i].importe);
        var importeCoste = roundToSix(dataConceptos[i].importe);
        var contratoPorcenId = dataConceptos[i].contratoPorcenId;
        var formaPagoId = dataConceptos[i].formaPagoId;
        // sucesivas fechas de factura
        var f = moment(dataConceptos[i].fecha).format('DD/MM/YYYY');
        // inicio de periodo
        if(i == 0) {
            var f0 = moment(iniContrato).add(i * divisor, 'month').format('DD/MM/YYYY');
        } else {
            var f0 = moment(dataConceptos[i].fecha).format('DD/MM/YYYY');
        }
       
        // fin de periodo
        if(dataConceptos[i+1]) {
            var f2 = moment(dataConceptos[i+1].fecha).format('DD/MM/YYYY');
        } else {
            var f2 = moment(finContrato).format('DD/MM/YYYY');
        }
        //completamos el compo observacionesPago
        var cabecera = "CONCEPTO DE LA PRESENTE FACTURA\n"
        var campoDestacado = copiaDataConceptos[i].concepto + " " + Math.round((copiaDataConceptos[i].porcentaje * 100) / 100) + "%\n";
        var cabOtrosConceptos = '\nOTROS CONCEPTOS';
        var otrosConceptos = ''
        copiaDataConceptos.splice(i, 1);
        for( var k  = 0; k < copiaDataConceptos.length; k++ ) {
            otrosConceptos += "\n"+copiaDataConceptos[k].concepto + " " + Math.round((copiaDataConceptos[i].porcentaje * 100) / 100);
        }

        var p = {
            fecha: f,
            importe: importePago,
            importeCliente: importePagoCliente,
            importeCoste: importeCoste,
            empresaId: empresaId,
            clienteId: clienteId,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            retenGarantias: 0,
            empresa: empresa,
            cliente: cliente,
            periodo: f0 + "-" + f2,
            observacionesPago: cabecera + campoDestacado + cabOtrosConceptos + otrosConceptos,
            contratoPorcenId: contratoPorcenId,
            contPlanificacionId: null,
            formaPagoId: formaPagoId
        };
        /*if (vm.facturaParcial() && i == 0) {
            p.importe = import1;
            p.importeCliente = import11;
            p.importeCoste = import12;
        }
        if (vm.facturaParcial() && i == (nPagos - 1)) {
            p.importe = import2;
            p.importeCliente = import21;
            p.importeCoste = import22;
        }*/
        pagos.push(p);
        copiaDataConceptos = [];
        copiaDataConceptos = dataConceptos.slice();
    }
    /*if (pagos.length > 1) {
        // en la última factura ponemos los restos
        pagos[pagos.length - 1].importe = pagos[pagos.length - 1].importe + restoImportePago;
        pagos[pagos.length - 1].importeCliente = pagos[pagos.length - 1].importeCliente + restoImportePagoCliente;
        pagos[pagos.length - 1].importeCoste = pagos[pagos.length - 1].importeCoste + restoImporteCoste;
    }*/
    return pagos;
}

function crearPrefacturaPlanificacion(numPagos, empresaId, clienteId, empresa, cliente, data) {
    var divisor = 1;
    var fecha = new Date(spanishDbDate(data[0].fecha));
    var pagos = [];
    var nPagos = numPagos;
    var porRetenGarantias = 0
    var retenGarantias = 0
    var copiadata = data.slice();
  
    for (var i = 0; i < nPagos; i++) {
        var importePago = roundToSix(data[i].importe);
        var importePagoCliente = roundToSix(data[i].importe);
        var importeCoste = roundToSix(data[i].importe);
        var  contPlanificacionId = data[i].contPlanificacionId;
        var formaPagoId = data[i].formaPagoId;
        // sucesivas fechas de factura
        var f = moment(fecha).format('DD/MM/YYYY');
        // inicio de periodo
        if(i == 0) {
            var f0 = moment(fecha).add(i * divisor, 'month').format('DD/MM/YYYY');
        } 
       
        var f2 = moment(fecha).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        //completamos el compo observacionesPago
        var cabecera = "CONCEPTO DE LA PRESENTE FACTURA\n"
        var campoDestacado = copiadata[i].concepto + " " + Math.round((copiadata[i].porcentaje * 100) / 100) + "%\n";
        var cabOtrosConceptos = '\nOTROS CONCEPTOS';
        var otrosConceptos = ''
         //calculamos la retención de garantia si existe
         if(copiadata[i].porRetenGarantias) {
            porRetenGarantias = roundToTwo(copiadata[i].porRetenGarantias / 100)
            retenGarantias = roundToTwo(importePago * porRetenGarantias);
        } 
        copiadata.splice(i, 1);
        for( var k  = 0; k < copiadata.length; k++ ) {
            otrosConceptos += "\n"+copiadata[k].concepto + " " + Math.round((copiadata[i].porcentaje * 100) / 100);
        }

        var p = {
            fecha: f,
            importe: importePago,
            importeCliente: importePagoCliente,
            importeCoste: importeCoste,
            empresaId: empresaId,
            clienteId: clienteId,
            retenGarantias: retenGarantias,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            empresa: empresa,
            cliente: cliente,
            periodo: f0 + "-" + f2,
            observacionesPago: cabecera + campoDestacado + cabOtrosConceptos + otrosConceptos,
            contratoPorcenId: null,
            contPlanificacionId: contPlanificacionId,
            formaPagoId: formaPagoId
        };

       
        pagos.push(p);
        copiadata = [];
        copiadata = data.slice();
    }
    
    return pagos;
}


var calcularNumPagos = function () {
    var fInicial = new Date(spanishDbDate(vm.fechaInicio()));
    // if (vm.facturaParcial()){
    //     var aux = moment(fInicial).format('YYYY-MM-DD').split('-');
    //     fInicial = aux[0] + "-" + aux[1] + "-01";
    // }
    var fFinal = new Date(spanishDbDate(vm.fechaFinal()));
    // añadimos un dia a la feha final para contemplar el caso en el que ponen
    // como fecha final de contrato la de fin de mes.
    var numMeses = parseInt(moment(fFinal).add(1, 'days').diff(fInicial, 'months', true));
    if (numMeses == 0) numMeses = 1; // por lo menos un pago
    // calculamos según la periodicidad
    var divisor = obtenerDivisor();
    var numpagos = 1
    if (divisor != 0) numpagos = parseInt(numMeses / divisor);
    if (numpagos == 0) numpagos = 1; // por lo menos uno
    $('#txtNumPagos').val(numpagos);
    return numpagos;
}


var calcularNumPagosPlanificacion = function () {
    var fInicial = new Date(spanishDbDate(vm.fechaInicio()));
    // if (vm.facturaParcial()){
    //     var aux = moment(fInicial).format('YYYY-MM-DD').split('-');
    //     fInicial = aux[0] + "-" + aux[1] + "-01";
    // }
    var fFinal = new Date(spanishDbDate(vm.fechaFinal()));
    // añadimos un dia a la feha final para contemplar el caso en el que ponen
    // como fecha final de contrato la de fin de mes.
    var numMeses = parseInt(moment(fFinal).add(1, 'days').diff(fInicial, 'months', true));
    if (numMeses == 0) numMeses = 1; // por lo menos un pago
    // calculamos según la periodicidad
    var divisor = obtenerDivisor();
    var numpagos = 1
    if (divisor != 0) numpagos = parseInt(numMeses / divisor);
    if (numpagos == 0) numpagos = 1; // por lo menos uno
    $('#txtNumPagos2').val(numpagos);
    return numpagos;
}



/* FUNCIONES RELACIONADAS CON LA CARGA DE LA TABLA HISTORIAL DE COBROS */

function initTablaContratosCobros() {
    tablaContratoCobros = $('#dt_contratosCobros').DataTable({
        sort: false,
        responsive: true,
        "paging": false,
        autoWidth: true,
        rowCallback: function (nRow, aData) {
           
            if ( !aData.seguro )
            {
                $('td', nRow).css('background-color', 'Orange');
            }
        },
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0 );

              
            

            ///////

             // Total over all pages
             total2 = api
             .column( 8 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );

           


            // Update footer
            $( api.columns(7).footer() ).html(
                numeral(total).format('0,0.00')
            );

            $( api.columns(8).footer() ).html(
                numeral(total2).format('0,0.00')
            );

            //////

            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataContratosCobros,
        columns: [
            {
                
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
                //data:"carpetaId",
            },{
            data: "numorden"
        }, {
            data: "numserie"
        }, {
            data: "numfactu"
        }, {
            data: "fecfactu",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        }, {
            data: "fecvenci",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        },  {
            data: "fecultco",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        }, {
            data: "impvenci",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "impcobro",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "nomforpa"
        }]
    });
}


function loadTablaContratosCobros(data) {
    var dt = $('#dt_contratosCobros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data) dt.fnAddData(data);
    dt.fnDraw();
}

function loadContratosCobros(id) {
    llamadaAjax('GET', "/api/cobros/contrato/" + id, null, function (err, data) {
        if (err) return;
        loadTablaContratosCobros(data);
    });
}

//FUNCIONES DE LOS CONCEPTOS/PORCENTAJES

function initTablaConceptosLineas() {
    tablaCarro = $('#dt_lineasConcepto').DataTable({
        autoWidth: true,
        responsive: true,
        "order": [[ 0, "asc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
        ],
        drawCallback: function (oSettings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataConceptosLineas,
        columns: [  {
            data: "fecha",
            
        },{
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },{
            data: "concepto",
            
        }, {
            data: "porcentaje",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "importe",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "formaPagoNombre",
            
        }, {
            data: "contratoPorcenId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "";
                var bt2 = "";
                if(!vm.contratoCerrado()) {
                    bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteConceptosLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalConcepto' onclick='editFprmaPagoLineaConcepto(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                }
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if(row.prefacturaId) html = "<div class='pull-right'></div>";
                return html;
            }
        }]
    });
}

function  loadConceptosLineas(id) {
    llamadaAjax("GET", "/api/contratos/conceptos/porcentaje/" + id, null, function (err, data) {
        if (err) return;
        loadTablaConceptosLineas(data);
        
    });
}

function actualizaCobrosPlanificacion(id) {
    llamadaAjax("GET", "/api/cobros/contrato/planificacion/" + id, null, function (err, numCobros) {
        if (err) return;
        loadPlanificacionLineasObras(id, numCobros)
    });
}

function loadTablaConceptosLineas(data) {
    if (data) {
        dataConceptos = data;
        numConceptos = data.length;
    } else {
        dataConceptos = null;
        numConceptos = 0;
    }
    var dt = $('#dt_lineasConcepto').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnCopiar').hide();
        $('#btnPorcentaje').hide();
        $('#btnDeleteTipo').hide();
    }
    dt.fnClearTable();
    if (data != null){
        dt.fnAddData(data);
        $('#btnCopiar').show();
        $('#btnPorcentaje').show();
        $('#btnDeleteTipo').show();
    }
    dt.fnDraw();
}


function nuevaLineaConcepto() {
    limpiaDataLineaConcepto();
    lineaEnEdicion = false;
}

function limpiaDataLineaConcepto() {
    vm.conceptoCobro('');
    vm.porcentajeCobro(0);
    vm.fechaConcepto(vm.fechaInicio());
    vm.importeCalculado(0);
    loadFormasPagoLinea(vm.formaPagoId())

}


function aceptarLineaConcepto() {
    if (!datosOKLineasConceptos()) {
        return;
    }
    var data = {
        cobroPorcen: {
            contratoId: vm.contratoId(),
            concepto: vm.conceptoCobro(),
            porcentaje: vm.porcentajeCobro(),
            fecha: spanishDbDate(vm.fechaConcepto()),
            importe: vm.importeCalculado(),
            formaPagoId: vm.sformaPagoIdLinea(),
        }
    }
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/contratos/concepto";
                if (lineaEnEdicion) {
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/contratos/concepto/" +  vm.contratoPorcenId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalConcepto').modal('hide');
                    llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/conceptos/porcentaje/" + vm.contratoId(), null, function (err, data) {
                        loadTablaConceptosLineas(data);
                    });
                });
}

function aceptarLineaConceptoPrefactura() {
    if (!datosOKLineasConceptos()) {
        return;
    }

    //comprobamos que le cliente tenga un nombre comercial
    var d = vm.nombreComercial();
    if(!d || d == '') return mensError("El cliente no tiene un nombre fiscal establecido en su ficha.");

   var  impCli = parseFloat(vm.importeCliente());
   var imp = parseFloat(vm.importeCalculado());
    if(importePrefacturasConcepto > impCli) {
        mensError("Se está sobrepasando el total del contrato");
        return;
    } else if(importePrefacturasConcepto + imp > impCli) {
        mensError("Se está sobrepasando el total del contrato");
        return;
    } 
    var data = {
        cobroPorcen: {
            contratoId: vm.contratoId(),
            concepto: vm.conceptoCobro(),
            porcentaje: vm.porcentajeCobro(),
            fecha: spanishDbDate(vm.fechaConcepto()),
            importe: vm.importeCalculado(),
            formaPagoId: vm.sformaPagoIdLinea(),
            contratoPorcenId: null
        }
    }
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/contratos/concepto";
                if (lineaEnEdicion) {
                    data.cobroPorcen.contratoPorcenId = vm.contratoPorcenId();
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/contratos/concepto/" +  vm.contratoPorcenId();
                }
                if(verbo == "PUT") {
                    mens = "<ul>"
                    mens += "<li><strong>¡¡ Atención !! Al modificar El concepto se borrarán las prefacturas  que no se hayan generado mediante conceptos / porcentajes, las puede volver a generar</strong></li>";
                    mens += "<li>¿Desea continuar?</li>";
                    mens += "</ul>"
                    $.SmartMessageBox({
                        title: "<i class='fa fa-info'></i> Mensaje",
                        content: mens,
                        buttons: '[Cancelar][Modificar]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Modificar") {
                            llamadaAjax(verbo, url, data, function (err, dato) {
                                if (err) return;
                    
                                $('#modalConcepto').modal('hide');
                                llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/conceptos/porcentaje/" + vm.contratoId(), null, function (err, data2) {
                                    loadTablaConceptosLineas(data2);
                                    // comprobamos si es de mantenedor o cliente final.
                                    var importe = vm.importeCliente(); // importe real de la factura;
                                    var importeAlCliente = vm.importeCliente(); // importe al cliente final;
                                    var clienteId = vm.clienteId();
                                    var cliente = vm.nombreComercial();
                                    var empresa = $("#cmbEmpresas").select2('data').text;
                                    // si es un mantenedor su importe de factura es el calculado para él.
                                    if (vm.mantenedorId()) {
                                        importe = vm.importeMantenedor();
                                        clienteId = vm.mantenedorId();
                                        cliente = $("#txtMantenedor").val();
                                    }
                                    var prefacturas = crearPrefacturasConceptos(importe, importeAlCliente, vm.coste(), null, null, 1, vm.sempresaId(), clienteId, empresa, cliente,  dato);
                                    vm.prefacturasAGenerar(prefacturas);
                                    aceptarModificarPrefacturas();
                                });
                            });
                        }
                        if (ButtonPressed === "Cancelar") {
                            // no hacemos nada (no quiere borrar)
                            return;
                        }
                    });
                } else {
                    llamadaAjax(verbo, url, data, function (err, dato) {
                        if (err) return;
            
                        $('#modalConcepto').modal('hide');
                        llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/conceptos/porcentaje/" + vm.contratoId(), null, function (err, data2) {
                            loadTablaConceptosLineas(data2);
                            // comprobamos si es de mantenedor o cliente final.
                            var importe = vm.importeCliente(); // importe real de la factura;
                            var importeAlCliente = vm.importeCliente(); // importe al cliente final;
                            var clienteId = vm.clienteId();
                            var cliente = vm.nombreComercial();
                            var empresa = $("#cmbEmpresas").select2('data').text;
                            // si es un mantenedor su importe de factura es el calculado para él.
                            if (vm.mantenedorId()) {
                                importe = vm.importeMantenedor();
                                clienteId = vm.mantenedorId();
                                cliente = $("#txtMantenedor").val();
                            }
                            var prefacturas = crearPrefacturasConceptos(importe, importeAlCliente, vm.coste(), null, null, 1, vm.sempresaId(), clienteId, empresa, cliente,  dato);
                            vm.prefacturasAGenerar(prefacturas);
                            aceptarGenerarPrefacturas();
                        });
                    });
                }
}

function editFprmaPagoLineaConcepto(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/contratos/concepto/porcenteje/registro/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLineaConcepto(data[0]);
    });
}
function loadDataLineaConcepto(data) {
    vm.contratoPorcenId(data.contratoPorcenId);
    vm.conceptoCobro(data.concepto);
    vm.porcentajeCobro(data.porcentaje);
    vm.fechaConcepto(spanishDate(data.fecha));
    vm.importeCalculado(data.importe);
    loadFormasPagoLinea(data.formaPagoId);
    
}

function deleteConceptosLinea(contratoPorcenId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro, se borrarán además todas las prefacturas generadas que no se han generado atraves de conceptos / porcentajes ?";
    mensajeAceptarCancelar(mens, function () {
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/contratos/concepto/" + contratoPorcenId, null, function (err, data) {
            if (err) return;
            //una vez borrada borramos todas las prefacturas del contrato no generadas mediante conceptos y porcentajes
            llamadaAjax('DELETE', myconfig.apiUrl + "/api/contratos/borrar-prefacturas/concepto/todas/" + vm.contratoId(), null, function (err) {
                if (err) return;
                $('#modalConcepto').modal('hide');
                llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/conceptos/porcentaje/" + vm.contratoId(), null, function (err, data) {
                    loadTablaConceptosLineas(data);
                    loadPrefacturasDelContrato(vm.contratoId());
                });
                
            });
        });
    }, function () {
        // cancelar no hace nada
    });
}

function datosOKLineasConceptos() {
    $('#concepto-form').validate({
        rules: {
            txtConceptoCobro: {
                required: true
            },
            txtPorcentajeCobro: {
                required: true,
                number:true
            },
            txtImporteCalculado: {
                required: true,
                number:true
            },
            txtFechaConcepto: {
                required: true,
                greaterThan: '#txtFechaInicio',
                lessThan: '#txtFechaFinal'
            }
        },
        // Messages for form validation
        messages: {
            txtConceptoCobro: {
                required: "Debe dar un concepto"
            },
            txtPorcentajeCobro: {
                required: "Debe proporcionar un porcentaje",
                number: "Se tiene que introducir un numero válido"
            },
            txtImporteCalculado: {
                required: true,
                number:true
            },
            txtFechaConcepto: {
                required: "Debe proporcionar una fecha de factura",
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#concepto-form').valid();
}

function datosOKRecepcionGestion() {
    $('#generarRecepcionGestion-form').validate({
        rules: {
            txtFechaRecepcionGestion: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtFechaRecepcionGestion: {
                required: "Debe proporcionar una fecha",
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#generarRecepcionGestion-form').valid();
}

//FUNCIONES PLANIFICACION OBRAS

function initTablaPlanificacionLineasObras() {
    tablaLineasPlanificacion = $('#dt_lineasPlanificacionObras').DataTable({
        autoWidth: true,
        paging: false,
        responsive: true,
        "order": [[ 0, "asc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
        ],
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C >>" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            if(vm.tipoContratoId() == 8) {
                var c = api.data();
                calculaImportesInformativosPlanificacion(c)
             }
           
                
            // Total over all pages
            total4 = api
            .column( 3 )
            .data()
            .reduce( function (a, b) {
                return Math.round((intVal(a) + intVal(b)) * 100) / 100;
            }, 0 );

            // Update footer
            $( api.columns(3).footer() ).html(
                numeral(total4).format('0,0.00')
            );

            // Total over all pages
            total = api
            .column( 4 )
            .data()
            .reduce( function (a, b) {
                var dif = 0
                vm.importePlanificado(numeral(total).format('0,0.00'));
               
                dif = total -  vm.importeCliente();
                vm.diferencia(numeral(dif).format('0,0.00'));
                return Math.round((intVal(a) + intVal(b)) * 100) / 100;
            }, 0 );

            // Update footer
            $( api.columns(4).footer() ).html(
                numeral(total).format('0,0.00')
            );

              //////
             // Total over all pages
             total5 = api
             .column( 5 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );
 
             // Update footer
             $( api.columns(5).footer() ).html(
                 numeral(total5).format('0')
             );

            //////
             // Total over all pages
             total2 = api
             .column( 6 )
             .data()
             .reduce( function (a, b) {
                vm.certificacionFinalFormat(numeral(vm.certificacionFinal()).format('0,0.00'));
                //
                var dif2 = 0
                var tot2 = numeral(total2).format('0,0.00')
                vm.importePrefacturado(tot2);
                //
                dif2 = total2 - vm.certificacionFinal();
                vm.diferenciaPrefacturado(numeral(dif2).format('0,0.00'));
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );
 
             // Update footer
             $( api.columns(6).footer() ).html(
                 numeral(total2).format('0,0.00')
             );

             //////
             // Total over all pages
             total7 = api
             .column( 7 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );
 
             // Update footer
             $( api.columns(7).footer() ).html(
                 numeral(total7).format('0')
             );

            //////
             // Total over all pages
             total3 = api
             .column( 8 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );
 
             // Update footer
             $( api.columns(8).footer() ).html(
                 numeral(total3).format('0,0.00')
             );

             /////
             // Total over all pages
             total9 = api
             .column( 9 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );
 
             // Update footer
             $( api.columns(9).footer() ).html(
                 numeral(total9).format('0,0.00')
             );

             /////
             // Total over all pages
             total10 = api
             .column( 10 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );
 
             // Update footer
             $( api.columns(10).footer() ).html(
                 numeral(total10).format('0')
             );

              /////
             // Total over all pages
             total11 = api
             .column( 11 )
             .data()
             .reduce( function (a, b) {
                 return Math.round((intVal(a) + intVal(b)) * 100) / 100;
             }, 0 );
 
             // Update footer
             $( api.columns(11).footer() ).html(
                 numeral(total11).format('0,0.00')
             );
            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataPlanificacionLineas,
        columns: [  {
            data: "fecha",
            
        },{
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },{
            data: "concepto",
            
        }, {
            data: "porcentaje",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "importe",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "numPrefacturas",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0');
            }
        },{
            data: "importePrefacturado",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
            
        },{
            data: "numFacturas",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0');
            }
        },{
            data: "importeFacturado",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
            
        },{
            data: "importeFacturadoIva",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
            
        },{
            data: "numCobros",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0');
            }
        },
        {
            data: "importeCobrado",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
            
        },{
            data: "porRetenGarantias",
            
        },{
            data: "formaPagoNombre",
            
        }, {
            data: "contPlanificacionId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "";
                var bt2 = "";
                var bt3 = "";
                if(!vm.contratoCerrado()) {
                    if(row.importeFacturado == '0.00') {
                        bt1 = "<button class='btn btn-circle btn-danger' onclick='deletePlanificacionLineaObras(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                        bt3 = "<button class='btn btn-circle btn-primary'  data-toggle='modal' data-target='#modalGenerarPrefacturasObras' onclick='generarPrefacturaPlanificacionObras(" + data + ");' title='Generar prefacturas'> <i class='fa fa-stack-exchange'></i> </button>";
                    }
                   
                    if(row.importePrefacturado == '0.00') {
                        bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalPlanificacionObras' onclick='editPlanificacion(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    }
                   
                }
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + " " + bt3 + "</div>";
                return html;
            }
        }]
    });
    tablaLineasPlanificacion.columns(11).visible(false);
}

function calculaImportesInformativosPlanificacion(c) {
    if(!c) return;
    if(c.length > 0) {
        var totLetrasPlanificadas = 0;
        var numLetrasPlanificadas = 0;
         for(var i = 0; i < c.length; i++) {
             var s = c[i];
             if(s.esLetra == 1) {
                 //LETRAS PLANIFICADAS
                 totLetrasPlanificadas = totLetrasPlanificadas + parseFloat(s.importe);
                 numLetrasPlanificadas = numLetrasPlanificadas + parseInt(s.numPrefacturas);
 
                
             }
         }
         //diferencia entre letras planificadas y prefacturadas
         vm.totLetrasPlanificadas(Math.round(totLetrasPlanificadas * 100)/100);
         vm.numLetrasPlanificadas(Math.round((numLetrasPlanificadas) * 100)/100);
     }
}

function  loadPlanificacionLineasObras(id, numCobros) {
    var data = {
        numCobros: {
            numCobros
        }
    }
    llamadaAjax("POST", "/api/contratos/lineas/planificacion/" + id , data, function (err, data) {
        if (err) return;
        
        loadTablaPlanificacionLineasObras(data);
        loadPrefacturasDelContrato(id);
        
    });
}

function loadTablaPlanificacionLineasObras(data) {
    var a = null;
    if (data) {
        dataPlanificacion = data;
        numPlanificacion = data.length;
    } else {
        dataPlanificacion = null;
        numPlanificacion = 0;
    }
    var dt = $('#dt_lineasPlanificacionObras').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnCopiar').hide();
        $('#btnPorcentaje').hide();
        $('#btnDeleteTipo').hide();
    }
    dt.fnClearTable();
    if (data != null){
        dt.fnAddData(data);
        $('#btnCopiar').show();
        $('#btnPorcentaje').show();
        $('#btnDeleteTipo').show();
    }
    dt.fnDraw();
  
        if(vm.diferenciaPrefacturado()) {
            a =  parseFloat(numeroDbf(vm.diferenciaPrefacturado()));
        } else {
            a = null;
        }
   /*  if(a) {
        if(a >= -1 && vm.certificacionFinal()) {
            $('#chkContratoCerrado').prop('disabled', false);
        } else {
            $('#chkContratoCerrado').prop('disabled', true);
        }
    } else {
        $('#chkContratoCerrado').prop('disabled', true);
    } */
} 



function nuevaLineaPlanificacionObras() {
    limpiaDataLineaPlanificacionObras();
    lineaEnEdicion = false;
}

function limpiaDataLineaPlanificacionObras() {
    vm.conceptoCobro('');
    vm.porcentajeCobro(0);
    vm.fechaPlanificacionObras(vm.fechaInicio());
    vm.importeCalculado(0);
    vm.porRetenGarantias(0);
    loadFormasPagoLinea(vm.formaPagoId())

}


function aceptarLineaPlanificacionObras() {
    if (!datosOKLineasPlanificacionObras()) {
        return;
    }
    var data = {
        planificacion: {
            contPlanificacionId: 0,
            contratoId: vm.contratoId(),
            concepto: vm.conceptoPlanificacion(),
            porcentaje: vm.porcentajePlanificacion(),
            fecha: spanishDbDate(vm.fechaPlanificacionObras()),
            importe: vm.importeCalculadoPlanificacion(),
            porRetenGarantias: vm.porRetenGarantias(),
            formaPagoId: vm.sformaPagoIdLinea()
        }
    }
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/contratos/planificacion";
                if (lineaEnEdicion) {
                    data.planificacion.contPlanificacionId = vm.contPlanificacionId();
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/contratos/planificacion/" +  vm.contPlanificacionId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalPlanificacionObras').modal('hide');
                    llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/lineas/planificacion/" + vm.contratoId(), null, function (err, data) {
                        loadTablaPlanificacionLineasObras(data);
                        limpiarModalLineasPlanificacion();
                    });
                });
}



function generarPrefacturaPlanificacionObras(id) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/linea-planificacion/" + id, null, function (err, data) {
        if(err) return;
        RegPlanificacion = data
        var f = moment(data[0].fecha).format('DD/MM/YYYY');
        vm.fechaPlanificacionObras2(f);
        $('#chkVarias').prop('checked', false);
    });
                
}
function limpiarModalGenerarPrefacturasObras() {
    vm.fechaPlanificacionObras2(null);
    $('#chkVarias').prop('checked', false);
    RegPlanificacion = null;
}
function aceptarGenerarPrefacturaPlanificacionObras() {
    $('#modalGenerarPrefacturasObras').modal('hide');
    var opcion = $('#chkVarias').prop('checked');
    //limpiarModalGenerarPrefacturasObras();
    if(opcion) {
        $('#modalGenerarPrefacturasPlanificacion').modal({
            show: 'true'
        }); 
        generarPrefacturasPlanificacion(RegPlanificacion);

    } else {
         //comprobamos que le cliente tenga un nombre comercial
        var d = vm.nombreComercial();
        if(!d || d == '') return mensError("El cliente no tiene un nombre fiscal establecido en su ficha.");

        var clienteId = vm.clienteId();
        var cliente = vm.nombreComercial();
        var empresa = $("#cmbEmpresas").select2('data').text;
        RegPlanificacion[0].fecha = vm.fechaPlanificacionObras2()
        var prefacturas = crearPrefacturaPlanificacion(1, vm.sempresaId(), clienteId, empresa, cliente,  RegPlanificacion);
        vm.prefacturasAGenerar(prefacturas);
        aceptarGenerarPrefacturaPlanificacion();
    }
}

function editPlanificacion(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/contratos/linea-planificacion/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLineaPlanificacionObras(data[0]);
    });
}
function loadDataLineaPlanificacionObras(data) {
    vm.contPlanificacionId(data.contPlanificacionId);
    vm.conceptoPlanificacion(data.concepto);
    vm.porcentajePlanificacion(data.porcentaje);
    vm.fechaPlanificacionObras(spanishDate(data.fecha));
    vm.importeCalculadoPlanificacion(data.importe);
    vm.importeFacturado(data.importeFacturado);
    vm.importeCobrado(data.importeCobrado);
    vm.porRetenGarantias(data.porRetenGarantias);
    loadFormasPagoLinea(data.formaPagoId);
    
}

function deletePlanificacionLineaObras(contPlanificacionId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro, se borrarán además todas las prefacturas generadas que no se han generado atraves de conceptos / porcentajes ?";
    mensajeAceptarCancelar(mens, function () {
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/contratos/planificacion/" + contPlanificacionId, null, function (err, data) {
            if (err) return;
            llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/lineas/planificacion/" + vm.contratoId(), null, function (err, data) {
                loadTablaPlanificacionLineasObras(data);
                loadPrefacturasDelContrato(vm.contratoId());
            });
            //una vez borrada borramos todas las prefacturas del contrato no generadas mediante conceptos y porcentajes
            /* llamadaAjax('DELETE', myconfig.apiUrl + "/api/contratos/borrar-prefacturas/concepto/todas/" + vm.contratoId(), null, function (err) {
                if (err) return;
                $('#modalPlanificacionObras').modal('hide');
                llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/conceptos/porcentaje/" + vm.contratoId(), null, function (err, data) {
                    loadTablaPlanificacionLineasObras(data);
                    loadPrefacturasDelContrato(vm.contratoId());
                });
                
            }); */
        });
    }, function () {
        // cancelar no hace nada
    });
}

function datosOKLineasPlanificacionObras() {
    $('#conceptoObras-form').validate({
        rules: {
            txtConceptoPlanificacion: {
                required: true
            },
            txtPorcentajePlanificacion: {
                required: true,
                number:true
            },
            txtImporteCalculadoPlanificacion: {
                required: true,
                number:true
            },
            txtFechaPlanificacionObras: {
                required: true,
                greaterThan: '#txtFechaInicio',
                lessThan: '#txtFechaFinal'
            }
        },
        // Messages for form validation
        messages: {
            txtConceptoPlanificacion: {
                required: "Debe dar un concepto"
            },
            txtPorcentajePlanificacion: {
                required: "Debe proporcionar un porcentaje",
                number: "Se tiene que introducir un numero válido"
            },
            txtImporteCalculadoPlanificacion: {
                required: true,
                number:true
            },
            txtFechaPlanificacionObras: {
                required: "Debe proporcionar una fecha de factura",
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#conceptoObras-form').valid();
}

function limpiarModalLineasPlanificacion() {
    vm.contPlanificacionId(null);
    vm.conceptoPlanificacion(null);
    vm.porcentajePlanificacion(null);
    vm.fechaPlanificacionObras(null);
    vm.importeCalculadoPlanificacion(null);
    vm.porRetenGarantias(null);
    loadFormasPagoLinea(null);
}

function actulizaCobroPlanificacion() {

    var impCobro = 0
    data.forEach( function(d) {
        impCobro = impCobro + d.impCobro
    });

}


//contrato asociado
function crearContratoAsociado() {
    var data = {
        contrato:{
            contratoId: vm.contratoId()
        }
    }
    llamadaAjax("POST", myconfig.apiUrl + "/api/contratos/crear/contrato/asociado", data, function (err, result) {
        if(err) return;
        window.open("ContratoDetalle.html?ContratoId=" + result.insertId + "&CMD=NEW&AscContratoId=" + vm.contratoId() + '&DesdeContrato=true', '_new');
    });
}

var actualizaAsociados = function(seleccionado, done) {
    if(esVinculado) return done(null, 'OK');
    var data = {
        contrato: {
            firmaActa: seleccionado,
            contratoCerrado: vm.contratoCerrado()
        }
    };
    if(vm.fechaFirmaActa() && vm.fechaFirmaActa() != "") data.contrato.fechaFirmaActa =  spanishDbDate(vm.fechaFirmaActa());
    llamadaAjax('PUT', myconfig.apiUrl + "/api/contratos/vinculados/actualiza/" + vm.contratoId(), data, function (err, result) {
        if (err) return errorGeneral(err, done);
        done(null, 'OK')
    });
}

/*----------------------------------------------------------
    Funciones relacionadas con las lines de contratos asociados
 -----------------------------------------------------------*/


function datosOKAscContratos() {
    $('#comisionista-form').validate({
        rules: {
            cmbComerciales: {
                required: true
            },
            txtPorComer: {
                number: true
            }
        },
        // Messages for form validation
        messages: {
            cmbComerciales: {
                required: "Debe elegir un colaborador"
            },
            txtPorComer: {
                number: "Debe ser un número válido"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#comisionista-form").validate().settings;
    return $('#comisionista-form').valid();
}

function initTablaAscContratos() {
    tablaCarro = $('#dt_AscContratos').dataTable({
        autoWidth: true,
        "paging": false,
        responsive: true,
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataAscContratos,
        columns: [{
            data: "contratoId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                return html;
            }
        }, {
            data: "referencia"
        }, {
            data: "tipo"
        }, {
            data: "fechaInicio",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "fechaFinal",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },  {
            data: "empresa"
        }, {
            data: "cliente"
        }, {
            data: "total",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "mantenedor"
        }, {
            data: "agente"
        },{
            data: "contratoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteAscContrato(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editAscContrato(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printContrato(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });
}

function editAscContrato(id) {
    lineaEnEdicion = true;
    $.ajax({
        type: "GET",
        url: "/api/contratos/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if (data) {
                loadAscContrato(data);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function deleteAscContrato(id) {
    var mensaje = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mensaje, function () {
        // aceptar borra realmente la línea
        var data = {
            contratoId: id
        };
        llamadaAjax('DELETE', myconfig.apiUrl + "/api/contratos/" + id, data, function (err, data) {
            if (err) return;
            loadAscContratos(vm.contratoId());
        });
    }, function () {
        // cancelar no hace nada
    });
}

function loadAscContrato(data) {
    var url = "ContratoDetalle.html?DesdeContrato=true&AscContratoId=" + vm.contratoId() + "&ContratoId=" +data.contratoId;
    window.open(url, '_new');
}


function loadTablaAscContratos(data) {
    //if (data) numAscContratos = data.length;
    var dt = $('#dt_AscContratos').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        //numAscContratos = 0;
    }
    dt.fnClearTable();
    if (data) dt.fnAddData(data);
    dt.fnDraw();
}

function loadAscContratos(id) {
    llamadaAjax('GET', "/api/contratos/vinculados/" + vm.contratoId(), null, function (err, data) {
        if (err) return;
        loadTablaAscContratos(data);
    });
}

function ocualtaBotonesContratoCerrado() {
    $('#btnAceptar').hide();
    $('#btnAceptar2').hide();
    if(usuario.puedeAbrir)  { $('#btnAceptar').show();  $('#btnAceptar2').show() }
    $('#btnNuevoComisionista').hide();
    $('#btnAltaPrefactura').hide();
    $('#btnAltaFacprove').hide();
    $('#btnAltaAntprove').hide();
    $('#btnAltaFactcol').hide();
    $('#btnAltaAntcol').hide();
    $('#btnContratoAsociado').hide();
    //
    $('#btnGenerarPrefacturas').hide();
    $('#btnNuevaLineaConcepto').hide();
    $('#btnNuevaLineaPlanificacionObras').hide();

}

// FUNCIONES RELACIONADAS CON LA DOCUMENTACIÓN

function initTablaDocumentacion() {
    tablaDocumentacion = $('#dt_documentacion').DataTable({
        autoWidth: true,
        paging: true,
        responsive: false,
        "bDestroy": true,
        "columnDefs": [
            { "width": "5%", "targets": 0 },
            { "width": "8%", "targets": 2 },
            { "width": "5%", "targets": 3 },
            { "width": "13%", "targets": 4 },

          ],
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataDocumentacion,
        columns: [
            {
                
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
                //data:"carpetaId",
            },
            {
                data: "carpetaNombre",
            },
            {
                data: "tipo",
            },
            {
                data: "documentos",
                render: function (data, type, row) {
                    if(!row.documentos) return 0;
                    return row.documentos.length; ;
                }
            },
            {
            data: "carpetaId",
            render: function (data, type, row) {
                var html = "";
                var bt = "";
                var bt2 = "";
                var bt3 = "";
                if(usuario.puedeEditar) {
                    var bt = "<button class='btn btn-circle btn-success'  data-toggle='modal' data-target='#modalUploadDoc' onClick='preparaDatosArchivo(" + JSON.stringify(row) + ")' title='Subir documernto'> <i class='fa fa-arrow-up fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-info' data-toggle='modal' data-target='#modalpostSubcarpeta' onclick='nuevaSubcarpeta(" + JSON.stringify(row) + ");' title='Crear subcarpeta'> <i class='fa fa-folder fa-fw'></i> </button>";
                    var bt3 = "<button class='btn btn-circle btn-danger' onclick='deleteCarpeta(" + data +");' title='Eliminar carpeta'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    //if(!usuario.borrarCarpeta) bt3 = "";
                } else {
                    var bt = "<button class='btn btn-circle btn-success'  data-toggle='modal' data-target='#modalUploadDoc' onClick='preparaDatosArchivo(" + JSON.stringify(row) + ")' title='Subir documernto'> <i class='fa fa-arrow-up fa-fw'></i> </button>";
                  
                }
               
                return html = "<div class='pull-right'>" + bt + " " + bt2 + " " + bt3 +"</div>";
            }
        }]
    });
}

function cargaTablaDocumentacion(){
    llamadaAjax("GET",  "/api/documentacion/contrato/"  +  vm.ofertaId()  + "/" + vm.tipoContratoId() + "/" + vm.contratoId(), null, function (err, data) {
        if (err) return;
        if(data) loadTablaDocumentacion(data);
    });
}

function loadTablaDocumentacion(data) {
    var dt = $('#dt_documentacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function formatData(d) {
    if(!d.documentos) d.documentos = [];
    var doc = d.documentos;
    var html = "";
        html = '<h6 style="padding-left: 5px"> DOCUMENTOS</h6>'
        var a;
        doc.forEach(e => {
            var l = e.key.split('/');
            var index = l.length - 1;
             a = '<div class="row" style="margin-bottom: 10px">' +
                        '<section class="col col-md-5">' + 
                            '<a href="' + e.location  + '" target="_blank">' +  l[index] +'</a>' +
                        '</section>' +
                        '<section class="col col-md-3 text-left">' +
                            '<button  class="btn btn-circle btn-danger"  onclick="deleteDocumento(' + e.documentoId + ')" title="Eliminar registro"> <i class="fa fa-trash-o fa-fw"></i> </button>' +
                        '</section>' +
                        '<section class="col col-md-4">' + '</section>' +
                    '</div>' 
            html += a;
        });
    return html;
}


function formatDataCobros(d) {
    if(!d.lin) d.lin = [];
    var lin = d.lin;
    var html = "";
    html = '<h5> APUNTES DEL COBRO</h5>'
    html += '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;">'
    lin.forEach(e => {
        var d = e.timporteH - e.timporteD
         html += 
         '<tr>' +
            '<th>Fecha de entrada:</th>' +
            '<th>Asiento:</th>' +
            '<th>Num. linea:</th>' +
            '<th>Num. documento:</th>' +
            '<th>Nom. documento:</th>' +
            '<th>IMPORTE:</th>' +
            '<th>ES DEVOLUCION:</th>' +
         '</tr>' +
         
         '<tr>' +
            
            '<td>' +
                formatFecha(e.fechaent)  +
            '</td>' +
            
            '<td>' +
                e.numasien +
            '</td>' +
            
            '<td>' +
                e.linliapu +
            '</td>' +
            
            '<td>' +
                e.numdocum +
            '</td>' +
            
            '<td>' +
                e.ampconce +
            '</td>' +

            '<td>' +
                numeral(d).format('0,0.00');+
            '</td>' +
            
            '<td>'  +
           
                e.esdevolucion +
            '</td>' +
        '</tr>'
       
    });
    html +=  '</table>'
    return html
}

 function formatFecha(f) {
    if(f) return spanishDate(f);
    return ' ';
 }

function preparaDatosArchivo(r) {
    docName = r.carpetaNombre + "_" + vm.referencia() + "_" + vm.nombreCliente();
    carpetaId = r.carpetaId;
    docName = docName.replace(/[\/]/g, "-");
    console.log(docName);
    carpeta = r.carpetaNombre;
    key = r.carpetaNombre   + "/" +  docName;
    carpetaTipo = r.tipo;
    vm.documNombre(docName);
}

function limpiaDatosArchivo(r) {
    docName = null
    carpetaId = null
    docName = null
    carpeta = null
    $('.progress-bar').text(parseInt((0)+'%'));
    $('.progress-bar').width(parseInt((0)+'%'));
}

function nuevaCarpeta() {
    vm.carpetaNombre(null);
}


function aceptarNuevaCarpeta() {
        //CREAMOS EL REGISTRO EN LA TABLA carpetas
        if( vm.carpetaNombre() == '' || vm.carpetaNombre() == null) return mensError('Se tiene que asignar un nombre');
        var a = vm.carpetaNombre();
        a = a.trim();
        a = a.replace(/[\/]/g, "-");
        var data = 
        {
            carpeta: {
                carpetaId: 0,
                nombre: a,
                tipo: "contrato",
                departamentoId: vm.tipoContratoId()
            }
        }

        llamadaAjax('POST', myconfig.apiUrl + "/api/documentacion/carpeta", data, function (err, data) {
            if (err) return
            $('#modalNuevaCarpeta').modal('hide');
            mensNormal('Carpeta creada con exito');
            cargaTablaDocumentacion();
        });
}

function aceptarNuevaSubCarpeta() {
    //CREAMOS EL REGISTRO EN LA TABLA carpetas
    if( vm.subCarpetaNombre() == '' || vm.subCarpetaNombre() == null) return mensError('Se tiene que asignar un nombre');
    var a =  vm.subCarpetaNombre();
    a = a.trim();
    a = a.replace(/\//g, "-");
    var n = subCarpeta + "/" + a;
    var data = 
    {
        carpeta: {
            carpetaId: 0,
            nombre: n,
            tipo: carpetaTipo,
            departamentoId: vm.tipoContratoId()
        }
    }

    llamadaAjax('POST', myconfig.apiUrl + "/api/documentacion/carpeta", data, function (err, data) {
        if (err) return
        $('#modalpostSubcarpeta').modal('hide');
        mensNormal('Carpeta creada con exito');
        cargaTablaDocumentacion();
    });
}


function nuevaSubcarpeta(r) {
    vm.subCarpetaNombre(null);
    subCarpeta = r.carpetaNombre;
    carpetaTipo = r.tipo
}


function deleteDocumento(id) {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        var parametros = data;
        AWS.config.region = parametros.bucket_region_docum; // Región
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: parametros.identity_pool_docum,
        });
        llamadaAjax('GET', "/api/documentacion/" + id, null, function (err, data) {
            if (err) return;
            if(data) {
                var params = {
                    Bucket: parametros.bucket_docum,
                    Key: data.key
            }
    
            //borramos el documento en s3
            var s3 = new AWS.S3({ params });
    
            s3.deleteObject({}, (err, result) => {
                if (err) mensError('Error al borrar el docuemnto');
                //Actualizamos la tabla documentacion
                llamadaAjax('DELETE', myconfig.apiUrl + "/api/documentacion/elimina-documento/" + id, null, function (err, data) {
                    if (err) return;
                    cargaTablaDocumentacion();
                });
            }); 
            
            }
        });
    })
}

function deleteCarpeta(id) {
    var mens = "¿Realmente desea borrar esta carpeta, se borrarán todos los archivos y carpetas que contiene y no se podrá recuperar?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            
            llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
                if (err) return;
                var parametros = data;
                llamadaAjax('DELETE', "/api/documentacion/elimina-carpeta/" + id, null, function (err, data2) {
                    if (err) return mensError('Fallo al borrar la documentación en la base de datos');
                    if(data2) {
                        
                    AWS.config.region = parametros.bucket_region_docum; // Región
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: parametros.identity_pool_docum,
                    });
                    var prefix = data2.nombre;
                    var params = {
                        Bucket: parametros.bucket_docum,
                        Prefix: prefix,
                        Delimeter: "/"
                    }
        
                    var s3 = new AWS.S3({ params });
                    s3.listObjectsV2({}, (err, result) => {
                        if (err) mensError('Error de lectura en la nube');
                        console.log(result);
                        if(result.Contents.length > 0) {



                    var objectKeys = []
                    result.Contents.forEach(e => {
                        objectKeys.push(e.Key);
                    });

                    // Crea un objeto Delete para especificar los objetos que se van a eliminar
                    const objects = objectKeys.map(key => ({ Key: key }));
                    const deleteParams = {
                    Bucket: parametros.bucket_docum,
                    Delete: { Objects: objects }
                    };

                    // Elimina los objetos utilizando el método deleteObjects del objeto S3
                    s3.deleteObjects(deleteParams, function(err, data) {
                        if (err) {
                            mensError('Fallo al borrar la carpeta en la nube');
                        } else {
                            mensNormal('Carpeta eliminada con éxito');
                            cargaTablaDocumentacion();
                        }
}                   );

                        } else {
                            mensAlerta('No se han encontrado archivos en la nube para borrar');
                            cargaTablaDocumentacion();
                        }
                       
                    }); 
            
                  
                    
                    } else {
                        mensError('No se han encontrado carpetas para borrar');
                        cargaTablaDocumentacion();
                    }
                }); 
            })
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function aceptarSubirDocumentos() {
    if(vm.documNombre() == '') return mensError("Se tiene que asignar un nombre al documento.");
    //buscamos los parámetros
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        parametros = data;
        var files = $("#upload-input").get(0).files;
        var arr = [];
        if (!files.length) {
            mensError('Debe escoger seleccionar un archivo para subirlo al repositorio');
            return;
        }
        for(var i = 0; i< files.length; i++) {
            var e = files[i];
            var encontrado = false;
            var id = 0;
            var file = e;
            var ext = file.name.split('.').pop().toLowerCase();
            var blob = file.slice(0, file.size, file.type); 
            var newFile = new File([blob], {type: file.type});
            var nom = "";
            nom = vm.documNombre()
            if(files.length > 1) {
                var s = parseInt(i)
                s++
                nom = nom + "-" + s + "." + ext;
            } else {
                nom = nom + "." + ext;
            }
            nom = nom.replace(/\//g, "-");
            newFile.nom = nom;
            var fileKey =  carpeta + "/" + nom
            newFile.fileKey = fileKey;
            newFile.repetido = false;
            arr.push(newFile);
        }
        //buscamos si el documento ya existe en la carpeta de destino
        llamadaAjax('GET', "/api/documentacion/documentos/de/la/carpeta/" + carpetaId, null, function (err, docums) {
            if (err) return;
            if(docums && docums.length > 0) {
                for(var i = 0; i < docums.length; i++) {
                    var d = docums[i];
                    var n = d.key.split('/');
                    var index = n.length - 1
                    
                    for(var j = 0; j < arr.length; j++) {
                        if(n[index] == arr[j].nom) {
                            encontrado = true;
                            arr[j].repetido = true;
                            arr[j].documentoId = d.documentoId;
                            arr[j].repetido = true;
                            break;
                        } 
                    }
                }

                if(encontrado) {
                    var mens = "Ya existen documentos con este nombre en esta carpeta, se reemplazará con el que está apunto de subir. ¿Desea continuar?";
                    $.SmartMessageBox({
                        title: "<i class='fa fa-info'></i> Mensaje",
                        content: mens,
                        buttons: '[Aceptar][Cancelar]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Aceptar") {
                            method = 'PUT';
                            uploadDocum(arr);
                        }
                        if (ButtonPressed === "Cancelar") {
                            $('#upload-input').val([]);
                        }
                    });

                } else {
                    uploadDocum(arr);
                }
            } else {
                uploadDocum(arr);
            }
        }); 

    });
    
}

function uploadDocum(arr) {
    var index = 0;
      
        arr.forEach(e => {
            var repetido = e.repetido;
            var documentoId = e.documentoId;
            var filekey = e.fileKey;
            delete e.fileKey
            delete e.documentoId;
            delete e.repetido;
            delete e.nom;

            AWS.config.region = parametros.bucket_region_docum; // Región
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: parametros.identity_pool_docum,
            });
            var bucket = parametros.bucket_docum;
            var params = {
                Bucket: bucket,
                Key: filekey,
                IdentityPoolId: parametros.identity_pool_docum,
                Body: e,
                ACL: "public-read"
            }
            // Use S3 ManagedUpload class as it supports multipart uploads
            var upload = new AWS.S3.ManagedUpload({
                params: params
            });
            var promise = upload.on('httpUploadProgress', function(evt) {
                $('.progress-bar').text(parseInt((evt.loaded * 100) / evt.total)+'%');
                $('.progress-bar').width(parseInt((evt.loaded * 100) / evt.total)+'%');
              })
              .promise();
            promise.
            then (
                data => {
                    if(data) {
                        //CREAMOS EL REGISTRO EN LA TABLA ofertaDocumantacion
                        var data = 
                        {
                            documentacion: {
                                documentoId: 0,
                                ofertaId: null,
                                contratoId: null,
                                parteId: null,
                                carpetaId: carpetaId,
                                location: data.Location,
                                key: filekey
                            }
                        }
                        if(carpetaTipo == "oferta") {
                            data.documentacion.ofertaId =  vm.ofertaId();
                        }else if(carpetaTipo == "contrato") {
                            data.documentacion.contratoId = vm.contratoId();
                        }
    
                        if(!repetido) {
                            method = 'POST';
                            url = "/api/documentacion";
                        } else {
                            data.documentacion.documentoId = e.documentoId;
                            method = 'PUT';
                            url = "/api/documentacion/" + documentoId;
                        }
        
                        llamadaAjax(method, myconfig.apiUrl + url, data, function (err, data) {
                            if (err) return mensError(err);
                            index++
                            if(index == arr.length) {
                                $('#modalUploadDoc').modal('hide');
                                mensNormal('Archivo subido con exito');
                                limpiaDatosArchivo();
                                cargaTablaDocumentacion();
                            }
                        });
                    }
                },
                err =>{
                    if (err) return mensError(err);
                }
            );        
            });       
}

