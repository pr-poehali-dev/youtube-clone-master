import { Video } from '@/data/types';
import { formatNumber } from '@/data/mockData';
import Icon from '@/components/ui/icon';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  variant?: 'default' | 'compact' | 'wide';
}

export default function VideoCard({ video, onClick, variant = 'default' }: VideoCardProps) {
  if (variant === 'compact') {
    return (
      <div onClick={() => onClick(video)}
        className="flex gap-3 cursor-pointer group rounded-xl p-2 hover:bg-white/04 transition-all">
        <div className="video-thumb relative w-32 flex-shrink-0 rounded-lg overflow-hidden aspect-video">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <span className="duration-badge">{video.duration}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 line-clamp-2 leading-snug">{video.title}</p>
          <p className="text-xs text-white/45 mt-1">{video.channel.name}</p>
          <p className="text-xs text-white/30">{formatNumber(video.views)} просмотров · {video.uploadedAt}</p>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onClick(video)}
      className="cursor-pointer group animate-fade-in"
      style={{ animationFillMode: 'both' }}>
      {/* Thumbnail */}
      <div className="video-thumb relative rounded-xl overflow-hidden aspect-video bg-white/05">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center glass"
            style={{ background: 'rgba(239,68,68,0.8)' }}>
            <Icon name="Play" size={20} className="text-white ml-0.5" />
          </div>
        </div>
        {/* Duration */}
        <span className="duration-badge">{video.duration}</span>
        {/* Type badge */}
        {video.type === 'short' && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1"
            style={{ background: 'hsl(0,85%,55%)' }}>
            <Icon name="Zap" size={10} />
            SHORT
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex gap-2.5 mt-2.5 px-0.5">
        {/* Channel avatar */}
        <img src={video.channel.avatar} alt={video.channel.name}
          className="w-9 h-9 rounded-full flex-shrink-0 ring-1 ring-white/10 object-cover" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white/90 line-clamp-2 leading-snug">{video.title}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <p className="text-xs text-white/50">{video.channel.name}</p>
            {video.channel.verified && (
              <Icon name="BadgeCheck" size={12} className="text-blue-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-white/35 mt-0.5">
            {formatNumber(video.views)} просмотров · {video.uploadedAt}
          </p>
        </div>

        {/* More */}
        <button onClick={e => e.stopPropagation()}
          className="w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all flex-shrink-0 mt-0.5">
          <Icon name="MoreVertical" size={14} className="text-white/60" />
        </button>
      </div>
    </div>
  );
}
