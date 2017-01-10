/*-------------------------------------------------------------------------- 
ofertaDetalle.js
Funciones js par la página OfertaDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var ofertaId = 0;
var lineaEnEdicion = false;

var dataOfertasLineas;
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
    $("#frmOferta").submit(function () {
        return false;
    });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });


    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioEmpresa(e.added);
    });

    $("#cmbTiposOferta").select2(select2Spanish());
    loadTiposOferta();


    initAutoCliente();
    initAutoMantenedor();
    initAutoAgente();


    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();


    $("#cmbGrupoArticulos").select2(select2Spanish());
    loadGrupoArticulos();
    $("#cmbGrupoArticulos").select2().on('change', function (e) {
        cambioGrupoArticulo(e.added);
    });
    $("#cmbArticulos").select2(select2Spanish());
    // loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioArticulo(e.added);
    });

    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();
    $("#cmbTiposIva").select2().on('change', function (e) {
        cambioTiposIva(e.added);
    });

    $("#txtCantidad").blur(cambioPrecioCantidad);
    $("#txtPrecio").blur(cambioPrecioCantidad);

    initTablaOfertasLineas();
    initTablaBases();

    ofertaId = gup('OfertaId');
    if (ofertaId != 0) {
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/ofertas/" + ofertaId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                loadLineasOferta(data.ofertaId);
                loadBasesOferta(data.ofertaId);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.ofertaId(0);
        obtenerPorcentajeBeneficioPorDefecto();
        // ocultamos líneas y bases
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
    }
}

function admData() {
    var self = this;
    self.ofertaId = ko.observable();
    self.tipoOfertaId = ko.observable();
    self.referencia = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.mantenedorId = ko.observable();
    self.agenteId = ko.observable();
    self.fechaOferta = ko.observable();
    self.empresaId = ko.observable();
    // calculadora
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeCliente = ko.observable();
    self.importeMantenedor = ko.observable();
    //
    self.formaPagoId = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.tipoOfertaId = ko.observable();
    self.stipoOfertaId = ko.observable();
    //
    self.posiblesTiposOferta = ko.observableArray([]);
    self.elegidosTiposOferta = ko.observableArray([]);
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
    //
    self.total = ko.observable();
    self.totalConIva = ko.observable();

    // -- Valores para las líneas
    self.ofertaLineaId = ko.observable();
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

    // Nuevo Total de coste para la oferta
    self.totalCoste = ko.observable();
    //
    self.generada = ko.observable();
}

function loadData(data) {
    vm.ofertaId(data.ofertaId);
    loadTiposOferta(data.tipoOfertaId);
    vm.referencia(data.referencia);
    loadEmpresas(data.empresaId);
    cargaCliente(data.clienteId);
    cargaMantenedor(data.mantenedorId);
    cargaAgente(data.agenteId);
    vm.fechaOferta(spanishDate(data.fechaOferta));
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.importeCliente(data.importeCliente);
    recalcularCostesImportesDesdeCoste();
    vm.importeMantenedor(data.importeMantenedor);
    vm.observaciones(data.observaciones);
    loadFormasPago(data.formaPagoId);
}


function datosOK() {
    $('#frmOferta').validate({
        rules: {
            txtReferencia: {
                required: true
            },
            cmbEmpresas: {
                required: true
            },
            txtFechaOferta: {
                required: true
            },
            cmbFormasPago: {
                required: true
            },
            cmbTiposOferta: {
                required: true
            },
            txtCliente: {
                clienteNecesario: true
            },
            txtAgente: {
                agenteNecesario: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            txtFechaOferta: {
                required: 'Debe elegir una fecha'
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbTiposOferta: {
                required: "Debe elegir un tipo de oferta"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmOferta").validate().settings;
    return $('#frmOferta').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) return;
        comprobarSiHayMantenedor();
        var data = {
            oferta: {
                "ofertaId": vm.ofertaId(),
                "tipoOfertaId": vm.stipoOfertaId(),
                "referencia": vm.referencia(),
                "empresaId": vm.sempresaId(),
                "clienteId": vm.clienteId(),
                "agenteId": vm.agenteId(),
                "mantenedorId": vm.mantenedorId(),
                "fechaOferta": spanishDbDate(vm.fechaOferta()),
                "coste": vm.coste(),
                "porcentajeBeneficio": vm.porcentajeBeneficio(),
                "importeBeneficio": vm.importeBeneficio(),
                "ventaNeta": vm.ventaNeta(),
                "porcentajeAgente": vm.porcentajeAgente(),
                "importeAgente": vm.importeAgente(),
                "importeCliente": vm.importeCliente(),
                "importeMantenedor": vm.importeMantenedor(),
                "observaciones": vm.observaciones(),
                "formaPagoId": vm.sformaPagoId()
            }
        };
        if (ofertaId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/ofertas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // De momento no volvemos al mismo (es alta y hay que introducir líneas)
                    var url = "OfertaDetalle.html?OfertaId=" + vm.ofertaId();
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
                url: myconfig.apiUrl + "/api/ofertas/" + ofertaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "OfertaGeneral.html?OfertaId=" + vm.ofertaId();
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
        var url = "OfertaGeneral.html";
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


function loadTiposOferta(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_mantenimientos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tipos = [{ tipoMantenimientoId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposOferta(tipos);
            $("#cmbTiposOferta").val([id]).trigger('change');
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


var cambioCliente = function (data) {
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
            cargaAgente(data.comercialId);
            vm.agenteId(data.comercialId);
            loadFormasPago(data.formaPagoId);
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

        },
        error: function (err) {
            mensErrorAjax(err);
        }
    });

}

function cambioContrato(data) {
    if (!data) return;
    obtenerValoresPorDefectoDelContratoMantenimiento(vm.scontratoClienteMantenimientoId());
}



/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de ofertas
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea(); // es un alta
    lineaEnEdicion = false;
    $.ajax({
        type: "GET",
        url: "/api/ofertas/nextlinea/" + vm.ofertaId(),
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
    vm.ofertaLineaId(0);
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
        ofertaLinea: {
            ofertaLineaId: vm.ofertaLineaId(),
            linea: vm.linea(),
            ofertaId: vm.ofertaId(),
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
            url: myconfig.apiUrl + "/api/ofertas/lineas",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalLinea').modal('hide');
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/ofertas/" + vm.ofertaId(),
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadData(data);
                        loadLineasOferta(data.ofertaId);
                        loadBasesOferta(data.ofertaId);
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
            url: myconfig.apiUrl + "/api/ofertas/lineas/" + vm.ofertaLineaId(),
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                $('#modalLinea').modal('hide');
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/ofertas/" + vm.ofertaId(),
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadData(data);
                        loadLineasOferta(data.ofertaId);
                        loadBasesOferta(data.ofertaId);
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

function initTablaOfertasLineas() {
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
        data: dataOfertasLineas,
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
            data: "ofertaLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteOfertaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editOfertaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                if (!vm.generada())
                    html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    vm.ofertaLineaId(data.ofertaLineaId);
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



function loadTablaOfertaLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasOferta(id) {
    $.ajax({
        type: "GET",
        url: "/api/ofertas/lineas/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var totalCoste = 0;
            data.forEach(function (linea) {
                totalCoste += (linea.coste * linea.cantidad);
                vm.totalCoste(numeral(totalCoste).format('0,0.00'));
            })
            loadTablaOfertaLineas(data);
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

function editOfertaLinea(id) {
    lineaEnEdicion = true;
    $.ajax({
        type: "GET",
        url: "/api/ofertas/linea/" + id,
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

function deleteOfertaLinea(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                ofertaLinea: {
                    ofertaId: vm.ofertaId()
                }
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/ofertas/lineas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $.ajax({
                        type: "GET",
                        url: myconfig.apiUrl + "/api/ofertas/" + vm.ofertaId(),
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (data, status) {
                            // hay que mostrarlo en la zona de datos
                            loadData(data);
                            loadLineasOferta(data.ofertaId);
                            loadBasesOferta(data.ofertaId);
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


function loadBasesOferta(id) {
    $.ajax({
        type: "GET",
        url: "/api/ofertas/bases/" + id,
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

var cargaCliente = function (id) {
    if (!id) return;
    $.ajax({
        type: "GET",
        url: "/api/clientes/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            $('#txtCliente').val(data.nombre);
            vm.sclienteId(data.clienteId);
            vm.clienteId(data.clienteId);
        },
        error: function (err) {
            mensErrorAjax(err);
        }
    });
};
var cargaMantenedor = function (id) {
    if (!id) return;
    $.ajax({
        type: "GET",
        url: "/api/clientes/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            $('#txtMantenedor').val(data.nombre);
            vm.smantenedorId(data.mantenedorId);
            vm.mantenedorId(data.mantenedorId);
        },
        error: function (err) {
            mensErrorAjax(err);
        }
    });
};

var cargaAgente = function (id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            $('#txtAgente').val(data.nombre);
            //vm.sagenteId(data.comercialId);
            vm.agenteId(data.comercialId);
            vm.porcentajeAgente(data.porComer);
            recalcularCostesImportesDesdeCoste();
        },
        error: function (err) {
            mensErrorAjax(err);
        }
    });
};

var initAutoCliente = function () {
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            $.ajax({
                type: "GET",
                url: "/api/clientes/clientes_activos/?nombre=" + request.term,
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
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.clienteId(ui.item.id);
            cambioCliente(ui.item);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.clienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};

var initAutoMantenedor = function () {
    $("#txtMantenedor").autocomplete({
        source: function (request, response) {
            $.ajax({
                type: "GET",
                url: "/api/clientes/mantenedores_activos/?nombre=" + request.term,
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
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.mantenedorId(ui.item.id);
            recalcularCostesImportesDesdeCoste();
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("mantenedorNecesario", function (value, element) {
        var r = false;
        if (vm.mantenedorId()) r = true;
        return r;
    }, "Debe seleccionar un mantenedor válido");
};

var initAutoAgente = function () {
    $("#txtAgente").autocomplete({
        source: function (request, response) {
            $.ajax({
                type: "GET",
                url: "/api/comerciales/agentes_activos/?nombre=" + request.term,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    var r = []
                    data.forEach(function (d) {
                        var v = {
                            value: d.nombre,
                            id: d.comercialId,
                            porcentajeAgente: d.porComer
                        };
                        r.push(v);
                    });
                    response(r);
                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.agenteId(ui.item.id);
            vm.porcentajeAgente(ui.item.porComer);
            recalcularCostesImportesDesdeCoste();
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("agenteNecesario", function (value, element) {
        var r = false;
        if (vm.agenteId()) r = true;
        return r;
    }, "Debe seleccionar un agente válido");
};

var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    actualizarLineasDeLaOfertaTrasCambioCostes();
};

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
    actualizarLineasDeLaOfertaTrasCambioCostes();
}

var recalcularCostesImportesDesdeCoste = function () {
    if (!vm.coste()) vm.coste(0);
    if (!vm.porcentajeAgente()) vm.porcentajeAgente(0);
    if (vm.coste() != null) {
        if (vm.porcentajeBeneficio()) {
            vm.importeBeneficio(roundToTwo(vm.porcentajeBeneficio() * vm.coste() / 100));
        }
        vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
    }
    if (vm.porcentajeAgente() != null) {
        vm.importeCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeCliente() - vm.ventaNeta()));
    }
    vm.importeCliente(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    if (vm.mantenedorId()){
        vm.importeMantenedor(roundToTwo(vm.importeCliente() - vm.ventaNeta() + vm.importeBeneficio()));
    }
};

var recalcularCostesImportesDesdeBeneficio = function () {
    if (vm.porcentajeBeneficio() && vm.coste()) {
        if (vm.importeBeneficio()) {
            vm.porcentajeBeneficio(roundToTwo(((100 * vm.importeBeneficio()) / vm.coste())));
        }
    }
    recalcularCostesImportesDesdeCoste();
};

var actualizarLineasDeLaOfertaTrasCambioCostes = function () {
    $.ajax({
        type: "PUT",
        url: myconfig.apiUrl + "/api/ofertas/recalculo/" + vm.ofertaId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/ofertas/" + vm.ofertaId(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    // loadData(data);
                    loadLineasOferta(data.ofertaId);
                    loadBasesOferta(data.ofertaId);
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

var ocultarCamposOfertasGeneradas = function () {
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
    var importeCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = roundToTwo(vm.porcentajeBeneficio() * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente()) {
        importeCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = roundToTwo(importeCliente - ventaNeta);
    }
    importeCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    return importeCliente;
}

var imprimir = function () {
    printOferta(vm.ofertaId());
}

function printOferta(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/ofertas/" + id,
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
    var shortid = "rySBxKzIe";
    var data = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
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

// funciones de apoyo
var obtenerPorcentajeBeneficioPorDefecto = function (done) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/parametros/0",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.porcentajeBeneficio(data.margenMantenimiento);
            recalcularCostesImportesDesdeCoste();
            if (done) done(null);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

var comprobarSiHayMantenedor = function(){
    if ($('#txtMantenedor').val() == ''){
        vm.mantenedorId(null);
        vm.importeMantenedor(0);
    }
}