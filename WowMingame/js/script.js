
// Получение ссылок на DOM-объекты

const menuEasy = document.querySelector('.menu__easy');
const menuNormal = document.querySelector('.menu__normal');
const menuHard = document.querySelector('.menu__hard');
const menu =  document.querySelector('.menu');
const gameover = document.querySelector('.gameover');
const gameoverReturn = document.querySelector('.gameover__return')
const game = document.querySelector('.game');
const gameField = document.querySelector('.game__field');
/* const llb = document.querySelector('.loselive'); */
const hud = document.querySelector('.hud');
const livesHud = document.querySelector('#lives');
const enemiesLeftHud = document.querySelector('#enemies-left');
const levelHud = document.querySelector('#level');
/* const ce = document.querySelector('.createEnemy'); */
const enemyHtml = document.querySelector('.enemy');

// ------------------------------------------------------------




// Объявление переменных

const MOVESPEED = 8;
const gameFieldHeight = 700;
let enemyReal = 'enemyReal';
let lives = 30;
let enemiesLeft = 0;
let level = 0;
let timeBetweenSpawns = 0;
let enemiesTotal = 0;
let enemiesSpawned = 0
let globalID = 1;
let enem = [];  
const levelDelay = 4;
let enemySpawns = 0;

// --------------------------




// Объявление enum

const DIFFICULTY = {
    EASY:{debug: "easy"},
    NORMAL:{debug: "normal"},
    HARD:{debug: "hard"}
}

const STATE = {
    MENU: {debug:"Main menu"},
    GAME: {debug:"Game in progress"},
    GAMEOVER: {debug:"Game over!"}

}

const ENEMYTYPE = {
    FAST: {speed:2,hp:3,debug:"Fast enemy"},
    ORC: {speed:5, hp:1, debug:"Normal enemy"},
    STRONG:{speed:6,hp:6,debug:"Strong enemy"}
}

// ---------------------------------------------




let currentDifficulty = undefined;
let currentState = STATE.MENU;
CheckState('draw');
changeHud();



// Добавление интеракций с DOM

/* llb.addEventListener("click", function() {

    LoseLive(2);
}) */


menuEasy.addEventListener("click", function() {

    SetDifficulty(DIFFICULTY.EASY);
})

menuNormal.addEventListener("click", function() {

    SetDifficulty(DIFFICULTY.NORMAL);
})

menuHard.addEventListener("click", function() {

    SetDifficulty(DIFFICULTY.HARD);
})


gameoverReturn.addEventListener("click", function() {

    ChangeState(STATE.MENU);
})

/* ce.addEventListener("click", function() {
    SpawnEnemy("type", enemyHtml);
    
}) */

// ---------------------------------------------------




function LoseLive (num) {
    lives -=num;
    changeHud();
    if (lives <=0) {
        ChangeState(STATE.GAMEOVER);
    }
}



function SetDifficulty(difficulty) {
    currentDifficulty = difficulty;
    ChangeState(STATE.GAME);
    GameStart();
}


function EnemyDead () {
    enemiesLeft -=1;
    changeHud();
    if(enemiesLeft<=0) {
        SetupLevel();
    }
}







// Функции взаимодействия с состоянием

function ChangeState (newState) {
    CheckState('kill');
    currentState = newState;
    CheckState('draw');

}

function CheckState(action) {
    switch(currentState) {
        case STATE.MENU:
            if (action =='kill') {
                KillElement(menu);
            }else {
                DrawElement(menu);
            }
            break;
        case STATE.GAME:
            if (action =='kill') {
                KillElement(game);
                KillElement(hud);
            }else {
                DrawElement(game);
                DrawElement(hud);
            }
            break;
        case STATE.GAMEOVER:
            if (action =='kill') {
                ResetAll();
                KillAll();
                KillElement(gameover);
            }else {
                ResetAll();
                KillAll();
                SpawnerStop();
                DrawElement(gameover);
            }

    }

}



// --------------------------------------




// Функции отрисовки

function KillElement(element) {
    element.classList.add('hidden')
}

function DrawElement(element) {
    element.classList.remove('hidden')
}

function changeHud() {
    livesHud.textContent = lives;
    enemiesLeftHud.textContent = enemiesLeft;
    levelHud.textContent = level;
}

// -------------------------------------------









// Функции очистки информации

function ResetAll () {
    lives = 0;
    level = 0;
    enemiesLeft = 0;
    globalID = 1;
    enemySpawns = 0
    currentDifficulty = undefined;
}

function KillAll() {
    enem.forEach(function(item,index,array) {
            item.Destroy();
            item = undefined;
    });
    enem.length= 0;
    globalID = 1;
    enemySpawns = 0
}

// --------------------------------------------




// Функции загрузки уровней 

function SetupLevel() {
    KillAll();
    SpawnerStop();
    if (level < 10) {
        level+=1;
        switch (currentDifficulty) {
            case DIFFICULTY.EASY:
                enemiesTotal += 12;
                enemiesLeft = enemiesTotal
                time = 25;
                changeHud();
                Spawner(time);
                break;
            case DIFFICULTY.NORMAL:
                enemiesTotal += 20;
                enemiesLeft = enemiesTotal;
                time = 15;
                changeHud();
                Spawner(time);
                break;
            case DIFFICULTY.HARD:
                enemiesTotal += 20;
                time = 5;
                enemiesLeft = enemiesTotal;
                changeHud();
                Spawner(time);
                break;
        }

    }else {
        ChangeState(STATE.GAMEOVER);
    }

    
}

function GameStart (){
    level = 1;
    SpawnerStop();
    switch (currentDifficulty) {
        case DIFFICULTY.EASY:
                time = 25;
                timeBetweenSpawns = 5;
                
                enemiesTotal = 12;
                enemiesLeft = enemiesTotal;
                Spawner(time);
            break;
        case DIFFICULTY.NORMAL:
                time = 15;
                timeBetweenSpawns = 4;
                enemiesTotal = 24;
                enemiesLeft = enemiesTotal;
                Spawner(time);
            break;
        case DIFFICULTY.HARD:
                time = 5;
                timeBetweenSpawns =2;
                enemiesTotal = 50;
                enemiesLeft = enemiesTotal;
                Spawner(time);
            break;
    }
    changeHud();
}

// ------------------------------------




// Спавн противников

function Spawner(time) {
    
    if(enemySpawns === 0) {
    enemySpawns = setInterval(SpawnEnemy, time*20);
    }
}

function SpawnerStop (){
    clearInterval(enemySpawns);
}

function SpawnEnemy() {
    if (globalID <= enemiesTotal ) {
        var thisEnemy = enemyHtml.cloneNode(false);
        thisEnemy.classList.add(enemyReal);
        thisEnemy.id = globalID;
    
        var type = SetEnemyType();
    
        thisEnemy.classList.add(SetEnemyVisual(type));
        
        var x_pos = '0px';
        var y_pos = getRandomY() + 'px';
        thisEnemy.style.right = x_pos;
        thisEnemy.style.top  = y_pos;
    
    
    
        enem[globalID] = new Enemy(type,type.speed,type.hp,thisEnemy, globalID);
        enem[globalID].html.addEventListener('click', function(event) {
    
            enem[event.target.id].TakeDamage();
            
        });
        gameField.append(enem[globalID].html);
        
        enem[globalID].MoveStart();
        
        globalID +=1;
    }else {
        SpawnerStop();
    }
}


function SetEnemyType () {
    var rand =  Math.floor(Math.random()*10);
    if (rand>=9) {
        return ENEMYTYPE.STRONG
    }else if (rand>=7) {
        return ENEMYTYPE.FAST
    }else {
        return ENEMYTYPE.ORC
    }
    
}

function SetEnemyVisual (type) {
    switch (type) {
        case ENEMYTYPE.ORC:
            return 'enemy--orc';
        case ENEMYTYPE.FAST:
            return 'enemy--fast';
        case ENEMYTYPE.STRONG:
            return 'enemy--strong';
        
    }
}

function getRandomY() {
    return Math.floor(Math.random() * (gameFieldHeight -125));
}

// ------------------------------------------------------------- 




// Класс противников 

class Enemy {
    constructor (type, speed, hp, html, id) {
        this.type = type;
        this.speed = speed;
        this.hp = hp;
        this.html = html;
        this.id = id;
        this.pos = 0;
    }

    TakeDamage() {
        this.hp-=1;
        
        if (this.hp <=0) {
            EnemyDead();
            this.Destroy();
        } 
    }

    Destroy() {
        this.html.remove();
        clearInterval(this.moving);
        
    }

    MoveStart() {
        var that = this;
        this.moving = setInterval(() => this.Move(),this.speed*50);
    }


    Move() {
        
        this.pos +=MOVESPEED;

        this.html.style.right = this.pos + 'px';
        if(this.pos >= 1680) {
            LoseLive(1);
            this.Destroy();
            EnemyDead ();
        }
    }
}
// --------------------------------------------------------------------