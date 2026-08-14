const POSTER_THEMES = [
  { bg: "#171316", accent: "#d62839", alt: "#f7b801", clue: "Action" },
  { bg: "#102a43", accent: "#008f8c", alt: "#fff3d8", clue: "Drama" },
  { bg: "#2d1b4e", accent: "#6c63ff", alt: "#f7b801", clue: "Epic" },
  { bg: "#263618", accent: "#f7b801", alt: "#fffaf3", clue: "Mass" },
  { bg: "#3d0f1e", accent: "#ff6b6b", alt: "#f8edeb", clue: "Love" },
  { bg: "#1f2937", accent: "#60a5fa", alt: "#f9fafb", clue: "Thriller" }
];

function makePoster(title, year, index) {
  const theme = POSTER_THEMES[index % POSTER_THEMES.length];
  const initials = title
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="${theme.bg}"/>
      <circle cx="200" cy="172" r="112" fill="${theme.accent}"/>
      <path d="M68 360h264v92H68z" fill="${theme.alt}"/>
      <path d="M92 388h216v18H92zM116 426h168v16H116z" fill="${theme.bg}" opacity=".72"/>
      <text x="200" y="203" text-anchor="middle" font-family="Arial" font-size="82" font-weight="900" fill="${theme.alt}">${initials}</text>
      <text x="200" y="515" text-anchor="middle" font-family="Arial" font-size="34" font-weight="900" fill="${theme.alt}">${theme.clue}</text>
      <text x="200" y="558" text-anchor="middle" font-family="Arial" font-size="28" font-weight="800" fill="${theme.accent}">${year}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeCloseup(index) {
  const theme = POSTER_THEMES[index % POSTER_THEMES.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="${theme.bg}"/>
      <circle cx="300" cy="190" r="160" fill="${theme.accent}"/>
      <circle cx="300" cy="190" r="82" fill="${theme.alt}"/>
      <path d="M142 316h316v44H142z" fill="${theme.accent}"/>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const TELUGU_MOVIE_NAMES = [
  ["Dookudu", 2011],
  ["Mr. Perfect", 2011],
  ["Businessman", 2012],
  ["Eega", 2012],
  ["Gabbar Singh", 2012],
  ["Julayi", 2012],
  ["Seethamma Vakitlo Sirimalle Chettu", 2013],
  ["Mirchi", 2013],
  ["Attarintiki Daredi", 2013],
  ["Yevadu", 2014],
  ["Manam", 2014],
  ["Race Gurram", 2014],
  ["Temper", 2015],
  ["S/O Satyamurthy", 2015],
  ["Srimanthudu", 2015],
  ["Baahubali: The Beginning", 2015],
  ["Nannaku Prematho", 2016],
  ["Sarrainodu", 2016],
  ["Janatha Garage", 2016],
  ["Dhruva", 2016],
  ["Khaidi No. 150", 2017],
  ["Baahubali 2: The Conclusion", 2017],
  ["Fidaa", 2017],
  ["Arjun Reddy", 2017],
  ["Mahanati", 2018],
  ["Bharat Ane Nenu", 2018],
  ["Rangasthalam", 2018],
  ["Geetha Govindam", 2018],
  ["Aravinda Sametha Veera Raghava", 2018],
  ["F2: Fun and Frustration", 2019],
  ["Maharshi", 2019],
  ["Jersey", 2019],
  ["iSmart Shankar", 2019],
  ["Ala Vaikunthapurramuloo", 2020],
  ["Sarileru Neekevvaru", 2020],
  ["Uppena", 2021],
  ["Jathi Ratnalu", 2021],
  ["Vakeel Saab", 2021],
  ["Akhanda", 2021],
  ["Pushpa: The Rise", 2021],
  ["DJ Tillu", 2022],
  ["Bheemla Nayak", 2022],
  ["RRR", 2022],
  ["Major", 2022],
  ["Karthikeya 2", 2022],
  ["Sita Ramam", 2022],
  ["Waltair Veerayya", 2023],
  ["Veera Simha Reddy", 2023],
  ["Dasara", 2023],
  ["Baby", 2023],
  ["Virupaksha", 2023],
  ["Bhagavanth Kesari", 2023],
  ["Salaar", 2023],
  ["Hanu-Man", 2024],
  ["Guntur Kaaram", 2024],
  ["Tillu Square", 2024],
  ["Kalki 2898 AD", 2024],
  ["Saripodhaa Sanivaaram", 2024],
  ["Devara: Part 1", 2024],
  ["Lucky Baskhar", 2024]
];

const MOVIES = TELUGU_MOVIE_NAMES.map(([title, year], index) => ({
  id: index + 1,
  title,
  year,
  category: "Telugu",
  poster: makePoster(title, year, index),
  closeup: makeCloseup(index),
  emojis: "",
  charades: true
}));
