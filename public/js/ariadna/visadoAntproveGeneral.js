/*-------------------------------------------------------------------------- 
anticipoGeneral.js
Funciones js par la página AnticipoGeneral.html
PROVEEDORES
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataAnticipos;
var dataContrato;
var antproveId;
var init = 0;
var visadas;
var registros;
var usuario;
var anticipos;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js
var url;
var vm = null;

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
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
   
    $('#btnAlta').click(visarAnticipos);
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
        var visada = 0;
        $('#btnAlta').show();
        $('#checkMain').show()
        if(this.checked) { 
            $('.ocultar').show();
            visada = 1;
            $('#btnAlta').hide();
            $('#checkMain').hide();
        }else {
            estableceFecha();
            loadProveedores()
            $('.ocultar').hide();
           buscarAnticipos()();
        }
    });

    //Evento asociadpo al checkbox
    $('#chkTodos').change(function () {
        if (this.checked) {
            cargarAnticipos2All();
        } else {
            cargarAnticipos2();
        }
    });

    $("#cmbProveedores").select2(select2Spanish());

    $('.ocultar').hide();

    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        if(!$('#chkVisadas').prop('checked')) buscarAnticipos()();
    });

    vm = new admData();
    ko.applyBindings(vm);

    recuperaDepartamento(function(err, data) {
        if(err) return;
        initTablaAnticipos();
        buscarAnticipos()();
        loadProveedores();
        estableceFecha();
        // comprobamos parámetros
        antproveId = gup('AnticipoId');
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


function initTablaAnticipos() {
    tablaCarro = $('#dt_anticipo').dataTable({
        autoWidth: true,
        paging: false,
        "bDestroy": true,
        "columnDefs": [ 
            {
                "targets": 0,
                "width": "20%",
                "orderable": false
            },
            { 
                "type": "datetime-moment",
                "targets": [6],
                "render": function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        if(!data) return null;
                        return moment(data).format('DD/MM/YYYY');
                    }
                    // Si es para ordenar, usa un formato que DataTables pueda entender (p. ej., 'YYYY-MM-DD HH:mm:ss')
                    else if (type === 'sort') {
                        if(!data) return null;
                        return moment(data).format('YYYY-MM-DD HH:mm:ss');
                    }
                    // En otros casos, solo devuelve los datos sin cambios
                    else {
                        if(!data) return null;
                        return data;
                    }
                }
            }
         ],
         "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'C >>" +
         "t" +
         "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
         "oColVis": {
             "buttonText": "Mostrar / ocultar columnas"
         },
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_anticipo'), breakpointDefinition);
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
        data: dataAnticipos,
        columns: [{
            data: "antproveId",
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
        },
        {
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

        },
         {
            data: "vNum"
        }, {
            data: "fecha",
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
        }, {
            data: "antproveId",
            render: function (data, type, row) {
                ///var bt1 = "<button class='btn btn-circle btn-info' title='Contrato asociado' data-toggle='modal' data-target='#modalContrato' onclick='initModal(" + data + ");' title='Consulta de resultados de contrato'> <i class='fa fa-fw fa-files-o'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editAnticipo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printAnticipo(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" /*+ bt1 + " " */+ bt2 /*+ "" + bt3 */+ "</div>";
                return html;
            }
        }]
    });
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

function initModal(antproveId) {
    init++

    $('#modalContrato').on('hidden.bs.modal', function () {
        $('#modalContrato').off('show.bs.modal');
    });
    
    if(init == 1){
        $('#modalContrato').on('show.bs.modal', function (e) {
            initTablaContratos(antproveId);
        })
    }else {
        cargarContratos()(antproveId);
    }
}

function loadTablaAnticipos(data) {
    anticipos = data;
    var dt = $('#dt_anticipo').dataTable();
    $('#checkMain').prop('checked', false);//valor por defecto
    if (data !== null && data.length === 0) {
        data = null;
    }
    
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.antproveId;
        if (v.visada == 1) {
            $(field).attr('checked', true);
            $(field).attr('disabled', true);
        }
       /*  if(!$("#chkVisadas").prop( "checked" )) return;
        $(field).change(function () {
            mensajeConfirmacion(this, v)
        }); */
    });
}

function mensajeConfirmacion(t, v) {
    // mensaje de confirmación
    var mens = "¿Realmente desa quitar la marca de visado?, el anticipo pasará a estar pendiente de visar?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var quantity = 0;
            var data = {
                antprove: {
                    antproveId: v.antproveId,
                    empresaId: v.empresaId,
                    proveedorId: v.proveedorId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    visada: 0
                }
            };
            if (t.checked) {
                data.antprove.visada = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/anticiposProveedores/visadas/modificar/%s', myconfig.apiUrl, v.antproveId);
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
                    var url = "VisadoAntproveGeneral.html?visadas="+ vis;
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

function buscarAnticipos() {
    var mf = function () {
        var url;
        if($("#chkVisadas").prop( "checked" )) {
            url = "/api/anticiposProveedores/visadas/anticipos-proveedor/todas/usuario/logado/departamento/" + 1 +"/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + 0 + "/" + 0 +  "/" + 0;
          }
          else {
            url = "/api/anticiposProveedores/visadas/anticipos-proveedor/todas/usuario/logado/departamento/" + 0 +"/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + 0 + "/" + 0 +  "/" + 0;
          }
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                registros = data.length;
                loadTablaAnticipos(data);
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




function initTablaContratos(antproveId) {
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
        cargarContratos()(antproveId);
    }
}

function cargarContratos() {
    var mf = function (antproveId) {
        if (antproveId) {
            var data = null;
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/contratos/asociado/antprove/resultado/" + antproveId,
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




function editAnticipo(id) {
    // hay que abrir la página de detalle de anticipo
    // pasando en la url ese ID
    var url = "AnticipoProveedorDetalle.html?antproveId=" + id;
    window.open(url, '_blank');
}



function printAnticipo(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/anticiposProveedores/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            if(data.ref){
                window.open("../../ficheros/anticipos_proveedores/"+data.ref+".pdf","_blank");
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
         var url = "InfVisadosGeneral.html?visadas=" + vis;
         window.open(url, '_blank');
    }
}


function visarAnticipos() {
    mensajeConfirmacionVisar();
    
}

function mensajeConfirmacionVisar(t, v) {
    // mensaje de confirmación
    var mens = "¿Realmente desa visar los anticipos seleccionados?.";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var contador = 0;
            anticipos.forEach(function (v) {
                contador++;
                var field = "#chk" + v.antproveId;
                if (!$(field).prop('checked'))  return;
                    var data = {
                        antprove: {
                            antproveId: v.antproveId,
                            empresaId: v.empresaId,
                            proveedorId: v.proveedorId,
                            fecha: moment(v.fecha).format('YYYY-MM-DD'),
                            visada: 1
                        }
                    };
                   
                    var url = "", type = "";
                    // updating record
                    var type = "PUT";
                    var url = sprintf('%s/api/anticiposProveedores/visadas/modificar/%s', myconfig.apiUrl, v.antproveId);
                    var data2 = [];
                    data2.push(data);
                    $.ajax({
                        type: type,
                        url: url,
                        contentType: "application/json",
                        data: JSON.stringify(data2),
                        success: function (data, status) {
                            if(contador == anticipos.length)     buscarAnticipos()();
                            
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
        var url = myconfig.apiUrl + "/api/anticiposProveedores/visadas/anticipos-proveedor/todas/usuario/logado/departamento/" + visada + "/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha +  "/" + proId;
        llamadaAjax("GET", url, null, function(err, data){
            if (err) return;
            registros = data.length;
            loadTablaAnticipos(data);
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