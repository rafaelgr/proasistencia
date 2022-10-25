/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página OfertaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataOfertas;
var ofertaId;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    usuario = recuperarUsuario();
    //
    $('#btnBuscar').click(buscarOfertas());
    $('#btnAlta').click(crearOferta());
    $('#btnPrint').click(imprimirOfertas);
    $('#frmBuscar').submit(function () {
        return false
    });
    // $("#cmbComerciales").select2(select2Spanish());
    // loadComerciales();

    initTablaOfertas();

    ofertaId = gup('OfertaId');
    recuperaDepartamento(function(err, data) {
        if (ofertaId !== '') {
            cargarOfertas(ofertaId);
    
        } else {
            cargarOfertasNoAceptadas();
        }
        
        $('#chkAceptadas').change(function () {
            if (this.checked) {
                cargarOfertas();
            } else {
                cargarOfertasNoAceptadas();
            }
        })
    });
    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        if ($('#chkAceptadas').prop('checked')) {
            cargarOfertas();
    
        } else {
            cargarOfertasNoAceptadas();
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
    //
    // self.comercialId = ko.observable();
    // self.scomercialId = ko.observable();
    // //
    // self.posiblesComerciales = ko.observableArray([]);
    // self.elegidosComerciales = ko.observableArray([]);
    
} 
function initTablaOfertas() {
    tablaOfertas = $('#dt_oferta').DataTable({
        bSort: true,
        "pageLength": 100,
        "aoColumnDefs": [
            { "sType": "date-uk", "aTargets": [3] },
        ],
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [{
                "sExtends": "pdf",
                "sTitle": "Ofertas Seleccionadas",
                "sPdfMessage": "proasistencia PDF Export",
                "sPdfSize": "A4",
                "sPdfOrientation": "landscape",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "copy",
                "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "csv",
                "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "xls",
                "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "print",
                "sMessage": "Ofertas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_oferta'), breakpointDefinition);
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
        data: dataOfertas,
        columns: [{
            data: "contratoId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if(row.servicioId) {
                    html = "<i class='fa fa-file'></i>";
                }
                else if(row.contratoId) {
                    html = "<i class='fa fa-file'></i>";
                }
                return html;
                
            }
        }, {
            data: "referencia"
        }, {
            data: "tipo"
        }, {
            data: "fechaOferta",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "empresa"
        }, {
            data: "cliente"
        }, {
            data: "total"
        }, {
            data: "mantenedor"
        }, {
            data: "agente"
        }, {
            data: "comercialCliente"
        },  {
            data: "observaciones"
        },{
            data: "contratoId",
            render: function (data, type, row) {
                var html = "<i>No</i>";
                if(row.servicioId) {
                    html = "<i>Si</i>";
                }
                else if(data) {
                    html = "<i >Si</i>";
                }
                return html;
                
            }
        },  {
            data: "ofertaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteOferta(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editOferta(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printOferta(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });

    //function sort by date
    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function ( a ) {
            var ukDatea = a.split('/');
            return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        },
        
        "date-uk-asc": function ( a, b ) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        
        "date-uk-desc": function ( a, b ) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });

    // Apply the filter
    $("#dt_oferta thead th input[type=text]").on('keyup change', function () {
        tablaOfertas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaOfertas.columns(7).visible(false);
    tablaOfertas.columns(8).visible(false);
    tablaOfertas.columns(9).visible(false);
    tablaOfertas.columns(10).visible(false);
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

/* function loadComerciales() {
    $.ajax({
        type: "GET",
        url: "/api/comerciales",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposComerciales = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesComerciales(tiposComerciales);
            //vm.scomercialId(0)
            $("#cmbComerciales").val([0]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
} */

function loadTablaOfertas(data) {
    var dt = $('#dt_oferta').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarOfertas() {
    var mf = function () {
        var opcion = $('#chkAceptadas').prop("checked")
        if(opcion) {
            cargarOfertas();
        } else {
            cargarOfertasNoAceptadas()
        }
    };
    return mf;
}

function crearOferta() {
    var mf = function () {
        var url = "OfertaDetalle.html?OfertaId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteOferta(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                ofertaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/ofertas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarOfertas();
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

function editOferta(id) {
    var url = "OfertaDetalle.html?OfertaId=" + id;
    window.open(url, '_new');
}

var cargarOfertas = function (id) {
    var url = myconfig.apiUrl + "/api/ofertas/usuario/logado/departamento/"+ usuario.usuarioId + "/" + vm.sdepartamentoId();
    if (id) {
        url = myconfig.apiUrl + "/api/ofertas/" + ofertaId
    };
    llamadaAjax("GET", url, null, function (err, data) {
        loadTablaOfertas(data);
    });
}

var cargarOfertasNoAceptadas = function (id) {
    var url = myconfig.apiUrl + "/api/ofertas/no-aceptadas/usuario/logado/departamento/"+ usuario.usuarioId + "/" + vm.sdepartamentoId();
    llamadaAjax("GET", url, null, function (err, data) {
        loadTablaOfertas(data);
    });
}

function printOferta(id) {
    var url = "InfOfertas.html?ofertaId=" + id;
    window.open(url, "_new");
}

imprimirOfertas = function () {
    var url = "InfOfertas.html";
    window.open(url, '_blank');
}