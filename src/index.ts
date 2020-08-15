// import * as path from 'path';
// import utils from 'src/lib/utils';
// import { Move } from './action/move'
import { _$ } from './lib/dom'
import { Task } from './task/index'
import { IJsonObject } from './@interface/common.i'
import logger from './lib/logger'
import { guid, deepClone } from './lib/utils'
import List, { IListItem } from './lib/list'

export default {
  select <K extends keyof HTMLElementTagNameMap> (selector: K) {
    const el = _$(selector)
    return new Fat({
      el
    })
  }
}

enum FAT_STATE_ENUM {
  ready = 'ready',
  playing = 'playing',
  pause = 'pause',
  stop = 'stop',
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
interface IStepItemValue {
  method: string
  args: any[]
}
interface IStepItem {
  value: IStepItemValue[]
}
class Fat {
  private _el: HTMLElement
  private _task: Task
  private _fatState: FAT_STATE_ENUM // 当前状态
  private _currentStepId: string // 当前步骤
  private _steps: List<IStepItem> // 步骤列表
  private _stepDurations: IJsonObject // 每个步骤里的时间列表
  
  private _$transAttr: ITransAttr = {
    x: 0,
    y: 0,
    z: 0,
    opacity: 1
  }

  private _transAttr = new Proxy(this._$transAttr, {
    get: (obj, prop, value) => {
      return this._$transAttr[prop as keyof ITransAttr]
    },
    set: (obj, prop, value) => {
      this._$transAttr[prop as keyof ITransAttr] = value
      const attr = this._$transAttr
      const transform = `translate3d(${attr.x.toFixed(2) || 0}px, ${attr.y.toFixed(2) || 0}px, ${attr.z.toFixed(2) || 0}px)`;
      this._el.style.transform = transform;
      this._el.style.opacity = String(attr.opacity || 1);
      return true
    }
  })

  constructor (opts: IFatOptions) {
    this._el = opts.el
    this._task = new Task()
    this._fatState = FAT_STATE_ENUM.ready
    this._steps = new List([])
    this._stepDurations = {}
    this._currentStepId = this._genStepId()
  }

  move (x: number, y: number) {
    if (this._fatState !== FAT_STATE_ENUM.playing) {
      const stepItem = this._steps.getById(this._currentStepId)
      const stepItemValue = {
        method: FAT_METHOD_ENUM.move,
        args: [x, y]
      };
      if (!stepItem) {
        this._steps.push({
          id: this._currentStepId,
          value: [stepItemValue]
        })
      } else {
        stepItem.value.push(stepItemValue);
      }
      return this
    }
    return this
  }
  _getMoveFn(x: number, y: number, duration: number) {
    const xGap = Number(16 * x / duration)
    const yGap = Number(16 * y / duration)
    return () => {
      const _x = Number((this._transAttr.x + xGap).toFixed(2))
      const _y = Number((this._transAttr.y + yGap).toFixed(2))
      this._transAttr.x = _x
      this._transAttr.y = _y;
      logger.debug('move:', this._transAttr.x, this._transAttr.y);
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
  play () {
    const len = this._steps.length
    for(let i = 0; i < len; i++) {
      const stepItem = this._steps.get(i)
      const stepFuncs = stepItem.value
      const stepId = stepItem.id
      const duration = this._stepDurations[stepId] // 读取对应步骤下的duration
      stepFuncs.forEach((fnInfo) => {
        switch(fnInfo.method) {
          case FAT_METHOD_ENUM.move:
            const [x, y] = fnInfo.args
            const taskFn = this._getMoveFn(x, y, duration)
            this._task.registTask(stepId, taskFn, duration)
            break; 
        }
      });
    }
    this._task.play()
    return this
  }
  private _genStepId() {
    return guid();
  }
}
