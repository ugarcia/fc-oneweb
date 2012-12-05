// Globals
var MODELS_PATH = "/OneWeb/resources/models/";
var JSON_PATH = "/OneWeb/common/json/";

var numRows = 4, itemsPerRow = 4;

var shelfModel = { mesh: "shelf.obj", 
                     materials: "shelf.mtl" };

var container, renderer, scene, camera, projector,  
    movingCamera = false, lastMousePos = { x: 0, y: 0 }, 
    intersectedObject = null, intersected = false, 
    stack = [], currentData = null;

var json2model = [
    { mesh: "backArrow.obj", 
      materials: "backArrow.mtl" }, 
    { mesh: "carpeta.obj", 
      materials: "carpeta.mtl" }, 
    { mesh: "clipb.obj", 
      materials: "clipb.mtl" }
];

// Interface with root document
function receiveMessage(evt) 
{
    session = evt.data;
    updateSessionStatus();
    
    fitElementHeight("glContainer", 'footerRow', 30);
    
    initGL();
    animate();
    
    parseJSON(JSON_PATH + "json_test.json");
}

// Handle session status
function updateSessionStatus() 
{
    if (session.logged) {
        // TODO
    } else {
        // TODO
    }
} 

// Called on loaded body                                
function startup()
{
    checkAccess();
    checkSession(function(data) {
       session = data;
       updateSessionStatus();
    });
    window.addEventListener("message", receiveMessage, false);
    
    fitElementHeight("glContainer", 'footerRow', 30);
    
    initGL();
    animate();
    
    parseJSON(JSON_PATH + "json_test.json");  
}

// Asynchronous JSON GET
function parseJSON(url)
{
    $.getJSON(url, function(data) {
        showDataTree(data, stack);
    });
}

// Show JSON data tree level on canvas
function showDataTree(data, stack)
{
    currentData = data;    
    // Clear Explorable Objects from Scene
    for ( var i = 0, j = scene.children.length, removables = []; i < j; i++ )
        if (scene.children[i] instanceof ExplorableObject)
            removables.push(scene.children[i]);
    while (removables.length)
        scene.remove(removables.pop());
    // Link to Parent Directory
    if (stack.length) 
        addExplorable(new THREE.Vector3(0, -camera.distance/2, 0), 'BACK', stack[stack.length-1], true, true);
    else
        addExplorable(new THREE.Vector3(0, -camera.distance/2, 0), 'BACK', data, true, true);
    // Generate & Layout Explorable objects based in JSON
    var count = 0; 
    // TODO Layout Elements 
    var numItems = Object.keys(data).length;
    var rowSpace = (camera.distance / numRows) * 0.92;
    var initRowY = camera.distance * 0.4;
    var colSpace = Math.min((camera.distance * 1.2)/(itemsPerRow-1), camera.distance * 0.5);
    var initColX = - camera.distance * 0.6;
    Object.keys(data).forEach(function(key) {
        var itemRow = Math.floor(count / itemsPerRow);
        var itemRowY = initRowY - itemRow * rowSpace; 
        var itemCol = count - itemRow * itemsPerRow;
        var itemColX = initColX + itemCol * colSpace;
        // Directory Object
        if ($.isPlainObject(data[key]) || $.isArray(data[key])) 
            addExplorable(new THREE.Vector3(itemColX, itemRowY, 0), key, data[key], true, false);
        // File Object
        else 
           addExplorable(new THREE.Vector3(itemColX, itemRowY, 0), key, data[key], false, false);
        count++;
    });
}

// Init canvas main elements
function initGL()
{
    container = document.getElementById("glContainer");
    container.innerHTML = "";
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild( renderer.domElement );
    // Scene instance
    scene = new THREE.Scene();
    // Scene Camera, including Camera-following directional light
    camera = new ExploringCamera( 60, container.offsetWidth / container.offsetHeight, 1, 100 );
    camera.angX = Math.PI/8;
    camera.setView();
    var directionalLight = new THREE.DirectionalLight( 0xffffff);
    directionalLight.position.set( 0, 0, 1 ).normalize();
    camera.add( directionalLight );
    scene.add( camera );
    // Scene ambient light
    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
    // Static shelf OBJ Model loading & add to Scene
    var loader = new THREE.OBJMTLLoader();
    loader.addEventListener( 'load', function ( event ) {
        var object = event.content;
        object.position.y = -2;
        object.isShelf = true;
        scene.add( object );
    });
    loader.load( MODELS_PATH + shelfModel.mesh,  
                 MODELS_PATH + shelfModel.materials );
    // Projector utility for mouse position
    projector = new THREE.Projector();
    // Initial event listeners over scene
    container.addEventListener('mousemove', onContainerMouseMove, false);
    container.addEventListener('mousedown', onContainerMouseDown, false);
    container.addEventListener("mousewheel", onContainerMouseWheel, false);
    //For firefox only
    container.addEventListener("DOMMouseScroll", onContainerMouseWheel, false); 
}

// Add Explorable 3D Object
function addExplorable(pos, key, data, isDir, isBack)
{
    var modelNum = isBack ? 0 : (isDir ? 1 : 2);
    // Instantitate new Explorable 3D Object
    var explorable = new ExplorableObject(key, data, isDir, isBack);
   // OBJ Model loading & add to Explorable
    var loader = new THREE.OBJMTLLoader();
    loader.addEventListener( 'load', function ( event ) {
        var object = event.content;
        object.setDefaultRotation(new THREE.Vector3());
        // Set default diffuse color to meshes
        var meshes = object.getMeshes();
        for ( var k = 0, l = meshes.length; k < l; k++ )
            meshes[k].material.color.setHex( 0x888888);
        explorable.setMesh( object );
    });
    loader.load( MODELS_PATH + json2model[modelNum].mesh,  
                 MODELS_PATH + json2model[modelNum].materials );
    // Text geometry loading & add to Explorable
    var text3d = new THREE.TextGeometry( key, { size: 0.4,
                                                height: 0.05,
                                                curveSegments: 2,
                                                font: "helvetiker"
    });
    text3d.computeBoundingBox();
    var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
    var innerText = new THREE.Mesh( text3d, new THREE.MeshBasicMaterial());
    innerText.position.x = centerOffset;
    var text = new THREE.Object3D();
    text.add(innerText);
    text.position.y = isBack ? -1.7 : 1.7;
    explorable.setText( text );
    // Add full-formed Explorable to Scene            
    explorable.position = pos;
    scene.add( explorable );
}

// Renderer function - called once per frame
function animate() 
{
    requestAnimationFrame( animate );
    for ( var i = 0, j = scene.children.length; i < j; i++ )
        if (scene.children[i] instanceof ExplorableObject)
            scene.children[i].update();
    TWEEN.update();
    renderer.render( scene, camera );
}

// Handle mouse movement over scene
function onContainerMouseMove( event ) 
{
    event.preventDefault();
        
    var mousePos = getMousePos(container, event);
    // Camera movement by mouse
    if (movingCamera) {
        var diffX = mousePos.x - lastMousePos.x;
        var diffY = mousePos.y - lastMousePos.y;
        camera.angY = adjustAngle(camera.angY + (diffX * 0.01));
        camera.angX += (diffY * 0.01);
        if (Math.abs(camera.angX)>=Math.PI/2)
            camera.angX -= (diffY * 0.01);
        camera.setView();
        for ( var i = 0, j = scene.children.length; i < j; i++ )
            if (scene.children[i] instanceof ExplorableObject)
                scene.children[i].text.rotation.y = camera.angY;
        lastMousePos = mousePos;
        return;
    } 
    // Ray from mouse position to scene to check intersections
    var vector = new THREE.Vector3(   ( mousePos.x / container.clientWidth) * 2 - 1, 
                                    - ( mousePos.y / container.clientHeight ) * 2 + 1, 
                                      0.5 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
    var intersects = ray.intersectObjects( scene.children , true);    
    // Nothing intersected
    if (intersects.length == 0 && intersected) {
        intersected = false;
        for ( var i = 0, j = scene.children.length; i < j; i++ ) {
            var scObj = scene.children[i];
            if (scObj instanceof ExplorableObject && scObj.hovered) {
                scObj.hoverOff();
            }
        }
    // Some element intersected
    } else if (intersects.length > 0) {
        intersected = false;
        for ( var i in intersects ) {
            var expObj = intersects[ i ].object;
            while (!(expObj instanceof ExplorableObject) && 
                   !(expObj instanceof THREE.Scene))
                expObj = expObj.parent;
            if (expObj instanceof THREE.Scene)
                continue;
            intersected = true;
            intersectedObject = expObj;
            if (!expObj.hovered) {
                expObj.hovered = true;
                expObj.setHoveredScale(1000);
                expObj.mesh.setAutoRotation(new THREE.Vector3(0, 0.01, 0));
            }
        }
        if (!intersected && intersectedObject && intersectedObject.hovered)
            intersectedObject.hoverOff();
    }
}

// Handle mouse click over scene
function onContainerMouseDown( event ) 
{
    event.preventDefault();
    
    this.removeEventListener('mousedown', onContainerMouseDown, false);
    this.addEventListener('mouseup', onContainerMouseUp, false);
    // Clicked down over some element    
    if (intersected && intersectedObject) {
        intersectedObject.stopAutoRotation();
        var meshes = intersectedObject.getMeshes();
        for ( var k = 0, l = meshes.length; k < l; k++ )
            meshes[k].material.color.setHex( 0xff3333);
    // Clicked down over blank space --> enables camera movement
    } else {
        movingCamera = true;
        lastMousePos = getMousePos(this, event);
    } 
}

// Handle mouse release over scene
function onContainerMouseUp( event ) 
{
    event.preventDefault();
    
    this.removeEventListener('mouseup', onContainerMouseUp, false); 
    this.addEventListener('mousedown', onContainerMouseDown, false);
    // Release camera movement even though it didn't exist
    movingCamera = false;
    // Released up from over some element
    if (intersected && intersectedObject) {
        intersected = false;
        intersectedObject.hoverOff();
        if (intersectedObject.isBack) {
            if (stack.length) {
                showDataTree(stack.pop(), stack);
            } else {
                showDataTree(currentData, stack);
            }
        } else if (intersectedObject.isDir) {
            stack.push(currentData);
            showDataTree(intersectedObject.data, stack);
        } else {
            alert(intersectedObject.data);
        }
        
    }
}

function onContainerMouseWheel( event )
{
    var delta = Math.max(-1, Math.min(1, ( event.wheelDelta || -event.detail )));
    camera.distance -= delta;
    camera.setView();
}
