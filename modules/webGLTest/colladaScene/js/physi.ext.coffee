class window.PhysicMeshDeclarator
  @declarePhysicMesh: (tm, ctor) ->
    pm = (geometry, material, mass) ->
      if not geometry then return
      Physijs.Eventable.call @
      ctor.call(@, geometry, material)
      geometry.computeBoundingBox() unless geometry.boundingBox
      @_physijs =
        type: null
        id: Physijs.getObjectId()
        mass: mass or 0
        touches: []
        linearVelocity: new THREE.Vector3
        angularVelocity: new THREE.Vector3
      @
    pm.prototype = new tm
    pm.prototype.constructor = pm
    Physijs.Eventable.make pm
    pm.prototype.__defineGetter__ 'mass', () -> @_physijs.mass
    pm.prototype.__defineSetter__ 'mass', (mass) -> @_physijs.mass = mass
    @world.execute('updateMass', { id: @_physijs.id, mass: mass }) unless not @world
    pm.prototype.applyCentralImpulse = (force) ->
      @world.execute('applyCentralImpulse', { id: @_physijs.id, x: force.x, y: force.y, z: force.z }) unless not @world
    pm.prototype.applyImpulse = (force, offset) ->
      @world.execute('applyImpulse', { id: @_physijs.id, impulse_x: force.x, impulse_y: force.y, impulse_z: force.z, x: offset.x, y: offset.y, z: offset.z }) unless not @world
    pm.prototype.applyCentralForce = (force) ->
        @world.execute('applyCentralForce', { id: @_physijs.id, x: force.x, y: force.y, z: force.z }) unless not @world
    pm.prototype.applyForce = (force, offset) ->
      @world.execute('applyForce', { id: @_physijs.id, force_x: force.x, force_y : force.y, force_z : force.z, x: offset.x, y: offset.y, z: offset.z }) unless not @world
    pm.prototype.getAngularVelocity = () -> @_physijs.angularVelocity
    pm.prototype.setAngularVelocity = (velocity) ->
        @world.execute('setAngularVelocity', { id: @_physijs.id, x: velocity.x, y: velocity.y, z: velocity.z }) unless not @world
    pm.prototype.getLinearVelocity = () -> @_physijs.linearVelocity
    pm.prototype.setLinearVelocity = (velocity) ->
        @world.execute('setLinearVelocity', { id: @_physijs.id, x: velocity.x, y: velocity.y, z: velocity.z }) unless not @world
    pm.prototype.setAngularFactor = (factor) ->
        @world.execute('setAngularFactor', { id: @_physijs.id, x: factor.x, y: factor.y, z: factor.z }) unless not @world
    pm.prototype.setLinearFactor = (factor) ->
        @world.execute('setLinearFactor', { id: @_physijs.id, x: factor.x, y: factor.y, z: factor.z }) unless not @world
    pm.prototype.setDamping = (linear, angular) ->
      @world.execute('setDamping', { id: @_physijs.id, linear: linear, angular: angular }) unless not @world
    pm.prototype.setCcdMotionThreshold = (threshold) ->
        @world.execute('setCcdMotionThreshold', { id: @_physijs.id, threshold: threshold }) unless not @world
    pm.prototype.setCcdSweptSphereRadius = (radius) ->
        @world.execute('setCcdSweptSphereRadius', { id: @_physijs.id, radius: radius }) unless not @world
    pm


Physijs.SkinnedMesh = PhysicMeshDeclarator.declarePhysicMesh(
  THREE.SkinnedMesh
  (geometry, material) -> THREE.SkinnedMesh.call( @, geometry, material, false )
)
