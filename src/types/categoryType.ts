interface Category {
  id: string;
  name: string;
  entryCount: number;
  path: string;
  lastUpdate: string;
  children: Category[];
}

interface CategoryInfo {
  // 카테고리ID와 페이지 번호 모두 숫자 형식이지만 String 으로 설정
  id: string;
  page: string | number;
}

export type { Category, CategoryInfo };
