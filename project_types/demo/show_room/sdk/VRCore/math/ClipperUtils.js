import * as Clipper from "clipper-lib"

export class ClipperUtils {
    static TOLERANCE = 0.01;
    static OFFSET_SCALE = 10; // web 为10000
    static ClipperLib = Clipper.default;

    static denoise(polygons, tolerance = this.TOLERANCE) {
        let solution = new this.ClipperLib.Paths();
        let clipper = new this.ClipperLib.ClipperOffset();
        clipper.AddPaths(this.toClipperPolygon(polygons), this.ClipperLib.JoinType.jtMiter, this.ClipperLib.EndType.etClosedPolygon);
        clipper.Execute(solution, this.OFFSET_SCALE * -tolerance);
        clipper.Execute(solution, this.OFFSET_SCALE * tolerance * 2);
        clipper.Execute(solution, this.OFFSET_SCALE * -tolerance);
        clipper.Clear();

        return this.fromClipperPolygon(solution);
    }

    static offset(polygons, offset, endType = this.ClipperLib.EndType.etClosedPolygon) {
        let solution = new this.ClipperLib.Paths();
        let clipper = new this.ClipperLib.ClipperOffset();
        clipper.AddPaths(this.toClipperPolygon(polygons), this.ClipperLib.JoinType.jtMiter, endType);
        clipper.Execute(solution, this.OFFSET_SCALE * offset);
        clipper.Clear();

        return this.fromClipperPolygon(solution);
    }

    static difference(subPolygons, clipPolygons, scale = this.OFFSET_SCALE) {
        let solution = [];
        let clipper = new this.ClipperLib.Clipper();
        clipper.AddPaths(this.toClipperPolygon(subPolygons, scale), this.ClipperLib.PolyType.ptSubject, true);
        clipper.AddPaths(this.toClipperPolygon(clipPolygons, scale), this.ClipperLib.PolyType.ptClip, true);
        clipper.Execute(this.ClipperLib.ClipType.ctDifference, solution, this.ClipperLib.PolyFillType.pftNonZero, this.ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        return this.fromClipperPolygon(solution, scale);
    }

    static union(polygons, scale = this.OFFSET_SCALE) {
        let solution = [];
        let clipper = new this.ClipperLib.Clipper();
        clipper.AddPaths(this.toClipperPolygon(polygons, scale), this.ClipperLib.PolyType.ptSubject, true);
        clipper.Execute(this.ClipperLib.ClipType.ctUnion, solution, this.ClipperLib.PolyFillType.pftNonZero, this.ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        return this.fromClipperPolygon(solution, scale);
    }

    static toClipperPolygon(polygons, scale = this.OFFSET_SCALE) {
        return polygons.map(polygon => polygon.map(p => {
            return {"X": p.x * scale, "Y": p.y * scale};
        }));
    }

    static fromClipperPolygon(polygons, scale = this.OFFSET_SCALE) {
        return polygons.map(polygon => polygon.map(p => {
            return new THREE.Vector2(p["X"] / scale, p["Y"] / scale);
        }));
    }

    static isPolygonsCrashed(subPolygons, clipPolygons) {
        let solution = new this.ClipperLib.Paths();
        let clipper = new this.ClipperLib.Clipper();
        clipper.AddPaths(this.toClipperPolygon(subPolygons), this.ClipperLib.PolyType.ptSubject, true);
        clipper.AddPaths(this.toClipperPolygon(clipPolygons), this.ClipperLib.PolyType.ptClip, true);
        clipper.Execute(this.ClipperLib.ClipType.ctIntersection, solution, this.ClipperLib.PolyFillType.pftNonZero, this.ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        return solution.length > 0;
    }

    static getArea (polygon) {
        return this.ClipperLib.Clipper.Area(polygon);
    }
}
