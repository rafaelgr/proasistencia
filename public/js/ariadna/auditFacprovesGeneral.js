/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página PrefacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacturas;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
var tablaFacturas;

function initForm() {
    comprobarLogin();
    datePickerSpanish(); // see comun.js
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(cargarFacturas2());
   
    $('#frmBuscar').submit(function () {
        return false
    });

    vm = new admData();
    ko.applyBindings(vm);
    vm.dFecha(null);
    vm.hFecha(null);

   

    
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

    

   
   
}

function admData() {
    var self = this;
    
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    
} 


function initTablaFacturas() {
    tablaFacturas = $('#dt_facturas').DataTable({
        bSort: true,
        paging: true,
        "pageLength": 100,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_facturas'), breakpointDefinition);
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
            data: "auditFacprovesId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                return html;
            }
        }, {
            data: "referencia"
        }, {
            data: "numFactu"
        }, {
            data: "numFactu2"
        }, {
            data: "cambio",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },{
            data: "tipo"
        },  {
            data: "usuario"
        }]
    });

    // Apply the filter
    $("#dt_facturas thead th input[type=text]").on('keyup change', function () {
        tablaFacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}


function loadTablaFacturas(data) {
    var dt = $('#dt_facturas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}



function cargarFacturas2() {
    var mf = function() {
        if(!datosOK()) return;
        var dFecha = moment(vm.dFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var hFecha = moment(vm.hFecha(), 'DD/MM/YYYY').format('YYYY-MM-DD');
       
     
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/todos/los/registros/tabla/auditada/" + dFecha + "/" + hFecha,
            dataType: "json",
            contentType: "application/json",
            data: null,
            success: function (data, status) {
                loadTablaFacturas(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
        
    }
    return mf
}




function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtHastaFecha: {
                required: true,
                greaterThan: "#txtDesdeFecha"
            },
            txtDesdeFecha: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtHastaFecha: {
                required: "Este campo es obligatorio"
            },
            txtDesdeFecha: {
                required: "Este campo es obligatorio"
            }

        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}



