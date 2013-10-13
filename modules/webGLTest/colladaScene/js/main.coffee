class window.ThreeApp
  urlRoot: '/'
  container: null
  camera: null
  scene: null
  renderer: null
  fps: 25
  lastFrameTime: 0
  clock: null
  dae: null
  inputController: null

  constructor: (containerId, urlRoot) ->
    @container = document.getElementById(containerId)
    @urlRoot = urlRoot ? @urlRoot
    require ["#{@urlRoot}/lib/js/three.min.js"], () =>
      require ["#{@urlRoot}/lib/js/physi.js"], () =>
        Physijs.scripts.worker = "#{@urlRoot}/lib/js/physijs_worker.js"
        Physijs.scripts.ammo = "#{@urlRoot}/lib/js/ammo.js"
        console.log Physijs
        require ["#{@urlRoot}/js/three.ext.js"], () =>
          require ["#{@urlRoot}/js/physi.ext.js"], () => @load()

  load: ->
    # -------------- Load objects ---------------
    require ["#{@urlRoot}/js/ColladaObject.js"], () =>
      @dae = new ColladaObject @, "#{@urlRoot}/models/zombie01/zombie.dae", 0.05, true,
        walk: { start: 0, end: 27, looping: true }
        idle: { start: 28, end: 84, looping: true }
        attack: { start: 85, end: 106, looping: false }
      @dae.load () => @init()

  init: ->
    @lastFrameTime = 0
    @clock = new THREE.Clock()

    # -------------- Scene ---------------
    @scene = new Physijs.Scene
    @scene.setGravity new THREE.Vector3( 0, -10, 0 )
    @scene.addEventListener 'update', () => @scene.simulate( undefined, 2 );

    # -------------- Physic Grid ---------------
    ground_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("#{@urlRoot}/images/rocks.jpg") })
      .4  #med friction
      .4  #low restitution
    )
    ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping
    ground_material.map.repeat.set(5, 5)
    ground = new Physijs.BoxMesh(new THREE.CubeGeometry(20, 1, 20), ground_material, 0)
    ground.position.y = -2
    @scene.add ground

    # -------------- Obstacles ---------------
    box_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("#{@urlRoot}/images/plywood.jpg") })
      .4 # low friction
      .2 # low restitution
    )
    box_material.map.wrapS = box_material.map.wrapT = THREE.RepeatWrapping
    box_material.map.repeat.set( .25, .25 )
    for i in [0..3]
      do (i) =>
        size = Math.random() * 2
        box = new Physijs.BoxMesh(new THREE.CubeGeometry( size, size, size ), box_material, 0.1)
        box.position.set(Math.random() * 10 - 5, 4, Math.random() * 10 - 5)
        @scene.add(box)

    # -------------- Lights ---------------
    @scene.add(new THREE.AmbientLight(0xcccccc))

    # -------------- Renderer ---------------
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize(window.innerWidth, window.innerHeight)
    @container.appendChild @renderer.domElement

    # -------------- Scene Objects ---------------
    @dae.init @scene

    # -------------- Camera ---------------
    require ["#{@urlRoot}/js/FollowCamera.js"], () =>
      @camera = new FollowCamera(45, window.innerWidth / window.innerHeight, 1, 2000, @dae.getPosition(), 0, Math.PI/12, 10)

    # -------------- Input Controller ---------------
    require ["#{@urlRoot}/js/InputController.js"], () => @inputController = new InputController()

    requestAnimationFrame @update
    @scene.simulate()

  update: =>
    requestAnimationFrame @update
    # -------------- Control FPS ---------------
    @lastFrameTime += @clock.getDelta()
    if  @lastFrameTime >= (1.0 / @fps)
      @lastFrameTime = 0

      # -------------- Apply dae movement logic --------------
      if @dae
        target = @inputController?.getPlayerMovementTarget()
        if target and (target.x or target.y or target.z)
          target.transformDirection(@camera.matrix).projectOnPlane(new THREE.Vector3(0, 1, 0)).normalize()
        else
          target = null
        @dae.move target
        @dae.attack() unless not @inputController?.isPlayerAttacking()
        # -------------- Update dae ---------------
        @dae.update(1.0 / @fps)

      # -------------- Apply camera movement logic --------------
      if @camera
        @camera.addAngle @inputController?.getCameraAngle()
        @camera.addSlopeAngle @inputController?.getCameraSlopeAngle()
        @camera.addDistance @inputController?.getCameraDistance()
        # -------------- Update camera ---------------
        @camera.update @clock.getDelta()

      # -------------- Render ---------------
      @renderer.render @scene, @camera unless not @camera or not @scene

window.app = new ThreeApp('canvas', '/OneWeb/modules/webGLTest/colladaScene')
