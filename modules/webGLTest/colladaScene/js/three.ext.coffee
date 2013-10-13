THREE.Object3D.prototype.getForward = -> new THREE.Vector3(0, 0, 1).transformDirection(@matrix)

THREE.Geometry.prototype.translate	= (offset) ->
  matrix = new THREE.Matrix4().makeTranslation(offset.x, offset.y, offset.z)
  @applyMatrix matrix
  if @morphTargets and @morphTargets.length
    for i in [0..@morphTargets.length-1]
      do (i) =>
        vertex = @morphTargets[i].vertices
        if vertex and vertex.length
          for j in [0..vertex.length-1]
            do (j) =>
              vertex[j].applyMatrix4 matrix

THREE.Geometry.prototype.getCenter = () ->
  @computeBoundingBox()
  bb = @boundingBox
  new THREE.Vector3().addVectors(bb.min, bb.max).multiplyScalar(-0.5)

THREE.Geometry.prototype.center = () -> @translate @getCenter()

THREE.KeyFrameAnimation.prototype.setFrame = (frame) ->
  for h in [0..@hierarchy.length-1]
    do (h) =>
      keys = this.data.hierarchy[h].keys
      sids = this.data.hierarchy[h].sids
      obj = this.hierarchy[h]
      if keys.length
        for s in [0..sids.length-1]
          do (s) =>
            sid = sids[ s ]
            key = this.getNextKeyWith( sid, h, frame )
            key.apply sid unless not key

        @data.hierarchy[h].node.updateMatrix()
        obj.matrixWorldNeedsUpdate = true


