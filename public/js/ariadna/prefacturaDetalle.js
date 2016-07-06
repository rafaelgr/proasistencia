/*-------------------------------------------------------------------------- 
prefacturaDetalle.js
Funciones js par la página PrefacturaDetalle.html
---------------------------------------------------------------------------*/
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
    $("#frmPrefactura").submit(function() {
        return false;
    });

    // select2 things
    $("#cmbEmpresas").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function(e){
        alert(JSON.stringify(e.added));
    });

    // select2 things
    $("#cmbClientes").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });

    loadClientes();

    // select2 things
    $("#cmbFormasPago").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    loadFormasPago();


    empId = gup('PrefacturaId');
    if (empId != 0) {
        var data = {
                prefacturaId: empId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/prefacturas/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.prefacturaId(0);
    }
}

function admData() {
    var self = this;
    self.prefacturaId = ko.observable();
    self.ano = ko.observable();
    self.numero = ko.observable();
    self.serie = ko.observable();
    self.fecha = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.contratoMantenimientoId = ko.observable();
    //
    self.emisorNif = ko.observable();
    self.emisorNombre = ko.observable();
    self.emisorDireccion = ko.observable();
    self.emisorCodPostal = ko.observable();
    self.emisorPoblacion = ko.observable();
    self.emisorProvincia = ko.observable();
    //
    self.receptorNif = ko.observable();
    self.receptorNombre = ko.observable();
    self.receptorDireccion = ko.observable();
    self.receptorCodPostal = ko.observable();
    self.receptorPoblacion = ko.observable();
    self.receptorProvincia = ko.observable();
    //
    self.total = ko.observable();
    self.totalConIva = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    //
    self.observaciones = ko.observable();

}

function loadData(data) {
    vm.prefacturaId(data.prefacturaId);
    vm.ano(data.ano);
    vm.numero(data.numero);
    vm.serie(data.serie);
    vm.fecha(spanishDate(data.fecha));
    vm.empresaId(data.empresaId);
    vm.clienteId(data.clienteId);
    vm.contratoMantenimientoId(data.contratoMantenimientoId);
    //
    vm.emisorNif(data.emisorNif);
    vm.emisorNombre(data.emisorNombre);
    vm.emisorCodPostal(data.emisorCodPostal);
    vm.emisorPoblacion(data.emisorPoblacion);
    vm.emisorProvincia(data.emisorProvincia);
    vm.emisorDireccion(data.emisorDireccion);
    //
    vm.receptorNif(data.receptorNif);
    vm.receptorNombre(data.receptorNombre);
    vm.receptorCodPostal(data.receptorCodPostal);
    vm.receptorPoblacion(data.receptorPoblacion);
    vm.receptorProvincia(data.receptorProvincia);
    vm.receptorDireccion(data.receptorDireccion);

    //
    loadEmpresas(data.empresaId);
    loadClientes(data.clienteId);
    loadFormasPago(data.formaPagoId);
}

function datosOK() {
    $('#frmPrefactura').validate({
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
            cmbTiposPrefacturas: {
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
            txtEmail: {
                email: 'Debe usar un correo válido'
            },
            cmbTiposPrefacturas: {
                required: "Debe elegir un tipo prefactura"
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmPrefactura").validate().settings;
    return $('#frmPrefactura').valid();
}

function datosImportOK() {
    $('#frmPrefactura').validate({
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
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmPrefactura").validate().settings;
    return $('#frmPrefactura').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            prefactura: {
                "prefacturaId": vm.prefacturaId(),
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
                "observaciones": vm.observaciones(),
                "tipoPrefacturaId": vm.stipoPrefacturaId(),
                "formaPagoId": vm.sformaPagoId()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/prefacturas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PrefacturasGeneral.html?PrefacturaId=" + vm.prefacturaId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/prefacturas/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PrefacturasGeneral.html?PrefacturaId=" + vm.prefacturaId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function importar() {
    var mf = function() {
        if (!datosImportOK())
            return;
        $('#btnImportar').addClass('fa-spin');
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/sqlany/prefacturas/" + vm.proId(),
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                $('#btnImportar').removeClass('fa-spin');
                // la cadena será devuelta como JSON
                var rData = JSON.parse(data);
                // comprobamos que no está vacía
                if (rData.length == 0) {
                    // mensaje de que no se ha encontrado
                }
                data = rData[0];
                data.prefacturaId = vm.prefacturaId(); // Por si es un update
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function salir() {
    var mf = function() {
        var url = "PrefacturasGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function loadEmpresas(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var empresas = [{empresaId: 0, nombre: "" }].concat(data);
            vm.posiblesEmpresas(empresas);
            $("#cmbEmpresas").val([id]).trigger('change');
        },
        error: errorAjax
    });
}

function loadClientes(id) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/activos",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var clientes = [{clienteId: 0, nombre: "" }].concat(data);
            vm.posiblesClientes(clientes);
            $("#cmbClientes").val([id]).trigger('change');
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
        success: function(data, status) {
            var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
            vm.posiblesFormasPago(formasPago);
            $("#cmbFormasPago").val([id]).trigger('change');
        },
        error: errorAjax
    });
}

function cambioCliente(){
    var mf = function(){
        alert('Cambia cliente');
    };
    return mf();
}