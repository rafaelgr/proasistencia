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

// Create the report viewer with default options
var options = new Stimulsoft.Viewer.StiViewerOptions();
options.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.Continuous;
var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
StiOptions.WebServer.url = "/api/streport";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);



obtainKey();//obtiene la clave de usuario de stimulsoft de lña configuracion


//options.appearance.scrollbarsMode = true;
//options.appearance.fullScreenMode = true;
//options.toolbar.showSendEmailButton = true;
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
    usuario = recuperarUsuario();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $("#btnImprimir").click(obtainReport);
    // avoid form submmit
    $("#frmRptOfertas").submit(function () {
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

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;

        //
        $("#cmbEmpresas").select2(select2Spanish());
        loadEmpresas();
        initAutoCliente(); 
        // verificamos si nos han llamado directamente
        //     if (id) $('#selector').hide();
        if (gup('ofertaId') != "") {
            //recuperamos la información de la oferta para conocer su departamento
            vm.ofertaId(gup('ofertaId')); 
            llamadaAjax('GET', myconfig.apiUrl + "/api/ofertas/" + vm.ofertaId(), null, function (err, data) {
                if (err) return;
                if(data) vm.sempresaId(data.empresaId);
                obtainReport();
                $('#selector').hide();
            });
        }
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
    self.ofertaId = ko.observable();
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
};

var obtainReport = function () {
    if (!datosOK()) return;

    var empresaId = vm.sempresaId();
    var departamentoId = vm.sdepartamentoId();
    var ofertaId = vm.ofertaId();
  
    
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    // Load report from url
    //report.loadFile("../reports/SimpleList.mrt");
    var rpt = gup("report");
    var file = "../reports/oferta_general.mrt";
    //si se trata del departamento de arquitectura y la empresa proyecta cargamos su propio informe
    if(empresaId == 10 && departamentoId == 5 && !ofertaId) file = "../reports/oferta_proyecta_visor.mrt";
    else if(empresaId == 10 && departamentoId == 5  && ofertaId) file = "../reports/oferta_proyecta.mrt";
    else if( departamentoId == 7) file = "../reports/oferta_reparaciones.mrt";
    report.loadFile(file);
    //report.setVariable("vTest", "11,16,18");
    //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
    var connectionString = "Server=" + myconfig.report.host + ";";
    connectionString += "Database=" + myconfig.report.database + ";"
    connectionString += "UserId=" + myconfig.report.user + ";"
    connectionString += "Pwd=" + myconfig.report.password + ";";
    connectionString += "dateStrings=true";
    report.dictionary.databases.list[0].connectionString = connectionString;
    var sql = report.dataSources.items[0].sqlCommand;
    var sql2 = rptOfertaParametros(sql);
    verb = "POST"; 
    url = myconfig.apiUrl + "/api/informes/sql";

    
    llamadaAjax(verb, url, {"sql":sql2}, function(err, data){
        if (err) return;
        if (data) {
            report.dataSources.items[0].sqlCommand  = sql2;
            // Assign report to the viewer, the report will be built automatically after rendering the viewer
            viewer.displayMode = Stimulsoft.Viewer.StiWebViewMode[1];
            viewer.report = report;
        } else {
            alert("No hay registros con estas condiciones");
        }
    });
};

var printReport = function (url) {
    $("#reportArea").attr('src', url);
};

function datosOK() {
    $('#frmRptOfertas').validate({
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

var rptOfertaParametros = function (sql) {
    var ofertaId = vm.ofertaId();
    var clienteId = vm.sclienteId();
    var empresaId = vm.sempresaId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();
    var departamentoId = vm.sdepartamentoId();
    sql += " WHERE TRUE"
    if (ofertaId) {
        sql += " AND o.ofertaId IN (" + ofertaId + ")";
    } else {
        if (clienteId) {
            sql += " AND o.clienteId IN (" + clienteId + ")";
        }
        if (empresaId) {
            sql += " AND o.empresaId IN (" + empresaId + ")";
        }
        if (dFecha) {
            sql += " AND o.fechaOferta >= '" + dFecha + " 00:00:00'";
        }
        if (hFecha) {
            sql += " AND o.fechaOferta <= '" + hFecha + " 23:59:59'";
        }
        if(departamentoId && departamentoId > 0) {
            sql += " AND o.tipoOfertaId =" + departamentoId;
        } else {
            sql += " AND o.tipoOfertaId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario.usuarioId +")"
        }

    }
    return sql;
}

