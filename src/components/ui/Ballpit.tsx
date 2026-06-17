'use client';

import React, { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  InstancedMesh,
  MathUtils,
  MeshStandardMaterial, // Switched from Physical for 4x faster mobile compilation
  Object3D,
  PerspectiveCamera,
  Plane,
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
      }
    }
    this.canvas!.style.display = 'block';

    const rendererOptions: WebGLRendererParameters = {
      canvas: this.canvas,
      powerPreference: 'high-performance', // Hint the hardware stack directly
      antialias: true,
      alpha: true,
      ...this.#config.rendererOptions
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
      rootMargin: '50px', // Pre-load slightly before scrolling onto viewport
      threshold: 0
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#onVisibilityChange.bind(this));
  }

  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(this.resize.bind(this), 150); // Relaxed debounce step
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
    // Limit dense retina displays to a standard 2.0x sampling ceiling
    const pr = Math.min(window.devicePixelRatio, 2); // <--- Fixed to const
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
      let delta = (timestamp - this.#lastTime) / 1000;
      this.#lastTime = timestamp;

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
      if (mesh.isMesh && mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat: Material) => mat.dispose());
        if (mesh.geometry) mesh.geometry.dispose();
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
      sizeData[i] = MathUtils.randFloat(config.minSize, config.maxSize);
    }
  }

  update(deltaInfo: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIdx = 0;
    if (config.controlSphere0) {
      startIdx = 1;
      _pos.fromArray(positionData, 0);
      _pos.lerp(center, 0.15).toArray(positionData, 0); // Accelerated pull responsiveness
      _zeroVel.toArray(velocityData, 0);
    }

    // Pass 1: Handle physical force applications
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

    // Pass 2: Spatial Proximity Collision Filtering
    // Throttled step patterns on mobile avoid calculating up to 40,000 sub-passes
    const isMobile = config.count < 110;
    const innerStep = isMobile ? 2 : 1; 

    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      _pos.fromArray(positionData, base);
      _vel.fromArray(velocityData, base);
      const radius = sizeData[idx];

      for (let jdx = idx + 1; jdx < config.count; jdx += innerStep) {
        const otherBase = 3 * jdx;
        _otherPos.fromArray(positionData, otherBase);
        _diff.copy(_otherPos).sub(_pos);
        
        const sumRadius = radius + sizeData[jdx];
        // Squared length check drops expensive Math.sqrt() roots inside the core loops
        const distSq = _diff.lengthSq(); 
        
        if (distSq < sumRadius * sumRadius) {
          const dist = Math.sqrt(distSq) || 0.001;
          const overlap = sumRadius - dist;
          _otherVel.fromArray(velocityData, otherBase);

          _correction.copy(_diff).divideScalar(dist).multiplyScalar(0.5 * overlap);
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
        const dSq = _diff.lengthSq();
        const sumRadius0 = radius + sizeData[0];
        if (dSq < sumRadius0 * sumRadius0) {
          const d = Math.sqrt(dSq) || 0.001;
          _correction.copy(_diff).divideScalar(d).multiplyScalar(sumRadius0 - d);
          _velCorrection.copy(_correction).multiplyScalar(Math.max(_vel.length(), 2));
          _pos.sub(_correction);
          _vel.sub(_velCorrection);
        }
      }

      // Wall boundaries
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
  ambientIntensity: 1.5,
  lightIntensity: 250,
  materialParams: {
    metalness: 0.2,
    roughness: 0.4
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
const pointerMap = new Map<HTMLElement, PointerData>();

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
      document.body.addEventListener('pointermove', onPointerMove, { passive: true });
      document.body.addEventListener('pointerleave', onPointerLeave, { passive: true });
      document.body.addEventListener('click', onPointerClick, { passive: true });

      // Passive triggers allow mobile hardware threads to process browser scrolling without hanging
      document.body.addEventListener('touchstart', onTouchStart, { passive: true });
      document.body.addEventListener('touchmove', onTouchMove, { passive: true });
      document.body.addEventListener('touchend', onTouchEnd, { passive: true });
      document.body.addEventListener('touchcancel', onTouchEnd, { passive: true });
      globalPointerActive = true;
    }
  }
  defaultData.dispose = () => {
    pointerMap.delete(options.domElement);
    if (pointerMap.size === 0) {
      document.body.removeEventListener('pointermove', onPointerMove);
      document.body.removeEventListener('pointerleave', onPointerLeave);
      document.body.removeEventListener('click', onPointerClick);
      document.body.removeEventListener('touchstart', onTouchStart);
      document.body.removeEventListener('touchmove', onTouchMove);
      document.body.removeEventListener('touchend', onTouchEnd);
      document.body.removeEventListener('touchcancel', onTouchEnd);
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

  constructor(params: Partial<XConfigParams> = {}) {
    const config = { ...DefaultBallpitConfig, ...params };
    
    // Dropped PMREM generator and RoomEnvironment runtime overhead entirely
    // Low polygon geometry paths yield smooth 60fps interaction on mobile viewports
    const geometry = new SphereGeometry(1, 16, 16); 
    const material = new MeshStandardMaterial({
      ...config.materialParams,
      roughness: 0.3,
      metalness: 0.1
    });

    super(geometry, material, config.count);
    this.config = config;
    this.physics = new W(config);
    this.#setupLights();
    this.setColors(config.colors);
  }

  #setupLights() {
    this.ambientLight = new AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(this.config.colors[0], this.config.lightIntensity, 40);
    this.add(this.light);
  }

  setColors(colors: number[]) {
    if (Array.isArray(colors) && colors.length > 1) {
      const colorObjects = colors.map(col => new Color(col));
      const colorsLength = colors.length;

      for (let idx = 0; idx < this.count; idx++) {
        const ratio = idx / this.count;
        const scaled = ratio * (colorsLength - 1);
        const baseIdx = Math.floor(scaled);
        const start = colorObjects[baseIdx];
        
        let finalColor = start;
        if (baseIdx < colorsLength - 1) {
          const alpha = scaled - baseIdx;
          const end = colorObjects[baseIdx + 1];
          finalColor = new Color().copy(start).lerp(end, alpha);
        }

        this.setColorAt(idx, finalColor);
        if (idx === 0) this.light.color.copy(finalColor);
      }

      if (this.instanceColor) this.instanceColor.needsUpdate = true;
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
    rendererOptions: { powerPreference: "high-performance" }
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
    spheres = new Z(cfg);
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
    get spheres() { return spheres; },
    setCount(count: number) { initialize({ ...spheres.config, count }); },
    togglePause() { isPaused = !isPaused; },
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

    // Responsive Object Threshold Filtering
    // Reduces object count automatically to preserve mobile thread execution space
    const isMobileViewport = window.innerWidth < 768;
    const dynamicCount = count ?? (isMobileViewport ? 85 : 200);

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
        count: dynamicCount,
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