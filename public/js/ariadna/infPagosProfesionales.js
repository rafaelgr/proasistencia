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
    usuario = recuperarIdUsuario();
    getVersionFooter();
    
    
    $.validator.addMethod("greaterThan",
    function (value, element, params) {
        var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
        var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
        if (!/Invalid|NaN/.test(new Date(fv))) {
            return new Date(fv) >= new Date(fp);
        } else {
            // esto es debido a que permitimos que la segunda fecha nula
            return true;
        }
    }, 'La fecha final debe ser mayor que la inicial.');

   
    
    vm = new admData();
    ko.applyBindings(vm);
    //
    $("#btnBuscar").click(rptFacturaParametros);
    // avoid form submmit
    $("#frmRptOfertas").submit(function () {
        return false;
    });
    $("#frmExportar").submit(function () {
        return false;
    });
    
    //
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    
    $('.datepicker').datepicker({
        closeText: 'Cerrar',
        prevText: '<i class="fa fa-chevron-left"></i>',
        nextText: '<i class="fa fa-chevron-right"></i>',
        currentText: 'Hoy',
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    }   
    );

    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
    });

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());

    
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
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);

    //
     self.departamentoId = ko.observable();
     self.sdepartamentoId = ko.observable();
     //
     self.posiblesDepartamentos = ko.observableArray([]);
     self.elegidosDepartamentos = ko.observableArray([]);

};

var obtainReport = function () {
    if (!datosOK()) return;
    var file = "../reports/pago_profesionales.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    
        
        report.loadFile(file);
        //report.setVariable("vTest", "11,16,18");
        //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
        var connectionString = "Server=" + myconfig.report.host + ";";
        connectionString += "Database=" + myconfig.report.database + ";"
        connectionString += "UserId=" + myconfig.report.user + ";"
        connectionString += "Pwd=" + myconfig.report.password + ";";
      
        var pos = 0;
        for (var i = 0; i < report.dataSources.items.length; i++) {
            var str = report.dataSources.items[i].sqlCommand;
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

};

var obtainReportJson = function (obj) {
        var file = "../reports/pago_profesionales.mrt";
        var report = new Stimulsoft.Report.StiReport();
            
            
        report.loadFile(file);

        var dataSet = new Stimulsoft.System.Data.DataSet("liq_ant");
        dataSet.readJson(obj);
        
         // Remove all connections from the report template
         report.dictionary.databases.clear();
    
         //
        report.regData(dataSet.dataSetName, "", dataSet);
        report.dictionary.synchronize();

        viewer.report = report;

};

var obtainReportPdf = function () {
    var file = "../reports/pago_profesionales.mrt";
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
       
        var pos = 0;
        for (var i = 0; i < report.dataSources.items.length; i++) {
            var str = report.dataSources.items[i].sqlCommand;
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
            txtDesdeFecha:{
                required: true
            },
            txtHastaFecha: {
                required:true,
                greaterThan: "#txtDesdeFecha"
            },
        
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            txtDesdeFecha:{
                required: "Debe elegir una fecha"
            },
            txtHastaFecha: {
                required: "Debe elegir una fecha"
            },
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
        var empresas =data;
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
    });
}

// ----------- Funciones relacionadas con el manejo de autocomplete

var rptFacturaParametros = function () {
    if(!datosOK()) return;
    var empresaId = vm.sempresaId();
    //var departamentoId = vm.sdepartamentoId();
    var dFecha = moment(vm.dFecha(), "DD/MM/YYYY").format('YYYY-MM-DD');
    var hFecha = moment(vm.hFecha(), "DD/MM/YYYY").format('YYYY-MM-DD');
  
    var url = myconfig.apiUrl + "/api/partes/facturas/listado/pagos/profesionales/crea/json/" + dFecha +"/" + hFecha +  "/" + empresaId

    llamadaAjax("POST", url, null, function (err, data) {
        if(err) return;
        if(data.libPro.length > 0) {
            obtainReportJson(data)
        } else {
            alert("No hay registros con estas condiciones");
        }
    });
}

