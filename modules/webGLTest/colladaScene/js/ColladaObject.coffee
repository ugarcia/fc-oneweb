class window.ColladaObject
  app: null
  src: null
  scale: 1
  physics: false
  mass: 1
  speed: 0.1
  currentAnimation: null
  frame: 0

  skin: null
  morph: null
  mesh: null
  scene: null
  kAnimations: null
  kfAnimations: null

  obj: null

  constructor: (@app, @src, @scale, @physics, @animations) ->

  load: (cb) ->
    require ["#{@app.urlRoot}/lib/js/ColladaLoader.js"], () =>
      loader = new THREE.ColladaLoader()
      loader.options.convertUpAxis = true
      loader.load @src, (collada) =>
        console.log collada
        @scene = collada.scene
        @skin = collada.skins[0]
        @morph = collada.morphs[0]
        @mesh = collada.meshes[0]
        @kAnimations = collada.animations
        cb() unless not cb

  init: (scene) ->
    @scene.scale.x = @scene.scale.y = @scene.scale.z = @scale
    @scene.updateMatrix()
    aux = @skin ? @morph ? @mesh ? @scene
    aux.geometry?.center()

    if @physics
      @obj = @skin = new Physijs.BoxMesh(aux.geometry, aux.material, @mass)
      @obj.setAngularFactor new THREE.Vector3(0, 1, 0)
    else
      @obj = aux
    @obj.scale.x = @obj.scale.y = @obj.scale.z = @scale
    @obj.updateMatrix()

    if @kAnimations and @kAnimations.length
      @kfAnimations = []
      animHandler = THREE.AnimationHandler;
      for i in [0..@kAnimations.length-1]
        do (i) =>
          animation = @kAnimations[i]
          animHandler.add animation
          kfAnimation = new THREE.KeyFrameAnimation(animation.node, animation.name)
          kfAnimation.timeScale = 1
          @kfAnimations.push kfAnimation
          kfAnimation.play(false, 0)
      @frame = 0
      #@setAnimationByName('idle')
      @setAnimation 0

    scene.add @obj

  update: (delta) =>
    if @kfAnimations && @kfAnimations.length
      currLength = @currentAnimation.end - @currentAnimation.start
      if @frame < currLength - 1 or @currentAnimation.looping
        @frame = (@frame + 1) % currLength
      else
        #@setAnimationByName('idle')
        @setAnimation 0
      @kfAnimations[i].setFrame(@currentAnimation.start + @frame) for i in [0..@kfAnimations.length-1]

  getPosition: -> @obj.position

  setAnimation: (animation) ->
    @currentAnimation = animation
    @frame = 0

  setAnimationByName: (animationName) -> @setAnimation @animations[animationName]

  getAnimationByName: (animationName) -> @animations[animationName]

  getAnimationByStartKey: (key) -> return @animations[anim] for anim of @animations when @animations[anim].start is key

  getNextAnimation: () -> @getAnimationByStartKey((@currentAnimation.end + 1) % (@getMaxFrames() + 1))

  setNextAnimation: () -> @setAnimation(@getNextAnimation())

  getMaxFrames: () ->
    maxFrames = 0
    maxFrames = @animations[anim].end for anim of @animations when @animations[anim].end > maxFrames
    maxFrames

  move: (direction) ->
    if direction
      #@setAnimationByName('walk') unless @currentAnimation isnt @getAnimationByName('idle')
      from = @obj.getForward()
      angle = from.angleTo(direction)
      #@obj.applyImpulse(from.multiplyScalar(@speed), new THREE.Vector3(0, 0, 0)) unless angle > 0.4 * Math.PI
      if angle < 0.4 * Math.PI
        @obj.position.add(from.multiplyScalar(@speed))
        @obj.__dirtyPosition = true unless not @physics
      if angle > 0.02 * Math.PI
        axis = if angle is Math.PI then @obj.up else new THREE.Vector3().crossVectors(from, direction).normalize()
        angleDelta = Math.min(@speed * Math.PI, angle)
        @obj.rotateOnAxis(new THREE.Vector3(0, axis.y, 0), angleDelta)
        @obj.__dirtyRotation = true unless not @physics
    else
      #@setAnimationByName('idle') unless @currentAnimation isnt @getAnimationByName('walk')

  attack: -> #@setAnimationByName('attack') unless @currentAnimation is @getAnimationByName('attack')

  debugLines: (obj) ->
    if obj and obj.children and obj.children.length
      for i in [0..obj.children.length-1]
        do (i) =>
          geometry =  new THREE.Geometry()
          geometry.vertices.push(obj.children[i].position)
          geometry.vertices.push(new THREE.Vector3())
          obj.add new THREE.Line(geometry)
          @debugLines obj.children[i]
