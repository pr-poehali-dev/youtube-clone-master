import { Video, Channel, Comment, User } from './types';

export const FAKE_NAMES = [
  'Алексей Громов', 'Мария Светлова', 'Дмитрий Кузнецов', 'Анна Петрова',
  'Сергей Волков', 'Ольга Соколова', 'Иван Морозов', 'Екатерина Зайцева',
  'Николай Орлов', 'Татьяна Белова', 'Андрей Козлов', 'Наталья Новикова',
  'Максим Лебедев', 'Юлия Попова', 'Артём Соловьев', 'Валерия Крылова',
  'Павел Федоров', 'Ирина Симонова', 'Роман Тихонов', 'Алина Борисова',
  'Глеб Макаров', 'Диана Степанова', 'Кирилл Захаров', 'Полина Гусева',
  'Владимир Сергеев', 'Ксения Романова', 'Тимур Куликов', 'Дарья Фролова',
  'Евгений Блинов', 'Светлана Пономарева',
];

export const FAKE_AVATARS = FAKE_NAMES.map((_, i) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(FAKE_NAMES[i])}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
);

export const CHANNELS: Channel[] = [
  {
    id: 'ch1', name: 'TechMaster Pro', handle: '@techmaster',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech&backgroundColor=e74c3c',
    subscribers: 2400000, verified: true,
    description: 'Технологии, гаджеты, обзоры. Каждую неделю новые видео!',
  },
  {
    id: 'ch2', name: 'Готовим Вместе', handle: '@cooktogether',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=cook&backgroundColor=27ae60',
    subscribers: 890000, verified: true,
    description: 'Рецепты со всего мира. Просто, вкусно, красиво.',
  },
  {
    id: 'ch3', name: 'GameZone RU', handle: '@gamezone',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=game&backgroundColor=9b59b6',
    subscribers: 5100000, verified: true,
    description: 'Игры, стримы, обзоры. Лучший игровой канал!',
  },
  {
    id: 'ch4', name: 'Fitness & Life', handle: '@fitnesslife',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=fit&backgroundColor=e67e22',
    subscribers: 320000, verified: false,
    description: 'Тренировки, питание, мотивация каждый день.',
  },
  {
    id: 'ch5', name: 'Путешествия 360', handle: '@travel360',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=travel&backgroundColor=3498db',
    subscribers: 1700000, verified: true,
    description: 'Мир без границ. Путешествия, влоги, советы туристам.',
  },
  {
    id: 'ch6', name: 'МузыкаLife', handle: '@musiclife',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=music&backgroundColor=e91e63',
    subscribers: 430000, verified: false,
    description: 'Каверы, разборы и живые выступления.',
  },
];

const generateComments = (videoId: string, count: number): Comment[] => {
  const positiveTexts = [
    'Отличное видео! Очень полезно, спасибо большое!',
    'Лучший контент на всём ютубе, подписался давно!',
    'Ты молодец, так держать! Жду ещё больше таких видео.',
    'Это просто шедевр, пересмотрел уже три раза!',
    'Спасибо за такой качественный контент!',
    'Вот это да! Вот за что я люблю этот канал.',
    'Красиво снято и хорошо объяснено, всё понял с первого раза!',
    'Подписался давно и не пожалел. Продолжай в том же духе!',
  ];
  const neutralTexts = [
    'Интересно, но не всё понял. Можешь объяснить подробнее?',
    'Видео неплохое, но я ожидал чуть больше деталей.',
    'Смотрел внимательно. Есть полезные моменты.',
    'Хм, надо обдумать это. Спасибо за точку зрения.',
    'Не совсем согласен, но уважаю твоё мнение.',
    'Посмотрел, теперь буду знать.',
    'Ок, и что дальше?',
    'Неплохо, но можно лучше.',
  ];
  const hateTexts = [
    'Это полная ерунда, зря потратил время.',
    'Скучно и неинформативно, дизлайк.',
    'Не понимаю зачем это снимать вообще.',
    'Ты вообще в теме? Так нельзя делать.',
    'Хуже видео не видел за всю жизнь.',
    'Стыдно за такой контент.',
    'Отписался, больше не интересно.',
    'Всё неправильно, переснимай.',
  ];
  return Array.from({ length: count }, (_, i) => {
    const type: 'positive' | 'neutral' | 'hate' =
      i % 5 === 4 ? 'hate' : i % 3 === 1 ? 'neutral' : 'positive';
    const texts = type === 'positive' ? positiveTexts : type === 'neutral' ? neutralTexts : hateTexts;
    const nameIdx = (i * 7 + videoId.charCodeAt(0)) % FAKE_NAMES.length;
    return {
      id: `${videoId}-c${i}`,
      videoId,
      authorName: FAKE_NAMES[nameIdx],
      authorAvatar: FAKE_AVATARS[nameIdx],
      text: texts[i % texts.length],
      likes: Math.floor(Math.random() * 1200),
      createdAt: `${Math.floor(Math.random() * 11) + 1} месяцев назад`,
      type,
    };
  });
};

export const VIDEOS: Video[] = [
  {
    id: 'v1', type: 'video',
    title: 'iPhone 17 Pro — полный обзор! Лучший смартфон 2025 года?',
    description: 'Подробный обзор нового iPhone 17 Pro. Разбираем камеру, процессор, дисплей и всё самое важное.',
    thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[0], views: 4280000, likes: 198000, dislikes: 3200,
    comments: generateComments('v1', 12),
    duration: '18:42', uploadedAt: '2 недели назад', tags: ['iphone', 'apple', 'обзор'],
    category: 'Технологии',
  },
  {
    id: 'v2', type: 'video',
    title: 'Паста карбонара за 15 минут — настоящий итальянский рецепт',
    description: 'Готовим классическую пасту карбонара по оригинальному итальянскому рецепту.',
    thumbnail: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[1], views: 920000, likes: 54000, dislikes: 800,
    comments: generateComments('v2', 10),
    duration: '15:07', uploadedAt: '3 дня назад', tags: ['паста', 'рецепт', 'кулинария'],
    category: 'Кулинария',
  },
  {
    id: 'v3', type: 'video',
    title: 'GTA 6 — первый взгляд на геймплей | Реакция и разбор трейлера',
    description: 'Смотрим и разбираем официальный геймплейный трейлер GTA 6. Что нас ждёт?',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[2], views: 12500000, likes: 820000, dislikes: 15000,
    comments: generateComments('v3', 15),
    duration: '24:55', uploadedAt: '1 неделю назад', tags: ['gta6', 'игры', 'трейлер'],
    category: 'Игры',
  },
  {
    id: 'v4', type: 'video',
    title: '10 упражнений для идеального пресса дома — без снаряжения',
    description: 'Простая и эффективная тренировка для прокачки пресса прямо у себя дома.',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[3], views: 340000, likes: 29000, dislikes: 400,
    comments: generateComments('v4', 8),
    duration: '12:30', uploadedAt: '5 дней назад', tags: ['фитнес', 'тренировка', 'пресс'],
    category: 'Спорт',
  },
  {
    id: 'v5', type: 'video',
    title: 'Дубай за 3 дня — что посмотреть, где поесть, сколько стоит',
    description: 'Мини-путеводитель по Дубаю: самые яркие места, рестораны и лайфхаки для туристов.',
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[4], views: 1800000, likes: 98000, dislikes: 1200,
    comments: generateComments('v5', 11),
    duration: '22:18', uploadedAt: '2 месяца назад', tags: ['дубай', 'путешествие', 'влог'],
    category: 'Путешествия',
  },
  {
    id: 'v6', type: 'video',
    title: 'Кавер на "Кино — Группа крови" — живое исполнение',
    description: 'Живое исполнение культовой песни Виктора Цоя на акустической гитаре.',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[5], views: 560000, likes: 42000, dislikes: 600,
    comments: generateComments('v6', 9),
    duration: '4:33', uploadedAt: '1 месяц назад', tags: ['кино', 'кавер', 'гитара'],
    category: 'Музыка',
  },
  {
    id: 'v7', type: 'video',
    title: 'Топ-10 ошибок начинающих программистов — как их избежать',
    description: 'Разбираем самые частые ошибки при старте в программировании и как их исправить.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[0], views: 2100000, likes: 145000, dislikes: 2100,
    comments: generateComments('v7', 13),
    duration: '19:15', uploadedAt: '3 недели назад', tags: ['программирование', 'советы', 'код'],
    category: 'Технологии',
  },
  {
    id: 'v8', type: 'video',
    title: 'Борщ по-украински — классический рецепт бабушки',
    description: 'Настоящий наваристый борщ по традиционному домашнему рецепту.',
    thumbnail: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[1], views: 450000, likes: 31000, dislikes: 500,
    comments: generateComments('v8', 7),
    duration: '28:00', uploadedAt: '4 дня назад', tags: ['борщ', 'суп', 'рецепт'],
    category: 'Кулинария',
  },
];

export const SHORTS: Video[] = [
  {
    id: 's1', type: 'short',
    title: 'Лайфхак с зарядкой телефона 🔋',
    description: 'Один простой трюк, который сохранит батарею вдвое дольше!',
    thumbnail: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=360&h=640&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[0], views: 8900000, likes: 420000, dislikes: 5000,
    comments: generateComments('s1', 8),
    duration: '0:58', uploadedAt: '3 дня назад', tags: ['лайфхак', 'телефон'],
    category: 'Технологии',
  },
  {
    id: 's2', type: 'short',
    title: 'Идеальные яйца за 60 секунд 🍳',
    description: 'Секрет идеальной яичницы раскрыт!',
    thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=360&h=640&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[1], views: 3200000, likes: 180000, dislikes: 2000,
    comments: generateComments('s2', 6),
    duration: '0:45', uploadedAt: '1 день назад', tags: ['еда', 'рецепт'],
    category: 'Кулинария',
  },
  {
    id: 's3', type: 'short',
    title: 'Нереальный скилл в CS2 💥',
    description: 'Этот момент я буду помнить всю жизнь.',
    thumbnail: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=360&h=640&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[2], views: 15600000, likes: 980000, dislikes: 12000,
    comments: generateComments('s3', 10),
    duration: '0:30', uploadedAt: '5 часов назад', tags: ['cs2', 'клип', 'игры'],
    category: 'Игры',
  },
  {
    id: 's4', type: 'short',
    title: 'Упражнение дня — 2 минуты планки 🏋️',
    description: 'Попробуй держать планку 2 минуты. Реально сложно!',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=360&h=640&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[3], views: 2100000, likes: 95000, dislikes: 1100,
    comments: generateComments('s4', 5),
    duration: '0:52', uploadedAt: '2 дня назад', tags: ['фитнес', 'планка'],
    category: 'Спорт',
  },
  {
    id: 's5', type: 'short',
    title: 'Закат в Бали — это нереально 🌅',
    description: 'Один из лучших закатов в моей жизни.',
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=360&h=640&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[4], views: 6700000, likes: 350000, dislikes: 4000,
    comments: generateComments('s5', 7),
    duration: '0:35', uploadedAt: '12 часов назад', tags: ['бали', 'закат', 'путешествие'],
    category: 'Путешествия',
  },
  {
    id: 's6', type: 'short',
    title: 'Кавер на гитаре за 1 минуту 🎸',
    description: 'Пальцы сами играют!',
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=360&h=640&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: CHANNELS[5], views: 1900000, likes: 88000, dislikes: 900,
    comments: generateComments('s6', 6),
    duration: '0:59', uploadedAt: '1 день назад', tags: ['гитара', 'музыка'],
    category: 'Музыка',
  },
];

export const ALL_VIDEOS = [...VIDEOS, ...SHORTS];

export const ADMIN_USER: User = {
  id: 'admin', username: 'admin_123', email: 'admin@viewtube.ru',
  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=admin&backgroundColor=e74c3c',
  role: 'admin', subscribedChannels: [], watchHistory: [], likedVideos: [],
  createdAt: '2024-01-01',
};

export const MOCK_USERS: User[] = [
  { id: 'u1', username: 'Алексей_Gaming', email: 'alex@mail.ru', avatar: FAKE_AVATARS[0], role: 'user', subscribedChannels: ['ch1', 'ch3'], watchHistory: ['v1', 'v3'], likedVideos: ['v1'], createdAt: '2024-03-15' },
  { id: 'u2', username: 'MashaCooks', email: 'masha@yandex.ru', avatar: FAKE_AVATARS[1], role: 'user', subscribedChannels: ['ch2'], watchHistory: ['v2', 'v8'], likedVideos: ['v2', 'v8'], createdAt: '2024-05-20' },
  { id: 'u3', username: 'Путник_Дмитрий', email: 'dmitry@gmail.com', avatar: FAKE_AVATARS[2], role: 'user', subscribedChannels: ['ch4', 'ch5'], watchHistory: ['v4', 'v5'], likedVideos: ['v5'], createdAt: '2024-07-01' },
  { id: 'u4', username: 'MusicFan_Anna', email: 'anna@mail.ru', avatar: FAKE_AVATARS[3], role: 'user', subscribedChannels: ['ch6'], watchHistory: ['v6'], likedVideos: ['v6'], createdAt: '2024-09-10' },
];

export const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + ' млн';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + ' тыс';
  return n.toString();
};

export const CATEGORIES = ['Все', 'Технологии', 'Кулинария', 'Игры', 'Спорт', 'Путешествия', 'Музыка', 'Наука', 'Образование', 'Юмор', 'Новости', 'Авто'];
