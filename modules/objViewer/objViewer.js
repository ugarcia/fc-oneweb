
var CAM_MOVE_SMOOTH = 0.01;
var baseModelsURL = "/OneWeb/resources/tmp/models/";

var container, camera, object, scene, renderer, 
    lastMousePos, submitFlag = false, modelFiles, modelURIs;

function receiveMessage(evt) 
{
    session = evt.data;
    updateSessionStatus();
    fitElementHeight("glContainer", 'footerRow', 30);
    initGL();
    animate();
}

function updateSessionStatus() 
{
    if (session.logged) {
        // TODO
    } else {
        // TODO
    }
} 

function loadFileList(files, target) {
    var output = [];
    modelURIs = [];
    for (var i = 0, f; f = files[i]; i++) {
        modelURIs[i] = URL.createObjectURL(f);
      output.push('<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    $('#'+target).html('<ul>' + output.join('') + '</ul>');
}
                                
function startup()
{
    checkAccess();
    checkSession(function(data) {
       session = data;
       updateSessionStatus();
    });
    window.addEventListener("message", receiveMessage, false);
    
    $('#inputModel').change(function(event) {
        loadFileList(event.target.files, 'modelFilesTd');
    });
    
    fitElementHeight("glContainer", 'footerRow', 30);
    initGL();
    animate();
}



function initGL() 
{
    container = document.getElementById( 'glContainer' );
    container.innerHTML = "";
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild( renderer.domElement );
    // scene
    scene = new THREE.Scene();
    // camera
    camera = new ExploringCamera( 45, container.offsetWidth/ container.offsetHeight, 1, 100 );
    camera.distance = 20;
    camera.setView();
    // ambient light
    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
    // directional light
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );
    // Initial event listeners
    container.addEventListener( 'mousedown', onDocumentMouseDown, false );
    container.addEventListener("mousewheel", onDocumentMouseWheel, false);
    //For firefox only
    container.addEventListener("DOMMouseScroll", onDocumentMouseWheel, false);
    
    container.addEventListener( 'resize', onDocumentResize, false );
}

function onDocumentResize() 
{
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
}

function onDocumentMouseDown( event ) 
{
    container.removeEventListener( 'mousedown', onDocumentMouseDown, false );
    container.addEventListener( 'mousemove', onDocumentMouseMove, false );
    container.addEventListener( 'mouseup', onDocumentMouseUp, false );
    lastMousePos = getMousePos(this, event);
}

function onDocumentMouseUp( event ) 
{
    container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    container.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    container.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function onDocumentMouseMove( event ) 
{
    var mousePos = getMousePos(this, event);
    var diffX = mousePos.x - lastMousePos.x;
    var diffY = mousePos.y - lastMousePos.y;
    camera.angY = adjustAngle(camera.angY - (diffX * CAM_MOVE_SMOOTH));
    camera.angX += (diffY * CAM_MOVE_SMOOTH);
    if (Math.abs(camera.angX)>=Math.PI/2)
        camera.angX -= (diffY * CAM_MOVE_SMOOTH);
    camera.setView();
    lastMousePos = mousePos;
}

function onDocumentMouseWheel( event )
{
    var delta = Math.max(-1, Math.min(1, ( event.wheelDelta || -event.detail )));
    camera.distance -= delta;
    camera.setView();
}

function animate() 
{
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

function loadModel()
{
    if (!submitFlag)
        return;
    submitFlag = false;
    var select = document.getElementById("typeSelect");
    var selectedOption = select.options[select.selectedIndex].value;
    if (object)
            scene.remove(object);
    if (selectedOption == 'obj') {
        var loader = new THREE.OBJMTLLoader();
        loader.addEventListener( 'load', function ( event ) {
            object = event.content;
            scene.add( object );
        });
        var objFile, mtlFile;
        for (var i = 0; i < modelFiles.length; i++) {
            var aux =  modelFiles.item(i).name.split(".");
            if (aux[aux.length-1] == 'obj')
                objFile = modelURIs[i];// baseModelsURL + modelFiles.item(i).name;
            else if (aux[aux.length-1] == 'mtl')
                mtlFile = modelURIs[i];// baseModelsURL + modelFiles.item(i).name;
        }
        loader.load( objFile, mtlFile );
    }  else if (selectedOption == 'json') {
        var loader = new THREE.JSONLoader();
        var objFile;
        for (var i = 0; i < modelFiles.length; i++) {
            var aux =  modelFiles.item(i).name.split(".");
            if (aux[aux.length-1] == 'js')
                objFile = baseModelsURL + modelFiles.item(i).name;
        }
        loader.load( objFile , function( geometry ) { 
            scene.add( new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() ) );
        } );
    }  else if (selectedOption == 'dae') {
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        var objFile;
        for (var i = 0; i < modelFiles.length; i++) {
            var aux =  modelFiles.item(i).name.split(".");
            if (aux[aux.length-1] == 'dae')
                objFile = baseModelsURL + modelFiles.item(i).name;
        }
        loader.load( objFile, function ( collada ) {
            object = collada.scene;
            skin = collada.skins[ 0 ];
            object.updateMatrix(); 
            scene.add( object );
        } );
    }
}

function submitModel()
{
    modelFiles = document.getElementById("inputModel").files;
    
    //TODO review this!!
    submitFlag = true;
    return false;
    
    
    
    if (modelFiles) {
        //var dummyFrame = document.getElementById('dummyFrame');
        //dummyFrame.style.display='block';
        submitFlag = true;
        return true;
    } else {
        alert('No file model selected!');
        return false;
    }
}
