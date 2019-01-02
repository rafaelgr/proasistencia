/*-------------------------------------------------------------------------- 
estadoPresupuestoDetalle.js
Funciones js par la página EstadoPresupuestoDetalle.html
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
    $("#frmEstadoPresupuesto").submit(function () {
        return false;
    });

    empId = gup('EstadoPresupuestoId');
    if (empId != 0) {
        var data = {
            estadoPresupuestoId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/estados_Presupuesto/" + empId,
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
        vm.estadoPresupuestoId(0);
    }
}

function admData() {
    var self = this;
    self.estadoPresupuestoId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.estadoPresupuestoId(data.estadoPresupuestoId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmEstadoPresupuesto').validate({
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
    var opciones = $("#frmEstadoPresupuesto").validate().settings;
    return $('#frmEstadoPresupuesto').valid();
}


function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            estadoPresupuesto: {
                "estadoPresupuestoId": vm.estadoPresupuestoId(),
                "nombre": vm.nombre(),
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/estados_Presupuesto",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    
                    var url = "EstadoPresupuestoGeneral.html?EstadoPresupuestoId=" + data.estadoPresupuestoId;
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
                url: myconfig.apiUrl + "/api/estados_Presupuesto/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    
                    // Nos volvemos al general
                    var url = "EstadoPresupuestoGeneral.html?EstadoPresupuestoId=" + vm.estadoPresupuestoId();
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
        var url = "EstadoPresupuestoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

