import fat from 'src/index.ts'
setTimeout(() => {

// 移动
fat
  .select(document.querySelector('.tangle-1'))
  .move(100, 0)
  .duration(1000)
  .then()
  .delay(1000)
  .move(0, 200)
  .duration(300)
  .play()

// 旋转
fat
  .select(document.querySelector('.tangle-2'))  
  .delay(1000)
  .rotate(90)
  .duration(500)
  .then()

  .delay(500)
  .rotate(0)
  .duration(300)
  .play()

// 缩放
fat
  .select(document.querySelector('.tangle-3'))  
  .scale(2)
  .duration(500)
  .then()
  
  .scale(1)
  .duration(1000)
  .play()


fat
  .select(document.querySelector('.tangle-4'))  
  .opacity(0)
  .duration(1000)
  .then()
  
  .opacity(1)
  .duration(1000)
  .play()

}, 1000);
