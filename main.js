// Variables globales
const map = document.querySelector('.map')
const pacMan = document.querySelector('img[src="./img/pacman.gif"]')
const redGhost = document.querySelector('img[src="./img/red-ghost.png"]')
const pinkGhost = document.querySelector('img[src="./img/pink-ghost.png"]')

let pacManInterval
let redGhostInterval
let pinkGhostInterval

let currentRedGhostDirection

const directions = [ 'toLeft', 'toRight', 'toTop', 'toBottom' ]

console.log('jeu lancé')

const maxSize = 1000
const mqlMaxWidth = matchMedia(`(max-width: ${ maxSize }px)`)
const mqlMaxHeight = matchMedia(`(max-height: ${ maxSize }px)`)
const mqlOrientation = matchMedia('(orientation: portrait)')

const isSmallScreen = () => {
    
}
const isPortraitOrientation = () => {
    const mql = matchMedia('(orientation: portrait)')
    console.log(mql)
}
isPortraitOrientation()

// Collection des murs axe horizontal droite-gauche
const blockedSquaresToLeft = [
    {top:300, left:200},{top:500, left:200},{top:700, left:200},{top:200, left:300},{top:300, left:300},{top:500, left:300},{top:800, left:300},
    {top:0, left:500}, {top:200, left:500}, {top:600, left:500}, {top:800, left:500}, {top:400, left:600}, {top:200, left:700}, {top:300, left:700},
    {top:500, left:700}, {top:800, left:700}, {top:700, left:800},
//ligne en left 0
    {top:0, left:0}, {top:100, left:0}, {top:200, left:0}, {top:600, left:0}, {top:700, left:0}, {top:800, left:0},{top:900, left:0}
]
// Collection des murs axe horizontal gauche-droite
const blockedSquaresToRight = [
    {top:700, left:100}, {top:200, left:200}, {top:300, left:200}, {top:500, left:200}, {top:800, left:200}, {top:400, left:300},
    {top:0, left:400}, {top:200, left:400}, {top:600, left:400}, {top:800, left:400}, {top:200, left:600}, {top:300, left:600},
    {top:500, left:600}, {top:800, left:600}, {top:300, left:700}, {top:500, left:700}, {top:700, left:700},
//ligne en left 900
    {top:0, left:900}, {top:100, left:900}, {top:200, left:900}, {top:600, left:900}, {top:700, left:900},
    {top:800, left:900}, {top:900, left:900}
]
// Collection des murs axe vertical bas-haut
const blockedSquaresToTop = [
    {top:400, left:0}, {top:600, left:0}, {top:800, left:0}, {top:100, left:100}, {top:200, left:100}, {top:400, left:100}, {top:600, left:100},
    {top:400, left:100}, {top:700, left:100}, {top:900, left:100}, {top:900, left:200}, {top:100, left:300}, {top:300, left:300},
    {top:700, left:300}, {top:900, left:300}, {top:200, left:400}, {top:500, left:400}, {top:600, left:400}, {top:800, left:400},
    {top:200, left:500}, {top:500, left:500}, {top:600, left:500}, {top:800, left:500}, {top:100, left:600}, {top:300, left:600},
    {top:700, left:600}, {top:900, left:600}, {top:900, left:700}, {top:100, left:800}, {top:200, left:800}, {top:400, left:800},
    {top:600, left:800}, {top:700, left:800}, {top:900, left:800}, {top:400, left:900}, {top:600, left:900}, {top:800, left:900} ,
//ligne en top 0
    {top:0, left:0}, {top:0, left:100}, {top:0, left:200}, {top:0, left:300}, {top:0, left:400}, {top:0, left:500}, {top:0, left:600},
    {top:0, left:700}, {top:0, left:800}, {top:0, left:900}
]
// Collection des murs axe vertical haut-bas
const blockedSquaresToBottom = [
    {top:200, left:0}, {top:400, left:0}, {top:700, left:0}, {top:0, left:100}, {top:100, left:100}, {top:200, left:100}, {top:400, left:100},
    {top:600, left:100}, {top:800, left:100}, {top:800, left:200}, {top:0, left:300}, {top:200, left:300}, {top:600, left:300}, {top:800, left:300},
    {top:100, left:400}, {top:300, left:400}, {top:500, left:400}, {top:700, left:400}, {top:100, left:500}, {top:300, left:500}, {top:500, left:500},
    {top:700, left:500}, {top:0, left:600}, {top:200, left:600}, {top:600, left:600}, {top:800, left:600}, {top:800, left:700}, {top:0, left:800},
    {top:100, left:800}, {top:200, left:800}, {top:400, left:800}, {top:600, left:800}, {top:800, left:800}, {top:200, left:900}, {top:400, left:900},
    {top:700, left:900},
//ligne en top 900
    {top:900, left:0}, {top:900, left:100}, {top:900, left:200}, {top:900, left:300}, {top:900, left:400}, {top:900, left:500}, {top:900, left:600},
    {top:900, left:700}, {top:900, left:800}, {top:900, left:900}
]

// À MODIFIER POUR LE RESPONSIVE (1/2)
const getPositionOf = (element) => {
    // const top = parseInt(getComputedStyle(element, null).getPropertyValue('top'), 10)
    // const left = parseInt(getComputedStyle(element, null).getPropertyValue('left'), 10)
    const top = Number(element.dataset.top)
    const left = Number(element.dataset.left)
    return { top, left }
}

const isTheCharacterBlocked = (characterPositon, movingDirection) => {    
    let blockedSquares
    switch (movingDirection) {
        case 'toLeft':
            blockedSquares = blockedSquaresToLeft
            break
        case 'toRight':
            blockedSquares = blockedSquaresToRight
            break
        case 'toTop':
            blockedSquares = blockedSquaresToTop
            break
        case 'toBottom':
            blockedSquares = blockedSquaresToBottom
            break
    }

    return blockedSquares.some(square => {
        const topsAreEquals = characterPositon.top === square.top
        const leftsAreEquals = characterPositon.left === square.left
        return topsAreEquals && leftsAreEquals
    })
}

// À MODIFIER POUR QUE LE RESPONSIVE FONCTIONNE : UTILISER L'ÉQUIVALENT DES VW ET WH CSS
const move = (character, from, to) => {
    switch (to) {
        case 'toLeft':
            character.dataset.left = from.left === 0 ? 900 : from.left - 100 
            character.style.left = from.left === 0 ? 900 + "px" : from.left - 100 + "px"
            break
        case 'toRight':
            character.dataset.left = from.left === 900 ? 0 : from.left + 100
            character.style.left = from.left === 900 ? 0 : from.left + 100 + "px"
            break
        case 'toTop':
            character.dataset.top = from.top - 100
            character.style.top = from.top - 100 + "px"
            break
        case 'toBottom':
            character.dataset.top = from.top + 100
            character.style.top = from.top + 100 + "px"
            break
    }
}
const movePacMan = (to) => {
    clearInterval(pacManInterval)
    
    pacMan.className = to

    let pacManPosition = getPositionOf(pacMan)

    pacManInterval = setInterval(() => {
        if (!isTheCharacterBlocked(pacManPosition, to)) {
            move(pacMan, pacManPosition, to)
        }
    }, 250)
}

const moveRedGhost = () => {
    clearInterval(redGhostInterval)
    
    let redGhostPosition = getPositionOf(redGhost)

    const randomInt = Math.floor(Math.random() * 4)
    const randomDirection = directions[randomInt] // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'

    redGhostInterval = setInterval(() => {
        currentRedGhostDirection = randomDirection

        if (!isTheCharacterBlocked(redGhostPosition, randomDirection)) {
            move(redGhost, redGhostPosition, randomDirection)
            redGhostPosition = getPositionOf(redGhost)
        } else {
            moveRedGhost() // La fonction est relancée si le fantôme est bloqué
            return
        }
    }, 250)
}
const movePinkGhost = () => {
    clearInterval(pinkGhostInterval)
    pinkGhostInterval = setInterval(() => {
        moveToPacMan(pinkGhost)
    }, 500)
}

const moveToPacMan = (ghost) => {
    // Le fantôme suit Pac-Man
}
const isGameOver = () => {
    // Retourner true si la position de Pac-Man coïncide avec celle d’un fantôme
}

addEventListener('keydown', e => {
    switch (e.keyCode) {
        case 37:
            movePacMan('toLeft')
            break
        case 39:
            movePacMan('toRight')
            break
        case 38:
            movePacMan('toTop')
            break
        case 40:
            movePacMan('toBottom')
            break
    }
})

// À MODIFIER POUR LE RESPONSIVE (2/2)
const displayDots = () => {
    for (let col = 0; col < 10; col++) {
        for (let row = 0; row < 10; row++) {
            const dot = document.createElement('div')
            dot.className = 'dot'
            dot.dataset.top = row * 100
            dot.dataset.left = col * 100
            dot.style.left = col * 100 + 'px'
            dot.style.top = row * 100 + 'px'
            map.insertBefore(dot, pacMan)
        }
    }

    // Reste à faire disparaître les 10 pac-gommes superflues
    removeDot(300, 0)
    removeDot(300, 100)
    removeDot(500, 0)
    removeDot(500, 100)
    removeDot(300, 800)
    removeDot(300, 900)
    removeDot(500, 800)
    removeDot(500, 900)
    removeDot(400, 400)
    removeDot(400, 500)
}
const removeDot = (top, left) => {
    // Supprimer un dot du DOM en fonction de son top et de son left
}

const start = () => {
    moveRedGhost()
    movePinkGhost()
    displayDots()
}

start()