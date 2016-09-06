/*-------------------------------------------------------------------------- 
comercialDetalle.js
Funciones js par la página ComercialDetalle.html
---------------------------------------------------------------------------*/
var contratoComercialId = 0;

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
    $("#frmContratoComercial").submit(function () {
        return false;
    });

    // select2 things
    $("#cmbEmpresas").select2({
        allowClear: true,
        language: {
            errorLoading: function () {
                return "La carga falló";
            },
            inputTooLong: function (e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function (e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function () {
                return "Cargando más resultados…";
            },
            maximumSelected: function (e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando…";
            }
        }
    });
    loadEmpresas();

    $("#cmbComerciales").select2({
        allowClear: true,
        language: {
            errorLoading: function () {
                return "La carga falló";
            },
            inputTooLong: function (e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function (e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function () {
                return "Cargando más resultados…";
            },
            maximumSelected: function (e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando…";
            }
        }
    });
    loadComerciales();

    $("#cmbTiposPagos").select2({
        allowClear: true,
        language: {
            errorLoading: function () {
                return "La carga falló";
            },
            inputTooLong: function (e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function (e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function () {
                return "Cargando más resultados…";
            },
            maximumSelected: function (e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando…";
            }
        }
    });
    loadTiposPagos();



    contratoComercialId = gup('ContratoComercialId');
    if (contratoComercialId != 0) {
        var data = {
            contratoComercialId: contratoComercialId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_comerciales/" + contratoComercialId,
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
        vm.contratoComercialId(0);
    }
}

function admData() {
    var self = this;
    self.contratoComercialId = ko.observable();
    self.empresaId = ko.observable();
    self.comercialId = ko.observable();
    self.fechaInicio = ko.observable();
    self.fechaFin = ko.observable();
    self.numMeses = ko.observable();
    self.tipoPago = ko.observable();
    self.minimoMensual = ko.observable();
    self.manPorVentaNeta = ko.observable();
    self.manPorBeneficio = ko.observable();
    self.observaciones = ko.observable();
    self.importe = ko.observable();
    self.dniFirmanteEmpresa = ko.observable();
    self.firmanteEmpresa = ko.observable();
    self.dniFirmanteColaborador = ko.observable();
    self.firmanteColaborador = ko.observable();
    //
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    //
    self.stipoPagoId = ko.observable();
    //
    self.posiblesTiposPagos = ko.observableArray([]);
    self.elegidosTiposPagos = ko.observableArray([]);


}

function loadData(data) {
    vm.contratoComercialId(data.contratoComercialId);
    vm.empresaId(data.empresaId);
    vm.comercialId(data.comercialId);
    vm.fechaInicio(spanishDate(data.fechaInicio));
    vm.fechaFin(spanishDate(data.fechaFin));
    vm.numMeses(data.numMeses);
    vm.tipoPago(data.tipoPago);
    vm.importe(data.importe);
    vm.minimoMensual(data.minimoMensual);
    vm.manPorVentaNeta(data.manPorVentaNeta);
    vm.manPorBeneficio(data.manPorBeneficio);
    vm.observaciones(data.observaciones);
    vm.dniFirmanteEmpresa(data.dniFirmanteEmpresa);
    vm.firmanteEmpresa(data.firmanteEmpresa);
    vm.dniFirmanteColaborador(data.dniFirmanteColaborador);
    vm.firmanteColaborador(data.firmanteColaborador);
    //
    loadEmpresas(data.empresaId);
    loadComerciales(data.comercialId);
    loadTiposPagos(data.tipoPago);
}

function datosOK() {
    $('#frmContratoComercial').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbComerciales: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            cmbComerciales: {
                required: "Debe elegir un comercial"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmContratoComercial").validate().settings;
    return $('#frmContratoComercial').valid();
}

function aceptar() {
    var mf = function () {
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
            contratoComercial: {
                "contratoComercialId": vm.contratoComercialId(),
                "empresaId": vm.sempresaId(),
                "comercialId": vm.scomercialId(),
                "fechaInicio": spanishDbDate(vm.fechaInicio()),
                "fechaFin": spanishDbDate(vm.fechaFin()),
                "numMeses": vm.numMeses(),
                "tipoPago": vm.stipoPagoId(),
                "importe": vm.importe(),
                "minimoMensual": vm.minimoMensual(),
                "manPorVentaNeta": vm.manPorVentaNeta(),
                "manPorBeneficio": vm.manPorBeneficio(),
                "observaciones": vm.observaciones(),
                "dniFirmanteEmpresa": vm.dniFirmanteEmpresa(),
                "firmanteEmpresa": vm.firmanteEmpresa(),
                "dniFirmanteColaborador": vm.dniFirmanteColaborador(),
                "firmanteColaborador": vm.firmanteColaborador(),
            }
        };
        if (contratoComercialId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/contratos_comerciales",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ContratoComercialGeneral.html?ContratoComercialId=" + vm.contratoComercialId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/contratos_comerciales/" + contratoComercialId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ContratoComercialGeneral.html?ContratoComercialId=" + vm.contratoComercialId();
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
        var url = "ContratoComercialGeneral.html";
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

function loadComerciales(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var comerciales = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesComerciales(comerciales);
            $("#cmbComerciales").val([id]).trigger('change');
        },
        error: errorAjax
    });
}

function loadTiposPagos(id) {
    var tiposPagos = [
        { tipoPagoId: 0, nombre: "" },
        { tipoPagoId: 1, nombre: "Pago único" },
        { tipoPagoId: 3, nombre: "Pago trimestral" },
        { tipoPagoId: 2, nombre: "Pago mensual" }
    ];
    vm.posiblesTiposPagos(tiposPagos);
    $("#cmbTiposPagos").val([id]).trigger('change');
}
