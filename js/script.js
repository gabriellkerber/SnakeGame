const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const size = 30
const audio = new Audio('../assets/audio.mp3')
const score = document.querySelector('.score')
const bestScore = document.querySelector('.bestScore')
const scoreSpan = document.querySelector('.score > span')
const bestScoreSpan = document.querySelector('.bestScore > span')
const scoreFinal = document.querySelector('.score--final > span')
const startScreen = document.querySelector('.startScreen')
const gameOverScreen = document.querySelector('.gameOverScreen')
const btnStart = document.querySelector('.btnStart')
const btnRestart = document.querySelector('.btnRestart')
const btnHome = document.querySelector('.btnHome')
const btnEasy = document.querySelector('.btnEasy')
const btnMedium = document.querySelector('.btnMedium')
const btnHard = document.querySelector('.btnHard')
const hardDifficult = 100
const mediumDifficult = 200
const easyDifficult = 300

let snake = [
  {x: 300, y: 300}
]
let snakeHead = snake.at(-1)
let position = snakeHead
let lastKey
let idSetTimeout = Number
let difficult = 300

let randomNumber = () => {
  return (Math.floor(Math.random() * (Math.floor((canvas.width - size) / 30) + 1))) * 30
}

const fruit = {
  x: randomNumber(),
  y: randomNumber(),
  color: 'red'
}

const addNewBody = (x, y) => {
  snake.push({x, y})
}

const addSnake = () => {
  snake.forEach(position => {
    ctx.fillStyle = 'darkGreen'
    ctx.fillRect(position.x, position.y, size, size)
  })
}

const moveSnake = () => {
  if (!lastKey) return
  if (lastKey === 'up' ) position.y = snakeHead.y - 30
  if (lastKey === 'right') position.x = snakeHead.x + 30
  if (lastKey === 'down') position.y = snakeHead.y + 30
  if (lastKey === 'left') position.x = snakeHead.x - 30
  addNewBody(position.x, position.y)
  snake.shift()
}
  
const addFruit = (x, y) => {
  ctx.fillStyle = fruit.color
  ctx.fillRect(x, y, size, size)
}

const randomFruitPosition = () => {
  fruit.x = randomNumber()
  fruit.y = randomNumber()
}

const getFruit = () => {
  if (snake.find(element => element.x === fruit.x && element.y === fruit.y)) {
    audio.play()
    snake.unshift(snake[0])
    incScore()
    randomFruitPosition()
    addFruit(fruit.x,fruit.y)
  }
}

const incScore = () => {
  scoreSpan.innerHTML = +scoreSpan.innerHTML + 10
  const scoreSpanNumber = parseInt(scoreSpan.innerHTML)
  const bestScoreSpanNumber = parseInt(bestScoreSpan.innerHTML)

  if (scoreSpanNumber > bestScoreSpanNumber) {
    bestScoreSpan.innerText = scoreSpan.innerText
    localStorage.setItem('scoreSnakeGame', bestScoreSpan.innerText)
  }
}

const checkCollision = () => {
  const snakeNeck = snake.length -2
  if (snake.find((element, index) => element.x === snakeHead.x && element.y === snakeHead.y && index < snakeNeck )) return gameOver()
  if (snakeHead.x > (canvas.width - size)) return gameOver()
  if (snakeHead.x < 0) return gameOver()
  if (snakeHead.y > (canvas.height - size)) return gameOver()
  if (snakeHead.y < 0) return gameOver()
}

const gameOver = () => {
  lastKey = undefined
  scoreFinal.innerHTML = scoreSpan.innerHTML
  gameOverScreen.style.display = 'flex'
  canvas.style.filter = 'blur(15px)'
}

const checkDifficult = () => {
  if (difficult === easyDifficult) btnEasy.style.backgroundColor = 'DeepSkyBlue'
  if (difficult === mediumDifficult) btnMedium.style.backgroundColor = 'DeepSkyBlue'
  if (difficult === hardDifficult) btnHard.style.backgroundColor = 'DeepSkyBlue'
}

const restart = () => {
  snake = [{x: 300, y: 300}]
  gameOverScreen.style.display = 'none'
  scoreFinal.innerHTML = '00'
  scoreSpan.innerHTML = '00'
  snakeHead = snake.at(-1)
  position = snakeHead
  canvas.style.filter = 'none'
}

const game = () => {
  clearInterval(idSetTimeout)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  checkCollision()
  moveSnake()
  addSnake()
  addFruit(fruit.x, fruit.y)
  getFruit()
  checkDifficult()

  idSetTimeout = setTimeout(() => {
    game()
  }, difficult);
}

game()

btnStart.addEventListener('click', () => {
  score.style.display = 'flex'
  bestScore.style.display = 'flex'
  canvas.style.display = 'flex'
  startScreen.style.display = 'none'
  bestScoreSpan.innerHTML = localStorage.getItem('scoreSnakeGame')
});

document.addEventListener('keydown', function ({key}){
  if (key === 'ArrowRight' && lastKey !== 'left') lastKey = 'right'
  if (key === 'ArrowUp' && lastKey !== 'down') lastKey = 'up'
  if (key === 'ArrowLeft' && lastKey !== 'right') lastKey = 'left'
  if (key === 'ArrowDown' && lastKey !== 'up') lastKey = 'down'
})

btnRestart.addEventListener('click', () => {
   restart()
});

btnHome.addEventListener('click', () => {
  restart()
  canvas.style.display = 'none'
  score.style.display = 'none'
  bestScore.style.display = 'none'
  scoreFinal.style.display = 'none'
  startScreen.style.display = 'flex'
});

btnEasy.addEventListener('click', () => {
  difficult = easyDifficult
  btnHard.style.backgroundColor = 'white'
  btnMedium.style.backgroundColor = 'white'
});

btnMedium.addEventListener('click', () => {
  difficult = mediumDifficult
  btnEasy.style.backgroundColor = 'white'
  btnHard.style.backgroundColor = 'white'
});

btnHard.addEventListener('click', () => {
  difficult = hardDifficult
  btnEasy.style.backgroundColor = 'white'
  btnMedium.style.backgroundColor = 'white'
});