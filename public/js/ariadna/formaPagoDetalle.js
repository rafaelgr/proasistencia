/*-------------------------------------------------------------------------- 
formaPagoDetalle.js
Funciones js par la página FormaPagoDetalle.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var empId = 0;
var lineaEnEdicion = false;
var dataFormaPagoLineas;


datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmFormaPago").submit(function () {
        return false;
    });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });

    initTablaFormaPagoLineas();

    $("#cmbTiposFormaPago").select2({
        allowClear: true,
        language: {
            errorLoading: function () {
                return "La carga falló";
            },
            inputTooLong: function (e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function (e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function () {
                return "Cargando más resultados…";
            },
            maximumSelected: function (e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando…";
            }
        }
    });
    loadTiposFormaPago();

    empId = gup('FormaPagoId');
    if (empId != 0) {
        var data = {
            formaPagoId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/formas_pago/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.formaPagoId(0);
        // hay que ofertar el código contable siguiente.
        llamadaAjax("GET", myconfig.apiUrl + "/api/formas_pago/codcontable/siguiente", null, function (err, data) {
            if (err) return;
            vm.codigoContable(data);
        });
    }
}

function admData() {
    var self = this;
    self.formaPagoId = ko.observable();
    self.tipoFormaPagoId = ko.observable();
    self.nombre = ko.observable();
    self.numeroVencimientos = ko.observable();
    self.primerVencimiento = ko.observable();
    self.restoVencimiento = ko.observable();
    self.codigoContable = ko.observable();
    //
    self.stipoFormaPagoId = ko.observable();
    //
    self.posiblesTiposFormaPago = ko.observableArray([]);
    self.elegidosTiposFormaPago = ko.observableArray([]);

    //LINEAS DEL PAGO
    self.conceptoPago = ko.observable();
    self.porcentajePago = ko.observable();
}

function loadData(data) {
    vm.formaPagoId(data.formaPagoId);
    vm.tipoFormaPagoId(data.tipoFormaPagoId);
    vm.nombre(data.nombre);
    vm.numeroVencimientos(data.numeroVencimientos);
    vm.primerVencimiento(data.primerVencimiento);
    vm.restoVencimiento(data.restoVencimiento);
    vm.codigoContable(data.codigoContable);
    loadTiposFormaPago(data.tipoFormaPagoId);

    loadFormaPagoLineas(data.formaPagoId);
}

function datosOK() {
    $('#frmFormaPago').validate({
        rules: {
            cmbTiposFormasPago: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtNumeroVencimientos: {
                required: true,
                min: 1
            },
            txtPrimerVencimiento: {
                required: true
            },
            txtRestoVencimientos: {
                required: true
            },
            txtCodigoContable: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbTiposFormasPago: {
                required: "Debe elegit un tipo"
            },
            txtNombre: {
                required: "Debe dar un nombre"
            },
            txtNumeroVencimientos: {
                required: "Introduzca el númnero de vencimientos",
                min: "El número de vencimientos no puede ser 0"
            },
            txtPrimerVencimiento: {
                required: "Dias hasta el primer vencimiento"
            },
            txtRestoVencimientos: {
                required: "Dias en resto de vencimientos"
            },
            txtCodigoContable: {
                required: "Debe proporcionar un código contable"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmFormaPago").validate().settings;
    return $('#frmFormaPago').valid();
}


function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            formaPago: {
                "formaPagoId": vm.formaPagoId(),
                "tipoFormaPagoId": vm.stipoFormaPagoId(),
                "nombre": vm.nombre(),
                "numeroVencimientos": vm.numeroVencimientos(),
                "primerVencimiento": vm.primerVencimiento(),
                "restoVencimiento": vm.restoVencimiento(),
                "codigoContable": vm.codigoContable()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/formas_pago",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "FormaPagoGeneral.html?FormaPagoId=" + vm.formaPagoId();
                    window.open(url, '_self');
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/formas_pago/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "FormaPagoGeneral.html?FormaPagoId=" + vm.formaPagoId();
                    window.open(url, '_self');
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


function salir() {
    var mf = function () {
        var url = "FormaPagoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadTiposFormaPago(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_forma_pago",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposFormaPago = [{ tipoFormaPagoId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposFormaPago(tiposFormaPago);
            $("#cmbTiposFormaPago").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

//FUNCIONES DE LAS LINEAS

function initTablaFormaPagoLineas() {
    tablaCarro = $('#dt_lineas').DataTable({
        autoWidth: true,
       
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_lineas'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            
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
        data: dataFormaPagoLineas,
        columns: [ {
            data: "concepto",
            
        }, {
            data: "pocentaje",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "formaPagoPorcenId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFormaPagoLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalLinea' onclick='editFprmaPagoLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function  loadFormaPagoLineas(id) {
    llamadaAjax("GET", "/api/formas_pago/linea/" + id, null, function (err, data) {
        if (err) return;
        loadTablaFormaPagoLineas(data);
    });
}

function loadTablaFormaPagoLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnCopiar').hide();
        $('#btnPorcentaje').hide();
        $('#btnDeleteTipo').hide();
    }
    dt.fnClearTable();
    if (data != null){
        dt.fnAddData(data);
        $('#btnCopiar').show();
        $('#btnPorcentaje').show();
        $('#btnDeleteTipo').show();
    }
    dt.fnDraw();
}


function nuevaLinea() {
    limpiaDataLinea();
    lineaEnEdicion = false;
}

function limpiaDataLinea(data) {
    vm.conceptoPago('');
    vm.porcentajePago(0);
}


function aceptarLinea() {
    /*if (!datosOKLineas()) {
        return;
    }*/
    var data = {
        pagoPorcen: {
            formaPagoId: vm.formaPagoId(),
            concepto: vm.conceptoPago(),
            porcentaje: vm.porcentajePago()
        }
    }
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/formas_pago/linea";
                if (lineaEnEdicion) {
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/formas_pago/linea/" +  vm.formaPagoId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalLinea').modal('hide');
                    llamadaAjax("GET", myconfig.apiUrl + "/api/formas_pago/linea/" + vm.formaPagoId(), null, function (err, data) {
                        loadData(data);
                        loadLineasTarifaCliente(data.tarifaClienteId);
                       
                    });
                });
}
