import { requestAnimationFrame, cancelAnimationFrame } from '../lib/raf'
import { nextTick } from '../lib/utils'
import { TFunc } from '../@interface/common.i'
import calc from '../lib/caculate'
import logger from 'src/lib/logger'
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
  percent: number
}
interface ITimeMachineFuncParam {
  duration: number
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
      execTime: 0,
      percent: 0
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
      const newExecTime = execTime + timeGap // 包含delay的执行时间
      this._funcList = this._funcList.filter(funcItem => {
        const { duration, delay, loop, percent } = funcItem
        if (newExecTime <= (duration + delay) || percent < 1 || loop) {
        // if (percent < 1 || loop) {
            // 如果还没执行完成
          const func = funcItem.func
          if (newExecTime > delay) {
            const trulyExecTime = (newExecTime - delay) // 除去delay时间，真正的执行时间
            const percent = Math.min(calc.divide(trulyExecTime, funcItem.duration), 1)
            func({
              percent,
              duration: funcItem.duration
            })              
            funcItem.percent = percent
            funcItem.execTime = trulyExecTime
          }
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