// import * as path from 'path';
// import utils from 'src/lib/utils';
// import { Move } from './action/move'
import { _$ } from './lib/dom'
import { Task, ItaskFuncParams } from './task/index'
import { IJsonObject } from './@interface/common.i'
import { moveEffect, IEffectCAttr } from './effect/index'
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
  
  private _$effectAttr: IEffectCAttr = {
    x: 0,
    y: 0,
    z: 0,
    opacity: 1
  }

  private _effectAttr = new Proxy(this._$effectAttr, {
    get: (obj, prop, value) => {
      return this._$effectAttr[prop as keyof IEffectCAttr]
    },
    set: (obj, prop, value) => {
      this._$effectAttr[prop as keyof IEffectCAttr] = value
      const attr = this._$effectAttr
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
    this._currentStepId = guid()
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

  duration (duration: number) {
    this._stepDurations[this._currentStepId] = duration
    return this
  }
  then() {
    // 更改
    this._currentStepId = guid()
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
            const taskFn = (params: ItaskFuncParams) => {
              const effectRes = moveEffect({
                x, 
                y,
              }, params.percent)
              this._effectAttr.x += effectRes.x
              this._effectAttr.y += effectRes.y
            }
            this._task.registTask(stepId, taskFn, duration)
            break; 
        }
      });
    }
    this._task.play()
    return this
  }
}
