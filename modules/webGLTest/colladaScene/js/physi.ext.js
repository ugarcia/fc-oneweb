// Generated by CoffeeScript 1.4.0
(function() {

  window.PhysicMeshDeclarator = (function() {

    function PhysicMeshDeclarator() {}

    PhysicMeshDeclarator.declarePhysicMesh = function(tm, ctor) {
      var pm;
      pm = function(geometry, material, mass) {
        if (!geometry) {
          return;
        }
        Physijs.Eventable.call(this);
        ctor.call(this, geometry, material);
        if (!geometry.boundingBox) {
          geometry.computeBoundingBox();
        }
        this._physijs = {
          type: null,
          id: Physijs.getObjectId(),
          mass: mass || 0,
          touches: [],
          linearVelocity: new THREE.Vector3,
          angularVelocity: new THREE.Vector3
        };
        return this;
      };
      pm.prototype = new tm;
      pm.prototype.constructor = pm;
      Physijs.Eventable.make(pm);
      pm.prototype.__defineGetter__('mass', function() {
        return this._physijs.mass;
      });
      pm.prototype.__defineSetter__('mass', function(mass) {
        return this._physijs.mass = mass;
      });
      if (!!this.world) {
        this.world.execute('updateMass', {
          id: this._physijs.id,
          mass: mass
        });
      }
      pm.prototype.applyCentralImpulse = function(force) {
        if (!!this.world) {
          return this.world.execute('applyCentralImpulse', {
            id: this._physijs.id,
            x: force.x,
            y: force.y,
            z: force.z
          });
        }
      };
      pm.prototype.applyImpulse = function(force, offset) {
        if (!!this.world) {
          return this.world.execute('applyImpulse', {
            id: this._physijs.id,
            impulse_x: force.x,
            impulse_y: force.y,
            impulse_z: force.z,
            x: offset.x,
            y: offset.y,
            z: offset.z
          });
        }
      };
      pm.prototype.applyCentralForce = function(force) {
        if (!!this.world) {
          return this.world.execute('applyCentralForce', {
            id: this._physijs.id,
            x: force.x,
            y: force.y,
            z: force.z
          });
        }
      };
      pm.prototype.applyForce = function(force, offset) {
        if (!!this.world) {
          return this.world.execute('applyForce', {
            id: this._physijs.id,
            force_x: force.x,
            force_y: force.y,
            force_z: force.z,
            x: offset.x,
            y: offset.y,
            z: offset.z
          });
        }
      };
      pm.prototype.getAngularVelocity = function() {
        return this._physijs.angularVelocity;
      };
      pm.prototype.setAngularVelocity = function(velocity) {
        if (!!this.world) {
          return this.world.execute('setAngularVelocity', {
            id: this._physijs.id,
            x: velocity.x,
            y: velocity.y,
            z: velocity.z
          });
        }
      };
      pm.prototype.getLinearVelocity = function() {
        return this._physijs.linearVelocity;
      };
      pm.prototype.setLinearVelocity = function(velocity) {
        if (!!this.world) {
          return this.world.execute('setLinearVelocity', {
            id: this._physijs.id,
            x: velocity.x,
            y: velocity.y,
            z: velocity.z
          });
        }
      };
      pm.prototype.setAngularFactor = function(factor) {
        if (!!this.world) {
          return this.world.execute('setAngularFactor', {
            id: this._physijs.id,
            x: factor.x,
            y: factor.y,
            z: factor.z
          });
        }
      };
      pm.prototype.setLinearFactor = function(factor) {
        if (!!this.world) {
          return this.world.execute('setLinearFactor', {
            id: this._physijs.id,
            x: factor.x,
            y: factor.y,
            z: factor.z
          });
        }
      };
      pm.prototype.setDamping = function(linear, angular) {
        if (!!this.world) {
          return this.world.execute('setDamping', {
            id: this._physijs.id,
            linear: linear,
            angular: angular
          });
        }
      };
      pm.prototype.setCcdMotionThreshold = function(threshold) {
        if (!!this.world) {
          return this.world.execute('setCcdMotionThreshold', {
            id: this._physijs.id,
            threshold: threshold
          });
        }
      };
      pm.prototype.setCcdSweptSphereRadius = function(radius) {
        if (!!this.world) {
          return this.world.execute('setCcdSweptSphereRadius', {
            id: this._physijs.id,
            radius: radius
          });
        }
      };
      return pm;
    };

    return PhysicMeshDeclarator;

  })();

  Physijs.SkinnedMesh = PhysicMeshDeclarator.declarePhysicMesh(THREE.SkinnedMesh, function(geometry, material) {
    return THREE.SkinnedMesh.call(this, geometry, material, false);
  });

}).call(this);
