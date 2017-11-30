/*-------------------------------------------------------------------------- 
ProveedorGeneral.js
Funciones js par la página ProveedorGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataProveedores;
var ProveedorId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#btnBuscar').click(buscarProveedores());
    $('#btnAlta').click(crearProveedor());
    $('#frmBuscar').submit(function () {
        return false
    });
    $('#btnBorrar').click(borrar());
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarProveedores();
    //});
    //
    initTablaProveedores();
    // comprobamos parámetros
    proveedorId = gup('ProveedorId');
    var bus = getCookie("buscador_proveedores");
    if (bus) {
        var b = JSON.parse(bus);
       vm.bProveedorId(b.ProveedorId);
        vm.bNif(b.Nif);
        vm.bNombre(b.Nombre);
        vm.bTelefono(b.Telefono);
        vm.bDireccion(b.Direccion);
        buscarProveedores()();
    } else {
        if (proveedorId !== '') {
            // cargar la tabla con un único valor que es el que corresponde.
            var data = {
                id: proveedorId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/proveedores/" + proveedorId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    var data2 = [data];
                    loadTablaProveedores(data2);
                },
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    }
}

function admData() {
    var self = this;
    self.bNombre = ko.observable();
    self.bProveedorId = ko.observable();
    self.bNif = ko.observable();
    self.bDireccion = ko.observable();
    self.bTelefono = ko.observable();
}

function initTablaProveedores() {
    tablaCarro = $('#dt_proveedor').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_proveedor'), breakpointDefinition);
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
        data: dataProveedores,
        columns: [{
            data: "activa",
            render: function (data, type, row) {
                var html = "<i class='fa fa-check'></i>";
                if (data == 0) {
                    html = "<i class='fa fa-ban'></i>";
                }
                return html;
            }
        }, {
            data: "proveedorId"
        }, {
            data: "nombre"
        }, {
            data: "direccion"
        }, {
            data: "nif"
        }, {
            data: "telefono"
        }, {
            data: "correo"
        }, {
            data: "proveedorId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteProveedor(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editProveedor(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {

    $('#frmBuscar').validate({
        rules: {

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

function loadTablaProveedores(data) {
    var dt = $('#dt_proveedor').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbProveedor").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbProveedor").show();
    }
}

function buscarProveedores() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        // enviar la consulta por la red (AJAX)
        var aBuscar = "?i=6"
        if (vm.bNombre()) aBuscar += "&Nombre=" + vm.bNombre();
        if (vm.bNif()) aBuscar += "&Nif=" + vm.bNif();
        if (vm.bDireccion()) aBuscar += "&Direccion=" + vm.bDireccion();
        if (vm.bTelefono()) aBuscar += "&Telefono=" + vm.bTelefono();
        if (vm.bProveedorId()) aBuscar += "&Codigo=" +vm.bProveedorId();
        b = {
            proveedorId:vm.bProveedorId(),
            Nombre: vm.bNombre(),
            Nif: vm.bNif(),
            Direccion: vm.bDireccion(),
            Telefono: vm.bTelefono()
        };
        setCookie("buscador_proveedores", JSON.stringify(b), 1);
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/proveedores/buscar/" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaProveedores(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function crearProveedor() {
    var mf = function () {
        var url = "ProveedorDetalle.html?proveedorId=0";
        window.open(url, '_self');
    };
    return mf;
}

function borrar() {
    var mf = function () {
       vm.bProveedorId(null);
        vm.bNif(null);
        vm.bNombre(null);
        vm.bTelefono(null);
        vm.bDireccion(null);
        deleteCookie("buscador_proveedores");
        loadTablaProveedores(null);
    };
    return mf;
}

function deleteProveedor(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                proveedorId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/proveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarProveedores();
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

function editProveedor(id) {
    // hay que abrir la página de detalle de Proveedor
    // pasando en la url ese ID
    var url = "ProveedorDetalle.html?proveedorId=" + id;
    window.open(url, '_self');
}


