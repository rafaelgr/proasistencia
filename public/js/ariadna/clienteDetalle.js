/*-------------------------------------------------------------------------- 
clienteDetalle.js
Funciones js par la página ClienteDetalle.html
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

var numDigitos = 0; // número de digitos de cuenta contable

datePickerSpanish(); // see comun.js

var dataComisionistas;

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
    $("#frmCliente").submit(function () {
        return false;
    });

    $("#txtProId").blur(function () {
        cambioCodigo();
    });

    $("#frmComisionista").submit(function () {
        return false;
    });

    $("#comisionista-form").submit(function () {
        return false;
    });

    // select2 things
    $("#cmbTiposClientes").select2(select2Spanish());
    loadTiposClientes();

    // select2 things
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();

    // select2 things
    $("#cmbAgentes").select2(select2Spanish());
    loadAgentes();

    // select2 things
    $("#cmbComerciales").select2(select2Spanish());
    loadComerciales();
    $("#cmbComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioComercial(e.added);
    });

    initTablaComisionistas();

    // obtener el número de digitos de la contabilidad
    // para controlar la cuenta contable.
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contabilidad/infcontable/",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            numDigitos = data.numDigitos
        },
        error: errorAjax
    });

    empId = gup('ClienteId');
    if (empId != 0) {
        var data = {
            clienteId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/clientes/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.clienteId(0);
    }
}

function admData() {
    var self = this;
    self.clienteId = ko.observable();
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
    self.cuentaContable = ko.observable();
    self.iban = ko.observable();
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    //
    self.tipoClienteId = ko.observable();
    self.stipoClienteId = ko.observable();
    //
    self.posiblesTiposClientes = ko.observableArray([]);
    self.elegidosTiposClientes = ko.observableArray([]);
    //
    self.agenteId = ko.observable();
    self.sagenteId = ko.observable();
    //
    self.posiblesAgentes = ko.observableArray([]);
    self.elegidosAgentes = ko.observableArray([]);
    //-- Valores para form de comisionistas
    //
    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    //
    self.clienteComisionistaId = ko.observable();
    self.clienteId = ko.observable();
    self.comercialId = ko.observable();
    self.manPorVentaNeta = ko.observable();
    self.manPorBeneficio = ko.observable();
    //
    self.empresaId = ko.observable(null);
}

function loadData(data) {
    vm.clienteId(data.clienteId);
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
    vm.poblacion(data.poblacion);
    vm.cuentaContable(data.cuentaContable);
    vm.iban(data.iban);
    loadTiposClientes(data.tipoClienteId);
    loadFormasPago(data.formaPagoId);
    loadAgentes(data.comercialId);
    //
    loadComisionistas(data.clienteId);
}

function datosOK() {
    // comprobaciones previas
    $('#frmCliente').validate({
        rules: {
            txtNif: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtProId: {
                required: true,
                number: true
            },
            txtCuentaContable: {
                required: true
            },
            txtIban: {
                required: true
            },
            txtEmail: {
                email: true
            },
            txtEmail2: {
                email: true
            },
            cmbTiposClientes: {
                required: true
            },
            cmbFormasPago: {
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
            txtProId: {
                required: "Necesitamos un código (contabilidad)",
                number: "El código debe ser un número"
            },
            txtCuentaContable: {
                required: 'Se necesita una cuenta una cuenta'
            },
            txtIban: {
                required: 'Introduzca un iban'
            },
            txtEmail: {
                email: 'Debe usar un correo válido'
            },
            txtEmail2: {
                email: 'Debe usar un correo válido'
            },
            cmbTiposClientes: {
                required: "Debe elegir un tipo cliente"
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmCliente").validate().settings;
    return $('#frmCliente').valid();
}

function datosImportOK() {
    $('#frmCliente').validate({
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
    var opciones = $("#frmCliente").validate().settings;
    return $('#frmCliente').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            cliente: {
                "clienteId": vm.clienteId(),
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
                "tipoClienteId": vm.stipoClienteId(),
                "formaPagoId": vm.sformaPagoId(),
                "cuentaContable": vm.cuentaContable(),
                "iban": vm.iban(),
                "comercialId": vm.sagenteId()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/clientes",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ClientesGeneral.html?ClienteId=" + vm.clienteId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/clientes/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ClientesGeneral.html?ClienteId=" + vm.clienteId();
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
            url: myconfig.apiUrl + "/api/sqlany/clientes/" + vm.proId(),
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
                data.clienteId = vm.clienteId(); // Por si es un update
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
        var url = "ClientesGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function loadTiposClientes(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_clientes",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposClientes = [{ tipoClienteId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposClientes(tiposClientes);
            //if (id){
            //    vm.stipoComercialId(id);
            //}
            $("#cmbTiposClientes").val([id]).trigger('change');
        },
        error: errorAjax
    });
}

function loadFormasPago(id) {
    $.ajax({
        type: "GET",
        url: "/api/formas_pago",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
            vm.posiblesFormasPago(formasPago);
            $("#cmbFormasPago").val([id]).trigger('change');
        },
        error: errorAjax
    });
}

function loadAgentes(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/agentes",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var agentes = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesAgentes(agentes);
            $("#cmbAgentes").val([id]).trigger('change');
        },
        error: errorAjax
    });
}


/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de comisionistas
--------------------------------------------------------------------*/
function nuevoComisionista() {
    limpiaComisionista(); // es un alta
    lineaEnEdicion = false;
    // no se pueden dar comisionistas si no se ha dado de alta al cliente.
    if (empId == 0) {
        $('#modalComisionista').modal('hide');
        mostrarMensajeSmart("Debe crear primero al cliente antes de asignarle colaboradores");
        return;
    }
}

function aceptarComisionista() {

    if (!datosOKComisionistas()) {
        return;
    }

    var data = {
        clienteComisionista: {
            clienteComisionistaId: vm.clienteComisionistaId(),
            clienteId: vm.clienteId(),
            comercialId: vm.scomercialId(),
            manPorVentaNeta: vm.manPorVentaNeta(),
            manPorBeneficio: vm.manPorBeneficio()
        }
    }
    if (!lineaEnEdicion) {
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/clientes_comisionistas",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalComisionista').modal('hide');
                loadComisionistas(vm.clienteId());
            },
            error: errorAjax
        });
    } else {
        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/clientes_comisionistas/" + vm.clienteComisionistaId(),
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalComisionista').modal('hide');
                loadComisionistas(vm.clienteId());
            },
            error: errorAjax
        });
    }
}

function datosOKComisionistas() {
    $('#comisionista-form').validate({
        rules: {
            cmbComerciales: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbComerciales: {
                required: "Debe elegir un comercial"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#comisionista-form").validate().settings;
    return $('#comisionista-form').valid();
}

function initTablaComisionistas() {
    tablaCarro = $('#dt_comisiones').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_comisiones'), breakpointDefinition);
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
        data: dataComisionistas,
        columns: [{
            data: "comercial"
        }, {
                data: "manPorVentaNeta",
                className: "text-right",
                render: function (data, type, row) {
                    return numeral(data).format('0,0.00');
                }
            }, {
                data: "manPorBeneficio",
                className: "text-right",
                render: function (data, type, row) {
                    return numeral(data).format('0,0.00');
                }
            }, {
                data: "clienteComisionistaId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteComisionista(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalComisionista' onclick='editComisionista(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }]
    });
}

function loadComisionista(data) {
    vm.clienteComisionistaId(data.clienteComisionistaId);
    vm.clienteId(data.clienteId);
    vm.comercialId(data.comercialId);
    vm.manPorVentaNeta(data.manPorVentaNeta);
    vm.manPorBeneficio(data.manPorBeneficio);
    //
    loadComerciales(data.comercialId);
}

function limpiaComisionista(data) {
    vm.clienteComisionistaId(0);
    vm.comercialId(null);
    vm.manPorVentaNeta(null);
    vm.manPorBeneficio(null)
}

function loadTablaComisionistas(data) {
    var dt = $('#dt_comisiones').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function loadComisionistas(id) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/comisionistas/" + vm.clienteId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaComisionistas(data);
        },
        error: errorAjax
    });
}

function loadComerciales(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var comerciales = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesComerciales(comerciales);
            if (id) {
                $("#cmbComerciales").val([id]).trigger('change');
            } else {
                $("#cmbComerciales").val([0]).trigger('change');
            }
        },
        error: errorAjax
    });
}

function editComisionista(id) {
    lineaEnEdicion = true;
    $.ajax({
        type: "GET",
        url: "/api/clientes_comisionistas/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if (data) {
                loadComisionista(data);
            }
        },
        error: errorAjax
    });
}

function deleteComisionista(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                clienteComisionista: {
                    clienteComisionistaId: id
                }
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/clientes_comisionistas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadComisionistas(vm.clienteId());
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

/*
* cambioComercial
* Al cambiar un comercial debemos ofertar
* el porcentaje que tiene por defecto para esa empresa
*/
function cambioComercial(data) {
    //
    if (!data) {
        return;
    }
    var comercialId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/contratos_comerciales/comercial_empresa/" + comercialId + "/" + vm.empresaId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // asignamos el manPorVentaNeta al vm
            vm.manPorVentaNeta(data.manPorVentaNeta);
            vm.manPorBeneficio(data.manPorBeneficio);
        },
        error: errorAjax
    });

}

function cambioCodigo(data) {
    // cuando cambia el código cambiamos la cuenta contable
    var codmacta = montarCuentaContable('43', vm.proId(), numDigitos); // (comun.js)
    vm.cuentaContable(codmacta);
}