import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { User, Video, VideoType } from '@/data/types';
import { CHANNELS } from '@/data/mockData';

interface UploadModalProps {
  onClose: () => void;
  currentUser: User;
  onUpload: (video: Video) => void;
}

type Step = 'select' | 'details' | 'done';

export default function UploadModal({ onClose, currentUser, onUpload }: UploadModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [videoType, setVideoType] = useState<VideoType>('video');
  const [dragOver, setDragOver] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Технологии');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setStep('details');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('video/')) handleFile(f);
  };

  const handleSubmit = () => {
    if (!title || !file) return;
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        const newVideo: Video = {
          id: `u-${Date.now()}`,
          type: videoType,
          title,
          description,
          thumbnail: videoType === 'short'
            ? 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=360&h=640&fit=crop'
            : 'https://images.unsplash.com/photo-1536240478700-b869ad10e9be?w=640&h=360&fit=crop',
          videoUrl: URL.createObjectURL(file),
          channel: { ...CHANNELS[0], name: currentUser.username, id: currentUser.id },
          views: 0, likes: 0, dislikes: 0,
          comments: [],
          duration: '0:00',
          uploadedAt: 'только что',
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          category,
        };
        onUpload(newVideo);
        setUploading(false);
        setStep('done');
      }
      setProgress(p);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-heavy rounded-3xl p-6 animate-scale-in"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-display">Загрузить видео</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Icon name="X" size={18} className="text-white/70" />
          </button>
        </div>

        {step === 'select' && (
          <div className="space-y-5 animate-fade-in">
            {/* Type selector */}
            <div className="flex gap-2 p-1 glass rounded-2xl">
              {(['video', 'short'] as VideoType[]).map(t => (
                <button key={t} onClick={() => setVideoType(t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    videoType === t ? 'btn-brand' : 'text-white/50 hover:text-white/80'
                  }`}>
                  <Icon name={t === 'video' ? 'Video' : 'Zap'} size={16} />
                  {t === 'video' ? 'Обычное видео' : 'Shorts'}
                </button>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                dragOver
                  ? 'border-red-400/60 bg-red-400/08'
                  : 'border-white/15 hover:border-white/30 hover:bg-white/03'
              }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                dragOver ? 'bg-red-400/20' : 'bg-white/06'
              }`}>
                <Icon name="Upload" size={28} className={dragOver ? 'text-red-400' : 'text-white/40'} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/80">
                  Перетащите файл или <span style={{ color: 'hsl(0,85%,60%)' }}>выберите с устройства</span>
                </p>
                <p className="text-xs text-white/35 mt-1">MP4, MOV, AVI, WebM · до 2GB</p>
                {videoType === 'short' && (
                  <p className="text-xs text-blue-400/70 mt-1">Shorts: вертикальный формат 9:16, до 60 сек</p>
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="video/*" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 p-3 glass rounded-xl mb-2">
              <Icon name="FileVideo" size={18} className="text-green-400" />
              <span className="text-sm text-white/70 flex-1 truncate">{file?.name}</span>
              <button onClick={() => setStep('select')} className="text-xs text-white/40 hover:text-white/70">
                <Icon name="X" size={14} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Название *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Введите название видео..."
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>

            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Описание</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Расскажите о видео..."
                rows={3}
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none resize-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Категория</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Технологии', 'Кулинария', 'Игры', 'Спорт', 'Путешествия', 'Музыка', 'Наука', 'Образование', 'Юмор'].map(c => (
                    <option key={c} value={c} style={{ background: '#1a1c2e' }}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Теги (через запятую)</label>
                <input value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="тег1, тег2, тег3"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Загрузка...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-glass">
                  <div className="progress-glass-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button onClick={handleSubmit} disabled={!title || uploading}
              className="w-full py-3 rounded-xl font-semibold text-sm btn-brand disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? 'Загружаем...' : 'Опубликовать'}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center gap-5 py-6 animate-scale-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{ background: 'rgba(34,197,94,0.2)', border: '2px solid rgba(34,197,94,0.4)' }}>
              <Icon name="CheckCircle" size={40} className="text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Видео опубликовано!</h3>
              <p className="text-sm text-white/50 mt-1">«{title}» успешно загружено на платформу</p>
            </div>
            <button onClick={onClose} className="btn-brand px-8 py-2.5 rounded-full font-semibold">
              Отлично!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
