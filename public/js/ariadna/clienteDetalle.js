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

var importeCobro = 0;
var empId = 0;
var lineaEnEdicion = false;
var cambAgente;
var datosCambioAgente;
var ClienteId;
var fechaTope;
var fechasCambio = [];
var frContrato = '';
var my_array = new Array('9/04/2019', '02/02/2021'); 


var numDigitos = 0; // número de digitos de cuenta contable

datePickerSpanish(); // see comun.js

$('#txtNuevaFecha').datepicker({
        closeText: 'Cerrar',
        prevText: '&#x3C',
        nextText: '&#x3E;',
        currentText: 'Hoy',
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        format: 'm/d/yyyy',
    beforeShowDay: my_check
});



var dataComisionistas;
var dataClientesAgentes;
var dataClientesCobros;

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
    $("#btnOfertaTrabajo").click(copiarDireccionOfertaEnTrabajo);
    $("#btnTrabajoFiscal").click(copiarDireccionTrabajoEnFiscal);
    $("#btnFiscalPostal").click(copiarDireccionFiscalEnPostal);

    $("#frmCliente").submit(function () {
        return false;
    });
    $('#frmCambioAgente').submit(function () {
        return false;
    });

    $("#txtCodigo").blur(function () {
        //if(!vm.codigo() || vm.codigo() == "") return;
        cambioCodigo();
    });

    $("#txtCodComercial").blur(function () {
        cambioCodComercial();
    });

    $("#txtNif").on('change', function (e) {
        var nif = $("#txtNif").val();
        if(nif != "") {
            nif = nif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
            $('#txtNif').val(nif);

            var patron = new RegExp(/^\d{8}[a-zA-Z]{1}$/);//VALIDA NIF
            var esNif = patron.test(nif);

            var patron2 = new RegExp(/^[a-zA-Z]{1}\d{7}[a-zA-Z0-9]{1}$/);
            var esCif = patron2.test(nif);
            if(esNif || esCif) {
                compruebaNifRepetido(nif);
            } else {
                mensError('El nif introducido no tiene un formato valido');
                $('#txtNif').val('');
            }
        }
    });

    
    // $("#txtCuentaContable").on('blur', function (e) {
    //     var nif = vm.nif();
    //     if(nif != "" && nif) {
    //         compruebaNifRepetido(nif);
    //     }
    // });

    $("#txtProId").on('change', function (e) {
        var proId = $("#txtProId").val();
        if(proId != "") {
            compruebaProIdRepetido(proId);
        }
    });

    $("#txtNombre").on('change', function (e) {
        var val = $("#txtNombre").val();
        if(val != "") {
            vm.nombreComercial(val);
        }
    });

    $('#chkActiva').on('change', function (e) {
        var cuentaContable = vm.cuentaContable();
        if( $('#chkEmail').prop("checked", true)) {
            compruebaCuentaContable(cuentaContable);
        }
    });

    
    $("#txtEmail").on('change', function (e) {
        var correo = $("#txtCorreoOfertas").val();
        var val = $('#txtEmail').val();
        if(val != "" && correo == "") {
            vm.emailOfertas(val);
        }
    });

    $("#txtEmailFacturas").on('change', function (e) {
        var correo = $("#txtCorreoOfertas").val();
        var val = $('#txtEmailFacturas').val();
        if(val != "" && correo == "") {
            vm.emailOfertas(val);
        }
    });

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
    $("#cmbTiposVia3").select2(select2Spanish());
    loadTiposVia3();

        // select2 things
        $("#cmbTiposViaOfertas").select2(select2Spanish());
        loadTiposViaOfertas();

    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();

    // select2 things
    $("#cmbAgentes").select2(select2Spanish());
    $("#cmbAgentes").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioAgente(e.added);
        if(e.added) cambioComercial(e.added);
    });
    loadAgentes();


    // select2 things
    $("#cmbComerciales").select2(select2Spanish());
    loadComerciales();
    /*$("#cmbComerciales").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if(e.added) cambioComercial(e.added);
        
       
    });*/

    // select2 things
    $("#cmbTarifas").select2(select2Spanish());
    loadTarifas();

    // autosalto en IBAN
    $(function () {
        $(".ibans").keyup(function () {
            if (this.value.length == this.maxLength) {
                var r = $(this).attr('id').substr(0, 7);
                var n = $(this).attr('id').substr(7);
                var n1 = n * 1 + 1;
                var r2 = r + n1;
                $("#" + r2).focus();
            }
        });
    });
    

   

    //initTablaComisionistas();
    initTablaClientesAgentes();
    initTablaClientesCobros();


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
    frContrato = gup('frContrato');
    //OCULTAMOS ELEMENTOS DEL HTML CUANDO CARGAMOS EL IFRAME DESDE EL CONTRATO
    if(frContrato == 'true') {
        $('#btnAceptar').hide();
        $('#btnSalir').hide();
        $('#btnImportar').hide();
        $("#left-panel").hide();
      
        $('#header').hide();
        $('#ribbon').hide();
        $('#footer').hide();
        $('#detalleCliente').hide();
        $('#hAgentes').hide();
        $('#hCobros').hide();
        $('#main').css('margin-left', 0)
    }else {
        $('#btnAceptar').show();
        $('#btnSalir').show();
        $('#btnImportar').show();
        $("#left-panel").show();
      
        $('#header').show();
        $('#ribbon').show();
        $('#footer').show();
        $('#detalleCliente').show();
        $('#hAgentes').show();
        $('#hCobros').show();
        $('#main').css('margin-left', 220)
    }


    if (empId != 0) {
        var data = {
            clienteId: empId
        }
        loadClientesAgentes(empId);
        loadClientesCobros(empId);
        compruebaFacturasAnticipos(empId);
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/clientes/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data, true);
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
        vm.activa(1);
        vm.fechaAlta(spanishDate(new Date()));
        vm.limiteCredito(0);
        $('#chkEmail').prop("checked", true);
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


    //abrir en pestaña de facturas de proveedores
    /*if (del == "true") {
       $('.nav-tabs a[href="#s2"]').tab('show');
   } */
}



function my_check(in_date) { 
    var d = in_date.getDate();
    d = d.toString().padStart(2, '0');

    var m = in_date.getMonth() + 1;
    m = m.toString().padStart(2, '0');

    var y = in_date.getFullYear();
    y = y.toString().padStart(2, '0');

    in_date = d + '/' 
    + m + '/' + y; 
   

    for(var i = 0; i < fechasCambio.length; i++) {
        if (fechasCambio[i].indexOf(in_date) >= 0) { 
            return [false, "no dis", 'No disponible']; 
        } 
    }
    return [true, "dis", "Disponible"]; 
} 
function admData() {
    var self = this;
    self.clienteId = ko.observable();
    self.comercialId = ko.observable();
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
    self.limiteCredito = ko.observable();
    self.direccion2 = ko.observable();
    self.codPostal2 = ko.observable();
    self.poblacion2 = ko.observable();
    self.provincia2 = ko.observable();
    self.direccion3 = ko.observable();
    self.codPostal3 = ko.observable();
    self.poblacion3 = ko.observable();
    self.provincia3 = ko.observable();
    self.codComercial = ko.observable();
    self.dniFirmante = ko.observable();
    self.firmante = ko.observable();
    self.facturarPorEmail = ko.observable();ko.observable();
    self.emailFacturas = ko.observable();
    self.antCuentaContable = ko.observable();
    self.loginWeb = ko.observable();
    self.passWeb = 
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
    self.tipoViaId3 = ko.observable();
    self.stipoViaId3 = ko.observable();
    //
    self.posiblesTiposVia2 = ko.observableArray([]);
    self.elegidosTiposVia2 = ko.observableArray([]);
    //
    self.posiblesTiposVia3 = ko.observableArray([]);
    self.elegidosTiposVia3 = ko.observableArray([]);
    //
    //
    self.tarifaClienteId = ko.observable();
    self.starifaClienteId = ko.observable();
    //
    self.posiblesTarifas = ko.observableArray([]);
    self.elegidasTarifas = ko.observableArray([]);
    //
    self.tipoIvaId = ko.observable();
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);

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
    //--Valores del modal de cambio de agente
    self.antiguoAgenteNombre = ko.observable();
    self.nuevoAgenteNombre = ko.observable();
    self.fechaCambio = ko.observable();
    self.nombreAgente = ko.observable();
    self.antiguoAgenteId = ko.observable();

    //valores informativos del agente
    self.tipoViaAgente = ko.observable();
    self.direccionAgente = ko.observable();
    self.poblacionAgente = ko.observable();
    self.codPostalAgente = ko.observable();
    self.provinciaAgente = ko.observable();
    self.telefonoAgente = ko.observable();
    self.correoAgente = ko.observable();
    self.contactoAgente = ko.observable();
    
    //VALORES DIRECCIÓN OFERTAS
    self.direccionOfertas = ko.observable();
    self.codPostalOfertas = ko.observable();
    self.poblacionOfertas = ko.observable();
    self.provinciaOfertas = ko.observable();
    self.numeroOfertas = ko.observable();
    self.puertaOfertas = ko.observable();
    self.emailOfertas = ko.observable();
     //
     self.tipoViaIdOfertas = ko.observable();
     self.stipoViaIdOfertas = ko.observable();
     //
     self.posiblesTiposViaOfertas = ko.observableArray([]);
     self.elegidosTiposViaOfertas = ko.observableArray([]);
     //DATOS DEL PRESIDENTE DE LA COMUNIDAD
     self.nombrePresidente = ko.observable();
     self.dniPresidente = ko.observable();
     self.correoPresidente = ko.observable();    
}

function loadData(data, desdeLoad, importacion) {
    vm.clienteId(data.clienteId);
    vm.comercialId(data.comercialId);
    vm.antiguoAgenteId(data.comercialId);
    vm.nombreAgente(data.nombreAgente);
    vm.antiguoAgenteNombre(data.nombreAgente);
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
    vm.antCuentaContable(data.cuentaContable);

    vm.iban(data.iban);
    vm.codigo(data.codigo);
    vm.codComercial(data.codigoComercial);
    vm.dniFirmante(data.dniFirmante);
    vm.firmante(data.firmante);
    vm.facturarPorEmail(data.facturarPorEmail);
    vm.limiteCredito(data.limiteCredito);
    vm.emailFacturas(data.emailFacturas);
    vm.loginWeb(data.loginWeb);
    vm.passWeb(data.passWeb);
    //
    vm.nombrePresidente(data.nombrePresidente);
    vm.dniPresidente(data.dniPresidente);
    vm.correoPresidente(data.correoPresidente);

    if(importacion) {
        vm.direccion2(data.direccion);
        vm.codPostal2(data.codPostal);
        vm.provincia2(data.provincia);
        vm.poblacion2(data.poblacion);
        vm.nombreComercial(data.nombre)
    } else {
        // direccion 2
        vm.direccion2(data.direccion2);
        vm.codPostal2(data.codPostal2);
        vm.provincia2(data.provincia2);
        vm.poblacion2(data.poblacion2);

    }
    
    // direccion 3
    vm.direccion3(data.direccion3);
    vm.codPostal3(data.codPostal3);
    vm.provincia3(data.provincia3);
    vm.poblacion3(data.poblacion3);

    loadTiposVia2(data.tipoViaId2);
    loadTiposVia3(data.tipoViaId3);

    //direción ofertas
    vm.direccionOfertas(data.direccionOfertas);
    vm.codPostalOfertas(data.codPostalOfertas);
    vm.provinciaOfertas(data.provinciaOfertas);
    vm.poblacionOfertas(data.poblacionOfertas);
    vm.emailOfertas(data.emailOfertas);
    vm.numeroOfertas(data.numeroOfertas);
    vm.puertaOfertas(data.puertaOfertas);
    loadTiposViaOfertas(data.tipoViaIdOfertas);


    loadTiposClientes(data.tipoClienteId);
    loadFormasPago(data.formaPagoId);
    loadMotivosBaja(data.motivoBajaId);
    loadTiposVia(data.tipoViaId);
    loadAgentes(data.comercialId);
    loadTarifas(data.tarifaId);

    loadClientesAgentes(empId);
    loadClientesCobros(empId);
    loadComerciales(data.colaboradorId);
    loadTiposIva(data.tipoIvaId)

    var data2 = { id: data.comercialId };
    cambioAgente(data2, desdeLoad);
    //
    //loadComisionistas(data.clienteId);
    // split iban
    if (vm.iban()) {
        var ibanl = vm.iban().match(/.{1,4}/g);
        var i = 0;
        ibanl.forEach(function (ibn) {
            i++;
            vm['iban' + i](ibn);
        });
    }

    cambioComercial(data2);
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
            cmbTiposIva: {
                required: true
            },
            txtCodigo: {
                required: true,
                number: true
            },
            txtLimiteCredito: {
                number: true,
                required:true
            },
            cmbTiposIva: {
                required: true
            },
            cmbAgentes: {
                required: true
            },
            txtCuentaContable: {
                required: true,
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
            txtLimiteCredito: {
                number: 'Debe introducir un numero',
                required: 'Se tiene que establecer un límite de credito'
            },
            cmbTiposClientes: {
                required: "Debe elegir un tipo cliente"
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbTiposIva: {
                required: "Debe elegir un tipo de iva"
            },
            txtCodigo: {
                required: "Debe introducir un código para contabilidad",
                number: "El códig debe ser numérico"
            },
            cmbTiposIva: {
                required: 'Debe intruducir un tipo de IVA'
            },
            cmbAgentes: {
                required: "Debe seleccionar un agente"
            },
            txtCuentaContable: {
                required: "Campo obligatorio",
                length: "La longitud es de 9 digitos"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmCliente").validate().settings;
    if (vm.stipoClienteId() == 1) {
        // Si es mantenedor no necesita agente
        delete opciones.rules.cmbAgentes;
        delete opciones.messages.cmbAgentes;
    }

    if (!$('#frmCliente').valid()) return false;
    // mas controles
    // iban
    //vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
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
        if (!datosOK()) return;
        if($('#chkActiva').prop('checked')) {
            if(vm.cuentaContable() == null || vm.cuentaContable() == "") {
                mensError('El Campo cuenta contable es obligatorio');
                return;
            }
        }
        if(vm.starifaClienteId() == 0) vm.starifaClienteId(null);
        if(vm.scomercialId() == 0) vm.scomercialId(null);
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
                "firmante": vm.firmante(),
                "direccion3": vm.direccion3(),
                "poblacion3": vm.poblacion3(),
                "provincia3": vm.provincia3(),
                "codPostal3": vm.codPostal3(),
                "tipoViaId3": vm.stipoViaId3(),
                "tarifaId": vm.starifaClienteId(),
                "colaboradorId": vm.scomercialId(),
                "tipoIvaId": vm.stipoIvaId(),
                "facturarPorEmail": vm.facturarPorEmail(),
                "limiteCredito": vm.limiteCredito(),
                "emailFacturas": vm.emailFacturas(),
                "loginWeb": vm.loginWeb(),
                "passWeb": vm.passWeb(),
                "direccionOfertas" : vm.direccionOfertas(),
                "tipoViaIdOfertas": vm.stipoViaIdOfertas(),
                "codPostalOfertas" : vm.codPostalOfertas(),
                "poblacionOfertas" : vm.poblacionOfertas(),
                "provinciaOfertas" : vm.provinciaOfertas(),
                "numeroOfertas" : vm.numeroOfertas(),
                "puertaOfertas" : vm.puertaOfertas(),
                "emailOfertas" : vm.emailOfertas(),
                "nombrePresidente": vm.nombrePresidente(),
                "dniPresidente": vm.dniPresidente(),
                "correoPresidente": vm.correoPresidente()
                
            } 
        };
        
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/clientes/nuevo",
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
            if(!$('#chkActiva').prop('checked')) {
                //comprobamos que el cliente no tenga contratos activos
                $.ajax({
                 type: "GET",
                 url: "/api/clientes/contratos/activos/cliente/" + empId,
                 dataType: "json",
                 contentType: "application/json",
                 success: function (data2, status) {
                     if(data2) { 
                         // mensaje de confirmación
                         //procesamos el mansaje
                         var mens = "Este cliente tiene los siguientes contratos activos.<br>"
                         for(let d of data2) {
                             mens += JSON.stringify(d.referencia) + "<br>";
                         }
                         mens = mens.replace(/["{}]/g, '');
                         mens += "¿Realmente desea desactivar el cliente?.";
                         $.SmartMessageBox({
                             title: "<i class='fa fa-info'></i> Mensaje",
                             content: mens,
                             buttons: '[Aceptar][Cancelar]'
                         }, function (ButtonPressed) {
                             if (ButtonPressed === "Aceptar") {
                                continuarGuardarCliente(data);
                             }
                             if (ButtonPressed === "Cancelar") {
                                 // no hacemos nada (no quiere aceptar)
                                 return;
                             }
                         });
                     }  else {
                        continuarGuardarCliente(data);
                     }
                 },
                 error: function (err) {
                     mensErrorAjax(err);
                     // si hay algo más que hacer lo haremos aquí.
                 }
             });
     
             } else {
                continuarGuardarCliente(data);
             }
        }
    };
    return mf;
}
var continuarGuardarCliente = function(data) {
     //se continua si se acepta
     data.cliente.antCuentaContable = vm.antCuentaContable();
     $.ajax({
         type: "PUT",
         url: myconfig.apiUrl + "/api/clientes/" + empId,
         dataType: "json",
         contentType: "application/json",
         data: JSON.stringify(data),
         success: function (data, status) {
             //actualizamos los contratos activos
             actualizaContratosActivos(data);
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
                data.codigo = vm.codigo();
                data.cuentaContable = vm.cuentaContable();
                // hay que mostrarlo en la zona de datos
                loadData(data, null, true);
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
    if (id == -1) {
        id = vm.antiguoAgenteId();
    }
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
            var tiposVia = [{ tipoViaId: null, nombre: "" }].concat(data);
            vm.posiblesTiposVia(tiposVia);
            $("#cmbTiposVia").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadTiposIva(id) {
    llamadaAjax("GET", "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        [{ formaPagoId: 0, nombre: "" }]
        var tiposIva = [{ tipoIvaId: null, nombre: "" }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([null]).trigger('change');
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

function loadTiposVia3(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposVia3 = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposVia3(tiposVia3);
            $("#cmbTiposVia3").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposViaOfertas(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposViaOfertas = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposViaOfertas(tiposViaOfertas);
            $("#cmbTiposViaOfertas").val([id]).trigger('change');
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

function loadDatosAgente(data) {
   if(data) {
    vm.tipoViaAgente(data.tipoViaAgente);
    vm.direccionAgente(data.direccion);
    vm.poblacionAgente(data.poblacion);
    vm.codPostalAgente(data.codPostal);
    vm.provinciaAgente(data.provincia);
    vm.telefonoAgente(data.telefono1);
    vm.correoAgente(data.email);
    vm.contactoAgente(data.contacto1);
   }
}

function compruebaNifRepetido(nif) {
    var cuentaContable = vm.cuentaContable();
    if(!cuentaContable || cuentaContable == '') {
        mensError('Se tiene que introducir una cuenta contable');
        return;
    }
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/clientes/comprueba/nif/repetido/" + nif,
        dataType: "json",
        contentType: "application/json",
        data:null,
        success: function (data, status) {
            if(data && data.clienteId != vm.clienteId()) {
               mensError('Ya existe un cliente con este NIF.');
               //$('#txtNif').val("");
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function compruebaCuentaContable(cuentaContable) {
    if(!cuentaContable || cuentaContable == '') {
        mensError('Se tiene que introducir una cuenta contable');
        return;
    }
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/clientes/comprueba/cuentaContable/repetida/" + cuentaContable,
        dataType: "json",
        contentType: "application/json",
        data:null,
        success: function (data, status) {
            if(data) {
                if(data.length == 1) {
                    if(data && data.clienteId != vm.clienteId()) {
                        mensError('Ya existe un cliente con esta cuenta contable');
                        //$('#txtCuentaContable').val("");
                        vm.cuentaContable(null);
                        //$('#txtCodigo').val("");
                     } else {
                         vm.cuentaContable(cuentaContable);
                     }
                } else {
                    mensError('Ya existe un cliente con esta cuenta contable');
                    //$('#txtCuentaContable').val("");
                    vm.cuentaContable(null);
                    vm.codigo(null);
                }
            }
            
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function compruebaProIdRepetido(proId) {
    var data = {
        cod: proId,
    }
    $.ajax({
        type: "POST",
        url: myconfig.apiUrl + "/api/clientes/comprueba/codigo/repetido",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data2, status) {
            if(data2 && data2.clienteId != vm.clienteId()) {
               mensError('Ya existe un cliente con este codigo');
               $('#txtProId').val("");
            }
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

/*function aceptarComisionista() {

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
}*/

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

/*function loadComisionistas(id) {
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
}*/

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

/*function deleteComisionista(id) {
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
}*/

/*
* cambioComercial
* Al cambiar un comercial debemos ofertar
* el porcentaje que tiene por defecto para esa empresa
*/
function cambioComercial(data) {
    //
    
    var comercialId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/comerciales/" + comercialId,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.porComer(data.porComer);
            loadDatosAgente(data);
        },
        error: function (err) {
            mensErrorAjax(err);
        }
    });

}


/*
* cambioAgente
* Al cambiar un agente hay que traer el colaborador asociado
*/
function cambioAgente(data, desdeLoad) {
    //
    if (!data) {
        return;
    }
    //guardamos la id del nuevo agente.
    cambAgente = data.id;

    $.ajax({
        type: "GET",
        url: "/api/comerciales/" + data.id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            datosCambioAgente = data;
            //comparamos la id del nuevo agente con la id del agente del cliente para ver si hay cambio
            if (cambAgente != vm.antiguoAgenteId() && empId != 0 && vm.antiguoAgenteId() != null) {
                $('#modalCambioAgente').modal({
                    show: 'true'
                });
                loadModal(data)
            } else {
                if(!desdeLoad) {
                    vm.direccion3(data.direccion);
                    vm.poblacion3(data.poblacion);
                    vm.codPostal3(data.codPostal);
                    vm.provincia3(data.provincia);
                    vm.emailOfertas(data.email);
                    loadTiposVia3(data.tipoViaId);
                    realizarCambioAgente(data);
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

function realizarCambioAgente(data) {
    if (!data) {
        data = datosCambioAgente;
        guardaClienteAgente();
    }
    // le damos valor al código
    vm.codComercial(data.proId);
    if (data) {
        loadComerciales(data.ascComercialId);
        loadTarifas(data.tarifaId);
    }
}


function limpiaModalClientesAgentes() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/clientes/" + empId,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.nuevoAgenteNombre(null);
            vm.fechaCambio(null);
            loadData(data);
            $('#modalCambioAgente').modal('hide');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function actualizaContratosActivos(datos) {
    
    var data =  {
        contrato: {
         agenteId: datos.comercialId,
        }
    }
    $.ajax({
     type: "PUT",
     url: myconfig.apiUrl + "/api/contratos/cliente/actualizado/" + vm.clienteId(),
     dataType: "json",
     contentType: "application/json",
     data: JSON.stringify(data),
     success: function (data, status) {
         
        
     },
     error: function (err) {
         mensErrorAjax(err);
     }
     });
}

function guardaClienteAgente() {
    //se actualiza el cliente con los nuevos valores

    if (!datosOkClienteAgente()) {
        return;
    } else {
            if (!datosOK())
                return;

            if(vm.starifaClienteId() == 0) vm.starifaClienteId(null);
            if(vm.scomercialId() == 0) vm.scomercialId(null);


            var dataClienteAgente = {
                clienteAgente: {
                    clienteId: vm.clienteId(),
                    comercialId: vm.antiguoAgenteId(),
                    fechaCambio: spanishDbDate(vm.fechaCambio())
                }
            }
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
                    "antCuentaContable": vm.antCuentaContable(),
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
                    "firmante": vm.firmante(),
                    "direccion3": vm.direccion3(),
                    "poblacion3": vm.poblacion3(),
                    "provincia3": vm.provincia3(),
                    "codPostal3": vm.codPostal3(),
                    "tipoViaId3": vm.stipoViaId3(),
                    "tarifaId": vm.starifaClienteId(),
                    "colaboradorId": vm.scomercialId(),
                    "tipoIvaId": vm.stipoIvaId(),
                    "facturarPorEmail": vm.facturarPorEmail(),
                    "limiteCredito": vm.limiteCredito(),
                    "emailFacturas": vm.emailFacturas(),
                    "loginWeb": vm.loginWeb(),
                    "passWeb": vm.passWeb(),

                    "direccionOfertas" : vm.direccionOfertas(),
                    "tipoViaIdOfertas": vm.stipoViaIdOfertas(),
                    "codPostalOfertas" : vm.codPostalOfertas(),
                    "poblacionOfertas" : vm.poblacionOfertas(),
                    "provinciaOfertas" : vm.provinciaOfertas(),
                    "numeroOfertas" : vm.numeroOfertas(),
                    "puertaOfertas" : vm.puertaOfertas(),
                    "emailOfertas" : vm.emailOfertas(),

                    "nombrePresidente": vm.nombrePresidente(),
                    "dniPresidente": vm.dniPresidente(),
                    "correoPresidente": vm.correoPresidente()
                }
            }
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/clientes/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    //actualizamos la tabla clientes_agentes si el cliente se ha cambiado con exito
                    if(dataClienteAgente.clienteAgente.comercialId > 0) {
                        $.ajax({
                            type: "POST",
                            url: myconfig.apiUrl + "/api/clientes/agente",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(dataClienteAgente),
                            success: function (data, status) {
                                limpiaModalClientesAgentes();
                                var datos = {
                                    comercialId: vm.sagenteId()
                                }
                                actualizaContratosActivos(datos);
    
    
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    } else {
                        limpiaModalClientesAgentes();
                        var datos = {
                            comercialId: vm.sagenteId()
                        }
                        actualizaContratosActivos(datos);
                    }
                    
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        
    }

}

function datosOkClienteAgente() {

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




function loadModal(data) {
    vm.nuevoAgenteNombre(data.nombre);
    vm.antiguoAgenteNombre();
    vm.fechaCambio(spanishDate(new Date()));
}

function cambioCodigo(data) {
    $.ajax({
        type: "GET",
        url: "/api/cuentas/" + vm.codigo(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // cuando cambia el código cambiamos la cuenta contable
            if (data && empId != 0) {
                vm.nombreComercial(data.nombre);
            }
            var codmacta = montarCuentaContable('43', vm.codigo(), numDigitos); // (comun.js)
            vm.cuentaContable(codmacta);
            compruebaCuentaContable(codmacta)
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

var copiarDireccionOfertaEnTrabajo = function () {
    var d = vm.direccionOfertas() + ", "+ vm.numeroOfertas();
    if(vm.puertaOfertas()) {
        d += " Nº " + vm.puertaOfertas();
    }
    vm.direccion2(d);
    vm.codPostal2(vm.codPostalOfertas());
    vm.provincia2(vm.provinciaOfertas());
    vm.poblacion2(vm.poblacionOfertas());
    loadTiposVia2(vm.stipoViaIdOfertas());
}

var copiarDireccionTrabajoEnFiscal = function () {
    vm.direccion(vm.direccion2());
    vm.codPostal(vm.codPostal2());
    vm.provincia(vm.provincia2());
    vm.poblacion(vm.poblacion2());
    loadTiposVia(vm.stipoViaId2());
}
var copiarDireccionFiscalEnPostal = function () {
    vm.direccion3(vm.direccion());
    vm.codPostal3(vm.codPostal());
    vm.provincia3(vm.provincia());
    vm.poblacion3(vm.poblacion());
    loadTiposVia3(vm.stipoViaId());

}

/* FUNCIONES RELACIONADAS CON LA CARGA DE LA TABLA HISTORIAL DE AGENTES */

function initTablaClientesAgentes() {
    tablaCarro = $('#dt_clientesAgentes').dataTable({
        sort: false,
        autoWidth: true,
        
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_clientesAgentes'), breakpointDefinition);
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
        data: dataClientesAgentes,
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
                fechasCambio.push(spanishDate(data));
                return spanishDate(data);
            }
        }, {
            data: "nombre",
            className: "text-right",
        }, {
            data: "clienteAgenteId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteClienteAgente(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var html = "<div>" + bt1 + "</div>";
                return html;
            }
        }]
    });
}


function loadTablaClientesAgentes(data) {
    var dt = $('#dt_clientesAgentes').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data) dt.fnAddData(data);
    dt.fnDraw();
    
}

function loadClientesAgentes(id) {
    llamadaAjax('GET', "/api/clientes/historial/agentes/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) {
            fechaTope = spanishDate(data[0].fechaCambio);
            fechaTope = spanishDbDate(fechaTope);
        } else {
            fechaTope = null;
        }
        loadTablaClientesAgentes(data);
    });
}


function deleteClienteAgente(clienteAgenteId) {
    // mensaje de confirmación
    var mensaje = "¿Realmente desea borrar este registro?. Al borrarse se establecerá el agente borrado como agente del cliente";
    mensajeAceptarCancelar(mensaje, function () {

        llamadaAjax("DELETE", "/api/clientes/clienteAgente/" + clienteAgenteId, null, function (err, data) {
            if (err) return;
            var datos = {
                cliente: {
                    "clienteId": vm.clienteId(),
                    "proId": vm.proId(),
                    "nombre": vm.nombre(),
                    "nombreComercial": vm.nombreComercial(),
                    "nif": vm.nif(),
                    "comercialId": data[0].comercialId
                }
            }

            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/clientes/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(datos),
                success: function (dataBis, status) {
                    limpiaModalClientesAgentes();
                    actualizaContratosActivos(data[0])
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

/* FUNCIONES RELACIONADAS CON LA CARGA DE LA TABLA HISTORIAL DE COBROS */

function initTablaClientesCobros() {
    tablaCarro = $('#dt_clientesCobros').dataTable({
        sort: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_clientesCobros'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow, aData) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
            if ( !aData.seguro )
            {
                importeCobro += parseFloat(aData.impvenci);
                $('td', nRow).css('background-color', 'Orange');
            }
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
        data: dataClientesAgentes,
        columns: [{
            data: "numorden"
        }, {
            data: "numserie"
        }, {
            data: "numfactu"
        }, {
            data: "fecfactu",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        }, {
            data: "fecvenci",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        }, {
            data: "impvenci",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "fecultco",
            render: function (data, type, row) {
                return spanishDate(data);
            }
        }, {
            data: "impcobro",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "nomforpa"
        }]
    });
}


function loadTablaClientesCobros(data) {
    var limite = parseFloat(vm.limiteCredito())
    var dt = $('#dt_clientesCobros').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data) dt.fnAddData(data);
    dt.fnDraw();
    if(vm.limiteCredito()) {
        if(importeCobro > limite) {
            mensError('ATENCION!!!, este cliente ha superado su limete de credito');
        }
    }
}

function loadClientesCobros(id) {
    llamadaAjax('GET', "/api/cobros/cliente/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) {
            fechaTope = spanishDate(data[0].fechaCambio);
            fechaTope = spanishDbDate(fechaTope);
        } else {
            fechaTope = null;
        }
        loadTablaClientesCobros(data);
    });
}

function compruebaFacturasAnticipos(id) {
    llamadaAjax('GET', "/api/facturas/cliente/recupera/todas/" + id, null, function (err, data) {
        if (err) return;
        llamadaAjax('GET', "/api/anticiposClientes/cliente/recupera/todos/" + id, null, function (err, data2) {
            if (err) return;
            if(!vm.codigo()) return; // si no hay codigo contable permityimos la edición aunque tenga facturas o anticipos
            if(data.length > 0 || data2.length > 0) {
                $( "#txtNif" ).prop( "disabled", true );
                $( "#txtCodigo" ).prop( "disabled", true );
                $( "#txtNombreComercial" ).prop( "disabled", true );
                $('#txtNombre').prop( "disabled", true );
            } else {
                $( "#txtNif" ).prop( "disabled", false );
                $( "#txtCodigo" ).prop( "disabled", false );
                $( "#txtNombreComercial" ).prop( "disabled", false );
                $('#txtNombre').prop( "disabled", false );
            }
        });
    });
}