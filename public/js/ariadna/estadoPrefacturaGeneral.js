/*-------------------------------------------------------------------------- 
estadoPrefacturaGeneral.js
Funciones js par la página EstadoPrefacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataPrefacturas;
var prefacturaId;
var usuario;
var filtros = {};
var tablaPrefacturas;
var ConCobro;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    datePickerSpanish(); // see comun.js
    usuario = recuperarUsuario();
    //
    filtros = getCookie('filtro_prefacturas_estados');
    if (filtros != undefined) {
        filtros = JSON.parse(filtros);
    }
    initTablaPrefacturas();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    var conservaFiltro = gup("ConservaFiltro");
    var cleaned = gup("cleaned");
    ConCobro = gup("ConCobro");
    if (conservaFiltro != 'true' && cleaned != 'true') limpiarFiltros();
    //
    $('#btnBuscar').click(buscarPrefacturas());
    $('#btnPrint').click(imprimirPrefactura);
    $('#btnLimpiar').click(limpiarFiltros);
    $('#frmBuscar').submit(function () {
        return false
    });
    initAutoCliente();

    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        cargarPrefacturasAll()();
    });


    vm = new admData();
    ko.applyBindings(vm);

    $("#cmbEmpresas").select2(select2Spanish());

    $('#cmbEmpresas').on('change', function (e) {
        if (e.added) {
            cargarPrefacturasAll()();
        }
    });
    loadEmpresas(2);

    recuperaDepartamento(function (err, data) {
        if (err) return;
        // comprobamos parámetros
        prefacturaId = gup('PrefacturaId');
        var f = prefacturaId;
        if (prefacturaId == '') {
            f = null
        }
        compruebaFiltros(f);

    });


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
        }, 'La fecha final debe ser mayor que la inicial.');
}

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();

    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    self.tipoClienteId = ko.observable();

}



function obtenerEstadoPrefactura(row) {
    var total = Number(row.totalConIva || 0);
    var cobrado = Number(row.total_cobrado || 0);
    var devuelto = Number(row.total_devuelto || 0);

    if (Number(row.noFacturar || 0) === 1) return "NO FACTURAR";
    if (row.facturaId) return "FACTURADA";
    if (devuelto >= total && total > 0) return "DEVUELTO";
    if (cobrado >= total && total > 0) return "COBRADO";
    if (cobrado > 0 || devuelto > 0) return "PARCIAL";

    return "PENDIENTE";
}

function renderEstadoPrefactura(data) {
    var estado = data || "PENDIENTE";
    var color = "label-default";

    if (estado === "COBRADO") color = "label-success";
    else if (estado === "DEVUELTO") color = "label-danger";
    else if (estado === "PARCIAL") color = "label-warning";
    else if (estado === "FACTURADA") color = "label-primary";
    else if (estado === "NO FACTURAR") color = "label-danger";
    else if (estado === "NO CONTABILIZADO") color = "label-info";

    return "<span class='label " + color + "'>" + estado + "</span>";
}

function calcularResumen(data) {
    var totalCobrado = 0;
    var totalPendiente = 0;
    var totalDevuelto = 0;

    if (data && data.length > 0) {
        data.forEach(function (p) {
            totalCobrado += Number(p.total_cobrado || 0);
            totalPendiente += Number(p.pendiente || 0);
            totalDevuelto += Number(p.total_devuelto || 0);
        });
    }

    $('#totalCobrado').text(numeral(totalCobrado).format('0,0.00') + ' €');
    $('#totalPendiente').text(numeral(totalPendiente).format('0,0.00') + ' €');
    $('#totalDevuelto').text(numeral(totalDevuelto).format('0,0.00') + ' €');
}

function compruebaFiltros(id) {
    if (filtros) {
        vm.desdeFecha(filtros.desdeFecha);
        vm.hastaFecha(filtros.hastaFecha);
        loadEmpresas(filtros.empresaId);
        vm.sempresaId(filtros.empresaId);
        if (filtros.clienteId) cargaCliente(filtros.clienteId)


        if (id > 0) {
            setTimeout(function () {
                cargarPrefacturasAll()(id);
            }, 1000);

        } else {
            setTimeout(function () {
                cargarPrefacturasAll()();
            }, 1000);
        }
    } else {
        //vm.sempresaId(2);
        loadEmpresas(2);
        estableceFechaEjercicio();
        if (id) {
            setTimeout(function () {
                cargarPrefacturasAll()(id);
            }, 1000);
        } else {
            setTimeout(function () {
                cargarPrefacturasAll()();
            }, 1000);
        }

    }
}

function estableceFechaEjercicio() {
    //SI EL DIA ACTUAL ES MAYOR QUE EL 15 DE ENERO SE ESTABLECE EL CAMPO
    //DFECHA DE LA BUSQUEDA COMO EL PRIMER DIA DEL EJERCICIO ANTERIOR.
    //SI ES MAYOR SE ESTABLECE EL CAMPO DFECHA COMO EL PRIMER DIA DEL EJERCICIO ACTUAL.
    var fechaInicio;
    var fActual = new Date();
    var ano = fActual.getFullYear();

    var InicioEjercicio = new Date(ano + '-01-15');
    if (fActual > InicioEjercicio) {
        fechaInicio = moment(ano + '-01-01').format('DD/MM/YYYY');
        vm.desdeFecha(fechaInicio);
    } else {
        ano = ano - 1
        fechaInicio = moment(ano + '-01-01').format('DD/MM/YYYY');
        vm.desdeFecha(fechaInicio);
    }
}


function initTablaPrefacturas() {

    var buttonCommon = {
        exportOptions: {
            format: {
                body: function (data, row, column, node) {

                    // Columnas numéricas:
                    // Total, Total IVA, Cobrado, Devuelto, Pendiente
                    if (column >= 5 && column <= 9) {
                        var dato = numeroDbf(data);
                        return dato;
                    } else {
                        return data;
                    }
                },

                footer: function (data, row, column, node) {

                    if (row >= 5 && row <= 9) {
                        var dato = numeroDbf(data);
                        return dato;
                    } else {
                        return "";
                    }
                }
            }
        }
    };

    tablaPrefacturas = $('#dt_prefactura').DataTable({

        bSort: true,
        stateSave: true,
        autoWidth: true,
        paging: true,
        pageLength: 100,

        "aoColumnDefs": [
            { "sType": "date-uk", "aTargets": [4] }
        ],

        dom:
            "<'dt-toolbar'<'col-xs-12 col-sm-6'Br><'col-sm-6 col-xs-6 hidden-xs' 'C >>" +
            "rt" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-sm-6 col-xs-12'p>>",

        buttons: [
            'copy',
            'csv',

            $.extend(true, {}, buttonCommon, {
                extend: 'excel'
            }, {
                footer: true
            }),

            {
                extend: 'pdf',
                orientation: 'landscape',
                pageSize: 'A3',

                exportOptions: {
                    columns: function (idx, data, node) {
                        // Solo columnas 1 a 14 y además visibles
                        return idx >= 0 &&
                            idx <= 14 && idx != 1 &&
                            tablaPrefacturas.column(idx).visible();
                    }
                },

                title: function () {
                    return $('#cmbEmpresas option:selected').text();
                },


                customize: function (doc) {

                    doc.defaultStyle.fontSize = 10;
                    doc.styles.tableHeader.fontSize = 10;
                    doc.styles.tableHeader.alignment = 'left';

                    doc.pageMargins = [15, 15, 15, 15];

                    // Obtener filtros
                    var empresa = $('#cmbEmpresas option:selected').text();
                    var cliente = $('#cmbClientes option:selected').text();

                    var desde = $('#txtDesdeFecha').val();
                    var hasta = $('#txtHastaFecha').val();

                    var verFacturadas = $('#chkFacturadas').is(':checked') ? 'Sí' : 'No';

                    // Título
                    doc.content[0].text = empresa;

                    // Añadir información de filtros
                    doc.content.splice(1, 0, {
                        text:
                            'Desde: ' + desde +
                            '    Hasta: ' + hasta +
                            '    Cliente: ' + cliente +
                            '    Ver facturadas: ' + verFacturadas,
                        fontSize: 13,
                        margin: [0, 0, 0, 10]
                    });

                    // Ahora la tabla pasa a ser content[2]
                    var table = doc.content[2].table;

                    table.widths = new Array(table.body[0].length).fill('*');

                    /* table.widths = [
                        100,     // EMISOR
                        150,    // receptor
                        100,     // numero
                        70,     // fecha
                        50,     // base
                        45,     // total
                        45,     // cobrado
                        45,     // devuelto
                        50,     // pendiente
                        100,     // estado
                        50,     // forma de pagp
                        100,     // observaciones
                        50,     // dir. trabajo
                        100     // anticipos
                       
                    ]; */

                    // Cabeceras
                    table.body[0].forEach(function (cell, index) {

                        if (index >= 5 && index <= 9) {
                            cell.alignment = 'right';
                        } else {
                            cell.alignment = 'left';
                        }

                        cell.margin = [2, 3, 2, 3];
                    });

                    // Datos
                    for (var i = 1; i < table.body.length; i++) {

                        table.body[i].forEach(function (cell, index) {

                            if (index >= 5 && index <= 9) {
                                cell.alignment = 'right';
                            } else {
                                cell.alignment = 'left';
                            }

                            cell.margin = [2, 2, 2, 2];
                        });
                    }
                }
            },

            'print'
        ],

        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },

        stateLoaded: function (settings, state) {

            state.columns.forEach(function (column, index) {

                $('#dt_prefactura thead tr:eq(0) th:eq(' + index + ') input[type=text]')
                    .val(column.search.search);

            });
        },

        preDrawCallback: function () {

            if (!responsiveHelper_dt_basic) {

                responsiveHelper_dt_basic =
                    new ResponsiveDatatablesHelper(
                        $('#dt_prefactura'),
                        breakpointDefinition
                    );
            }
        },

        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },

        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
        },

        footerCallback: function (row, data, start, end, display) {

        },

        language: {

            processing: "Procesando...",

            info:
                "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",

            infoEmpty:
                "Mostrando registros del 0 al 0 de un total de 0 registros",

            infoFiltered:
                "(filtrado de un total de _MAX_ registros)",

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

                sortAscending:
                    ": Activar para ordenar la columna de manera ascendente",

                sortDescending:
                    ": Activar para ordenar la columna de manera descendente"
            }
        },

        data: dataPrefacturas,

        columns: [

            // 0
            {
                data: "referencia"
            },

            // 1
            {
                data: "emisorNombre"
            },

            // 2
            {
                data: "receptorNombre"
            },

            // 3
            {
                data: "vNum"
            },

            // 4
            {
                data: "fecha",

                render: function (data, type, row) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },

            // 5
            {
                data: "total",

                render: function (data, type, row) {

                    var string =
                        numeral(data).format('0,0.00');

                    return string;
                }
            },

            // 6
            {
                data: "totalConIva",

                render: function (data, type, row) {

                    var string =
                        numeral(data).format('0,0.00');

                    return string;
                }
            },

            // 7
            {
                data: "total_cobrado",

                render: function (data, type, row) {

                    return numeral(data || 0)
                        .format('0,0.00');
                }
            },

            // 8
            {
                data: "total_devuelto",

                render: function (data, type, row) {

                    return numeral(data || 0)
                        .format('0,0.00');
                }
            },

            // 9
            {
                data: "pendiente",

                render: function (data, type, row) {

                    return numeral(data || 0)
                        .format('0,0.00');
                }
            },

            // 10
            {
                data: "estado",

                render: function (data, type, row) {

                    return renderEstadoPrefactura(
                        data || obtenerEstadoPrefactura(row)
                    );
                }
            },

            // 11
            {
                data: "vFPago"
            },

            // 12
            {
                data: "observaciones"
            },

            // 13
            {
                data: "dirTrabajo"
            },
            // 14
            {
                data: 'numerosAnticipos',
                title: 'Anticipos',
                className: 'text-center',
                orderable: false,

                render: function (data, type, row) {

                    if (type !== 'display') {
                        return data || '';
                    }

                    if (!data) {
                        return '';
                    }

                    let anticipos = data.split(',').map(x => x.trim());

                    let lista = anticipos
                        .map(a => {

                            let partes = a.split('|');

                            let numero = partes[0];
                            let estado = partes[1];

                            let clase;

                            if (estado === 'COBRADO') {
                                clase = 'label-success';
                            } else if (estado === 'DEVUELTO') {
                                clase = 'label-danger';
                            } else if (estado === 'NO_CONTABILIZADO') {
                                clase = 'label-info';
                            } else {
                                clase = 'label-default';
                            }

                            return `
                    <div style="margin-bottom:5px;">
                        <span class="label ${clase}">
                            ${numero}
                        </span>
                    </div>
                `;
                        })
                        .join('');

                    return `
                        <div class="dropdown">

                            <button class="btn btn-xs btn-success dropdown-toggle"
                                    type="button"
                                    data-toggle="dropdown">

                                <i class="fa fa-eur"></i>
                                ${anticipos.length}
                                <span class="caret"></span>

                            </button>

                            <div class="dropdown-menu"
                                style="padding:8px 12px; min-width:190px;">

                                ${lista}

                            </div>

                        </div>
                    `;
                }
            },
            // 15
            {
                data: "prefacturaId",

                render: function (data, type, row) {

                    var bt2 =
                        "<button class='btn btn-circle btn-success' " +
                        "onclick='editPrefactura(" + data + ");' " +
                        "title='Editar registro'>" +
                        "<i class='fa fa-edit fa-fw'></i>" +
                        "</button>";

                    var bt3 =
                        "<button class='btn btn-circle btn-success' " +
                        "onclick='printPrefactura2(" + data + ");' " +
                        "title='Imprimir PDF'>" +
                        "<i class='fa fa-print fa-fw'></i>" +
                        "</button>";

                    var html =
                        "<div class='pull-right'>" +
                        bt2 +
                        bt3 +
                        "</div>";

                    return html;
                }
            }
        ]
    });


    // function sort by date
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {

        "date-uk-pre": function (a) {

            var ukDatea = a.split('/');

            return (
                ukDatea[2] +
                ukDatea[1] +
                ukDatea[0]
            ) * 1;
        },

        "date-uk-asc": function (a, b) {

            return (
                (a < b) ? -1 :
                    ((a > b) ? 1 : 0)
            );
        },

        "date-uk-desc": function (a, b) {

            return (
                (a < b) ? 1 :
                    ((a > b) ? -1 : 0)
            );
        }
    });


    // Apply the filter
    $("#dt_prefactura thead tr:eq(0) th input[type=text]")
        .on('keyup change', function () {

            var index =
                $(this).closest('th').index();

            tablaPrefacturas
                .column(index)
                .search(this.value)
                .draw();
        });


    // Ocultar observaciones por defecto
    tablaPrefacturas.columns(12).visible(false);
}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtHastaFecha: {
                greaterThan: "#txtDesdeFecha"
            }
        },
        // Messages for form validation
        messages: {

        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

function loadTablaPrefacturas(data) {
    var dt = $('#dt_prefactura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();

    calcularResumen(data);
}

function buscarPrefacturas() {
    var mf = function () {
        cargarPrefacturasAll()();
    };
    return mf;
}


function deletePrefactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                prefacturaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/prefacturas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarPrefacturas();
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

function editPrefactura(id) {
    // hay que abrir la página de detalle de prefactura
    // pasando en la url ese ID
    var busquedaFacturas =
    {
        empresaId: vm.sempresaId(),
        desdeFecha: vm.desdeFecha(),
        hastaFecha: vm.hastaFecha(),
        clienteId: vm.sclienteId()
    }
    setCookie("filtro_prefacturas_estados", JSON.stringify(busquedaFacturas), 1);
    var url = "PrefacturaDetalle.html?PrefacturaId=" + id + "&ConCobro=true";
    window.open(url, '_self');
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

function printPrefactura2(id) {
    var url = "InfPrefacturas.html?prefacturaId=" + id;
    window.open(url, "_self");
}


function informePDF(data) {
    var shortid = "HyGQ0yAP";
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


function cargarPrefacturasAll() {
    var mf = function (id) {
        var clienteId = vm.sclienteId() || null;
        var desdeFecha = moment(vm.desdeFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hastaFecha = vm.hastaFecha();
        if (hastaFecha == '' || hastaFecha == undefined) hastaFecha = null;
        if (hastaFecha != null) {
            if (hastaFecha != null) hastaFecha = moment(hastaFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if (!(datosOK())) return;
        }

        let empid = vm.sempresaId() || 2;

        if (id) {
            var data = {
                id: prefacturaId
            };

            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturas/empresa/recibos/unico/" + empid + "/" + prefacturaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });

        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturas/empresa/recibos/con/cobros/"
                    + usuario.usuarioId + "/"
                    + vm.sdepartamentoId() + "/"
                    + desdeFecha + "/"
                    + hastaFecha + "/"
                    + empid + "/"
                    + clienteId,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    loadTablaPrefacturas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    };
    return mf
}

function loadEmpresas(id) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;

        var empresas = [{ empresaId: null, nombre: "" }].concat(data);

        vm.posiblesEmpresas(empresas);
        vm.sempresaId(id);

        $("#cmbEmpresas").val([id]).trigger('change');
    });
}

var limpiarFiltros = function () {
    var returnUrl = "EstadoPrefacturaGeneral.html?cleaned=true"
    deleteCookie('filtro_prefacturas_estados');
    tablaPrefacturas.state.clear();
    window.open(returnUrl, '_self');
    //window.location.reload();
}

imprimirPrefactura = function () {
    var url = "InfPrefacturas.html";
    window.open(url, '_blank');
}

// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaCliente
// carga en el campo txtCliente el valor seleccionado
var cargaCliente = function (id) {
    llamadaAjax("GET", "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.clienteId(data.clienteId);
        //vm.tipoClienteId(data.tipoClienteId);
    });
};

// initAutoCliente
// inicializa el control del cliente como un autocomplete
var initAutoCliente = function () {
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            llamadaAjax("GET", "/api/clientes/?nombre=" + request.term, null, function (err, data) {
                if (err) return;

                var r = [];
                data.forEach(function (d) {
                    r.push({
                        value: d.nombre,
                        id: d.clienteId
                    });
                });

                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.sclienteId(ui.item.id);
            vm.clienteId(ui.item.id);
        },
        change: function (event, ui) {
            if (!ui.item) {
                vm.sclienteId(null);
                vm.clienteId(null);
            }
        }
    });

    $("#txtCliente").on("input", function () {
        if ($(this).val().trim() === "") {
            vm.sclienteId(null);
            vm.clienteId(null);
        }
    });
};