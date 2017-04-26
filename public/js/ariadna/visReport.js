var rptOfertaParametros = function (sql) {
    var ofertaId = gup('ofertaId');
    var clienteId = gup('clienteId');
    var empresaId = gup('empresaId');
    var dFecha = gup('dFecha');
    var hFecha = gup('hFecha');
    sql += " WHERE TRUE"
    if (ofertaId != "") {
        sql += " AND o.ofertaId IN (" + ofertaId + ")";
    } else {
        if (clienteId != "") {
            sql += " AND o.clienteId IN (" + clienteId + ")";
        }
        if (empresaId != "") {
            sql += " AND o.empresaId IN (" + empresaId + ")";
        }
        if (dFecha != "") {
            sql += " AND o.fechaOferta >= '" + dFecha + "'";
        }
        if (hFecha != "") {
            sql += " AND o.fechaOferta <= '" + hFecha + "'";
        }

    }
    return sql;
}


StiOptions.WebServer.url = "/api/streport";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);
// Create the report viewer with default options
var viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
var options = new Stimulsoft.Viewer.StiViewerOptions();
options.appearance.scrollbarsMode = true;
options.appearance.fullScreenMode = true;
options.toolbar.showSendEmailButton = true;
var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
viewer.onEmailReport = function (event) {
    console.log('EMAIL REPORT');
}
// Create a new report instance
var report = new Stimulsoft.Report.StiReport();
// Load report from url
//report.loadFile("../reports/SimpleList.mrt");
var rpt = gup("report");
var file = "../reports/" + rpt + ".mrt";
report.loadFile(file);
//report.setVariable("vTest", "11,16,18");
//var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
var connectionString = "Server=" + myconfig.report.host + ";";
connectionString += "Database=" + myconfig.report.database + ";"
connectionString += "UserId=" + myconfig.report.user + ";"
connectionString += "Pwd=" + myconfig.report.password + ";";
report.dictionary.databases.list[0].connectionString = connectionString;
var sql = report.dataSources.items[0].sqlCommand;

report.dataSources.items[0].sqlCommand = rptOfertaParametros(sql);
// Assign report to the viewer, the report will be built automatically after rendering the viewer
viewer.report = report;

