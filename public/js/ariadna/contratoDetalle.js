/*-------------------------------------------------------------------------- 
contratoDetalle.js
Funciones js par la página ContratoDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var contratoId = 0;
var lineaEnEdicion = false;

var dataContratosLineas;
var dataBases;
var dataComisionistas;
var dataGenerarPrefacturas;
var dataPrefacturas;
var dataFacturas;
var dataAscContratos;
var dataContratosCobros;
var ContratoId = 0;
var cmd;
var usuario;
var dataConceptosLineas;
var numConceptos = 0;
var dataConceptos; 
var numPrefacturas = 0;
var importePrefacturas = 0;
var importePrefacturasConcepto = 0;
var usaCalculadora;
var calcInv = false;
var DesdeContrato
var AscContratoId;
var esVinculado = false;
var numLineas = 0;
//var numAscContratos = 0;


var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

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
    $('#txtNumPagos').on('blur', verPrefacturasAGenerar2);

    // asignación de eventos al clic
    $("#btnAceptar").click(clicAceptar);
    $("#btnSalir").click(salir());
    $("#btnImprimir").click(imprimir);
    $('#txtPrecio').focus( function () {
        $('#txtPrecio').val(null);
    })
    $("#frmContrato").submit(function () {
        return false;
    });
    $("#frmPrefacturas").submit(function () {
        return false;
    });
    $('#frmFacprove').submit(function () {
        return false;
    })
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
    
    $("#frmLineaConceptos").submit(function () {
        return false;
    });
    $("#frmAscContratos").submit(function () {
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
        }
    });

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

   /*  $('#chkContratoCerrado').change(function() {
        if ($(this).is(':checked')) {
            borrarPrefacturas();
        }
    }); */
    

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


    initAutoCliente();
    initAutoMantenedor();
    initAutoAgente();


    $("#cmbFormasPagoLinea").select2(select2Spanish());
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

    initTablaPrefacturas();
    initTablaFacturas();
    initTablaFacproves();
    initTablaContratosCobros();
    initTablaAscContratos();

    initTablaConceptosLineas();
    $("#cmbComerciales").select2(select2Spanish());
    loadComerciales();
    $("#cmbComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioComercial(e.added);
    });

    $("#btnAltaPrefactura").click(nuevaPrefactura);

    $('#btnAltaFacprove').click(nuevaFacprove);

    reglasDeValidacionAdicionales();

    cmd = gup('CMD');
    ContratoId = gup('ContratoId');
    DesdeContrato = gup('DesdeContrato');
    AscContratoId = gup('AscContratoId')

    if (cmd) mostrarMensajeEnFuncionDeCmd(cmd);

    //$('#sinUso').hide();//ocultamos campo sin uso
   

    $('#btnNuevaLinea').prop('disabled', false);
    $('#btnAceptarLinea').prop('disabled', false);


    contratoId = gup('ContratoId');
    if (contratoId != 0) {
        llamadaAjax('GET', myconfig.apiUrl + "/api/contratos/uno/campo/departamento/" + contratoId, null, function (err, data) {
            if (err) return;
            

            loadData(data);
            loadLineasContrato(data.contratoId);
            loadBasesContrato(data.contratoId);
           
            //loadComisionistas(data.contratoId);
            loadPrefacturasDelContrato(data.contratoId);
            loadFacturasDelContrato(data.contratoId);
            loadFacproveDelContrato(data.contratoId);
            loadContratosCobros(data.contratoId);
            buscaComisionistas(data.contratoId);
            loadAscContratos(data.contratoId);
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.firmaActa("0");
        vm.contratoId(0);
        vm.porcentajeRetencion(0);
        obtenerPorcentajeBeneficioPorDefecto();
        // ocultamos líneas y bases
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
        $('#btnAltaFacprove').hide();
        $('#btnAltaPrefactura').hide();
        $('#btnContratoAsociado').hide();
        
        //
        document.title = "NUEVO CONTRATO";
    }


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
    self.mantenedorId = ko.observable();
    self.agenteId = ko.observable();
    self.fechaContrato = ko.observable();
    self.empresaId = ko.observable();
    self.servicioId = ko.observable();
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
    self.certificacionFinal = ko.observable();
    self.importeMantenedor = ko.observable();
    //
    self.fechaInicio = ko.observable();
    self.fechaFirmaActa = ko.observable();
    self.fechaFinal = ko.observable();
    self.fechaPrimeraFactura = ko.observable();
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
    

    //-- Valores para la generación de prefacturs
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
}

function loadData(data) {  
    $('#btnNuevaLinea').show(); 
    vm.contratoId(data.contratoId);
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
   

    loadConceptosLineas(data.contratoId);
    loadDepartamento(data.tipoContratoId);
    recalcularCostesImportesDesdeCoste();
    
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

var clicAceptar = function () {
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
        window.open(url, '_self');
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


var cambioCliente = function (data) {
    //
    if (!data) {
        return;
    }
    var clienteId = data.id;
    llamadaAjax('GET', "/api/clientes/" + clienteId, null, function (err, data) {
        if (err) return;
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
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_lineas'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteContratoLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editContratoLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_bases'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
        vm.iban(data.iban);
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
var imprimir = function () {
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
}

var f_open_post = function (verb, url, data, target) {
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
};

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
        llamadaAjax('POST', myconfig.apiUrl + "/api/contratos/comisionista", data, function (err, data) {
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
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_comisiones'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteComisionista(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalComisionista' onclick='editComisionista(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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
            llamadaAjax('GET', "/api/contratos/colaborador/asociado/defecto/" + vm.agenteId(), null, function (err, data2) {
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
}

var generarPrefacturas = function () {
   /*  if(importePrefacturas > vm.importeCliente()) {
        mensError("Ya se ha prefacturado el total del contrato");
        setTimeout(function(){ $('#modalGenerarPrefacturas').modal('hide');; }, 100);
        return;
    }
 */
    var resto = 0;
    if(numConceptos > 0 && importePrefacturas == 0) {
        modificaFormulario(true);
    } else {
        modificaFormulario(false);
    }
    $("#cmbPeriodosPagos").select2(select2Spanish());
    loadPeriodosPagos(vm.speriodoPagoId());
    $("#cmbPeriodosPagos").select2().on('change', function (e) {
        cambioPeriodosPagos(e.added);
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
    $("#generar-prefacturas-form").submit(function () {
        return false;
    });
}

function modificaFormulario(option) {
    $("#cmbPeriodosPagos").prop('disabled', option);
    $("#txtGFechaPrimeraFactura").prop('disabled', option);
    $("#txtGFechaInicio").prop('disabled', option);
    $("#txtGFechaFinal").prop('disabled', option);
    $("input[name='chkFacturaParcial']").prop("disabled", option);
}

var cambioPeriodosPagos = function (data) {
    vm.numPagos(calcularNumPagos());
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
    
    // comprobamos si es de mantenedor o cliente final.
    var importe = vm.importeCliente(); // importe real de la factura;
    var importeAlCliente = vm.importeCliente(); // importe al cliente final;
    var clienteId = vm.clienteId();
    var cliente = $("#txtCliente").val();
    var empresa = $("#cmbEmpresas").select2('data').text;
    // si es un mantenedor su importe de factura es el calculado para él.
    if (vm.mantenedorId()) {
        importe = vm.importeMantenedor();
        clienteId = vm.mantenedorId();
        cliente = $("#txtMantenedor").val();
    }
    // var prefacturas = crearPrefacturas(importe, importeAlCliente, vm.coste(), spanishDbDate(vm.fechaPrimeraFactura()), spanishDbDate(vm.fechaSiguientesFacturas()), calcularNumPagos(), vm.sempresaId(), clienteId, empresa, cliente);
    if(numConceptos > 0 && importePrefacturas == 0) {
        var prefacturas = crearPrefacturasConceptos(importe, importeAlCliente, vm.coste(), spanishDbDate(dataConceptos[1].fecha), spanishDbDate(vm.fechaSiguientesFacturas()), numConceptos, vm.sempresaId(), clienteId, empresa, cliente, null);
    } else {
        var prefacturas = crearPrefacturas2(importe - importePrefacturasConcepto, importeAlCliente - importePrefacturasConcepto, vm.coste(), spanishDbDate(vm.fechaPrimeraFactura()), spanishDbDate(vm.fechaSiguientesFacturas()), calcularNumPagos(), vm.sempresaId(), clienteId, empresa, cliente);
    }
    vm.prefacturasAGenerar(prefacturas);
    loadTablaGenerarPrefacturas(prefacturas);
}

var verPrefacturasAGenerar2 = function () {
    if (!generarPrefacturasOK()) return;
    
    // comprobamos si es de mantenedor o cliente final.
    var importe = vm.importeCliente(); // importe real de la factura;
    var importeAlCliente = vm.importeCliente(); // importe al cliente final;
    var clienteId = vm.clienteId();
    var cliente = $("#txtCliente").val();
    var empresa = $("#cmbEmpresas").select2('data').text;
    // si es un mantenedor su importe de factura es el calculado para él.
    if (vm.mantenedorId()) {
        importe = vm.importeMantenedor();
        clienteId = vm.mantenedorId();
        cliente = $("#txtMantenedor").val();
    }
    var prefacturas = crearPrefacturas2(importe - importePrefacturasConcepto, importeAlCliente - importePrefacturasConcepto, vm.coste(), spanishDbDate(vm.fechaPrimeraFactura()), spanishDbDate(vm.fechaSiguientesFacturas()), $('#txtNumPagos').val(), vm.sempresaId(), clienteId, empresa, cliente);
    vm.prefacturasAGenerar(prefacturas);
    loadTablaGenerarPrefacturas(prefacturas);
}

var aceptarGenerarPrefacturas = function () {
    if (!generarPrefacturasOK()) return;
    if (vm.prefacturasAGenerar().length == 0) {
        return;
    }
    $('#btnAceptarGenerarPrefacturas').prop('disabled', true);
    var data = {
        prefacturas: vm.prefacturasAGenerar()
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
            txtGFechaSiguientesFacturas: {
                required: true
            }
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
            txtGFechaSiguientesFacturas: {
                required: "Debe elegir una fecha"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    // var opciones = $("#generar-prefacturas-form").validate().settings;
    return $('#generar-prefacturas-form').valid();
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

function crearPrefacturas(importe, importeAlCliente, coste, fechaInicial, fechaSiguientesFacturas, numPagos, empresaId, clienteId, empresa, cliente) {
    // calculamos según la periodicidad
    var divisor = obtenerDivisor();
    // si hay parcial el primer pago será por la diferencia entre el inicio de contrato y el final
    // de mes 
    var inicioContrato = new Date(spanishDbDate(vm.fechaInicio()));
    var iniContrato = moment(inicioContrato).format('YYYY-MM-DD');
    var finMesInicioContrato = moment(inicioContrato).endOf('month');
    var diffDias = finMesInicioContrato.diff(inicioContrato, 'days');

    var importePago = roundToSix(importe / numPagos);
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
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_generar_prefacturas'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
        data: dataGenerarPrefacturas,
        columnDefs: [{
            "width": "20%",
            "targets": [2, 3]
        }],
        columns: [{
            data: "fecha"
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
    url += "/" + clienteId;
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
function initTablaPrefacturas() {
    tablaPrefacturas = $('#dt_prefactura').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [{
                "sExtends": "pdf",
                "sTitle": "Prefacturas Seleccionadas",
                "sPdfMessage": "proasistencia PDF Export",
                "sPdfSize": "A4",
                "sPdfOrientation": "landscape",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "copy",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "csv",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "xls",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "print",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_prefactura'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
            data: "total"
        }, {
            data: "totalConIva"
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
                    bt1 = "<button class='btn btn-circle btn-danger' onclick='deletePrefactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
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
    tablaPrefacturas.columns(8).visible(false);
    tablaPrefacturas.columns(10).visible(false);
}

function loadPrefacturasDelContrato(contratoId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/prefacturas/contrato/" + contratoId, null, function (err, data) {
        if (err) return;
        loadTablaPrefacturas(data);
    });
}

function loadTablaPrefacturas(data) {
    
    var dt = $('#dt_prefactura').dataTable();
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

//---- Solapa facturas
function initTablaFacturas() {
    tablaFacturas = $('#dt_factura').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [{
                "sExtends": "pdf",
                "sTitle": "Facturas Seleccionadas",
                "sPdfMessage": "proasistencia PDF Export",
                "sPdfSize": "A4",
                "sPdfOrientation": "landscape",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "copy",
                "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "csv",
                "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "xls",
                "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "print",
                "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_factura'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
            data: "total"
        }, {
            data: "totalConIva"
        }, {
            data: "vFac"
        }, {
            data: "vFPago"
        }, {
            data: "observaciones"
        }, {
            data: "facturaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
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
    tablaFacturas.columns(8).visible(false);
    tablaFacturas.columns(10).visible(false);
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
    tablaFacproves = $('#dt_facprove').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "Facturas Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_facprove'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
        }, {
            data: "total"
        }, {
            data: "totalConIva"
        },  {
            data: "vFPago"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFacprove(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
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
    llamadaAjax("GET", myconfig.apiUrl +  "/api/facturasProveedores/contrato/" + contratoId, null, function (err, data) {
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
                    var fn = buscarFacprocves();
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

function buscarFacprocves() {
    var mf = function () {
        loadFacproveDelContrato(contratoId);
    };
    return mf;
}

// -- Modal renovacion del contrato

var prepararRenovacion = function () {
    proponerFechasRenovacion();
};


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
function crearPrefacturas2(importe, importeAlCliente, coste, fechaPrimeraFactura, fechaSiguientesFacturas, numPagos, empresaId, clienteId, empresa, cliente) {
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

    var importePago = roundToSix(importe / numPagos);
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
            clienteId: clienteId,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            empresa: empresa,
            cliente: cliente,
            periodo: f0 + "-" + f2
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
    /* if( acumulado < (importe - 0.01)  || acumulado  > importe + 0.01) {
        mensError('Revise los conceptos, la suma de los importes de las facturas no se corresponden con el total del contrato');
        return;
    } */
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
            empresa: empresa,
            cliente: cliente,
            periodo: f0 + "-" + f2,
            observacionesPago: cabecera + campoDestacado + cabOtrosConceptos + otrosConceptos,
            contratoPorcenId: contratoPorcenId,
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

/* FUNCIONES RELACIONADAS CON LA CARGA DE LA TABLA HISTORIAL DE COBROS */

function initTablaContratosCobros() {
    tablaCarro = $('#dt_contratosCobros').dataTable({
        sort: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_contratosCobros'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow, aData) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
            if ( !aData.seguro )
            {
                $('td', nRow).css('background-color', 'Orange');
            }
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
        columns: [{
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
        }, {
            data: "impvenci",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "fecultco",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        }, {
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
        "order": [[ 0, "asc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
        ],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_lineasConcepto'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteConceptosLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalConcepto' onclick='editFprmaPagoLineaConcepto(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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
                                    var cliente = $("#txtCliente").val();
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
                            var cliente = $("#txtCliente").val();
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
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_AscContratos'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
            data: "total"
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
