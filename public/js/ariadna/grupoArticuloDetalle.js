/*-------------------------------------------------------------------------- 
grupoArticuloDetalle.js
Funciones js par la página GrupoArticuloDetalle.html
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
    $("#frmGrupoArticulo").submit(function() {
        return false;
    });

    empId = gup('GrupoArticuloId');
    if (empId != 0) {
        var data = {
                grupoArticuloId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/grupo_articulo/" + empId,
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
        vm.grupoArticuloId(0);
    }
}

function admData() {
    var self = this;
    self.grupoArticuloId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.grupoArticuloId(data.grupoArticuloId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmGrupoArticulo').validate({
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
    var opciones = $("#frmGrupoArticulo").validate().settings;
    return $('#frmGrupoArticulo').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            grupoArticulo: {
                "grupoArticuloId": vm.grupoArticuloId(),
                "nombre": vm.nombre()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/grupo_articulo",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "GrupoArticuloGeneral.html?GrupoArticuloId=" + vm.grupoArticuloId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/grupo_articulo/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "GrupoArticuloGeneral.html?GrupoArticuloId=" + vm.grupoArticuloId();
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
        var url = "GrupoArticuloGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

