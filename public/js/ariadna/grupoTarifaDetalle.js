/*-------------------------------------------------------------------------- 
grupoTarifaDetalle.js
Funciones js par la página GrupoTarifaDetalle.html
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
    $("#frmGrupoTarifa").submit(function() {
        return false;
    });

    empId = gup('GrupoTarifaId');
    if (empId != 0) {
        var data = {
                grupoTarifaId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/grupo_tarifa/" + empId,
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
        vm.grupoTarifaId(0);
    }
}

function admData() {
    var self = this;
    self.grupoTarifaId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.grupoTarifaId(data.grupoTarifaId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmGrupoTarifa').validate({
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
    var opciones = $("#frmGrupoTarifa").validate().settings;
    return $('#frmGrupoTarifa').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            grupoTarifa: {
                "grupoTarifaId": vm.grupoTarifaId(),
                "nombre": vm.nombre()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/grupo_tarifa",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "GrupoTarifaGeneral.html?GrupoTarifaId=" + vm.grupoTarifaId();
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
                url: myconfig.apiUrl + "/api/grupo_tarifa/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "GrupoTarifaGeneral.html?GrupoTarifaId=" + vm.grupoTarifaId();
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
        var url = "GrupoTarifaGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

