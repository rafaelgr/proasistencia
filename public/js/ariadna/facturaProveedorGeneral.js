/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página PrefacturaGeneral.html

---------------------------------------------------------------------------*/

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
var datadocpago;
var init = 0;
var cofigTabla;


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

    filtros = getCookie('filtro_facproves');
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
        if(facproveId == '') {
            f = null
        }
        compruebaFiltros(f);
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        if(vm.sdepartamentoId() != 7) { $('#btnPrint').hide() ;} 
        else{ $('#btnPrint').show() }
        if( !$('#chkTodos').prop('checked') ) {
            if(this.value != antDepartamentoId) {
                if(facproveId) return; 
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
    });

    $('#chkSinDocPago').change(function () {
        var todos =  $('#chkTodos').prop('checked');
        if (todos) {
            cargarFacturas2All()();
        } else {
            cargarFacturas2()();
        }
    });
   
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
    
        if(filtros.sinDocPago == true) {
            $('#chkSinDocPago').prop('checked', true);

        } else {
            $('#chkSinDocPago').prop('checked', false);
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
                    if(column === 7 || column === 8 || column === 11 || column === 12) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if(column === 0 || column ===12) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                }
            }
        }
    };
    tablaFacturas = $('#dt_factura').DataTable({
        bSort: true,
        paging: true,
        "pageLength": 100,
        "stateSave": true,
        responsive: true,
        columnDefs: [
            {
                targets: 13, // El número de la columna que deseas mantener siempre visible (0 es la primera columna).
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
       
        fnCreatedRow : 
        function (nRow, aData, iDataIndex) {
            //facturas asociadas a más de un documento de pago
            if(aData.aNum > 1) {
                $(nRow).attr('style', 'background: #F85F6A'); 

            }
             //facturas asociadas a un documento de pago
             if(aData.aNum == 1) {
                $(nRow).attr('style', 'background: #FFF800'); 
            }

            //facturas que no necesitan asociación de documento de pago
            if(aData.formaPagoId == 12 || aData.formaPagoId == 21) {
                $(nRow).attr('style', 'background: #11F611'); 
            }
            
        },
        "stateLoaded": function (settings, state) {
            state.columns.forEach(function (column, index) {
                $('#' + settings.sTableId + '-head-filter-' + index).val(column.search.search);
             });
        },
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'Br><'col-sm-6 col-xs-6 hidden-xs' 'l C >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
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
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        
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
            render: function (data, type, row) {
                var string = numeral(data).format('0');
                return string;
            }
        },
        {
            data: "aNum",
            render: function (data, type, row) {
                var string = numeral(data).format('0');
                return string;
            }
        },   {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-info' title='Documentosd de pago asociados' data-toggle='modal' data-target='#modalDocPago' onclick='initModal(" + data + ");'> <i class='fa fa-fw fa-files-o'></i> </button>";
                if(row.contabilizada && !usuario.puedeEditar) bt1 = '';
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 +  "</div>";
                return html;
            }
        }]
    });

    //function sort by date
   /*  jQuery.extend( jQuery.fn.dataTableExt.oSort, {
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
    }); */

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
        var url = "FacturaProveedorDetalle.html?facproveId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteFactura(id) {
    var url = myconfig.apiUrl + "/api/facturasProveedores/nuevo/" + id + "/" + usuario.nombre;
    // mensaje de confirmación
    var mens = "¿Qué desea hacer con este registro?";
    mens += "<ul>"
    mens += "<li><strong>Descontabilizar:</strong> Elimina la marca de contabilizada, con lo que puede ser contabilizada de nuevo</li>";
    mens += "<li><strong>Borrar:</strong> Elimina completamente la factura. ¡¡ Atención !! Puede dejar huecos en los números de factura de la serie</li>";
    mens += "</ul>"
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Cancelar][Descontabilizar factura][Borrar factura]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Borrar factura") {
            
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
                        mostrarMensajeFacturaBorrada();
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
        if (ButtonPressed === "Descontabilizar factura") {
            var data = { facturaId: id };
            llamadaAjax("POST", myconfig.apiUrl + "/api/facturasProveedores/descontabilizar/" + id, null, function (err, data) {
                if (err) return;
                $('#chkTodos').prop('checked',false);
                if(data.changedRows > 0) {
                    mostrarMensajeFacturaDescontabilizada();
                } else {
                    mostrarMensajeFacturaNoCambiada();
                }
                buscarFacturas()();
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
    var sinDocPago = $('#chkSinDocPago').prop('checked');
    var busquedaFacturas = 
        {
            empresaId:vm.sempresaId(),
            dFecha: vm.dFecha(),
            hFecha: vm.hFecha(),
            contabilizadas: contabilizadas,
            sinDocPago: sinDocPago,
            filtroFecha: vm.filtroFecha()
        }
    setCookie("filtro_facproves", JSON.stringify(busquedaFacturas), 1);
    var url = "FacturaProveedorDetalle.html?facproveId=" + id;
    window.open(url, '_self');
}



function cargarFacturas2(id) {
    var mf = function() {
        var colaborador = 0;
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
            var usu = usuario.usuarioId;
            var dep = vm.sdepartamentoId();
            var emp =  vm.sempresaId();
            var filtroFecha = vm.filtroFecha();
            var sinDocPago = $('#chkSinDocPago').prop('checked');
            var url = "/api/facturasProveedores/usuario/logado/departamento/" 
            + usu
            + "/" + dep
            + "/" + dFecha 
            + "/" + hFecha 
            + "/" + emp
            + "/" + colaborador 
            + "/" + filtroFecha
            + "/" + sinDocPago

            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + url,
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
        var colaborador = 0;
        var dFecha = null;
        if(vm.dFecha())  dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        hFecha = vm.hFecha();
        if(hFecha == '' || hFecha == undefined) hFecha = null;
        if(hFecha != null) {
            if(hFecha != null) hFecha = moment(hFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(!datosOK()) return;
        }

        var usu = usuario.usuarioId;
        var dep = vm.sdepartamentoId();
        var emp =  vm.sempresaId();
        var filtroFecha = vm.filtroFecha();
        var sinDocPago = $('#chkSinDocPago').prop('checked');

        var url = "/api/facturasProveedores/usuario/logado/departamento/all/" 
            + usu
            + "/" + dep
            + "/" + dFecha 
            + "/" + hFecha 
            + "/" + emp
            + "/" + colaborador 
            + "/" + filtroFecha
            + "/" + sinDocPago

        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + url,
            dataType: "json",
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
    window.open(url, "_self");
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
    var returnUrl = "FacturaProveedorGeneral.html?cleaned=true"
    deleteCookie('filtro_facproves');
    tablaFacturas.state.clear();
    window.open(returnUrl, '_self');
}

imprimirFactura = function () {
    var url = "InfFacturasProveedores.html";
    window.open(url, '_self');
}

var mostrarMensajeFacturaDescontabilizada = function () {
    var mens = "La factura se ha descontabilizado correctamente.";
    mensNormal(mens);
}

var mostrarMensajeFacturaBorrada = function () {
    var mens = "La factura se ha borrado correctamente.";
    mensNormal(mens);
}

var mostrarMensajeFacturaNoCambiada = function () {
    var mens = "La factura NO se ha descontabilizado, es posible que no estubise contabilizada.";
    mensAlerta(mens);
}   

//FUNCIONES RELACIONADAS CON EL MODAL DOCPAGO 

function initModal(facproveId) {
    init++

    $('#modalDocPago').on('hidden.bs.modal', function () {
        $('#modalDocPago').off('show.bs.modal');
    });
    
    if(init == 1){
        $('#modalDocPago').on('show.bs.modal', function (e) {
            initTablaDocpago(facproveId);
        })
    }else {
        cargadDocpago()(facproveId);
    }
}

function initTablaDocpago(facproveId) {
    tablaCarro = $('#dt_docpago').dataTable({
        
        autoWidth: true,
        paging: true,
        
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
        data: datadocpago,
        columns: [{
            data: "nombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "nombreFacprovePdf",
           
        },  {
            data: "documentoPagoId",
            render: function (data, type, row) {
                var bt1 = "";
                if(usuario.puedeEditar) {
                    bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteDocpago(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                }
              
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editDocpago(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });
    if(init == 1){
        cargadDocpago()(facproveId);
    }
}

function cargadDocpago() {
    var mf = function (facproveId) {
        if (facproveId) {
            var data = null;
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/documentos_pago/buscar/docpago/factura/" + facproveId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaDocpago(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    $('#modalDocPago').modal('hide');
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    };
    return mf;
}

function loadTablaDocpago(data) {
    var dt = $('#dt_docpago').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function editDocpago(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "DocumentoPagoDetalle.html?DocumentoPagoId=" + id;
    window.open(url, '_blank');
}


function deleteDocpago(id) {
    var url = myconfig.apiUrl + "/api/facturasProveedores/nuevo/" + id + "/" + usuario.nombre;
    // mensaje de confirmación
    var mens = "Se borrará el documento de pago y cualquier registro vinculado a el dejará de estarlo, ¿Desea continuar?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Cancelar][Borrar documento de pago]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Borrar documento de pago") {
            
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/documentos_pago/" + id,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    $("#modalDocPago").modal('hide');
                    mensNormal("Documento de pago borrado correctamente");
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


