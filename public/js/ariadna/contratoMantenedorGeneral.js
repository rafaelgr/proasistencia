/*-------------------------------------------------------------------------- 
mantenedorGeneral.js
Funciones js par la página MantenedorGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataContratosMantenedores;
var contratoMantenedorId;

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
    $('#btnAlta').click(crearContratoMantenedor());
    $('#btnRefrescar').click(refrescar());
    $('#frmCrear').submit(function() {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarMantenedores();
    //});
    //
    initTablaContratosMantenedores();
    // comprobamos parámetros
    contratoMantenedorId = gup('ContratoMantenedorId');
    if (contratoMantenedorId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
                id: contratoMantenedorId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_mantenedores/" + contratoMantenedorId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosMantenedores(data);
            },
            error: errorAjax
        });
    } else {
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_mantenedores/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosMantenedores(data);
            },
            error: errorAjax
        });
    }
}

function initTablaContratosMantenedores() {
    tablaCarro = $('#dt_contratoMantenedor').dataTable({
        autoWidth: true,
        preDrawCallback: function() {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_contratoMantenedor'), breakpointDefinition);
            }
        },
        rowCallback: function(nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function(oSettings) {
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
        data: dataContratosMantenedores,
        columns: [{
            data: "mantenedor"
        }, {
            data: "empresa"
        }, {
            data: "fechaInicio",
            render: function(data, type, row) {
                if (!data) {
                    return "";
                }
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "fechaFin",
            render: function(data, type, row) {
                if (!data) {
                    return "";
                }
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "contratoMantenedorId",
            render: function(data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteContratoMantenedor(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editContratoMantenedor(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {
    
    $('#frmCrear').validate({
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmCrear').valid();
}

function loadTablaContratosMantenedores(data) {
    var dt = $('#dt_contratoMantenedor').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbContratoMantenedor").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbContratoMantenedor").show();
    }

}


function crearContratoMantenedor() {
    var mf = function() {
        var url = "ContratoMantenedorDetalle.html?ContratoMantenedorId=0";
        window.open(url, '_self');
    };
    return mf;
}

function refrescar() {
    var mf = function() {
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_mantenedores/",
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosMantenedores(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function deleteContratoMantenedor(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function(ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                mantenedorId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/contratos_mantenedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    var fn = buscarContratosMantenedores();
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

function editContratoMantenedor(id) {
    // hay que abrir la página de detalle de mantenedor
    // pasando en la url ese ID
    var url = "ContratoMantenedorDetalle.html?ContratoMantenedorId=" + id;
    window.open(url, '_self');
}

function buscarContratosMantenedores() {
    var mf = function() {
        if (!datosOK()) {
            return;
        }
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_mantenedores",
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosMantenedores(data);
            },
            error: errorAjax
        });
    };
    return mf;
}
