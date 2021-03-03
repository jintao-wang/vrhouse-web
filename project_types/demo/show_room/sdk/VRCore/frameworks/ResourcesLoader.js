/**
 *Project name: VRHouseWeb
 *File name: ResourcesLoader
 *Created by Shirlman on 2017/8/31
 *Copyright 2016年 - 2018年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */

import {KFUtils} from "../../VRUtils/KFUtils.js";

THREE.Texture.prototype.isCancelled = false;

function ResourcesLoader() {
}

ResourcesLoader.maxRunningNum = 5;
ResourcesLoader.taskQueue = [];
ResourcesLoader.runningTasks = [];
ResourcesLoader.preparedResources = [];
ResourcesLoader.cubeTextureLoader = undefined;
ResourcesLoader.textureLoader = undefined;
ResourcesLoader.jsonLoader = undefined;
ResourcesLoader.fileLoader = undefined;
ResourcesLoader.retryNum = 3;
ResourcesLoader.noCache = false;
ResourcesLoader.cache = [];
ResourcesLoader.renderer = null;
ResourcesLoader.preRenderList = [];
export const ResourceType = {
    json: "json",
    svg: "svg",
    texture: "texture",
    font: "font",
    txt: "txt",
    obj: "obj",
    mtl: "mtl"
};

ResourcesLoader.getResourceLoader = function (type) {
    let loader = null;

    switch (type) {
        case ResourceType.json:
            loader = ResourcesLoader.getJsonLoader();
            break;
        case ResourceType.svg:
            // loader = ResourcesLoader.getSVGLoader();
            console.error("not implement!!!")
            break;
        case ResourceType.texture:
            loader = ResourcesLoader.getTextureLoader();
            break;
        case ResourceType.font:
            loader = ResourcesLoader.getFontLoader();
            break;
        case ResourceType.txt:
            loader = ResourcesLoader.getFileLoader();
            break;
        case ResourceType.obj:
            loader = ResourcesLoader.getOBJLoader2();
            break;
    }

    return loader;
};

ResourcesLoader.getCubeTextureLoader = function () {
    if (!ResourcesLoader.cubeTextureLoader) {
        ResourcesLoader.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    return ResourcesLoader.cubeTextureLoader;
};

// ResourcesLoader.getSVGLoader = function () {
//     if (!ResourcesLoader.svgLoader) {
//         ResourcesLoader.svgLoader = new THREE.SVGLoader();
//     }
//
//     return ResourcesLoader.svgLoader;
// };

ResourcesLoader.getTextureLoader = function () {
    if (!ResourcesLoader.textureLoader) {
        ResourcesLoader.textureLoader = new THREE.TextureLoader();
    }

    return ResourcesLoader.textureLoader;
};

ResourcesLoader.getJsonLoader = function () {
    if (!ResourcesLoader.jsonLoader) {
        ResourcesLoader.jsonLoader = new THREE.JSONLoader();
        ResourcesLoader.jsonLoader.crossOrigin = true;
    }

    return ResourcesLoader.jsonLoader;
};

ResourcesLoader.getFileLoader = function () {
    if (!ResourcesLoader.fileLoader) {
        ResourcesLoader.fileLoader = new THREE.FileLoader();
        ResourcesLoader.fileLoader.crossOrigin = true;
    }

    return ResourcesLoader.fileLoader;
};

ResourcesLoader.getFontLoader = function () {
    if (!ResourcesLoader.fontLoader) {
        ResourcesLoader.fontLoader = new THREE.FontLoader();
        ResourcesLoader.fontLoader.crossOrigin = true;
    }

    return ResourcesLoader.fontLoader;
};

ResourcesLoader.getOBJLoader2 = function () {

    let objLoader = function objLoader() {
    };

    objLoader.load = function (url, onLoad, onProgress, onError) {

        const objSuffix = ".obj";
        const mtlSuffix = ".mtl";

        let objLoader2 = new THREE.OBJLoader2();
        objLoader2.setLogging(false, false);

        objLoader2.loadMtl(url.replace(objSuffix, mtlSuffix), null, function onMtlLoad(materials) {
            objLoader2.setMaterials(materials);
            objLoader2.load(url.replace(mtlSuffix, objSuffix), function onObjLoad(objRoot) {
                if (onLoad) onLoad(objRoot.detail.loaderRootNode);
            }, onProgress, function onMtlError(error) {
                if (onError) onError(error);
            }, null, true);
        });
    };

    return objLoader;
};

ResourcesLoader.getType = function (url) {
    if (!url) {
        console.info("no url")
    }
    let type = undefined;

    let fileName = KFUtils.getFileName(url);

    fileName = fileName?.toLowerCase();

    switch (fileName) {
        case "jpg":
        case "png":
            type = ResourceType.texture;
            break;
        case "js":
            type = ResourceType.json;
            break;
        case "font":
            type = ResourceType.font;
            break;
        case "txt":
            type = ResourceType.txt;
            break;
        case "obj":
            type = ResourceType.obj;
            break;
        // case "svg":
        //     type = ResourceType.texture;
        //     break;
        default:
            type = ResourceType.texture;
            break;
    }

    return type;
};

ResourcesLoader.Task = function (url, isPreRender, onLoad, onProgress, onError) {
    this.url = url;
    this.onLoad = onLoad;
    this.onProgress = onProgress;
    this.onError = onError;
    this.isPreRender = isPreRender;
    this.priority = 100; // TODO：数字越小，优先级越高

    let _this = this;

    this.run = function () {
        ResourcesLoader.loadResource(this.url, function (resource) {
            for (let i = 0; i < ResourcesLoader.runningTasks.length; i++) {
                if (ResourcesLoader.runningTasks[i] === _this) {
                    ResourcesLoader.runningTasks.splice(i, 1);

                    break;
                }
            }

            ResourcesLoader.runTasks();

            if (_this.onLoad) _this.onLoad(resource);
        }, this.onProgress, this.onError, this.isPreRender);
    }
};

ResourcesLoader.runTasks = function () {
    let leftRunCount = ResourcesLoader.maxRunningNum - ResourcesLoader.runningTasks.length;

    if (leftRunCount === 0 || ResourcesLoader.taskQueue.length === 0) {
        return;
    }

    leftRunCount = Math.min(leftRunCount, ResourcesLoader.taskQueue.length);

    for (let i = 0; i < leftRunCount; i++) {
        let task = ResourcesLoader.taskQueue.shift();
        ResourcesLoader.runningTasks.push(task);
        task.run();
    }
};

ResourcesLoader.loadGLTFScene = async function (url) {
    return new Promise((resolve, reject) => {
        let gltfLoader = new THREE.GLTFLoader();

        gltfLoader.load(url, gltf => {
            if (gltf) {
                resolve(gltf.scene)
            } else {
                console.err('Failed to get gltf file!');
                reject();
            }

        }, xhr => {
            let size = xhr.total / 1000 / 1000;
            let path = url.split('/')
            // if (size > 0.5) window.exceedingGUID[path[path.length - 3]] = size + 'M'
            if (size > 0.5) window.exceedingGUID[url] = size + 'M'

        }, error => resolve('error'))
    });
};

ResourcesLoader.loadOBJResource = async function (url) {
    url = url.replace(".obj", "");

    return new Promise((resolve, reject) => {
        let mtlLoader = new THREE.MTLLoader();

        mtlLoader.load(url + '.mtl', mtl => {
            mtl.preload();
            if (mtl) {
                let objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(mtl);

                objLoader.load(url + '.obj', obj => {
                    resolve(obj);
                })
            } else {
                console.err('Failed to get mtl file!');
                reject();
            }
        })
    });
};

ResourcesLoader.loadMTLResource = async function (url) {
    return new Promise((resolve, reject) => {
        let mtlLoader = new THREE.MTLLoader();

        mtlLoader.load(url + '.mtl', mtl => {
            mtl.preload();
            if (mtl) {
                resolve(mtl.materials);
            } else {
                console.err('Failed to get mtl file!');
                reject();
            }
        })
    });
};

ResourcesLoader.loadCubeTexture = function (urls, onLoad, onProgress, onError) {
    if (ResourcesLoader.noCache) {
        urls = urls.map(url=> url + "?" + KFUtils.UUID8Bit());
    }
    let cubeTexture = ResourcesLoader.getCubeTextureLoader().load(urls, onLoad, onProgress, onError);

    cubeTexture.generateMipmaps = false;
    cubeTexture.magFilter = THREE.LinearFilter;
    cubeTexture.minFilter = THREE.LinearFilter;
    cubeTexture.format = THREE.RGBAFormat; // texImage2D, RGBAFormat居然比RBGFormat快150ms

    return cubeTexture;
};

ResourcesLoader.loadResource = function (url, onLoad, onProgress, onError, isPreRender) {

    let loadedResource = ResourcesLoader.preparedResources[url];
    let retryCount = 0;
    let type = ResourcesLoader.getType(url);

    function onResourceLoad(arg1, arg2) {
        let resource;

        switch (type) {
            case ResourceType.texture:
            case ResourceType.svg:
            case ResourceType.font:
            case ResourceType.txt:
            case ResourceType.obj:
                resource = arg1;
                break;
            case ResourceType.json:
                resource = {geometry: arg1, materials: arg2};
                break;
        }

        if (resource.isCancelled) {
            return;
        }

        if (type === ResourceType.texture && ResourcesLoader.renderer && isPreRender) {
            ResourcesLoader.preRenderList.push(resource);
        }

        if (onLoad) onLoad(resource);
    }

    function onRetryResourceLoad(arg1, arg2) {

        if (type === ResourceType.texture) {
            arg1.needsUpdate = true;
        }

        onResourceLoad(arg1, arg2);
    }

    if (loadedResource) {
        delete ResourcesLoader.preparedResources[url];
        if (onLoad) onLoad(loadedResource);
    } else {
        if (ResourcesLoader.noCache) {
            url += "?" + KFUtils.UUID8Bit();
        }

        // noinspection JSAnnotato0r
        function retryOnError(error) {

            if (!loadedResource) {

                return;
            }

            if (!loadedResource.isCancelled && retryCount < ResourcesLoader.retryNum) {
                let retryResource = ResourcesLoader.getResourceLoader(type).load(url, onRetryResourceLoad, onProgress, retryOnError);

                if (type === ResourceType.texture) {
                    loadedResource.image = retryResource.image;
                }

                retryCount++;
            } else {
                if (onError) onError(error);
            }
        }

        url = url?.replace("\\", "/");
        loadedResource = ResourcesLoader.getResourceLoader(type).load(url, onResourceLoad, onProgress, retryOnError);

        if (loadedResource) {
            loadedResource.isCancelled = false;
        }
    }

    return loadedResource;
};

ResourcesLoader.preRender = function (renderer) {
    if (renderer) {
        ResourcesLoader.renderer = renderer;
    }

    if (ResourcesLoader.preRenderList.length > 0) {
        let texture = ResourcesLoader.preRenderList.shift();
        ResourcesLoader.renderer.setTexture2D(texture, 0); // 提前渲染
    }

    requestAnimationFrame(function () {
        ResourcesLoader.preRender();
    });
};

ResourcesLoader.loadResourceInQueue = function (url, onLoad, onProgress, onError, isPreRender) {
    let task = new ResourcesLoader.Task(url, isPreRender, onLoad, onProgress, onError);
    ResourcesLoader.taskQueue.push(task);
    ResourcesLoader.runTasks();
};

ResourcesLoader.loadResources = function (urls, onResourceLoad, onLoad, onProgress, onError, isPreRender) {
    let resources = [];
    let loaded = 0;

    let onResourceLoaded = function (i, resource) {
        resources[i] = resource;
        ++loaded;

        if (onResourceLoad) {
            onResourceLoad(urls[i], resource);
        }

        if (onProgress) {
            onProgress(Math.floor(100 * loaded / urls.length + .5));
        }

        if (loaded === urls.length) {
            if (onLoad) onLoad(resources);
        }
    };

    function loadResource(i) {
        return ResourcesLoader.loadResource(urls[i], function (resource) {
            onResourceLoaded(i, resource);
        }, null, onError, isPreRender);
    }

    if (urls.length === 0) {
        if (onLoad) onLoad([]);
    } else {
        for (let i = 0; i < urls.length; ++i) {
            resources[i] = loadResource(i);
        }
    }

    return resources;
};

ResourcesLoader.cancelTextures = function (textures) {
    if (textures) {
        textures.forEach(texture => ResourcesLoader.cancelTexture(texture));
    }
};

ResourcesLoader.cancelTexture = function (texture) {
    if (texture.image) {
        texture.image.src = '';
        texture.image = null;
    }

    texture.needsUpdate = false;
    texture.dispose();
    texture.isCancelled = true;
};

ResourcesLoader.prepareResources = function (urls, onLoad, onProgress, onError) {
    ResourcesLoader.loadResources(urls, function (url, resource) {
        ResourcesLoader.preparedResources[url] = resource;
    }, onLoad, onProgress, onError, true);
};

export {ResourcesLoader}
