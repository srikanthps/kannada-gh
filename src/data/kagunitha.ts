export interface VowelSign {
  vowel: string;
  sign: string;
  name: string;
  example: string;
  transliteration: string;
  ipa: string;
}

export const vowelSigns: VowelSign[] = [
  { vowel: 'ಅ (a)', sign: 'None', name: 'Talakattu', example: 'ಕ (ka)', transliteration: 'a', ipa: 'ʌ' },
  { vowel: 'ಆ (ā)', sign: 'ಾ', name: 'Deergha / Ilaa', example: 'ಕಾ (kā)', transliteration: 'ā / aa', ipa: 'ɑː' },
  { vowel: 'ಇ (i)', sign: 'ಿ', name: 'Gudi', example: 'ಕಿ (ki)', transliteration: 'i', ipa: 'i' },
  { vowel: 'ಈ (ī)', sign: 'ೀ', name: 'Gudi Deergha', example: 'ಕೀ (kī)', transliteration: 'ī / ee', ipa: 'iː' },
  { vowel: 'ಉ (u)', sign: 'ು', name: 'Kombu', example: 'ಕು (ku)', transliteration: 'u', ipa: 'u' },
  { vowel: 'ಊ (ū)', sign: 'ೂ', name: 'Kombu Deergha', example: 'ಕೂ (kū)', transliteration: 'ū / oo', ipa: 'uː' },
  { vowel: 'ಋ (r̥)', sign: 'ೃ', name: 'Vatrusuli', example: 'ಕೃ (kr̥)', transliteration: 'r̥ / ru', ipa: 'ru' },
  { vowel: 'ಎ (e)', sign: 'ೆ', name: 'Ettva', example: 'ಕೆ (ke)', transliteration: 'e', ipa: 'e' },
  { vowel: 'ಏ (ē)', sign: 'ೇ', name: 'Ettva Deergha', example: 'ಕೇ (kē)', transliteration: 'ē / ee', ipa: 'eː' },
  { vowel: 'ಐ (ai)', sign: 'ೈ', name: 'Aittva', example: 'ಕೈ (kai)', transliteration: 'ai', ipa: 'ʌi' },
  { vowel: 'ಒ (o)', sign: 'ೊ', name: 'Ottva', example: 'ಕೊ (ko)', transliteration: 'o', ipa: 'o' },
  { vowel: 'ಓ (ō)', sign: 'ೋ', name: 'Ottva Deergha', example: 'ಕೋ (kō)', transliteration: 'ō / oo', ipa: 'oː' },
  { vowel: 'ಔ (au)', sign: 'ೌ', name: 'Auttva', example: 'ಕೌ (kau)', transliteration: 'au', ipa: 'ʌu' },
  { vowel: 'ಅಂ (am)', sign: 'ಂ', name: 'Anusvara', example: 'ಕಂ (kaṃ)', transliteration: 'aṃ / am', ipa: 'ʌm' },
  { vowel: 'ಅಃ (ah)', sign: 'ಃ', name: 'Visarga', example: 'ಕಃ (kah)', transliteration: 'aḥ / aha', ipa: 'ʌhʌ' }
];

// High quality examples of Kagunitha rows for popular consonants
export interface KagunithaSample {
  consonant: string;
  consonantName: string;
  row: {
    vowel: string;
    combined: string;
    transliteration: string;
    pronunciation: string;
  }[];
}

export const kagunithaSamples: KagunithaSample[] = [
  {
    consonant: 'ಕ',
    consonantName: 'Ka',
    row: [
      { vowel: 'ಅ', combined: 'ಕ', transliteration: 'ka', pronunciation: 'k-uh' },
      { vowel: 'ಆ', combined: 'ಕಾ', transliteration: 'kā', pronunciation: 'k-aa' },
      { vowel: 'ಇ', combined: 'ಕಿ', transliteration: 'ki', pronunciation: 'k-ee' },
      { vowel: 'ಈ', combined: 'ಕೀ', transliteration: 'kī', pronunciation: 'k-eee' },
      { vowel: 'ಉ', combined: 'ಕು', transliteration: 'ku', pronunciation: 'k-oo' },
      { vowel: 'ಊ', combined: 'ಕೂ', transliteration: 'kū', pronunciation: 'k-ooo' },
      { vowel: 'ಋ', combined: 'ಕೃ', transliteration: 'kr̥', pronunciation: 'k-ru' },
      { vowel: 'ಎ', combined: 'ಕೆ', transliteration: 'ke', pronunciation: 'k-eh' },
      { vowel: 'ಏ', combined: 'ಕೇ', transliteration: 'kē', pronunciation: 'k-ay' },
      { vowel: 'ಐ', combined: 'ಕೈ', transliteration: 'kai', pronunciation: 'k-eye' },
      { vowel: 'ಒ', combined: 'ಕೊ', transliteration: 'ko', pronunciation: 'k-oh' },
      { vowel: 'ಓ', combined: 'ಕೋ', transliteration: 'kō', pronunciation: 'k-ooh' },
      { vowel: 'ಔ', combined: 'ಕೌ', transliteration: 'kau', pronunciation: 'k-ow' },
      { vowel: 'ಅಂ', combined: 'ಕಂ', transliteration: 'kaṃ', pronunciation: 'k-um' },
      { vowel: 'ಅಃ', combined: 'ಕಃ', transliteration: 'kaḥ', pronunciation: 'k-uh-huh' }
    ]
  },
  {
    consonant: 'ಗ',
    consonantName: 'Ga',
    row: [
      { vowel: 'ಅ', combined: 'ಗ', transliteration: 'ga', pronunciation: 'g-uh' },
      { vowel: 'ಆ', combined: 'ಗಾ', transliteration: 'gā', pronunciation: 'g-aa' },
      { vowel: 'ಇ', combined: 'ಗಿ', transliteration: 'gi', pronunciation: 'g-ee' },
      { vowel: 'ಈ', combined: 'ಗೀ', transliteration: 'gī', pronunciation: 'g-eee' },
      { vowel: 'ಉ', combined: 'ಗು', transliteration: 'gu', pronunciation: 'g-oo' },
      { vowel: 'ಊ', combined: 'ಗೂ', transliteration: 'gū', pronunciation: 'g-ooo' },
      { vowel: 'ಋ', combined: 'ಗೃ', transliteration: 'gr̥', pronunciation: 'g-ru' },
      { vowel: 'ಎ', combined: 'ಗೆ', transliteration: 'ge', pronunciation: 'g-eh' },
      { vowel: 'ಏ', combined: 'ಗೇ', transliteration: 'gē', pronunciation: 'g-ay' },
      { vowel: 'ಐ', combined: 'ಗೈ', transliteration: 'gai', pronunciation: 'g-eye' },
      { vowel: 'ಒ', combined: 'ಗೊ', transliteration: 'go', pronunciation: 'g-oh' },
      { vowel: 'ಓ', combined: 'ಗೋ', transliteration: 'gō', pronunciation: 'g-ooh' },
      { vowel: 'ಔ', combined: 'ಗೌ', transliteration: 'gau', pronunciation: 'g-ow' },
      { vowel: 'ಅಂ', combined: 'ಗಂ', transliteration: 'gaṃ', pronunciation: 'g-um' },
      { vowel: 'ಅಃ', combined: 'ಗಃ', transliteration: 'gaḥ', pronunciation: 'g-uh-huh' }
    ]
  },
  {
    consonant: 'ಚ',
    consonantName: 'Cha',
    row: [
      { vowel: 'ಅ', combined: 'ಚ', transliteration: 'cha', pronunciation: 'ch-uh' },
      { vowel: 'ಆ', combined: 'ಚಾ', transliteration: 'chā', pronunciation: 'ch-aa' },
      { vowel: 'ಇ', combined: 'ಚಿ', transliteration: 'chi', pronunciation: 'ch-ee' },
      { vowel: 'ಈ', combined: 'ಚೀ', transliteration: 'chī', pronunciation: 'ch-eee' },
      { vowel: 'ಉ', combined: 'ಚು', transliteration: 'chu', pronunciation: 'ch-oo' },
      { vowel: 'ಊ', combined: 'ಚೂ', transliteration: 'chū', pronunciation: 'ch-ooo' },
      { vowel: 'ಋ', combined: 'ಚೃ', transliteration: 'chr̥', pronunciation: 'ch-ru' },
      { vowel: 'ಎ', combined: 'ಚೆ', transliteration: 'che', pronunciation: 'ch-eh' },
      { vowel: 'ಏ', combined: 'ಚೇ', transliteration: 'chē', pronunciation: 'ch-ay' },
      { vowel: 'ಐ', combined: 'ಚೈ', transliteration: 'chai', pronunciation: 'ch-eye' },
      { vowel: 'ಒ', combined: 'ಚೊ', transliteration: 'cho', pronunciation: 'ch-oh' },
      { vowel: 'ಓ', combined: 'ಚೋ', transliteration: 'chō', pronunciation: 'ch-ooh' },
      { vowel: 'ಔ', combined: 'ಚೌ', transliteration: 'chau', pronunciation: 'ch-ow' },
      { vowel: 'ಅಂ', combined: 'ಚಂ', transliteration: 'chaṃ', pronunciation: 'ch-um' },
      { vowel: 'ಅಃ', combined: 'ಚಃ', transliteration: 'chaḥ', pronunciation: 'ch-uh-huh' }
    ]
  },
  {
    consonant: 'ತ',
    consonantName: 'Ta (dental)',
    row: [
      { vowel: 'ಅ', combined: 'ತ', transliteration: 'ta', pronunciation: 't-uh' },
      { vowel: 'ಆ', combined: 'ತಾ', transliteration: 'tā', pronunciation: 't-aa' },
      { vowel: 'ಇ', combined: 'ತಿ', transliteration: 'ti', pronunciation: 't-ee' },
      { vowel: 'ಈ', combined: 'ತೀ', transliteration: 'tī', pronunciation: 't-eee' },
      { vowel: 'ಉ', combined: 'ತು', transliteration: 'tu', pronunciation: 't-oo' },
      { vowel: 'ಊ', combined: 'ತೂ', transliteration: 'tū', pronunciation: 't-ooo' },
      { vowel: 'ಋ', combined: 'ತೃ', transliteration: 'tr̥', pronunciation: 't-ru' },
      { vowel: 'ಎ', combined: 'ತೆ', transliteration: 'te', pronunciation: 't-eh' },
      { vowel: 'ಏ', combined: 'ತೇ', transliteration: 'tē', pronunciation: 't-ay' },
      { vowel: 'ಐ', combined: 'ತೈ', transliteration: 'tai', pronunciation: 't-eye' },
      { vowel: 'ಒ', combined: 'ತೊ', transliteration: 'to', pronunciation: 't-oh' },
      { vowel: 'ಓ', combined: 'ತೋ', transliteration: 'tō', pronunciation: 't-ooh' },
      { vowel: 'ಔ', combined: 'ತೌ', transliteration: 'tau', pronunciation: 't-ow' },
      { vowel: 'ಅಂ', combined: 'ತಂ', transliteration: 'taṃ', pronunciation: 't-um' },
      { vowel: 'ಅಃ', combined: 'ತಃ', transliteration: 'taḥ', pronunciation: 't-uh-huh' }
    ]
  },
  {
    consonant: 'ಪ',
    consonantName: 'Pa',
    row: [
      { vowel: 'ಅ', combined: 'ಪ', transliteration: 'pa', pronunciation: 'p-uh' },
      { vowel: 'ಆ', combined: 'ಪಾ', transliteration: 'pā', pronunciation: 'p-aa' },
      { vowel: 'ಇ', combined: 'ಪಿ', transliteration: 'pi', pronunciation: 'p-ee' },
      { vowel: 'ಈ', combined: 'ಪೀ', transliteration: 'pī', pronunciation: 'p-eee' },
      { vowel: 'ಉ', combined: 'ಪು', transliteration: 'pu', pronunciation: 'p-oo' },
      { vowel: 'ಊ', combined: 'ಪೂ', transliteration: 'pū', pronunciation: 'p-ooo' },
      { vowel: 'ಋ', combined: 'ಪೃ', transliteration: 'pr̥', pronunciation: 'p-ru' },
      { vowel: 'ಎ', combined: 'ಪೆ', transliteration: 'pe', pronunciation: 'p-eh' },
      { vowel: 'ಏ', combined: 'ಪೇ', transliteration: 'pē', pronunciation: 'p-ay' },
      { vowel: 'ಐ', combined: 'ಪೈ', transliteration: 'pai', pronunciation: 'p-eye' },
      { vowel: 'ಒ', combined: 'ಪೊ', transliteration: 'po', pronunciation: 'p-oh' },
      { vowel: 'ಓ', combined: 'ಪೋ', transliteration: 'pō', pronunciation: 'p-ooh' },
      { vowel: 'ಔ', combined: 'ಪೌ', transliteration: 'pau', pronunciation: 'p-ow' },
      { vowel: 'ಅಂ', combined: 'ಪಂ', transliteration: 'paṃ', pronunciation: 'p-um' },
      { vowel: 'ಅಃ', combined: 'ಪಃ', transliteration: 'paḥ', pronunciation: 'p-uh-huh' }
    ]
  },
  {
    consonant: 'ಮ',
    consonantName: 'Ma',
    row: [
      { vowel: 'ಅ', combined: 'ಮ', transliteration: 'ma', pronunciation: 'm-uh' },
      { vowel: 'ಆ', combined: 'ಮಾ', transliteration: 'mā', pronunciation: 'm-aa' },
      { vowel: 'ಇ', combined: 'ಮಿ', transliteration: 'mi', pronunciation: 'm-ee' },
      { vowel: 'ಈ', combined: 'ಮೀ', transliteration: 'mī', pronunciation: 'm-eee' },
      { vowel: 'ಉ', combined: 'ಮು', transliteration: 'mu', pronunciation: 'm-oo' },
      { vowel: 'ಊ', combined: 'ಮೂ', transliteration: 'mū', pronunciation: 'm-ooo' },
      { vowel: 'ಋ', combined: 'ಮೃ', transliteration: 'mr̥', pronunciation: 'm-ru' },
      { vowel: 'ಎ', combined: 'ಮೆ', transliteration: 'me', pronunciation: 'm-eh' },
      { vowel: 'ಏ', combined: 'ಮೇ', transliteration: 'mē', pronunciation: 'm-ay' },
      { vowel: 'ಐ', combined: 'ಮೈ', transliteration: 'mai', pronunciation: 'm-eye' },
      { vowel: 'ಒ', combined: 'ಮೊ', transliteration: 'mo', pronunciation: 'm-oh' },
      { vowel: 'ಓ', combined: 'ಮೋ', transliteration: 'mō', pronunciation: 'm-ooh' },
      { vowel: 'ಔ', combined: 'ಮೌ', transliteration: 'mau', pronunciation: 'm-ow' },
      { vowel: 'ಅಂ', combined: 'ಮಂ', transliteration: 'maṃ', pronunciation: 'm-um' },
      { vowel: 'ಅಃ', combined: 'ಮಃ', transliteration: 'maḥ', pronunciation: 'm-uh-huh' }
    ]
  },
  {
    consonant: 'ಯ',
    consonantName: 'Ya',
    row: [
      { vowel: 'ಅ', combined: 'ಯ', transliteration: 'ya', pronunciation: 'y-uh' },
      { vowel: 'ಆ', combined: 'ಯಾ', transliteration: 'yā', pronunciation: 'y-aa' },
      { vowel: 'ಇ', combined: 'ಯಿ', transliteration: 'yi', pronunciation: 'y-ee' },
      { vowel: 'ಈ', combined: 'ಯೀ', transliteration: 'yī', pronunciation: 'y-eee' },
      { vowel: 'ಉ', combined: 'ಯು', transliteration: 'yu', pronunciation: 'y-oo' },
      { vowel: 'ಊ', combined: 'ಯೂ', transliteration: 'yū', pronunciation: 'y-ooo' },
      { vowel: 'ಋ', combined: 'ಯೃ', transliteration: 'yr̥', pronunciation: 'y-ru' },
      { vowel: 'ಎ', combined: 'ಯೆ', transliteration: 'ye', pronunciation: 'y-eh' },
      { vowel: 'ಏ', combined: 'ಯೇ', transliteration: 'yē', pronunciation: 'y-ay' },
      { vowel: 'ಐ', combined: 'ಯೈ', transliteration: 'yai', pronunciation: 'y-eye' },
      { vowel: 'ಒ', combined: 'ಯೊ', transliteration: 'yo', pronunciation: 'y-oh' },
      { vowel: 'ಓ', combined: 'ಯೋ', transliteration: 'yō', pronunciation: 'y-ooh' },
      { vowel: 'ಔ', combined: 'ಯೌ', transliteration: 'yau', pronunciation: 'y-ow' },
      { vowel: 'ಅಂ', combined: 'ಯಂ', transliteration: 'yaṃ', pronunciation: 'y-um' },
      { vowel: 'ಅಃ', combined: 'ಯಃ', transliteration: 'yaḥ', pronunciation: 'y-uh-huh' }
    ]
  },
  {
    consonant: 'ಸ',
    consonantName: 'Sa',
    row: [
      { vowel: 'ಅ', combined: 'ಸ', transliteration: 'sa', pronunciation: 's-uh' },
      { vowel: 'ಆ', combined: 'ಸಾ', transliteration: 'sā', pronunciation: 's-aa' },
      { vowel: 'ಇ', combined: 'ಸಿ', transliteration: 'si', pronunciation: 's-ee' },
      { vowel: 'ಈ', combined: 'ಸೀ', transliteration: 'sī', pronunciation: 's-eee' },
      { vowel: 'ಉ', combined: 'ಸು', transliteration: 'su', pronunciation: 's-oo' },
      { vowel: 'ಊ', combined: 'ಸೂ', transliteration: 'sū', pronunciation: 's-ooo' },
      { vowel: 'ಋ', combined: 'ಸೃ', transliteration: 'sr̥', pronunciation: 's-ru' },
      { vowel: 'ಎ', combined: 'ಸೆ', transliteration: 'se', pronunciation: 's-eh' },
      { vowel: 'ಏ', combined: 'ಸೇ', transliteration: 'sē', pronunciation: 's-ay' },
      { vowel: 'ಐ', combined: 'ಸೈ', transliteration: 'sai', pronunciation: 's-eye' },
      { vowel: 'ಒ', combined: 'ಸೊ', transliteration: 'so', pronunciation: 's-oh' },
      { vowel: 'ಓ', combined: 'ಸೋ', transliteration: 'sō', pronunciation: 's-ooh' },
      { vowel: 'ಔ', combined: 'ಸೌ', transliteration: 'sau', pronunciation: 's-ow' },
      { vowel: 'ಅಂ', combined: 'ಸಂ', transliteration: 'saṃ', pronunciation: 's-um' },
      { vowel: 'ಅಃ', combined: 'ಸಃ', transliteration: 'saḥ', pronunciation: 's-uh-huh' }
    ]
  }
];
