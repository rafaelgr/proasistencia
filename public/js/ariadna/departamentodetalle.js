/*-------------------------------------------------------------------------- 
departamentoDetalle.js
Funciones js par la página DepartamentoDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;



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
    $("#frmDepartamento").submit(function() {
        return false;
    });

    adminId = gup('DepartamentoId');
    if (adminId != 0) {
        var data = {
                departamentoId: adminId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/departamentos/" + adminId,
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
        vm.departamentoId(0);
    }
}

function admData() {
    var self = this;
    self.departamentoId = ko.observable();
    self.nombre = ko.observable();
    self.usaCalculadora = ko.observable();
    self.usaContrato = ko.observable();
}

function loadData(data) {
    vm.departamentoId(data.departamentoId);
    vm.nombre(data.nombre);
    vm.usaCalculadora(data.usaCalculadora);
    vm.usaContrato(data.usaContrato);
}

function datosOK() {
    $('#frmDepartamento').validate({
        rules: {
            
            txtNombre: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNombre: {
                required: 'Introduzca el nombre'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    
    return $('#frmDepartamento').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            departamento: {
                "departamentoId": vm.departamentoId(),
                "nombre": vm.nombre(),
                "usaCalculadora": vm.usaCalculadora(),
                "usaContrato": vm.usaContrato()
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/departamentos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "DepartamentosGeneral.html?DepartamentoId=" + vm.departamentoId();
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
                url: myconfig.apiUrl + "/api/departamentos/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "DepartamentosGeneral.html?DepartamentoId=" + vm.departamentoId();
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
        var url = "DepartamentosGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}
