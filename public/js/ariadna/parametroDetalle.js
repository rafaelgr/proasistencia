/*-------------------------------------------------------------------------- 
parametroDetalle.js
Funciones js par la página ParametroDetalle.html
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
    $("#frmParametro").submit(function() {
        return false;
    });

    $("#cmbArtMan").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    loadArtMan();

    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/parametros/0",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // hay que mostrarlo en la zona de datos
            loadData(data);
        },
        error: errorAjax
    });
}

function admData() {
    var self = this;
    self.parametroId = ko.observable();
    self.articuloMantenimiento = ko.observable();
    self.margenMantenimiento = ko.observable();
    //
    self.sartManId = ko.observable();
    //
    self.posiblesArtMan = ko.observableArray([]);
    self.elegidosArtMan = ko.observableArray([]);
}

function loadData(data) {
    vm.parametroId(data.parametroId);
    vm.articuloMantenimiento(data.articuloMantenimiento);
    vm.margenMantenimiento(data.margenMantenimiento);
    loadArtMan(data.articuloMantenimiento);
}

function datosOK() {

    $('#frmParametro').validate({
        rules: {
            cmbArtMan: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbArtMan: {
                required: 'Elija un artículo de mantenimiento'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmParametro").validate().settings;
    return $('#frmParametro').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            parametro: {
                "parametroId": 0,
                "articuloMantenimiento": vm.sartManId(),
                "margenMantenimiento": vm.margenMantenimiento()
            }
        };

        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/parametros/0",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                // Nos volvemos al general
                var url = "Index.html";
                window.open(url, '_self');
            },
            error: errorAjax
        });
    };
    return mf;
}

function salir() {
    var mf = function() {
        var url = "Index.html";
        window.open(url, '_self');
    }
    return mf;
}

function loadArtMan(id) {
    $.ajax({
        type: "GET",
        url: "/api/articulos",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var artMan = [{ articuloId: 0, nombre: "" }].concat(data);
            vm.posiblesArtMan(artMan);
            $("#cmbArtMan").val([id]).trigger('change');
        },
        error: errorAjax
    });
}
