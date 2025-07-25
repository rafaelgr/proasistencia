/*-------------------------------------------------------------------------- 
comercialGeneral.js
Funciones js par la página ComercialGeneral.html

---------------------------------------------------------------------------*/
var dataContratosComerciales;
var contratoComercialId;
var usuario;


function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
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
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
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
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    }
}

function initTablaContratosComerciales() {
    tablaCarro = $('#dt_contratoComercial').DataTable({
        autoWidth: true,
        paging: true,
        responsive: true,
        "pageLength": 100,
        columnDefs: [
            {
                targets: 4, // El número de la columna que deseas mantener siempre visible (0 es la primera columna).
                className: 'all', // Agrega la clase 'all' para que la columna esté siempre visible.
            },
            { 
                "type": "datetime-moment",
                "targets": [2, 3],
                "render": function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        if(!data) return null;
                        return moment(data).format('DD/MM/YYYY');
                    }
                    // Si es para ordenar, usa un formato que DataTables pueda entender (p. ej., 'YYYY-MM-DD HH:mm:ss')
                    else if (type === 'sort') {
                        if(!data) return null;
                        return moment(data).format('YYYY-MM-DD HH:mm:ss');
                    }
                    // En otros casos, solo devuelve los datos sin cambios
                    else {
                        if(!data) return null;
                        return data;
                    }
                }
            }
        ],
        preDrawCallback: function() {
            
        },
        rowCallback: function(nRow) {
           
        },
        drawCallback: function(oSettings) {
           
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
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteContratoComercial(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editContratoComercial(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if(usuario.puedeVisualizar == 0) html = "";
                return html;
            }
        }]
    });

      // Apply the filter
      $("#dt_contratoComercial thead th input[type=text]").on('keyup change', function () {
        tablaCarro
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
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
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
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
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}
