/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import vert from './shaders/vertex.glsl';
import frag from './shaders/fragment.glsl';
//Texture Imports
import mask from './Textures/Mask.png';
import texture from './Textures/texture.jpg';
import particle from './Textures/particle.png';
import {smoothScroll, animations} from './animations.js';
import Particles from './particles.js';


let canvasWidth = window.innerWidth;
let canvasheight = window.innerHeight;

const gui = new GUI()

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
        this.renderer.setSize(canvasWidth, canvasheight);
        this.scene = new THREE.Scene();

       
        //Initilize Events, Scene, Objects, and Camera

        this.initScene();
        this.initTextures();
        this.initParticles();
        this.addMesh();
        this.windowEvents();
        
        
        //Start Rednering   
        this.render();

    }

    windowEvents() {
        window.onload = () => {
            animations();
        }
        //Responsive Canvas
        window.addEventListener('resize', this.resize.bind(this));

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
                gsap.to(this.material.uniforms.rippleInflunce, { duration: .5, value: 1. });
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
            } else {
                gsap.to(this.material.uniforms.mouseClickX, {
                    duration: .5,
                    delay: 0.2,
                    ease: "SlowMo",
                    value: 0
                });
                gsap.to(this.material.uniforms.mouseClickY, {
                    duration: .5,
                    delay: 0.2,
                    ease: "SlowMo",
                    value: 0
                });
            }
        });

    }
    initScene() {

        const cameraFolder = gui.addFolder('Camera');
        this.camera.position.set(270, 400, 0);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.x = -Math.PI / 2;
        this.camera.rotateZ(Math.PI);
        cameraFolder.add(this.camera.position, 'x', -1000, 1000);
        cameraFolder.add(this.camera.position, 'y', -1000, 1000);
        cameraFolder.add(this.camera.position, 'z', -1000, 1000);
        cameraFolder.add(this.camera.rotation, 'x', -10, 10, .2);
        cameraFolder.add(this.camera.rotation, 'y', -10, 10, .2);
        cameraFolder.add(this.camera.rotation, 'z', -10, 10, .2);

        //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    resize() {
        canvasWidth = window.innerWidth;
        canvasheight = window.innerHeight;
        this.renderer.setSize(canvasWidth, canvasheight);
        this.camera.aspect = canvasWidth / canvasheight;
        this.camera.updateProjectionMatrix();
        this.material.uniforms.resolution.value = new THREE.Vector2(canvasWidth, canvasheight);
    }
    initParticles() {
        this.particles = new Particles(2000, 1500, 4.5);
        this.particleMesh = this.particles.getMesh();
        this.particleMesh.material.map = this.particle;
        this.scene.add(this.particleMesh);
    }
    addMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(500, 500, 16, 16);
        this.geometry = new THREE.BufferGeometry();
        this.setUpGeometryAttributes();
        this.material = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            uniforms: {
                u_time: { value: this.time, type: 'f' },
                mask: { value: this.mask, type: 't' },
                texture1: { value: this.texture, type: 't' },
                mouseClickX: { value: 0, type: 'f' },
                mouseClickY: { value: 0, type: 'f' },
                progress: { value: 0, type: 'f' },
                rippleInflunce: { value: 0, type: 'f' },
                texture_influence: { value: 1, type: 'f' },
                resolution: { value: new THREE.Vector2(canvasWidth, canvasheight), type: 'v2' },
            },
            transparent: true,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.mesh);
        const progress = gui.add(this.material.uniforms.progress, 'value', 0, 1, .01);

    }
    setUpGeometryAttributes() {
        let number = 512;
        this.positions = new THREE.BufferAttribute(new Float32Array(number * number * 3), 3);
        this.uvs = new THREE.BufferAttribute(new Float32Array(number * number * 2), 2);
        let index = 0;
        for (let i = 0; i < number; i++) {
            let posX = i - (number / 2);
            for (let j = 0; j < number; j++) {
                this.positions.setXYZ(index, posX, 0, j - (number / 2));
                this.uvs.setXY(index, i / number, j / number);
                index++;
            }
        }
        this.geometry.setAttribute('position', this.positions);
        this.geometry.setAttribute('uv', this.uvs);
    }

    initTextures() {
        this.mask = new THREE.TextureLoader().load(mask);
        this.texture = new THREE.TextureLoader().load(texture);
        this.particle = new THREE.TextureLoader().load(particle);
    }
    updateUniforms() {
        let scroll = window.scrollY * 2
        this.material.uniforms.texture_influence.value = .86 - scroll / window.innerHeight;
        //this.material.uniforms.progress.value = window.scrollY/window.innerHeight;

        if (scroll / window.innerHeight < .75) {
            gsap.to(this.camera.position, { duration: 2.5, x: 270, y: 400, z: 0 });
            gsap.to(this.camera.rotation, { duration: 2.5, x: -Math.PI / 2, y: 0, z: Math.PI });
            gsap.to(this.material.uniforms.rippleInflunce, { duration: .5, value: 0 });
            
        }
        if (scroll / window.innerHeight >= .75 && window.scrollY / window.innerHeight < 1.75) {
            gsap.to(this.camera.position, { duration: 2.5, x: 0, y: 250, z: 450 });
            gsap.to(this.material.uniforms.progress, { duration: 2.5, value: 0 });
            gsap.to(this.material.uniforms.rippleInflunce, { duration: .5, value: 1 });
            gsap.to(this.camera.rotation, { duration: 2.5, x: -Math.PI / 6 , y: -Math.PI / 10, z: 0 });
            this.material.depthTest = false;
            this.material.depthWrite = false;
        }
        if (scroll/ window.innerHeight >= 1.75) {
            gsap.to(this.camera.position, { duration: 2.5, x: 0, y: 250, z: 700 });
            gsap.to(this.material.uniforms.progress, { duration: 1.5, value: 1.2 });
            gsap.to(this.camera.rotation, { duration: 2.5, x: -Math.PI / 8, y: Math.PI / 8, z: 0 });
            this.material.depthTest = true;
            this.material.depthWrite = true;
        }
    }
    render() {
        this.time += 0.01;
        
        this.material.uniforms.u_time.value = this.time;
        this.particleMesh.rotation.y += 0.001;
        this.particleMesh.rotation.z += 0.001;
        this.renderer.render(this.scene, this.camera);
        this.updateUniforms();
        smoothScroll();
        requestAnimationFrame(this.render.bind(this));

    }

}

new App();
