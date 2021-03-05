export function CubeBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) {

    THREE.BufferGeometry.call(this);

    this.type = 'CubeBufferGeometry';

    this.parameters = {
        width: width,
        height: height,
        depth: depth,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        depthSegments: depthSegments
    };

    var scope = this;

    width = width || 1;
    height = height || 1;
    depth = depth || 1;

    // segments

    widthSegments = Math.floor(widthSegments) || 1;
    heightSegments = Math.floor(heightSegments) || 1;
    depthSegments = Math.floor(depthSegments) || 1;

    // buffers

    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];

    // helper variables

    var numberOfVertices = 0;
    var groupStart = 0;

    // build each side of the box geometry

    buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments, 0); // px
    buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments, 1 * depthSegments * heightSegments); // nx
    buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 * widthSegments * depthSegments); // py
    buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments, 3 * widthSegments * depthSegments); // ny
    buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments, 4 * widthSegments * heightSegments); // pz
    buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments, 5 * widthSegments * heightSegments); // nz

    // build geometry

    this.setIndex(indices);
    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex) {

        var segmentWidth = width / gridX;
        var segmentHeight = height / gridY;

        var widthHalf = width / 2;
        var heightHalf = height / 2;
        var depthHalf = depth / 2;

        var vertexCounter = 0;

        // 1. you need three indices to draw a single face
        // 2. a single segment consists of two faces
        // 3. so we need to generate six (2*3) indices per segment
        var faceCount = 6;

        var ix, iy;
        var i, j;

        var vector = new THREE.Vector3();

        // generate vertices, normals and uvs

        for (ix = 0; ix < gridX; ix++) {

            var x = ix * segmentWidth - widthHalf;

            for (iy = 0; iy < gridY; iy++) {

                var y = iy * segmentHeight - heightHalf;

                for (i = 0; i < 2; i++) {
                    for (j = 0; j < 2; j++) {
                        // set values to correct vector component

                        vector[u] = (x + i * segmentWidth) * udir;
                        vector[v] = (y + j * segmentHeight) * vdir;
                        vector[w] = depthHalf;

                        // now apply vector to vertex buffer

                        vertices.push(vector.x, vector.y, vector.z);

                        // counters
                        vertexCounter += 1;

                        // set values to correct vector component

                        vector[u] = 0;
                        vector[v] = 0;
                        vector[w] = depth > 0 ? 1 : -1;

                        // now apply vector to normal buffer

                        normals.push(vector.x, vector.y, vector.z);

                        // uvs

                        uvs.push(i);
                        uvs.push(1 - j);
                    }
                }

                // indices
                indices.push(numberOfVertices + vertexCounter - 4, numberOfVertices + vertexCounter - 3, numberOfVertices + vertexCounter - 2);
                indices.push(numberOfVertices + vertexCounter - 3, numberOfVertices + vertexCounter - 1, numberOfVertices + vertexCounter - 2);

                // add a group to the geometry. this will ensure multi material support
                scope.addGroup(groupStart, faceCount, materialIndex);
                groupStart += faceCount;
                materialIndex++;
            }

        }

        numberOfVertices += vertexCounter;

    }

}

CubeBufferGeometry.prototype = new THREE.BufferGeometry();
