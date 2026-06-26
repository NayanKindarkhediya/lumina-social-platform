/* ================================================================
   LUMINA — script.js
   All dynamic rendering, routing, interactions, and state
================================================================ */

'use strict';

/* ─────────────────────────────────────────────
   1. DATA STORE
   Replace any URL with your own image/video URL.
───────────────────────────────────────────── */

const APP_STATE = {
    currentPage: 'home',
    currentUser: {
        username: 'lumina_user',
        avatar: 'https://i.pravatar.cc/150?img=12',
        bio: '✨ Living, laughing, creating.\n📍 San Francisco | 🌍 Traveler',
        website: 'https://lumina.me/user',
        posts: 42,
        followers: '18.4K',
        following: 312,
        verified: true,
    },
    likedPosts: new Set(),
    savedPosts: new Set(),
    followedUsers: new Set(),
    theme: localStorage.getItem('lumina-theme') || 'light',
    storyIndex: 0,
    storyUserIndex: 0,
    currentChat: null,
};

/* ── Stories ── */
const STORIES = [
    { id: 1, username: 'aurora', avatar: 'https://i.pinimg.com/736x/31/cd/38/31cd38180a2bc362d905b922b0329e6d.jpg', image: 'https://i.pinimg.com/736x/a2/93/e4/a293e4e88a4cc4b20f1c3d1c8e396ce8.jpg', time: '2h', seen: false },
    { id: 2, username: 'marco', avatar: 'https://i.pinimg.com/736x/da/59/64/da59647bd31dd524c09991cb89949804.jpg', image: 'https://i.pinimg.com/736x/30/d8/ba/30d8ba79b9cf6cf61187019b0b2b6529.jpg', time: '4h', seen: false },
    { id: 3, username: 'zara', avatar: 'https://i.pinimg.com/736x/5d/27/71/5d27715b4d25b13c107e2da4f51e2fdf.jpg', video: 'img/krishna_story.mp4', time: '5h', seen: true },
    { id: 4, username: 'riku', avatar: 'https://i.pinimg.com/736x/9c/f8/97/9cf897d4019fa2af224e2284a256a968.jpg', image: 'https://i.pinimg.com/736x/8d/2c/18/8d2c18f083b2b7001524ca10397e1ebb.jpg', time: '7h', seen: false },
    { id: 5, username: 'lena', avatar: 'https://i.pinimg.com/736x/64/33/30/6433304a9b76ae8b9adf7b18cf40d558.jpg', image: 'https://i.pinimg.com/736x/51/87/8f/51878f45400d63320cfcbb9bdceac601.jpg', time: '9h', seen: true },
    { id: 6, username: 'kian', avatar: 'https://i.pinimg.com/736x/28/4a/98/284a982e1fa217a594270b73265e2ff9.jpg', image: 'https://i.pinimg.com/736x/9f/56/c4/9f56c4b614be25529d300d2872efc88e.jpg', time: '10h', seen: false },
    { id: 7, username: 'maya', avatar: 'https://i.pinimg.com/1200x/6a/50/cc/6a50cccbc0e12fe7282e47e6b7c748f2.jpg', image: 'https://i.pinimg.com/736x/28/60/a3/2860a321bdedaedb227795b4759923a9.jpg', time: '12h', seen: false },
];

/* ── Posts ── */
const POSTS = [
    {
        id: 'p1',
        username: 'aurora',
        avatar: 'https://i.pinimg.com/736x/31/cd/38/31cd38180a2bc362d905b922b0329e6d.jpg',
        verified: true,
        location: 'Swiss Alps',
        time: '2 hours ago',
        type: 'image',
        image: 'https://i.pinimg.com/736x/e8/b2/4f/e8b24fae0b4d0815af9ddda8f1476ff8.jpg',
        likes: 3241,
        caption: '🥐🌸 Breakfast dates and happy moments 💖',
        hashtags: '#BreakfastDate #CafeHopping #MorningMood #FoodLover #HappyMoments',
        comments: 147,
        views: null,
        hasStory: true,
    },
    {
        id: 'p2',
        username: 'marco',
        avatar: 'https://i.pinimg.com/736x/da/59/64/da59647bd31dd524c09991cb89949804.jpg',
        verified: false,
        location: 'Tokyo, Japan',
        time: '4 hours ago',
        type: 'carousel',
        images: [
            'https://i.pinimg.com/736x/e9/0b/81/e90b81134084183368cb6fe5042912ae.jpg',
            'https://i.pinimg.com/736x/da/b6/e3/dab6e300f22d6743c1c70a9a48ad92fa.jpg',
            'https://i.pinimg.com/736x/0a/c5/fc/0ac5fc94b2c25848f97251d9ca2e58eb.jpg',
        ],
        likes: 1897,
        caption: '🌄✨ Lost in the beauty of nature 🌿',
        hashtags: '#TravelGram #MountainLife #SunsetMagic #ExploreMore #Wanderlust',
        comments: 93,
        views: null,
        hasStory: true,
    },
    {
        id: 'p3',
        username: 'zara',
        avatar: 'https://i.pinimg.com/736x/5d/27/71/5d27715b4d25b13c107e2da4f51e2fdf.jpg',
        verified: true,
        location: 'Santorini, Greece',
        time: '6 hours ago',
        type: 'image',
        image: 'https://i.pinimg.com/736x/b6/28/e1/b628e165191ed9d86dc477d2059e5c40.jpg',
        likes: 8431,
        caption: '🦚🙏 Radhe Radhe ❤️✨',
        hashtags: '#RadheRadhe #Krishna #Radharani #Bhakti #Spirituality',
        comments: 312,
        views: null,
        hasStory: false,
    },
    {
        id: 'p4',
        username: 'riku',
        avatar: 'https://i.pinimg.com/736x/9c/f8/97/9cf897d4019fa2af224e2284a256a968.jpg',
        verified: false,
        location: 'Kyoto, Japan',
        time: '8 hours ago',
        type: 'video',
        video: 'img/riku1.mp4',
        poster: 'https://i.pinimg.com/736x/e0/8d/70/e08d704f23d0cdb61fb9d99db20cc015.jpg',
        likes: 2104,
        caption: '🏞️💙 Lost in the sound of the waterfall ✨',
        hashtags: '#NatureBeauty #WaterfallWonder #TravelGram #GoodVibes #Adventure',
        comments: 88,
        views: '42K',
        hasStory: true,
    },
    {
        id: 'p5',
        username: 'kian',
        avatar: 'https://i.pinimg.com/736x/64/33/30/6433304a9b76ae8b9adf7b18cf40d558.jpg',
        verified: true,
        location: 'Patagonia, Argentina',
        time: '12 hours ago',
        type: 'image',
        image: 'https://i.pinimg.com/736x/1c/dd/60/1cdd60b04bb9a3bfd637d6ece43ad913.jpg',
        likes: 5620,
        caption: 'At the edge of the world, I found myself. Patagonia is calling.',
        hashtags: '#patagonia #hiking #wilderness #southamerica',
        comments: 201,
        views: null,
        hasStory: true,
    },
    {
        id: 'p6',
        username: 'lena',
        avatar: 'https://i.pinimg.com/736x/28/4a/98/284a982e1fa217a594270b73265e2ff9.jpg',
        verified: true,
        location: 'Patagonia, Argentina',
        time: '8 hours ago',
        type: 'image',
        image: 'https://i.pinimg.com/736x/34/c7/e8/34c7e897438317f9f2ab3893b32a5272.jpg',
        likes: 10000,
        caption: 'At the edge of the world, I found myself. Patagonia is calling.',
        hashtags: '#patagonia #hiking #wilderness #southamerica',
        comments: 500,
        views: null,
        hasStory: true,
    },
];

/* ── Explore Grid Items ── */
const EXPLORE_ITEMS = [
    { type: 'image', src: 'https://i.pinimg.com/736x/58/4c/fe/584cfe5325d0856dc7f8cee29cfff840.jpg', likes: 3201, comments: 142, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/69/d4/f3/69d4f303da8356022b4b067d413e011e.jpg', likes: 1820, comments: 63, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/53/0d/e5/530de5d12dbe58671b286ef0b7a578ff.jpg', likes: 90140, comments: 1200, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/dd/7a/8e/dd7a8e36a8246c8896ca1529a9ddf10b.jpg', likes: 6144, comments: 298, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/7f/97/bd/7f97bd09911b1cd0d5c0ef5387cddc05.jpg', likes: 5620, comments: 201, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/00/74/f9/0074f9be965c7551f816a6e6f5bef62d.jpg', likes: 2371, comments: 87, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/9b/d1/b0/9bd1b0d4bd5a042a3581595a3209beb5.jpg', likes: 4501, comments: 194, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/41/43/26/41432672aa0bc930d0bfe810518f3af2.jpg', likes: 7820, comments: 412, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/da/93/f0/da93f0859a154105b4371de4e6b68a20.jpg', likes: 1250, comments: 44, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/5c/39/1f/5c391ffecb21a2b4550691b4d496e244.jpg', likes: 5620, comments: 201, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/49/56/2b/49562b266bab24af110db9c6d3dd02e6.jpg', likes: 3940, comments: 167, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/44/c9/aa/44c9aa8cdefd35c2b6b5fe4b35e80294.jpg', likes: 2100, comments: 78, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/b9/84/44/b98444eeb174fa5b45c851c087d7ed11.jpg', likes: 8901, comments: 531, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/0c/2d/ac/0c2dac4a8462b2bc19aabaddc4883d70.jpg', likes: 5500, comments: 220, cat: 'photos' },
    { type: 'image', src: 'https://i.pinimg.com/736x/c5/fd/6e/c5fd6e956f61c8be0692af206440ddd7.jpg', likes: 3200, comments: 150, cat: 'photos' },

];

const TRENDING_TAGS = ['#travel', '#nature', '#photography', '#food', '#fashion', '#art', '#fitness', '#music', '#architecture', '#sunset'];

/* ── Reels ── */
const REELS = [
    {
        id: 'r1',
        username: 'Mrunal Thakur',
        avatar: 'https://i.pinimg.com/1200x/64/5a/72/645a72d687c2553ad48f0ee9a822b748.jpg',
        verified: false,
        video: 'reel/1.mp4',
        caption: '✨ Red dress, confident vibes ❤️ #MrunalThakur #RedDress',
        music: '♪ Lovely Song',
        musicCover: 'https://i.pinimg.com/1200x/64/5a/72/645a72d687c2553ad48f0ee9a822b748.jpg',
        likes: 287635,
        comments: 48742,
        shares: 14670,
    },
    {
        id: 'r2',
        username: 'maya',
        avatar: 'https://i.pinimg.com/1200x/14/18/4b/14184b36f7151f0668fa365c55b61204.jpg',
        verified: true,
        video: 'reel/2.mp4',
        caption: 'Life is a journey, make it beautiful. 🌿',
        music: '♪ Unstoppable — Sia',
        musicCover: 'https://i.pinimg.com/1200x/14/18/4b/14184b36f7151f0668fa365c55b61204.jpg',
        likes: 29800,
        comments: 917,
        shares: 1421,
    },
    {
        id: 'r3',
        username: 'lena',
        avatar: 'https://i.pinimg.com/736x/01/fa/02/01fa02015804ac1aa75090b9336939f6.jpg',
        verified: true,
        video: 'reel/3.mp4',
        caption: 'POV: You found the perfect hike 🏔️ #wilderness #adventure',
        music: '♪ Midnight Rain — Taylor Swift',
        musicCover: 'https://i.pinimg.com/736x/01/fa/02/01fa02015804ac1aa75090b9336939f6.jpg',
        likes: 51000,
        comments: 2103,
        shares: 3890,
    },
    {
        id: 'r4',
        username: 'mason',
        avatar: 'https://i.pinimg.com/1200x/7a/2d/a7/7a2da71bad6c0c9036dbcf072ab6e981.jpg',
        verified: true,
        video: 'reel/4.mp4',
        caption: 'Sunsets, roads, and endless memories 🚗✨ #travel #wanderlust',
        music: '♪ Stargazing — Myles Smith',
        musicCover: 'https://i.pinimg.com/1200x/7a/2d/a7/7a2da71bad6c0c9036dbcf072ab6e981.jpg',
        likes: 68200,
        comments: 3187,
        shares: 4512,
    },
    {
        id: 'r5',
        username: 'zoey',
        avatar: 'https://i.pinimg.com/736x/26/03/eb/2603ebf77461205732669ee4fecc85cb.jpg',
        verified: false,
        video: 'reel/5.mp4',
        caption: 'Coffee, books, and rainy days ☕📚🌧️ #cozyvibes',
        music: '♪ Birds of a Feather — Billie Eilish',
        musicCover: 'https://i.pinimg.com/736x/26/03/eb/2603ebf77461205732669ee4fecc85cb.jpg',
        likes: 28700,
        comments: 1450,
        shares: 1821,
    },
    {
        id: 'r6',
        username: 'noah',
        avatar: 'https://i.pinimg.com/736x/24/e5/ee/24e5ee1c1aba6fc6d50f4802d5ef22f4.jpg',
        verified: true,
        video: 'reel/6.mp4',
        caption: 'Caught the perfect wave today 🌊🏄 #surfing #beachlife',
        music: '♪ Beautiful Things — Benson Boone',
        musicCover: 'https://i.pinimg.com/736x/24/e5/ee/24e5ee1c1aba6fc6d50f4802d5ef22f4.jpg',
        likes: 93400,
        comments: 4298,
        shares: 6734,
    },
    {
        id: 'r7',
        username: 'ava',
        avatar: 'https://i.pinimg.com/736x/05/d0/40/05d040820e4aa45ee3dc4834c6209680.jpg',
        verified: false,
        video: 'reel/7.mp4',
        caption: 'Nature always finds a way to amaze 🌿🍃 #exploremore',
        music: '♪ Espresso — Sabrina Carpenter',
        musicCover: 'https://i.pinimg.com/736x/05/d0/40/05d040820e4aa45ee3dc4834c6209680.jpg',
        likes: 41600,
        comments: 1895,
        shares: 2740,
    },
    {
        id: 'r8',
        username: 'emma',
        avatar: 'https://i.pravatar.cc/300?img=32',
        verified: true,
        video: 'reel/8.mp4',
        caption: 'Golden hour hits different 🌅✨ #sunset',
        music: '♪ Golden Hour — JVKE',
        musicCover: 'https://i.pravatar.cc/300?img=32',
        likes: 52800,
        comments: 2104,
        shares: 3012,
    },
    {
        id: 'r9',
        username: 'liam',
        avatar: 'https://i.pravatar.cc/300?img=12',
        verified: false,
        video: 'reel/9.mp4',
        caption: 'Weekend adventures begin now 🚴‍♂️',
        music: '♪ Runaway — AURORA',
        musicCover: 'https://i.pravatar.cc/300?img=12',
        likes: 38700,
        comments: 1422,
        shares: 2180,
    },
    {
        id: 'r10',
        username: 'sophia',
        avatar: 'https://i.pravatar.cc/300?img=47',
        verified: true,
        video: 'reel/10.mp4',
        caption: 'Smile more, worry less 😊',
        music: '♪ Calm Down — Rema',
        musicCover: 'https://i.pravatar.cc/300?img=47',
        likes: 64100,
        comments: 3340,
        shares: 4920,
    },
    {
        id: 'r11',
        username: 'oliver',
        avatar: 'https://i.pravatar.cc/300?img=15',
        verified: false,
        video: 'reel/11.mp4',
        caption: 'Exploring hidden places 🌍',
        music: '♪ Paradise — Coldplay',
        musicCover: 'https://i.pravatar.cc/300?img=15',
        likes: 29500,
        comments: 1105,
        shares: 1760,
    },
    {
        id: 'r12',
        username: 'mia',
        avatar: 'https://i.pravatar.cc/300?img=23',
        verified: true,
        video: 'reel/12.mp4',
        caption: 'Coffee first, everything later ☕',
        music: '♪ Espresso — Sabrina Carpenter',
        musicCover: 'https://i.pravatar.cc/300?img=23',
        likes: 47200,
        comments: 1830,
        shares: 2500,
    },
    {
        id: 'r13',
        username: 'james',
        avatar: 'https://i.pravatar.cc/300?img=18',
        verified: false,
        video: 'reel/13.mp4',
        caption: 'City lights and late nights 🌃',
        music: '♪ Blinding Lights — The Weeknd',
        musicCover: 'https://i.pravatar.cc/300?img=18',
        likes: 58100,
        comments: 2620,
        shares: 3710,
    },
    {
        id: 'r14',
        username: 'amelia',
        avatar: 'https://i.pravatar.cc/300?img=41',
        verified: true,
        video: 'reel/14.mp4',
        caption: 'Beach days are the best 🌊',
        music: '♪ Ocean Eyes — Billie Eilish',
        musicCover: 'https://i.pravatar.cc/300?img=41',
        likes: 69900,
        comments: 3920,
        shares: 5420,
    },
    {
        id: 'r15',
        username: 'henry',
        avatar: 'https://i.pravatar.cc/300?img=8',
        verified: false,
        video: 'reel/15.mp4',
        caption: 'Living the dream 🚗💨',
        music: '♪ Fast Car — Luke Combs',
        musicCover: 'https://i.pravatar.cc/300?img=8',
        likes: 33100,
        comments: 1250,
        shares: 1980,
    },
    {
        id: 'r16',
        username: 'charlotte',
        avatar: 'https://i.pravatar.cc/300?img=50',
        verified: true,
        video: 'reel/16.mp4',
        caption: 'Little moments matter ❤️',
        music: '♪ Photograph — Ed Sheeran',
        musicCover: 'https://i.pravatar.cc/300?img=50',
        likes: 72300,
        comments: 4010,
        shares: 6100,
    },
    {
        id: 'r17',
        username: 'lucas',
        avatar: 'https://i.pravatar.cc/300?img=11',
        verified: false,
        video: 'reel/17.mp4',
        caption: 'Mountain vibes 🏔️',
        music: '♪ Memories — Maroon 5',
        musicCover: 'https://i.pravatar.cc/300?img=11',
        likes: 44500,
        comments: 1730,
        shares: 2640,
    },
    {
        id: 'r18',
        username: 'evelyn',
        avatar: 'https://i.pravatar.cc/300?img=29',
        verified: true,
        video: 'reel/18.mp4',
        caption: 'Chasing dreams every day ✨',
        music: '♪ Hall of Fame — The Script',
        musicCover: 'https://i.pravatar.cc/300?img=29',
        likes: 81200,
        comments: 5200,
        shares: 7310,
    },
    {
        id: 'r19',
        username: 'alex',
        avatar: 'https://i.pravatar.cc/300?img=6',
        verified: false,
        video: 'reel/19.mp4',
        caption: 'Just keep moving forward 🚀',
        music: '♪ Believer — Imagine Dragons',
        musicCover: 'https://i.pravatar.cc/300?img=6',
        likes: 37700,
        comments: 1460,
        shares: 2090,
    },
    {
        id: 'r20',
        username: 'grace',
        avatar: 'https://i.pravatar.cc/300?img=35',
        verified: true,
        video: 'reel/20.mp4',
        caption: 'Beautiful things take time 🌸',
        music: '♪ Beautiful Things — Benson Boone',
        musicCover: 'https://i.pravatar.cc/300?img=35',
        likes: 90500,
        comments: 6180,
        shares: 8540,
    },

];

/* ── Messages ── */
const CHATS = [
    {
        id: 'c1',
        name: 'Aurora ✨',
        avatar: 'https://i.pravatar.cc/150?img=47',
        online: true,
        lastMsg: 'That photo is stunning!',
        time: '2m',
        unread: 2,
        messages: [
            { from: 'them', text: 'Hey! Love your latest post 🔥', time: '10:12 AM' },
            { from: 'me', text: 'Thank you so much! 😊', time: '10:14 AM' },
            { from: 'them', text: 'Where was that taken?', time: '10:15 AM' },
            { from: 'me', text: 'Swiss Alps! You should totally visit 🏔️', time: '10:16 AM' },
            { from: 'them', text: 'That photo is stunning!', time: '10:18 AM' },
        ],
    },
    {
        id: 'c2',
        name: 'Marco',
        avatar: 'https://i.pravatar.cc/150?img=11',
        online: false,
        lastMsg: 'See you in Tokyo! 🗼',
        time: '1h',
        unread: 0,
        messages: [
            { from: 'them', text: 'Tokyo trip planning!', time: '9:00 AM' },
            { from: 'me', text: 'I\'m so excited', time: '9:02 AM' },
            { from: 'them', text: 'See you in Tokyo! 🗼', time: '9:05 AM' },
        ],
    },
    {
        id: 'c3',
        name: 'Zara',
        avatar: 'https://i.pravatar.cc/150?img=44',
        online: true,
        lastMsg: 'Santorini vibes forever 🌊',
        time: '3h',
        unread: 1,
        messages: [
            { from: 'them', text: 'Miss Santorini so much 😭', time: '7:00 AM' },
            { from: 'me', text: 'Same! We need to go back', time: '7:10 AM' },
            { from: 'them', text: 'Santorini vibes forever 🌊', time: '7:12 AM' },
        ],
    },
];

/* ── Notifications ── */
const NOTIFICATIONS = [
    { id: 'n1', type: 'like', avatar: 'https://i.pravatar.cc/150?img=47', username: 'aurora', text: 'liked your photo.', time: '2m ago', unread: true, thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100' },
    { id: 'n2', type: 'follow', avatar: 'https://i.pravatar.cc/150?img=11', username: 'marco', text: 'started following you.', time: '15m ago', unread: true, thumb: null },
    { id: 'n3', type: 'comment', avatar: 'https://i.pravatar.cc/150?img=44', username: 'zara', text: 'commented: "Absolutely gorgeous! 😍"', time: '1h ago', unread: true, thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100' },
    { id: 'n4', type: 'like', avatar: 'https://i.pravatar.cc/150?img=33', username: 'riku', text: 'liked your reel.', time: '2h ago', unread: false, thumb: null },
    { id: 'n5', type: 'mention', avatar: 'https://i.pravatar.cc/150?img=25', username: 'lena', text: 'mentioned you in a comment.', time: '3h ago', unread: false, thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=100' },
    { id: 'n6', type: 'follow', avatar: 'https://i.pravatar.cc/150?img=68', username: 'kian', text: 'started following you.', time: '5h ago', unread: false, thumb: null },
    { id: 'n7', type: 'like', avatar: 'https://i.pravatar.cc/150?img=49', username: 'maya', text: 'liked your photo.', time: '8h ago', unread: false, thumb: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100' },
];

/* ── Profile Highlights ── */
const HIGHLIGHTS = [
    { label: 'Alps', cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150' },
    { label: 'Tokyo', cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=150' },
    { label: 'Greece', cover: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=150' },
    { label: 'Kyoto', cover: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=150' },
    { label: 'Life', cover: 'https://i.pravatar.cc/150?img=12' },
];

/* ── Profile Grid ── */
const PROFILE_POSTS = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', likes: 3241, comments: 147, type: 'image' },
    { src: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400', likes: 8431, comments: 312, type: 'image' },
    { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400', likes: 5620, comments: 201, type: 'image' },
    { src: 'reel/1.mp4', likes: 1897, comments: 93, type: 'reel' },
    { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400', likes: 7820, comments: 412, type: 'image' },
    { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400', likes: 2100, comments: 78, type: 'image' },
    { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', likes: 1820, comments: 63, type: 'image' },
    { src: 'reel/9.mp4', likes: 2104, comments: 88, type: 'reel' },
    { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', likes: 940, comments: 27, type: 'image' },
];

/* ── Search Suggestions ── */
const SEARCH_USERS = [
    { username: 'aurora', name: 'Aurora Sinclair', avatar: 'https://i.pravatar.cc/150?img=47', followers: '24.1K' },
    { username: 'marco', name: 'Marco Valentini', avatar: 'https://i.pravatar.cc/150?img=11', followers: '8.3K' },
    { username: 'zara', name: 'Zara Phoenix', avatar: 'https://i.pravatar.cc/150?img=44', followers: '92.4K' },
    { username: 'riku', name: 'Riku Tanaka', avatar: 'https://i.pravatar.cc/150?img=33', followers: '11.7K' },
    { username: 'lena', name: 'Lena Patagonia', avatar: 'https://i.pravatar.cc/150?img=25', followers: '47.8K' },
];

/* ─────────────────────────────────────────────
   2. UTILITY FUNCTIONS
───────────────────────────────────────────── */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString();
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ─────────────────────────────────────────────
   3. THEME MANAGEMENT
───────────────────────────────────────────── */

function applyTheme(theme) {
    APP_STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lumina-theme', theme);

    const darkToggle = $('#dark-mode-toggle');
    if (darkToggle) darkToggle.checked = (theme === 'dark');
}

function initTheme() {
    applyTheme(APP_STATE.theme);

    $('#theme-toggle').addEventListener('click', () => {
        applyTheme(APP_STATE.theme === 'light' ? 'dark' : 'light');
    });

    $('#dark-mode-toggle').addEventListener('change', (e) => {
        applyTheme(e.target.checked ? 'dark' : 'light');
    });
}

/* ─────────────────────────────────────────────
   4. ROUTING / PAGE NAVIGATION
───────────────────────────────────────────── */

function navigateTo(page) {
    if (APP_STATE.currentPage === page) return;
    APP_STATE.currentPage = page;

    // Hide all pages
    $$('.page').forEach(p => p.classList.remove('active'));
    // Show target page
    const target = $(`#page-${page}`);
    if (target) target.classList.add('active');

    // Update sidebar nav
    $$('.nav-btn[data-page]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    // Update bottom nav
    $$('.bnav-btn[data-page]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    // Page-specific init
    if (page === 'reels') initReels();
    if (page === 'notifications') renderNotifications('all');
}

function initNavigation() {
    // Sidebar buttons
    $$('.nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.page));
    });
    // Bottom nav buttons
    $$('.bnav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.page));
    });
    // Settings link in profile
    $$('.settings-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.page));
    });
    $('#edit-profile-settings').addEventListener('click', () => openEditModal());
}

/* ─────────────────────────────────────────────
   5. STORIES
───────────────────────────────────────────── */

function renderStories() {
    const scroll = $('#stories-scroll');
    STORIES.forEach((s, idx) => {
        const el = document.createElement('div');
        el.className = 'story-item';
        el.innerHTML = `
      <div class="story-ring ${s.seen ? 'seen' : ''}">
        <img src="${s.avatar}" alt="${s.username}" loading="lazy" />
      </div>
      <span>${s.username}</span>
    `;
        el.addEventListener('click', () => openStory(idx));
        scroll.appendChild(el);
    });
}

/* Story Viewer */
let storyTimer = null;

function openStory(userIdx) {
    APP_STATE.storyUserIndex = userIdx;
    APP_STATE.storyIndex = 0;
    renderStoryViewer();
    $('#story-overlay').classList.remove('hidden');
    startStoryTimer();
}

function renderStoryViewer() {
    const story = STORIES[APP_STATE.storyUserIndex];
    if (!story) { closeStory(); return; }

    $('#story-viewer-avatar').src = story.avatar;
    $('#story-viewer-name').textContent = story.username;
    $('#story-viewer-time').textContent = story.time;

    // Media
    const wrap = $('#story-media-wrap');
    wrap.innerHTML = `<img src="${story.image}" alt="story" />`;

    // Progress bar
    const bar = $('#story-progress-bar');
    bar.innerHTML = STORIES.map((_, i) => `
    <div class="story-progress-seg">
      <div class="story-progress-fill ${i < APP_STATE.storyUserIndex ? 'animate' : ''}"
           style="width:${i < APP_STATE.storyUserIndex ? '100%' : '0%'}"></div>
    </div>`).join('');

    // Mark seen
    STORIES[APP_STATE.storyUserIndex].seen = true;
    const storyEls = $$('.story-ring');
    if (storyEls[APP_STATE.storyUserIndex]) {
        storyEls[APP_STATE.storyUserIndex].classList.add('seen');
    }

    // Animate current bar
    setTimeout(() => {
        const fills = $$('.story-progress-fill', $('#story-progress-bar'));
        if (fills[APP_STATE.storyUserIndex]) {
            fills[APP_STATE.storyUserIndex].style.transition = `width ${5}s linear`;
            fills[APP_STATE.storyUserIndex].style.width = '100%';
        }
    }, 50);
}

function startStoryTimer() {
    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => {
        nextStory();
    }, 5000);
}

function nextStory() {
    clearTimeout(storyTimer);
    if (APP_STATE.storyUserIndex < STORIES.length - 1) {
        APP_STATE.storyUserIndex++;
        renderStoryViewer();
        startStoryTimer();
    } else {
        closeStory();
    }
}

function prevStory() {
    clearTimeout(storyTimer);
    if (APP_STATE.storyUserIndex > 0) {
        APP_STATE.storyUserIndex--;
        renderStoryViewer();
        startStoryTimer();
    }
}

function closeStory() {
    clearTimeout(storyTimer);
    $('#story-overlay').classList.add('hidden');
}

function initStoryControls() {
    $('#story-close').addEventListener('click', closeStory);
    $('#story-nav-prev').addEventListener('click', prevStory);
    $('#story-nav-next').addEventListener('click', nextStory);
    $('#story-overlay').addEventListener('click', (e) => {
        if (e.target === $('#story-overlay')) closeStory();
    });
    // Add story
    $('#add-story-btn').addEventListener('click', () => {
        alert('Story upload feature: in production this would open a file picker or camera.');
    });
    // Profile ring opens story
    $('#profile-story-ring').addEventListener('click', () => openStory(0));
}

/* ─────────────────────────────────────────────
   6. FEED POSTS
───────────────────────────────────────────── */

function buildPostHTML(post) {
    const liked = APP_STATE.likedPosts.has(post.id);
    const saved = APP_STATE.savedPosts.has(post.id);
    const likes = liked ? post.likes + 1 : post.likes;

    let mediaHTML = '';
    if (post.type === 'image') {
        mediaHTML = `<div class="post-media">
      <img class="post-img" src="${post.image}" alt="post" loading="lazy" />
    </div>`;
    } else if (post.type === 'video') {
        mediaHTML = `<div class="post-media">
      <video class="post-video" src="${post.video}" poster="${post.poster}" loop muted autoplay></video>
      ${post.views ? `<span style="position:absolute;bottom:10px;left:14px;color:#fff;font-size:.8rem;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.6)">▶ ${post.views} views</span>` : ''}
    </div>`;
    } else if (post.type === 'carousel') {
        const slides = post.images.map((img, i) =>
            `<div class="carousel-slide"><img src="${img}" alt="slide ${i + 1}" loading="lazy" /></div>`
        ).join('');
        const dots = post.images.map((_, i) =>
            `<div class="carousel-dot ${i === 0 ? 'active' : ''}"></div>`
        ).join('');
        mediaHTML = `<div class="post-media">
      <div class="carousel" data-index="0">
        <div class="carousel-track">${slides}</div>
        <div class="carousel-dots">${dots}</div>
        <button class="carousel-btn prev" title="prev">‹</button>
        <button class="carousel-btn next" title="next">›</button>
      </div>
    </div>`;
    }

    return `
    <article class="post-card" data-id="${post.id}">
      <div class="post-header">
        <div class="post-avatar-wrap">
          <img class="post-avatar ${post.hasStory ? 'has-story' : ''}" src="${post.avatar}" alt="${post.username}" loading="lazy" />
        </div>
        <div class="post-user">
          <div class="post-username">
            ${post.username}
            ${post.verified ? '<span class="verified-badge" title="Verified">✓</span>' : ''}
          </div>
          ${post.location ? `<div class="post-location">${post.location}</div>` : ''}
        </div>
        <button class="post-more" title="More options">···</button>
      </div>

      ${mediaHTML}

      <div class="post-actions">
        <button class="action-btn like-btn ${liked ? 'liked' : ''}" data-id="${post.id}">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="like-count">${fmt(likes)}</span>
        </button>
        <button class="action-btn comment-btn" data-id="${post.id}">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>${post.comments}</span>
        </button>
        <button class="action-btn share-btn">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
        <button class="action-btn save-btn ${saved ? 'saved' : ''}" data-id="${post.id}" style="margin-left:auto">
          <svg viewBox="0 0 24 24"><polygon points="19 21 12 16 5 21 5 3 19 3"/></svg>
        </button>
      </div>

      <div class="post-footer">
        <div class="post-likes">${fmt(likes)} likes</div>
        <div class="post-caption"><strong>${post.username}</strong> ${post.caption}</div>
        ${post.hashtags ? `<div class="post-hashtags">${post.hashtags}</div>` : ''}
        <div class="post-comment-count">View all ${post.comments} comments</div>
        <div class="post-time">${post.time}</div>
      </div>
      <div class="post-comment-input-row">
        <img src="${APP_STATE.currentUser.avatar}" alt="you" />
        <input type="text" placeholder="Add a comment..." />
        <button class="post-btn">Post</button>
      </div>
    </article>`;
}

function renderFeed() {
    const container = $('#feed-posts');
    POSTS.forEach(post => {
        container.insertAdjacentHTML('beforeend', buildPostHTML(post));
    });
    bindPostEvents();
}

function bindPostEvents() {
    // Like buttons
    $$('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleLike(btn.dataset.id, e.currentTarget));
    });

    // Double click to like on image
    $$('.post-img, .post-video').forEach(media => {
        media.addEventListener('dblclick', (e) => {
            const card = media.closest('.post-card');
            if (!card) return;
            const id = card.dataset.id;
            const likeBtn = card.querySelector('.like-btn');
            triggerHeartAnimation(e.clientX, e.clientY);
            if (!APP_STATE.likedPosts.has(id)) toggleLike(id, likeBtn);
        });
        // Video play on click
        if (media.tagName === 'VIDEO') {
            media.addEventListener('click', () => {
                media.paused ? media.play() : media.pause();
            });
        }
    });

    // Save buttons
    $$('.save-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleSave(btn.dataset.id, btn));
    });

    // Comment buttons
    $$('.comment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const post = POSTS.find(p => p.id === btn.dataset.id);
            if (post) openPostModal(post);
        });
    });

    // View comments
    $$('.post-comment-count').forEach(el => {
        el.addEventListener('click', () => {
            const card = el.closest('.post-card');
            const post = POSTS.find(p => p.id === card.dataset.id);
            if (post) openPostModal(post);
        });
    });

    // Carousels
    $$('.carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const dots = $$('.carousel-dot', carousel);
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        let idx = 0;
        const total = dots.length;

        function goTo(n) {
            idx = (n + total) % total;
            track.style.transform = `translateX(-${idx * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(idx - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(idx + 1));

        // Touch swipe
        let startX = 0;
        carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? idx + 1 : idx - 1);
        });
    });

    // Comment post buttons
    $$('.post-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input.value.trim()) {
                showToast('Comment posted!');
                input.value = '';
            }
        });
    });

    // Post more options
    $$('.post-more').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Options: Edit caption, Delete post, Report...');
        });
    });
}

function toggleLike(id, btn) {
    if (!btn) return;
    const liked = APP_STATE.likedPosts.has(id);
    if (liked) {
        APP_STATE.likedPosts.delete(id);
        btn.classList.remove('liked');
    } else {
        APP_STATE.likedPosts.add(id);
        btn.classList.add('liked');
    }
    // Update count in card
    const post = POSTS.find(p => p.id === id);
    if (post) {
        const newCount = post.likes + (APP_STATE.likedPosts.has(id) ? 1 : 0);
        const countEl = btn.querySelector('.like-count');
        if (countEl) countEl.textContent = fmt(newCount);
        // Update footer likes
        const card = btn.closest('.post-card');
        if (card) {
            const likesEl = card.querySelector('.post-likes');
            if (likesEl) likesEl.textContent = fmt(newCount) + ' likes';
        }
    }
}

function toggleSave(id, btn) {
    if (APP_STATE.savedPosts.has(id)) {
        APP_STATE.savedPosts.delete(id);
        btn.classList.remove('saved');
    } else {
        APP_STATE.savedPosts.add(id);
        btn.classList.add('saved');
        showToast('Post saved!');
    }
}

function triggerHeartAnimation(x, y) {
    const heart = $('#like-heart');
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.classList.remove('hidden', 'animate');
    void heart.offsetWidth; // reflow
    heart.classList.add('animate');
    setTimeout(() => heart.classList.add('hidden'), 700);
}

/* ── Infinite Scroll Simulation ── */
function initInfiniteScroll() {
    const loader = $('#feed-loader');
    let loading = false;
    let page = 1;
    const MAX_PAGES = 3;

    window.addEventListener('scroll', () => {
        if (APP_STATE.currentPage !== 'home') return;
        if (loading || page >= MAX_PAGES) return;
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 300) {
            loading = true;
            loader.classList.remove('hidden');
            setTimeout(() => {
                loader.classList.add('hidden');
                // Inject reversed posts as "new" content
                const container = $('#feed-posts');
                [...POSTS].reverse().forEach(post => {
                    const fakePost = { ...post, id: post.id + '_p' + page, likes: post.likes + Math.floor(Math.random() * 500) };
                    container.insertAdjacentHTML('beforeend', buildPostHTML(fakePost));
                });
                bindPostEvents();
                page++;
                loading = false;
            }, 1200);
        }
    });
}

/* ─────────────────────────────────────────────
   7. POST MODAL
───────────────────────────────────────────── */

function openPostModal(post) {
    const liked = APP_STATE.likedPosts.has(post.id);
    const likes = post.likes + (liked ? 1 : 0);

    const comments = [
        { avatar: 'https://i.pravatar.cc/150?img=47', username: 'aurora', text: 'Absolutely stunning! 😍', time: '2h ago' },
        { avatar: 'https://i.pravatar.cc/150?img=11', username: 'marco', text: 'Goals 🌍', time: '3h ago' },
        { avatar: 'https://i.pravatar.cc/150?img=44', username: 'zara', text: 'Taking notes for my next trip!', time: '4h ago' },
    ];

    const commentsHTML = comments.map(c => `
    <div class="modal-comment">
      <img src="${c.avatar}" alt="${c.username}" />
      <div>
        <div class="modal-comment-text"><strong>${c.username}</strong> ${c.text}</div>
        <time class="modal-comment-time">${c.time}</time>
      </div>
    </div>`).join('');

    let mediaHTML = '';
    if (post.type === 'image') mediaHTML = `<img src="${post.image}" alt="post" />`;
    else if (post.type === 'video') mediaHTML = `<video src="${post.video}" poster="${post.poster || ''}" autoplay loop controls></video>`;
    else if (post.type === 'carousel') mediaHTML = `<img src="${post.images[0]}" alt="post" />`;

    $('#post-modal-content').innerHTML = `
    <div class="modal-media">${mediaHTML}</div>
    <div class="modal-side">
      <div class="modal-side-header">
        <img src="${post.avatar}" alt="${post.username}" />
        <div>
          <strong>${post.username}</strong>
          ${post.verified ? '<span class="verified-badge">✓</span>' : ''}
        </div>
      </div>
      <div class="modal-comments">
        <div class="modal-comment">
          <img src="${post.avatar}" alt="${post.username}" />
          <div>
            <div class="modal-comment-text"><strong>${post.username}</strong> ${post.caption}</div>
            <time class="modal-comment-time">${post.time}</time>
          </div>
        </div>
        ${commentsHTML}
      </div>
      <div class="modal-actions">
        <div class="post-actions" style="padding:0">
          <button class="action-btn modal-like-btn ${liked ? 'liked' : ''}" data-id="${post.id}">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="action-btn">
            <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div class="post-likes" style="padding:8px 0 4px">${fmt(likes)} likes</div>
        <div class="post-time">${post.time}</div>
      </div>
      <div class="modal-input-row">
        <input type="text" placeholder="Add a comment..." />
        <button class="post-btn">Post</button>
      </div>
    </div>`;

    // Like in modal
    const modalLikeBtn = $('#post-modal-content .modal-like-btn');
    if (modalLikeBtn) {
        modalLikeBtn.addEventListener('click', () => {
            toggleLike(post.id, modalLikeBtn);
            const feedLikeBtn = $(`.post-card[data-id="${post.id}"] .like-btn`);
            if (feedLikeBtn) {
                feedLikeBtn.classList.toggle('liked', APP_STATE.likedPosts.has(post.id));
            }
        });
    }

    $('#post-modal').classList.remove('hidden');
}

function initPostModal() {
    $('#post-modal-close').addEventListener('click', () => $('#post-modal').classList.add('hidden'));
    $('#post-modal').addEventListener('click', (e) => {
        if (e.target === $('#post-modal')) $('#post-modal').classList.add('hidden');
    });
}

/* ─────────────────────────────────────────────
   8. EXPLORE / SEARCH PAGE
───────────────────────────────────────────── */

function renderExploreTags() {
    const container = $('#trending-tags');
    TRENDING_TAGS.forEach(tag => {
        const el = document.createElement('button');
        el.className = 'trending-tag';
        el.textContent = tag;
        el.addEventListener('click', () => {
            $('#search-input').value = tag;
            filterExplore('all');
        });
        container.appendChild(el);
    });
}

function renderExploreGrid(items) {
    const grid = $('#explore-grid');
    grid.innerHTML = '';
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'explore-item';
        el.innerHTML = `
      <img src="${item.src}" alt="explore" loading="lazy" />
      <div class="explore-overlay">
        <span>❤️ ${fmt(item.likes)}</span>
        <span>💬 ${fmt(item.comments)}</span>
      </div>`;
        el.addEventListener('click', () => {
            openPostModal({ id: 'exp', username: 'explore', avatar: 'https://i.pravatar.cc/150?img=1', verified: false, location: '', time: 'Recently', type: 'image', image: item.src, likes: item.likes, caption: 'Explore post', hashtags: '', comments: item.comments, views: null, hasStory: false });
        });
        grid.appendChild(el);
    });
}

function filterExplore(cat) {
    const items = cat === 'all' ? EXPLORE_ITEMS : EXPLORE_ITEMS.filter(i => i.cat === cat || cat === 'videos');
    renderExploreGrid(items.length ? items : EXPLORE_ITEMS);
}

function initSearch() {
    renderExploreTags();
    renderExploreGrid(EXPLORE_ITEMS);

    const input = $('#search-input');
    const clearBtn = $('#search-clear');
    const suggestions = $('#search-suggestions');

    input.addEventListener('input', () => {
        const val = input.value.trim().toLowerCase();
        clearBtn.classList.toggle('hidden', !val);

        if (val.length > 0) {
            const matches = SEARCH_USERS.filter(u => u.username.includes(val) || u.name.toLowerCase().includes(val));
            if (matches.length) {
                suggestions.classList.remove('hidden');
                suggestions.innerHTML = matches.map(u => `
          <div class="suggestion-item">
            <img src="${u.avatar}" alt="${u.username}" />
            <div class="suggestion-info">
              <strong>${u.username}</strong>
              <span>${u.name} · ${u.followers} followers</span>
            </div>
          </div>`).join('');
            } else {
                suggestions.classList.add('hidden');
            }
        } else {
            suggestions.classList.add('hidden');
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.add('hidden');
        suggestions.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!suggestions.contains(e.target) && e.target !== input) {
            suggestions.classList.add('hidden');
        }
    });

    $$('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterExplore(btn.dataset.cat);
        });
    });
}

/* ─────────────────────────────────────────────
   9. REELS PAGE
───────────────────────────────────────────── */

function initReels() {
    const container = $('#reels-container');
    // if (container.children.length) return; // already rendered

    const recentReels = [];

    function getRandomReel() {
        let reel;

        do {
            reel = REELS[Math.floor(Math.random() * REELS.length)];
        } while (recentReels.includes(reel.id));

        recentReels.push(reel.id);

        if (recentReels.length > 10) {
            recentReels.shift();
        }

        return reel;
    }

    for (let i = 0; i < 20; i++) {
        const reel = getRandomReel();

        const liked = APP_STATE.likedPosts.has(reel.id);
        const followed = APP_STATE.followedUsers.has(reel.username);

        const el = document.createElement('div');
        el.className = 'reel-item';
        el.innerHTML = `
      <video class="reel-video" src="${reel.video}" loop playsinline></video>
      <div class="reel-gradient"></div>
      <div class="reel-play-indicator" id="play-ind-${reel.id}">⏸</div>

      <div class="reel-info">
        <div class="reel-user">
          <img src="${reel.avatar}" alt="${reel.username}" />
          <strong>${reel.username}</strong>
          ${reel.verified ? '<span class="verified-badge">✓</span>' : ''}
          <button class="reel-follow-btn ${followed ? 'following' : ''}" data-username="${reel.username}">
            ${followed ? 'Following' : 'Follow'}
          </button>
        </div>
        <div class="reel-caption">${reel.caption}</div>
        <div class="reel-music">
          <span class="reel-music-icon">🎵</span>
          ${reel.music}
        </div>
      </div>

      <div class="reel-actions">
        <button class="reel-action-btn reel-like ${liked ? 'liked' : ''}" data-id="${reel.id}">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>${fmt(reel.likes + (liked ? 1 : 0))}</span>
        </button>
        <button class="reel-action-btn reel-comment">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>${fmt(reel.comments)}</span>
        </button>
        <button class="reel-action-btn reel-share">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span>${fmt(reel.shares)}</span>
        </button>
        <button class="reel-action-btn reel-save">
          <svg viewBox="0 0 24 24"><polygon points="19 21 12 16 5 21 5 3 19 3"/></svg>
          <span>Save</span>
        </button>
        <div class="reel-music-disc">
          <img src="${reel.musicCover}" alt="music" />
        </div>
      </div>`;

        const video = el.querySelector('.reel-video');
        const playInd = el.querySelector('.reel-play-indicator');

        // Play/pause on click
        el.addEventListener('click', (e) => {
            if (e.target.closest('.reel-actions') || e.target.closest('.reel-follow-btn')) return;
            if (video.paused) { video.play(); playInd.classList.remove('show'); }
            else { video.pause(); playInd.textContent = '▶'; playInd.classList.add('show'); setTimeout(() => playInd.classList.remove('show'), 1000); }
        });

        // Like reel
        el.querySelector('.reel-like').addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const id = btn.dataset.id;
            const countEl = btn.querySelector('span');
            const r = REELS.find(r => r.id === id);
            if (!r) return;
            if (APP_STATE.likedPosts.has(id)) {
                APP_STATE.likedPosts.delete(id);
                btn.classList.remove('liked');
                countEl.textContent = fmt(r.likes);
            } else {
                APP_STATE.likedPosts.add(id);
                btn.classList.add('liked');
                countEl.textContent = fmt(r.likes + 1);
            }
        });

        // Follow
        el.querySelector('.reel-follow-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const uname = btn.dataset.username;
            if (APP_STATE.followedUsers.has(uname)) {
                APP_STATE.followedUsers.delete(uname);
                btn.textContent = 'Follow';
                btn.classList.remove('following');
            } else {
                APP_STATE.followedUsers.add(uname);
                btn.textContent = 'Following';
                btn.classList.add('following');
            }
        });

        container.appendChild(el);
    };

    // Intersection Observer for autoplay
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.reel-video');
            if (!video) return;
            if (entry.isIntersecting) { video.play().catch(() => { }); }
            else { video.pause(); video.currentTime = 0; }
        });
    }, { threshold: 0.7 });

    $$('.reel-item', container).forEach(item => observer.observe(item));


    container.addEventListener('scroll', () => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
            initReels();
        }
    });
}

/* ─────────────────────────────────────────────
   10. CREATE POST PAGE
───────────────────────────────────────────── */

function initCreate() {
    // Tab switching
    $$('.create-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.create-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            $$('.create-tab-panel').forEach(p => p.classList.remove('active'));
            $(`#create-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // Drop zone click
    const dropZone = $('#drop-zone');
    const fileInput = $('#file-input');
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag & drop
    ['dragenter', 'dragover'].forEach(e => {
        dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(e => {
        dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.remove('drag-over'); });
    });
    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file) handleFilePreview(file);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFilePreview(e.target.files[0]);
    });

    // URL Load
    $('#load-url-btn').addEventListener('click', () => {
        const url = $('#media-url-input').value.trim();
        if (!url) return showToast('Please enter a URL');
        const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
        showMediaPreview(url, isVideo ? 'video' : 'image');
    });

    // Publish
    $('#publish-btn').addEventListener('click', publishPost);
}

function handleFilePreview(file) {
    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    showMediaPreview(url, isVideo ? 'video' : 'image');
}

function showMediaPreview(url, type) {
    const wrap = $('#preview-media-wrap');
    if (type === 'video') {
        wrap.innerHTML = `<video src="${url}" controls style="width:100%;max-height:420px;object-fit:contain;"></video>`;
    } else {
        wrap.innerHTML = `<img src="${url}" alt="preview" style="width:100%;max-height:420px;object-fit:contain;" />`;
    }
    $('#create-preview').classList.remove('hidden');
}

async function publishPost() {
    const btn = $('#publish-btn');
    const caption = $('#caption-input').value.trim();
    const hashtags = $('#hashtag-input').value.trim();
    const location = $('#location-input').value.trim();
    const preview = $('#preview-media-wrap');

    if (!preview.children.length) return showToast('Please add a photo or video first!');

    // Loading state
    btn.querySelector('.btn-text').textContent = 'Sharing...';
    btn.querySelector('.btn-loader').classList.remove('hidden');
    btn.disabled = true;

    await sleep(1800);

    // Grab media src
    const mediaEl = preview.querySelector('img, video');
    const src = mediaEl ? (mediaEl.src || mediaEl.currentSrc) : '';
    const isVideo = mediaEl && mediaEl.tagName === 'VIDEO';

    const newPost = {
        id: 'user_' + Date.now(),
        username: APP_STATE.currentUser.username,
        avatar: APP_STATE.currentUser.avatar,
        verified: APP_STATE.currentUser.verified,
        location: location || '',
        time: 'Just now',
        type: isVideo ? 'video' : 'image',
        image: isVideo ? undefined : src,
        video: isVideo ? src : undefined,
        poster: '',
        likes: 0,
        caption: caption || 'New post ✨',
        hashtags: hashtags || '',
        comments: 0,
        views: null,
        hasStory: false,
    };

    POSTS.unshift(newPost);
    const container = $('#feed-posts');
    container.insertAdjacentHTML('afterbegin', buildPostHTML(newPost));
    bindPostEvents();

    // Add to profile grid
    PROFILE_POSTS.unshift({ src: src, likes: 0, comments: 0, type: isVideo ? 'reel' : 'image' });

    // Reset form
    btn.querySelector('.btn-text').textContent = 'Share Post';
    btn.querySelector('.btn-loader').classList.add('hidden');
    btn.disabled = false;
    $('#caption-input').value = '';
    $('#hashtag-input').value = '';
    $('#location-input').value = '';
    $('#media-url-input').value = '';
    preview.innerHTML = '';
    $('#create-preview').classList.add('hidden');

    showToast('Post shared! 🎉');
    navigateTo('home');
}

/* ─────────────────────────────────────────────
   11. MESSAGES PAGE
───────────────────────────────────────────── */

function renderChatList() {
    const container = $('#chat-items');
    container.innerHTML = '';
    CHATS.forEach(chat => {
        const el = document.createElement('div');
        el.className = 'chat-item';
        el.dataset.id = chat.id;
        el.innerHTML = `
      <div class="chat-item-avatar-wrap">
        <img class="chat-item-avatar" src="${chat.avatar}" alt="${chat.name}" />
        ${chat.online ? '<span class="chat-online-dot"></span>' : ''}
      </div>
      <div class="chat-item-info">
        <strong>${chat.name}</strong>
        <span>${chat.lastMsg}</span>
      </div>
      <div class="chat-item-meta">
        <span class="chat-item-time">${chat.time}</span>
        ${chat.unread ? `<div class="chat-unread">${chat.unread}</div>` : ''}
      </div>`;
        el.addEventListener('click', () => openChat(chat.id));
        container.appendChild(el);
    });
}

function openChat(chatId) {
    const chat = CHATS.find(c => c.id === chatId);
    if (!chat) return;

    APP_STATE.currentChat = chatId;
    chat.unread = 0;

    // Update active state
    $$('.chat-item').forEach(el => el.classList.toggle('active', el.dataset.id === chatId));

    // Header
    const header = $('#chat-win-header');
    header.innerHTML = `
    <button class="icon-btn back-btn" id="chat-back">
      <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <img src="${chat.avatar}" alt="${chat.name}" />
    <div>
      <strong>${chat.name}</strong>
      <span>${chat.online ? '🟢 Online' : 'Offline'}</span>
    </div>`;

    $('#chat-back').addEventListener('click', () => {
        $('#chat-window').classList.add('hidden');
        $('#chat-window').classList.remove('mobile-open');
        $('#chat-empty').style.display = '';
    });

    // Messages
    renderMessages(chat);

    // Show window
    $('#chat-window').classList.remove('hidden');
    $('#chat-window').classList.add('mobile-open');
    $('#chat-empty').style.display = 'none';

    // Simulate typing after 1.5s
    setTimeout(() => showTypingIndicator(chat), 1500);
}

function renderMessages(chat) {
    const container = $('#chat-messages');
    container.innerHTML = '';
    chat.messages.forEach(msg => {
        container.appendChild(buildMessageBubble(msg, chat.avatar));
    });
    container.scrollTop = container.scrollHeight;
}

function buildMessageBubble(msg, theirAvatar) {
    const wrap = document.createElement('div');
    wrap.className = `msg-bubble-wrap ${msg.from === 'me' ? 'me' : ''}`;
    wrap.innerHTML = `
    ${msg.from !== 'me' ? `<img class="msg-avatar" src="${theirAvatar}" alt="" />` : ''}
    <div>
      <div class="msg-bubble">${msg.text}</div>
      <div class="msg-time">${msg.time}</div>
    </div>`;
    return wrap;
}

function showTypingIndicator(chat) {
    if (APP_STATE.currentChat !== chat.id) return;
    const container = $('#chat-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'msg-bubble-wrap';
    typingEl.id = 'typing-indicator';
    typingEl.innerHTML = `
    <img class="msg-avatar" src="${chat.avatar}" alt="" />
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;

    // Remove typing and add reply
    setTimeout(() => {
        typingEl.remove();
        const replies = ['That sounds amazing! 😊', 'Can\'t wait! 🎉', '100% agree with you', 'Haha yes totally! 😂', 'Oh wow, tell me more!'];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msg = { from: 'them', text: reply, time: timeStr };
        chat.messages.push(msg);
        container.appendChild(buildMessageBubble(msg, chat.avatar));
        container.scrollTop = container.scrollHeight;
    }, 2000);
}

function initMessages() {
    renderChatList();

    const sendBtn = $('#send-btn');
    const chatInput = $('#chat-input');

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || !APP_STATE.currentChat) return;

        const chat = CHATS.find(c => c.id === APP_STATE.currentChat);
        if (!chat) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msg = { from: 'me', text, time: timeStr };
        chat.messages.push(msg);
        chat.lastMsg = text;

        const container = $('#chat-messages');
        container.appendChild(buildMessageBubble(msg, chat.avatar));
        container.scrollTop = container.scrollHeight;
        chatInput.value = '';

        // Update chat list preview
        const chatItemEl = $(`.chat-item[data-id="${APP_STATE.currentChat}"] .chat-item-info span`);
        if (chatItemEl) chatItemEl.textContent = text;

        // Trigger reply
        setTimeout(() => showTypingIndicator(chat), 800);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    $('#chat-img-btn').addEventListener('click', () => showToast('Image sharing coming soon!'));
}

/* ─────────────────────────────────────────────
   12. NOTIFICATIONS PAGE
───────────────────────────────────────────── */

function renderNotifications(tab) {
    const container = $('#notif-list');
    container.innerHTML = '';
    const filtered = tab === 'all' ? NOTIFICATIONS
        : NOTIFICATIONS.filter(n => n.type === (tab === 'follows' ? 'follow' : tab === 'likes' ? 'like' : tab === 'comments' ? 'comment' : n.type));

    filtered.forEach(n => {
        const el = document.createElement('div');
        el.className = `notif-item ${n.unread ? 'unread' : ''}`;

        const icon = { like: '❤️', follow: '👤', comment: '💬', mention: '@' }[n.type] || '🔔';

        el.innerHTML = `
      <img class="notif-avatar" src="${n.avatar}" alt="${n.username}" />
      <div class="notif-text">
        <strong>${n.username}</strong> ${n.text}
        <time>${n.time}</time>
      </div>
      ${n.type === 'follow'
                ? `<button class="notif-follow-btn ${APP_STATE.followedUsers.has(n.username) ? 'following' : ''}" data-username="${n.username}">
            ${APP_STATE.followedUsers.has(n.username) ? 'Following' : 'Follow'}
           </button>`
                : (n.thumb ? `<img class="notif-thumb" src="${n.thumb}" alt="post" />` : `<span class="notif-icon">${icon}</span>`)
            }`;

        const followBtn = el.querySelector('.notif-follow-btn');
        if (followBtn) {
            followBtn.addEventListener('click', () => {
                const uname = followBtn.dataset.username;
                if (APP_STATE.followedUsers.has(uname)) {
                    APP_STATE.followedUsers.delete(uname);
                    followBtn.textContent = 'Follow';
                    followBtn.classList.remove('following');
                } else {
                    APP_STATE.followedUsers.add(uname);
                    followBtn.textContent = 'Following';
                    followBtn.classList.add('following');
                }
            });
        }

        container.appendChild(el);
        n.unread = false;
    });

    // Update badge
    const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
    const badge = $('#notif-badge');
    if (badge) badge.textContent = unreadCount || '';
    if (!unreadCount && badge) badge.classList.add('hidden');
}

function initNotifications() {
    $$('.notif-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.notif-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderNotifications(tab.dataset.ntab);
        });
    });
}

/* ─────────────────────────────────────────────
   13. PROFILE PAGE
───────────────────────────────────────────── */

function renderProfile() {
    // Highlights
    const hlRow = $('#highlights-row');
    HIGHLIGHTS.forEach(h => {
        const el = document.createElement('div');
        el.className = 'highlight-item';
        el.innerHTML = `
      <div class="highlight-ring"><img src="${h.cover}" alt="${h.label}" loading="lazy" /></div>
      <span>${h.label}</span>`;
        el.addEventListener('click', () => openStory(0));
        hlRow.appendChild(el);
    });

    renderProfileGrid('posts');
}

function renderProfileGrid(tab) {
    const grid = $('#profile-grid');
    grid.innerHTML = '';
    const items = tab === 'reels' ? PROFILE_POSTS.filter(p => p.type === 'reel')
        : tab === 'tagged' ? PROFILE_POSTS.slice(0, 4)
            : PROFILE_POSTS;

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'profile-grid-item';
        el.innerHTML = `
      ${item.type === 'reel'
                ? `<video src="${item.src}" muted autoplay loop></video>`
                : `<img src="${item.src}" alt="post" loading="lazy" />`
            }
      ${item.type === 'reel' ? `<div class="reel-badge"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>` : ''}
      <div class="profile-grid-overlay">
        <span>❤️ ${fmt(item.likes)}</span>
        <span>💬 ${fmt(item.comments)}</span>
      </div>`;
        el.addEventListener('click', () => {
            openPostModal({ id: 'pg', username: APP_STATE.currentUser.username, avatar: APP_STATE.currentUser.avatar, verified: APP_STATE.currentUser.verified, location: '', time: 'Recently', type: item.type === 'reel' ? 'video' : 'image', image: item.src, video: item.src, likes: item.likes, caption: '', hashtags: '', comments: item.comments, views: null, hasStory: false });
        });
        grid.appendChild(el);
    });
}

function initProfile() {
    // Update profile display
    $('#profile-username').textContent = APP_STATE.currentUser.username;
    $('#profile-bio').innerHTML = APP_STATE.currentUser.bio.replace(/\n/g, '<br/>') + `<br/>🔗 <a href="#" class="profile-link">${APP_STATE.currentUser.website}</a>`;

    // Profile tabs
    $$('.profile-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.profile-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProfileGrid(tab.dataset.ptab);
        });
    });

    renderProfile();

    // Edit profile button
    $('#edit-profile-btn').addEventListener('click', openEditModal);
}

/* ─────────────────────────────────────────────
   14. EDIT PROFILE MODAL
───────────────────────────────────────────── */

function openEditModal() {
    $('#edit-username').value = APP_STATE.currentUser.username;
    $('#edit-bio').value = APP_STATE.currentUser.bio;
    $('#edit-website').value = APP_STATE.currentUser.website;
    $('#edit-modal').classList.remove('hidden');
}

function initEditModal() {
    $('#edit-modal-close').addEventListener('click', () => $('#edit-modal').classList.add('hidden'));
    $('#edit-modal').addEventListener('click', (e) => {
        if (e.target === $('#edit-modal')) $('#edit-modal').classList.add('hidden');
    });

    $('#save-profile-btn').addEventListener('click', () => {
        APP_STATE.currentUser.username = $('#edit-username').value.trim() || APP_STATE.currentUser.username;
        APP_STATE.currentUser.bio = $('#edit-bio').value.trim();
        APP_STATE.currentUser.website = $('#edit-website').value.trim();

        $('#profile-username').textContent = APP_STATE.currentUser.username;
        $('#profile-bio').innerHTML = APP_STATE.currentUser.bio.replace(/\n/g, '<br/>') + `<br/>🔗 <a href="#" class="profile-link">${APP_STATE.currentUser.website}</a>`;

        $('#edit-modal').classList.add('hidden');
        showToast('Profile updated! ✨');
    });
}

/* ─────────────────────────────────────────────
   15. TOAST NOTIFICATION
───────────────────────────────────────────── */

function showToast(msg) {
    // Remove existing toast
    const existing = document.getElementById('lumina-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'lumina-toast';
    toast.textContent = msg;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: 'var(--text)',
        color: 'var(--bg)',
        padding: '10px 20px',
        borderRadius: '9999px',
        fontSize: '0.88rem',
        fontWeight: '600',
        zIndex: '9999',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        opacity: '0',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        whiteSpace: 'nowrap',
        maxWidth: '90vw',
        textAlign: 'center',
    });
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

/* ─────────────────────────────────────────────
   16. KEYBOARD SHORTCUTS
───────────────────────────────────────────── */

function initKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $('#story-overlay').classList.add('hidden');
            $('#post-modal').classList.add('hidden');
            $('#edit-modal').classList.add('hidden');
            clearTimeout(storyTimer);
        }
    });
}

/* ─────────────────────────────────────────────
   17. LAZY LOADING IMAGES
───────────────────────────────────────────── */

function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '300px' });

    $$('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ─────────────────────────────────────────────
   18. APP INIT
───────────────────────────────────────────── */

function init() {
    // Theme
    initTheme();

    // Navigation
    initNavigation();

    // Stories
    renderStories();
    initStoryControls();

    // Feed
    renderFeed();
    initInfiniteScroll();

    // Post modal
    initPostModal();

    // Search / Explore
    initSearch();

    // Create
    initCreate();

    // Messages
    initMessages();

    // Notifications
    initNotifications();

    // Profile
    initProfile();

    // Edit modal
    initEditModal();

    // Keyboard
    initKeyboard();

    // Lazy load
    initLazyLoad();

    // Start on home
    navigateTo('home');

    console.log('%c✨ Lumina loaded!', 'font-size:16px;font-weight:bold;color:#7c3aed;');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}