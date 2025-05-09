/*-------------------------------------------------------------------------- 
actuacionDetalle.js
Funciones js par la pÃ¡gina ActuacionDetalle.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataLocales;
var dataReparaciones;

var localEnEdicion = false;
var DesdeGeneral = "";

var breakpointDefinition = {
    tablet: 724,
    phone: 480
};

var actuacionId = 0;
var reparacionId = 0;

function initForm() {
    comprobarLogin();
    
    
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignaciÃ³n de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
   

    $("#frmReparacion").submit(function () {
        return false;
    });

    $("#cmbTarifasProveedor").select2(select2Spanish());
    loadTarifasProveedor();
    //
    $("#cmbTarifasCliente").select2(select2Spanish());
    loadTarifasCliente();
    //
    $("#cmbTiposIvaCli").select2(select2Spanish());
    loadTiposIvaCli();
    //
    $("#cmbTiposIvaPro").select2(select2Spanish());
    loadTiposIvaPro();
   
    $("#cmbArticulos").select2(select2Spanish());
    loadArticulos();
   
    
   

    datePickerSpanish(); // see comun.js

    
    actuacionId = gup('ActuacionId');
    DesdeGeneral = gup("DesdeGeneral");
    reparacionId = gup('ReparacionId');

    if (reparacionId != 0) {
        var data = {
            actuacionId: actuacionId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/reparaciones/" + reparacionId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.reparacionId(0);
        vm.actuacionId(actuacionId);
        vm.fechaReparacion(moment(new Date()).format('DD/MM/YYYY'));
    }
}

function admData() {
    var self = this;
    self.actuacionId = ko.observable();
    self.reparacionId = ko.observable();
    self.descripcion = ko.observable();
    self.notaCliente = ko.observable();
    self.notaProveedor = ko.observable();
    self.fechaReparacion = ko.observable();
    self.importeCliente = ko.observable();
    self.importeProveedor = ko.observable();
    //
    self.tarifaProveedorId = ko.observable();
    self.starifaProveedorId = ko.observable();
    //
    self.posiblesTarifasProveedor = ko.observableArray([]);
    self.elegidosTarifasProveedor = ko.observableArray([]);
    //
    self.tarifaClienteId = ko.observable();
    self.starifaClienteId = ko.observable();
    //
    self.posiblesTarifasCliente = ko.observableArray([]);
    self.elegidosTarifasCliente = ko.observableArray([]);
    //
    self.tipoIvaId = ko.observable();
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIvaCli = ko.observableArray([]);
    self.elegidosTiposIvaCli = ko.observableArray([]);
    //
    self.tipoIvaPro = ko.observable();
    self.stipoIvaPro = ko.observable();
    //
    self.posiblesTiposIvaPro = ko.observableArray([]);
    self.elegidosTiposIvaPro = ko.observableArray([]);
    
    //
    self.articuloId = ko.observable();
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);
}


function loadData(data) {
    vm.actuacionId(data.actuacionId);
    vm.reparacionId(data.reparacionId)
    vm.articuloId(data.articuloId);
    vm.tarifaClienteId(data.tarifaClienteId);
    vm.tarifaProveedorId(data.tarifaProveedorId);
    vm.importeCliente(data.importeCliente);
    vm.importeProveedor(data.importeProveedor);
    vm.tipoIvaId(data.tipoIvaId);
    vm.fechaReparacion(spanishDate(data.fechaReparacion));
    vm.descripcion(data.descripcion);
    vm.notaCliente(data.notasCliente);
    vm.notaProveedor(data.notasProveedor);

    //
    loadTarifasProveedor(data.tarifaProveedorId);
    loadTarifasCliente(data.tarifaClienteId);
    loadTiposIvaCli(data.tipoIvaCliente)
    loadTiposIvaPro(data.tipoIvaProveedor)
    loadArticulos(data.articuloId);
   
}
    


function datosOK() {
    
    $('#frmReparacion').validate({
        rules: {
            
            txtFechaReparacion: {required: true, minlength: 10},
            cmbArticulos: { required: true}
           
        },
        // Messages for form validation
        messages: {
            txtFechaReparacion: {required: 'Debe introducir una fecha de creación', minlength: 'Formato de fecha incorrecto' },
            cmbArticulos: { required: 'Debe introducir un articulo'}

        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmReparacion').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) return;
        var data = {
            reparacion: {
                "actuacionId":  vm.actuacionId(),
                "reparacionId": vm.reparacionId(),
                "articuloId": vm.sarticuloId(),
                "tarifaClienteId": vm.starifaClienteId(),
                "tarifaProveedorId": vm.starifaProveedorId(),
                "tipoIvaCliente": vm.stipoIvaId(),
                "tipoIvaProveedor": vm.stipoIvaPro(),
                "importeProveedor": vm.importeProveedor(),
                "importeCliente": vm.importeCliente(),
                "notasCliente": vm.notaCliente(),
                "notasProveedor": vm.notaProveedor(),
                "descripcion": vm.descripcion(),
                "fechaReparacion": spanishDbDate(vm.fechaReparacion()),
            }
        };
       
        if (reparacionId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/reparaciones",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var returnUrl = "ActuacionDetalle.html?ActuacionId=" +  vm.actuacionId();
                    window.open(returnUrl, '_self');
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/reparaciones/" + reparacionId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var returnUrl = "ActuacionDetalle.html?ActuacionId=" + vm.actuacionId();
                   
                    window.open(returnUrl, '_self');
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
                }
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "ActuacionDetalle.html?ActuacionId=" + vm.actuacionId();
        if(DesdeGeneral == 'true') {
            url = "ActuacionGeneral.html";
        }
        window.open(url, '_self');
    }
    return mf;
}

function loadTarifasProveedor(tarifasProveedorId) {
    llamadaAjax("GET", "/api/tarifas_proveedor", null, function (err, data) {
        if (err) return;
        var tarifaProveedor = [{ tarifaProveedorId: 0, nombre: "" }].concat(data);
        vm.posiblesTarifasProveedor(tarifaProveedor);
        $("#cmbTarifasProveedor").val([tarifasProveedorId]).trigger('change');
    });
}

function loadTarifasCliente(tarifaClienteId) {
    llamadaAjax("GET", "/api/tarifas_cliente", null, function (err, data) {
        if (err) return;
        var tarifasCliente = [{ tarifaClienteId: 0, nombre: "" }].concat(data);
        vm.posiblesTarifasCliente(tarifasCliente);
        $("#cmbTarifasCliente").val([tarifaClienteId]).trigger('change');
    });
}

function loadTiposIvaCli(tipoIvaId) {
    llamadaAjax("GET", "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIvaCli = [{ tipoIvaId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposIvaCli(tiposIvaCli);
        $("#cmbTiposIvaCli").val([tipoIvaId]).trigger('change');
    });
}

function loadTiposIvaPro(tipoIvaProId) {
    llamadaAjax("GET", "/api/tipos_iva/combo/proveedor", null, function (err, data) {
        if (err) return;
        var tiposIvaPro = [{ tipoIvaPro: 0, nombre: "" }].concat(data);
        vm.posiblesTiposIvaPro(tiposIvaPro);
        $("#cmbTiposIvaPro").val([tipoIvaProId]).trigger('change');
    });
}

function loadArticulos(articuloId) {
    llamadaAjax("GET", "/api/articulos/concat/articulo/capitulo", null, function (err, data) {
        if (err) return;
        var articulos = [{ articuloId: null, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
        $("#cmbArticulos").val([articuloId]).trigger('change');
    });
}









