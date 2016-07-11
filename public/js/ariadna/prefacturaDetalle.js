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

    $("#frmLinea").submit(function() {
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
    $("#cmbEmpresas").select2().on('change', function(e) {
        //alert(JSON.stringify(e.added));
        cambioEmpresa(e.added);
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
    $("#cmbClientes").select2().on('change', function(e) {
        //alert(JSON.stringify(e.added));
        cambioCliente(e.added);
    });


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

    // select2 things
    $("#cmbArticulos").select2({
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
    loadArticulos();
    $("#cmbArticulos").select2().on('change', function(e) {
        //alert(JSON.stringify(e.added));
        cambioArticulo(e.added);
    });

    // select2 things
    $("#cmbTiposIva").select2({
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
    loadTiposIva();
    $("#cmbTiposIva").select2().on('change', function(e) {
        //alert(JSON.stringify(e.added));
        cambioTiposIva(e.added);
    });


    $("#txtCantidad").blur(cambioPrecioCantidad());
    $("#txtPrecio").blur(cambioPrecioCantidad());

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

    // -- Valores para las líneas
    self.prefacturaLineaId = ko.observable();
    self.linea = ko.observable();
    self.articuloId = ko.observable();
    self.tipoIvaId = ko.observable();
    self.porcentaje = ko.observable();
    self.descripcion = ko.observable();
    self.cantidad = ko.observable();
    self.importe = ko.observable();
    self.totalLinea = ko.observable();
    //
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);
    //
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);
    //

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
    vm.observaciones(data.observaciones);
}

function loadDataLinea(data) {
    vm.prefacturaLineaId(data.prefacturaLineaId);
    vm.linea(data.linea);
    vm.articuloId(data.articuloId);
    vm.tipoIvaId(data.tipoIvaId);
    vm.porcentaje(data.porcentaje);
    vm.descripcion(data.descripcion);
    vm.cantidad(data.cantidad);
    vm.importe(data.importe);
    //
    loadArticulos(data.articuloId);
    loadTiposIva(data.tipoIvaId);
}

function datosOK() {
    $('#frmPrefactura').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbClientes: {
                required: true
            },
            txtFecha: {
                required: true
            },
            cmbFormasPago: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir un emisor"
            },
            cmbClientes: {
                required: 'Debe elegir un receptor'
            },
            txtFecha: {
                required: 'Debe elegir una fecha'
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

function datosOK() {
    $('#frmPrefactura').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbClientes: {
                required: true
            },
            txtFecha: {
                required: true
            },
            cmbFormasPago: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir un emisor"
            },
            cmbClientes: {
                required: 'Debe elegir un receptor'
            },
            txtFecha: {
                required: 'Debe elegir una fecha'
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
                "ano": vm.ano(),
                "numero": vm.numero(),
                "serie": vm.serie(),
                "fecha": spanishDbDate(vm.fecha()),
                "empresaId": vm.sempresaId(),
                "clienteId": vm.sclienteId(),
                "contratoMantenimientoId": vm.contratoMantenimientoId(),
                "emisorNif": vm.emisorNif(),
                "emisorNombre": vm.emisorNombre(),
                "emisorDireccion": vm.emisorDireccion(),
                "emisorCodPostal": vm.emisorCodPostal(),
                "emisorPoblacion": vm.emisorPoblacion(),
                "emisorProvincia": vm.emisorProvincia(),
                "receptorNif": vm.receptorNif(),
                "receptorNombre": vm.receptorNombre(),
                "receptorDireccion": vm.receptorDireccion(),
                "receptorCodPostal": vm.receptorCodPostal(),
                "receptorPoblacion": vm.receptorPoblacion(),
                "receptorProvincia": vm.receptorProvincia(),
                "total": vm.total(),
                "totalConIva": vm.totalConIva(),
                "formaPagoId": vm.sformaPagoId(),
                "observaciones": vm.observaciones()
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
                    var url = "PrefacturaGeneral.html?PrefacturaId=" + vm.prefacturaId();
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
                    var url = "PrefacturaGeneral.html?PrefacturaId=" + vm.prefacturaId();
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

function nuevaLinea() {
    // TODO: Implementar la funcionalidad de nueva línea
    vm.prefacturaLineaId(0); // es un alta
    $.ajax({
        type: "GET",
        url: "/api/prefacturas/nextline/" + vm.prefacturaId(),
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            vm.linea(data);
        },
        error: errorAjax
    });
}

function aceptarLinea() {
    // TODO: Implementar funcionalidad de aceptar.
    var data = {
        prefacturaLineaId: vm.prefacturaLineaId(),
        prefacturaId: vm.prefacturaId(),
        articuloId: vm.sarticuloId(),
        tipoIva: vm.tipoIvaId(),
        porcentaje: vm.porcentaje(),
        descripcion: vm.descripcion(),
        cantidad: vm.cantidad(),
        importe: vm.importe(),
        totalLinea: vm.totalLinea()
    }
    alert(JSON.stringify(data));
}


function loadEmpresas(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
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
            var clientes = [{ clienteId: 0, nombre: "" }].concat(data);
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

function loadArticulos(id) {
    $.ajax({
        type: "GET",
        url: "/api/articulos",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
            vm.posiblesArticulos(articulos);
            $("#cmbArticulos").val([id]).trigger('change');
        },
        error: errorAjax
    });
}

function loadTiposIva(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_iva",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposIva(tiposIva);
            $("#cmbTiposIva").val([id]).trigger('change');
        },
        error: errorAjax
    });
}


function cambioCliente(data) {
    //
    if (!data) {
        return;
    }
    var clienteId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/clientes/" + clienteId,
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // cargamos los campos por defecto de receptor
            vm.receptorNif(data.nif);
            vm.receptorNombre(data.nombre);
            vm.receptorDireccion(data.direccion);
            vm.receptorCodPostal(data.codPostal);
            vm.receptorPoblacion(data.poblacion);
            vm.receptorProvincia(data.provincia);
            $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
            //vm.sformaPagoId(data.formaPagoId);
        },
        error: errorAjax
    });

}

function cambioEmpresa(data) {
    //
    if (!data) {
        return;
    }
    var empresaId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/empresas/" + empresaId,
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // cargamos los campos por defecto de receptor
            vm.emisorNif(data.nif);
            vm.emisorNombre(data.nombre);
            vm.emisorDireccion(data.direccion);
            vm.emisorCodPostal(data.codPostal);
            vm.emisorPoblacion(data.poblacion);
            vm.emisorProvincia(data.provincia);
        },
        error: errorAjax
    });

}

function cambioArticulo(data) {
    //
    if (!data) {
        return;
    }
    var articuloId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/articulos/" + articuloId,
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // cargamos los campos por defecto de receptor
            vm.descripcion(data.nombre);
            vm.cantidad(1);
            vm.importe(data.precioUnitario);
            vm.totalLinea(vm.cantidad() * vm.importe());

            //valores para IVA por defecto a partir del  
            // articulo seleccionado.
            $("#cmbTiposIva").val([data.tipoIvaId]).trigger('change');
            var data2 = {
                id: data.tipoIvaId
            };
            cambioTiposIva(data2);
        },
        error: errorAjax
    });

}

function cambioTiposIva(data) {
    if (!data) {
        return;
    }
    var tipoIvaId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/tipos_iva/" + tipoIvaId,
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // cargamos los campos por defecto de receptor
            vm.tipoIvaId(data.tipoIvaId);
            vm.porcentaje(data.porcentaje);
            // TODO: hay que verificar la carga de las tablas
            // de bases y cuotas asociadas.
        },
        error: errorAjax
    });

}

function cambioPrecioCantidad() {
    var mf = function() {
        vm.totalLinea(vm.cantidad() * vm.importe());
    }
    return mf;
}
