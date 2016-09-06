/*-------------------------------------------------------------------------- 
comercialDetalle.js
Funciones js par la página ComercialDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataContratosComerciales;
var dataClientes;
var contratoComercialId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var empId = 0;

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
    $("#btnImportar").click(importar());
    $("#frmComercial").submit(function () {
        return false;
    });

    initTablaContratosComerciales();
    initTablaClientes();

    // select2 things
    $("#cmbTiposComerciales").select2({
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

    loadTiposComerciales();

    empId = gup('ComercialId');
    if (empId != 0) {
        var data = {
            comercialId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/comerciales/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                // cargamos los contratos relacionados
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/contratos_comerciales/comercial/" + empId,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadTablaContratosComerciales(data);
                    },
                    error: errorAjax
                });
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/clientes/agente/" + empId,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadTablaClientes(data);
                    },
                    error: errorAjax
                });
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.comercialId(0);
    }
}

function admData() {
    var self = this;
    self.comercialId = ko.observable();
    self.proId = ko.observable();
    self.nombre = ko.observable();
    self.nif = ko.observable();
    self.fechaAlta = ko.observable();
    self.fechaBaja = ko.observable();
    self.activa = ko.observable();
    self.contacto1 = ko.observable();
    self.contacto2 = ko.observable();
    self.direccion = ko.observable();
    self.codPostal = ko.observable();
    self.poblacion = ko.observable();
    self.provincia = ko.observable();
    self.telefono1 = ko.observable();
    self.telefono2 = ko.observable();
    self.fax = ko.observable();
    self.email = ko.observable();
    self.email2 = ko.observable();
    self.observaciones = ko.observable();
    self.dniFirmante = ko.observable();
    self.firmante = ko.observable();
    //
    self.tipoComercialId = ko.observable();
    self.stipoComercialId = ko.observable();
    //
    self.posiblesTiposComerciales = ko.observableArray([]);
    self.elegidosTiposComerciales = ko.observableArray([]);

}

function loadData(data) {
    vm.comercialId(data.comercialId);
    vm.proId(data.proId);
    vm.nombre(data.nombre);
    vm.nif(data.nif);
    vm.fechaAlta(spanishDate(data.fechaAlta));
    vm.fechaBaja(spanishDate(data.fechaBaja));
    vm.activa(data.activa);
    vm.contacto1(data.contacto1);
    vm.contacto2(data.contacto2);
    vm.direccion(data.direccion);
    vm.codPostal(data.codPostal);
    vm.provincia(data.provincia);
    vm.telefono1(data.telefono1);
    vm.telefono2(data.telefono2);
    vm.fax(data.fax);
    vm.email(data.email);
    vm.email2(data.email2);
    vm.observaciones(data.observaciones);
    vm.dniFirmante(data.dniFirmante);
    vm.firmante(data.firmante);
    vm.poblacion(data.poblacion);
    loadTiposComerciales(data.tipoComercialId);
}

function datosOK() {
    $('#frmComercial').validate({
        rules: {
            txtNif: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtEmail: {
                email: true
            },
            txtEmail2: {
                email: true
            },
            cmbTiposComerciales: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNif: {
                required: "Introduzca un NIF"
            },
            txtNombre: {
                required: 'Introduzca el nombre'
            },
            txtEmail: {
                email: 'Debe usar un correo válido'
            },
            txtEmail2: {
                email: 'Debe usar un correo válido'
            },
            cmbTiposComerciales: {
                required: "Debe elegir un tipo comercial"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmComercial").validate().settings;
    return $('#frmComercial').valid();
}

function datosImportOK() {
    $('#frmComercial').validate({
        rules: {
            txtProId: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtProId: {
                required: "Introduzca un código"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmComercial").validate().settings;
    return $('#frmComercial').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            comercial: {
                "comercialId": vm.comercialId(),
                "proId": vm.proId(),
                "nombre": vm.nombre(),
                "nif": vm.nif(),
                "fechaAlta": spanishDbDate(vm.fechaAlta()),
                "fechaBaja": spanishDbDate(vm.fechaBaja()),
                "activa": vm.activa(),
                "contacto1": vm.contacto1(),
                "contacto2": vm.contacto2(),
                "direccion": vm.direccion(),
                "poblacion": vm.poblacion(),
                "provincia": vm.provincia(),
                "codPostal": vm.codPostal(),
                "telefono1": vm.telefono1(),
                "telefono2": vm.telefono2(),
                "fax": vm.fax(),
                "email": vm.email(),
                "email2": vm.email2(),
                "observaciones": vm.observaciones(),
                "dniFirmante": vm.dniFirmante(),
                "firmante": vm.firmante(),
                "tipoComercialId": vm.stipoComercialId()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/comerciales",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ComercialesGeneral.html?ComercialId=" + vm.comercialId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/comerciales/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ComercialesGeneral.html?ComercialId=" + vm.comercialId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function importar() {
    var mf = function () {
        if (!datosImportOK())
            return;
        $('#btnImportar').addClass('fa-spin');
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/sqlany/comerciales/" + vm.proId(),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                $('#btnImportar').removeClass('fa-spin');
                // la cadena será devuelta como JSON
                var rData = JSON.parse(data);
                // comprobamos que no está vacía
                if (rData.length == 0) {
                    // mensaje de que no se ha encontrado
                }
                data = rData[0];
                data.comercialId = vm.comercialId(); // Por si es un update
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "ComercialesGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadTiposComerciales(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_comerciales",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposComerciales = [{ tipoComercialId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposComerciales(tiposComerciales);
            //if (id){
            //    vm.stipoComercialId(id);
            //}
            $("#cmbTiposComerciales").val([id]).trigger('change');
        },
        error: errorAjax
    });
}

// TAB CONTRATOS
function initTablaContratosComerciales() {
    tablaCarro = $('#dt_contratoComercial').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_contratoComercial'), breakpointDefinition);
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
        data: dataContratosComerciales,
        columns: [{
            data: "empresa"
        }, {
                data: "fechaInicio",
                render: function (data, type, row) {
                    if (!data) {
                        return "";
                    }
                    return moment(data).format('DD/MM/YYYY');
                }
            }, {
                data: "fechaFin",
                render: function (data, type, row) {
                    if (!data) {
                        return "";
                    }
                    return moment(data).format('DD/MM/YYYY');
                }
            }, {
                data: "contratoComercialId",
                render: function (data, type, row) {
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editContratoComercial(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt2 + "</div>";
                    return html;
                }
            }]
    });
}

function loadTablaContratosComerciales(data) {
    var dt = $('#dt_contratoComercial').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function editContratoComercial(id) {
    // hay que abrir la página de detalle de comercial
    // pasando en la url ese ID
    var url = "ContratoComercialDetalle.html?ContratoComercialId=" + id;
    window.open(url, '_blank');
}

// TAB CLIENTES
function initTablaClientes() {
    tablaCarro = $('#dt_clientes').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_clientes'), breakpointDefinition);
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
        data: dataClientes,
        columns: [{
            data: "nombre"
        },
            {
                data: "clienteId",
                render: function (data, type, row) {
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editCliente(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt2 + "</div>";
                    return html;
                }
            }]
    });
}

function loadTablaClientes(data) {
    var dt = $('#dt_clientes').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function editCliente(id) {
    // hay que abrir la página de detalle de comercial
    // pasando en la url ese ID
    var url = "ClienteDetalle.html?ClienteId=" + id;
    window.open(url, '_blank');
}