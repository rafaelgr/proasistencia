/*-------------------------------------------------------------------------- 
impagosfGeneral.js
Funciones js para la página ImpagosfGeneral.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_impagos = undefined;

var dataImpagos;
var usuario;
var impagosCero = [];

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

datePickerSpanish(); // función de comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    pageSetUp();
    getVersionFooter();

    $.validator.addMethod("greaterThan",
        function (value, element, params) {
            var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
            if (!/Invalid|NaN/.test(new Date(fv))) {
                return new Date(fv) >= new Date(fp);
            } else {
                return true;
            }
        }, 'La fecha final debe ser mayor que la inicial.');

    vm = new admData();
    ko.applyBindings(vm);

    // Recuperamos los departamentos de trabajo
    recuperaDepartamento(function (err, data) {
        if (err) return;
        vm.posiblesDepartamentos(data);
        $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    });

    $('#btnBuscarImpagos').click(buscarImpagos());
    $('#btnGenerarFacturasRectificativas').click(generarFacturasRectificativas());
    $('#frmBuscarImpagos').submit(function () { return false; });

    $("#checkMain").click(function (e) {
        if ($('#checkMain').prop('checked')) {
            $('.checkAll').prop('checked', true);
            updateAll(true);
        } else {
            $('.checkAll').prop('checked', false);
            updateAll(false);
        }
    });

    $('#btnGenerarFacturasRectificativas').hide();

    initTablaImpagos();
}

// knockout
function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
}

// Validación de fechas
function datosOK() {
    $('#frmBuscarImpagos').validate({
        rules: {
            txtDesdeFecha: { required: true },
            txtHastaFecha: { required: true, greaterThan: "#txtDesdeFecha" }
        },
        messages: {
            txtDesdeFecha: { required: "Debe seleccionar una fecha" },
            txtHastaFecha: { required: "Debe seleccionar una fecha" }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscarImpagos').valid();
}

// Inicializa tabla
function initTablaImpagos() {
    $('#dt_impagos').dataTable({
        autoWidth: true,
        paging: false,
        preDrawCallback: function () {
            if (!responsiveHelper_dt_impagos) {
                responsiveHelper_dt_impagos = new ResponsiveDatatablesHelper($('#dt_impagos'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_impagos.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_impagos.respond();
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: { first: "Primero", previous: "Anterior", next: "Siguiente", last: "Último" },
            aria: { sortAscending: ": Activar para ordenar ascendente", sortDescending: ": Activar para ordenar descendente" }
        },
        data: dataImpagos,
        columns: [
            {
                data: "facturaId", render: function (data) {
                    return '<label class="input"><input id="chk' + data + '" type="checkbox" class="checkAll"></label>';
                }
            },
            { data: "referencia" },
            { data: "emisorNombre" },
            { data: "receptorNombre" },
            { data: "dirTrabajo" },
            { data: "vNum" },
            { data: "fecha", render: function (data) { return moment(data).format('DD/MM/YYYY'); } },
            { data: "diasDesdeVencimiento" },
            { data: "total", render: function (data) { return numeral(data).format('0,0.00'); } },
            { data: "totalConIva", render: function (data) { return numeral(data).format('0,0.00'); } },
            { data: "formaPago" },
            { data: "observaciones" },
            {
                data: "facturaId", render: function (data) {
                    var bt1 = "<button class='btn btn-circle btn-success' onclick='editImpago(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    return "<div class='pull-right'>" + bt1 + "</div>";
                }
            }
        ]
    });
}

// Carga datos en la tabla
function loadTablaImpagos(data) {
    var dt = $('#dt_impagos').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();

    if (data.length > 0) {
        data.forEach(function (v) {
            var field = "#chk" + v.facturaId;
            if (v.sel == 1) {
                $(field).attr('checked', true);
            }
            $(field).change(function () {
                var dataToUpdate = {
                    factura: {
                        facturaId: v.facturaId,
                        empresaId: v.empresaId,
                        clienteId: v.clienteId,
                        fecha: moment(v.fecha).format('YYYY-MM-DD'),
                        sel: this.checked ? 1 : 0
                    }
                };
                $.ajax({
                    type: "PUT",
                    url: myconfig.apiUrl + "/api/facturas/" + v.facturaId,
                    contentType: "application/json",
                    data: JSON.stringify(dataToUpdate),
                    success: function () { },
                    error: function (err) { mensErrorAjax(err); }
                });
            });
        });
    }

}

// Buscar impagos
function buscarImpagos() {
    return function () {
        if (!datosOK()) return;

        impagosCero = [];
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturas/impagos/"
                + spanishDbDate(vm.desdeFecha())
                + "/" + spanishDbDate(vm.hastaFecha())
                + "/" + vm.sdepartamentoId() // filtramos por departamento
                + "/" + usuario.usuarioId,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data && data.length > 0) {
                    loadTablaImpagos(data);
                    $('#checkMain').prop('checked', false);
                    $('#btnGenerarFacturasRectificativas').show();

                    data.forEach(function (f) {
                        if (f.total == 0) impagosCero.push(f.vNum);
                    });
                    if (impagosCero.length > 0) mensError("Las siguientes facturas tienen importe a cero:\n" + impagosCero.join("\n"));
                } else {
                    mensAlerta("No se han encontrado registros")
                }
            },
            error: function (err) { mensErrorAjax(err); }
        });
    };
}

// Gestionar impagos
function generarFacturasRectificativas() {
    return function () {
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/facturas/generar/rectificativas/desde/facturas/"
                + spanishDbDate(vm.desdeFecha())
                + "/" + spanishDbDate(vm.hastaFecha())
                + "/" + vm.sdepartamentoId() // filtramos por departamento
                + "/" + usuario.usuarioId,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data != "OK") {
                    mensError("Error gestionando impagos: " + JSON.stringify(data));
                } else {
                    mensNormal("Impagos gestionados correctamente");
                    vm.desdeFecha(null);
                    vm.hastaFecha(null);
                    $('#checkMain').prop('checked', false);
                    $('#btnGenerarFacturasRectificativas').hide();
                    loadTablaImpagos(null);
                }
            },
            error: function (err) { mensErrorAjax(err); }
        });
    };
}

// Checkbox todos
function updateAll(opcion) {
    var sel = opcion ? 1 : 0;
    var datos = $('#dt_impagos').dataTable().api().rows({ page: 'current' }).data();
    for (var i = 0; i < datos.length; i++) {
        var dataToUpdate = {
            factura: {
                facturaId: datos[i].facturaId,
                empresaId: datos[i].empresaId,
                clienteId: datos[i].clienteId,
                fecha: moment(datos[i].fecha).format('YYYY-MM-DD'),
                sel: sel
            }
        };
        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/facturas/" + datos[i].facturaId,
            contentType: "application/json",
            data: JSON.stringify(dataToUpdate),
            success: function () { },
            error: function (err) { mensErrorAjax(err); }
        });
    }
}

// Editar impago
function editImpago(id) {
    var url = "FacturaDetalle.html?FacturaId=" + id;
    window.open(url, '_new');
}

