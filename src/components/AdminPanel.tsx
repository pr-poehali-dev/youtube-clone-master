import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { AdminTab, BoostType, CommentSentiment } from '@/data/types';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminBoost from '@/components/admin/AdminBoost';
import AdminModerationUsers from '@/components/admin/AdminModerationUsers';
import AdminContent from '@/components/admin/AdminContent';

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
  { id: 'boost', label: 'Накрутки', icon: 'Zap' },
  { id: 'moderation', label: 'Модерация', icon: 'Shield' },
  { id: 'users', label: 'Пользователи', icon: 'Users' },
  { id: 'content', label: 'Контент', icon: 'Video' },
];

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('analytics');
  const [boostType, setBoostType] = useState<BoostType>('subscribers');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [boostAmount, setBoostAmount] = useState(1000);
  const [commentSentiment, setCommentSentiment] = useState<CommentSentiment>('positive');
  const [boostLog, setBoostLog] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Admin header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center animate-pulse-glow"
          style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <Icon name="Shield" size={20} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white font-display">Панель администратора</h1>
          <p className="text-xs text-white/40">Управление платформой ViewTube</p>
        </div>
        <div className="ml-auto px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)', color: 'hsl(0,85%,60%)' }}>
          ADMIN ACCESS
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-2xl mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              tab === t.id ? 'btn-brand' : 'text-white/50 hover:text-white/80 hover:bg-white/06'
            }`}>
            <Icon name={t.icon} size={15} fallback="Circle" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'analytics' && <AdminAnalytics />}

      {tab === 'boost' && (
        <AdminBoost
          boostType={boostType}
          setBoostType={setBoostType}
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
          boostAmount={boostAmount}
          setBoostAmount={setBoostAmount}
          commentSentiment={commentSentiment}
          setCommentSentiment={setCommentSentiment}
          boostLog={boostLog}
          setBoostLog={setBoostLog}
          processing={processing}
          setProcessing={setProcessing}
        />
      )}

      {(tab === 'moderation' || tab === 'users') && (
        <AdminModerationUsers tab={tab} />
      )}

      {tab === 'content' && <AdminContent />}
    </div>
  );
}
