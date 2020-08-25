import List from '../lib/list'
import logger from 'src/lib/logger'
import timeMachine from '../time-machine'

enum TASK_STATE_ENUM {
  pending = 0,
  ready = 1,
  playing = 2,
  pause = 3,
  stop = 4
}
interface ITaskQueueItemValue {
  state: TASK_STATE_ENUM
  duration: number
  delay: number
  taskFuncList: ITaskQueueItemValueFunc[]
}
interface ITaskQueueItemValueFunc {
  func: TTaskFunc
  state: TASK_STATE_ENUM
}
export interface ItaskFuncParams {
  percent: number
  duration: number
}
export interface ITaskQueueItem {
  id: string,
  value: ITaskQueueItemValue
}
export type TTaskFunc = (taskParams?: ItaskFuncParams) => any
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

  registTask (taskId: string, taskFunc: TTaskFunc, duration: number, delay: number): void {
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
          duration,
          delay,
          taskFuncList: [taskItemValueFunc]
        }
      })
    }
  }
  play(): void {
    this._state = TASK_STATE_ENUM.playing
    this._runTaskQueue()
  }
  pause(): void {
    this._state = TASK_STATE_ENUM.pause
  }
  private _runTaskQueue () {
    const _taskQueueLen = this._taskQueue.length
    const taskQueueItem = this._currentTaskQueue
    const taskFuncList = taskQueueItem.value.taskFuncList
    const duration = taskQueueItem.value.duration
    const delay = taskQueueItem.value.delay
    taskQueueItem.value.state = TASK_STATE_ENUM.playing
    taskFuncList.forEach(taskFuncItem => {
      timeMachine.exec((params) => {
        taskFuncItem.func({
          percent: params.percent,
          duration: params.duration
        })
        taskFuncItem.state = TASK_STATE_ENUM.playing
      }, {
        duration,
        delay
      })
    })
    timeMachine.onComplete(() => {
      taskQueueItem.value.state = TASK_STATE_ENUM.stop
      if (this._currentTaskQueueIndex < _taskQueueLen - 1) {
        this._currentTaskQueueIndex++
        this._runTaskQueue()  
      }
    })
  }
}
