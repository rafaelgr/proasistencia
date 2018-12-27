/*-------------------------------------------------------------------------- 
rechazoPresupuestoDetalle.js
Funciones js par la página RechazoPresupuestoDetalle.html
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
    $("#frmRechazoPresupuesto").submit(function () {
        return false;
    });

    empId = gup('RechazoPresupuestoId');
    if (empId != 0) {
        var data = {
            rechazoPresupuestoId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/rechazos_Presupuesto/" + empId,
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
        vm.rechazoPresupuestoId(0);
    }
}

function admData() {
    var self = this;
    self.rechazoPresupuestoId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.rechazoPresupuestoId(data.rechazoPresupuestoId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmRechazoPresupuesto').validate({
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
    var opciones = $("#frmRechazoPresupuesto").validate().settings;
    return $('#frmRechazoPresupuesto').valid();
}


function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            rechazoPresupuesto: {
                "rechazoPresupuestoId": vm.rechazoPresupuestoId(),
                "nombre": vm.nombre(),
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/rechazos_Presupuesto",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    
                    var url = "RechazoPresupuestoGeneral.html?RechazoPresupuestoId=" + data.rechazoPresupuestoId;
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
                url: myconfig.apiUrl + "/api/rechazos_Presupuesto/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    
                    // Nos volvemos al general
                    var url = "RechazoPresupuestoGeneral.html?RechazoPresupuestoId=" + vm.rechazoPresupuestoId();
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
        var url = "RechazoPresupuestoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

