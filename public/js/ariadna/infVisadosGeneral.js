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
var visadas;
// License Key

// Create the report viewer with default options
var viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
var options = new Stimulsoft.Viewer.StiViewerOptions();
StiOptions.WebServer.url = "/api/streport";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);
Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHltN9ZO4D78QwpEoh6+UpBm5mrGyhSAIsuWoljPQdUv6R6vgv" +
    "iStsx8W3jirJvfPH27oRYrC2WIPEmaoAZTNtqb+nDxUpJlSmG62eA46oRJDV8kJ2cJSEx19GMJXYgZvv7yQT9aJHYa" +
    "SrTVD7wdhpNVS1nQC3OtisVd7MQNQeM40GJxcZpyZDPfvld8mK6VX0RTPJsQZ7UcCEH4Y3LaKzA5DmUS+mwSnjXz/J" +
    "Fv1uO2JNkfcioieXfYfTaBIgZlKecarCS5vBgMrXly3m5kw+YwpJ2v+cMXuDk3UrZgrdxNnOhg8ZHPg9ijHxqUomZZ" +
    "BzKpVQU0d06ne60j/liMH5KirAI2JCVfBcBvIcyliJos8LAWr9q/1sPR9y7LmA1eyS1/dXaxmEaqi5ubhLqlf+OS0x" +
    "FX6tlBBgegqHlIj6Fytwvq5YlGAZ0Cra05JhnKh/ohYlADQz6Jbg5sOKyn5EbejvPS3tWr0LRBH2FO6+mJaSEAwzGm" +
    "oWT057ScSvGgQmfx8wCqSF+PgK/zTzjy75Oh";

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
    
    //
    $("#btnImprimir").click(obtainReport);
    // avoid form submmit
    $("#frmRptVisados").submit(function () {
        return false;
    });
    
    visadas = gup('visadas');

    obtainJSON();
}



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
    //var sql = report.dataSources.items[0].sqlCommand;

    report.dataSources.items[0].sqlCommand = rptLiquidacionGeneralParametros();
    // Assign report to the viewer, the report will be built automatically after rendering the viewer
    viewer.report = report;
}

var obtainJSON = function() {
    var url = myconfig.apiUrl + "/api/facturasProveedores/visadas/facturas-proveedor/informe/detalle" + visadas;
    llamadaAjax("GET", url, null, function(err, data){
        if (err) return;
        obtainReport();
    });
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
        var sql = report.dataSources.items[0].sqlCommand;
 
        report.dataSources.items[0].sqlCommand = rptLiquidacionGeneralParametros(sql);
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
    sql = "SELECT emp.nombre, f.*, f.numeroFacturaProveedor AS vNum , fp.nombre AS formaPago, cnt.direccion AS dirTrabajo,";
    sql += " ser.*, ser.contratoId, SUM(ser.importe) AS CR, SUM(f.total) AS IMF, DATE_FORMAT(f.fecha, '%d%/%m/%y') AS fechaR";
    sql += " FROM facprove AS f";
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
    sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
    sql += " LEFT JOIN facprove_serviciados AS ser ON ser.facproveId = f.facproveId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId";
    sql += " WHERE visada = " + visadas;
    sql += " GROUP BY ser.contratoId";
    sql += " ORDER BY ser.contratoId, ser.facproveId";
    return sql;
}

