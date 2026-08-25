/*--------------------------------------------------------------------------
generarLiquidacion.js
Funciones js par la página GenerarLiquidacion.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var facturaId;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {

    comprobarLogin();

    usuario = recuperarUsuario();

    pageSetUp();

    getVersionFooter();

    $.validator.addMethod(
        "greaterThan",
        function (value, element, params) {

            var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");

            if (!/Invalid|NaN/.test(new Date(fv))) {
                return new Date(fv) >= new Date(fp);
            } else {
                return true;
            }
        },
        'La fecha final debe ser mayor que la inicial.'
    );

    $.validator.addMethod(
        "notEqualTo",
        function (value, element, param) {

            if (value == "0") return false;

            return true;
        }
    );

    vm = new admData();

    ko.applyBindings(vm);

    $('#btnBuscar').click(buscarFacturas());

    $('#btnAlta').click(generarLiquidaciones());

    $('#btnBorrar').click(borrarUltimaLiquidacion());

    $('#frmBuscar').submit(function () {
        return false;
    });

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());

    recuperaDepartamento(function (err, data) {
        if (err) return;
    });

    $("#cmbEmpresas").select2(select2Spanish());

    loadEmpresas();

    $("#cmbComerciales").select2(select2Spanish());

    loadComerciales();

    $('#cmbPeriodos').select2(select2Spanish());

    $('#cmbAnos').select2(select2Spanish());

    loadAnyos();

    $("#btnAlta").hide();

    initTablaFacturas();

    facturaId = gup('FacturaId');

    if (usuario.puedeVisualizar) {
        $('#btnBorrar').show();
    } else {
        $('#btnBorrar').hide();
    }

    // Marcar / desmarcar todas las facturas
    $('#checkMain').click(function () {

        var checked = $('#checkMain').prop('checked');

        updateAll(checked);
    });
}


function loadAnyos() {

    var d = new Date();

    var n = d.getFullYear();

    n = n - 2;

    var anos = [];

    var ano = {};

    var anoText;

    var limit = n + 2;

    for (var i = n; i <= limit; i++) {

        anoText = i.toString();

        ano = {
            nombreAno: anoText,
            ano: i
        };

        anos.push(ano);
    }

    vm.optionsAnos(anos);

    $("#cmbAnos").val([n + 1]).trigger('change');
}


// tratamiento knockout

function admData() {

    var self = this;

    self.desdeFecha = ko.observable();

    self.hastaFecha = ko.observable();

    self.departamentoId = ko.observable();

    self.sdepartamentoId = ko.observable();

    self.posiblesDepartamentos = ko.observableArray([]);

    self.elegidosDepartamentos = ko.observableArray([]);

    self.empresaId = ko.observable();

    self.sempresaId = ko.observable();

    self.posiblesEmpresas = ko.observableArray([]);

    self.elegidosEmpresas = ko.observableArray([]);

    self.comercialId = ko.observable();

    self.scomercialId = ko.observable();

    self.posiblesComerciales = ko.observableArray([]);

    self.elegidosComerciales = ko.observableArray([]);

    self.optionsPeriodos = ko.observableArray([
        {
            nombrePeriodo: 'Primer trimestre',
            periodo: '1'
        },
        {
            nombrePeriodo: 'Segundo trimestre',
            periodo: '2'
        },
        {
            nombrePeriodo: 'Tercer trimestre',
            periodo: '3'
        },
        {
            nombrePeriodo: 'Cuarto trimestre',
            periodo: '4'
        }
    ]);

    self.selectedPeriodos = ko.observableArray([]);

    self.speriodo = ko.observable();

    self.optionsAnos = ko.observableArray([]);

    self.ano = ko.observable();

    self.sano = ko.observable();

    self.selectedAnos = ko.observableArray([]);
}


function initTablaFacturas() {

    tablaCarro = $('#dt_factura').dataTable({

        autoWidth: false,

        paging: false,

        "columnDefs": [
            {
                "targets": 0,
                "orderable": false,
                "width": "40%"
            }
        ],

        preDrawCallback: function () {

            if (!responsiveHelper_dt_basic) {

                responsiveHelper_dt_basic =
                    new ResponsiveDatatablesHelper(
                        $('#dt_factura'),
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

        data: dataFacturas,

        columns: [

            {
                data: "facturaId",

                width: "10%",

                render: function (data, type, row) {

                    var html = '<label class="input">';

                    html += sprintf(
                        '<input id="chk%s" type="checkbox" name="chk%s" class="checkAll">',
                        data,
                        data
                    );

                    html += '</label>';

                    return html;
                }
            },

            {
                data: "emisorNombre"
            },

            {
                data: "receptorNombre"
            },

            {
                data: "dirTrabajo"
            },

            {
                data: "vNum"
            },

            {
                data: "nombreAgente"
            },

            {
                data: "fecha",

                render: function (data, type, row) {

                    return moment(data).format('DD/MM/YYYY');
                }
            },

            {
                data: "total",

                render: function (data, type, row) {

                    return numeral(data).format('0,0.00');
                }
            },

            {
                data: "totalConIva",

                render: function (data, type, row) {

                    return numeral(data).format('0,0.00');
                }
            },

            {
                data: "formaPago"
            },

            {
                data: "observaciones"
            },

            {
                data: "facturaId",

                render: function (data, type, row) {

                    var bt2 =
                        "<button class='btn btn-circle btn-success' " +
                        "onclick='editFactura(" +
                        data +
                        ");' " +
                        "title='Editar registro'>" +
                        "<i class='fa fa-edit fa-fw'></i>" +
                        "</button>";

                    var html =
                        "<div class='pull-right'>" +
                        bt2 +
                        "</div>";

                    return html;
                }
            }
        ]
    });
}


function datosOK() {

    $('#frmBuscar').validate({

        rules: {

            txtDesdeFecha: {
                required: true
            },

            txtHastaFecha: {
                required: true,
                greaterThan: "#txtDesdeFecha"
            },

            cmbDepartamentosTrabajo: {
                required: true,
                notEqualTo: 0
            },

            cmbPeriodos: {
                required: true
            }
        },

        messages: {

            txtDesdeFecha: {
                required: "Debe seleccionar una fecha"
            },

            txtHastaFecha: {
                required: "Debe seleccionar una fecha"
            },

            cmbDepartamentosTrabajo: {
                required: "Se tiene que elegir un departamento",
                notEqualTo: "Se tiene que elegir un departamento"
            },

            cmbPeriodos: {
                required: "Intruduzca un periodo de liquidación"
            }
        },

        errorPlacement: function (error, element) {

            error.insertAfter(element.parent());
        }
    });

    return $('#frmBuscar').valid();
}


/*
 * Carga las facturas en DataTables.
 *
 * Ya no utilizamos f.sel.
 * Todas las facturas obtenidas se marcan inicialmente.
 */
function loadTablaFacturas(data) {

    var dt = $('#dt_factura').dataTable();

    dt.fnClearTable();

    if (!data || data.length === 0) {

        dt.fnDraw();

        $('#checkMain').prop('checked', false);

        return;
    }

    dt.fnAddData(data);

    dt.fnDraw();

    // Por defecto seleccionamos todas
    $('.checkAll').prop('checked', true);

    $('#checkMain').prop('checked', true);
}


/*
 * Devuelve únicamente los facturaId
 * seleccionados actualmente por el usuario.
 */
function getFacturasSeleccionadas() {

    var tb = $('#dt_factura').dataTable().api();

    var datos = tb.rows().data().toArray();

    var facturaIds = [];

    datos.forEach(function (f) {

        var check =
            $('#chk' + f.facturaId);

        if (check.prop('checked')) {

            facturaIds.push(
                f.facturaId
            );
        }
    });

    return facturaIds;
}


function buscarFacturas() {

    var mf = function () {

        componFechas();

        if (!datosOK()) return;

        var departamentoId = 0;

        if (vm.sdepartamentoId()) {

            departamentoId =
                vm.sdepartamentoId();
        }

        var empresaId = 0;

        if (vm.sempresaId()) {

            empresaId =
                vm.sempresaId();
        }

        var comercialId = 0;

        if (vm.scomercialId()) {

            comercialId =
                vm.scomercialId();
        }

        var url =
            myconfig.apiUrl +
            "/api/facturas/liquidacion/" +
            vm.desdeFecha() +
            "/" +
            vm.hastaFecha();

        url += "/" + departamentoId;

        url += "/" + empresaId;

        url += "/" + comercialId;

        url += "/" + usuario.usuarioId;

        $.ajax({

            type: "GET",

            url: url,

            dataType: "json",

            contentType: "application/json",

            success: function (data, status) {

                loadTablaFacturas(data);

                $("#btnAlta").show();

                $('#checkMain').prop(
                    'checked',
                    true
                );
            },

            error: function (err) {

                mensErrorAjax(err);
            }
        });
    };

    return mf;
}


function componFechas() {

    var option =
        parseInt(vm.speriodo());

    var ano =
        vm.sano();

    var dFecha = "";

    var hFecha = "";

    switch (option) {

        case 1:

            dFecha =
                ano + "-01-01";

            hFecha =
                ano + "-03-31";

            vm.desdeFecha(dFecha);

            vm.hastaFecha(hFecha);

            break;


        case 2:

            dFecha =
                ano + "-04-01";

            hFecha =
                ano + "-06-30";

            vm.desdeFecha(dFecha);

            vm.hastaFecha(hFecha);

            break;


        case 3:

            dFecha =
                ano + "-07-01";

            hFecha =
                ano + "-09-30";

            vm.desdeFecha(dFecha);

            vm.hastaFecha(hFecha);

            break;


        case 4:

            dFecha =
                ano + "-10-01";

            hFecha =
                ano + "-12-31";

            vm.desdeFecha(dFecha);

            vm.hastaFecha(hFecha);

            break;
    }
}


/*
 * Comprueba si alguna de las facturas seleccionadas
 * ya tiene liquidaciones.
 *
 * Ya no se utilizan fechas/departamento/comercial
 * para localizar las facturas.
 */
function generarLiquidaciones() {

    var mf = function () {

        if (!datosOK()) return;

        var facturaIds =
            getFacturasSeleccionadas();


        if (
            !facturaIds ||
            facturaIds.length === 0
        ) {

            mensError(
                "No hay ninguna factura seleccionada"
            );

            return;
        }


        var data = {

            facturaIds:
                facturaIds
        };


        $.ajax({

            type: "POST",

            url:
                myconfig.apiUrl +
                "/api/liquidaciones/checkFacturas",

            dataType: "json",

            contentType:
                "application/json",

            data:
                JSON.stringify(data),


            success: function (data) {

                if (data.length > 0) {

                    var mens =
                        "Ya hay liquidaciones generadas de estas facturas. " +
                        "¿Desea borrarlas y generarlas de nuevo?";


                    $.SmartMessageBox({

                        title:
                            "<i class='fa fa-info'></i> Mensaje",

                        content:
                            mens,

                        buttons:
                            '[Aceptar][Cancelar]'

                    }, function (ButtonPressed) {


                        if (
                            ButtonPressed ===
                            "Aceptar"
                        ) {

                            generaLiquidaciones2(
                                facturaIds
                            );
                        }


                        if (
                            ButtonPressed ===
                            "Cancelar"
                        ) {

                            // No hacemos nada
                        }

                    });


                } else {

                    generaLiquidaciones2(
                        facturaIds
                    );
                }
            },


            error: function (err) {

                mensErrorAjax(err);
            }
        });
    };

    return mf;
}


/*
 * Generación de las liquidaciones.
 *
 * Las facturas a procesar son exclusivamente
 * las facturaIds seleccionadas por el usuario.
 */
function generaLiquidaciones2(
    facturaIds
) {

    var departamentoId = 0;

    if (vm.sdepartamentoId()) {

        departamentoId =
            vm.sdepartamentoId();
    }


    var empresaId = 0;

    if (vm.sempresaId()) {

        empresaId =
            vm.sempresaId();
    }


    var comercialId = 0;

    if (vm.scomercialId()) {

        comercialId =
            vm.scomercialId();
    }


    var data = {

        facturaIds:
            facturaIds,

        dFecha:
            vm.desdeFecha(),

        hFecha:
            vm.hastaFecha(),

        departamentoId:
            departamentoId,

        empresaId:
            empresaId,

        comercialId:
            comercialId,

        usuarioId:
            usuario.usuarioId
    };


    $.ajax({

        type: "POST",

        url:
            myconfig.apiUrl +
            "/api/liquidaciones/facturas",

        dataType: "json",

        contentType:
            "application/json",

        data:
            JSON.stringify(data),


        success: function (
            data,
            status
        ) {

            $("#btnAlta").hide();

            mensNormal(
                "Las liquidaciones han sido generadas, " +
                "puede consultarlas en el punto de menú específico"
            );

            vm.desdeFecha(null);

            vm.hastaFecha(null);

            loadTablaFacturas(null);

            loadComerciales(0);
        },


        error: function (err) {

            mensErrorAjax(err);
        }
    });
}


function borrarUltimaLiquidacion() {

    var mf = function () {

        var departamentoId = 0;

        if (vm.sdepartamentoId()) {

            departamentoId =
                vm.sdepartamentoId();
        }


        if (departamentoId == 0) {

            mensError(
                "No hay seleccionado ningún departamento"
            );

            return;
        }


        var mens =
            "Se borrará la última liquidación del departamento seleccionado. " +
            "¿Desea continuar?";


        $.SmartMessageBox({

            title:
                "<i class='fa fa-info'></i> Mensaje",

            content:
                mens,

            buttons:
                '[Aceptar][Cancelar]'

        }, function (ButtonPressed) {


            if (
                ButtonPressed ===
                "Aceptar"
            ) {

                var data = {

                    departamentoId:
                        departamentoId
                };


                $.ajax({

                    type: "DELETE",

                    url:
                        myconfig.apiUrl +
                        "/api/liquidaciones/borrar/ultima/",

                    dataType:
                        "json",

                    contentType:
                        "application/json",

                    data:
                        JSON.stringify(data),

                    success: function (
                        data,
                        status
                    ) {

                        mensNormal(
                            "Se ha borrado la liquidación con fecha de inicio " +
                            data +
                            " del departamento seleccionado"
                        );
                    },

                    error: function (err) {

                        mensErrorAjax(err);
                    }
                });
            }


            if (
                ButtonPressed ===
                "Cancelar"
            ) {

                // no hacemos nada
            }
        });
    };

    return mf;
}


function deleteFactura(id) {

    var mens =
        "¿Realmente desea borrar este registro?";


    $.SmartMessageBox({

        title:
            "<i class='fa fa-info'></i> Mensaje",

        content:
            mens,

        buttons:
            '[Aceptar][Cancelar]'

    }, function (ButtonPressed) {


        if (
            ButtonPressed ===
            "Aceptar"
        ) {

            var data = {

                facturaId:
                    id
            };


            $.ajax({

                type: "DELETE",

                url:
                    myconfig.apiUrl +
                    "/api/facturas/" +
                    id,

                dataType:
                    "json",

                contentType:
                    "application/json",

                data:
                    JSON.stringify(data),

                success: function (
                    data,
                    status
                ) {

                    var fn =
                        buscarFacturas();

                    fn();
                },

                error: function (err) {

                    mensErrorAjax(err);
                }
            });
        }


        if (
            ButtonPressed ===
            "Cancelar"
        ) {

            // no hacemos nada
        }
    });
}


function editFactura(id) {

    var url =
        "FacturaDetalle.html?FacturaId=" +
        id;

    window.open(
        url,
        '_blank'
    );
}


function cargarFacturas() {

    var mf = function (id) {

        if (id) {

            var data = {

                id:
                    facturaId
            };


            $.ajax({

                type: "GET",

                url:
                    myconfig.apiUrl +
                    "/api/facturas/" +
                    facturaId,

                dataType:
                    "json",

                contentType:
                    "application/json",

                data:
                    JSON.stringify(data),

                success: function (
                    data,
                    status
                ) {

                    loadTablaFacturas(
                        data
                    );
                },

                error: function (err) {

                    mensErrorAjax(err);
                }
            });

        } else {

            $.ajax({

                type: "GET",

                url:
                    myconfig.apiUrl +
                    "/api/facturas",

                dataType:
                    "json",

                contentType:
                    "application/json",

                success: function (
                    data,
                    status
                ) {

                    loadTablaFacturas(
                        data
                    );
                },

                error: function (err) {

                    mensErrorAjax(err);
                }
            });
        }
    };

    return mf;
}


function printFactura(id) {

    $.ajax({

        type: "GET",

        url:
            myconfig.apiUrl +
            "/api/informes/facturas/" +
            id,

        dataType:
            "json",

        contentType:
            "application/json",

        success: function (
            data,
            status
        ) {

            informePDF(data);
        },

        error: function (err) {

            mensErrorAjax(err);
        }
    });
}


function informePDF(data) {

    var shortid =
        "HyGQ0yAP";


    var data = {

        template: {

            shortid:
                shortid
        },

        data:
            data
    };


    f_open_post(
        "POST",
        myconfig.reportUrl +
        "/api/report",
        data
    );
}


var f_open_post =
    function (
        verb,
        url,
        data,
        target
    ) {

        var form =
            document.createElement(
                "form"
            );

        form.action =
            url;

        form.method =
            verb;

        form.target =
            target || "_blank";


        var input =
            document.createElement(
                "textarea"
            );

        input.name =
            "template[shortid]";

        input.value =
            data.template.shortid;

        form.appendChild(input);


        input =
            document.createElement(
                "textarea"
            );

        input.name =
            "data";

        input.value =
            JSON.stringify(
                data.data
            );

        form.appendChild(input);


        form.style.display =
            'none';

        document.body.appendChild(
            form
        );

        form.submit();
    };


function loadEmpresas(id) {

    llamadaAjax(
        'GET',
        "/api/empresas",
        null,
        function (
            err,
            data
        ) {

            if (err) return;


            var empresas = [

                {
                    empresaId:
                        0,

                    nombre:
                        ""
                }

            ].concat(data);


            vm.posiblesEmpresas(
                empresas
            );


            $("#cmbEmpresas")
                .val([id])
                .trigger(
                    'change'
                );
        }
    );
}


function loadComerciales(id) {

    $.ajax({

        type: "GET",

        url:
            "/api/comerciales/agentes",

        dataType:
            "json",

        contentType:
            "application/json",

        success: function (
            data,
            status
        ) {

            var tiposComerciales = [

                {
                    comercialId:
                        0,

                    nombre:
                        ""
                }

            ].concat(data);


            vm.posiblesComerciales(
                tiposComerciales
            );


            $("#cmbComerciales")
                .val([id])
                .trigger(
                    'change'
                );
        },

        error: function (err) {

            mensErrorAjax(err);
        }
    });
}


/*
 * Marcar / desmarcar todos los checks.
 *
 * Ya NO actualizamos facturas.sel en BD.
 */
function updateAll(opcion) {

    $('.checkAll')
        .prop(
            'checked',
            opcion
        );
}