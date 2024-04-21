const canvas = document.getElementById('myCanvas'); 
const ctx = canvas.getContext('2d');  
canvas.width = window.innerWidth;  
canvas.height = window.innerHeight;  

// 하트 객체 클래스
class HeartObject {
    constructor(x, y, size, color, speed, rotationSpeed, direction) {
        // 속성 초기화
        this.x = x;  // x 위치
        this.y = y;  // y 위치
        this.size = size;  // 크기
        this.color = color;  // 색상
        this.speed = speed;  // 이동 속도
        this.rotationSpeed = rotationSpeed;  // 회전 속도
        this.direction = direction;  // 방향
        this.creationTime = Date.now();  // 생성 시간
    }

    draw() {
        // 하트 그리기
        ctx.fillStyle = this.color;  // 색상 설정
        ctx.save();  // 현재 캔버스 상태 저장
        ctx.translate(this.x, this.y);  // 이동
        ctx.rotate(this.direction);  // 회전
        ctx.translate(-this.size / 2, -this.size / 2);  // 중심으로 이동
        ctx.beginPath();  // 경로 시작
        ctx.moveTo(0, 0);  // 시작점
        ctx.bezierCurveTo(0, -this.size, -this.size, -this.size, -this.size, 0);  // 곡선 그리기
        ctx.bezierCurveTo(-this.size, this.size, 0, 50, 0, 50);
        ctx.bezierCurveTo(0, 50, this.size, this.size, this.size, 0);
        ctx.bezierCurveTo(this.size, -this.size, 0, -this.size, 0, 0);
        ctx.fill();  // 채우기
        ctx.closePath();  // 경로 종료
        ctx.restore();  // 이전 캔버스 상태 복원
    }

    update() {
        // 하트 위치 업데이트
        this.x += Math.cos(this.direction) * this.speed;  // x 위치 업데이트
        this.y += Math.sin(this.direction) * this.speed;  // y 위치 업데이트
        this.direction += this.rotationSpeed;  // 회전 업데이트

        // 10초 후 하트 삭제
        if (Date.now() - this.creationTime >= 10000) {
            const index = hearts.indexOf(this);  // 현재 하트의 인덱스 찾기
            if (index !== -1) {  // 인덱스가 있으면
                hearts.splice(index, 1);  // 하트 배열에서 제거
            }
        }
    }
}

let hearts = [];  // 하트 배열 초기화

function getRandomColor() {
    // 랜덤 색상 생성
    const letters = '0123456789ABCDEF';  // 색상 코드 문자열
    let color = '#';  // 시작을 나타내는 #
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];  // 랜덤 문자 선택
    }
    return color;  // 랜덤 색상 반환
}

// 마우스 움직임 이벤트
canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;  // 마우스 x 위치
    const mouseY = event.clientY;  // 마우스 y 위치
    createHeart(mouseX, mouseY);  // 하트 생성 함수 호출
});

function createHeart(x, y) {
    // 하트 생성
    if (hearts.length < 100) {  // 하트 개수가 100개 미만일 때
        const size = Math.random() * 20 + 15;  // 랜덤 크기
        const color = getRandomColor();  // 랜덤 색상
        const speed = Math.random() * 2 + 1;  // 랜덤 속도
        const rotationSpeed = Math.random() * 0.1 - 0.05;  // 랜덤 회전 속도
        const direction = Math.random() * Math.PI * 2;  // 랜덤 방향
        hearts.push(new HeartObject(x, y, size, color, speed, rotationSpeed, direction));  // 하트 추가
    }
}

function draw() {
    // 캔버스 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // 캔버스 초기화
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].draw();  // 하트 그리기
        hearts[i].update();  // 하트 업데이트
    }
    requestAnimationFrame(draw);  // 다음 프레임 요청
}

draw();  // 그리기 함수 실행
