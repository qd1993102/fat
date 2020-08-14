// import * as path from 'path';
// import utils from 'src/lib/utils';
// import { Move } from './action/move'
import { _$ } from './lib/dom'
import { Task } from './task/index'
import { IJsonObject } from './@interface/common.i'
import logger from './lib/logger'

export default {
  select <K extends keyof HTMLElementTagNameMap> (selector: K) {
    const el = _$(selector)
    return new Fat({
      el
    })
  }
}

enum FAT_STATE_ENUM {
  prepare = 'prepare',
  run = 'run',
  end = 'end'
}

enum FAT_METHOD_ENUM {
  move = 'move',
}
interface IFatOptions {
  ctx?: Fat
  el: HTMLElement
}
interface ITransAttr {
  x?: number
  y?: number
  z?: number
  opacity?: number
}
class Fat {
  private _el: HTMLElement
  private _task: Task
  private _fatState: FAT_STATE_ENUM // 当前状态
  private _currentStepId: string // 当前步骤
  private _steps: IJsonObject // 步骤列表
  private _stepDurations: IJsonObject // 每个步骤里的时间列表
  
  private _$transAttr: ITransAttr = {
    x: 0,
    y: 0,
    z: 0,
    opacity: 0
  }
  private get _transAttr() : ITransAttr {
    return this._$transAttr;
  }
  
  private set _transAttr(v : ITransAttr) {
    this._el.style.transform = `translate(${v.x || 0}px, ${v.y || 0}px, ${v.z || 0}px)`
    this._el.style.opacity = String(v.opacity || 0)
    this._$transAttr = v;
  }

  constructor (opts: IFatOptions) {
    this._el = opts.el
    this._task = new Task()
    this._fatState = FAT_STATE_ENUM.prepare
    this._steps = {}
    this._stepDurations = {}
    this._currentStepId = this._genStepId()
  }

  move (x: number, y: number) {
    if (this._fatState !== FAT_STATE_ENUM.run) {
      // 不处于运行状态，则将执行缓存
      this._steps[this._currentStepId] = this._steps[this._currentStepId] || [];
      this._steps[this._currentStepId].push({
        method: FAT_METHOD_ENUM.move,
        args: [x, y]
      });
      return this
    }
    return this
  }
  _getMoveFn(x: number, y: number, duration: number) {
    const xGap = Number(((x - this._transAttr.x) / duration).toFixed(2))
    const yGap = Number(((y - this._transAttr.y) / duration).toFixed(2))
    return () => {
      const _x = Number(this._transAttr.x) + xGap
      const _y = Number(this._transAttr.y) + yGap
      this._transAttr.x = _x
      this._transAttr.y = _y;
      logger.debug('move:', this._transAttr.x, this._transAttr.y);
      return _y >= x && _y >= y
    }
  }

  duration (duration: number) {
    this._stepDurations[this._currentStepId] = duration
    return this
  }
  then() {
    // 更改
    this._currentStepId = this._genStepId()
    return this
  }
  run () {
    const steps = this._steps
    for(const stepId in steps) {
      const steopFns = steps[stepId] // 读取缓存后的方法列表
      const duration = this._stepDurations[stepId] // 读取对应步骤下的duration
      steopFns.forEach((fnInfo: { method: any; args: string | any[] }) => {
        switch(fnInfo.method) {
          case FAT_METHOD_ENUM.move:
            const [x, y] = fnInfo.args
            const taskFn = this._getMoveFn(x, y, duration)
            this._task.registTask(stepId, taskFn)
            break; 
        }
      });
    }
    this._task.start()
    return this
  }
  private _genStepId() {
    return String(Math.ceil(Math.random() * 100000)) // todo
  }
}
