/*-------------------------------------------------------------------------- 
articuloDetalle.js
Funciones js par la página ArticuloDetalle.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var empId = 0;
var dataTarifas;

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
    $("#frmArticulo").submit(function () {
        return false;
    });

    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();

    $("#cmbGruposArticulo").select2(select2Spanish());
    loadGruposArticulo();

    $("#cmbUnidades").select2(select2Spanish());
    loadUnidades()
    
    $("#cmbProfesiones").select2(select2Spanish());
    loadTiposProfesionales();;

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    loadDepartamentos();

    $("#txtCoste").blur(calculaPrecioVenta);

    

    initTablaTarifas()
    
    empId = gup('ArticuloId');
    if (empId != 0) {
        var data = {
            articuloId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/articulos/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                //loadTarifas(data.articuloId);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.articuloId(0);
    }
}

function admData() {
    var self = this;
    self.articuloId = ko.observable();
    self.nombre = ko.observable();
    self.precioUnitario = ko.observable();
    self.codigoBarras = ko.observable();
    self.codigoReparacion = ko.observable();
    self.descripcion = ko.observable();
    self.varios = ko.observable();
    self.coste = ko.observable();
    self.porcentaje = ko.observable();
    self.precioVenta = ko.observable();
    //
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);
    //
    self.sgrupoArticuloId = ko.observable();
    //
    self.posiblesGruposArticulo = ko.observableArray([]);
    self.elegidosGruposArticulo = ko.observableArray([]);
    //
    self.sunidadId = ko.observable();
    //
    self.posiblesUnidades = ko.observableArray([]);
    self.elegidosUnidades = ko.observableArray([]);
    //
    self.stipoProfesionalId = ko.observable();
    //
    self.posiblesTiposProfesionales = ko.observableArray([]);
    self.elegidosTiposProfesionales = ko.observableArray([]);

    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);


}

function loadData(data) {
    vm.articuloId(data.articuloId);
    vm.nombre(data.nombre);
    vm.precioUnitario(data.precioUnitario);
    vm.codigoBarras(data.codigoBarras);
    vm.codigoReparacion(data.codigoReparacion);
    vm.descripcion(data.descripcion);
    vm.varios(data.varios);
    vm.coste(data.coste);
    vm.porcentaje(data.porcentaje);
    vm.precioVenta(data.precioVenta);
    loadTiposIva(data.tipoIvaId);
    loadGruposArticulo(data.grupoArticuloId);
    loadUnidades(data.unidadId);
    loadTiposProfesionales(data.tipoProfesionalId);
    loadDepartamentos(data.departamentoId);
}

function datosOK() {
    $('#frmArticulo').validate({
        rules: {
            cmbTiposIva: {
                required: true
            },
            cmbGruposArticulo: {
                required: true
            },
            cmbUnidades: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtPrecioUnitario: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbTiposIva: {
                required: "Debe elegir un tipo de IVA"
            },
            cmbGruposArticulo: {
                required: "Debe elegir un capítulo"
            },
            cmbUnidades: {
                required: "Debe elegir una unidad"
            },
            txtNombre: {
                required: "Debe dar un nombre"
            },
            txtPrecioUnitario: {
                required: "Introduzca un precio"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmArticulo").validate().settings;
    return $('#frmArticulo').valid();
}


function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            articulo: {
                "articuloId": vm.articuloId(),
                "tipoIvaId": vm.stipoIvaId(),
                "nombre": vm.nombre(),
                "precioUnitario": vm.precioUnitario(),
                "codigoBarras": vm.codigoBarras(),
                "codigoReparacion" : vm.codigoReparacion(),
                "descripcion": vm.descripcion(),
                "grupoArticuloId": vm.sgrupoArticuloId(),
                "unidadId": vm.sunidadId(),
                "tipoProfesionalId": vm.stipoProfesionalId(),
                "varios": vm.varios(),
                "departamentoId": vm.sdepartamentoId(),
                "coste": vm.coste(),
                "porcentaje": vm.porcentaje(),
                "precioVenta": vm.precioVenta()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/articulos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ArticuloGeneral.html?ArticuloId=" + vm.articuloId();
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
                url: myconfig.apiUrl + "/api/articulos/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ArticuloGeneral.html?ArticuloId=" + vm.articuloId();
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
        var url = "ArticuloGeneral.html";
        window.open(url, '_self');
    }
    return mf;
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
            $("#cmbTiposIva").val([id]).trigger('change');
        },
                        error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
    });
}


function loadGruposArticulo(id) {
    $.ajax({
        type: "GET",
        url: "/api/grupo_articulo",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var grupos = [{ grupoArticuloId: 0, nombre: "" }].concat(data);
            vm.posiblesGruposArticulo(grupos);
            $("#cmbGruposArticulo").val([id]).trigger('change');
        },
                        error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
    });
}


function loadUnidades(id) {
    $.ajax({
        type: "GET",
        url: "/api/unidades",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var unidades = [{ unidadId: 0, nombre: "" }].concat(data);
            vm.posiblesUnidades(unidades);
            $("#cmbUnidades").val([id]).trigger('change');
        },
                        error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
    });
}

function loadTiposProfesionales(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_profesional",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposProfesional = [{ tipoProfesionalId: null, nombre: "" }].concat(data);
            vm.posiblesTiposProfesionales(tiposProfesional);
            $("#cmbProfesiones").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/", null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        if(departamentoId) {
            vm.sdepartamentoId(departamentoId);
        }
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}


/*----------------------------------------------------------
    Funciones relacionadas con las lines de tarifas
 -----------------------------------------------------------*/

function initTablaTarifas() {
    tablaCarro = $('#dt_tarifas').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_tarifas'), breakpointDefinition);
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
        data: dataTarifas,
        columns: [{
            data: "nombre"
        }, {
            data: "nombreGrupo",
        }, {
            data: "precio",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }]
    });
}

function loadTablaTarifas(data) {
    var dt = $('#dt_tarifas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data) dt.fnAddData(data);
    dt.fnDraw();
}

function loadTarifas(id) {
    llamadaAjax('GET', "/api/articulos/articulo/asociado/tarifa/informacion/" + id, null, function (err, data) {
        if (err) return;
        loadTablaTarifas(data);
    });
}

var calculaPrecioVenta = function () {
    var porcen = parseFloat(vm.porcentaje());
    var cost = parseFloat(vm.coste());
    porcen = porcen / 100;
    vm.precioVenta(cost + (cost*porcen));
  
}
