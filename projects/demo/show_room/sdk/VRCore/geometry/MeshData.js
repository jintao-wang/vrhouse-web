import {ResourcesLoader} from "../frameworks/ResourcesLoader";

export class MeshData {
    constructor(sections = []) {
        this.Sections = sections;

        sections.forEach((section, index) => {
            section.SectionIndex = index;
        });

        this.meshData = null;

        this.defaultMaterial = new THREE.MeshPhongMaterial({color: '#e0e0e0'});
        this.materials = [];
    }

    static materialBank = {};

    Sections = [];
    ClassMapper = {Sections: MeshSection};
    PropertyIgnore = ['meshData', 'defaultMaterial', 'materials', 'ClassMapper', 'PropertyIgnore'];

    fromUnity() {
        linq(this.Sections).selectMany(s => s.MeshFaces)
            .forEach(mf => {
                mf.Vertices.forEach(v => v.fromUnityPosition());
                mf.Normal.fromUnityPosition();
            });

        this.Sections.forEach(section => section.InnerDirection.fromUnityPosition())

        return this;
    }

    merge(meshData) {
        if (meshData === this) return;
        this.Sections = this.Sections.concat(meshData.Sections);

        return this;
    }

    createMesh() {
        let meshFaces = linq(this.Sections).selectMany(s => s.MeshFaces);
        let vertices = meshFaces.selectMany(mf => mf.Vertices)
            .selectMany(v => v.toArray()).toArray();

        let uvs = meshFaces.selectMany(mf => mf.UVs)
            .selectMany(uv => uv.toArray()).toArray();

        let normals = meshFaces.where(mf => mf.Normal !== undefined)
            .selectMany(mf => linq(mf.Vertices)
                .selectMany(v => mf.Normal.toArray()).toArray()).toArray();

        let geometry = new THREE.BufferGeometry();
        let verticesNum = 0;
        let indices = [];

        meshFaces.toArray().forEach(meshFace => {
            indices = indices.concat(linq(meshFace.Triangles).select(t => t + verticesNum).toArray());
            verticesNum = verticesNum + meshFace.Vertices.length;
        });

        if (!Array.isNullOrEmpty(indices)) {
            geometry.setIndex(indices);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        if (uvs.length > 0) geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        if (normals.length > 0) geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));

        let start = 0;

        this.Sections.forEach((section, i) => {
            let count = linq(section.MeshFaces).sum(mf => mf.Vertices.length);
            geometry.addGroup(start, count, i);
            start += count;
        });

        let materials = linq(this.Sections).where(section => section.Material !== undefined)
            .select(section => section.Material).toArray();

        return new THREE.Mesh(geometry, materials);
    }

    createBufferMesh(filter = null, showEdge = false) {
        // console.time("createBufferMesh")
        let sections = filter ? this.Sections.filter(filter) : this.Sections;
        let meshFaces = linq(sections).selectMany(s => s.MeshFaces);
        let vertices = meshFaces.selectMany(mf => mf.Vertices)
            .selectMany(v => v.toArray()).toArray();
        let uvs = meshFaces.selectMany(mf => mf.UVs)
            .selectMany(uv => uv.toArray()).toArray();
        let normals = meshFaces.where(mf => mf.Normal !== undefined)
            .selectMany(mf => linq(mf.Vertices)
                .selectMany(v => mf.Normal.toArray()).toArray()).toArray();
        let geometry = new THREE.BufferGeometry();
        let verticesNum = 0;
        let indices = [];
        meshFaces.toArray().forEach(meshFace => {
            indices = indices.concat(linq(meshFace.Triangles).select(t => t + verticesNum).toArray());
            verticesNum = verticesNum + meshFace.Vertices.length;
        });

        if (!Array.isNullOrEmpty(indices)) {
            geometry.setIndex(indices);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

        let start = 0;
        sections.forEach((section, index) => {
            section.start = start;
            section.count = linq(section.MeshFaces).sum(mf => mf.Triangles.length);
            section.groupIndex = index;

            // 材质
            this.materials.push(this.defaultMaterial.clone());
            section.materialIndex = section.groupIndex;
            if (section.MaterialPath) {
                section.getMaterial().then(mtl => {
                    if (mtl) this.materials[section.materialIndex] = mtl;
                })
            }

            geometry.addGroup(section.start, section.count, section.materialIndex);
            start += section.count;
        })

        this.meshData = new THREE.Mesh(geometry, this.materials);
        this.meshData.userData.meshData = this;
        // console.timeEnd("createBufferMesh")

        if (showEdge) {
            let edgesGeometry = new THREE.EdgesGeometry(geometry);
            let material = new THREE.LineBasicMaterial({color: '#333333'});
            let line = new THREE.LineSegments(edgesGeometry, material);
            this.meshData.add(line);
        }

        return this.meshData;
    }

    createMeshByMaterial() {
        let groupMesh = new THREE.Group();
        let sections = this.Sections;
        let materials = linq(this.Sections).select(section => section.MaterialPath + section.MaterialSubPath).distinct().toArray();
        materials.forEach(mtl => {
            this.Sections = linq(sections).where(section => section.MaterialPath + section.MaterialSubPath === mtl).toArray();
            if (this.Sections.length) {
                let mesh = this.createBufferMesh();
                this.Sections[0].getMaterial().then(material => mesh.material = material);
                groupMesh.add(mesh);
            }
        })

        return groupMesh;
    }

    //
    updateMesh (sections) {
        this.Sections = sections;
        let meshFaces = linq(sections).selectMany(s => s.MeshFaces);
        let vertices = meshFaces.selectMany(mf => mf.Vertices)
            .selectMany(v => v.toArray()).toArray();
        let uvs = meshFaces.selectMany(mf => mf.UVs)
            .selectMany(uv => uv.toArray()).toArray();
        let normals = meshFaces.where(mf => mf.Normal !== undefined)
            .selectMany(mf => linq(mf.Vertices)
                .selectMany(v => mf.Normal.toArray()).toArray()).toArray();
        let verticesNum = 0;
        let indices = [];
        meshFaces.toArray().forEach(meshFace => {
            indices = indices.concat(linq(meshFace.Triangles).select(t => t + verticesNum).toArray());
            verticesNum = verticesNum + meshFace.Vertices.length;
        });

        if (!Array.isNullOrEmpty(indices)) {
            this.meshData.geometry.setIndex(indices);
        }

        this.meshData.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.meshData.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.meshData.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

        this.meshData.geometry.clearGroups();
        this.materials.forEach(mat => mat.dispose());
        this.materials = [];

        let start = 0;
        sections.forEach((section, index) => {
            section.start = start;
            section.count = linq(section.MeshFaces).sum(mf => mf.Triangles.length);
            section.groupIndex = index;

            // 材质
            this.materials.push(this.defaultMaterial.clone());
            section.materialIndex = section.groupIndex;
            if (section.MaterialPath) {
                section.getMaterial().then(mtl => {
                    if (mtl) this.materials[section.materialIndex] = mtl;
                })
            }
            this.meshData.geometry.addGroup(section.start, section.count, section.materialIndex);
            start += section.count;
        })

        this.meshData.material = this.materials;

        let edge = this.meshData.children.find(obj => obj.type === 'LineSegments')
        if (edge) {
            edge.geometry.dispose();
            edge.geometry = new THREE.EdgesGeometry(this.meshData.geometry);
        }
    }

    getSectionByGroupIndex (groupIndex) {
        return this.Sections.find(section => section.groupIndex === groupIndex);
    }
}

export class MeshSection {
    constructor(meshFaces = [], material) {
        this.MeshFaces = meshFaces;
        this.Material = material;

        this.start = 0;
        this.count = 0;
        this.materialIndex = 0;
        this.groupIndex = 0;
    }

    Type = "";
    ID = "";
    SectionIndex = 0;
    MaterialPath = "";
    MaterialSubPath = "";
    InnerDirection = null;
    MeshFaces = [];

    ClassMapper = {MeshFaces: MeshFace, InnerDirection: THREE.Vector3};
    PropertyIgnore = ['Material', 'start', 'count', 'materialIndex', 'groupIndex', 'ID', 'InnerDirection', 'materialName', 'ClassMapper', 'PropertyIgnore'];

    fromUnity() {
        linq(this.MeshFaces).forEach(mf => {
            mf.Vertices.forEach(v => v.fromUnityPosition());
            mf.Normal.fromUnityPosition();
        });

        this.InnerDirection.fromUnityPosition();

        return this;
    }

    setMaterial(path, subPath) {
        this.MaterialPath = path;
        this.MaterialSubPath = '/Materials/' + subPath.split('/').pop();

    }

    async getMaterial() {
        let path = this.getMaterialPath();
        let materialName = this.MaterialPath + this.MaterialSubPath;

        return MeshData.materialBank.hasOwnProperty(materialName) ? MeshData.materialBank[materialName] :
            ResourcesLoader.loadMTLResource(path).then(mtl => {
                let subPaths = this.MaterialSubPath.split('/');
                let subPath = subPaths.pop();
                if (mtl) {
                    if (MeshData.materialBank.hasOwnProperty(materialName)) {
                        for (let key in mtl) {
                            mtl[key].dispose()
                        }
                    } else {
                        MeshData.materialBank[materialName] = mtl[subPath];
                    }
                    if (mtl[subPath]) mtl[subPath].name = subPath;
                }

                return MeshData.materialBank[materialName];
            });
    }

    getMaterialPath() {
        if (!this.MaterialSubPath) return null;
        this.materialName = this.MaterialSubPath.split('/').pop();
        let prefix = 'https://vrhouse-decoration.oss-cn-shanghai.aliyuncs.com/Resources/';
        return prefix + this.MaterialPath + '/Web/' + this.materialName;
    }

    createBufferGeometry() {
        let meshFaces = linq(this.MeshFaces);
        let vertices = meshFaces.selectMany(mf => mf.Vertices)
            .selectMany(v => v.toArray()).toArray();
        let uvs = meshFaces.selectMany(mf => mf.UVs)
            .selectMany(uv => uv.toArray()).toArray();
        let normals = meshFaces.where(mf => mf.Normal !== undefined)
            .selectMany(mf => linq(mf.Vertices)
                .selectMany(v => mf.Normal.toArray()).toArray()).toArray();

        let geometry = new THREE.BufferGeometry();
        let verticesNum = 0;
        let indices = [];

        meshFaces.toArray().forEach(meshFace => {
            indices = indices.concat(linq(meshFace.Triangles).select(t => t + verticesNum).toArray());
            verticesNum = verticesNum + meshFace.Vertices.length;
        });

        if (!Array.isNullOrEmpty(indices)) {
            geometry.setIndex(indices);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        return geometry;
    }

    merge(meshSection) {
        if (meshSection === this) return;
        this.MeshFaces = this.MeshFaces.concat(meshSection.MeshFaces);

        return this;
    }
}

export class MeshFace {
    constructor(vertices = [], uvs = [], normal) {
        this.OriginVertices = vertices;
        this.Holes = [];
        this.IsValid = true;
        this.ValidVertices = [];

        this.Vertices = vertices;
        this.UVs = uvs;
        this.Normal = normal;
        this.Triangles = [];
        this.isBackSide = false;
    }

    ClassMapper = {Vertices: THREE.Vector3, UVs: THREE.Vector2, Normal: THREE.Vector3};
    PropertyIgnore = ['ClassMapper', 'PropertyIgnore', 'OriginVertices', 'Holes', 'IsValid', 'ValidVertices'];

    fromUnityToThree() {
        if (!this.UVs) return null;

        let UVs = [];
        this.UVs.forEach(uv => {
            if (uv.y > 1) {
                UVs.push(new THREE.Vector2(uv.x, uv.y - Math.floor(uv.y)))
            } else {
                UVs.push(new THREE.Vector2(uv.x, uv.x))
            }
        });

        return UVs
    }
}
