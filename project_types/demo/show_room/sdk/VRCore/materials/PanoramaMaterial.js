export class PanoramaMaterial extends THREE.ShaderMaterial {
    constructor() {
        super();
    }

    uniforms = {
        panoramaCenter: {type: 'vec3', value: new THREE.Vector3()},
        panoramaMatrix: {type: 'mat4', value: new THREE.Matrix4()},
        panoramaTexture: {type: "t", value: undefined},
        opacity: {type: 'float', value: 1.0},
        brightness: {type: 'float', value: 1.0}
    };

    vertexShader = `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
            vNormal = normal;
            vUv = uv;
            vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

    fragmentShader = `
        uniform vec3 panoramaCenter;
        uniform mat4 panoramaMatrix;
        uniform sampler2D panoramaTexture;
        uniform float opacity;
        uniform float brightness;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        float PI = 3.1415926535898;

        void main() {
            vec3 direction = vPosition - panoramaCenter;
            direction.x = -direction.x;
            direction = (vec4(direction, 1.0) * panoramaMatrix).xyz;
            float theta = atan(direction.x, direction.z);
            float phi = asin(direction.y / length(direction));
            highp vec2 position = vec2(theta / (2.0 * PI), phi / PI + 0.5);
            vec4 color = texture2D(panoramaTexture, position);
            color.a = opacity;
            gl_FragColor = color * brightness;
        }
    `;

    get opacity() {
        if (!this.uniforms) return;
        return this.uniforms.opacity.value;
    }

    set opacity(value) {
        if (!this.uniforms) return;
        this.uniforms.opacity.value = parseFloat(value);
    }
}
