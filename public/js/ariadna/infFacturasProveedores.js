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
// License Key

// Create the report viewer with default options
var viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
var options = new Stimulsoft.Viewer.StiViewerOptions();
StiOptions.WebServer.url = "/api/streport";
//StiOptions.WebServer.url = "http://localhost:9615";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);

obtainKey();//obtiene la clave de usuario de stimulsoft de lña configuracion

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
    $("#btnImprimir").click(obtainReport);
    // avoid form submmit
    $("#frmRptOfertas").submit(function () {
        return false;
    });
    $("#frmExportar").submit(function () {
        return false;
    });
    $("#btnExportar").click(exportarPDF);
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

    $("#cmbProveedores").select2(select2Spanish());
    loadProveedores();

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
        
    });

    $('#cmbDepartamentosTrabajo').select2().on('change', function (e) {
        if (e.added) cambioDepartamento(e.added.id);
    });

    // verificamos si nos han llamado directamente
    //     if (id) $('#selector').hide();
    if (gup('facproveId') != "") {
        vm.facproveId(gup('facproveId'));
        verb = "GET";
        var url = myconfig.apiUrl + "/api/facturasProveedores/" + vm.facproveId();
        llamadaAjax(verb, url, null, function (err, data) {
            vm.sempresaId(data.empresaId);
            obtainReport();
            $('#selector').hide();
        });
    }
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
    self.facproveId = ko.observable();
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
};

var obtainReport = function () {
    if (!datosOK()) return;
    var file = "../reports/prefactpro_reparaciones.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    verb = "GET";
    url = myconfig.apiUrl + "/api/empresas/" + vm.sempresaId();
    llamadaAjax(verb, url, null, function (err, data) {
        
        var rpt = gup("report");
        report.loadFile(file);
        //report.setVariable("vTest", "11,16,18");
        //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
        var connectionString = "Server=" + myconfig.report.host + ";";
        connectionString += "Database=" + myconfig.report.database + ";"
        connectionString += "UserId=" + myconfig.report.user + ";"
        connectionString += "Pwd=" + myconfig.report.password + ";";
        // obtener el indice de los sql que contiene el informe que trata 
        // la cabecera ('pf.facproveId')
        var pos = 0;
        for (var i = 0; i < report.dataSources.items.length; i++) {
            var str = report.dataSources.items[i].sqlCommand;
            if (str.indexOf("pf.facproveId") > -1) pos = i;
        }
        var sql = report.dataSources.items[pos].sqlCommand;
        var sql2 = rptFacturaParametros(sql);
        verb = "POST"; 
        url = myconfig.apiUrl + "/api/informes/sql";
        llamadaAjax(verb, url, {"sql":sql2}, function(err, data){
            if (err) return;
            if (data) {
                report.dataSources.items[pos].sqlCommand = sql2;
                // Assign report to the viewer, the report will be built automatically after rendering the viewer
                viewer.report = report;
            } else {
                alert("No hay registros con estas condiciones");
            }
        })
    });

};

var obtainReportPdf = function () {
    var file = "../reports/factura_general.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    verb = "GET";
    url = myconfig.apiUrl + "/api/empresas/" + vm.sempresaId();
    llamadaAjax(verb, url, null, function (err, data) {
        var infFacturas = data.infFacturas;
        file = "../reports/" + infFacturas + ".mrt";
        report.loadFile(file);

        var connectionString = "Server=" + myconfig.report.host + ";";
        connectionString += "Database=" + myconfig.report.database + ";"
        connectionString += "UserId=" + myconfig.report.user + ";"
        connectionString += "Pwd=" + myconfig.report.password + ";";
        report.dictionary.databases.list[0].connectionString = connectionString;
        // obtener el indice de los sql que contiene el informe que trata 
        // la cabecera ('pf.facproveId')
        var pos = 0;
        for (var i = 0; i < report.dataSources.items.length; i++) {
            var str = report.dataSources.items[i].sqlCommand;
            if (str.indexOf("pf.facproveId") > -1) pos = i;
        }
        var sql = report.dataSources.items[pos].sqlCommand;
        report.dataSources.items[pos].sqlCommand = rptFacturaParametros(sql);
        // Render report
        report.render();
        // Create an PDF settings instance. You can change export settings.
        var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
        // Create an PDF service instance.
        var service = new Stimulsoft.Report.Export.StiPdfExportService();

        // Create a MemoryStream object.
        var stream = new Stimulsoft.System.IO.MemoryStream();
        // Export PDF using MemoryStream.
        service.exportToAsync(function () {
            // Get PDF data from MemoryStream object
            var data = stream.toArray();
            // Get report file name
            var fileName = String.isNullOrEmpty(report.reportAlias) ? report.reportName : report.reportAlias;
            // Save data to file
            Object.saveAs(data, fileName + ".pdf", "application/pdf")
        }, report, stream, settings);
    });

};

var printReport = function (url) {
    $("#reportArea").attr('src', url);
};

function datosOK() {
    $('#frmRptOfertas').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbDepartamentosTrabajo: {
                required: true
            },
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            cmbDepartamentosTrabajo: {
                required: "Debe elegir un departamento"
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

function loadProveedores(proveedorId) {
    llamadaAjax("GET", "/api/proveedores", null, function (err, data) {
        if (err) return;
        var proveedores = [{ comercialId: 0, nombre: "" }].concat(data);
        vm.posiblesProveedores(proveedores);
        $("#cmbProveedores").val([proveedorId]).trigger('change');
    });
}

function cambioDepartamento(id) {
    if(id == 7) {
        $('#btnImprimir').show();
    } else {
        $('#btnImprimir').hide();
    }
}

var rptFacturaParametros = function (sql) {
    var facproveId = vm.facproveId();
    var proveedorId = vm.sproveedorId();
    var departamentoId = vm.sdepartamentoId();
    var empresaId = vm.sempresaId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();
    sql += " WHERE TRUE"
    if (facproveId) {
        sql += " AND pf.facproveId IN (" + facproveId + ")";
    } else {
        if (proveedorId) {
            sql += " AND pf.proveedorId IN (" + proveedorId + ")";
        }
        if (empresaId) {
            sql += " AND pf.empresaId IN (" + empresaId + ")";
        }
        if (dFecha) {
            sql += " AND pf.fecha >= '" + dFecha + " 00:00:00'";
        }
        if (hFecha) {
            sql += " AND pf.fecha <= '" + hFecha + " 23:59:59'";
        }
        if(departamentoId && departamentoId > 0) {
            sql += " AND pf.departamentoId =" + departamentoId;
        } else {
            sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario.usuarioId+")"
        }

    }
    return sql;
}

var exportarPDF = function () {
    $("#mensajeExportacion").hide();
    $("#mensajeEspera").show();
    var proveedorId = vm.sproveedorId();
    var empresaId = vm.sempresaId();
    var departamentoId = vm.sdepartamentoId();

    if (!empresaId) empresaId = 0;
    if (!proveedorId) proveedorId = 0;
    if (!departamentoId) departamentoId = 0;


    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

    // (1) Obtener una lista de las facturas implicadas.
    // la lista debe devolver también el fichero de informe asociado
    var url = "/api/facturasProveedores/facpdf/" + dFecha + "/" + hFecha;
    url += "/" + empresaId;
    url += "/" + proveedorId;
    url += "/" + departamentoId;
    url += "/" + usuario.usuarioId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) {
            // hay que informar de error durante la exportación
            return;
        }
        $("#mensajeEspera").hide();
        $("#mensajeExportacion").show();
        $('#modalExportar').modal('hide');
        var mens = "Los ficheros pdf con las facturas se encuentran en el directorio de descargas.";
        mensNormal(mens);
    });
}