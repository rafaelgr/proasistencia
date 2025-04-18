/*-------------------------------------------------------------------------- 
contratoGeneral.js
Funciones js par la página ContratoGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

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
        ajustaDepartamentos(data)
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

    // select2 things
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());


    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarContratos());
    $('#btnAlta').click(crearContrato());
    $('#btnPrint').click(imprimirInforme);
    $('#frmBuscar').submit(function () {
        return false
    });
    
    $('#chkCerrados').change(function () {
        if($('#chkPreaviso').is(':checked')) {
            $('#chkPreaviso').prop("checked", false);
        }
        if(vm.sdepartamentoId() != 5) return;
        var url = myconfig.apiUrl + "/api/contratos/arquitectura/usuario/departamento/activos/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
        checkCerrados =  this;
        if (this.checked) {
            url =  myconfig.apiUrl + "/api/contratos/arquitectura/todos/usuario/departamento/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
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
        if(vm.sdepartamentoId() != 5) return;
        var url = myconfig.apiUrl + "/api/contratos/arquitectura/usuario/departamento/activos/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
        if (this.checked) {
            url =  myconfig.apiUrl + "/api/contratos/arquitectura/preaviso/usuario/departamento/todos/" + usuario.usuarioId + "/" + vm.sdepartamentoId();
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
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 7) {
                        //regresar = importe.toString().replace(/\./g,',');
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
        fnCreatedRow : 
        function (nRow, aData, iDataIndex) {
            var fechaActual = new Date();
            fechaActual = moment(fechaActual).format('YYYY-MM-DD');
            var fechaFinal = moment(aData.fechaFinal).format('YYYY-MM-DD');
            //contratos en preaviso
            if(fechaActual >= aData.plazo && aData.contratoCerrado == 0) {
                $(nRow).attr('style', 'background: #FFA96C'); 
            }
            //contratos cerrados
            if(aData.contratoCerrado == 1) {
                $(nRow).attr('style', 'background: #FBB0B9'); 
            }
            //contratos vencidos
            if(fechaFinal <= fechaActual && aData.contratoCerrado == 0) {
                $(nRow).attr('style', 'background: #99DACF'); 
            }
        },
        bSort: true,
        "aoColumnDefs": [
            { "sType": "date-uk", "aTargets": [3,4] },
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
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            } ), 
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
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_contrato'), breakpointDefinition);
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
        data: dataContratos,
        columns: [{
            data: "contratoId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                return html;
            }
        }, {
            data: "referencia"
        }, {
            data: "fechaInicio",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "fechaFinal",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },  {
            data: "cliente"
        }, {
            data: "total",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "mantenedor"
        }, {
            data: "agente"
        }, {
            data: "tecnicoNombre"
        }, {
            data: "observaciones"
        }, {
            data: "contratoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteContrato(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editContrato(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printContrato(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });

     //function sort by date
     jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function ( a ) {
            var ukDatea = a.split('/');
            return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        },
        
        "date-uk-asc": function ( a, b ) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        
        "date-uk-desc": function ( a, b ) {
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
    tablaContratos.columns(5).visible(false);
    tablaContratos.columns(6).visible(false);
    //tablaContratos.columns(9).visible(false);
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

function crearContrato() {
    var mf = function () {
        var url = "ContratoDetalle.html?ContratoId=0&dep=arquitectura";
        window.open(url, '_new');
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
    var url = "ContratoDetalle.html?ContratoId=" + id + "&dep=arquitectura"
    window.open(url, '_new');
}

function cargarContratos() {
    var mf = function (id) {
        if(vm.sdepartamentoId() != 5) return;
        if (id) {
            var data = {
                id: contratoId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/contratos/arquitectura/" + contratoId,
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
                url: myconfig.apiUrl + "/api/contratos/arquitectura/usuario/departamento/activos/" + usuario.usuarioId + "/" + vm.sdepartamentoId(),
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

/* function printContrato(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/contratos/" + id,
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
} */

/* function informePDF(data) {
    var shortid = "rySBxKzIe";
    var data = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
} */

/* var f_open_post = function (verb, url, data, target) {
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
}; */

function cargarContratos2() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contratos/arquitectura/",
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

function ajustaDepartamentos(data) {
    //ELIMINAMOS TODOS LOS DEPARTAMENTOS EXECTO OBRAS DEL COMBO
    var id = $("#cmbDepartamentosTrabajo").val();//departamento de trabajo
     for (var i = 0; i < data.length; i++) {
            if (data[i].departamentoId != 5) {
                data.splice(i, 1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
    }
    console.log(data);
    var departamentos = [{
        departamentoId: 0,
        nombre: ""
    }].concat(data);
    vm.posiblesDepartamentos(departamentos);
    if(id != 5)  {
        $("#cmbDepartamentosTrabajo").val([0]).trigger('change');
        vm.sdepartamentoId(0);
    }
}
imprimirInforme = function () {
    var url = "InfContratos.html";
    window.open(url, '_blank');
}