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
    // de smart admin
    //pageSetUp();
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
    $("#btnBuscar").click(obtainReport);
    // avoid form submmit
    $("#frmRptOfertas").submit(function () {
        return false;
    });
    $("#frmExportar").submit(function () {
        return false;
    });
    $("#btnExportar").click(exportarPDF);
    //
    
    
    //
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    $("#cmbProveedores").select2(select2Spanish());
    loadProveedores();

    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();

    $('#cmbConta').select2();
    loadComboEstado();

    $('#cmbOrden').select2();
    loadComboOrden();
    
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

   
    //datePickerSpanish(); // see comun.js


    //
    // $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
    //Recuperamos el departamento de trabajo
    /*recuperaDepartamento(function(err, data) {
        if(err) return;
        
    });*/
    //
    // verificamos si nos han llamado directamente
    //     if (id) $('#selector').hide();
    
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
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
    //
    // self.departamentoId = ko.observable();
    // self.sdepartamentoId = ko.observable();
    // //
    // self.posiblesDepartamentos = ko.observableArray([]);
    // self.elegidosDepartamentos = ko.observableArray([]);

    self.tipoIvaId = ko.observable();
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);

    //Combo option conta

    self.optionsConta = ko.observableArray([
        {
            'nombreConta': 'Todas',
            'valorConta': 'todas'
        }, 
        {
            'nombreConta': 'Sin contabilizar',
            'valorConta': 'sinConta'
        }, 
        {
            'nombreConta': 'contabilizadas',
            'valorConta': 'conta'
        }
    ]);
    self.selectedContas = ko.observableArray([]);
    self.sconta = ko.observable();

    //Combo option orden 

    self.optionsOrden = ko.observableArray([
        {
            'nombreOrden': 'Numero Registro',
            'valorOrden': 'numregisconta'
        }, 
        {
            'nombreOrden': 'Fecha Recepcion',
            'valorOrden': 'fecha_recepcion'
        }, 
        {
            'nombreOrden': 'Referencia',
            'valorOrden': 'ref'
        }
    ]);
    self.selectedOrden = ko.observableArray([]);
    self.sorden = ko.observable();
};

var obtainReport = function () {
    if (!datosOK()) return;
    var file = "../reports/libro_facturas_proveedores.mrt";
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

var obtainReportPdf = function () {
    var file = "../reports/libro_facturas_proveedores.mrt";
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
            txtHastaFecha: {
                greaterThan: "#txtDesdeFecha"
            },
        
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
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
        var empresas =data;
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
    });
}


/*function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: 0, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}*/

function loadProveedores(proveedorId) {
    llamadaAjax("GET", "/api/proveedores", null, function (err, data) {
        if (err) return;
        var proveedores = [{ proveedorId: 0, nombre: "" }].concat(data);
        vm.posiblesProveedores(proveedores);
        $("#cmbProveedores").val([proveedorId]).trigger('change');
    });
}

function loadTiposIva(id) {
    llamadaAjax("GET", "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([0]).trigger('change');
        }
    });
}

function loadComboEstado(){
    $("#cmbConta option[value='todas']").attr("selected",true).trigger('change');    
}

function loadComboOrden(){
    $("#cmbOrden option[value='numregisconta']").attr("selected",true).trigger('change');    
}


var rptFacturaParametros = function (sql) {


    var proveedorId = vm.sproveedorId();
  
    var empresaId = vm.sempresaId();
    var dFecha = moment(vm.dFecha(), "DD/MM/YYYY").format('YYYY-MM-DD');
    var hFecha = moment(vm.hFecha(), "DD/MM/YYYY").format('YYYY-MM-DD');
    var tipoIvaId = vm.stipoIvaId();
    var conta = vm.sconta();
    var orden = vm.sorden();

    sql += " WHERE f.departamentoId IS NOT NULL ";
   
        if (proveedorId) {
            sql += " AND f.proveedorId IN (" + proveedorId + ")";
        }
        if (empresaId) {
            sql += " AND f.empresaId IN (" + empresaId + ")";
        }
        if (dFecha) {
            sql += " AND f.fecha_recepcion >= '" + dFecha + " 00:00:00'";
        }
        if (hFecha) {
            sql += " AND f.fecha_recepcion <= '" + hFecha + " 23:59:59'";
        }
        if (tipoIvaId) {
            sql += " AND ti.tipoIvaId IN (" + tipoIvaId + ")";
        }
        if(conta == "sinConta") {
            sql += " AND f.contabilizada = 0"
        }
        if(conta == "conta") {
            sql += " AND f.contabilizada = 1"
        }


        sql += " ORDER BY "+ orden+" ASC";
        /*if(departamentoId && departamentoId > 0) {
            sql += " AND pf.departamentoId =" + departamentoId;
        } else {
            sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+")"
        }*/
    return sql;
}

var exportarPDF = function () {
    $("#mensajeExportacion").hide();
    $("#mensajeEspera").show();
    var empresaId = vm.sempresaId();

    if (!empresaId) empresaId = 0;

    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

    // (1) Obtener una lista de las facturas implicadas.
    // la lista debe devolver también el fichero de informe asociado
    var url = "/api/facturas/facpdf/" + dFecha + "/" + hFecha;
    url += "/" + empresaId;
    url += "/" + sproveedorId;
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