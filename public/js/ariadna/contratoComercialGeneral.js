/*-------------------------------------------------------------------------- 
comercialGeneral.js
Funciones js par la página ComercialGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataContratosComerciales;
var contratoComercialId;

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
    $('#btnAlta').click(crearContratoComercial());
    $('#btnRefrescar').click(refrescar());
    $('#frmCrear').submit(function() {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarComerciales();
    //});
    //
    initTablaContratosComerciales();
    // comprobamos parámetros
    contratoComercialId = gup('ContratoComercialId');
    if (contratoComercialId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
                id: contratoComercialId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_comerciales/" + contratoComercialId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosComerciales(data);
            },
            error: errorAjax
        });
    } else {
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_comerciales/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosComerciales(data);
            },
            error: errorAjax
        });
    }
}

function initTablaContratosComerciales() {
    tablaCarro = $('#dt_contratoComercial').dataTable({
        autoWidth: true,
        preDrawCallback: function() {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_contratoComercial'), breakpointDefinition);
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
        data: dataContratosComerciales,
        columns: [{
            data: "comercial"
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
            data: "contratoComercialId",
            render: function(data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteContratoComercial(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editContratoComercial(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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

function loadTablaContratosComerciales(data) {
    var dt = $('#dt_contratoComercial').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbContratoComercial").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbContratoComercial").show();
    }

}


function crearContratoComercial() {
    var mf = function() {
        var url = "ContratoComercialDetalle.html?ContratoComercialId=0";
        window.open(url, '_self');
    };
    return mf;
}

function refrescar() {
    var mf = function() {
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_comerciales/",
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosComerciales(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function deleteContratoComercial(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function(ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                comercialId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/contratos_comerciales/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    var fn = buscarContratosComerciales();
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

function editContratoComercial(id) {
    // hay que abrir la página de detalle de comercial
    // pasando en la url ese ID
    var url = "ContratoComercialDetalle.html?ContratoComercialId=" + id;
    window.open(url, '_self');
}

function buscarContratosComerciales() {
    var mf = function() {
        if (!datosOK()) {
            return;
        }
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contratos_comerciales",
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaContratosComerciales(data);
            },
            error: errorAjax
        });
    };
    return mf;
}
