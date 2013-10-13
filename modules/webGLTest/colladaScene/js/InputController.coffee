class window.InputController
  inputMappings:
    player: { FORWARD: 0, BACKWARDS: 1, LEFT: 2, RIGHT: 3, ATTACK: 5 }
    camera: { LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3, ZOOM_IN: 4, ZOOM_OUT: 5 }
  inputs:
    player: [null, null, null, null, false]
    camera: [0, 0, 0, 0, 0, 0]

  constructor: -> @init()

  init: ->
    window.addEventListener 'keydown', (e) =>
      switch e.keyCode
      # --------------- Player controls --------------
        when 32 then @inputs.player[@inputMappings.player.ATTACK] = true
        when 37 then @inputs.player[@inputMappings.player.LEFT] = new THREE.Vector3(-1, 0, 0)
        when 39 then @inputs.player[@inputMappings.player.RIGHT] = new THREE.Vector3(1, 0, 0)
        when 38 then @inputs.player[@inputMappings.player.FORWARD] = new THREE.Vector3(0, 0, -1)
        when 40 then @inputs.player[@inputMappings.player.BACKWARDS] = new THREE.Vector3(0, 0, 1)
      # --------------- Camera controls --------------
        when 65 then @inputs.camera[@inputMappings.camera.LEFT] = 1
        when 68 then @inputs.camera[@inputMappings.camera.RIGHT] = -1
        when 87 then @inputs.camera[@inputMappings.camera.UP] = 1
        when 83 then @inputs.camera[@inputMappings.camera.DOWN] = -1
        when 90 then @inputs.camera[@inputMappings.camera.ZOOM_IN] = -1
        when 88 then @inputs.camera[@inputMappings.camera.ZOOM_OUT] = 1

    window.addEventListener 'keyup', (e) =>
      switch e.keyCode
      # --------------- Player controls --------------
        when 32 then @inputs.player[@inputMappings.player.ATTACK] = false
        when 37 then @inputs.player[@inputMappings.player.LEFT] = null
        when 39 then @inputs.player[@inputMappings.player.RIGHT] = null
        when 38 then @inputs.player[@inputMappings.player.FORWARD] = null
        when 40 then @inputs.player[@inputMappings.player.BACKWARDS] = null
      # --------------- Camera controls --------------
        when 65 then @inputs.camera[@inputMappings.camera.LEFT] = 0
        when 68 then @inputs.camera[@inputMappings.camera.RIGHT] = 0
        when 87 then @inputs.camera[@inputMappings.camera.UP] = 0
        when 83 then @inputs.camera[@inputMappings.camera.DOWN] = 0
        when 90 then @inputs.camera[@inputMappings.camera.ZOOM_IN] = 0
        when 88 then @inputs.camera[@inputMappings.camera.ZOOM_OUT] = 0
        else console.log "key #{e.keyCode} is not associated"

  getPlayerMovementTarget: ->
    target = new THREE.Vector3(0, 0, 0)
    (target.add(@inputs.player[v]) unless not @inputs.player[v]) for v in [(@inputMappings.player.FORWARD)..(@inputMappings.player.RIGHT)]
    target

  isPlayerAttacking: -> @inputs.player[@inputMappings.player.ATTACK]

  getCameraAngle: -> @inputs.camera[@inputMappings.camera.LEFT] + @inputs.camera[@inputMappings.camera.RIGHT]

  getCameraSlopeAngle: -> @inputs.camera[@inputMappings.camera.UP] + @inputs.camera[@inputMappings.camera.DOWN]

  getCameraDistance: -> @inputs.camera[@inputMappings.camera.ZOOM_IN] + @inputs.camera[@inputMappings.camera.ZOOM_OUT]