/*-------------------------------------------------------------------------- 
documentopagoDetalle.js
Funciones js par la página DocumentoPagoDetalle.html
---------------------------------------------------------------------------*/
var documentoPagoId = 0;

var posiblesNiveles = [{
    id: 0,
    nombre: "DocumentoPago"
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
    // /
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmDocumentoPago").submit(function() {
        return false;
    });



    documentoPagoId = gup('DocumentoPagoId');
    if (documentoPagoId != 0) {
        var data = {
                documentopagoId: documentoPagoId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
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
        vm.documentopagoId(0);
        $("#cmbTiposProfesional").select2(select2Spanish());
        loadTiposProfesionales();
    }
}

function admData() {
    var self = this;
    self.documentopagoId = ko.observable();
    self.nombre = ko.observable();
    self.numero = ko.observable();
    //
    //
    self.facproveId = ko.observable();
}

function loadData(data) {
    vm.documentopagoId(data.documentopagoId);
    vm.nombre(data.nombre);
    vm.numero(data.numero);
}

function datosOK() {
    $('#frmDocumentoPago').validate({
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
    var opciones = $("#frmDocumentoPago").validate().settings;
    return $('#frmDocumentoPago').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            documentopago: {
                "documentopagoId": vm.documentopagoId(),
                "nombre": vm.nombre(),
                "numero": vm.numero()
            }
        };
        if (documentoPagoId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/documentos_pago",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "DocumentosPagoGeneral.html?DocumentoPagoId=" + vm.documentopagoId();
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
                url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "DocumentosPagoGeneral.html?DocumentoPagoId=" + vm.documentopagoId();
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
        var url = "DocumentosPagoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadTablaFacturas(data) {
    var dt = $('#dt_FacturasAsociadas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}