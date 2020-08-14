import fat from 'src/index.ts'

fat
  .select('div')
  .move(100, 100)
  .duration(500)
  .then()
  .move(200, 200)
  .duration(300)
  .run()
