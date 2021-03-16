import TWEEN from 'tween';

export class AnimationControls {
    // 缓动方式:
    // In：从0开始加速的缓动
    // Out：减速到0的缓动
    // InOut：前半段从0开始加速，后半段减速到0的缓动
    easingList = {
      Linear: TWEEN.Easing.Linear, // 线性匀速运动效果
      Quadratic: TWEEN.Easing.Quadratic, // 二次方的缓动（t^2）
      Cubic: TWEEN.Easing.Cubic, // 三次方的缓动
      Quartic: TWEEN.Easing.Quartic, // 四次方的缓动
      Quintic: TWEEN.Easing.Quintic, // 五次方的缓动
      Sinusoidal: TWEEN.Easing.Sinusoidal, // 正弦曲线的缓动
      Exponential: TWEEN.Easing.Exponential, // 指数曲线的缓动
      Circular: TWEEN.Easing.Circular, // 圆形曲线的缓动
      Elastic: TWEEN.Easing.Elastic, // 指数衰减的正弦曲线缓动
      Back: TWEEN.Easing.Back, // 超过范围的三次方的缓动
      Bounce: TWEEN.Easing.Bounce, // 指数衰减的反弹缓动
    }

    update() {
      TWEEN.update();
    }

    transformCamera(camera, start, end, easing = 'Quartic', way = 'Out') {
      return new TWEEN.Tween(start).to(end).easing(easing === 'Linear' ? this.easingList[easing] : this.easingList[easing][way]).onUpdate(() => {
        camera.position.x = start.posX;
        camera.position.y = start.posY;
        camera.position.z = start.posZ;
        camera.rotation.x = start.rotX;
        camera.rotation.y = start.rotY;
        camera.rotation.z = start.rotZ;
      });
    }

    /**
     *
     * @param obj {THREE.Object3D}
     * @param start {THREE.Vector3}
     * @param end {THREE.Vector3}
     * @param duration {number} 动画执行时间
     * @param easing {'Linear' | 'Quadratic' | 'Cubic' | 'Quartic' | 'Quintic' | 'Sinusoidal' | 'Exponential' |
     * 'Circular' | 'Elastic' | 'Back' | 'Bounce' | 'Quintic' | 'Sinusoidal' | 'Exponential'}
     * @param way {'In' | 'Out' | 'InOut'}
     */
    moveObj(obj, start, end, duration = 1000, easing = 'Quartic', way = 'Out') {
      return new TWEEN.Tween(start).to(end, duration).easing(this.easingList[easing][easing === 'Linear' ? 'None' : way])
        .onUpdate(() => {
          obj.position.x = start.x;
          obj.position.y = start.y;
          obj.position.z = start.z;
        });
    }

    /**
     *
     * @param obj {THREE.Object3D}
     * @param start {THREE.Euler}
     * @param end
     * @param duration {number} 动画执行时间
     * @param easing {'Linear' | 'Quadratic' | 'Cubic' | 'Quartic' | 'Quintic' | 'Sinusoidal' | 'Exponential' |
     * 'Circular' | 'Elastic' | 'Back' | 'Bounce' | 'Quintic' | 'Sinusoidal' | 'Exponential'}
     * @param way {'In' | 'Out' | 'InOut'}
     */
    rotateObj(obj, start, end, duration = 1000, easing = 'Quartic', way = 'Out') {
      return new TWEEN.Tween(start).to(end, duration).easing(easing === 'Linear' ? this.easingList[easing] : this.easingList[easing][way])
        .onUpdate(() => {
          obj.rotation.y = start.y;
        }, duration);
    }
}
