/*-------------------------------------------------------------------------- 
tarifaProveedorDetalle.js
Funciones js par la página tarifaProveedorDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var tarifaProveedorId = 0;
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

    $('#frmPorcentaje').submit(function(){
        return false;
    });


    

    // select2 things
    $("#cmbArticulos").select2(select2Spanish());
    loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        if (e.added) cambioArticulo(e.added.id);
    });

    $("#cmbTiposProfesional").select2(select2Spanish());
    loadTiposProfesional(0);
    $("#cmbTiposProfesional").select2().on('change', function (e) {
        if (e.val) cambioTipoProfesional(e.val);
    });


    
    $('#txtPorcent').focus( function () {
        $('#txtPorcent').val('');
    });
    
    initTablaTarifasProveedorLineas();
   

    tarifaProveedorId = gup('tarifaProveedorId');
    cmd = gup("cmd");
    

    if (tarifaProveedorId != 0) {
        // caso edicion
        
        vm.porcent(0);
        llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_proveedor/" + tarifaProveedorId, null, function (err, data) {
            if (err) return;
            loadData(data);
            loadLineasTarifaProveedor(data.tarifaProveedorId);
        })
    } else {
        // caso alta
        vm.tarifaProveedorId(0);
       
        $("#lineastarifa").hide();
        $('#lineasCapitulos').hide();
        //$('#btnLineasCapitulos').hide();
        document.title = "NUEVA TARIFA";
       
    }
}

function admData() {
    var self = this;
    self.tarifaProveedorId = ko.observable();
    self.nombre = ko.observable();
    self.tipoProfesional = ko.observable();
  
    

    // -- Valores para las líneas
    self.tarifaProveedorLineaId = ko.observable();
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
    self.porcent = ko.observable();
    
}

function loadData(data) {
    vm.tarifaProveedorId(data.tarifaProveedorId);
    vm.nombre(data.nombre);
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
    var url = myconfig.apiUrl + "/api/tarifas_proveedor";
    var returnUrl = "tarifaProveedorDetalle.html?cmd=nueva&tarifaProveedorId=";
    // caso modificación
    if (tarifaProveedorId != 0) {
        verb = "PUT";
        url = myconfig.apiUrl + "/api/tarifas_proveedor/" + tarifaProveedorId;
        returnUrl = "TarifaProveedorGeneral.html?tarifaProveedorId=";
    }

    llamadaAjax(verb, url, data, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.tarifaProveedorId();
        
            window.open(returnUrl, '_self');
        
    });
}

var generarTarifaDb = function () {
    var data = {
        tarifaProveedor: {
            "tarifaProveedorId": vm.tarifaProveedorId(),
            "nombre": vm.nombre()
        }
    };
    return data;
}

function salir() {
    var mf = function () {
        
            window.open("TarifaProveedorGeneral.html", '_self');
        
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
    vm.tarifaProveedorLineaId(0);
    vm.precioUnitario(null);
    vm.tipoProfesional(null);
    
    loadArticulos();
}


function aceptarLinea() {
    if (!datosOKLineas()) {
        return;
    }
    var data = {
        tarifaProveedorLinea: {
            tarifaProveedorLineaId: vm.tarifaProveedorLineaId(),
            tarifaProveedorId: vm.tarifaProveedorId(),
            articuloId: vm.sarticuloId(),
            precioUnitario:  vm.precioUnitario()
        }
    }
    //compruebaArticuloRepetido en misma tarifaProveedor
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/tarifas_proveedor/lineas";
                if (lineaEnEdicion) {
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/tarifas_proveedor/lineas/" + vm.tarifaProveedorLineaId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalLinea').modal('hide');
                    llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_proveedor/" + data.tarifaProveedorId, null, function (err, data) {
                        loadData(data);
                        loadLineasTarifaProveedor(data.tarifaProveedorId);
                       
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
                required: "Debe dar una unidad constructiva asociada a la linea de tarifaProveedor"
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



function initTablaTarifasProveedorLineas() {
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
        columns: [{
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
            data: "tarifaProveedorLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteTarifaProveedorLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalLinea' onclick='editTarifaProveedorLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    vm.tarifaProveedorLineaId(data.tarifaProveedorLineaId);
    vm.articuloId(data.articuloId);
    vm.precioUnitario(data.precioUnitario);
    //
    loadArticulos(data.articuloId);
}



function loadTablatarifaProveedorLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnCopiar').hide();
        $('#btnPorcentaje').hide();
        $('#btnDeleteTipo').hide();
    }
    dt.fnClearTable();
    if (data != null){
        dt.fnAddData(data);
        $('#btnCopiar').show();
        $('#btnPorcentaje').show();
        $('#btnDeleteTipo').show();
    }
    dt.fnDraw();
}


function  loadLineasTarifaProveedor(id) {
    llamadaAjax("GET", "/api/tarifas_proveedor/lineas/" + id, null, function (err, data) {
        if (err) return;
        loadTablatarifaProveedorLineas(data);
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

function cambioArticulo(articuloId) {
    if (!articuloId) return;
    llamadaAjax("GET", "/api/articulos/" + articuloId, null, function (err, data) {
        vm.precioUnitario(data.precioUnitario);
        loadProfesion(articuloId);
    });
}


function editTarifaProveedorLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/tarifas_proveedor/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLinea(data[0]);
    });
}

function deleteTarifaProveedorLinea(tarifaProveedorId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        var data = {
            tarifaProveedorLinea: {
                tarifaProveedorId: vm.tarifaProveedorId()
            }
        };
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/tarifas_proveedor/lineas/" + tarifaProveedorId, data, function (err, data) {
            if (err) return;
            /*llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_proveedor/" + vm.tarifaProveedorId(), null, function (err, data) {
                if (err) return;
                loadData(data);
                loadLineasTarifaProveedor(data.tarifaProveedorId);
            });*/
            cambioTipoProfesional(vm.elegidosTiposProfesional());
        });
    }, function () {
        // cancelar no hace nada
    });
}


function cambioTipoProfesional(tiposProfesionales) {
    var tipos = [];
    var method = "GET"
    var url = "/api/tarifas_proveedor/lineas/" + vm.tarifaProveedorId();
    if(tiposProfesionales.length > 0) {
        method = "POST"
        tiposProfesionales.forEach(e => {
            e = parseInt(e);
            tipos.push(e);
        });
    }
    llamadaAjax(method, url, tipos, function (err, data) {
        if(err) return;
        loadTablatarifaProveedorLineas(data)
    });
}

function loadTiposProfesional(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_profesional",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposProfesional = [{ tipoProfesionalId: null, nombre: "" }].concat(data);
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
    var url = "/api/tarifas_proveedor/lineas/multiples/";

    if (vm.sgrupoArticuloId() == 0) {
        url = "/api/tarifas_proveedor/lineas/multiples/todos";
    }
    
    llamadaAjax("POST", myconfig.apiUrl + url , data, function (err, data) {
        llamadaAjax("GET", myconfig.apiUrl + "/api/tarifas_proveedor/" + data.tarifaProveedorId, null, function (err, data) {
            if(err) return;
            $('#modalTarifasGrupos').modal('hide');
            loadData(data);
            loadLineasTarifaProveedor(data.tarifaProveedorId);
        });
    });
}


var mostrarMensajeTarifaNueva = function () {
    var mens = "Introduzca las líneas de la nueva tarifaProveedor en el apartado correspondiente";
    mensNormal(mens);
}

var mostrarMensajeArticuloRepetido = function () {
    var mens = "La unidad constructiva seleccionada ya se ancuentra incluida en esta tarifaProveedor";
    mensNormal(mens);
    loadArticulos();
}

//funciones relacionadas con la copia de tarifas

function copiarTarifa() {
    if(!datosOKNuevoNombre()) return;
    var data = {
        tarifaProveedor: {
            "tarifaProveedorId": 0,
            "nombre": vm.nuevoNombre()
        }
    }

    llamadaAjax("POST", "/api/tarifas_proveedor" , data, function (err, data) {
        if (err) return;
        var data2 = {
            tarifaProveedor: {
                "tarifaProveedorId": vm.tarifaProveedorId(),
                "nuevaTarifaProveedorId": data.tarifaProveedorId,
                "tiposProfesionalesId": vm.elegidosTiposProfesional()
            }
        }
        llamadaAjax("POST", "/api/tarifas_proveedor/copia/tarifa/proveedor/nombre" , data2, function (err, data) {
            if (err) return;
            $('#modalCopia').modal('hide');
            window.open("TarifaProveedorGeneral.html", '_self');
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

//FUNCIONES DEL MODAL DE INCREMENTO/DECREMENTO PROCENTAJE

function aplicarPorcentaje() {
    if(!datosOKPorcent()) return;
    var porcent = vm.porcent() * 0.01
    var data = {
        
        tiposProfesionales: vm.elegidosTiposProfesional()
    
    }
    var url = "/api/tarifas_proveedor/aplicar/porcentaje/precio/" + porcent  + "/" + tarifaProveedorId;
    var returnUrl = "TarifaProveedorGeneral.html?tarifaProveedorId="+tarifaProveedorId;
    llamadaAjax("PUT", url, data, function (err, data) {
        if(err) return;
        window.open(returnUrl, '_self');
        
    });
}

function datosOKPorcent() {
    $('#frmPorcentaje').validate({
        rules: {
            txtPorcent: {
                required: true,
            }
        },
        // Messages for form validation
        messages: {
            
            txtPorcent: {
                required: "Debe introducir un porcentaje"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmPorcentaje').valid();
}

function deleteTarifaProveedorTipoProfesional() {
   
    var mens = "<strong>¡¡ Atención !! Se borrán de la tarifa todas las lineas con tipo profesional seleccionado en el desplegable.</strong></li>";
    mens += " </br><strong>Si no hay nada seleccionado se borrarán todas.</strong>"
    mens += " </br><strong>¿ Desea Continuar ?.</strong>"
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Cancelar][Borrar lineas]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Borrar lineas") {
            var data = { 
                
                "tiposProfesionales": vm.elegidosTiposProfesional()
                
            };
            llamadaAjax("DELETE", myconfig.apiUrl +"/api/tarifas_proveedor/Borrar/por/tipos/" + tarifaProveedorId, data,function (err) {
                if (err) return;
                loadLineasTarifaProveedor(tarifaProveedorId);
                loadTiposProfesional(0);
            });
        }
        
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}