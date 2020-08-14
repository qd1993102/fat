import { IJsonObject } from '../@interface/common.i'
import { requestAnimationFrame, cancelAnimationFrame } from '../lib/raf'
import List, { IListItem } from '../lib/list'

enum TASK_STATE_ENUM {
  pending = 0,
  ready = 1,
  playing = 2,
  pause = 3,
  stop = 4
}
interface ITaskQueueItemValue {
  state: TASK_STATE_ENUM
  taskFuncList: ITaskQueueItemValueFunc[]
}
interface ITaskQueueItemValueFunc {
  func: TTaskFunc
  state: TASK_STATE_ENUM
}
export interface ITaskQueueItem {
  id: string,
  value: ITaskQueueItemValue
}
export type TTaskFunc = () => boolean
export class Task {
  private _state: TASK_STATE_ENUM
  private _taskQueue: List<ITaskQueueItem>
  private _currentTaskQueueIndex: number // 当前执行到的taskQueue游标
  private get _currentTaskQueue():ITaskQueueItem {
    return this._taskQueue.get(this._currentTaskQueueIndex);
  }
  constructor () {
    this._state = TASK_STATE_ENUM.pending
    this._taskQueue = new List([])
    this._currentTaskQueueIndex = 0
  }

  registTask (taskId: string, taskFunc: TTaskFunc) {
    const _taskQueueItem = this._taskQueue.getById(taskId)
    const taskItemValueFunc = {
      func: taskFunc,
      state: TASK_STATE_ENUM.ready
    }
    if (_taskQueueItem) {
      _taskQueueItem.value.taskFuncList.push(taskItemValueFunc)        
    } else {
      this._taskQueue.push({
        id: taskId,
        value: {
          state: TASK_STATE_ENUM.ready,
          taskFuncList: [taskItemValueFunc]
        }
      })
    }
  }
  play() {
    this._state = TASK_STATE_ENUM.playing
    this._runTaskQueue()
  }
  pause () {
    this._state = TASK_STATE_ENUM.pause
  }
  private _runTaskQueue () {
    requestAnimationFrame(() => {
      const _taskQueueLen = this._taskQueue.length
      const taskQueueItem = this._currentTaskQueue
      const taskFuncList = taskQueueItem.value.taskFuncList
      const len = taskFuncList.length
      let taskFuncListState = Number(`0x${'0'.repeat(len)}`)  
      taskFuncListState |= this._runTaskFuncList(taskFuncList);
      // 比如长度为8的步骤，状态达成 0x11111111，说明当前步骤的所有方法全部执行完成
      if (taskFuncListState === Number(`0x${'1'.repeat(len)}`)) { 
        // 执行结束
        taskQueueItem.value.state = TASK_STATE_ENUM.stop // 记录状态
        if (this._currentTaskQueueIndex >= (_taskQueueLen - 1)) {
          // taskQueue已经执行完毕，task完成
          this._state = TASK_STATE_ENUM.stop
          // cancelAnimationFrame(animId)
          // todo 发出end事件
        } else {
          // 更改游标状态，继续下一个taskQueueItem
          this._currentTaskQueueIndex++;
          this._runTaskQueue()
        }
      } else {
        // 还在执行
        taskQueueItem.value.state = TASK_STATE_ENUM.playing
        this._runTaskQueue()
      }
    })
  }
  private _runTaskFuncList(taskFuncList: ITaskQueueItemValueFunc[]): number {
    const len = taskFuncList.length
    let taskFuncListState = Number(`0x${'0'.repeat(len)}`)
    taskFuncList.forEach((taskFuncItem, index) => {
      const state = taskFuncItem.state
      if (state === TASK_STATE_ENUM.ready || state === TASK_STATE_ENUM.playing) {
        const res = taskFuncItem.func()
        if (res) {
          // 执行结束
          taskFuncItem.state = TASK_STATE_ENUM.stop
          taskFuncListState |= Number('0x' + 1 + '0'.repeat(index))
        }
      }
    })
    return taskFuncListState
  }
}
