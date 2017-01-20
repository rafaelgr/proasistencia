/*-------------------------------------------------------------------------- 
tipoProyectoDetalle.js
Funciones js par la página TipoProyectoDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;

var posiblesNiveles = [{
    id: 0,
    nombre: "TipoProyecto"
}, {
    id: 1,
    nombre: "Jefe de Equipo"
}, {
    id: 2,
    nombre: "Vigilante"
}];

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
    $("#frmTipoProyecto").submit(function() {
        return false;
    });

    adminId = gup('TipoProyectoId');
    if (adminId != 0) {
        var data = {
                tipoProyectoId: adminId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_proyectos/" + adminId,
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
        vm.tipoProyectoId(0);
    }
}

function admData() {
    var self = this;
    self.tipoProyectoId = ko.observable();
    self.nombre = ko.observable();
    self.abrev = ko.observable();
}

function loadData(data) {
    vm.tipoProyectoId(data.tipoProyectoId);
    vm.nombre(data.nombre);
    vm.abrev(data.abrev);
}

function datosOK() {
    $('#frmTipoProyecto').validate({
        rules: {
            cmbNivel: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtAbrev: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbNivel: {
                required: "Debe seleccionar un nivel"
            },
            txtNombre: {
                required: 'Introduzca el nombre'
            },
            txtAbrev: {
                required: 'Introduzca una breviatura'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmTipoProyecto").validate().settings;
    return $('#frmTipoProyecto').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            tipoProyecto: {
                "tipoProyectoId": vm.tipoProyectoId(),
                "nombre": vm.nombre(),
                "abrev": vm.abrev()
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/tipos_proyectos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TiposProyectoGeneral.html?TipoProyectoId=" + vm.tipoProyectoId();
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
                url: myconfig.apiUrl + "/api/tipos_proyectos/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TiposProyectoGeneral.html?TipoProyectoId=" + vm.tipoProyectoId();
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
        var url = "TiposProyectoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}
