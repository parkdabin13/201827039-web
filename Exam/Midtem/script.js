document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let starX = Math.random() * (canvas.width - 60) + 30;
    let starY = Math.random() * (canvas.height - 60) + 30;
    let lastTime = performance.now();

    const player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        speed: 100
    };

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

    let rotationAngle = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentTimeMillis = performance.now();
        const deltaTime = (currentTimeMillis - lastTime) / 1000;
        lastTime = currentTimeMillis;

        const heartSize = 50;
        const heartColor = "red";
        const borderColor = "black";
        const starRadius = 30;
        const starSpikes = 5;
        const starColor = "#FFD700";
        const starBorderColor = "black";

        rotationAngle += 0.01;

        if (keyState['ArrowLeft']) {
            player.x -= player.speed * deltaTime;
        } else if (keyState['ArrowRight']) {
            player.x += player.speed * deltaTime;
        }

        if (keyState['ArrowUp']) {
            player.y -= player.speed * deltaTime;
        } else if (keyState['ArrowDown']) {
            player.y += player.speed * deltaTime;
        }

        drawStar(starX, starY, starRadius, starSpikes, starColor, starBorderColor);
        drawHeart(player.x, player.y, heartSize, heartColor, borderColor, rotationAngle);

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
});
