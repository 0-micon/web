// tslint:disable: quotemark
// tslint:disable: object-literal-key-quotes
export const encodings = {
  "US-ASCII": "us-ascii",
  "Unicode (UTF-8)": "utf-8",
  "Unicode (UTF-16)": "utf-16",
  "Unicode (UTF-32)": "utf-32",
  "Unicode": {
    "Unicode (UTF-7)": "utf-7",
    "Unicode (Big-Endian)": "utf-16BE",
    "Unicode (UTF-32 Big-Endian)": "utf-32BE"
  },
  "Character Sets": {
    "Arabic": {
      "864": "IBM864",
      "ASMO 708": "ASMO-708",
      "DOS": "DOS-720",
      "IBM EBCDIC": "IBM420",
      "ISO": "iso-8859-6",
      "Mac": "x-mac-arabic",
      "Windows": "windows-1256"
    },
    "Baltic": {
      "DOS": "ibm775",
      "ISO": "iso-8859-4",
      "Windows": "windows-1257"
    },
    "Chinese": {
      "Simplified": {
        "EUC": "EUC-CN",
        "GB18030": "GB18030",
        "GB2312-80": "x-cp20936",
        "GB2312": "gb2312",
        "HZ": "hz-gb-2312",
        "ISO-2022": "x-cp50227",
        "Mac": "x-mac-chinesesimp"
      },
      "Traditional": {
        "Big5": "big5",
        "CNS": "x-Chinese-CNS",
        "Eten": "x-Chinese-Eten",
        "Mac": "x-mac-chinesetrad"
      }
    },
    "Cyrillic": {
      "DOS": "cp866",
      "ISO": "iso-8859-5",
      "KOI8-R": "koi8-r",
      "KOI8-U": "koi8-u",
      "Mac": "x-mac-cyrillic",
      "Windows": "windows-1251"
    },
    "European": {
      "Central European": {
        "DOS": "ibm852",
        "ISO": "iso-8859-2",
        "Mac": "x-mac-ce",
        "Windows": "windows-1250"
      },
      "Western European": {
        "DOS": "ibm850",
        "IA5": "x-IA5",
        "ISO": "iso-8859-1",
        "Mac": "macintosh",
        "Windows": "Windows-1252"
      },
      "Croatian (Mac)": "x-mac-croatian",
      "Estonian (ISO)": "iso-8859-13",
      "Europa": "x-Europa",
      "French Canadian (DOS)": "IBM863",
      "German (IA5)": "x-IA5-German",
      "Nordic (DOS)": "IBM865",
      "Norwegian (IA5)": "x-IA5-Norwegian",
      "Portuguese (DOS)": "IBM860",
      "Romanian (Mac)": "x-mac-romanian",
      "Swedish (IA5)": "x-IA5-Swedish",
      "Ukrainian (Mac)": "x-mac-ukrainian"
    },
    "Greek": {
      "DOS": "ibm737",
      "Modern DOS": "ibm869",
      "ISO": "iso-8859-7",
      "Mac": "x-mac-greek",
      "Windows": "windows-1253"
    },
    "Hebrew": {
      "DOS": "DOS-862",
      "ISO-Logical": "iso-8859-8-i",
      "ISO-Visual": "iso-8859-8",
      "Mac": "x-mac-hebrew",
      "Windows": "windows-1255"
    },
    "IBM": {
      "EBCDIC": {
        "Europe": {
          "D,F": {
            "Denmark-Norway": "IBM277",
            "Denmark-Norway-Euro": "IBM01142",
            "Finland-Sweden": "IBM278",
            "Finland-Sweden-Euro": "IBM01143",
            "France": "IBM297",
            "France-Euro": "IBM01147",
          },
          "G,H": {
            "Germany": "IBM273",
            "Germany-Euro": "IBM01141",
            "Greek": "IBM423",
            "Greek Modern": "cp875",
            "Hebrew": "IBM424",
          },
          "I,S": {
            "Icelandic": "IBM871",
            "Icelandic-Euro": "IBM01149",
            "International": "IBM500",
            "International-Euro": "IBM01148",
            "Italy": "IBM280",
            "Italy-Euro": "IBM01144",
            "Spain": "IBM284",
            "Spain-Euro": "IBM01145",
          },
          "T,U": {
            "Turkish": "IBM905",
            "Turkish Latin-5": "IBM1026",
            "UK": "IBM285",
            "UK-Euro": "IBM01146"
          }
        },
        "Cyrillic": { "Russian": "IBM880", "Serbian-Bulgarian": "cp1025" },
        "Japanese katakana": "IBM290",
        "Korean Extended": "x-EBCDIC-KoreanExtended",
        "Multilingual Latin-2": "IBM870",
        "Thai": "IBM-Thai",
        "US-Canada": "IBM037",
        "US-Canada-Euro": "IBM01140"
      },
      "Latin": "IBM00924",
      "Latin-1": "IBM01047",
      "Taiwan": "x-cp20003"
    },
    "Icelandic": {
      "DOS": "ibm861",
      "Mac": "x-mac-icelandic"
    },
    "ISCII": {
      "Assamese": "x-iscii-as",
      "Bengali": "x-iscii-be",
      "Devanagari": "x-iscii-de",
      "Gujarati": "x-iscii-gu",
      "Kannada": "x-iscii-ka",
      "Malayalam": "x-iscii-ma",
      "Oriya": "x-iscii-or",
      "Punjabi": "x-iscii-pa",
      "Tamil": "x-iscii-ta",
      "Telugu": "x-iscii-te"
    },
    "Japanese ": {
      "EUC": "euc-jp",
      "JIS 0208-1990 and 0212-1990": "EUC-JP",
      "JIS-Allow 1 byte Kana - SO/SI": "iso-2022-jp",
      "JIS-Allow 1 byte Kana": "csISO2022JP",
      "JIS": "iso-2022-jp",
      "Mac": "x-mac-japanese",
      "Shift-JIS": "shift_jis"
    },
    "Korean": {
      "EUC": "euc-kr",
      "ISO": "iso-2022-kr",
      "Johab": "Johab",
      "Korean": "ks_c_5601-1987",
      "Mac": "x-mac-korean",
      "Wansung": "x-cp20949"
    },
    "Latin": {
      "3 (ISO)": "iso-8859-3",
      "9 (ISO)": "iso-8859-15"
    },
    "OEM": {
      "Cyrillic": "IBM855",
      "Multilingual Latin I": "IBM00858",
      "OEM United States": "IBM437"
    },
    "Other": {
      "Taiwan": {
        "TCA Taiwan": "x-cp20001",
        "TeleText Taiwan": "x-cp20004",
        "Wang Taiwan": "x-cp20005"
      },
      "Thai": {
        "Mac": "x-mac-thai",
        "Windows": "windows-874"
      },
      "Turkish": {
        "DOS": "ibm857",
        "ISO": "iso-8859-9",
        "Mac": "x-mac-turkish",
        "Windows": "windows-1254"
      },
      "ISO-6937": "x-cp20269",
      "T.61": "x-cp20261",
      "Vietnamese (Windows)": "windows-1258"
    }
  }
};
