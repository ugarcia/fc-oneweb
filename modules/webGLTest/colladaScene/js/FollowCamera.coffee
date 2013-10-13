class window.FollowCamera extends THREE.PerspectiveCamera
  target: new THREE.Vector3(0, 0, 0)
  angle: Math.PI
  slopeAngle: Math.PI/4
  distance: 5
  speed: 0.05
  minZoom: 1
  maxZoom: 50
  zoomMultiplier: 5

  constructor: (fov, aspect, near, far, target, angle, slopeAngle, distance) ->
    THREE.PerspectiveCamera.call @, fov, aspect, near, far
    @angle = angle ? @angle
    @slopeAngle = slopeAngle ? @slopeAngle
    @distance = distance ? @distance
    @target = target ? @target

  update: (delta) ->
    offsetX = @distance * Math.cos(@slopeAngle) * Math.sin(@angle)
    offsetY = @distance * Math.sin(@slopeAngle)
    offsetZ = @distance * Math.cos(@slopeAngle) * Math.cos(@angle)
    @position.set(@target.x + offsetX, @target.y + offsetY, @target.z + offsetZ)
    @lookAt @target

  addAngle: (ang) -> @angle += @speed * ang unless not ang

  addSlopeAngle: (ang) ->
    b = ang and ((ang > 0 and @slopeAngle > 0.95 * Math.PI/2) or (ang < 0 and @slopeAngle < - 0.95 * Math.PI/2))
    @slopeAngle += @speed * ang unless b

  addDistance: (d) ->
    b = d and ((d > 0 and @distance > @maxZoom) or (d < 0 and  @distance < @minZoom))
    @distance += @zoomMultiplier * @speed * d unless b

