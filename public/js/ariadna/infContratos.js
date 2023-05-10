// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
var usuario;
// License Key

// Create the report viewer with default options
var viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
var options = new Stimulsoft.Viewer.StiViewerOptions();
StiOptions.WebServer.url = "/api/streport";
//StiOptions.WebServer.url = "http://localhost:9615";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);

obtainKey();//obtiene la clave de usuario de stimulsoft de la configuracion

options.appearance.scrollbarsMode = true;
options.appearance.fullScreenMode = true;
options.toolbar.showSendEmailButton = true;
//var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
viewer.onEmailReport = function (event) {
    console.log('EMAIL REPORT');
}

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    //pageSetUp();
    getVersionFooter();
    datePickerSpanish();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $("#btnBuscar").click(obtainReport);
    // avoid form submmit
    $("#frmRptOfertas").submit(function () {
        return false;
    });
    $("#frmExportar").submit(function () {
        return false;
    });
    //
    $('#txtRFecha').daterangepicker({
        "showDropdowns": true,
        "locale": {
            "direction": "ltr",
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aceptar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta",
            "customRangeLabel": "Personalizado",
            "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            "firstDay": 1
        },
        "alwaysShowCalendars": true,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Esta semana': [moment().startOf('week'), moment().endOf('week')],
            'Semana pasada': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este año': [moment().startOf('year'), moment().endOf('year')],
            'Último año': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        }
    }, function (start, end, label) {
        //alert('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
        vm.dFecha(start.format('YYYY-MM-DD'));
        vm.hFecha(end.format('YYYY-MM-DD'));
    });
    vm.dFecha(moment().format('YYYY-MM-DD'));
    vm.hFecha(moment().format('YYYY-MM-DD'));

    //
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    //
    $("#cmbTiposComerciales").select2(select2Spanish());
    loadTiposComerciales();
    //
    $("#cmbColaboradores").select2(select2Spanish());
    loadColaboradores(null);
    //
    $("#cmbContratos").select2(select2Spanish());
    loadContratos();


    $('#cmbTiposComerciales').change(function(e) {
        if(!e.added) return;
        loadColaboradores(parseInt(e.added.id));
    });

    

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
        if(data) {
            initAutoCliente();
            // verificamos si nos han llamado directamente
            //if (id) $('#selector').hide();
            if (gup('facturaId') != "") {
                vm.facturaId(gup('facturaId'));
                verb = "GET";
                var url = myconfig.apiUrl + "/api/facturas/" + vm.facturaId();
                llamadaAjax(verb, url, null, function (err, data) {
                    vm.sempresaId(data.empresaId);
                    vm.sdepartamentoId(data.departamentoId);
                    obtainReport();
                    $('#selector').hide();
                });
            }
        }
    });
    //
    $.validator.addMethod("notEqualTo", function(value, element, param){
        if(value == "0") return false
        return true;
    });
}

function obtainKey() {
    llamadaAjax('GET', '/api/configuracion', null, function (err, data) {
        if(err) return;
        if(data) {
            Stimulsoft.Base.StiLicense.key = data.sti_key
        }
    });
}

function admData() {
    var self = this;
    self.facturaId = ko.observable();
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    // 
    self.comercialId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesColaboradores = ko.observableArray([]);
    self.elegidosColaboradores = ko.observableArray([]);
     //
     self.scontratoId = ko.observable();
     //
     self.posiblesContratos = ko.observableArray([]);
     self.elegidosContratos = ko.observableArray([]);
     self.observaciones = ko.observable();
     self.observacionesPago = ko.observable();
     //
    self.tipoComerciallId = ko.observable();
    self.stipoComercialId = ko.observable();
    //
    self.posiblesTiposComerciales = ko.observableArray([]);
    self.elegidosTiposComerciales = ko.observableArray([]);
     //
};


var rptLiquidacionGeneralParametrosJson = function () {
    if(!datosOK) return;
  /*   if(vm.sdepartamentoId() == 0 && vm.stipoComercialId() != 1) {
        mensError("Se tiene que introducir un departamento.");
        return;
    } */
    var comercialId = vm.scomercialId();
    var tipoComercialId = vm.stipoComercialId();
    var departamentoId = vm.sdepartamentoId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

   /*  if(tipoComercialId != 1) {
        obtainReport();
        return;
    } */

    var url = myconfig.apiUrl + "/api/liquidaciones/colaborador/informe/crea/json/" + dFecha +"/" + hFecha +  "/" + comercialId + "/" + tipoComercialId + "/" + departamentoId + "/" + usuario.usuarioId;

    llamadaAjax("POST", url, null, function (err, data) {
        if(err) return;
        if(data) {
            obtainReportJson(data)
        } else {
            alert("No hay registros con estas condiciones");
        }
    });
   
    
}


function datosOK() {
    $('#frmRptOfertas').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbDepartamentosTrabajo: {
                required: true,
                notEqualTo: 0
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            cmbDepartamentosTrabajo: {
                required: "Debe elegir un departamento",
                notEqualTo: "Debe elegir un departamento"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmRptOfertas").validate().settings;
    return $('#frmRptOfertas').valid();
}

function loadEmpresas(empresaId) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
    });
}

function loadTiposComerciales() {
    llamadaAjax("GET", "/api/tipos_comerciales", null, function (err, data) {
        if (err) return;
        var tipos = [{ tipoComercialId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposComerciales(tipos);
        $("#cmbTiposComerciales").val([0]).trigger('change');
    });
}

function loadColaboradores(e) {
    var tipoComercialId = 0;
    var url = "/api/comerciales"
    if(e) {
        var tipoComercialId = e;
        url =  "/api/comerciales/colaboradores/activos/por/tipo/" + tipoComercialId
    }
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
        var colaboradores = [{ comercialId: 0, nombre: "" }].concat(data);
        vm.posiblesColaboradores(colaboradores);
        $("#cmbColaboradores").val([0]).trigger('change');
    });
}

function loadContratos() {
   
    var url = myconfig.apiUrl +"/api/contratos/concat/referencia/direccion/tipo/" + 0;
    
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
        cargarContratos(data);
    });
}

function cargarContratos(data) {
    var contratos = [{ contratoId: null, contasoc: "" }].concat(data);
    vm.posiblesContratos(contratos);
    $("#cmbContratos").val(0).trigger('change');
}

// initAutoCliente
// inicializa el control del cliente como un autocomplete
var initAutoCliente = function () {
    // incialización propiamente dicha
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("GET", "/api/clientes/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.clienteId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.sclienteId(ui.item.id);
        }
    });
};



var rptContratosParametrosJson = function () {
    var tipoComercialId = vm.tipoComercialId();
    var comercialId = vm.scomercialId();
    var clienteId = vm.sclienteId();
    var departamentoId = vm.sdepartamentoId();
    var empresaId = vm.sempresaId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

    if(!clienteId) clienteId = 0;
    if(!comercialId) comercialId = 0;
    if(!tipoComercialId) tipoComercialId = 0;
    if(!departamentoId) departamentoId = 0;
    if(!empresaId) empresaId = 0;


    
    var url = "/api/contratos/inf/contratos/json/visor/" + dFecha + "/" + hFecha;
    url += "/" + empresaId;
    url += "/" + clienteId;
    url += "/" + departamentoId;
    url += "/" + tipoComercialId;
    url += "/" + comercialId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err)   return;
        if(data) {
            obtainReportJson(data)
        } else {
            alert("No hay registros con estas condiciones");
        }
        
    });
}
