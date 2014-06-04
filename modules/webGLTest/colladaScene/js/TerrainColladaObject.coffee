class window.TerrainColladaObject extends ColladaObject
  app: null
  src: null
  scale: 1
  physics: false
  mass: 0
  mesh: null
  obj: null

  constructor: (@app, @src, @scale, @physics) ->

  load: (cb) ->
    require ["#{@app.urlRoot}/lib/js/ColladaLoader.js"], () =>
      loader = new THREE.ColladaLoader()
      loader.options.convertUpAxis = true
      loader.load @src, (collada) =>
        console.log collada
        @mesh = collada.meshes[0]
        cb() unless not cb

  init: (scene) ->
    @mesh.scale.x = @mesh.scale.y = @mesh.scale.z = @scale
    @mesh.position.y = -10
    @mesh.updateMatrix()
    if @physics
      @obj = new Physijs.HeightfieldMesh @mesh.geometry, @mesh.material, @mass
    else
      @obj = @mesh
    scene.add @obj

  update: (delta) =>
