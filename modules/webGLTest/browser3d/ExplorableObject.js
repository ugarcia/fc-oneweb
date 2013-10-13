
ExplorableObject = function (key, data, isDir, isBack) 
{
    THREE.Object3D.call( this );
        
	this.key = key;
	this.data = data;
	this.isDir = isDir;
	this.isBack = isBack;

	this.hovered = false;
	
	this.autoRotate = false;
	this.autoRotation = new THREE.Vector3();
	this.defaultRotation = new THREE.Vector3();
	this.rotationTween = null;
	
	this.defaultScale = new THREE.Vector3(1, 1, 1);
    this.hoveredScale = new THREE.Vector3(1.5, 1.5, 1.5);
	this.scaleTween = null;
	
	this.mesh = null;
	this.text = null;
}

ExplorableObject.prototype = Object.create( THREE.Object3D.prototype );

THREE.Object3D.prototype.resetRotation =  function (time) 
{
    this.rotationTween = new TWEEN.Tween( this.rotation )
                                  .to( { x: this.defaultRotation.x, 
                                         y: this.defaultRotation.y, 
                                         z: this.defaultRotation.z }, time )
                                  .easing( TWEEN.Easing.Elastic.EaseOut)
                                  .start();
}

THREE.Object3D.prototype.setDefaultRotation =  function ( rot ) 
{
    this.defaultRotation = rot;
}

THREE.Object3D.prototype.setAutoRotation =  function ( rot ) 
{
    this.autoRotate = true;
    this.autoRotation = rot;
}

THREE.Object3D.prototype.stopAutoRotation =  function () 
{
	this.autoRotate = false;
}

THREE.Object3D.prototype.setHoveredScale =  function (time) 
{
    scaleTween = new TWEEN.Tween( this.scale )
                             .to( { x: this.hoveredScale.x, 
                                    y: this.hoveredScale.y, 
                                    z: this.hoveredScale.z }, time )
                             .easing( TWEEN.Easing.Elastic.EaseOut)
                             .start();
}

THREE.Object3D.prototype.resetScale =  function (time) 
{
    scaleTween = new TWEEN.Tween( this.scale )
                             .to( { x: this.defaultScale.x, 
                                    y: this.defaultScale.y, 
                                    z: this.defaultScale.z }, time )
                             .easing( TWEEN.Easing.Elastic.EaseOut)
                             .start();
}
	    
THREE.Object3D.prototype.update = function () 
{
    if (('autoRotation' in this) && (this.autoRotate)) {
        if (this.rotationTween) {
            this.rotationTween.stop();
            this.rotationTween = null;
        }
        this.rotation.addSelf(this.autoRotation);
        this.rotation.x = adjustAngle(this.rotation.x);
        this.rotation.y = adjustAngle(this.rotation.y); 
        this.rotation.z = adjustAngle(this.rotation.z);  
    }
    if (this.mesh)
        this.mesh.update();
    if (this.text)
        this.text.update();
}

THREE.Object3D.prototype.getMeshes = function (meshes) 
{
    if (arguments.length == 0)
        var meshes = [];
    if (this instanceof THREE.Mesh) {
        meshes.push(this);
    } else {
        for (var i=0, j=this.children.length; i<j; i++)
            meshes = this.children[i].getMeshes(meshes);
    }
    return meshes;    
}

THREE.Object3D.prototype.setMesh = function (mesh) 
{
    this.mesh = mesh;
    this.add(mesh);    
}

THREE.Object3D.prototype.setText = function (text) 
{
    this.text = text;
    this.add(text);    
}

THREE.Object3D.prototype.hoverOff = function () 
{
    this.hovered = false;
    this.resetScale(1000);
    this.mesh.stopAutoRotation();
    this.mesh.resetRotation(5000);
    var meshes = this.getMeshes();
    for ( var k = 0, l = meshes.length; k < l; k++ )
        if (meshes[k].geometry instanceof THREE.TextGeometry)
            meshes[k].material.color.setHex( 0xffffff);
        else
            meshes[k].material.color.setHex( 0x888888);  
}
