/*-------------------------------------------------------------------------- 
documentopagoDetalle.js
Funciones js par la página DocumentoPagoDetalle.html
---------------------------------------------------------------------------*/

var documentoPagoId = 0;
var usuario;
var esFactura = false;
var datosArrayRegistros = []
var datosArrayRegistrosAnt = []

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;
var datosArray = [];

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
    datePickerSpanish(); // see comun.js
    // /
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar);
    
    
    $("#btnSalir").click(salir());
    $("#frmDocumentoPago").submit(function() {
        return false;
    });

    $("#frmAsociarFacturas").submit(function() {
        return false;
    });

    $("#frmAsociarAnticipos").submit(function() {
        return false;
    });

    $("#frmAsociarRegistros").submit(function() {
        return false;
    });

    $("#frmAsociarRegistrosAnt").submit(function() {
        return false;
    });

    $("#frmNuevaFacturaAsociada").submit(function() {
        return false;
    });

    $("#frmNuevoAnticipoAsociado").submit(function() {
        return false;
    });
    

    $("#frmFacturasRegistros").submit(function() {
        return false;
    });

    $("#frmAnticiposRegistros").submit(function() {
        return false;
    });

    $("#cmbEmpresas").select2(select2Spanish());
    $("#cmbEmpresas2").select2(select2Spanish());
    $("#cmbEmpresas3").select2(select2Spanish());
    $("#cmbEmpresas4").select2(select2Spanish());
    loadEmpresas();

    $("#cmbDepartamentos").select2(select2Spanish());
    $("#cmbDepartamentos2").select2(select2Spanish());
    loadDeparta();

    $("#cmbFormasPago").select2(select2Spanish());
    $("#cmbFormasPago2").select2(select2Spanish());
    loadFormasPago();

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

    //Evento de marcar/desmarcar todos los checks del grid de transferencias anticipos
    $('#checkMainRegistrosAnt').click(
        function(e){
            if($('#checkMainRegistrosAnt').prop('checked')) {
                $('.checkAllRegistrosAnt').prop('checked', true);
                updateAllRegistrosAnt(true);
            } else {
                $('.checkAllRegistrosAnt').prop('checked', false);
                updateAllRegistrosAnt(false);
            }
        }
    );

    //Evento de marcar/desmarcar todos los checks del grid anticipos de gastos
    $('#checkMainAnt').click(
        function(e){
            if($('#checkMainAnt').prop('checked')) {
                $('.checkAllAnt').prop('checked', true);
                updateAllAnt(true);
            } else {
                $('.checkAllAnt').prop('checked', false);
                updateAllAnt(false);
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

    $('#btnAceptarAsociarFacturas').hide();//botón oculto por defecto
    $('#btnAceptarAsociarRegistros').hide();
    $('#btnAceptarAsociarRegistrosAnt').hide();
    $("#btnAceptarAsociarAnticipos").hide();
    initTablaFacturasAsociadas();
    initTablaAsociarFacturas();
    initTablaAsociarRegistros();
    initTablaFacturasRegistros();
    //
    initTablaAnticipoasAsociados();
    initTablaAsociarAnticipos();
    initTablaAsociarRegistrosAnt();
    initTablaAnticiposRegistros();


    $('#upload-input').on('change', function () {
        var files = $(this).get(0).files;
        
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();
        // loop through all the selected files and add them to the formData object
        
        var file = files[0];
        var ext = file.name.split('.').pop().toLowerCase();
        if(ext != "pdf") return mensError("No se permiten formatos diferentes a pdf.");
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, vm.documentoPagoId() + "_" + file.name);
            
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
        $('#pdfDoc').show();
        var data = {
                documentoPagoId: documentoPagoId
            }
            if (cmd == "nuevo") {
                mensNormal("Documento de pago creado con exito, puede ahora adjuntar las facturas de gastos asociadas.");
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
        $('#pdfDoc').hide();
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
    self.anticipos = ko.observableArray([]);
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
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
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
    vm.anticipos(data.anticipos);
    loadTablaFacturas(data.facturas);
    loadTablaAnticipos(data.anticipos);
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
            txtdFecha2: {
                required: true
            },
            txthFecha2: {
                required: true,
                greaterThan: "#txtdFecha2"
            },
            cmbEmpresas2: { required: true},


        },
        // Messages for form validation
        messages: {
            txtdFecha2: {
                required: "Debe seleccionar una fecha"
            },
            txthFecha2: {
                required: "Debe seleccionar una fecha"
            },
            cmbEmpresas2: { required: 'Debe introducir una empresa'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmAsociarFacturas').valid();
}


function datosOK3() {
    $('#frmAsociarRegistros').validate({
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
    return $('#frmAsociarRegistros').valid();
}

function datosOK4() {
    $('#frmAsociarRegistrosAnt').validate({
        rules: {
            txtdFecha3: {
                required: true
            },
            txthFecha3: {
                required: true,
                greaterThan: "#txtdFecha3"
            },
            cmbEmpresas3: { required: true},


        },
        // Messages for form validation
        messages: {
            txtdFecha3: {
                required: "Debe seleccionar una fecha"
            },
            txthFecha3: {
                required: "Debe seleccionar una fecha"
            },
            cmbEmpresas3: { required: 'Debe introducir una empresa'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmAsociarRegistrosAnt').valid();
}

function datosOK5() {
    $('#frmAsociarAnticipos').validate({
        rules: {
            txtdFecha4: {
                required: true
            },
            txthFecha4: {
                required: true,
                greaterThan: "#txtdFecha3"
            },
            cmbEmpresas4: { required: true},


        },
        // Messages for form validation
        messages: {
            txtdFecha4: {
                required: "Debe seleccionar una fecha"
            },
            txthFecha4: {
                required: "Debe seleccionar una fecha"
            },
            cmbEmpresas4: { required: 'Debe introducir una empresa'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmAsociarAnticipos').valid();
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
           
        },
        {
            data: "fechaRecepcionFactura",
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
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='desvinculaFactura(" + data + ");' title='Desvincular registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success'  onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}


function loadTablaFacturas(data) {
    try{
        if(data) {
            if (data !== null && data.length === 0) {
                data = null;
            }
        } else {
            data = null;
        }
        var dt = $('#dt_FacturasAsociadas').dataTable();
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
    } catch(e) {

    }
}

function loadTablaAnticipos(data) {
    if(data) {
        if (data !== null && data.length === 0) {
            data = null;
        }
    } else {
        data = null;
    }
    var dt = $('#dt_AnticiposAsociados').dataTable();
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
        $("#cmbEmpresas2").val([0]).trigger('change');
        $("#cmbEmpresas3").val([0]).trigger('change');
        $("#cmbEmpresas4").val([0]).trigger('change');
    });
}


function loadDeparta() {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: 0, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentos").val([0]).trigger('change');
        $("#cmbDepartamentos2").val([0]).trigger('change');
    });
}


function loadFormasPago() {
    llamadaAjax("GET", "/api/formas_pago", null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([0]).trigger('change');
        $("#cmbFormasPago2").val([0]).trigger('change');
    });
}


//modal asociación facturas


function initTablaAsociarFacturas() {
    tablaCarro = $('#dt_asociarFacturas').dataTable({
        fnCreatedRow : 
        function (nRow, aData, iDataIndex) {
            //color para las facturas asociadas una vez
            if(aData.num == 1) {
                $(nRow).attr('style', 'background: #FFEF4B'); 
            }
            //contratos cerrados
            if(aData.num > 1) {
                $(nRow).attr('style', 'background: #D46A6A'); 
            }
        },
        autoWidth: true,
        paging: false,
        "bDestroy": true,

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
            data: "fecha_recepcion",
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
        },
        {
            data: "num"
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
        if (v.sele == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            
            if (this.checked) {
                var data = {
                    facprove: {
                        facproveId: v.facproveId,
                        empresaId: v.empresaId,
                        proveedorId: v.proveedorId,
                        fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    }
                };
                datosArray.push(data)
            } else {
                for(var i=0; i < datosArray.length; i++) {
					if(datosArray[i].facprove.facproveId == v.facproveId){
						datosArray.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
						i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
					}
				}
            }
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



function buscarAsociarFacturas() {
    datosArray = [];
    $('#dt_asociarFacturas').dataTable().fnClearTable();
      //$('#dt_asociarFacturas').dataTable().fnDestroy();
        //initTablaAsociarFacturas();
        if (!datosOK2()) return;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    
        var departamentoId = 0;
        if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
        var empresaId = 0;
        if (vm.sempresaId()) empresaId = vm.sempresaId();
        var formapagoId = 0;
        if (vm.sformaPagoId()) formapagoId = vm.sformaPagoId();
      
        var url = myconfig.apiUrl + "/api/facturasProveedores/facturas/docpago/" + dFecha + "/" + hFecha
        + "/" + empresaId 
        + "/"  + departamentoId 
        + "/"  + formapagoId 
        + "/" + usuario.usuarioId;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // mostramos el botén de alta
                $('#checkMain').prop('checked', false);
                if(data.length > 0) {
                    $("#btnAceptarAsociarFacturas").show();
                } else {
                    mensAlerta("No se han encontrado registros");
                    $("#btnAceptarAsociarFacturas").hide();
                }
                loadTablaAsociarFacturas(data);
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
        if (!datosOK3()) return;
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
                    $("#btnAceptarAsociarRegistros").show();
                } else {
                    mensAlerta("No se han encontrado registros");
                    $("#btnAceptarAsociarRegistros").hide();
                }
                $('#checkMainRegistros').prop('checked', false);
                loadTablaAsociarRegistros(data);
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
        },
        datosArray: datosArray
    }
  
    $.ajax({
        type: "POST",
        url: myconfig.apiUrl + "/api/documentos_pago/facturas",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            if(!data) return mensAlerta("No se han obtenido registros.");
          
            mensNormal("Se han asociado las facturas correctamente.");
            $('#modalAsociarFacturas').modal('hide');
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
    if(claves.length == 0) return mensAlerta("No se han obtenido registros");
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
            if(data == 0) {
                mensAlerta("No se ha asociado nada, revise que las facturas no se encuentren ya vinculadas.");
                claves = [];
            } else {
                mensNormal("Se han asociado las facturas correctamente.");
                claves = [];
            }
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

function limpiarModal() {
    claves = [];
    $('#btnAceptarAsociarFacturas').hide();
    $('#btnAceptarAsociarRegistros').hide();
    $('#btnAceptarAsociarRegistrosAnt').hide();
    $("#btnAceptarAsociarAnticipos").hide()
    vm.dFecha(null);
    vm.hFecha(null);
    vm.departamentoId(null);
    vm.empresaId(null);
    loadEmpresas()
    loadDeparta();
    loadFormasPago()
    $('#dt_asociarFacturas').dataTable().fnClearTable();
    $('#dt_asociarRegistros').dataTable().fnClearTable();
    //
    $('#dt_asociarRegistrosAnt').dataTable().fnClearTable();
    $('#dt_asociarAnticipos').dataTable().fnClearTable();
}


function updateAll(opcion) {
    var tb = $('#dt_asociarFacturas').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    datosArray = [];
    if(opcion) {
        if(datos) {
            for( var i = 0; i < datos.length; i++) {
                    var data = {
                        facprove: {
                            facproveId: datos[i].facproveId,
                            empresaId: datos[i].empresaId,
                            proveedorId: datos[i].proveedorId,
                            fecha: moment(datos[i].fecha).format('YYYY-MM-DD'),
                        }
                    };
                    datosArray.push(data)        
            }
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

function updateAllRegistrosAnt(opcion) {
    datosArrayRegistrosAnt = [];
    var tb = $('#dt_asociarRegistrosAnt').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(datos) {
        if(opcion) {
            for( var i = 0; i < datos.length; i++) {
                datosArrayRegistrosAnt.push(datos[i].codigo);
            }
        } 
       
    }
}

function updateAllAnt(opcion) {
    var sel = 0;
    if(opcion) sel = 1
    var tb = $('#dt_asociarAnticipos').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    var length = datos.length;
    if(opcion) sel = 1
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
                var data = {
                    antprove: {
                        antproveId: datos[i].antproveId,
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
                var url = sprintf('%s/api/anticiposProveedores/%s', myconfig.apiUrl, datos[i].antproveId);
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
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    //primero comprobamos si el anticipo es de colaborador o no para redirigir a la vista correspondiente
    llamadaAjax("GET", "/api/facturasProveedores/" + id, null, function (err, data) {
        if (err) return;
        if(data.esColaborador) url = "FacturaColaboradorDetalle.html?facproveId=" + id;
        window.open(url, '_blank');
    });   
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
                        vm.anticipos(data.anticipos);
                        loadTablaFacturas(data.facturas);
                        return;
                    }
                    vm.facturas([]);
                    vm.anticipos([]);
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

//funciones relacionadas con los anticipos

function initTablaAnticipoasAsociados() {
    tablaCarro = $('#dt_AnticiposAsociados').DataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_AnticiposAsociados'), breakpointDefinition);
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
            data: "numeroAnticipoProveedor"
        },{
            data: "proveedorNombreAnticipo"
        }, {
            data: "fechaAnticipo",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
           
        },{
            data: "totalAnticipo",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "totalConIvaAnticipo",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "antproveId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='desvinculaAnticipo(" + data + ");' title='Desvincular registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success'  onclick='editAnticipo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}


function loadTablaAnticipos(data) {
    var dt = $('#dt_AnticiposAsociados').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function initTablaAsociarRegistrosAnt() {
    tablaCarro = $('#dt_asociarRegistrosAnt').dataTable({
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
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asociarRegistrosAnt'), breakpointDefinition);
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
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAllRegistrosAnt">', data, data);
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
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editRegistroAnt(" + data + ");' title='Editar registro' data-toggle='modal' data-target='#modalAnticiposRegistros'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadTablaAsociarRegistrosAnt(data) {
    var dt = $('#dt_asociarRegistrosAnt').dataTable();
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
                datosArrayRegistrosAnt.push(v.codigo);
            } else {
                for(var i=0; i < datosArrayRegistrosAnt.length; i++) {
                    if(datosArrayRegistrosAnt[i] == v.codigo) {
                        datosArrayRegistrosAnt.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
                        break;
                    } 
                }
            }
        });
    });
}

function buscarAsociarRegistrosAnt() {
    $('#dt_asociarRegistrosAnt').dataTable().fnClearTable();
      //$('#dt_asociarFacturas').dataTable().fnDestroy();
        //initTablaAsociarFacturas();
        if (!datosOK4()) return;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    
    
        var empresaId = 0;
        if (vm.sempresaId()) empresaId = vm.sempresaId();
      
        var url = myconfig.apiUrl + "/api/documentos_pago/buscar/registros/anticipos/" + dFecha + "/" + hFecha + "/" + empresaId 
     
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // mostramos el botó de alta
                if(data.length > 0) {
                    $("#btnAceptarAsociarRegistrosAnt").show();
                } else {
                    mensAlerta("No se han encontrado registros");
                    $("#btnAceptarAsociarRegistrosAnt").hide();
                }
                loadTablaAsociarRegistrosAnt(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
}

function aceptarAsociarRegistrosAnt() {
    var claves = procesaClavesTransferenciasAnt(null);
    if(claves.length == 0) return mensAlerta("No se han obtenido registros");
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
        url: myconfig.apiUrl + "/api/documentos_pago/registros/anticipos",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            if(data == 0) {
                mensAlerta("No se ha asociado nada, revise que los anticipos no se encuentren ya vinculados.");
                claves = [];
            } else {
                mensNormal("Se han asociado los anticipos correctamente.");
                claves = [];
            }
            $('#modalAsociarRegistrosAnt').modal('hide');
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

function editRegistroAnt(codigo) {
    var claves = procesaClavesTransferenciasAnt(codigo);
    var empresaId = vm.sempresaId();
    var cod = claves[0].nrodocum
    var anyo = claves[0].anyodocum
    $.ajax({
     type: "GET",
     url: myconfig.apiUrl + "/api/documentos_pago/registro/anticipo/" + cod + "/" + anyo + "/" + empresaId,
     dataType: "json",
     contentType: "application/json",
     data: null,
     success: function (data, status) {
         if(data) {
            loadTablaAnticiposRegistros(data)
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

 function initTablaAnticiposRegistros() {
    tablaCarro = $('#dt_anticiposRegistros').dataTable({
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
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_anticiposRegistros'), breakpointDefinition);
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
            data: "antproveId",
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
            data: "numeroAnticipoProveedor"
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

function loadTablaAnticiposRegistros(data) {
    var dt = $('#dt_anticiposRegistros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function desvinculaAnticipo(id) {
    var arr = [ {
        documentoPagoId: documentoPagoId,
        antproveId: id
    }];
    $.ajax({
        type: "DELETE",
        url: myconfig.apiUrl + "/api/documentos_pago/delete/docpago/antprove",
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
                    if(data.anticipos) {
                        vm.anticipos(data.anticipos);
                        loadTablaAnticipos(data.anticipos);
                        return;
                    }
                    vm.facturas([]);
                    vm.anticipos([]);
                    loadTablaAnticipos([])
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

function desvinculaAnticipos() {
    var arr = vm.anticipos();
    arr.forEach(e => {
        e.documentoPagoId = documentoPagoId;
    });
    $.ajax({
        type: "DELETE",
        url: myconfig.apiUrl + "/api/documentos_pago/delete/docpago/antprove",
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
                    if(data.anticipos) {
                        loadTablaAnticipos(data.anticipos);
                        return;
                    }
                    vm.anticipos([]);
                    loadTablaAnticipos([])
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

function procesaClavesTransferenciasAnt(cod) {
    var arr = [];
    var c = datosArrayRegistrosAnt;
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

function cierraModalAnt() {
    $('#modalAnticiposRegistros').modal('hide'); 
}

function initTablaAsociarAnticipos() {
    tablaCarro = $('#dt_asociarAnticipos').dataTable({
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
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asociarAnticipos'), breakpointDefinition);
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
            data: "antproveId",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAllAnt">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        },  {
            data: "numeroAnticipoProveedor"
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
            data: "antproveId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editAnticipo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }]
    });
}


function buscarAsociarAnticipos() {
    $('#dt_asociarAnticipos').dataTable().fnClearTable();
      //$('#dt_asociarFacturas').dataTable().fnDestroy();
        //initTablaAsociarFacturas();
        if (!datosOK5()) return;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    
        var departamentoId = 0;
        if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
        var empresaId = 0;
        if (vm.sempresaId()) empresaId = vm.sempresaId();
        var formapagoId = 0;
        if (vm.sformaPagoId()) formapagoId = vm.sformaPagoId();
      
        var url = myconfig.apiUrl + "/api/anticiposProveedores/usuario/logado/departamento/docpago/" + dFecha + "/" + hFecha
        + "/" + empresaId 
        + "/"  + departamentoId 
        + "/"  + formapagoId 
        + "/" + usuario.usuarioId;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
              
                // mostramos el botén de alta
                $('#checkMainAnt').prop('checked', false);
                if(data.length > 0) {
                    $("#btnAceptarAsociarAnticipos").show();
                } else {
                    mensAlerta("No se han encontrado registros");
                    $("#btnAceptarAsociarAnticipos").hide();
                }
                loadTablaAsociarAnticipos(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
}


function loadTablaAsociarAnticipos(data) {
    var dt = $('#dt_asociarAnticipos').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.antproveId;
        if (v.sel == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                antprove: {
                    antproveId: v.antproveId,
                    empresaId: v.empresaId,
                    proveedorId: v.proveedorId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    sel: 0
                }
            };
            if (this.checked) {
                data.antprove.sel = 1;
            }
            var datosArray = [];
            datosArray.push(data)
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/anticiposProveedores/%s', myconfig.apiUrl, v.antproveId);
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

function aceptarAsociarAnticipos() {
    var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');

    var departamentoId = 0;
    if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
    var empresaId = 0;
    if (vm.sempresaId()) empresaId = vm.sempresaId();
   
    var data = 
    {
        docant: 
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
        url: myconfig.apiUrl + "/api/documentos_pago/asociar/anticipos",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            if(!data) return mensAlerta("No se han obtenido registros.");
          
            mensNormal("Se han asociado las facturas correctamente.");
            $('#modalAsociarAnticipos').modal('hide');
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

function editAnticipo(id) {
    var url = "AnticipoProveedorDetalle.html?antproveId=" + id;
    //primero comprobamos si el anticipo es de colaborador o no para redirigir a la vista correspondiente
    llamadaAjax("GET", "/api/anticiposProveedores/" + id, null, function (err, data) {
        if (err) return;
        if(data.esColaborador) url = "AnticipoColaboradorDetalle.html?antproveId=" + id;
        window.open(url, '_blank');
    });   
}


 
