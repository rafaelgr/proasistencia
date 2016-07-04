/*-------------------------------------------------------------------------- 
comercialDetalle.js
Funciones js par la página MantenedorDetalle.html
---------------------------------------------------------------------------*/
var contratoMantenedorId = 0;

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
    $("#frmContratoMantenedor").submit(function() {
        return false;
    });

    // select2 things
    $("#cmbEmpresas").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    loadEmpresas();

    $("#cmbMantenedores").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    loadMantenedores();

    $("#cmbTiposPagos").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    loadTiposPagos();



    contratoMantenedorId = gup('ContratoMantenedorId');
    if (contratoMantenedorId != 0) {
        var data = {
                contratoMantenedorId: contratoMantenedorId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_mantenedores/" + contratoMantenedorId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.contratoMantenedorId(0);
    }
}

function admData() {
    var self = this;
    self.contratoMantenedorId = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.fechaInicio = ko.observable();
    self.fechaFin = ko.observable();
    self.tipoPago = ko.observable();
    self.manPorComer = ko.observable();
    self.dniFirmanteEmpresa = ko.observable();
    self.firmanteEmpresa = ko.observable();
    self.dniFirmanteMantenedor = ko.observable();
    self.firmanteMantenedor = ko.observable();
    self.observaciones = ko.observable();
    //
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.sclienteId = ko.observable();
    //
    self.posiblesMantenedores = ko.observableArray([]);
    self.elegidosMantenedores = ko.observableArray([]);
    //
    self.stipoPagoId = ko.observable();
    //
    self.posiblesTiposPagos = ko.observableArray([]);
    self.elegidosTiposPagos = ko.observableArray([]);


}

function loadData(data) {
    vm.contratoMantenedorId(data.contratoMantenedorId);
    vm.empresaId(data.empresaId);
    vm.clienteId(data.clienteId);
    vm.fechaInicio(spanishDate(data.fechaInicio));
    vm.fechaFin(spanishDate(data.fechaFin));
    vm.tipoPago(data.tipoPago);
    vm.manPorComer(data.manPorComer);
    vm.dniFirmanteEmpresa(data.dniFirmanteEmpresa);
    vm.firmanteEmpresa(data.firmanteEmpresa);
    vm.dniFirmanteMantenedor(data.dniFirmanteMantenedor);
    vm.firmanteMantenedor(data.firmanteMantenedor);
    vm.observaciones(data.observaciones);
    //
    loadEmpresas(data.empresaId);
    loadMantenedores(data.clienteId);
    loadTiposPagos(data.tipoPago);
}

function datosOK() {
    $('#frmContratoMantenedor').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbMantenedores: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            cmbMantenedores: {
                required: "Debe elegir un comercial"
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmContratoMantenedor").validate().settings;
    return $('#frmContratoMantenedor').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        // control de fechas 
        // var fecha1, fecha2;
        // if (moment(vm.fechaInicio(), "DD/MM/YYYY").isValid()) {
        //     fecha1 = moment(vm.fechaInicio(), "DD/MM/YYYY").format("YYYY-MM-DD");
        // } else {
        //     fecha1 = null;
        // }
        // if (moment(vm.fechaFin(), "DD/MM/YYYY").isValid()) {
        //     fecha2 = moment(vm.fechaFin(), "DD/MM/YYYY").format("YYYY-MM-DD");
        // } else {
        //     fecha2 = null;
        // }
        var data = {
            contratoMantenedor: {
                "contratoMantenedorId": vm.contratoMantenedorId(),
                "empresaId": vm.sempresaId(),
                "clienteId": vm.sclienteId(),
                "fechaInicio": spanishDbDate(vm.fechaInicio()),
                "fechaFin": spanishDbDate(vm.fechaFin()),
                "manPorComer": vm.manPorComer(),
                "tipoPago": vm.stipoPagoId(),
                "dniFirmanteEmpresa": vm.dniFirmanteEmpresa(),
                "firmanteEmpresa": vm.firmanteEmpresa(),
                "dniFirmanteMantenedor": vm.dniFirmanteMantenedor(),
                "firmanteMantenedor": vm.firmanteMantenedor(),
                "observaciones": vm.observaciones()
            }
        };
        if (contratoMantenedorId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/contratos_mantenedores",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ContratoMantenedorGeneral.html?ContratoMantenedorId=" + vm.contratoMantenedorId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/contratos_mantenedores/" + contratoMantenedorId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ContratoMantenedorGeneral.html?ContratoMantenedorId=" + vm.contratoMantenedorId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function() {
        var url = "ContratoMantenedorGeneral.html";
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
        success: function(data, status) {
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
        success: function(data, status) {
            var mantenedores = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesMantenedores(mantenedores);
            $("#cmbMantenedores").val([id]).trigger('change');
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
