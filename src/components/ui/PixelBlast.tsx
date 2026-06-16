'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
};

const MAX_CLICKS = 10;

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int uShapeType;
uniform int uLiquid;
uniform float uLiquidStrength;
uniform float uLiquidRadius;
uniform float uLiquidWobbleSpeed;
uniform float uNoiseAmount;

const int SHAPE_SQUARE = 0;
const int SHAPE_CIRCLE = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND = 3;
const int MAX_CLICKS = 10;

uniform vec2 uClickPos[MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

float hash11(float n) {
  return fract(sin(n) * 43758.5453);
}

float hash22(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float Bayer8(vec2 p) {
  vec2 a = floor(p);
  float b = fract(a.x / 2.0 + a.y * a.y * 0.75);
  float c = fract((a.x * 0.5 + a.y * 0.25));
  return mix(b, c, 0.5);
}

float maskCircle(vec2 p, float cov) {
  float r = sqrt(cov) * 0.25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov) {
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d = p.y - r * (1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d / aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov) {
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = fragCoord / uResolution;
  vec2 coord = fragCoord - uResolution * 0.5;
  vec2 pixel = coord / uPixelSize;
  vec2 pixelId = floor(pixel);
  vec2 pixelUV = fract(pixel);

  float cellSize = 8.0 * uPixelSize;
  vec2 cellId = floor(coord / cellSize);
  vec2 cellUv = (cellId * cellSize) / uResolution * vec2(uResolution.x / uResolution.y, 1.0);

  float pattern = sin(dot(cellUv, vec2(12.7, 8.3)) * uScale + uTime * 0.2) * 0.5 + 0.5;
  pattern += (hash22(cellUv * 10.0) - 0.5) * 0.25;
  float feed = pattern * 0.6 + (uDensity - 0.5) * 0.4;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i) {
      vec2 pos = uClickPos[i];
      float clickTime = uClickTimes[i];
      if (pos.x < 0.0) continue;
      float t = max(uTime - clickTime, 0.0);
      vec2 clickUv = (pos - uResolution * 0.5) / uResolution * vec2(uResolution.x / uResolution.y, 1.0);
      float r = distance(cellUv, clickUv);
      float wave = exp(-pow((r - t * uRippleSpeed) / uRippleThickness, 2.0));
      float atten = exp(-0.8 * t) * exp(-3.0 * r);
      feed = max(feed, wave * atten * uRippleIntensity);
    }
  }

  float dither = Bayer8(fragCoord / uPixelSize) - 0.5;
  float coverage = step(0.5, feed + dither);
  float jitter = (hash22(pixelId) - 0.5) * uPixelJitter;
  coverage = clamp(coverage + jitter, 0.0, 1.0);

  float mask;
  if (uShapeType == SHAPE_CIRCLE) mask = maskCircle(pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) mask = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND) mask = maskDiamond(pixelUV, coverage);
  else mask = coverage;

  if (uEdgeFade > 0.0) {
    float edge = min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    mask *= fade;
  }

  if (uLiquid == 1) {
    float wobble = sin((uv.y * 12.0 + uTime * uLiquidWobbleSpeed) * 1.5) *
      cos((uv.x * 12.0 + uTime * uLiquidWobbleSpeed) * 1.1);
    mask *= 1.0 - smoothstep(0.0, 1.0, abs(wobble) * uLiquidStrength * 0.9);
  }

  float noiseVal = (hash22(uv * 1234.0) - 0.5) * uNoiseAmount;
  float alpha = clamp(mask + noiseVal, 0.0, 1.0);

  vec3 srgbColor = mix(uColor * 12.92, 1.055 * pow(uColor, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, uColor));

  gl_FragColor = vec4(srgbColor, alpha);
}
`;

const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = 'square',
  pixelSize = 4,
  color = '#3b82f6',
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.25,
  noiseAmount = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const clickIndexRef = useRef(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias,
      alpha: transparent,
      powerPreference: 'high-performance',
    });
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC,
      fragmentShader: FRAGMENT_SRC,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uTime: { value: 0 },
        uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
        uScale: { value: patternScale },
        uDensity: { value: patternDensity },
        uPixelJitter: { value: pixelSizeJitter },
        uEnableRipples: { value: enableRipples ? 1 : 0 },
        uRippleSpeed: { value: rippleSpeed },
        uRippleThickness: { value: rippleThickness },
        uRippleIntensity: { value: rippleIntensityScale },
        uEdgeFade: { value: edgeFade },
        uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
        uLiquid: { value: liquid ? 1 : 0 },
        uLiquidStrength: { value: liquidStrength },
        uLiquidRadius: { value: liquidRadius },
        uLiquidWobbleSpeed: { value: liquidWobbleSpeed },
        uNoiseAmount: { value: noiseAmount },
        uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
        uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      },
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
      material.uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const updateTime = (time: number) => {
      if (startRef.current === null) startRef.current = time;
      const elapsed = (time - startRef.current) / 1000;
      material.uniforms.uTime.value = elapsed * speed;
    };

    const pointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (renderer.domElement.width / rect.width);
      const y = (rect.height - (event.clientY - rect.top)) * (renderer.domElement.height / rect.height);
      const index = clickIndexRef.current % MAX_CLICKS;
      const clickPos = material.uniforms.uClickPos.value as THREE.Vector2[];
      clickPos[index].set(x, y);
      (material.uniforms.uClickTimes.value as Float32Array)[index] = material.uniforms.uTime.value;
      clickIndexRef.current += 1;
    };

    renderer.domElement.addEventListener('pointerdown', pointerDown, { passive: true });

    const animate = (time: number) => {
      updateTime(time);
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    antialias,
    color,
    edgeFade,
    enableRipples,
    liquid,
    liquidRadius,
    liquidStrength,
    liquidWobbleSpeed,
    noiseAmount,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensityScale,
    rippleSpeed,
    rippleThickness,
    speed,
    transparent,
    variant,
  ]);

  return <div ref={containerRef} className={`absolute inset-0 z-0 ${className}`} style={style} />;
};

export default PixelBlast;
