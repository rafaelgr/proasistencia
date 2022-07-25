/*-------------------------------------------------------------------------- 
documentopagoDetalle.js
Funciones js par la página DocumentoPagoDetalle.html
---------------------------------------------------------------------------*/

var documentoPagoId = 0;
var usuario;
var esFactura = false;
var datosArrayRegistros = []

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


var dataFacturasAsociadas;
var dataAsociarFacturas;



function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    // /
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar);
    //$("#btnbuscarAsociarFacturas").click(aceptarBuscarAsociarFacturas()());
    
    $("#btnSalir").click(salir());
    $("#frmDocumentoPago").submit(function() {
        return false;
    });

    $("#frmAsociarFacturas").submit(function() {
        return false;
    });

    $("#frmNuevaFacturaAsociada").submit(function() {
        return false;
    });


    $("#frmFacturasRegistros").submit(function() {
        return false;
    });

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    $("#cmbDepartamentos").select2(select2Spanish());
    loadDeparta();

    //Evento de marcar/desmarcar todos los checks del grid facturas de gastos
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

    //Evento de marcar/desmarcar todos los checks del grid de transferencias
    $('#checkMainRegistros').click(
        function(e){
            if($('#checkMainRegistros').prop('checked')) {
                $('.checkAllRegistros').prop('checked', true);
                updateAllRegistros(true);
            } else {
                $('.checkAllRegistros').prop('checked', false);
                updateAllRegistros(false);
            }
        }
    );

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

    $('#btnAceptarAsociarFacturas').hide()//botón oculto por defecto
    initTablaFacturasAsociadas();
    initTablaAsociarFacturas();
    initTablaAsociarRegistros();
    initTablaFacturasRegistros();


    $('#upload-input').on('change', function () {
        var files = $(this).get(0).files;
        
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();
        // loop through all the selected files and add them to the formData object
        
        var file = files[0];
        var ext = file.name.split('.').pop().toLowerCase();
                
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, usuario.usuarioId + "@" + file.name);
            
            $.ajax({
                url: '/api/upload/docpago',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    filename = data;
                    vm.pdf(filename);
                    checkVisibility(filename);
                },
                xhr: function () {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            // update the Bootstrap progress bar with the new percentage
                            $('.progress-bar').text(percentComplete + '%');
                            $('.progress-bar').width(percentComplete + '%');
                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                $('.progress-bar').html('Fichero subido');
                            }
                        }
                    }, false);
                    return xhr;
                },
                error: function (xhr, textStatus, errorThrwon) {
                    var m = xhr.responseText;
                    if (!m) m = "Error al cargar";
                    mensError(m);
                    return;
                }
            });
    });


    documentoPagoId = gup('DocumentoPagoId');
    cmd = gup("cmd");
    if (documentoPagoId != 0) {
        var data = {
                documentoPagoId: documentoPagoId
            }
            if (cmd == "nuevo") {
                mensNormal("Docuemnto de pago creado con exito, puede ahora adjuntar las facturas de gastos asociadas.");
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                $('#facturasAsociadas').show();
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.documentoPagoId(0);
        $("#cmbTiposProfesional").select2(select2Spanish());
        $('#facturasAsociadas').hide();
    }
}

function admData() {
    var self = this;
    self.documentoPagoId = ko.observable();
    self.nombre = ko.observable();
    self.fecha = ko.observable();
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    self.facproveId = ko.observable();
    self.pdf = ko.observable();
    self.facturas = ko.observableArray([]);
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
}

function loadData(data) {
    vm.documentoPagoId(data.documentoPagoId);
    vm.nombre(data.nombre);
    vm.fecha(spanishDate(data.fecha));
    vm.pdf(data.pdf);
     //se carga el pdf de la factura si existe
     if(vm.pdf()) {
        loadDoc(vm.pdf());
    }
    vm.facturas(data.facturas);
    loadTablaFacturas(data.facturas);
}

function datosOK() {
    
    $('#frmDocumentoPago').validate({
        rules: {
            txtNombre: {
                required: true
            },
            txtFecha: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNombre: {
                required: 'Introduzca el nombre'
            },
            txtFecha: {
                required: 'Introduzca una fecha'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmDocumentoPago").validate().settings;
    return $('#frmDocumentoPago').valid();
}

function datosOK2() {
    $('#frmAsociarFacturas').validate({
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
    return $('#frmAsociarFacturas').valid();
}


function aceptar() {
        if (!datosOK())
            return;
        var data = {
            documentoPago: {
                "documentoPagoId": vm.documentoPagoId(),
                "nombre": vm.nombre(),
                "fecha":spanishDbDate(vm.fecha()),
                "pdf": vm.pdf(),
            }
        };
        var verb = "POST";
        var url =   myconfig.apiUrl + "/api/documentos_pago"
        var returnUrl = "DocumentoPagoDetalle.html?cmd=nuevo&DocumentoPagoId=" + vm.documentoPagoId()
    
    
        // caso modificación
        if (documentoPagoId != 0) {
            verb = "PUT";
            url =  myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId;
            returnUrl = "DocumentosPagoGeneral.html?DocumentoPagoId=";
        }
            $.ajax({
                type: verb,
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    returnUrl = returnUrl + data.documentoPagoId;
                    window.open(returnUrl, '_self');
                },
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
}

function salir() {
    var mf = function() {
        var url = "DocumentosPagoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function initTablaFacturasAsociadas() {
    tablaCarro = $('#dt_FacturasAsociadas').DataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_FacturasAsociadas'), breakpointDefinition);
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
        data: dataFacturasAsociadas,
        columns: [{
            data: "numeroFacturaProveedor"
        }, {
            data: "ref"
        },
        {
            data: "proveedorNombre"
        }, {
            data: "fechaFactura",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
           
        },{
            data: "total",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "totalConIva",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "pdfFactura"
        },  {
            data: "facproveId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='desvinculaFactura(" + data + ");' title='Desvincular registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg'  onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}


function loadTablaFacturas(data) {
    var dt = $('#dt_FacturasAsociadas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function loadEmpresas() {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: null, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([0]).trigger('change');
    });
}


function loadDeparta() {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: 0, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentos").val([0]).trigger('change');
    });
}


//modal asociación facturas


function initTablaAsociarFacturas() {
    tablaCarro = $('#dt_asociarFacturas').dataTable({
        autoWidth: true,
        paging: false,
        "bDestroy": true,
        columnDefs: [{
            "width": "10%",
            "targets": 0
        }],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asociarFacturas'), breakpointDefinition);
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
        data: dataAsociarFacturas,
        columns: [{
            data: "facproveId",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAll">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
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
        },{
            data: "proveedorNombre"
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
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }]
    });
}


function initTablaAsociarRegistros() {
    tablaCarro = $('#dt_asociarRegistros').dataTable({
        autoWidth: true,
        paging: false,
        "bDestroy": true,
        columnDefs: [{
            "width": "10%",
            "targets": 0
        }],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asociarRegistros'), breakpointDefinition);
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
        data: dataAsociarFacturas,
        columns: [{
            data: "codigo",
            width: "5%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAllRegistros">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
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

function loadTablaAsociarFacturas(data) {
    var dt = $('#dt_asociarFacturas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
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
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    sel: 0
                }
            };
            if (this.checked) {
                data.facprove.sel = 1;
            }
            var datosArray = [];
            datosArray.push(data)
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/facturasProveedores/%s', myconfig.apiUrl, v.facproveId);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(datosArray),
                success: function (data, status) {

                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        });
    });
}

function loadTablaAsociarRegistros(data) {
    var dt = $('#dt_asociarRegistros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.codigo;
        $(field).attr('checked', true);
        
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

function aceptarBuscarAsociar() {
    if(esFactura) {
        buscarAsociarFacturas();
    } else {
        buscarAsociarRegistros();
    }
      
}

function buscarAsociarFacturas() {
    $('#dt_asociarFacturas').dataTable().fnClearTable();
      //$('#dt_asociarFacturas').dataTable().fnDestroy();
        //initTablaAsociarFacturas();
        if (!datosOK2()) return;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    
        var proveedorId = 0
        var departamentoId = 0;
        if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
        var empresaId = 0;
        if (vm.sempresaId()) empresaId = vm.sempresaId();
        var esCorreo = 0;
      
        var url = myconfig.apiUrl + "/api/facturasProveedores/correo/" + dFecha + "/" + hFecha
        + "/" + proveedorId 
        + "/" + empresaId 
        + "/"  + departamentoId 
        + "/" + usuario.usuarioId
        + "/" + esCorreo;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaAsociarFacturas(data);
                // mostramos el botén de alta
                $('#checkMain').prop('checked', false);
                if(data.length > 0)  $("#btnAceptarAsociarFacturas").show();
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
}

function buscarAsociarRegistros() {
    $('#dt_asociarRegistros').dataTable().fnClearTable();
      //$('#dt_asociarFacturas').dataTable().fnDestroy();
        //initTablaAsociarFacturas();
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
                loadTablaAsociarRegistros(data);
                // mostramos el botó de alta
                if(data.length > 0)  $("#btnAceptarAsociarFacturas").show();
                $('#checkMainRegistros').prop('checked', true);
                updateAllRegistros(true);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
}

function aceptarAsociar() {
    if(esFactura) {
        aceptarAsociarFacturas();
    } else {
        aceptarAsociarRegistros();
    }
}
function aceptarAsociarFacturas() {
    var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');

    var departamentoId = 0;
    if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
    var empresaId = 0;
    if (vm.sempresaId()) empresaId = vm.sempresaId();
   
    var data = 
    {
        docfac: 
        {
            dFecha: dFecha,
            hFecha: hFecha,
            empresaId: empresaId,
            departamentoId: departamentoId,
            documentoPagoId: documentoPagoId
        }
    }
  
    $.ajax({
        type: "POST",
        url: myconfig.apiUrl + "/api/documentos_pago/facturas",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            mensNormal("Se han asociado las facturas correctamente.");
            $('#modalAsociarRegistros').modal('hide');
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
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

function aceptarAsociarRegistros() {
    var claves = procesaClavesTransferencias(null);
    var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');

   
    var empresaId = 0;
    if (vm.sempresaId()) empresaId = vm.sempresaId();
   
    var data = 
    {
        docfac: 
        {
            dFecha: dFecha,
            hFecha: hFecha,
            empresaId: empresaId,
            documentoPagoId: documentoPagoId,
            claves: claves
        }
    }
  
    $.ajax({
        type: "POST",
        url: myconfig.apiUrl + "/api/documentos_pago/registros",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            mensNormal("Se han asociado las facturas correctamente.")
            $('#modalAsociarRegistros').modal('hide');
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
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

function limpiarModal(opcion) {
    esFactura = opcion;
    if(!esFactura) {
        $('#dep').hide();
        $('#tbAsociarfacturas').hide();
        $('#tbAsociarRegistros').show();
    } else {
        $('#dep').show();
        $('#tbAsociarfacturas').show();
        $('#tbAsociarRegistros').hide();
    }
    $('#btnAceptarAsociarFacturas').hide()
    vm.dFecha(null);
    vm.hFecha(null);
    vm.departamentoId(null);
    vm.empresaId(null);
    loadEmpresas()
    loadDeparta();
    $('#dt_asociarFacturas').dataTable().fnClearTable();
    $('#dt_asociarRegistros').dataTable().fnClearTable();
    //$('#dt_asociarFacturas').dataTable().fnDestroy();
}


function updateAll(opcion) {
    var sel = 0;
    if(opcion) sel = 1
    var tb = $('#dt_asociarFacturas').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    var length = datos.length;
    if(opcion) sel = 1
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
                var data = {
                    facprove: {
                        facproveId: datos[i].facproveId,
                        empresaId: datos[i].empresaId,
                        proveedorId: datos[i].proveedorId,
                        fecha: moment(datos[i].fecha).format('YYYY-MM-DD'),
                        sel: sel
                    }
                };
                
                var datosArray = [];
                datosArray.push(data)
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/api/facturasProveedores/%s', myconfig.apiUrl, datos[i].facproveId);
                $.ajax({
                    type: type,
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(datosArray),
                    success: function (data, status) {
    
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                    }
                });
        
    
        }
    }
}

function updateAllRegistros(opcion) {
    datosArrayRegistros = [];
    var tb = $('#dt_asociarRegistros').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(datos) {
        if(opcion) {
            for( var i = 0; i < datos.length; i++) {
                datosArrayRegistros.push(datos[i].codigo);
            }
        } 
       
    }
}

//modal facturas de pagos conta


function initTablaFacturasRegistros() {
    tablaCarro = $('#dt_facturasRegistros').dataTable({
        autoWidth: true,
        paging: false,
        "bDestroy": true,
        columnDefs: [{
            "width": "10%",
            "targets": 0
        }],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_facturasRegistros'), breakpointDefinition);
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
 


function loadTablaFacturasRegistros(data) {
    var dt = $('#dt_facturasRegistros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}



//funciones de la pestaña de facturas en PDF

function loadDoc(filename) {
    var ext = filename.split('.').pop().toLowerCase();
    if (ext == "pdf" || ext == "jpg" || ext == "png" || ext == "gif") {
        // see it in container
        var url = "/../../../ficheros/docpago/" + filename;
        if (ext == "pdf") {
            // <iframe src="" width="100%" height="600px"></iframe>
            $("#docContainer").html('<iframe src="' + url + '"frameborder="0" width="100%" height="600px"></iframe>');
        } else {
            // .html("<img src=' + this.href + '>");
            $("#docContainer").html('<img src="' + url + '" width="100%">');;
        }
        $("#msgContainer").html('');
    } else {
        $("#msgContainer").html('Vista previa no dispònible');
        $("#docContainer").html('');
    }
}


 function checkVisibility(filename) {
    var ext = filename.split('.').pop().toLowerCase();
    if (ext == "pdf" || ext == "jpg" || ext == "png" || ext == "gif") {
        // see it in container
        var url = "/ficheros/docpago/" + filename;
        if (ext == "pdf") {
            // <iframe src="" width="100%" height="600px"></iframe>
            $("#docContainer").html('<iframe src="' + url + '"frameborder="0" width="100%" height="600px"></iframe>');
        } else {
            // .html("<img src=' + this.href + '>");
            $("#docContainer").html('<img src="' + url + '" width="100%">');;
        }
        $("#msgContainer").html('');
    } else {
        $("#msgContainer").html('Vista previa no dispònible');
        $("#docContainer").html('');
    }
}

function editFactura(id) {
    // hay que abrir la página de detalle de la factura
    // pasando en la url ese ID
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    window.open(url, '_blank');
}


function desvinculaFactura(id) {
    var arr = [ {
        documentoPagoId: documentoPagoId,
        facproveId: id
    }];
    $.ajax({
        type: "DELETE",
        url: myconfig.apiUrl + "/api/documentos_pago/delete/docpago-facprove",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(arr),
        success: function (data, status) {
            //buscamos ahora los datos para refrescar
            
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    if(data.facturas) {
                        vm.facturas(data.facturas);
                        loadTablaFacturas(data.facturas);
                        return;
                    }
                    vm.facturas([]);
                    loadTablaFacturas([])
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

function desvinculaFacturas() {
    var arr = vm.facturas();
    arr.forEach(e => {
        e.documentoPagoId = documentoPagoId;
    });
    $.ajax({
        type: "DELETE",
        url: myconfig.apiUrl + "/api/documentos_pago/delete/docpago-facprove",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(arr),
        success: function (data, status) {
            //buscamos ahora los datos para refrescar
            
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/documentos_pago/" + documentoPagoId,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    if(data.facturas) {
                        loadTablaFacturas(data.facturas);
                        return;
                    }
                    vm.facturas([]);
                    loadTablaFacturas([])
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

function cierraModal() {
    $('#modalFacturasRegistros').modal('hide'); 
}