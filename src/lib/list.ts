export interface IListItem<T> {
  id: string
  value: TListItemValue<T>
}
type TListItemValue<T> = T extends { value: infer V } ? V : any
/**
 *  二维数组结构
 */
export default class List<T> {
  private _value: IListItem<T>[]
  public get length(): number {
    return this._value.length
  }
  constructor(val: IListItem<T>[]) {
    this._value = val
  }
  has(id: string): boolean {
    return !!this.getById(id)
  }
  replaceItem(id: string, value: IListItem<T>): void {
    const index = this._value.findIndex(item => id === item.id)
    if (index !== -1) {
      this._value.splice(index, 1, value)
    } else {
      // todo
      console.error(`[List error]: do not find ${id} !`)
    }
  }
  shift(): IListItem<T> {
    return this._value.shift()
  }
  push(item: IListItem<T>) {
    this._value.push(item)
  }
  unshift(item: IListItem<T>) {
    this._value.unshift(item)
  }
  pop(): IListItem<T> {
    return this._value.pop()
  }
  find(func: (item: IListItem<T>, index: number) => boolean): IListItem<T> {
    return this._value.find(func)
  }
  getById(id: string): IListItem<T> {
    return this._value.find(item => id === item.id)
    
  }
  get(index: number): IListItem<T> {
    return this._value[index]
  }
  valueOf(): IListItem<T>[] {
    return this._value
  }
}