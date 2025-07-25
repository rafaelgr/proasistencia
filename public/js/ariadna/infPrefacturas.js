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
var usuario
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
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
         //
    initAutoCliente(); 
    // verificamos si nos han llamado directamente
    //     if (id) $('#selector').hide();
    if (gup('prefacturaId') != "") {
        vm.prefacturaId(gup('prefacturaId'));
        verb = "GET";
        var url = myconfig.apiUrl + "/api/prefacturas/" + vm.prefacturaId();
        llamadaAjax(verb, url, null, function (err, data) {
            vm.sempresaId(data.empresaId);
            obtainReport(true);
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
    self.prefacturaId = ko.observable();
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
};

var obtainReport = function (carga) {
    if(!carga) {
        if (!datosOK()) return;
    }
    var ids = [];
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    // Load report from url
    //report.loadFile("../reports/SimpleList.mrt");
    var file = "../reports/prefactura_general.mrt";
    verb = "GET";
    url = myconfig.apiUrl + "/api/empresas/" + vm.sempresaId();
    report.loadFile(file);

    llamadaAjax(verb, url, null, function (err, data) {
        var infPreFacturas = data.infPreFacturas;
        file = "../reports/" + infPreFacturas + ".mrt";
        if(vm.sdepartamentoId() == 7) {
            file = "../reports/prefactura_reparaciones.mrt";
        } 
        var rpt = gup("report");
        report.loadFile(file);
        //report.setVariable("vTest", "11,16,18");
        //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
        var connectionString = "Server=" + myconfig.report.host + ";";
        connectionString += "Database=" + myconfig.report.database + ";"
        connectionString += "UserId=" + myconfig.report.user + ";"
        connectionString += "Pwd=" + myconfig.report.password + ";";
        // obtener el indice de los sql que contiene el informe que trata 
        // la cabecera ('pf.prefacturaId')
        var pos = 0;
        var pos1 = 0;
        var pos2 = 0;
        for (var i = 0; i < report.dataSources.items.length; i++) {
            var str = report.dataSources.items[i].sqlCommand;
            if (str.indexOf("pf.prefacturaId") > -1) pos = i;
            if (str.indexOf("prefacturas_lineas") > -1) pos1 = i;
            if (str.indexOf("prefacturas_bases") > -1) pos2 = i;
        }
        var sql = report.dataSources.items[pos].sqlCommand;
        var sql3 = report.dataSources.items[pos1].sqlCommand;
        var sql4 = report.dataSources.items[pos2].sqlCommand;

        var sql2 = rptPrefacturaParametros(sql);
        verb = "POST"; 
        url = myconfig.apiUrl + "/api/informes/sql/nuevo";
        llamadaAjax(verb, url, {"sql":sql2}, function(err, data){
            if (err) return;
            if (data) {
                if(data.length > 0) {
                    for( var i = 0; i < data.length; i++) {
                        ids.push(data[i].prefacturaId);
                    }
                    sql3 = sql3 + ' WHERE pfl.prefacturaId IN ( ' + ids + ' )';
                    sql4 = sql4 + ' WHERE pfb.prefacturaId IN ( ' + ids + ' )';
                    report.dataSources.items[pos].sqlCommand = sql2;
                    report.dataSources.items[pos1].sqlCommand = sql3;
                    report.dataSources.items[pos2].sqlCommand = sql4;
                    // Assign report to the viewer, the report will be built automatically after rendering the viewer
                    viewer.report = report;
                } else {
                    alert("No hay registros con estas condiciones");
                }
                
            } else {
                alert("No hay registros con estas condiciones");
            }
        })
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
            }
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
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
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

var rptPrefacturaParametros = function (sql) {
    var prefacturaId = vm.prefacturaId();
    var clienteId = vm.sclienteId();
    var departamentoId = vm.sdepartamentoId();
    var empresaId = vm.sempresaId();
    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();
    sql += " WHERE TRUE"
    if (prefacturaId) {
        sql += " AND pf.prefacturaId IN (" + prefacturaId + ")";
    } else {
        if (clienteId) {
            sql += " AND pf.clienteId IN (" + clienteId + ")";
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

