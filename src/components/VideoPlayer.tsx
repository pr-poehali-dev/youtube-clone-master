import { useState, useRef, useEffect } from 'react';
import { Video, User, Comment } from '@/data/types';
import { formatNumber, VIDEOS } from '@/data/mockData';
import Icon from '@/components/ui/icon';
import VideoCard from './VideoCard';

interface VideoPlayerProps {
  video: Video;
  currentUser: User | null;
  onVideoSelect: (v: Video) => void;
  onLogin: () => void;
}

export default function VideoPlayer({ video, currentUser, onVideoSelect, onLogin }: VideoPlayerProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [subscribed, setSubscribed] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(video.comments);
  const [likeAnim, setLikeAnim] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLiked(false);
    setLikeCount(video.likes);
    setSubscribed(false);
    setComments(video.comments);
  }, [video]);

  const handleLike = () => {
    if (!currentUser) { onLogin(); return; }
    setLiked(!liked);
    setLikeCount(n => liked ? n - 1 : n + 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
  };

  const handleComment = () => {
    if (!currentUser) { onLogin(); return; }
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `new-${Date.now()}`,
      videoId: video.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatar,
      text: commentText,
      likes: 0,
      createdAt: 'только что',
      type: 'positive',
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const related = VIDEOS.filter(v => v.id !== video.id).slice(0, 6);

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Main column */}
      <div className="flex-1 min-w-0">
        {/* Video */}
        <div className="rounded-2xl overflow-hidden bg-black"
          style={{ boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}>
          <video ref={videoRef} src={video.videoUrl} controls className="w-full aspect-video" poster={video.thumbnail} />
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-xl font-bold text-white leading-snug">{video.title}</h1>
        </div>

        {/* Channel + actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
          {/* Channel */}
          <div className="flex items-center gap-3">
            <img src={video.channel.avatar} alt={video.channel.name}
              className="w-10 h-10 rounded-full ring-2 ring-white/10 object-cover" />
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-white">{video.channel.name}</p>
                {video.channel.verified && <Icon name="BadgeCheck" size={14} className="text-blue-400" />}
              </div>
              <p className="text-xs text-white/45">{formatNumber(video.channel.subscribers)} подписчиков</p>
            </div>
            <button onClick={() => setSubscribed(!subscribed)}
              className={`ml-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                subscribed
                  ? 'bg-white/10 text-white/70 hover:bg-white/15'
                  : 'btn-brand'
              }`}>
              {subscribed ? 'Подписан' : 'Подписаться'}
            </button>
          </div>

          {/* Like/Share/etc */}
          <div className="flex items-center gap-2">
            <div className="flex items-center glass rounded-full overflow-hidden">
              <button onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:bg-white/08 ${
                  liked ? 'text-blue-400' : 'text-white/70'
                }`}>
                <Icon name="ThumbsUp" size={16}
                  className={`transition-transform ${likeAnim ? 'animate-like-bounce' : ''}`} />
                {formatNumber(likeCount)}
              </button>
              <div className="w-px h-5 bg-white/10" />
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/08 transition-all">
                <Icon name="ThumbsDown" size={16} />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-white/70 hover:bg-white/15 transition-all">
              <Icon name="Share2" size={16} />
              Поделиться
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-white/70 hover:bg-white/15 transition-all">
              <Icon name="Download" size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full glass text-white/70 hover:bg-white/15 transition-all">
              <Icon name="MoreHorizontal" size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-3 glass rounded-2xl p-4 cursor-pointer" onClick={() => setShowDesc(!showDesc)}>
          <div className="flex items-center gap-4 text-sm text-white/50 mb-1">
            <span className="font-medium text-white/70">{formatNumber(video.views)} просмотров</span>
            <span>{video.uploadedAt}</span>
            {video.tags.map(t => (
              <span key={t} className="text-blue-400 hover:underline cursor-pointer">#{t}</span>
            ))}
          </div>
          <p className={`text-sm text-white/65 leading-relaxed ${showDesc ? '' : 'line-clamp-2'}`}>
            {video.description}
          </p>
          <button className="text-xs text-white/50 mt-1 font-medium hover:text-white/80">
            {showDesc ? 'Свернуть' : 'Ещё...'}
          </button>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h3 className="text-base font-semibold text-white/80 mb-4">
            {formatNumber(comments.length)} комментариев
          </h3>

          {/* Add comment */}
          {currentUser ? (
            <div className="flex gap-3 mb-6">
              <img src={currentUser.avatar} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
              <div className="flex-1">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Напишите комментарий..."
                  className="w-full bg-transparent border-b border-white/15 pb-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40 transition-colors"
                  onKeyDown={e => e.key === 'Enter' && handleComment()}
                />
                {commentText && (
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setCommentText('')}
                      className="px-4 py-1.5 rounded-full text-sm text-white/60 hover:bg-white/08 transition-colors">
                      Отмена
                    </button>
                    <button onClick={handleComment}
                      className="px-4 py-1.5 rounded-full text-sm font-medium btn-brand">
                      Отправить
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={onLogin}
              className="flex items-center gap-2 text-sm text-blue-400 hover:underline mb-6">
              <Icon name="LogIn" size={14} /> Войдите, чтобы оставить комментарий
            </button>
          )}

          {/* Comment list */}
          <div className="space-y-4">
            {comments.map((c, i) => (
              <div key={c.id} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                <img src={c.authorAvatar} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80">{c.authorName}</span>
                    <span className="text-xs text-white/30">{c.createdAt}</span>
                  </div>
                  <p className="text-sm text-white/65 mt-0.5 leading-relaxed">{c.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
                      <Icon name="ThumbsUp" size={13} />
                      {c.likes > 0 && formatNumber(c.likes)}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
                      <Icon name="ThumbsDown" size={13} />
                    </button>
                    <button className="text-xs text-white/40 hover:text-white/70 transition-colors">
                      Ответить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: related */}
      <div className="w-80 flex-shrink-0 hidden lg:block">
        <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">Далее</h3>
        <div className="space-y-1">
          {related.map(v => (
            <VideoCard key={v.id} video={v} onClick={onVideoSelect} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}