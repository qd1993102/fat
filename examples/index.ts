import fat from 'src/index.ts'
setTimeout(() => {
  fat
  .select('div')
  .move(100, 0)
  .scale(2.4)
  .duration(1000)
  .delay(200)
  .then()

  .move(0, 200)
  .scale(1.5)
  .duration(300)
  .then()

  .delay(300)
  .move(100, 0)
  .duration(500)

  .play()
}, 1000);
