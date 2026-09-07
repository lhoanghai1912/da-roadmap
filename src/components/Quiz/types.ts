export interface QuizChoice {
  id: string;
  text: string;
}

export interface QuizQuestion {
  /** Ma cau hoi, duy nhat trong 1 quiz */
  id: string;
  /** Noi dung cau hoi */
  question: string;
  /** Doan code kem theo (tuy chon) */
  code?: string;
  /** Ngon ngu highlight cho code */
  lang?: 'sql' | 'python' | 'bash' | 'text';
  choices: QuizChoice[];
  /** Danh sach id dap an dung */
  correct: string[];
  /** Cho phep chon nhieu dap an */
  multi?: boolean;
  /** Giai thich hien sau khi cham */
  explain: string;
}

export interface QuizProps {
  /** Ma quiz, dung lam key luu localStorage */
  id: string;
  questions: QuizQuestion[];
  /** So cau dung toi thieu de dat. Mac dinh: 70% */
  passScore?: number;
}

export interface RubricItem {
  id: string;
  label: string;
  points: number;
  hint?: string;
}

export interface RubricBand {
  /** Diem toi thieu de vao band nay */
  min: number;
  label: string;
  tone: 'fail' | 'warn' | 'pass';
}

export interface RubricProps {
  id: string;
  title?: string;
  items: RubricItem[];
  bands?: RubricBand[];
}

export interface NumericCheckProps {
  id: string;
  /** Dap an dung */
  answer: number;
  /** Sai so cho phep (tuyet doi). Mac dinh 0.01 */
  tolerance?: number;
  unit?: string;
  /** Giai thich cach tinh */
  explain: string;
  label?: string;
}
