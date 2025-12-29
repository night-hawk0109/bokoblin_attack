const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;

// Player
const player = {
x: 180,
y: 440,
width: 75,
height: 65,
speed: 3};

// Animated spaceship image (place spaceship.gif in the project root)
const shipImg = new Image();
shipImg.src = "spaceship.gif";

// Monster image (place monster.gif in the project root)
const monsterImg = new Image();
monsterImg.src = "monster.gif";

// Background image (place background.gif in the project root)
const bgImg = new Image();
bgImg.src = "background.gif";

let bullets = [];
let monsters = [];
let spawnTimer = 0;
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
speed: 3
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

// Spawn monsters
spawnTimer++;
if (spawnTimer > 120) { // Spawn every 2 seconds at 60fps
monsters.push({
x: Math.random() * (canvas.width - 50),
y: 0,
width: 50,
height: 50,
speed: 1
});
spawnTimer = 0;
}

// Move monsters
monsters.forEach((m) => {
m.y += m.speed;
m.x += (player.x - m.x) * 0.005; // Move towards player horizontally
});
monsters = monsters.filter((m) => m.y < canvas.height);

// Collision detection
bullets.forEach((b, bi) => {
monsters.forEach((m, mi) => {
if (b.x < m.x + m.width &&
b.x + 4 > m.x &&
b.y < m.y + m.height &&
b.y + 10 > m.y) {
// Hit!
bullets.splice(bi, 1);
monsters.splice(mi, 1);
score++;
}
});
});
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background
if (bgImg.complete && bgImg.naturalWidth !== 0) {
	ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
} else {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

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

// Monsters
monsters.forEach((m) => {
if (monsterImg.complete && monsterImg.naturalWidth !== 0) {
	ctx.drawImage(monsterImg, m.x, m.y, m.width, m.height);
} else {
	ctx.fillStyle = "purple";
	ctx.fillRect(m.x, m.y, m.width, m.height);
}

// Draw dark green diamond around monster
const cx = m.x + m.width / 2;
const cy = m.y + m.height / 2;
const r = 40; // size of diamond
ctx.fillStyle = "darkgreen";
for (let dy = -r; dy <= r; dy += 2) {
	const width = r - Math.abs(dy);
	for (let dx = -width; dx <= width; dx += 2) {
		ctx.fillRect(cx + dx, cy + dy, 2, 2);
	}
}
});

// Score
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText("Score: " + score, 10, 30);
}

function loop() {
update();
draw();
requestAnimationFrame(loop);
}

loop();