/* =========================
   ELEMENTS
========================= */

const mainMenu =
    document.getElementById(
        "mainMenu"
    );


const characterMenu =
    document.getElementById(
        "characterMenu"
    );


const howMenu =
    document.getElementById(
        "howMenu"
    );


const gameScreen =
    document.getElementById(
        "gameScreen"
    );


const gameOverMenu =
    document.getElementById(
        "gameOverMenu"
    );


const playButton =
    document.getElementById(
        "playButton"
    );


const characterButton =
    document.getElementById(
        "characterButton"
    );


const characterBackButton =
    document.getElementById(
        "characterBackButton"
    );


const howButton =
    document.getElementById(
        "howButton"
    );


const howBackButton =
    document.getElementById(
        "howBackButton"
    );


const retryButton =
    document.getElementById(
        "retryButton"
    );


const menuButton =
    document.getElementById(
        "menuButton"
    );


const voidCharacter =
    document.getElementById(
        "voidCharacter"
    );


const lockedCharacters =
    document.querySelectorAll(
        ".character-card.locked"
    );


const selectedCharacterText =
    document.getElementById(
        "selectedCharacterText"
    );


const menuHighScore =
    document.getElementById(
        "menuHighScore"
    );


const finalScore =
    document.getElementById(
        "finalScore"
    );


const newHighScore =
    document.getElementById(
        "newHighScore"
    );


const canvas =
    document.getElementById(
        "gameCanvas"
    );


const ctx =
    canvas.getContext(
        "2d"
    );


const scoreText =
    document.getElementById(
        "scoreText"
    );


const highScoreText =
    document.getElementById(
        "highScoreText"
    );



/* =========================
   CHARACTER SYSTEM
========================= */

let selectedCharacter =
    "void";


const voidImage =
    new Image();


voidImage.src =
    "images/birdvoid.png";



/* =========================
   OTHER IMAGES
========================= */

const backgroundImage =
    new Image();


backgroundImage.src =
    "images/background.png";


const buildingImage =
    new Image();


buildingImage.src =
    "images/building.png";


const groundImage =
    new Image();


groundImage.src =
    "images/ground.png";



/* =========================
   GAME VARIABLES
========================= */

let bird;


let buildings =
    [];


let buildingTimer =
    0;


let score =
    0;


let running =
    false;


let dying =
    false;


let animationFrameId =
    null;


let deathAnimationFrameId =
    null;



/* =========================
   PARTICLES
========================= */

let trailParticles =
    [];


let deathParticles =
    [];



/* =========================
   PHYSICS
========================= */

const gravity =
    0.22;


const flapPower =
    -5.5;


const maxFallSpeed =
    5;



/* =========================
   BUILDINGS
========================= */

const buildingSpeed =
    2.5;


const buildingWidth =
    80;


const gapSize =
    175;


const groundHeight =
    60;



/* =========================
   ROTATION
========================= */

const normalSpinSpeed =
    0.025;



/* =========================
   HIGH SCORE
========================= */

let highScore =
    Number(
        localStorage.getItem(
            "neonFlapHighScore"
        )
    ) || 0;



function updateHighScoreDisplay() {

    menuHighScore.textContent =
        highScore;


    highScoreText.textContent =
        "HIGH SCORE: " +
        highScore;
}


updateHighScoreDisplay();



/* =========================
   STOP ANIMATIONS
========================= */

function stopAnimationLoops() {

    if (
        animationFrameId !==
        null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );


        animationFrameId =
            null;
    }


    if (
        deathAnimationFrameId !==
        null
    ) {

        cancelAnimationFrame(
            deathAnimationFrameId
        );


        deathAnimationFrameId =
            null;
    }
}



/* =========================
   SCREEN FUNCTIONS
========================= */

function hideAllScreens() {

    mainMenu.classList.add(
        "hidden"
    );


    characterMenu.classList.add(
        "hidden"
    );


    howMenu.classList.add(
        "hidden"
    );


    gameScreen.classList.add(
        "hidden"
    );


    gameOverMenu.classList.add(
        "hidden"
    );
}



function showMainMenu() {

    running =
        false;


    dying =
        false;


    stopAnimationLoops();


    document.body.classList.remove(
        "playing"
    );


    hideAllScreens();


    mainMenu.classList.remove(
        "hidden"
    );


    updateHighScoreDisplay();
}



function showCharacterMenu() {

    running =
        false;


    dying =
        false;


    stopAnimationLoops();


    document.body.classList.remove(
        "playing"
    );


    hideAllScreens();


    characterMenu.classList.remove(
        "hidden"
    );


    selectedCharacterText.textContent =
        selectedCharacter.toUpperCase();
}



function showHowMenu() {

    running =
        false;


    dying =
        false;


    stopAnimationLoops();


    document.body.classList.remove(
        "playing"
    );


    hideAllScreens();


    howMenu.classList.remove(
        "hidden"
    );
}



function showGame() {

    hideAllScreens();


    gameScreen.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "playing"
    );


    startGame();
}



/* =========================
   RESET BIRD
========================= */

function resetBird() {

    bird = {

        x:
            120,

        y:
            175,

        width:
            44,

        height:
            44,

        velocity:
            0,

        rotation:
            0

    };
}



/* =========================
   CREATE BUILDINGS
========================= */

function createBuildingPair() {

    const minimumTop =
        35;


    const maximumTop =
        canvas.height -
        groundHeight -
        gapSize -
        65;


    const topHeight =
        Math.floor(
            Math.random() *
            (
                maximumTop -
                minimumTop
            )
        ) +
        minimumTop;


    buildings.push({

        x:
            canvas.width,

        width:
            buildingWidth,

        topHeight:
            topHeight,

        gap:
            gapSize,

        passed:
            false

    });
}



/* =========================
   DRAW BACKGROUND
========================= */

function drawBackground() {

    ctx.drawImage(

        backgroundImage,

        0,
        0,

        canvas.width,
        canvas.height

    );
}



/* =========================
   DRAW GROUND
========================= */

function drawGround() {

    ctx.drawImage(

        groundImage,

        0,

        canvas.height -
        groundHeight,

        canvas.width,
        groundHeight

    );
}



/* =========================
   DRAW CHARACTER
========================= */

function drawBird() {

    ctx.save();


    ctx.translate(

        bird.x +
        bird.width / 2,

        bird.y +
        bird.height / 2

    );


    ctx.rotate(
        bird.rotation
    );


    if (
        selectedCharacter ===
        "void"
    ) {

        ctx.shadowColor =
            "#b300ff";


        ctx.shadowBlur =
            8;


        ctx.drawImage(

            voidImage,

            -bird.width / 2,
            -bird.height / 2,

            bird.width,
            bird.height

        );
    }


    ctx.restore();
}



/* =========================
   DRAW BUILDINGS
========================= */

function drawBuildings() {

    buildings.forEach(

        function(building) {


            const bottomY =
                building.topHeight +
                building.gap;


            const bottomHeight =
                canvas.height -
                groundHeight -
                bottomY;



            /* TOP BUILDING */

            ctx.save();


            ctx.translate(

                building.x +
                building.width / 2,

                building.topHeight / 2

            );


            ctx.scale(
                1,
                -1
            );


            ctx.drawImage(

                buildingImage,

                -building.width / 2,
                -building.topHeight / 2,

                building.width,
                building.topHeight

            );


            ctx.restore();



            /* BOTTOM BUILDING */

            ctx.drawImage(

                buildingImage,

                building.x,
                bottomY,

                building.width,
                bottomHeight

            );

        }
    );
}



/* =========================
   VOID TRAIL
========================= */

function createTrailParticle() {

    if (
        selectedCharacter !==
        "void"
    ) {

        return;
    }


    trailParticles.push({

        x:
            bird.x + 6,

        y:
            bird.y +
            bird.height / 2,

        size:
            Math.random() *
            5 + 2,

        life:
            1,

        speedX:
            Math.random() *
            1.5 + 0.5,

        speedY:
            (
                Math.random() -
                0.5
            ) * 1.5

    });
}



function updateTrail() {

    trailParticles.forEach(

        function(particle) {

            particle.x -=
                particle.speedX;


            particle.y +=
                particle.speedY;


            particle.life -=
                0.04;

        }
    );


    trailParticles =
        trailParticles.filter(

            function(particle) {

                return (
                    particle.life >
                    0
                );

            }
        );
}



function drawTrail() {

    if (
        selectedCharacter !==
        "void"
    ) {

        return;
    }


    trailParticles.forEach(

        function(particle) {

            ctx.save();


            ctx.globalAlpha =
                particle.life;


            ctx.fillStyle =
                "#b300ff";


            ctx.shadowColor =
                "#b300ff";


            ctx.shadowBlur =
                12;


            ctx.fillRect(

                particle.x,
                particle.y,

                particle.size,
                particle.size

            );


            ctx.restore();

        }
    );
}



/* =========================
   UPDATE BIRD
========================= */

function updateBird() {

    bird.velocity +=
        gravity;


    if (
        bird.velocity >
        maxFallSpeed
    ) {

        bird.velocity =
            maxFallSpeed;
    }


    bird.y +=
        bird.velocity;


    bird.rotation +=
        normalSpinSpeed;


    if (
        bird.velocity >
        1
    ) {

        bird.rotation +=
            0.015;
    }
}



/* =========================
   UPDATE BUILDINGS
========================= */

function updateBuildings() {

    buildingTimer++;


    if (
        buildingTimer >
        120
    ) {

        createBuildingPair();


        buildingTimer =
            0;
    }


    buildings.forEach(

        function(building) {

            building.x -=
                buildingSpeed;

        }
    );


    buildings =
        buildings.filter(

            function(building) {

                return (

                    building.x +
                    building.width >
                    0

                );

            }
        );
}



/* =========================
   SCORE
========================= */

function updateScore() {

    buildings.forEach(

        function(building) {

            if (

                !building.passed &&

                building.x +
                building.width <
                bird.x

            ) {

                building.passed =
                    true;


                score++;


                scoreText.textContent =
                    "SCORE: " +
                    score;

            }

        }
    );
}



/* =========================
   COLLISION
========================= */

function checkCollision() {

    const padding =
        6;


    const birdLeft =
        bird.x +
        padding;


    const birdRight =
        bird.x +
        bird.width -
        padding;


    const birdTop =
        bird.y +
        padding;


    const birdBottom =
        bird.y +
        bird.height -
        padding;



    /* CEILING */

    if (
        birdTop <= 0
    ) {

        return true;
    }



    /* GROUND */

    if (

        birdBottom >=

        canvas.height -
        groundHeight

    ) {

        return true;
    }



    /* BUILDINGS */

    for (
        let building of buildings
    ) {

        const left =
            building.x;


        const right =
            building.x +
            building.width;


        const topBottom =
            building.topHeight;


        const bottomTop =
            building.topHeight +
            building.gap;


        const touchingX =

            birdRight >
            left &&

            birdLeft <
            right;


        const touchingTop =

            birdTop <
            topBottom;


        const touchingBottom =

            birdBottom >
            bottomTop;


        if (

            touchingX &&

            (
                touchingTop ||
                touchingBottom
            )

        ) {

            return true;
        }
    }


    return false;
}



/* =========================
   FLAP
========================= */

function flap() {

    if (
        !running ||
        dying
    ) {

        return;
    }


    bird.velocity =
        flapPower;


    bird.rotation -=
        0.20;
}



/* =========================
   VOID DEATH EXPLOSION
========================= */

function createDeathExplosion() {

    deathParticles =
        [];


    if (
        selectedCharacter !==
        "void"
    ) {

        return;
    }


    for (
        let i = 0;
        i < 45;
        i++
    ) {

        deathParticles.push({

            x:
                bird.x +
                bird.width / 2,

            y:
                bird.y +
                bird.height / 2,

            size:
                Math.random() *
                7 + 2,

            speedX:
                (
                    Math.random() -
                    0.5
                ) * 12,

            speedY:
                (
                    Math.random() -
                    0.5
                ) * 12,

            life:
                1

        });
    }
}



function updateDeathParticles() {

    deathParticles.forEach(

        function(particle) {

            particle.x +=
                particle.speedX;


            particle.y +=
                particle.speedY;


            particle.speedY +=
                0.08;


            particle.speedX *=
                0.98;


            particle.life -=
                0.025;

        }
    );


    deathParticles =
        deathParticles.filter(

            function(particle) {

                return (
                    particle.life >
                    0
                );

            }
        );
}



function drawDeathParticles() {

    deathParticles.forEach(

        function(particle) {

            ctx.save();


            ctx.globalAlpha =
                particle.life;


            ctx.fillStyle =
                "#c77dff";


            ctx.shadowColor =
                "#b300ff";


            ctx.shadowBlur =
                15;


            ctx.fillRect(

                particle.x,
                particle.y,

                particle.size,
                particle.size

            );


            ctx.restore();

        }
    );
}



/* =========================
   START GAME
========================= */

function startGame() {

    stopAnimationLoops();


    resetBird();


    buildings =
        [];


    trailParticles =
        [];


    deathParticles =
        [];


    buildingTimer =
        0;


    score =
        0;


    scoreText.textContent =
        "SCORE: 0";


    highScoreText.textContent =
        "HIGH SCORE: " +
        highScore;


    newHighScore.textContent =
        "";


    running =
        true;


    dying =
        false;


    document.body.classList.add(
        "playing"
    );


    gameLoop();
}



/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (
        !running
    ) {

        return;
    }


    ctx.clearRect(

        0,
        0,

        canvas.width,
        canvas.height

    );


    drawBackground();


    updateBird();


    createTrailParticle();


    updateTrail();


    updateBuildings();


    updateScore();


    drawBuildings();


    drawGround();


    drawTrail();


    drawBird();


    if (
        checkCollision()
    ) {

        startDeath();


        return;
    }


    animationFrameId =
        requestAnimationFrame(
            gameLoop
        );
}



/* =========================
   DEATH
========================= */

function startDeath() {

    if (
        dying
    ) {

        return;
    }


    running =
        false;


    dying =
        true;


    createDeathExplosion();


    deathLoop();
}



function deathLoop() {

    if (
        !dying
    ) {

        return;
    }


    ctx.clearRect(

        0,
        0,

        canvas.width,
        canvas.height

    );


    drawBackground();


    drawBuildings();


    drawGround();


    updateTrail();


    drawTrail();


    updateDeathParticles();


    drawDeathParticles();


    if (
        deathParticles.length ===
        0
    ) {

        finishGameOver();


        return;
    }


    deathAnimationFrameId =
        requestAnimationFrame(
            deathLoop
        );
}



/* =========================
   GAME OVER
========================= */

function finishGameOver() {

    dying =
        false;


    document.body.classList.remove(
        "playing"
    );


    let gotHighScore =
        false;


    if (
        score >
        highScore
    ) {

        highScore =
            score;


        gotHighScore =
            true;


        localStorage.setItem(

            "neonFlapHighScore",

            highScore

        );
    }


    finalScore.textContent =
        "SCORE: " +
        score;


    if (
        gotHighScore
    ) {

        newHighScore.textContent =
            "NEW HIGH SCORE!";

    }

    else {

        newHighScore.textContent =
            "";

    }


    updateHighScoreDisplay();


    gameOverMenu.classList.remove(
        "hidden"
    );
}



/* =========================
   CHARACTER SELECT
========================= */

voidCharacter.addEventListener(

    "pointerdown",

    function(event) {

        event.preventDefault();


        selectedCharacter =
            "void";


        selectedCharacterText.textContent =
            "VOID";


        voidCharacter.classList.add(
            "selected"
        );

    }
);



/* =========================
   LOCKED CHARACTER MOBILE
========================= */

lockedCharacters.forEach(

    function(card) {

        card.addEventListener(

            "pointerdown",

            function(event) {

                event.preventDefault();


                lockedCharacters.forEach(

                    function(otherCard) {

                        if (
                            otherCard !==
                            card
                        ) {

                            otherCard.classList.remove(
                                "mobile-show-message"
                            );

                        }

                    }

                );


                card.classList.toggle(
                    "mobile-show-message"
                );


                setTimeout(

                    function() {

                        card.classList.remove(
                            "mobile-show-message"
                        );

                    },

                    1800
                );

            }

        );

    }

);



/* =========================
   KEYBOARD CONTROL
========================= */

document.addEventListener(

    "keydown",

    function(event) {

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();


            flap();

        }

    }
);



/* =========================
   POINTER / TOUCH CONTROL
========================= */

gameScreen.addEventListener(

    "pointerdown",

    function(event) {

        if (
            !running ||
            dying
        ) {

            return;
        }


        event.preventDefault();


        flap();

    }

);



/* =========================
   PREVENT MOBILE GESTURES
========================= */

gameScreen.addEventListener(

    "contextmenu",

    function(event) {

        event.preventDefault();

    }

);



/* =========================
   MENU BUTTONS
========================= */

playButton.addEventListener(

    "click",

    function() {

        showGame();

    }

);



characterButton.addEventListener(

    "click",

    function() {

        showCharacterMenu();

    }

);



characterBackButton.addEventListener(

    "click",

    function() {

        showMainMenu();

    }

);



howButton.addEventListener(

    "click",

    function() {

        showHowMenu();

    }

);



howBackButton.addEventListener(

    "click",

    function() {

        showMainMenu();

    }

);



retryButton.addEventListener(

    "click",

    function() {

        gameOverMenu.classList.add(
            "hidden"
        );


        document.body.classList.add(
            "playing"
        );


        startGame();

    }

);



menuButton.addEventListener(

    "click",

    function() {

        showMainMenu();

    }

);



/* =========================
   TAB / APP VISIBILITY
========================= */

document.addEventListener(

    "visibilitychange",

    function() {

        /*
            Prevents weird accidental
            jumping after switching apps.
        */

        if (
            document.hidden &&
            running
        ) {

            bird.velocity =
                0;

        }

    }

);



/* =========================
   START
========================= */

showMainMenu();