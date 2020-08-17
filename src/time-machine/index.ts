import { requestAnimationFrame, cancelAnimationFrame } from '../lib/raf'
import { nextTick } from '../lib/utils'
import { TFunc } from '../@interface/common.i'
interface ITimeMachineOpts {
  loop?: boolean
  duration: number
  delay?: number
}
interface ITimeMachineFuncItem {
  func: TFunc
  duration: number
  delay: number
  loop: boolean
  execTime: number
}
interface ITimeMachineFuncParam {
  percent: number
}
type ITimeMachineFunc = (params: ITimeMachineFuncParam) => any
enum TIME_MACHINE_STATE {
  start = 'start',
  stop = 'stop'
}
class TimeMachine {
  private _funcList: ITimeMachineFuncItem[] = []
  private _state: TIME_MACHINE_STATE = TIME_MACHINE_STATE.stop
  private _completeHandles: TFunc[] = []
  exec(func: ITimeMachineFunc, options: ITimeMachineOpts) {
    const {
      duration = 0,
      delay = 0,
      loop = false
    } = options
    this._funcList.push({
      func,
      duration,
      delay,
      loop,
      execTime: 0
    })
    if (this._state === TIME_MACHINE_STATE.start) {
      return
    }
    this._state = TIME_MACHINE_STATE.start
    nextTick(() => {
      this._actuator()
    });
  }
  onComplete(func: TFunc) {
    this._completeHandles.push(func)
  }
  reset() {
    this._state = TIME_MACHINE_STATE.stop
  }
  private _actuator = (lastTime = Date.now(), execTime = 0) => {    
    requestAnimationFrame(() => {
      const nowTime = Date.now()
      const timeGap = nowTime - lastTime
      const newExecTime = execTime + timeGap
      this._funcList = this._funcList.filter(funcItem => {
        if (newExecTime <= funcItem.duration || funcItem.loop) {
          const func = funcItem.func
          func({
            percent: newExecTime % funcItem.duration / funcItem.duration
          })
          funcItem.execTime = newExecTime % funcItem.duration
          return true;          
        } else {
          return false
        }
      })
      if (this._funcList.length === 0) {
        // 已经执行完毕
        this.reset()
        this._batchTriggerCompleteHandle()
      } else {
        this._actuator(nowTime, newExecTime)
      }
    })
  }
  private _batchTriggerCompleteHandle() {
    this._completeHandles.forEach(completeHandle => {
      completeHandle()
    })
  }
}

export default new TimeMachine()