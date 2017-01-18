/*-------------------------------------------------------------------------- 
contratoClienteMantenimientoDetalle.js
Funciones js par la página ContratoDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var dataComisionistas;
var dataGenerador;
var dataPrefacturas;

var contratoClienteMantenimientoId = 0;

datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);

    // Calculadora de cliente
    $('#txtCoste').on('blur', cambioImporteAlCliente());
    $('#txtMargen').on('blur', cambioImporteAlCliente());
    $('#txtBeneficio').on('blur', cambioBeneficio());
    $('#txtManPorComer').on('blur', cambioImporteAlCliente());

    // calculadora del generador
    $('#txtFInicial').on('blur', cambioGenerador());
    $('#txtFFinal').on('blur', cambioGenerador());
    $('#txtFechaFactura2').on('blur', cambioGenerador());
    $('#chkFacturaParcial2').on('blur', cambioGenerador());

    $("#txtCodCliente").blur(function () {
        cambioCodCliente();
    });
    $("#txtCodMantenedor").blur(function () {
        cambioCodMantenedor();
    });

    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmContratoClienteMantenimiento").submit(function () {
        return false;
    });
    $("#frmComisionista").submit(function () {
        return false;
    });
    $("#comisionista-form").submit(function () {
        return false;
    });
    $("#generar-form").submit(function () {
        return false;
    });
    // select2 things
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    $("#cmbMantenedores").select2(select2Spanish());
    loadMantenedores();
    $("#cmbMantenedores").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioMantenedor(e.added);
    });
    // select2 things
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();
    /*
    $("#cmbClientes").select2(select2Spanish());
    loadClientes();
    $("#cmbClientes").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioCliente(e.added);
    });
    */
    initAutoCliente();

    $("#cmbAgentes").select2(select2Spanish());
    loadAgentes();
    $("#cmbAgentes").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioAgente(e.added);
    });

    $("#cmbArticulos").select2(select2Spanish());
    loadArticulos();

    $("#cmbTiposPagos").select2(select2Spanish());
    loadTiposPagos();
    $("#cmbTiposMantenimientos").select2(select2Spanish());
    loadTiposMantenimientos();
    $("#cmbPeriodos").select2(select2Spanish());
    $("#cmbPeriodos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) {
            cambioGenerador()();
        }
    });


    $("#cmbComerciales").select2(select2Spanish());
    loadComerciales();
    $("#cmbComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioComercial(e.added);
    });

    initTablaComisionistas();
    initTablaGenerador();
    initTablaPrefacturas();

    loadParametros(); // es por tener el margen comercial por defecto

    contratoClienteMantenimientoId = gup('ContratoClienteMantenimientoId');
    if (contratoClienteMantenimientoId != 0) {
        cargarDatosDeContrato(contratoClienteMantenimientoId);
        $("#colaboradores").show();
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.contratoClienteMantenimientoId(0);
        // ocultamoes el widget de colaboradores
        $("#colaboradores").hide();
    }
}

function admData() {
    var self = this;
    self.contratoClienteMantenimientoId = ko.observable();
    self.empresaId = ko.observable();
    self.mantenedorId = ko.observable();
    self.clienteId = ko.observable();
    self.fechaInicio = ko.observable();
    self.fechaFin = ko.observable();
    self.fechaOriginal = ko.observable();
    self.venta = ko.observable();
    self.tipoPago = ko.observable();
    self.manPorComer = ko.observable();
    self.impComer = ko.observable();
    self.observaciones = ko.observable();
    self.articuloId = ko.observable();
    //
    self.coste = ko.observable();
    self.margen = ko.observable();
    self.beneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.manAgente = ko.observable();
    self.beneficioPrevio = ko.observable();
    self.importeAlMantenedor = ko.observable();
    self.importeAlCliente = ko.observable();
    self.referencia = ko.observable();
    self.importeMantenedor = ko.observable();
    self.diaPago = ko.observable();
    self.preaviso = ko.observable();
    self.fechaFactura = ko.observable();
    self.facturaParcial = ko.observable();
    //
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.smantenedorId = ko.observable();
    //
    self.posiblesMantenedores = ko.observableArray([]);
    self.elegidosMantenedores = ko.observableArray([]);
    //
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);
    //
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //
    self.sagenteId = ko.observable();
    //
    self.posiblesAgentes = ko.observableArray([]);
    self.elegidosAgentes = ko.observableArray([]);
    //
    self.stipoPagoId = ko.observable();
    //
    self.posiblesTiposPagos = ko.observableArray([]);
    self.elegidosTiposPagos = ko.observableArray([]);
    //
    //
    self.stipoMantenimientoId = ko.observable();
    //
    self.posiblesTiposMantenimientos = ko.observableArray([]);
    self.elegidosTiposMantenimientos = ko.observableArray([]);
    //    
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    self.contratoClienteMantenimientoComisionistaId = ko.observable();
    self.comercialId = ko.observable();
    //

    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    self.porVentaNeta = ko.observable();
    self.porBeneficio = ko.observable();
    self.porComer = ko.observable();
    //
    self.codCliente = ko.observable();
    self.codMantenedor = ko.observable();
    // --------- generacion
    self.fImporte = ko.observable();
    self.cliente = ko.observable();
    self.fInicial = ko.observable();
    self.fFinal = ko.observable();
    self.speriodoId = ko.observable();
    self.numpagos = ko.observable();
    self.listaPagos = ko.observable();
}

function loadData(data) {
    vm.contratoClienteMantenimientoId(data.contratoClienteMantenimientoId);
    vm.empresaId(data.empresaId);
    vm.mantenedorId(data.mantenedorId);
    vm.clienteId(data.clienteId);
    vm.fechaInicio(spanishDate(data.fechaInicio));
    vm.fechaFin(spanishDate(data.fechaFin));
    vm.fechaOriginal(spanishDate(data.fechaOriginal));
    vm.venta(data.venta);
    vm.tipoPago(data.tipoPago);
    vm.manPorComer(data.manPorComer);
    vm.observaciones(data.observaciones);
    vm.comercialId(data.comercialId);
    vm.articuloId(data.articuloId);
    vm.importeAlCliente(data.importeAlCliente);
    vm.referencia(data.referencia);
    vm.coste(data.coste);
    vm.margen(data.margen);
    vm.beneficio(data.beneficio);
    vm.ventaNeta(data.ventaNeta);
    vm.manAgente(data.manAgente);
    vm.impComer(data.impComer);
    vm.importeMantenedor(data.importeMantenedor);
    vm.diaPago(data.diaPago);
    vm.preaviso(data.preaviso);
    vm.fechaFactura(spanishDate(data.fechaFactura));
    vm.facturaParcial(data.facturaParcial);
    vm.codCliente(data.codCliente);
    vm.codMantenedor(data.codMantenedor);
    //
    loadEmpresas(data.empresaId);
    loadMantenedores(data.mantenedorId);
    loadAgentes(data.comercialId);
    loadTiposPagos(data.tipoPago);
    loadTiposMantenimientos(data.tipoMantenimientoId);
    loadArticulos(data.articuloId);
    loadFormasPago(data.formaPagoId);
    //
    loadComisionistas(data.contratoClienteMantenimientoId);
    loadPrefacturas(data.contratoClienteMantenimientoId);
    //
    cargaCliente(vm.clienteId());
}

function datosOK() {
    $('#frmContratoClienteMantenimiento').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbArticulos: {
                required: true
            },
            cmbTiposMantenimientos: {
                required: true
            },
            txtImporte: {
                required: true,
                number: true
            },
            txtManPorComer: {
                number: true,
                max: 100
            },
            txtMargen: {
                number: true,
                max: 100
            },
            txtCliente: {
                clienteNecesario: true
            },
            cmbFormasPago: {
                required: true
            },
            txtReferencia:{
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            cmbArticulos: {
                required: "Debe elegir una unidad de obra"
            },
            txtImporte: {
                required: "Debe introducir un importe",
                number: "Debe ser un número valido"
            },
            txtManPorComer: {
                number: "Debe ser un número valido"
            },
            cmbTiposMantenimientos: {
                required: "Debe elejir un tipo"
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            txtReferencia:{
                required: "Se necesita una referencia"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmContratoClienteMantenimiento").validate().settings;
    return $('#frmContratoClienteMantenimiento').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        var data = {
            contratoClienteMantenimiento: {
                "contratoClienteMantenimientoId": vm.contratoClienteMantenimientoId(),
                "empresaId": vm.sempresaId(),
                "mantenedorId": vm.smantenedorId(),
                "clienteId": vm.sclienteId(),
                "fechaInicio": spanishDbDate(vm.fechaInicio()),
                "fechaFin": spanishDbDate(vm.fechaFin()),
                "fechaOriginal": spanishDbDate(vm.fechaOriginal()),
                "venta": vm.venta(),
                "manPorComer": vm.manPorComer(),
                "tipoPago": vm.stipoPagoId(),
                "comercialId": vm.sagenteId(),
                "observaciones": vm.observaciones(),
                "coste": vm.coste(),
                "margen": vm.margen(),
                "beneficio": vm.beneficio(),
                "ventaNeta": vm.ventaNeta(),
                "manAgente": vm.manAgente(),
                "articuloId": vm.sarticuloId(),
                "importeAlCliente": vm.importeAlCliente(),
                "referencia": vm.referencia(),
                "impComer": vm.impComer(),
                "importeMantenedor": vm.importeMantenedor(),
                "diaPago": vm.diaPago(),
                "preaviso": vm.preaviso(),
                "fechaFactura": spanishDbDate(vm.fechaFactura()),
                "facturaParcial": vm.facturaParcial(),
                "formaPagoId": vm.sformaPagoId(),
                "tipoMantenimientoId": vm.stipoMantenimientoId()
            }
        };
        if (contratoClienteMantenimientoId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    var contratoClienteMantenimiento = {
                        "contratoClienteMantenimientoId": vm.contratoClienteMantenimientoId(),
                        "clienteId": vm.sclienteId()
                    }
                    $.ajax({
                        type: "POST",
                        url: myconfig.apiUrl + "/api/contrato_mantenimiento_comisionistas/cargarcomisiones",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(contratoClienteMantenimiento),
                        success: function (data, status) {
                            contratoClienteMantenimientoId = vm.contratoClienteMantenimientoId();
                            var mens = "Revise las asociaciones con colaboradores creadas automáticamente, más abajo en esta página";
                            mostrarMensajeSmart(mens);
                            cargarDatosDeContrato(vm.contratoClienteMantenimientoId());
                            $("#colaboradores").show();
                        },
                        error: function (err) {
                            mensErrorAjax(err);
                            // si hay algo más que hacer lo haremos aquí.
                        }
                    });

                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/" + contratoClienteMantenimientoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ContratoGeneral.html?ContratoClienteMantenimientoId=" + vm.contratoClienteMantenimientoId();
                    window.open(url, '_self');
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "ContratoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadEmpresas(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
            vm.posiblesEmpresas(empresas);
            $("#cmbEmpresas").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadMantenedores(id) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/mantenedores",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var mantenedores = [{ clienteId: 0, nombre: "" }].concat(data);
            vm.posiblesMantenedores(mantenedores);
            $("#cmbMantenedores").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadClientes(id) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/soloclientes",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var mantenedores = [{ clienteId: 0, nombre: "" }].concat(data);
            vm.posiblesClientes(mantenedores);
            $("#cmbClientes").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadArticulos(id) {
    $.ajax({
        type: "GET",
        url: "/api/articulos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
            vm.posiblesArticulos(articulos);
            $("#cmbArticulos").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadAgentes(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/agentes/activos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var agentes = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesAgentes(agentes);
            $("#cmbAgentes").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposMantenimientos(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_mantenimientos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposMantenimientos = [{ tipoMantenimientoId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposMantenimientos(tiposMantenimientos);
            $("#cmbTiposMantenimientos").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadTiposPagos(id) {
    var tiposPagos = [
        { tipoPagoId: 0, nombre: "" },
        { tipoPagoId: 1, nombre: "Anual" },
        { tipoPagoId: 2, nombre: "Semestral" },
        { tipoPagoId: 5, nombre: "Quatrimestral" },
        { tipoPagoId: 3, nombre: "Trimestral" },
        { tipoPagoId: 4, nombre: "Mensual" },
        { tipoPagoId: 6, nombre: "Puntual" }
    ];
    vm.posiblesTiposPagos(tiposPagos);
    $("#cmbTiposPagos").val([id]).trigger('change');
    $("#cmbPeriodos").val([id]).trigger('change');
}

function loadParametros() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/parametros/0",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            vm.margen(data.margenMantenimiento);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cambioImporteAlCliente() {
    var mf = function () {
        if (vm.coste()) {
            if (vm.margen()) {
                vm.beneficio(roundToTwo(vm.margen() * vm.coste() / 100));
            }
            vm.ventaNeta(vm.coste() * 1 + vm.beneficio() * 1);
        }
        if (vm.manPorComer()) {
            //vm.impComer(vm.ventaNeta() * vm.manPorComer() / 100);
            vm.importeAlCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.manPorComer()) / 100)));
            vm.impComer(roundToTwo(vm.importeAlCliente() - vm.ventaNeta()));
        }
        vm.importeAlCliente(roundToTwo(vm.ventaNeta() * 1 + vm.impComer() * 1));
        // si hay un mantenedor calculamos el importe debido a él
        if (vm.smantenedorId()) {
            vm.importeMantenedor(roundToTwo(vm.beneficio() * 1 + vm.impComer() * 1));
        }
    };
    return mf;
}

function cambioBeneficio() {
    var mf = function () {
        if (vm.margen() && vm.coste()) {
            if (vm.beneficio()) {
                vm.margen(roundToTwo(((100 * vm.beneficio()) / vm.coste())));
            }
        }
        cambioImporteAlCliente();
    }
    return mf;
}

function cargarDatosDeContrato(contratoClienteMantenimientoId) {
    var data = {
        contratoClienteMantenimientoId: contratoClienteMantenimientoId
    }
    // hay que buscar ese elemento en concreto
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/" + contratoClienteMantenimientoId,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            loadData(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de comisionistas
--------------------------------------------------------------------*/
function nuevoComisionista() {
    limpiaComisionista(); // es un alta
    lineaEnEdicion = false;
}

function aceptarComisionista() {
    if (!datosOKComisionistas()) {
        return;
    }
    if (!vm.contratoClienteMantenimientoComisionistaId()) {
        // es alta
        vm.contratoClienteMantenimientoComisionistaId(0);
    }
    var data = {
        contratoMantenimientoComisionista: {
            contratoClienteMantenimientoComisionistaId: vm.contratoClienteMantenimientoComisionistaId(),
            contratoClienteMantenimientoId: vm.contratoClienteMantenimientoId(),
            comercialId: vm.scomercialId(),
            porVentaNeta: vm.porVentaNeta(),
            porBeneficio: vm.porBeneficio(),
            porComer: vm.porComer()
        }
    }
    if (!lineaEnEdicion) {
        data.contratoMantenimientoComisionista.contratoClienteMantenimientoComisionistaId = 0;
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/contrato_mantenimiento_comisionistas",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalComisionista').modal('hide');
                loadComisionistas(vm.clienteId());
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/contrato_mantenimiento_comisionistas/" + vm.contratoClienteMantenimientoComisionistaId(),
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalComisionista').modal('hide');
                loadComisionistas(vm.clienteId());
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
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
            data: "comercial"
        }, {
            data: "porComer",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "contratoClienteMantenimientoComisionistaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteComisionista(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalComisionista' onclick='editComisionista(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadComisionista(data) {
    vm.contratoClienteMantenimientoComisionistaId(data.contratoClienteMantenimientoComisionistaId);
    vm.contratoClienteMantenimientoId(data.contratoClienteMantenimientoId);
    vm.comercialId(data.comercialId);
    vm.porVentaNeta(data.porVentaNeta);
    vm.porBeneficio(data.porBeneficio);
    vm.porComer(data.porComer);
    //
    loadComerciales(data.comercialId);
}

function limpiaComisionista(data) {
    vm.contratoClienteMantenimientoComisionistaId(0);
    vm.comercialId(null);
    vm.porVentaNeta(null);
    vm.porBeneficio(null);
    vm.porComer(null);
    loadComerciales();
}

function loadTablaComisionistas(data) {
    var dt = $('#dt_comisiones').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function loadComisionistas(id) {
    $.ajax({
        type: "GET",
        url: "/api/contrato_mantenimiento_comisionistas/mantenimiento/" + vm.contratoClienteMantenimientoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaComisionistas(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadPrefacturas(id) {
    $.ajax({
        type: "GET",
        url: "/api/contratos_cliente_mantenimiento/prefacturas/" + vm.contratoClienteMantenimientoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaPrefacturas(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadComerciales(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var comerciales = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesComerciales(comerciales);
            if (id) {
                $("#cmbComerciales").val([id]).trigger('change');
            } else {
                $("#cmbComerciales").val([0]).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function editComisionista(id) {
    lineaEnEdicion = true;
    $.ajax({
        type: "GET",
        url: "/api/contrato_mantenimiento_comisionistas/" + id,
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
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                clienteComisionista: {
                    clienteComisionistaId: id
                }
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/contrato_mantenimiento_comisionistas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadComisionistas(vm.clienteId());
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

/*
* cambioComercial
* Al cambiar un comercial debemos ofertar
* el porcentaje que tiene por defecto para esa empresa
*/
function cambioComercial(data) {
    //  
    if (!data) {
        return;
    }
    var comercialId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/comerciales/comision/" + comercialId + "/" + vm.sclienteId() + "/" + vm.sempresaId() + "/" + vm.stipoMantenimientoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (comision, status) {
            // asignamos el porComer al vm
            vm.porComer(comision);
        },
        error: function (err) {

        }
    });

}

function cambioAgente(data) {
    //
    if (!data) {
        return;
    }
    var comercialId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/comerciales/comision/" + comercialId + "/" + vm.sclienteId() + "/" + vm.sempresaId() + "/" + vm.stipoMantenimientoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (comision, status) {
            // asignamos el porComer al vm
            vm.manPorComer(comision);
            // cambiamos los importes
            if (vm.coste()) {
                cambioImporteAlCliente()();
            }
        },
        error: function (err) {

        }
    });
}


function cambioMantenedor(data) {
    //
    if (!data) {
        return;
    }
    var comercialId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/contratos_mantenedores/mantenedor_empresa/" + comercialId + "/" + vm.sempresaId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // asignamos el porComer al vm
            // vm.manPorComer(data.manPorVentaNeta);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
    $.ajax({
        type: "GET",
        url: "/api/clientes/" + comercialId,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // asignamos el porComer al vm
            vm.codMantenedor(data.proId);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}


/*
* cambioCliente
* Al cambiar un cliente debemos hacer varias cosas
*/
function cambioCliente(data) {
    //
    if (!data) {
        return;
    }
    var clienteId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/clientes/" + clienteId,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // cargamos el código del cliente
            vm.codCliente(data.proId);
            loadFormasPago(data.formaPagoId);
            // asignamos el agente que corresponda
            if (data.comercialId) {
                loadAgentes(data.comercialId);
                data.id = data.comercialId;
                cambioAgente(data);
            }

        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}



/* ----------------------------------------------------------
    Funciones relacionadas con la generación de prefacturas
-------------------------------------------------------------*/
// generar()
// se llama a esta función cuando se pulsa la botón "generar"
// prepara los valores para el formulario modal y lo muestra

function generar() {
    // recalculamos los importes
    cambioBeneficio()();
    // Cargamos por defecto los valores actuales
    vm.fInicial(vm.fechaInicio());
    vm.fFinal(vm.fechaFin());
    vm.speriodoId(vm.stipoPagoId());
    var importe = vm.importeAlCliente();
    var importeAlCliente = vm.importeAlCliente();
    var coste = vm.coste();
    var cliente = vm.sclienteId();
    if (vm.smantenedorId()) {
        importe = vm.importeMantenedor();
        cliente = vm.smantenedorId();
    }
    vm.fImporte(importe);
    var fInicial = new Date(spanishDbDate(vm.fechaFactura()));
    var numpagos = calNumPagos();
    var pagos = crearPagos(importe, importeAlCliente, coste, fInicial, numpagos, vm.diaPago(), vm.sempresaId(), cliente, vm.sarticuloId());
    vm.numpagos(numpagos);
    vm.listaPagos(pagos);
    loadTablaGenerador(pagos);
}

// aceptarGenerar()
// cuando se hace clic en el botón "GENERAR" del formulario modal
function aceptarGenerar() {
    if (!datosOKGenerar()) {
        return;
    }
    // -- Guardar el contrato por si ha habido modificaciones
    if (!datosOK()) {
        return;
    }
    var data = {
        contratoClienteMantenimiento: {
            "contratoClienteMantenimientoId": vm.contratoClienteMantenimientoId(),
            "empresaId": vm.sempresaId(),
            "mantenedorId": vm.smantenedorId(),
            "clienteId": vm.sclienteId(),
            "fechaInicio": spanishDbDate(vm.fechaInicio()),
            "fechaFin": spanishDbDate(vm.fechaFin()),
            "fechaOriginal": spanishDbDate(vm.fechaOriginal()),
            "venta": vm.venta(),
            "manPorComer": vm.manPorComer(),
            "tipoPago": vm.stipoPagoId(),
            "comercialId": vm.sagenteId(),
            "observaciones": vm.observaciones(),
            "coste": vm.coste(),
            "margen": vm.margen(),
            "beneficio": vm.beneficio(),
            "ventaNeta": vm.ventaNeta(),
            "manAgente": vm.manAgente(),
            "articuloId": vm.sarticuloId(),
            "importeAlCliente": vm.importeAlCliente(),
            "referencia": vm.referencia(),
            "impComer": vm.impComer(),
            "importeMantenedor": vm.importeMantenedor(),
            "diaPago": vm.diaPago(),
            "preaviso": vm.preaviso(),
            "fechaFactura": spanishDbDate(vm.fechaFactura()),
            "facturaParcial": vm.facturaParcial()
        }
    };
    if (contratoClienteMantenimientoId == 0) {
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                var contratoClienteMantenimiento = {
                    "contratoClienteMantenimientoId": vm.contratoClienteMantenimientoId(),
                    "clienteId": vm.sclienteId()
                }
                $.ajax({
                    type: "POST",
                    url: myconfig.apiUrl + "/api/contrato_mantenimiento_comisionistas/cargarcomisiones",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(contratoClienteMantenimiento),
                    success: function (data, status) {
                        // comprobamos si ya hubiera facturas para este contrato.
                        $.ajax({
                            type: "GET",
                            url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/prefacturas/" + vm.contratoClienteMantenimientoId(),
                            dataType: "json",
                            contentType: "application/json",
                            success: function (data, status) {
                                if (data.length > 0) {
                                    deletePrevias();
                                } else {
                                    // no hay directamente creamos
                                    crearPrefacturas();
                                }
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                        // si hay algo más que hacer lo haremos aquí.
                    }
                });

            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/" + contratoClienteMantenimientoId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                // comprobamos si ya hubiera facturas para este contrato.
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/prefacturas/" + vm.contratoClienteMantenimientoId(),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data, status) {
                        if (data.length > 0) {
                            deletePrevias();
                        } else {
                            // no hay directamente creamos
                            crearPrefacturas();
                        }
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                        // si hay algo más que hacer lo haremos aquí.
                    }
                });
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
    $('#modalGenerar').modal('hide');
}

function crearPrefacturas() {
    // llamar a la api
    var data = {
        lista: vm.listaPagos(),
        articuloId: vm.sarticuloId(),
        contratoClienteMantenimientoId: vm.contratoClienteMantenimientoId()
    }
    $.ajax({
        type: "POST",
        url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/prefacturas",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // mostramos un mensaje
            mostrarMensajeSmart('Prefacturas creadas correctamente. Puede consultarlas en la solapa correspondiente.');
            loadPrefacturas(vm.contratoClienteMantenimientoId());
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

// datosOKGenerar()
// comprueba que los datos del formulario modal son correctos
function datosOKGenerar() {
    $('#generar-form').validate({
        rules: {
            txtFInicial: {
                required: true
            },
            txtFFinal: {
                required: true
            },
            cmbPeriodos: {
                required: true,
                number: true
            },
            txtNumPagos: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtFInicial: {
                required: "Debe elegir una fecha inicial"
            },
            txtFFinal: {
                required: "Debe elegir una fecha final"
            },
            txtNumPagos: {
                required: "Debe tener un número de pagos",
                number: "Debe ser un número valido"
            },
            cmbPeriodos: {
                required: "Elija una periodificación"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#generar-form").validate().settings;
    // TODO: hay que controlar que el número de pagos no sea cero
    return $('#generar-form').valid();
}

// calNumPagos()
// calcula el número de pagos que se producen entre las fechas
// según la periodicidad de pago escogida
function calNumPagos() {
    var fInicial = new Date(spanishDbDate(vm.fechaInicio()));
    var fFinal = new Date(spanishDbDate(vm.fechaFin()));
    var numMeses = parseInt(moment(fFinal).diff(fInicial, 'months', true));
    if (numMeses == 0) numMeses = 1; // por lo menos un pago
    // calculamos según la periodicidad
    var divisor = 1;
    switch (vm.stipoPagoId()) {
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
            divisor = numMeses;
            break;
    }
    var numpagos = parseInt(numMeses / divisor);
    if (numpagos == 0) numpagos = 1; // por lo menos uno
    return numpagos;
}

// cambioGenerador()
// cuando se abandona el foco de los campos en el formulario modal
// se llama a esta función para que recalcule el número de pagos
// en función de los nuevos valores.
function cambioGenerador() {
    var mf = function () {
        vm.fechaInicio(vm.fInicial());
        vm.fechaFin(vm.fFinal());
        vm.stipoPagoId(vm.speriodoId());
        loadTiposPagos(vm.stipoPagoId());
        var importe = vm.importeAlCliente();
        var cliente = vm.sclienteId();
        if (vm.smantenedorId()) {
            importe = vm.importeMantenedor();
            cliente = vm.smantenedorId();
        }
        vm.fImporte(importe);
        //var fIni = moment(vm.fInicial(), 'DD/MM/YYYY')._d;
        var fIni = new Date(spanishDbDate(vm.fechaFactura()));
        var numpagos = calNumPagos();
        var pagos = crearPagos(importe, fIni, numpagos, vm.diaPago(), vm.sempresaId(), cliente, vm.sarticuloId());
        vm.numpagos(numpagos);
        vm.listaPagos(pagos);
        loadTablaGenerador(pagos);
    };
    return mf;
}

// crearPagos()
// crea un vector provisional con la fecha e importe de cada
// uno de los pagos
function crearPagos(importe, importeAlCliente, coste, fechaInicial, numPagos, diaPago, empresaId, clienteId, articuloId) {
    // calculamos según la periodicidad
    var divisor = 1;
    switch (vm.stipoPagoId()) {
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
    }
    // si hay parcial el primer pago será por la diferencia entre el inicio de contrato y el final
    // de mes 
    var inicioContrato = new Date(spanishDbDate(vm.fechaInicio()));
    var finMesInicioContrato = moment(inicioContrato).endOf('month');
    var diffDias = finMesInicioContrato.diff(inicioContrato, 'days');
    // se supone que la fecha ya está en formato js.
    var importePago = importe / numPagos;
    var importePagoCliente = importeAlCliente / numPagos;
    var importeCoste = coste / numPagos;
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
            porcentajeBeneficio: vm.margen(),
            porcentajeAgente: vm.manPorComer()
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
            porcentajeBeneficio: vm.margen(),
            porcentajeAgente: vm.manPorComer()
        };
        pagos.push(p);
    }
    return pagos;
}

// initTablaGenerador()
// inicializa la tabla que muestra el detalle cada pago a generar
function initTablaGenerador() {
    tablaCarro = $('#dt_generar').dataTable({
        bSort: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_generar'), breakpointDefinition);
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
        data: dataGenerador,
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
            data: "empresaId",
            className: "text-center"
        }, {
            data: "clienteId",
            className: "text-center"
        }]
    });
}

function checkFacParcial(checkbox) {
    if (checkbox.checked) {
        cambioGenerador();
    }
}

// loadTablaGenerador()
// carga en la tabla de pagos a generar los valores del vector
// que se le pasa.
function loadTablaGenerador(data) {
    var dt = $('#dt_generar').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

// deletePrevias
// Borra si "Aceptar" las facturas previas
// y crea las nuevas
function deletePrevias() {
    // mensaje de confirmación
    var mens = "Hay prefacturas ya creadas para este contrato. ¿Quiere eliminarlas y crearlas de nuevo?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/prefacturas/" + vm.contratoClienteMantenimientoId(),
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    crearPrefacturas();
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


function loadTablaPrefacturas(data) {
    var dt = $('#dt_prefactura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function initTablaPrefacturas() {
    tablaCarro = $('#dt_prefactura').dataTable({
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
            data: "observaciones"
        }, {
            data: "prefacturaId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editPrefactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function editPrefactura(id) {
    // hay que abrir la página de detalle de prefactura
    // pasando en la url ese ID
    var url = "PrefacturaDetalle.html?PrefacturaId=" + id;
    window.open(url, '_blank');
}

// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaCliente
// carga en el campo txtCliente el valor seleccionado
var cargaCliente = function (id, cambio) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // poner el nombre en el campo de texto
            $('#txtCliente').val(data.nombre);
            vm.sclienteId(data.clienteId);
            // asignamos el agente que corresponda
            if (data.comercialId && cambio) {
                loadAgentes(data.comercialId);
                data.id = data.comercialId;
                cambioAgente(data);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
};

// initAutoCliente
// inicializa el control del cliente como un autocomplete
var initAutoCliente = function () {
    // incialización propiamente dicha
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            // call ajax
            $.ajax({
                type: "GET",
                url: "/api/clientes/?nombre=" + request.term,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    var r = []
                    data.forEach(function (d) {
                        var v = {
                            value: d.nombre,
                            id: d.clienteId
                        };
                        r.push(v);
                    });
                    response(r);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });

        },
        minLength: 2,
        select: function (event, ui) {
            vm.sclienteId(ui.item.id);
            // el cambio de cliente puede implicar cambio de agente
            cambioCliente(ui.item);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};


function cambioCodCliente(data) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/codigo/" + vm.codCliente(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // cuando cambia el código cambiamos el agente
            cargaCliente(data.clienteId, true);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cambioCodMantenedor(data) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/mantenedorc/" + vm.codMantenedor(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // cuando cambia el código cambiamos el agente
            if (data) {
                $("#cmbMantenedores").val([data.clienteId]).trigger('change');
                var d = {};
                d.id = data.clienteId;
                cambioMantenedor(d);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadFormasPago(id) {
    $.ajax({
        type: "GET",
        url: "/api/formas_pago",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
            vm.posiblesFormasPago(formasPago);
            $("#cmbFormasPago").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}