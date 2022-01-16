/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import vert from './shaders/vertex.glsl';
import frag from './shaders/fragment.glsl';
//Texture Imports
import mask from './Textures/Mask.png';




let canvasWidth = window.innerWidth;
let canvasheight = window.innerHeight;
let planeMaterial;

const gui = new GUI()

const createPlane = () => {
    const planeData = {
        width: 1,
        height: 1,
        widthSegments: 128,
        heightSegments: 128
    }
    let planeGeometry = new THREE.PlaneGeometry(planeData.width, planeData.height, planeData.widthSegments, planeData.heightSegments);

    planeMaterial = new THREE.ShaderMaterial(
        {
            uniforms,
            vertexShader: vert,
            fragmentShader: frag
        }
    );
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //let wireframeGeom = new THREE.WireframeGeometry( planeGeometry );
    //const wireframe = new THREE.LineSegments( wireframeGeom, wireframeMaterial );

    return [plane];
}
let makeInstance = (geometry, color, x) => {
    const material = new THREE.MeshPhongMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    return cube;
}
export default class App {
    constructor() {
        this.time = 0;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        let canvas = document.getElementById('c');
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: true
        });
        this.camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasheight, 0.1, 2000);
        this.camera.position.set(195, 206, 400);
        this.renderer.setSize(canvasWidth, canvasheight);
        this.scene = new THREE.Scene();


        //Initilize Events, Scene, Objects, and Camera
        this.initScene();
        this.initTextures();
        this.addMesh();
        this.windowEvents();



        //Start Rednering   
        this.render();

    }

    windowEvents() {
        //Responsive Canvas
        window.addEventListener('resize', function () {
            canvasWidth = window.innerWidth;
            canvasheight = window.innerHeight;
            this.camera.aspect = canvasWidth / canvasheight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(canvasWidth, canvasheight);

        }, false);

        //On mouse down
        window.addEventListener('mousedown', e => {
            
        });

        window.addEventListener('mouseup', e => {
            //this.material.uniforms.u_mouseClick.value = new THREE.Vector2 (0, 0);
            
        });

        window.addEventListener('mousemove', e => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersections = this.raycaster.intersectObjects([this.mesh], false);
            let intersection = (intersections.length) > 0 ? intersections[0] : null;

            if (intersection !== null) {
              
                gsap.to(this.material.uniforms.mouseClickX, {
                    duration: .5,
                    delay: 0.2,
                    ease: "SlowMo",
                    value: intersection.point.x
                });
                gsap.to(this.material.uniforms.mouseClickY, {
                    duration: .5,
                    delay: 0.2,
                    ease: "SlowMo",
                    value: intersection.point.z
                });
            }
        });

    }
    initScene() {

        const cameraFolder = gui.addFolder('Camera');
        cameraFolder.add(this.camera.position, 'x', -10, 1000);
        cameraFolder.add(this.camera.position, 'y', -10, 1000);
        cameraFolder.add(this.camera.position, 'z', 0, 1000);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    addMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(500, 500, 16, 16);
        this.geometry = new THREE.BufferGeometry();
        this.setUpGeometry();
        this.material = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            uniforms: {
                u_time: { value: this.time, type: 'f' },
                mask: { value: this.mask, type: 't' },
                mouseClickX: { value:0, type: 'f' },
                mouseClickY: { value:0, type: 'f' },
            },
            transparent: true,

            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.mesh);
    }
    setUpGeometry() {
        let number = 256;
        this.positions = new THREE.BufferAttribute(new Float32Array(number * number * 3), 3);
        let index = 0;
        for (let i = 0; i < number; i++) {
            let posX = i - (number / 2);
            for (let j = 0; j < number; j++) {
                this.positions.setXYZ(index, posX, 0, j - (number / 2));
                index++;
            }
        }
        this.geometry.setAttribute('position', this.positions);
    }

    initTextures() {
        this.mask = new THREE.TextureLoader().load(mask);
    }

    render() {
        this.time++;
        this.controls.update();
        this.material.uniforms.u_time.value = this.time;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));

    }

}

new App();

