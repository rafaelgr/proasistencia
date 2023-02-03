/*-------------------------------------------------------------------------- 
preantturaGeneral.js
Funciones js par la página PreantturaGeneral.html

---------------------------------------------------------------------------*/


var dataAnticipos;
var antproveId;
var usuario;



function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarAnticipos());
    $('#btnAlta').click(crearAnticipo());
    $('#btnPrint').click(imprimirAnticipo);
    $('#frmBuscar').submit(function () {
        return false
    });
    
    //Evento asociadpo al checkbox
    $('#chkTodos').change(function () {
        if (this.checked) {
            cargarAnticipos2All();
        } else {
            cargarAnticipos2();
        }
    });

    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        cargarAnticipos()();
    });

    vm = new admData();
    ko.applyBindings(vm);

    recuperaDepartamento(function(err, data) {
        if(err) return;
        initTablaAnticipos();
        // comprobamos parámetros
        antproveId = gup('antproveId');
        if (antproveId !== '') {
    
            // Si nos pasan una prefafctura determinada esa es
            // la que mostramos en el grid
            cargarAnticipos()(antproveId);
    
        } else {
    
            // Por defecto ahora a la entrada se van a cargar todas 
            // las antturas que tengamos en el sistema. En un futuro este
            // criterio puede cambiar y habrá que adaptarlo.
            cargarAnticipos()();
        }
    });
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
} 

function initTablaAnticipos() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 6 || column === 7 || column === 8) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 10) {
                            return "";
                        } else {
                            return data;
                        };
                    }
                }
            }
        }
    };
    tablaAnticipos = $('#dt_anticipo').DataTable({
        bSort: true,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'Br><'col-sm-6 col-xs-6 hidden-xs' 'l C>r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            } ), 
            {
               
                extend: 'pdf',
                orientation: 'landscape',
                pageSize: 'LEGAL'
            }, 
            'print'
        ],
        autoWidth: true,
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
        data: dataAnticipos,
        columns: [{
            data: "antproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "numeroAnticipoProveedor"
        }, {
            data: "referencia"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },{
            data: "importeServiciado",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        },{
            data: "total",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        },  {
            data: "vFPago"
        }, {
            data: "antproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteAnticipo(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editAnticipo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printAnticipo2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                if(row.contabilizada) bt1 = '';
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_anticipo thead th input[type=text]").on('keyup change', function () {
        tablaAnticipos
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
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

function loadTablaAnticipos(data) {
    var dt = $('#dt_anticipo').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarAnticipos() {
    var mf = function () {
        cargarAnticipos()();
    };
    return mf;
}

function crearAnticipo() {
    var mf = function () {
        var url = "AnticipoColaboradorDetalle.html?antproveId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteAnticipo(id) {
    var mens;
    $.ajax({//buscamos la factura asociada para extraer su facproveId
        type: "GET",
        url: myconfig.apiUrl + "/api/anticiposProveedores/" + id,
        dataType: "json",
        contentType: "application/json",
        data: null,
        success: function (data, status) {
            if(data.facproveId) {
                mens = "Este registro tiene facturas asociadas, ¿realmente desea borrarlo?";
            } else {
                 mens = "¿Realmente desea borrar este registro?";
            }
            // mensaje de confirmación
    
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                id: antproveId
            }
            $.ajax({//buscamos la factura asociada para extraer su facproveId
                type: "GET",
                url: myconfig.apiUrl + "/api/anticiposProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var data2 = {
                        antproveId: id,
                        facproveId: data.facproveId
                    };
                    $.ajax({
                        type: "DELETE",
                        url: myconfig.apiUrl + "/api/anticiposProveedores/" + id,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data2),
                        success: function (data, status) {
                            var fn = buscarAnticipos();
                            fn();
                        },
                        error: function (err) {
                            mensErrorAjax(err);
                            // si hay algo más que hacer lo haremos aquí.
                        }
                    });
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
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function editAnticipo(id) {
    // hay que abrir la página de detalle de anticipo
    // pasando en la url ese ID
    var url = "AnticipoColaboradorDetalle.html?antproveId=" + id;
    window.open(url, '_new');
}

function cargarAnticipos() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: antproveId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/anticiposProveedores/serviciado/" + antproveId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaAnticipos(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            var esColaborador = 1
            $('#chkTodos').prop("checked", false);
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/anticiposProveedores/usuario/logado/departamento/nueva/"  + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + esColaborador,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaAnticipos(data);
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

function printPrefactura(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/prefacturas/" + id,
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

function printAnticipo2(id) {
    var url = "InfAnticiposProveedores.html?antproveId=" + id;
    window.open(url, "_new");
}


function informePDF(data) {
    var shortid = "HyGQ0yAP";
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

function cargarAnticipos2() {
    var esColaborador = 1
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/anticiposProveedores/usuario/logado/departamento/nueva/" + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + esColaborador,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaAnticipos(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cargarAnticipos2All() {
    var esColaborador = 1
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/anticiposProveedores/usuario/logado/departamento/all/nueva/" + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + esColaborador,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaAnticipos(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


imprimirAnticipo = function () {
    var url = "InfAnticiposProveedores.html";
    window.open(url, '_blank');
}