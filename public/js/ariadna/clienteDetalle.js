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

    $("#txtCodigo").blur(function () {
        cambioCodigo();
    });

    $("#txtCodComercial").blur(function () {
        cambioCodComercial();
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
    $("#cmbMotivosBaja").select2(select2Spanish());
    loadMotivosBaja();

    // select2 things
    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();


    // select2 things
    $("#cmbTiposVia2").select2(select2Spanish());
    loadTiposVia2();

    // select2 things
    $("#cmbAgentes").select2(select2Spanish());
    $("#cmbAgentes").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioAgente(e.added);
    });
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
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
                $("#wid-id-2").show();
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.clienteId(0);
        // escondemos el grid de colaboradores asociados
        $("#wid-id-2").hide();
        // contador de código
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/clientes/nuevocodigo/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                vm.codigo(data.codigo);
                cambioCodigo();
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
}

function admData() {
    var self = this;
    self.clienteId = ko.observable();
    self.proId = ko.observable();
    self.nombre = ko.observable();
    self.nombreComercial = ko.observable();
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
    self.iban1 = ko.observable();
    self.iban2 = ko.observable();
    self.iban3 = ko.observable();
    self.iban4 = ko.observable();
    self.iban5 = ko.observable();
    self.iban6 = ko.observable();
    self.codigo = ko.observable();
    self.colaborador = ko.observable();
    self.direccion2 = ko.observable();
    self.codPostal2 = ko.observable();
    self.poblacion2 = ko.observable();
    self.provincia2 = ko.observable();
    self.codComercial = ko.observable();
    self.dniFirmante = ko.observable();
    self.firmante = ko.observable();
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
    //
    self.tipoViaId = ko.observable();
    self.stipoViaId = ko.observable();
    //
    self.posiblesTiposVia = ko.observableArray([]);
    self.elegidosTiposVia = ko.observableArray([]);
    //
    //
    self.tipoViaId2 = ko.observable();
    self.stipoViaId2 = ko.observable();
    //
    self.posiblesTiposVia2 = ko.observableArray([]);
    self.elegidosTiposVia2 = ko.observableArray([]);
    //-- Valores para form de comisionistas
    //
    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    //
    self.motivoBajaId = ko.observable();
    self.smotivoBajaId = ko.observable();
    //
    self.posiblesMotivosBaja = ko.observableArray([]);
    self.elegidosMotivosBaja = ko.observableArray([]);
    //    
    self.clienteComisionistaId = ko.observable();
    self.clienteId = ko.observable();
    self.comercialId = ko.observable();
    self.manPorVentaNeta = ko.observable();
    self.manPorBeneficio = ko.observable();
    self.porComer = ko.observable();
    //
    self.empresaId = ko.observable(null);
}

function loadData(data) {
    vm.clienteId(data.clienteId);
    vm.proId(data.proId);
    vm.nombre(data.nombre);
    vm.nombreComercial(data.nombreComercial);
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
    vm.codigo(data.codigo);
    vm.codComercial(data.codComercial);
    vm.dniFirmante(data.dniFirmante);
    vm.firmante(data.firmante);
    // direccion 2
    vm.direccion2(data.direccion2);
    vm.codPostal2(data.codPostal2);
    vm.provincia2(data.provincia2);
    vm.poblacion2(data.poblacion2);
    loadTiposVia2(data.tipoViaId2);
    loadTiposClientes(data.tipoClienteId);
    loadFormasPago(data.formaPagoId);
    loadMotivosBaja(data.motivoBajaId);
    loadTiposVia(data.tipoViaId);
    loadAgentes(data.comercialId);
    var data = { id: data.comercialId };
    cambioAgente(data);
    //
    loadComisionistas(data.clienteId);
    // split iban
    if (vm.iban()) {
        var ibanl = vm.iban().match(/.{1,4}/g);
        var i = 0;
        ibanl.forEach(function (ibn) {
            i++;
            vm['iban' + i](ibn);
        });
    }
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
            },
            txtCodigo: {
                required: true,
                number: true
            },
            cmbAgentes: {
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
            cmbTiposClientes: {
                required: "Debe elegir un tipo cliente"
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            txtCodigo: {
                required: "Debe introducir un código para contabilidad",
                number: "El códig debe ser numérico"
            },
            cmbAgentes: {
                required: "Debe seleccionar un agente"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmCliente").validate().settings;
    if (vm.stipoClienteId() == 1){
        // Si es mantenedor no necesita agente
        delete opciones.rules.cmbAgentes;
        delete opciones.messages.cmbAgentes;
    }
    
    if (!$('#frmCliente').valid()) return false;
    // mas controles
    // iban
    vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
    if (vm.iban() && vm.iban() != "") {
        if (!IBAN.isValid(vm.iban())) {
            mensError("IBAN incorrecto");
            return false;
        }
    }
    // 
    return true;
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
                "nombreComercial": vm.nombreComercial(),
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
                "motivoBajaId": vm.smotivoBajaId(),
                "cuentaContable": vm.cuentaContable(),
                "iban": vm.iban(),
                "comercialId": vm.sagenteId(),
                "codigo": vm.codigo(),
                "tipoViaId": vm.stipoViaId(),
                "direccion2": vm.direccion2(),
                "poblacion2": vm.poblacion2(),
                "provincia2": vm.provincia2(),
                "codPostal2": vm.codPostal2(),
                "tipoViaId2": vm.stipoViaId2(),
                "dniFirmante": vm.dniFirmante(),
                "firmante": vm.firmante()
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
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
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
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
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
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
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
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadMotivosBaja(id) {
    $.ajax({
        type: "GET",
        url: "/api/motivos_baja",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var motivosBaja = [{ motivoBajaId: 0, nombre: "" }].concat(data);
            vm.posiblesMotivosBaja(motivosBaja);
            $("#cmbMotivosBaja").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadAgentes(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/agentes/activos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var agentes = [{ comercialId: 0, nombre: "", proId: "" }].concat(data);
            vm.posiblesAgentes(agentes);
            $("#cmbAgentes").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposVia(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposVia = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposVia(tiposVia);
            $("#cmbTiposVia").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposVia2(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposVia2 = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposVia2(tiposVia2);
            $("#cmbTiposVia2").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
            manPorBeneficio: vm.manPorBeneficio(),
            porComer: vm.porComer()
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
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
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
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
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
        },{
            data: "tipo"
        }, {
            data: "porComer",
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
    vm.porComer(data.porComer);
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
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
            vm.porComer(data.comision);
        },
        error: function (err) {
            // buscamos el comercial para sacar sus datos por defecto
            $.ajax({
                type: "GET",
                url: "/api/comerciales/" + comercialId,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    vm.porComer(data.porComer);
                },
                error: function (err) {

                }
            });
        }
    });

}


/*
* cambioAgente
* Al cambiar un agente hay que traer el colaborador asociado
*/
function cambioAgente(data) {
    //
    if (!data) {
        return;
    }
    $.ajax({
        type: "GET",
        url: "/api/comerciales/" + data.id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // le damos valor al código
            vm.codComercial(data.proId);
            if (data) {
                $.ajax({
                    type: "GET",
                    url: "/api/comerciales/" + data.ascComercialId,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data, status) {
                        if (data) {
                            vm.colaborador(data.nombre);
                        }
                    }
                });
            }
        },
        error: function (err) {
            if (err.status !== 404){
                mensErrorAjax(err);
            }
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}

function cambioCodigo(data) {
    $.ajax({
        type: "GET",
        url: "/api/cuentas/" + vm.codigo(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // cuando cambia el código cambiamos la cuenta contable
            if (data) {
                vm.nombreComercial(data.nombre);
            }
            var codmacta = montarCuentaContable('43', vm.codigo(), numDigitos); // (comun.js)
            vm.cuentaContable(codmacta);
        },
        error: function (err) {

        }
    });
}

function cambioCodComercial(data) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/codigo/" + vm.codComercial(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // cuando cambia el código cambiamos el agente
            if (data) {
                $("#cmbAgentes").val([data.comercialId]).trigger('change');
                var d = {};
                d.id = data.comercialId;
                cambioAgente(d);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}