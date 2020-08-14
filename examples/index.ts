import fat from 'src/index.ts'
setTimeout(() => {
  fat
  .select('div')
  .move(100, 0)
  .duration(1000)
  .then()
  .move(0, 200)
  .duration(300)
  .then()
  .move(100, 0)
  .duration(500)
  .play()
}, 1000);
