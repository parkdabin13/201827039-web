
window.addEventListener('keydown', function(e) {
    if (e.key === 'F5') {
        e.preventDefault();
        starX = Math.random() * (ctx.canvas.width - 60) + 30;
        starY = Math.random() * (ctx.canvas.height - 60) + 30;
    }
});

function startGame() {
    const titleContainer = document.querySelector('.title-container');
    const canvas = document.getElementById("myCanvas");
    canvas.style.display = "block"; // 캔버스 표시
    
    titleContainer.style.display = "none";
    
    // 게임 시작 지연
    setTimeout(() => {
        requestAnimationFrame(draw);
    }, 1000);
}

const ctx = document.getElementById("myCanvas").getContext("2d");

let starX = Math.random() * (ctx.canvas.width - 60) + 30;
let starY = Math.random() * (ctx.canvas.height - 60) + 30;
let lastTime = performance.now();

const enemies = [];

const player = {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
    speed: 200
};

const enemySpeed = 100; // 적의 속도
const enemyRadius = 20; // 적의 크기
const numEnemiesPerSecond = 5; // 초당 생성할 적의 개수
const chaseDuration = 2000; // 추격 지속 시간 (ms)

const keyState = {};

document.addEventListener("keydown", function(event) {
    keyState[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keyState[event.key] = false;
});

function drawHeart(x, y, size, color, borderColor, rotation) {
    ctx.fillStyle = color;
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.translate(-x, -y);

    ctx.moveTo(x, y - size * 0.55);
    ctx.bezierCurveTo(
        x + size * 0.7, y - size,
        x + size * 1.4, y - size * 0.4,
        x, y + size * 0.8
    );
    ctx.bezierCurveTo(
        x - size * 1.4, y - size * 0.4,
        x - size * 0.7, y - size,
        x, y - size * 0.55
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawStar(x, y, radius, spikes, color, borderColor) {
    let rot = Math.PI / 2 * 3;
    let xInner = x;
    let yInner = y;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - radius);

    for (let i = 0; i < spikes; i++) {
        x = xInner + Math.cos(rot) * radius;
        y = yInner + Math.sin(rot) * radius;
        ctx.lineTo(x, y);
        rot += step;

        x = xInner + Math.cos(rot) * (radius / 2);
        y = yInner + Math.sin(rot) * (radius / 2);
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(xInner, yInner - radius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.stroke();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let rotationAngle = 0;

function draw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const currentTimeMillis = performance.now();
    const deltaTime = (currentTimeMillis - lastTime) / 1000;
    lastTime = currentTimeMillis;

    const heartSize = 30;
    const heartColor = "red";
    const borderColor = "black";
    const starRadius = 20;
    const starSpikes = 5;
    const starColor = "#FFD700";
    const starBorderColor = "black";

    rotationAngle += 0.01;

    if (keyState['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed * deltaTime;
    } 
    if (keyState['ArrowRight'] && player.x < ctx.canvas.width) {
        player.x += player.speed * deltaTime;
    }
    if (keyState['ArrowUp'] && player.y > 0) {
        player.y -= player.speed * deltaTime;
    } 
    if (keyState['ArrowDown'] && player.y < ctx.canvas.height) {
        player.y += player.speed * deltaTime;
    }

    // 생성된 모든 적을 그린 후, 하트와의 충돌을 체크하여 충돌한 적은 삭제
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < heartSize + enemyRadius) {
            // 충돌 발생
            enemies.splice(i, 1);
            i--;
        } else {
            // 추격 시간이 지나면 일정한 속도로 이동
            if (currentTimeMillis - enemy.chaseTime > chaseDuration) {
                enemy.x += Math.cos(enemy.angle) * enemySpeed * deltaTime;
                enemy.y += Math.sin(enemy.angle) * enemySpeed * deltaTime;
            } else {
                // 플레이어를 추격
                const angle = Math.atan2(dy, dx);
                enemy.x += Math.cos(angle) * enemySpeed * deltaTime;
                enemy.y += Math.sin(angle) * enemySpeed * deltaTime;
                enemy.angle = angle; // 추격 방향 저장
            }
            // 적 그리기
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemyRadius, 0, Math.PI * 2);
            ctx.fillStyle = enemy.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    if (Math.random() < numEnemiesPerSecond * deltaTime) {
        const side = Math.floor(Math.random() * 4); // 0: 위, 1: 오른쪽, 2: 아래, 3: 왼쪽
        let x, y;
        switch(side) {
            case 0:
                x = Math.random() * ctx.canvas.width;
                y = -enemyRadius;
                break;
            case 1:
                x = ctx.canvas.width + enemyRadius;
                y = Math.random() * ctx.canvas.height;
                break;
            case 2:
                x = Math.random() * ctx.canvas.width;
                y = ctx.canvas.height + enemyRadius;
                break;
            case 3:
                x = -enemyRadius;
                y = Math.random() * ctx.canvas.height;
                break;
        }
        enemies.push({
            x: x,
            y: y,
            color: getRandomColor(),
            chaseTime: currentTimeMillis,
            angle: 0
        });
    }

    drawStar(starX, starY, starRadius, starSpikes, starColor, starBorderColor);
    drawHeart(player.x, player.y, heartSize, heartColor, borderColor, rotationAngle);

    requestAnimationFrame(draw);
}