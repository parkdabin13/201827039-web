var canvas = document.getElementById("GameScreenCanvas");
var ctx = canvas.getContext("2d");

canvas.style.margin = "auto";
canvas.style.display = "block";

// 초기 위치 및 각속도 설정
var sunAngle = 0;
var earthAngle = 0;
var moonAngle = 0;

// 자전 속도 설정
var sunRotateSpeed = Math.PI / 100;
var earthRotateSpeed = Math.PI / 150;
var moonRotateSpeed = Math.PI / 80;

// 공전 속도 설정
var earthOrbitSpeed = Math.PI / 200;
var moonOrbitSpeed = Math.PI / 100;

draw();

function draw() {
    // 태양
    ctx.save();
    ctx.fillStyle = "red";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(sunAngle);
    ctx.fillRect(-75, -75, 150, 150);
    ctx.restore();

    // 태양 이름
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.fillText("태양", 0, 10);
    ctx.restore();

    // 지구
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(earthAngle);
    ctx.translate(300, 0);
    ctx.fillRect(-50, -50, 100, 100);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(earthAngle);
    ctx.translate(300, 0);
    ctx.rotate(-earthAngle);
    ctx.fillText("지구", 0, 10);
    ctx.restore();

    // 달
    ctx.save();
    ctx.fillStyle = "gray";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(earthAngle);
    ctx.translate(300, 0);
    ctx.rotate(moonAngle);
    ctx.translate(100, 0);
    ctx.fillRect(-25, -25, 50, 50); 

    ctx.fillStyle = "black";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("달", 0, 5);
    ctx.rotate(sunAngle);
    ctx.restore();

    sunAngle += sunRotateSpeed;
    earthAngle += earthRotateSpeed; 
    moonAngle += moonRotateSpeed;

    earthAngle += earthOrbitSpeed;
    moonAngle += moonOrbitSpeed;

    requestAnimationFrame(draw);
}
