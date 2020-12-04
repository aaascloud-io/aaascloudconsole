import { Injectable } from '@angular/core';

import window from '@typings/window';


@Injectable({
  providedIn: 'root'
})
export class TimeoutService {

  /** タスクリスト(ID保管用) */
  private tasks: Task[] = [];

  public constructor() {
  }

  /**
   * タイマー設定
   * 
   * @param id 
   * @param func 
   * @param timeout 
   * @create 2020/07/03
   */
  public setTimeout(id: number, func: Function, timeout: number) {
    ///実行中のタスクをクリア
    if (id) {
      var task = this.removeTask(id);
      if (task) window.clearTimeout(id);
    }
    ///次のタスク実行
    var next = window.setTimeout(func, timeout);
    ///保存しておく
    this.tasks.push({ id: next, func: func});
    return next;
  }

  private removeTask(id: number) {
    var result = null;
    for (var i = 0; i < this.tasks.length; i++) {
      var task = this.tasks[i];
      if (task.id === id) {
        result = task;
        this.tasks.splice(i, 1);
        break;
      }
    }
    return result;
  }
}

class Task {
  public id: any;
  public func: Function;
}
