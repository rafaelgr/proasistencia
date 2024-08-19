/*-------------------------------------------------------------------------- 
renovarContratoGeneral.js
Funciones js par la página RenovarContratoGeneral.html

---------------------------------------------------------------------------*/

var dataContratos;
var contratoId;
var usuario;
var departamento;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();

    vm = new admData();
    ko.applyBindings(vm);
    usuario = recuperarUsuario();
    
    recuperaDepartamento(function(err, data) {
        if(err) return;
        initTablaContratos();

        contratoId = gup('ContratoId');
        if (contratoId !== '') {
            cargarContratos()(contratoId);

        } else {
            cargarContratos()();
        }
    });

     //Evento asociado al cambio de departamento
     $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        cargarContratos()();
    });

        //Evento de marcar/desmarcar todos los checks
        $('#checkMain').click(
            function(e){
                if($('#checkMain').prop('checked')) {
                    $('.checkAll').prop('checked', true);
                    updateAllContratos(true);
                } else {
                    $('.checkAll').prop('checked', false);
                    updateAllContratos(false);
                }
            }
        );
    

    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarContratos());
    $('#btnPrint').click(imprimirInforme);
    $('#frmBuscar').submit(function () {
        return false
    });
    
    $('#chkCerrados').change(function () {
        if($('#chkPreaviso').is(':checked')) {
            $('#chkPreaviso').prop("checked", false);
        }
        var url = myconfig.apiUrl + "/api/contratos/usuario/departamento/activos/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
        checkCerrados =  this;
        if (this.checked) {
            url =  myconfig.apiUrl + "/api/contratos/todos/usuario/departamento/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
        } 
        llamadaAjax("GET", url, null, function(err, data){
            if (err) return;
            data.forEach(function(d) {
                if(d.preaviso == null) {
                    d.preaviso = 0;
                }
                d.plazo = restarDias(d.fechaFinal, d.preaviso);
                d.plazo = moment(d.plazo).format('YYYY-MM-DD');
            }, this);
            loadTablaContratos(data);
        });
    });

    $('#chkPreaviso').change(function () {
        
        if($('#chkCerrados').is(':checked')) {
            $('#chkCerrados').prop("checked", false);
        }
        var url = myconfig.apiUrl + "/api/contratos/usuario/departamento/activos/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
        if (this.checked) {
            url =  myconfig.apiUrl + "/api/contratos/preaviso/usuario/departamento/todos/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
        } 
        llamadaAjax("GET", url, null, function(err, data){
            if (err) return;
            data.forEach(function(d) {
                if(d.preaviso == null) {
                    d.preaviso = 0;
                }
                d.plazo = restarDias(d.fechaFinal, d.preaviso);
                d.plazo = moment(d.plazo).format('YYYY-MM-DD');
            }, this);
            loadTablaContratos(data);
        });
    })
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
} 


function initTablaContratos() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function (data, row, column, node) {
                    if (column === 7) {
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        return data;
                    }
                }
            }
        }
    };

    tablaContratos = $('#dt_contrato').DataTable({
        fnCreatedRow: function (nRow, aData, iDataIndex) {
            var fechaActual = new Date();
            fechaActual = moment(fechaActual).format('YYYY-MM-DD');
            var fechaFinal = moment(aData.fechaFinal).format('YYYY-MM-DD');
            if (fechaActual >= aData.plazo && aData.contratoCerrado == 0) {
                $(nRow).attr('style', 'background: #FFA96C');
            }
            if (aData.contratoCerrado == 1) {
                $(nRow).attr('style', 'background: #FBB0B9');
            }
            if (fechaFinal <= fechaActual && aData.contratoCerrado == 0) {
                $(nRow).attr('style', 'background: #99DACF');
            }
        },
        bSort: true,
        responsive: true,
        columnDefs: [
            { "sType": "date-uk", "targets": [3, 4] }
        ],
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C Br >r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        buttons: [
            'copy',
            'csv',
            $.extend(true, {}, buttonCommon, {
                extend: 'excel'
            }),
            {
                extend: 'pdf',
                orientation: 'landscape',
                pageSize: 'LEGAL'
            },
            'print'
        ],
        autoWidth: true,
        paging: true,
        "pageLength": 100,
        preDrawCallback: function () { },
        rowCallback: function (nRow) { },
        drawCallback: function (oSettings) { },
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
        data: dataContratos,
        columns: [
            { data: null, defaultContent: '' }, // Columna para el botón +
            {
                data: "contratoId",
                render: function (data, type, row) {
                    var html = '<label class="input">';
                    html += sprintf('<input id="chk%s" type="checkbox" name="chk%s"  class="checkAll">', data, data);
                    html += '</label>';
                    return html;
                }
            },
            { data: "referencia" },
            { data: "tipo" },
            {
                data: "fechaInicio",
                render: function (data, type, row) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                data: "fechaFinal",
                render: function (data, type, row) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            { data: "empresa" },
            { data: "cliente" },
            {
                data: "total",
                render: function (data, type, row) {
                    var string = numeral(data).format('0,0.00');
                    return string;
                }
            },
            { data: "mantenedor" },
            { data: "agente" },
            { data: "observaciones" },
            {
                data: "contratoId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteContrato(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success' onclick='editContrato(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                },
                responsivePriority: 1
            }
        ]
    });

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function (a) {
            var ukDatea = a.split('/');
            return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        },

        "date-uk-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },

        "date-uk-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });

    // Apply the filter
    $("#dt_contrato thead th input[type=text]").on('keyup change', function () {
        tablaContratos
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaContratos.columns(8).visible(false); // Actualiza los índices según corresponda
    tablaContratos.columns(9).visible(false);
}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
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

function loadTablaContratos(data) {
    var dt = $('#dt_contrato').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarContratos() {
    var mf = function () {
        cargarContratos()();
    };
    return mf;
}


function deleteContrato(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                contratoId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/contratos/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarContratos();
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

function editContrato(id) {
    var url = "ContratoDetalle.html?ContratoId=" + id;
    window.open(url, '_new');
}

function cargarContratos() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: contratoId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/contratos/" + contratoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    if(data.preaviso == null) {
                        data.preaviso = 0;
                    }
                        data.plazo = restarDias(data.fechaFinal, data.preaviso);
                        data.plazo = moment(data.plazo).format('YYYY-MM-DD');
                    loadTablaContratos(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/contratos/usuario/departamento/activos/" + usuario.usuarioId + "/" + vm.sdepartamentoId(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    data.forEach(function(d) {
                        if(d.preaviso == null) {
                            d.preaviso = 0;
                        }
                        d.plazo = restarDias(d.fechaFinal, d.preaviso);
                        d.plazo = moment(d.plazo).format('YYYY-MM-DD');
                    }, this);
                    
                    loadTablaContratos(data);
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

function restarDias(fecha, dias){

    var registro = new Date(fecha);
    registro.setDate(registro.getDate() - dias);
    return registro;
  }


function cargarContratos2() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contratos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaContratos(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cargarContratos2All() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contratos/all",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaContratos(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function updateAllContratos(option) {
    var datos = null;
    var sel = 0;
    if(option) sel = 1;
    var tb = $('#dt_contrato').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
            var data = {
                contrato: {
                    contratoId: datos[i].contratoId,
                    sel: sel
            }
        };
                
               
        var url = "", type = "";
         // updating record
         var type = "PUT";
         var url = sprintf('%sapi/contratos/%s', myconfig.apiUrl, datos[i].contratoId);
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



imprimirInforme = function () {
    var url = "InfContratos.html";
    window.open(url, '_blank');
}