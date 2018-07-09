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
    //
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
    //
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#btnBuscar').click(buscarLiquidacionesAcumuladas());
    $('#btnPrint').click(printGeneral);
    $('#frmBuscar').submit(function () {
        return false
    });
    $("#cmbComerciales").select2(select2Spanish());
    $("#cmbContratos").select2(select2Spanish());

    loadComerciales();
    loadContratos();    

    initTablaLiquidaciones();
    // comprobamos parámetros
    facturaId = gup('FacturaId');
}

// tratamiento knockout

function admData() {
    var self = this;

     //
     self.comercialId = ko.observable();
     self.scomercialId = ko.observable();
     //
     self.posiblesComerciales = ko.observableArray([]);
     self.elegidosComerciales = ko.observableArray([]);
    
    //
    self.contratoId = ko.observable();
    self.scontratoId = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
}

function initTablaLiquidaciones() {
    tablaCarro = $('#dt_liquidacion').dataTable({
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
            data: "nombre"
        }, {
            data: "tipo"
        }, {
            data: "totFactura"
        }, {
            data: "totBase"
        }, {
            data: "totComision"
        }, {
            data: "comercialId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editLiquidacion(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success btn-lg' onclick='printLiquidacion(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });
}

/*function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtDesdeFecha: {
                required: true
            },
            txtHastaFecha: {
                required: true,
                greaterThan: "#txtDesdeFecha"
            },

        },
        // Messages for form validation
        messages: {
            txtDesdeFecha: {
                required: "Debe seleccionar una fecha"
            },
            txtHastaFecha: {
                required: "Debe seleccionar una fecha"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}*/

function loadTablaLiquidaciones(data) {
    var dt = $('#dt_liquidacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarLiquidacionesAcumuladas() {
    var mf = function () {
        var comercialId = 0;
        var contratoId = 0;
        if (vm.scomercialId()) comercialId = vm.scomercialId();
        if (vm.scontratoId()) contratoId = vm.scontratoId();
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/liquidaciones/acumulada/comerciales/"  + comercialId + "/" + contratoId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
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
    
    var url = "LiquidacionComercialDetalle.html?comercialId=" + id + "&contratoId=" + vm.scontratoId();
    window.open(url, '_new');
}


function printLiquidacion(id) {
    var contratoId = vm.scontratoId();
    if (contratoId == "undefined") contratoId = 0
    var url = "infLiquidacionesColaboradorDetalle.html?comercialId=" + id + "&contratoId=" + vm.scontratoId();
    window.open(url, '_new');
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

var printGeneral = function () {
    
    var comercialId = 0;
    var contratoId = 0;
    if (vm.scomercialId()) comercialId = vm.scomercialId();
    if (vm.scontratoId()) contratoId = vm.scontratoId();
    var url = "infLiquidacionesColaboradorGeneral.html?comercialId=" + comercialId + "&contratoId=" + contratoId;
    window.open(url, '_new');
}

function loadComerciales(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/colaboradores/activos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposComerciales = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesComerciales(tiposComerciales);
            //if (id){
            //    vm.scomercialId(id);
            //}
            $("#cmbComerciales").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadContratos(id) {
    $.ajax({
        type: "GET",
        url: "/api/contratos/contratos/beneficio/comercial/cerrados",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var contratos = [{ contratoId: 0, direccion: "" }].concat(data);
            vm.posiblesContratos(contratos);
            //if (id){
            //    vm.scontratoId(id);
            //}
            $("#cmbContratos").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}