/*-------------------------------------------------------------------------- 
articuloDetalle.js
Funciones js par la página ArticuloDetalle.html
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
    $("#frmArticulo").submit(function () {
        return false;
    });

    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();

    $("#cmbGruposArticulo").select2(select2Spanish());
    loadGruposArticulo();

    $("#cmbUnidades").select2(select2Spanish());
    loadUnidades();
    
    empId = gup('ArticuloId');
    if (empId != 0) {
        var data = {
            articuloId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/articulos/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.articuloId(0);
    }
}

function admData() {
    var self = this;
    self.articuloId = ko.observable();
    self.nombre = ko.observable();
    self.precioUnitario = ko.observable();
    self.codigoBarras = ko.observable();
    self.descripcion = ko.observable();
    //
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);
    //
    self.sgrupoArticuloId = ko.observable();
    //
    self.posiblesGruposArticulo = ko.observableArray([]);
    self.elegidosGruposArticulo = ko.observableArray([]);
    //
    self.sunidadId = ko.observable();
    //
    self.posiblesUnidades = ko.observableArray([]);
    self.elegidosUnidades = ko.observableArray([]);


}

function loadData(data) {
    vm.articuloId(data.articuloId);
    vm.nombre(data.nombre);
    vm.precioUnitario(data.precioUnitario);
    vm.codigoBarras(data.codigoBarras);
    vm.descripcion(data.descripcion);
    loadTiposIva(data.tipoIvaId);
    loadGruposArticulo(data.grupoArticuloId);
    loadUnidades(data.unidadId);
}

function datosOK() {
    $('#frmArticulo').validate({
        rules: {
            cmbTiposIva: {
                required: true
            },
            cmbGruposArticulo: {
                required: true
            },
            cmbUnidades: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtPrecioUnitario: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbTiposIva: {
                required: "Debe elegir un tipo de IVA"
            },
            cmbGruposArticulo: {
                required: "Debe elegir un capítulo"
            },
            cmbUnidades: {
                required: "Debe elegir una unidad"
            },
            txtNombre: {
                required: "Debe dar un nombre"
            },
            txtPrecioUnitario: {
                required: "Introduzca un precio"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmArticulo").validate().settings;
    return $('#frmArticulo').valid();
}


function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            articulo: {
                "articuloId": vm.articuloId(),
                "tipoIvaId": vm.stipoIvaId(),
                "nombre": vm.nombre(),
                "precioUnitario": vm.precioUnitario(),
                "codigoBarras": vm.codigoBarras(),
                "descripcion": vm.descripcion(),
                "grupoArticuloId": vm.sgrupoArticuloId(),
                "unidadId": vm.sunidadId()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/articulos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ArticuloGeneral.html?ArticuloId=" + vm.articuloId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/articulos/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ArticuloGeneral.html?ArticuloId=" + vm.articuloId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}


function salir() {
    var mf = function () {
        var url = "ArticuloGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadTiposIva(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_iva",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposIva(tiposIva);
            $("#cmbTiposIva").val([id]).trigger('change');
        },
        error: errorAjax
    });
}


function loadGruposArticulo(id) {
    $.ajax({
        type: "GET",
        url: "/api/grupo_articulo",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var grupos = [{ grupoArticuloId: 0, nombre: "" }].concat(data);
            vm.posiblesGruposArticulo(grupos);
            $("#cmbGruposArticulo").val([id]).trigger('change');
        },
        error: errorAjax
    });
}


function loadUnidades(id) {
    $.ajax({
        type: "GET",
        url: "/api/unidades",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var unidades = [{ unidadId: 0, nombre: "" }].concat(data);
            vm.posiblesUnidades(unidades);
            $("#cmbUnidades").val([id]).trigger('change');
        },
        error: errorAjax
    });
}
