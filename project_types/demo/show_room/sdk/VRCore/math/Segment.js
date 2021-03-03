export class Segment {
    constructor(p1, p2) {
        this.raw = [p1, p2];
    }

    raw = [];

    get p1() {
        return this.raw[0];
    };

    get p2() {
        return this.raw[1];
    };

    get length () {
        return this.p1.distanceTo(this.p2);
    }

    ClassMapper = {raw: THREE.Vector2};

    fromUnity () {
        this.p1.y = -this.p1.y;
        this.p2.y = -this.p2.y;

        return this;
    }

    direction() {
        return this.p2.clone().sub(this.p1).normalize();
    }

    toVector3 (height) {
        return new THREE.Vector3(this.p1, height, this.p2)
    }


    // TODO 该方法有错误，不建议使用
    // 算法太精辟，这里只是为了写的简洁便于理解，不考虑性能
    // 详解算法3：https://www.2cto.com/kf/201607/528517.html
    intersect(segment, considerEndpoint = true) {
        let a = this.p1;
        let b = this.p2;
        let c = segment.p1;
        let d = segment.p2;

        function getArea(a, b, c) {
            return a.clone().sub(c).cross(b.clone().sub(c));
        }

        let area_abc = getArea(a, b, c);
        let area_abd = getArea(a, b, d);
        let area_cda = getArea(c, d, a);
        let area_cdb = getArea(c, d, b);

        // 是否考虑端点
        if (considerEndpoint ?
            (area_abc * area_abd <= 0 && area_cda * area_cdb <= 0) :
            (area_abc * area_abd < 0 && area_cda * area_cdb < 0)) {
            let scalar = area_cda / (area_abd - area_abc);
            return b.clone().sub(a).multiplyScalar(scalar).add(a);
        }
    }

    isIntersect(segment) {
        return !this.intersect(segment);
    }

    isSameDirection(otherSegment, toleranceDegree = 1) {
        return this.direction().isSameDirection(otherSegment.direction(), toleranceDegree);
    }

    isReverseDirection(otherSegment, toleranceDegree = 1) {
        return this.direction().isSameDirection(otherSegment.direction().multiplyScalar(-1), toleranceDegree);
    }

    isParallel(otherSegment, toleranceDegree = 1) {
        return this.direction().isParallel(otherSegment.direction(), toleranceDegree);
    }

    isCoincide(other) {
        return this.p2.clone().sub(this.p1).add(other.p2).sub(other.p1).isParallel(this.direction())
        && (this.p1.isOnSegment(other) || this.p2.isOnSegment(other));
    }

    getCoincideSegment(other) {
        // let p1ProjectPoint = this.p1.project(other.p1, other.p2);
        // let p2ProjectPoint = this.p2.project(other.p1, other.p2);
        //
        // return new Segment(p1ProjectPoint.isOnSegment(other) ? p1ProjectPoint : other.p1,
        // p2ProjectPoint.isOnSegment(other) ? p2ProjectPoint : other.p2);

        return new Segment(this.p1.isOnSegment(other) ? this.p1 : this.p2, other.p1.isOnSegment(this) ? other.p1 : other.p2);
    }

    // enableReflexAngle 允许优角
    getAngle (segment, enableReflexAngle = true) {
        let cosValue = this.direction().dot(segment.direction());
        let angle = Math.acos(cosValue > 1 ? 1 : cosValue);
        let side = this.direction().cross(segment.direction()) >= 0;

        if (enableReflexAngle) {
            return side ? angle : 2 * Math.PI - angle;
        } else {
            return angle;
        }
    }
}