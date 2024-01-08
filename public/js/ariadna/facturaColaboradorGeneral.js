/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página PrefacturaGeneral.html

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
var tablaFacturas;
var antDepartamentoId;

var antproveId;
var filtros = {};


function initForm() {
    comprobarLogin();
    datePickerSpanish(); // see comun.js
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarFacturas());
    $('#btnAlta').click(crearFactura());
    $('#btnPrint').click(imprimirFactura);
    $('#btnLimpiar').click(limpiarFiltros)
    $('#frmBuscar').submit(function () {
        return false
    });

    vm = new admData();
    ko.applyBindings(vm);
    vm.filtroFecha('0');
    vm.dFecha(null);
    //por defecto el label de filto de fechas es por fecha de recepción
    $('#df').text('Desde fecha recepción');
    $('#hf').text('Hasta fecha recepción');

    var rad = $("[name='filtroFechaGroup']");
    for(var i = 0; i < rad.length; i++) {
        rad[i].onclick = function () {
           if(this.value == "0") {
            $('#df').text('Desde fecha recepción');
            $('#hf').text('Hasta fecha recepción');
           } else {
            $('#df').text('Desde fecha');
            $('#hf').text('Hasta fecha');
           }
        };
    }

    $("#cmbEmpresas").select2(select2Spanish());

    filtros = getCookie('filtro_factcols');
    if(filtros != undefined) {
        filtros = JSON.parse(filtros);
    }

    //validacion de fecha mayor que fecha
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

    initTablaFacturas();
    var conservaFiltro = gup("ConservaFiltro");
    var cleaned = gup("cleaned");
    if(conservaFiltro != 'true' && cleaned != 'true') {
        limpiarFiltros();
    } else {
        recuperaDepartamento(function(err, data) {
            if(err) return;
            if(vm.sdepartamentoId() != 7) { $('#btnPrint').hide() ;} 
            else{ $('#btnPrint').show() }
            // comprobamos parámetros
            facproveId = gup('facproveId');
            var f = facproveId;
                if(facproveId = '') {
                    f = null
                }
                compruebaFiltros(f);
        });
    }

    

     //Evento asociado al cambio de departamento
     $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        // comprobamos parámetros
        facproveId = gup('facproveId');
        var f = facproveId;
        if(facproveId = '') {
            f = null
        }
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        if(vm.sdepartamentoId() != 7) { $('#btnPrint').hide() ;} 
        else{ $('#btnPrint').show() }
        if( !$('#chkTodos').prop('checked') ) {
            if(this.value != antDepartamentoId) {
                cargarFacturas2()();
            } else {
                cargarFacturas2(f)();
            }
        } else {
            cargarFacturas2All()();
        }
        antDepartamentoId = this.value;
    });


    $('#chkTodos').change(function () {
        if (this.checked) {
            cargarFacturas2All()();
        } else {
            cargarFacturas2()();
        }
    })
   
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);

    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();

    self.filtroFecha = ko.observable();
    
} 

function compruebaFiltros(id) {
    if(filtros) {
        vm.dFecha(filtros.dFecha);
        vm.hFecha(filtros.hFecha);
        loadEmpresas(filtros.empresaId);
        vm.sempresaId(filtros.empresaId);
        //comprobamos el filtro por fechas
        vm.filtroFecha(filtros.filtroFecha);
        if(vm.filtroFecha() == "0") {
            $('#df').text('Desde fecha recepción');
            $('#hf').text('Hasta fecha recepción');
        } else {
            $('#df').text('Desde fecha');
            $('#hf').text('Hasta fecha');
        }
        if(filtros.contabilizadas == true) {
            $('#chkTodos').prop('checked', true);
            if(id > 0) {
                cargarFacturas2(id)();
            } else {
                cargarFacturas2All()();
            }

        } else {
            $('#chkTodos').prop('checked', false);
            cargarFacturas2(id)();
        }
       /*  if(id) {
            cargarFacturas2()(id);
        } */
    } else{
        loadEmpresas(0);
        estableceFechaEjercicio();
        if(id) {
            cargarFacturas2(id)();
        } else{
            cargarFacturas2()();
        }

    }
}

function initTablaFacturas() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node ) {
                    // Strip $ from salary column to make it numeric
                    if(column === 7 || column === 8) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column === 12) {
                            return "";
                        } else {
                            return data;
                        };
                    }
                }
            }
        }
    };
    tablaFacturas = $('#dt_factura').DataTable({
        bSort: true,
        responsive: true,
        paging: true,
        "pageLength": 100,
        "stateSave": true,
        "stateLoaded": function (settings, state) {
            state.columns.forEach(function (column, index) {
                $('#' + settings.sTableId + '-head-filter-' + index).val(column.search.search);
             });
        },        
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'Br><'col-sm-6 col-xs-6 hidden-xs' 'l C>r>" +
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
        columnDefs: [
            {
                targets: 12, // El número de la columna que deseas mantener siempre visible (0 es la primera columna).
                className: 'all', // Agrega la clase 'all' para que la columna esté siempre visible.
            },
            { 
                "type": "datetime-moment",
                "targets": [5, 6],
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
        autoWidth: true,
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
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "ref"
        },{
            data: "numeroFacturaProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        },  {
            data: "fecha",
        },  {
            data: "fecha_recepcion",
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
        },  {
            data: "vFPago"
        }, {
            data: "emisorNif"
        },{
            data: "numregisconta",
        },   {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                if(row.contabilizada && !usuario.puedeEditar) bt1 = '';
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
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
    $("#dt_factura thead th input[type=text]").on('keyup change', function () {
        tablaFacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
    tablaFacturas.column(10).visible(false);

}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtHastaFecha: {
                greaterThan: "#txtDesdeFecha"
            }
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

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function loadEmpresas(id) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        vm.sempresaId(id);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}

function buscarFacturas() {
    var mf = function () {
        if ($('#chkTodos').prop('checked')) {
            cargarFacturas2All()();
        } else {
            cargarFacturas2()();
        }
    };
    return mf;
}

function crearFactura() {
    var mf = function () {
        var url = "FacturaColaboradorDetalle.html?facproveId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteFactura(id) {
    var url = myconfig.apiUrl + "/api/facturasProveedores/nuevo/" + id + "/" + usuario.nombre;
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(null),
                success: function (data, status) {
                    if(data.contabilizada == 1 && !usuario.puedeEditar) {
                        var mensaje =  "Esta factura ya ha sido contabilizada, no se puede borrar.";
                        mensError(mensaje);
                        return;
                    }
                    if( data.departamentoId == 7) {
                        url = myconfig.apiUrl + "/api/facturasProveedores/reparaciones/actualiza/parte/" + id + "/" + usuario.nombre;
                    }
                    antproveId = data.antproveId;
                   if(data.nombreFacprovePdf){
                    $.ajax({
                        type: "DELETE",
                        url: myconfig.apiUrl + "/api/facturasProveedores/archivo/" + data.nombreFacprovePdf,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (data, status) {
                        },
                        error: function (err) {
                            mensErrorAjax(err);
                            // si hay algo más que hacer lo haremos aquí.
                        }
                    });
                   }
                   var datos = {
                    facproveId: id,
                    departamentoId: data.departamentoId
                };
                if(antproveId) {
                    datos.antproveId =  antproveId;
                }
                $.ajax({
                    type: "DELETE",
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function (data, status) {
                        var fn = buscarFacturas();
                        fn();
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                        // si hay algo más que hacer lo haremos aquí.
                    }
                });
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
    // hay que abrir la página de detalle de prefactura
    // pasando en la url ese ID
    var contabilizadas = $('#chkTodos').prop('checked');
    var busquedaFacturas = 
        {
            empresaId:vm.sempresaId(),
            dFecha: vm.dFecha(),
            hFecha: vm.hFecha(),
            contabilizadas: contabilizadas,
            filtroFecha: vm.filtroFecha()
        }
    setCookie("filtro_factcols", JSON.stringify(busquedaFacturas), 1);
    var url = "FacturaColaboradorDetalle.html?facproveId=" + id;
    window.open(url, '_self');
}



function cargarFacturas2(id) {
    var mf = function() {
        var colaborador = 1;
        var dFecha = null;
        if(vm.dFecha()) dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = vm.hFecha();
        if(hFecha == '' || hFecha == undefined) hFecha = null;
        if(hFecha != null) {
            if(hFecha != null) hFecha = moment(hFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(!datosOK()) return;
        }
        if (id) {
            var data = {
                id: id
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacturas(data);
                    return;
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            if(!dFecha) return;
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/usuario/logado/departamento/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha + "/" + vm.sempresaId() + "/" + colaborador + "/" + vm.filtroFecha(),
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
    }
    return mf
}

function cargarFacturas2All() {
    var mf = function() {
        var colaborador = 1;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = vm.hFecha();
        if(hFecha == '' || hFecha == undefined) hFecha = null;
        if(hFecha != null) {
            if(hFecha != null) hFecha = moment(hFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(!datosOK()) return;
        }
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/usuario/logado/departamento/all/"  +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha + "/" + vm.sempresaId() + "/" + colaborador + "/" + vm.filtroFecha(),
            contentType: "application/json",
            success: function (data, status) {
                loadTablaFacturas(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
    return mf;
}

function printFactura2(id) {
    var url = "InfFacturasProveedores.html?facproveId=" + id;
    window.open(url, "_new");
}

function estableceFechaEjercicio() {
    //SI EL DIA ACTUAL ES MAYOR QUE EL 15 DE ENERO SE ESTABLECE EL CAMPO
    //DFECHA DE LA BUSQUEDA COMO EL PRIMER DIA DEL EJERCICIO ANTERIOR.
    //SI ES MAYOR SE ESTABLECE EL CAMPO DFECHA COMO EL PRIMER DIA DEL EJERCICIO ACTUAL.
    var fechaInicio;
    var fActual = new Date();
    var ano = fActual.getFullYear();

    var InicioEjercicio = new Date(ano +'-01-15');
    if(fActual > InicioEjercicio) {
        fechaInicio = moment(ano + '-01-01').format('DD/MM/YYYY');
        vm.dFecha(fechaInicio);
    } else {
        ano = ano-1
        fechaInicio = moment(ano + '-01-01').format('DD/MM/YYYY');
        vm.dFecha(fechaInicio);
    }
}


limpiarFiltros = function() {
    var returnUrl = "FacturaColaboradorGeneral.html?cleaned=true"
    deleteCookie('filtro_factcols');
    tablaFacturas.state.clear();
    window.open(returnUrl, '_self');
}

imprimirFactura = function () {
    var url = "InfFacturasProveedores.html";
    window.open(url, '_blank');
}

