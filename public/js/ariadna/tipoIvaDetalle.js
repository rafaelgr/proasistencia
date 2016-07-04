/*-------------------------------------------------------------------------- 
tipoIvaDetalle.js
Funciones js par la página TipoIvaDetalle.html
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
    $("#frmTipoIva").submit(function() {
        return false;
    });

    empId = gup('TipoIvaId');
    if (empId != 0) {
        var data = {
                tipoIvaId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_iva/" + empId,
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
        vm.tipoIvaId(0);
    }
}

function admData() {
    var self = this;
    self.tipoIvaId = ko.observable();
    self.nombre = ko.observable();
    self.porcentaje = ko.observable();
    self.codigoContable = ko.observable();
}

function loadData(data) {
    vm.tipoIvaId(data.tipoIvaId);
    vm.nombre(data.nombre);
    vm.porcentaje(data.porcentaje);
    vm.codigoContable(data.codigoContable);
}

function datosOK() {
    $('#frmTipoIva').validate({
        rules: {
            txtNombre: {
                required: true
            },
            txtPorcentaje: {
                required: true
            },
            txtCodigoContable: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNombre: {
                required: "Debe dar un nombre"
            },
            txtPorcentaje: {
                required: "Introduzca el porcentaje"
            },
            txtCodigoContable: {
                required: "Introduzca el código contable"
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmTipoIva").validate().settings;
    return $('#frmTipoIva').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            tipoIva: {
                "tipoIvaId": vm.tipoIvaId(),
                "nombre": vm.nombre(),
                "porcentaje": vm.porcentaje(),
                "codigoContable": vm.codigoContable()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/tipos_iva",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoIvaGeneral.html?TipoIvaId=" + vm.tipoIvaId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/tipos_iva/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoIvaGeneral.html?TipoIvaId=" + vm.tipoIvaId();
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
        var url = "TipoIvaGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

