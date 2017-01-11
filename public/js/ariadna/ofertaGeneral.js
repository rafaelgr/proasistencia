/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página OfertaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataOfertas;
var ofertaId;

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
    $('#btnBuscar').click(buscarOfertas());
    $('#btnAlta').click(crearOferta());
    $('#frmBuscar').submit(function () {
        return false
    });
    initTablaOfertas();

    ofertaId = gup('OfertaId');
    if (ofertaId !== '') {
        cargarOfertas()(ofertaId);

    } else {
        cargarOfertas()();
    }

    $('#chkAceptadas').change(function () {
        if (this.checked) {
            // pendiente 
        } else {
            // 
        }
    })
}

function initTablaOfertas() {
    tablaOfertas = $('#dt_oferta').DataTable({
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
                    "sTitle": "Ofertas Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_oferta'), breakpointDefinition);
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
        data: dataOfertas,
        columns: [{
            data: "facturaId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                return html;
            }
        }, {
            data: "referencia"
        }, {
            data: "tipo"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "empresa"
        }, {
            data: "cliente"
        }, {
            data: "total"
        }, {
            data: "mantenedor"
        }, {
            data: "agente"
        }, {
            data: "observaciones"
        }, {
            data: "ofertaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteOferta(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editOferta(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printOferta(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_oferta thead th input[type=text]").on('keyup change', function () {
        tablaOfertas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaOfertas.columns(7).visible(false);
    tablaOfertas.columns(8).visible(false);
    tablaOfertas.columns(9).visible(false);
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

function loadTablaOfertas(data) {
    var dt = $('#dt_oferta').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarOfertas() {
    var mf = function () {
        cargarOfertas()();
    };
    return mf;
}

function crearOferta() {
    var mf = function () {
        var url = "OfertaDetalle.html?OfertaId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteOferta(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                ofertaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/ofertas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarOfertas();
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

function editOferta(id) {
    var url = "OfertaDetalle.html?OfertaId=" + id;
    window.open(url, '_new');
}

function cargarOfertas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: ofertaId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/ofertas/" + ofertaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaOfertas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/ofertas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaOfertas(data);
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

function printOferta(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/ofertas/" + id,
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
    var shortid = "rySBxKzIe";
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

function cargarOfertas2() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/prefacturas",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaOfertas(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cargarOfertas2All() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/prefacturas/all",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaOfertas(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}