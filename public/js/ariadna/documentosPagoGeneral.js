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
    $('#btnBuscar2').click(buscarDocumentospago2());
    $('#btnAceptarExportar').click(exportarDocumentospago());
    $('#btnAlta').click(crearDocumentPago());
    $('#frmBuscar').submit(function () {
        return false
    });

  

    $('#frmExportar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarDocumentospago();
    //});
    //
    $("#cmbProveedores").select2(select2Spanish());
    loadProveedores();

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    initTablaDocumentospago();

    // Add event listener for opening and closing details
    $('#dt_documentoPago').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = tablaCarro.row(tr);
 
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
        var data = {
            id: documentoPagoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
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
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    } else{
        buscarTodos();
    }
}


function admData() {
    var self = this;

    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    self.docAsociado = ko.observable();
   
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
    tablaCarro = $('#dt_documentoPago').DataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
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
        data: dataDocumentospago,
        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            {
            data: "nombre"
        },{
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },  {
            data: "pdf"
        }, {
            data: 'facturas',
            render: function(data, type, row) {
              var facturasData = [];
              if(data.length > 0) {
                data.forEach((i) => {
                    facturasData.push(i.numeroFacturaProveedor);
                    facturasData.push(i.ref);
                    facturasData.push(i.proveedorNombre);
                    //facturasData.push(rowEl.Menge);
                  });
                  return facturasData;
                } else {
                    return "";
                }
              }
            
        },
        {
            data: 'anticipos',
            render: function(data, type, row) {
              var anticiposData = [];
              if(data.length > 0) {
                data.forEach((i) => {
                    anticiposData.push(i.numeroAnticipoProveedor);
                    anticiposData.push(i.proveedorNombreAnticipo);
                    //facturasData.push(rowEl.Menge);
                  });
                  return anticiposData;
                }else {
                    return "";
                }
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
        }]
    });

    tablaCarro.columns(4).visible(false);
    tablaCarro.columns(5).visible(false);
}

function format(d) {
    var fac = d.facturas;
    var ant = d.anticipos;
    var html = "";
    html = '<h5> Facturas</h5>'
    html += '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;">'
    fac.forEach(e => {
         html += '<tr>' +
            '<td>REFERENCIA:</td>' +
            '<td>' +
                e.ref +
            '</td>' +
            '<td>NÚMERO:</td>' +
            '<td>' +
                e.numeroFacturaProveedor +
            '</td>' +
            '<td>PROVEEDOR:</td>' +
            '<td>' +
                e.proveedorNombre +
            '</td>' +
        '</tr>'
       
    });
    html +=  '</table>'
        //anticipos
        html += '<h5>Anticipos</h5>'
        html += '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;">'
        ant.forEach(e => {
            html += '<tr>' +
                '<td>REFERENCIA:</td>' +
                '<td>' +
                '</td>' +
                '<td>NÚMERO:</td>' +
                '<td>' +
                    e.numeroAnticipoProveedor +
                '</td>' +
                '<td>PROVEEDOR:</td>' +
                '<td>' +
                    e.proveedorNombreAnticipo +
                '</td>' +
            '</tr>' 
        });
        html +=  '</table>'
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
    var mf = function () {
        var aBuscar = $('#txtBuscar').val();
        if(aBuscar == '') $('#txtBuscar').val('*')
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
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
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function buscarDocumentospago2() {
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

function exportarDocumentospago() {
    var mf = function () {
        if (!datosOk2()) {
            return;
        }
        $("#mensajeExportacion").hide();
        $("#mensajeEspera").show();
        var proveedorId = 0;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var empresaId = vm.sempresaId();
        var proveedorId = vm.sproveedorId();
        var conDocPago = vm.docAsociado();
        if(conDocPago) {
            conDocPago = 1;
        }else {
            conDocPago = 0;
        }
        // obtener el n.serie del certificado para la firma.
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/documentos_pago/exportar/"+ conDocPago + "/"  + dFecha + "/" + hFecha + "/" + empresaId + "/" + proveedorId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if(data) {
                    $("#mensajeEspera").hide();
                    $("#mensajeExportacion").show();
                    $('#modalExportar').modal('hide');
                    var mens = "Los ficheros pdf con las facturas se encuentran en el directorio de descargas.";
                    mensNormal("Exportación realizada con éxito.");
                }
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

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
    // hay que abrir la página de detalle de documentpago
    // pasando en la url ese ID
    var url = "DocumentoPagoDetalle.html?DocumentoPagoId=" + id;
    window.open(url, '_self');
}


buscarTodos = function() {
    var url = myconfig.apiUrl + "/api/documentos_pago/?nombre=*";
    llamadaAjax("GET", url, null, function(err, data){
        loadTablaDocumentospago(data);
    });
}

function loadProveedores() {
    llamadaAjax("GET", "/api/proveedores", null, function (err, data) {
        if (err) return;
        var proveedores = [{ proveedorId: 0, nombre: "" }].concat(data);
        vm.posiblesProveedores(proveedores);
        vm.sproveedorId(0)
        $("#cmbProveedores").val(0).trigger('change');
    });
}

function loadEmpresas() {
    $.ajax({
        type: "GET",
        url: "/api/empresas",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var empresas = [{ empresaId: 0, nombre: null }].concat(data);
            vm.posiblesEmpresas(empresas);
            $("#cmbEmpresas").val(null).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}