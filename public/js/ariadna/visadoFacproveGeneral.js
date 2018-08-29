/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacturaGeneral.html
PROVEEDORES
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var dataContrato;
var facproveId;
var init = 0;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    
    vm = new admData();
    ko.applyBindings(vm);
   
    $('#frmBuscar').submit(function () {
        return false
    });

    $('#chkVisadas').change(function () {
        var visada = 0;
        checkCerrados =  this;
        if (this.checked) {
            visada = 1;
        } 
        var url = myconfig.apiUrl + "/api/facturasProveedores/visadas/facturas-proveedor/todas/" + visada;
        llamadaAjax("GET", url, null, function(err, data){
            if (err) return;
            loadTablaFacturas(data);
        });
    });

    initTablaFacturas();
    buscarFacturas()();
    // comprobamos parámetros
    facproveId = gup('FacturaId');
}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
}

function initTablaFacturas() {
    tablaCarro = $('#dt_factura').dataTable({
        autoWidth: true,
        paging: false,
        "bDestroy": true,
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
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "dirTrabajo"
        }, {
            data: "vNum"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "total"
        }, {
            data: "totalConIva"
        }, {
            data: "formaPago"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-info' title='Contrato asociado' data-toggle='modal' data-target='#modalContrato' onclick='initModal(" + data + ");' title='Consulta de resultados de contrato'> <i class='fa fa-fw fa-files-o'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });
}

function initModal(facproveId) {
    init++

    $('#modalContrato').on('hidden.bs.modal', function () {
        $('#modalContrato').off('show.bs.modal');
    });
    if(init == 1){
        $('#modalContrato').on('show.bs.modal', function (e) {
            initTablaContratos(facproveId);
        })
    }else {
        cargarContratos()(facproveId);
    }
}

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.facproveId;
        if (v.visada == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                facprove: {
                    facproveId: v.facproveId,
                    empresaId: v.empresaId,
                    proveedorId: v.proveedorId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    visada: 0
                }
            };
            if (this.checked) {
                data.facprove.visada = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/facturasProveedores/visadas/modificar/%s', myconfig.apiUrl, v.facproveId);
            var data2 = [];
            data2.push(data);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data2),
                success: function (data, status) {

                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        });
    });
}

function buscarFacturas() {
    var mf = function () {
        
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/visadas/facturas-proveedor/todas/" + 0,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaFacturas(data);
                // mostramos el botén de alta
                $("#btnAlta").show();
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}




function initTablaContratos(facproveId) {
    tablaCarro = $('#dt_contrato').dataTable({
        autoWidth: false,
        paging: false,
        "bDestroy": true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_contrato'), breakpointDefinition);
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
        data: dataContrato,
        columns: [{
            data: "referencia"
        }, {
            data: "empresa"
        }, {
            data: "estado"
        }, {
            data: "ITC"
        }, {
            data: "pAgente"
        }, {
            data: "IA"
        }, {
            data: "INT"
        }, {
            data: "CT"
        }, {
            data: "BT"
        }, {
            data: "pBT"
        }, {
            data: "IF"
        }, {
            data: "INR"
        }, {
            data: "CR"
        }, {
            data: "BR"
        },{
            data: "pBR"
        }]
    });
    if(init == 1){
        cargarContratos()(facproveId);
    }
}

function cargarContratos() {
    var mf = function (facproveId) {
        if (facproveId) {
            var data = null;
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/contratos/asociado/facprove/resultado/" + facproveId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaContratos(data);
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

function loadTablaContratos(data) {
    var dt = $('#dt_contrato').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function resultadosContrato(id) {
    /*$.ajax({
        type: "DELETE",
        url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            var fn = buscarFacturas();
            fn();
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });*/
}

function editFactura(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    window.open(url, '_new');
}

function cargarFacturas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: facproveId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + facproveId,
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
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores",
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
    };
    return mf;
}

function printFactura(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/facturasProveedores/" + id,
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