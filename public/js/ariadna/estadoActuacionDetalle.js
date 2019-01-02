/*-------------------------------------------------------------------------- 
estadoActuacionDetalle.js
Funciones js par la página EstadoActuacionDetalle.html
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
    $("#frmEstadoActuacion").submit(function () {
        return false;
    });

    empId = gup('EstadoActuacionId');
    if (empId != 0) {
        var data = {
            estadoActuacionId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/estados_actuacion/" + empId,
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
        vm.estadoActuacionId(0);
    }
}

function admData() {
    var self = this;
    self.estadoActuacionId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.estadoActuacionId(data.estadoActuacionId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmEstadoActuacion').validate({
        rules: {
            txtNombre: { required: true },
           
        },
        // Messages for form validation
        messages: {
            txtNombre: { required: "Debe dar un nombre" },
            
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmEstadoActuacion").validate().settings;
    return $('#frmEstadoActuacion').valid();
}


function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            estadoActuacion: {
                "estadoActuacionId": vm.estadoActuacionId(),
                "nombre": vm.nombre(),
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/estados_actuacion",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    
                    var url = "EstadoActuacionGeneral.html?EstadoActuacionId=" + data.estadoActuacionId;
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
                url: myconfig.apiUrl + "/api/estados_actuacion/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    
                    // Nos volvemos al general
                    var url = "EstadoActuacionGeneral.html?EstadoActuacionId=" + vm.estadoActuacionId();
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
        var url = "EstadoActuacionGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

