class window.ColladaObject
  app: null
  src: null
  scale: 1
  animations: null
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
  kfAnimations: []

  obj: null
  skel: null
  hand: null

  constructor: (@app, @src, @scale, @physics, @animations) ->

  load: (cb) ->
    require ["#{@app.urlRoot}/lib/js/ColladaLoader.js"], () =>
      loader = new THREE.ColladaLoader()
      loader.options.convertUpAxis = true
      loader.load @src, (collada) =>
        console.log collada
        @skin = collada.skins[0]
        @scene = collada.scene
        @morph = collada.morphs[0]
        @mesh = collada.meshes[0]
        @kAnimations = collada.animations
        cb() unless not cb

  init: (scene) ->
    @scene.scale.x = @scene.scale.y = @scene.scale.z = @scale
    @scene.updateMatrix()

    aux = @skin ? @morph ? @mesh ? @scene

    offset = new THREE.Vector3().subVectors(aux.position, aux.geometry.getCenter())

    @skel = @scene.getChildByName("ZOMBIE")
    @skel.position.sub offset

    aux.geometry?.center()

    if @physics
      @obj = @skin = new Physijs.BoxMesh(aux.geometry, aux.material, @mass)
      @obj.setAngularFactor new THREE.Vector3(0, 1, 0)
    else
      @obj = aux
    @obj.scale.x = @obj.scale.y = @obj.scale.z = @scale
    @obj.updateMatrix()

    animHandler = THREE.AnimationHandler;
    for i in [0..@kAnimations.length-1]
      do (i) =>
        animation = @kAnimations[i]
        animHandler.add animation
        kfAnimation = new THREE.KeyFrameAnimation(animation.node, animation.name)
        kfAnimation.timeScale = 1
        @kfAnimations.push kfAnimation
        kfAnimation.play(false, 0)

    skelKeys = @kAnimations[0].hierarchy[0].keys
    for i in [0..skelKeys.length-1]
      do (i) =>
        kMatrix = skelKeys[i].targets[0].data
        vec = new THREE.Vector3().getPositionFromMatrix(kMatrix).sub(offset)
        kMatrix.setPosition vec

    addLines = (obj) ->
      if obj and obj.children and obj.children.length
        for i in [0..obj.children.length-1]
          do (i) =>
            geometry =  new THREE.Geometry()
            geometry.vertices.push(obj.children[i].position)
            geometry.vertices.push(new THREE.Vector3())
            obj.add new THREE.Line(geometry)
            addLines obj.children[i]
    addLines @skel

    @obj.add @skel

    @frame = 0
    @setAnimationByName 'idle'

    @hand = new Physijs.BoxMesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial(), @mass/100)
    #@hand.scale.x = @hand.scale.y = @hand.scale.z = @scale
    #@hand.updateMatrix()

    #@skel.getObjectByName("ZOMBIE_R_Hand", true).add @hand
    @obj.add @hand
    scene.add @obj
    #scene.add @hand

  update: (delta) =>
    if @skin && @currentAnimation
      @skin.morphTargetInfluences[i] = 0 for i in [0..@skin.morphTargetInfluences.length-1]
      @skin.morphTargetInfluences[@currentAnimation.start + @frame] = 1
      currLength = @currentAnimation.end - @currentAnimation.start
      if @frame < currLength - 1 or @currentAnimation.looping
        @frame = (@frame + 1) % currLength
      else
        @setAnimationByName('idle')

      @kfAnimations[i].setFrame(@currentAnimation.start + @frame) for i in [0..@kfAnimations.length-1]
      kmatrix = new THREE.Matrix4().copy(@skel.getObjectByName("ZOMBIE_R_Hand", true).matrixWorld)
      kmatrix = new THREE.Matrix4() .getInverse(@skel.matrixWorld).multiply kmatrix
      @hand.matrixWorld = kmatrix
      #@hand.matrix.copy @skel.getObjectByName("ZOMBIE_R_Hand", true).matrix
      #@hand.matrixWorldNeedsUpdate = true
      #console.log @hand.matrix
      #@hand.position.getPositionFromMatrix @skel.getObjectByName("ZOMBIE_R_Hand", true).matrixWorld
      @hand.__dirtyPosition = true
      @hand.__dirtyRotation = true

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
      @setAnimationByName('walk') unless @currentAnimation isnt @getAnimationByName('idle')
      from = @obj.getForward()
      angle = from.angleTo(direction)
      #@obj.applyImpulse(from.multiplyScalar(@speed), new THREE.Vector3(0, 0, 0)) unless angle > 0.4 * Math.PI
      if angle < 0.4 * Math.PI
        @obj.position.add(from.multiplyScalar(@speed))
        @obj.__dirtyPosition = true
      if angle > 0.02 * Math.PI
        axis = if angle is Math.PI then @obj.up else new THREE.Vector3().crossVectors(from, direction).normalize()
        angleDelta = Math.min(@speed * Math.PI, angle)
        @obj.rotateOnAxis(new THREE.Vector3(0, axis.y, 0), angleDelta)
        #@obj.rotateOnAxis(axis), angleDelta)
        @obj.__dirtyRotation = true
    else
      @setAnimationByName('idle') unless @currentAnimation isnt @getAnimationByName('walk')

  attack: -> @setAnimationByName('attack') unless @currentAnimation is @getAnimationByName('attack')
