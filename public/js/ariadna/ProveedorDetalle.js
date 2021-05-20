/*-------------------------------------------------------------------------- 
proveedorDetalle.js
Funciones js par la página ProveedorDetalle.html
---------------------------------------------------------------------------*/
var proId = 0;


var numDigitos = 0; // número de digitos de cuenta contable

var intentos = 0;
var dataFacturas;
var facproveId;
var codigoSugerido;
var antNif = ""//recoge el valor que tiene el nif al cargar la página
var usuario;
var numfactu = 0;

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};




datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    usuario = recuperarUsuario();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
   

    $('#frmProveedor').submit(function () {
        return false;
    });

    //carga de combos
    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();
    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();
    $("#cmbTiposProfesional").select2(select2Spanish());
    loadTiposProfesionales();
    // select2 things
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    loadDepartamentos();
    $("#cmbPaises").select2(select2Spanish());
    loadPaises();
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
   
    $("#cmbTiposProveedor").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));

        cambioTipoProveedor(e.added);
    });

    $("#txtNif").on('change', function (e) {
        var nif = $("#txtNif").val();
        if(!nif || nif == "") return;

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


    loadTiposProveedor(1);
    $("#cmbMotivosBaja").select2(select2Spanish());
    loadMotivosBaja();

    $("#cmbTarifas").select2(select2Spanish());
    loadTarifas();

    $("#cmbTiposRetencion").select2(select2Spanish());
    loadTiposRetencion();

    $("#txtCodigo").blur(function () {
        compruebaCodigoProveedor();
    });
    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();

    initTablaFacturas();

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
    }, 'La fecha de alta debe ser menor que la fecha de baja.');
//

    // obtener el número de digitos de la contabilidad
    // para controlar la cuenta contable.
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contabilidad/infcontable/",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            numDigitos = data.numDigitos
            proId = gup('ProveedorId');
            if (proId != 0) {
                var data = {
                    proveedorId: proId
                }
                $('#cmbTiposProveedor').attr('disabled', true);
                $('#txtCodigo').attr('disabled', true)
                // hay que buscar ese elemento en concreto
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/proveedores/" + proId,
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
        
                // contador de código
               /*  $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/proveedores/nuevoCod/proveedor",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        
                        codigoSugerido = data.codigo;//guardamos el codigo sugerido para poder usarlo si se cambia 
                                                    //el codigo y resulta que ya está asignado
        
                    
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                        // si hay algo más que hacer lo haremos aquí.
                    }
                }); */
        
                loadFacturasDelProveedor(proId);
                compruebaAnticipos(proId);
            } else {
                // se trata de un alta ponemos el id a cero para indicarlo.
                vm.proveedorId(0);
                vm.activa(1);
                vm.cuentaContable(null);
                 // contador de código
                 var inicioCuenta = "40";
                 $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/proveedores/nuevoCod/proveedor/" + inicioCuenta,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        vm.codigo(data.codigo);
                        codigoSugerido = data.codigo;//guardamos el codigo sugerido para poder usarlo si se cambia el codigo y resulta que ya está asignado
                        $.ajax({
                            type: "GET",
                            url: "/api/tipos_proveedor/" + 1,
                            dataType: "json",
                            contentType: "application/json",
                            success: function (data, status) {
                                vm.inicioCuenta(data.inicioCuenta);
                                var codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos); 
                                vm.cuentaContable(codmacta);
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
        
                loadFacturasDelProveedor();
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function admData() {
    var self = this;
    self.proveedorId = ko.observable();
    self.codigo = ko.observable();
    self.serie = ko.observable();
    self.proId = ko.observable();
    self.nombre = ko.observable();
    self.nif = ko.observable();
    self.direccion = ko.observable();
    self.codPostal = ko.observable();
    self.poblacion = ko.observable();
    self.provincia = ko.observable();
    self.telefono = ko.observable();
    self.correo = ko.observable();
    self.telefono2 = ko.observable();
    self.movil = ko.observable();
    self.movil2 = ko.observable();
    self.correo2 = ko.observable();
    self.contacto = ko.observable();
    self.fechaAlta = ko.observable();
    self.fechaBaja = ko.observable();
    self.cuentaContable = ko.observable();
    self.codigoProfesional = ko.observable();
    self.iban = ko.observable();
    self.iban1 = ko.observable();
    self.iban2 = ko.observable();
    self.iban3 = ko.observable();
    self.iban4 = ko.observable();
    self.iban5 = ko.observable();
    self.iban6 = ko.observable();
    self.inicioCuenta = ko.observable();
    self.tipoProOriginalId = ko.observable();
    self.codigoOriginal = ko.observable();
    self.observaciones = ko.observable();
    self.emitirFacturas = ko.observable();
    self.activa = ko.observable();
    //DATOS DE LA FIANZA
    self.fianza = ko.observable('0.00');
    self.fianzaAcumulada = ko.observable('0.00');
    self.retencionFianza = ko.observable('0.00');
    self.revisionFianza = ko.observable();

    //
    self.tipoViaId = ko.observable();
    self.stipoViaId = ko.observable();
    //
    self.posiblesTiposVia = ko.observableArray([]);
    self.elegidosTiposVia = ko.observableArray([]);
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    //
    self.tipoProveedorId = ko.observable();
    self.stipoProveedorId = ko.observable();
    //
    self.posiblesTiposProveedor = ko.observableArray([]);
    self.elegidosTiposProveedor = ko.observableArray([]);
    //
    self.tipoProfesionalId = ko.observable();
    self.stipoProfesionalId = ko.observable();
    //
    self.posiblesTiposProfesional = ko.observableArray([]);
    self.elegidosTiposProfesional = ko.observableArray([]);
    //
    self.motivoBajaId = ko.observable();
    self.smotivoBajaId = ko.observable();
    //
    self.posiblesMotivosBaja = ko.observableArray([]);
    self.elegidosMotivosBaja = ko.observableArray([]);
    //
    self.tarifaProveedorId = ko.observable();
    self.starifaProveedorId = ko.observable();
    //
    self.posiblesTarifas = ko.observableArray([]);
    self.elegidasTarifas = ko.observableArray([]);

    //COMBIO RETENCIONES
    self.codigoRetencion = ko.observable();
    self.scodigoRetencion = ko.observable();
    //
    self.posiblesTiposRetencion = ko.observableArray([]);
    self.elegidosCodigosRetencion = ko.observableArray([]);
    //COMBO TIPOS IVA
    self.tipoIvaId = ko.observable();
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);

    //combo departamentos
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
    //combo paises
    //
    self.paisId = ko.observable();
    self.spaisId = ko.observable();
    //
    self.posiblesPaises = ko.observableArray([]);
    self.elegidosPaises = ko.observableArray([]);

    //COMBO EMPRESA
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    
  
}

function loadData(data) {
    vm.proveedorId(data.proveedorId);
    vm.codigo(data.codigo);
    vm.serie(data.serie);
    vm.codigoOriginal(data.codigo);
    vm.proId(data.proId);
    vm.nombre(data.nombre);
    vm.nif(data.nif);
    vm.direccion(data.direccion);
    vm.codPostal(data.codPostal);
    vm.provincia(data.provincia);
    vm.telefono(data.telefono);
    vm.correo(data.correo);
    vm.poblacion(data.poblacion);
    vm.telefono2(data.telefono2);
    vm.movil(data.movil);
    vm.movil2(data.movil2);
    vm.correo2(data.correo2);
    vm.contacto(data.persona_contacto);
    vm.fechaAlta(spanishDate(data.fechaAlta));
    vm.fechaBaja(spanishDate(data.fechaBaja));
    vm.cuentaContable(data.cuentaContable);
    vm.iban(data.IBAN);
    vm.fianza(data.fianza);
    vm.fianzaAcumulada(data.fianzaAcumulada);
    vm.retencionFianza(data.retencionFianza);
    vm.revisionFianza(spanishDate(data.revisionFianza));
    vm.codigoProfesional(data.codigoProfesional);
    vm.observaciones(data.observaciones);
    vm.paisId(data.paisId);
    vm.emitirFacturas(data.emitirFacturas);
    vm.empresaId(data.empresaId);
    vm.activa(data.activa);
    
    
    antNif = data.nif;
    // split iban
    if (vm.iban()) {
        var ibanl = vm.iban().match(/.{4}/g);
        var i = 0;
        ibanl.forEach(function (ibn) {
            i++;
            vm['iban' + i](ibn);
        });
    }
    obtenInicioCuenta();

    loadTiposVia(data.tipoViaId);
    loadTiposIva(data.tipoIvaId)
    loadFormasPago(data.formaPagoId);
    loadTiposProveedor(data.tipoProveedor);
    //loadTiposProfesional(data.tipoProfesionalId);
    loadMotivosBaja(data.motivoBajaId);
    loadTarifas(data.tarifaId);
    loadTiposRetencion(data.codigoRetencion);
    loadPaises(data.paisId);
    loadEmpresas(data.empresaId);
    buscaDepartamentos();
    buscaProfesiones();
    //loadDepartamentos(data.departamentoId)
}

function obtenInicioCuenta() {
    var codmacta = vm.cuentaContable();
    var inicio = codmacta.substr(0, 2);
    vm.inicioCuenta(inicio);

}

function datosOK() {
    $('#frmProveedor').validate({
        rules: {
            txtNif: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtCorreo: {
                email: true
            },
            txtCorreo2: {
                email: true
            },
            cmbFormasPago: {
                required: true
            },
            cmbTiposIva: {
                required: true
            },
            cmbTiposProveedor: {
                required: true
            },
            cmbTiposProfesional: {
                required: true
            },
            txtFechaAlta: {
                required: true
            },
            txtfechaBaja: {
                greaterThan: "#txtFechaAlta",
            },
            txtCodigo: {
                required: true,
                digits: true
            },
            txtCodigoProfesional: {
                required: true
            },
            txtCuentaContable: {
                required: true
            },
            cmbPaises: {
                required: true,
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
            txtCorreo: {
                email: 'Debe usar un correo válido'
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbTiposIva: {
                required: "Debe elegir un tipo de iva"
            },
            cmbTiposProveedor: {
                required: "Debe elegir un tipo de proveedor"
            },
            cmbTiposProfesional: {
                required: "Debe elegir un tipo de profesional"
            },
            txtFechaAlta: {
                required: "Debe seleccionar una fecha"
            },
            txtCodigo: {
                required: "Debe introducir un código para la contabilidad",
                digits: "Debe introducir un número"
            },
            txtCodigoProfesional: {
                required: "Debe introducir un código profesional de proveedor"
            },
            txtCuentaContable: {
                required: "Este campo no puede estar vacio"
            },
            cmbPaises: {
                required: "Debe introducir un código de país"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmProveedor").validate().settings;

    // iban
    //vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
    var opciones = $("#frmProveedor").validate().settings;
    if (vm.iban() && vm.iban() != "") {
        if (!IBAN.isValid(vm.iban())) {
            mensError("IBAN incorrecto");
            return false;
        }
    }

    return $('#frmProveedor').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) return;
        if(!vm.fianza() || vm.fianza() == '') vm.fianza('0.00'); 
        if(vm.starifaProveedorId() == 0) vm.starifaProveedorId(null);
        if(vm.sempresaId() == 0) vm.sempresaId(null);
        if(!vm.cuentaContable() || vm.cuentaContable() == '') {
            mensError('La cuenta contable está vacia');
            return;
        }
        var data = {
            proveedor: {
                "proveedorId": vm.proveedorId(),
                "codigo": vm.codigo(),
                "serie": vm.serie(),
                "proId": vm.proId(),
                "nombre": vm.nombre(),
                "nif": vm.nif(),
                "direccion": vm.direccion(),
                "poblacion": vm.poblacion(),
                "provincia": vm.provincia(),
                "codPostal": vm.codPostal(),
                "telefono": vm.telefono(),
                "correo": vm.correo(),
                "tipoViaId": vm.stipoViaId(),
                "tipoProveedor": vm.stipoProveedorId(),
                "tipoProfesionalId": vm.stipoProfesionalId(),
                "telefono2": vm.telefono2(),
                "movil": vm.movil(),
                "movil2": vm.movil2(),
                "correo2": vm.correo2(),
                "persona_contacto": vm.contacto(),
                "fechaAlta": spanishDbDate(vm.fechaAlta()),
                "fechaBaja": spanishDbDate(vm.fechaBaja()),
                "activa": vm.activa(),
                "motivoBajaId": vm.smotivoBajaId(),
                "cuentaContable": vm.cuentaContable(),
                "formaPagoId": vm.sformaPagoId(),
                "IBAN": vm.iban(),
                "codigoProfesional": vm.codigoProfesional(),
                "fianza": vm.fianza(),
                "tipoIvaId": vm.stipoIvaId(),
                "fianzaAcumulada": vm.fianzaAcumulada(),
                "retencionFianza" : vm.retencionFianza(),
                "revisionFianza": spanishDbDate(vm.revisionFianza()),
                "tarifaId": vm.starifaProveedorId(),
                "codigoRetencion": vm.scodigoRetencion(),
                "observaciones": vm.observaciones(),
                "paisId": vm.spaisId(),
                "emitirFacturas": vm.emitirFacturas(),
                "empresaId": vm.sempresaId()

            },
            departamentos: {
                "departamentos": vm.elegidosDepartamentos()
            },
            profesiones: {
                "profesiones": vm.elegidosTiposProfesional()
            }
        };
        if (proId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/proveedores",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ProveedoresGeneral.html?ProveedorId=" + vm.proveedorId();
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
                url: myconfig.apiUrl + "/api/proveedores/" + proId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ProveedoresGeneral.html?ProveedorId=" + vm.proveedorId();
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
        var url = "ProveedoresGeneral.html";
        window.open(url, '_self');
    }
    return mf;
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

function loadEmpresas(empresaId) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
        if(empresaId) vm.sempresaId(empresaId);
    });
}

function loadTiposIva(id) {
    llamadaAjax("GET", "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([null]).trigger('change');
        }
    });
}

function loadTiposProveedor(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_proveedor",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposProveedor = [{ tipoProveedorId: null, nombre: "" }].concat(data);
            vm.posiblesTiposProveedor(tiposProveedor);
            $("#cmbTiposProveedor").val([id]).trigger('change');
            vm.tipoProOriginalId(vm.stipoProveedorId());
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}



function loadFormasPago(formaPagoId) {
    llamadaAjax("GET", "/api/formas_pago", null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([formaPagoId]).trigger('change');
    });
}

function loadMotivosBaja(id) {
    llamadaAjax("GET", '/api/motivos_baja', null, function (err, data) {
        if (err) return;
        var motivoBaja = [{ motivoBajaId: 0, nombre: "" }].concat(data);
        vm.posiblesMotivosBaja(motivoBaja);
        $("#cmbMotivosBaja").val([id]).trigger('change');
    });
}

function loadTarifas(id){
    $.ajax({
        type: "GET",
        url: "/api/tarifas_proveedor",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tarifas = [{ tarifaProveedorId: 0, nombre: "" }].concat(data);
            vm.posiblesTarifas(tarifas);
            $("#cmbTarifas").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposRetencion(id) {
    llamadaAjax("GET", "/api/facturasProveedores/retenciones/tiposreten/facprove", null, function (err, data) {
        if (err) return;
        vm.posiblesTiposRetencion(data);
        if (id) {
            $("#cmbTiposRetencion").val([id]).trigger('change');
            vm.scodigoRetencion(id);
        
        } else {
            $("#cmbTiposRetencion").val([0]).trigger('change');
            vm.scodigoRetencion(0);
          
        }
    });
}

function loadDepartamentos(departamentosIds) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        var ids = [];
        if (err) return;
        var departamentos = data;
        vm.posiblesDepartamentos(departamentos);
        if(departamentosIds) {
            vm.elegidosDepartamentos(departamentosIds);
            for ( var i = 0; i < departamentosIds.length; i++ ) {
                ids.push(departamentosIds[i].departamentoId)
            }
            $("#cmbDepartamentosTrabajo").val(ids).trigger('change');
        }
    });
}

function loadTiposProfesionales(tiposProfesionalesIds) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_profesional/",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var ids = [];
            var tiposProfesionales  = data
            vm.posiblesTiposProfesional(tiposProfesionales);
            if(tiposProfesionalesIds) {
                vm.elegidosTiposProfesional(tiposProfesionalesIds);
                for ( var i = 0; i < tiposProfesionalesIds.length; i++ ) {
                    ids.push(tiposProfesionalesIds[i].tipoProfesionalId)
                }
                $("#cmbTiposProfesional").val(ids).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}



function loadPaises(id) {
    llamadaAjax("GET", "/api/proveedores/recupera/cod/pais", null, function (err, data) {
        if (err) return;
        var paises = [{ paisId: null, nombre: "" }].concat(data);
        vm.posiblesPaises(paises);
        if (id) {
            $("#cmbPaises").val([id]).trigger('change');
        } else {
            $("#cmbPaises").val([null]).trigger('change');
        }
    });
}



function buscaDepartamentos() {
    llamadaAjax("GET", "/api/proveedores/departamentos/asociados/" + proId, null, function (err, data) {
        if (err) return;
        loadDepartamentos(data);
    });
}

function buscaProfesiones() {
    llamadaAjax("GET", "/api/proveedores/profesiones/asociadas/todas/" + proId, null, function (err, data) {
        if (err) return;
        loadTiposProfesionales(data);
    });
}
   



function compruebaCodigoProveedor() {
    var codmacta;
    if(vm.stipoProveedorId()){
        if(vm.codigo()){
            var codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos); 
            vm.cuentaContable(codmacta);
            llamadaAjax("GET", "/api/proveedores/codigo/proveedor/" + vm.cuentaContable(), null, function (err, data) {
                if (!data) {
                    if(vm.stipoProveedorId() == vm.tipoProOriginalId()) {
                        if(vm.codigoOriginal()) vm.codigo(vm.codigoOriginal());
                        if(vm.inicioCuenta() &&  vm.codigo() && numDigitos) {}
                        codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos); 
                        vm.cuentaContable(codmacta);
                    } 
                }
                if(data) {
                    if(vm.stipoProveedorId() == vm.tipoProOriginalId()) {
                        if(vm.codigoOriginal()) vm.codigo(vm.codigoOriginal());
                        codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos); 
                        vm.cuentaContable(codmacta);
                    } else {
                        mostrarMensajeSmart('La cuenta contable ya existe');
                        vm.codigo(codigoSugerido);
                        codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos);
                        vm.cuentaContable(codmacta);
                    }
                }
            });
        }
    }    
}
function cambioTipoProveedor(data) {
    if(data) {
        if(vm.cuentaContable() && vm.cuentaContable() != '') {
            // mensaje de confirmación
            var mens = "Al cambiar el tipo de proveedor se cambiará su cuenta contable ¿Realmente desea cambiar el tipo de proveedor registro?";
            $.SmartMessageBox({
                title: "<i class='fa fa-info'></i> Mensaje",
                content: mens,
                buttons: '[Aceptar][Cancelar]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Aceptar") {
                    $.ajax({
                        type: "GET",
                        url: "/api/tipos_proveedor/" + data.id,
                        dataType: "json",
                        contentType: "application/json",
                        success: function (data, status) {
                            vm.inicioCuenta(data.inicioCuenta);
                            // contador de código
                            $.ajax({
                                type: "GET",
                                url: myconfig.apiUrl + "/api/proveedores/nuevoCod/proveedor/" + data.inicioCuenta,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(data),
                                success: function (datos, status) {
                                    //guardamos el codigo sugerido para poder usarlo si se cambia el codigo y resulta que ya está asignado
                                    codigoSugerido = datos.codigo;
                                    vm.codigo(datos.codigo)
                                    compruebaCodigoProveedor();
                                
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
                if (ButtonPressed === "Cancelar") {
                    // no hacemos nada (no quiere borrar)
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: "/api/tipos_proveedor/" + data.id,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    vm.inicioCuenta(data.inicioCuenta);
                        compruebaCodigoProveedor();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });   

            /* mensError("No hay una cuenta contable por defecto, recargue la página");
            return; */
        }
    }
}


function compruebaNifRepetido(nif) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/proveedores/comprueba/nif/repetido/" + nif,
        dataType: "json",
        contentType: "application/json",
        data:null,
        success: function (data, status) {
            if(data && data.proveedorId != vm.proveedorId()) {
               mensError('Ya existe un proveedor con este NIF');
               
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


//---- Solapa facturas
function initTablaFacturas() {
    tablaFacturas = $('#dt_factura').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "Facturas Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_factura'), breakpointDefinition);
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
        data: dataFacturas,
        columns: [{
            data: "facproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "numeroFacturaProveedor"
        }, {
            data: "receptorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "total"
        }, {
            data: "totalConIva"
        },  {
            data: "vFPago"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_factura thead th input[type=text]").on('keyup change', function () {
        tablaFacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
}


function loadFacturasDelProveedor(proveedorId) {
    llamadaAjax("GET", myconfig.apiUrl +  "/api/facturasProveedores/proveedor/facturas/solapa/muestra/tabla/datos/factura/" + proveedorId, null, function (err, data) {
        if (err) return;
        loadTablaFacturas(data);
    });
}

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    if(data) {
        numfactu = data.length;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editFactura(id) {
    // hay que abrir la página de detalle de prefactura
    // pasando en la url ese ID
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    window.open(url, '_new');
}

function deleteFactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                   if(data.nombreFacprovePdf){
                    $.ajax({
                        type: "DELETE",
                        url: myconfig.apiUrl + "/api/doc/" + data.nombreFacprovePdf,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (data, status) {
                        },
                        error: function (err) {
                            mensErrorAjax(err);
                            // si hay algo más que hacer lo haremos aquí.
                        }
                    });
                   }
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
           
            var data = {
                facproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarFacturas();
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

function buscarFacturas() {
    var mf = function () {
        loadFacturasDelProveedor(proId);
    };
    return mf;
}



function compruebaAnticipos(id) {
        llamadaAjax('GET', "/api/anticiposProveedores/proveedor/recupera/todos/" + id, null, function (err, data) {
            if (err) return;
            if(data.length > 0 || numfactu > 0) {
                $( "#txtNif" ).prop( "disabled", true );
                $( "#txtCodigo" ).prop( "disabled", true );
            } else {
                $( "#txtNif" ).prop( "disabled", false );
                $( "#txtCodigo" ).prop( "disabled", false );
            }
        });
}

