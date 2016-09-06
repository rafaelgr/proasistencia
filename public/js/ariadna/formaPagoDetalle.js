/*-------------------------------------------------------------------------- 
formaPagoDetalle.js
Funciones js par la página FormaPagoDetalle.html
---------------------------------------------------------------------------*/
var empId = 0;

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
    $("#frmFormaPago").submit(function() {
        return false;
    });

    $("#cmbTiposFormaPago").select2({
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
    loadTiposFormaPago();

    empId = gup('FormaPagoId');
    if (empId != 0) {
        var data = {
                formaPagoId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/formas_pago/" + empId,
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
        vm.formaPagoId(0);
    }
}

function admData() {
    var self = this;
    self.formaPagoId = ko.observable();
    self.tipoFormaPagoId = ko.observable();
    self.nombre = ko.observable();
    self.numeroVencimientos = ko.observable();
    self.primerVencimiento = ko.observable();
    self.restoVencimiento = ko.observable();
    self.codigoContable = ko.observable();
    //
    self.stipoFormaPagoId = ko.observable();
    //
    self.posiblesTiposFormaPago = ko.observableArray([]);
    self.elegidosTiposFormaPago = ko.observableArray([]);   
}

function loadData(data) {
    vm.formaPagoId(data.formaPagoId);
    vm.tipoFormaPagoId(data.tipoFormaPagoId);
    vm.nombre(data.nombre);
    vm.numeroVencimientos(data.numeroVencimientos);
    vm.primerVencimiento(data.primerVencimiento);
    vm.restoVencimiento(data.restoVencimiento);
    vm.codigoContable(data.codigoContable);
    loadTiposFormaPago(data.tipoFormaPagoId);
}

function datosOK() {
    $('#frmFormaPago').validate({
        rules: {
            cmbTiposFormasPago: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtNumeroVencimientos: {
                required: true
            },
            txtPrimerVencimiento: {
                required: true
            },
            txtRestoVencimientos: {
                required: true
            },
            txtCodigoContable: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbTiposFormasPago: {
                required: "Debe elegit un tipo"
            },
            txtNombre: {
                required: "Debe dar un nombre"
            },
            txtNumeroVencimientos: {
                required: "Introduzca el númnero de vencimientos"
            },
            txtPrimerVencimiento: {
                required: "Dias hasta el primer vencimiento"
            },
            txtRestoVencimientos: {
                required: "Dias en resto de vencimientos"
            },
            txtCodigoContable: {
                required: "Debe proporcionar un código contable"
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmFormaPago").validate().settings;
    return $('#frmFormaPago').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            formaPago: {
                "formaPagoId": vm.formaPagoId(),
                "tipoFormaPagoId": vm.stipoFormaPagoId(),
                "nombre": vm.nombre(),
                "numeroVencimientos": vm.numeroVencimientos(),
                "primerVencimiento": vm.primerVencimiento(),
                "restoVencimiento": vm.restoVencimiento(),
                "codigoContable": vm.codigoContable()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/formas_pago",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "FormaPagoGeneral.html?FormaPagoId=" + vm.formaPagoId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/formas_pago/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "FormaPagoGeneral.html?FormaPagoId=" + vm.formaPagoId();
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
        var url = "FormaPagoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadTiposFormaPago(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_forma_pago",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var tiposFormaPago = [{ tipoFormaPagoId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposFormaPago(tiposFormaPago);
            $("#cmbTiposFormaPago").val([id]).trigger('change');
        },
        error: errorAjax
    });
}
