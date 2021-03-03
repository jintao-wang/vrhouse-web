export class PanoramaCubeMaterial extends THREE.ShaderMaterial {
    uniforms = {
        onlyPanoramaCube1: {type: 'int', value: 1},
        panoramaCube1: {type: 'samplerCube', value: undefined},
        panoramaCube2: {type: 'samplerCube', value: undefined},
        panoramaPos1: {type: 'vec3', value: new THREE.Vector3()},
        panoramaPos2: {type: 'vec3', value: new THREE.Vector3()},
        panoramaMatrix1: {type: 'mat4', value: new THREE.Matrix4()},
        panoramaMatrix2: {type: 'mat4', value: new THREE.Matrix4()},
        panorama2Opacity: {type: 'float', value: 0},
        opacity: {type: 'float', value: 1},
        blurPanorama1: {type: 'bool', value: false},
        blurPanorama2: {type: 'bool', value: false},
    };

    vertexShader = `
        precision highp float;
        precision highp int;

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
        precision highp float;
        precision highp int;

        uniform int onlyPanoramaCube1;
        uniform mat4 panoramaMatrix1;
        uniform mat4 panoramaMatrix2;
        uniform vec3 panoramaPos1;
        uniform vec3 panoramaPos2;
        uniform float panorama2Opacity;
        uniform float opacity;
        uniform samplerCube panoramaCube1;
        uniform samplerCube panoramaCube2;
        uniform bool blurPanorama1;
        uniform bool blurPanorama2;
      
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        vec4 getBlurColorFromCube(samplerCube panoramaCube, vec3 direction) {
            vec4 sum = vec4(0, 0, 0, 0);
            float floatHelper = 1.0;
            float gaussBlur[20]; 
            gaussBlur[0] = 0.15;
            
            gaussBlur[1] = 0.07;
            gaussBlur[2] = 0.07;
            gaussBlur[3] = 0.07;
            gaussBlur[4] = 0.07;
            gaussBlur[5] = 0.07;
            gaussBlur[6] = 0.07;
            
            gaussBlur[7] = 0.05;
            gaussBlur[8] = 0.05;
            gaussBlur[9] = 0.05;
            gaussBlur[10] = 0.05;
            gaussBlur[11] = 0.05;
            gaussBlur[12] = 0.05;
            
            gaussBlur[13] = 0.03;
            gaussBlur[14] = 0.03;
            gaussBlur[15] = 0.03;
            gaussBlur[16] = 0.03;
            
            gaussBlur[17] = 0.01;
            
            for (int i = 0; i < 18; i++) {
                floatHelper = floatHelper + 4.0;
                sum += textureCube(panoramaCube, normalize(vec3(direction.x, direction.y - floatHelper, direction.z))) * gaussBlur[i] / 4.0;
                sum += textureCube(panoramaCube, normalize(vec3(direction.x, direction.y + floatHelper, direction.z))) * gaussBlur[i] / 4.0;
                sum += textureCube(panoramaCube, normalize(vec3(direction.x - floatHelper, direction.y, direction.z))) * gaussBlur[i] / 4.0;
                sum += textureCube(panoramaCube, normalize(vec3(direction.x + floatHelper, direction.y, direction.z))) * gaussBlur[i] / 4.0;
            }
            return sum;
        }

        vec4 getColorFromCube(samplerCube panoramaCube, vec3 panoramaPos, mat4 panoramaMatrix, bool isBlur) {
            vec3 direction = vPosition - panoramaPos;
            direction.x = -direction.x;
            direction = (vec4(direction, 1.0) * panoramaMatrix).xyz;
            
            if(isBlur == false){
                return textureCube(panoramaCube, normalize(direction));
            } 
            
            return getBlurColorFromCube(panoramaCube, direction);   
        }

        void main() {
           if(onlyPanoramaCube1 == 1) {
               gl_FragColor = getColorFromCube(panoramaCube1, panoramaPos1, panoramaMatrix1, blurPanorama1);
           } else {
               vec4 color1 = getColorFromCube(panoramaCube1, panoramaPos1, panoramaMatrix1, blurPanorama1);
               vec4 color2 = getColorFromCube(panoramaCube2, panoramaPos2, panoramaMatrix2, blurPanorama2);
               vec4 color = mix(color1, color2, panorama2Opacity);
               vec4 black = vec4(0,0,0,1);
               gl_FragColor = mix(black, color, opacity);
           }
        }
    `;
}
