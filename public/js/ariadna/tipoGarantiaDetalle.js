/*-------------------------------------------------------------------------- 
tipoGarantiaDetalle.js
Funciones js par la página TipoGarantiaDetalle.html
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
    $("#frmTipoGarantia").submit(function() {
        return false;
    });

    empId = gup('tipoGarantiaId');
    if (empId != 0) {
        var data = {
                tipoGarantiaId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_garantia/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
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
        vm.tipoGarantiaId(0);
    }
}

function admData() {
    var self = this;
    self.tipoGarantiaId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.tipoGarantiaId(data.tipoGarantiaId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmTipoGarantia').validate({
        rules: {
            txtNombre: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNombre: {
                required: "Debe dar un nombre"
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmTipoGarantia").validate().settings;
    return $('#frmTipoGarantia').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            tipoGarantia: {
                "tipoGarantiaId": vm.tipoGarantiaId(),
                "nombre": vm.nombre()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/tipos_garantia",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoGarantiaGeneral.html?TipoGarantiaId=" + vm.tipoGarantiaId();
                    window.open(url, '_self');
                },
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/tipos_garantia/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoGarantiaGeneral.html?TipoGarantiaId=" + vm.tipoGarantiaId();
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
    var mf = function() {
        var url = "TipoGarantiaGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

