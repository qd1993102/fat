export interface IEffectAttr {
  x?: number
  y?: number
  z?: number
  scale?: number
  opacity?: number
}
export type TEffectFunc = (curEffect: IEffectAttr) => any
export function moveEffect(startEffect: IEffectAttr, endEffect: IEffectAttr, duration: number): TEffectFunc {
  const gapEffect = {
    x: (endEffect.x - startEffect.x) / (duration / 16),
    y: (endEffect.y - startEffect.y) / (duration / 16),
  }
  return (curEffect: IEffectAttr) => {
    curEffect.x += gapEffect.x
    curEffect.y += gapEffect.y
  }
}
export function scaleEffect(startEffect: IEffectAttr, endEffect: IEffectAttr, duration: number): TEffectFunc {
  const gapEffect = {
    scale: (endEffect.scale - startEffect.scale) / (duration / 16),
  }
  return (curEffect: IEffectAttr) => {
    curEffect.scale += gapEffect.scale
  }
}