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
var configuracion = null;

fetch('/config')
    .then(response => response.json())
    .then(config => {
        configuracion = config; // Usa la configuración en el cliente
    });

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
    //
    $("#cmbColaboradores").select2(select2Spanish());
    loadColaboradores();

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
};

var obtainReport = function (carga) {
    if (!datosOK()) return;

    var file = "../reports/factura_general.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    verb = "GET";
    url = myconfig.apiUrl + "/api/empresas/" + vm.sempresaId();
    llamadaAjax(verb, url, null, function (err, data) {
        var infFacturas;
        if(vm.sdepartamentoId() == 7) {
            infFacturas = data.infFacCliRep + "_sin_imagen";
        }else if (vm.sdepartamentoId() == 8) {
            infFacturas = data.infFacCliObr;
         } else if (vm.sdepartamentoId() == 3) {
            infFacturas = data.infFacCliAlq;
         }else {
                infFacturas = data.infFacturas;
            }
    
        file = "../reports/" + infFacturas + ".mrt";
        var rpt = gup("report");
        report.loadFile(file);
        //report.setVariable("vTest", "11,16,18");
        //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
        var connectionString = "Server=" + myconfig.report.host + ";";
        connectionString += "Database=" + myconfig.report.database + ";"
        connectionString += "UserId=" + myconfig.report.user + ";"
        connectionString += "Pwd=" + myconfig.report.password + ";";
        // obtener el indice de los sql que contiene el informe que trata 
        // la cabecera ('pf.facturaId')

        if (vm.sdepartamentoId() == 8 && vm.ssempresaId() == 2) {
            // Establecer la URL del logo en la variable 'LogoPath'
            report.dictionary.variables.getByName('LogoPath').value = `${configuracion.protocol}${configuracion.host}/ficheros/logos/logo_proasistencia_nuevo.png`;
         } 
        
        var pos = 0;
        for (var i = 0; i < report.dataSources.items.length; i++) {
            var str = report.dataSources.items[i].sqlCommand;
            if (str.indexOf("pf.facturaId") > -1) pos = i;
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

var obtainReportJson = function (obj) {
    if (!datosOK()) return;
    //Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    var file = "../reports/factura_general.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    verb = "GET";
    url = myconfig.apiUrl + "/api/empresas/" + vm.sempresaId();
    llamadaAjax(verb, url, null, function (err, data) {
        var infFacturas;
        // Create a new report instance
        var report = new Stimulsoft.Report.StiReport();

        if(vm.sdepartamentoId() == 7) {
            infFacturas = data.infFacCliRep + "_sin_imagen_json";
        }else if (vm.sdepartamentoId() == 8) {
            infFacturas = data.infFacCliObr + "_json";
        } else {
            infFacturas = data.infFacturas + "_json";
        }

        file = "../reports/" + infFacturas + ".mrt";
    
        // Remove all connections from the report template
        report.dictionary.databases.clear();
        report.loadFile(file);
        
        

        var dataSet = new Stimulsoft.System.Data.DataSet("fact");
        dataSet.readJson(obj);
            
    
            //
            report.regData("fact", "fact", dataSet);
            report.dictionary.synchronize();
    
            viewer.report = report;
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
        // la cabecera ('pf.facturaId')
        var pos = 0;
        for (var i = 0; i < report.dataSources.items.length; i++) {
            var str = report.dataSources.items[i].sqlCommand;
            if (str.indexOf("pf.facturaId") > -1) pos = i;
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

function loadColaboradores() {
    llamadaAjax("GET", "/api/comerciales/agentes/activos", null, function (err, data) {
        if (err) return;
        var colaboradores = [{ comercialId: 0, nombre: "" }].concat(data);
        vm.posiblesColaboradores(colaboradores);
        $("#cmbColaboradores").val([0]).trigger('change');
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

var rptFacturaParametros = function (sql) {
    var agenteId = vm.scomercialId();
    var facturaId = vm.facturaId();
    var clienteId = vm.sclienteId();
    var departamentoId = vm.sdepartamentoId();
    var empresaId = vm.sempresaId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();
    sql += " WHERE TRUE"
    if (facturaId) {
        sql += " AND pf.facturaId IN (" + facturaId + ")";
    } else {
        if (clienteId) {
            sql += " AND pf.clienteId IN (" + clienteId + ")";
        }
        if (empresaId) {
            sql += " AND pf.empresaId IN (" + empresaId + ")";
        }
        if(agenteId) {
            if(departamentoId && departamentoId == 7) {
                sql += " AND s.agenteId IN (" + agenteId + ")";
            } else {
                sql += " AND cnt.agenteId IN (" + agenteId + ")";
            }
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
        sql += " ORDER BY  pf.serie, pf.fecha, pf.numero ASC"

    }
    return sql;
}

var rptFacturaParametrosJson = function () {
    var agenteId = vm.scomercialId();
    var facturaId = vm.facturaId();
    var clienteId = vm.sclienteId();
    var departamentoId = vm.sdepartamentoId();
    var empresaId = vm.sempresaId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

    if(!clienteId) clienteId = 0;
    if(!agenteId) agenteId = 0;
    if(!facturaId) facturaId = 0;
    if(!departamentoId) departamentoId = 0;
    if(!empresaId) empresaId = 0;


    
    var url = "/api/facturas/inf/facturas/json/visor/" + dFecha + "/" + hFecha;
    url += "/" + empresaId;
    url += "/" + clienteId;
    url += "/" + departamentoId;
    url += "/" + agenteId;
    url += "/" + facturaId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err)   return;
        if(data) {
            obtainReportJson(data)
        } else {
            alert("No hay registros con estas condiciones");
        }
        
    });
}

var exportarPDF = function () {
    $("#mensajeExportacion").hide();
    $("#mensajeEspera").show();
    var clienteId = vm.sclienteId();
    var empresaId = vm.sempresaId();

    if (!empresaId) empresaId = 0;
    if (!clienteId) clienteId = 0;

    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

    // (1) Obtener una lista de las facturas implicadas.
    // la lista debe devolver también el fichero de informe asociado
    var url = "/api/facturas/facpdf/" + dFecha + "/" + hFecha;
    url += "/" + empresaId;
    url += "/" + clienteId;
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