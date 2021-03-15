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
var dataProveedorAsc;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var empId = 0;
var cambColaborador;
var datosCambioColaborador;
var dataAgentesColaboradores;
var nifGuardado;
var firmanteValido = true;

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
    $('#btnActualizarClientes').click(actualizaClientes());
    $("#frmComercial").submit(function () {
        return false;
    });

    $('#frmCambioAgente').submit(function () {
        return false;
    });frmProveedorAsc

    
    $('#frmProveedorAsc').submit(function () {
        return false;
    });ProveedorAsc_form

    $('#ProveedorAsc_form').submit(function () {
        return false;
    });

    initTablaContratosComerciales();
    initTablaClientes();
    initTablaProveedorAsc();

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
    // select2 things
    $("#cmbTarifas").select2(select2Spanish());
    loadTarifas();
    // select2 things
    $('#cmbProveedores').select2(select2Spanish());

    $("#cmbAscComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioAscColaborador(e.added);
    });

    $("#txtNif").on('blur', function () {
       vm.dniFirmante(vm.nif());
    });

    $("#txtNombre").on('blur', function () {
        vm.firmante(vm.nombre());
     });
    
    initTablaClientesAgentes();

   //actuaizacion de visualización del iban
   $(function () {
    $("#txtIban").change(function () {
        this.value = this.value.replace(/[- \s]/g, '');
        vm.iban(this.value);
        var num = 0;
        var cadena = null;
        var n1 = 0;
        for(var j = 1; j < 7; j++) {
            var s = $(this).attr('id').substr(0, 7);
            var s2 = s + j;
            $("#" + s2).val(null);
        }
        
        console.log(this.value)
        if (this.value.length > 0) {
            for(var i = 0; i < this.value.length; i++ ) {
                if(!cadena) {
                    cadena = this.value.substr(i, 1);
                    num++;
                } else {
                    cadena += this.value.substr(i, 1);
                    num++;
                }
                if (num == 4) {
                    var r = $(this).attr('id').substr(0, 7);
                    n1++;
                    var r2 = r + n1;
                    $("#" + r2).val(cadena);
                    num = 0;
                    cadena = null;
                }
            }
           
        }
    });
    });

    $("#txtNif").on('change', function (e) {
        var nif = $("#txtNif").val();
        if(!nif || nif == "") return;

        if(nif != "") {
            nif = nif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
            $('#txtNif').val(nif);

            var patron = new RegExp(/^\d{8}[a-zA-Z]{1}$/);//VALIDA NIF
            var esNif = patron.test(nif);

            var patron2 = new RegExp(/^[a-zA-Z]{1}\d{7}[a-zA-Z0-9]{1}$/);
            var esCif = patron2.test(nif);
            if(esNif || esCif) {
                //no hacemos nada
            } else {
                mensError('El nif introducido no tiene un formato valido');
                $('#txtNif').val('');
            }
        }
    });

    $("#txtDniFirmante").on('change', function (e) {
        var nif = $("#txtDniFirmante").val();
        if(!nif || nif == "") return;

        if(nif != "") {
            nif = nif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
            $('#txtDniFirmante').val(nif);

            var patron = new RegExp(/^\d{8}[a-zA-Z]{1}$/);//VALIDA NIF
            var esNif = patron.test(nif);

            var patron2 = new RegExp(/^[a-zA-Z]{1}\d{7}[a-zA-Z0-9]{1}$/);
            var esCif = patron2.test(nif);
            if(esNif || esCif) {
              
                firmanteValido = true;
            } else {
                mensError('El DNI del firmante habitual introducido no tiene un formato valido');
                firmanteValido = false
                //$('#txtDniFirmante').val('');
            }
        }
    });

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
        vm.activa(1);
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
    self.emailFacturas = ko.observable();
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
     //
     self.tarifaClienteId = ko.observable();
     self.starifaClienteId = ko.observable();
     //
     self.posiblesTarifas = ko.observableArray([]);
     self.elegidasTarifas = ko.observableArray([]);

     //COMBO PROVEEDORES
     //
     self.proveedorId = ko.observable();
     self.sproveedorId = ko.observable();
     //
     self.posiblesProveedores = ko.observableArray([]);
     self.elegidosProveedores = ko.observableArray([]);
}

function loadData(data, desdeLoad) {
    vm.comercialId(data.comercialId);
    vm.proId(data.proId);
    vm.nombre(data.nombre);
    vm.nif(data.nif);
    nifGuardado = data.nif
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
    vm.emailFacturas(data.emailFacturas);
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
    loadTarifas(data.tarifaId);
    cambioAscColaborador(data, desdeLoad);
    loadProveedorAsc(data.proveedorId);
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
            txtEmailFacturas: {
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
            txtEmailFacturas: {
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
    };
    if (vm.stipoComercialId() == 1) {
        // es un agente y necesita un colaborador asociado
        options.rules.cmbAscComerciales = { required: true };
        options.messages.cmbAscComerciales = { required: "Los agentes están asociados a un colaborador" };
    }

    $('#frmComercial').validate(options);
    var opciones = $("#frmComercial").validate().settings;
    // iban
    //vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
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
        if(!firmanteValido && vm.dniFirmante() != "") {
            mensError('El DNI del firmante habitual introducido no tiene un formato valido');
            return;
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
                "emailFacturas": vm.emailFacturas(),
                "observaciones": vm.observaciones(),
                "dniFirmante": vm.dniFirmante(),
                "firmante": vm.firmante(),
                "tipoComercialId": vm.stipoComercialId(),
                "ascComercialId": vm.sascComercialId(),
                "formaPagoId": vm.sformaPagoId(),
                "iban": vm.iban(),
                "tipoViaId": vm.stipoViaId(),
                "motivoBajaId": vm.smotivoBajaId(),
                "loginWeb": vm.loginWeb(),
                "passWeb": vm.passWeb(),
                "tarifaId": vm.starifaClienteId(),
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

function actualizaClientes() {
    var mf = function () {
        if (!datosImportOK())
            return;
        $('#btnActualizaClientes').addClass('fa-spin');
        var url = myconfig.apiUrl + "/api/clientes/desde/agente/" + empId
        var data = {
            cliente: {
                tipoViaId3: vm.stipoViaId(),
                direccion3: vm.direccion(),
                poblacion3: vm.poblacion(),
                codPostal3: vm.codPostal(),
                provincia3: vm.provincia(),
                telefono1: vm.telefono1(),
                fax: vm.fax(),
                email: vm.email(),
                email2: vm.email2(),
                emailFacturas: vm.emailFacturas(),
                colaboradorId: vm.sascComercialId(),
                tarifaId: vm.starifaClienteId()
            }
        };
       
        $.ajax({
            type: "PUT",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data, status) {
                $('#btnActualizaClientes').removeClass('fa-spin');
                mensNormal('Los clientes se han actualizado con exito');
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

function loadTarifas(id) {
    $.ajax({
        type: "GET",
        url: "/api/tarifas_cliente",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tarifas = [{ tarifaClienteId: 0, nombre: "" }].concat(data);
            vm.posiblesTarifas(tarifas);
            $("#cmbTarifas").val([id]).trigger('change');
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


function aceptarExportar() {
        var proveedorId = vm.sproveedorId();
        //  URL Y METODO POR DEFECTO
        var url = myconfig.apiUrl + "api/comerciales/" +  vm.comercialId();
        var method = "PUT";
        var datos = {
            comercial: {
                comercialId: vm.comercialId(),
                nombre: vm.nombre(),
                nif: vm.nif(),
                proveedorId: proveedorId
            }
        }

        // obtener el número de digitos de la contabilidad
        // para controlar la cuenta contable.
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/contabilidad/infcontable/",
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                numDigitos = data.numDigitos
                // contador de código
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/proveedores/nuevoCod/proveedor/acreedor/autogenerado",
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        var codigo = data;
                        var codmacta = montarCuentaContable('410', codigo, numDigitos); 
                        //SI SE ELIGE EL CAMPO VACIO DEL DESPLEGABLE SE CREA Y VINCULA UN PROVEEDOR
                        if(proveedorId == 0) {
                            url = myconfig.apiUrl + "api/proveedores/";
                            method = "POST";
                            datos = preparaObjProveedor(codigo, codmacta);
                        }

                        $.ajax({
                            type: method,
                            url: url,
                            dataType: "json",
                            data: JSON.stringify(datos),
                            contentType: "application/json",
                            success: function (data, status) {
                                if(method == "POST") {
                                    url = myconfig.apiUrl + "api/comerciales/" +  vm.comercialId();
                                    method = "PUT";
                                    data = {
                                        comercial: {
                                            comercialId: vm.comercialId(),
                                            nombre: vm.nombre(),
                                            nif: vm.nif(),
                                            proveedorId: data.proveedorId
                                        }
                                    }
                                    $.ajax({
                                        type: method,
                                        url: url,
                                        dataType: "json",
                                        data: JSON.stringify(data),
                                        contentType: "application/json",
                                        success: function (data, status) {
                                            $('#modalProveedorAsc').modal('hide'); 
                                            loadProveedorAsc(data.proveedorId);
                                            mensNormal("Puede comprobar los datos del nuevo proveedor creado en la nueva pestaña que se ha abierto")
                                            var nuevo = "ProveedorDetalle.html?ProveedorId=" + data.proveedorId;
                                            window.open(nuevo, '_new');
                                        },
                                        error: function (err) {
                                            mensErrorAjax(err);
                                                // si hay algo más que hacer lo haremos aquí.
                                        }
                                    });
                                } else {
                                    $('#modalProveedorAsc').modal('hide'); 
                                    loadProveedorAsc(proveedorId);
                                }
                        
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
       
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
}


function preparaObjProveedor (codigo, codmacta) {
    var data = {
        proveedor: {
            "proveedorId": 0,
            "codigo": codigo,
            "cuentaContable": codmacta,
            "serie": "A",
            "nombre": vm.nombre(),
            "nif": vm.nif(),
            "direccion": vm.direccion(),
            "poblacion": vm.poblacion(),
            "provincia": vm.provincia(),
            "codPostal": vm.codPostal(),
            "telefono": vm.telefono1(),
            "telefono2": vm.telefono2(),
            "formaPagoId": vm.sformaPagoId(),
            "tipoViaId": vm.stipoViaId(),
            "persona_contacto": vm.contacto1(),
            "tipoProveedor": 2,
            "tipoProfesionalId": 1,
            "correo": vm.email(),
            "correo2": vm.email2(),
            "fechaAlta": spanishDbDate(vm.fechaAlta()),
            "fechaBaja": spanishDbDate(vm.fechaBaja()),
            "motivoBajaId": vm.smotivoBajaId(),
            "IBAN": vm.iban(),
            "codigoProfesional": '0000',
            "fianza": 0,
            "tipoIvaId": 3,
            "fianzaAcumulada": 0,
            "retencionFianza" : 0,
            "revisionFianza": null,
            "tarifaId": 1,
            "codigoRetencion": 0,
            "observaciones": vm.observaciones(),
            "paisId": 66,
            "emitirFacturas": 0,
        },
        departamentos: {
            "departamentos": [1,2,3,4,5,6,7,8]
        }
    };
    return data;
}

function loadProveedores() {
    var datos = [];
    if((!nifGuardado || nifGuardado == '') || (!vm.sformaPagoId() ||  vm.sformaPagoId() == '' )) {
        mensError("Se requiere el NIF y la forma de pago del colaborador para poder vincular, alguno de estos campos están vacios");
        setTimeout( function() { $('#modalProveedorAsc').modal('hide'); }, 50);
        return;
    }
    datos.push(nifGuardado);
    if(vm.dniFirmante() && vm.dniFirmante() != "") datos.push(vm.dniFirmante());
    $.ajax({
        type: "POST",
        url: "/api/proveedores/activos/proveedores/todos/por/nif",
        dataType: "json",
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function (data, status) {
            var comerciales = [{ proveedorId: 0, nombre: "" }].concat(data);
            vm.posiblesProveedores(comerciales);
            $("#cmbProveedores").val([0]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function initTablaProveedorAsc() {
    tablaCarro = $('#dt_ProveedorAsc').dataTable({
        autoWidth: true,
        "bPaginate": false,
        "searching": false,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_ProveedorAsc'), breakpointDefinition);
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
        data: dataProveedorAsc,
        columns: [{
            data: "nombre"
        }, {
            data: "nif"
        }, {
            data: "cuentaContable"
        },{
            data: "comercialId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-xs' onclick='desvinculaProveedorAsc(" + data + ");' title='Desvincular proveedor'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + "</div>";
                return html;
            }
        }]
    });
}


function loadTablaProveedorAsc(data) {
    var dt = $('#dt_ProveedorAsc').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnExportar').show();
    } 
    else if(!data) {
        $('#btnExportar').show();
    }
    else {
        $('#btnExportar').hide();
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadProveedorAsc(proveedorId) {
    if(!proveedorId) return;
    llamadaAjax("GET", "/api/proveedores/" + proveedorId, null, function (err, data) {
        if (err) return;
        loadTablaProveedorAsc(data);
    });
}

function desvinculaProveedorAsc(proveedorId) {
    // mensaje de confirmación
    var url = myconfig.apiUrl + "/api/comerciales/" + vm.comercialId();
    var mens = "¿Realmente desea desvincular este proveedor?";
    mensajeAceptarCancelar(mens, function () {
        var data = {
            comercial: {
                comercialId: vm.comercialId(),
                nombre: vm.nombre(),
                nif: vm.nif(),
                proveedorId: null
            }
        }
        llamadaAjax("PUT", url, data, function (err, data) {
            if (err) return;
            loadTablaProveedorAsc(null);
        });
    }, function () {
        // cancelar no hace nada
    });
}

