/*-------------------------------------------------------------------------- 
tarifaDetalle.js
Funciones js par la página TarifaDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var tarifaId = 0;
var cmd = "";
var lineaEnEdicion = false;
var GrupoId;
var desdeGrupo;
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
    $("#btnAceptar").click(aceptarTarifa);
    $("#btnSalir").click(salir());
    $("#frmTarifa").submit(function () {
        return false;
    });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });

    // select2 things
    $("#cmbArticulos").select2(select2Spanish());
    loadArticulos();

    // select2 things
    $("#cmbGrupo").select2(select2Spanish());
    loadGrupoTarifa();

    
    initTablaTarifasLineas();
   

    tarifaId = gup('TarifaId');
    cmd = gup("cmd");
    GrupoId = gup("GrupoId");
    desdeGrupo = gup("desdeGrupo");

    if (tarifaId != 0) {
        // caso edicion
        llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas/" + tarifaId, null, function (err, data) {
            if (err) return;
            loadData(data);
            loadLineasTarifa(data.tarifaId);
        })
    } else {
        // caso alta
        vm.tarifaId(0);
        $("#lineastarifa").hide();
        document.title = "NUEVA TARIFA";
        if(GrupoId){
            loadGrupoTarifa(GrupoId);
        }
    }
}

function admData() {
    var self = this;
    self.tarifaId = ko.observable();
    self.nombre = ko.observable();
    //
    self.grupoTarifaId = ko.observable();
    //
    self.sgrupoTarifaId = ko.observable();
    //
    self.posiblesGrupos = ko.observableArray([]);
    self.elegidosGruposTarifa = ko.observableArray([]);

    
    

    // -- Valores para las líneas
    self.tarifaLineaId = ko.observable();
    self.precioUnitario = ko.observable();
    self.articuloId = ko.observable();
    //
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);
    
}

function loadData(data) {
    vm.tarifaId(data.tarifaId);
    vm.nombre(data.nombre);
    loadGrupoTarifa(data.grupoTarifaId);


    if (cmd == "nueva") {
        mostrarMensajeTarifaNueva();
        cmd = "";
    }
    
}


function datosOK() {
    $('#frmTarifa').validate({
        rules: {
            cmbGrupo: {
                required: true
            },
            txtNombre: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbGrupo: {
                required: "Debe elegir un grupo"
            },
            txtNombre: {
                required: 'Debe elegir un nombre'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmTarifa").validate().settings;
    return $('#frmTarifa').valid();
}

var aceptarTarifa = function () {
    if (!datosOK()) return;

   
    var data = generarTarifaDb();
    // caso alta
    var verb = "POST";
    var url = myconfig.apiUrl + "/api/tarifas";
    var returnUrl = "TarifaDetalle.html?desdeGrupo="+ desdeGrupo +"&cmd=nueva&TarifaId=";
    // caso modificación
    if (tarifaId != 0) {
        verb = "PUT";
        url = myconfig.apiUrl + "/api/tarifas/" + tarifaId;
        returnUrl = "TarifaGeneral.html?TarifaId=";
    }

    llamadaAjax(verb, url, data, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.tarifaId();
        if(desdeGrupo == "true" && tarifaId != 0){
            window.open('GrupoTarifaDetalle.html?GrupoTarifaId='+ vm.sgrupoTarifaId(), '_self');
        }
        else{
            window.open(returnUrl, '_self');
        }
    });
}

var generarTarifaDb = function () {
    var data = {
        tarifa: {
            "tarifaId": vm.tarifaId(),
            "grupoTarifaId": vm.sgrupoTarifaId(),
            "nombre": vm.nombre()
        }
    };
    return data;
}

function salir() {
    var mf = function () {
        var url = "TarifaGeneral.html";
        if(cmd != "nueva" && desdeGrupo == "true"){
            window.open('GrupoTarifaDetalle.html?GrupoTarifaId='+ vm.sgrupoTarifaId(), '_self');
        }else{
            window.open(url, '_self');
        }
    }
    return mf;
}

/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de tarifas
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea();
    lineaEnEdicion = false;
}

function limpiaDataLinea(data) {
    vm.tarifaLineaId(0);
    vm.precioUnitario(null);
    
    loadArticulos();
}


function aceptarLinea() {
    if (!datosOKLineas()) {
        return;
    }
    var data = {
        tarifaLinea: {
            tarifaLineaId: vm.tarifaLineaId(),
            tarifaId: vm.tarifaId(),
            articuloId: vm.sarticuloId(),
            precioUnitario:  numeroDbf(vm.precioUnitario())
        }
    }
    //compruebaArticuloRepetido en misma tarifa
    llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas/articulo/" + vm.sarticuloId() + " / " + vm.tarifaId(), null, function (err, datos) {
        if (err) return;
        if (datos.length > 0) {
            mostrarMensajeArticuloRepetido();
        }else{
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/tarifas/lineas";
                if (lineaEnEdicion) {
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/tarifas/lineas/" + vm.tarifaLineaId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalLinea').modal('hide');
                    llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas/" + data.tarifaId, null, function (err, data) {
                        loadData(data);
                        loadLineasTarifa(data.tarifaId);
                       
                    });
                });
            
        }
    });
}

function datosOKLineas() {
    $('#linea-form').validate({
        rules: {
            cmbArticulos: {
                required: true
            },
            txtPrecioUnitario: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbArticulos: {
                required: "Debe dar una unidad constructiva asociada a la linea de tarifa"
            },
            txtPrecioUnitario: {
                required: "Debe proporcionar un precio unitario"
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
            data: "unidadConstructiva",
            className: "text-left"
        }, {
            data: "precioUnitario",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "tarifaLineaId",
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

function loadDataLinea(data) {
    vm.tarifaLineaId(data.tarifaLineaId);
    vm.articuloId(data.articuloId);
    vm.precioUnitario(numeral(data.precioUnitario).format('0,0.00'))
    //
    loadArticulos(data.articuloId);
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
    llamadaAjax("GET", "/api/tarifas/lineas/" + id, null, function (err, data) {
        if (err) return;
        loadTablaTarifaLineas(data);
    });
}

function loadArticulos(id) {
    llamadaAjax("GET", "/api/articulos/concat/articulo/capitulo", null, function (err, data) {
        if (err) return;
        var articulos = [{ articuloId: null, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
        if (id) {
            $("#cmbArticulos").val([id]).trigger('change');
        } else {
            $("#cmbArticulos").val([0]).trigger('change');
        }
    });
}

function loadGrupoTarifa(id){
    llamadaAjax("GET", "/api/grupo_tarifa", null, function (err, data) {
        if (err) return;
        var grupos = [{ grupoTarifaId: null, nombre: "" }].concat(data);
        vm.posiblesGrupos(grupos);
        if (id) {
            $("#cmbGrupo").val([id]).trigger('change');
        } else {
            $("#cmbGrupo").val([0]).trigger('change');
        }
    });
}


function editTarifaLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/tarifas/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLinea(data[0]);
    });
}

function deleteTarifaLinea(tarifaId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        var data = {
            tarifaLinea: {
                tarifaId: vm.tarifaId()
            }
        };
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/tarifas/lineas/" + tarifaId, data, function (err, data) {
            if (err) return;
            llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas/" + vm.tarifaId(), null, function (err, data) {
                if (err) return;
                loadData(data);
                loadLineasTarifa(data.tarifaId);
            });
        });
    }, function () {
        // cancelar no hace nada
    });
}

var mostrarMensajeTarifaNueva = function () {
    var mens = "Introduzca las líneas de la nueva tarifa en el apartado correspondiente";
    mensNormal(mens);
}

var mostrarMensajeArticuloRepetido = function () {
    var mens = "La unidad constructiva seleccionada ya se ancuentra incluida en esta tarifa";
    mensNormal(mens);
    loadArticulos();
}
