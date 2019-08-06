/*-------------------------------------------------------------------------- 
tarifaClienteDetalle.js
Funciones js par la página tarifaClienteDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var tarifaClienteId = 0;
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

    $('#frmLineasGrupos').submit(function(){
        return false;
    });

    $('#frmCopia').submit(function(){
        return false;
    });


    // select2 things
    $("#cmbCapitulos").select2(select2Spanish());
    loadCapitulos();
   

    // select2 things
    $("#cmbArticulos").select2(select2Spanish());
    loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        if (e.added) cambioArticulo(e.added.id);
    });


    $("#cmbTiposProfesional").select2(select2Spanish());
    loadTiposProfesional();
    $("#cmbTiposProfesional").select2().on('change', function (e) {
        if (e.added) cambioTipoProfesional(e.added.id);
    });

    

    // select2 things
    $("#cmbCapitulos").select2(select2Spanish());
    loadCapitulos();

    
    initTablaTarifasClienteLineas();
   

    tarifaClienteId = gup('tarifaClienteId');
    cmd = gup("cmd");
    

    if (tarifaClienteId != 0) {
        // caso edicion
        vm.porcentaje(0)
        llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_cliente/" + tarifaClienteId, null, function (err, data) {
            if (err) return;
            loadData(data);
            loadLineasTarifaCliente(data.tarifaClienteId);

        })
    } else {
        // caso alta
        vm.tarifaClienteId(0);
        vm.porcentaje(0)
        $("#lineastarifa").hide();
        $('#lineasCapitulos').hide();
        //$('#btnLineasCapitulos').hide();
        document.title = "NUEVA TARIFA";
       
    }
}

function admData() {
    var self = this;
    self.tarifaClienteId = ko.observable();
    self.nombre = ko.observable();
    self.tipoProfesional = ko.observable();
    
  
    //valores para el formulario de capitulos
    self.porcentaje = ko.observable();
    //
    self.grupoArticuloId = ko.observable();
    self.sgrupoArticuloId = ko.observable();
    //
    self.posiblesCapitulos = ko.observableArray([]);
    self.elegidosCapitulos = ko.observableArray([]);
    

    // -- Valores para las líneas
    self.tarifaClienteLineaId = ko.observable();
    self.precioUnitario = ko.observable();
    self.articuloId = ko.observable();
    //
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);

    //valor para el nombre de copia de tarifa
    self.nuevoNombre = ko.observable();


    //combo tipos profesionales para el filtrado lde las lineas
    self.tipoProfesionalId = ko.observable();
    self.stipoProfesionalId = ko.observable();
    //
    self.posiblesTiposProfesional = ko.observableArray([]);
    self.elegidosTiposProfesional = ko.observableArray([]);

    //valor del % de incremento/decremento
    self.porcentaje = ko.observable();
    
}

function loadData(data) {
    vm.tarifaClienteId(data.tarifaClienteId);
    vm.nombre(data.nombre);
    vm.porcentaje(0);
   

    if (cmd == "nueva") {
        mostrarMensajeTarifaNueva();
        cmd = "";
    }
    
}


function datosOK() {
    $('#frmTarifa').validate({
        rules: {
            
            txtNombre: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            
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
    var url = myconfig.apiUrl + "/api/tarifas_cliente";
    var returnUrl = "tarifaClienteDetalle.html?cmd=nueva&tarifaClienteId=";
    // caso modificación
    if (tarifaClienteId != 0) {
        verb = "PUT";
        url = myconfig.apiUrl + "/api/tarifas_cliente/" + tarifaClienteId;
        returnUrl = "TarifaClienteGeneral.html?tarifaClienteId=";
    }

    llamadaAjax(verb, url, data, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.tarifaClienteId();
        
            window.open(returnUrl, '_self');
        
    });
}

var generarTarifaDb = function () {
    var data = {
        tarifaCliente: {
            "tarifaClienteId": vm.tarifaClienteId(),
            "nombre": vm.nombre()
        }
    };
    return data;
}

function salir() {
    var mf = function () {
        
            window.open("TarifaClienteGeneral.html", '_self');
        
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
    vm.tarifaClienteLineaId(0);
    vm.precioUnitario(null);
    vm.tipoProfesional(null);
    
    loadArticulos();
}


function aceptarLinea() {
    if (!datosOKLineas()) {
        return;
    }
    var data = {
        tarifaClienteLinea: {
            tarifaClienteLineaId: vm.tarifaClienteLineaId(),
            tarifaClienteId: vm.tarifaClienteId(),
            articuloId: vm.sarticuloId(),
            precioUnitario:  vm.precioUnitario()
        }
    }
    //compruebaArticuloRepetido en misma tarifaCliente
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/tarifas_cliente/lineas";
                if (lineaEnEdicion) {
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/tarifas_cliente/lineas/" + vm.tarifaClienteLineaId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalLinea').modal('hide');
                    llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_cliente/" + data.tarifaClienteId, null, function (err, data) {
                        loadData(data);
                        loadLineasTarifaCliente(data.tarifaClienteId);
                       
                    });
                });
}

function datosOKLineas() {
    if(vm.precioUnitario() === "") vm.precioUnitario(null);
    $('#linea-form').validate({
        rules: {
            cmbArticulos: {
                required: true
            },
            txtPrecioUnitario: {
                required: true,
                number:true,
            }
        },
        // Messages for form validation
        messages: {
            cmbArticulos: {
                required: "Debe dar una unidad constructiva asociada a la linea de tarifaCliente"
            },
            txtPrecioUnitario: {
                required: "Debe proporcionar un precio unitario",
                number: "Se tiene que introducir un numero válido"
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



function initTablaTarifasClienteLineas() {
    tablaCarro = $('#dt_lineas').DataTable({
        autoWidth: true,
        "columnDefs": [
            { "width": "10%", "targets": 0 },
            { "width": "10%", "targets": 1 }
          ],
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
            data: "profesion",
            className: "text-left"
        }, {
            data: "codigoReparacion",
            className: "text-left"
        }, {
            data: "unidad",
            className: "text-left"
        },{
            data: "unidadConstructiva",
            className: "text-left"
        }, {
            data: "precioUnitario",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "tarifaClienteLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteTarifaClienteLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalLinea' onclick='editTarifaClienteLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    vm.tarifaClienteLineaId(data.tarifaClienteLineaId);
    vm.articuloId(data.articuloId);
    vm.precioUnitario(data.precioUnitario);
    //
    loadArticulos(data.articuloId);
}



function loadTablatarifaClienteLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnCopiar').hide();
    }
    dt.fnClearTable();
    if (data != null){
        dt.fnAddData(data);
        $('#btnCopiar').show();
    }
    dt.fnDraw();
}


function  loadLineasTarifaCliente(id) {
    llamadaAjax("GET", "/api/tarifas_cliente/lineas/" + id, null, function (err, data) {
        if (err) return;
        loadTablatarifaClienteLineas(data);
    });
}

function loadArticulos(id) {
    llamadaAjax("GET", "/api/articulos/concat/articulo/capitulo", null, function (err, data) {
        if (err) return;
        var articulos = [{ articuloId: null, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
        if (id) {
            $("#cmbArticulos").val([id]).trigger('change');
            loadProfesion(id);
        } else {
            $("#cmbArticulos").val([0]).trigger('change');
        }
    });
}

function loadProfesion(id) {
    llamadaAjax("GET", "/api/articulos/profesion/tipo/" + id, null, function (err, data) {
        if (err) return;
        vm.tipoProfesional(data.profesion);
    });
}


function loadCapitulos(id){
    llamadaAjax("GET", "/api/articulos", null, function (err, data) {
        if (err) return;
        var capitulos = [{ grupoArticuloId: 0, nombre: "Todos" }].concat(data);
        vm.posiblesCapitulos(capitulos);
        if (id) {
            $("#cmbCapitulos").val([id]).trigger('change');
        } else {
            $("#cmbCapitulos").val([0]).trigger('change');
        }
    });
}

function cambioArticulo(articuloId) {
    if (!articuloId) return;
    llamadaAjax("GET", "/api/articulos/" + articuloId, null, function (err, data) {
        if(err) return;
        vm.precioUnitario(data.precioUnitario);
        loadProfesion(articuloId);
    });
}



function cambioTipoProfesional(tipoProfesionalId) {
    var url = "/api/tarifas_cliente/lineas/" + vm.tarifaClienteId();
    if (tipoProfesionalId > 0) {
        url = "/api/tarifas_cliente/lineas/" + vm.tarifaClienteId() +"/"+ tipoProfesionalId
    }
    llamadaAjax("GET", url, null, function (err, data) {
        if(err) return;
        loadTablatarifaClienteLineas(data)
    });
}



function editTarifaClienteLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/tarifas_cliente/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLinea(data[0]);
    });
}

function deleteTarifaClienteLinea(tarifaClienteId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        var data = {
            tarifaClienteLinea: {
                tarifaClienteId: vm.tarifaClienteId()
            }
        };
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/tarifas_cliente/lineas/" + tarifaClienteId, data, function (err, data) {
            if (err) return;
            llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_cliente/" + vm.tarifaClienteId(), null, function (err, data) {
                if (err) return;
                loadData(data);
                loadLineasTarifaCliente(data.tarifaClienteId);
            });
        });
    }, function () {
        // cancelar no hace nada
    });
}

function loadTiposProfesional(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_profesional",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposProfesional = [{ tipoProfesionalId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposProfesional(tiposProfesional);
            $("#cmbTiposProfesional").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

//funciones de tarifas generadas automaticamente

function actualizaLineas(){
    if(!datosOkLineasGrupos()) {
        return;
    }

    var data = creaObjeto();
    var url = "/api/tarifas_cliente/lineas/multiples/";

    if (vm.sgrupoArticuloId() == 0) {
        url = "/api/tarifas_cliente/lineas/multiples/todos";
    }
    
    llamadaAjax("POST", myconfig.apiUrl + url , data, function (err, data) {
        llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_cliente/" + data.tarifaClienteId, null, function (err, data) {
            if(err) return;
            $('#modalTarifasGrupos').modal('hide');
            loadData(data);
            loadLineasTarifaCliente(data.tarifaClienteId);
        });
    });
}

function datosOkLineasGrupos() {
    if(vm.porcentaje() === "") {
     vm.porcentaje(null);
    } 
     $('#frmLineasGrupos').validate({
         rules: {
             txtPorcentaje: {
                 required: true,
                 number: true,
             }
         },
         // Messages for form validation
         messages: {
             txtPorcentaje: {
                 required: "Debe proporcionar un porcentaje",
                 number: "Deve introducir un numero válido"
             }
         },
         // Do not change code below
         errorPlacement: function (error, element) {
             error.insertAfter(element.parent());
         }
     });
     var opciones = $("#frmLineasGrupos").validate().settings;
     return $('#frmLineasGrupos').valid();
 }




function creaObjeto(){
    var porcent = parseFloat(vm.porcentaje());
    
    if(porcent > 0){
        porcent = (100 + porcent) / 100
    } else {
        porcent = (100 + porcent) / 100
    }
    var data = {
        tarifaClienteLinea: {
            grupoArticuloId: vm.sgrupoArticuloId(),
            porcentaje: porcent,
            tarifaClienteId: vm.tarifaClienteId()
        }
    }

    return data
}

var mostrarMensajeTarifaNueva = function () {
    var mens = "Introduzca las líneas de la nueva tarifaCliente en el apartado correspondiente";
    mensNormal(mens);
}

var mostrarMensajeArticuloRepetido = function () {
    var mens = "La unidad constructiva seleccionada ya se ancuentra incluida en esta tarifaCliente";
    mensNormal(mens);
    loadArticulos();
}

//funciones relacionadas con la copia de tarifas

function copiarTarifa() {
    if(!datosOKNuevoNombre()) return;
    var data = {
        tarifaCliente: {
            "tarifaClienteId": 0,
            "nombre": vm.nuevoNombre()
        }
    }

    llamadaAjax("POST", "/api/tarifas_cliente" , data, function (err, data) {
        if (err) return;
        var data2 = {
            tarifaCliente: {
                "tarifaClienteId": vm.tarifaClienteId(),
                "nuevaTarifaClienteId": data.tarifaClienteId,
                "tipoProfesionalId": vm.stipoProfesionalId()
            }
        }
        llamadaAjax("POST", "/api/tarifas_cliente/copia/tarifa/cliente/nombre" , data2, function (err, data) {
            if (err) return;
            $('#modalCopia').modal('hide');
            window.open("TarifaClienteGeneral.html", '_self');
        });
        
    });
}

function datosOKNuevoNombre() {
    $('#frmTarifa').validate({
        rules: {
            
            txtNuevoNombre: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
           
            txNuevoNombre: {
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