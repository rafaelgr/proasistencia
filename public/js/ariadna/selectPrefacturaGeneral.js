/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página PrefacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataPrefacturas;
var prefacturaId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
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
        }, 'La fecha final debe ser mayor que la inicial.');
    //
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#btnBuscar').click(buscarPrefacturas());
    $('#btnAlta').click(crearPrefactura());
    $('#frmBuscar').submit(function () {
        return false
    });
    // ocultamos el botón de alta hasta que se haya producido una búsqueda
    $("#btnAlta").hide();

    initAutoCliente();

    $("#cmbAgentes").select2(select2Spanish());
    loadAgentes();

    $("#cmbArticulos").select2(select2Spanish());
    loadArticulos();

    $("#cmbTiposMantenimientos").select2(select2Spanish());
    loadTiposMantenimientos();

    initTablaPrefacturas();
    // comprobamos parámetros
    prefacturaId = gup('PrefacturaId');
}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    //
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);
    //
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //
    self.sagenteId = ko.observable();
    //
    self.posiblesAgentes = ko.observableArray([]);
    self.elegidosAgentes = ko.observableArray([]);
    //    
    //
    self.stipoMantenimientoId = ko.observable();
    //
    self.posiblesTiposMantenimientos = ko.observableArray([]);
    self.elegidosTiposMantenimientos = ko.observableArray([]);
}

function initTablaPrefacturas() {
    tablaCarro = $('#dt_prefactura').dataTable({
        autoWidth: true,
        paging: false,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_prefactura'), breakpointDefinition);
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
        data: dataPrefacturas,
        columns: [{
            data: "prefacturaId",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "vNum"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "total"
        }, {
            data: "totalConIva"
        }, {
            data: "observaciones"
        }, {
            data: "prefacturaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deletePrefactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editPrefactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success btn-lg' onclick='printPrefactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtDesdeFecha: {
                required: true
            },
            txtHastaFecha: {
                required: true,
                greaterThan: "#txtDesdeFecha"
            },

        },
        // Messages for form validation
        messages: {
            txtDesdeFecha: {
                required: "Debe seleccionar una fecha"
            },
            txtHastaFecha: {
                required: "Debe seleccionar una fecha"
            }
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
    data.forEach(function (v) {
        var field = "#chk" + v.prefacturaId;
        if (v.sel == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                prefactura: {
                    prefacturaId: v.prefacturaId,
                    empresaId: v.empresaId,
                    clienteId: v.clienteId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    sel: 0
                }
            };
            if (this.checked) {
                data.prefactura.sel = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/prefacturas/%s', myconfig.apiUrl, v.prefacturaId);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {

                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        });
    });
}

function buscarPrefacturas() {
    var mf = function () {
        if (!datosOK()) return;
        var url = myconfig.apiUrl + "/api/prefacturas/emision/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha());
        if (vm.sclienteId()) url += "/" + vm.sclienteId(); else url += "/0"
        if (vm.sagenteId()) url += "/" + vm.sagenteId(); else url += "/0"
        if (vm.sarticuloId()) url += "/" + vm.sarticuloId(); else url += "/0"
        if (vm.stipoMantenimientoId()) url += "/" + vm.stipoMantenimientoId(); else url += "/0"   
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaPrefacturas(data);
                // mostramos el botén de alta
                $("#btnAlta").show();
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function crearPrefactura() {
    var mf = function () {
        if (!datosOK()) return;
        var url = myconfig.apiUrl + "/api/facturas/prefacturas/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/NULL";
        if (vm.sclienteId()) url += "/" + vm.sclienteId(); else url += "/0"
        if (vm.sagenteId()) url += "/" + vm.sagenteId(); else url += "/0"
        if (vm.sarticuloId()) url += "/" + vm.sarticuloId(); else url += "/0"
        if (vm.stipoMantenimientoId()) url += "/" + vm.stipoMantenimientoId(); else url += "/0"                
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // borramos datos
                $("#btnAlta").hide();
                mensNormal('Facturas dadas de alta correctamente');
                vm.desdeFecha(null);
                vm.hastaFecha(null);
                loadTablaPrefacturas(null);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
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
    var url = "PrefacturaDetalle.html?PrefacturaId=" + id;
    window.open(url, '_new');
}

function cargarPrefacturas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: prefacturaId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturas/" + prefacturaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
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
    return mf;
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

function loadClientes(id) {
    $.ajax({
        type: "GET",
        url: "/api/clientes/soloclientes",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var mantenedores = [{ clienteId: 0, nombre: "" }].concat(data);
            vm.posiblesClientes(mantenedores);
            $("#cmbClientes").val([id]).trigger('change');
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
            $("#cmbArticulos").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadAgentes(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/agentes",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var agentes = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesAgentes(agentes);
            $("#cmbAgentes").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposMantenimientos(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_mantenimientos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposMantenimientos = [{ tipoMantenimientoId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposMantenimientos(tiposMantenimientos);
            $("#cmbTiposMantenimientos").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

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
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};