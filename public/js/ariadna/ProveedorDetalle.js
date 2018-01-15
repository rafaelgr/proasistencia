/*-------------------------------------------------------------------------- 
proveedorDetalle.js
Funciones js par la página ProveedorDetalle.html
---------------------------------------------------------------------------*/
var proId = 0;

var numDigitos = 0; // número de digitos de cuenta contable


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

    $('#frmProveedor').submit(function () {
        return false;
    });

    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();

    $("#txtCodigo").blur(function () {
        cambioCodigoProveedor();
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
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

    proId = gup('ProveedorId');
    if (proId != 0) {
        var data = {
            proveedorId: proId
        }
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
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.proveedorId(0);
         // contador de código
         $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/proveedores/nuevoCod/proveedor",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                vm.codigo(data.codigo);
                cambioCodigoProveedor();
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
    self.proveedorId = ko.observable();
    self.codigo = ko.observable();
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
    self.motivoBaja = ko.observable();
    self.cuentaContable = ko.observable();
    self.iban = ko.observable();
    self.iban1 = ko.observable();
    self.iban2 = ko.observable();
    self.iban3 = ko.observable();
    self.iban4 = ko.observable();
    self.iban5 = ko.observable();
    self.iban6 = ko.observable();
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
}

function loadData(data) {
    vm.proveedorId(data.proveedorId);
    vm.codigo(data.codigo);
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
    vm.motivoBaja(data.motivo_baja);
    vm.cuentaContable(data.cuentaContable);
    vm.iban(data.IBAN);

    // split iban
    if (vm.iban()) {
        var ibanl = vm.iban().match(/.{4}/g);
        var i = 0;
        ibanl.forEach(function (ibn) {
            i++;
            vm['iban' + i](ibn);
        });
    }

    loadTiposVia(data.tipoViaId);
    loadFormasPago(data.formaPagoId)
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
            txtFechaAlta: {
                required: true,
            },
            txtfechaBaja: {
                greaterThan: "#txtFechaAlta",
            },
            txtCodigo: {
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
            txtCorreo: {
                email: 'Debe usar un correo válido'
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            txtFechaAlta: {
                required: "Debe seleccionar una fecha"
            },
            txtCodigo: {
                required: "Debe introducir un código para la contabilidad"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmProveedor").validate().settings;

    // iban
    vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
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
        var data = {
            proveedor: {
                "proveedorId": vm.proveedorId(),
                "codigo": vm.codigo(),
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
                "telefono2": vm.telefono2(),
                "movil": vm.movil(),
                "movil2": vm.movil2(),
                "correo2": vm.correo2(),
                "persona_contacto": vm.contacto(),
                "fechaAlta": spanishDbDate(vm.fechaAlta()),
                "fechaBaja": spanishDbDate(vm.fechaBaja()),
                "motivo_Baja": vm.motivoBaja(),
                "cuentaContable": vm.cuentaContable(),
                "formaPagoId": vm.sformaPagoId(),
                "IBAN": vm.iban()

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

function loadFormasPago(formaPagoId) {
    llamadaAjax("GET", "/api/formas_pago", null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([formaPagoId]).trigger('change');
    });
}

function cambioCodigoProveedor(data) {
    var codmacta = montarCuentaContable('40', vm.codigo(), numDigitos); // (comun.js)
    vm.cuentaContable(codmacta);
}

