// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataRondasRealizadas;
var rondaRealizadaId;


var usuario;
var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();

    vm = new admData();
    ko.applyBindings(vm);

    //recuperamos el departaemnto de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
    });

    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
    });

    // de smart admin
    pageSetUp();
    getVersionFooter();
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
} 

