
ExploringCamera = function ( fov, aspect, near, far ) 
{
    THREE.PerspectiveCamera.call( this, fov, aspect, near, far );
    
    this.angX = 0;
    this.angY = 0;
    this.distance = 20;
    this.target = new THREE.Vector3();
    
}

ExploringCamera.prototype = Object.create( THREE.PerspectiveCamera.prototype );

ExploringCamera.prototype.setView = function()
{
    this.position.x = this.target.x + this.distance * Math.cos( this.angX ) * Math.sin( this.angY );
    this.position.z = this.target.z + this.distance * Math.cos( this.angX ) * Math.cos( this.angY );
    this.position.y = this.target.y + this.distance * Math.sin( this.angX );
    this.lookAt(this.target);
}
