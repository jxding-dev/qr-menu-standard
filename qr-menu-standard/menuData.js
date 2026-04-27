window.storeData = {
  name: "On The Table",
  tableName: "B-07",
  kakaoUrl: "https://pf.kakao.com/",
  currency: "원",
  categories: [
    { id: "signature", label: "시그니처" },
    { id: "coffee", label: "커피" },
    { id: "dessert", label: "디저트" },
    { id: "drink", label: "음료" }
  ],
  commonOptions: {
    temperature: {
      name: "온도",
      required: true,
      type: "single",
      items: [
        { label: "Ice", price: 0 },
        { label: "Hot", price: 0 }
      ]
    },
    coffeeExtra: {
      name: "커피 추가",
      type: "multiple",
      items: [
        { label: "샷 추가", price: 700 },
        { label: "디카페인 변경", price: 500 },
        { label: "오트 밀크", price: 800 }
      ]
    },
    dessertPack: {
      name: "포장 옵션",
      required: true,
      type: "single",
      items: [
        { label: "매장 접시", price: 0 },
        { label: "포장 박스", price: 500 }
      ]
    }
  },
  menus: [
    {
      id: "cream-latte",
      category: "signature",
      name: "온더 크림 라떼",
      description: "바닐라빈 크림과 진한 에스프레소",
      price: 6800,
      badge: "Best",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature", "coffeeExtra"]
    },
    {
      id: "einspanner",
      category: "signature",
      name: "클래식 아인슈페너",
      description: "수제 크림과 고소한 블렌드",
      price: 6500,
      badge: "Best",
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["coffeeExtra"]
    },
    {
      id: "dirty-matcha",
      category: "signature",
      name: "더티 말차",
      description: "제주 말차 위에 에스프레소 한 샷",
      price: 7000,
      image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature", "coffeeExtra"]
    },
    {
      id: "brown-cream",
      category: "signature",
      name: "브라운슈가 크림",
      description: "흑당 시럽과 부드러운 크림",
      price: 6900,
      image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature"]
    },
    {
      id: "americano",
      category: "coffee",
      name: "아메리카노",
      description: "데일리 블렌드의 깔끔한 산미",
      price: 4500,
      badge: "Best",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature", "coffeeExtra"]
    },
    {
      id: "latte",
      category: "coffee",
      name: "카페 라떼",
      description: "고소한 우유와 균형 잡힌 커피",
      price: 5200,
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature", "coffeeExtra"]
    },
    {
      id: "vanilla-latte",
      category: "coffee",
      name: "바닐라 라떼",
      description: "마다가스카르 바닐라 시럽",
      price: 5800,
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature", "coffeeExtra"]
    },
    {
      id: "coldbrew",
      category: "coffee",
      name: "콜드브루",
      description: "12시간 저온 추출 커피",
      price: 5600,
      image: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["coffeeExtra"]
    },
    {
      id: "mocha",
      category: "coffee",
      name: "카페 모카",
      description: "다크 초콜릿과 에스프레소",
      price: 6200,
      image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature", "coffeeExtra"]
    },
    {
      id: "cheesecake",
      category: "dessert",
      name: "바스크 치즈케이크",
      description: "꾸덕한 치즈 풍미의 인기 디저트",
      price: 7200,
      badge: "Best",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["dessertPack"]
    },
    {
      id: "croffle",
      category: "dessert",
      name: "브라운슈가 크로플",
      description: "따뜻한 크로플과 캐러멜 소스",
      price: 7800,
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["dessertPack"],
      options: [
        {
          name: "토핑",
          type: "multiple",
          items: [
            { label: "바닐라 아이스크림", price: 1500 },
            { label: "생크림", price: 900 }
          ]
        }
      ]
    },
    {
      id: "tiramisu",
      category: "dessert",
      name: "티라미수 컵",
      description: "마스카포네 크림과 커피 시럽",
      price: 6900,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["dessertPack"]
    },
    {
      id: "financier",
      category: "dessert",
      name: "버터 휘낭시에",
      description: "고소한 버터와 아몬드 향",
      price: 3200,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["dessertPack"]
    },
    {
      id: "cookie",
      category: "dessert",
      name: "초코칩 쿠키",
      description: "진한 초콜릿 청크 쿠키",
      price: 3800,
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["dessertPack"]
    },
    {
      id: "grapefruit-ade",
      category: "drink",
      name: "자몽 에이드",
      description: "수제 자몽청과 탄산",
      price: 6200,
      badge: "Best",
      image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
      options: [
        {
          name: "얼음",
          required: true,
          type: "single",
          items: [
            { label: "기본", price: 0 },
            { label: "적게", price: 0 },
            { label: "많이", price: 0 }
          ]
        }
      ]
    },
    {
      id: "lemon-tea",
      category: "drink",
      name: "레몬 아이스티",
      description: "상큼한 레몬과 홍차",
      price: 5600,
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "chamomile",
      category: "drink",
      name: "캐모마일 티",
      description: "은은한 향의 허브티",
      price: 5200,
      image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature"]
    },
    {
      id: "milk-tea",
      category: "drink",
      name: "얼그레이 밀크티",
      description: "베르가못 향과 진한 우유",
      price: 6400,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
      optionRefs: ["temperature"]
    },
    {
      id: "strawberry-latte",
      category: "drink",
      name: "딸기 라떼",
      description: "수제 딸기청과 우유",
      price: 6500,
      image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "yogurt-smoothie",
      category: "drink",
      name: "요거트 스무디",
      description: "상큼한 플레인 요거트 베이스",
      price: 6800,
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80"
    }
  ]
};
