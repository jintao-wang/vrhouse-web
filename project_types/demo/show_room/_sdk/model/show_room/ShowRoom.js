import DrawElement from "../DrawElement";
import {VRCore} from "../../app/VRCore";
import {
  Add2DEditorListener,
  Add2dDragListener,
  AddEditorPointsListener,
  Add3DListener,
} from "./EventListener";
import {Fetcher} from "../../fetcher/Fetcher";

import {
  Create2DFront,
  GenerateAdvancedAlien3D,
  GenerateAdvanced3D
} from "./Model";

export default class ShowRoom extends DrawElement {
  constructor(scene, camera, ground, area, callback, fontParams, editorPointObj, showRoomGroup, onDragCallback) {
    super(scene, camera, ground);

    this.id = VRCore.Util.UUID8Bit();

    // 模型
    this.showRoom2D = null;
    this.showRoomName= null;
    this.showRoom3D = null;
    this.wireframe2D = null;
    this.editorPointsGroup = new THREE.Group();
    this.editorPointsObj = {
      leftTop: editorPointObj.clone(),
      top: editorPointObj.clone(),
      rightTop: editorPointObj.clone(),
      right: editorPointObj.clone(),
      rightBottom: editorPointObj.clone(),
      bottom: editorPointObj.clone(),
      leftBottom: editorPointObj.clone(),
      left: editorPointObj.clone(),
    };

    // 当前状态
    this.state = '2D';

    // 是否编辑状态
    this.editoring = false;

    this.nameMap = {};

    // 绘制点位
    this.originPoints = {
      startPoint: null,
      drawingPoint:  null,
      startNearPoint: null,
      drawingNearPoint: null,
    };
    this.originPointsPreCheck = {}; // 重新绘制的先重置该点位，合法的会赋值给初始点位
    this.newPoints = {};

    // 各类参数
    this.area = area;
    this.commonParams = {
      color: area.color,
    }
    // this.showRoom2DParams = showRoom2DParams;
    this._showRoom2DParams = {
      ...area.showRoom2DParams,
      width: null,
      height: null,
    };

    // this.showRoom3DParams = showRoom3DParams;
    this._showRoom3DParams = {
      ...area.showRoom3DParams,
      yDown3D: null,
      wireframe: null,
    };

    this.fontParams = fontParams;

    this.showRoomNameParams  = {
      area: area.code,
      number: area.number,
      name: area.code + (area.number < 10 ? `0${area.number}` : area.number),
    }

    // 编辑状态下绘制
    this.drawingEditor = false;

    // 是否是异形展厅
    this.alien = false;

    // 是否被选中
    this.selected = false;

    this.showRoomGroup = showRoomGroup;

    // 回调
    this.callback = callback;
    this.changeEditorModeCallback = callback.changeEditorModeCallback;
    this.changeCurrentAreaCallback = callback.changeCurrentAreaCallback;
    this.onDragCallback = onDragCallback;

    // 注册事件监听
    this.initialEventListener()
  }

  /**
   * 静态方法-获取3D绘制三角面
   */
  static getFace(points) {
    const v0 = points.startPoint.clone().sub(points.startNearPoint);
    const v1 = points.startPoint.clone().sub(points.drawingNearPoint);
    const v2 = points.drawingPoint.clone().sub(points.startNearPoint);
    const v3 = points.drawingPoint.clone().sub(points.drawingNearPoint);
    const allAngle = [v0.angleTo(v1), v0.angleTo(v2),v2.angleTo(v3), v3.angleTo(v1)];

    if(
        ((allAngle[1] + allAngle[2]).toFixed(10) === (allAngle[0] + allAngle[3]).toFixed(10))
        && (allAngle[1] + allAngle[2] < Math.PI)
        && (allAngle[0] + allAngle[3] < Math.PI)
    ) {
      return null;
    }
    if(
        ((allAngle[0] + allAngle[1]).toFixed(10) === (allAngle[2] + allAngle[3]).toFixed(10))
        && (allAngle[0] + allAngle[1] < Math.PI)
        && (allAngle[2] + allAngle[3] < Math.PI)
    ) {
      return null;
    }

    let maxAngle = 0;
    let maxIndex = null;

    allAngle.forEach((angle, index) => {
      if(angle > maxAngle) {
        maxAngle = angle;
        maxIndex = index;
      }
    })

    return {
      maxIndex,
      allAngle
    }
  }

  /**
   * 静态方法-获取两条线的交点
   */
  static lineLineIntersection(A, B, C, D) {
    // Line AB represented as a1x + b1y = c1
    const a1 = B.y - A.y;
    const b1 = A.x - B.x;
    const c1 = a1*(A.x) + b1*(A.y);

    // Line CD represented as a2x + b2y = c2
    const a2 = D.y - C.y;
    const b2 = C.x - D.x;
    const c2 = a2*(C.x)+ b2*(C.y);

    const determinant = a1*b2 - a2*b1;

    if(determinant === 0) {
      return false
    }
    const x = (b2*c1 - b1*c2)/determinant;
    const y = (a1*c2 - a2*c1)/determinant;
    return {
      x,
      y,
    }
  }

  /**
   * 静态方法-检查一个求出的交点是否在线段指定相交线段上
   */
  static checkPointInSegment(segmentPointA, segmentPointB, intersectionPoint) {
   if(
       intersectionPoint.x >= Math.min(segmentPointA.x, segmentPointB.x)
       && intersectionPoint.x <= Math.max(segmentPointA.x, segmentPointB.x)
       && intersectionPoint.y >= Math.min(segmentPointA.y, segmentPointB.y)
       && intersectionPoint.y <= Math.max(segmentPointA.y, segmentPointB.y)
   ) {
     return intersectionPoint
   }
    return false
  }

  initialEventListener() {
    this.showRoom2DListener = {
      add: (event='default', params={}) => {
        switch (event) {
          case "edit":
            return Add2DEditorListener({
              showRoom2D: this.showRoom2D,
              edit: this.editoring,
              onDbClick: () => {
                this.switchToEditor(!this.editoring);
              }
            })
          case "drag":
            return Add2dDragListener({
              ground: this.ground,
              showRoom2D: this.showRoom2D,
              wireframe2D: this.wireframe2D,
              editorPointsGroup: this.editorPointsGroup,
              showRoom: this,
              onDragStart: () => {
                this.showRoomName.dispose();
                this.onDragCallback.dragStartPlan(this);
              },
              onDraging: (object3D, deltaPosition, currentPosition, kfEvent) => {
                this.onDragCallback.dragPlan(
                    deltaPosition,
                    this,
                )

              },
              onDragEndPlan: (object3D) => {
                this.updatePoints(object3D.position.x, object3D.position.z);
                this.setShowRoom3DPosition(object3D.position.x, object3D.position.z);
                this.create2DFont(
                    this.showRoomNameParams.name,
                )
                this.onDragCallback.dragEndPlan(this);
              }
            })
          // case "select":
          //   return Add2DSelectListener({
          //     showRoom2D: this.showRoom2D,
          //     onClick: () => {
          //       this.setSelected(!this.selected)
          //     }
          //   })
          case "default":
            throw new SyntaxError("该object存在多个事件监听， 请指定具体监听的事件")
        }
      },
      remove: () => VRCore.EventListener.remove(this.showRoom2D)
    }

    // 编辑点位事件监听
    this.editorPointsListener = {
      add: () => AddEditorPointsListener({
        ground: this.ground,
        editorPointsObj: this.editorPointsObj,
        newPoints: this.newPoints,
        editing: this.editoring,
        onReDrawStart: () => {
          this.editoring = true;
          this.showRoomName.dispose();
        },
        onCornerStartDraw: (obj, point) => this.reStartDraw(obj, point),
        onSlideStartDraw: () => this.originPoints = this.newPoints,
        onReDraw: (obj, point, pointKey) => this.reDrawing(obj, point, pointKey),
        onResize: (direction, distance) => this.resizeHandle(direction, distance),
        onReDrawEnd: () => {
          this.drawingEditor = false;
          this.reFinishDraw();
          // this.generate3dWireframe();
        }
      }),
      remove: () => {
        for(let point of Object.values(this.editorPointsObj)) {
          VRCore.EventListener.remove(point)
        }
      }
    }

    // 3D模型事件监听
    this.showRoom3DListener = {
      add: () => Add3DListener({
        showRoom3D: this.showRoom3D,
        onDbClick: () => this.switchTo3DEditor(!this.editoring)
      }),
      remove: () => VRCore.EventListener.remove(this.showRoom3D)
    }
  }

  update(camera) {
    // if(this.state === '3D') {
    //   this.updatePlanName3DPosition(camera)
    // }
  }

  startDraw(obj, point) {
    this.originPoints.startPoint = point;
    this._showRoom3DParams.yDown3D = this._showRoom3DParams.yDown3D || this.originPoints.startPoint.y + 2;
    this.originPoints.startPoint.y = this._showRoom2DParams.y2D;
  }

  drawing(obj, point) {
    this.originPoints.drawingPoint = point;
    this.originPoints.drawingPoint.y = this._showRoom2DParams.y2D;
    this.originPoints.startNearPoint = new THREE.Vector3(this.originPoints.drawingPoint.x,  this._showRoom2DParams.y2D, this.originPoints.startPoint.z);
    this.originPoints.drawingNearPoint = new THREE.Vector3(this.originPoints.startPoint.x,  this._showRoom2DParams.y2D, this.originPoints.drawingPoint.z);
    this.drawPlan([this.originPoints.startPoint, this.originPoints.startNearPoint, this.originPoints.drawingPoint, this.originPoints.drawingNearPoint]);
  }

  finishDraw() {
    this.showRoom2D.geometry.computeBoundingBox();
    this._showRoom2DParams.width = this.originPoints.drawingPoint.x - this.originPoints.startPoint.x;
    this._showRoom2DParams.height = this.originPoints.startPoint.z - this.originPoints.drawingPoint.z;
    this.generateShowRoom3D();

    this.newPoints = this.originPoints;
    ShowRoom.updatePointsPosition(this.originPoints, this.editorPointsObj);

    this.originPointsPreCheck = {
      startPoint: this.originPoints.startPoint.clone(),
      startNearPoint: this.originPoints.startNearPoint.clone(),
      drawingNearPoint: this.originPoints.drawingNearPoint.clone(),
      drawingPoint: this.originPoints.drawingPoint.clone(),
    }

    this.create2DFont(
        this.showRoomNameParams.name,
        '#333333')
    this.showRoom2DListener.add('edit');
    console.log('Show Room finish draw')
  }

  reStartDraw(obj, point) {}

  reDrawing(obj, point, pointKey) {
    this.alien = true;
    let faceResult = null;
    switch (pointKey) {
      case 'leftTop':
        this.originPointsPreCheck.startPoint = point;
        this.originPointsPreCheck.startPoint.y = this._showRoom2DParams.y2D;
        faceResult = ShowRoom.getFace(this.originPointsPreCheck);
        break;
      case 'rightTop':
        this.originPointsPreCheck.startNearPoint = point;
        this.originPointsPreCheck.startNearPoint.y = this._showRoom2DParams.y2D;
        faceResult = ShowRoom.getFace(this.originPointsPreCheck);
        break;
      case 'rightBottom':
        this.originPointsPreCheck.drawingPoint = point;
        this.originPointsPreCheck.drawingPoint.y = this._showRoom2DParams.y2D;
        faceResult = ShowRoom.getFace(this.originPointsPreCheck);
        break;
      case 'leftBottom':
        this.originPointsPreCheck.drawingNearPoint = point;
        this.originPointsPreCheck.drawingNearPoint.y = this._showRoom2DParams.y2D;
        faceResult = ShowRoom.getFace(this.originPointsPreCheck);
        break;
    }

    if(faceResult !== null) {
      this.originPoints = {
        startPoint: this.originPointsPreCheck.startPoint.clone(),
        startNearPoint: this.originPointsPreCheck.startNearPoint.clone(),
        drawingNearPoint: this.originPointsPreCheck.drawingNearPoint.clone(),
        drawingPoint: this.originPointsPreCheck.drawingPoint.clone(),
      };

      this._showRoom2DParams.faceIndex = faceResult.maxIndex;
      this._showRoom2DParams.allAngle = faceResult.allAngle;
      this._showRoom3DParams.faceIndex = faceResult.maxIndex;

      this.drawPlan(
          [this.originPoints.startPoint, this.originPoints.startNearPoint, this.originPoints.drawingPoint, this.originPoints.drawingNearPoint],
      );
      ShowRoom.updateWireframe(this);
      // 存疑
      ShowRoom.updatePointsPosition(this.originPoints, this.editorPointsObj);
      this.editorPointsGroup.position.copy(this.showRoom2D.position);
    }
  }

  resizeHandle(direction, distance) {
    switch (direction) {
      case 'top':
        this.originPoints.startPoint.z = this.originPoints.startPoint.z + distance.z;
        this.originPoints.startNearPoint.z = this.originPoints.startNearPoint.z + distance.z;
        break;
      case 'left':
        this.originPoints.startPoint.x = this.originPoints.startPoint.x + distance.x;
        this.originPoints.drawingNearPoint.x = this.originPoints.drawingNearPoint.x + distance.x;
        break;
      case 'bottom':
        this.originPoints.drawingNearPoint.z = this.originPoints.drawingNearPoint.z + distance.z;
        this.originPoints.drawingPoint.z = this.originPoints.drawingPoint.z + distance.z;
        break;
      case 'right':
        this.originPoints.startNearPoint.x = this.originPoints.startNearPoint.x + distance.x;
        this.originPoints.drawingPoint.x = this.originPoints.drawingPoint.x + distance.x;
        break;
    }
    this.drawPlan([this.originPoints.startPoint, this.originPoints.startNearPoint, this.originPoints.drawingPoint, this.originPoints.drawingNearPoint]);
    ShowRoom.updateWireframe(this);
    // 存疑
    ShowRoom.updatePointsPosition(this.originPoints, this.editorPointsObj);
    this.editorPointsGroup.position.copy(this.showRoom2D.position);
  }

  // 重新绘制状态下的结束绘制
  reFinishDraw() {
    this.showRoom2D.geometry.computeBoundingBox();
    this.generateShowRoom3D();
    ShowRoom.generate3dWireframe(this._showRoom3DParams, this._showRoom2DParams, this.showRoom3D);

    this.newPoints = this.originPoints;
    ShowRoom.updatePointsPosition(this.originPoints, this.editorPointsObj);

    this.originPointsPreCheck = {
      startPoint: this.originPoints.startPoint.clone(),
      startNearPoint: this.originPoints.startNearPoint.clone(),
      drawingNearPoint: this.originPoints.drawingNearPoint.clone(),
      drawingPoint: this.originPoints.drawingPoint.clone(),
    }

    this.create2DFont(
        this.showRoomNameParams.name,
        '#333333')
    this.showRoom2DListener.add('edit')
  }

  switchTo2D() {
    super.switchTo2D();
    VRCore.EventListener.remove(this.showRoom3D);
    this.state = '2D';
    this.updatePlanNamePosition(false);
    this.showRoomGroup.remove(this.showRoom3D);
    this.showRoom2D.visible = true;
    this.switchTo3DEditor(false)
  }

  switchTo3D() {
    super.switchTo3D();
    this.showRoom3DListener.add();
    this.showRoom2D.visible = false;
    this.state = '3D';
    this.updatePlanNamePosition(true);

    this.showRoomGroup.add(this.showRoom3D);
    this.switchToEditor(false)
  }

  switchToEditor(bool) {
    super.switchToEditor();
    if(bool === this.editoring) return;
    if(bool) {
      this.changeEditorModeCallback(this, true);
      if(this.wireframe2D) {
        this.showRoomGroup.add(this.wireframe2D);
      }else {
        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(this.originPoints.startPoint);
        lineGeometry.vertices.push(this.originPoints.startNearPoint);
        lineGeometry.vertices.push(this.originPoints.drawingPoint);
        lineGeometry.vertices.push(this.originPoints.drawingNearPoint);
        lineGeometry.vertices.push(this.originPoints.startPoint);

        this.wireframe2D = new THREE.Line( lineGeometry, this._showRoom2DParams.lineMaterial );
        this.wireframe2D.computeLineDistances();
        this.showRoomGroup.add( this.wireframe2D );
      }

      Object.values(this.editorPointsObj).forEach(point => {
        this.editorPointsGroup.add(point);
      })
      this.showRoomGroup.add(this.editorPointsGroup);
      this.editorPointsGroup.position.copy(this.showRoom2D.position);

      this.editorPointsListener.add();
      this.showRoom2DListener.add('drag');
      document.body.style.cursor='pointer';
    }else {
      this.showRoomGroup.remove(this.wireframe2D);
      this.changeEditorModeCallback(this, false);
      this.editorPointsGroup.dispose();
      document.body.style.cursor='default';
    }
    this.editoring = bool
  }

  switchTo3DEditor(bool) {
    if(bool === this.editoring) return;
    if(bool) {
      this.changeEditorModeCallback(this, true);
      if(!this._showRoom3DParams.wireframe) {
        ShowRoom.generate3dWireframe(this._showRoom3DParams, this._showRoom2DParams, this.showRoom3D);
      }
      this.showRoom3D.add(this._showRoom3DParams.wireframe);
    }else {
      this.changeEditorModeCallback(this, false);
      this.showRoom3D.remove(this._showRoom3DParams.wireframe);
    }
    this.editoring = bool
  }

  // /**
  //  * 生成3D编辑网格
  //  */
  // generate3dWireframe() {
  //   this._showRoom3DParams.wireframe?.dispose();
  //   const geo = new THREE.EdgesGeometry(this.showRoom3D.geometry); // or WireframeGeometry
  //   this._showRoom3DParams.wireframe = new THREE.LineSegments(geo, this._showRoom2DParams.wireframeMaterial);
  //   this._showRoom3DParams.wireframe.computeLineDistances();
  // }

  /**
   * 静态方法 生成3D编辑网格
   */
  static generate3dWireframe(showRoom3DParam, showRoom2DParams, showRoom3D) {
    showRoom3DParam.wireframe?.dispose();
    const geo = new THREE.EdgesGeometry(showRoom3D.geometry); // or WireframeGeometry
    showRoom3DParam.wireframe = new THREE.LineSegments(geo, showRoom2DParams.wireframeMaterial);
    showRoom3DParam.wireframe.computeLineDistances();
  }

  // updateWireframe() {
  //   this.wireframe2D.dispose();
  //   const lineGeometry = new THREE.Geometry();
  //   lineGeometry.vertices.push(this.originPoints.startPoint);
  //   lineGeometry.vertices.push(this.originPoints.startNearPoint);
  //   lineGeometry.vertices.push(this.originPoints.drawingPoint);
  //   lineGeometry.vertices.push(this.originPoints.drawingNearPoint);
  //   lineGeometry.vertices.push(this.originPoints.startPoint);
  //
  //   this.wireframe2D = new THREE.Line( lineGeometry, this._showRoom2DParams.lineMaterial );
  //   this.wireframe2D.computeLineDistances();
  //   this.showRoomGroup.add( this.wireframe2D );
  // }
  /**
   * 静态方法 更新2D网格
   */
  static updateWireframe(showRoom) {
    showRoom.wireframe2D.dispose();
    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(showRoom.originPoints.startPoint);
    lineGeometry.vertices.push(showRoom.originPoints.startNearPoint);
    lineGeometry.vertices.push(showRoom.originPoints.drawingPoint);
    lineGeometry.vertices.push(showRoom.originPoints.drawingNearPoint);
    lineGeometry.vertices.push(showRoom.originPoints.startPoint);

    showRoom.wireframe2D = new THREE.Line( lineGeometry, showRoom._showRoom2DParams.lineMaterial );
    showRoom.wireframe2D.computeLineDistances();
    showRoom.showRoomGroup.add( showRoom.wireframe2D );
  }

  // updatePointsPosition(points) {
  //   // 编辑提示点设置位置
  //   const positions = {
  //     leftTop:  [points.startPoint.x, points.startPoint.y + 5, points.startPoint.z],
  //     top:  [(points.startPoint.x + points.startNearPoint.x) / 2, points.startPoint.y + 5, (points.startPoint.z + points.startNearPoint.z) / 2],
  //     rightTop: [points.startNearPoint.x, points.startPoint.y + 5, points.startNearPoint.z],
  //     right: [(points.startNearPoint.x + points.drawingPoint.x) / 2, points.startPoint.y + 5, (points.startNearPoint.z + points.drawingPoint.z) /2],
  //     rightBottom: [points.drawingPoint.x, points.startPoint.y + 5, points.drawingPoint.z],
  //     bottom: [(points.drawingPoint.x + points.drawingNearPoint.x)/2, points.startPoint.y + 5, (points.drawingPoint.z + points.drawingNearPoint.z)/2],
  //     leftBottom: [points.drawingNearPoint.x, points.startPoint.y + 5, points.drawingNearPoint.z],
  //     left: [(points.drawingNearPoint.x + points.startPoint.x)/2, points.startPoint.y + 5, (points.drawingNearPoint.z + points.startPoint.z)/2],
  //   }
  //   for(let [key, editorPoint] of Object.entries(this.editorPointsObj)) {
  //     editorPoint.position.set(...positions[key])
  //   }
  // }
  static updatePointsPosition(points, editorPointsObj) {
    // 编辑提示点设置位置
    const positions = {
      leftTop:  [points.startPoint.x, points.startPoint.y + 5, points.startPoint.z],
      top:  [(points.startPoint.x + points.startNearPoint.x) / 2, points.startPoint.y + 5, (points.startPoint.z + points.startNearPoint.z) / 2],
      rightTop: [points.startNearPoint.x, points.startPoint.y + 5, points.startNearPoint.z],
      right: [(points.startNearPoint.x + points.drawingPoint.x) / 2, points.startPoint.y + 5, (points.startNearPoint.z + points.drawingPoint.z) /2],
      rightBottom: [points.drawingPoint.x, points.startPoint.y + 5, points.drawingPoint.z],
      bottom: [(points.drawingPoint.x + points.drawingNearPoint.x)/2, points.startPoint.y + 5, (points.drawingPoint.z + points.drawingNearPoint.z)/2],
      leftBottom: [points.drawingNearPoint.x, points.startPoint.y + 5, points.drawingNearPoint.z],
      left: [(points.drawingNearPoint.x + points.startPoint.x)/2, points.startPoint.y + 5, (points.drawingNearPoint.z + points.startPoint.z)/2],
    }
    for(let [key, editorPoint] of Object.entries(editorPointsObj)) {
      editorPoint.position.set(...positions[key])
    }
  }

  drawPlan(points) {
    this.showRoom2D?.dispose();
    const geometry = new THREE.Geometry();
    geometry.vertices.push(...points);
    geometry.faces = this._showRoom2DParams.face[this._showRoom2DParams.faceIndex]; //三角面添加到几何体

    this.showRoom2D =new THREE.Mesh(geometry,this._showRoom2DParams.material2D);//网格模型对象
    this.showRoom2D.showRoomId = this.id;
    this.showRoomGroup.add(this.showRoom2D);
    // this.showRoom2DListener.add('select')
  }

  updatePoints(x,z) {
    this.newPoints = {
      startPoint: new THREE.Vector3(this.originPoints.startPoint.x + x, this.originPoints.startPoint.y, this.originPoints.startPoint.z + z,),
      startNearPoint: new THREE.Vector3(this.originPoints.startNearPoint.x + x, this.originPoints.startPoint.y, this.originPoints.startNearPoint.z + z,),
      drawingNearPoint: new THREE.Vector3(this.originPoints.drawingNearPoint.x + x, this.originPoints.startPoint.y, this.originPoints.drawingNearPoint.z + z,),
      drawingPoint: new THREE.Vector3(this.originPoints.drawingPoint.x + x, this.originPoints.startPoint.y, this.originPoints.drawingPoint.z + z,),
    }
    this.originPointsPreCheck = {
      startPoint: this.newPoints.startPoint.clone(),
      startNearPoint: this.newPoints.startNearPoint.clone(),
      drawingNearPoint: this.newPoints.drawingNearPoint.clone(),
      drawingPoint: this.newPoints.drawingPoint.clone(),
    }
  }

  generateShowRoom3D() {
    this.showRoom3D = GenerateAdvancedAlien3D({
      showRoom3D: this.showRoom3D,
      _showRoom3DParams: this._showRoom3DParams,
      originPoints: this.originPoints,
    })
  }

  setShowRoom3DPosition(x,z) {
    this._showRoom3DParams.position = [
      x,
      0,
      z,
    ]
    this.showRoom3D.position.set (...this._showRoom3DParams.position);
    this.showRoom3D.renderOrder = 1;
  }

  create2DFont = (text) => {
    this.showRoomName?.dispose();
    const position = []
    const faceIndex = this._showRoom2DParams.faceIndex;
    const pointMap = [this.newPoints.startPoint, this.newPoints.startNearPoint, this.newPoints.drawingPoint, this.newPoints.drawingNearPoint]

    if(!this._showRoom2DParams.allAngle) {
      position.push(
          (pointMap[0].x +  pointMap[2].x) / 2,
          this.newPoints.drawingPoint.y + 1,
          (pointMap[0].z +  pointMap[2].z) / 2 + 25,
      )
    }else {
      const angle = this._showRoom2DParams.allAngle[(faceIndex + 1) % 4] + this._showRoom2DParams.allAngle[(faceIndex + 2) % 4] + this._showRoom2DParams.allAngle[(this._showRoom2DParams.faceIndex - 1 + 4) % 4];
      if(angle >= Math.PI) {
        position.push(
            (pointMap[faceIndex].x +  pointMap[(faceIndex + 2) % 4].x) / 2,
            this.newPoints.drawingPoint.y + 1,
            (pointMap[faceIndex].z +  pointMap[(faceIndex + 2) % 4].z) / 2 + 25,
        )
      }else {
        const v1 = new THREE.Vector3(
            pointMap[(this._showRoom2DParams.faceIndex + 1) % 4].x - pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].x,
            0,
            pointMap[(this._showRoom2DParams.faceIndex + 1) % 4].z - pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].z,
        );
        const v2 = new THREE.Vector3(
            pointMap[(this._showRoom2DParams.faceIndex - 1 + 4) % 4].x - pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].x,
            0,
            pointMap[(this._showRoom2DParams.faceIndex - 1 + 4) % 4].z - pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].z,
        );
        const normalize1 = v1.normalize();
        const normalize3 = v2.normalize();

        const point1 = ShowRoom.lineLineIntersection(
            {
              x: pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].x,
              y: pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].z,
            },
            {
              x: pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].x + (normalize1.x + normalize3.x) / 2,
              y:  pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].z + (normalize1.z + normalize3.z) / 2,
            },
            {
              x: pointMap[this._showRoom2DParams.faceIndex].x,
              y: pointMap[this._showRoom2DParams.faceIndex].z,
            },
            {
              x: pointMap[(this._showRoom2DParams.faceIndex - 1 + 4) % 4].x,
              y: pointMap[(this._showRoom2DParams.faceIndex - 1 + 4) % 4].z,
            }
        )

        const point2 = ShowRoom.lineLineIntersection(
            {
              x: pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].x,
              y: pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].z,
            },
            {
              x: pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].x + (normalize1.x + normalize3.x) / 2,
              y:  pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].z + (normalize1.z + normalize3.z) / 2,
            },
            {
              x: pointMap[this._showRoom2DParams.faceIndex].x,
              y: pointMap[this._showRoom2DParams.faceIndex].z,
            },
            {
              x: pointMap[(this._showRoom2DParams.faceIndex + 1) % 4].x,
              y: pointMap[(this._showRoom2DParams.faceIndex + 1) % 4].z,
            }
        )

        const point1Check = ShowRoom.checkPointInSegment(
            {
              x: pointMap[this._showRoom2DParams.faceIndex].x,
              y: pointMap[this._showRoom2DParams.faceIndex].z,
            },
            {
              x: pointMap[(this._showRoom2DParams.faceIndex - 1 + 4) % 4].x,
              y: pointMap[(this._showRoom2DParams.faceIndex - 1 + 4) % 4].z,
            },
            point1
        )
        const point2Check = ShowRoom.checkPointInSegment(
            {
              x: pointMap[this._showRoom2DParams.faceIndex].x,
              y: pointMap[this._showRoom2DParams.faceIndex].z,
            },
            {
              x: pointMap[(this._showRoom2DParams.faceIndex + 1) % 4].x,
              y: pointMap[(this._showRoom2DParams.faceIndex + 1) % 4].z,
            },
            point2
        )

        const pointResult = point1Check || point2Check;
        position.push(
            (pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].x +  pointResult.x) / 2,
            this.newPoints.drawingPoint.y + 1,
            (pointMap[(this._showRoom2DParams.faceIndex + 2) % 4].z +  pointResult.y) / 2 + 25,
        )
      }
    }


    const shapes = this.fontParams.font.generateShapes( text, 50 );
    const geometry = new THREE.ShapeGeometry( shapes );
    geometry.computeBoundingBox();
    const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    geometry.translate( xMid, 0, 0 );
    this.showRoomName = new THREE.Mesh( geometry, this.fontParams.material);
    this.showRoomName.renderOrder = 1;
    const qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0));
    this.showRoomName.rotation.setFromQuaternion(qua);
    this.showRoomName.position.set(...position);
    scene.add(this.showRoomName)
  }

  updatePlanName3DPosition(camera) {
    const cameraVector = new THREE.Vector3(camera.position.x, 0, camera.position.z).normalize ();
    const qua = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), cameraVector);
    this.showRoomName.rotation.setFromQuaternion(qua);
  }

  updatePlanNamePosition(to3D) {
    if(to3D) {
       this.showRoomName.position.set(
           this.showRoomName.position.x,
           this._showRoom3DParams.yDown3D + this._showRoom3DParams.height + 1,
           this.showRoomName.position.z,
      );
    }else {
      this.showRoomName.position.set(
          this.showRoomName.position.x,
          this.newPoints.startPoint.y + 1,
          this.showRoomName.position.z,
      );
    }

  }

  getArea() {
    return this.showRoomNameParams.area
  }

  setArea(val) {
    if(!val) return
    this.showRoomNameParams.area = val;
    this.showRoomNameParams.name = val + (this.showRoomNameParams.number < 10 ? `0${this.showRoomNameParams.number}` : this.showRoomNameParams.number);
    this.create2DFont(
      this.showRoomNameParams.name,
      '#333333',
    )
    this.updatePlanNamePosition(this.state === '3D')
  }

  getNumber() {
    return this.showRoomNameParams.number
  }

  setNumber(val) {
    if(!val) return
    this.showRoomNameParams.number = parseInt(val);
    this.showRoomNameParams.name = this.showRoomNameParams.area + (val< 10 ? `0${val}` : val);
    this.create2DFont(
      this.showRoomNameParams.name,
      '#333333',
    )
    this.updatePlanNamePosition(this.state === '3D')
  }

  getHeight() {
    return this._showRoom3DParams.height
  }

  setHeight(val) {
    if(!val) return;
    VRCore.EventListener.remove(this.showRoom3D);
    this._showRoom3DParams.height = parseInt(val);
    this.generateShowRoom3D();
    ShowRoom.generate3dWireframe(this._showRoom3DParams, this._showRoom2DParams, this.showRoom3D);
    if(this.state === '3D') {
      this.showRoom3D.add(this._showRoom3DParams.wireframe);
      this.showRoomGroup.add(this.showRoom3D);
      this.updatePlanNamePosition(true)
    }
    this.showRoom3DListener.add();
  }

  getColor() {
    return this.commonParams.color
  }

  setColor(val) {
    this.commonParams.color = val;
    const material2DClone = this.showRoom2D.material.clone();
    material2DClone.color.set(val);
    this.showRoom2D.material = material2DClone;

    const material3DClone = this.showRoom3D.material.clone();
    material3DClone.color.set(val);
    this.showRoom3D.material = material3DClone;

    this._showRoom2DParams.material2D = material2DClone;
    this._showRoom3DParams.material3dAlien = material3DClone;
  }

  getAreaObj() {
    return this.area;
  }

  setAreaObj(area) {
    this.area = area;
    this.commonParams.color = area.color;
    this.showRoom2D.material = area.showRoom2DParams.material2D;
    this.showRoom3D.material = area.showRoom3DParams.material3dAlien;
  }

  dispose() {
    if (!this.editoring) return;
    this.showRoom2D.dispose();
    this.showRoomName.dispose();
    this.showRoom3D.dispose();
    this.wireframe2D.dispose();
    this.editorPointsGroup.dispose();
  }

  getSelected() {
    return this.selected;
  }

  setSelected(selected) {
    if(selected && !this.selected) {
      this.selected = true;
      // this.showRoomName.material = this.fontParams.selectMaterial;
      if(this.wireframe2D) {
        this.showRoomGroup.add(this.wireframe2D);
      }else {
        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(this.originPoints.startPoint);
        lineGeometry.vertices.push(this.originPoints.startNearPoint);
        lineGeometry.vertices.push(this.originPoints.drawingPoint);
        lineGeometry.vertices.push(this.originPoints.drawingNearPoint);
        lineGeometry.vertices.push(this.originPoints.startPoint);

        this.wireframe2D = new THREE.Line( lineGeometry, this._showRoom2DParams.lineMaterial );
        this.wireframe2D.computeLineDistances();
        this.showRoomGroup.add( this.wireframe2D );
      }
    }else if(!selected && this.selected) {
      this.selected = false;
      // this.showRoomName.material = this.fontParams.material;
      this.showRoomGroup.remove(this.wireframe2D);
    }
  }

  dragStartPlan() {
    this.showRoomName.dispose();
  }

  dragPlan(deltaPosition) {
    this.showRoom2D.position.add(deltaPosition);
    this.wireframe2D.position.copy(this.showRoom2D.position);
  }

  dragEndPlan() {
    this.updatePoints(this.showRoom2D.position.x, this.showRoom2D.position.z);
    this.setShowRoom3DPosition(this.showRoom2D.position.x, this.showRoom2D.position.z);
    this.create2DFont(
        this.showRoomNameParams.name,
    )
  }

}

