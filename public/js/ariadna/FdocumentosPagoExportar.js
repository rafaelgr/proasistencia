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
    datePickerSpanish(); // see comun.js
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

    //Evento de marcar/desmarcar todos los checks
    $('#checkMain').click(
        function(e){
            if($('#checkMain').prop('checked')) {
                $('.checkAll').prop('checked', true);
                updateAll(true);
            } else {
                $('.checkAll').prop('checked', false);
                updateAll(false);
            }
        }
    );
    //
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#btnBuscar2').click(buscarDocumentospago2());
    $('#btnAceptarExportar').click(exportarFacturasDocpago());
    $('#frmBuscar').submit(function () {
        return false
    });

    $('#frmGenerar').submit(function () {
        return false
    });

    $('#frmExportar').submit(function () {
        return false
    });

    $('#chkDocAsociado').prop('checked', true);// se marcan por defecto todos los checks

    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarDocumentospago();
    //});
    //
    $("#cmbProveedores").select2(select2Spanish());
    loadProveedores();

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    initTablaExportar();

    $('#btnExportar').hide();//botón de exportar oculto al inicio
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



function initTablaExportar() {
    tablaFacturas = $('#dt_fExportar').DataTable({
        autoWidth: true,
        paging: false,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_fExportar'), breakpointDefinition);
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
        columns: [{
            data: "facproveId",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAll">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
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
            data: "fechaFactura",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "fecharecepcionFactura",
            render: function (data, type, row) {
                if(!data) return "";
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
        },{
            data: "nombreFacprovePdf",
        },{
            data: "pdf",
        },   {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                if(row.contabilizada && !usuario.puedeEditar) bt1 = '';
                var html = "<div class='pull-right'>" + bt1 + "</div>";
                return html;
            }
        }]

        
    });
    // Apply the filter
    $("#dt_fExportar thead th input[type=text]").on('keyup change', function () {
        tablaFacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}




function datosOk2() {
    $('#frmGenerar').validate({
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
    return $('#frmGenerar').valid();
}


function loadTablaFacturasExp(data) {
    $('#checkMain').prop('checked', false);//al cargar la tabla el check general se encuentra siempre desmarcado
    var dt = $('#dt_fExportar').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbfExportar").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        data.forEach(function (v) {
            var field = "#chk" + v.facproveId;
            if (v.sel == 1) {
                $(field).attr('checked', true);
            }
            $(field).change(function () {
                var quantity = 0;
                var data = {
                    facprove: {
                        facproveId: v.facproveId,
                        empresaId: v.empresaId,
                        proveedorId: v.proveedorId,
                        fecha: moment(v.fechaFactura).format('YYYY-MM-DD'),
                        sel: 0
                    }
                };
                if (this.checked) {
                    data.facprove.sel = 1;
                }
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/api/facturasProveedores/%s', myconfig.apiUrl, v.facproveId);
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
        $("#tbfExportar").show();
        $('#btnExportar').show()//mostramos el botón de exportación
    }
}



function buscarDocumentospago2() {
    var mf = function () {
        if (!datosOk2()) {
            return;
        }
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
                loadTablaFacturasExp(data);
            },
            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function exportarFacturasDocpago() {
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
        var conDocPago = 1;
        if($('#chkDocAsociado').prop('checked')) {
            conDocPago = 1;
        }else {
            conDocPago = 0;
        }
        // obtener el n.serie del certificado para la firma.
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/documentos_pago/exportar/facproves/"+ conDocPago + "/"  + dFecha + "/" + hFecha + "/" + empresaId + "/" + proveedorId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if(data) {
                    $("#mensajeEspera").hide();
                    $("#mensajeExportacion").show();
                    $('#modalExportar').modal('hide');
                    var mens = "Los ficheros pdf con las facturas se encuentran en el directorio de descargas.";
                    mensNormal("Exportación realizada con éxito.");
                    loadTablaFacturasExp(null);
                }else {
                    mensAlerta("Registros no encontrados.");
                    $("#mensajeEspera").hide();
                    $("#mensajeExportacion").show();
                    $('#modalExportar').modal('hide');
                }
            },
            error: function (err) {
                    mensErrorAjax(err);
                    $("#mensajeEspera").hide();
                    $("#mensajeExportacion").show();
                    $('#modalExportar').modal('hide');
                    // si hay algo más que hacer lo haremos aquí.
            }
        });
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
        loadTablaFacturasExp(data);
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

function updateAll(opcion) {
    var datos = null;
    var sel = 0;
    var tb = $('#dt_fExportar').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(opcion) sel = 1
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
            var data = {
                facprove: {
                    facproveId: datos[i].facproveId,
                    empresaId: datos[i].empresaId,
                    proveedorId: datos[i].proveedorId,
                    fecha: moment(datos[i].fechaFactura).format('YYYY-MM-DD'),
                    sel: sel
            }
        };
                
        var data2 = [];
        data2.push(data);
               
        var url = "", type = "";
         // updating record
         var type = "PUT";
         var url = sprintf('%s/api/facturasProveedores/%s', myconfig.apiUrl, datos[i].facproveId);
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
        }
    }
}


function editFactura(id) {
    // hay que abrir la página de detalle de la factura
    // pasando en la url ese ID
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    window.open(url, '_blank');
}