/* ==============================
   ELEMENTS
============================== */

const mainMenu =
    document.getElementById("mainMenu");

const characterMenu =
    document.getElementById("characterMenu");

const howMenu =
    document.getElementById("howMenu");

const patchMenu =
    document.getElementById("patchMenu");

const gameScreen =
    document.getElementById("gameScreen");

const gameOverMenu =
    document.getElementById("gameOverMenu");


const playButton =
    document.getElementById("playButton");

const characterButton =
    document.getElementById("characterButton");

const howButton =
    document.getElementById("howButton");

const patchButton =
    document.getElementById("patchButton");


const characterBackButton =
    document.getElementById("characterBackButton");

const howBackButton =
    document.getElementById("howBackButton");

const patchBackButton =
    document.getElementById("patchBackButton");


const retryButton =
    document.getElementById("retryButton");

const menuButton =
    document.getElementById("menuButton");


const voidCharacter =
    document.getElementById("voidCharacter");

const lockedCharacters =
    document.querySelectorAll(".locked");


const menuHighScore =
    document.getElementById("menuHighScore");

const scoreText =
    document.getElementById("scoreText");

const highScoreText =
    document.getElementById("highScoreText");

const finalScore =
    document.getElementById("finalScore");

const newHighScore =
    document.getElementById("newHighScore");


const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/* ==============================
   IMAGES
============================== */

const voidImage =
    new Image();

voidImage.src =
    "images/birdvoid.png";


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


/* ==============================
   CHARACTER
============================== */

let selectedCharacter =
    "void";


/* ==============================
   GAME STATE
============================== */

let bird =
    null;

let buildings =
    [];

let trailParticles =
    [];

let deathParticles =
    [];

let buildingTimer =
    0;

let score =
    0;

let running =
    false;

let dying =
    false;

let gameFrame =
    null;

let deathFrame =
    null;


/* ==============================
   GAME SETTINGS

   v1.1
============================== */

const gravity =
    0.30;

const flapPower =
    -5.5;

const maxFallSpeed =
    5;

const buildingSpeed =
    3;

const buildingWidth =
    80;

const gapSize =
    175;

const groundHeight =
    60;


/* ==============================
   HIGH SCORE
============================== */

let highScore =
    Number(
        localStorage.getItem(
            "voidFlapHighScore"
        )
    ) || 0;


function updateHighScoreText() {

    menuHighScore.textContent =
        highScore;

    highScoreText.textContent =
        "HIGH SCORE: " +
        highScore;
}


updateHighScoreText();


/* ==============================
   SCREEN CONTROL
============================== */

function hideScreens() {

    mainMenu.classList.add(
        "hidden"
    );

    characterMenu.classList.add(
        "hidden"
    );

    howMenu.classList.add(
        "hidden"
    );

    patchMenu.classList.add(
        "hidden"
    );

    gameScreen.classList.add(
        "hidden"
    );

    gameOverMenu.classList.add(
        "hidden"
    );
}


function stopLoops() {

    if (gameFrame !== null) {

        cancelAnimationFrame(
            gameFrame
        );

        gameFrame =
            null;
    }


    if (deathFrame !== null) {

        cancelAnimationFrame(
            deathFrame
        );

        deathFrame =
            null;
    }
}


function showMainMenu() {

    running =
        false;

    dying =
        false;

    stopLoops();

    document.body.classList.remove(
        "playing"
    );

    hideScreens();

    mainMenu.classList.remove(
        "hidden"
    );

    updateHighScoreText();
}


function showCharacters() {

    hideScreens();

    characterMenu.classList.remove(
        "hidden"
    );
}


function showHowToPlay() {

    hideScreens();

    howMenu.classList.remove(
        "hidden"
    );
}


function showPatchNotes() {

    hideScreens();

    patchMenu.classList.remove(
        "hidden"
    );
}


function showGame() {

    hideScreens();

    gameScreen.classList.remove(
        "hidden"
    );

    document.body.classList.add(
        "playing"
    );

    startGame();
}


/* ==============================
   BIRD
============================== */

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
        0.025;


    if (
        bird.velocity >
        1
    ) {

        bird.rotation +=
            0.015;
    }
}


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


/* ==============================
   BACKGROUND
============================== */

function drawBackground() {

    ctx.drawImage(

        backgroundImage,

        0,
        0,

        canvas.width,
        canvas.height
    );
}


/* ==============================
   GROUND
============================== */

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


/* ==============================
   BUILDINGS
============================== */

function createBuilding() {

    const minTop =
        35;


    const maxTop =
        canvas.height -
        groundHeight -
        gapSize -
        65;


    const topHeight =
        Math.floor(

            Math.random() *
            (
                maxTop -
                minTop
            )

        ) +
        minTop;


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


function updateBuildings() {

    buildingTimer++;


    if (
        buildingTimer >
        120
    ) {

        createBuilding();

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


            /* TOP */

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


            /* BOTTOM */

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


/* ==============================
   VOID TRAIL
============================== */

function createTrail() {

    if (
        selectedCharacter !==
        "void"
    ) {

        return;
    }


    trailParticles.push({

        x:
            bird.x + 5,

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
            1.4 + 0.5,

        speedY:
            (
                Math.random() -
                0.5
            ) *
            1.4
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


/* ==============================
   SCORE
============================== */

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


/* ==============================
   COLLISION
============================== */

function checkCollision() {

    const padding =
        6;


    const left =
        bird.x +
        padding;

    const right =
        bird.x +
        bird.width -
        padding;

    const top =
        bird.y +
        padding;

    const bottom =
        bird.y +
        bird.height -
        padding;


    if (
        top <= 0
    ) {

        return true;
    }


    if (

        bottom >=
        canvas.height -
        groundHeight

    ) {

        return true;
    }


    for (
        const building of buildings
    ) {

        const buildingLeft =
            building.x;


        const buildingRight =
            building.x +
            building.width;


        const bottomBuildingTop =
            building.topHeight +
            building.gap;


        const touchingX =

            right >
            buildingLeft &&

            left <
            buildingRight;


        const touchingTop =

            top <
            building.topHeight;


        const touchingBottom =

            bottom >
            bottomBuildingTop;


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


/* ==============================
   DEATH EXPLOSION
============================== */

function createExplosion() {

    deathParticles =
        [];


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

            dx:
                (
                    Math.random() -
                    0.5
                ) *
                12,

            dy:
                (
                    Math.random() -
                    0.5
                ) *
                12,

            life:
                1
        });
    }
}


function updateExplosion() {

    deathParticles.forEach(
        function(particle) {

            particle.x +=
                particle.dx;

            particle.y +=
                particle.dy;

            particle.dy +=
                0.08;

            particle.dx *=
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


function drawExplosion() {

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


/* ==============================
   START GAME
============================== */

function startGame() {

    stopLoops();


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


/* ==============================
   MAIN LOOP
============================== */

function gameLoop() {

    if (!running) {
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


    createTrail();

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


    gameFrame =
        requestAnimationFrame(
            gameLoop
        );
}


/* ==============================
   DEATH LOOP
============================== */

function startDeath() {

    if (dying) {
        return;
    }


    running =
        false;

    dying =
        true;


    createExplosion();


    deathLoop();
}


function deathLoop() {

    if (!dying) {
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


    updateExplosion();

    drawExplosion();


    if (
        deathParticles.length ===
        0
    ) {

        finishGameOver();

        return;
    }


    deathFrame =
        requestAnimationFrame(
            deathLoop
        );
}


/* ==============================
   GAME OVER
============================== */

function finishGameOver() {

    dying =
        false;


    document.body.classList.remove(
        "playing"
    );


    let newRecord =
        false;


    if (
        score >
        highScore
    ) {

        highScore =
            score;


        newRecord =
            true;


        localStorage.setItem(

            "voidFlapHighScore",

            highScore
        );
    }


    finalScore.textContent =
        "SCORE: " +
        score;


    newHighScore.textContent =
        newRecord
            ? "NEW HIGH SCORE!"
            : "";


    updateHighScoreText();


    gameOverMenu.classList.remove(
        "hidden"
    );
}


/* ==============================
   CHARACTER SCREEN
============================== */

voidCharacter.addEventListener(
    "click",
    function() {

        selectedCharacter =
            "void";
    }
);


lockedCharacters.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                card.classList.add(
                    "show-message"
                );


                setTimeout(
                    function() {

                        card.classList.remove(
                            "show-message"
                        );
                    },
                    1500
                );
            }
        );
    }
);


/* ==============================
   CONTROLS
============================== */

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


gameScreen.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();
    }
);


/* ==============================
   MENU BUTTONS
============================== */

playButton.addEventListener(
    "click",
    showGame
);


characterButton.addEventListener(
    "click",
    showCharacters
);


howButton.addEventListener(
    "click",
    showHowToPlay
);


patchButton.addEventListener(
    "click",
    showPatchNotes
);


characterBackButton.addEventListener(
    "click",
    showMainMenu
);


howBackButton.addEventListener(
    "click",
    showMainMenu
);


patchBackButton.addEventListener(
    "click",
    showMainMenu
);


retryButton.addEventListener(
    "click",
    function() {

        gameOverMenu.classList.add(
            "hidden"
        );

        startGame();
    }
);


menuButton.addEventListener(
    "click",
    showMainMenu
);


/* ==============================
   START
============================== */

showMainMenu();
