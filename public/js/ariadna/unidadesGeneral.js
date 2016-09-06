/*-------------------------------------------------------------------------- 
unidadGeneral.js
Funciones js par la página UnidadGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataUnidades;
var unidadId;

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
    $('#btnBuscar').click(buscarUnidades());
    $('#btnAlta').click(crearUnidad());
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarUnidades();
    //});
    //
    initTablaUnidades();
    // comprobamos parámetros
    unidadId = gup('UnidadId');
    if (unidadId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: unidadId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/unidades/" + unidadId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                var data2 = [data];
                loadTablaUnidades(data2);
            },
            error: errorAjax
        });
    }
}

function initTablaUnidades() {
    tablaCarro = $('#dt_unidad').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_unidad'), breakpointDefinition);
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
        data: dataUnidades,
        columns: [{
            data: "nombre"
        }, {
            data: "abrev"
        }, {
            data: "unidadId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteUnidad(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editUnidad(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {
    
    $('#frmBuscar').validate({
        rules: {
            txtBuscar: { required: true },
        },
        // Messages for form validation
        messages: {
            txtBuscar: {
                required: 'Introduzca el texto a buscar'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

function loadTablaUnidades(data) {
    var dt = $('#dt_unidad').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbUnidad").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbUnidad").show();
    }
}

function buscarUnidades() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/unidades/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaUnidades(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function crearUnidad() {
    var mf = function () {
        var url = "UnidadDetalle.html?UnidadId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteUnidad(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                unidadId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/unidades/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarUnidades();
                    fn();
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editUnidad(id) {
    // hay que abrir la página de detalle de unidad
    // pasando en la url ese ID
    var url = "UnidadDetalle.html?UnidadId=" + id;
    window.open(url, '_self');
}


