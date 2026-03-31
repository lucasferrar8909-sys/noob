let allGames = [];

async function init() {
    try {
        const response = await fetch('games.json');
        allGames = await response.json();
        renderGames(allGames);
    } catch (error) {
        console.error('Error loading games:', error);
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allGames.filter(game => 
            game.title.toLowerCase().includes(query) || 
            game.category.toLowerCase().includes(query)
        );
        renderGames(filtered);
    });

    // Modal controls
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('toggleFullscreen').onclick = toggleFullscreen;
}

function renderGames(games) {
    const grid = document.getElementById('gamesGrid');
    const noResults = document.getElementById('noResults');
    
    grid.innerHTML = '';
    
    if (games.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'brutal-border bg-zinc-900 cursor-pointer group overflow-hidden break-inside-avoid mb-8';
            card.innerHTML = `
                <div class="relative overflow-hidden">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-auto transition-all duration-500 group-hover:scale-110" referrerpolicy="no-referrer">
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span class="brutal-btn">PLAY NOW</span>
                    </div>
                </div>
                <div class="p-4 border-t-2 border-[#00ffff] bg-black/50">
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="font-bold text-xl uppercase truncate pr-2 text-[#00ffff] neon-text">${game.title}</h3>
                        <span class="text-[10px] font-mono bg-[#00ffff] text-black px-1 leading-tight font-bold shadow-[0_0_5px_#00ffff]">${game.category}</span>
                    </div>
                </div>
            `;
            card.onclick = () => openGame(game);
            grid.appendChild(card);
        });
    }
}

function openGame(game) {
    const modal = document.getElementById('gameModal');
    const iframe = document.getElementById('gameIframe');
    const title = document.getElementById('modalTitle');
    const link = document.getElementById('externalLink');

    title.innerText = game.title;
    iframe.src = game.iframeUrl;
    link.href = game.iframeUrl;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    const iframe = document.getElementById('gameIframe');
    
    iframe.src = '';
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

function toggleFullscreen() {
    const content = document.getElementById('modalContent');
    content.classList.toggle('fullscreen');
}

init();
