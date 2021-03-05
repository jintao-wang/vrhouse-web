import * as THREE from 'three';
/**
 *Project name: VRHouseWeb
 *File name: EventListener
 *Created by Shirlman on 2017/8/31
 *Copyright 2016年 - 2020年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */

function KFEvent() {
  // defination
  this.onPress = function (object3D, state, intersect) {
  };
  this.onclick = function (object3D, intersect) {
  };
  this.ondblclick = function (object3D, kfEvent) {
  };
  this.onHover = function (object3D, state, kfEvent, groupIndex) {
  };
  this.onMouseout = function (object3D, state) {
  };
  this.onDragStart = function (object3D) {
  };
  this.onDrag = function (object3D, deltaPosition, currentPosition, kfEvent) {
  };
  this.onDragEnd = function (object3D) {
  };
  this.onMouseMove = function (object3D, kfEvent) {
  };
  this.onPointMove = function (object3D, kfEvent) {
  };

  // init
  // click
  this.onPress = null;
  this.onclick = null;
  this.ondblclick = null;

  // move
  this.onHover = null;
  this.onMouseout = null;
  this.onMouseMove = null;
  this.onPointMove = null;

  // drag
  this.onDragStart = null;
  this.onDrag = null;
  this.onDragEnd = null;

  this.object3D = null;
  this.camera = null;
  this.enabled = true;
  this.isMouseIn = false;
  this.intersect = null;
  this.isPressDown = false;
  this.isStartDrag = false;

  this.mousePosition = null;

  const _this = this;

  let pressDownTime = null;
  let pressPosition = null;
  let clickTimeout = null;
  let isDoublePressed = false;
  let intersectObj = null;
  let intersectCamera = null;
  let dragStartDeltaPosition = null;

  let intersectPlane = null;
  this.dragOnPlane = function (plane) {
    intersectPlane = plane;

    return _this;
  };

  this.dispose = function () {
    const index = EventListener.events.indexOf(this);

    if (index !== -1) {
      EventListener.events.splice(index, 1);
    }
  };

  this.processDragEvent = function (domEvent, domElement, firstIntersectEvent) {
    if (domEvent.type === 'touchend' || domEvent.type === 'mouseup') {
      if (_this.isStartDrag) {
        _this.isPressDown = false;
        endDrag();
      }
    } else if ((domEvent.type === 'mousemove' || domEvent.type === 'touchmove')) {
      if (_this.isPressDown && !_this.isStartDrag && firstIntersectEvent === this) {
        startDrag();
      } else if (_this.isPressDown && _this.isStartDrag) {
        drag();
      }
    }
  };

  this.dragOnObject = function (obj, cam) {
    intersectObj = obj;
    if (cam) intersectCamera = cam;

    return _this;
  };

  this.processPressUpEvent = function (domEvent, domElement) {
    onPressUp(domEvent, domElement);
  };

  this.processEvent = function (domEvent, raycaster, domElement) {
    if (domEvent.type === 'touchstart' || domEvent.type === 'mousedown') {
      onPressDown(domEvent, domElement);
    }

    if (domEvent.type === 'mousemove' && _this.object3D) {
      _this.invokeAction('onMouseMove', _this);
    }
  };

  function startDrag() {
    if (!_this.onDragStart && !_this.onDrag) {
      return;
    }

    if (!intersectObj) {
      console.log('please set intersectObj using function event.dragOnObject');
      return;
    }

    const intersect = _this.getIntersectOnObject(intersectObj, intersectCamera);

    if (!intersect) {
      return;
    }

    const objectPosition = _this.object3D.realPosition || _this.object3D.getWorldPosition(new THREE.Vector3());
    dragStartDeltaPosition = objectPosition.clone().sub(intersect.point);

    _this.isStartDrag = true;

    if (_this.onDragStart) _this.onDragStart(_this.object3D);
  }

  function drag() {
    const intersect = _this.getIntersectOnObject(intersectObj, intersectCamera);

    if (!intersect) {
      return;
    }

    const objectPosition = _this.object3D.realPosition || _this.object3D.getWorldPosition(new THREE.Vector3());
    const currentPosition = intersect.point.clone().add(dragStartDeltaPosition);
    const deltaPosition = currentPosition.clone().sub(objectPosition);
    if (_this.onDrag) _this.onDrag(_this.object3D, deltaPosition, currentPosition, _this);
  }

  function endDrag() {
    _this.isStartDrag = false;

    if (_this.onDragEnd) _this.onDragEnd(_this.object3D);
  }

  this.getIntersectOnObject = function (object3D, camera, mousePosition) {
    let intersect;

    if (!camera) camera = this.camera;
    if (!mousePosition) mousePosition = this.mousePosition;

    if (camera) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mousePosition, camera);
      raycaster.layers.mask = object3D.layers.mask;
      intersect = raycaster.intersectObject(object3D, true)[0];
    }

    return intersect;
  };

  function onPressDown() {
    pressDownTime = new Date().getTime();
    pressPosition = _this.mousePosition;

    if (clickTimeout) {
      _this.dblclick();

      clearTimeout(clickTimeout);
      clickTimeout = null;

      isDoublePressed = true;
    }

    _this.isPressDown = true;

    _this.press(true);

    document.body.click();
  }

  function onPressUp(domEvent) {
    const moveThreshold = domEvent.type === 'touchend'
      ? EventListener.touchMoveThreshold : EventListener.mouseMoveThreshold;
    const isMoved = pressPosition
            && _this.mousePosition.distanceTo(pressPosition) > moveThreshold;

    if (!isDoublePressed && _this.isPressDown && !isMoved) {
      if (_this.getActionIncludesParent('ondblclick')) {
        clickTimeout = setTimeout(() => {
          clickTimeout = null;
          _this.click();
        }, EventListener.doubleClickInterval);
      } else {
        _this.click(domEvent.button);
      }
    }

    _this.isPressDown = false;

    _this.press(false);

    isDoublePressed = false;
  }

  this.press = function (state) {
    this.onPress && this.onPress(this.object3D, state, this.intersect);
  };

  // 如果自己没有对应事件，则去parent里找
  this.invokeAction = function (eventName, ...params) {
    const action = this.getActionIncludesParent(eventName);
    if (action) action(this.object3D, ...params);
  };

  this.getActionIncludesParent = function (eventName) {
    return this[eventName] ?? EventListener.getEvent(this.object3D.parent)?.getActionIncludesParent(eventName);
  };

  this.click = function (mouseButtonType) {
    this.intersect.mouseButtonType = mouseButtonType;
    this.invokeAction('onclick', this.intersect);
    // console.log("click: ", this, this.mousePosition);
  };

  this.dblclick = function () {
    this.invokeAction('ondblclick', this.intersect);
  };

  this.hasMoveEvent = function () {
    return !!_this.onHover || !!_this.onMouseout || !!_this.onMouseMove || !!_this.onPointMove;
  };

  this.hasDragEvent = function () {
    return !!_this.onDrag || !!_this.onDragStart || !!_this.onDragEnd;
  };

  this.hasPressEvent = function () {
    return !!_this.onPress || !!_this.onclick || !!_this.ondblclick;
  };
}

function EventListener() {
}

THREE.Object3D.prototype.ignoreEvent = false;

EventListener.events = [];
EventListener.changeCamera = false;

EventListener.doubleClickInterval = 150;
EventListener.touchMoveThreshold = 0.01;
EventListener.mouseMoveThreshold = 0.005;

EventListener.vrEnabled = false;
EventListener.lastGroupIndex = null;

EventListener.listen = function (domElement) {
  const raycaster = new THREE.Raycaster();
  let vrGazeTimer = null;
  let previousKFEvent = null;

  if (domElement.attachEvent) {
    domElement.attachEvent('touchstart', eventHandler, false);
    domElement.attachEvent('touchend', eventHandler, false);
    domElement.attachEvent('touchmove', eventHandler, false);
    domElement.attachEvent('mousedown', eventHandler, false);
    domElement.attachEvent('mouseup', eventHandler, false);
    domElement.attachEvent('mousemove', eventHandler, false);
  } else {
    domElement.addEventListener('touchstart', eventHandler, false);
    domElement.addEventListener('touchend', eventHandler, false);
    domElement.addEventListener('touchmove', eventHandler, false);
    domElement.addEventListener('mousedown', eventHandler, false);
    domElement.addEventListener('mouseup', eventHandler, false);
    domElement.addEventListener('mousemove', eventHandler, false);
  }

  update();

  function detectKFEvent() {
    if (EventListener.vrEnabled) {
      processKFEvent();
    } else {
      previousKFEvent = null;

      if (vrGazeTimer !== null) {
        clearTimeout(vrGazeTimer);
        vrGazeTimer = null;
      }
    }
  }

  function update() {
    checkEvents();
    detectKFEvent();

    requestAnimationFrame(update);
  }

  function checkEvents() {
    if (!EventListener.events) {
      return;
    }

    for (let i = EventListener.events.length - 1; i >= 0; i--) {
      const event = EventListener.events[i];

      if (!event.object3D || !event.object3D.parent) {
        EventListener.events.splice(i, 1);
      }
    }
  }

  function processKFEvent() {
    const firstIntersectEvent = getFirstIntersectEvent(null, raycaster, true);

    if (previousKFEvent !== firstIntersectEvent) {
      clearTimeout(vrGazeTimer);

      if (firstIntersectEvent !== null) {
        vrGazeTimer = setTimeout(() => {
          if (firstIntersectEvent.onclick) firstIntersectEvent.onclick(firstIntersectEvent.object3D, firstIntersectEvent.intersect);
        }, 1500); // VRParams.gazeTime);
      }
    }

    previousKFEvent = firstIntersectEvent;
  }

  function processMouseHoverEvent(domEvent, kfEvent) {
    if (domEvent.type !== 'mousemove') {
      return;
    }

    let groupIndex = null;
    if (kfEvent && kfEvent.object3D.geometry && kfEvent.object3D.geometry.type === 'BufferGeometry') {
      let index = 0;
      const indices = kfEvent.object3D.geometry.index;
      const { face } = kfEvent.intersect;
      if (!face) return; // 点和线没有face

      for (let i = 0; i < indices.count; i += 3) {
        if (indices.array[i] === face.a
                    && indices.array[i + 1] === face.b
                    && indices.array[i + 2] === face.c) {
          index = i;
          break;
        }
      }
      kfEvent.object3D.geometry.groups.forEach((group, i) => {
        if (index >= group.start && index < group.start + group.count) groupIndex = i;
      });
    }

    EventListener.events.forEach((event) => {
      if (event !== kfEvent && event.isMouseIn) {
        event.isMouseIn = false;
        if (event.onHover) event.onHover(event.object3D, false, event, groupIndex);
        if (event.onMouseout) event.onMouseout(event.object3D, true);
        EventListener.lastGroupIndex = groupIndex;
      }

      event.onPointMove && event.onPointMove(event.object3D, event);
    });

    if (kfEvent && !kfEvent.isMouseIn) {
      kfEvent.isMouseIn = true;
      if (kfEvent.onHover) kfEvent.onHover(kfEvent.object3D, true, kfEvent, groupIndex);

      EventListener.lastGroupIndex = groupIndex;
    }

    if (kfEvent && kfEvent.isMouseIn && EventListener.lastGroupIndex !== null && EventListener.lastGroupIndex !== groupIndex) {
      if (kfEvent.onHover) {
        kfEvent.onHover(kfEvent.object3D, false, kfEvent, EventListener.lastGroupIndex);
        kfEvent.onHover(kfEvent.object3D, true, kfEvent, groupIndex);
      }
      EventListener.lastGroupIndex = groupIndex;
    }
  }

  function processPressUpEvent(domEvent, event) {
    if (!event) {
      return;
    }

    if (domEvent.type === 'touchend' || domEvent.type === 'mouseup') {
      event.enabled && event.processPressUpEvent(domEvent, domElement);
    }
  }

  function processDragEvent(domEvent, firstIntersectEvent) {
    EventListener.events.forEach((event) => {
      event.enabled && event.processDragEvent(domEvent, domElement, firstIntersectEvent);
    });
  }

  function eventHandler(domEvent) {
    // console.time("eventHandler");

    const firstIntersectEvent = getFirstIntersectEvent(domEvent, raycaster);
    firstIntersectEvent?.processEvent(domEvent, raycaster, domElement);

    processPressUpEvent(domEvent, firstIntersectEvent);
    processMouseHoverEvent(domEvent, firstIntersectEvent);
    processDragEvent(domEvent, firstIntersectEvent);

    // console.timeEnd("eventHandler");
  }

  function getValidObjects(domEvent) {
    const isPointMove = domEvent ? domEvent.type === 'mousemove' || domEvent.type === 'touchmove' : false;

    return EventListener.events.flatMap((event) => {
      let isValidEvent = event.enabled && event.object3D && event.object3D instanceof THREE.Object3D;
      const isDetectMove = event.hasMoveEvent() || (event.hasDragEvent() && event.isPressDown);
      const isDetectPress = event.hasPressEvent() || event.hasDragEvent();
      isValidEvent = isValidEvent && (isPointMove ? isDetectMove : isDetectPress);

      const objects = !isValidEvent ? [] : [event.object3D, ...event.object3D.getChildren(true)];
      return objects.filter((object3D) => !object3D.ignoreEvent);
    });
  }

  // 需要先给camera设置正确的renderOrder, 越小越先渲染，优先获取event
  function getValidCameraInfos(object3D, domEvent, domElement, isInVRMode) {
    const allCameras = object3D.getRoot().getChildren(true)
      .filter((object) => object.type.indexOf('Camera') !== -1 && object.isVisible())
      .sort((a, b) => a.renderOrder - b.renderOrder);

    if (allCameras.length === 0) {
      return [];
    }

    let validCameraInfos = [];

    for (const camera of allCameras) {
      const mousePosition = isInVRMode ? new THREE.Vector2() : EventListener.getMousePosition(camera, domEvent, domElement);
      const isValidMousePosition = mousePosition.x >= -1 && mousePosition.x <= 1
                && mousePosition.y >= -1 && mousePosition.y <= 1;

      if (isValidMousePosition) {
        validCameraInfos.push({ camera, mousePosition });
      }
    }

    // Shirlman: 如果renderOrder相同，则都采用
    const validRenderOrder = validCameraInfos[0].camera.renderOrder;
    validCameraInfos = validCameraInfos.filter((info) => info.camera.renderOrder === validRenderOrder);

    return validCameraInfos;
  }

  function getFirstIntersectEvent(domEvent, raycaster, isInVRMode) {
    // console.time("getFirstIntersectEvent");

    const objects = getValidObjects(domEvent);

    // console.log("getValidObjects", objects.length);

    if (objects.length <= 0) {
      return;
    }

    // let cameraInfos = getValidCameraInfos(objects[0], domEvent, domElement, isInVRMode);
    // let tempObj = objects.find(item => item.type === 'Group');
    // cameraInfos = getValidCameraInfos(tempObj, domEvent, domElement, isInVRMode);*/

    let cameraInfos;
    const tempObjArr = objects.filter((item) => item.type === 'Group');
    for (const tempObj of tempObjArr) {
      cameraInfos = getValidCameraInfos(tempObj, domEvent, domElement, isInVRMode);
      if (cameraInfos.length !== 0) {
        break;
      }
    }
    if (cameraInfos.length === 0) {
      return;
    }

    const intersects = [];

    cameraInfos.forEach((cameraInfo) => {
      const validObjects = objects.filter((object) => object.isVisible(cameraInfo.camera.layers));

      raycaster.setFromCamera(cameraInfo.mousePosition, cameraInfo.camera);
      raycaster.layers.mask = cameraInfo.camera.layers.mask;

      intersects.push(...raycaster.intersectObjects(validObjects));

      EventListener.events
        .filter((event) => event.object3D?.layers.test(cameraInfo.camera.layers))
        .forEach((event, index) => {
          event.intersect = undefined;
          event.mousePosition = cameraInfo.mousePosition;
          event.domEvent = domEvent;
          event.camera = cameraInfo.camera;
        });
    });

    intersects.sort(intersectOrderSort);

    if (intersects.length <= 0) {
      return;
    }

    const firstEvent = EventListener.getEvent(intersects[0].object);

    if (!firstEvent) {
      return;
    }

    firstEvent.intersect = intersects[0];

    return firstEvent;
  }

  function intersectOrderSort(a, b) {
    const eventOrderDiff = (b.object.eventOrder ? b.object.eventOrder : 0) - (a.object.eventOrder ? a.object.eventOrder : 0);
    const maskDiff = b.object.layers.mask - a.object.layers.mask;
    const renderOrderDiff = b.object.renderOrder - a.object.renderOrder;
    const distanceDiff = a.distance - b.distance;

    return eventOrderDiff !== 0 ? eventOrderDiff
      : maskDiff !== 0
        ? maskDiff : (renderOrderDiff !== 0)
          ? renderOrderDiff : distanceDiff;
  }
};

// should be between -1 and 1
EventListener.getMousePosition = function (camera, domEvent, domElement) {
  let x = 0; let
    y = 0;

  if (domEvent.type === 'touchstart' || domEvent.type === 'touchmove') {
    x = domEvent.touches[0].pageX;
    y = domEvent.touches[0].pageY;
  } else if (domEvent.type === 'touchend') {
    x = domEvent.changedTouches[0].pageX;
    y = domEvent.changedTouches[0].pageY;
  } else {
    x = domEvent.clientX;
    y = domEvent.clientY;
  }

  if (domElement && domElement.viewPort) {
    const viewport = domElement.viewPort;
    x = (x - viewport.left) / viewport.width;
    y = (y - viewport.top) / viewport.height;
  } else if (camera && camera.viewPort) {
    const left = camera.viewPort.left / domElement.clientWidth;
    const top = camera.viewPort.top / domElement.clientHeight;
    const width = camera.viewPort.width / domElement.clientWidth;
    const height = camera.viewPort.height / domElement.clientHeight;

    x = (x - left) / width;
    y = (y - top) / height;
  } else {
    x /= domElement.clientWidth;
    y /= domElement.clientHeight;
    let {
      left, top, width, height,
    } = domElement.getBoundingClientRect();

    left /= domElement.clientWidth;
    top /= domElement.clientHeight;
    width /= domElement.clientWidth;
    height /= domElement.clientHeight;

    x = (x - left) / width;
    y = (y - top) / height;
  }

  const position = new THREE.Vector2();
  position.x = x * 2 - 1;
  position.y = -y * 2 + 1;

  return position;
};

EventListener.get = function (object3D) {
  if (!object3D) {
    return;
  }

  let event = EventListener.getEvent(object3D, false);

  if (!event) {
    event = new KFEvent();
    event.object3D = object3D;
    EventListener.events.push(event);
  }

  return event;
};

EventListener.remove = function (object3D) {
  if (!object3D) {
    return;
  }

  for (let i = 0; i < EventListener.events.length; i++) {
    if (EventListener.events[i].object3D === object3D) {
      EventListener.events.splice(i, 1);

      return;
    }
  }
};

EventListener.getEvent = function (object3D, searchParent = true) {
  const event = EventListener.events.find((event) => event.object3D === object3D);

  if (event) {
    return event;
  } if (searchParent && object3D && object3D.parent) {
    return EventListener.getEvent(object3D.parent, searchParent);
  }
};

export { EventListener };
