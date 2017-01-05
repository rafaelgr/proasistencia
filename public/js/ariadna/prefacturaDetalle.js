/*-------------------------------------------------------------------------- 
prefacturaDetalle.js
Funciones js par la página PrefacturaDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var empId = 0;
var lineaEnEdicion = false;

var dataPrefacturasLineas;
var dataBases;

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

    vm = new admData();
    ko.applyBindings(vm);

    // Eventos de la calculadora de costes
    $('#txtCoste').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeBeneficio').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtImporteBeneficio').on('blur', cambioCampoConRecalculoDesdeBeneficio);
    $('#txtPorcentajeAgente').on('blur', cambioCampoConRecalculoDesdeCoste);

    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#btnImprimir").click(imprimir);
    $("#frmPrefactura").submit(function () {
        return false;
    });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });

    // select2 things
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioEmpresa(e.added);
    });

    // Ahora cliente en autocomplete
    initAutoCliente();

    // select2 things
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();
    $("#cmbContratos").select2(select2Spanish());
    $("#cmbContratos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioContrato(e.added);
    });
    // select2 things
    $("#cmbGrupoArticulos").select2(select2Spanish());
    loadGrupoArticulos();
    $("#cmbGrupoArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioGrupoArticulo(e.added);
    });
    // select2 things
    $("#cmbArticulos").select2(select2Spanish());
    // loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioArticulo(e.added);
    });

    // select2 things
    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();
    $("#cmbTiposIva").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioTiposIva(e.added);
    });


    $("#txtCantidad").blur(cambioPrecioCantidad);
    $("#txtPrecio").blur(cambioPrecioCantidad);

    initTablaPrefacturasLineas();
    initTablaBases();

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
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                loadLineasPrefactura(data.prefacturaId);
                loadBasesPrefactura(data.prefacturaId);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.prefacturaId(0);
        // ocultamos líneas y bases
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
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
    self.contratoClienteMantenimientoId = ko.observable();
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
    self.scontratoClienteMantenimientoId = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
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
    self.costeLinea = ko.observable();
    self.totalLinea = ko.observable();
    self.capituloLinea = ko.observable();
    //
    self.sgrupoArticuloId = ko.observable();
    //
    self.posiblesGrupoArticulos = ko.observableArray([]);
    self.elegidosGrupoArticulos = ko.observableArray([]);
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
    // Para calculadora de costes
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeAlCliente = ko.observable();
    // Nuevo Total de coste para la prefactura
    self.totalCoste = ko.observable();
    //
    self.generada = ko.observable();
}

function loadData(data) {
    vm.prefacturaId(data.prefacturaId);
    vm.ano(data.ano);
    vm.numero(data.numero);
    vm.serie(data.serie);
    vm.fecha(spanishDate(data.fecha));
    vm.empresaId(data.empresaId);
    vm.clienteId(data.clienteId);
    vm.contratoClienteMantenimientoId(data.contratoClienteMantenimientoId);
    vm.generada(data.generada);
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.importeAlCliente(data.totalAlCliente);
    recalcularCostesImportesDesdeCoste();
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
    cargaCliente(data.clienteId);
    loadFormasPago(data.formaPagoId);
    loadContratos(data.contratoClienteMantenimientoId);
    vm.observaciones(data.observaciones);

    //
    if (vm.generada()) {
        ocultarCamposPrefacturasGeneradas();
        mostrarMensajeFacturaGenerada();
    }
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
            },
            cmbContratos: {
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
            },
            cmbContratos: {
                required: "Debe elegir un contrato asociado"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmPrefactura").validate().settings;
    return $('#frmPrefactura').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        // Antes de dar de alta hay que inicializar valores
        // si es modifcación los valores cambiarán solos
        // ojo!! numeroDbf(n) espera un string.
        if (!vm.total()) {
            vm.total('0');
            vm.totalConIva('0');
        }
        var data = {
            prefactura: {
                "prefacturaId": vm.prefacturaId(),
                "ano": vm.ano(),
                "numero": vm.numero(),
                "serie": vm.serie(),
                "fecha": spanishDbDate(vm.fecha()),
                "empresaId": vm.sempresaId(),
                "clienteId": vm.sclienteId(),
                "contratoClienteMantenimientoId": vm.scontratoClienteMantenimientoId(),
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
                "total": numeroDbf(vm.total()),
                "totalConIva": numeroDbf(vm.totalConIva()),
                "formaPagoId": vm.sformaPagoId(),
                "observaciones": vm.observaciones(),
                "coste": vm.coste(),
                "porcentajeAgente": vm.porcentajeAgente(),
                "porcentajeBeneficio": vm.porcentajeBeneficio(),
                "totalAlCliente": vm.importeAlCliente(),
                "generada": 0
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/prefacturas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // De momento no volvemos al mismo (es alta y hay que introducir líneas)
                    var url = "PrefacturaDetalle.html?PrefacturaId=" + vm.prefacturaId();
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
                url: myconfig.apiUrl + "/api/prefacturas/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PrefacturaGeneral.html?PrefacturaId=" + vm.prefacturaId();
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
        var url = "PrefacturaGeneral.html";
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
        success: function (data, status) {
            var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
            vm.posiblesEmpresas(empresas);
            $("#cmbEmpresas").val([id]).trigger('change');
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

function loadContratos(id) {
    if (id) {
        // caso de un contrato en concreto
        $.ajax({
            type: "GET",
            url: "/api/contratos_cliente_mantenimiento/" + id,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var contratos = [{ contratoClienteMantenimientoId: 0, referencia: "" }].concat(data);
                vm.posiblesContratos(contratos);
                $("#cmbContratos").val([id]).trigger('change');
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        // caso cargar contratos de empreas / cliente
        $.ajax({
            type: "GET",
            url: "/api/contratos_cliente_mantenimiento/empresa_cliente/" + vm.sempresaId() + "/" + vm.sclienteId(),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var contratos = [{ contratoClienteMantenimientoId: 0, referencia: "" }].concat(data);
                vm.posiblesContratos(contratos);
                $("#cmbContratos").val([id]).trigger('change');
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
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
        success: function (data, status) {
            // cargamos los campos por defecto de receptor
            vm.receptorNif(data.nif);
            vm.receptorNombre(data.nombreComercial);
            vm.receptorDireccion(data.direccion);
            vm.receptorCodPostal(data.codPostal);
            vm.receptorPoblacion(data.poblacion);
            vm.receptorProvincia(data.provincia);
            $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
            //vm.sformaPagoId(data.formaPagoId);
            loadContratos();
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
        success: function (data, status) {
            // cargamos los campos por defecto de receptor
            vm.emisorNif(data.nif);
            vm.emisorNombre(data.nombre);
            vm.emisorDireccion(data.direccion);
            vm.emisorCodPostal(data.codPostal);
            vm.emisorPoblacion(data.poblacion);
            vm.emisorProvincia(data.provincia);
            // vemos posibles contratos
            loadContratos();
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}

function cambioContrato(data) {
    if (!data) return;
    obtenerValoresPorDefectoDelContratoMantenimiento(vm.scontratoClienteMantenimientoId());
}



/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de facturas
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea(); // es un alta
    lineaEnEdicion = false;
    $.ajax({
        type: "GET",
        url: "/api/prefacturas/nextlinea/" + vm.prefacturaId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.linea(data);
            vm.total(0);
            vm.totalConIva(0);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function limpiaDataLinea(data) {
    vm.prefacturaLineaId(0);
    vm.linea(null);
    vm.articuloId(null);
    vm.tipoIvaId(null);
    vm.porcentaje(null);
    vm.descripcion(null);
    vm.cantidad(null);
    vm.importe(null);
    vm.costeLinea(null);
    vm.totalLinea(null);
    //
    loadGrupoArticulos();
    // loadArticulos();
    loadTiposIva();
    //
    loadArticulos();
}

var obtenerValoresPorDefectoDelContratoMantenimiento = function (contratoClienteMantenimientoId) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contratos_cliente_mantenimiento/" + contratoClienteMantenimientoId,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.porcentajeBeneficio(data.margen);
            vm.porcentajeAgente(data.manPorComer);
            if (!vm.coste()) vm.coste(0);
            recalcularCostesImportesDesdeCoste();
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function aceptarLinea() {
    if (!datosOKLineas()) {
        return;
    }
    var data = {
        prefacturaLinea: {
            prefacturaLineaId: vm.prefacturaLineaId(),
            linea: vm.linea(),
            prefacturaId: vm.prefacturaId(),
            articuloId: vm.sarticuloId(),
            tipoIvaId: vm.tipoIvaId(),
            porcentaje: vm.porcentaje(),
            descripcion: vm.descripcion(),
            cantidad: vm.cantidad(),
            importe: vm.importe(),
            totalLinea: vm.totalLinea(),
            coste: vm.costeLinea(),
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            capituloLinea: vm.capituloLinea(),
        }
    }
    if (!lineaEnEdicion) {
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/prefacturas/lineas",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalLinea').modal('hide');
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/prefacturas/" + vm.prefacturaId(),
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadData(data);
                        loadLineasPrefactura(data.prefacturaId);
                        loadBasesPrefactura(data.prefacturaId);
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
        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/prefacturas/lineas/" + vm.prefacturaLineaId(),
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalLinea').modal('hide');
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/prefacturas/" + vm.prefacturaId(),
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadData(data);
                        loadLineasPrefactura(data.prefacturaId);
                        loadBasesPrefactura(data.prefacturaId);
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

function datosOKLineas() {
    $('#linea-form').validate({
        rules: {
            txtCapitulo: {
                required: true
            },
            txtLinea: {
                required: true
            },
            cmbArticulos: {
                required: true
            },
            cmbTiposIva: {
                required: true
            },
            txtDescripcion: {
                required: true
            },
            txtPrecio: {
                required: true
            },
            txtCantidad: {
                required: true
            },
            txtTotalLinea: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtCapitulo: {
                required: "Debe dar un texto al capítulo"
            },
            cmbArticulos: {
                required: "Debe elegir un articulo"
            },
            cmbTiposIva: {
                required: 'Debe elegir un tipo de IVA'
            },
            txtLinea: {
                required: 'Necesita un número de linea'
            },
            txtDescripcion: {
                required: 'Necesita una descripcion'
            },
            txtCantidad: {
                required: 'Necesita una cantidad'
            },
            txtPrecio: {
                required: 'Necesita un precio'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#linea-form").validate().settings;
    return $('#linea-form').valid();
}

function initTablaPrefacturasLineas() {
    tablaCarro = $('#dt_lineas').DataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_lineas'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            api.column(1, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="8">' + group + '</td></tr>'
                    );
                    last = group;
                }
            });
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
        data: dataPrefacturasLineas,
        columns: [{
            data: "linea"
        }, {
            data: "capituloLinea",
            "visible": false,
            render: function (data, type, row) {
                return "";
            }
        }, {
            data: "descripcion",
            render: function (data, type, row) {
                return data.replace('\n', '<br/>');
            }
        }, {
            data: "importe",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "cantidad",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "coste",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "totalLinea",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "prefacturaLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deletePrefacturaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editPrefacturaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                if (!vm.generada())
                    html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
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
    vm.totalLinea(data.totalLinea);
    vm.costeLinea(data.coste);
    vm.capituloLinea(data.capituloLinea);
    //
    loadGrupoArticulos(data.grupoArticuloId);
    loadArticulos(data.articuloId);
    loadTiposIva(data.tipoIvaId);
    //
}



function loadTablaPrefacturaLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasPrefactura(id) {
    $.ajax({
        type: "GET",
        url: "/api/prefacturas/lineas/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var totalCoste = 0;
            data.forEach(function (linea) {
                totalCoste += (linea.coste * linea.cantidad);
                vm.totalCoste(numeral(totalCoste).format('0,0.00'));
            })
            loadTablaPrefacturaLineas(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadArticulos(id) {
    $.ajax({
        type: "GET",
        url: "/api/articulos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
            vm.posiblesArticulos(articulos);
            if (id) {
                $("#cmbArticulos").val([id]).trigger('change');
            } else {
                $("#cmbArticulos").val([0]).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadGrupoArticulos(id) {
    $.ajax({
        type: "GET",
        url: "/api/grupo_articulo",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var grupos = [{ grupoArticuloId: 0, nombre: "" }].concat(data);
            vm.posiblesGrupoArticulos(grupos);
            if (id) {
                $("#cmbGrupoArticulos").val([id]).trigger('change');
            } else {
                $("#cmbGrupoArticulos").val([0]).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadTiposIva(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_iva",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposIva(tiposIva);
            if (id) {
                $("#cmbTiposIva").val([id]).trigger('change');
            } else {
                $("#cmbTiposIva").val([0]).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
        success: function (data, status) {
            // cargamos los campos por defecto de receptor
            if (data.descripcion == null) {
                vm.descripcion(data.nombre);
            } else {
                vm.descripcion(data.nombre + ':\n' + data.descripcion);
            }
            vm.cantidad(1);
            vm.importe(data.precioUnitario);
            //valores para IVA por defecto a partir del  
            // articulo seleccionado.
            $("#cmbTiposIva").val([data.tipoIvaId]).trigger('change');
            var data2 = {
                id: data.tipoIvaId
            };
            cambioTiposIva(data2);
            cambioPrecioCantidad();
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}

function cambioGrupoArticulo(data) {
    //
    if (!data) {
        return;
    }
    var grupoArticuloId = data.id;
    $.ajax({
        type: "GET",
        url: "/api/articulos/grupo/" + grupoArticuloId,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
            vm.posiblesArticulos(articulos);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
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
        success: function (data, status) {
            // cargamos los campos por defecto de receptor
            vm.tipoIvaId(data.tipoIvaId);
            vm.porcentaje(data.porcentaje);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });

}

var cambioPrecioCantidad = function () {
    vm.costeLinea(vm.cantidad() * vm.importe());
    recalcularCostesImportesDesdeCoste();
    vm.totalLinea(obtenerImporteAlClienteDesdeCoste(vm.costeLinea()));
}

function editPrefacturaLinea(id) {
    lineaEnEdicion = true;
    $.ajax({
        type: "GET",
        url: "/api/prefacturas/linea/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if (data.length > 0) {
                loadDataLinea(data[0]);
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function deletePrefacturaLinea(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                prefacturaLinea: {
                    prefacturaId: vm.prefacturaId()
                }
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/prefacturas/lineas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $.ajax({
                        type: "GET",
                        url: myconfig.apiUrl + "/api/prefacturas/" + vm.prefacturaId(),
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (data, status) {
                            // hay que mostrarlo en la zona de datos
                            loadData(data);
                            loadLineasPrefactura(data.prefacturaId);
                            loadBasesPrefactura(data.prefacturaId);
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
}

/*
    Funciones relacionadas con la gestión de bases
    y cuotas
*/

function initTablaBases() {
    tablaCarro = $('#dt_bases').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_bases'), breakpointDefinition);
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
        data: dataBases,
        columns: [{
            data: "tipo"
        }, {
            data: "porcentaje",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "base",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "cuota",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }]
    });
}


function loadTablaBases(data) {
    var dt = $('#dt_bases').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function loadBasesPrefactura(id) {
    $.ajax({
        type: "GET",
        url: "/api/prefacturas/bases/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // actualizamos los totales
            var t1 = 0; // total sin iva
            var t2 = 0; // total con iva
            for (var i = 0; i < data.length; i++) {
                t1 += data[i].base;
                t2 += data[i].base + data[i].cuota;
            }
            vm.total(numeral(t1).format('0,0.00'));
            vm.totalConIva(numeral(t2).format('0,0.00'));
            loadTablaBases(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaCliente
// carga en el campo txtCliente el valor seleccionado
var cargaCliente = function (id) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // poner el nombre en el campo de texto
            $('#txtCliente').val(data.nombre);
            vm.sclienteId(data.clienteId);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
};

// initAutoCliente
// inicializa el control del cliente como un autocomplete
var initAutoCliente = function () {
    // incialización propiamente dicha
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            // call ajax
            $.ajax({
                type: "GET",
                url: "/api/clientes/?nombre=" + request.term,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    var r = []
                    data.forEach(function (d) {
                        var v = {
                            value: d.nombre,
                            id: d.clienteId
                        };
                        r.push(v);
                    });
                    response(r);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });

        },
        minLength: 2,
        select: function (event, ui) {
            vm.sclienteId(ui.item.id);
            // el cambio de cliente puede implicar cambio de agente
            cambioCliente(ui.item);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};

var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    actualizarLineasDeLaPrefacturaTrasCambioCostes();
};

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
    actualizarLineasDeLaPrefacturaTrasCambioCostes();
}

var recalcularCostesImportesDesdeCoste = function () {
    if (vm.coste() != null) {
        if (vm.porcentajeBeneficio()) {
            vm.importeBeneficio(roundToTwo(vm.porcentajeBeneficio() * vm.coste() / 100));
        }
        vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
    }
    if (vm.porcentajeAgente()) {
        vm.importeAlCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeAlCliente() - vm.ventaNeta()));
    }
    vm.importeAlCliente(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
};

var recalcularCostesImportesDesdeBeneficio = function () {
    if (vm.porcentajeBeneficio() && vm.coste()) {
        if (vm.importeBeneficio()) {
            vm.porcentajeBeneficio(roundToTwo(((100 * vm.importeBeneficio()) / vm.coste())));
        }
    }
    recalcularCostesImportesDesdeCoste();
};

var actualizarLineasDeLaPrefacturaTrasCambioCostes = function () {
    $.ajax({
        type: "PUT",
        url: myconfig.apiUrl + "/api/prefacturas/recalculo/" + vm.prefacturaId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturas/" + vm.prefacturaId(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    // loadData(data);
                    loadLineasPrefactura(data.prefacturaId);
                    loadBasesPrefactura(data.prefacturaId);
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
};

var ocultarCamposPrefacturasGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}

var mostrarMensajeFacturaGenerada = function () {
    var mens = "Esta es una factura generada desde contrato. Para modificar sus valores vuelve a generarlas.";
    mensNormal(mens);
}

var obtenerImporteAlClienteDesdeCoste = function (coste) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = roundToTwo(vm.porcentajeBeneficio() * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente()) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = roundToTwo(importeAlCliente - ventaNeta);
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    return importeAlCliente;
}

var imprimir = function () {
    printPrefactura(vm.prefacturaId());
}

function printPrefactura(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/prefacturas/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            informePDF(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function informePDF(data) {
    var shortid = "HyGQ0yAP";
    // HkDPG29rl
    // shortid = "HkDPG29rl";
    var data = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
    //apiReport("POST", myconfig.reportUrl + "/api/report", data);
}

var f_open_post = function (verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_blank";

    var input = document.createElement("textarea");
    input.name = "template[shortid]";
    input.value = data.template.shortid;
    form.appendChild(input);

    input = document.createElement("textarea");
    input.name = "data";
    input.value = JSON.stringify(data.data);
    form.appendChild(input);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
};

var apiReport = function (verb, url, data) {
    $.ajax({
        type: verb,
        url: url,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            var a = 1;
        },
        error: function (err) {
            //mensErrorAjax(err);
            var file = new Blob([err.responseText], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            //var base64EncodedPDF = window.btoa(err.responseText);
            window.open("data:application/pdf " + err.responseText);
            //window.open(fileURL);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}