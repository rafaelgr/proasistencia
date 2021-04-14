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
    $("#btnExportar").click(exportarPDF);
    //
    
    
    //
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();


    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();

    $('#cmbFactu').select2();
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

    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
    });

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());

    // Ahora cliente en autocomplete
    initAutoCliente();
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
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    self.tipoClienteId = ko.observable();
    //
    self.posiblesclientes = ko.observableArray([]);
    self.elegidosclientes = ko.observableArray([])
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);

    self.tipoIvaId = ko.observable();
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);

    //Combo option factu

    self.optionsFactu = ko.observableArray([
        {
            'nombreFactu': 'Todas',
            'valorFactu': 'todas'
        }, 
        {
            'nombreFactu': 'Sin facturar',
            'valorFactu': 'sinFactu'
        }, 
        {
            'nombreFactu': 'Facturadas',
            'valorFactu': 'factu'
        }
    ]);
    self.selectedFactus = ko.observableArray([]);
    self.sfactu = ko.observable();

    //Combo option orden 

    self.optionsOrden = ko.observableArray([
        
        {
            'nombreOrden': 'Fecha factura',
            'valorOrden': 'f.fecha'
        }, 
        {
            'nombreOrden': 'Cliente',
            'valorOrden': 'f.receptorNombre'
        }
    ]);
    self.selectedOrden = ko.observableArray([]);
    self.sorden = ko.observable();
};

var obtainReport = function () {
    if (!datosOK()) return;
    var file = "../reports/libro_prefacturas_clientes.mrt";
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
        var file = "../reports/libro_prefacturas_clientes.mrt";
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

        var resultado = JSON.stringify(obj);
        /*fs.writeFile(process.env.JSON_DIR + "\\FGAS_castelduc.json", resultado, function(err) {
            if(err) return callback(err);
            return callback(null, true);
        });*/

        /* report.renderAsync(function (err, data2) {
            // Creating export settings
            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            // Creating export service
            var service = new Stimulsoft.Report.Export.StiPdfExportService();
            // Creating MemoryStream
            var stream = new Stimulsoft.System.IO.MemoryStream();
            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();
            var stream = new Stimulsoft.System.IO.MemoryStream();

            service.exportTo(report, stream, settings);

            var data = stream.toArray();

            /*fs.writeFile(process.env.CLASIF_DIR + "\\" + numfactu + ".pdf", buffer, function(err){
                if(err) return callback(err, null);
            });
            callback(null, data2);
        });*/

};

var obtainReportPdf = function () {
    var file = "../reports/libro_facturas_clientes.mrt";
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


// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaCliente
// carga en el campo txtCliente el valor seleccionado
var cargaCliente = function (id) {
    llamadaAjax("GET", "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.tipoClienteId(data.tipoClienteId);
    });
};

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
            //cambioCliente(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};


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
    $("#cmbFactu option[value='todas']").attr("selected",true).trigger('change');    
}

function loadComboOrden(){
    $("#cmbOrden option[value='f.fecha']").attr("selected",true).trigger('change');    
}


var rptFacturaParametros = function () {
    if(!datosOK()) return
    var clienteId = vm.sclienteId();
    var departamentoId = vm.sdepartamentoId();
    var empresaId = vm.sempresaId();
    var dFecha = moment(vm.dFecha(), "DD/MM/YYYY").format('YYYY-MM-DD');
    var hFecha = moment(vm.hFecha(), "DD/MM/YYYY").format('YYYY-MM-DD');
    var tipoIvaId = vm.stipoIvaId();
    var factu = vm.sfactu();
    var orden = vm.sorden();
    if(!tipoIvaId) tipoIvaId = 0;
    if(!clienteId) clienteId = 0;
    var url = myconfig.apiUrl + "/api/prefacturas/prefacturas/crea/json/" + dFecha +"/" + hFecha +  "/" + clienteId + "/" + empresaId + "/" + tipoIvaId + "/" + factu +"/" + orden + "/" + departamentoId + "/" + usuario.usuarioId

    llamadaAjax("POST", url, null, function (err, data) {
        if(err) return;
        if(data.libCli.length > 0) {
            obtainReportJson(data)
        } else {
            alert("No hay registros con estas condiciones");
        }
    });
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
    url += "/" + sclienteId;
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