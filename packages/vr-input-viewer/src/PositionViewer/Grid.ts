import * as THREE from "three";

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
uniform vec2 size;
void main() {
  vUv = uv * size;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform float lineThickness;
uniform float lineSpacing;
uniform float fadeSize;
uniform vec3 color;
uniform vec2 size;

varying vec2 vUv;

float line(float a, float b, float lineWidth, float feather) {
  float halfWidth = lineWidth / 2.0;
  return smoothstep(a - halfWidth - feather, a - halfWidth, b) - 
    smoothstep(a + halfWidth - feather, a + halfWidth, b);
}

void main() {
  float linesX = line(
    lineThickness,
    fract(vUv.x * lineSpacing),
    lineThickness,
    lineThickness / 2.0
  );
  float linesY = line(
    lineThickness,
    fract(vUv.y * lineSpacing),
    lineThickness,
    lineThickness / 2.0
  );
  float lines = max(linesX, linesY);

  vec2 worldUv = vUv / size;
  float distToCenter = distance(worldUv, vec2(0.5));
  float fadeRaw = distToCenter / (fadeSize / max(size.x, size.y));
  float fade = clamp(fadeRaw, 0.0, 1.0);

  gl_FragColor = vec4(color * lines, 1.0 - fade);
}
`;

export class Grid {
  plane: THREE.Mesh;
  material: THREE.ShaderMaterial;

  constructor(
    public radius: number,
    public spacing: number,
    public thickness: number,
  ) {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.calculateUniforms(),
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    this.plane = new THREE.Mesh(planeGeometry, this.material);
    this.plane.rotateX(Math.PI * -0.5);
  }

  update() {
    this.plane.scale.set(this.radius * 2, this.radius * 2, this.radius * 2);
    this.material.uniforms = this.calculateUniforms();
  }

  private calculateUniforms() {
    return {
      size: {
        value: new THREE.Vector2(this.radius * 2, this.radius * 2),
      },
      lineThickness: { value: this.thickness },
      lineSpacing: { value: 1 / this.spacing },
      fadeSize: { value: this.radius },
      color: { value: new THREE.Color(0xffffff) },
    };
  }
}
