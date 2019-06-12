interface Encodings {
  [key: string]: string[];
}

// tslint:disable: object-literal-key-quotes
const encodings: Encodings = {
  ibm864: ['Arabic (864)', 'Arabic', 'IBM'],
  'asmo-708': ['Arabic (ASMO 708)', 'Arabic'],
  'dos-720': ['Arabic (DOS)', 'Arabic', 'DOS'],
  'iso-8859-6': ['Arabic (ISO)', 'Arabic', 'ISO'],
  'x-mac-arabic': ['Arabic (Mac)', 'Arabic', 'Mac'],
  'windows-1256': ['Arabic (Windows)', 'Arabic', 'Windows'],
  ibm775: ['Baltic (DOS)', 'Baltic', 'DOS'],
  'iso-8859-4': ['Baltic (ISO)', 'Baltic', 'ISO'],
  'windows-1257': ['Baltic (Windows)', 'Baltic', 'Windows'],
  ibm852: ['Central European (DOS)', 'European', 'Central', 'DOS'],
  'iso-8859-2': ['Central European (ISO)', 'European', 'Central', 'ISO'],
  'x-mac-ce': ['Central European (Mac)', 'European', 'Central', 'Mac'],
  'windows-1250': ['Central European (Windows)', 'European', 'Central', 'Windows'],
  'euc-cn': ['Chinese Simplified (EUC)', 'Chinese', 'Simplified'],
  gb18030: ['Chinese Simplified (GB18030)', 'Chinese', 'Simplified'],
  'x-cp20936': ['Chinese Simplified (GB2312-80)', 'Chinese', 'Simplified'],
  gb2312: ['Chinese Simplified (GB2312)', 'Chinese', 'Simplified'],
  'hz-gb-2312': ['Chinese Simplified (HZ)', 'Chinese', 'Simplified'],
  'x-cp50227': ['Chinese Simplified (ISO-2022)', 'Chinese', 'Simplified', 'ISO'],
  'x-mac-chinesesimp': ['Chinese Simplified (Mac)', 'Chinese', 'Simplified', 'Mac'],
  big5: ['Chinese Traditional (Big5)', 'Chinese', 'Traditional'],
  'x-chinese-cns': ['Chinese Traditional (CNS)', 'Chinese', 'Traditional'],
  'x-chinese-eten': ['Chinese Traditional (Eten)', 'Chinese', 'Traditional'],
  'x-mac-chinesetrad': ['Chinese Traditional (Mac)', 'Chinese', 'Traditional', 'Mac'],
  'x-mac-croatian': ['Croatian (Mac)', 'South Slavic', 'Mac'],
  cp866: ['Cyrillic (DOS)', 'Cyrillic', 'DOS'],
  'iso-8859-5': ['Cyrillic (ISO)', 'Cyrillic', 'ISO'],
  'koi8-r': ['Cyrillic (KOI8-R)', 'Cyrillic', 'Russian'],
  'koi8-u': ['Cyrillic (KOI8-U)', 'Cyrillic', 'Ukrainian'],
  'x-mac-cyrillic': ['Cyrillic (Mac)', 'Cyrillic', 'Mac'],
  'windows-1251': ['Cyrillic (Windows)', 'Cyrillic', 'Russian', 'Windows'],
  'iso-8859-13': ['Estonian (ISO)', 'European', 'Estonian', 'ISO'],
  'x-europa': ['Europa', 'European', 'Europa'],
  ibm863: ['French Canadian (DOS)', 'France', 'Canada', 'DOS'],
  'x-ia5-german': ['German (IA5)', 'European', 'German'],
  ibm737: ['Greek (DOS)', 'European', 'Greek', 'DOS'],
  'iso-8859-7': ['Greek (ISO)', 'European', 'Greek', 'ISO'],
  'x-mac-greek': ['Greek (Mac)', 'European', 'Greek', 'Mac'],
  'windows-1253': ['Greek (Windows)', 'European', 'Greek', 'Windows'],
  ibm869: ['Greek Modern (DOS)', 'European', 'Greek', 'DOS'],
  'dos-862': ['Hebrew (DOS)', 'Hebrew', 'DOS'],
  'iso-8859-8-i': ['Hebrew (ISO-Logical)', 'Hebrew', 'ISO'],
  'iso-8859-8': ['Hebrew (ISO-Visual)', 'Hebrew', 'ISO'],
  'x-mac-hebrew': ['Hebrew (Mac)', 'Hebrew', 'Mac'],
  'windows-1255': ['Hebrew (Windows)', 'Hebrew', 'Windows'],
  ibm420: ['IBM EBCDIC (Arabic)', 'Arabic', 'IBM'],
  ibm880: ['IBM EBCDIC (Cyrillic Russian)', 'Cyrillic', 'Russian', 'IBM'],
  cp1025: ['IBM EBCDIC (Cyrillic Serbian-Bulgarian)', 'Cyrillic', 'South Slavic', 'IBM'],
  ibm01142: ['IBM EBCDIC (Denmark-Norway-Euro)', 'European', 'Denmark', 'Norway', 'Euro', 'IBM'],
  ibm277: ['IBM EBCDIC (Denmark-Norway)', 'European', 'Denmark', 'Norway', 'IBM'],
  ibm01143: ['IBM EBCDIC (Finland-Sweden-Euro)', 'European', 'Finland', 'Sweden', 'Euro', 'IBM'],
  ibm278: ['IBM EBCDIC (Finland-Sweden)', 'European', 'Finland', 'Sweden', 'IBM'],
  ibm01147: ['IBM EBCDIC (France-Euro)', 'European', 'France', 'IBM'],
  ibm297: ['IBM EBCDIC (France)', 'European', 'France', 'IBM'],
  ibm01141: ['IBM EBCDIC (Germany-Euro)', 'European', 'Euro', 'German', 'IBM'],
  ibm273: ['IBM EBCDIC (Germany)', 'European', 'German', 'IBM'],
  cp875: ['IBM EBCDIC (Greek Modern)', 'European', 'Greek', 'IBM'],
  ibm423: ['IBM EBCDIC (Greek)', 'European', 'Greek', 'IBM'],
  ibm424: ['IBM EBCDIC (Hebrew)', 'Hebrew', 'IBM'],
  ibm01149: ['IBM EBCDIC (Icelandic-Euro)', 'Icelandic', 'Euro', 'IBM'],
  ibm871: ['IBM EBCDIC (Icelandic)', 'Icelandic', 'IBM'],
  ibm01148: ['IBM EBCDIC (International-Euro)', 'European', 'IBM'],
  ibm500: ['IBM EBCDIC (International)', 'IBM'],
  ibm01144: ['IBM EBCDIC (Italy-Euro)', 'European', 'Romance', 'Euro', 'IBM'],
  ibm280: ['IBM EBCDIC (Italy)', 'European', 'Romance', 'IBM'],
  ibm290: ['IBM EBCDIC (Japanese katakana)', 'Japanese', 'Katakana', 'IBM'],
  'x-ebcdic-koreanextended': ['IBM EBCDIC (Korean Extended)', 'Korean', 'IBM'],
  ibm870: ['IBM EBCDIC (Multilingual Latin-2)', 'Latin', 'Multilingual', 'IBM'],
  ibm01145: ['IBM EBCDIC (Spain-Euro)', 'European', 'Euro', 'Romance', 'IBM'],
  ibm284: ['IBM EBCDIC (Spain)', 'European', 'Romance', 'IBM'],
  'ibm-thai': ['IBM EBCDIC (Thai)', 'Thai', 'IBM'],
  ibm1026: ['IBM EBCDIC (Turkish Latin-5)', 'Latin', 'Turkish', 'IBM'],
  ibm905: ['IBM EBCDIC (Turkish)', 'European', 'Turkish', 'IBM'],
  ibm01146: ['IBM EBCDIC (UK-Euro)', 'European', 'UK', 'Euro', 'IBM'],
  ibm285: ['IBM EBCDIC (UK)', 'European', 'UK', 'IBM'],
  ibm01140: ['IBM EBCDIC (US-Canada-Euro)', 'US', 'Canada', 'Euro', 'IBM'],
  ibm037: ['IBM EBCDIC (US-Canada)', 'US', 'Canada', 'IBM'],
  ibm01047: ['IBM Latin-1', 'Latin', 'IBM'],
  ibm00924: ['IBM Latin-1', 'Latin', 'IBM'],
  'x-cp20003': ['IBM5550 Taiwan', 'Taiwan', 'IBM'],
  ibm861: ['Icelandic (DOS)', 'Icelandic', 'DOS'],
  'x-mac-icelandic': ['Icelandic (Mac)', 'Icelandic', 'Mac'],
  'x-iscii-as': ['ISCII Assamese', 'ISCII'],
  'x-iscii-be': ['ISCII Bengali', 'ISCII'],
  'x-iscii-de': ['ISCII Devanagari', 'ISCII'],
  'x-iscii-gu': ['ISCII Gujarati', 'ISCII'],
  'x-iscii-ka': ['ISCII Kannada', 'ISCII'],
  'x-iscii-ma': ['ISCII Malayalam', 'ISCII'],
  'x-iscii-or': ['ISCII Oriya', 'ISCII'],
  'x-iscii-pa': ['ISCII Punjabi', 'ISCII'],
  'x-iscii-ta': ['ISCII Tamil', 'ISCII'],
  'x-iscii-te': ['ISCII Telugu', 'ISCII'],
  'x-cp20269': ['ISO-6937', 'ISO'],
  'euc-jp': ['Japanese (EUC)', 'Japanese'],
  // 'euc-jp': ['Japanese (JIS 0208-1990 and 0212-1990)', 'Japanese'],
  // 'iso-2022-jp': ['Japanese (JIS-Allow 1 byte Kana - SO/SI)', 'Japanese'],
  csiso2022jp: ['Japanese (JIS-Allow 1 byte Kana)', 'Japanese'],
  'iso-2022-jp': ['Japanese (JIS)', 'Japanese'],
  'x-mac-japanese': ['Japanese (Mac)', 'Japanese', 'Mac'],
  shift_jis: ['Japanese (Shift-JIS)', 'Japanese'],
  'ks_c_5601-1987': ['Korean', 'Korean'],
  'euc-kr': ['Korean (EUC)', 'Korean'],
  'iso-2022-kr': ['Korean (ISO)', 'Korean'],
  johab: ['Korean (Johab)', 'Korean'],
  'x-mac-korean': ['Korean (Mac)', 'Korean'],
  'x-cp20949': ['Korean Wansung', 'Korean'],
  'iso-8859-3': ['Latin 3 (ISO)', 'Latin', 'ISO'],
  'iso-8859-15': ['Latin 9 (ISO)', 'Latin', 'ISO'],
  ibm865: ['Nordic (DOS)', 'DOS'],
  'x-ia5-norwegian': ['Norwegian (IA5)', 'European', 'Norway', 'IA5'],
  ibm855: ['OEM Cyrillic', 'Cyrillic', 'OEM'],
  ibm00858: ['OEM Multilingual Latin I', 'Latin', 'Multilingual', 'OEM'],
  ibm437: ['OEM United States', 'US', 'OEM'],
  ibm860: ['Portuguese (DOS)', 'European', 'Romance', 'DOS'],
  'x-mac-romanian': ['Romanian (Mac)', 'European', 'Romance', 'Mac'],
  'x-ia5-swedish': ['Swedish (IA5)', 'European', 'Swedish', 'IA5'],
  'x-cp20261': ['T.61', 'Teletex'],
  'x-cp20001': ['TCA Taiwan', 'Taiwan'],
  'x-cp20004': ['TeleText Taiwan', 'Taiwan'],
  'x-mac-thai': ['Thai (Mac)', 'Thai', 'Mac'],
  'windows-874': ['Thai (Windows)', 'Thai', 'Windows'],
  ibm857: ['Turkish (DOS)', 'European', 'Turkish', 'DOS'],
  'iso-8859-9': ['Turkish (ISO)', 'European', 'Turkish', 'ISO'],
  'x-mac-turkish': ['Turkish (Mac)', 'European', 'Turkish', 'Mac'],
  'windows-1254': ['Turkish (Windows)', 'European', 'Turkish', 'Windows'],
  'x-mac-ukrainian': ['Ukrainian (Mac)', 'Cyrillic', 'Ukrainian', 'Mac'],
  'utf-16': ['Unicode', 'Unicode'],
  'utf-16be': ['Unicode (Big-Endian)', 'Unicode'],
  'utf-32be': ['Unicode (UTF-32 Big-Endian)', 'Unicode'],
  'utf-32': ['Unicode (UTF-32)', 'Unicode'],
  'utf-7': ['Unicode (UTF-7)', 'Unicode'],
  'utf-8': ['Unicode (UTF-8)', 'Unicode'],
  'us-ascii': ['US-ASCII', 'US', 'ASCII'],
  'windows-1258': ['Vietnamese (Windows)', 'Windows'],
  'x-cp20005': ['Wang Taiwan', 'Taiwan'],
  ibm850: ['Western European (DOS)', 'European', 'Western', 'IBM'],
  'x-ia5': ['Western European (IA5)', 'European', 'Western', 'IA5'],
  'iso-8859-1': ['Western European (ISO)', 'European', 'Western', 'ISO'],
  macintosh: ['Western European (Mac)', 'European', 'Western', 'Mac'],
  'windows-1252': ['Western European (Windows)', 'European', 'Western', 'Windows']
};

export interface Filter {
  [key: string]: boolean;
}

// Returns: An array that contains all known code page identifiers.
export function getEncodings(): string[] {
  return Object.keys(encodings);
}

export function filter(codes: string[], tags: Filter, hitCount: number = 1): string[] {
  const buffer: string[] = [];
  for (const key of codes) {
    const line = encodings[key];
    // skip display name
    let count = 0;
    for (let i = 1; i < line.length; i++) {
      if (tags[line[i]]) {
        count++;
      }
    }
    if (hitCount >= 0) {
      // normal filtering
      if (count >= hitCount) {
        buffer.push(key);
      }
    } else {
      // inverse filtering
      if (count < -hitCount) {
        buffer.push(key);
      }
    }
  }

  return buffer;
}

export function getTags(codes: string[]): Filter {
  const tags: Filter = {};
  for (const key of codes) {
    const line = encodings[key];
    // skip display name
    for (let i = 1; i < line.length; i++) {
      tags[line[i]] = true;
    }
  }
  return tags;
}

export function getDisplayName(codePage: string): string {
  const arr = encodings[codePage];
  return arr ? arr[0] : '';
}

export function getDisplayNames(codes: string[]): string[] {
  const arr: string[] = [];
  for (const key of codes) {
    arr.push(getDisplayName(key));
  }
  return arr;
}

export function filterWithDisplayNames(codes: string[], ...tags: string[]): string[][] {
  const t = {};
  for (const key of tags) {
    t[key] = true;
  }

  const filtered = filter(codes, t, tags.length);

  return [filtered, getDisplayNames(filtered)];
}
