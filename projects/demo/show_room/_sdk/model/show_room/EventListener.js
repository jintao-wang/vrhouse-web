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

// export const Add2DSelectListener = ({
//     showRoom2D,
//     onClick,
// }) => {
//     let keyEnter = false;
//     const clickPlan = (obj, intersect) => {
//         if(!keyEnter) return;
//         onClick();
//     }
//
//     document.addEventListener('keydown', (e) => {
//         if(e.metaKey || e.ctrlKey) {
//             keyEnter = true;
//         }
//     })
//
//     document.addEventListener('keyup', (e) => {
//         keyEnter = false;
//     })
//
//     VRCore.EventListener.get(showRoom2D).onclick = clickPlan;
// }

export const Add2dDragListener = ({
    ground,
    showRoom2D,
    wireframe2D,
    editorPointsGroup,
    onDragStart,
    onDraging,
    onDragEndPlan,
    showRoom,
}) => {
    const dragStartPlan = (object3D) => {
        if(showRoom.editoring || showRoom.selected) {
            VRCore.AppEvents.Common.dragStart.dispatch(object3D);
            onDragStart();
        }
    }

    const dragPlan = (object3D, deltaPosition, currentPosition, kfEvent) => {
        if(showRoom.editoring || showRoom.selected) {
            object3D.position.add(deltaPosition);
            wireframe2D.position.copy(object3D.position);
            editorPointsGroup.position.copy(object3D.position);
            onDraging(object3D, deltaPosition, currentPosition, kfEvent);
        }
    }

    const dragEndPlan = (object3D) => {
        if(showRoom.editoring || showRoom.selected) {
            VRCore.AppEvents.Common.dragEnd.dispatch(object3D);
            onDragEndPlan(object3D);
        }
    }

    VRCore.EventListener.get(showRoom2D).dragOnObject(ground);
    VRCore.EventListener.get(showRoom2D).onDragStart = dragStartPlan;
    VRCore.EventListener.get(showRoom2D).onDrag = dragPlan;
    VRCore.EventListener.get(showRoom2D).onDragEnd = dragEndPlan;
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

export const Add3DListener = ({
    showRoom3D,
    onDbClick,
}) => {
    const dbClick3D = (obj, intersect) => {
        onDbClick()
    }

    VRCore.EventListener.get(showRoom3D).ondblclick = dbClick3D;
}
