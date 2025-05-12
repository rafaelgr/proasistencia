/*-------------------------------------------------------------------------- 
tipoTextoGeneral.js
Funciones js par la página TipoTextoGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataTiposTexto;
var tipoTextoId;

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
    $('#btnBuscar').click(buscarTiposTexto());
    $('#btnAlta').click(crearTipoTexto());
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarTiposTexto();
    //});
    //
    initTablaTiposTexto();
    // comprobamos parámetros
    tipoTextoId = gup('TipoTextoId');
    if (tipoTextoId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: tipoTextoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_texto/" + tipoTextoId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaTiposTexto(data);
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

function initTablaTiposTexto() {
    tablaCarro = $('#dt_tipoTexto').dataTable({
        autoWidth: true,
        paging: true,
        "pageLength": 100,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_tipoTexto'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        columnDefs: [
            { width: "95%", targets: 0 },
            { width: "5%", targets: 1 }
        ],
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
        data: dataTiposTexto,
        columns: [{
            data: "nombre"
        }, {
            data: "tipoTextoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-sm' onclick='deleteTipoTexto(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-sm' onclick='editTipoTexto(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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

function loadTablaTiposTexto(data) {
    var dt = $('#dt_tipoTexto').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbTipoTexto").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbTipoTexto").show();
    }
}

function buscarTiposTexto() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // entextor la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_texto/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaTiposTexto(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function crearTipoTexto() {
    var mf = function () {
        var url = "TipoTextoDetalle.html?TipoTextoId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteTipoTexto(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                tipoTextoId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/tipos_texto/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#txtBuscar').val('*');
                    var fn = buscarTiposTexto();
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

function editTipoTexto(id) {
    // hay que abrir la página de detalle de tipoTexto
    // pasando en la url ese ID
    var url = "TipoTextoDetalle.html?TipoTextoId=" + id;
    window.open(url, '_self');
}


buscarTodos = function(){
    var url = myconfig.apiUrl + "/api/tipos_texto/?nombre=*";
    llamadaAjax("GET", url, null, function(err,data){
        if (err) return;
        loadTablaTiposTexto(data);
    })
}