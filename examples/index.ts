import fat from 'src/index.ts'
setTimeout(() => {
  fat
  .select('div')
  .move(100, 0)
  .duration(1000)
  // .then()
  // .move(200, 200)
  // .duration(300)
  .run()
}, 1000);
