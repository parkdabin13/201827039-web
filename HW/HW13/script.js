const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 삼각형 중심 좌표와 한 변의 길이 설정
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const sideLength = 600; // 정삼각형의 한 변의 길이
const height = (Math.sqrt(3) / 2) * sideLength;

// 삼각형 객체 정의
let triangle = {
    x1: centerX,
    y1: centerY - height / 2,
    x2: centerX - sideLength / 2,
    y2: centerY + height / 2,
    x3: centerX + sideLength / 2,
    y3: centerY + height / 2,
    color: 'blue', // 초기 색상
    originalColor: 'blue', // 원래 색상
    angle: 0, // 초기 각도
    rotationSpeed: 1, // 회전 속도
};

// 삼각형 그리기 함수
function drawTriangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY); // 중심으로 이동
    ctx.rotate(triangle.angle * Math.PI / 180); // 회전
    ctx.translate(-centerX, -centerY); // 다시 원래 위치로 이동
    ctx.beginPath();
    ctx.moveTo(triangle.x1, triangle.y1);
    ctx.lineTo(triangle.x2, triangle.y2);
    ctx.lineTo(triangle.x3, triangle.y3);
    ctx.closePath();
    ctx.fillStyle = triangle.color;
    ctx.fill();
    ctx.restore();
}

// 삼각형 회전 함수
function rotateTriangle() {
    triangle.angle += triangle.rotationSpeed;
    if (triangle.angle >= 360) {
        triangle.angle -= 360;
    }
    drawTriangle();
}

// 캔버스 클릭 이벤트 리스너
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (isPointInTriangle(x, y)) {
        // 삼각형 내부를 클릭한 경우 랜덤 색상으로 변경
        triangle.color = getRandomColor();
    } else {
        // 삼각형 외부를 클릭한 경우 원래 색상으로 변경
        triangle.color = triangle.originalColor;
    }
    drawTriangle();
});

// 삼각형 내부를 클릭한 경우를 확인하는 함수
function isPointInTriangle(px, py) {
    const { x1, y1, x2, y2, x3, y3 } = triangle;
    // 삼각형을 세 개의 삼각형으로 나누어 각각의 면적을 계산
    const areaOrig = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
    const area1 = Math.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
    const area2 = Math.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
    const area3 = Math.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));
    // 세 개의 삼각형의 면적 합이 삼각형 전체의 면적과 같으면 삼각형 내부에 있는 것으로 간주
    return area1 + area2 + area3 <= areaOrig + 0.1; // 허용 오차를 더해서 판별
}


// 랜덤 색상을 반환하는 함수
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 일정 간격으로 삼각형 회전 함수를 호출하여 회전하는 효과를 생성
setInterval(rotateTriangle, 50);