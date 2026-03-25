import Icon from '@/components/ui/icon';
import { ALL_VIDEOS, formatNumber } from '@/data/mockData';

export default function AdminContent() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Управление контентом</h3>
        <div className="flex gap-2">
          <span className="chip"><Icon name="Video" size={13} fallback="Circle" />{ALL_VIDEOS.filter(v => v.type === 'video').length} видео</span>
          <span className="chip active"><Icon name="Zap" size={13} fallback="Circle" />{ALL_VIDEOS.filter(v => v.type === 'short').length} Shorts</span>
        </div>
      </div>
      <div className="space-y-3">
        {ALL_VIDEOS.map(v => (
          <div key={v.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <img src={v.thumbnail} className={`object-cover rounded-xl flex-shrink-0 ${v.type === 'short' ? 'w-10 h-16' : 'w-20 h-12'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white/90 truncate">{v.title}</p>
                {v.type === 'short' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                    style={{ background: 'hsl(0,85%,55%)' }}>SHORT</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <p className="text-xs text-white/45">{v.channel.name}</p>
                <p className="text-xs text-white/30">{formatNumber(v.views)} просмотров</p>
                <p className="text-xs text-white/30">{formatNumber(v.likes)} лайков</p>
                <p className="text-xs text-white/30">{v.comments.length} комментариев</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-xl text-xs font-medium glass text-white/60 hover:text-white/90 transition-colors">
                <Icon name="Edit" size={12} fallback="Circle" />
              </button>
              <button className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-400/15 transition-all">
                <Icon name="Trash2" size={12} fallback="Circle" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
