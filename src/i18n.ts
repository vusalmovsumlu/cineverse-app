export type Language = 'az' | 'en';

export const Translations = {
  az: {
    // Naviqasiya
    home: 'Ana səhifə',
    search: 'Axtarış',
    watchlist: 'İzləmə siyahısı',
    profile: 'Profil',
    watchedMovies: 'İzlənmiş filmlər',
    settings: 'Ayarlar',
    movieDetails: 'Film Detalları',
    reviews: 'Rəylər',
    editReview: 'Rəyi Redaktə Et',

    // Onboarding & Auth
    skip: 'Keç',
    next: 'Növbəti',
    start: 'Başla',
    slide1Title: 'Filmləri Kəşf Et',
    slide1Desc: 'Ən son trend, populyar və yüksək reytinqli filmləri bir yerdə izlə.',
    slide2Title: 'Şəxsi Watchlist Yarat',
    slide2Desc: 'İzləmək istədiyin və bitirdiyin filmləri siyahına əlavə et.',
    slide3Title: 'Qiymətləndir və Rəy Yaz',
    slide3Desc: 'Filmlərə 1-5 ulduz ver, fikirlərini bölüş və statistikanı gör.',
    loginSubtitle: 'Hesabınıza daxil olun',
    registerTitle: 'Qeydiyyat',
    registerSubtitle: 'Yeni CineVerse hesabı yaradın',
    namePlaceholder: 'Adınız',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Şifrə',
    loginBtn: 'Daxil ol',
    registerBtn: 'Hesab yarat',
    noAccount: 'Hesabınız yoxdur? ',
    haveAccount: 'Artıq hesabınız var? ',

    // Home
    trending: 'Trenddə olanlar',
    topRated: 'Ən yüksək reytinqli',
    recentViews: 'Son baxılanlar',
    popularMovies: 'Populyar filmlər',
    offlineBanner: 'İnternet yoxdur. Keşlənmiş filmlər göstərilir.',
    loadError: 'Filmləri yükləmək mümkün olmadı',
    retry: 'Yenidən yoxla',

    // Search
    searchPlaceholder: 'Film adı axtar...',
    allGenres: 'Bütün janrlar',
    minRating: 'Min. Reytinq:',
    all: 'Hamısı',
    noMoviesFound: 'Uyğun film tapılmadı',

    // Watchlist & Watched
    markWatched: 'İzlədim',
    emptyWatchlist: 'Watchlist siyahınız boşdur',
    watchedStatus: 'İzlənilib',
    backToWatchlist: 'Watchlist-ə qaytar',
    emptyWatched: 'Hələ izlənilmiş film yoxdur',

    // Profile
    watchStats: 'İzləmə Statistikası',
    watchedCount: 'İzlənilib',
    favoriteGenre: 'Sevimli janr',
    avgRating: 'Orta reytinq',
    totalReviews: 'Yazılmış ümumi rəy sayı',
    logout: 'Hesabdan çıx',
    none: 'Yoxdur',

    // Settings
    darkMode: 'Qaranlıq Rejim (Dark Mode)',
    darkActive: 'Aktivdir',
    lightActive: 'Açıq tema aktivdir',
    notifications: 'Bildirişlər',
    notificationsSub: 'Yeni filmlər haqqında xatırlatmalar',
    languageTitle: 'Tətbiq Dili',
    languageSub: 'Azərbaycan / English (Avto-tərcümə)',

    // Movie Details & Reviews
    minutes: 'dəq',
    addToWatchlist: 'Watchlist-ə at',
    inWatchlist: 'Watchlist-dədir',
    overview: 'Məzmun',
    noOverview: 'Təsvir mövcud deyil.',
    cast: 'Aktyorlar',
    reviewsAndRating: 'Rəylər və Qiymətləndirmə',
    yourRating: 'Qiymətiniz (1–5 ulduz):',
    reviewPlaceholder: 'Film haqqında fikrinizi yazın...',
    addReviewBtn: 'Rəy əlavə et',
    edit: 'Redaktə et',
    delete: 'Sil',
    noReviewsYet: 'Bu filmə hələ rəy yazılmayıb.',
    newRating: 'Yeni qiymət (1–5 ulduz):',
    reviewText: 'Rəy mətni:',
    save: 'Yadda saxla',
  },

  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    watchlist: 'Watchlist',
    profile: 'Profile',
    watchedMovies: 'Watched Movies',
    settings: 'Settings',
    movieDetails: 'Movie Details',
    reviews: 'Reviews',
    editReview: 'Edit Review',

    // Onboarding & Auth
    skip: 'Skip',
    next: 'Next',
    start: 'Get Started',
    slide1Title: 'Discover Movies',
    slide1Desc: 'Explore trending, popular, and top-rated movies all in one place.',
    slide2Title: 'Build Your Watchlist',
    slide2Desc: 'Save movies you want to watch and track the ones you have finished.',
    slide3Title: 'Rate & Write Reviews',
    slide3Desc: 'Rate movies 1-5 stars, share your thoughts, and view your stats.',
    loginSubtitle: 'Sign in to your account',
    registerTitle: 'Register',
    registerSubtitle: 'Create a new CineVerse account',
    namePlaceholder: 'Your Name',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    loginBtn: 'Sign In',
    registerBtn: 'Create Account',
    noAccount: "Don't have an account? ",
    haveAccount: 'Already have an account? ',

    // Home
    trending: 'Trending',
    topRated: 'Top Rated',
    recentViews: 'Recently Viewed',
    popularMovies: 'Popular Movies',
    offlineBanner: 'You are offline. Showing cached movies.',
    loadError: 'Failed to load movies',
    retry: 'Retry',

    // Search
    searchPlaceholder: 'Search movies...',
    allGenres: 'All Genres',
    minRating: 'Min. Rating:',
    all: 'All',
    noMoviesFound: 'No matching movies found',

    // Watchlist & Watched
    markWatched: 'Watched',
    emptyWatchlist: 'Your watchlist is empty',
    watchedStatus: 'Watched',
    backToWatchlist: 'Move to Watchlist',
    emptyWatched: 'No watched movies yet',

    // Profile
    watchStats: 'Watching Statistics',
    watchedCount: 'Watched',
    favoriteGenre: 'Favorite Genre',
    avgRating: 'Avg. Rating',
    totalReviews: 'Total Reviews Written',
    logout: 'Log Out',
    none: 'None',

    // Settings
    darkMode: 'Dark Mode',
    darkActive: 'Enabled',
    lightActive: 'Light theme enabled',
    notifications: 'Notifications',
    notificationsSub: 'Reminders about new movies',
    languageTitle: 'App Language',
    languageSub: 'Azərbaycan / English (Auto-translate)',

    // Movie Details & Reviews
    minutes: 'min',
    addToWatchlist: 'Add to Watchlist',
    inWatchlist: 'In Watchlist',
    overview: 'Overview',
    noOverview: 'No overview available.',
    cast: 'Cast',
    reviewsAndRating: 'Reviews & Ratings',
    yourRating: 'Your Rating (1–5 stars):',
    reviewPlaceholder: 'Write your thoughts about this movie...',
    addReviewBtn: 'Add Review',
    edit: 'Edit',
    delete: 'Delete',
    noReviewsYet: 'No reviews written for this movie yet.',
    newRating: 'New Rating (1–5 stars):',
    reviewText: 'Review Text:',
    save: 'Save Changes',
  },
};

export type TranslationKey = keyof typeof Translations.az;