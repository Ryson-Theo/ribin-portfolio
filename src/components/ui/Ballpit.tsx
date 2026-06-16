'use client';

import React, { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  InstancedMesh,
  MathUtils,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  PointLight,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRendererParameters,
  Mesh,
  Material,
  OrthographicCamera
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface XConfig {
  canvas?: HTMLCanvasElement;
  id?: string;
  rendererOptions?: Partial<WebGLRendererParameters>;
  size?: 'parent' | { width: number; height: number };
}

interface SizeData {
  width: number;
  height: number;
  wWidth: number;
  wHeight: number;
  ratio: number;
  pixelRatio: number;
}

interface RenderState {
  elapsed: number;
  delta: number;
}

interface PostProcessingInstance {
  setSize: (width: number, height: number) => void;
  render: () => void;
  dispose: () => void;
}

class X {
  #config: XConfig;
  #postprocessing?: PostProcessingInstance;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId: number = 0;
  #lastTime: number = 0;
  #animationState: RenderState = { elapsed: 0, delta: 0 };
  #isAnimating: boolean = false;
  #isVisible: boolean = false;

  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  size: SizeData = {
    width: 0,
    height: 0,
    wWidth: 0,
    wHeight: 0,
    ratio: 0,
    pixelRatio: 0
  };

  render: () => void = this.#render.bind(this);
  onBeforeRender: (state: RenderState) => void = () => {};
  onAfterRender: (state: RenderState) => void = () => {};
  onAfterResize: (size: SizeData) => void = () => {};
  isDisposed: boolean = false;

  constructor(config: XConfig) {
    this.#config = { ...config };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.resize();
    this.#initObservers();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#config.canvas) {
      this.canvas = this.#config.canvas;
    } else if (this.#config.id) {
      const elem = document.getElementById(this.#config.id);
      if (elem instanceof HTMLCanvasElement) {
        this.canvas = elem;
      } else {
        console.error('Three: Missing canvas or id parameter');
      }
    } else {
      console.error('Three: Missing canvas or id parameter');
    }
    this.canvas!.style.display = 'block';

    const rendererOptions: WebGLRendererParameters = {
      canvas: this.canvas,
      powerPreference: 'default',
      ...(this.#config.rendererOptions ?? {})
    };
    this.renderer = new WebGLRenderer(rendererOptions);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #initObservers() {
    if (!(this.#config.size instanceof Object)) {
      window.addEventListener('resize', this.#onResize.bind(this));
      if (this.#config.size === 'parent' && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
        this.#resizeObserver.observe(this.canvas.parentNode as Element);
      }
    }
    this.#intersectionObserver = new IntersectionObserver(this.#onIntersection.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#onVisibilityChange.bind(this));
  }

  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let w: number, h: number;
    if (this.#config.size instanceof Object) {
      w = this.#config.size.width;
      h = this.#config.size.height;
    } else if (this.#config.size === 'parent' && this.canvas.parentNode) {
      w = (this.canvas.parentNode as HTMLElement).offsetWidth;
      h = (this.canvas.parentNode as HTMLElement).offsetHeight;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.#updateCamera();
    this.#updateRenderer();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#adjustFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #adjustFov(aspect: number) {
    const tanFov = Math.tan(MathUtils.degToRad(this.cameraFov / 2));
    const newTan = tanFov / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(newTan));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fovRad = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if ((this.camera as unknown as OrthographicCamera).isOrthographicCamera) {
      const cam = this.camera as unknown as OrthographicCamera;
      this.size.wHeight = cam.top - cam.bottom;
      this.size.wWidth = cam.right - cam.left;
    }
  }

  #updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pr = window.devicePixelRatio;
    if (this.maxPixelRatio && pr > this.maxPixelRatio) {
      pr = this.maxPixelRatio;
    } else if (this.minPixelRatio && pr < this.minPixelRatio) {
      pr = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pr);
    this.size.pixelRatio = pr;
  }

  get postprocessing(): PostProcessingInstance | undefined {
    return this.#postprocessing;
  }
  set postprocessing(value: PostProcessingInstance | undefined) {
    this.#postprocessing = value;
    if (value) {
      this.render = value.render.bind(value);
    } else {
      this.render = this.#render.bind(this);
    }
  }

  #onIntersection(entries: IntersectionObserverEntry[]) {
    this.#isAnimating = entries[0].isIntersecting;
    if (this.#isAnimating) {
      this.#startAnimation();
    } else {
      this.#stopAnimation();
    }
  }

  #onVisibilityChange() {
    if (this.#isAnimating) {
      if (document.hidden) {
        this.#stopAnimation();
      } else {
        this.#startAnimation();
      }
    }
  }

  #startAnimation() {
    if (this.#isVisible) return;
    this.#isVisible = true;
    this.#lastTime = performance.now();

    const animateFrame = (timestamp: number) => {
      this.#animationFrameId = requestAnimationFrame(animateFrame);
      
      // Calculate delta step in seconds
      let delta = (timestamp - this.#lastTime) / 1000;
      this.#lastTime = timestamp;

      // Handle breaks or background throttling jumps cleanly
      if (delta > 0.1) delta = 0.1;
      if (delta < 0) delta = 0;

      this.#animationState.delta = delta;
      this.#animationState.elapsed += delta;
      
      this.onBeforeRender(this.#animationState);
      this.render();
      this.onAfterRender(this.#animationState);
    };
    this.#animationFrameId = requestAnimationFrame(animateFrame);
  }

  #stopAnimation() {
    if (this.#isVisible) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isVisible = false;
    }
  }

  #render() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse(obj => {
      const mesh = obj as Mesh;
      if (mesh.isMesh && mesh.material && typeof mesh.material === 'object') {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        materials.forEach((mat: Material) => {
          Object.keys(mat).forEach(key => {
            const matProp = (mat as unknown as Record<string, unknown>)[key];
            if (matProp && typeof matProp === 'object' && 'dispose' in matProp && typeof (matProp as { dispose: () => void }).dispose === 'function') {
              (matProp as { dispose: () => void }).dispose();
            }
          });
          mat.dispose();
        });
        
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#onResizeCleanup();
    this.#stopAnimation();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    // REMOVED Context loss enforcement to support smooth React StrictMode component mount flashing
    this.isDisposed = true;
  }

  #onResizeCleanup() {
    window.removeEventListener('resize', this.#onResize.bind(this));
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.#onVisibilityChange.bind(this));
  }
}

interface WConfig {
  count: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  maxSize: number;
  minSize: number;
  size0: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  controlSphere0?: boolean;
  followCursor?: boolean;
}

const _pos = new Vector3();
const _vel = new Vector3();
const _otherPos = new Vector3();
const _otherVel = new Vector3();
const _diff = new Vector3();
const _correction = new Vector3();
const _velCorrection = new Vector3();
const _zeroVel = new Vector3(0, 0, 0);

class W {
  config: WConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: Vector3 = new Vector3();

  constructor(config: WConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.#initializePositions();
    this.setSizes();
  }

  #initializePositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const idx = 3 * i;
      positionData[idx] = MathUtils.randFloatSpread(2 * config.maxX);
      positionData[idx + 1] = MathUtils.randFloatSpread(2 * config.maxY);
      positionData[idx + 2] = MathUtils.randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      const idx = i;
      sizeData[idx] = MathUtils.randFloat(config.minSize, config.maxSize);
    }
  }

  update(deltaInfo: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIdx = 0;
    if (config.controlSphere0) {
      startIdx = 1;
      _pos.fromArray(positionData, 0);
      _pos.lerp(center, 0.1).toArray(positionData, 0);
      _zeroVel.toArray(velocityData, 0);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      _pos.fromArray(positionData, base);
      _vel.fromArray(velocityData, base);
      _vel.y -= deltaInfo.delta * config.gravity * sizeData[idx];
      _vel.multiplyScalar(config.friction);
      _vel.clampLength(0, config.maxVelocity);
      _pos.add(_vel);
      _pos.toArray(positionData, base);
      _vel.toArray(velocityData, base);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      _pos.fromArray(positionData, base);
      _vel.fromArray(velocityData, base);
      const radius = sizeData[idx];
      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        _otherPos.fromArray(positionData, otherBase);
        _otherVel.fromArray(velocityData, otherBase);
        _diff.copy(_otherPos).sub(_pos);
        const dist = _diff.length();
        const sumRadius = radius + sizeData[jdx];
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          _correction.copy(_diff).normalize().multiplyScalar(0.5 * overlap);
          _velCorrection.copy(_correction).multiplyScalar(Math.max(_vel.length(), 1));
          _pos.sub(_correction);
          _vel.sub(_velCorrection);
          _pos.toArray(positionData, base);
          _vel.toArray(velocityData, base);
          _otherPos.add(_correction);
          _velCorrection.copy(_correction).multiplyScalar(Math.max(_otherVel.length(), 1));
          _otherVel.add(_velCorrection);
          _otherPos.toArray(positionData, otherBase);
          _otherVel.toArray(velocityData, otherBase);
        }
      }
      if (config.controlSphere0) {
        _otherPos.fromArray(positionData, 0);
        _diff.copy(_otherPos).sub(_pos);
        const d = _diff.length();
        const sumRadius0 = radius + sizeData[0];
        if (d < sumRadius0) {
          _correction.copy(_diff).normalize().multiplyScalar(sumRadius0 - d);
          _velCorrection.copy(_correction).multiplyScalar(Math.max(_vel.length(), 2));
          _pos.sub(_correction);
          _vel.sub(_velCorrection);
        }
      }
      if (Math.abs(_pos.x) + radius > config.maxX) {
        _pos.x = Math.sign(_pos.x) * (config.maxX - radius);
        _vel.x = -_vel.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(_pos.y) + radius > config.maxY) {
          _pos.y = Math.sign(_pos.y) * (config.maxY - radius);
          _vel.y = -_vel.y * config.wallBounce;
        }
      } else if (_pos.y - radius < -config.maxY) {
        _pos.y = -config.maxY + radius;
        _vel.y = -_vel.y * config.wallBounce;
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(_pos.z) + radius > maxBoundary) {
        _pos.z = Math.sign(_pos.z) * (config.maxZ - radius);
        _vel.z = -_vel.z * config.wallBounce;
      }
      _pos.toArray(positionData, base);
      _vel.toArray(velocityData, base);
    }
  }
}

interface XConfigParams {
  count: number;
  colors: number[];
  ambientColor: number;
  ambientIntensity: number;
  lightIntensity: number;
  materialParams: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
  };
  minSize: number;
  maxSize: number;
  size0: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  controlSphere0: boolean;
  followCursor: boolean;
}

const DefaultBallpitConfig: XConfigParams = {
  count: 200,
  colors: [0x000000, 0xffffff],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true
};

const U = new Object3D();

let globalPointerActive = false;
const pointerPosition = new Vector2();

interface PointerData {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  touching: boolean;
  onEnter: (data: PointerData) => void;
  onMove: (data: PointerData) => void;
  onClick: (data: PointerData) => void;
  onLeave: (data: PointerData) => void;
  dispose?: () => void;
}

const pointerMap = new Map<HTMLElement, PointerData>();

function createPointerData(options: Partial<PointerData> & { domElement: HTMLElement }): PointerData {
  const defaultData: PointerData = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter: () => {},
    onMove: () => {},
    onClick: () => {},
    onLeave: () => {},
    ...options
  };
  if (!pointerMap.has(options.domElement)) {
    pointerMap.set(options.domElement, defaultData);
    if (!globalPointerActive) {
      document.body.addEventListener('pointermove', onPointerMove as EventListener);
      document.body.addEventListener('pointerleave', onPointerLeave as EventListener);
      document.body.addEventListener('click', onPointerClick as EventListener);

      document.body.addEventListener('touchstart', onTouchStart as EventListener, {
        passive: false
      });
      document.body.addEventListener('touchmove', onTouchMove as EventListener, {
        passive: false
      });
      document.body.addEventListener('touchend', onTouchEnd as EventListener, {
        passive: false
      });
      document.body.addEventListener('touchcancel', onTouchEnd as EventListener, {
        passive: false
      });
      globalPointerActive = true;
    }
  }
  defaultData.dispose = () => {
    pointerMap.delete(options.domElement);
    if (pointerMap.size === 0) {
      document.body.removeEventListener('pointermove', onPointerMove as EventListener);
      document.body.removeEventListener('pointerleave', onPointerLeave as EventListener);
      document.body.removeEventListener('click', onPointerClick as EventListener);

      document.body.removeEventListener('touchstart', onTouchStart as EventListener);
      document.body.removeEventListener('touchmove', onTouchMove as EventListener);
      document.body.removeEventListener('touchend', onTouchEnd as EventListener);
      document.body.removeEventListener('touchcancel', onTouchEnd as EventListener);
      globalPointerActive = false;
    }
  };
  return defaultData;
}

function onPointerMove(e: PointerEvent) {
  pointerPosition.set(e.clientX, e.clientY);
  processPointerInteraction();
}

function processPointerInteraction() {
  for (const [elem, data] of pointerMap) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      updatePointerData(data, rect);
      if (!data.hover) {
        data.hover = true;
        data.onEnter(data);
      }
      data.onMove(data);
    } else if (data.hover && !data.touching) {
      data.hover = false;
      data.onLeave(data);
    }
  }
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault();
    pointerPosition.set(e.touches[0].clientX, e.touches[0].clientY);
    for (const [elem, data] of pointerMap) {
      const rect = elem.getBoundingClientRect();
      if (isInside(rect)) {
        data.touching = true;
        updatePointerData(data, rect);
        if (!data.hover) {
          data.hover = true;
          data.onEnter(data);
        }
        data.onMove(data);
      }
    }
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault();
    pointerPosition.set(e.touches[0].clientX, e.touches[0].clientY);
    for (const [elem, data] of pointerMap) {
      const rect = elem.getBoundingClientRect();
      updatePointerData(data, rect);
      if (isInside(rect)) {
        if (!data.hover) {
          data.hover = true;
          data.touching = true;
          data.onEnter(data);
        }
        data.onMove(data);
      } else if (data.hover && data.touching) {
        data.onMove(data);
      }
    }
  }
}

function onTouchEnd() {
  for (const [, data] of pointerMap) {
    if (data.touching) {
      data.touching = false;
      if (data.hover) {
        data.hover = false;
        data.onLeave(data);
      }
    }
  }
}

function onPointerClick(e: PointerEvent) {
  pointerPosition.set(e.clientX, e.clientY);
  for (const [elem, data] of pointerMap) {
    const rect = elem.getBoundingClientRect();
    updatePointerData(data, rect);
    if (isInside(rect)) data.onClick(data);
  }
}

function onPointerLeave() {
  for (const data of pointerMap.values()) {
    if (data.hover) {
      data.hover = false;
      data.onLeave(data);
    }
  }
}

function updatePointerData(data: PointerData, rect: DOMRect) {
  data.position.set(pointerPosition.x - rect.left, pointerPosition.y - rect.top);
  data.nPosition.set((data.position.x / rect.width) * 2 - 1, (-data.position.y / rect.height) * 2 + 1);
}

function isInside(rect: DOMRect) {
  return (
    pointerPosition.x >= rect.left &&
    pointerPosition.x <= rect.left + rect.width &&
    pointerPosition.y >= rect.top &&
    pointerPosition.y <= rect.top + rect.height
  );
}

class Z extends InstancedMesh {
  config: XConfigParams;
  physics: W;
  ambientLight!: AmbientLight;
  light!: PointLight;

  constructor(renderer: WebGLRenderer, params: Partial<XConfigParams> = {}) {
    const config = { ...DefaultBallpitConfig, ...params };
    const roomEnv = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(roomEnv).texture;
    const geometry = new SphereGeometry();
    const material = new MeshPhysicalMaterial({ envMap: envTexture, ...config.materialParams });
    material.envMapRotation.x = -Math.PI / 2;
    super(geometry, material, config.count);
    this.config = config;
    this.physics = new W(config);
    this.#setupLights();
    this.setColors(config.colors);
    
    roomEnv.dispose();
    pmrem.dispose();
  }

  #setupLights() {
    this.ambientLight = new AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }

  setColors(colors: number[]) {
    if (Array.isArray(colors) && colors.length > 1) {
      const colorUtils = (function (colorsArr: number[]) {
        const baseColors: number[] = colorsArr;
        const colorObjects: Color[] = [];
        baseColors.forEach(col => {
          colorObjects.push(new Color(col));
        });
        return {
          getColorAt: (ratio: number, out: Color = new Color()) => {
            const clamped = Math.max(0, Math.min(1, ratio));
            const scaled = clamped * (baseColors.length - 1);
            const idx = Math.floor(scaled);
            const start = colorObjects[idx];
            if (idx >= baseColors.length - 1) return start.clone();
            const alpha = scaled - idx;
            const end = colorObjects[idx + 1];
            out.r = start.r + alpha * (end.r - start.r);
            out.g = start.g + alpha * (end.g - start.g);
            out.b = start.b + alpha * (end.b - start.b);
            return out;
          }
        };
      })(colors);
      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, colorUtils.getColorAt(idx / this.count));
        if (idx === 0) {
          this.light.color.copy(colorUtils.getColorAt(idx / this.count));
        }
      }

      if (!this.instanceColor) return;
      this.instanceColor.needsUpdate = true;
    }
  }

  update(deltaInfo: { delta: number }) {
    this.physics.update(deltaInfo);
    for (let idx = 0; idx < this.count; idx++) {
      U.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        U.scale.setScalar(0);
      } else {
        U.scale.setScalar(this.physics.sizeData[idx]);
      }
      U.updateMatrix();
      this.setMatrixAt(idx, U.matrix);
      if (idx === 0) this.light.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

interface CreateBallpitReturn {
  three: X;
  spheres: Z;
  setCount: (count: number) => void;
  togglePause: () => void;
  dispose: () => void;
}

function createBallpit(canvas: HTMLCanvasElement, config: Partial<XConfigParams> = {}): CreateBallpitReturn {
  const threeInstance = new X({
    canvas,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true }
  });
  let spheres: Z;
  threeInstance.renderer.toneMapping = ACESFilmicToneMapping;
  threeInstance.camera.position.set(0, 0, 20);
  threeInstance.camera.lookAt(0, 0, 0);
  threeInstance.cameraMaxAspect = 1.5;
  threeInstance.resize();
  initialize(config);
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectionPoint = new Vector3();
  let isPaused = false;

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.webkitUserSelect = 'none';

  const pointerData = createPointerData({
    domElement: canvas,
    onMove() {
      raycaster.setFromCamera(pointerData.nPosition, threeInstance.camera);
      threeInstance.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      spheres.physics.center.copy(intersectionPoint);
      spheres.config.controlSphere0 = true;
    },
    onLeave() {
      spheres.config.controlSphere0 = false;
    }
  });

  function initialize(cfg: Partial<XConfigParams>) {
    if (spheres) {
      threeInstance.clear();
      threeInstance.scene.remove(spheres);
    }
    spheres = new Z(threeInstance.renderer, cfg);
    threeInstance.scene.add(spheres);
  }

  threeInstance.onBeforeRender = deltaInfo => {
    if (!isPaused) spheres.update(deltaInfo);
  };
  threeInstance.onAfterResize = size => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };

  return {
    three: threeInstance,
    get spheres() {
      return spheres;
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count });
    },
    togglePause() {
      isPaused = !isPaused;
    },
    dispose() {
      pointerData.dispose?.();
      threeInstance.dispose();
    }
  };
}

interface BallpitProps {
  className?: string;
  followCursor?: boolean;
  colors?: number[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  maxVelocity?: number;
  count?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  maxX?: number;
  maxY?: number;
  maxZ?: number;
}

const Ballpit: React.FC<BallpitProps> = ({ 
  className = '', 
  followCursor = true, 
  colors,
  ambientColor,
  ambientIntensity,
  lightIntensity,
  gravity,
  friction,
  wallBounce,
  maxVelocity,
  count,
  minSize,
  maxSize,
  size0,
  maxX,
  maxY,
  maxZ
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spheresInstanceRef = useRef<CreateBallpitReturn | null>(null);

  const colorsKey = colors ? JSON.stringify(colors) : '';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      spheresInstanceRef.current = createBallpit(canvas, {
        followCursor,
        colors,
        ambientColor,
        ambientIntensity,
        lightIntensity,
        gravity,
        friction,
        wallBounce,
        maxVelocity,
        count,
        minSize,
        maxSize,
        size0,
        maxX,
        maxY,
        maxZ
      });
    } catch (error) {
      console.warn("Ballpit canvas execution suspended:", error);
    }

    return () => {
      spheresInstanceRef.current?.dispose();
    };
  }, [followCursor, colorsKey, ambientColor, ambientIntensity, lightIntensity, gravity, friction, wallBounce, maxVelocity, count, minSize, maxSize, size0, maxX, maxY, maxZ, colors]);

  return <canvas ref={canvasRef} className={`${className} w-full h-full`} />;
};

export default Ballpit;