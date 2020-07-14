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
    $("#frmParametro").submit(function () {
        return false;
    });

    $("#cmbArtMan").select2({
        allowClear: true,
        language: {
            errorLoading: function () {
                return "La carga falló";
            },
            inputTooLong: function (e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function (e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function () {
                return "Cargando más resultados…";
            },
            maximumSelected: function (e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando…";
            }
        }
    });

    $("#cmbDefect").select2({
        allowClear: true,
        language: {
            errorLoading: function () {
                return "La carga falló";
            },
            inputTooLong: function (e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function (e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function () {
                return "Cargando más resultados…";
            },
            maximumSelected: function (e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando…";
            }
        }
    });
    loadArtMan();
    loadArtManGas();

    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/parametros/0",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            loadData(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function admData() {
    var self = this;
    self.parametroId = ko.observable();
    self.articuloMantenimiento = ko.observable();
    self.margenMantenimiento = ko.observable();
    //
    self.sartManId = ko.observable();
    self.sdefectId = ko.observable();
    //
    self.posiblesArtMan = ko.observableArray([]);
    self.elegidosArtMan = ko.observableArray([]);
    //
    self.posiblesDefect = ko.observableArray([]);
    self.elegidosDefect = ko.observableArray([]);
    //
    self.cuentaretencion = ko.observable();

    //S3
    self.bucket = ko.observable();
    self.bucketRegion = ko.observable();
    self.bucketFolder = ko.observable();
    self.indentityPool = ko.observable();
    self.raizUrl = ko.observable();

}

function loadData(data) {
    vm.parametroId(data.parametroId);
    vm.articuloMantenimiento(data.articuloMantenimiento);
    vm.margenMantenimiento(data.margenMantenimiento);
    vm.bucket(data.bucket);
    vm.bucketRegion(data.bucket_region);
    vm.bucketFolder(data.bucket_folder);
    vm.indentityPool(data.indentity_pool);
    vm.raizUrl(data.raiz_url);

    loadArtMan(data.articuloMantenimiento);
    loadArtManGas(data.articuloMantenimientoParaGastos);

    vm.cuentaretencion(data.cuentaretencion);
}

function datosOK() {

    $('#frmParametro').validate({
        rules: {
            cmbArtMan: {
                required: true
            }, cmbDefect: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbArtMan: {
                required: 'Elija un artículo de mantenimiento'
            }, cmbDefect: {
                required: 'Elija un articulo por defecto'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmParametro").validate().settings;
    return $('#frmParametro').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            parametro: {
                "parametroId": 0,
                "articuloMantenimiento": vm.sartManId(),
                "margenMantenimiento": vm.margenMantenimiento(),
                "articuloMantenimientoParaGastos": vm.sdefectId(),
                "cuentaretencion": vm.cuentaretencion(),
                "bucket":  vm.bucket(),
                "bucket_region":  vm.bucketRegion(),
                "bucket_folder":  vm.bucketFolder(),
                "indentity_pool": vm.indentityPool(),
                "raiz_url": vm.raizUrl(),
            
            }
        };

        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/parametros/0",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                // Nos volvemos al general
                var url = "Index.html";
                window.open(url, '_self');
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function salir() {
    var mf = function () {
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
        success: function (data, status) {
            var artMan = [{ articuloId: 0, nombre: "" }].concat(data);
            vm.posiblesArtMan(artMan);
            $("#cmbArtMan").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadArtManGas(id) {
    $.ajax({
        type: "GET",
        url: "/api/articulos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var artDefect = [{ articuloId: null, nombre: "" }].concat(data);
            vm.posiblesDefect(artDefect);
            $("#cmbDefect").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}
