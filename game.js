const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let gameOver = false;

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

// Diamond image (place diamond.gif in the project root)
const diamondImg = new Image();
diamondImg.src = "diamond.gif";

// Bullet image (place bullet.gif in the project root)
const bulletImg = new Image();
bulletImg.src = "bullet.gif";

let bullets = [];
let monsters = [];
let spawnTimer = 0;
let keys = {};

// Responsive canvas: keep logical size but scale displayed size
function resizeCanvas() {
	const ratio = canvas.height / canvas.width;
	const vw = Math.min(window.innerWidth - 20, 400);
	canvas.style.width = vw + 'px';
	canvas.style.height = (vw * ratio) + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
		speed: 3,
		width: 4,
		height: 10,
		color: 'yellow'
	});
}


// Touch / mouse controls: wire buttons with data-action attributes
function bindTouchControls() {
	const buttons = document.querySelectorAll('.touch-controls .btn');
	buttons.forEach((btn) => {
		const action = btn.dataset.action;
		// touchstart
		btn.addEventListener('touchstart', (ev) => {
			ev.preventDefault();
			if (action === 'shoot') shoot(); else keys[action] = true;
		}, {passive: false});
		// touchend
		btn.addEventListener('touchend', (ev) => {
			ev.preventDefault();
			if (action !== 'shoot') keys[action] = false;
		});
		// mouse support for desktop testing
		btn.addEventListener('mousedown', (ev) => {
			ev.preventDefault();
			if (action === 'shoot') shoot(); else keys[action] = true;
		});
		document.addEventListener('mouseup', () => { if (action !== 'shoot') keys[action] = false; });
	});
}
bindTouchControls();

// Game loop
function update() {
// Stop updating when game is over
if (gameOver) return;
// Move player
if ((keys["a"] || keys['ArrowLeft'] || keys['left']) && player.x > 0) player.x -= player.speed;
if ((keys["d"] || keys['ArrowRight'] || keys['right']) && player.x < canvas.width - player.width)
	player.x += player.speed;
if ((keys["w"] || keys['ArrowUp'] || keys['up']) && player.y > 0) player.y -= player.speed;
if ((keys["s"] || keys['ArrowDown'] || keys['down']) && player.y < canvas.height - player.height)
	player.y += player.speed;

// Move bullets
bullets.forEach((b) => (b.y -= b.speed));
bullets = bullets.filter((b) => b.y + (b.height || 0) > 0);

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

// Move monsters, check collision with player, and remove off-screen
for (let i = monsters.length - 1; i >= 0; i--) {
	const m = monsters[i];
	m.y += m.speed;
	m.x += (player.x - m.x) * 0.005; // Move towards player horizontally

	// Collision with player
	if (m.x < player.x + player.width &&
		m.x + m.width > player.x &&
		m.y < player.y + player.height &&
		m.y + m.height > player.y) {
		monsters.splice(i, 1);
		lives--;
		if (lives <= 0) {
			gameOver = true;
		}
		continue;
	}

	// Remove off-screen monsters
	if (m.y >= canvas.height) monsters.splice(i, 1);
}

// Collision detection
bullets.forEach((b, bi) => {
monsters.forEach((m, mi) => {
if (b.x < m.x + m.width &&
	b.x + (b.width || 4) > m.x &&
	b.y < m.y + m.height &&
	b.y + (b.height || 10) > m.y) {
// Hit!
bullets.splice(bi, 1);
monsters.splice(mi, 1);
score++;
// mirror score into DOM if present
const scoreEl = document.getElementById('score');
if (scoreEl) scoreEl.textContent = score;
}
});
});
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Background
if (bgImg.complete && bgImg.naturalWidth !== 0) {
	ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

// Player
// If the GIF has loaded, draw it; otherwise draw a placeholder rectangle
if (shipImg.complete && shipImg.naturalWidth !== 0) {
	ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);
}

// Bullets
bullets.forEach((b) => {
	const bw = b.width || 4;
	const bh = b.height || 10;
	if (bulletImg.complete && bulletImg.naturalWidth !== 0) {
		ctx.drawImage(bulletImg, b.x, b.y, bw, bh);
	} else {
		ctx.fillStyle = b.color || 'yellow';
		ctx.fillRect(b.x, b.y, bw, bh);
	}
});

// Monsters
monsters.forEach((m) => {
if (monsterImg.complete && monsterImg.naturalWidth !== 0) {
	ctx.drawImage(monsterImg, m.x, m.y, m.width, m.height);
}

// Draw diamond image around monster
const cx = m.x + m.width / 2;
const cy = m.y + m.height / 2;
const size = 80; // size of diamond image
if (diamondImg.complete && diamondImg.naturalWidth !== 0) {
	ctx.drawImage(diamondImg, cx - size / 2, cy - size / 2, size, size);
}
});

// Score
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText("Score: " + score, 10, 30);
// Lives (hearts)
ctx.fillStyle = "red";
ctx.fillText("♥".repeat(Math.max(0, lives)), canvas.width - 80, 30);

// Game over overlay
if (gameOver) {
	ctx.fillStyle = "rgba(0,0,0,0.6)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.font = "40px Arial";
	ctx.textAlign = "center";
	ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
	ctx.textAlign = "left";
	// Show restart button (DOM) so the player can restart
	if (typeof showRestartButton === 'function') showRestartButton();
	return;
}
}

function loop() {
	update();
	draw();
	if (!gameOver) requestAnimationFrame(loop);
}

loop();

// --- Restart button and reset logic ---
// Create a centered DOM button and hide it until game over
const restartBtn = document.createElement('button');
restartBtn.id = 'restartBtn';
restartBtn.textContent = 'Restart';
Object.assign(restartBtn.style, {
	position: 'fixed',
	left: '50%',
	top: '60%',
	transform: 'translate(-50%, -50%)',
	padding: '12px 20px',
	fontSize: '18px',
	zIndex: 1000,
	display: 'none',
	cursor: 'pointer'
});
document.body.appendChild(restartBtn);

function showRestartButton() { restartBtn.style.display = 'block'; }
function hideRestartButton() { restartBtn.style.display = 'none'; }

function resetGame() {
	lives = 3;
	score = 0;
	monsters = [];
	bullets = [];
	spawnTimer = 0;
	player.x = 180;
	player.y = 440;
	gameOver = false;
	hideRestartButton();
	const scoreEl = document.getElementById('score');
	if (scoreEl) scoreEl.textContent = score;
	// Restart the loop
	requestAnimationFrame(loop);
}

restartBtn.addEventListener('click', resetGame);