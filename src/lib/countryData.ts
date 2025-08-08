export type CountryRecord = {
  iso2: string;
  englishName: string;
  koreanName: string;
  capital?: string;
  representative?: string;
};

// CSV 경로 (public 기준)
const CSV_PATH = "/nation/_nation collection.csv";

// 브라우저에서 euc-kr 인코딩으로 CSV를 읽어 파싱
export async function loadCountryData(): Promise<CountryRecord[]> {
  const res = await fetch(CSV_PATH);
  if (!res.ok) throw new Error("국가 CSV 로드 실패");
  const buf = await res.arrayBuffer();
  let text: string;
  try {
    // EUC-KR(=cp949) 시도
    text = new TextDecoder("euc-kr").decode(buf);
  } catch {
    // 폴백: UTF-8
    text = new TextDecoder().decode(buf);
  }

  // 간단 파서: CSV 내 따옴표 포함 필드 처리 최소화
  // 형식: ISO2,영문명,한글명,수도명,대표
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  // 헤더 스킵
  const dataLines = lines.slice(1);

  const records: CountryRecord[] = [];
  for (const line of dataLines) {
    // 쉼표가 괄호/따옴표와 섞인 경우가 있어, 매우 단순하게 분리
    // 큰따옴표가 있는 경우 보존한 채로 쪼개고, 이후 정리
    const raw = splitCsvLine(line);
    if (raw.length < 3) continue;
    const [iso2Raw, enRaw, koRaw, capitalRaw, repRaw] = raw;
    const iso2 = (iso2Raw || "").trim().toUpperCase();
    const englishName = (enRaw || "").trim();
    const koreanName = (koRaw || "").trim();
    const capital = (capitalRaw || "").trim() || undefined;
    const representative = (repRaw || "").trim() || undefined;
    if (!iso2) continue;
    records.push({ iso2, englishName, koreanName, capital, representative });
  }
  return records;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch; // 따옴표 유지
    } else if (ch === ',' && !inQuotes) {
      result.push(cleanCsvField(current));
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(cleanCsvField(current));
  return result;
}

function cleanCsvField(field: string): string {
  let v = field.trim();
  if (v.startsWith('"') && v.endsWith('"')) {
    v = v.slice(1, -1);
  }
  return v;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildFlagUrl(iso2: string, preferredFolder: "nation" | "Nation" = "nation"): string[] {
  // 여러 확장자를 시도할 수 있게 후보 URL 배열 반환
  const base = `/${preferredFolder}/${iso2.toUpperCase()}`;
  return [".gif", ".png", ".jpg", ".bmp"].map(ext => base + ext);
}

export function normalizeGuess(input: string): string {
  return input.replace(/\s+/g, "").toLowerCase();
}

export function isCorrectGuess(guess: string, record: CountryRecord): boolean {
  const g = normalizeGuess(guess);
  const ko = normalizeGuess(record.koreanName);
  const en = normalizeGuess(record.englishName);
  const iso = normalizeGuess(record.iso2);
  return g === ko || g === en || g === iso;
}


