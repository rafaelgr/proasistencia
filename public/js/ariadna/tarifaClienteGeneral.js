/*-------------------------------------------------------------------------- 
TarifaGeneral.js
Funciones js par la página TarifaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataTarifas;
var tarifaClienteId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarTarifas());
    $('#btnAlta').click(crearTarifa());
   
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarTarifas();
    //});
    //
    initTablaTarifas();
    // comprobamos parámetros
    tarifaClienteId = gup('tarifaClienteId');
    if (tarifaClienteId !== '') {

        // Si nos pasan una prefafctura determinada esa es
        // la que mostramos en el grid
        cargarTarifas()(tarifaClienteId);

    } else {

        // Por defecto ahora a la entrada se van a cargar todas 
        // las tarifas_cliente que tengamos en el sistema. En un futuro este
        // criterio puede cambiar y habrá que adaptarlo.
        cargarTarifas()();
    }
}

function initTablaTarifas() {
    tablaTarifas = $('#dt_tarifa').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "Tarifas Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Tarifas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Tarifas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Tarifas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Tarifas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_tarifa'), breakpointDefinition);
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
        data: dataTarifas,
        columns: [{
            data: "tarifaClienteId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (row.contafich) {
                    html = "<i class='fa fa-file'></i>";
                }
                return html;
            }
        }, {
            data: "nombre"
        }, {
            data: "tarifaClienteId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteTarifa(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editTarifa(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 +"</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_tarifa thead th input[type=text]").on('keyup change', function () {
        tablaTarifas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
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
    return $('#frmBuscar').valid();
}

function loadTablaTarifas(data) {
    var dt = $('#dt_tarifa').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarTarifas() {
    var mf = function () {
        cargarTarifas()();
    };
    return mf;
}

function crearTarifa() {
    var mf = function () {
        var url = "TarifaClienteDetalle.html?tarifaClienteId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteTarifa(id) {
    // mensaje de confirmación
    var mens = "<p>¿Desea borrar la tarifa?</p> <h3>Se borrarán todas las lineas asociadas a ella</h3>";
    
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Cancelar][Borrar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Borrar") {
            llamadaAjax("DELETE", myconfig.apiUrl + "/api/tarifas_cliente/" + id, null, function (err) {
                if (err) return;
                buscarTarifas()();
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editTarifa(id) {
    // hay que abrir la página de detalle de tarifa
    // pasando en la url ese ID
    var url = "TarifaClienteDetalle.html?tarifaClienteId=" + id;
    window.open(url, '_new');
}

function cargarTarifas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: tarifaClienteId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/tarifas_cliente/" + tarifaClienteId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaTarifas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/tarifas_cliente",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaTarifas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    };
    return mf;
}


