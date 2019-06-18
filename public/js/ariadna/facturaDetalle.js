/*-------------------------------------------------------------------------- 
facturaDetalle.js
Funciones js par la página FacturaDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var facturaId = 0;
var cmd = "";

var lineaEnEdicion = false;

var dataFacturasLineas;
var dataBases;
var dataCobros;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    usuario = recuperarIdUsuario();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();

    eventoCerrar();

    vm = new admData();
    ko.applyBindings(vm);

    // Eventos de la calculadora de costes
    $('#txtCoste').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeBeneficio').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtImporteBeneficio').on('blur', cambioCampoConRecalculoDesdeBeneficio);
    $('#txtPorcentajeAgente').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeRetencion').on('blur', cambioPorcentajeRetencion);

    // asignación de eventos al clic
    $("#btnAceptar").click(aceptarFactura);
    $("#btnSalir").click(salir());
    $("#btnImprimir").click(imprimir);
    $("#frmFactura").submit(function () {
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
        if (e.added) cambioEmpresa(e.added.id);
    });

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
    loadGrupoArticulos();
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

    $("#cmbSeries").select2(select2Spanish());
    


    $("#txtCantidad").blur(cambioPrecioCantidad);
    $("#txtPrecio").blur(cambioPrecioCantidad);

    initTablaFacturasLineas();
    initTablaBases();
    initTablaCobros();

    facturaId = gup('FacturaId');
    cmd = gup("cmd");

    if (facturaId != 0) {
        // caso edicion
        llamadaAjax("GET", myconfig.apiUrl + "/api/facturas/" + facturaId, null, function (err, data) {
            if (err) return;
            if(data.noCalculadora) {
                $('#calculadora').hide();
                $('#contrato').hide();obtenerDepartamentoContrato
            }
            loadData(data);
            loadLineasFactura(data.facturaId);
            loadBasesFactura(data.facturaId);
            loadCobrosFactura(data.facturaId);
            
        })
    } else {
        // caso alta
        vm.facturaId(0);
        vm.porcentajeRetencion(0);
        vm.importeRetencion(0);
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
        document.title = "NUEVA FACTURA";
    }
}

function admData() {
    var self = this;
    self.facturaId = ko.observable();
    self.ano = ko.observable();
    self.numero = ko.observable();
    self.serie = ko.observable();
    self.fecha = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.contratoId = ko.observable();
    self.tipoContratoId = ko.observable();
    self.departamento = ko.observable();
    self.departamentoId = ko.observable()
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

    //
    self.serieId = ko.observable();
    self.sserieId = ko.observable();
    //
    self.posiblesSeries = ko.observableArray([]);
    self.elegidasSeries = ko.observableArray([]);
    //
    self.observaciones = ko.observable();

    // -- Valores para las líneas
    self.facturaLineaId = ko.observable();
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
    // Para calculadora de costes
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeAlCliente = ko.observable();
    // Nuevo Total de coste para la factura
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
    self.devuelta = ko.observable();
    // 
    self.enviadaCorreo = ko.observable();
}

function loadData(data, desdeLinea) {
    vm.facturaId(data.facturaId);
    vm.ano(data.ano);
    vm.numero(data.numero);
    vm.serie(data.serie);
    vm.fecha(spanishDate(data.fecha));
    vm.empresaId(data.empresaId);
    vm.clienteId(data.clienteId);
    vm.contratoId(data.contratoId);
    vm.generada(data.generada);
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.importeAlCliente(data.totalAlCliente);
    recalcularCostesImportesDesdeCoste();
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
    if(!data.noCalculadora) {
        loadContratos(data.contratoId);
        obtenerDepartamentoContrato(data.contratoId);
    } else {
        obtenerDepartamentoContrato(null);
    }
    vm.observaciones(data.observaciones);
    //
    vm.porcentajeRetencion(data.porcentajeRetencion);
    vm.importeRetencion(data.importeRetencion);
    vm.mantenedorDesactivado(data.mantenedorDesactivado);
    vm.devuelta(data.devuelta);
    //
    
    //
    if (vm.generada()) {
        //ocultarCamposFacturasGeneradas();
        mostrarMensajeFacturaGenerada();
    }
    vm.periodo(data.periodo);
    if (cmd == "nueva") {
        mostrarMensajeFacturaNueva();
        cmd = "";
    }
    vm.enviadaCorreo(data.enviadaCorreo);
    //
    document.title = "FACTURA: " + vm.serie() + "-" + vm.ano() + "-" + vm.numero();

    if(!desdeLinea) {//si se vualven a cargar los datos despues de crear una linea no es necesario volver a cargar el combo
        if(!data.noCalculadora) {
            obtenerParametrosCombo(false);
        }else {
            obtenerParametrosCombo(true);
        }
    }
}


function datosOK() {
    $('#frmFactura').validate({
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
    var opciones = $("#frmFactura").validate().settings;
    return $('#frmFactura').valid();
}

var aceptarFactura = function () {
    if (!datosOK()) return;


    eventSalir = false;
    
    if (!vm.total()) {
        vm.total('0');
        vm.totalConIva('0');
    }
    var data = generarFacturaDb();
    // caso alta
    var verb = "POST";
    var url = myconfig.apiUrl + "/api/facturas";
    var returnUrl = "FacturaDetalle.html?cmd=nueva&FacturaId=";
    // caso modificación
    if (facturaId != 0) {
        if(vm.serie() == vm.sserieId()) {// si es igual no se a cambiado la serie u no hay que actualizarla
            data.factura.serie = null;
        }
        verb = "PUT";
        url = myconfig.apiUrl + "/api/facturas/" + facturaId;
        returnUrl = "FacturaGeneral.html?FacturaId=";
    }

    llamadaAjax(verb, url, data, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.facturaId();
        window.open(returnUrl, '_self');
    });
}

var generarFacturaDb = function () {
    var serie;
    if(vm.sserieId()) {
        serie = vm.sserieId();
    }else {
        serie =  vm.serie()
    }
    var data = {
        factura: {
            "facturaId": vm.facturaId(),
            "ano": vm.ano(),
            "numero": vm.numero(),
            "serie": serie,
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
            "formaPagoId": vm.sformaPagoId(),
            "observaciones": vm.observaciones(),
            "coste": vm.coste(),
            "porcentajeAgente": vm.porcentajeAgente(),
            "porcentajeBeneficio": vm.porcentajeBeneficio(),
            "totalAlCliente": vm.importeAlCliente(),
            "generada": 0,
            "periodo": vm.periodo(),
            "porcentajeRetencion": vm.porcentajeRetencion(),
            "importeRetencion": vm.importeRetencion(),
            "mantenedorDesactivado": vm.mantenedorDesactivado(),
            "devuelta": vm.devuelta(),
            "enviadaCorreo": vm.enviadaCorreo(),
            "departamentoId": vm.departamentoId()
        }
    };
    return data;
}

function salir() {
    var mf = function () {
        var url = "FacturaGeneral.html";
        window.open(url, '_self');
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
    var url = "/api/contratos/empresa-cliente/usuario/departamentos/" + vm.sempresaId() + "/" + vm.sclienteId()  + "/" + usuario;
    if (contratoId) url = "/api/contratos/uno/campo/departamento/" + contratoId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
        cargarContratos(data);
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
        vm.receptorNif(data.nif);
        vm.receptorNombre(data.nombreComercial);
        vm.receptorDireccion(data.direccion);
        vm.receptorCodPostal(data.codPostal);
        vm.receptorPoblacion(data.poblacion);
        vm.receptorProvincia(data.provincia);
        vm.tipoClienteId(data.tipoClienteId);
        $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
        loadContratos();
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
        loadContratos();
    });
}

function cambioContrato(contratoId) {
    if (!contratoId || contratoId == 0) return;
    obtenerValoresPorDefectoDelContratoMantenimiento(contratoId);
    obtenerDepartamentoContrato(contratoId);
}

function obtenerDepartamentoContrato(contratoId) {
    if(contratoId) {
        llamadaAjax("GET", "/api/departamentos/contrato/asociado/" + contratoId, null, function (err, data) {
            if (err) return;
            if(data) {
                vm.departamento(data.nombre);
                vm.departamentoId(data.departamentoId);
            }
        });
    } else {
        vm.departamento('REPARACIONES');
        vm.departamentoId(7);
    }
}



/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de facturas
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea();
    lineaEnEdicion = false;
    llamadaAjax("GET", "/api/facturas/nextlinea/" + vm.facturaId(), null, function (err, data) {
        vm.linea(data);
        vm.total(0);
        vm.totalConIva(0);
    });
}

function limpiaDataLinea(data) {
    vm.facturaLineaId(0);
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
        vm.porcentajeBeneficio(data.porcentajeBeneficio);
        vm.porcentajeAgente(data.porcentajeAgente);
        if (!vm.coste()) vm.coste(0);
        vm.contratoId(data.contratoId);
        vm.empresaId(data.empresaId);
        obtenerParametrosCombo(false)
        recalcularCostesImportesDesdeCoste();
    });
}

var obtenerParametrosCombo = function (noCalculadora) {
    var comboSeries = [];
    var obj = {}
    var  serie;
    if(!noCalculadora) {
        llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/" + vm.contratoId(), null, function (err, data) {
            if(err) return;
            if(data) {
                vm.tipoContratoId(data.tipoContratoId);
                llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + vm.empresaId(), null, function (err, data) {
                    if(err) return;
                    if(data) {//componemos el objeto con las series para cargar el combo
                        obj = {
                            nombre: data.seriePre + " // Prefactura",
                            serieId: data.seriePre
                        }
                        comboSeries.push(obj);
                        if(vm.tipoContratoId() == 2) {//según el tipo de contrato cargamos una serie u otra
                            obj = {
                                nombre: data.serieFacS + " // Contrato asociado",
                                serieId: data.serieFacS
                            }
                            serie = data.serieFacS
                        } else {
                            obj = {
                                nombre: data.serieFac+ " // Contrato asociado",
                                serieId: data.serieFac
                            }
                            serie = data.serieFac
                        }
                        comboSeries.push(obj);
    
                        obj = {
                            nombre: data.serieFacR + " // Rectificativa",
                            serieId: data.serieFacR
                        }
                        
                        comboSeries.push(obj);
        
                        cargarSeries(comboSeries, serie)
                    }
                });
            }
        });
    } else {
        llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + vm.empresaId(), null, function (err, data) {
            if(err) return;
            if(data) {//componemos el objeto con las series para cargar el combo
                
               
                    obj = {
                        nombre: data.serieFacRep + " // Serie Reparaciones",
                        serieId: data.serieFacRep
                    }
                    comboSeries.push(obj);
    
                obj = {
                    nombre: data.serieFacR + " // Serie Rectificativa",
                    serieId: data.serieFacR
                }
                
                comboSeries.push(obj);

                serie = data.serieFacRep

                cargarSeries(comboSeries, serie);
            }
        });
    }
}



var cargarSeries = function (data,serie) {
    var contratos = data;
    vm.posiblesSeries(contratos);
    if(vm.serie()) {
        $("#cmbSeries").val([vm.serie()]).trigger('change');
    } else {
        $("#cmbSeries").val([serie]).trigger('change');
    }
}

function aceptarLinea() {
    if (!datosOKLineas()) {
        return;
    }
    var data = {
        facturaLinea: {
            facturaLineaId: vm.facturaLineaId(),
            linea: vm.linea(),
            facturaId: vm.facturaId(),
            unidadId: vm.sunidadId(),
            articuloId: vm.sarticuloId(),
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
    var verbo = "POST";
    var url = myconfig.apiUrl + "/api/facturas/lineas";
    if (lineaEnEdicion) {
        verbo = "PUT";
        url = myconfig.apiUrl + "/api/facturas/lineas/" + vm.facturaLineaId();
    }
    llamadaAjax(verbo, url, data, function (err, data) {
        if (err) return;
        $('#modalLinea').modal('hide');
        llamadaAjax("GET", myconfig.apiUrl + "/api/facturas/" + data.facturaId, null, function (err, data) {
            loadData(data, true);
            loadLineasFactura(data.facturaId);
            loadBasesFactura(data.facturaId);
            loadCobrosFactura(data.facturaId);
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

function initTablaFacturasLineas() {
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
        data: dataFacturasLineas,
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
        }, {
            data: "facturaLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteFacturaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editFacturaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                // if (!vm.generada())
                //     html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    vm.facturaLineaId(data.facturaLineaId);
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



function loadTablaFacturaLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasFactura(id) {
    llamadaAjax("GET", "/api/facturas/lineas/" + id, null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        })
        loadTablaFacturaLineas(data);
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
    llamadaAjax("GET", "/api/grupo_articulo", null, function (err, data) {
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
        if (!vm.sunidadId()) $("#cmbUnidades").val([data.unidadId]).trigger('change');
        cambioTiposIva(data.tipoIvaId);
        cambioPrecioCantidad();
    });
}

function cambioGrupoArticulo(grupoArticuloId) {
    //
    if (!grupoArticuloId) return;
    // montar el texto de capítulo si no lo hay
    if (!vm.capituloLinea()) {
        var numeroCapitulo = Math.floor(vm.linea());
        var nombreCapitulo = "Capitulo " + numeroCapitulo + ": ";
        // ahora hay que buscar el nombre del capitulo para concatenarlo
        llamadaAjax("GET", "/api/grupo_articulo/" + grupoArticuloId, null, function (err, data) {
            if (err) return;
            nombreCapitulo += data.nombre;
            vm.capituloLinea(nombreCapitulo);
        });
    }
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
    recalcularCostesImportesDesdeCoste();
    vm.totalLinea(obtenerImporteAlClienteDesdeCoste(vm.costeLinea()));
}

function editFacturaLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/facturas/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLinea(data[0]);
    });
}

function deleteFacturaLinea(facturaId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        var data = {
            facturaLinea: {
                facturaId: vm.facturaId()
            }
        };
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/facturas/lineas/" + facturaId, data, function (err, data) {
            if (err) return;
            llamadaAjax("GET", myconfig.apiUrl + "/api/facturas/" + vm.facturaId(), null, function (err, data) {
                if (err) return;
                loadData(data, true);
                loadLineasFactura(data.facturaId);
                loadBasesFactura(data.facturaId);
                loadCobrosFactura(data.facturaId);
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


function loadBasesFactura(facturaId) {
    llamadaAjax("GET", "/api/facturas/bases/" + facturaId, null, function (err, data) {
        if (err) return;
        // actualizamos los totales
        var t1 = 0; // total sin iva
        var t3 = 0; // total cuotas
        var t2 = 0; // total con iva
        for (var i = 0; i < data.length; i++) {
            t1 += data[i].base;
            t3 += data[i].cuota;
            t2 += data[i].base + data[i].cuota;
        }
        vm.total(numeral(t1).format('0,0.00'));
        vm.totalCuota(numeral(t3).format('0,0.00'))
        vm.totalConIva(numeral(t2).format('0,0.00'));
        if (vm.porcentajeRetencion()) cambioPorcentajeRetencion();
        loadTablaBases(data);
    });
}

/*
    Funciones relacionadas con la gestión de cobros
    y cuotas
*/

function initTablaCobros() {
    tablaCarro = $('#dt_cobros').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_cobros'), breakpointDefinition);
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
        data: dataCobros,
        columns: [{
            data: "numorden"
        }, {
            data: "fecvenci",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYYY');
            }
        }, {
            data: "fecultco",
            render: function (data, type, row) {
                if (!data) return "";
                return moment(data).format('DD/MM/YYYYY');
            }
        }, {
            data: "impcobro",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "nomforpa",
        }]
    });
}


function loadTablaCobros(data) {
    var dt = $('#dt_cobros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadCobrosFactura(facturaId) {
    llamadaAjax("GET", "/api/cobros/factura/" + facturaId, null, function (err, data) {
        if (err) return;
        loadTablaCobros(data);
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
            llamadaAjax("GET", "/api/clientes/?nombre=" + request.term, null, function (err, data) {
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
            vm.sclienteId(ui.item.id);
            cambioCliente(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};

var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    actualizarLineasDeLaFacturaTrasCambioCostes();
};

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
    actualizarLineasDeLaFacturaTrasCambioCostes();
}

var cambioPorcentajeRetencion = function () {
    if (vm.porcentajeRetencion()) {
        var total = numeroDbf(vm.total()) * 1.0;
        var totalCuota = numeroDbf(vm.totalCuota()) * 1.0;
        vm.importeRetencion(roundToTwo((total * vm.porcentajeRetencion()) / 100.0));
        var totalConIva = roundToTwo(total + totalCuota - vm.importeRetencion());
        vm.totalConIva(numeral(totalConIva).format('0,0.00'));
    }
}

var recalcularCostesImportesDesdeCoste = function () {
    if (vm.coste() != null) {
        if (vm.porcentajeBeneficio() != null) {
            vm.importeBeneficio(roundToTwo(vm.porcentajeBeneficio() * vm.coste() / 100));
        }
        vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
    }
    if (vm.porcentajeAgente() != null) {
        vm.importeAlCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeAlCliente() - vm.ventaNeta()));
    }
    vm.importeAlCliente(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    vm.total(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    if (vm.tipoClienteId() == 1 && !vm.mantenedorDesactivado()) {
        // es un mantenedor
        vm.total(roundToTwo(vm.importeAlCliente() - vm.ventaNeta() + vm.importeBeneficio()));
    }
};

var recalcularCostesImportesDesdeBeneficio = function () {
    if (vm.porcentajeBeneficio() && vm.coste()) {
        if (vm.importeBeneficio()) {
            vm.porcentajeBeneficio(roundToFour(((100 * vm.importeBeneficio()) / vm.coste())));
        }
    }
    recalcularCostesImportesDesdeCoste();
};

var actualizarLineasDeLaFacturaTrasCambioCostes = function () {
    var url = myconfig.apiUrl + "/api/facturas/recalculo/" + vm.facturaId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente() + '/' + vm.tipoClienteId();
    if (vm.mantenedorDesactivado()) {
        url = myconfig.apiUrl + "/api/facturas/recalculo/" + vm.facturaId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente() + '/0';
    }
    llamadaAjax("PUT", url, null, function (err, data) {
        if (err) return;
        llamadaAjax("GET", myconfig.apiUrl + "/api/facturas/" + vm.facturaId(), null, function (err, data) {
            loadLineasFactura(data.facturaId);
            loadBasesFactura(data.facturaId);
            loadCobrosFactura(data.facturaId);
        });
    });
};

var ocultarCamposFacturasGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}

var mostrarMensajeFacturaGenerada = function () {
    var mens = "Esta es una factura generada desde contrato. Aunque puede modificar sus valores plantéese si no seria mejor volver a generarla.";
    mensNormal(mens);
}

var mostrarMensajeFacturaNueva = function () {
    var mens = "Introduzca las líneas de la nueva factura en el apartado correspondiente";
    mensNormal(mens);
}

var obtenerImporteAlClienteDesdeCoste = function (coste) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = roundToTwo(vm.porcentajeBeneficio() * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente()) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = roundToTwo(importeAlCliente - ventaNeta);
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    if (vm.tipoClienteId() == 1 && !vm.mantenedorDesactivado()) {
        // es un mantenedor
        importeAlCliente = roundToTwo(importeAlCliente - ventaNeta + importeBeneficio);
    }
    return importeAlCliente;
}

var imprimir = function () {
    printFactura2(vm.facturaId());
}

function printFactura2(id) {
    var url = "InfFacturas.html?facturaId=" + id;
    window.open(url, '_new');
}

function printFactura(id) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + vm.empresaId(), null, function (err, empresa) {
        if (err) return;
        var shortid = "rJkSiTZ9g";
        if (empresa.infFacturas) shortid = empresa.infFacturas;
        var url = "/api/informes/facturas/" + id;
        if (shortid == "rJRv-UF3l" || shortid == "SynNJ46oe") {
            url = "/api/informes/facturas2/" + id;
        }
        llamadaAjax("GET", url, null, function (err, data) {
            if (err) return;
            informePDF(data, shortid);
        });
    });

}

function informePDF(data, shortid) {
    var infData = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", infData);
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

