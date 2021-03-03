import {KFUtils} from "../../VRUtils/KFUtils";

/**
 *Project name: VRHouseWeb
 *File name: VRApp
 *Created by Shirlman on 2017/8/31
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */

export class VRApp {
    constructor(config) {
        this.id = KFUtils.UUID8Bit();

        let renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.sortObjects = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClearColor = false; // 解决多个camera背景透明的问题
        window.addEventListener("unload", renderer.dispose); // 释放资源

        let maxAnisotropy = renderer.capabilities ? renderer.capabilities.getMaxAnisotropy() : 1;
        this.anisotropy = maxAnisotropy >= 2 ? 2 : 1;

        this.screenWidth = config.mainContainerWidth || VRApp.defaultScreenWidth;
        this.screenHeight = config.mainContainerHeight || VRApp.defaultScreenHeight;
        renderer.setSize(this.screenWidth, this.screenHeight);

        this.container = config.mainContainer;
        this.renderer = renderer;
        this.container.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.data = this;

        this.objects = [];
        this.isWindowResized = false;

        //建立了一个“根物体”，来存放场景中的其他物体，也就是根物体移动时所有其他物体会和它一同移动
        let root = new THREE.Object3D();
        root.name = "root";
        this.scene.add(root);
        this.root = root;

        this.needsUpdate = true;
        this.updateCount = 30;
        this.clock = new THREE.Clock();
    }

    static defaultScreenWidth = window.innerWidth;
    static defaultScreenHeight = window.innerHeight;

    run(firstRun) {
        if (firstRun && this.firstRun) return;
        else if (firstRun) this.firstRun = true;
        let elapsedTime = this.clock.getElapsedTime();
        this.updateAll(elapsedTime);
        this.update();

        let _this = this;
        requestAnimationFrame(function () {
            _this.run();
        });
    }

    update() {

    }

    updateAll(elapsedTime) {
        if (!this.needsUpdate && this.updateCount-- <= 0) {
            return;
        }

        let domElement = this.renderer.domElement;

        if (this.screenWidth !== domElement.clientWidth || this.screenHeight !== domElement.clientHeight) {
            this.screenWidth = domElement.clientWidth;
            this.screenHeight = domElement.clientHeight;

            this.isWindowResized = true;

            this.onWindowResize(this.screenWidth, this.screenHeight);
        }

        this.objects.forEach(object => {
            if (this.isWindowResized) {
                object.resizeWindow();
            }
            object.updateAll && object.updateAll();
        });

        this.isWindowResized = false;

        if (this.needsUpdate) {
            this.updateCount = 30;
        }
    };

    addObject(obj) {
        this.objects.push(obj); //将物体对象添加到前面建立的物体数组里
        this.root.add(obj.object3D);
        obj.startAll && obj.startAll();
    };

    onWindowResize(width, height) {
        this.renderer.setSize(width, height);
        window.scrollTo(0, 0);
    };

    dispose() {
        this.needsUpdate = false;
        this.root.children.slice().forEach(child => {
            child.dispose();
        });

        this.renderer.dispose();
        this.objects.splice(0, this.objects.length);
        this.needsUpdate = true;
    }
}

export class VRObject {
    constructor(name = "") {
        this.object3D = new THREE.Object3D();
        this.object3D.name = name || this.constructor.name;

        this._scene = undefined;
        this._renderer = undefined;
        this._isStarted = false;
        this.children = [];
    }

    get screenWidth() {
        if (this.getApp()) {
            return this.getApp().screenWidth;
        }

        return VRApp.defaultScreenWidth;
    }

    get screenHeight() {
        if (this.getApp()) {
            return this.getApp().screenHeight;
        }
        return VRApp.defaultScreenHeight;
    }

    get scene() {
        if (this._scene) {
            return this._scene;
        }

        let scene = undefined;

        if (this.object3D) {
            let obj = this.object3D;
            while (obj.parent) {
                obj = obj.parent;
            }

            if (obj.type === "Scene") {
                scene = obj;
                this._scene = scene;
            }
        }

        return scene;
    }

    getApp() {
        let scene = this.scene;
        return scene ? scene.data : null;//如果scene不具备data属性，说明scene不对应App
    };

    get renderer() {
        if (this._renderer) {
            return this._renderer;
        }

        let app = this.getApp();
        this._renderer = app ? app.renderer : null;

        return this._renderer;
    }

    onWindowResize(width, height) {
    }

    resizeWindow() {
        // if (!this.object3D.visible) {
        //     return;
        // }

        this.onWindowResize(this.screenWidth, this.screenHeight);
        this.children.forEach(child => child.resizeWindow());
    }

    // object3D被加入到场景中时调用
    start() {
    }

    startAll() {
        if (!this._isStarted && this.scene) {

            try {
                this.start();
            } catch (e) {
                console.error("Update failed, {0}: {1}".format(this.object3D.name, e.stack));
            }

            this._isStarted = true;
        }

        this.children.forEach(child => child.startAll());
    }

    // 每一帧刷新时调用
    update() {
    }

    updateAll(elapsedTime) {
        if (!this.object3D.visible) {
            return;
        }

        try {
            this.update(elapsedTime);
        } catch (e) {
            console.error("Update failed, {0}: {1}".format(this.object3D.name, e.stack));
        }

        this.children.forEach(child => child.updateAll(elapsedTime));
    }

    show() {
        this.object3D.visible = true;
    }

    hide() {
        this.object3D.visible = false;
    }

    get visible() {
        return this.object3D.visible;
    }

    setLayer(layer) {
        this.object3D.setLayer(layer);
    };

    setRenderOrder(renderOrder) {
        this.object3D.setRenderOrder(renderOrder);
    };

    addChild(child) {
        this.children.push(child);
        this.object3D.add(child.object3D);
        this.startAll();
    };
}

