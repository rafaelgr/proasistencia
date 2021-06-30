/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página PrefacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var facproveId;
var usuario;
var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
var tablaFacturas;
var antDepartamentoId;

var antproveId;
var filtros = {};


function initForm() {
    comprobarLogin();
    datePickerSpanish(); // see comun.js
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarFacturas());
    $('#btnAlta').click(crearFactura());
    $('#btnPrint').click(imprimirFactura);
    $('#btnLimpiar').click(limpiarFiltros)
    $('#frmBuscar').submit(function () {
        return false
    });

    vm = new admData();
    ko.applyBindings(vm);

    $("#cmbEmpresas").select2(select2Spanish());

    filtros = getCookie('filtro_facproves');
    if(filtros != undefined) {
        filtros = JSON.parse(filtros);
    }

    //validacion de fecha mayor que fecha
    $.validator.addMethod("greaterThan",
    function (value, element, params) {
        var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
        var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
        if (!/Invalid|NaN/.test(new Date(fv))) {
            return new Date(fv) >= new Date(fp);
        } else {
            // esto es debido a que permitimos que la segunda fecha nula
            return true;
        }
    }, 'La fecha final debe ser mayor que la inicial.');

    initTablaFacturas();
    cargarFacturas2()();

    

   
   
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);

    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    
} 


function initTablaFacturas() {
    tablaFacturas = $('#dt_factura').DataTable({
        bSort: true,
        "stateSave": true,
        "stateLoaded": function (settings, state) {
            state.columns.forEach(function (column, index) {
                $('#' + settings.sTableId + '-head-filter-' + index).val(column.search.search);
             });
        },
        "aoColumnDefs": [
            { "sType": "date-uk", "aTargets": [5] },
        ],
        
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "Facturas Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_factura'), breakpointDefinition);
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
        data: dataFacturas,
        columns: [{
            data: "facproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "ref"
        },{
            data: "numeroFacturaProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        },  {
            data: "fecha",
            render: function (data, type, row) {
                if(!data) return "";
                return moment(data).format('DD/MM/YYYY');
            }
        },  {
            data: "fecha_recepcion",
            render: function (data, type, row) {
                if(!data) return "";
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "total",
            render: function (data, type, row) {
                var string = numeral(data).format('0.00');
                return string;
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                var string = numeral(data).format('0.00');
                return string;
            }
        },  {
            data: "vFPago"
        }, {
            data: "emisorNif"
        },{
            data: "numregisconta",
        },   {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                if(row.contabilizada && !usuario.puedeEditar) bt1 = '';
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
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
    $("#dt_factura thead th input[type=text]").on('keyup change', function () {
        tablaFacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
    tablaFacturas.column(10).visible(false);

}


function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarFacturas() {
    var mf = function () {
        if ($('#chkTodos').prop('checked')) {
            cargarFacturas2All()();
        } else {
            cargarFacturas2()();
        }
    };
    return mf;
}







function cargarFacturas2(id) {
    var mf = function() {
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = vm.hFecha();
        if(hFecha == '' || hFecha == undefined) hFecha = null;
        if(hFecha != null) {
            if(hFecha != null) hFecha = moment(hFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(!datosOK()) return;
        }
        if (id) {
            var data = {
                id: id
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/todos/los/registros/tabla/auditada",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacturas(data);
                    return;
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/usuario/logado/departamento/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha + "/" + vm.sempresaId(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacturas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    }
    return mf
}

function cargarFacturas2All() {
    var mf = function() {
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = vm.hFecha();
        if(hFecha == '' || hFecha == undefined) hFecha = null;
        if(hFecha != null) {
            if(hFecha != null) hFecha = moment(hFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(!datosOK()) return;
        }
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/usuario/logado/departamento/all/"  +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha + "/" + vm.sempresaId(),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaFacturas(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
    return mf;
}



