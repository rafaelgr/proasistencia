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

// Crear opciones
var options = new Stimulsoft.Viewer.StiViewerOptions();
options.appearance.scrollbarsMode = true;
options.toolbar.showSendEmailButton = true;

// Configurar servidor y localización
StiOptions.WebServer.url = "/api/streport";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../../Localization/es.xml", true);

obtainKeyNew();//obtiene la clave de usuario de stimulsoft de la configuracion



// Inicializar visor PASANDO SOLO EL OBJETO options con container
options.container = "viewerContent";  // ID del div donde se mostrará
const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

// Capturar eventos
viewer.onEmailReport = function (event) {
    console.log('EMAIL REPORT');
};

function initForm() {
    $('#StiViewerReportPanel').css("text-align", "left");
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    //pageSetUp();
    getVersionFooter();
    datePickerSpanish();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $("#btnBuscar").click(rptContratosParametrosJson);
    // avoid form submmit
    $("#frmRptContratos").submit(function () {
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

        var empresaId = vm.sempresaId();
        var departamentoId = vm.sdepartamentoId();
        var dFecha = vm.dFecha();
        var hFecha = vm.hFecha();
        loadContratos(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId));
    });
    vm.dFecha(moment().format('YYYY-MM-DD'));
    vm.hFecha(moment().format('YYYY-MM-DD'));

    //
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas(2);
    //
    $("#cmbTiposComerciales").select2(select2Spanish());
    loadTiposComerciales();
    //
    $("#cmbColaboradores").select2(select2Spanish());
    loadColaboradores(null);
    //
    $("#cmbContratos").select2(select2Spanish());


    $('#cmbTiposComerciales').change(function (e) {
        if (!e.added) return;
        loadColaboradores(parseInt(e.added.id));
    });


    $('#cmbDepartamentosTrabajo').change(function (e) {
        if (!e.added) return;
        var empresaId = vm.sempresaId()
        var departamentoId = e.added.id;
        var dFecha = vm.dFecha();
        var hFecha = vm.hFecha();
        loadContratos(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId));
    });


    $('#cmbEmpresas').change(function (e) {
        if (!e.added) return;
        var empresaId = e.added.id;
        var departamentoId = vm.sdepartamentoId();
        var dFecha = vm.dFecha();
        var hFecha = vm.hFecha();
        loadContratos(dFecha, hFecha, parseInt(departamentoId), parseInt(empresaId));
    });




    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function (err, data) {
        if (err) return;
        let datos = null;
        if (data) {
            initAutoCliente();
            vm.contratoId(gup('ContratoId'));
            vm.contratoInteresesId(gup('ContratoInteresesId'));
            vm.esAdicional(gup('esAdicional'));
            vm.empresaId(gup('EmpresaId'));
            vm.refPresupuestoAdicional(gup('refPresupuestoAdicional'));
            verb = "GET";
            var url = myconfig.apiUrl + "/api/contratos/obtiene/objeto/contrato/" + vm.contratoId();
            if(vm.esAdicional()) { 
                datos = {
                    contratoId: vm.contratoId(),
                    refPresupuestoAdicional: vm.refPresupuestoAdicional(),
                    contratoInteresesId: vm.contratoInteresesId()
                }
                url = myconfig.apiUrl + "/api/contratos/obtiene/objeto/contrato/adicional"
                verb = "POST";
            }
            llamadaAjax(verb, url, datos, function (err, data) {
                obtainReportJson(data);
                $('#selector').hide();
            });
        }
    });



    //
    $.validator.addMethod("notEqualTo", function (value, element, param) {
        if (value == "0") return false
        return true;
    });
}

function obtainKey() {
    llamadaAjax('GET', '/api/configuracion', null, function (err, data) {
        if (err) return;
        if (data) {
            //Stimulsoft.Base.StiLicense.key = data.sti_key_new
        }
    });
}


function obtainKeyNew() {
    llamadaAjax('GET', '/api/configuracion', null, function (err, data) {
        if(err) return;
        if(data) {
            Stimulsoft.Base.StiLicense.key = data.sti_key_new
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
    self.contratoId = ko.observable();
    self.contratoInteresesId = ko.observable();
    self.esAdicional = ko.observable();
    self.refPresupuestoAdicional = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
    self.observaciones = ko.observable();
    self.observacionesPago = ko.observable();
    //
    self.tipoComercialId = ko.observable();
    self.stipoComercialId = ko.observable();
    //
    self.posiblesTiposComerciales = ko.observableArray([]);
    self.elegidosTiposComerciales = ko.observableArray([]);
    //
};




function datosOK() {
    $('#frmRptContratos').validate({
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
    var opciones = $("#frmRptContratos").validate().settings;
    return $('#frmRptContratos').valid();
}

function loadEmpresas(empresaId) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: null, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        vm.sempresaId(empresaId);
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

    var tipoComercialId = e;
    url = "/api/comerciales/colaboradores/por/tipo/" + tipoComercialId

    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
        var colaboradores = [{ comercialId: 0, nombre: "" }].concat(data);
        vm.posiblesColaboradores(colaboradores);
        $("#cmbColaboradores").val([0]).trigger('change');
    });
}

function loadContratos(dFecha, hFecha, departamentoId, empresaId) {

    var url = myconfig.apiUrl + "/api/contratos/recupera/todos/" + dFecha + "/" + hFecha + "/" + departamentoId + "/" + empresaId;

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
    if (!datosOK()) return;
    //si no hay cliente en el campo de texto el cliente es 0
    var c = $('#txtCliente').val();
    if (c == '') {
        vm.sclienteId(null);
    }
    var tipoComercialId = vm.stipoComercialId();
    var comercialId = vm.scomercialId();
    var clienteId = vm.sclienteId();
    var departamentoId = vm.sdepartamentoId();
    var empresaId = vm.sempresaId();
    var contratoId = vm.scontratoId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();



    if (!clienteId) clienteId = 0;
    if (!comercialId) comercialId = 0;
    if (!tipoComercialId) tipoComercialId = 0;
    if (!departamentoId) departamentoId = 0;
    if (!empresaId) empresaId = 0;
    if (!contratoId) contratoId = 0;



    var url = "/api/contratos/obtiene/objeto/contrato/" + vm.contratoId();
    url += "/" + empresaId;
    url += "/" + clienteId;
    url += "/" + departamentoId;
    url += "/" + tipoComercialId;
    url += "/" + comercialId;
    url += "/" + contratoId;
    url += "/" + usuario.usuarioId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
        if (data) {
            obtainReportJson(data)
        } else {
            alert("No hay registros con estas condiciones");
        }

    });
}


function obtainReportJson(obj) {

    let file = null
    if(vm.empresaId() == 2 && vm.contratoId()) file = "/reports/contrato_proas.mrt";
    if(vm.empresaId() == 7  && vm.contratoId()) file = "/reports/contrato_reabita2.mrt";
    if(vm.esAdicional()) file = "/reports/contrato_proas_adicional.mrt";
    const report = new Stimulsoft.Report.StiReport();

    if(!file) {
        mensError("No se ha encontrado el archivo de informe para esta empresa");
        return;
    }

    // Cargar el reporte desde archivo .mrt
    report.loadFile(file);

    // Crear DataSet y registrar
    const dataSet = new Stimulsoft.System.Data.DataSet("datos_contrato");
    dataSet.readJson(obj);

    report.dictionary.databases.clear();
    report.regData(dataSet.dataSetName, "", dataSet);
    report.dictionary.synchronize();

    // Habilitar HTML en todos los textos
    report.pages.list.forEach(page => {
        page.components.list.forEach(component => {
            if (component instanceof Stimulsoft.Report.Components.StiText) {
                component.allowHtml = true;
            }
        });
    });

    //report.renderAsync();
    // Asignar y renderizar
    viewer.report = report;

/* const jsonString = JSON.stringify(obj, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'datosReporte.json';
  link.click(); */
}

