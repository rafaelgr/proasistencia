/*-------------------------------------------------------------------------- 
prefacturaDetalle.js
Funciones js par la página PrefacturaDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var prefacturaId = 0;
var ContratoId = 0;
var EmpresaId = 0;
var ClienteId = 0;
var usuario;
var desdeContrato;

var cmd = "";
var lineaEnEdicion = false;

var dataPrefacturasLineas;
var dataBases;

var usaCalculadora;
var usaContrato = true;//por defecto se usa contrato
var numLineas = 0;

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

    eventoCerrar()

    vm = new admData();
    ko.applyBindings(vm);

    // Eventos de la calculadora de costes
   // Eventos de la calculadora de costes
   $('#txtCosteLinea').on('blur', cambioCampoConRecalculoDesdeCosteLinea);
   $('#txtPorcentajeBeneficioLinea').on('blur', cambioCampoConRecalculoDesdeCosteLinea);
   $('#txtImporteBeneficioLinea').on('blur', cambioCampoConRecalculoDesdeBeneficioLinea);
   $('#txtPorcentajeAgente').on('blur', cambioCampoConRecalculoDesdeCoste);
    $("#txtPrecio").focus(function () {
        $('#txtPrecio').val(null);
    });
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptarPrefactura);
    $("#btnSalir").click(salir());
    $("#btnImprimir").click(imprimir);
    $("#frmPrefactura").submit(function () {
        return false;
    });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });

    // select2 things
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) {
            cambioEmpresa(e.added.id);
            loadContratos();
        }
    });

    $("#cmbDepartamentosTrabajo").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) loadDepartamento(e.added.id);
    });
     loadDepartamentos();


    // Ahora cliente en autocomplete
    initAutoCliente();

    // select2 things
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();
    $("#cmbContratos").select2(select2Spanish());
    $("#cmbContratos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioContrato(e.added.id);
    });
    // select2 things
    $("#cmbGrupoArticulos").select2(select2Spanish());
    //loadGrupoArticulos();
    $("#cmbGrupoArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioGrupoArticulo(e.added.id);
    });


    $("#cmbUnidades").select2(select2Spanish());
    loadUnidades();

    // select2 things
    $("#cmbArticulos").select2(select2Spanish());
    // loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioArticulo(e.added.id);
    });

    // select2 things
    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();
    $("#cmbTiposIva").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioTiposIva(e.added.id);
    });


    $("#txtCantidad").blur(cambioPrecioCantidad);
    $("#txtPrecio").blur(cambioPrecioCantidad);

    $('#btnNuevaLinea').prop('disabled', false);
    $('#btnAceptarLinea').prop('disabled', false);

    initTablaPrefacturasLineas();
    initTablaBases();

    prefacturaId = gup('PrefacturaId');
    cmd = gup("cmd");
    ContratoId = gup("ContratoId");
    EmpresaId = gup("EmpresaId");
    ClienteId = gup("ClienteId");
    desdeContrato = gup("desdeContrato");
    if (prefacturaId != 0) {
        // caso edicion
        llamadaAjax("GET", myconfig.apiUrl + "/api/prefacturas/" + prefacturaId, null, function (err, data) {
            if (err) return;
            /*if(data.noCalculadora) {
                $('#calculadora').hide();
                $('#contrato').hide();
                obtenerDepartamentoContrato();
            }*/
            loadData(data);
            loadLineasPrefactura(data.prefacturaId);
            loadBasesPrefactura(data.prefacturaId);
        })
    } else {
        // caso alta
        vm.prefacturaId(0);
        vm.generada(0); // por defecto manual
        vm.porcentajeRetencion(0);
        vm.importeRetencion(0);
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
        document.title = "NUEVA PREFACTURA";
        if (EmpresaId != 0) {
            loadEmpresas(EmpresaId);
            cambioEmpresa(EmpresaId);
        }
        if (ClienteId != 0) {
            cargaCliente(ClienteId);
            cambioCliente(ClienteId);
        }
        if (ContratoId != 0) {
            loadContratos(ContratoId);
            cambioContrato(ContratoId);
        }
    }
}

function admData() {
    var self = this;
    self.prefacturaId = ko.observable();
    self.ano = ko.observable();
    self.numero = ko.observable();
    self.departamento = ko.observable();
    self.serie = ko.observable();
    self.fecha = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.contratoId = ko.observable();
    self.beneficioLineal = ko.observable();
    //
    self.emisorNif = ko.observable();
    self.emisorNombre = ko.observable();
    self.emisorDireccion = ko.observable();
    self.emisorCodPostal = ko.observable();
    self.emisorPoblacion = ko.observable();
    self.emisorProvincia = ko.observable();
    //
    self.receptorNif = ko.observable();
    self.receptorNombre = ko.observable();
    self.receptorDireccion = ko.observable();
    self.receptorCodPostal = ko.observable();
    self.receptorPoblacion = ko.observable();
    self.receptorProvincia = ko.observable();
    //
    self.total = ko.observable();
    self.totalCuota = ko.observable();
    self.totalConIva = ko.observable();
    self.restoCobrar = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
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
    self.observacionesPago = ko.observable();

    // -- Valores para las líneas
    self.prefacturaLineaId = ko.observable();
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
    self.tipoProyectoId = ko.observable();
   
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
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);

    //
    // Para calculadora de costes
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.antPorcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.antPorcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeAlCliente = ko.observable();

    // calculadora lineal
    self.porcentajeBeneficioLinea = ko.observable();
    self.importeBeneficioLinea = ko.observable();
    self.ventaNetaLinea = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.antPorcentajeAgente = ko.observable();
    self.importeAgenteLinea = ko.observable();
    self.totalLinea = ko.observable();
    self.importeMantenedorLinea = ko.observable();
    self.costeUnidad = ko.observable();

    // Nuevo Total de coste para la prefactura
    self.totalCoste = ko.observable();
    //
    self.generada = ko.observable();
    self.periodo = ko.observable();
    //
    self.tipoClienteId = ko.observable();
    //
    self.porcentajeRetencion = ko.observable();
    self.importeRetencion = ko.observable();
    //
    self.mantenedorDesactivado = ko.observable();
    //
    self.retenGarantias = ko.observable();
}

function loadData(data) {
    vm.prefacturaId(data.prefacturaId);
    vm.ano(data.ano);
    vm.numero(data.numero);
    vm.serie(data.serie);
    vm.fecha(spanishDate(data.fecha));
    vm.empresaId(data.empresaId);
    vm.clienteId(data.clienteId);
    vm.contratoId(data.contratoId);
    vm.generada(data.generada);
    vm.coste(data.coste);
    vm.antPorcentajeBeneficio(data.porcentajeBeneficio);
    vm.beneficioLineal(data.beneficioLineal);

    vm.porcentajeAgente(data.porcentajeAgente);
    vm.antPorcentajeAgente(data.porcentajeAgente);
    vm.importeAlCliente(data.totalAlCliente);
    vm.retenGarantias(data.retenGarantias);
    vm.restoCobrar(data.restoCobrar);
    vm.porcentajeBeneficio(0);
    //recalcularCostesImportesDesdeCoste();
    //
    vm.emisorNif(data.emisorNif);
    vm.emisorNombre(data.emisorNombre);
    vm.emisorCodPostal(data.emisorCodPostal);
    vm.emisorPoblacion(data.emisorPoblacion);
    vm.emisorProvincia(data.emisorProvincia);
    vm.emisorDireccion(data.emisorDireccion);
    //
    vm.receptorNif(data.receptorNif);
    vm.receptorNombre(data.receptorNombre);
    vm.receptorCodPostal(data.receptorCodPostal);
    vm.receptorPoblacion(data.receptorPoblacion);
    vm.receptorProvincia(data.receptorProvincia);
    vm.receptorDireccion(data.receptorDireccion);

    //
    loadEmpresas(data.empresaId);
    cargaCliente(data.clienteId);
    loadFormasPago(data.formaPagoId);

    loadContratos(data.contratoId);
    loadDepartamentos(data.departamentoId);
    compruebaCalculadora(data.departamentoId);
    if(!data.contratoId) {
        obtenerDepartamentoContrato(null);
    } else {
        obtenerDepartamentoContrato(data.contratoId);
    } 

    vm.observaciones(data.observaciones);
    vm.observacionesPago(data.observacionesPago);
    //
    vm.porcentajeRetencion(data.porcentajeRetencion);
    vm.importeRetencion(data.importeRetencion);
    vm.mantenedorDesactivado(data.mantenedorDesactivado);
    //
    
    //
    if (vm.generada()) {
        // ocultarCamposPrefacturasGeneradas();
        mostrarMensajeFacturaGenerada();
    }
    vm.periodo(data.periodo);
    if (cmd == "nueva") {
        mostrarMensajePrefacturaNueva();
    }
    //
    document.title = "PREFACTURA: " + vm.serie() + "-" + vm.ano() + "-" + vm.numero();
}


function datosOK() {
    $('#frmPrefactura').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbClientes: {
                required: true
            },
            txtFecha: {
                required: true
            },
            cmbFormasPago: {
                required: true
            },
            cmbContratos: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir un emisor"
            },
            cmbClientes: {
                required: 'Debe elegir un receptor'
            },
            txtFecha: {
                required: 'Debe elegir una fecha'
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbContratos: {
                required: "Debe elegir un contrato asociado"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmPrefactura").validate().settings;
    return $('#frmPrefactura').valid();
}

var aceptarPrefactura = function () {
    if (!datosOK()) return;


    eventSalir = false;
    
    if (!vm.total()) {
        vm.total('0');
        vm.totalCuota('0');
        vm.totalConIva('0');
        vm.restoCobrar('0');
    }
    
    var data = generarPrefacturaDb();
    // caso alta
    var verb = "POST";
    var url = myconfig.apiUrl + "/api/prefacturas";
    var returnUrl = "PrefacturaLinealDetalle.html?desdeContrato="+ desdeContrato+"&ContratoId="+ ContratoId +"&cmd=nueva&PrefacturaId=";
    // caso modificación
    if (prefacturaId != 0) {
        verb = "PUT";
        url = myconfig.apiUrl + "/api/prefacturas/" + prefacturaId;
        returnUrl = "PrefacturaGeneral.html?PrefacturaId=";
    }

    if( (vm.porcentajeAgente() !=  vm.antPorcentajeAgente()) && numLineas > 0) {
        if(desdeContrato == "true" && prefacturaId != 0){
            returnUrl = 'ContratoLinealDetalle.html?ContratoId='+ ContratoId +'&docPre=true', '_self';
        }
        AvisaRecalculo(url, returnUrl);
    } else {
        llamadaAjax(verb, url, data, function (err, data) {
            loadData(data);
            returnUrl = returnUrl + vm.prefacturaId();
            if(desdeContrato == "true" && prefacturaId != 0){
                window.open('ContratoLinealDetalle.html?ContratoId='+ ContratoId +'&docPre=true', '_self');
            }
            else{
                window.open(returnUrl, '_self');
            }
        });
    }

    
}


var AvisaRecalculo = function(url, returnUrl) {
    // mensaje de confirmación
    var mens = "Al cambiar los porcentajes con lineas creadas se modificarán los importes de estas en arreglo a los nuevos porcentajes introducidos, ¿ Desea continuar ?.";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            actualizarLineasDeLaPrefacturaTrasCambioCostes(url, returnUrl);
        }
        if (ButtonPressed === "Cancelar") {
            salir()();
        }
    });

}


var generarPrefacturaDb = function () {
    vm.porcentajeBeneficio(roundToSix(vm.porcentajeBeneficio()));
    vm.total(numeral(vm.total()).format('0,0.00'));
    var data = {
        prefactura: {
            "prefacturaId": vm.prefacturaId(),
            "ano": vm.ano(),
            "numero": vm.numero(),
            "serie": vm.serie(),
            "fecha": spanishDbDate(vm.fecha()),
            "empresaId": vm.sempresaId(),
            "clienteId": vm.sclienteId(),
            "contratoId": vm.scontratoId(),
            "emisorNif": vm.emisorNif(),
            "emisorNombre": vm.emisorNombre(),
            "emisorDireccion": vm.emisorDireccion(),
            "emisorCodPostal": vm.emisorCodPostal(),
            "emisorPoblacion": vm.emisorPoblacion(),
            "emisorProvincia": vm.emisorProvincia(),
            "receptorNif": vm.receptorNif(),
            "receptorNombre": vm.receptorNombre(),
            "receptorDireccion": vm.receptorDireccion(),
            "receptorCodPostal": vm.receptorCodPostal(),
            "receptorPoblacion": vm.receptorPoblacion(),
            "receptorProvincia": vm.receptorProvincia(),
            "total": numeroDbf(vm.total()),
            "totalConIva": numeroDbf(vm.totalConIva()),
            "restoCobrar": numeroDbf(vm.restoCobrar()),
            "formaPagoId": vm.sformaPagoId(),
            "observaciones": vm.observaciones(),
            "coste": vm.coste(),
            "porcentajeAgente": vm.porcentajeAgente(),
            "porcentajeBeneficio": vm.porcentajeBeneficio(),
            "totalAlCliente": vm.importeAlCliente(),
            "generada": vm.generada(),
            "periodo": vm.periodo(),
            "porcentajeRetencion": vm.porcentajeRetencion(),
            "retenGarantias": vm.retenGarantias(),
            "importeRetencion": vm.importeRetencion(),
            "mantenedorDesactivado": vm.mantenedorDesactivado(),
            "departamentoId": vm.departamentoId(),
            "observacionesPago": vm.observacionesPago(),
            "tipoProyectoId": vm.tipoProyectoId(),
            "beneficioLineal": 1,
        }
    };
    return data;
}

function salir() {
    var mf = function () {
        var url = "PrefacturaGeneral.html";
        if(prefacturaId != 0  || desdeContrato == "true"){
            window.open('ContratoLinealDetalle.html?ContratoId='+ ContratoId +'&docPre=true', '_self');
        } else {
            window.open(url, '_self');
        }
    }
    return mf;
}


function loadEmpresas(empresaId) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
    });
}

function loadFormasPago(formaPagoId) {
    llamadaAjax("GET", "/api/formas_pago", null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([formaPagoId]).trigger('change');
    });
}

var loadContratos = function (contratoId) {
    var fecha = null;
    if(vm.fecha()) fecha = spanishDbDate(vm.fecha());
    var url = "/api/contratos/empresa-cliente/usuario/departamentos/" + vm.sempresaId() + "/" + vm.sclienteId()  + "/" + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + usaContrato;
    if (contratoId) url = "/api/contratos/uno/campo/departamento/" + contratoId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
        cargarContratos(data);
    });
}

function loadDepartamento(departamentoId) {
    if(!departamentoId) return;
        llamadaAjax("GET", "/api/departamentos/" + departamentoId, null, function (err, data) {
            if (err) return;
            if(data) {
                usaCalculadora = data.usaCalculadora;
                usaContrato = data.usaContrato
                if(!usaCalculadora) {
                    $('#calculadora').hide();
                    vm.porcentajeAgente(0);
                    vm.porcentajeBeneficio(0);
                    obtenerDepartamentoContrato();
                }
                    loadContratos();
            }

        });
}

function compruebaCalculadora(departamentoId) {
    if(!departamentoId) return;
        llamadaAjax("GET", "/api/departamentos/" + departamentoId, null, function (err, data) {
            if (err) return;
            if(data) {
                usaCalculadora = data.usaCalculadora;
                usaContrato = data.usaContrato;
                if(!usaCalculadora) {
                    $('#calculadora').hide();
                    vm.porcentajeAgente(0);
                    vm.porcentajeBeneficio(0);
                    obtenerDepartamentoContrato();
                }
            }
        });
}


function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        if(departamentoId) {
            vm.departamentoId(departamentoId);
            vm.sdepartamentoId(departamentoId);
        }
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}


var cargarContratos = function (data) {
    var contratos = [{ contratoId: 0, referencia: "" }].concat(data);
    vm.posiblesContratos(contratos);
    $("#cmbContratos").val([data.contratoId]).trigger('change');
}


function cambioCliente(clienteId) {
    if (!clienteId) return;
    llamadaAjax("GET", "/api/clientes/" + clienteId, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.receptorNif(data.nif);
        vm.receptorNombre(data.nombreComercial);
        vm.receptorDireccion(data.direccion);
        vm.receptorCodPostal(data.codPostal);
        vm.receptorPoblacion(data.poblacion);
        vm.receptorProvincia(data.provincia);
        vm.tipoClienteId(data.tipoClienteId);
        $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
    });
}

function cambioEmpresa(empresaId) {
    if (!empresaId) return;
    llamadaAjax("GET", "/api/empresas/" + empresaId, null, function (err, data) {
        vm.emisorNif(data.nif);
        vm.emisorNombre(data.nombre);
        vm.emisorDireccion(data.direccion);
        vm.emisorCodPostal(data.codPostal);
        vm.emisorPoblacion(data.poblacion);
        vm.emisorProvincia(data.provincia);
    });
}

function cambioContrato(contratoId) {
    if (!contratoId || contratoId == 0) return;
    obtenerValoresPorDefectoDelContratoMantenimiento(contratoId);
    obtenerDepartamentoContrato(contratoId);
}

function obtenerDepartamentoContrato(contratoId) {
    if(!contratoId) return;
    llamadaAjax("GET", "/api/departamentos/contrato/asociado/" + contratoId, null, function (err, data) {
        if (err) return;
        if(data) {
            //vm.departamento(data.nombre);
            vm.departamentoId(data.departamentoId);
            loadDepartamentos(data.departamentoId);
        }
    });
}



/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de facturas
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea();
    lineaEnEdicion = false;
    llamadaAjax("GET", "/api/prefacturas/nextlinea/" + vm.prefacturaId(), null, function (err, data) {
        vm.linea(data);
        vm.total(0);
        vm.totalCuota(0);
        vm.totalConIva(0);
        vm.restoCobrar(0);
    });
}

function limpiaDataLinea(data) {
    vm.prefacturaLineaId(0);
    vm.linea(null);
    vm.articuloId(null);
    vm.tipoIvaId(null);
    vm.porcentaje(null);
    vm.descripcion(null);
    vm.cantidad(null);
    vm.importe(null);
    vm.costeLinea(null);
    vm.totalLinea(null);
    
    //
    loadGrupoArticulos();
    // loadArticulos();
    loadTiposIva();
    //
    loadArticulos();
    loadUnidades();
}

var obtenerValoresPorDefectoDelContratoMantenimiento = function (contratoId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/" + contratoId, null, function (err, data) {
        if (err) return;
        vm.porcentajeBeneficio(0);
        vm.porcentajeAgente(data.porcentajeAgente);
        vm.tipoProyectoId(data.tipoProyectoId);
        if (!vm.coste()) vm.coste(0);
        recalcularCostesImportesDesdeCoste();
    });
}

function aceptarLinea() {
    if (!datosOKLineas()) {
        return;
    }
    var data = {
        prefacturaLinea: {
            prefacturaLineaId: vm.prefacturaLineaId(),
            linea: vm.linea(),
            prefacturaId: vm.prefacturaId(),
            unidadId: vm.sunidadId(),
            articuloId: vm.sarticuloId(),
            tipoIvaId: vm.tipoIvaId(),
            porcentaje: vm.porcentaje(),
            descripcion: vm.descripcion(),
            cantidad: vm.cantidad(),
            importe: vm.importe(),
            totalLinea: vm.totalLinea(),
            coste: vm.costeLinea(),
            porcentajeBeneficio: vm.porcentajeBeneficioLinea(),
            importeBeneficioLinea: vm.importeBeneficioLinea(),
            porcentajeAgente: vm.porcentajeAgente(),
            importeAgenteLinea: vm.importeAgenteLinea(),
            ventaNetaLinea: vm.ventaNetaLinea(),
            capituloLinea: vm.capituloLinea(),
        }
    }
    var verbo = "POST";
    var url = myconfig.apiUrl + "/api/prefacturas/lineas";
    if (lineaEnEdicion) {
        verbo = "PUT";
        url = myconfig.apiUrl + "/api/prefacturas/lineas/" + vm.prefacturaLineaId();
    }
    llamadaAjax(verbo, url, data, function (err, data) {
        if (err) return;
        $('#modalLinea').modal('hide');
        llamadaAjax("GET", myconfig.apiUrl + "/api/prefacturas/" + data.prefacturaId, null, function (err, data) {
            cmd = "";
            loadData(data);
            loadLineasPrefactura(data.prefacturaId);
            loadBasesPrefactura(data.prefacturaId);
        });
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

function initTablaPrefacturasLineas() {
    tablaCarro = $('#dt_lineas').DataTable({
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
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            api.column(1, { page: 'current' }).data().each(function (group, i) {
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
        data: dataPrefacturasLineas,
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
                return data.replace('\n', '<br/>');
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
            data: "totalLinea",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "importeBeneficioLinea",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "importeAgenteLinea",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "prefacturaLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deletePrefacturaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editPrefacturaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                // if (!vm.generada())
                //     html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    vm.prefacturaLineaId(data.prefacturaLineaId);
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
    vm.porcentajeBeneficioLinea(data.porcentajeBeneficio);
    vm.importeBeneficioLinea(data.importeBeneficioLinea);
    vm.ventaNetaLinea(data.ventaNetaLinea);
    vm.importeAgenteLinea(data.importeAgenteLinea);
    //
    loadGrupoArticulos(data.grupoArticuloId);
    loadArticulos(data.articuloId);
    loadTiposIva(data.tipoIvaId);
    loadUnidades(data.unidadId);    
}



function loadTablaPrefacturaLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    numLineas = 0;
    if (data !== null && data.length === 0) {
        data = null;
    }
    if(data.length > 0) {
        numLineas = data.length;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasPrefactura(id) {
    llamadaAjax("GET", "/api/prefacturas/lineas/" + id, null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        var totalBeneficio = 0
        var totalVentaNeta = 0
        var totalImporteAgenteLinea = 0
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            totalBeneficio += linea.importeBeneficioLinea;
            totalVentaNeta += linea.ventaNetaLinea;
            totalImporteAgenteLinea += linea.importeAgenteLinea;
        });
        vm.importeBeneficio(totalBeneficio);
        vm.ventaNeta(totalVentaNeta);
        //vm.coste(totalCoste);
        vm.importeAgente(totalImporteAgenteLinea);
        vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        recalcularCostesImportesDesdeCoste();
        loadTablaPrefacturaLineas(data);
    });
}

function loadArticulos(id) {
    llamadaAjax("GET", "/api/articulos", null, function (err, data) {
        if (err) return;
        var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
        if (id) {
            $("#cmbArticulos").val([id]).trigger('change');
        } else {
            $("#cmbArticulos").val([0]).trigger('change');
        }
    });
}

function loadGrupoArticulos(id) {
    var url;
    url = "/api/grupo_articulo/departamento/" + vm.departamentoId();
    /*if(id) {
        url =  "/api/grupo_articulo";
    } else {
        url = "/api/grupo_articulo/departamento/" + vm.departamentoId();
    }*/
    llamadaAjax("GET", url, null, function (err, data) {
        var grupos = [{ grupoArticuloId: 0, nombre: "" }].concat(data);
        vm.posiblesGrupoArticulos(grupos);
        if (id) {
            $("#cmbGrupoArticulos").val([id]).trigger('change');
        } else {
            $("#cmbGrupoArticulos").val([0]).trigger('change');
        }
    });
}


function loadTiposIva(id) {
    llamadaAjax("GET", "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([0]).trigger('change');
        }
    });
}


function loadUnidades(id) {
    llamadaAjax('GET', "/api/unidades", null, function (err, data) {
        if (err) return;
        var unidades = [{ unidadId: 0, nombre: "", abrev: "" }].concat(data);
        vm.posiblesUnidades(unidades);
        if (id) {
            $("#cmbUnidades").val([id]).trigger('change');
        } else {
            $("#cmbUnidades").val([0]).trigger('change');
        }
    });
}


function cambioArticulo(articuloId) {
    if (!articuloId) return;
    llamadaAjax("GET", "/api/articulos/" + articuloId, null, function (err, data) {
        if (data.descripcion == null) {
            vm.descripcion(data.nombre);
        } else {
            vm.descripcion(data.nombre + ':\n' + data.descripcion);
        }
        vm.cantidad(1);
        vm.importe(data.precioUnitario);
        $("#cmbTiposIva").val([data.tipoIvaId]).trigger('change');
        $("#cmbUnidades").val([data.unidadId]).trigger('change');
        cambioTiposIva(data.tipoIvaId);
        cambioPrecioCantidad();
    });
}

function cambioGrupoArticulo(grupoArticuloId) {
    //
    if (!grupoArticuloId) return;
    // montar el texto de capítulo si no lo hay
        var numeroCapitulo = Math.floor(vm.linea());
        var nombreCapitulo = "Capitulo " + numeroCapitulo + ": ";
        // ahora hay que buscar el nombre del capitulo para concatenarlo
        llamadaAjax("GET", "/api/grupo_articulo/" + grupoArticuloId, null, function (err, data) {
            if (err) return;
            var capituloAntiguo = vm.capituloLinea();
            nombreCapitulo += data.nombre;
            if(capituloAntiguo != nombreCapitulo) {
                vm.capituloLinea(nombreCapitulo);
            }
        });
    llamadaAjax("GET", "/api/articulos/grupo/" + grupoArticuloId, null, function (err, data) {
        var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
    }); 
}

function cambioTiposIva(tipoIvaId) {
    if (!tipoIvaId) return;
    llamadaAjax("GET", "/api/tipos_iva/" + tipoIvaId, null, function (err, data) {
        if (err) return;
        vm.tipoIvaId(data.tipoIvaId);
        vm.porcentaje(data.porcentaje);
    });
}

var cambioPrecioCantidad = function () {
    vm.costeLinea(vm.cantidad() * vm.importe());
    recalcularCostesImportesDesdeCosteLinea();
    //vm.totalLinea(obtenerImporteAlClienteDesdeCoste(vm.costeLinea()));
}


function editPrefacturaLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/prefacturas/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLinea(data[0]);
    });
}

function deletePrefacturaLinea(prefacturaId) {
    // mensaje de confirmación
    var mensaje = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mensaje, function () {
        var data = {
            prefacturaLinea: {
                prefacturaId: vm.prefacturaId()
            }
        };
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/prefacturas/lineas/" + prefacturaId, data, function (err, data) {
            if (err) return;
            llamadaAjax("GET", myconfig.apiUrl + "/api/prefacturas/" + vm.prefacturaId(), null, function (err, data) {
                if (err) return;
                loadData(data);
                loadLineasPrefactura(data.prefacturaId);
                loadBasesPrefactura(data.prefacturaId);
            });
        });
    }, function () {
        // cancelar no hace nada
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
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadBasesPrefactura(prefacturaId) {
    llamadaAjax("GET", "/api/prefacturas/bases/" + prefacturaId, null, function (err, data) {
        if (err) return;
        // actualizamos los totales
        var t1 = 0; // total sin iva
        var t2 = 0; // total con iva
        var t3 = 0; // tital cuotas
        for (var i = 0; i < data.length; i++) {
            t1 += data[i].base;
            t3 += data[i].cuota;
            t2 += data[i].base + data[i].cuota;
        }
        vm.total(numeral(t1).format('0,0.00'));
        vm.totalCuota(numeral(t3).format('0,0.00'))
        vm.totalConIva(numeral(t2).format('0,0.00'));

        var retenGarantias = vm.retenGarantias();
        var totSinGarantia =  t2 -  retenGarantias;
        vm.restoCobrar(numeral(totSinGarantia).format('0,0.00'));

        if (vm.porcentajeRetencion()) cambioPorcentajeRetencion();
        loadTablaBases(data);
    });
}

// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaCliente
// carga en el campo txtCliente el valor seleccionado
var cargaCliente = function (id) {
    llamadaAjax("GET", "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.tipoClienteId(data.tipoClienteId);
    });
};

// initAutoCliente
// inicializa el control del cliente como un autocomplete
var initAutoCliente = function () {
    // incialización propiamente dicha
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("GET", "/api/clientes/activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nomconcat,
                        id: d.clienteId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.sclienteId(ui.item.id);
            cambioCliente(ui.item.id);
            loadContratos();
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};

var cambioPorcentajeRetencion = function () {
    if (vm.porcentajeRetencion()) {
        var total = numeroDbf(vm.total()) * 1.0;
        var totalCuota = numeroDbf(vm.totalCuota()) * 1.0;
        vm.importeRetencion(roundToSix((total * vm.porcentajeRetencion()) / 100.0));
        var totalConIva = roundToSix(total + totalCuota - vm.importeRetencion());
        vm.totalConIva(numeral(totalConIva).format('0,0.00'));

        var retenGarantias = vm.retenGarantias();
        var totSinGarantia =  totalConIva -  retenGarantias;
        vm.restoCobrar(numeral(totSinGarantia).format('0,0.00'));
    }
}

var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    if(vm.porcentajeAgente() != vm.antPorcentajeAgente()) {
        $('#btnNuevaLinea').prop('disabled', true);
        $('#btnAceptarLinea').prop('disabled', true)
    } else {
        $('#btnNuevaLinea').prop('disabled', false);
        $('#btnAceptarLinea').prop('disabled', false)
    }
    
};

var cambioCampoConRecalculoDesdeCosteLinea = function () {
    recalcularCostesImportesDesdeCosteLinea();
   /*  if(vm.porcentajeBeneficioLinea() != vm.antPorcentajeBeneficio() || vm.porcentajeAgente() != vm.antPorcentajeAgente()) {
        $('#btnNuevaLinea').prop('disabled', true);
        $('#btnAceptarLinea').prop('disabled', true)
    } else {
        $('#btnNuevaLinea').prop('disabled', false);
        $('#btnAceptarLinea').prop('disabled', false)
    } */
    
};
var recalcularCostesImportesDesdeCosteLinea = function () {
    if(usaCalculadora == 0) return;//SI NO USA CALCULADORA NO SE OBTINEN PORCENTAJES
    if (!vm.costeLinea()) vm.costeLinea(0);
    if (!vm.porcentajeAgente()) {
        vm.porcentajeAgente(0);
    } else {
        vm.porcentajeAgente(roundToTwo(vm.porcentajeAgente()));
    }
    if (!vm.porcentajeBeneficioLinea()) vm.porcentajeBeneficioLinea(0);
    if (vm.costeLinea() != null) {
        if (vm.porcentajeBeneficioLinea() != null) {
            vm.importeBeneficioLinea(roundToTwo(vm.porcentajeBeneficioLinea() * vm.costeLinea() / 100));
        }
        vm.ventaNetaLinea(roundToTwo(vm.costeLinea() * 1 + vm.importeBeneficioLinea() * 1));
    }
    if (vm.porcentajeAgente() != null) {
        vm.totalLinea(roundToTwo(vm.ventaNetaLinea() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgenteLinea(roundToTwo(vm.totalLinea() - vm.ventaNetaLinea()));
    }
    //vm.totalLinea(roundToTwo(vm.ventaNetaLinea() * 1 + vm.importeAgenteLinea() * 1));
   
    //vm.importe(roundToFour(vm.totalLinea() / vm.cantidad()));
  
};

/* var recalcularCostesImportesDesdeCosteLinea = function () {
   
    if (vm.costeLinea() != null) {
        if (vm.porcentajeBeneficioLinea() != null) {
            vm.importeBeneficioLinea(vm.porcentajeBeneficioLinea() * vm.costeLinea() / 100);
        }
        vm.ventaNetaLinea(vm.costeLinea() * 1 + vm.importeBeneficioLinea() * 1);
    }
    if (vm.porcentajeAgente() != null) {
        vm.importeAlCliente(roundToTwo(vm.ventaNetaLinea() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeAlCliente() - vm.ventaNetaLinea()));
    }
    vm.importeAlCliente(roundToTwo(vm.ventaNetaLinea() * 1 + vm.importeAgenteLinea() * 1));
    vm.totalLinea(roundToSix(vm.ventaNetaLinea() * 1 + vm.importeAgenteLinea() * 1));
    if (vm.tipoClienteId() == 1 && !vm.mantenedorDesactivado()) {
        // es un mantenedor
        vm.totalLinea(roundToSix(vm.importeAlCliente() - vm.ventaNetalinea() + vm.importeBeneficioLinea()));
    }
    vm.importeBeneficioLinea(roundToTwo(vm.importeBeneficioLinea()));
    vm.ventaNetaLinea(roundToTwo(vm.ventaNetaLinea()));
    vm.porcentajeBeneficioLinea(roundToSix(vm.porcentajeBeneficioLinea()));
};
 */

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
}


var cambioCampoConRecalculoDesdeBeneficioLinea = function () {
    recalcularCostesImportesDesdeBeneficioLinea();
}

var recalcularCostesImportesDesdeBeneficioLinea = function () {
    if (vm.porcentajeBeneficioLinea() && vm.costeLinea()) {
        if (vm.importeBeneficioLinea()) {
            vm.porcentajeBeneficioLinea(roundToSix(((100 * vm.importeBeneficioLinea()) / vm.costeLinea())));
        }
    }
    recalcularCostesImportesDesdeCosteLinea();
};

var recalcularCostesImportesDesdeCoste = function () {
    if(usaCalculadora == 0) return;//SI NO USA CALCULADORA NO SE OBTINEN PORCENTAJES
 

    if (!vm.coste()) vm.coste(0);
    if (!vm.porcentajeAgente()) {
        vm.porcentajeAgente(0);
    } else {
        vm.porcentajeAgente(roundToTwo(vm.porcentajeAgente()));
    }
    if (!vm.porcentajeBeneficio()) vm.porcentajeBeneficio(0);

   
    if (vm.porcentajeAgente() != null) {
        vm.importeAlCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeAlCliente() - vm.ventaNeta()));
    }
    vm.total(roundToSix(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    if (vm.tipoClienteId() == 1 && !vm.mantenedorDesactivado()) {
        // es un mantenedor
        vm.total(roundToSix(vm.importeAlCliente() - vm.ventaNeta() + vm.importeBeneficio()));
    }
    vm.importeBeneficio(roundToTwo(vm.importeBeneficio()));
    vm.ventaNeta(roundToTwo(vm.ventaNeta()));
    vm.porcentajeBeneficio(roundToSix(vm.porcentajeBeneficio()));
};

var recalcularCostesImportesDesdeBeneficio = function () {
    if (vm.porcentajeBeneficio() && vm.coste()) {
        if (vm.importeBeneficio()) {
            vm.porcentajeBeneficio(roundToSix(((100 * vm.importeBeneficio()) / vm.coste())));
        }
    }
    recalcularCostesImportesDesdeCosteLinea();
};

var actualizarLineasDeLaPrefacturaTrasCambioCostes = function (url2, returnUrl) {
    var url = myconfig.apiUrl + "/api/prefacturas/recalculo/lineal/" + vm.prefacturaId() + '/' + vm.porcentajeAgente() + '/' + vm.tipoClienteId();
    if (vm.mantenedorDesactivado()) {
        url = myconfig.apiUrl + "/api/prefacturas/recalculo/lineal/" + vm.prefacturaId() + '/' + vm.porcentajeAgente() + '/0';
    }
    llamadaAjax("PUT", url, null, function (err, data) {
        if (err) return;
        recalcularImportesGuardar(url2, returnUrl);
    });
};

var recalcularImportesGuardar = function(url2, returnUrl) {
    llamadaAjax("GET", "/api/prefacturas/lineas/" + vm.prefacturaId(), null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        })
        llamadaAjax("GET", "/api/prefacturas/bases/" + vm.prefacturaId(), null, function (err, data) {
            if (err) return;
            if (err) return;
            // actualizamos los totales
            var t1 = 0; // total sin iva
            var t2 = 0; // total con iva
            var t3 = 0; // tital cuotas
            for (var i = 0; i < data.length; i++) {
                t1 += data[i].base;
                t3 += data[i].cuota;
                t2 += data[i].base + data[i].cuota;
            }
            vm.total(numeral(t1).format('0,0.00'));
            vm.totalCuota(numeral(t3).format('0,0.00'))
            vm.totalConIva(numeral(t2).format('0,0.00'));

            var retenGarantias = vm.retenGarantias();
            var totSinGarantia =  t2 -  retenGarantias;
            vm.restoCobrar(numeral(totSinGarantia).format('0,0.00'));
            
            if (vm.porcentajeRetencion()) cambioPorcentajeRetencion();
            
             var data  = generarPrefacturaDb();
             //actualizamos los importes y salimos
             llamadaAjax("PUT", url2, data, function (err, data) {
                if(err) return;
                returnUrl = returnUrl + vm.prefacturaId();
                window.open(returnUrl, '_self');
            });
        });
    });
}

var ocultarCamposPrefacturasGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}

var mostrarMensajeFacturaGenerada = function () {
    var mens = "Esta es una prefactura generada desde contrato. Aunque puede modificar sus valores plantéese si no seria mejor volver a generarla.";
    mensNormal(mens);
}

var mostrarMensajePrefacturaNueva = function () {
    var mens = "Introduzca las líneas de la nueva prefactura en el apartado correspondiente";
    mensNormal(mens);
}

var obtenerImporteAlClienteDesdeCoste = function (coste) {
    if(usaCalculadora == 0) return coste;
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = vm.porcentajeBeneficio() * coste / 100;
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente() != null) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = importeAlCliente - ventaNeta;
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    if (vm.tipoClienteId() == 1 && !vm.mantenedorDesactivado()) {
        // es un mantenedor
        importeAlCliente = roundToTwo(importeAlCliente - ventaNeta + importeBeneficio);
    }
    return importeAlCliente;
}

var imprimir = function () {
    printPrefactura2(vm.prefacturaId());
}

function printPrefactura(id) {
    llamadaAjax("GET", "/api/informes/prefacturas/" + id, null, function (err, data) {
        if (err) return;
        informePDF(data);
    });
}

function printPrefactura2(id) {
    var url = "InfPrefacturas.html?prefacturaId=" + id;
    window.open(url, "_new");
}

function informePDF(data) {
    var shortid = "HyGQ0yAP";
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

