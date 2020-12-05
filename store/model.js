import { useEffect, useState } from 'react';

class Model {
  constructor({ initialState, actions }) {
    this.queue = [];
    this.state = initialState;
    this.actions = {};
    Object.keys(actions).forEach((name) => {
      this.actions[name] = (...args) => {
        this.state = actions[name].apply(this, args);
        this.onDataChange();
      };
    });
  }

  useModel() {
    const [, setState] = useState();
    // 使用useEffect实现发布订阅
    useEffect(() => {
      const index = this.queue.length;
      this.queue.push(setState); // 订阅
      return () => { // 组件销毁时取消
        this.queue.splice(index, 1);
      };
    });
    return [this.state, this.actions];
  }

  onDataChange() {
    const queues = [...this.queue];
    this.queue.length = 0;
    queues.forEach((setState) => {
      setState(this.state); // 通知所有的组件数据变化
    });
  }
}

export default Model;
