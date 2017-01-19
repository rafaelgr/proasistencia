/*-------------------------------------------------------------------------- 
textoPredeterminadoDetalle.js
Funciones js par la página TextoPredeterminadoDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;

var posiblesNiveles = [{
    id: 0,
    texto: "TextoPredeterminado"
}, {
    id: 1,
    texto: "Jefe de Equipo"
}, {
    id: 2,
    texto: "Vigilante"
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
    $("#frmTextoPredeterminado").submit(function() {
        return false;
    });

    adminId = gup('TextoPredeterminadoId');
    if (adminId != 0) {
        var data = {
                textoPredeterminadoId: adminId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/textos_predeterminados/" + adminId,
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
        vm.textoPredeterminadoId(0);
    }
}

function admData() {
    var self = this;
    self.textoPredeterminadoId = ko.observable();
    self.texto = ko.observable();
    self.abrev = ko.observable();
}

function loadData(data) {
    vm.textoPredeterminadoId(data.textoPredeterminadoId);
    vm.texto(data.texto);
    vm.abrev(data.abrev);
}

function datosOK() {
    $('#frmTextoPredeterminado').validate({
        rules: {
            cmbNivel: {
                required: true
            },
            txtTexto: {
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
            txtTexto: {
                required: 'Introduzca el texto'
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
    var opciones = $("#frmTextoPredeterminado").validate().settings;
    return $('#frmTextoPredeterminado').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            textoPredeterminado: {
                "textoPredeterminadoId": vm.textoPredeterminadoId(),
                "texto": vm.texto(),
                "abrev": vm.abrev()
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/textos_predeterminados",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TextosPredeterminadosGeneral.html?TextoPredeterminadoId=" + vm.textoPredeterminadoId();
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
                url: myconfig.apiUrl + "/api/textos_predeterminados/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TextosPredeterminadosGeneral.html?TextoPredeterminadoId=" + vm.textoPredeterminadoId();
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
        var url = "TextosPredeterminadosGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}
