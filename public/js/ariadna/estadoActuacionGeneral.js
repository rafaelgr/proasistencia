/*-------------------------------------------------------------------------- 
estadoActuacionGeneral.js
Funciones js par la página EstadoActuacionGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataEstadoActuaciones;
var estadoActuacionId;
var cuentas;

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
    $('#btnBuscar').click(buscarEstadoActuaciones());
    $('#btnAlta').click(crearEstadoActuacion());
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarEstadoActuaciones();
    //});
    //
    initTablaEstadoActuaciones();
    // comprobamos parámetros
    estadoActuacionId = gup('EstadoActuacionId');
    cuentas = gup('cuentas');
    if(cuentas == 'false') {
        mensNormal('AVISO: Alguna de las cuentas asociadas no existen en todas las contabilidades.');
    }
    if (estadoActuacionId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: estadoActuacionId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/estados_actuacion/" + estadoActuacionId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaEstadoActuaciones(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    } else {
        buscarTodos();
    }
}

function initTablaEstadoActuaciones() {
    tablaCarro = $('#dt_estadoActuacion').dataTable({
        autoWidth: true,
        "columnDefs": [
            { "width": "10%", "targets": 1 }
          ],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_estadoActuacion'), breakpointDefinition);
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
        data: dataEstadoActuaciones,
        columns: [{
            data: "nombre"
        }, {
            data: "estadoActuacionId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteEstadoActuacion(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editEstadoActuacion(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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

function loadTablaEstadoActuaciones(data) {
    var dt = $('#dt_estadoActuacion').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbEstadoActuacion").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbEstadoActuacion").show();
    }
}

function buscarEstadoActuaciones() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/estados_actuacion/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaEstadoActuaciones(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function crearEstadoActuacion() {
    var mf = function () {
        var url = "EstadoActuacionDetalle.html?EstadoActuacionId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteEstadoActuacion(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                estadoActuacionId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/estados_actuacion/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#txtBuscar').val('*');
                    var fn = buscarEstadoActuaciones();
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

function editEstadoActuacion(id) {
    // hay que abrir la página de detalle de estadoActuacion
    // pasando en la url ese ID
    var url = "EstadoActuacionDetalle.html?EstadoActuacionId=" + id;
    window.open(url, '_self');
}

buscarTodos = function(){
    var url = myconfig.apiUrl + "/api/estados_actuacion/?nombre=*";
    llamadaAjax("GET", url, null, function(err, data){
        if (err) return;
        loadTablaEstadoActuaciones(data);
    });
}
