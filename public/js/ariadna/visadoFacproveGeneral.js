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
var dataContrato;
var facproveId;
var init = 0;
var visadas;
var registros;
var usuario;
var facturas;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
var url;
var vm = null;

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    datePickerSpanish(); // see comun.js
    //
    

    visadas = gup('visadas');

    if(visadas == 1) {
        $("#chkVisadas").prop( "checked", true );
        $('#btnAlta').hide();
        $('#checkMain').hide();
      }else {
        $("#chkVisadas").prop( "checked", false );
        $('#btnAlta').show();
        $('#checkMain').show();
      }
    $('#btnPrint').click(printGeneral);
    $('#btnAlta').click(visarFacturas);
    $('#btnBuscar').click(buscarVisadas)
   
    $('#frmBuscar').submit(function () {
        return false
    });

    //Evento de marcar/desmarcar todos los checks
    $('#checkMain').click(
        function(e){
            if($('#checkMain').prop('checked')) {
                $('.checkAll').prop('checked', true);
            } else {
                $('.checkAll').prop('checked', false);
            }
        }
    );

    

    $('#chkVisadas').change(function () {
        $('.ocultar').show();
        if(!$('#chkVisadas').prop('checked')) $('.ocultar').hide();
        //buscarVisadas()
    });

    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        buscarFacturas()();
    });

    vm = new admData();

    ko.applyBindings(vm);

       
    $("#cmbProveedores").select2(select2Spanish());

    $('.ocultar').hide();
   

    recuperaDepartamento(function(err, data) {
        if(err) return;
        initTablaFacturas();
        buscarFacturas()();
        loadProveedores();
        estableceFecha();
        // comprobamos parámetros
        facproveId = gup('FacturaId');
    });
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
    
} 

function initTablaFacturas() { 
    tablaCarro = $('#dt_factura').DataTable({
        paging: false,
        autoWidth: true,
        "bDestroy": true,
        "columnDefs": [ {
            "targets": 0,
            "width": "20%",
            "orderable": false
            } ],
            "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C >>",
            "oColVis": {
                "buttonText": "Mostrar / ocultar columnas"
            },
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
            width: '10%',
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAll">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data: "emisorNombre"
        },{
            data: "ref",
            render: function (data, type, row) {
                if(row.num > 1) return "Consultar manualmente";
                return data
            }
        },{
            data: "direccionTrabajo",
            render: function (data, type, row) {
                if(row.num > 1) return "Consultar manualmente";
                return data
            }

        }, {
            data: "receptorNombre"
        }, {
            data: "vNum"
        }, {
            data: "fecha_recepcion",
            render: function (data, type, row) {
                if(!data) return "";
                return moment(data).format('DD/MM/YYYY');
            }
        },{
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
        },{
            data: "impPorcen",
            render: function (data, type, row) {
                if(row.num > 1) return "Consultar manualmente";
                return numeral(data).format('0,0.00');
            }

        },{
            data: "costePorcen",
            render: function (data, type, row) {
                if(row.num > 1) return "Consultar manualmente";
                return numeral(data).format('0,0.00');
            }

        },{
            data: "benPorcen",
            render: function (data, type, row) {
                if(row.num > 1) return "Consultar manualmente";
                return numeral(data).format('0,0.00');
            }

        },{
            data: "numAnticipo"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-info' title='Contrato asociado' data-toggle='modal' data-target='#modalContrato' onclick='initModal(" + data + ");' title='Consulta de resultados de contrato'> <i class='fa fa-fw fa-files-o'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 +  "</div>";
                return html;
            }
        }]
    });

    tablaCarro.column(9).visible(false);
    tablaCarro.column(10).visible(false);
    tablaCarro.column(11).visible(false);
    tablaCarro.column(12).visible(false);
}


function loadProveedores() {
    llamadaAjax("GET", "/api/proveedores", null, function (err, data) {
        if (err) return;
        var proveedores = [{ proveedorId: 0, nombre: "" }].concat(data);
        vm.posiblesProveedores(proveedores);
        vm.proveedorId(0);
        vm.sproveedorId(0);
        $("#cmbProveedores").val([0]).trigger('change');
    });
}


function initModal(facproveId) {
    init++

    $('#modalContrato').on('hidden.bs.modal', function () {
        $('#modalContrato').off('show.bs.modal');
    });
    
    if(init == 1){
        $('#modalContrato').on('show.bs.modal', function (e) {
            initTablaContratos(facproveId);
        })
    }else {
        cargarContratos()(facproveId);
    }
}

function loadTablaFacturas(data) {
    facturas = data;
    $('#checkMain').prop('checked', false);//valor por defecto
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.facproveId;
        if (v.visada == 1) {
            $(field).attr('checked', true);
        }
        if(!$("#chkVisadas").prop( "checked" )) return;
        $('#btnAlta').hide();
        $('#checkMain').hide();
        $(field).change(function () {
          mensajeConfirmacion(this, v);
        });
    });
}

function mensajeConfirmacion(t, v) {
    // mensaje de confirmación
    var mens = "¿Realmente desa quitar la marca de visada?, la factura pasará a estar pendiente de visar?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var quantity = 0;
            var data = {
                facprove: {
                    facproveId: v.facproveId,
                    empresaId: v.empresaId,
                    proveedorId: v.proveedorId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    visada: 0
                }
            };
            if (this.checked) {
                data.facprove.visada = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/facturasProveedores/visadas/modificar/%s', myconfig.apiUrl, v.facproveId);
            var data2 = [];
            data2.push(data);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data2),
                success: function (data, status) {
                    if($("#chkVisadas").prop( "checked" )) {
                        vis = 1;
                      }else {
                          vis = 0;
                      }
                    var url = "VisadoFacproveGeneral.html?visadas="+ vis;
                    window.open(url, '_self');
                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
                    
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function buscarFacturas() {
    var mf = function () {
        
        var url;
        if($("#chkVisadas").prop( "checked" )) {
            url = "/api/facturasProveedores/visadas/facturas-proveedor/todas/usuario/logado/departamento/" + 1 + "/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + 0 + "/" + 0 +  "/" + 0;
          }
          else {
            $('#checkMain').prop('checked', false);
              url =  "/api/facturasProveedores/visadas/facturas-proveedor/todas/usuario/logado/departamento/"  + 0 + "/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + 0 + "/" + 0 +  "/" + 0;
            }
          
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                registros = data.length;
                loadTablaFacturas(data);
                // mostramos el botén de alta
                
                //$("#btnAlta").show();
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}




function initTablaContratos(facproveId) {
    tablaCarro = $('#dt_contrato').dataTable({
        
        autoWidth: true,
        paging: true,
        responsive: true,
        "bDestroy": true,
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
        data: dataContrato,
        columns: [{
            data: "referencia"
        }, {
            data: "empresa"
        }, {
            data: "estado",
            render: function (data, type, row) {
                if(data == 0) data = "Abierto";
                if (data == 1) data = "Cerrado";
                return data
            }
        }, {
            data: "ITC",
            width: "5%",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "pAgente",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "IA",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "ent",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "CT",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "BT",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "pBT",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "IMF",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "IAR",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        },{
            data: "INR",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }, {
            data: "CR",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        },{
            data: "BR",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        },{
            data: "pBR",
            render: function (data, type, row) {
                data = roundToTwo(data);
                return data
            }
        }]
    });
    if(init == 1){
        cargarContratos()(facproveId);
    }
}

function cargarContratos() {
    var mf = function (facproveId) {
        if (facproveId) {
            var data = null;
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/contratos/asociado/facprove/resultado/" + facproveId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaContratos(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    $('#modalContrato').modal('hide');
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    };
    return mf;
}

function loadTablaContratos(data) {
    var dt = $('#dt_contrato').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}




function editFactura(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    window.open(url, '_blank');
}



function printFactura(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if(data.ref){
                window.open("../../ficheros/facturas_proveedores/"+data.ref+".pdf","_blank");
            }else{
                var mens = "No hay registros que mostrar";
                $.SmartMessageBox({
                    title: "<i class='fa fa-info'></i> Mensaje",
                    content: mens,
                    buttons: '[Aceptar]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Aceptar") {
                        // no hacemos nada (no quiere borrar)
                    }
                });
            }
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

function visarFacturas() {
    mensajeConfirmacionVisar();
}

function mensajeConfirmacionVisar(t, v) {
    // mensaje de confirmación
    var mens = "¿Realmente desa visar las facturas seleccionadas?.";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var contador = 0;
            facturas.forEach(function (v) {
                contador++;
                var field = "#chk" + v.facproveId;
                if (!$(field).prop('checked'))  return;
                    var data = {
                        facprove: {
                            facproveId: v.facproveId,
                            empresaId: v.empresaId,
                            proveedorId: v.proveedorId,
                            fecha: moment(v.fecha).format('YYYY-MM-DD'),
                            visada: 1
                        }
                    };
                   
                    var url = "", type = "";
                    // updating record
                    var type = "PUT";
                    var url = sprintf('%s/api/facturasProveedores/visadas/modificar/%s', myconfig.apiUrl, v.facproveId);
                    var data2 = [];
                    data2.push(data);
                    $.ajax({
                        type: type,
                        url: url,
                        contentType: "application/json",
                        data: JSON.stringify(data2),
                        success: function (data, status) {
                            if(contador == facturas.length)     buscarFacturas()();
                            
                        },
                        error: function (err) {
                            mensErrorAjax(err);
                        }
                    });
            });
                    
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
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

var printGeneral = function () {
    if(registros == 0){
        var mens = "No hay registros que mostrar";
        $.SmartMessageBox({
            title: "<i class='fa fa-info'></i> Mensaje",
            content: mens,
            buttons: '[Aceptar]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Aceptar") {
                // no hacemos nada (no quiere borrar)
            }
        });
    } else {
        var vis = 0;
        if($("#chkVisadas").prop( "checked" )) {
          vis = 1
        }
         var url = "InfVisadosGeneral.html?visadas=" + vis + '&departamentoId='+vm.sdepartamentoId();
         window.open(url, '_blank');
    }
}
 function buscarVisadas() {
    var visada = 0;
    var dFecha = 0;
    var hFecha = 0;
    var proId = 0;
        $('#btnAlta').show();
        $('#checkMain').show()
        if ($('#chkVisadas').prop('checked')) {
            visada = 1;
            $('#btnAlta').hide();
            $('#checkMain').hide();
            dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(vm.hFecha()) {
                hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
            } 
            proId = vm.sproveedorId();
        } 
        var url = myconfig.apiUrl + "/api/facturasProveedores/visadas/facturas-proveedor/todas/usuario/logado/departamento/" + visada + "/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha +  "/" + proId;
        llamadaAjax("GET", url, null, function(err, data){
            if (err) return;
            registros = data.length;
            loadTablaFacturas(data);
        });
 }

 function estableceFecha() {
    // Restar 1 año a la fecha actual
    var fechaInicio;
    var fActual = new Date();
    var ano = fActual.getFullYear() - 1; // Resta 1 año a la fecha actual
    var mes = fActual.getMonth();
    var dia = fActual.getDay();

    fechaInicio = moment(ano + "-" + mes + "-" + dia).format('DD/MM/YYYY');
    vm.dFecha(fechaInicio);
    vm.hFecha(null)
}
