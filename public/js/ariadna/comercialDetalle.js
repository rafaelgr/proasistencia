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
var cambColaborador;
var datosCambioColaborador;
var dataAgentesColaboradores;

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

    $('#frmCambioAgente').submit(function () {
        return false;
    });

    initTablaContratosComerciales();
    initTablaClientes();

    // select2 things
    $("#cmbTiposComerciales").select2(select2Spanish());
    loadTiposComerciales();
    $("#cmbAscComerciales").select2(select2Spanish());
    loadAscComerciales();
    // select2 things
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();
    // select2 things
    $("#cmbMotivosBaja").select2(select2Spanish());
    loadMotivosBaja(); 
    // select2 things
    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();

    $("#cmbAscComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioAscColaborador(e.added);
    });
    
    initTablaClientesAgentes();

    empId = gup('ComercialId');
    if (empId != 0) {
        var data = {
            comercialId: empId
        }

        loadAgentesColaboradores(empId);
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/comerciales/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data, true);
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
                                    error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
                });
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl +  "/api/clientes/agente/" + empId,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadTablaClientes(data);
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
    self.iban = ko.observable();
    self.iban1 = ko.observable();
    self.iban2 = ko.observable();
    self.iban3 = ko.observable();
    self.iban4 = ko.observable();
    self.iban5 = ko.observable();
    self.iban6 = ko.observable();
    self.codigo = ko.observable();
    self.porComer = ko.observable();
    self.loginWeb = ko.observable();
    self.passWeb = ko.observable();
    self.ascComercialId = ko.observable();
    self.antiguoAscCoimercialId = ko.observable();
    self.antiguoColaboradorNombre = ko.observable();
    self.nuevoColaboradorNombre = ko.observable();
    self.antiguoColaboradorNombre = ko.observable();
    self.nuevoColaboradorNombre = ko.observable();
    self.fechaCambio = ko.observable();
    //
    self.tipoComercialId = ko.observable();
    self.stipoComercialId = ko.observable();
    //
    self.posiblesTiposComerciales = ko.observableArray([]);
    self.elegidosTiposComerciales = ko.observableArray([]);
    //
    self.ascComercialId = ko.observable();
    self.sascComercialId = ko.observable();
    //
    self.posiblesAscComerciales = ko.observableArray([]);
    self.elegidosAscComerciales = ko.observableArray([]);
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    //
    self.tipoViaId = ko.observable();
    self.stipoViaId = ko.observable();
    //
    self.posiblesTiposVia = ko.observableArray([]);
    self.elegidosTiposVia = ko.observableArray([]);
    //
    self.motivoBajaId = ko.observable();
    self.smotivoBajaId = ko.observable();
    //
    self.posiblesMotivosBaja = ko.observableArray([]);
    self.elegidosMotivosBaja = ko.observableArray([]);
}

function loadData(data, desdeLoad) {
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
    vm.loginWeb(data.loginWeb);
    vm.passWeb(data.passWeb);
    vm.ascComercialId(data.ascComercialId);
    vm.antiguoAscCoimercialId(data.ascComercialId);
    vm.antiguoColaboradorNombre(data.colaborador);

    loadTiposComerciales(data.tipoComercialId);
    loadAscComerciales(data.ascComercialId);

    vm.iban(data.iban);
    vm.porComer(data.porComer);
    loadMotivosBaja(data.motivoBajaId);    
    // split iban
    if (vm.iban()) {
        var ibanl = vm.iban().match(/.{1,4}/g);
        var i = 0;
        ibanl.forEach(function (ibn) {
            i++;
            vm['iban' + i](ibn);
        });
    }
    loadFormasPago(data.formaPagoId);
    loadTiposVia(data.tipoViaId);

    cambioAscColaborador(data, desdeLoad);
}

function datosOK() {
    var options = {
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
            },
            txtPorComer: {
                number: true
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
            },
            txtPorComer: {
                number: "Debe ser un número valido"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    };
    if (vm.stipoComercialId() == 1) {
        // es un agente y necesita un colaborador asociado
        options.rules.cmbAscComerciales = { required: true };
        options.messages.cmbAscComerciales = { required: "Los agentes están asociados a un colaborador" };
    }

    $('#frmComercial').validate(options);
    var opciones = $("#frmComercial").validate().settings;
    // iban
    vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
    var opciones = $("#frmComercial").validate().settings;
    if (vm.iban() && vm.iban() != "") {
        if (!IBAN.isValid(vm.iban())) {
            mensError("IBAN incorrecto");
            return false;
        }
    }
    return $('#frmComercial').valid();
}

function datosImportOK() {
    $('#frmComercial').validate({
        rules: {
            txtProId: {
                required: true
            },
            cmbTiposComerciales: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtProId: {
                required: "Introduzca un código"
            },
            cmbTiposComerciales: {
                required: "Debe escoger un tipo comercial antes de importar"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
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
                "tipoComercialId": vm.stipoComercialId(),
                "ascComercialId": vm.sascComercialId(),
                "formaPagoId": vm.sformaPagoId(),
                "iban": vm.iban(),
                "porComer": vm.porComer(),
                "tipoViaId": vm.stipoViaId(),
                "motivoBajaId": vm.smotivoBajaId(),
                "loginWeb": vm.loginWeb(),
                "passWeb": vm.passWeb()
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
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
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
        var url = myconfig.apiUrl + "/api/sqlany/comerciales/" + vm.proId();
        if (vm.stipoComercialId() == 1) {
            // los agentes se buscan en otro sitio
            url = myconfig.apiUrl + "/api/sqlany/agentes/" + vm.proId();
        }
        $.ajax({
            type: "GET",
            url: url,
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
                // volver a cargar  el tipoComercial
                loadTiposComerciales(vm.stipoComercialId());
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
                        error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
    });
}

function loadAscComerciales(id) {
    if(id < 0) {
        id = vm.antiguoAscCoimercialId();
    }
    $.ajax({
        type: "GET",
        url: "/api/comerciales/colaboradores/activos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var ascComerciales = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesAscComerciales(ascComerciales);
            //if (id){
            //    vm.stipoComercialId(id);
            //}
            $("#cmbAscComerciales").val([id]).trigger('change');
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
            data: "proId"
        }, {
            data: "nombre"
        }, {
            data: "direccion2"
        }, {
            data: "nif"
        }, {
            data: "telefono1"
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

function cambioAscColaborador(data, desdeLoad) {
    //
    if (!data) {
        return;
    }
    //guardamos la id del nuevo agente.
    cambColaborador = data.id;

    $.ajax({
        type: "GET",
        url: "/api/comerciales/" + data.id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            datosCambioColaborador = data;
            //comparamos la id del nuevo agente con la id del agente del cliente para ver si hay cambio
            if (cambColaborador != vm.antiguoAscCoimercialId() && empId != 0 && vm.antiguoAscCoimercialId() != null) {
                $('#modalCambioColaborador').modal({
                    show: 'true'
                });
                loadModal(data)
            } else {
                if(!desdeLoad) {
                    realizarCambioColaborador(data);
                }
            }
        },
        error: function (err) {
            if (err.status !== 404) {
                mensErrorAjax(err);
            }
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function realizarCambioColaborador(data) {
    if (!data) {
        data = datosCambioColaborador;
        guardaAgenteColaborador();
    }
}

function guardaAgenteColaborador() {
    //se actualiza el cliente con los nuevos valores

    if (!datosOkAgenteColaborador()) {
        return;
    } else {
            if (!datosOK())
                return;


            var dataAgenteColaborador = {
                AgenteColaborador: {
                    agenteId: vm.comercialId(),
                    colaboradorId:  vm.antiguoAscCoimercialId(),
                    fechaCambio: spanishDbDate(vm.fechaCambio())
                }
            }
           
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
                    "tipoComercialId": vm.stipoComercialId(),
                    "ascComercialId": vm.sascComercialId(),
                    "formaPagoId": vm.sformaPagoId(),
                    "iban": vm.iban(),
                    "porComer": vm.porComer(),
                    "tipoViaId": vm.stipoViaId(),
                    "motivoBajaId": vm.smotivoBajaId(),
                    "loginWeb": vm.loginWeb(),
                    "passWeb": vm.passWeb()
                }
            };            
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/comerciales/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    //actualizamos la tabla clientes_agentes si el cliente se ha cambiado con exito
                    $.ajax({
                        type: "POST",
                        url: myconfig.apiUrl + "/api/comerciales/agente",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(dataAgenteColaborador),
                        success: function (data, status) {
                            limpiaModalAgentesColaboradores();
                            loadAgentesColaboradores(empId);
                            /*var datos = {
                                comercialId: vm.sagenteId()
                            }
                            actualizaColaboradorAsociado(datos);*/


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

}

function loadModal(data) {
    vm.nuevoColaboradorNombre(data.nombre);
    vm.antiguoColaboradorNombre();
    vm.fechaCambio(spanishDate(new Date()));
}

/* FUNCIONES RELACIONADAS CON LA CARGA DE LA TABLA HISTORIAL DE COLABORADORES */

function initTablaClientesAgentes() {
    tablaCarro = $('#dt_clientesColaboradores').dataTable({
        sort: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_clientesColaboradores'), breakpointDefinition);
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
        data: dataAgentesColaboradores,
        columnDefs: [{
            "width": "20%",
            "targets": 0
        }, {
            "width": "5%",
            "targets": 2
        }
        ],
        columns: [{
            data: "fechaCambio",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        }, {
            data: "nombre",
            className: "text-right",
        }, {
            data: "agenteColaboradorId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteAgentesColaboradores(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var html = "<div>" + bt1 + "</div>";
                return html;
            }
        }]
    });
}


function loadTablaAgentesColaboradores(data) {
    var dt = $('#dt_clientesColaboradores').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data) dt.fnAddData(data);
    dt.fnDraw();
}

function loadAgentesColaboradores(id) {
    llamadaAjax('GET', "/api/comerciales/historial/agentes/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) {
            fechaTope = spanishDate(data[0].fechaCambio);
            fechaTope = spanishDbDate(fechaTope);
        } else {
            fechaTope = null;
        }
        loadTablaAgentesColaboradores(data);
    });
}


function deleteAgentesColaboradores(agenteColaboradorId) {
    // mensaje de confirmación
    var mensaje = "¿Realmente desea borrar este registro?. Al borrarse se establecerá el agente borrado como agente del cliente";
    mensajeAceptarCancelar(mensaje, function () {

        llamadaAjax("DELETE", "/api/comerciales/AgenteColaborador/" + agenteColaboradorId, null, function (err, data) {
            if (err) return;

            var data2 =  {
                comercial: {
                 comercialId: empId,
                 nombre: vm.nombre(),
                 nif: vm.nif(),
                 ascComercialId: data[0].colaboradorId
                }
            }
            
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/comerciales/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data2),
                success: function (dataBis, status) {
                    limpiaModalAgentesColaboradores();
                    loadAgentesColaboradores(data[0].agenteId);
                    //actualizaColaboradorAsociado(dataBis[0])
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        });
    }, function () {
        // cancelar no hace nada
    });
}

function datosOkAgenteColaborador() {

    $('#frmCambioAgente').validate({
        rules: {
            txtNuevaFecha: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNuevaFecha: {
                required: "Debe introducir una fecha"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmCambioAgente").validate().settings;
    return $('#frmCambioAgente').valid();
}

function limpiaModalAgentesColaboradores() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/comerciales/" + empId,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.nuevoColaboradorNombre(null)
            vm.fechaCambio(null);
            loadData(data);
            $('#modalCambioColaborador').modal('hide');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function actualizaColaboradorAsociado(datos) {
    
    var data =  {
        comercial: {
         comercialId: empId,
         nombre: vm.nombre(),
         nif: vm.nif(),
         ascComercialId: datos.comercialId
        }
    }
    $.ajax({
     type: "PUT",
     url: myconfig.apiUrl + "/api/comerciales/" + empId,
     dataType: "json",
     contentType: "application/json",
     data: JSON.stringify(data),
     success: function (data, status) {
        loadAgentesColaboradores(datos.comercialId);
        
     },
     error: function (err) {
         mensErrorAjax(err);
     }
     });
}