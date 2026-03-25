import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User } from '@/data/types';
import { ADMIN_USER, MOCK_USERS } from '@/data/mockData';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (username === 'admin_123' && password === 'admin123') {
        onLogin(ADMIN_USER);
        return;
      }
      const user = MOCK_USERS.find(u => u.username === username);
      if (user) { onLogin(user); return; }
      setError('Неверный логин или пароль');
    } else {
      if (!username || !password || !email) { setError('Заполните все поля'); return; }
      if (password.length < 6) { setError('Пароль минимум 6 символов'); return; }
      const newUser: User = {
        id: `u-${Date.now()}`,
        username,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
        role: 'user',
        subscribedChannels: [],
        watchHistory: [],
        likedVideos: [],
        createdAt: new Date().toISOString(),
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm glass-heavy rounded-3xl p-7 animate-scale-in"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'hsl(0,85%,55%)', boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <polygon points="7,5 19,11 7,17" fill="white" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            {mode === 'login' ? 'Вход в ViewTube' : 'Регистрация'}
          </h2>
          <p className="text-xs text-white/40 mt-1">
            {mode === 'login' ? 'Войдите, чтобы смотреть и публиковать' : 'Создайте аккаунт бесплатно'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Логин</label>
            <div className="relative mt-1">
              <Icon name="User" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Ваш никнейм"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Email</label>
              <div className="relative mt-1">
                <Icon name="Mail" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input value={email} onChange={e => setEmail(e.target.value)}
                  type="email" placeholder="your@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Пароль</label>
            <div className="relative mt-1">
              <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={password} onChange={e => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <Icon name={showPass ? 'EyeOff' : 'Eye'} size={14} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm btn-brand mt-2">
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-4">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="font-medium hover:underline" style={{ color: 'hsl(0,85%,60%)' }}>
            {mode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
          </button>
        </p>

        {mode === 'login' && (
          <p className="text-center text-xs text-white/25 mt-2">
            Демо-доступ: <span className="text-white/40 font-mono">admin_123</span> / <span className="text-white/40 font-mono">admin123</span>
          </p>
        )}
      </div>
    </div>
  );
}
