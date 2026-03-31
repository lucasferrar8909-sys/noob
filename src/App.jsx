import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-10 h-10 text-[var(--accent)]" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase italic">
              Unblocked<span className="text-[var(--accent)]">Hub</span>
            </h1>
          </div>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            // Pure Gaming / No AI / No Blocks
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="SEARCH GAMES..."
            className="w-full bg-zinc-900 border-2 border-white p-4 pl-12 font-mono focus:outline-none focus:border-[var(--accent)] transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredGames.map((game) => (
          <motion.div
            key={game.id}
            layoutId={game.id}
            onClick={() => setSelectedGame(game)}
            className="brutal-border bg-zinc-900 cursor-pointer group overflow-hidden"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="brutal-btn">PLAY NOW</span>
              </div>
            </div>
            <div className="p-4 border-t-2 border-white">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-xl uppercase truncate pr-2">{game.title}</h3>
                <span className="text-[10px] font-mono bg-white text-black px-1 leading-tight">
                  {game.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-zinc-800">
          <p className="font-mono text-zinc-500 uppercase tracking-widest">No games found matching your search.</p>
        </div>
      )}

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              layoutId={selectedGame.id}
              className={`bg-zinc-900 border-2 border-white flex flex-col transition-all duration-300 ${
                isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl aspect-video'
              }`}
            >
              {/* Toolbar */}
              <div className="p-3 border-b-2 border-white flex items-center justify-between bg-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <h2 className="ml-2 font-bold uppercase tracking-tight">{selectedGame.title}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="hover:text-[var(--accent)] transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={selectedGame.iframeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent)] transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => {
                      setSelectedGame(null);
                      setIsFullscreen(false);
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; full-screen"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t-2 border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
        <p>© 2026 UNBLOCKED HUB // ALL RIGHTS RESERVED</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
