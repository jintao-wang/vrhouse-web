THREE.Vector3.unitX = Object.freeze(new THREE.Vector3(1, 0, 0));
THREE.Vector3.unitY = Object.freeze(new THREE.Vector3(0, 1, 0));
THREE.Vector3.unitZ = Object.freeze(new THREE.Vector3(0, 0, 1));

THREE.Vector3.prototype.toVector2 = function () {
    return new THREE.Vector2(this.x, this.z);
};

THREE.Vector3.prototype.hasValue = function () {
    return this.x !== 0 || this.y !== 0 || this.z !== 0;
};

// Unity to ThreejsCore.js
THREE.Vector3.prototype.fromUnityPosition = function () {
    this.z = -this.z;
    return this;
};

THREE.Vector3.prototype.fromUnityRotation = function () {
    return this.set(this.x, this.y + 180, -this.z).degToRad();
};

THREE.Vector3.prototype.fromUnityScale = function () {
    this.z = -this.z;
    return this;
};

// Unreal to ThreejsCore.js
THREE.Vector3.prototype.U2TPosition = function () {
    this.set(this.x, this.z, this.y);
    return this;
};
THREE.Vector3.prototype.U2TScale = function () {
    this.set(this.x, this.z, this.y);
    return this;
};
THREE.Vector3.prototype.U2TRotation = function () {
    this.set(this.x, -this.z, this.y).degToRad();
    return this;
};
// ThreejsCore.js to Unreal
THREE.Vector3.prototype.T2UPosition = function () {
    this.set(this.x, this.z, this.y);
    return this;
};
THREE.Vector3.prototype.T2UScale = function () {
    this.set(this.x, this.z, this.y);
    return this;
};
THREE.Vector3.prototype.T2URotation = function () {
    this.set(this.x, this.z, -this.y).radToDeg();
    return this;
};

THREE.Vector3.prototype.fromUnityPositionX2 = function () {
    this.fromUnityPosition();
    this.multiplyScalar(2);
    return this;
};

THREE.Vector3.prototype.degToRad = function () {
    return this.multiplyScalar(THREE.Math.DEG2RAD);
};

THREE.Vector3.prototype.radToDeg = function () {
    return this.multiplyScalar(1 / THREE.Math.DEG2RAD);
};

THREE.Vector3.prototype.containsNAN = function () {
    return isNaN(this.x) || isNaN(this.y) || isNaN(this.z);
};

THREE.Vector3.prototype.projectPointToXZPlane = function (normal) {
    let vector = normal.y < 0.1 ? THREE.Vector3.unitY.clone().setY(-1) : THREE.Vector3.unitY;
    let angle = normal.angleTo(vector);

    if (angle === 0) {
        return this.toVector2();
    }

    let result = this.applyAxisAngle(angle, vector.clone().cross(normal).normalize());

    return result.toVector2();
}

THREE.Vector3.prototype.addY = function (y) {
    this.y += y;
    return this;
};

THREE.Vector3.prototype.toRotationMatrix4 = function (rotationOrder) {
    return new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler().setFromVector3(this, rotationOrder));
};

THREE.Vector3.prototype.maxWeight = function () {
    return Math.max(this.x, this.y, this.z);
};

THREE.Vector3.prototype.approxEquals = function (v, tolerance = EPSILON) {
    return this.distanceTo(v) < tolerance;
};

THREE.Vector3.getVerticesCenter = function (vertices) {
    return vertices.length === 0
        ? new THREE.Vector3()
        : THREE.Vector3.max(vertices).add(THREE.Vector3.min(vertices)).divideScalar(2);
};

THREE.Vector3.getMiddle = function (p1, p2) {
    return p1.clone().add(p2).multiplyScalar(0.5);
};

THREE.Vector3.max = function (vertices) {
    return new THREE.Vector3(
        Math.max(...vertices.map(v => v.x)),
        Math.max(...vertices.map(v => v.y)),
        Math.max(...vertices.map(v => v.z)));
};

THREE.Vector3.min = function (vertices) {
    return new THREE.Vector3(
        Math.min(...vertices.map(v => v.x)),
        Math.min(...vertices.map(v => v.y)),
        Math.min(...vertices.map(v => v.z)));
};

THREE.Vector3.prototype.toString = function () {
    return "x: " + this.x + ", y: " + this.y + ", z: " + this.z;
};

// p点绕该点在y方向上旋转θ度后的坐标
THREE.Vector3.prototype.rotatePointByY = function (point, angle) {
    let vec = point.clone().sub(this);
    return new THREE.Vector3(
        vec.z * Math.sin(angle) + vec.x * Math.cos(angle) + this.x,
        point.y,
        vec.z * Math.cos(angle) - vec.x * Math.sin(angle) + this.z
    );
};

THREE.Vector3.prototype.toFixed = function (num) {
    this.set(+this.x.toFixed(num), +this.y.toFixed(num), +this.z.toFixed(num));
    return this;
};

THREE.Vector3.prototype.toScreenPosition = function (camera) {
    let vector = this.clone().project(camera);
    let halfWidth = window.innerWidth / 2;
    let halfHeight = window.innerHeight / 2;

    return new THREE.Vector2(
        vector.x * halfWidth + halfWidth,
        -vector.y * halfHeight + halfHeight
    );
}

