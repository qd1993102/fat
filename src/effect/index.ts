export interface IEffectCAttr {
  x: number
  y: number
  z: number
  opacity: number
}
export interface IMoveEffect {
  x: number
  y: number
}
export function moveEffect(effect: IMoveEffect, percent: number): IMoveEffect {
  return {
    x: effect.x * percent,
    y: effect.y * percent,
  }
}