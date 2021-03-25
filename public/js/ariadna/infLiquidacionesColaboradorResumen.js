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
    usuario = recuperarIdUsuario();
    // de smart admin
    //pageSetUp();
    getVersionFooter();
    datePickerSpanish();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#btnImprimir').prop('disabled', false);
    $("#btnImprimir").click(rptLiquidacionGeneralParametrosJson);
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
        vm.dFecha(start.format('YYYY-MM-DD'));
        vm.hFecha(end.format('YYYY-MM-DD'));
    });
    vm.dFecha(moment().format('YYYY-MM-DD'));
    vm.hFecha(moment().format('YYYY-MM-DD'));

    //
    $("#cmbColaboradores").select2(select2Spanish());
    
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
    //Recuperamos el departamento de trabajo
   /*  recuperaDepartamento(function(err, data) {
        if(err) return;
        
    }); */
    //
    $("#cmbTiposComerciales").select2(select2Spanish());
    loadTiposComerciales();

    $('#cmbTiposComerciales').change(function(e) {
        if(!e.added) return;
        loadColaboradores(e.added);
    });

    // verificamos si nos han llamado directamente
    //     if (id) $('#selector').hide();
    if (gup('dFecha') != "" && gup('hFecha') != "") {
        vm.dFecha(gup('dFecha'));
        vm.hFecha(gup('hFecha'));
        vm.scomercialId(gup('comercialId'));
        obtainReport();
        $('#selector').hide();
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
    self.facturaId = ko.observable();
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    //
    self.comercialId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesColaboradores = ko.observableArray([]);
    self.elegidosColaboradores = ko.observableArray([]);
    //
    //self.departamentoId = ko.observable();
    //self.sdepartamentoId = ko.observable();
    //
    //self.posiblesDepartamentos = ko.observableArray([]);
    //self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.tipoComerciallId = ko.observable();
    self.stipoComercialId = ko.observable();
    //
    self.posiblesTiposComerciales = ko.observableArray([]);
    self.elegidosTiposComerciales = ko.observableArray([]);
    //    
};

var obtainReport = function () {
    if (!datosOK()) return;
    var file;
    var tipoColaborador = vm.stipoComercialId();
    if(tipoColaborador != 1) {
        file = "../reports/liquidacion_colaborador_resumen.mrt";
    } 

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

function datosOK() {
    $('#frmRptLiquidaciones').validate({
        rules: {
            cmbTiposComerciales: {required : true}

        },
        // Messages for form validation
        messages: {
            cmbTiposComerciales: {required : "Deve introducir un tipo de comercial"}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmRptLiquidaciones").validate().settings;
    return $('#frmRptLiquidaciones').valid();
}

function loadColaboradores(e) {
    if(e) {
        var tipoComercialId = e.id;
            llamadaAjax("GET", "/api/comerciales/colaboradores/activos/por/tipo/" + tipoComercialId, null, function (err, data) {
                if (err) return;
                var colaboradores = [{ comercialId: 0, nombre: "" }].concat(data);
                vm.posiblesColaboradores(colaboradores);
                $("#cmbColaboradores").val([0]).trigger('change');
            });
    }
}


/*function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: 0, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}*/

function loadTiposComerciales(tipoComercialId) {
    llamadaAjax("GET", "/api/tipos_comerciales", null, function (err, data) {
        if (err) return;
        var tipos = data;
        vm.posiblesTiposComerciales(tipos);
        $("#cmbTiposComerciales").val([tipoComercialId]).trigger('change');
    });
}


var obtainReportJson = function (obj) {
    var tipoColaborador = vm.stipoComercialId();
    if(tipoColaborador != 1) {
        file = "../reports/liquidacion_colaborador_resumen.mrt";
    } else {
        file = "../reports/liquidacion_agente_resumen.mrt";
    }

    var report = new Stimulsoft.Report.StiReport();
        
        
    report.loadFile(file);

    var dataSet = new Stimulsoft.System.Data.DataSet("liq_col");
    dataSet.readJson(obj);
    
     // Remove all connections from the report template
     report.dictionary.databases.clear();

     //
    report.regData(dataSet.dataSetName, "", dataSet);
    report.dictionary.synchronize();

    viewer.report = report;

};

var rptLiquidacionGeneralParametrosJson = function () {
    var comercialId = vm.scomercialId();
    var tipoComercialId = vm.stipoComercialId();
    var departamentoId = 0
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

    if(tipoComercialId != 1) {
        obtainReport();
        return;
    }

    var url = myconfig.apiUrl + "/api/liquidaciones/colaborador/informe/crea/json/" + dFecha +"/" + hFecha +  "/" + comercialId + "/" + tipoComercialId + "/" + departamentoId + "/" + usuario;
    $('#btnImprimir').prop('disabled', true);
    mensNormal('Espere mientras se procesa el resultado...tardará unos segundos');
    llamadaAjax("POST", url, null, function (err, data) {
        if(err) return;
        if(data) {
            $('#btnImprimir').prop('disabled', false);
            obtainReportJson(data);
        } else {
            $('#btnImprimir').prop('disabled', false);
            alert("No hay registros con estas condiciones");
        }
    });
   
    
}

var rptLiquidacionGeneralParametros = function () {
    var sql= "";
    var comercialId = vm.scomercialId();
    var tipoComercialId = vm.stipoComercialId();
    var departamentoId = 0;
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();
    
  /*   if(departamentoId !=7 && departamentoId > 0) {
        sql = "SELECT";
        sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
        sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
        sql += " com.comercialId,";
        sql += " com.nombre AS nomComercial,";
        sql += " tpp.nombre AS tipoProyecto,";
        sql += " cli.nombre AS nomCliente,";
        sql += " cnt.direccion,"
        sql += " cnt.referencia,";
        sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
        sql += " fac.numero,";
        sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
        sql += " fac.facturaId,";
        sql += " fac.fecha,";
        sql += " fac.serie,";
        sql += " fac.ano,";
        sql += " liq.impCliente,";
        sql += " liq.base As baseCalculo,";
        sql += " liq.porComer, ";
        sql += " liq.comision,";
        sql += " tpm.nombre AS departamento,";
        sql += " tpc.nombre AS tipoColaborador, ";
        sql += "  DATE_FORMAT(cnt.fechaFinal, '%Y-%m-%d') AS fechaFinal";
        sql += " FROM liquidacion_comercial AS liq";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
        sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = liq.contratoId";
        sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cnt.clienteId";
        sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
        sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
        sql += " LEFT JOIN tipos_proyecto AS tpp ON tpp.tipoProyectoId = cnt.tipoProyectoId";
        if(tipoComercialId != 1) {
            sql += " WHERE cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
        } else {
            sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
        }
        if (comercialId) {
            sql += " AND liq.comercialId IN (" + comercialId + ")";
        }
        if (tipoComercialId) {
            sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
        }
        if (departamentoId && departamentoId > 0) {
            sql += " AND cnt.tipoContratoId = " + departamentoId;
        }else {
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+")"
        }
    }
    else if(departamentoId == 7)  {
        sql = "SELECT";
        sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
        sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,"
        sql += " com.comercialId,"; 
        sql += " com.nombre AS nomComercial,";
        sql += " '' AS tipoProyecto,";
        sql += " cli.nombre AS nomCliente,";
        sql += " '' AS direccion,";
        sql += " '' AS referencia,";
        sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
        sql += " fac.numero,";
        sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
        sql += " fac.facturaId,"
        sql += " fac.fecha,";
        sql += " fac.serie,";
        sql += " fac.ano,";
        sql += " liq.impCliente,";
        sql += " liq.base As baseCalculo,";
        sql += " liq.porComer, ";
        sql += " liq.comision,";
        sql += " tpm.nombre AS departamento,";
        sql += " tpc.nombre AS tipoColaborador,";
        sql += " NULL AS fechaFinal ";
        sql += " FROM liquidacion_comercial AS liq ";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
        sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
        sql += " LEFT JOIN clientes AS cli ON cli.clienteId = fac.clienteId";
        sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = fac.departamentoId";
        sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
        sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
        if (comercialId) {
            sql += " AND liq.comercialId IN (" + comercialId + ")";
        }
        if (tipoComercialId) {
            sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
        }
        sql += " AND fac.departamentoId = 7";
    } */
    
        sql = "SELECT";
        sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
        sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
        sql += " com.comercialId,";
        sql += " com.nombre AS nomComercial,";
        sql += " tpp.nombre AS tipoProyecto,";
        sql += " cli.nombre AS nomCliente,";
        sql += " cnt.direccion,"
        sql += " cnt.referencia,";
        sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
        sql += " fac.numero,";
        sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
        sql += " fac.facturaId,";
        sql += " fac.fecha,";
        sql += " fac.serie,";
        sql += " fac.ano,";
        sql += " liq.impCliente,";
        sql += " liq.base As baseCalculo,";
        sql += " liq.porComer, ";
        sql += " liq.comision,";
        sql += " tpm.nombre AS departamento,";
        sql += " tpc.nombre AS tipoColaborador, ";
        sql += "  DATE_FORMAT(cnt.fechaFinal, '%Y-%m-%d') AS fechaFinal";
        sql += " FROM liquidacion_comercial AS liq";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
        sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = liq.contratoId";
        sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cnt.clienteId";
        sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
        sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
        sql += " LEFT JOIN tipos_proyecto AS tpp ON tpp.tipoProyectoId = cnt.tipoProyectoId";
        if(tipoComercialId != 1) {
            sql += " WHERE cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
        } else {
            sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
        }
        if (comercialId) {
            sql += " AND liq.comercialId IN (" + comercialId + ")";
        }
        if (tipoComercialId) {
            sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
        }
        sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+")"

        sql += " UNION";

        sql += " SELECT";
        sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
        sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,"
        sql += " "
        sql += " com.comercialId,"; 
        sql += " com.nombre AS nomComercial,";
        sql += " '' AS tipoProyecto,";
        sql += " cli.nombre AS nomCliente,";
        sql += " '' AS direccion,";
        sql += " '' AS referencia,";
        sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
        sql += " fac.numero,";
        sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
        sql += " fac.facturaId,"
        sql += " fac.fecha,";
        sql += " fac.serie,";
        sql += " fac.ano,";
        sql += " liq.impCliente,";
        sql += " liq.base As baseCalculo,";
        sql += " liq.porComer, ";
        sql += " liq.comision,";
        sql += " tpm.nombre AS departamento,";
        sql += " tpc.nombre AS tipoColaborador,";
        sql += " NULL AS fechaFinal ";
        sql += " FROM liquidacion_comercial AS liq ";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
        sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
        sql += " LEFT JOIN clientes AS cli ON cli.clienteId = fac.clienteId";
        sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = fac.departamentoId";
        sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
        sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
        if (comercialId) {
            sql += " AND liq.comercialId IN (" + comercialId + ")";
        }
        if (tipoComercialId) {
            sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
        }
        sql += " AND fac.departamentoId = 7";

    
    return sql;
}

