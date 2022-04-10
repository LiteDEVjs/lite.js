const game = Lite('#canvas', {
   canvas: {
      width: 5,
      height: 5,
   }
})

game.init()

const development = Development(game)

development.createGrid()

game.createHero('main-hero', {
   class: 'main-hero',
})

// let drivingForce
// let motionless = true

// Имитация движения объекта
// game.keyBoardAction(manage => {
//    if (manage.event === 'keydown'){
//       if (motionless){
//          console.log('run')

//          drivingForce = setInterval(() => {
//             console.log('run')
//          }, 200)
   
//          motionless = false
//       }
//    } else if (manage.event === 'keyup'){
//       clearInterval(drivingForce)

//       motionless = true
//       console.log('Отпустили')
//    }
// })