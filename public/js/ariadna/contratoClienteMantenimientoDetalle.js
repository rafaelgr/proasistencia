/*-------------------------------------------------------------------------- 
contratoClienteMantenimientoDetalle.js
Funciones js par la página ContratoClienteMantenimientoDetalle.html
---------------------------------------------------------------------------*/
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
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmContratoClienteMantenimiento").submit(function () {
        return false;
    });

    // select2 things
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    $("#cmbMantenedores").select2(select2Spanish());
    loadMantenedores();

    $("#cmbClientes").select2(select2Spanish());
    loadClientes();


    $("#cmbTiposPagos").select2(select2Spanish());
    loadTiposPagos();

    contratoClienteMantenimientoId = gup('ContratoClienteMantenimientoId');
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
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //

    self.stipoPagoId = ko.observable();
    //
    self.posiblesTiposPagos = ko.observableArray([]);
    self.elegidosTiposPagos = ko.observableArray([]);


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
    //
    loadEmpresas(data.empresaId);
    loadMantenedores(data.clienteId);
    loadClientes(data.clienteId);
    loadTiposPagos(data.tipoPago);
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
                "observaciones": vm.observaciones()
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
                    // Nos volvemos al general
                    var url = "ContratoClienteMantenimientoGeneral.html?ContratoClienteMantenimientoId=" + vm.contratoClienteMantenimientoId();
                    window.open(url, '_self');
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
