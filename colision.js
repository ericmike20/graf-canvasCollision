const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

// Cargar la imagen de fondo (asegúrate de tener tu imagen en la carpeta con este nombre)
const bgImage = new Image();
bgImage.src = 'fondo.jpg'; 

class GameObject {
    constructor(x, y, radius, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.speed = speed;
        this.dy = this.speed;
        this.dx = (Math.random() - 0.5) * 2;
        this.gravity = 0.2;
        this.bounce = 0.68;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        
        // Historial ampliado para una estela más suave y fluida
        this.history = [];
        const colors = ["#48cae4", "#00b4d8", "#0077b6", "#90e0ef", "#ade8f4", "#f72585", "#7209b7", "#4cc9f0"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw(context) {
        // --- ESTELA CÓSMICA AVANZADA (TRAIL DE ALTA FIDELIDAD) ---
        if (this.history.length > 1) {
            context.save();
            context.beginPath();
            context.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                context.lineTo(this.history[i].x, this.history[i].y);
            }
            context.strokeStyle = this.color;
            context.lineWidth = this.radius * 0.45;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.globalAlpha = 0.3;
            context.shadowBlur = 15;
            context.shadowColor = this.color;
            context.stroke();
            context.restore();

            // Partículas brillantes dispersas en la estela
            for (let i = 0; i < this.history.length; i += 2) {
                let p = this.history[i];
                let alpha = (i / this.history.length) * 0.5;
                context.beginPath();
                context.arc(p.x, p.y, this.radius * 0.3, 0, Math.PI * 2);
                context.fillStyle = "#ffffff";
                context.globalAlpha = alpha;
                context.fill();
            }
            context.globalAlpha = 1.0;
        }

        context.save();
        context.translate(this.posX, this.posY);
        context.rotate(this.rotation);

        // Aura brillante principal
        context.shadowBlur = 20;
        context.shadowColor = this.color;

        // Diseño: Hexágono tecnológico
        context.beginPath();
        let sides = 6;
        for (let i = 0; i < sides; i++) {
            let angle = (i * 2 * Math.PI) / sides;
            let x = this.radius * Math.cos(angle);
            let y = this.radius * Math.sin(angle);
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        }
        context.closePath();
        
        context.fillStyle = "rgba(11, 19, 43, 0.9)";
        context.fill();
        context.lineWidth = 2.5;
        context.strokeStyle = this.color;
        context.stroke();

        // Nodo central de datos
        context.beginPath();
        context.arc(0, 0, this.radius * 0.35, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();

        context.restore();
    }

    update(context) {
        // Registrar posición para la estela (mayor longitud para un flujo más elegante)
        this.history.push({ x: this.posX, y: this.posY });
        if (this.history.length > 12) {
            this.history.shift();
        }

        // Reglas de velocidad progresiva según el contador
        let speedMultiplier = 1;
        if (counter > 20) {
            speedMultiplier = 1.7;
        } else if (counter > 10) {
            speedMultiplier = 1.3;
        }

        this.dy += this.gravity;
        this.posY += this.dy * speedMultiplier;
        this.posX += this.dx;
        this.rotation += this.rotationSpeed;

        // Rebote en el piso inferior con efecto parabólico
        if (this.posY + this.radius > window_height) {
            this.posY = window_height - this.radius;
            this.dy = -this.dy * this.bounce;

            if (Math.abs(this.dy) < 1.5) {
                this.reset();
            }
        }

        // Rebotes laterales
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        this.draw(context);
    }

    reset() {
        this.posY = -Math.random() * 500 - this.radius;
        this.posX = Math.random() * (window_width - this.radius * 2) + this.radius;
        this.dy = Math.random() * 2 + 1;
        this.dx = (Math.random() - 0.5) * 2;
        this.history = [];
    }
}

let objects = [];
let counter = 0;

function generateObjects(n) {
    for (let i = 0; i < n; i++) {
        let radius = 26;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = (Math.random() * window_height) - 400; 
        let speed = Math.random() * 2 + 1;
        objects.push(new GameObject(x, y, radius, speed));
    }
}

// Detección de clics para eliminar objetos y actualizar contador
window.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    objects.forEach((obj, index) => {
        let dx = mouseX - obj.posX;
        let dy = mouseY - obj.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < obj.radius) {
            objects.splice(index, 1);
            counter++;

            let radius = 26;
            let x = Math.random() * (window_width - radius * 2) + radius;
            let y = -Math.random() * 300 - 50;
            let speed = Math.random() * 2 + 1;
            objects.push(new GameObject(x, y, radius, speed));
        }
    });
});

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    
    // Dibujar la imagen de fondo cubriendo todo el canvas
    ctx.drawImage(bgImage, 0, 0, window_width, window_height);

    // Panel HUD superior derecho
    ctx.fillStyle = "rgba(0, 180, 216, 0.12)";
    ctx.strokeStyle = "#00b4d8";
    ctx.lineWidth = 1.5;
    ctx.fillRect(window_width - 195, 15, 175, 45);
    ctx.strokeRect(window_width - 195, 15, 175, 45);

    ctx.fillStyle = "#90e0ef";
    ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`ELIMINADAS: ${counter}`, window_width - 30, 43);

    objects.forEach(obj => {
        obj.update(ctx);
    });

    requestAnimationFrame(animate);
}

generateObjects(25);
animate();