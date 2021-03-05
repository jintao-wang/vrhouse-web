/**
 *Project name: VRHouseWeb
 *File name: MathHelper.js
 *Created by Shirlman on 2018/07/16
 *Copyright 2016年 - 2018年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */


function MathHelper() {
};

MathHelper.lerp = function (a, b, alpha) {
    return a + (b - a) * alpha;
};

MathHelper.convertPointToXYPlane = function (point, normal) {
    let forward = new THREE.Vector3(0, 0, 1);
    let angle = forward.angleTo(normal);
    let axis = forward.cross(normal).normalize();
    point = point.clone().applyAxisAngle(axis, angle);

    return new THREE.Vector2(point.x, point.y);
};

MathHelper.isClockwiseVector2 = function (vertices) {
    let sum = 0;

    for (let i = 0; i < vertices.length - 1; i++) {
        sum += vertices[i].clone().cross(vertices[i + 1]);
    }

    return sum > 0;
};

MathHelper.getCrossPoint = function(a, b, c, d) {
    var EPS = 0.000001;
    var denominator = (b.y - a.y)*(d.x - c.x) - (a.x - b.x)*(c.y - d.y);
    if (denominator > -EPS && denominator < EPS) {
        return false;
    }
    var x = ( (b.x - a.x) * (d.x - c.x) * (c.y - a.y)
        + (b.y - a.y) * (d.x - c.x) * a.x
        - (d.y - c.y) * (b.x - a.x) * c.x ) / denominator ;
    var y = -( (b.y - a.y) * (d.y - c.y) * (c.x - a.x)
        + (b.x - a.x) * (d.y - c.y) * a.y
        - (d.x - c.x) * (b.y - a.y) * c.y ) / denominator;

    if ((x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
        && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0){
        return {
            x :  x,
            y :  y
        }
    }
    return false;
};

MathHelper.isPointInConvexPolygonVector2 = function (point, vertices) {
    let isInPolygon = true;
    let length = vertices.length;

    let isPolygonClockwise = MathHelper.isClockwiseVector2(vertices);

    for (let i = 0; i < length; i++) {
        let next = (i + 1) % length;
        let isClockwise = MathHelper.isClockwiseVector2([vertices[i], point, vertices[next], vertices[i]]);

        if (isClockwise === isPolygonClockwise) {
            isInPolygon = false;
            break;
        }
    }

    return isInPolygon;
};

MathHelper.getLineNormalVector2 = function (p1, p2) {
    return new THREE.Vector2(p2.y - p1.y, p1.x - p2.x);
};

MathHelper.getLineNormalVector3 = function (p1, p2) {
    return new THREE.Vector3(p2.y - p1.y, p1.x - p2.x, 0);
};

MathHelper.isSameDir = function (p1, p2, degree) {
    let tolerance = 1 - Math.cos(THREE.Math.degToRad(degree));
    return Math.abs(p1.clone().normalize().dot(p2.clone().normalize()) - 1) < tolerance;
};

MathHelper.isParallel = function (p1, p2, p3, p4) {
    let flag = false;
    let v1 = this.getLineNormalVector3(p1, p2);
    let v2 = this.getLineNormalVector3(p3, p4);
    let angle = v1.angleTo(v2);
    angle = angle * THREE.Math.RAD2DEG;
    if (angle >= 170 || angle <= 10) flag = true;

    return flag;
};

MathHelper.isCollinear = function (a, b, c, EPS) {
    EPS = EPS || 0.1;
    let area = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
    return Math.abs(area) < EPS;
};

MathHelper.JudgePointInLineSegment=function(point,line){
    let p1=line[0];
    let p2=line[1];
    let lineDistance=Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
    let point2p1=Math.sqrt(Math.pow(point.x-p1.x,2)+Math.pow(point.y-p1.y,2));
    let point2p2=Math.sqrt(Math.pow(point.x-p2.x,2)+Math.pow(point.y-p2.y,2));

    return (Math.abs((point2p1+point2p2)-lineDistance)<0.001);
};

MathHelper.calcLightDamping = function (progress, factor = 0.4) {
    return (Math.pow(2, -6 * progress) * Math.cos((progress - factor / 2) * (2 * Math.PI) / factor) + 1).toFixed(4);
};

MathHelper.convertPointToXYPlane = function (point, normal) {
    let forward = new THREE.Vector3(0, 0, 1);
    let angle = forward.angleTo(normal);
    let axis = forward.cross(normal).normalize();
    point = point.clone().applyAxisAngle(axis, angle);

    return new THREE.Vector2(point.x, point.y);
};

MathHelper.getIntersectPointOfTwoLineSegments = function (a, b, c, d) {
    function getArea(a, b, c) {
        return a.clone().sub(c).cross(b.clone().sub(c));
    }

    var area_abc = getArea(a, b, c);
    var area_abd = getArea(a, b, d);
    var area_cda = getArea(c, d, a);
    var area_cdb = getArea(c, d, b);

    // 点在线段上也算相交
    if (area_abc * area_abd <= 0 && area_cda * area_cdb <= 0) {
        var scalar = area_cda / (area_abd - area_abc);
        return b.clone().sub(a).multiplyScalar(scalar).add(a);
    }
};

export {MathHelper}
