﻿/*-------------------------------------------------------------------------- 
comercialGeneral.js
Funciones js par la página ComercialGeneral.html

---------------------------------------------------------------------------*/
var dataComerciales;
var comercialId;


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarComerciales());
    $('#btnAlta').click(crearComercial());
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarComerciales();
    //});
    //
    initTablaComerciales();
    // comprobamos parámetros
    comercialId = gup('ComercialId');
    if (comercialId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: comercialId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/comerciales/" + comercialId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                var data2 = [data];
                loadTablaComerciales(data2);
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

function initTablaComerciales() {
   tablaCarro = $('#dt_comercial').DataTable({ 
        autoWidth: true,
        bSort: true,
        paging: true,
        "pageLength": 100,
        responsive: true,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'Br><'col-sm-6 col-xs-6 hidden-xs' 'l C >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
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
        data: dataComerciales,
        columns: [{
            data: "activa",
            render: function (data, type, row) {
                var html = "<i class='fa fa-check'></i>";
                if (data == 0) {
                    html = "<i class='fa fa-ban'></i>";
                }
                return html;
            }
        },{
            data: "nombre"
        }, {
            data: "nif"
        },  {
            data: "direccion",
            render: function (data, type, row) {
                if(!data) data = "";
                if(!row.poblacion) row.poblacion = "";
                return data + " " + row.poblacion;
            }
        },  {
            data: "email"
        },  {
            data: "email2"
        },  {
            data: "telefono1"
        },  {
            data: "telefono2"
        }, {
            data: "tipo_actividad"
        }, {
            data: "comercialId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteComercial(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editComercial(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_comercial thead th input[type=text]").on('keyup change', function () {
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

function loadTablaComerciales(data) {
    var dt = $('#dt_comercial').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbComercial").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbComercial").show();
    }
}

function buscarComerciales() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        var url = myconfig.apiUrl + "/api/comerciales/activos/?nombre=" + aBuscar;
        if (document.getElementById('chkTodos').checked){
            url = myconfig.apiUrl + "/api/comerciales/?nombre=" + aBuscar;
        }
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaComerciales(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function crearComercial() {
    var mf = function () {
        var url = "ComercialDetalle.html?ComercialId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteComercial(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                comercialId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/comerciales/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarComerciales();
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

function editComercial(id) {
    // hay que abrir la página de detalle de comercial
    // pasando en la url ese ID
    var url = "ComercialDetalle.html?ComercialId=" + id;
    window.open(url, '_self');
}

buscarTodos = function(){
    var url =  myconfig.apiUrl + "/api/comerciales/activos/?nombre=*";
    llamadaAjax("GET", url, null, function(err, data){
        if (err) return;
        loadTablaComerciales(data);
    });
}
