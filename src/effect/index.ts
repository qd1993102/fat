import calc from '../lib/caculate'
import { ItaskFuncParams } from '../task/index'
export interface IEffectAttr {
  x?: number
  y?: number
  z?: number
  scale?: number
  rotate?: number
  opacity?: number
}

function baseEffectProcessor<T extends keyof IEffectAttr>(startEffect: IEffectAttr, gapEffect: IEffectAttr, attr: T) {
  return (percent: number) => {
    return calc.add(startEffect[attr], calc.multiply(gapEffect[attr], percent))
  }
}
export type TEffectFunc = (curEffect: IEffectAttr, taskParams: ItaskFuncParams) => any
export function moveEffect(startEffect: IEffectAttr, endEffect: IEffectAttr): TEffectFunc {
  const gapEffect = {
    x: calc.subtract(endEffect.x, startEffect.x),
    y: calc.subtract(endEffect.y, startEffect.y),
  }
  const xProcessor = baseEffectProcessor(startEffect, gapEffect, 'x')
  const yProcessor = baseEffectProcessor(startEffect, gapEffect, 'y')
  return (curEffect: IEffectAttr, taskParams) => {
    curEffect.x = xProcessor(taskParams.percent)
    curEffect.y = yProcessor(taskParams.percent)
  }
}
export function scaleEffect(startEffect: IEffectAttr, endEffect: IEffectAttr): TEffectFunc {
  const gapEffect = {
    scale: calc.subtract(endEffect.scale, startEffect.scale),
  }
  const scaleProcessor = baseEffectProcessor(startEffect, gapEffect, 'scale')
  return (curEffect: IEffectAttr, taskParams) => {
    curEffect.scale = scaleProcessor(taskParams.percent)
  }
}
export function rotateEffect(startEffect: IEffectAttr, endEffect: IEffectAttr): TEffectFunc {
  const gapEffect = {
    rotate: calc.subtract(endEffect.rotate, startEffect.rotate),
  }
  const rotateProcessor = baseEffectProcessor(startEffect, gapEffect, 'rotate')
  return (curEffect: IEffectAttr, taskParams) => {
    curEffect.rotate = rotateProcessor(taskParams.percent)
  }
}

export function opacityEffect(startEffect: IEffectAttr, endEffect: IEffectAttr): TEffectFunc {
  const gapEffect = {
    opacity: calc.subtract(endEffect.opacity, startEffect.opacity),
  }
  const opacityProcessor = baseEffectProcessor(startEffect, gapEffect, 'opacity')
  return (curEffect: IEffectAttr, taskParams) => {
    curEffect.opacity = opacityProcessor(taskParams.percent)
  }
}