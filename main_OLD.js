// Variables globales
const map = document.querySelector('.map')
const pacMan = document.querySelector('img[src="./img/pacman.gif"]')
const redGhost = document.querySelector('img[src="./img/red-ghost.png"]')

let pacManInterval
let redGhostInterval

let currentRedGhostDirection

const directions = [ 'toLeft', 'toRight', 'toTop', 'toBottom' ]

console.log('jeu lancé')

// Collection des murs axe horizontal droite-gauche
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

const getPositionOf = (element) => {
    const top = parseInt(getComputedStyle(element, null).getPropertyValue('top'), 10)
    const left = parseInt(getComputedStyle(element, null).getPropertyValue('left'), 10)
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

// Mouvements du clavier
const movePacMan = (to) => {
    clearInterval(pacManInterval)
    
    pacMan.className = to

    let pacManPosition = getPositionOf(pacMan)

    pacManInterval = setInterval(() => {
        // PACMAN MANGE LES PAC-GOMME SUR LESQUELLES IL PASSE
        // créer variable let score tout haut du code
        // Récupérer la position de Pac-Man
        // Construire un tableau des positions de tous les points présents sur la carte :
        //        - document.querySelectorAll('.dot')
        //        - supprimer du document le .dot sur lesquelles se trouve Pac-Man, par exemple avec un .forEach()
        // incrémenter le score


        if (!isTheCharacterBlocked(pacManPosition, to)) {
            switch (to) {
                case 'toLeft':
                    pacMan.style.left = pacManPosition.left === 0 ? 900 + "px" : pacManPosition.left - 100 + "px"
                    break
                case 'toRight':
                    pacMan.style.left = pacManPosition.left === 900 ? 0 : pacManPosition.left + 100 + "px"
                    break
                case 'toTop':
                    pacMan.style.top = pacManPosition.top - 100 + "px"
                    break
                case 'toBottom':
                    pacMan.style.top = pacManPosition.top + 100 + "px"
                    break
            }
            pacManPosition = getPositionOf(pacMan)
        }
    }, 250)

}

const moveRedGhost = () => {
    clearInterval(redGhostInterval)
    
    let redGhostPosition = getPositionOf(redGhost)

    // générer un "to" aléatoire
    // À SUPPRIMER APRÈS LE POINT ⭐️
    const randomInt = Math.floor(Math.random() * 4)
    const randomDirection = directions[randomInt] // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'

    // SI NOUS VOULONS AMÉLIORER LE DÉPLACEMENT, IL FAUDRA REMPLACER LES DEUX LIGNES PRÉCÉDENTES PAR UNE SOLUTION DE CE GENRE
    // let filtredDirections = directions.filter((direction) => {
    //     return direction !== currentRedGhostDirection && ????
    // })

    redGhostInterval = setInterval(() => {
        currentRedGhostDirection = randomDirection

        if (!isTheCharacterBlocked(redGhostPosition, randomDirection)) {

            switch (randomDirection) {
                case 'toLeft':
                    redGhost.style.left = redGhostPosition.left === 0 ? 900 + "px" : redGhostPosition.left - 100 + "px"
                    break
                case 'toRight':
                    redGhost.style.left = redGhostPosition.left === 900 ? 0 : redGhostPosition.left + 100 + "px"
                    break
                case 'toTop':
                    redGhost.style.top = redGhostPosition.top - 100 + "px"
                    break
                case 'toBottom':
                    redGhost.style.top = redGhostPosition.top + 100 + "px"
                    break
            }
            redGhostPosition = getPositionOf(redGhost)
        } else {
            moveRedGhost() // La fonction est relancée si le fantôme est bloqué
            return
        }
    }, 250)
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

const displayDots = () => {
    for (let col = 0; col < 10; col++) {
        for (let row = 0; row < 10; row++) {
            const dot = document.createElement('div')
            dot.className = 'dot'
            dot.style.left = col * 100 + 'px'
            dot.style.top = row * 100 + 'px'
            map.insertBefore(dot, pacMan)
        }
    }
    // Reste à faire disparaître les 10 pac-gommes superflues
}

const start = () => {
    moveRedGhost()
    displayDots()
}

start() // À supprimer quand le submit.addEventListener('click', (e) => {}) sera implémenté


// Après avoir créé les inputs dans le HTML, nous les référençons tout haut de main.js
// const submit = document.querySelector('input[type="submit"]')
// const inputName = document.querySelector('input[type="text"]')

// Nous créons une variable vide au début du code
// let userName

// submit.addEventListener('click', (e) => {
//      e.preventDefault()
//      VÉRIFIER ICI QUE inputName.value CONTIENT AU MOINS TROIS CARACTÈRES
//      userName = inputName.value
//      LANCER LA PARTIE ICI !
//      start()
// })
