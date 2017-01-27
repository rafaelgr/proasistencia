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

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();

    vm = new admData();
    ko.applyBindings(vm);

    // Eventos de la calculadora de costes
    $('#txtCoste').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeBeneficio').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtImporteBeneficio').on('blur', cambioCampoConRecalculoDesdeBeneficio);
    $('#txtPorcentajeAgente').on('blur', cambioCampoConRecalculoDesdeCoste);

    // asignación de eventos al clic
    $("#btnAceptar").click(clicAceptar);
    $("#btnSalir").click(salir());
    $("#btnImprimir").click(imprimir);
    $("#frmContrato").submit(function () {
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

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioEmpresa(e.added);
    });

    $("#cmbTipoProyecto").select2(select2Spanish());
    loadTipoProyecto();
    $("#cmbTipoProyecto").select2().on('change', function (e) {
        cambioTipoProyecto(e.added);
    });

    $("#cmbTiposContrato").select2(select2Spanish());
    loadTiposContrato();

    $("#cmbTextosPredeterminados").select2(select2Spanish());
    loadTextosPredeterminados();
    $("#cmbTextosPredeterminados").select2().on('change', function (e) {
        cambioTextosPredeterminados(e.added);
    });

    initAutoCliente();
    initAutoMantenedor();
    initAutoAgente();


    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();


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

    $("#cmbComerciales").select2(select2Spanish());
    loadComerciales();
    $("#cmbComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioComercial(e.added);
    });

    reglasDeValidacionAdicionales();

    var cmd = gup('CMD');

    if (cmd) mostrarMensajeEnFuncionDeCmd(cmd);


    contratoId = gup('ContratoId');
    if (contratoId != 0) {
        llamadaAjax('GET', myconfig.apiUrl + "/api/contratos/" + contratoId, null, function (err, data) {
            if (err) return;
            loadData(data);
            loadLineasContrato(data.contratoId);
            loadBasesContrato(data.contratoId);
            loadComisionistas(data.contratoId);
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.contratoId(0);
        obtenerPorcentajeBeneficioPorDefecto();
        // ocultamos líneas y bases
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
        //
        document.title = "NUEVO CONTRATO";
    }
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
    // calculadora
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeCliente = ko.observable();
    self.importeMantenedor = ko.observable();
    //
    self.fechaInicio = ko.observable();
    self.fechaFinal = ko.observable();
    self.fechaPrimeraFactura = ko.observable();
    self.fechaOriginal = ko.observable();
    self.facturaParcial = ko.observable();
    self.preaviso = ko.observable();
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

}

function loadData(data) {
    vm.contratoId(data.contratoId);
    loadTipoProyecto(data.tipoProyectoId);
    loadTiposContrato(data.tipoContratoId);
    vm.referencia(data.referencia);
    loadEmpresas(data.empresaId);
    cargaCliente(data.clienteId);
    cargaMantenedor(data.mantenedorId);
    cargaAgente(data.agenteId);
    vm.fechaContrato(spanishDate(data.fechaContrato));
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.importeCliente(data.importeCliente);
    recalcularCostesImportesDesdeCoste();
    vm.importeMantenedor(data.importeMantenedor);
    vm.observaciones(data.observaciones);
    loadFormasPago(data.formaPagoId);
    //
    vm.fechaInicio(spanishDate(data.fechaInicio));
    vm.fechaFinal(spanishDate(data.fechaFinal));
    vm.fechaPrimeraFactura(spanishDate(data.fechaPrimeraFactura));
    vm.fechaOriginal(spanishDate(data.fechaOriginal));
    vm.facturaParcial(data.facturaParcial);
    vm.preaviso(data.preaviso);
    //
    document.title = "CONTRATO: " + vm.referencia();
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
                clienteNecesario: true
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
    var opciones = $("#frmContrato").validate().settings;
    return $('#frmContrato').valid();
}

function salir() {
    var mf = function () {
        var url = "ContratoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

var clicAceptar = function () {
    guardarContrato(function (err, tipo) {
        if (err) return;
        var url = "ContratoGeneral.html?ContratoId=" + vm.contratoId(); // default PUT
        if (tipo == 'POST') {
            url = "ContratoDetalle.html?ContratoId=" + vm.contratoId() + "&CMD=NEW"; // POST
        }
        window.open(url, '_self');
    })
}

var guardarContrato = function (done) {
    if (!datosOK()) return errorGeneral(new Error('Datos del formulario incorrectos'), done);
    comprobarSiHayMantenedor();
    var data = {
        contrato: {
            "contratoId": vm.contratoId(),
            "tipoContratoId": vm.stipoContratoId(),
            "tipoProyectoId": vm.stipoProyectoId(),
            "referencia": vm.referencia(),
            "empresaId": vm.sempresaId(),
            "clienteId": vm.clienteId(),
            "agenteId": vm.agenteId(),
            "mantenedorId": vm.mantenedorId(),
            "fechaContrato": spanishDbDate(vm.fechaContrato()),
            "coste": vm.coste(),
            "porcentajeBeneficio": vm.porcentajeBeneficio(),
            "importeBeneficio": vm.importeBeneficio(),
            "ventaNeta": vm.ventaNeta(),
            "porcentajeAgente": vm.porcentajeAgente(),
            "importeAgente": vm.importeAgente(),
            "importeCliente": vm.importeCliente(),
            "importeMantenedor": vm.importeMantenedor(),
            "observaciones": vm.observaciones(),
            "formaPagoId": vm.sformaPagoId(),
            "fechaInicio": spanishDbDate(vm.fechaInicio()),
            "fechaFinal": spanishDbDate(vm.fechaFinal()),
            "fechaPrimeraFactura": spanishDbDate(vm.fechaPrimeraFactura()),
            "fechaOriginal": spanishDbDate(vm.fechaOriginal()),
            "facturaParcial": vm.facturaParcial(),
            "preaviso": vm.preaviso()
        }
    };
    if (contratoId == 0) {
        llamadaAjax('POST', myconfig.apiUrl + "/api/contratos", data, function (err, data) {
            if (err) return errorGeneral(err, done);
            loadData(data);
            done(null, 'POST');
        });
    } else {
        llamadaAjax('PUT', myconfig.apiUrl + "/api/contratos/" + contratoId, data, function (err, data) {
            if (err) return errorGeneral(err, done);
            loadData(data);
            done(null, 'PUT');
        });
    }
}

function loadEmpresas(id) {
    llamadaAjax('GET', "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}


function loadTiposContrato(id) {
    llamadaAjax('GET', "/api/tipos_mantenimientos", null, function (err, data) {
        if (err) return;
        var tipos = [{ tipoMantenimientoId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposContrato(tipos);
        $("#cmbTiposContrato").val([id]).trigger('change');
    });
}

function loadTipoProyecto(id) {
    llamadaAjax('GET', "/api/tipos_proyectos", null, function (err, data) {
        if (err) return;
        var tipos = [{ tipoProyectoId: 0, nombre: "" }].concat(data);
        vm.posiblesTipoProyecto(tipos);
        $("#cmbTipoProyecto").val([id]).trigger('change');
    });
}

function loadTextosPredeterminados(id) {
    llamadaAjax('GET', "/api/textos_predeterminados", null, function (err, data) {
        if (err) return;
        var textos = [{ textoPredeterminadoId: 0, texto: "", abrev: "" }].concat(data);
        vm.posiblesTextosPredeterminados(textos);
        $("#cmbTextPredeterminados").val([id]).trigger('change');
    });
}

function loadFormasPago(id) {
    llamadaAjax('GET', '/api/formas_pago', null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([id]).trigger('change');
    });
}

function loadContratos(id) {
    if (id) {
        // caso de un contrato en concreto
        llamadaAjax('GET', "/api/contratos_cliente_mantenimiento/" + id, null, function (err, data) {
            if (err) return;
            var contratos = [{ contratoId: 0, referencia: "" }].concat(data);
            vm.posiblesContratos(contratos);
            $("#cmbContratos").val([id]).trigger('change');
        });
    } else {
        // caso cargar contratos de empreas / cliente
        llamadaAjax('GET',
            "/api/contratos_cliente_mantenimiento/empresa_cliente/" + vm.sempresaId() + "/" + vm.sclienteId(), null, function (err, data) {
                if (err) return;
                var contratos = [{ contratoId: 0, referencia: "" }].concat(data);
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
        cargaAgente(data.comercialId);
        vm.agenteId(data.comercialId);
        loadFormasPago(data.formaPagoId);
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
    if (!data || vm.referencia()) {
        return;
    }
    var tipoProyectoId = data.id;
    llamadaAjax('GET', myconfig.apiUrl + "/api/tipos_proyectos/" + tipoProyectoId, null, function (err, data) {
        if (err) return;
        llamadaAjax('GET', myconfig.apiUrl + "/api/contratos/siguiente_referencia/" + data.abrev, null, function (err, nuevaReferencia) {
            if (err) return;
            vm.referencia(nuevaReferencia);
        });
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
    if (vm.sgrupoArticuloId()) {
        loadGrupoArticulos(vm.sgrupoArticuloId());
        var data = {
            id: vm.sgrupoArticuloId()
        };
        cambioGrupoArticulo(data);
    } else {
        loadGrupoArticulos();
        loadArticulos();
    }

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
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
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
    llamadaAjax('GET', "/api/grupo_articulo", null, function (err, data) {
        if (err) return;
        var grupos = [{ grupoArticuloId: 0, nombre: "" }].concat(data);
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
        var unidades = [{ unidadId: 0, nombre: "  ", abrev: "  " }].concat(data);
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
        var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
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
        if (!vm.sunidadId()) $("#cmbUnidades").val([data.unidadId]).trigger('change');
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
        var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
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

var cargaAgente = function (id) {
    llamadaAjax('GET', "/api/comerciales/" + id, null, function (err, data) {
        if (err) return;
        $('#txtAgente').val(data.nombre);
        vm.agenteId(data.comercialId);
        obtenerPorcentajeDelAgenteColaborador(vm.agenteId(), vm.clienteId(), vm.sempresaId(), vm.stipoContratoId(), function (err, comision) {
            if (err) return;
            vm.porcentajeAgente(comision);
            recalcularCostesImportesDesdeCoste();
        });
    });
};

var initAutoCliente = function () {
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
                vm.porcentajeAgente(comision);
                recalcularCostesImportesDesdeCoste();
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
    actualizarLineasDeLaContratoTrasCambioCostes();
};

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
    actualizarLineasDeLaContratoTrasCambioCostes();
}

var recalcularCostesImportesDesdeCoste = function () {
    if (!vm.coste()) vm.coste(0);
    if (!vm.porcentajeAgente()) vm.porcentajeAgente(0);
    if (vm.coste() != null) {
        if (vm.porcentajeBeneficio()) {
            vm.importeBeneficio(roundToTwo(vm.porcentajeBeneficio() * vm.coste() / 100));
        }
        vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
    }
    if (vm.porcentajeAgente() != null) {
        vm.importeCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeCliente() - vm.ventaNeta()));
    }
    vm.importeCliente(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    if (vm.mantenedorId()) {
        vm.importeMantenedor(roundToTwo(vm.importeCliente() - vm.ventaNeta() + vm.importeBeneficio()));
    }
};

var recalcularCostesImportesDesdeBeneficio = function () {
    if (vm.porcentajeBeneficio() && vm.coste()) {
        if (vm.importeBeneficio()) {
            vm.porcentajeBeneficio(roundToTwo(((100 * vm.importeBeneficio()) / vm.coste())));
        }
    }
    recalcularCostesImportesDesdeCoste();
};

var actualizarLineasDeLaContratoTrasCambioCostes = function () {
    llamadaAjax('PUT',
        "/api/contratos/recalculo/" + vm.contratoId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente(),
        null, function (err, data) {
            if (err) return;
            recargaLineasBases();
        });
};

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
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = roundToTwo(vm.porcentajeBeneficio() * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente()) {
        importeCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = roundToTwo(importeCliente - ventaNeta);
    }
    importeCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    return importeCliente;
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
            var file = new Blob([err.responseText], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            //var base64EncodedPDF = window.btoa(err.responseText);
            window.open("data:application/pdf " + err.responseText);
            //window.open(fileURL);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

/*----------------------------------------------------------
    Funciones relacionadas con las lines de colaboradores
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
        columnDefs: [
            { "width": "20%", "targets": 2 }
        ],
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
    loadComerciales();
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

function loadComerciales(id) {
    llamadaAjax('GET', "/api/comerciales/comerciales_activos", null, function (err, data) {
        if (err) return;
        var comerciales = [{ comercialId: 0, nombre: "" }].concat(data);
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
        vm.porcentajeComision(comision);
        recalcularCostesImportesDesdeCoste();
    });
}

/*----------------------------------------------------------
    Funciones relacionadas con la generación de prefacturas
 -----------------------------------------------------------*/

var loadPeriodosPagos = function (periodoPagoId) {
    var periodosPagos = [
        { periodoPagoId: 0, nombre: "" },
        { periodoPagoId: 1, nombre: "Anual" },
        { periodoPagoId: 2, nombre: "Semestral" },
        { periodoPagoId: 5, nombre: "Quatrimestral" },
        { periodoPagoId: 3, nombre: "Trimestral" },
        { periodoPagoId: 4, nombre: "Mensual" },
        { periodoPagoId: 6, nombre: "Puntual" }
    ];
    vm.posiblesPeriodosPagos(periodosPagos);
    $("#cmbPeriodosPagos").val([periodoPagoId]).trigger('change');
}


var generarPrefacturas = function () {
    $("#cmbPeriodosPagos").select2(select2Spanish());
    loadPeriodosPagos(vm.speriodoPagoId());
    $("#cmbPeriodosPagos").select2().on('change', function (e) {
        cambioPeriodosPagos(e.added);
    });
    if (vm.mantenedorId()) {
        vm.importeAFacturar(vm.importeMantenedor());
    } else {
        vm.importeAFacturar(vm.importeCliente());
    }
    $("#generar-prefacturas-form").submit(function () {
        return false;
    });
}

var cambioPeriodosPagos = function (data) {
    vm.numPagos(calcularNumPagos());
}

var calcularNumPagos = function () {
    var fInicial = new Date(spanishDbDate(vm.fechaInicio()));
    var fFinal = new Date(spanishDbDate(vm.fechaFinal()));
    var numMeses = parseInt(moment(fFinal).diff(fInicial, 'months', true));
    if (numMeses == 0) numMeses = 1; // por lo menos un pago
    // calculamos según la periodicidad
    var divisor = obtenerDivisor();
    var numpagos = 1
    if (divisor != 0) numpagos = parseInt(numMeses / divisor);
    if (numpagos == 0) numpagos = 1; // por lo menos uno
    return numpagos;
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
    var prefacturas = crearPrefacturas(importe, importeAlCliente, vm.coste(), spanishDbDate(vm.fechaPrimeraFactura()), calcularNumPagos(), vm.sempresaId(), clienteId, empresa, cliente);
    vm.prefacturasAGenerar(prefacturas);
    loadTablaGenerarPrefacturas(prefacturas);
}

var aceptarGenerarPrefacturas = function () {
    if (!generarPrefacturasOK()) return;
    if (vm.prefacturasAGenerar().length == 0) {
        return;
    }
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
            if (err) return;
            mostrarMensajeSmart('Prefacturas creadas correctamente. Puede consultarlas en la solapa correspondiente.');
            $('#modalGenerarPrefacturas').modal('hide');
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
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#generar-prefacturas-form").validate().settings;
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

function crearPrefacturas(importe, importeAlCliente, coste, fechaInicial, numPagos, empresaId, clienteId, empresa, cliente) {
    // calculamos según la periodicidad
    var divisor = obtenerDivisor();
    // si hay parcial el primer pago será por la diferencia entre el inicio de contrato y el final
    // de mes 
    var inicioContrato = new Date(spanishDbDate(vm.fechaInicio()));
    var finMesInicioContrato = moment(inicioContrato).endOf('month');
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
    for (var i = 0; i < numPagos; i++) {
        var f = moment(fechaInicial).add(i * divisor, 'month').format('DD/MM/YYYY');
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
            cliente: cliente
        };
        if (vm.facturaParcial() && i == 0) {
            p.importe = import1;
            p.importeCliente = import11;
            p.importeCoste = import12;
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
            cliente: cliente
        };
        pagos.push(p);
    }
    if (pagos.length > 0) {
        // en la última factura ponemos los restos
        pagos[pagos.length - 1].importe = pagos[pagos.length - 1].importe + restoImportePago;
        pagos[pagos.length - 1].importeCliente = pagos[pagos.length - 1].importeCliente + restoImportePagoCliente;
        pagos[pagos.length - 1].importeCoste = pagos[pagos.length - 1].importeCoste + restoImporteCoste;
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
        columnDefs: [
            { "width": "20%", "targets": [2, 3] }
        ],
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