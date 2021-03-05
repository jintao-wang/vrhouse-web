import {VRCore} from "../../app/VRCore";

export const Add2DEditorListener = ({
                                        showRoom2D,
                                        edit,
                                        onDbClick,
                                    }) => {
    const dbClickPlan = (obj, intersect) => {
        onDbClick();
    }
    const hoverPlan = (object3D, state, kfEvent, groupIndex) => {
        if(edit) {
            document.body.style.cursor='pointer';
        }
    }
    const mouseoutPlan = (object3D, state) => {
        document.body.style.cursor='default';
    }

    VRCore.EventListener.get(showRoom2D).ondblclick = dbClickPlan;
    VRCore.EventListener.get(showRoom2D).onHover = hoverPlan;
    VRCore.EventListener.get(showRoom2D).onMouseout = mouseoutPlan;
}

export const AddEditorPointsListener = ({
    ground,
    editorPointsObj,
    newPoints,
    onReDrawStart,
    onCornerStartDraw,
    onSlideStartDraw,
    onReDraw,
    onResize,
    onReDrawEnd,
}) => {
    let editing = false;
    const hoverPoint = (object3D, state, kfEvent, groupIndex, pointKey) => {
        if(!state) {
            document.body.style.cursor='default';
            return;
        }
        switch (pointKey) {
            case 'leftTop':
                document.body.style.cursor='all-scroll';
                break;
            case 'top':
                document.body.style.cursor='row-resize';
                break;
            case 'rightTop':
                document.body.style.cursor='all-scroll';
                break;
            case 'right':
                document.body.style.cursor='col-resize';
                break;
            case 'rightBottom':
                document.body.style.cursor='all-scroll';
                break;
            case 'bottom':
                document.body.style.cursor='row-resize';
                break;
            case 'leftBottom':
                document.body.style.cursor='all-scroll';
                break;
            case 'left':
                document.body.style.cursor='col-resize';
                break;
            default:
                document.body.style.cursor='default';
        }
    }

    const reDrawStartHandler = (obj, pointKey) => {
        VRCore.AppEvents.Common.dragStart.dispatch(obj);
        onReDrawStart();
        editing = true;
        switch (pointKey) {
            case 'leftTop':
                onCornerStartDraw(obj, newPoints.startPoint);
                break;
            case 'rightTop':
                onCornerStartDraw(obj, newPoints.startPoint);
                break;
            case 'rightBottom':
                onCornerStartDraw(obj, newPoints.startPoint);
                break;
            case 'leftBottom':
                onCornerStartDraw(obj, newPoints.startPoint);
                break;
            case 'top':
                onSlideStartDraw();
                break;
            case 'left':
                onSlideStartDraw();
                break;
            case 'bottom':
                onSlideStartDraw();
                break;
            case 'right':
                onSlideStartDraw();
                break;
        }
    }

    const reDrawingHandler = (object3D, deltaPosition, currentPosition, kfEvent, pointKey) => {
        if(!editing) return
        switch (pointKey) {
            case 'leftTop':
                onReDraw(object3D, currentPosition, pointKey);
                break;
            case 'rightTop':
                onReDraw(object3D, currentPosition, pointKey);
                break;
            case 'rightBottom':
                onReDraw(object3D, currentPosition, pointKey);
                break;
            case 'leftBottom':
                onReDraw(object3D, currentPosition, pointKey);
                break;
            case 'top':
                onResize(pointKey, deltaPosition)
                break;
            case 'left':
                onResize(pointKey, deltaPosition)
                break;
            case 'bottom':
                onResize(pointKey, deltaPosition)
                break;
            case 'right':
                onResize(pointKey, deltaPosition)
                break;
        }
    }

    const reDrawEndHandler = (obj, pointKey) => {
        if( !editing) return;
        VRCore.AppEvents.Common.dragEnd.dispatch(obj);
        onReDrawEnd();
        editing = false;
        console.log('结束重新绘制',1, pointKey)
    }

    for(let [key, point] of Object.entries(editorPointsObj)) {
        VRCore.EventListener.get(point).onHover = (object3D, state, kfEvent, groupIndex) => hoverPoint(object3D, state, kfEvent, groupIndex, key);
        VRCore.EventListener.get(point).dragOnObject(ground);
        VRCore.EventListener.get(point).onDragStart = (obj) => reDrawStartHandler(obj, key);
        VRCore.EventListener.get(point).onDrag = (object3D, deltaPosition, currentPosition, kfEvent) => reDrawingHandler(object3D, deltaPosition, currentPosition, kfEvent, key);
        VRCore.EventListener.get(point).onDragEnd = (obj) => reDrawEndHandler(obj, key);
    }
}
