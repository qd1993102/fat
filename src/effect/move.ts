interface IMoveOptions {
  el: HTMLElement | null
}
export class Move {
  constructor (opts: IMoveOptions) {
    console.log(opts)
  }

  run () {
    //
  }
}
