﻿/*-------------------------------------------------------------------------- 
tipoTextoDetalle.js
Funciones js par la página TipoTextoDetalle.html
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
    $("#frmTipoTexto").submit(function() {
        return false;
    });

    empId = gup('TipoTextoId');
    if (empId != 0) {
        var data = {
                tipoTextoId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_texto/" + empId,
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
        vm.tipoTextoId(0);
    }
}

function admData() {
    var self = this;
    self.tipoTextoId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.tipoTextoId(data.tipoTextoId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmTipoTexto').validate({
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
    var opciones = $("#frmTipoTexto").validate().settings;
    return $('#frmTipoTexto').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            tipoTexto: {
                "tipoTextoId": vm.tipoTextoId(),
                "nombre": vm.nombre()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/tipos_texto",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoTextoGeneral.html?TipoTextoId=" + vm.tipoTextoId();
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
                url: myconfig.apiUrl + "/api/tipos_texto/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TipoTextoGeneral.html?TipoTextoId=" + vm.tipoTextoId();
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
        var url = "TipoTextoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

