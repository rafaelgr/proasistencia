/*-------------------------------------------------------------------------- 
contratoClienteMantenimientoDetalle.js
Funciones js par la página ContratoClienteMantenimientoDetalle.html
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
    $('#txtCoste').on('blur', cambioCoste());
    $('#txtMargen').on('blur', cambioCoste());
    $('#txtManAgente').on('blur', cambioCoste());

    $('#txtImporte2').on('blur', cambioImporte2());

    // calculadora de mantenedor
    $('#txtImporte3').on('blur', cambioImporte3());
    $('#txtManPorComer').on('blur', cambioImporte3());
    $('#txtManAgente2').on('blur', cambioImporte3());

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

    $("#cmbClientes").select2(select2Spanish());
    loadClientes();
    $("#cmbClientes").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioCliente(e.added);
    });

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

    $("#cmbComerciales").select2(select2Spanish());
    loadComerciales();
    $("#cmbComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioComercial(e.added);
    });

    initTablaComisionistas();

    loadParametros(); // es por tener el margen comercial por defecto

    contratoClienteMantenimientoId = gup('ContratoClienteMantenimientoId');
    ocultarCalMantenedor(); // por defecto ocultamos la calculadora de mantenedor
    if (contratoClienteMantenimientoId != 0) {
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
                // Mirar si es de mantenedor para mostrar su calculadora
                if (data.mantenedorId) {
                    mostrarCalMantenedor();
                }
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.contratoClienteMantenimientoId(0);
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
    self.importe = ko.observable();
    self.tipoPago = ko.observable();
    self.manPorComer = ko.observable();
    self.observaciones = ko.observable();
    self.articuloId = ko.observable();
    //
    self.coste = ko.observable();
    self.margen = ko.observable();
    self.beneficio = ko.observable();
    self.importeInicial = ko.observable();
    self.manAgente = ko.observable();
    self.beneficioPrevio = ko.observable();
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
    self.contratoClienteMantenimientoComisionistaId = ko.observable();
    self.comercialId = ko.observable();
    //

    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    self.porComer = ko.observable();

    // --------- generacion
    self.fInicial = ko.observable();
    self.fFinal = ko.observable();


}

function loadData(data) {
    vm.contratoClienteMantenimientoId(data.contratoClienteMantenimientoId);
    vm.empresaId(data.empresaId);
    vm.mantenedorId(data.mantenedorId);
    vm.clienteId(data.clienteId);
    vm.fechaInicio(spanishDate(data.fechaInicio));
    vm.fechaFin(spanishDate(data.fechaFin));
    vm.importe(data.importe);
    vm.tipoPago(data.tipoPago);
    vm.manPorComer(data.manPorComer);
    vm.observaciones(data.observaciones);
    vm.comercialId(data.comercialId);
    vm.articuloId(data.articuloId);

    vm.coste(data.coste);
    vm.margen(data.margen);
    vm.beneficio(data.beneficio);
    vm.importeInicial(data.importeInicial);
    vm.manAgente(data.manAgente);
    //
    loadEmpresas(data.empresaId);
    loadMantenedores(data.mantenedorId);
    loadClientes(data.clienteId);
    loadAgentes(data.comercialId);
    loadTiposPagos(data.tipoPago);
    loadArticulos(data.articuloId);
    //
    loadComisionistas(data.contratoClienteMantenimientoId);
}

function datosOK() {
    $('#frmContratoClienteMantenimiento').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbClientes: {
                required: true
            },
            txtImporte: {
                required: true,
                number: true
            },
            txtManPorComer: {
                number: true
            },
            cmbTiposPagos: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            cmbClientes: {
                required: "Debe elegir un cliente"
            },
            txtImporte: {
                required: "Debe introducir un importe",
                number: "Debe ser un número valido"
            },
            txtManPorComer: {
                number: "Debe ser un número valido"
            },
            cmbTiposPagos: {
                required: "Debe elegir un tipo de pago"
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
                "importe": vm.importe(),
                "manPorComer": vm.manPorComer(),
                "tipoPago": vm.stipoPagoId(),
                "comercialId": vm.sagenteId(),
                "observaciones": vm.observaciones(),
                "coste": vm.coste(),
                "margen": vm.margen(),
                "beneficio": vm.beneficio(),
                "importeInicial": vm.importeInicial(),
                "manAgente": vm.manAgente(),
                "articuloId": vm.sarticuloId()
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
                            // Nos quedamos
                            var url = "ContratoClienteMantenimientoDetalle.html?ContratoClienteMantenimientoId=" + vm.contratoClienteMantenimientoId();
                            window.open(url, '_self');
                        },
                        error: errorAjax
                    });

                },
                error: errorAjax
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
                    var url = "ContratoClienteMantenimientoGeneral.html?ContratoClienteMantenimientoId=" + vm.contratoClienteMantenimientoId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "ContratoClienteMantenimientoGeneral.html";
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
        error: errorAjax
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
        error: errorAjax
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
        error: errorAjax
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
        error: errorAjax
    });
}


function loadAgentes(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/agentes",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var agentes = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesAgentes(agentes);
            $("#cmbAgentes").val([id]).trigger('change');
        },
        error: errorAjax
    });
}


function loadTiposPagos(id) {
    var tiposPagos = [
        { tipoPagoId: 0, nombre: "" },
        { tipoPagoId: 1, nombre: "Anual" },
        { tipoPagoId: 2, nombre: "Semestral" },
        { tipoPagoId: 3, nombre: "Trimestral" },
        { tipoPagoId: 4, nombre: "Mensual" }
    ];
    vm.posiblesTiposPagos(tiposPagos);
    $("#cmbTiposPagos").val([id]).trigger('change');
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
        error: errorAjax
    });
}

function cambioCoste() {
    var mf = function () {
        if (vm.coste()) {
            var b = roundToTwo((vm.coste() * vm.margen() / 100.0));
            vm.beneficio(b);
            vm.importeInicial(parseFloat(vm.coste()) + vm.beneficio());
            if (vm.manAgente()) {
                var m = roundToTwo((vm.importeInicial() * vm.manAgente() / 100.0));
                vm.importe(roundToTwo(m + vm.importeInicial()));
            }
        }
    };
    return mf;
}

function cambioImporte() {
    var mf = function () {
        alert("Cambia importe");
    };
    return mf;
}

function cambioImporte2() {
    var mf = function () {
    };
    return mf;
}

function cambioImporte3() {
    var mf = function () {
        // hay que calcular desde el importe de cliente hacia atrás
        if (vm.importe()) {
            // (1) Calculamos el porcentaje que fcaturaremos y eso
            // será nuestro beneficio inicial (previo)
            var bp = (vm.importe() * vm.manPorComer() / 100);
            vm.importeInicial(roundToTwo(bp));
            // (2) Y ahora le restamos la comisión del agente
            if (vm.manAgente()) {
                bp = bp - (bp * vm.manAgente() / 100);
            }
            vm.beneficio(roundToTwo(bp));
        }
    };
    return mf;
}

/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de comisionistas
--------------------------------------------------------------------*/
function nuevoComisionista() {
    // TODO: Implementar la funcionalidad de nueva línea
    limpiaComisionista(); // es un alta
    lineaEnEdicion = false;
}

function aceptarComisionista() {
    // TODO: Implementar funcionalidad de aceptar.
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
            error: errorAjax
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
            error: errorAjax
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
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbComerciales: {
                required: "Debe elegir un comercial"
            },
            txtPorComer: {
                required: 'Necesita un porcentaje'
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
    vm.porComer(data.porComer);
    //
    loadComerciales(data.comercialId);
}

function limpiaComisionista(data) {
    vm.contratoClienteMantenimientoComisionistaId(0);
    vm.comercialId(null);
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
        error: errorAjax
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
        error: errorAjax
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
        error: errorAjax
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
                error: errorAjax
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
        url: "/api/contratos_comerciales/comercial_empresa/" + comercialId + "/" + vm.empresaId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // asignamos el porComer al vm
            vm.porComer(data.manPorVentas);
        },
        error: errorAjax
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
        url: "/api/contratos_comerciales/comercial_empresa/" + comercialId + "/" + vm.sempresaId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // asignamos el porComer al vm
            vm.manAgente(data.manPorVentas);
        },
        error: errorAjax
    });;
}

function cambioMantenedor(data) {
    //
    if (!data) {
        return;
    }
    mostrarCalMantenedor();
    var comercialId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/contratos_mantenedores/mantenedor_empresa/" + comercialId + "/" + vm.sempresaId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // asignamos el porComer al vm
            vm.manPorComer(data.manPorComer);
        },
        error: errorAjax
    });;
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
            // asignamos el agente que corresponda
            if (data.comercialId) {
                loadAgentes(data.comercialId);
                data.id = data.comercialId;
                cambioAgente(data);
            }

        },
        error: errorAjax
    });

}

function ocultarCalMantenedor() {
    $("#calMantenedor").hide();
    $("#calCliente").show();
}

function mostrarCalMantenedor() {
    $("#calCliente").hide();
    $("#calMantenedor").show();
}

/* ----------------------------------------------------------
    Funciones relacionadas con la generación de prefacturas
-------------------------------------------------------------*/

function generar() {
    // Cargamos por defecto los valores actuales
    vm.fInicial(vm.fechaInicio());
    vm.fFinal(vm.fechaFin());
}

function aceptarGenerar() {
    $('#modalGenerar').modal('hide');
}