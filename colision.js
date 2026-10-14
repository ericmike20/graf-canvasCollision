const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    detectCollision(circles) {
        let isColliding = false;

        circles.forEach(other => {
            if (this !== other) {
                let dx = other.posX - this.posX;
                let dy = other.posY - this.posY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let minDist = this.radius + other.radius;

                // Colisión entre círculos
                if (distance < minDist) {
                    isColliding = true;

                    // Despegar los círculos para evitar que se atoren
                    let overlap = minDist - distance;
                    let angle = Math.atan2(dy, dx);
                    
                    this.posX -= Math.cos(angle) * overlap * 0.5;
                    this.posY -= Math.sin(angle) * overlap * 0.5;
                    other.posX += Math.cos(angle) * overlap * 0.5;
                    other.posY += Math.sin(angle) * overlap * 0.5;

                    // Intercambio de velocidades (rebote físico)
                    let tempDx = this.dx;
                    let tempDy = this.dy;

                    this.dx = other.dx;
                    this.dy = other.dy;

                    other.dx = tempDx;
                    other.dy = tempDy;
                }
            }
        });

        if (isColliding) {
            this.color = '#0000FF';
        } else {
            this.color = this.originalColor;
        }
    }

    update(context, circles) {
        this.detectCollision(circles);
        this.draw(context);

        // Actualizar la posición X y evitar que se quede pegado en las orillas laterales
        this.posX += this.dx;
        if (this.posX + this.radius > window_width) {
            this.posX = window_width - this.radius; // Forzar posición dentro del borde derecho
            this.dx = -this.dx;
        } else if (this.posX - this.radius < 0) {
            this.posX = this.radius; // Forzar posición dentro del borde izquierdo
            this.dx = -this.dx;
        }

        // Actualizar la posición Y y evitar que se quede pegado en las orillas superior/inferior
        this.posY += this.dy;
        if (this.posY + this.radius > window_height) {
            this.posY = window_height - this.radius; // Forzar posición dentro del borde inferior
            this.dy = -this.dy;
        } else if (this.posY - this.radius < 0) {
            this.posY = this.radius; // Forzar posición dentro del borde superior
            this.dy = -this.dy;
        }
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

generateCircles(20);
animate();