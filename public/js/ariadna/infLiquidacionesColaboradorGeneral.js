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
    // de smart admin
    //pageSetUp();
    getVersionFooter();
    datePickerSpanish();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $("#btnImprimir").click(obtainReport);
    // avoid form submmit
    $("#frmRptLiquidaciones").submit(function () {
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
        
    });
    
    //
    $("#cmbColaboradores").select2(select2Spanish());
    loadColaboradores();
    initAutoCliente();
    // verificamos si nos han llamado directamente
    //     if (id) $('#selector').hide();
  
        
        if (gup("tipoComercialId") != "0"){
            vm.tipoComercialId(gup("tipoComercialId"))
        }
        if (gup("contratoId") != "0"){
            vm.contratoId(gup("contratoId"))
        }
        vm.contratoId(gup('contratoId'));
        vm.comercialId(gup('comercialId'));
        obtainReport();
        $('#selector').hide();
    
}


function obtainKey() {
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
    self.tipoComercialId = ko.observable();
    self.contratoId = ko.observable();
    //
    self.comercialId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesColaboradores = ko.observableArray([]);
    self.elegidosColaboradores = ko.observableArray([]);
    //
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
};

var obtainReport = function () {
    var file = "../reports/liquidacion_general.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(file);
    //report.setVariable("vTest", "11,16,18");
    //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
    var connectionString = "Server=" + myconfig.report.host + ";";
    connectionString += "Database=" + myconfig.report.database + ";"
    connectionString += "UserId=" + myconfig.report.user + ";"
    connectionString += "Pwd=" + myconfig.report.password + ";";
    report.dictionary.databases.list[0].connectionString = connectionString;
    //var sql = report.dataSources.list[0].sqlCommand;

    report.dataSources.list[0].sqlCommand = rptLiquidacionGeneralParametros();
    // Assign report to the viewer, the report will be built automatically after rendering the viewer
    viewer.report = report;
}

var obtainReportPdf = function () {
    var file = "../reports/factura_general.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    verb = "GET";
    url = myconfig.apiUrl + "/api/empresas/" + vm.sempresaId();
    llamadaAjax(verb, url, null, function (err, data) {
        var infFacturas = data.infFacturas;
        file = "../reports/" + infFacturas + ".mrt";
        file = "../reports/SimpleList.mrt";
        report.loadFile(file);
        //report.setVariable("vTest", "11,16,18");
        //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
        /*
        var connectionString = "Server=" + myconfig.report.host + ";";
        connectionString += "Database=" + myconfig.report.database + ";"
        connectionString += "UserId=" + myconfig.report.user + ";"
        connectionString += "Pwd=" + myconfig.report.password + ";";
        report.dictionary.databases.list[0].connectionString = connectionString;
        var sql = report.dataSources.list[0].sqlCommand;
 
        report.dataSources.list[0].sqlCommand = rptLiquidacionGeneralParametros(sql);
        */
        // Render report
        report.dictionary.databases.clear();
        var dataSet = new Stimulsoft.System.Data.DataSet("Demo");
        dataSet.readJsonFile("../reports/Demo.json");
        report.dictionary.databases.clear();
        report.regData("Demo", "Demo", dataSet);
        report.render();
        //viewer.report = report;
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
    $('#frmRptLiquidaciones').validate({
        rules: {

        },
        // Messages for form validation
        messages: {
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmRptLiquidaciones").validate().settings;
    return $('#frmRptLiquidaciones').valid();
}

function loadColaboradores(comercialId) {
    llamadaAjax("GET", "/api/comerciales/activos", null, function (err, data) {
        if (err) return;
        var colaboradores = [{ comercialId: 0, nombre: "" }].concat(data);
        vm.posiblesColaboradores(colaboradores);
        $("#cmbColaboradores").val([comercialId]).trigger('change');
    });
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

var rptLiquidacionGeneralParametros = function () {
    var comercialId = vm.comercialId();
    if(comercialId == "undefined") comercialId = 0;
    comercialId = parseInt(comercialId);


    var contratoId = vm.contratoId()
    if(contratoId == "undefined") contratoId = 0;
    contratoId = parseInt(contratoId);
    
    sql = "SELECT lf.comercialId, c.nombre, tc.nombre AS tipo, SUM(lf.impCliente) AS totFactura, ";
    sql += " SUM(lf.base) AS totBase, SUM(lf.comision) + SUM(lf.comision2) AS totComision";
    sql += " FROM liquidacion_comercial AS lf";
    
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId";
    sql += "  WHERE lf.facturaId IS NULL";
    if (comercialId > 0) {
        sql += " AND lf.comercialId IN (" + comercialId + ")";
    }
    if(contratoId > 0) {
        sql += "  AND lf.contratoId = "+contratoId;
    }
   sql += " GROUP BY lf.comercialId";
    return sql;
}

