/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;
var facturaId;
var clienteId = 0;
var comercialId = 0;
var empresaId = 0;
var departamentoId = 0;
var usuario;
var facturas;
var mantenedorId = 0;
var contratoId = 0;

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
        
    });
    
    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
        
        ajustaDepartamentos(data);

        initAutoCliente();
        $('#cmbDepartamentosTrabajo').select2();

        $('#cmbAgentes').select2();
        loadComerciales();


        $('#cmbEmpresas').select2();
        loadEmpresas();

        initTablaFacturas();

        // comprobamos parámetros
        facturaId = gup('FacturaId');

    });
    //
    $('#btnBuscar').click(buscarFacturas());
    $('#btnAlta').click(enviarCorreos());
    $('#btnDownload').click(buscarFicheros());
    $('#frmBuscar').submit(function () {
        return false
    });

    // ocultamos el botón de alta hasta que se haya producido una búsqueda
    $("#btnAlta").hide();

    //
    var socket = io.connect('/');
    socket.on('message', function (data) {
        alert(data);
    });
    socket.on('progress', function (data) {
        vm.titleReg(data.titleReg);
        vm.numReg(data.numReg);
        vm.totalReg(data.totalReg);
        // calculate the percentage of upload completed
        var percentComplete = vm.numReg() / vm.totalReg();
        percentComplete = parseInt(percentComplete * 100);
        // update the Bootstrap progress bar with the new percentage
        $('.progress-bar').text(percentComplete + '%');
        $('.progress-bar').width(percentComplete + '%');
        // once the upload reaches 100%, set the progress bar text to done
        if (percentComplete === 100) {
            $('.progress-bar').html('Proceso terminado');
        }
    });

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
    

}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    self.titleReg = ko.observable();
    self.numReg = ko.observable();
    self.totalReg = ko.observable();
    self.cliente = ko.observable();


    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    self.sComercialId = ko.observable();

    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidasEmpresas = ko.observableArray([]);
    self.sEmpresaId = ko.observable();

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
        "columnDefs": [ {
            "targets": 0,
            "orderable": false,
            "width": "20%"
            } ],
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

//FUNCIÓN DE AUTOCOMPLETE
var initAutoCliente = function () {
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            llamadaAjax('GET', "/api/clientes/clientes_activos/?nombre=" + request.term, null, function (err, data) {
                clienteId = 0;
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.clienteId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.cliente(ui.item.value);
            clienteId = ui.item.id;
        }
    });
}


function loadComerciales(id){
    llamadaAjax('GET', "/api/comerciales", null, function (err, data) {
        if (err) return
        var comerciales = [{
            comercialId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesComerciales(comerciales);
        $("#cmbComerciales").val([id]).trigger('change');
    });
}

function loadEmpresas(id){
    llamadaAjax('GET', "/api/empresas", null, function (err, data) {
        if (err) return
        var empresas = [{
            empresaId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}

function updateAll(opcion) {
    var datos = null;
    var sel = 0;
    var tb = $('#dt_factura').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(opcion) sel = 1
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




function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    facturas = data;
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.facturaId;
        if (v.sel == 1) {
            $(field).attr('checked', true);
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

function buscarClientes(done){
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/clientes/todosClientes",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            //loadComboClientes(data);
            return done(data, status);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function buscarFacturas() {
    var mf = function () {
        if (!datosOK()) return;
        comercialId = vm.sComercialId();
        empresaId = vm.sEmpresaId();
        departamentoId = vm.sdepartamentoId();

        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturas/correo/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/" + clienteId + "/" + mantenedorId +"/"+ comercialId  +"/"+ contratoId +"/"+ empresaId +"/"+ departamentoId +"/"+ usuario.usuarioId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaFacturas(data);
                // mostramos el botén de alta
                $("#btnAlta").show();
                $('#checkMain').prop('checked', false);
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
        window.open(url, '_blank');
    };
    return mf;
}

function contabilizarFacturas() {
    var mf = function () {
        // de momento nada
        if (!datosOK()) return;
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/facturas/contabilizar/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // borramos datos
                $("#btnAlta").hide();
                mensNormal('El fichero ' + data + ' para contabilización ya está preparado');
                vm.desdeFecha(null);
                vm.hastaFecha(null);
                loadTablaFacturas(null);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function ajustaDepartamentos(data) {
    //ELIMINAMOS TODOS LOS DEPARTAMENTOS EXECTO OBRAS DEL COMBO
    //var id = $("#cmbDepartamentosTrabajo").val();//departamento de trabajo
     for (var i = 0; i < data.length; i++) {
            if (data[i].departamentoId != 7) {
                data.splice(i, 1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
    }
    console.log(data);
    var departamentos = [{
        departamentoId: null,
        nombre: ""
    }].concat(data);
    vm.posiblesDepartamentos(departamentos);
 
    $("#cmbDepartamentosTrabajo").val([7]).trigger('change');
    vm.sdepartamentoId(7);
    vm.departamentoId(7);
}

function enviarCorreos() {
    var mf = function () {
        if (!datosOK()) return;
        $('#progress').show();
        var url = myconfig.apiUrl + "/api/facturas/preparar-correos/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/" + clienteId + "/" + mantenedorId + "/" +comercialId + "/" +contratoId + "/" + empresaId + "/" + departamentoId + "/" + usuario.usuarioId;
        llamadaAjax("POST", url, null, function (err, data) {
            if (err) {
                $('#progress').hide();
                return;
            }
            url = myconfig.apiUrl + "/api/facturas/enviar-correos/reparaciones/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha());
            llamadaAjax("POST", url, data, function (err, data) {
                if (err) {
                    
                    $('#progress').hide();
                    return;
                }
                $("#btnAlta").hide();
                $('#progress').hide();
                $("#resEnvio").html(data);
                $("#modalResultado").modal('show');
            });

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
    window.open(url, '_blank');
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