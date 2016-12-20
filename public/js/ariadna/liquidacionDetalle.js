/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var facturaId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();

    vm = new admData();
    ko.applyBindings(vm);

    initTablaliquidaciones();
    // comprobamos parámetros
    var comercialId = gup('comercialId');
    var dFecha = gup('dFecha');
    var hFecha = gup('hFecha');
    //
    vm.comercialId(comercialId);
    vm.desdeFecha(moment(dFecha).format('DD/MM/YYYY'));
    vm.hastaFecha(moment(hFecha).format('DD/MM/YYYY'));
    //
    buscarLiquidacionesDetalladas()();
}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    self.colaborador = ko.observable();
    self.comercialId = ko.observable();
    self.tipo = ko.observable();
    self.totalComision = ko.observable();
}

function initTablaliquidaciones() {
    tablaCarro = $('#dt_liquidacion').dataTable({
        bSort: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_liquidacion'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataFacturas,
        columns: [{
            data: "fechaFactura",
            render: function (data, type, row) {
                var html = moment(data).format('DD/MM/YYYY');
                return html;
            }
        }, {
            data: "facNum"
        }, {
            data: "contrato"
        }, {
            data: "impCliente"
        }, {
            data: "CA"
        }, {
            data: "PC"
        }, {
            data: "PCA"
        }, {
            data: "PCO"
        }, {
            data: "ICO"
        }, {
            data: "IJO"
        }, {
            data: "IOT"
        }, {
            data: "IAT"
        }, {
            data: "IC"
        }, {
            data: "base"
        }, {
            data: "porComer"
        }, {
            data: "comision"
        }]
    });
}


function loadTablaLiquidaciones(data) {
    var dt = $('#dt_liquidacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarLiquidacionesDetalladas() {
    var mf = function () {
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/liquidaciones/detalle/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) +"/" + vm.comercialId(),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var tComis = 0;
                data.forEach(function(d){
                    vm.colaborador(d.nombre);
                    vm.tipo(d.tipo);
                    tComis += d.comision;
                });
                vm.totalComision(numeral(tComis).format('0,0.00'));
                loadTablaLiquidaciones(data);
                // mostramos el botén de alta
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}


function editLiquidacion(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaDetalle.html?FacturaId=" + id;
    window.open(url, '_new');
}


function printLiquidacion(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/facturas/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            informePDF(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function informePDF(data) {
    var shortid = "HyGQ0yAP";
    var data = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
}

var f_open_post = function (verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_blank";

    var input = document.createElement("textarea");
    input.name = "template[shortid]";
    input.value = data.template.shortid;
    form.appendChild(input);

    input = document.createElement("textarea");
    input.name = "data";
    input.value = JSON.stringify(data.data);
    form.appendChild(input);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
};