/*-------------------------------------------------------------------------- 
unidadDetalle.js
Funciones js par la página UnidadDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;

var posiblesNiveles = [{
    id: 0,
    nombre: "Unidad"
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
    $("#frmUnidad").submit(function() {
        return false;
    });

    adminId = gup('UnidadId');
    if (adminId != 0) {
        var data = {
                unidadId: adminId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/unidades/" + adminId,
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
        vm.unidadId(0);
    }
}

function admData() {
    var self = this;
    self.unidadId = ko.observable();
    self.nombre = ko.observable();
    self.abrev = ko.observable();
}

function loadData(data) {
    vm.unidadId(data.unidadId);
    vm.nombre(data.nombre);
    vm.abrev(data.abrev);
}

function datosOK() {
    $('#frmUnidad').validate({
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
    var opciones = $("#frmUnidad").validate().settings;
    return $('#frmUnidad').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            unidad: {
                "unidadId": vm.unidadId(),
                "nombre": vm.nombre(),
                "abrev": vm.abrev()
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/unidades",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UnidadesGeneral.html?UnidadId=" + vm.unidadId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/unidades/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UnidadesGeneral.html?UnidadId=" + vm.unidadId();
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
        var url = "UnidadesGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}
