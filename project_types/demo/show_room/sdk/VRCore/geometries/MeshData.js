import {ResourcesLoader} from "../frameworks/ResourcesLoader";

export class MeshData {
    constructor(sections = []) {
        this.Sections = sections;

        sections.forEach((section, index) => {
            section.SectionIndex = index;
        });

        this.meshData = null;

        this.defaultMaterial = new THREE.MeshPhongMaterial({color: '#dcdcdc'});
        this.defaultBaseicMaterial = new THREE.MeshBasicMaterial({name: "fu", color: '#dcdcdc'});
        this.opcityMaterial = new THREE.MeshPhongMaterial({color: '#c9c9c9',opacity:0.4,transparent:true, depthWrite: false});
        this.openSpaceMaterial = new THREE.MeshPhongMaterial({color: '#ffffff', opacity:0, transparent:true});
        this.materials = [];
    }

    static materialBank = {};

    Sections = [];
    ClassMapper = {Sections: MeshSection};
    PropertyIgnore = ['meshData', 'defaultMaterial', 'materials', 'ClassMapper', 'PropertyIgnore'];

    fromUnity() {
        this.Sections.flatMap(s => s.MeshFaces)
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

    createMesh(filter = null) {
        let sections = filter ? this.Sections.filter(filter) : this.Sections;
        let meshFaces = sections.flatMap(s => s.MeshFaces);
        let vertices = meshFaces.flatMap(mf => mf.Vertices).flatMap(v => v.toArray());
        let uvs = meshFaces.flatMap(mf => mf.UVs).flatMap(uv => uv.toArray());
        let normals = meshFaces.filter(mf => mf.Normal !== undefined)
            .flatMap(mf => mf.Vertices.flatMap(v => mf.Normal.toArray()));
        let geometry = new THREE.BufferGeometry();
        let verticesNum = 0;
        let indices = [];
        meshFaces.forEach(meshFace => {
            indices = indices.concat(meshFace.Triangles.map(t => t + verticesNum));
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
            let count = section.MeshFaces.reduce((total, mf) => total + mf.Vertices.length, 0);
            geometry.addGroup(start, count, i);
            start += count;
        });

        let materials = this.Sections.filter(section => section.Material !== undefined)
            .map(section => section.Material);

        return new THREE.Mesh(geometry, materials);
    }

    createBufferMesh(filter = null, showEdge = false) {
        // console.time("createBufferMesh")
        let sections = filter ? this.Sections.filter(filter) : this.Sections;
        let meshFaces = sections.flatMap(s => s.MeshFaces);
        let vertices = meshFaces.flatMap(mf => mf.Vertices).flatMap(v => v.toArray());
        let uvs = meshFaces.flatMap(mf => mf.UVs).flatMap(uv => uv.toArray());
        let normals = meshFaces.filter(mf => mf.Normal !== undefined)
            .flatMap(mf => mf.Vertices.flatMap(v => mf.Normal.toArray()));
        let geometry = new THREE.BufferGeometry();
        let verticesNum = 0;
        let indices = [];
        meshFaces.forEach(meshFace => {
            indices = indices.concat(meshFace.Triangles.map(t => t + verticesNum));
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
            section.count = section.MeshFaces.reduce((total, mf) => total + mf.Triangles.length, 0);
            section.groupIndex = index;

            // 材质
            if(section.Type === "OpenSpace"){
                this.materials.push(this.openSpaceMaterial.clone());
            }else{
                this.materials.push(section.Material ? section.Material : this.defaultMaterial.clone());
            }
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
        let materials = Array.from(new Set(this.Sections.map(section => section.MaterialPath + section.MaterialSubPath)));
        materials.forEach(mtl => {
            this.Sections = sections.filter(section => section.MaterialPath + section.MaterialSubPath === mtl);
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
        let meshFaces = sections.flatMap(s => s.MeshFaces);
        let vertices = meshFaces.flatMap(mf => mf.Vertices).flatMap(v => v.toArray());
        let uvs = meshFaces.flatMap(mf => mf.UVs).flatMap(uv => uv.toArray());
        let normals = meshFaces.filter(mf => mf.Normal !== undefined)
            .flatMap(mf => mf.Vertices.flatMap(v => mf.Normal.toArray()));
        let verticesNum = 0;
        let indices = [];
        meshFaces.forEach(meshFace => {
            indices = indices.concat(meshFace.Triangles.map(t => t + verticesNum));
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
            section.count = section.MeshFaces.reduce((total, mf) => total + mf.Triangles.length, 0);
            section.groupIndex = index;

            // 材质
            if(section.Type === "OpenSpace"){
                this.materials.push(this.openSpaceMaterial.clone());
            }else{
                this.materials.push(section.Material ? section.Material : this.defaultMaterial.clone());
            }
            section.materialIndex = section.groupIndex;
            if (section.MaterialPath) {
                section.getMaterial().then(mtl => {
                    if (mtl) this.materials[section.materialIndex] = mtl;
                })
            }
            this.meshData.geometry.addGroup(section.start, section.count, section.materialIndex);
            start += section.count;
        })
        this.meshData.geometry.computeBoundingSphere();
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
    PropertyIgnore = ['Material', 'start', 'count', 'materialIndex', 'groupIndex', 'ID', 'InnerDirection',
        'materialName', 'ClassMapper', 'PropertyIgnore'];

    fromUnity() {
        this.MeshFaces.forEach(mf => {
            mf.Vertices.forEach(v => v.fromUnityPosition());
            mf.Normal.fromUnityPosition();
        });

        this.InnerDirection.fromUnityPosition();

        return this;
    }

    setMaterial(path, subPath) {
        if (!path || !subPath) return;

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
        let meshFaces = this.MeshFaces;
        let vertices = meshFaces.flatMap(mf => mf.Vertices).flatMap(v => v.toArray());
        let uvs = meshFaces.flatMap(mf => mf.UVs).flatMap(uv => uv.toArray());
        let normals = meshFaces.filter(mf => mf.Normal !== undefined)
            .flatMap(mf => mf.Vertices.flatMap(v => mf.Normal.toArray()));

        let verticesNum = 0;
        let indices = [];
        let geometry = new THREE.BufferGeometry();

        meshFaces.forEach(meshFace => {
            indices = indices.concat(meshFace.Triangles.map(t => t + verticesNum));
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
