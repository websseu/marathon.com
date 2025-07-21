import {
  Home,
  Newspaper,
  Rat,
  PocketKnife,
  BellElectric,
  Flower,
  Pizza,
  Siren,
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface MenuItem {
  icon: LucideIcon
  label: string
  href: string
  type: 'page' | 'dialog'
}

// 오른쪽 버튼 메뉴
export const menuItems: MenuItem[] = [
  { icon: Home, label: '홈', href: '/', type: 'page' },
  { icon: Newspaper, label: '공지사항', href: '#notice', type: 'dialog' },
  { icon: Rat, label: '문의하기', href: '#contact', type: 'dialog' },
  { icon: PocketKnife, label: '기록관리', type: 'page', href: '/record' },
  { icon: BellElectric, label: '프로필', type: 'page', href: '/profile' },
]

export const authItems: MenuItem[] = [
  { icon: Flower, label: '로그인', href: '#login', type: 'dialog' },
  { icon: Pizza, label: '회원가입', href: '#signup', type: 'dialog' },
]

export const loggedInItems: MenuItem[] = [
  { icon: Siren, label: '로그아웃', href: '#logout', type: 'dialog' },
]

// 유튜브 나라별 메뉴
export interface YoutubeCountry {
  name: string
  nameKorean: string
  icon: string
  url: string
}

export const youtubeCountry: YoutubeCountry[] = [
  {
    name: 'global',
    nameKorean: '글로벌',
    icon: '🌏',
    url: 'https://charts.youtube.com/charts/TopSongs/global/weekly',
  },
  {
    name: 'argentina',
    nameKorean: '아르헨티나',
    icon: '🇦🇷',
    url: 'https://charts.youtube.com/charts/TopSongs/ar/weekly',
  },
  {
    name: 'australia',
    nameKorean: '호주',
    icon: '🇦🇺',
    url: 'https://charts.youtube.com/charts/TopSongs/au/weekly',
  },
  {
    name: 'austria',
    nameKorean: '오스트리아',
    icon: '🇦🇹',
    url: 'https://charts.youtube.com/charts/TopSongs/at/weekly',
  },
  {
    name: 'belgium',
    nameKorean: '벨기에',
    icon: '🇧🇪',
    url: 'https://charts.youtube.com/charts/TopSongs/be/weekly',
  },
  {
    name: 'bolivia',
    nameKorean: '볼리비아',
    icon: '🇧🇴',
    url: 'https://charts.youtube.com/charts/TopSongs/be/weekly',
  },
  {
    name: 'brazil',
    nameKorean: '브라질',
    icon: '🇧🇷',
    url: 'https://charts.youtube.com/charts/TopSongs/br/weekly',
  },
  {
    name: 'canada',
    nameKorean: '캐나다',
    icon: '🇨🇦',
    url: 'https://charts.youtube.com/charts/TopSongs/ca/weekly',
  },
  {
    name: 'chile',
    nameKorean: '칠레',
    icon: '🇨🇱',
    url: 'https://charts.youtube.com/charts/TopSongs/cl/weekly',
  },
  {
    name: 'colombia',
    nameKorean: '콜롬비아',
    icon: '🇨🇴',
    url: 'https://charts.youtube.com/charts/TopSongs/co/weekly',
  },
  {
    name: 'costa-rica',
    nameKorean: '코스타리카',
    icon: '🇨🇷',
    url: 'https://charts.youtube.com/charts/TopSongs/cr/weekly',
  },
  {
    name: 'czechia',
    nameKorean: '체코',
    icon: '🇨🇿',
    url: 'https://charts.youtube.com/charts/TopSongs/cz/weekly',
  },
  {
    name: 'denmark',
    nameKorean: '덴마크',
    icon: '🇩🇰',
    url: 'https://charts.youtube.com/charts/TopSongs/dk/weekly',
  },
  {
    name: 'dominican_republic',
    nameKorean: '도미니카 공화국',
    icon: '🇩🇴',
    url: 'https://charts.youtube.com/charts/TopSongs/do/weekly',
  },
  {
    name: 'ecuador',
    nameKorean: '에콰도르',
    icon: '🇪🇨',
    url: 'https://charts.youtube.com/charts/TopSongs/ec/weekly',
  },
  {
    name: 'egypt',
    nameKorean: '이집트',
    icon: '🇪🇬',
    url: 'https://charts.youtube.com/charts/TopSongs/eg/weekly',
  },
  {
    name: 'el-salvador',
    nameKorean: '엘살바도르',
    icon: '🇸🇻',
    url: 'https://charts.youtube.com/charts/TopSongs/sv/weekly',
  },
  {
    name: 'estonia',
    nameKorean: '에스토니아',
    icon: '🇪🇪',
    url: 'https://charts.youtube.com/charts/TopSongs/ee/weekly',
  },
  {
    name: 'finland',
    nameKorean: '핀란드',
    icon: '🇫🇮',
    url: 'https://charts.youtube.com/charts/TopSongs/fi/weekly',
  },
  {
    name: 'france',
    nameKorean: '프랑스',
    icon: '🇫🇷',
    url: 'https://charts.youtube.com/charts/TopSongs/fr/weekly',
  },
  {
    name: 'germany',
    nameKorean: '독일',
    icon: '🇩🇪',
    url: 'https://charts.youtube.com/charts/TopSongs/de/weekly',
  },
  {
    name: 'guatemala',
    nameKorean: '과테말라',
    icon: '🇬🇹',
    url: 'https://charts.youtube.com/charts/TopSongs/gt/weekly',
  },
  {
    name: 'honduras',
    nameKorean: '온두라스',
    icon: '🇭🇳',
    url: 'https://charts.youtube.com/charts/TopSongs/hn/weekly',
  },
  {
    name: 'hungary',
    nameKorean: '헝가리',
    icon: '🇭🇺',
    url: 'https://charts.youtube.com/charts/TopSongs/hu/weekly',
  },
  {
    name: 'iceland',
    nameKorean: '아이슬란드',
    icon: '🇮🇸',
    url: 'https://charts.youtube.com/charts/TopSongs/is/weekly',
  },
  {
    name: 'india',
    nameKorean: '인도',
    icon: '🇮🇳',
    url: 'https://charts.youtube.com/charts/TopSongs/in/weekly',
  },
  {
    name: 'indonesia',
    nameKorean: '인도네시아',
    icon: '🇮🇩',
    url: 'https://charts.youtube.com/charts/TopSongs/id/weekly',
  },
  {
    name: 'israel',
    nameKorean: '이스라엘',
    icon: '🇮🇱',
    url: 'https://charts.youtube.com/charts/TopSongs/il/weekly',
  },
  {
    name: 'italy',
    nameKorean: '이탈리아',
    icon: '🇮🇹',
    url: 'https://charts.youtube.com/charts/TopSongs/it/weekly',
  },
  {
    name: 'japan',
    nameKorean: '일본',
    icon: '🇯🇵',
    url: 'https://charts.youtube.com/charts/TopSongs/jp/weekly',
  },
  {
    name: 'kenya',
    nameKorean: '케냐',
    icon: '🇰🇪',
    url: 'https://charts.youtube.com/charts/TopSongs/ke/weekly',
  },
  {
    name: 'luxembourg',
    nameKorean: '룩셈부르크',
    icon: '🇱🇺',
    url: 'https://charts.youtube.com/charts/TopSongs/lu/weekly',
  },
  {
    name: 'mexico',
    nameKorean: '멕시코',
    icon: '🇲🇽',
    url: 'https://charts.youtube.com/charts/TopSongs/mx/weekly',
  },
  {
    name: 'netherlands',
    nameKorean: '네덜란드',
    icon: '🇳🇱',
    url: 'https://charts.youtube.com/charts/TopSongs/nl/weekly',
  },
  {
    name: 'new-zealand',
    nameKorean: '뉴질랜드',
    icon: '🇳🇿',
    url: 'https://charts.youtube.com/charts/TopSongs/nz/weekly',
  },
  {
    name: 'nicaragua',
    nameKorean: '니카라과',
    icon: '🇳🇮',
    url: 'https://charts.youtube.com/charts/TopSongs/ni/weekly',
  },
  {
    name: 'nigeria',
    nameKorean: '나이지리아',
    icon: '🇳🇬',
    url: 'https://charts.youtube.com/charts/TopSongs/ng/weekly',
  },
  {
    name: 'norway',
    nameKorean: '노르웨이',
    icon: '🇳🇴',
    url: 'https://charts.youtube.com/charts/TopSongs/no/weekly',
  },
  {
    name: 'panama',
    nameKorean: '파나마',
    icon: '🇵🇦',
    url: 'https://charts.youtube.com/charts/TopSongs/pa/weekly',
  },
  {
    name: 'paraguay',
    nameKorean: '파라과이',
    icon: '🇵🇾',
    url: 'https://charts.youtube.com/charts/TopSongs/py/weekly',
  },
  {
    name: 'peru',
    nameKorean: '페루',
    icon: '🇵🇪',
    url: 'https://charts.youtube.com/charts/TopSongs/pe/weekly',
  },
  {
    name: 'poland',
    nameKorean: '폴란드',
    icon: '🇵🇱',
    url: 'https://charts.youtube.com/charts/TopSongs/pl/weekly',
  },
  {
    name: 'portugal',
    nameKorean: '포르투갈',
    icon: '🇵🇹',
    url: 'https://charts.youtube.com/charts/TopSongs/pt/weekly',
  },
  {
    name: 'romania',
    nameKorean: '루마니아',
    icon: '🇷🇴',
    url: 'https://charts.youtube.com/charts/TopSongs/ro/weekly',
  },
  {
    name: 'russia',
    nameKorean: '러시아',
    icon: '🇷🇺',
    url: 'https://charts.youtube.com/charts/TopSongs/ru/weekly',
  },
  {
    name: 'saudi-arabia',
    nameKorean: '사우디아라비아',
    icon: '🇸🇦',
    url: 'https://charts.youtube.com/charts/TopSongs/sa/weekly',
  },
  {
    name: 'serbia',
    nameKorean: '세르비아',
    icon: '🇷🇸',
    url: 'https://charts.youtube.com/charts/TopSongs/rs/weekly',
  },
  {
    name: 'south-africa',
    nameKorean: '남아프리카 공화국',
    icon: '🇿🇦',
    url: 'https://charts.youtube.com/charts/TopSongs/za/weekly',
  },
  {
    name: 'south-korea',
    nameKorean: '대한민국',
    icon: '🇰🇷',
    url: 'https://charts.youtube.com/charts/TopSongs/kr/weekly',
  },
  {
    name: 'spain',
    nameKorean: '스페인',
    icon: '🇪🇸',
    url: 'https://charts.youtube.com/charts/TopSongs/es/weekly',
  },
  {
    name: 'sweden',
    nameKorean: '스웨덴',
    icon: '🇸🇪',
    url: 'https://charts.youtube.com/charts/TopSongs/se/weekly',
  },
  {
    name: 'switzerland',
    nameKorean: '스위스',
    icon: '🇨🇭',
    url: 'https://charts.youtube.com/charts/TopSongs/ch/weekly',
  },
  {
    name: 'tanzania',
    nameKorean: '탄자니아',
    icon: '🇹🇿',
    url: 'https://charts.youtube.com/charts/TopSongs/tz/weekly',
  },
  {
    name: 'turkey',
    nameKorean: '튀르키예',
    icon: '🇹🇷',
    url: 'https://charts.youtube.com/charts/TopSongs/tr/weekly',
  },
  {
    name: 'uganda',
    nameKorean: '우간다',
    icon: '🇺🇬',
    url: 'https://charts.youtube.com/charts/TopSongs/ug/weekly',
  },
  {
    name: 'ukraine',
    nameKorean: '우크라이나',
    icon: '🇺🇦',
    url: 'https://charts.youtube.com/charts/TopSongs/ua/weekly',
  },
  {
    name: 'united-arab-emirates',
    nameKorean: '아랍에미리트',
    icon: '🇦🇪',
    url: 'https://charts.youtube.com/charts/TopSongs/ae/weekly',
  },
  {
    name: 'united-kingdom',
    nameKorean: '영국',
    icon: '🇬🇧',
    url: 'https://charts.youtube.com/charts/TopSongs/gb/weekly',
  },
  {
    name: 'united-states',
    nameKorean: '미국',
    icon: '🇺🇸',
    url: 'https://charts.youtube.com/charts/TopSongs/us/weekly',
  },
  {
    name: 'uruguay',
    nameKorean: '우루과이',
    icon: '🇺🇾',
    url: 'https://charts.youtube.com/charts/TopSongs/uy/weekly',
  },
  {
    name: 'zimbabwe',
    nameKorean: '짐바브웨',
    icon: '🇿🇼',
    url: 'https://charts.youtube.com/charts/TopSongs/zw/weekly',
  },
]
