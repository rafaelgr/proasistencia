﻿/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacturaGeneral.html

---------------------------------------------------------------------------*/
var dataFacturas;
var facturaId;
var usuario;
var filtros = {};
var cargaFacturas = false;
var antDepartamentoId = 0;

function initForm() {
    comprobarLogin();
    datePickerSpanish(); // see comun.js

    vm = new admData();
    ko.applyBindings(vm);
    usuario = recuperarUsuario();
    filtros = getCookie('filtro_facturas');
    if(filtros != undefined) {
        filtros = JSON.parse(filtros);
    }
    
    initTablaFacturas();

    var conservaFiltro = gup("ConservaFiltro");
    var cleaned = gup("cleaned");
    if(conservaFiltro != 'true' && cleaned != 'true') limpiarFiltros();

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

   
    recuperaDepartamento(function(err, data) {
        if(err) return;
        if(data) {
            // comprobamos parámetros
            facturaId = gup('FacturaId');
            var f = facturaId;
            if(facturaId = '') {
                f = null
            }
             compruebaFiltros(f);

        }
    });

     //Evento asociado al cambio de departamento
     $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        // comprobamos parámetros
        facturaId = gup('FacturaId');
        var f = facturaId;
        if(facturaId = '') {
            f = null
        }
         //compruebaFiltros(f);
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        if( !$('#chkTodos').prop('checked') ) {
            if(this.value != antDepartamentoId) {
                cargarFacturas2()();
            } else {
                setTimeout(function() {
                    cargarFacturas2(f)();
                }, 1000);
                
            }
        } else {
            cargarFacturas2All()();
        }
        antDepartamentoId = this.value;
    });

    $("#cmbEmpresas").select2(select2Spanish());
    

    // de smart admin
    pageSetUp();
    getVersionFooter();
    
    //
    $('#btnBuscar').click(buscarFacturas());
    $('#btnAlta').click(crearFactura());
    $('#btnPrint').click(imprimirFactura);
    $('#btnLimpiar').click(limpiarFiltros);
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarFacturas();
    //});
    //
    
    
    $('#chkTodos').change(function () {
        if (this.checked) {
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
} 




function compruebaFiltros(id) {
    if(filtros) {
        vm.dFecha(filtros.dFecha);
        vm.hFecha(filtros.hFecha);
        loadEmpresas(filtros.empresaId);
        vm.sempresaId(filtros.empresaId);
        if(filtros.contabilizadas == true) {
            $('#chkTodos').prop('checked', true);
            if(id > 0) {
                setTimeout(function() {
                    cargarFacturas2(id)();
                }, 1000);
               
            } else {
                cargarFacturas2All()();
            }
        } else {
            $('#chkTodos').prop('checked', false);
            setTimeout(function() {
                cargarFacturas2(id)();
            }, 1000);
        }
       /*  if(id) {
            cargarFacturas2()(id);
        } */
    } else{
        vm.sempresaId(0);
        loadEmpresas(0);
        estableceFechaEjercicio();
        if(id) {
            setTimeout(function() {
                cargarFacturas2(id)();
            }, 1000);
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
        responsive: true,
        paging: true,
        "pageLength": 100,
        "stateSave": true,
        "stateLoaded": function (settings, state) {
            state.columns.forEach(function (column, index) {
                $('#' + settings.sTableId + '-head-filter-' + index).val(column.search.search);
             });
        },
        "aoColumnDefs": [
            { "sType": "date-uk", "aTargets": [6] },
        ],
        columnDefs: [
            {
                targets: 13, // El número de la columna que deseas mantener siempre visible (0 es la primera columna).
                className: 'all', // Agrega la clase 'all' para que la columna esté siempre visible.
            }
        ],
        dom: "<'dt-toolbar'<'col-xs-12 col-sm-6'B><'col-sm-6 col-xs-6'f>>" +
             "rt" +
             "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-sm-6 col-xs-12'p>>",
        
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
            data: "facturaId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (row.contafich || row.contabilizada) {
                    html = "<i class='fa fa-file'></i>";
                }
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
            data: "nombreAgente",
            render: function (data, type, row) {
                if(!data || data =="") return "";
                return data;
            }
        },{
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
            data: "vFac"
        }, {
            data: "vFPago"
        }, {
            data: "observaciones"
        }, {
            data: "dirTrabajo"
        }, {
            data: "facturaId",
            render: function (data, type, row) {
                var bt1 = "";
                if(!row.contabilizada || usuario.puedeEditar) {
                    var bt1 = "<button class='btn btn-circle btn-danger' onclick='compruebaNumero(" + data + ","+row.departamentoId+ ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                }
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
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

    // Hide some columns by default
    tablaFacturas.columns(9).visible(false);
    tablaFacturas.columns(11).visible(false);
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
        var url = "FacturaDetalle.html?FacturaId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteFactura(id, departamentoId) {
    // mensaje de confirmación
    var url = myconfig.apiUrl + "/api/facturas/" + id;
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
            mens = "<ul>"
            mens += "<li><strong>¡¡ Atención !! Se borrá tambien la liquidación asociada a la factura</strong></li>";
            mens += "<li>¿Desea continuar?</li>";
            mens += "</ul>"
            $.SmartMessageBox({
                title: "<i class='fa fa-info'></i> Mensaje",
                content: mens,
                buttons: '[Cancelar][Borrar]'
            },function (ButtonPressed2) {
                if (ButtonPressed2 === "Borrar") {
                    var data = { 
                        factura: {
                            facturaId: id,
                            departamentoId: departamentoId 
                        }
                    };
                    if(departamentoId == 7) {
                        url =  myconfig.apiUrl + "/api/facturas/parte/relacionado/" + id;
                    }
                    llamadaAjax("POST", myconfig.apiUrl + "/api/facturas/desmarcar-prefactura/" + id, null, function (err) {
                        if (err) return;
                        llamadaAjax("DELETE", myconfig.apiUrl + "/api/liquidaciones/borrar-factura/" + id, data,function (err) {
                            if (err) return;
                            llamadaAjax("DELETE", url, data, function (err) {
                                if (err) return;
                                mostrarMensajeFacturaBorrada();
                                buscarFacturas()();
                            });
                        });
                    });
                }
                if (ButtonPressed2 === "Cancelar") {
                    // no hacemos nada (no quiere borrar)
                }
            });
            
        }
        if (ButtonPressed === "Descontabilizar factura") {
            var data = { facturaId: id };
            llamadaAjax("POST", myconfig.apiUrl + "/api/facturas/descontabilizar/" + id, null, function (err, data) {
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

function compruebaNumero(facturaId, departamentoId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/facturas/buscar/ultimo/numero/conta/" +facturaId, null, function (err, reuslt) {
        if (err) return;
        if(reuslt == 'OK') {
            deleteFactura(facturaId, departamentoId);
        }
        else {
            mensError('Hay numeros posteriores, se va a dejar un hueco en contabilidad, no se puede borrar');
        }
       
    });
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

function editFactura(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    cargaFacturas = true;
    var contabilizadas = $('#chkTodos').prop('checked');
    var busquedaFacturas = 
        {
            empresaId:vm.sempresaId(),
            dFecha: vm.dFecha(),
            hFecha: vm.hFecha(),
            contabilizadas: contabilizadas
        }
    setCookie("filtro_facturas", JSON.stringify(busquedaFacturas), 1);
    var url = "FacturaDetalle.html?FacturaId=" + id;
    window.open(url, '_self');
}



function printFactura2(id) {
    var url = "InfFacturas.html?facturaId=" + id;
    window.open(url, '_new');
}

function printFactura(id) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/facturas/" + id, null, function (err, data) {
        if (err) return;
        empresaId = data.empresaId;
        llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + empresaId, null, function (err, empresa) {
            if (err) return;
            var shortid = "rJkSiTZ9g";
            if (empresa.infFacturas) shortid = empresa.infFacturas;
            var url = "/api/informes/facturas/" + id;
            if (shortid == "rJRv-UF3l" || shortid == "SynNJ46oe") {
                url = "/api/informes/facturas2/" + id;
            }
            llamadaAjax("GET", url, null, function (err, data) {
                if (err) return;
                informePDF(data, shortid);
            });
        });
    });
}

function informePDF(data, shortid) {
    var infData = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", infData);
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

function cargarFacturas2(id) {
    var mf = function() {
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = vm.hFecha();
        if(hFecha == '' || hFecha == undefined) hFecha = null;
        if(hFecha != null) {
            if(hFecha != null) hFecha = moment(hFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(!datosOK) return;
        }
        if (id) {
            var data = {
                id: id
            }

            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturas/agente/" + id,
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
            if(hFecha != null) {
                if(!datosOK()) return;
            }
            
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturas/usuario/logado/departamento/" +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha + "/" + vm.sempresaId(),
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
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = vm.hFecha();
        if(hFecha == '' || hFecha == undefined) hFecha = null;
        if(hFecha != null) {
            if(hFecha != null) hFecha = moment(hFecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if(!datosOK) return;
        }
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturas/usuario/logado/departamento/all/"  +usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + dFecha + "/" + hFecha + "/" + vm.sempresaId(),
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

imprimirFactura = function () {
    var url = "InfFacturas.html";
    window.open(url, '_blank');
}

var limpiarFiltros = function() {
    var returnUrl = "FacturaGeneral.html?cleaned=true"
    deleteCookie('filtro_facturas');
    tablaFacturas.state.clear();
    window.open(returnUrl, '_self');
    //window.location.reload();
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