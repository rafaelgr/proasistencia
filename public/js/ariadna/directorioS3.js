// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataRondasRealizadas;
var rondaRealizadaId;
var directorio
var objectsS3 = [];
var parametros = {};

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    directorio = gup('dir');

    if(directorio != "facturas_proveedores/") $('#frmBuscarFacproves').hide();
    if(directorio != "facturas/") $('#frmBuscarFacturas').hide()

    vm = new admData();
    ko.applyBindings(vm);

    $('#btndescargarFacproves').click(descargarRenombrarFacproves2);

  
    
    $('#btndescargarFacturas').click(descargarRenombrarFacturas);
    
     // 7 bind to events triggered on the tree
     $('#jstreeDocumentacion').on("click.jstree", function (e) {
        var node = $(e.target).closest('.jstree-node');
        var selectedNodeId = node.attr('id');
        if (e.which === 1) {
            var jsTree = $.jstree.reference(e.target);
            var originalNode = jsTree.get_node(node);
            if(!originalNode.data.folder)  {
                var url = originalNode.original.location;
                window.open(url, '_blank');
            }
        }
});

// 8 interact with the tree - either way is OK
$('#demo').on('click', function () {
  $('#jstreeDocumentacion').jstree(true).select_node('child_node_1');
  $('#jstreeDocumentacion').jstree('select_node', 'child_node_1');
  $.jstree.reference('#jstreeDocumentacion').select_node('child_node_1');
});

/* var to = false;
    $('#search-input').keyup(function () {
      if(to) { clearTimeout(to); }
      to = setTimeout(function () {
        var v = $('#search-input').val();
        $('#jstreeDocumentacion').jstree(true).search(v);
      }, 250);
    }); */
    $("#frmBuscarFacproves").submit(function () {
        return false;
    });

    $("#frmBuscarFacturas").submit(function () {
        return false;
    });

    $('#cmbAnos').select2(select2Spanish());
    loadAnyos();

    $('#cmbAnos2').select2(select2Spanish());
    loadAnyos2();

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas(2);

    $("#cmbEmpresas2").select2(select2Spanish());
    loadEmpresas2(2);

    $("#cmbProveedores").select2(select2Spanish());
    loadProveedores(0);

    //initAutoProveedor();


    initArbolDocumentacion();
    getObjectsdocumentacion() 
}

function admData() {
    var self = this;

    //COMBO EMPRESA
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    
    //COMBO AÑOS
    self.optionsAnos = ko.observableArray([]);
    self.ano = ko.observable(); 
    self.sano = ko.observable();
    self.selectedAnos = ko.observableArray([]);
    
    //COMBO EMPRESA 2
    self.empresaId2 = ko.observable();
    self.sempresaId2 = ko.observable();
    //
    self.posiblesEmpresas2 = ko.observableArray([]);
    self.elegidosEmpresas2 = ko.observableArray([]);
    
    //COMBO AÑOS 2
    self.optionsAnos2 = ko.observableArray([]);
    self.ano2 = ko.observable(); 
    self.sano2 = ko.observable();
    self.selectedAnos2 = ko.observableArray([]);

    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
    
} 

function   loadAnyos(){
    //recuperamos los años que hay en las facturas de proveedores en la base de datos
    llamadaAjax("GET", "/api/facturasProveedores/get-anyos/facprove", null, function (err, data) {
        console.log(data);
        if (err) return;
        var anos = [];
        var ano = {}
        var anoText;
        var d = new Date();
        var n = d.getFullYear();//estableceremos el año actual por defecto en el desplegable
        var t = data[0].ano.toString();
        vm.sano(t);
        for(var i = 0; i < data.length; i++){
            var s = data[i];
            anoText = s.ano.toString();
          ano = {
            nombreAno: anoText,
            ano: s.ano
          };
          anos.push(ano);
        }
        vm.optionsAnos(anos);
        $("#cmbAnos").val([n]).trigger('change');
    });
}

function   loadAnyos2(){
    //recuperamos los años que hay en las facturas de proveedores en la base de datos
    llamadaAjax("GET", "/api/facturasProveedores/get-anyos/facprove", null, function (err, data) {
        console.log(data);
        if (err) return;
        var anos = [];
        var ano = {}
        var anoText;
        var d = new Date();
        var n = d.getFullYear();//estableceremos el año actual por defecto en el desplegable
        var t = data[0].ano.toString();
        vm.sano2(t);
        for(var i = 0; i < data.length; i++){
            var s = data[i];
            anoText = s.ano.toString();
          ano = {
            nombreAno: anoText,
            ano: s.ano
          };
          anos.push(ano);
        }
        vm.optionsAnos2(anos);
        $("#cmbAnos2").val([n]).trigger('change');
    });
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

function loadEmpresas2(id) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas2(empresas);
        vm.sempresaId2(id);
        $("#cmbEmpresas2").val([id]).trigger('change');
    });
}

function loadProveedores(proveedorId) {
    llamadaAjax("GET", "/api/proveedores", null, function (err, data) {
        if (err) return;
        var proveedores = [{ proveedorId: 0, nombre: "" }].concat(data);
        vm.posiblesProveedores(proveedores);
        vm.proveedorId(proveedorId);
        vm.sproveedorId(proveedorId);
        $("#cmbProveedores").val([proveedorId]).trigger('change');
    });
}


// initAutoProveedor
// inicializa el control del Proveedor como un autocomplete
var initAutoProveedor = function () {
    // incialización propiamente dicha
    $("#txtProveedor").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("GET", "/api/proveedores/activos/proveedores/todos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nomconcat,
                        id: d.proveedorId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.sproveedorId(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("proveedorNecesario", function (value, element) {
        var r = false;
        if (vm.sproveedorId()) r = true;
        return r;
    }, "Debe seleccionar un Proveedor válido");
};
//FUNCIONES DE DESCARGAR Y RENOMBRAR FACTURAS DE GASTOS

var descargarRenombrarFacproves = function() {
    if(objectsS3.length == 0) return;
    //
    var a = vm.sempresaId2().toString();
    var b = vm.sano2().toString();
    var patronTexto = b + "-" + a;
    //patronTexto = patronTexto.toString();
    selectObjectsFacprove(patronTexto)
    .then(objetosFiltrados => {
        renombrarObjetosFacprove(objetosFiltrados)
        .then((objetosRenombrados) => {
            descargarObjetosFacprove(objetosRenombrados)
            .then(() => {
                console.log('Descarga completa');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

var descargarRenombrarFacproves2 = function() {
    if(objectsS3.length == 0) return;
    //
    var arr = [];
    var obj = {}
    var a = vm.sempresaId2().toString();
    var b = vm.sano2().toString();
    var patronTexto = b + "-" + a;

    llamadaAjax("GET", "/api/facturasProveedores/anyo/empresa/proveedor/" + a + "/" + b + "/" + vm.sproveedorId(), null, function (err, data) {
        if (err) return;
        if(data.length == 0) return;
        for(let i = 0; i < data.length; i++) {
            obj = {
                Key: "facturas_proveedores/" + data[i].nombreFacprovePdf
            }
            arr.push(obj);
        }
        renombrarObjetosFacprove(arr)
        .then((objetosRenombrados) => {
            descargarObjetosFacprove(objetosRenombrados)
            .then(() => {
                console.log('Descarga completa');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    });
    //patronTexto = patronTexto.toString();
    
}


async function selectObjectsFacprove(patronTexto) {
     // Filtrar los objetos según el patrón de texto
     let objetosFiltrados = objectsS3.filter(objeto => {
        return objeto.Key.includes(patronTexto); // Puedes ajustar aquí tu criterio de filtrado
    });
    return objetosFiltrados;
}

async function renombrarObjetosFacprove(obj) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: "/api/facturasProveedores/recupera/numregis",
            method: 'PUT',
            contentType: 'application/json', // Establece el tipo de contenido a JSON
            data: JSON.stringify(obj), // Convierte el array a formato JSON
            success: function(response) {
                // Resuelve la promesa con la respuesta recibida
                resolve(response);
            },
            error: function(xhr, status, error) {
                // Rechaza la promesa con el error
                mensError("Fallo al renombrar los archivos.");
                reject(error);
            }
        });
    });
}

async function descargarObjetosFacprove(objetos) {
    AWS.config.region = parametros.bucket_region_server; // Región
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: parametros.identity_pool_server,
    });
    const s3 = new AWS.S3();

    for (const objeto of objetos) {
        const params = {
            Bucket: parametros.bucket_server,
            Key: objeto.Key,
        };

        try {
            const { Body } = await s3.getObject(params).promise();
            const url = URL.createObjectURL(new Blob([Body]));
            const nombreDescarga = objeto.RenombrarA; // Usa el nombre de descarga alternativo si está definido
            descargarArchivo(url, nombreDescarga);
        } catch (error) {
            console.error(`Error al descargar el objeto ${objeto.Key}: ${error}`);
        }
    }
}



//FUNCIONES DE DESCARGAR Y RENOMBRER FACTURAS
var descargarRenombrarFacturas = function() {
    var a = vm.sempresaId().toString();
    var b = vm.sano().toString();
    llamadaAjax("GET", "/api/facturas/busca/key/documentacion/" + a + "/" + b, null, function (err, data) {
       if(data) {
        descargarObjetosFacturas(data)
        .then(() => {
            console.log('Descarga completa');
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
       }
    });
    

}

/* var descargarRenombrarFacturas = function() {
    if(objectsS3.length == 0) return;
    //Buscamos 
    var a = vm.sempresaId().toString();
    var b = vm.sano().toString();
    var patronTexto = b + "-" + a;
    //patronTexto = patronTexto.toString();
    selectObjects(patronTexto)
    .then(objetosFiltrados => {
        renombrarObjetosFacturas(objetosFiltrados)
        .then((objetosRenombrados) => {
            descargarObjetosFacturas(objetosRenombrados)
            .then(() => {
                console.log('Descarga completa');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
} */
async function selectObjectsFacturas(patronTexto) {
    // Filtrar los objetos según el patrón de texto
    let objetosFiltrados = objectsS3.filter(objeto => {
       return objeto.Key.includes(patronTexto); // Puedes ajustar aquí tu criterio de filtrado
   });
   return objetosFiltrados;
}

async function renombrarObjetosFacturas(obj) {
   return new Promise(function(resolve, reject) {
       $.ajax({
           url: "/api/facturasProveedores/recupera/numregis",
           method: 'PUT',
           contentType: 'application/json', // Establece el tipo de contenido a JSON
           data: JSON.stringify(obj), // Convierte el array a formato JSON
           success: function(response) {
               // Resuelve la promesa con la respuesta recibida
               resolve(response);
           },
           error: function(xhr, status, error) {
               // Rechaza la promesa con el error
               mensError("Fallo al renombrar los archivos.");
               reject(error);
           }
       });
   });
}

async function descargarObjetosFacturas(objetos) {
    AWS.config.region = parametros.bucket_region_server; // Región
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: parametros.identity_pool_server,
    });
    const s3 = new AWS.S3();

    for (const objeto of objetos) {
        const params = {
            Bucket: parametros.bucket_server,
            Key: objeto.vFact,
        };

        try {
            const { Body } = await s3.getObject(params).promise();
            const url = URL.createObjectURL(new Blob([Body]));
            const nombreDescarga = objeto.vFact; // Usa el nombre de descarga alternativo si está definido
            descargarArchivo(url, nombreDescarga);
        } catch (error) {
            console.error(`Error al descargar el objeto ${objeto.Key}: ${error}`);
        }
    }
}



///
function initArbolDocumentacion() {
    $('#jstreeDocumentacion').jstree({ 'core' : 
    {
        'data' : [],
    },
    'check_callback' : true,
    "plugins" : [ "themes", "html_data", "ui", "crrm", "contextmenu", "search" ],
    "select_node": true,
    'multiple': true, // Habilita la selección múltiple
    'contextmenu': {
        'items': function(node) {
            var menuItems = {
            // Define las opciones del menú contextual para cada nodo
         
            'Option 1': {
                'label': 'Descargar',
                'action': function(a, b , c) {
                    const selectedNodes = $('#jstreeDocumentacion').jstree('get_selected', true);
                    for (let i = 0; i < selectedNodes.length; i++) {
                        descargaObjectdocumentacion(selectedNodes[i].original);
                    }
                }
              } 
            } 
            return menuItems;
        }
    }
});

}
async function listAllObjectsWithSignedUrls(parametros) {
    AWS.config.region = parametros.bucket_region_server;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: parametros.identity_pool_server,
    });
    var s3 = new AWS.S3();
  
    let objects = [];
    let continuationToken = null;
  
    do {
      const params = {
        Bucket: parametros.bucket_server,
        Prefix: directorio,
        ContinuationToken: continuationToken,
      };
  
      const response = await s3.listObjectsV2(params).promise();
      objects = objects.concat(response.Contents);
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  
    // Ahora genero URL firmadas para cada objeto
    for (const obj of objects) {
      obj.signedUrl = s3.getSignedUrl('getObject', {
        Bucket: parametros.bucket_server,
        Key: obj.Key,
        Expires: 300 // duración en segundos (5 minutos)
      });
    }
  
    objectsS3 = objects;
    return objects;
  }
  

  async function getObjectsdocumentacion() {
    llamadaAjax('GET', "/api/parametros/0", null, async function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      const parametros = data;
  
      try {
        const objetos = await listAllObjectsWithSignedUrls(parametros);
  
        let carpetas = [];
        let archivos = [];
        let id = 1;
        let documentoId = 1;
        let antCarpeta = null;
  
        objetos.forEach(e => {
          // Extraer nombre carpeta por el prefijo antes de "/"
          const indexSlash = e.Key.indexOf("/");
          const carpetaNombre = indexSlash > -1 ? e.Key.substring(0, indexSlash) : "SinCarpeta";
  
          if (!antCarpeta) {
            carpetas.push({ carpetaNombre, carpetaId: id });
            archivos.push({ data: e, carpetaId: id, documentoId });
            antCarpeta = carpetaNombre;
          } else {
            if (carpetaNombre !== antCarpeta) {
              id++;
              carpetas.push({ carpetaNombre, carpetaId: id });
              archivos.push({ data: e, carpetaId: id, documentoId });
              antCarpeta = carpetaNombre;
            } else {
              archivos.push({ data: e, carpetaId: id, documentoId });
            }
          }
          documentoId++;
        });
  
        const regs = ProcesaDocumObjTree(archivos, carpetas);
        loadDocumentacionTree(regs);
  
      } catch (error) {
        console.error("Error al listar o generar URLs firmadas:", error);
      }
    });
  }



function descargarArchivo(url, nombreArchivo) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo);
    link.setAttribute('target', '_blank'); // Agregar el atributo target="_blank"
    document.body.appendChild(link);
    link.click();
}

async function getSignedUrlForObject(bucket, key) {
    const s3 = new AWS.S3();
    const params = { Bucket: bucket, Key: key, Expires: 300 }; // 5 minutos
  
    return s3.getSignedUrlPromise('getObject', params);
  }


function descargaObjectdocumentacion(obj) {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        var parametros = data;
       
        // Reemplaza con la URL de tu objeto S3
        const s3Url = parametros.raiz_url_server + obj.key;

        // Nombre con el que se guardará el archivo en el navegador
        l = obj.key.split('/');
        index = l.length - 1;
        const fileName = l[index];

        downloadS3Object(s3Url, fileName);
    });
}

function downloadS3Object(s3Url, fileName) {

// Función para descargar el archivo desde S3
  fetch(s3Url, {
    method: 'GET',
  })
    .then((response) => {
        return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = s3Url.split('/').pop(); // Nombre del archivo basado en la URL
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error al descargar el objeto S3:', error);
    });
}


function loadDocumentacionTree(data) {
   /*  var cont = 50
    var d = [];
    for(i=0; i < cont; i++) {
        d.push(data[i]);
    } */
    if(data.length == 0) return;
   /*  var obj = d;
    console.log(d); */
    $('#jstreeDocumentacion').jstree(true).settings.core.data = data;
    $('#jstreeDocumentacion').jstree(true).refresh();
}

function ProcesaDocumObjTree(doc, carpeta) {
	//if((doc.length == 1 && !doc[0].facproveId) || (doc.length == 1 && !doc[0].antproveId)) return doc;
	var antdir = null;
	var cont = 1;
	var regs = [];
	var docObj = {
		
	};
	var dirObj = {
		
	};
    var l = [];
    var index;

	carpeta.forEach(d => {
        doc.forEach(e => {
		if(antdir) {
			if(antdir == d.carpetaId ) {
                    l = e.data.Key.split('/');
                    index = l.length - 1;
                    var s = parseInt(e.data.Size);
                    var r = s / 1024;
                    r = roundToTwo(r).toString()
                    //var html = '<div style="width: 100%"><span style="width: 20%;text-align: left;">' + l[index] + '</span><span  style="width: 20%;text-align: left;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</span><span style="width: 20%;text-align: left;">' + r + ' KB ' + '</span></div>'
                    //var html = '<ul style="list-style-type: none; color: black"><li style="display: inline; margin-right: 10px;">' + l[index] + '</li><li style="display: inline; margin-right: 10px;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</li><li style="display: inline; margin-right: 10px;">' + r + ' KB ' + '</li></ul>'
					docObj = {
                        documentoId: e.documentoId,
						location: e.data.signedUrl,
                        key: e.data.Key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent:  'c' + d.carpetaId,
                        icon: "glyphicon glyphicon-file"
					};
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				
                antdir = d.carpetaId;
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				
                l = d.carpetaNombre.split('/');
                index = l.length - 1;
				dirObj = {
					carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
                    text:  l[index],
                    id:  'c' + d.carpetaId,
                    data: { "folder" : true },
                    parent: '#',
				    documentos: [],
				};
                regs.push(dirObj);
                //if(!d.carpetaPadreId) dirObj.parent = '#';
				
                    l = e.data.Key.split('/');
                    index = l.length - 1;
                    var s = parseInt(e.data.Size);
                    var r = s / 1024;
                    r = roundToTwo(r).toString()
                    //var html = '<span style="margin-right: 30px;">' + l[index] + '</span><span  style="margin-right: 30px;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</span><span style="margin-right: 30px;">' + r + ' KB ' + '</span>'
					docObj = {
                        documentoId: e.documentoId,
                        location: e.data.signedUrl,
                        key: e.data.Key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent:  'c100',
                        icon: "glyphicon glyphicon-file"
						
					};
					
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				

				
				antdir = d.carpetaId;
			} 

		}
		if(!antdir) {
            l = d.carpetaNombre.split('/');
            index = l.length - 1;
			dirObj = {
				carpetaNombre: d.carpetaNombre,
                carpetaId: d.carpetaId,
                text: l[index],
                state: { "opened": true },
                id:  'c' + d.carpetaId,
                data: { "folder" : true },
                parent: '#',
				documentos: [],
			};
            //if(!d.carpetaPadreId) dirObj.parent = '#';
            regs.push(dirObj);
			if(e.documentoId) {
                l = e.data.Key.split('/');
                index = l.length - 1;
                var s = parseInt(e.data.Size);
                var r = s / 1024;
                r = roundToTwo(r).toString()
                //var html = '<span style="margin-right: 30px;">' + l[index] + '</span><span  style="margin-right: 30px;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</span><span style="margin-right: 30px;">' + r + ' KB ' + '</span>'
				docObj = {
                    documentoId: e.documentoId,
                    location: e.data.signedUrl,
                    key: e.data.Key,
                    text: l[index],
                    id: e.documentoId,
                    data: { "folder" : false },
                    parent:   'c' + d.carpetaId,
                    icon: "glyphicon glyphicon-file"
                };
                
				if(d.carpetaId == e.carpetaId) {
                    regs.push(docObj);
                }
				docObj = {};
			}
            antdir = d.carpetaId;
		}
        });
        //si se trata del ultimo registro lo guardamos
		/* if(cont == carpeta.length) {
			regs.push(dirObj);
		} */
		cont++;

	});
    

	return regs;
}


