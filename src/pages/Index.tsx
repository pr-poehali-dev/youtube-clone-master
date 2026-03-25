import { useState, useEffect, useMemo } from 'react';
import { User, Video, AppPage } from '@/data/types';
import { VIDEOS, SHORTS, ALL_VIDEOS, CATEGORIES, formatNumber } from '@/data/mockData';
import SplashScreen from '@/components/SplashScreen';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoCard from '@/components/VideoCard';
import VideoPlayer from '@/components/VideoPlayer';
import ShortsPlayer from '@/components/ShortsPlayer';
import UploadModal from '@/components/UploadModal';
import LoginModal from '@/components/LoginModal';
import AdminPanel from '@/components/AdminPanel';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState<AppPage>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedShort, setSelectedShort] = useState<Video | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userVideos, setUserVideos] = useState<Video[]>([]);

  const allVideos = useMemo(() => [...VIDEOS, ...userVideos], [userVideos]);

  const filteredVideos = useMemo(() => {
    let list = allVideos;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.channel.name.toLowerCase().includes(q) ||
        v.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== 'Все') {
      list = list.filter(v => v.category === activeCategory);
    }
    return list;
  }, [allVideos, searchQuery, activeCategory]);

  const handleVideoSelect = (v: Video) => {
    if (v.type === 'short') {
      setSelectedShort(v);
      setPage('shorts');
    } else {
      setSelectedVideo(v);
      setPage('video');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (p: string) => {
    setPage(p as AppPage);
    if (p !== 'video') setSelectedVideo(null);
    if (p !== 'shorts') setSelectedShort(null);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage('home');
  };

  const handleUpload = (v: Video) => {
    setUserVideos(prev => [v, ...prev]);
  };

  const mainLeft = sidebarOpen ? 'lg:pl-60' : 'lg:pl-20';

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen edge-glow-top edge-glow-bottom">
      <Header
        currentUser={currentUser}
        onLogin={() => setShowLogin(true)}
        onLogout={() => setCurrentUser(null)}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        onUpload={() => currentUser ? setShowUpload(true) : setShowLogin(true)}
        searchQuery={searchQuery}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        open={sidebarOpen}
        currentPage={page}
        onNavigate={p => handleNavigate(p)}
        isAdmin={currentUser?.role === 'admin'}
      />

      {/* Main content */}
      <main className={`pt-14 transition-all duration-300 ${mainLeft}`}>
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">

          {/* HOME / TRENDING / SUBSCRIPTIONS / LIBRARY */}
          {['home', 'trending', 'subscriptions', 'library'].includes(page) && (
            <div className="animate-fade-in">
              {/* Category chips */}
              {page === 'home' && (
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none' }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`chip flex-shrink-0 ${activeCategory === cat ? 'active' : ''}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Page title for non-home */}
              {page !== 'home' && (
                <div className="flex items-center gap-3 mb-6">
                  <Icon
                    name={page === 'trending' ? 'TrendingUp' : page === 'subscriptions' ? 'Rss' : 'BookOpen'}
                    size={22} className="text-red-400" fallback="Circle"
                  />
                  <h1 className="text-2xl font-bold font-display text-white">
                    {page === 'trending' ? 'В тренде' : page === 'subscriptions' ? 'Подписки' : 'Библиотека'}
                  </h1>
                </div>
              )}

              {/* Search banner */}
              {searchQuery && (
                <div className="flex items-center gap-3 mb-5 p-4 glass rounded-2xl">
                  <Icon name="Search" size={18} className="text-white/50" />
                  <span className="text-sm text-white/70">
                    По запросу <span className="text-white font-semibold">«{searchQuery}»</span> найдено{' '}
                    <span className="text-white font-semibold">{filteredVideos.length}</span> видео
                  </span>
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('Все'); }}
                    className="ml-auto text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
                    <Icon name="X" size={13} /> Сбросить
                  </button>
                </div>
              )}

              {/* Shorts row on home */}
              {page === 'home' && !searchQuery && activeCategory === 'Все' && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'hsl(0,85%,55%)' }}>
                        <Icon name="Zap" size={14} className="text-white" />
                      </div>
                      <h2 className="text-base font-bold text-white">Shorts</h2>
                    </div>
                    <button onClick={() => setPage('shorts')}
                      className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 transition-colors">
                      Все Shorts <Icon name="ChevronRight" size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {SHORTS.map((s, i) => (
                      <div key={s.id} onClick={() => handleVideoSelect(s)}
                        className="shorts-card cursor-pointer group animate-fade-in"
                        style={{ animationDelay: `${i * 0.05}s`, aspectRatio: '9/16' }}>
                        <img src={s.thumbnail} alt={s.title}
                          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
                        <div className="absolute inset-0"
                          style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)' }} />
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                          style={{ background: 'hsl(0,85%,55%)' }}>SHORT</div>
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">{s.title}</p>
                          <p className="text-[10px] text-white/60 mt-0.5">{formatNumber(s.views)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video grid */}
              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredVideos.map((v, i) => (
                    <div key={v.id} style={{ animationDelay: `${i * 0.04}s` }}>
                      <VideoCard video={v} onClick={handleVideoSelect} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/25">
                  <Icon name="SearchX" size={48} fallback="Circle" />
                  <p className="text-lg font-medium">Ничего не найдено</p>
                  <p className="text-sm">Попробуйте другой запрос или категорию</p>
                </div>
              )}
            </div>
          )}

          {/* VIDEO PLAYER */}
          {page === 'video' && selectedVideo && (
            <VideoPlayer
              video={selectedVideo}
              currentUser={currentUser}
              onVideoSelect={handleVideoSelect}
              onLogin={() => setShowLogin(true)}
            />
          )}

          {/* SHORTS */}
          {page === 'shorts' && (
            <ShortsPlayer
              initialShort={selectedShort || undefined}
              currentUser={currentUser}
              onLogin={() => setShowLogin(true)}
            />
          )}

          {/* ADMIN */}
          {page === 'admin' && currentUser?.role === 'admin' && <AdminPanel />}
          {page === 'admin' && currentUser?.role !== 'admin' && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Icon name="ShieldOff" size={48} className="text-red-400/50" fallback="Circle" />
              <p className="text-xl font-bold text-white/50">Нет доступа</p>
              <p className="text-sm text-white/30">Требуются права администратора</p>
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={user => { setCurrentUser(user); setShowLogin(false); }}
        />
      )}
      {showUpload && currentUser && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          currentUser={currentUser}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
