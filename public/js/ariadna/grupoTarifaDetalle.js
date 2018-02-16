/*-------------------------------------------------------------------------- 
grupoTarifaDetalle.js
Funciones js par la página GrupoTarifaDetalle.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var GrupoTarifaId = 0;
var cmd = "";
var lineaEnEdicion = false;

var dataTarifasLineas;
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
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmGrupoTarifa").submit(function() {
        return false;
    });
    $("#frmLinea").submit(function() {
        return false;
    });

    GrupoTarifaId = gup('GrupoTarifaId');
    cmd = gup("cmd");

    initTablaTarifasLineas();


    if (GrupoTarifaId != 0) {
        var data = {
                grupoTarifaId: GrupoTarifaId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/grupo_tarifa/" + GrupoTarifaId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                loadLineasTarifa(data.grupoTarifaId);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.grupoTarifaId(0);
        $("#lineastarifa").hide();
        document.title = "NUEVA TARIFA";
    }
}

function admData() {
    var self = this;
    self.grupoTarifaId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.grupoTarifaId(data.grupoTarifaId);
    vm.nombre(data.nombre);

    if (cmd == "nueva") {
        mostrarMensajeGrupoNuevo();
        cmd = "";
    }
}

function datosOK() {
    $('#frmGrupoTarifa').validate({
        rules: {
            txtNombre: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNombre: {
                required: "Debe dar un nombre"
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmGrupoTarifa").validate().settings;
    return $('#frmGrupoTarifa').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            grupoTarifa: {
                "grupoTarifaId": vm.grupoTarifaId(),
                "nombre": vm.nombre()
            }
        };
        if (GrupoTarifaId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/grupo_tarifa",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "GrupoTarifaDetalle.html?cmd=nueva&GrupoTarifaId=" + vm.grupoTarifaId();
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
                url: myconfig.apiUrl + "/api/grupo_tarifa/" + GrupoTarifaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "GrupoTarifaGeneral.html?GrupoTarifaId=" + vm.grupoTarifaId();
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
    var mf = function() {
        var url = "GrupoTarifaGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de tarifas
--------------------------------------------------------------------*/

function nuevaTarifa(){
    var url = 'TarifaDetalle.html?desdeGrupo=true&GrupoId='+ GrupoTarifaId;
    window.open(url, '_self');
}


function initTablaTarifasLineas() {
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
        data: dataTarifasLineas,
        columns: [ {
            data: "nombre",
            className: "text-left"
        }, {
            data: "precio",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "tarifaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteTarifaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editTarifaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}



function loadTablaTarifaLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasTarifa(id) {
    llamadaAjax("GET", "/api/tarifas/grupo/todos/lineas/" + id, null, function (err, data) {
        if (err) return;
        loadTablaTarifaLineas(data);
    });
}




function editTarifaLinea(id) {
    var url = 'TarifaDetalle.html?desdeGrupo=true&TarifaId='+id;
    window.open(url, '_self');
}

function deleteTarifaLinea(tarifaId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/tarifas/" + tarifaId, null, function (err, data) {
            if (err) return;
            loadLineasTarifa(vm.grupoTarifaId());
        });
    }, function () {
        // cancelar no hace nada
    });
}


var mostrarMensajeGrupoNuevo = function () {
    var mens = "Introduzca las líneas de la nueva tarifa en el apartado correspondiente";
    mensNormal(mens);
}

