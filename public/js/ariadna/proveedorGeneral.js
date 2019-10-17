/*-------------------------------------------------------------------------- 
proveedorGeneral.js
Funciones js par la página proveedorGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataProveedores;
var proveedorId;

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
    $('#btnBuscar').click(buscarProveedores());
    $('#btnAlta').click(crearProveedor());
    $('#frmBuscar').submit(function () {
        return false;
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarProveedores();
    //});
    //
    initTablaProveedores();
    // comprobamos parámetros
    proveedorId = gup('ProveedorId');
    if (proveedorId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: proveedorId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/proveedores/" + proveedorId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                var data2 = [data];
                loadTablaProveedores(data2);
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

function initTablaProveedores() {
    tablaCarro = $('#dt_proveedor').dataTable({
        
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_proveedor'), breakpointDefinition);
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
        data: dataProveedores,
        columns: [{
            data: "nombre"
        }, {
            data: "nif"
        }, {
            data: "cuentaContable"
        },{
            data: "proveedorId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteProveedor(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editProveedor(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
    // Apply the filter
    $("#dt_proveedor thead th input[type=text]").on('keyup change', function () {
        tablaCarro
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
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

function loadTablaProveedores(data) {
    var dt = $('#dt_proveedor').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbProveedor").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbProveedor").show();
    }
}

function buscarProveedores(exito) {
    var mf = function () {
        if (!datosOK()) {
            if (!exito) return;
            var url = "ProveedoresGeneral.html";
            window.open(url, '_self');
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/proveedores/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaProveedores(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function crearProveedor() {
    var mf = function () {
        var url = "ProveedorDetalle.html?ProveedorId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteProveedor(id) {
    // mensaje de confirmación
    var exito = true;
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                proveedorId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/proveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarProveedores(exito);
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

function editProveedor(id) {
    // hay que abrir la página de detalle de Proveedor
    // pasando en la url ese ID
    var url = "ProveedorDetalle.html?ProveedorId=" + id;
    window.open(url, '_self');
}


buscarTodos = function(){
    var url = myconfig.apiUrl + "/api/proveedores/?nombre=*";
    llamadaAjax("GET", url, null, function(err, data){
        if (err) return;
        loadTablaProveedores(data);
    });
}