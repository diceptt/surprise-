// Simple heart-collecting mini-game for Monica
(() => {
	const gameArea = document.getElementById('gameArea');
	const scoreEl = document.getElementById('score');
	const targetEl = document.getElementById('target');
	const startBtn = document.getElementById('startBtn');
	const resetBtn = document.getElementById('resetBtn');
	const reveal = document.getElementById('reveal');
	const closeReveal = document.getElementById('closeReveal');
	const playAgain = document.getElementById('playAgain');

	let score = 0;
	let target = 10;
	let running = false;
	let spawnInterval = null;

	function updateScore() {
		scoreEl.textContent = score;
		targetEl.textContent = target;
	}

	function random(min, max) { return Math.random() * (max - min) + min; }

	function spawnHeart() {
		const heart = document.createElement('span');
		heart.className = 'heart';
		heart.textContent = '❤';
		const areaRect = gameArea.getBoundingClientRect();
		const size = Math.max(20, Math.floor(random(22, 46)));
		heart.style.fontSize = size + 'px';
		const maxLeft = Math.max(10, areaRect.width - size - 10);
		const left = Math.floor(random(8, maxLeft));
		heart.style.left = left + 'px';
		const duration = random(3.4, 7.8).toFixed(2) + 's';
		heart.style.animation = `fall ${duration} linear forwards`;
		// small rotation
		heart.style.transform = `translateY(-10vh)`;

		// click to collect
		heart.addEventListener('click', (e) => {
			e.stopPropagation();
			collectHeart(heart);
		}, { once: true });

		// remove when finished falling
		heart.addEventListener('animationend', () => {
			if (heart.parentNode) heart.parentNode.removeChild(heart);
		});

		gameArea.appendChild(heart);
	}

	function collectHeart(heartEl) {
		// pop animation
		heartEl.style.transition = 'transform 220ms ease, opacity 200ms ease';
		heartEl.style.transform = 'scale(1.6) translateY(-8px)';
		heartEl.style.opacity = '0';
		setTimeout(() => { if (heartEl.parentNode) heartEl.parentNode.removeChild(heartEl); }, 250);
		score += 1;
		updateScore();
		if (score >= target) win();
	}

	function win() {
		stopGame();
		// create a small burst of hearts
		for (let i = 0; i < 24; i++) {
			const h = document.createElement('span');
			h.className = 'heart';
			h.textContent = '❤';
			h.style.left = (random(10, gameArea.clientWidth - 30) | 0) + 'px';
			h.style.fontSize = (random(12, 34) | 0) + 'px';
			h.style.animation = `fall ${random(1.4, 2.6).toFixed(2)}s linear forwards`;
			gameArea.appendChild(h);
			setTimeout(()=>{ if (h.parentNode) h.parentNode.removeChild(h); }, 2800);
		}
		// reveal personal message
		setTimeout(() => { reveal.classList.remove('hidden'); }, 600);
	}

	function startGame() {
		if (running) return;
		running = true;
		score = 0;
		updateScore();
		spawnInterval = setInterval(() => {
			// spawn between 1 and 3 hearts at a time
			const count = Math.random() < 0.65 ? 1 : 2;
			for (let i = 0; i < count; i++) spawnHeart();
		}, 700);
		// initial burst
		for (let i=0;i<3;i++) setTimeout(spawnHeart, i*200);
	}

	function stopGame() {
		running = false;
		if (spawnInterval) { clearInterval(spawnInterval); spawnInterval = null; }
	}

	function resetGame() {
		stopGame();
		score = 0;
		updateScore();
		// remove existing hearts
		document.querySelectorAll('.heart').forEach(h => h.remove());
		reveal.classList.add('hidden');
	}

	// Controls
	startBtn.addEventListener('click', () => startGame());
	resetBtn.addEventListener('click', () => resetGame());
	closeReveal.addEventListener('click', () => { reveal.classList.add('hidden'); });
	playAgain.addEventListener('click', () => { reveal.classList.add('hidden'); resetGame(); startGame(); });

	// Make target editable by editing the target element in HTML
	const t = parseInt(targetEl.textContent, 10);
	if (!Number.isNaN(t) && t > 0) target = t;

	// Small helpful tips: allow clicking the game area to spawn a heart
	gameArea.addEventListener('click', (e) => {
		if (!running) return;
		// spawn a heart near click
		const heart = document.createElement('span');
		heart.className = 'heart';
		heart.textContent = '❤';
		const rect = gameArea.getBoundingClientRect();
		const x = Math.max(8, Math.min(rect.width - 30, e.clientX - rect.left - 10));
		heart.style.left = x + 'px';
		heart.style.fontSize = (random(20,40)|0) + 'px';
		heart.style.animation = `fall ${random(3,6).toFixed(2)}s linear forwards`;
		heart.addEventListener('click', (ev)=>{ ev.stopPropagation(); collectHeart(heart); }, { once: true });
		gameArea.appendChild(heart);
	});

	// Initial UI update
	updateScore();
})();
