/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacturaGeneral.html
PROVEEDORES
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var facproveId;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var numIban = [];


datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    usuario = recuperarIdUsuario();
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

    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
        
    });
    //
    $('#btnBuscar').click(buscarFacturas());
    $('#btnAlta').click(muestraMensNoIBAN());
    $('#btnDownload').click(buscarFicheros());
    $('#frmBuscar').submit(function () {
        return false
    });
    // ocultamos el botón de alta hasta que se haya producido una búsqueda
    $("#btnAlta").hide();

    initTablaFacturas();
    // comprobamos parámetros
    facproveId = gup('FacturaId');

    
    // select2 things
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    //loadDepartamentos();
}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
     //
     self.departamentoId = ko.observable();
     self.sdepartamentoId = ko.observable();
     //
     self.posiblesDepartamentos = ko.observableArray([]);
     self.elegidosDepartamentos = ko.observableArray([]);
}

function initTablaFacturas() {
    tablaCarro = $('#dt_factura').dataTable({
        autoWidth: true,
        paging: false,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_factura'), breakpointDefinition);
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
        data: dataFacturas,
        columns: [{
            data: "facproveId",
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
            data: "dirTrabajo"
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
            data: "formaPago"
        }, {
            data: "observaciones"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                /*var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";*/
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 /*+ "" + bt3*/ + "</div>";
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

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.facproveId;
        if (v.sel == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                facprove: {
                    facproveId: v.facproveId,
                    empresaId: v.empresaId,
                    proveedorId: v.proveedorId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    sel: 0
                }
            };
            if (this.checked) {
                data.facprove.sel = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/facturasProveedores/%s', myconfig.apiUrl, v.facproveId);
            var data2 = [];
            data2.push(data);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data2),
                success: function (data, status) {

                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        });
    });
}

function buscarFacturas() {
    var mf = function () {
        var i;
        var datos = {};
        numIban = []//reiniciamos el array donde guardamos los proveedores sin IBAN
        var contador = 0;
        if (!datosOK()) return;
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/emision2/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha())+ "/" + vm.sdepartamentoId()+ "/" + usuario,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                data.forEach(function (f) {
                    contador = 0;
                    if(!f.IBAN) {// comprovamos si el proveedor de la factura tiene IBAN para añadirlo a una lista
                        if(numIban.length == 0) {
                            datos = {
                                nombre: f.emisorNombre,
                                id: f.proveedorId
                            }
                            numIban.push(datos);
                            datos = {};
                        } else {// comprobamos que el proveedor no exista ya en lista y si es así lo añadimos.
                            for(i = 0; i < numIban.length; i++) {
                                if(numIban[i].id == f.proveedorId) {//le sumas una unidad al contador si se encunetra una coincidencia en la lists
                                    contador ++;
                                }
                            };
                            if(contador == 0) {//si el objeto no está en la lista se añade
                                datos = {
                                    nombre: f.emisorNombre,
                                    id: f.proveedorId
                                }
                                numIban.push(datos);
                            }
                            datos = {};
                        }
                    }
                });
                loadTablaFacturas(data);
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

function buscarFicheros() {
    var mf = function () {
        var url = "ficheros/contabilidad";
        window.open(url, '_new');
    };
    return mf;
}
function contabilizarFacturas() {
 
        // de momento nada
        if (!datosOK()) return;
        //comprovamos si hay algún proveedor sin iban
        
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/facturasProveedores/contabilizar/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha())+ "/" + vm.sdepartamentoId()+ "/" + usuario,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if(data[0].length > 0  || data[1].length > 0) {
                    if(data[1]) {
                        if(data[1].length > 0) {
                            var cuentas = JSON.stringify(data[1]);

                            cuentas = cuentas.replace(/}/g, "<br\>").replace(/[\]\[{()}"]/g, '').replace(/[_\s]/g, '-');
                            mensError("Las Facturas siguientes con las cuentas contables  " + cuentas + "  no han sido contabilizadas, las cuentas contable de compras no existen.");
                            var fn = buscarFacturas();
                            fn();
                        }
                    }
                    if(data[0].length > 0) {
                        //facturas sin contabilizar, mantenemos datos, mostramos mensaje de error y actualizamos tabla
                        var lista = data[0].toString();
                        mensError("Las Facturas con numero " + lista + "  no han sido contabilizadas, revise el reparto de las empresas serviciadas.");
                        var fn = buscarFacturas();
                        fn();
                    }
                } else {
                    // borramos datos
                    $("#btnAlta").hide();
                    mensNormal('Las facturas han sido pasadas a contabilidad');
                    vm.desdeFecha(null);
                    vm.hastaFecha(null);
                    loadTablaFacturas(null);
                }
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
}

function deleteFactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                facproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarFacturas();
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


function muestraMensNoIBAN() {
    var mf = function () { 
        var lista = []
           // mensaje de confirmación
           numIban.forEach( function(f) {
                delete f.id;
                lista.push(f.nombre.toString());
           });
           var mens = "¿Los proveedores "+lista+" no tienen IBAN, desea continuiar";
           if(numIban.length > 0) {
               $.SmartMessageBox({
                   title: "<i class='fa fa-info'></i> Mensaje",
                   content: mens,
                   buttons: '[Aceptar][Cancelar]'
               }, function (ButtonPressed) {
                   if (ButtonPressed === "Aceptar") {
                           contabilizarFacturas();
                           lista = []
                       }
                   if (ButtonPressed === "Cancelar") {
                       // no hacemos nada
                       
                   }
               });
           } else {
               contabilizarFacturas();
               lista = []
           }
    }
    return mf;
}



function editFactura(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    window.open(url, '_new');
}

function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: 0, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}
    

function cargarFacturas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: facproveId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + facproveId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacturas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacturas(data);
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

function printFactura(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/facturasProveedores/" + id,
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