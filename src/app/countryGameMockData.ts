// Mock data for the country guessing game
export const mockCountryData = [
  {
    iso2: "US" as const,
    englishName: "United States",
    koreanName: "미국",
    capital: "워싱턴 D.C.",
    representative: "자유의 여신상"
  },
  {
    iso2: "GB" as const,
    englishName: "United Kingdom", 
    koreanName: "영국",
    capital: "런던",
    representative: "빅벤"
  },
  {
    iso2: "KR" as const,
    englishName: "South Korea",
    koreanName: "대한민국", 
    capital: "서울",
    representative: "한복"
  },
  {
    iso2: "JP" as const,
    englishName: "Japan",
    koreanName: "일본",
    capital: "도쿄", 
    representative: "후지산"
  },
  {
    iso2: "CN" as const,
    englishName: "China",
    koreanName: "중국",
    capital: "베이징",
    representative: "만리장성"
  },
  {
    iso2: "FR" as const,
    englishName: "France", 
    koreanName: "프랑스",
    capital: "파리",
    representative: "에펠탑"
  },
  {
    iso2: "DE" as const,
    englishName: "Germany",
    koreanName: "독일",
    capital: "베를린", 
    representative: "브란덴부르크 문"
  },
  {
    iso2: "IT" as const,
    englishName: "Italy",
    koreanName: "이탈리아",
    capital: "로마",
    representative: "콜로세움"
  }
];

export const mockRootProps = {
  initialStep: "ready" as const,
  gameTitle: "나라를 맞춰라!",
  maxHints: 2,
  soundEnabled: true
};