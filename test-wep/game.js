// 캔버스와 그리기 컨텍스트 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 플레이어 정보
let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    size: 20,
    speed: 5,
    dx: 0,
    dy: 0,
    scale: 1
};

// 키보드 입력 상태
let keyState = {
    'a': false,
    'd': false,
    'w': false,
    's': false,
    '4': false,
    '6': false
};

// 장애물과 점수, 게임 오버 상태 초기화
let obstacles = [];
let score = 0;
let isGameOver = false;
let startTime = Date.now();

// 일반 장애물 생성 카운트와 회전하는 장애물 생성 여부를 위한 변수
let normalObstacleCount = 0;

// 장애물 생성을 위한 setInterval 설정
setInterval(() => {
    let obstacleWidth = 50;
    let obstacleHeight = Math.random() * (300 - 100) + 100; // 최소 100, 최대 300
    let obstacleX = canvas.width;
    let obstacleY = Math.random() * (canvas.height - obstacleHeight);
    
    obstacles.push({
        x: obstacleX,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        isRotating: normalObstacleCount % 5 === 0 && normalObstacleCount > 0, // 회전 여부
        rotationSpeed: 0.1, // 회전 속도 증가
        rotationAngle: 0 // 초기 회전 각도
    });

    normalObstacleCount++;

}, 200); // 0.2초 (200ms) 마다 장애물 생성

// 이벤트 리스너 등록
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('keydown', restartGame);

// 키 다운 이벤트 핸들러
function keyDownHandler(event) {
    if (keyState[event.key] !== undefined) {
        keyState[event.key] = true;
    }
}

// 키 업 이벤트 핸들러
function keyUpHandler(event) {
    if (keyState[event.key] !== undefined) {
        keyState[event.key] = false;
    }
}

// 게임 재시작 함수
function restartGame(event) {
    if (isGameOver && event.key === ' ') {
        obstacles = [];
        score = 0;
        isGameOver = false;
        startTime = Date.now();
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
        player.scale = 1;
        draw();
    }
}

// 플레이어 업데이트 함수
function updatePlayer() {
    // 플레이어 이동
    if (keyState['a']) {
        player.dx = -player.speed;
    } else if (keyState['d']) {
        player.dx = player.speed;
    } else {
        player.dx = 0;
    }

    if (keyState['w']) {
        player.dy = -player.speed;
    } else if (keyState['s']) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }

    // 플레이어 크기 변경
    if (keyState['4']) {
        player.scale -= 0.1;
        if (player.scale < 0.5) {
            player.scale = 0.5;
        }
    } else if (keyState['6']) {
        player.scale += 0.1;
        if (player.scale > 2.0) {
            player.scale = 2.0;
        }
    }
}

// 플레이어 그리기 함수
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(Math.atan2(player.dy, player.dx) + Math.PI / 2);
    ctx.scale(player.scale, player.scale);
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(0, -player.size);
    ctx.lineTo(-player.size, player.size);
    ctx.lineTo(player.size, player.size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// 장애물 그리기 함수
function drawObstacle(obstacle) {
    ctx.fillStyle = 'red';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

// 충돌 검사 함수
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.size > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.size > rect2.y;
}

// 메인 그리기 함수
function draw() {
    // 게임 오버 상태 체크
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText('Press SPACE to restart', canvas.width / 2 - 180, canvas.height / 2 + 40);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 80);
        return;
    }

    // 점수 계산
    let currentTime = Date.now();
    score = Math.floor((currentTime - startTime) / 1000);

    // 캔버스 지우기 및 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    updatePlayer();

    // 플레이어 이동
    player.x += player.dx;
    player.y += player.dy;

    // 장애물 이동 및 회전
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 5;
        
        if (obstacles[i].isRotating) {
            obstacles[i].rotationAngle += obstacles[i].rotationSpeed;
            ctx.save();
            ctx.translate(obstacles[i].x + obstacles[i].width / 2, obstacles[i].y + obstacles[i].height / 2);
            ctx.rotate(obstacles[i].rotationAngle);
            ctx.translate(-obstacles[i].x - obstacles[i].width / 2, -obstacles[i].y - obstacles[i].height / 2);
            drawObstacle(obstacles[i]);
            ctx.restore();
        } else {
            drawObstacle(obstacles[i]);
        }

        // 장애물 충돌 및 제거
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        } else if (isColliding(player, obstacles[i])) {
            isGameOver = true;
            break;
        }
    }

    // 플레이어 화면 밖으로 나가지 않도록 제한
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width) player.x = canvas.width;
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height) player.y = canvas.height;

    // 애니메이션 프레임 요청
    requestAnimationFrame(draw);
}

// 게임 시작
draw();
