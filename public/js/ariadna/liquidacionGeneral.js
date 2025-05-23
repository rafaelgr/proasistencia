﻿/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var facturaId;
var usuario;

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
    usuario = recuperarUsuario();
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

    // ocultamos el botón de alta hasta que se haya producido una búsqueda
    $("#btnPrint").hide();
   
    $("#cmbDirecciones").select2(select2Spanish());

    loadDirecciones();    

    initTablaLiquidaciones();
    // comprobamos parámetros
    facturaId = gup('FacturaId');


    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
 

    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
        
    });
}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    //
   
    self.stipoComercialId = ko.observable();
    
    //
    self.contratoId = ko.observable();
    self.sContratoId = ko.observable();
    //
    self.posiblesDirecciones = ko.observableArray([]);
    self.elegidasDirecciones = ko.observableArray([]);
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
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
            data: "totFactura",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "totBase",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "totComision",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "comercialId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editLiquidacion(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printLiquidacion(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {
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
}

function loadTablaLiquidaciones(data) {
    var dt = $('#dt_liquidacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $("#btnPrint").hide();
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarLiquidacionesAcumuladas() {
    var mf = function () {
        if (!datosOK()) return;
        var tipoComercialId = 1;
        var contratoId = 0;
        if (vm.sContratoId()) contratoId = vm.sContratoId();
        var departamentoId = 0;
        if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/liquidaciones/acumulada/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/" + tipoComercialId + "/" + contratoId  + "/" + departamentoId +  "/" + usuario.usuarioId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaLiquidaciones(data);
                // mostramos el botón de imprimir
                $("#btnPrint").show();
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
    var departamentoId = 0;
    if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
    var url = "LiquidacionDetalle.html?comercialId=" + id + "&dFecha=" + spanishDbDate(vm.desdeFecha()) + "&hFecha=" + spanishDbDate(vm.hastaFecha()) +"&tipoColaborador=1&departamentoId=" + departamentoId;
    window.open(url, '_blank');
}


function printLiquidacion(id) {
    var departamentoId = 0;
    if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
    var url = "infLiquidacionesDetalle.html?dFecha=" + spanishDbDate(vm.desdeFecha()) + "&hFecha=" + spanishDbDate(vm.hastaFecha()) + "&comercialId=" + id  +"&tipoColaborador=1&departamentoId=" + departamentoId + "&liqGeneral=true";
    window.open(url, '_blank');
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
    if (!datosOK()) return;
    var tipoComercialId = 1;
    var contratoId = 0;
    if (vm.sContratoId()) contratoId = vm.sContratoId();
    var departamentoId = 0;
    if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();

    var url = "infLiquidacionesGeneral.html?dFecha=" + spanishDbDate(vm.desdeFecha()) + "&hFecha=" + spanishDbDate(vm.hastaFecha()) + "&tipoComercialId=" + tipoComercialId+ "&contratoId=" + contratoId +  "&departamentoId=" + departamentoId + "&liqGeneral=true";
    window.open(url, '_blank');
}



function loadDirecciones(id) {
    $.ajax({
        type: "GET",
        url: "/api/contratos/buscar/direcciones",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var direcciones = [{ contratoId: 0, direccion: "" }].concat(data);
            vm.posiblesDirecciones(direcciones);
            //if (id){
            //    vm.sContratoId(id);
            //}
            $("#cmbDirecciones").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}