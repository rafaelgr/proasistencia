/*-------------------------------------------------------------------------- 
documentpagoGeneral.js
Funciones js par la página DocumentPagoGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataDocumentospago;
var documentoPagoId;
var datosArrayRegistros = [];
var dataRegistros;
var dataAsociarFacturas;
var tablaDocPago;

var filtros = {
    buscar: null
}

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    datePickerSpanish(); // see comun.js
    //
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
    //
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#btnBuscar').click(buscarDocumentospago());
    //$('#btnBuscar2').click(buscarDocumentospago2());
    $('#btnAlta').click(crearDocumentPago());
    $('#btnLimpiar').click(limpiarFiltros)

    $('#frmBuscar').submit(function () {
        return false
    });

    $('#frmRegistros').submit(function () {
        return false
    });btnSalirFacturasRegistros
    
    $('#frmFacturasRegistros').submit(function () {
        return false
    });

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

  

    $('#frmExportar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarDocumentospago();
    //});
    //

    initTablaDocumentospago();
    initTablaRegistros();
    initTablaFacturasRegistros();

    var f = getCookie('filtro_docpago');
    if(f != undefined) {
        filtros = JSON.parse(f);
    }
    
    var conservaFiltro = gup("ConservaFiltro");
    var cleaned = gup("cleaned");
    if(conservaFiltro != 'true' && cleaned != 'true') limpiarFiltros();

    // Add event listener for opening and closing details
    $('#dt_documentoPago').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = tablaDocPago.row(tr);
 
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
    // comprobamos parámetros
    documentoPagoId = gup('DocumentoPagoId');
    if (documentoPagoId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        compruebaFiltros(documentoPagoId)
    } else{
        compruebaFiltros()
    }
}


function admData() {
    var self = this;

    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    self.docAsociado = ko.observable();
   
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);

    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
   


}

/* function createSelect(selItem){
    var fac = selItem
    var sel = "<select><option>" + fac[0].ref+ "</option>" ;
    for(var i = 0; i < fac.length; ++i){
        if(fac[i] == selItem){
            sel += "<option>" + fac[i].ref + "</option>";
        }
        else{
            sel += "<option>" + fac[i].ref + "</option>";
        }
    }
    sel += "</select>";
    return sel;
} */

    function initTablaDocumentospago() {
        tablaDocPago = $('#dt_documentoPago').DataTable({
            autoWidth: true,
            bSort: true,
            "stateSave": true,
            "stateLoaded": function (settings, state) {
                state.columns.forEach(function (column, index) {
                    $('#' + settings.sTableId + '-head-filter-' + index).val(column.search.search);
                });
            },
            "aoColumnDefs": [
                { "sType": "date-uk", "aTargets": [2] }
            ],
            preDrawCallback: function () {
                if (!responsiveHelper_dt_basic) {
                    responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_documentoPago'), breakpointDefinition);
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
            data: dataDocumentospago,
            columns: [
                {
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: ''
                },
                { data: "nombre" },
                {
                    data: "fecha",
                    render: function (data, type, row) {
                        return moment(data).format('DD/MM/YYYY');
                    }
                },
                { data: "pdf" },
                {
                    data: 'facturas',
                    render: function(data, type, row) {
                        var facturasData = data.map(i => `${i.numeroFacturaProveedor} ${i.ref} ${i.proveedorNombre}`).join(", ");
                        return facturasData;
                    }
                },
                {
                    data: 'anticipos',
                    render: function(data, type, row) {
                        var anticiposData = data.map(i => `${i.numeroAnticipoProveedor} ${i.proveedorNombreAnticipo}`).join(", ");
                        return anticiposData;
                    }
                },
                {
                    data: "documentoPagoId",
                    render: function (data, type, row) {
                        var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteDocumentPago(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                        var bt2 = "<button class='btn btn-circle btn-success' onclick='editDocumentPago(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                        var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                        return html;
                    }
                }
            ]
        });
    
        // Añadir la búsqueda por columnas
        $('#dt_documentoPago thead tr:eq(1) th').each(function (i) {
            $('input', this).on('keyup change', function () {
                if (tablaDocPago.column(i).search() !== this.value) {
                    tablaDocPago.column(i).search(this.value).draw();
                }
            });
        });
    
        // Ordenación personalizada por fecha en formato UK
        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "date-uk-pre": function (a) {
                var ukDatea = a.split('/');
                return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
            },
            "date-uk-asc": function (a, b) {
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },
            "date-uk-desc": function (a, b) {
                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            }
        });
    
        tablaDocPago.columns(4).visible(false);
        tablaDocPago.columns(5).visible(false);
    }
    

    function format(d) {
        var fac = d.facturas;
        var ant = d.anticipos;
        var html = "";
    
        html = '<h5>Facturas</h5>';
        html += '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;">';
        fac.forEach(e => {
            html += '<tr>' +
                '<td>REFERENCIA:</td>' +
                '<td>' + e.ref + '</td>' +
                '<td>NÚMERO:</td>' +
                '<td>' + e.numeroFacturaProveedor + '</td>' +
                '<td>PROVEEDOR:</td>' +
                '<td>' + e.proveedorNombre + '</td>' +
            '</tr>';
        });
        html += '</table>';
    
        // Anticipos
        html += '<h5>Anticipos</h5>';
        html += '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;">';
        ant.forEach(e => {
            html += '<tr>' +
                '<td>REFERENCIA:</td>' +
                '<td></td>' +
                '<td>NÚMERO:</td>' +
                '<td>' + e.numeroAnticipoProveedor + '</td>' +
                '<td>PROVEEDOR:</td>' +
                '<td>' + e.proveedorNombreAnticipo + '</td>' +
            '</tr>';
        });
        html += '</table>';
    
        return html;
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


function loadTablaDocumentospago(data) {
    var dt = $('#dt_documentoPago').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbDocumentoPago").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbDocumentoPago").show();
    }
}

function buscarDocumentospago() {
    var mf = function (id) {
        var aBuscar = $('#txtBuscar').val();
        if(aBuscar == '') $('#txtBuscar').val('*')
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        if(id > 0) {
            var data = {
                id: id
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/documentos_pago/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    var data2 = [data];
                    loadTablaDocumentospago(data2);
                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/documentos_pago/?nombre=" + aBuscar,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadTablaDocumentospago(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        }
    };
    return mf;
}

/* function buscarDocumentospago2() {
    var mf = function () {
        var dFecha = 0;
        var hFecha = 0;
        var empresaId = 0;
        var proveedorId = 0;
        if(vm.dFecha()) {
            dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        if(vm.hFecha()) {
            hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        empresaId = vm.sempresaId();
        proveedorId = vm.sproveedorId();
        // obtener el n.serie del certificado para la firma.
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/documentos_pago/buscar/" + dFecha + "/" + hFecha + "/" + empresaId + "/" + proveedorId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaDocumentospago(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}
 */
function crearDocumentPago() {
    var mf = function () {
        var url = "DocumentoPagoDetalle.html?DocumentoPagoId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteDocumentPago(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/documentos_pago/" + id,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    var fn = buscarDocumentospago();
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

function editDocumentPago(id) {
    var buscar  = $('#txtBuscar').val();
    filtros = 
        {
            buscar: buscar
        }
    setCookie("filtro_docpago", JSON.stringify(filtros), 1);
    var url = "DocumentoPagoDetalle.html?DocumentoPagoId=" + id;
    window.open(url, '_self');
}


buscarTodos = function() {
    var url = myconfig.apiUrl + "/api/documentos_pago/?nombre=*";
    llamadaAjax("GET", url, null, function(err, data){
        loadTablaDocumentospago(data);
    });
}

//FUNCIONES RELACIONADAS CON EL MODAL DE BUSQUEDA DE REGISTROS
function loadEmpresas() {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: null, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([0]).trigger('change');
    });
}

function initTablaRegistros() {
    var tablaCarro = $('#dt_registros').dataTable({
        autoWidth: true,
        paging: false,
        "bDestroy": true,
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
        data: dataRegistros,
        columns: [{
            data: "codigo",
            width: "5%",
           /*  render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAllRegistros">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            } */
        }, {
            data: "IdFicheroSEPA"
        },{
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "importe",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "Descripcion"
        }, {
            data: "facturas",
            width: "5%"
        },{
            data: "codigo",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editRegistro(" + data + ");' title='Editar registro' data-toggle='modal' data-target='#modalFacturasRegistros'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }]
    });
}


function buscarRegistros() {
    datosArrayRegistros = []
    $('#dt_registros').dataTable().fnClearTable();
      //$('#dt_Facturas').dataTable().fnDestroy();
        //initTablaFacturas();
        if (!datosOK2()) return;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    
    
        var empresaId = 0;
        if (vm.sempresaId()) empresaId = vm.sempresaId();
      
        var url = myconfig.apiUrl + "/api/documentos_pago/buscar/registros/" + dFecha + "/" + hFecha + "/" + empresaId 
     
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // mostramos el botó de alta
                if(data.length > 0) {
                    $("#btnAceptarRegistros").show();
                } else {
                    mensAlerta("No se han encontrado registros");
                    $("#btnAceptarRegistros").hide();
                }
                $('#checkMainRegistros').prop('checked', false);
                loadTablaRegistros(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
}

function limpiarModal() {
    claves = [];
    datosArrayRegistros = [];    
    vm.dFecha(null);
    vm.hFecha(null);
    vm.empresaId(null);
    loadEmpresas();
    $('#btnAceptarRegistros').hide();
    $('#dt_registros').dataTable().fnClearTable();
   
}

function datosOK2() {
    $('#frmRegistros').validate({
        rules: {
            txtdFecha: {
                required: true
            },
            txthFecha: {
                required: true,
                greaterThan: "#txtdFecha"
            },
            cmbEmpresas: { required: true},


        },
        // Messages for form validation
        messages: {
            txtdFecha: {
                required: "Debe seleccionar una fecha"
            },
            txthFecha: {
                required: "Debe seleccionar una fecha"
            },
            cmbEmpresas: { required: 'Debe introducir una empresa'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmRegistros').valid();
}

function loadTablaRegistros(data) {
    var dt = $('#dt_registros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.codigo;
        $(field).attr('checked', false);
      
        $(field).change(function () {
            if (this.checked) {
                datosArrayRegistros.push(v.codigo);
            } else {
                for(var i=0; i < datosArrayRegistros.length; i++) {
                    if(datosArrayRegistros[i] == v.codigo) {
                        datosArrayRegistros.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
                        break;
                    } 
                }
            }
        });
    });
}

function editRegistro(codigo) {
    var claves = procesaClavesTransferencias(codigo);
    var empresaId = vm.sempresaId();
    var cod = claves[0].nrodocum
    var anyo = claves[0].anyodocum
    $.ajax({
     type: "GET",
     url: myconfig.apiUrl + "/api/documentos_pago/registro/" + cod + "/" + anyo + "/" + empresaId,
     dataType: "json",
     contentType: "application/json",
     data: null,
     success: function (data, status) {
         if(data) {
            loadTablaFacturasRegistros(data)
             return;
         }
         mensNormal("No se han encontrado registros.")
         
     },
     error: function (err) {
         mensErrorAjax(err);
         // si hay algo más que hacer lo haremos aquí.
     }
 });
 }

 function initTablaFacturasRegistros() {
    var tablaCarro = $('#dt_facturasRegistros').dataTable({
        autoWidth: true,
        paging: false,
        "bDestroy": true,
        columnDefs: [{
            "width": "10%",
            "targets": 0
        }],
        
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
        data: dataAsociarFacturas,
        columns: [{
            data: "facproveId",
            width: "10%",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                return html;
            }
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        },  {
            data: "numeroFacturaProveedor"
        },{
            data: "ref"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
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
        }, {
            data: "formaPago"
        }]
    });
}


 function loadTablaFacturasRegistros(data) {
    var dt = $('#dt_facturasRegistros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function cierraModal() {
    $('#modalFacturasRegistros').modal('hide'); 
}

function editRegistro(codigo) {
    var claves = procesaClavesTransferencias(codigo);
    var empresaId = vm.sempresaId();
    var cod = claves[0].nrodocum
    var anyo = claves[0].anyodocum
    $.ajax({
     type: "GET",
     url: myconfig.apiUrl + "/api/documentos_pago/registro/" + cod + "/" + anyo + "/" + empresaId,
     dataType: "json",
     contentType: "application/json",
     data: null,
     success: function (data, status) {
         if(data) {
            loadTablaFacturasRegistros(data)
             return;
         }
         mensNormal("No se han encontrado registros.")
         
     },
     error: function (err) {
         mensErrorAjax(err);
         // si hay algo más que hacer lo haremos aquí.
     }
 });
 }


function procesaClavesTransferencias(cod) {
    var arr = [];
    var c = datosArrayRegistros;
    if(cod) {
        c = [];
        cod = cod.toString();
        c.push(cod);
    }
    c.forEach(e => {
        var obj = {};
        var anyo = e.substr(-4);
        var i = e.indexOf(anyo);
        var cod = e.substr(0, i);

        obj = {
            nrodocum: cod,
            anyodocum: anyo
        }
        arr.push(obj);
    });
    return arr;
}

//FILTROS 

function compruebaFiltros(id) {
    if(filtros) {
            $('#txtBuscar').val(filtros.buscar);
            buscarDocumentospago()(id);
    } else {
        buscarDocumentospago()(id);
    }
}

var limpiarFiltros = function() {
    var returnUrl = "DocumentosPagoGeneral.html?cleaned=true"
    deleteCookie('filtro_docpago');
    tablaDocPago.state.clear();
    window.open(returnUrl, '_self');
}




