/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página PrefacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataPrefacturas;
var prefacturaId;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBorrar').hide();
    $('#btnBorrar').click(borrarUltimaLiquidacion());
    $('#btnBuscar').click(cargarPrefacturas(null));
    $('#frmBuscar').submit(function () {
        return false
    });

    //Evento asociado al cambio de departamento
     $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        //cargarPrefacturas()();
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

     // select2 things
     $("#cmbDepartamentosTrabajo").select2(select2Spanish());

     $("#cmbEmpresas").select2(select2Spanish());
     loadEmpresas();

     recuperaDepartamento(function(err, data) {
        if(err) return;
        ajustaDepartamentos(data);
    });

    initAutoCliente();
    initTablaPrefacturas();
  
    vm = new admData();
    ko.applyBindings(vm);

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
}

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();

    self.sclienteId = ko.observable();
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]); 
    
} 


function initTablaPrefacturas() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 6 || column === 7) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        return data;
                    }
                },
                footer: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(row === 6 || row === 7) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                       if(row === 5) {
                            return data
                       } else {
                            return "";
                       }
                    }
                },
            }
        }
    };
    tablaPrefacturas = $('#dt_prefactura').DataTable({
        bSort: true,
        "aoColumnDefs": [
            { "sType": "date-uk", "aTargets": [5] },
        ],
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C Br >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        buttons: [
            'copy', 
            'csv', 
            $.extend( true, {}, buttonCommon, {
                extend: 'excel'
            },{footer: true} ), 
            $.extend( true, {}, {
                extend: 'pdf'
            },{
                orientation: 'landscape',
                pageSize: 'LEGAL',
                footer: true
                } ), 
            
            'print'
        ],
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },

        autoWidth: true,
        paging: true,
        "pageLength": 100,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_prefactura'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        footerCallback: function ( row, data, start, end, display ) {

            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
           
            // Total over all pages
            total6 = api
            .column( 6, {filter:'applied'} )
            .data()
            .reduce( function (a, b) {
                return Math.round((intVal(a) + intVal(b)) * 100) / 100;
            }, 0 );

        

         // Total over all pages
         total7 = api
         .column( 7, {filter:'applied'} )
         .data()
         .reduce( function (a, b) {
             return Math.round((intVal(a) + intVal(b)) * 100) / 100;
         }, 0 );

         // Update footer
         $( api.columns(6).footer() ).html(
            numeral(total6).format('0,0.00')
            
        );
        $( api.columns(7).footer() ).html(
            numeral(total7).format('0,0.00')
            
        );

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
        data: dataPrefacturas,
        columns: [ {
            data: "prefacturaId",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s"  class="checkAll">', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data: "referencia"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
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
            data: "vFPago"
        }, {
            data: "observaciones"
        }, {
            data: "dirTrabajo"
        }, {
            data: "prefacturaId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editPrefactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 +  "</div>";
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
    $("#dt_prefactura thead th input[type=text]").on('keyup change', function () {
        tablaPrefacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaPrefacturas.columns(10).visible(false);
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
                greaterThan: "#txtDesdeFecha"
            },
            cmbDepartamentosTrabajo: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtDesdeFecha: {
                required: "Debe seleccionar una fecha"
            },
            cmbDepartamentosTrabajo: {
                required: "Se tiene que elegir un departamento"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}



function loadTablaPrefacturas(data) {
    var dt = $('#dt_prefactura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) {
        dt.fnAddData(data);
        data.forEach(function (v) {
            var field = "#chk" + v.prefacturaId;
            if (v.sel == 1) {
                $(field).attr('checked', true);
            }
            $(field).change(function () {
                var quantity = 0;
                var data = {
                    prefactura: {
                        prefacturaId: v.prefacturaId,
                        empresaId: v.empresaId,
                        clienteId: v.clienteId,
                        fecha: moment(v.fecha).format('YYYY-MM-DD'),
                        sel: 0
                    }
                };
                if (this.checked) {
                    data.prefactura.sel = 1;
                }
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/api/prefacturas/%s', myconfig.apiUrl, v.prefacturaId);
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
    dt.fnDraw();

}


function editPrefactura(id) {
    // hay que abrir la página de detalle de prefactura
    // pasando en la url ese ID
    var url = "PrefacturaDetalle.html?PrefacturaId=" + id;
    window.open(url, '_new');
}


function printPrefactura(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/prefacturas/" + id,
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

function printPrefactura2(id) {
    var url = "InfPrefacturas.html?prefacturaId=" + id;
    window.open(url, "_new");
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

function cargarPrefacturas(id) {
    var mf = function () {
        if(id === undefined) id = 0;
        if (id) {
            var data = {
                id: prefacturaId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturas/" + prefacturaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturas(data);
                    $('#btnBorrar').show();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            if (!datosOK()) return;

            // antes comprobamos si han borrado el campo cliente
            if ($("#txtCliente").val() == "") vm.sclienteId(0);
            var desdeFecha = 0;
            var hastaFecha = 0;
            desdeFecha = spanishDbDate(vm.desdeFecha());
            if(vm.hastaFecha()) { 
                hastaFecha = spanishDbDate(vm.hastaFecha());
            }
            
            var url = myconfig.apiUrl + "/api/prefacturas/usuario/logado/departamento/" + desdeFecha + "/" + hastaFecha + "/" + usuario.usuarioId;
            if (vm.sclienteId()) url += "/" + vm.sclienteId(); else url += "/0"
            url += "/" + vm.sdepartamentoId();
            if (vm.sempresaId()) url += "/" + vm.sempresaId(); else url += "/0"
            
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturas(data);
                    $('#btnBorrar').show();
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


function ajustaDepartamentos(data) {
    //ELIMINAMOS TODOS LOS DEPARTAMENTOS EXECTO Alquileres DEL COMBO
    var id = $("#cmbDepartamentosTrabajo").val();//departamento de trabajo
     for (var i = 0; i < data.length; i++) {
            if (data[i].departamentoId != 3) {
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
    if(id != 3)  {
        $("#cmbDepartamentosTrabajo").val([null]).trigger('change');
        vm.sdepartamentoId(null);
    }
}

function loadEmpresas(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
            vm.posiblesEmpresas(empresas);
            $("#cmbEmpresas").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

var initAutoCliente = function () {
    // incialización propiamente dicha
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            // call ajax
            $.ajax({
                type: "GET",
                url: "/api/clientes/?nombre=" + request.term,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    var r = []
                    data.forEach(function (d) {
                        var v = {
                            value: d.nombre,
                            id: d.clienteId
                        };
                        r.push(v);
                    });
                    response(r);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });

        },
        minLength: 2,
        select: function (event, ui) {
            vm.sclienteId(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};


function updateAll(option) {
    var datos = null;
    var sel = 0;
    if(option) sel = 1;
    var tb = $('#dt_prefactura').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
            var data = {
                prefactura: {
                    prefacturaId: datos[i].prefacturaId,
                    empresaId: datos[i].empresaId,
                    clienteId: datos[i].clienteId,
                    fecha: moment(datos[i].fecha).format('YYYY-MM-DD'),
                    sel: sel
            }
        };
                
               
        var url = "", type = "";
         // updating record
         var type = "PUT";
         var url = sprintf('%sapi/prefacturas/%s', myconfig.apiUrl, datos[i].prefacturaId);
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

function borrarUltimaLiquidacion() {
    var mf = function() {
   
     // antes comprobamos si han borrado el campo cliente
     if ($("#txtCliente").val() == "") vm.sclienteId(0);
     var desdeFecha = 0;
     var hastaFecha = 0;
     desdeFecha = spanishDbDate(vm.desdeFecha());
     if(vm.hastaFecha()) { 
         hastaFecha = spanishDbDate(vm.hastaFecha());
     }
     
     var url = myconfig.apiUrl + "/api/prefacturas/borrar/seleccionadas/" + desdeFecha + "/" + hastaFecha + "/" + usuario.usuarioId;
     if (vm.sclienteId()) url += "/" + vm.sclienteId(); else url += "/0"
     url += "/" + vm.sdepartamentoId();
     if (vm.sempresaId()) url += "/" + vm.sempresaId(); else url += "/0"

    var mens = "Se borrarán las prefacturas seleccionadas, esta acción no se podrá deshacer. ¿Desea continuar?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {

            $.ajax({
                type: "DELETE",
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    if(data.affectedRows == 0) {
                        mensError("No se ha borrado nada");
                        return;
                    }
                    mensNormal("Se han borrado las prefacturas seleccionados");    
                    loadTablaPrefacturas(null);
                    $('#btnBorrar').hide();  
                    $('#checkMain').porp('checked', false);        
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
    return mf
}