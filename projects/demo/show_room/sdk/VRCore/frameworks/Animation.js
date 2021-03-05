/**
 *Project name: VRHouseWeb
 *File name: Animation
 *Created by Shirlman on 2017/8/31
 *Copyright 2016年 - 2018年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */

export class Animation {
    constructor(params, duration = 0) { // 0: 无限循环
        this.isPlaying = false;
        this.animationFrame = null;
        this.progress = 0;
        this.promiseResolve = undefined;

        this.params = params;
        this.duration = duration; // ms

        this.play = this.play.bind(this);
    }

    onStart(params) {
    }

    onUpdate(params, progress) {
    }

    onPostUpdate(params, progress) {
    }

    onFinish(params, isCompleted) {
    }

    async playAsync(params) {
        return await new Promise(resolve => {
            this.promiseResolve = resolve;
            this.play(params);
        });
    }

    play(params) {
        this.params = Object.assign(this.params, params);

        let _this = this;
        _this.isPlaying = true;
        let startTime = new Date().getTime();

        function innerLoop() {
            if (!_this.isPlaying) {
                return;
            }

            let progress = 0;

            if (_this.duration > 0) {
                progress = (new Date().getTime() - startTime) / _this.duration;
            }

            if (progress >= 1) {
                progress = 1;
                _this.progress = progress;
                _this.onUpdate(_this.params, progress);
                _this.onPostUpdate(_this.params, progress);
                _this.stop();
            } else {
                if (progress === 0) {
                    _this.onStart(_this.params);
                }

                _this.progress = progress;
                _this.onUpdate(_this.params, progress);
                _this.onPostUpdate(_this.params, progress);

                _this.animationFrame = requestAnimationFrame(function () {
                    innerLoop();
                });
            }
        }

        innerLoop();

        return this;
    };

    stop() {
        const isCompleted = this.progress >= 1;

        if (!this.isPlaying) {
            return isCompleted;
        }

        this.isPlaying = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }

        this.onFinish(this.params, isCompleted);

        if (this.promiseResolve) {
            this.promiseResolve({params: this.params, isCompleted});
            this.promiseResolve = undefined;
        }

        return isCompleted;
    };
}

