'use strict';

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

THREE.Vector3.prototype.toBt = function () {
    return new Ammo.btVector3(this.x, this.y, this.z);
};

(function() {

    var projector, renderer, scene, light, camera,
        initScene, render, main, updateBoxes,
        createBox, now, lastbox = 0, boxes = [];

    initScene = function() {
        var collisionConfiguration, dispatcher, overlappingPairCache, solver, // Ammo world
            ground, groundShape, groundTransform, groundMass, localInertia, motionState, rbInfo, groundAmmo;


        // Projector
        projector = new THREE.Projector();


        // Renderer
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById( 'viewport' ).appendChild( renderer.domElement );


        // Scene
        scene = new THREE.Scene();


        // Light
        light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.set( 40, 40, 25 );
        light.target.position.copy( scene.position );
        light.castShadow = true;
        light.shadowCameraLeft = -25;
        light.shadowCameraTop = -25;
        light.shadowCameraRight = 25;
        light.shadowCameraBottom = 25;
        light.shadowBias = -.0001
        scene.add( light );


        // Ammo world
        collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
        overlappingPairCache = new Ammo.btDbvtBroadphase();
        solver = new Ammo.btSequentialImpulseConstraintSolver();
        scene.world = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration );
        scene.world.setGravity(new Ammo.btVector3(0, -12, 0));


        // Camera
        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.set( 60, 50, 60 );
        camera.lookAt( scene.position );
        scene.add( camera );


        // Ground
        ground = new THREE.Mesh(
            new THREE.PlaneGeometry( 50, 50 ),
            new THREE.MeshLambertMaterial({ color: 0xDDDDDD })
        );
        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI / 2;
        scene.add( ground );


        // Ground physics
        groundShape = new Ammo.btBoxShape(new Ammo.btVector3( 25, 1, 25 ));
        groundTransform = new Ammo.btTransform();
        groundTransform.setIdentity();
        groundTransform.setOrigin(new Ammo.btVector3( 0, -1, 0 ));

        groundMass = 0;
        localInertia = new Ammo.btVector3(0, 0, 0);
        motionState = new Ammo.btDefaultMotionState( groundTransform );
        rbInfo = new Ammo.btRigidBodyConstructionInfo( groundMass, motionState, groundShape, localInertia );
        groundAmmo = new Ammo.btRigidBody( rbInfo );
        //scene.world.addRigidBody( groundAmmo );
    };

    createBox = function() {
        var box, position_x, position_z,
            mass, startTransform, localInertia, boxShape, motionState, rbInfo, boxAmmo;

        position_x = Math.random() * 10 - 5;
        position_z = Math.random() * 10 - 5;

        // Create 3D box model
        box = new THREE.Mesh(
            new THREE.CubeGeometry( 3, 3, 3),
            new THREE.MeshLambertMaterial({ opacity: 1, transparent: true })
        );
        box.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 );
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add( box );

        // Create box physics model
        mass = 3 * 3 * 3;
        startTransform = new Ammo.btTransform();
        startTransform.setIdentity();
        startTransform.setOrigin(new Ammo.btVector3( position_x, 20, position_z ));

        localInertia = new Ammo.btVector3(0, 0, 0);

        boxShape = new Ammo.btBoxShape(new Ammo.btVector3( 1.5, 1.5, 1.5 ));
        boxShape.calculateLocalInertia( mass, localInertia );

        motionState = new Ammo.btDefaultMotionState( startTransform );
        rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, boxShape, localInertia );
        boxAmmo = new Ammo.btRigidBody( rbInfo );
        scene.world.addRigidBody( boxAmmo );

        boxAmmo.mesh = box;
        boxes.push( boxAmmo );
    };

    var createConcaveStuff = function() {
        var concave, mass, startTransform, localInertia, concaveShape, motionState, rbInfo, concaveAmmo, loader;

        // Create concave physics model
        mass = 0;
        startTransform = new Ammo.btTransform();
        startTransform.setIdentity();
        startTransform.setOrigin(new Ammo.btVector3( 0, 0, 0 ));
        motionState = new Ammo.btDefaultMotionState( startTransform );
        localInertia = new Ammo.btVector3(0, 0, 0);

        loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load('models/mountain01/mountain.dae', function(collada) {
            console.log(collada);
            concave = collada.meshes[0];
            concave.scale.x = concave.scale.y = concave.scale.z = 0.01;
            concave.position.y = 1;
            concave.updateMatrix();
            scene.add(concave);
            /*
            concaveShape = new Ammo.btBoxShape(new Ammo.btVector3( 1.5, 1.5, 1.5 ));
            concaveShape.calculateLocalInertia( mass, localInertia );


            rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, concaveShape, localInertia );
            concaveAmmo = new Ammo.btRigidBody( rbInfo );
            scene.world.addRigidBody( concaveAmmo );

            concaveAmmo.mesh = concave;


            var compoundShape = new Ammo.btCompoundShape(true);
            var faces = concave.geometry.faces;
            var vertices = concave.geometry.vertices;
            faces.forEach(function (f, i, arr) {
                var v1 = vertices[f.a].toBt(),
                    v2 = vertices[f.b].toBt(),
                    v3 = vertices[f.c].toBt();
                var convex = new Ammo.btConvexHullShape(),
                    transform = new Ammo.btTransform();
                transform.setIdentity();

                convex.addPoint(v1);
                convex.addPoint(v2);
                convex.addPoint(v3);
                if (f.d) {
                    var v4 = vertices[f.d].toBt();
                    convex.addPoint(v4);
                }
                compoundShape.addChildShape(transform, convex);
            });

             */

            //compoundShape.calculateLocalInertia( mass, localInertia );
            //rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, compoundShape, localInertia );
            //concaveAmmo = new Ammo.btRigidBody( rbInfo );
            //scene.world.addRigidBody( concaveAmmo );
            //concaveAmmo.mesh = concave;


            var mesh = new Ammo.btTriangleMesh(true, true);
            var faces = concave.geometry.faces;
            var vertices = concave.geometry.vertices;
            setTimeout(function() {
                for (var i= 0,j=faces.length; i<j/2; i++) {
                    var v1 = vertices[faces[i].a].toBt(),
                        v2 = vertices[faces[i].b].toBt(),
                        v3 = vertices[faces[i].c].toBt();
                    mesh.addTriangle(v1, v2, v3, false);
                }

                var shape = new Ammo.btBvhTriangleMeshShape(mesh, true, true);
                concaveAmmo = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia));
                scene.world.addRigidBody( concaveAmmo );

            }, 0);



        });
    };

    updateBoxes = function() {
        scene.world.stepSimulation( 1 / 60, 5 );
        var i, transform = new Ammo.btTransform(), origin, rotation;

        for ( i = 0; i < boxes.length; i++ ) {
            boxes[i].getMotionState().getWorldTransform( transform );

            origin = transform.getOrigin();
            boxes[i].mesh.position.x = origin.x();
            boxes[i].mesh.position.y = origin.y();
            boxes[i].mesh.position.z = origin.z();

            rotation = transform.getRotation();
            boxes[i].mesh.quaternion.x = rotation.x();
            boxes[i].mesh.quaternion.y = rotation.y();
            boxes[i].mesh.quaternion.z = rotation.z();
            boxes[i].mesh.quaternion.w = rotation.w();
        }
    };

    render = function render() {
        renderer.render(scene, camera);
    };

    main = function main() {

        // Create a new box every second
        now = new Date().getTime();
        if ( boxes.length < 10 && now - lastbox > 1000 ) {
            createBox();
            lastbox = now;
        }

        // Run physics
        updateBoxes();

        render();
        window.requestAnimFrame(main);
    };

    window.onload = function() {
        initScene();
        createConcaveStuff();
        requestAnimFrame(main);
    };

})();
