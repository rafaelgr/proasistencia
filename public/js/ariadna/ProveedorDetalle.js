/*-------------------------------------------------------------------------- 
proveedorDetalle.js
Funciones js par la página ProveedorDetalle.html
---------------------------------------------------------------------------*/
var proId = 0;


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

    //
    $.validator.addMethod("greaterThan",
    function (value, element, params) {
        var fv = moment(value, "DD-MM-YYYY").format("YYYY-MM-DD");
        var fp = moment($(params).val(), "DD-MM-YYYY").format("YYYY-MM-DD");
        if (!/Invalid|NaN/.test(new Date(fv))) {
            return new Date(fv) >= new Date(fp);
        } else {
            // esto es debido a que permitimos que la segunda fecha nula
            return true;
        }
    }, 'La fecha de alta debe ser menor que la fecha de baja.');
//

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
    }
}

function admData() {
    var self = this;
    self.proveedorId = ko.observable();
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
    vm.fechaAlta(moment(data.fechaAlta).format('DD-MM-YYYY'));
    
    //si la fecha de baja no está establecida ponemos el campo vacio
    if (data.fechaBaja == '0000-00-00'){
        vm.fechaBaja('');
    }else{
        vm.fechaBaja(moment(data.fechaBaja).format('DD-MM-YYYY'));
    }
   
    vm.motivoBaja(data.motivo_baja);
    vm.cuentaContable(data.cuentaContable);
    vm.iban(data.IBAN);

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
            txtFechaAlta: {
                required: true
            },
            txtFechaBaja: {
                greaterThan: "#txtFechaAlta"
            },
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
            txtFechaAlta: {
                required: "Debe seleccionar una fecha"
            },
            txtFechaBaja: {
                required: "Debe seleccionar una fecha"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmProveedor").validate().settings;
    return $('#frmProveedor').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) return;
        var data = {
            proveedor: {
                "proveedorId": vm.proveedorId(),
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
                "fechaAlta": moment(vm.fechaAlta(), "DD-MM-YYYY").format('YYYY-MM-DD'),
                "fechaBaja": moment(vm.fechaBaja(), "DD-MM-YYYY").format('YYYY-MM-DD'),
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

