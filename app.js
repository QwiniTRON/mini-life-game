/**@type {HTMLCanvasElement} */
const cnv = document.getElementById('cnv')
const ctx = cnv.getContext('2d')
const pi = Math.PI
const W = cnv.width = 300,
    H = cnv.height = 300;
const opts = {
    hCount: 30,
    wCount: 30,
    msOnFrame: 1000 / 60,
    renderSpeed: 2,
    lifeSpeed: 10,
    lifeIterrationCount: 15
}
let particles = [];
let isStart = false

let prevTime = 0
let globalTicks = 0
let lifeCounter = 0

// function resize(event){
//     W = cnv.width = cnv.offsetWidth
//     H = cnv.height = cnv.offsetHeight
// }
// window.addEventListener('resize', resize)
// resize()

function normalizeRange(num, range){
    if(num > range){
        return 0
    }else{
        return num
    }
}



function populate() {
    for (let i = 0; i < opts.wCount; i++) {
        particles[i] = []
        for (let j = 0; j < opts.hCount; j++) {
            particles[i][j] = 0
        }
    }
}

function render() {
    let sizeX = W / opts.wCount
    let sizeY = H / opts.hCount

    for (let i = 0; i < opts.wCount; i++) {
        for (let j = 0; j < opts.hCount; j++) {
            if (particles[i][j] == 1) {
                ctx.fillRect(i * sizeX, j * sizeY, sizeX, sizeY)
            }
        }
    }
}

function fpm(i){
    if(i == 0){
        return opts.hCount
    } else {
        return i
    }
}

function fpp(j){
    if(j == opts.wCount - 1){
        return -1
    } else {
        return j
    }
}

function life(){
    let modifiedParticles = []
    for (let i = 0; i < opts.hCount; i++) {
        modifiedParticles[i] = []
        for (let j = 0; j < opts.wCount; j++) {
            let neighbors = 0
            if(particles[fpm(i) - 1][j] == 1) neighbors++; // up
            if(particles[i][fpp(j) + 1] == 1) neighbors++; // right
            if(particles[fpp(i) + 1][j] == 1) neighbors++; // bottom
            if(particles[i][fpm(j) - 1] == 1) neighbors++; // left
            if(particles[fpm(i) - 1][fpp(j) + 1] == 1) neighbors++; // right top
            if(particles[fpp(i) + 1][fpp(j) + 1] == 1) neighbors++; // right bottom
            if(particles[fpm(i) - 1][fpm(j) - 1] == 1) neighbors++; // left bottom
            if(particles[fpp(i) + 1][fpm(j) - 1] == 1) neighbors++; // left top

            if(neighbors == 2 || neighbors == 3){
                // modifiedParticles[i][j] = Math.round(1 * Math.random() + 0.4)
                modifiedParticles[i][j] = 1
            }else{
                modifiedParticles[i][j] = 0
            }
        }
    }

    particles = modifiedParticles
}

function clear() {
    ctx.clearRect(0, 0, W, H)
}

function loop(ms) {
    if (ms - prevTime >= opts.msOnFrame) {
        globalTicks++
        if (globalTicks % opts.renderSpeed == 0) {
            clear()

            if(globalTicks % opts.lifeSpeed == 0){
                if(isStart){ 
                    life()
                    lifeCounter++
                };
                if(lifeCounter > opts.lifeIterrationCount){
                    isStart = false
                }
            }

            render()
        }
        globalTicks = normalizeRange(globalTicks, 2048)
        
        prevTime = ms
    }

    window.requestAnimationFrame(loop)
}

function setUp() {
    populate()

    window.requestAnimationFrame(loop)
}

cnv.addEventListener('click', function (event) {
    if(!isStart){
        let x = Math.floor(event.offsetX / (W / opts.wCount))
        let y = Math.floor(event.offsetY / (H / opts.hCount))
    
        particles[x][y] = particles[x][y] == 0 ? 1 : 0
    }
})

document.getElementById('start').addEventListener('click', (event) => {
    isStart = true
    event.currentTarget.disabled= true
    document.getElementById('restart').disabled= false
    lifeCounter = 0
})

document.getElementById('restart').addEventListener('click', (event) => {
    isStart = false
    document.getElementById('start').disabled= false
    event.currentTarget.disabled= true
    populate()
})

setUp()









