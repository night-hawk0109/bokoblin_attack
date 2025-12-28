const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;

// Player
const player = {
x: 180,
y: 460,
width: 75,
height: 65,
speed: 5
};

// Animated spaceship image (place spaceship.gif in the project root)
const shipImg = new Image();
shipImg.src = "spaceship.gif";
let bullets = [];
let keys = {};

// Controls
document.addEventListener("keydown", (e) => {
keys[e.key] = true;
if (e.key === " ") shoot();
});

document.addEventListener("keyup", (e) => {
keys[e.key] = false;
});

function shoot() {
bullets.push({
x: player.x + player.width / 2 - 2,
y: player.y,
speed: 7
});
}

// Game loop
function update() {
// Move player
if (keys["a"] && player.x > 0) player.x -= player.speed;
if (keys["d"] && player.x < canvas.width - player.width)
player.x += player.speed;

// Move bullets
bullets.forEach((b) => (b.y -= b.speed));
bullets = bullets.filter((b) => b.y > 0);
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Player
// If the GIF has loaded, draw it; otherwise draw a placeholder rectangle
if (shipImg.complete && shipImg.naturalWidth !== 0) {
	ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);
} else {
	ctx.fillStyle = "lime";
	ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Bullets
ctx.fillStyle = "red";
bullets.forEach((b) =>
ctx.fillRect(b.x, b.y, 4, 10)
);
}

function loop() {
update();
draw();
requestAnimationFrame(loop);
}

loop();