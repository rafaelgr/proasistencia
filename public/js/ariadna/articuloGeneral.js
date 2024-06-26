﻿/*-------------------------------------------------------------------------- 
articuloGeneral.js
Funciones js par la página ArticuloGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataArticulos;
var articuloId;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin

    vm = new admData();
    ko.applyBindings(vm);
    usuario = recuperarUsuario();
    recuperaDepartamento(function(err, data) {
        if(err) return;
        initTablaArticulos();
        // comprobamos parámetros
        articuloId = gup('ArticuloId');
        if (articuloId !== '') {
            // cargar la tabla con un único valor que es el que corresponde.
            var data = {
                id: articuloId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/articulos/" + articuloId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadTablaArticulos(data);
                },
                                error: function (err) {
                        mensErrorAjax(err);
                        // si hay algo más que hacer lo haremos aquí.
                    }
            });
        } else {
            var fn  = buscarArticulos();
            fn();
        }
    });

     //Evento asociado al cambio de departamento
     $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        var fn  = buscarArticulos();
        fn();
    });
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarArticulos());
    $('#btnAlta').click(crearArticulo());
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarArticulos();
    //});
    //
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
} 


function initTablaArticulos() {
    tablaCarro = $('#dt_articulo').DataTable({
        autoWidth: true,
        paging: true,
        "pageLength": 100,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_articulo'), breakpointDefinition);
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
        data: dataArticulos,
        columns: [{
            data: "nombre"
        }, {
            data: "capitulo"
        },{
            data: "profesion"
        },{
            data: "departamento"
        },{
            data: "codigoReparacion"
        },{
            data: "precioUnitario"
        }, {
            data: "tipoIVA"
        }, {
            data: "articuloId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteArticulo(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editArticulo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
     // Apply the filter
     $("#dt_articulo thead th input[type=text]").on('keyup change', function () {
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

function loadTablaArticulos(data) {
    var dt = $('#dt_articulo').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbArticulo").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbArticulo").show();
    }
}

function buscarArticulos() {
    var mf = function () {
        /*if (!datosOK()) {
            return;
        }*/
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        //if(!aBuscar) aBuscar = "*"
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/articulos/usuario/departamento/" + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaArticulos(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function crearArticulo() {
    var mf = function () {
        var url = "ArticuloDetalle.html?ArticuloId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteArticulo(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                articuloId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/articulos/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#txtBuscar').val('*');
                    var fn = buscarArticulos();
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

function editArticulo(id) {
    // hay que abrir la página de detalle de articulo
    // pasando en la url ese ID
    var url = "ArticuloDetalle.html?ArticuloId=" + id;
    window.open(url, '_new');
}

buscarTodos = function() {
    var url = myconfig.apiUrl + "/api/articulos/?nombre=*";
    llamadaAjax("GET", url, null, function(err, data){
        if (err) return;
        loadTablaArticulos(data);        
    });
};
