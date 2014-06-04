class window.ThreeApp
  urlRoot: '/'
  container: null
  camera: null
  scene: null
  renderer: null
  fps: 40
  lastFrameTime: 0
  clock: null
  dae: null
  inputController: null

  constructor: (containerId, urlRoot) ->
    @container = document.getElementById(containerId)
    @urlRoot = urlRoot ? @urlRoot
    require ["#{@urlRoot}/lib/js/three.min.js"], () =>
      require ["#{@urlRoot}/lib/js/simplex-noise.js"], () =>
        require ["#{@urlRoot}/lib/js/physi.js"], () =>
          Physijs.scripts.worker = "#{@urlRoot}/lib/js/physijs_worker.js"
          Physijs.scripts.ammo = "#{@urlRoot}/lib/js/ammo.js"
          console.log Physijs
          require ["#{@urlRoot}/js/three.ext.js"], () =>
            require ["#{@urlRoot}/js/physi.ext.js"], () => @load()

  load: ->
    # -------------- Load objects ---------------
    require ["#{@urlRoot}/js/ColladaObject.js"], () =>
      require ["#{@urlRoot}/js/TerrainColladaObject.js"], () =>
        require ["#{@urlRoot}/js/SkinnedColladaObject.js"], () =>
          @dae = new SkinnedColladaObject @, "#{@urlRoot}/models/zombie01/zombie.dae", 0.05, true,
            walk: { start: 0, end: 27, looping: true }
            idle: { start: 28, end: 84, looping: true }
            attack: { start: 85, end: 106, looping: false }
          @dae.load () =>
            @daeMountain = new TerrainColladaObject @, "#{@urlRoot}/models/mountain01/mountain.dae", 0.01, true, null
            @daeMountain.load () => @init()

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
      .2  #med friction
      .7  #low restitution
    )
    ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping
    ground_material.map.repeat.set(2.5, 2.5)

    ###
    NoiseGen = new SimplexNoise;
    ground_geometry = new THREE.PlaneGeometry( 75, 75, 50, 50 );
    for i in [0..ground_geometry.vertices.length-1]
      do (i) ->
        vertex = ground_geometry.vertices[i];
        vertex.z = NoiseGen.noise( vertex.x / 10, vertex.y / 10 ) * 0.3
    ground_geometry.computeFaceNormals()
    ground_geometry.computeVertexNormals()
    # If your plane is not square as far as face count then the HeightfieldMesh
    # takes two more arguments at the end: # of x faces and # of y faces that were passed to THREE.PlaneMaterial
    ground = new Physijs.HeightfieldMesh(ground_geometry, ground_material,0, 50, 50);
    ground.rotation.x = Math.PI / -2
    ground.receiveShadow = true
    ###

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

    #@daeMountain.init @scene
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
