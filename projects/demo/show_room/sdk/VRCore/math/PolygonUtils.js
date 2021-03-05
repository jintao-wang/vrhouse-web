export class PolygonUtils {
    static isInPolygon (checkPoint, PolygonPoints) {
        let totalAngle = 0;
        let vectors = [];

        for (let i = 0; i < PolygonPoints.length; i++) {
            let point = new THREE.Vector2();
            point.copy(PolygonPoints[i]).sub(checkPoint);
            vectors.push(point);
        }

        for (let i = 0; i < vectors.length; i++) {
            let sign = vectors[i].cross(vectors[(i+1) % vectors.length]) > 0 ? 1 : -1;
            let angle = sign * Math.acos(vectors[i].dot(vectors[(i+1) % vectors.length])
                / (vectors[i].length() * vectors[(i+1) % vectors.length].length()));

            totalAngle += angle;
        }

        return Math.abs(totalAngle) > 1e-10;
    }

    static isConPolygonCrashed (polygonA, polygonB) {
        let sideA = 0;
        let sideB = 0;

        for (let i = 0; i < polygonA.length; i++) {
            sideA = PolygonUtils.getSide(polygonA[i], polygonA[(i+1)%polygonA.length], polygonA);
            sideB = PolygonUtils.getSide(polygonA[i], polygonA[(i+1)%polygonA.length], polygonB);

            if (sideA * sideB < 0) return false;
        }
        for (let i = 0; i < polygonB.length; i++) {
            sideA = PolygonUtils.getSide(polygonB[i], polygonB[(i+1)%polygonB.length], polygonA);
            sideB = PolygonUtils.getSide(polygonB[i], polygonB[(i+1)%polygonB.length], polygonB);

            if (sideA * sideB < 0) return false;
        }

        return true;
    }

    static getSide (pointA, pointB, polygon) {
        let axes = pointB.clone().sub(pointA);
        let side = 0;

        for (let i = 0; i < polygon.length; i++) {
            let tempSide = axes.cross(polygon[i].clone().sub(pointA));
            if (tempSide * side < 0) {
                return 0;
            } else {
                side = tempSide === 0 ? side : tempSide;
            }
        }

        return side;
    }

    // 计算平面上多个点的外边框
    static getOutPolygon (points) {
        if (points.length === 0) return;

        // 找一个最边缘的点
        let initPointIndex = 0;
        points.forEach((point, index) => initPointIndex = points[initPointIndex].x < point.x ? initPointIndex : index);

        return PolygonUtils.findOutEdge([initPointIndex], points);
    }

    static findOutEdge (outPoints, polygon) {
        for (let i = 0; i < polygon.length; i++) {
            if (outPoints.indexOf(i) !== -1) continue;
            if (PolygonUtils.getSide(polygon[outPoints[outPoints.length-1]], polygon[i], polygon) > 0 ) {
                outPoints.push(i);
                PolygonUtils.findOutEdge(outPoints, polygon);
            }
        }

        return outPoints;
    }

    static isClockwise (polygon) {
        if (polygon.length === 0) return true;
        let point = polygon.reduce((minPoint, point) => minPoint.x > point.x || (minPoint.x === point.x && minPoint.y > point.y) ? point : minPoint);
        let pointIndex = polygon.findIndex(p => p === point);
        let previousPoint = Array.get(polygon, pointIndex - 1);
        let nextPoint = Array.get(polygon, pointIndex + 1);

        return point.clone().sub(previousPoint).angle() < point.clone().sub(nextPoint).angle();
    }
}
