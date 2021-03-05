/**
 *Project name: VRHouseWeb
 *File name: THREEUtil.js
 *Created by Shirlman on 2017/11/10
 *Copyright 2016年 - 2020年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */

THREE.Object3D.prototype.setRenderOrder = function (renderOrder) {
    this.renderOrder = renderOrder;
    this.children.forEach(child => child.setRenderOrder(renderOrder));
};

THREE.Object3D.prototype.setLayer = function (layer) {
    this.layers.set(layer);
    this.children.forEach(child => child.setLayer(layer));
};

THREE.Object3D.prototype.setVisible = function (visible, includeChildren = true) {
    this.visible = visible;
    if (includeChildren) this.children.forEach(child => child.setVisible(visible));
};

// 包括所有parents是否可见
THREE.Object3D.prototype.isVisible = function (layers) {
    return this.visible && (!layers || this.layers.test(layers)) && (!this.parent || this.parent.isVisible());
};

THREE.Object3D.prototype.getChildren = function (recursive) {
    if (recursive) {
        return this.children.concat(this.children.flatMap(child => child.getChildren(recursive)));
    } else {
        return this.children;
    }
};

THREE.Object3D.prototype.getRoot = function () {
    let root = this;

    while (root.parent) {
        root = root.parent;
    }

    return root;
};

THREE.Object3D.prototype.setTransparent = function (transparent) {
    this.setMaterialProperty("transparent", transparent);
};

THREE.Object3D.prototype.setOpacity = function (opacity) {
    this.setMaterialProperty("opacity", opacity);
};

THREE.Object3D.prototype.setAlphaTest = function (alphaTest) {
    this.setMaterialProperty("alphaTest", alphaTest);
};

THREE.Object3D.prototype.setMaterialProperty = function (property, value) {
    if (this.material instanceof Array) {
        this.material.forEach(material => {
            material[property] = value;
        });
    } else if (this.material
    ) {
        this.material[property] = value;
    }

    this.children.forEach(child => child.setMaterialProperty(property, value));
};

THREE.Object3D.prototype.dispose = function () {
    if (this.parent) this.parent.remove(this);
    if (this.geometry) this.geometry.dispose();

    if (this.material) {
        if (this.material instanceof Array) {
            this.material.forEach(material => {
                if (material.map) material.map.dispose();
                material.dispose();
            });
        } else {
            if (this.material.map) this.material.map.dispose();
            this.material.dispose();
        }
    }

    this.children.slice().forEach(child => child.dispose && child.dispose());
};

THREE.Object3D.getCompoundBoundingBox = function (objects) {
    let obj3Ds = [];
    objects.traverse(object => obj3Ds.push(object));

    return THREE.Object3D.getObjectsBoundingBox(obj3Ds);
};

THREE.Object3D.getObjectsBoundingBox = function (objects) {
    let box = new THREE.Box3();

    objects.forEach(object => {
        if (object.geometry) {
            object.geometry.computeBoundingBox();
            box.union(object.geometry.boundingBox);
        }
    });

    return box;
};

THREE.Euler.prototype.toString = function () {
    return "x: " + this.x + ", y: " + this.y + ", z: " + this.z;
};

THREE.Euler.prototype.lerp = function (euler, alpha) {
    if (Math.abs(euler.y - this.y) > Math.PI) {
        if (this.y > 0 && euler.y < 0) {
            this.y -= 2 * Math.PI;
        } else if (this.y < 0 && euler.y > 0) {
            this.y += 2 * Math.PI;
        }
    }

    this.y += (euler.y - this.y) * alpha;
    this.x += (euler.x - this.x) * alpha;

    return this;
};

THREE.Spherical.prototype.lerp = function (spherical, alpha) {
    if (Math.abs(spherical.theta - this.theta) > Math.PI) {
        if (this.theta < 0) this.theta += Math.PI * 2;
        if (spherical.theta < 0) spherical.theta += Math.PI * 2;
    }

    this.theta += (spherical.theta - this.theta) * alpha;
    this.phi += (spherical.phi - this.phi) * alpha;
    this.radius += (spherical.radius - this.radius) * alpha;
    this.makeSafe();

    return this;
};

THREE.Euler.prototype.approxEquals = function (e, tolerance = EPSILON) {
    return Math.abs(this.x - e.x) < tolerance
        && Math.abs(this.y - e.y) < tolerance
        && Math.abs(this.z - e.z) < tolerance;
};

THREE.Util = {};
THREE.Util.createBufferPlane = function (vertices) {
    if (vertices.length < 3) {
        return;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', THREE.Util.getPlaneBufferAttribute(vertices));
    geometry.vertices = vertices;
    geometry.normal = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(vertices[1], vertices[0]),
        new THREE.Vector3().subVectors(vertices[1], vertices[2])
    ).normalize();

    return geometry;
};

THREE.Util.getPlaneBufferAttribute = function (vertices) {
    // 右手定理，逆时针构成三角形
    var verticesAtrribute = new Float32Array([
        vertices[0].x, vertices[0].y, vertices[0].z,
        vertices[3].x, vertices[3].y, vertices[3].z,
        vertices[2].x, vertices[2].y, vertices[2].z,

        vertices[2].x, vertices[2].y, vertices[2].z,
        vertices[1].x, vertices[1].y, vertices[1].z,
        vertices[0].x, vertices[0].y, vertices[0].z
    ]);

    // itemSize = 3 because there are 3 values (components) per vertex
    return new THREE.BufferAttribute(verticesAtrribute, 3);
};

THREE.Util.getCenterPoint = function (vertices) {
    var center = new THREE.Vector3();
    vertices.forEach(function (v) {center.add(v);});
    center.multiplyScalar(1 / vertices.length);

    return center;
};

THREE.Util.createLine2 = function (vertices, color, opacity, width) {
    var material = new THREE.LineBasicMaterial();

    if (color) material.color = color;
    if (width) material.linewidth = width;  // linewidth PC上无效

    if (opacity) {
        material.transparent = true;
        material.opacity = opacity;
    }

    var geometry = new THREE.Geometry();

    vertices.forEach(function (v) {
        geometry.vertices.push(v);
    });

    return new THREE.Line(geometry, material);
};

THREE.Util.disposeObject3D = function (object3D) {
    if (!object3D) {
        return;
    }

    if (object3D.parent) {
        object3D.parent.remove(object3D);
    }

    while (object3D.children && object3D.children.length > 0) {
        THREE.Util.disposeObject3D(object3D.children[0]);
    }

    if (object3D.geometry) {
        object3D.geometry.dispose();
    }

    if (object3D.material) {
        if (object3D.material.map) {
            object3D.material.map.dispose();
        }

        object3D.material.dispose();
    }

    object3D = null;
};

THREE.Util.setRenderOrder = function (object, renderOrder) {
    function setOrder(obj) {
        obj.renderOrder = renderOrder;

        obj.children.forEach(function (child) {
            setOrder(child);
        });
    }

    setOrder(object);
};

THREE.Util.updateLine2 = function (line, vertices) {
    if (line.geometry.vertices.length < 2 || vertices.length < 2) {
        return;
    }

    line.geometry.vertices = [];

    vertices.forEach(function (v) {
        line.geometry.vertices.push(v);
    });

    line.geometry.verticesNeedUpdate = true;
};

THREE.Util.setObject3DColor = function (object3D, color) {
    if (object3D.material) {
        object3D.material.color = color;
    }

    if (object3D.children) {
        object3D.children.forEach(function (child) {
            THREE.Util.setObject3DColor(child, color);
        })
    }
};

