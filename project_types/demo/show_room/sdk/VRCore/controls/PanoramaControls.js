/**
 *Project name: VRHouseWeb
 *File name: PanoramaControls
 *Created by Shirlman on 2017/8/31
 *Copyright 2016年 - 2018年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */

import {KFUtils} from "../../VRUtils/KFUtils.js";

function PanoramaControls(camera, domElement) {
    this.enabled = true;
    this.isAutoPlay = false;
    this.isAutoPlayWhenIdle = true;
    this.autoPlayDelay = 0;
    this.autoRotateSpeed = 1;
    this.speed = 1;
    // this.minPolarAngle = THREE.Math.degToRad(-30);
    this.minPolarAngle = THREE.Math.degToRad(-85);
    this.maxPolarAngle = THREE.Math.degToRad(85);
    this.zoomSpeed = 0.5;
    this.disableMenu = true;

    this.state = -1;
    this.mouseButtons = {ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT};

    this.maxFov = 80;
    this.minFov = 50;
    this.enableInertia = true;
    this.inertiaMovingFactor = 0.05;
    this.inertiaFactor = 0.25; // 0 - 1, 值越大，惯性越大

    this.touchMovingSensitive = 0.01; // 屏幕百分比

    this.diyMode = '';
    this.enablePointEdit = true;
    this.target = new THREE.Vector3();

    this.setDiyMode = function (mode) {
        this.diyMode = mode;
    };

    this.maxFovLimit = function () {
        return 1.3 * this.maxFov;
    };

    this.onFovChanged = function () {
    };
    this.onCameraRotated = function () {
    };
    this.onCameraRotationChanged = function () {
    };
    this.onTouchOrMouseDown = function () {
    };
    this.onFovLimitExceed = function () {
    };
    this.onLookAtChange = function (target) {
    };
    this.changeFov = function (operator, num) {
        let fov
        if (operator === '+') {
            fov = camera.fov + num;
        } else {
            fov = camera.fov - num
        }
        fov = Math.max(_this.minFov, Math.min(_this.maxFovLimit(), fov));

        if (fov >= _this.maxFovLimit() && _this.onFovLimitExceed) {
            _this.onFovLimitExceed();
        } else {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(function () {
                camera.fov = Math.min(_this.maxFov, camera.fov);
                camera.updateProjectionMatrix();
            }, 150);

            camera.fov = fov;
            camera.updateProjectionMatrix();

            if (_this.onFovChanged) _this.onFovChanged(fov);
        }
    }

    let isPointDown = false;
    let touchStartPosition = new THREE.Vector2();
    let isStartTouchMoving = false;
    let touchStartPanDistance = -1;
    let panStartCameraFov = -1;

    let onPointerDownX = 0, onPointerDownY = 0,
        theta = 0, onPointerDownTheta = 0,
        phi = 0, onPointerDownPhi = 0;

    let slideAverageWindow = 6;
    let slideAverageHistory = [];

    let lastCameraRotation = {theta: 0, phi: 0};
    let previousCameraRotation = new THREE.Euler();

    let inertialDelta = new THREE.Spherical();
    let EPS = 0.000001;
    let _this = this;

    let autoPlayTimeout;

    registEvent(domElement);

    animate();

    function registEvent(domElement) {
        if (!domElement) domElement = document;

        let scope = KFUtils.checkIsPhone() ? domElement : window;

        domElement.addEventListener('mousedown', onMouseDown, false);
        scope.addEventListener('mousemove', onMouseMove, false);
        scope.addEventListener('mouseup', onMouseUp, false);
        domElement.addEventListener('wheel', onMouseWheel, false);

        domElement.addEventListener('touchstart', onTouchDown, {passive: false});
        scope.addEventListener('touchend', onTouchUp, {passive: false});
        scope.addEventListener('touchmove', onTouchMove, {passive: false});

        if (_this.disableMenu) {
            scope.oncontextmenu = function (ev) {
                return false;    //屏蔽右键菜单
            }
        }
    }

    function initlets(x, y) {
        onPointerDownX = x;
        onPointerDownY = y;

        onPointerDownTheta = camera.rotation.y;
        onPointerDownPhi = camera.rotation.x;

        lastCameraRotation.theta = camera.rotation.y;
        lastCameraRotation.phi = camera.rotation.x;

        slideAverageHistory.splice(0, slideAverageHistory.length);
        inertialDelta.theta = 0;
        inertialDelta.phi = 0;
    }

    function onPointDown(x, y) {
        isPointDown = true;

        initlets(x, y);

        _this.isAutoPlay = false;

        clearTimeout(autoPlayTimeout);

        if (_this.onTouchOrMouseDown) {
            _this.onTouchOrMouseDown();
        }
    }

    function onPointMove(x, y) {
        if (isPointDown && _this.enabled) {
            let theta = (x - onPointerDownX) * _this.speed * 0.003 + onPointerDownTheta;
            let phi = (y - onPointerDownY) * _this.speed * 0.003 + onPointerDownPhi;

            if (KFUtils.checkIsPhone()) {
                let movingAverage = getMovingAverage(theta, phi);
                theta = movingAverage.theta;
                phi = movingAverage.phi;
            }

            phi = Math.max(_this.minPolarAngle, Math.min(_this.maxPolarAngle, phi));

            let factor = 0.6;
            inertialDelta.theta += (theta - lastCameraRotation.theta) * factor;
            inertialDelta.phi += (phi - lastCameraRotation.phi) * factor;

            lastCameraRotation.theta = theta;
            lastCameraRotation.phi = phi;
        }
    }

    function getMovingAverage(theta, phi) {
        let average = {theta: 0, phi: 0};

        if (slideAverageHistory.length >= slideAverageWindow) {
            slideAverageHistory.shift();
        }

        slideAverageHistory.push({theta: theta, phi: phi});

        for (let i = 0; i < slideAverageHistory.length; i++) {
            average.theta += slideAverageHistory[i].theta;
            average.phi += slideAverageHistory[i].phi;
        }

        average.theta /= slideAverageHistory.length;
        average.phi /= slideAverageHistory.length;

        return average;
    }

    function onPointUp() {
        isPointDown = false;
        _this.onLookAtChange(_this.target);

        autoPlayWhenIdle();
    }

    function autoPlayWhenIdle() {
        if (_this.isAutoPlayWhenIdle) {
            if (autoPlayTimeout) {
                clearTimeout(autoPlayTimeout);
            }

            autoPlayTimeout = setTimeout(function () {
                if (_this.isAutoPlayWhenIdle) {
                    // _this.isAutoPlay = true;
                    _this.isAutoPlay = false;
                }

                autoPlayTimeout = undefined;
            }, _this.autoPlayDelay);
        }
    }

    // touch control
    function onTouchDown(event) {
        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {
            case 1: // one-fingered touch: rotate

                onPointDown(
                    event.touches[0].pageX * getFactor(),
                    event.touches[0].pageY * getFactor());

                touchStartPosition.set(event.touches[0].pageX, event.touches[0].pageY);

                isStartTouchMoving = false;

                break;
            case 2: // two-fingered touch: dolly

                touchStartPosition.set(event.touches[0].pageX, event.touches[0].pageY);
                let touchStartPosition2 = new THREE.Vector2(event.touches[1].pageX, event.touches[1].pageY);

                touchStartPanDistance = touchStartPosition.distanceTo(touchStartPosition2);
                panStartCameraFov = camera.fov;

                break;
        }
    }

    function onTouchMove(event) {
        if (!_this.enabled) {
            return;
        }
        if (_this.diyMode === 'outdoor') return;
        // if (_this.diyMode === 'indoor' && _this.state === THREE.MOUSE.PAN) return;
        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {
            case 1: // one-fingered touch: rotate

                if (!isStartTouchMoving) {
                    let deltaX = (event.touches[0].pageX - touchStartPosition.x) / domElement.clientWidth;
                    let deltaY = (event.touches[0].pageY - touchStartPosition.y) / domElement.clientHeight;

                    if (Math.abs(deltaX) > _this.touchMovingSensitive || Math.abs(deltaY) > _this.touchMovingSensitive) {
                        isStartTouchMoving = true;
                    }
                }

                if (isStartTouchMoving) {
                    onPointMove(
                        event.touches[0].pageX * getFactor(),
                        event.touches[0].pageY * getFactor());
                }

                break;

            case 2: // two-fingered touch: dolly
                if (_this.diyMode) return;

                let position1 = new THREE.Vector2(event.touches[0].pageX, event.touches[0].pageY);
                let position2 = new THREE.Vector2(event.touches[1].pageX, event.touches[1].pageY);
                let movingDistance = position1.distanceTo(position2);
                let scale = touchStartPanDistance / movingDistance - 1;

                scale = 1 + scale * _this.zoomSpeed;

                let fov = panStartCameraFov * scale;
                fov = Math.max(_this.minFov, Math.min(_this.maxFovLimit(), fov));

                if (fov >= _this.maxFovLimit() && _this.enabled) {
                    _this.onFovLimitExceed();
                } else {
                    camera.fov = fov;
                    camera.updateProjectionMatrix();
                }

                if (fov <= _this.minFov || fov >= _this.maxFovLimit()) {
                    panStartCameraFov = fov;
                    touchStartPanDistance = movingDistance;
                }

                break;
        }
    }

    function onTouchUp(event) {
        event.preventDefault();
        event.stopPropagation();

        camera.fov = Math.min(_this.maxFov, camera.fov);
        camera.updateProjectionMatrix();

        onPointUp();

        isStartTouchMoving = false;
    }

    // mouse control
    function onMouseDown(event) {
        event.preventDefault();
        onPointDown(event.clientX * getFactor(), event.clientY * getFactor());
        _this.state = event.button
    }

    function onMouseMove(event) {
        if (!_this.enabled) {
            return;
        }
        if (_this.diyMode === 'outdoor') return;
        if (_this.diyMode === 'indoor' && _this.state === THREE.MOUSE.PAN) return;

        event.preventDefault();
        onPointMove(event.clientX * getFactor(), event.clientY * getFactor());
    }

    function onMouseUp(event) {
        event.preventDefault();
        onPointUp();
        _this.state = -1;
        if (_this.diyMode === 'outdoor') return;
        if (_this.diyMode === 'indoor' && _this.state === THREE.MOUSE.PAN) return;
    }

    function onMouseWheel(event) {
        if (_this.diyMode) return;
        if (!_this.enabled) {
            return;
        }

        let fov = camera.fov + event.deltaY * 0.05;
        fov = Math.max(_this.minFov, Math.min(_this.maxFovLimit(), fov));

        if (fov >= _this.maxFovLimit() && _this.onFovLimitExceed) {
            _this.onFovLimitExceed();
        } else {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(function () {
                camera.fov = Math.min(_this.maxFov, camera.fov);
                camera.updateProjectionMatrix();
            }, 150);

            camera.fov = fov;
            camera.updateProjectionMatrix();

            if (_this.onFovChanged) _this.onFovChanged(fov);
        }
    }

    function getFactor() {
        return _this.speed * (camera.fov / 100) * (1000 / domElement.clientWidth);
    }

    function updateCameraRotation(theta, phi) {
        phi = Math.max(_this.minPolarAngle, Math.min(_this.maxPolarAngle, phi));

        camera.rotation.x = phi;
        camera.rotation.y = theta;
    }

    function updateInertialDelta(inertialFactor) {
        if (inertialDelta.theta !== 0 || inertialDelta.phi !== 0) {
            inertialDelta.theta *= inertialFactor;
            inertialDelta.phi *= inertialFactor;

            if (Math.abs(inertialDelta.theta) < EPS) inertialDelta.theta = 0;
            if (Math.abs(inertialDelta.phi) < EPS) inertialDelta.phi = 0;
        }
    }

    function update() {
        if (!_this.enabled) {
            inertialDelta.theta = 0;
            inertialDelta.phi = 0;

            return;
        }

        let previousCameraRotation = camera.rotation.clone();

        if (_this.enableInertia && (inertialDelta.theta !== 0 || inertialDelta.phi !== 0)) {
            updateInertialDelta(isPointDown ? _this.inertiaMovingFactor : _this.inertiaFactor);
            theta = camera.rotation.y + inertialDelta.theta;
            phi = camera.rotation.x + inertialDelta.phi;

            updateCameraRotation(theta, phi);
        }

        if (_this.isAutoPlayWhenIdle && !_this.isAutoPlay && !autoPlayTimeout) {
            autoPlayWhenIdle();
        }

        if (_this.isAutoPlay && !isPointDown) {
            let rotateValue = _this.autoRotateSpeed * 0.001;

            camera.rotation.y -= rotateValue;

            if (camera.rotation.x > 0 && camera.rotation.x - rotateValue >= 0) {
                camera.rotation.x -= rotateValue;
            } else if (camera.rotation.x < 0 && camera.rotation.x + rotateValue <= 0) {
                camera.rotation.x += rotateValue;
            } else {
                camera.rotation.x = 0;
            }
        }

        if (!_this.isAutoPlay && !previousCameraRotation.approxEquals(camera.rotation, 0.001745)) {  // 0.1度
            _this.onCameraRotated(camera.rotation);
        }

        if (!_this.lastCameraRotation || !_this.lastCameraRotation.approxEquals(camera.rotation, 0.001745)) {
            _this.onCameraRotationChanged(camera.rotation);
        }

        _this.lastCameraRotation = camera.rotation.clone();
    }

    function animate() {

        requestAnimationFrame(animate);

        update();
    }
}

export {PanoramaControls}
