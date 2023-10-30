// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataRondasRealizadas;
var rondaRealizadaId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();

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

var to = false;
    $('#search-input').keyup(function () {
      if(to) { clearTimeout(to); }
      to = setTimeout(function () {
        var v = $('#search-input').val();
        $('#jstreeDocumentacion').jstree(true).search(v);
      }, 250);
    });


initArbolDocumentacion();
getObjectsdocumentacion() 
}

function initArbolDocumentacion() {
    $('#jstreeDocumentacion').jstree({ 'core' : 
    {
        'data' : [],
    },
    'check_callback' : true,
    "plugins" : [ "themes", "html_data", "ui", "crrm", "contextmenu", "search" ],
    "select_node": true,
    'contextmenu': {
        'items': function(node) {
            var menuItems = {
            // Define las opciones del menú contextual para cada nodo
         
            'Option 1': {
                'label': 'Descargar',
                'action': function(a, b , c) {
                  console.log(node.type);
                  $('#modalUploadDoc').modal('show');
                  preparaDatosArchivo(node.original);
                }
              } 
            } 
            return menuItems;
        }
    }
});

}

// Función para listar objetos con paginación
async function listAllObjects() {
    let objects = [];
    let continuationToken = null;

    const params = {
        Bucket: "comercializa-server",
        Prefix: "facturas/",
        ContinuationToken: continuationToken
      };
  
      AWS.config.region = "eu-west-3"; // Región
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId:  "eu-west-3:2d09d557-1507-4aff-8c03-9bf7825c54cd",
      });
      var s3 = new AWS.S3({ params });
  
    do {
        const params = {
            Bucket: "comercializa-server",
            Prefix: "/facturas",
            ContinuationToken: continuationToken
          };
      const response = await s3.listObjectsV2(params).promise();
      objects = objects.concat(response.Contents);
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  
    return objects;
  }
  
function getObjectsdocumentacion() {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        var parametros = data;
        var carpetas = [];
        var id = 1;
        var documentoId = 1;
        var antCarpeta = null;
        //var obj = [];
        var archivos = [];
        var continuationToken = null;
        const params = {
            Bucket: "comercializa-server",
            Prefix: "facturas/",
            ContinuationToken: continuationToken
          };
      
          AWS.config.region = "eu-west-3"; // Región
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId:  "eu-west-3:2d09d557-1507-4aff-8c03-9bf7825c54cd",
          });
          var s3 = new AWS.S3({ params });

        listAllObjects(s3)
        .then(obj => {
            // objects contiene todos los objetos del bucket
             // Descargar archivos y guardarlos en el directorio temporal local
             obj.forEach(e => {
                const objetoURL = s3.getSignedUrl('getObject', {
                    Bucket: "comercializa-server",
                    Key: e.Key,
                    Expires: 3600 // Tiempo de expiración en segundos (1 hora en este caso)
                  });
                e.location = objetoURL
                var a = e.Key.indexOf("/");
                var b = e.Key.substring(0, a);
                if(!antCarpeta) {
                    carpetas.push( { carpetaNombre: b, carpetaId: id });
                    archivos.push( { data: e, carpetaId: id, documentoId: documentoId });
                    antCarpeta = b;
                } else {
                    if(b != antCarpeta) {
                        id++;
                        carpetas.push( { carpetaNombre: b, carpetaId: id });
                        archivos.push( {  data: e, carpetaId: id, documentoId: documentoId });
                        antCarpeta = b;
                    } else {
                        archivos.push( {  data: e, carpetaId: id, documentoId: documentoId })
                        antCarpeta = b;
                    }
                }
                documentoId++;
            });
            var regs = ProcesaDocumObjTree(archivos, carpetas)
            loadDocumentacionTree(regs);
          })
          .catch(error => {
            console.error('Error:', error);
          });
            
            /* AWS.config.region = "eu-west-3"; // Región
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId:  "eu-west-3:2d09d557-1507-4aff-8c03-9bf7825c54cd",
            });
            var prefix = "facturas/";
            var params = {
                Bucket: "comercializa-server",
                Prefix: prefix,
                Delimeter: ""
            }

            var s3 = new AWS.S3({ params });
            s3.listObjectsV2({}, (err, result) => {
                if (err) mensError('Error de lectura en la nube');
                console.log(result);
                if(result.Contents.length > 0) {
                    obj = result.Contents
                    const keys = obj.map((object) => object.Key);
        
                    // Descargar archivos y guardarlos en el directorio temporal local
                    obj.forEach(e => {
                        const objetoURL = s3.getSignedUrl('getObject', {
                            Bucket: "comercializa-server",
                            Key: e.Key,
                            Expires: 3600 // Tiempo de expiración en segundos (1 hora en este caso)
                          });
                        e.location = objetoURL
                        var a = e.Key.indexOf("/");
                        var b = e.Key.substring(0, a);
                        if(!antCarpeta) {
                            carpetas.push( { carpetaNombre: b, carpetaId: id });
                            archivos.push( { data: e, carpetaId: id, documentoId: documentoId });
                            antCarpeta = b;
                        } else {
                            if(b != antCarpeta) {
                                id++;
                                carpetas.push( { carpetaNombre: b, carpetaId: id });
                                archivos.push( {  data: e, carpetaId: id, documentoId: documentoId });
                                antCarpeta = b;
                            } else {
                                archivos.push( {  data: e, carpetaId: id, documentoId: documentoId })
                                antCarpeta = b;
                            }
                        }
                        documentoId++;
                    });
                    var regs = ProcesaDocumObjTree(archivos, carpetas)
                    loadDocumentacionTree(regs);
                }
            }); */
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
                    var html = '<span>' + l[index] + '  ' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '  ' + r + ' KB ' + '</span>'
					docObj = {
                        documentoId: e.documentoId,
						location: e.data.location,
                        key: e.data.Key,
                        text: html,
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent: 'c100',
                        icon: "glyphicon glyphicon-file"
					};
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				
                antdir = d.carpetaId;
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(dirObj);
                l = d.carpetaNombre.split('/');
                index = l.length - 1;
				dirObj = {
					carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
                    text:  l[index],
                    id: d.carpetaId,
                    data: { "folder" : true },
                    parent: '#',
				    documentos: [],
				};
                //if(!d.carpetaPadreId) dirObj.parent = '#';
				
                    l = e.data.Key.split('/');
                    index = l.length - 1;
					docObj = {
                        documentoId: e.documentoId,
                        location: e.data.location,
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
                id: 'c100',
                data: { "folder" : true },
                parent: '#',
				documentos: [],
			};
            //if(!d.carpetaPadreId) dirObj.parent = '#';
            regs.push(dirObj);
			if(e.documentoId) {
                l = e.data.Key.split('/');
                index = l.length - 1;
				docObj = {
                    documentoId: e.documentoId,
                    location: e.data.location,
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


