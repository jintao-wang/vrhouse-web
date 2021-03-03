import {Mathf} from "../math/Mathf";

THREE.Vector2.prototype.containsNAN = function () {
    return isNaN(this.x) || isNaN(this.y);
};

THREE.Vector2.prototype.round = function (digit = 0) {
    return new THREE.Vector2(Mathf.round(this.x, digit), Mathf.round(this.y, digit));
};

THREE.Vector2.prototype.toVector3 = function (y = 0) {
    return new THREE.Vector3(this.x, y, this.y);
};

THREE.Vector2.prototype.toString = function () {
    return "x: " + this.x + ", y: " + this.y;
};

THREE.Vector2.prototype.approxEquals = function (target, tolerance = 0.01) {
    return this.distanceTo(target) < tolerance;
}

// 极坐标
THREE.Vector2.prototype.fromUnityRotation = function () {
    return this.set(-this.x, this.y + 180).degToRad();
};

THREE.Vector2.prototype.fromUnityPosition = function () {
    return this.set(this.x, -this.y);
};

THREE.Vector2.prototype.degToRad = function () {
    return this.multiplyScalar(THREE.Math.DEG2RAD);
};

THREE.Vector2.prototype.projectInSegment = function (p1, p2) {
    let k = this.clone().sub(p1).dot(p2.clone().sub(p1)) / Math.pow((p2.clone().sub(p1)).length(), 2);

    if (k < 0) k = 0;
    if (k > 1) k = 1;

    return p2.clone().sub(p1).multiplyScalar(k).add(p1);
};

THREE.Vector2.prototype.isParallel = function (p2, toleranceDegree = 1) {
    if (this.approxEquals(new THREE.Vector2()) || p2.approxEquals(new THREE.Vector2())) {
        return false;
    }

    if ((Mathf.approxEquals(this.y, 0) && Mathf.approxEquals(p2.y, 0))
        || (Mathf.approxEquals(this.x, 0) && Mathf.approxEquals(p2.x, 0))) {
        return true;
    }

    let tolerance = 1 - Math.cos(THREE.Math.degToRad(toleranceDegree));
    return Math.abs(Math.abs(this.clone().normalize().dot(p2.clone().normalize())) - 1) < tolerance;
}

THREE.Vector2.prototype.isSameDirection = function (p2, toleranceDegree = 1) {
    let tolerance = 1 - Math.cos(THREE.Math.degToRad(toleranceDegree));
    return Math.abs(this.clone().normalize().dot(p2.clone().normalize()) - 1) < tolerance;
}

THREE.Vector2.prototype.perpendicular = function () {
    return new THREE.Vector2(this.y, -this.x);
};

THREE.Vector2.prototype.distanceToSegment = function (segment) {
    return Math.abs(this.clone().sub(segment.p1).cross(segment.p2.clone().sub(segment.p1))) / segment.p2.clone().sub(segment.p1).length();
};

THREE.Vector2.prototype.combinePointsTooClose = function (p, tolerance) {
    let xDis = this.x - p.x;
    let yDis = this.y - p.y;
    if (Math.pow(xDis, 2) + Math.pow(yDis, 2) < Math.pow(tolerance, 2)) {
        this.x = (this.x + p.x) / 2;
        this.y = (this.y + p.y) / 2;
        return true
    }
    return false;
};

THREE.Vector2.prototype.isInPolygon = function (polygon) {
    let result = 0, cnt = polygon.length;
    if (cnt < 3) {
        return false;
    }

    let ip = polygon[0];
    for (let i = 1; i <= cnt; ++i) {
        let ipNext = (i === cnt ? polygon[0] : polygon[i]);
        if (ipNext.y === this.y) {
            if ((ipNext.x === this.x) || (ip.y === this.y &&
                ((ipNext.x > this.x) === (ip.x < this.x)))) {
                result = -1;
                break;
            }
        }
        if ((ip.y < this.y) !== (ipNext.y < this.y)) {
            if (ip.x >= this.x) {
                if (ipNext.x > this.x) {
                    result = 1 - result;
                } else {
                    let d = (ip.x - this.x) * (ipNext.y - this.y) - (ipNext.x - this.x) * (ip.y - this.y);
                    if (d === 0) {
                        result = -1;
                        break;
                    } else if ((d > 0) === (ipNext.y > ip.y)) {
                        result = 1 - result;
                    }
                }
            } else {
                if (ipNext.x > this.x) {
                    let d = (ip.x - this.x) * (ipNext.y - this.y) - (ipNext.x - this.x) * (ip.y - this.y);
                    if (d === 0) {
                        result = -1;
                        break;
                    } else if ((d > 0) === (ipNext.y > ip.y)) {
                        result = 1 - result;
                    }
                }
            }
        }
        ip = ipNext;
    }

    let isPointInPolygon = result === 1 || result === -1;

    return isPointInPolygon;
};

THREE.Vector2.prototype.isOnSegment = function (segment) {
    return this.approxEquals(segment.p1) || this.approxEquals(segment.p2) || this.clone().sub(segment.p1).isSameDirection(segment.p2.clone().sub(this));
}

THREE.Vector2.prototype.project = function (p1, p2) {
    if (p1.approxEquals(p2)) {
        return p1.clone().add(p2).multiplyScalar(0.5);
    }

    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;

    let u = ((this.x - p1.x) * dx + (this.y - p1.y) * dy) / (dx * dx + dy * dy);

    return new THREE.Vector2(p1.x + u * dx, p1.x + u * dy);
}

