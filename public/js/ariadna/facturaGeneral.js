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


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarFacturas());
    $('#btnAlta').click(crearFactura());
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarFacturas();
    //});
    //
    initTablaFacturas();
    // comprobamos parámetros
    facturaId = gup('FacturaId');
    if (facturaId !== '') {

        // Si nos pasan una prefafctura determinada esa es
        // la que mostramos en el grid
        cargarFacturas()(facturaId);

    } else {

        // Por defecto ahora a la entrada se van a cargar todas 
        // las facturas que tengamos en el sistema. En un futuro este
        // criterio puede cambiar y habrá que adaptarlo.
        cargarFacturas()();
    }
}

function initTablaFacturas() {
    tablaCarro = $('#dt_factura').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_factura'), breakpointDefinition);
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
            data: "emisorNombre"
        }, {
                data: "receptorNombre"
            },{
                data: "vNum"
            }, {
                data: "fecha",
                render: function (data, type, row) {
                    return moment(data).format('DD/MM/YYYY');
                }
            }, {
                data: "total"
            }, {
                data: "totalConIva"
            }, {
                data: "formaPago"
            }, {
                data: "observaciones"
            }, {
                data: "facturaId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var bt3 = "<button class='btn btn-circle btn-success btn-lg' onclick='printFactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
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

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarFacturas() {
    var mf = function () {
        cargarFacturas()();
    };
    return mf;
}

function crearFactura() {
    var mf = function () {
        var url = "FacturaDetalle.html?FacturaId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteFactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                facturaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarFacturas();
                    fn();
                },
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editFactura(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaDetalle.html?FacturaId=" + id;
    window.open(url, '_self');
}

function cargarFacturas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: facturaId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturas/" + facturaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacturas(data);
                },
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacturas(data);
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

function printFactura(id) {
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

var f_open_post = function(verb, url, data, target) {
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