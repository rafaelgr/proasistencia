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
    $("#cmbEmpresas").select2(select2Spanish());
    $("#cmbEmpresas").select2().on('change', function (e) {
        cambioEmpresa(e.added);
    });
    loadEmpresas();

    $("#cmbComerciales").select2(select2Spanish());
    $("#cmbComerciales").select2().on('change', function (e) {
        cambioComercial(e.added);
    });
    loadComerciales();

    $("#cmbTiposPagos").select2(select2Spanish());
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
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
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
    self.observaciones = ko.observable();
    self.importe = ko.observable();
    self.dniFirmanteEmpresa = ko.observable();
    self.firmanteEmpresa = ko.observable();
    self.dniFirmanteColaborador = ko.observable();
    self.firmanteColaborador = ko.observable();
    self.manComisAgente = ko.observable();
    self.manPorImpCliente = ko.observable();
    self.manPorImpClienteAgente = ko.observable();
    self.manPorCostes = ko.observable();
    self.manCostes = ko.observable();
    self.manJefeObra = ko.observable();
    self.manOficinaTecnica = ko.observable();
    self.manAsesorTecnico = ko.observable();
    self.manComercial = ko.observable();
    self.manComision = ko.observable();
    self.comision = ko.observable();
    //
    self.segComisAgente = ko.observable();
    self.segPorImpCliente = ko.observable();
    self.segPorImpClienteAgente = ko.observable();
    self.segPorCostes = ko.observable();
    self.segCostes = ko.observable();
    self.segJefeObra = ko.observable();
    self.segOficinaTecnica = ko.observable();
    self.segAsesorTecnico = ko.observable();
    self.segComercial = ko.observable();
    self.segComision = ko.observable();
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
    vm.observaciones(data.observaciones);
    vm.dniFirmanteEmpresa(data.dniFirmanteEmpresa);
    vm.firmanteEmpresa(data.firmanteEmpresa);
    vm.dniFirmanteColaborador(data.dniFirmanteColaborador);
    vm.firmanteColaborador(data.firmanteColaborador);
    vm.manComisAgente(data.manComisAgente);
    vm.manPorImpCliente(data.manPorImpCliente);
    vm.manPorImpClienteAgente(data.manPorImpClienteAgente);
    vm.manPorCostes(data.manPorCostes);
    vm.manCostes(data.manCostes);
    vm.manJefeObra(data.manJefeObra);
    vm.manOficinaTecnica(data.manOficinaTecnica);
    vm.manAsesorTecnico(data.manAsesorTecnico);
    vm.manComercial(data.manComercial);
    vm.manComision(data.manComision);
    //
    vm.segComisAgente(data.segComisAgente);
    vm.segPorImpCliente(data.segPorImpCliente);
    vm.segPorImpClienteAgente(data.segPorImpClienteAgente);
    vm.segPorCostes(data.segPorCostes);
    vm.segCostes(data.segCostes);
    vm.segJefeObra(data.segJefeObra);
    vm.segOficinaTecnica(data.segOficinaTecnica);
    vm.segAsesorTecnico(data.segAsesorTecnico);
    vm.segComercial(data.segComercial);
    vm.segComision(data.segComision);

    vm.comision(data.comision);

    if (data.manPorImpCliente > 0) $('#chkManPorImpCliente').attr('checked', 'true');
    if (data.manPorImpClienteAgente > 0) $('#chkManPorImpClienteAgente').attr('checked', 'true');
    if (data.manPorCostes > 0) $('#chkManPorCostes').attr('checked', 'true');
    //
    if (data.segPorImpCliente > 0) $('#chkSegPorImpCliente').attr('checked', 'true');
    if (data.segPorImpClienteAgente > 0) $('#chkSegPorImpClienteAgente').attr('checked', 'true');
    if (data.segPorCostes > 0) $('#chkSegPorCostes').attr('checked', 'true');    
    //
    loadEmpresas(data.empresaId);
    loadComerciales(data.comercialId);
    loadTiposPagos(data.tipoPago);
}

function datosOK() {
    var options = {
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbComerciales: {
                required: true
            },
            txtManPorImpCliente: { number: true },
            txtManPorImpClienteAgfente: { number: true },
            txtManPorCostes: { number: true },
            txtComision: {
                required: true,
                number: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            cmbComerciales: {
                required: "Debe elegir un comercial"
            },
            txtComision: {
                required: "Debe indicar un porcentaje de comision",
                number: "Indique un número válido"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    };
    $('#frmContratoComercial').validate(options);
    var opciones = $("#frmContratoComercial").validate().settings;
    if ($('#chkManPorCostes').is(':checked')) {
        opciones.rules.txtManPorCostes = { required: true, number: true };
        opciones.messages.txtManPorCostes = { required: "Se necesita un valor", number: "Debe ser un número válido" }
    }
    if ($('#chkManPorImpCliente').is(':checked')) {
        opciones.rules.txtManPorImpCliente = { required: true, number: true };
        opciones.messages.txtManPorImpCliente = { required: "Se necesita un valor", number: "Debe ser un número válido" }
    }
    if ($('#chkManPorImpClienteAgente').is(':checked')) {
        opciones.rules.txtManPorImpClienteAgente = { required: true, number: true };
        opciones.messages.txtManPorImpClienteAgente = { required: "Se necesita un valor", number: "Debe ser un número válido" }
    }
    return $('#frmContratoComercial').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
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
                "observaciones": vm.observaciones(),
                "dniFirmanteEmpresa": vm.dniFirmanteEmpresa(),
                "firmanteEmpresa": vm.firmanteEmpresa(),
                "dniFirmanteColaborador": vm.dniFirmanteColaborador(),
                "firmanteColaborador": vm.firmanteColaborador(),
                "manComisAgente": vm.manComisAgente(),
                "manPorImpCliente": vm.manPorImpCliente(),
                "manPorImpClienteAgente": vm.manPorImpClienteAgente(),
                "manPorCostes": vm.manPorCostes(),
                "manCostes": vm.manCostes(),
                "manJefeObra": vm.manJefeObra(),
                "manOficinaTecnica": vm.manOficinaTecnica(),
                "manAsesorTecnico": vm.manAsesorTecnico(),
                "manComercial": vm.manComercial(),
                "manComision": vm.manComision(),
                "comision": vm.comision(),
                "segComisAgente": vm.segComisAgente(),
                "segPorImpCliente": vm.segPorImpCliente(),
                "segPorImpClienteAgente": vm.segPorImpClienteAgente(),
                "segPorCostes": vm.segPorCostes(),
                "segCostes": vm.segCostes(),
                "segJefeObra": vm.segJefeObra(),
                "segOficinaTecnica": vm.segOficinaTecnica(),
                "segAsesorTecnico": vm.segAsesorTecnico(),
                "segComercial": vm.segComercial(),
                "segComision": vm.segComision()
            }
        };
        var url = "";
        if (contratoComercialId == 0) {
            url = myconfig.apiUrl + "/api/contratos_comerciales";
            if ($('#chkCopiarContrato').is(':checked')) {
                url = myconfig.apiUrl + "/api/contratos_comerciales/upc/";
            }
            $.ajax({
                type: "POST",
                url: url,
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
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            url = myconfig.apiUrl + "/api/contratos_comerciales/" + contratoComercialId;
            if ($('#chkCopiarContrato').is(':checked')) {
                url = myconfig.apiUrl + "/api/contratos_comerciales/upc/" + contratoComercialId;
            }
            $.ajax({
                type: "PUT",
                url: url,
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
            $("#cmbComerciales").val([id]).trigger('change');
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
        { tipoPagoId: 1, nombre: "Pago único" },
        { tipoPagoId: 3, nombre: "Pago trimestral" },
        { tipoPagoId: 2, nombre: "Pago mensual" }
    ];
    vm.posiblesTiposPagos(tiposPagos);
    $("#cmbTiposPagos").val([id]).trigger('change');
}

/*
* cambioEmpresa
* Al cambiar un agente hay que traer el colaborador asociado
*/
function cambioEmpresa(data) {
    //
    if (!data) {
        return;
    }
    $.ajax({
        type: "GET",
        url: "/api/empresas/" + data.id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if (data) {
                vm.dniFirmanteEmpresa(data.dniFirmante);
                vm.firmanteEmpresa(data.firmante);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}

/*
* cambioComercial
* Al cambiar un agente hay que traer el colaborador asociado
*/
function cambioComercial(data) {
    //
    if (!data) {
        return;
    }
    $.ajax({
        type: "GET",
        url: "/api/comerciales/" + data.id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if (data) {
                vm.dniFirmanteColaborador(data.dniFirmante);
                vm.firmanteColaborador(data.firmante);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}