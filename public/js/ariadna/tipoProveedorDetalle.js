/*-------------------------------------------------------------------------- 
tipoProveedorDetalle.js
Funciones js par la página TipoProveedorDetalle.html
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
    $("#frmTipoProveedor").submit(function() {
        return false;
    });

    empId = gup('tipoProveedorId');
    if (empId != 0) {
        var data = {
                tipoProveedorId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_proveedor/" + empId,
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
        vm.tipoProveedorId(0);
    }
}

function admData() {
    var self = this;
    self.tipoProveedorId = ko.observable();
    self.nombre = ko.observable();
    self.inicioCuenta = ko.observable();
}

function loadData(data) {
    vm.tipoProveedorId(data.tipoProveedorId);
    vm.nombre(data.nombre);
    vm.inicioCuenta(data.inicioCuenta);
}

function datosOK() {
    $('#frmTipoProveedor').validate({
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
    var opciones = $("#frmTipoProveedor").validate().settings;
    return $('#frmTipoProveedor').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            tipoProveedor: {
                "tipoProveedorId": vm.tipoProveedorId(),
                "nombre": vm.nombre(),
                "inicioCuenta": vm.inicioCuenta()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/tipos_proveedor",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoProveedorGeneral.html?TipoProveedorId=" + vm.tipoProveedorId();
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
                url: myconfig.apiUrl + "/api/tipos_proveedor/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoProveedorGeneral.html?TipoProveedorId=" + vm.tipoProveedorId();
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
        var url = "TipoProveedorGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

