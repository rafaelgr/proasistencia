﻿/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var facturaId;
var usuario;
var facturasCero = [];

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
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

     //Recuperamos el departamento de trabajo
     recuperaDepartamento(function(err, data) {
        if(err) return;
        //
        $('#btnBuscar').click(buscarFacturas());
        $('#btnAlta').click(contabilizarFacturas());
        $('#btnDownload').click(buscarFicheros());
        $('#frmBuscar').submit(function () {
            return false
        });
        // ocultamos el botón de alta hasta que se haya producido una búsqueda
        $("#btnAlta").hide();

        initTablaFacturas();
        // comprobamos parámetros
        facturaId = gup('FacturaId');

        // select2 things
        $("#cmbDepartamentosTrabajo").select2(select2Spanish());
      
        //Evento de marcar/desmarcar todos los checks
        $('#checkMain').click(
            function(e){
                if($('#checkMain').prop('checked')) {
                    $('.checkAll').prop('checked', true);
                    updateAll(true);
                } else {
                    $('.checkAll').prop('checked', false);
                    updateAll(false);
                }
            }
        );
    });

    
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
        columnDefs: [{
            "width": "20%",
            "targets": 0
        }],
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
            data: "facturaId",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAll">', data, data);
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
            data: "total",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "formaPago"
        }, {
            data: "observaciones"
        }, {
            data: "facturaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
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

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.facturaId;
        if (v.sel == 1) {
            $(field).attr('checked', false);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                factura: {
                    facturaId: v.facturaId,
                    empresaId: v.empresaId,
                    clienteId: v.clienteId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    sel: 0
                }
            };
            if (this.checked) {
                data.factura.sel = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/facturas/%s', myconfig.apiUrl, v.facturaId);
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

function buscarFacturas() {
    var mf = function () {
        if (!datosOK()) return;
        facturasCero = [];
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturas/emision/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/" + vm.sdepartamentoId()+ "/" + usuario.usuarioId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                //comprobamos si hay facturas a cero para mostrar mensaje de advertencia
                if(data) {
                    if (data.error) {
                        var cuentas = JSON.stringify(data.error);

                        // Insertar salto de línea antes de cada "cuentacontable" y reemplazar los caracteres innecesarios
                        cuentas = cuentas.replace(/cuentacontable/g, "\r\ncuentacontable")
                                        .replace(/cuentaVentas/g, "\r\ncuentaVentas")
                                        .replace(/[\]\[{()}"]/g, '')  // Eliminar los corchetes y comillas
                                        //.replace(/[_\s]/g, '-'); // Reemplazar guiones bajos y espacios por guiones

                        // Mensaje de error
                        mensError("Falta la cuenta contable en las siguientes facturas " + cuentas + ". Se ha generado un archivo de texto con esta información.");

                        // Crear un archivo de texto con el contenido formateado
                        var blob = new Blob([cuentas], { type: "text/plain;charset=utf-8" });

                        // Crear un enlace para descargar el archivo
                        var enlace = document.createElement("a");
                        enlace.href = URL.createObjectURL(blob);
                        enlace.download = "archivo_generado.txt";

                        // Agregar el enlace al DOM, hacer clic y luego eliminarlo
                        document.body.appendChild(enlace);
                        enlace.click();
                        document.body.removeChild(enlace);
                        return;

                    }             
                    if(data.length > 0) {
                        loadTablaFacturas(data);
                        // mostramos el botón de alta
                        $("#btnAlta").show();
                        $('#checkMain').prop('checked', false);
                        for(var i = 0; i < data.length; i++) {
                            if(data[i].total == 0) {
                                facturasCero.push(data[i].vNum);
                            }
                        }
                        if(facturasCero.length > 0) mensError("las siguentes facturas tienen el importe a cero\n" + facturasCero);
                    }
                }

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
    var mf = function () {
        // de momento nada
        if (!datosOK()) return;
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/facturas/contabilizar/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha())+ "/" + vm.sdepartamentoId()+ "/" + usuario.usuarioId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if(data != "OK" ) {
                    var cuentas = JSON.stringify(data);
                    cuentas = cuentas.replace(/}/g, "<br\>").replace(/[\]\[{()}"]/g, '').replace(/[_\s]/g, '-');
                    mensError("Las Facturas siguientes con las cuentas contables  " + cuentas + "  no han sido contabilizadas, las cuentas contables no existen.");
                        var fn = buscarFacturas();
                        fn();
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
    };
    return mf;
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
                facturaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturas/" + id,
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

function editFactura(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaDetalle.html?FacturaId=" + id;
    window.open(url, '_new');
}

function cargarFacturas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: facturaId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturas/" + facturaId,
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
                url: myconfig.apiUrl + "/api/facturas",
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
        url: myconfig.apiUrl + "/api/informes/facturas/" + id,
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

function updateAll(opcion) {
    var datos = null;
    var sel = 0;
    var tb = $('#dt_factura').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(opcion)  sel = 1
    
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
            var data = {
                factura: {
                    facturaId: datos[i].facturaId,
                    empresaId: datos[i].empresaId,
                    clienteId: datos[i].clienteId,
                    fecha: moment(datos[i].fecha).format('YYYY-MM-DD'),
                    sel: sel
            }
        };
                
               
        var url = "", type = "";
         // updating record
         var type = "PUT";
         var url = sprintf('%s/api/facturas/%s', myconfig.apiUrl, datos[i].facturaId);
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
        }
    }
}
