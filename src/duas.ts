// Duas from the Quran (generated - do not edit by hand).
// Which ayahs are duas, and where each dua starts, follows the list on quranwbw.com/duas.
// Urdu translation: Fateh Muhammad Jalandhry (ur.jalandhry), from Tanzil.net.
// English translation: Saheeh International (en.sahih), from Tanzil.net.
//
// Arabic text notice, reproduced from the source file:
// #=====================================================================
// #
// #  Name: Uthamani
// #  Translator: Uthamani
// #  Language: Arabic
// #  ID: quran-uthmani
// #  Last Update: February 12, 2021
// #  Source: Tanzil.info
// #
// #
// #  Tanzil Quran Text, Version 1.1 (released February 12, 2021). Source: Tanzil Project, https://tanzil.net
// #
// #  TERMS OF USE (from Tanzil):
// #  - Permission is granted to copy and distribute verbatim copies
// #    of this text, but CHANGING IT IS NOT ALLOWED.
// #  - This Quran text can be used in any website or application,
// #    provided that its source (Tanzil Project) is clearly indicated,
// #    and a link is made to tanzil.net to enable users to keep
// #    track of changes.
// #  - This copyright notice shall be included in all verbatim copies
// #    of the text, and shall be reproduced appropriately in all files
// #    derived from or containing substantial portion of this text.
// #  Please check updates at: http://tanzil.net/updates/
// #
// #=====================================================================

export type DuaAyah = { a: number; pre: string; dua: string; ur: string; en: string };
export type Dua = { id: string; s: number; title: string; who: string; cats: string[]; prophet: boolean; ayahs: DuaAyah[] };

export const DUA_CATEGORIES: { key: string; label: string }[] = [
  { key: 'forgiveness', label: 'Forgiveness' },
  { key: 'guidance', label: 'Guidance' },
  { key: 'parents', label: 'Parents & family' },
  { key: 'knowledge', label: 'Knowledge' },
  { key: 'protection', label: 'Protection' },
  { key: 'gratitude', label: 'Gratitude' },
  { key: 'hereafter', label: 'Hereafter' },
];

export function arabicNumber(n: number) {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

export const DUAS: Dua[] = [
 {
  "id": "2:285-286",
  "s": 2,
  "title": "Forgive us and help us",
  "who": "The believers",
  "cats": [
   "forgiveness"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 285,
    "pre": "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِۦ ۚ وَقَالُوا۟",
    "dua": "سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ",
    "ur": "رسول (خدا) اس کتاب پر جو ان کے پروردگار کی طرف سے ان پر نازل ہوئی ایمان رکھتے ہیں اور مومن بھی۔ سب خدا پر اور اس کے فرشتوں پر اور اس کی کتابوں پر اور اس کے پیغمبروں پر ایمان رکھتے ہیں (اورکہتے ہیں کہ) ہم اس کے پیغمبروں سے کسی میں کچھ فرق نہیں کرتے اور وہ (خدا سے) عرض کرتے ہیں کہ ہم نے (تیرا حکم) سنا اور قبول کیا۔ اے پروردگار ہم تیری بخشش مانگتے ہیں اور تیری ہی طرف لوٹ کر جانا ہے",
    "en": "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], \"We make no distinction between any of His messengers.\" And they say, \"We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination.\""
   },
   {
    "a": 286,
    "pre": "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ",
    "dua": "رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "ur": "خدا کسی شخص کو اس کی طاقت سے زیادہ تکلیف نہیں دیتا۔ اچھے کام کرے گا تو اس کو ان کا فائدہ ملے گا برے کرے گا تو اسے ان کا نقصان پہنچے گا۔ اے پروردگار اگر ہم سے بھول یا چوک ہوگئی ہو تو ہم سے مؤاخذہ نہ کیجیو۔ اے پروردگار ہم پر ایسا بوجھ نہ ڈالیو جیسا تو نے ہم سے پہلے لوگوں پر ڈالا تھا۔ اے پروردگار جتنا بوجھ اٹھانے کی ہم میں طاقت نہیں اتنا ہمارے سر پر نہ رکھیو۔ اور (اے پروردگار) ہمارے گناہوں سے درگزر کر اور ہمیں بخش دے۔ اور ہم پر رحم فرما۔ تو ہی ہمارا مالک ہے اور ہم کو کافروں پر غالب فرما",
    "en": "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. \"Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.\""
   }
  ]
 },
 {
  "id": "3:16",
  "s": 3,
  "title": "We have believed, so forgive us",
  "who": "The righteous",
  "cats": [
   "forgiveness"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 16,
    "pre": "ٱلَّذِينَ يَقُولُونَ",
    "dua": "رَبَّنَآ إِنَّنَآ ءَامَنَّا فَٱغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ ٱلنَّارِ",
    "ur": "جو خدا سے التجا کرتے ہیں کہ اے پروردگار ہم ایمان لے آئے سو ہم کو ہمارے گناہ معاف فرما اور دوزخ کے عذاب سے محفوظ رکھ",
    "en": "Those who say, \"Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire,\""
   }
  ]
 },
 {
  "id": "3:147",
  "s": 3,
  "title": "Forgive our sins and our excesses",
  "who": "Companions of the Prophets",
  "cats": [
   "forgiveness",
   "guidance"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 147,
    "pre": "وَمَا كَانَ قَوْلَهُمْ إِلَّآ أَن قَالُوا۟",
    "dua": "رَبَّنَا ٱغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِىٓ أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "ur": "اور (اس حالت میں) ان کے منہ سے کوئی بات نکلتی ہے تو یہی کہ اے پروردگار ہمارے گناہ اور زیادتیاں جو ہم اپنے کاموں میں کرتے رہے ہیں معاف فرما اور ہم کو ثابت قدم رکھ اور کافروں پر فتح عنایت فرما",
    "en": "And their words were not but that they said, \"Our Lord, forgive us our sins and the excess [committed] in our affairs and plant firmly our feet and give us victory over the disbelieving people.\""
   }
  ]
 },
 {
  "id": "7:23",
  "s": 7,
  "title": "We have wronged ourselves",
  "who": "Adam & Hawwa (AS)",
  "cats": [
   "forgiveness"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 23,
    "pre": "قَالَا",
    "dua": "رَبَّنَا ظَلَمْنَآ أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ ٱلْخَٰسِرِينَ",
    "ur": "دونوں عرض کرنے لگے کہ پروردگار ہم نے اپنی جانوں پر ظلم کیا اور اگر تو ہمیں نہیں بخشے گا اور ہم پر رحم نہیں کرے گا تو ہم تباہ ہو جائیں گے",
    "en": "They said, \"Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.\""
   }
  ]
 },
 {
  "id": "7:151",
  "s": 7,
  "title": "Forgive me and my brother",
  "who": "Musa (AS)",
  "cats": [
   "forgiveness",
   "parents"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 151,
    "pre": "قَالَ",
    "dua": "رَبِّ ٱغْفِرْ لِى وَلِأَخِى وَأَدْخِلْنَا فِى رَحْمَتِكَ ۖ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ",
    "ur": "تب انہوں نے دعا کی کہ اے میرے پروردگار مجھے اور میرے بھائی کو معاف فرما اور ہمیں اپنی رحمت میں داخل کر تو سب سے بڑھ کر رحم کرنے والا ہے",
    "en": "[Moses] said, \"My Lord, forgive me and my brother and admit us into Your mercy, for You are the most merciful of the merciful.\""
   }
  ]
 },
 {
  "id": "23:109",
  "s": 23,
  "title": "We have believed, so forgive us",
  "who": "The believers",
  "cats": [
   "forgiveness"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 109,
    "pre": "إِنَّهُۥ كَانَ فَرِيقٌ مِّنْ عِبَادِى يَقُولُونَ",
    "dua": "رَبَّنَآ ءَامَنَّا فَٱغْفِرْ لَنَا وَٱرْحَمْنَا وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ",
    "ur": "میرے بندوں میں ایک گروہ تھا جو دعا کیا کرتا تھا کہ اے ہمارے پروردگار ہم ایمان لائے تو تُو ہم کو بخش دے اور ہم پر رحم کر اور تو سب سے بہتر رحم کرنے والا ہے",
    "en": "Indeed, there was a party of My servants who said, 'Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.'"
   }
  ]
 },
 {
  "id": "23:118",
  "s": 23,
  "title": "Forgive and have mercy",
  "who": "Prophet Muhammad ﷺ",
  "cats": [
   "forgiveness"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 118,
    "pre": "وَقُل",
    "dua": "رَّبِّ ٱغْفِرْ وَٱرْحَمْ وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ",
    "ur": "اور خدا سے دعا کرو کہ میرے پروردگار مجھے بخش دے اور (مجھ پر) رحم کر اور تو سب سے بہتر رحم کرنے والا ہے",
    "en": "And, [O Muhammad], say, \"My Lord, forgive and have mercy, and You are the best of the merciful.\""
   }
  ]
 },
 {
  "id": "28:16",
  "s": 28,
  "title": "I have wronged myself, forgive me",
  "who": "Musa (AS)",
  "cats": [
   "forgiveness"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 16,
    "pre": "قَالَ",
    "dua": "رَبِّ إِنِّى ظَلَمْتُ نَفْسِى فَٱغْفِرْ لِى فَغَفَرَ لَهُۥٓ ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ",
    "ur": "بولے کہ اے پروردگار میں نے اپنے آپ پر ظلم کیا تو مجھے بخش دے تو خدا نے اُن کو بخش دیا۔ بیشک وہ بخشنے والا مہربان ہے",
    "en": "He said, \"My Lord, indeed I have wronged myself, so forgive me,\" and He forgave him. Indeed, He is the Forgiving, the Merciful."
   }
  ]
 },
 {
  "id": "59:10",
  "s": 59,
  "title": "Forgive us and our brothers in faith",
  "who": "The believers",
  "cats": [
   "forgiveness",
   "parents"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 10,
    "pre": "وَٱلَّذِينَ جَآءُو مِنۢ بَعْدِهِمْ يَقُولُونَ",
    "dua": "رَبَّنَا ٱغْفِرْ لَنَا وَلِإِخْوَٰنِنَا ٱلَّذِينَ سَبَقُونَا بِٱلْإِيمَٰنِ وَلَا تَجْعَلْ فِى قُلُوبِنَا غِلًّا لِّلَّذِينَ ءَامَنُوا۟ رَبَّنَآ إِنَّكَ رَءُوفٌ رَّحِيمٌ",
    "ur": "اور (ان کے لئے بھی) جو ان (مہاجرین) کے بعد آئے (اور) دعا کرتے ہیں کہ اے پروردگار ہمارے اور ہمارے بھائیوں کے جو ہم سے پہلے ایمان لائے ہیں گناہ معاف فرما اور مومنوں کی طرف سے ہمارے دل میں کینہ (وحسد) نہ پیدا ہونے دے۔ اے ہمارے پروردگار تو بڑا شفقت کرنے والا مہربان ہے",
    "en": "And [there is a share for] those who came after them, saying, \"Our Lord, forgive us and our brothers who preceded us in faith and put not in our hearts [any] resentment toward those who have believed. Our Lord, indeed You are Kind and Merciful.\""
   }
  ]
 },
 {
  "id": "66:8",
  "s": 66,
  "title": "Perfect our light for us",
  "who": "The believers",
  "cats": [
   "forgiveness",
   "hereafter"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 8,
    "pre": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ تُوبُوٓا۟ إِلَى ٱللَّهِ تَوْبَةً نَّصُوحًا عَسَىٰ رَبُّكُمْ أَن يُكَفِّرَ عَنكُمْ سَيِّـَٔاتِكُمْ وَيُدْخِلَكُمْ جَنَّٰتٍ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ يَوْمَ لَا يُخْزِى ٱللَّهُ ٱلنَّبِىَّ وَٱلَّذِينَ ءَامَنُوا۟ مَعَهُۥ ۖ نُورُهُمْ يَسْعَىٰ بَيْنَ أَيْدِيهِمْ وَبِأَيْمَٰنِهِمْ يَقُولُونَ",
    "dua": "رَبَّنَآ أَتْمِمْ لَنَا نُورَنَا وَٱغْفِرْ لَنَآ ۖ إِنَّكَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
    "ur": "مومنو! خدا کے آگے صاف دل سے توبہ کرو۔ امید ہے کہ وہ تمہارے گناہ تم سے دور کر دے گا اور تم کو باغہائے بہشت میں جن کے نیچے نہریں بہہ رہی ہیں داخل کرے گا۔ اس دن پیغمبر کو اور ان لوگوں کو جو ان کے ساتھ ایمان لائے ہیں رسوا نہیں کرے گا (بلکہ) ان کا نور ایمان ان کے آگے اور داہنی طرف (روشنی کرتا ہوا) چل رہا ہوگا۔ اور وہ خدا سے التجا کریں گے کہ اے پروردگار ہمارا نور ہمارے لئے پورا کر اور ہمیں معاف کرنا۔ بےشک خدا ہر چیز پر قادر ہے",
    "en": "O you who have believed, repent to Allah with sincere repentance. Perhaps your Lord will remove from you your misdeeds and admit you into gardens beneath which rivers flow [on] the Day when Allah will not disgrace the Prophet and those who believed with him. Their light will proceed before them and on their right; they will say, \"Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.\""
   }
  ]
 },
 {
  "id": "3:8-9",
  "s": 3,
  "title": "Let not our hearts deviate",
  "who": "Those firm in knowledge",
  "cats": [
   "guidance"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 8,
    "pre": "",
    "dua": "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ",
    "ur": "اے پروردگار جب تو نے ہمیں ہدایت بخشی ہے تو اس کے بعد ہمارے دلوں میں کجی نہ پیدا کر دیجیو اور ہمیں اپنے ہاں سے نعمت عطا فرما تو تو بڑا عطا فرمانے والا ہے",
    "en": "[Who say], \"Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower."
   },
   {
    "a": 9,
    "pre": "",
    "dua": "رَبَّنَآ إِنَّكَ جَامِعُ ٱلنَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ ۚ إِنَّ ٱللَّهَ لَا يُخْلِفُ ٱلْمِيعَادَ",
    "ur": "اے پروردگار! تو اس روز جس (کے آنے) میں کچھ بھی شک نہیں سب لوگوں کو (اپنے حضور میں) جمع کرلے گا بے شک خدا خلاف وعدہ نہیں کرتا",
    "en": "Our Lord, surely You will gather the people for a Day about which there is no doubt. Indeed, Allah does not fail in His promise.\""
   }
  ]
 },
 {
  "id": "2:250",
  "s": 2,
  "title": "Pour patience upon us, make our feet firm",
  "who": "The army of Talut",
  "cats": [
   "guidance",
   "protection"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 250,
    "pre": "وَلَمَّا بَرَزُوا۟ لِجَالُوتَ وَجُنُودِهِۦ قَالُوا۟",
    "dua": "رَبَّنَآ أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "ur": "اور جب وہ لوگ جالوت اور اس کے لشکر کے مقابل آئے تو (خدا سے) دعا کی کہ اے پروردگار ہم پر صبر کے دہانے کھول دے اور ہمیں (لڑائی میں) ثابت قدم رکھ اور (لشکر) کفار پر فتحیاب کر",
    "en": "And when they went forth to [face] Goliath and his soldiers, they said, \"Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.\""
   }
  ]
 },
 {
  "id": "7:126",
  "s": 7,
  "title": "Pour patience upon us, let us die as Muslims",
  "who": "The believing magicians",
  "cats": [
   "guidance"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 126,
    "pre": "وَمَا تَنقِمُ مِنَّآ إِلَّآ أَنْ ءَامَنَّا بِـَٔايَٰتِ رَبِّنَا لَمَّا جَآءَتْنَا ۚ",
    "dua": "رَبَّنَآ أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",
    "ur": "اور اس کے سوا تجھ کو ہماری کون سی بات بری لگی ہے کہ جب ہمارے پروردگار کی نشانیاں ہمارے پاس آگئیں تو ہم ان پر ایمان لے آئے۔ اے پروردگار ہم پر صبرواستقامت کے دہانے کھول دے اور ہمیں (ماریو تو) مسلمان ہی ماریو",
    "en": "And you do not resent us except because we believed in the signs of our Lord when they came to us. Our Lord, pour upon us patience and let us die as Muslims [in submission to You].\""
   }
  ]
 },
 {
  "id": "3:53",
  "s": 3,
  "title": "We believe, record us among the witnesses",
  "who": "Disciples of Isa (AS)",
  "cats": [
   "guidance"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 53,
    "pre": "",
    "dua": "رَبَّنَآ ءَامَنَّا بِمَآ أَنزَلْتَ وَٱتَّبَعْنَا ٱلرَّسُولَ فَٱكْتُبْنَا مَعَ ٱلشَّٰهِدِينَ",
    "ur": "اے پروردگار جو (کتاب) تو نے نازل فرمائی ہے ہم اس پر ایمان لے آئے اور (تیرے) پیغمبر کے متبع ہو چکے تو ہم کو ماننے والوں میں لکھ رکھ",
    "en": "Our Lord, we have believed in what You revealed and have followed the messenger Jesus, so register us among the witnesses [to truth].\""
   }
  ]
 },
 {
  "id": "5:83",
  "s": 5,
  "title": "Record us among the witnesses",
  "who": "Those who recognised the truth",
  "cats": [
   "guidance"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 83,
    "pre": "وَإِذَا سَمِعُوا۟ مَآ أُنزِلَ إِلَى ٱلرَّسُولِ تَرَىٰٓ أَعْيُنَهُمْ تَفِيضُ مِنَ ٱلدَّمْعِ مِمَّا عَرَفُوا۟ مِنَ ٱلْحَقِّ ۖ يَقُولُونَ",
    "dua": "رَبَّنَآ ءَامَنَّا فَٱكْتُبْنَا مَعَ ٱلشَّٰهِدِينَ",
    "ur": "اور جب اس (کتاب) کو سنتے ہیں جو (سب سے پہلے) پیغمبر (محمدﷺ) پر نازل ہوئی تو تم دیکھتے ہو کہ ان کی آنکھوں سے آنسو جاری ہو جاتے ہیں اس لیے کہ انہوں نے حق بات پہچان لی اور وہ (خدا کی جناب میں) عرض کرتے ہیں کہ اے پروردگار ہم ایمان لے آئے تو ہم کو ماننے والوں میں لکھ لے",
    "en": "And when they hear what has been revealed to the Messenger, you see their eyes overflowing with tears because of what they have recognized of the truth. They say, \"Our Lord, we have believed, so register us among the witnesses."
   }
  ]
 },
 {
  "id": "18:10",
  "s": 18,
  "title": "Grant us mercy and guide our affair",
  "who": "Youths of the Cave",
  "cats": [
   "guidance",
   "protection"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 10,
    "pre": "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟",
    "dua": "رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    "ur": "جب وہ جوان غار میں جا رہے تو کہنے لگے کہ اے ہمارے پروردگار ہم پر اپنے ہاں سے رحمت نازل فرما۔ اور ہمارے کام درستی (کے سامان) مہیا کر",
    "en": "[Mention] when the youths retreated to the cave and said, \"Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.\""
   }
  ]
 },
 {
  "id": "18:14",
  "s": 18,
  "title": "Our Lord is the Lord of the heavens and earth",
  "who": "Youths of the Cave",
  "cats": [
   "guidance"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 14,
    "pre": "وَرَبَطْنَا عَلَىٰ قُلُوبِهِمْ إِذْ قَامُوا۟ فَقَالُوا۟",
    "dua": "رَبُّنَا رَبُّ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ لَن نَّدْعُوَا۟ مِن دُونِهِۦٓ إِلَٰهًا ۖ لَّقَدْ قُلْنَآ إِذًا شَطَطًا",
    "ur": "اور ان کے دلوں کو مربوط (یعنی مضبوط) کردیا۔ جب وہ (اُٹھ) کھڑے ہوئے تو کہنے لگے کہ ہمارا پروردگار آسمانوں اور زمین کا مالک ہے۔ ہم اس کے سوا کسی کو معبود (سمجھ کر) نہ پکاریں گے (اگر ایسا کیا) تو اس وقت ہم نے بعید از عقل بات کہی",
    "en": "And We made firm their hearts when they stood up and said, \"Our Lord is the Lord of the heavens and the earth. Never will we invoke besides Him any deity. We would have certainly spoken, then, an excessive transgression."
   }
  ]
 },
 {
  "id": "60:4-5",
  "s": 60,
  "title": "In You we trust, to You we turn",
  "who": "Ibrahim (AS) and his followers",
  "cats": [
   "guidance",
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 4,
    "pre": "قَدْ كَانَتْ لَكُمْ أُسْوَةٌ حَسَنَةٌ فِىٓ إِبْرَٰهِيمَ وَٱلَّذِينَ مَعَهُۥٓ إِذْ قَالُوا۟ لِقَوْمِهِمْ إِنَّا بُرَءَٰٓؤُا۟ مِنكُمْ وَمِمَّا تَعْبُدُونَ مِن دُونِ ٱللَّهِ كَفَرْنَا بِكُمْ وَبَدَا بَيْنَنَا وَبَيْنَكُمُ ٱلْعَدَٰوَةُ وَٱلْبَغْضَآءُ أَبَدًا حَتَّىٰ تُؤْمِنُوا۟ بِٱللَّهِ وَحْدَهُۥٓ إِلَّا قَوْلَ إِبْرَٰهِيمَ لِأَبِيهِ لَأَسْتَغْفِرَنَّ لَكَ وَمَآ أَمْلِكُ لَكَ مِنَ ٱللَّهِ مِن شَىْءٍ ۖ",
    "dua": "رَّبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ ٱلْمَصِيرُ",
    "ur": "تمہیں ابراہیم اور ان کے رفقاء کی نیک چال چلنی (ضرور) ہے۔ جب انہوں نے اپنی قوم کے لوگوں سے کہا کہ ہم تم سے اور ان (بتوں) سے جن کو تم خدا کے سوا پوجتے ہو بےتعلق ہیں (اور) تمہارے (معبودوں کے کبھی) قائل نہیں (ہوسکتے) اور جب تک تم خدائے واحد اور ایمان نہ لاؤ ہم میں تم میں ہمیشہ کھلم کھلا عداوت اور دشمنی رہے گی۔ ہاں ابراہیمؑ نے اپنے باپ سے یہ (ضرور) کہا کہ میں آپ کے لئے مغفرت مانگوں گا اور خدا کے سامنے آپ کے بارے میں کسی چیز کا کچھ اختیار نہیں رکھتا۔ اے ہمارے پروردگار تجھ ہی پر ہمارا بھروسہ ہے اور تیری ہی طرف ہم رجوع کرتے ہیں اور تیرے ہی حضور میں (ہمیں) لوٹ کر آنا ہے",
    "en": "There has already been for you an excellent pattern in Abraham and those with him, when they said to their people, \"Indeed, we are disassociated from you and from whatever you worship other than Allah. We have denied you, and there has appeared between us and you animosity and hatred forever until you believe in Allah alone\" except for the saying of Abraham to his father, \"I will surely ask forgiveness for you, but I have not [power to do] for you anything against Allah. Our Lord, upon You we have relied, and to You we have returned, and to You is the destination."
   },
   {
    "a": 5,
    "pre": "",
    "dua": "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلَّذِينَ كَفَرُوا۟ وَٱغْفِرْ لَنَا رَبَّنَآ ۖ إِنَّكَ أَنتَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    "ur": "اے ہمارے پروردگار ہم کو کافروں کے ہاتھ سے عذاب نہ دلانا اور اے پروردگار ہمارے ہمیں معاف فرما۔ بےشک تو غالب حکمت والا ہے",
    "en": "Our Lord, make us not [objects of] torment for the disbelievers and forgive us, our Lord. Indeed, it is You who is the Exalted in Might, the Wise.\""
   }
  ]
 },
 {
  "id": "17:24",
  "s": 17,
  "title": "Have mercy on them as they raised me",
  "who": "For parents",
  "cats": [
   "parents"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 24,
    "pre": "وَٱخْفِضْ لَهُمَا جَنَاحَ ٱلذُّلِّ مِنَ ٱلرَّحْمَةِ وَقُل",
    "dua": "رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا",
    "ur": "اور عجزو نیاز سے ان کے آگے جھکے رہو اور ان کے حق میں دعا کرو کہ اے پروردگار جیسا انہوں نے مجھے بچپن میں (شفقت سے) پرورش کیا ہے تو بھی اُن (کے حال) پر رحمت فرما",
    "en": "And lower to them the wing of humility out of mercy and say, \"My Lord, have mercy upon them as they brought me up [when I was] small.\""
   }
  ]
 },
 {
  "id": "14:40-41",
  "s": 14,
  "title": "Make me steadfast in prayer, forgive my parents",
  "who": "Ibrahim (AS)",
  "cats": [
   "parents",
   "forgiveness"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 40,
    "pre": "",
    "dua": "رَبِّ ٱجْعَلْنِى مُقِيمَ ٱلصَّلَوٰةِ وَمِن ذُرِّيَّتِى ۚ رَبَّنَا وَتَقَبَّلْ دُعَآءِ",
    "ur": "اے پروردگار مجھ کو (ایسی توفیق عنایت) کر کہ نماز پڑھتا رہوں اور میری اولاد کو بھی (یہ توفیق بخش) اے پروردگار میری دعا قبول فرما",
    "en": "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication."
   },
   {
    "a": 41,
    "pre": "",
    "dua": "رَبَّنَا ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ ٱلْحِسَابُ",
    "ur": "اے پروردگار حساب (کتاب) کے دن مجھ کو اور میرے ماں باپ کو اور مومنوں کو مغفرت کیجیو",
    "en": "Our Lord, forgive me and my parents and the believers the Day the account is established.\""
   }
  ]
 },
 {
  "id": "71:28",
  "s": 71,
  "title": "Forgive me, my parents and the believers",
  "who": "Nuh (AS)",
  "cats": [
   "parents",
   "forgiveness"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 28,
    "pre": "",
    "dua": "رَّبِّ ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِمَن دَخَلَ بَيْتِىَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَٱلْمُؤْمِنَٰتِ وَلَا تَزِدِ ٱلظَّٰلِمِينَ إِلَّا تَبَارًۢا",
    "ur": "اے میرے پروردگار مجھ کو اور میرے ماں باپ کو اور جو ایمان لا کر میرے گھر میں آئے اس کو اور تمام ایمان والے مردوں اور ایمان والی عورتوں کو معاف فرما اور ظالم لوگوں کے لئے اور زیادہ تباہی بڑھا",
    "en": "My Lord, forgive me and my parents and whoever enters my house a believer and the believing men and believing women. And do not increase the wrongdoers except in destruction.\""
   }
  ]
 },
 {
  "id": "46:15",
  "s": 46,
  "title": "Gratitude, my parents and my children",
  "who": "A believer at forty",
  "cats": [
   "parents",
   "gratitude"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 15,
    "pre": "وَوَصَّيْنَا ٱلْإِنسَٰنَ بِوَٰلِدَيْهِ إِحْسَٰنًا ۖ حَمَلَتْهُ أُمُّهُۥ كُرْهًا وَوَضَعَتْهُ كُرْهًا ۖ وَحَمْلُهُۥ وَفِصَٰلُهُۥ ثَلَٰثُونَ شَهْرًا ۚ حَتَّىٰٓ إِذَا بَلَغَ أَشُدَّهُۥ وَبَلَغَ أَرْبَعِينَ سَنَةً قَالَ",
    "dua": "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَٰلِحًا تَرْضَىٰهُ وَأَصْلِحْ لِى فِى ذُرِّيَّتِىٓ ۖ إِنِّى تُبْتُ إِلَيْكَ وَإِنِّى مِنَ ٱلْمُسْلِمِينَ",
    "ur": "اور ہم نے انسان کو اپنے والدین کے ساتھ بھلائی کرنے کا حکم دیا۔ اس کی ماں نے اس کو تکلیف سے پیٹ میں رکھا اور تکلیف ہی سے جنا۔ اور اس کا پیٹ میں رہنا اور دودھ چھوڑنا ڈھائی برس میں ہوتا ہے۔ یہاں تک کہ جب خوب جوان ہوتا ہے اور چالیس برس کو پہنچ جاتا ہے تو کہتا ہے کہ اے میرے پروردگار مجھے توفیق دے کہ تو نے جو احسان مجھ پر اور میرے ماں باپ پر کئے ہیں ان کا شکر گزار ہوں اور یہ کہ نیک عمل کروں جن کو تو پسند کرے۔ اور میرے لئے میری اولاد میں صلاح (وتقویٰ) دے۔ میں تیری طرف رجوع کرتا ہوں اور میں فرمانبرداروں میں ہوں",
    "en": "And We have enjoined upon man, to his parents, good treatment. His mother carried him with hardship and gave birth to him with hardship, and his gestation and weaning [period] is thirty months. [He grows] until, when he reaches maturity and reaches [the age of] forty years, he says, \"My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to work righteousness of which You will approve and make righteous for me my offspring. Indeed, I have repented to You, and indeed, I am of the Muslims.\""
   }
  ]
 },
 {
  "id": "27:19",
  "s": 27,
  "title": "Let me thank You for Your favour on me and my parents",
  "who": "Sulaiman (AS)",
  "cats": [
   "parents",
   "gratitude"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 19,
    "pre": "فَتَبَسَّمَ ضَاحِكًا مِّن قَوْلِهَا وَقَالَ",
    "dua": "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَٰلِحًا تَرْضَىٰهُ وَأَدْخِلْنِى بِرَحْمَتِكَ فِى عِبَادِكَ ٱلصَّٰلِحِينَ",
    "ur": "تو وہ اس کی بات سن کر ہنس پڑے اور کہنے لگے کہ اے پروردگار! مجھے توفیق عطا فرما کہ جو احسان تونے مجھ پر اور میرے ماں باپ پر کئے ہیں ان کا شکر کروں اور ایسے نیک کام کروں کہ تو ان سے خوش ہوجائے اور مجھے اپنی رحمت سے اپنے نیک بندوں میں داخل فرما",
    "en": "So [Solomon] smiled, amused at her speech, and said, \"My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to do righteousness of which You approve. And admit me by Your mercy into [the ranks of] Your righteous servants.\""
   }
  ]
 },
 {
  "id": "25:74",
  "s": 25,
  "title": "Comfort of our eyes in spouses and children",
  "who": "Servants of the Most Merciful",
  "cats": [
   "parents"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 74,
    "pre": "وَٱلَّذِينَ يَقُولُونَ",
    "dua": "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْيُنٍ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    "ur": "اور وہ جو (خدا سے) دعا مانگتے ہیں کہ اے پروردگار ہم کو ہماری بیویوں کی طرف سے (دل کا چین) اور اولاد کی طرف سے آنکھ کی ٹھنڈک عطا فرما اور ہمیں پرہیزگاروں کا امام بنا",
    "en": "And those who say, \"Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.\""
   }
  ]
 },
 {
  "id": "3:38",
  "s": 3,
  "title": "Grant me righteous offspring",
  "who": "Zakariya (AS)",
  "cats": [
   "parents"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 38,
    "pre": "هُنَالِكَ دَعَا زَكَرِيَّا رَبَّهُۥ ۖ قَالَ",
    "dua": "رَبِّ هَبْ لِى مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ ٱلدُّعَآءِ",
    "ur": "اس وقت زکریا نے اپنے پروردگار سے دعا کی (اور) کہا کہ پروردگار مجھے اپنی جناب سے اولاد صالح عطا فرما تو بے شک دعا سننے (اور قبول کرنے) والا ہے",
    "en": "At that, Zechariah called upon his Lord, saying, \"My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.\""
   }
  ]
 },
 {
  "id": "21:89",
  "s": 21,
  "title": "Do not leave me alone",
  "who": "Zakariya (AS)",
  "cats": [
   "parents"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 89,
    "pre": "وَزَكَرِيَّآ إِذْ نَادَىٰ رَبَّهُۥ",
    "dua": "رَبِّ لَا تَذَرْنِى فَرْدًا وَأَنتَ خَيْرُ ٱلْوَٰرِثِينَ",
    "ur": "اور زکریا (کو یاد کرو) جب انہوں نے اپنے پروردگار کو پکارا کہ پروردگار مجھے اکیلا نہ چھوڑ اور تو سب سے بہتر وارث ہے",
    "en": "And [mention] Zechariah, when he called to his Lord, \"My Lord, do not leave me alone [with no heir], while you are the best of inheritors.\""
   }
  ]
 },
 {
  "id": "37:100",
  "s": 37,
  "title": "Grant me a righteous child",
  "who": "Ibrahim (AS)",
  "cats": [
   "parents"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 100,
    "pre": "",
    "dua": "رَبِّ هَبْ لِى مِنَ ٱلصَّٰلِحِينَ",
    "ur": "اے پروردگار مجھے (اولاد) عطا فرما (جو) سعادت مندوں میں سے (ہو)",
    "en": "My Lord, grant me [a child] from among the righteous.\""
   }
  ]
 },
 {
  "id": "14:35",
  "s": 14,
  "title": "Make this city safe, keep my children from idols",
  "who": "Ibrahim (AS)",
  "cats": [
   "parents",
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 35,
    "pre": "وَإِذْ قَالَ إِبْرَٰهِيمُ",
    "dua": "رَبِّ ٱجْعَلْ هَٰذَا ٱلْبَلَدَ ءَامِنًا وَٱجْنُبْنِى وَبَنِىَّ أَن نَّعْبُدَ ٱلْأَصْنَامَ",
    "ur": "اور جب ابراہیم نے دعا کی کہ میرے پروردگار اس شہر کو (لوگوں کے لیے) امن کی جگہ بنا دے۔ اور مجھے اور میری اولاد کو اس بات سے کہ بتوں کی پرستش کرنے لگیں بچائے رکھ",
    "en": "And [mention, O Muhammad], when Abraham said, \"My Lord, make this city [Makkah] secure and keep me and my sons away from worshipping idols."
   }
  ]
 },
 {
  "id": "20:25-28",
  "s": 20,
  "title": "Expand my chest, ease my task",
  "who": "Musa (AS)",
  "cats": [
   "knowledge"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 25,
    "pre": "قَالَ",
    "dua": "رَبِّ ٱشْرَحْ لِى صَدْرِى",
    "ur": "کہا میرے پروردگار (اس کام کے لئے) میرا سینہ کھول دے",
    "en": "[Moses] said, \"My Lord, expand for me my breast [with assurance]"
   },
   {
    "a": 26,
    "pre": "",
    "dua": "وَيَسِّرْ لِىٓ أَمْرِى",
    "ur": "اور میرا کام آسان کردے",
    "en": "And ease for me my task"
   },
   {
    "a": 27,
    "pre": "",
    "dua": "وَٱحْلُلْ عُقْدَةً مِّن لِّسَانِى",
    "ur": "اور میری زبان کی گرہ کھول دے",
    "en": "And untie the knot from my tongue"
   },
   {
    "a": 28,
    "pre": "",
    "dua": "يَفْقَهُوا۟ قَوْلِى",
    "ur": "تاکہ وہ بات سمجھ لیں",
    "en": "That they may understand my speech."
   }
  ]
 },
 {
  "id": "20:114",
  "s": 20,
  "title": "Increase me in knowledge",
  "who": "Prophet Muhammad ﷺ",
  "cats": [
   "knowledge"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 114,
    "pre": "فَتَعَٰلَى ٱللَّهُ ٱلْمَلِكُ ٱلْحَقُّ ۗ وَلَا تَعْجَلْ بِٱلْقُرْءَانِ مِن قَبْلِ أَن يُقْضَىٰٓ إِلَيْكَ وَحْيُهُۥ ۖ وَقُل",
    "dua": "رَّبِّ زِدْنِى عِلْمًا",
    "ur": "تو خدا جو سچا بادشاہ ہے عالی قدر ہے۔ اور قرآن کی وحی جو تمہاری طرف بھیجی جاتی ہے اس کے پورا ہونے سے پہلے قرآن کے (پڑھنے کے) لئے جلدی نہ کیا کرو اور دعا کرو کہ میرے پروردگار مجھے اور زیادہ علم دے",
    "en": "So high [above all] is Allah, the Sovereign, the Truth. And, [O Muhammad], do not hasten with [recitation of] the Qur'an before its revelation is completed to you, and say, \"My Lord, increase me in knowledge.\""
   }
  ]
 },
 {
  "id": "17:80",
  "s": 17,
  "title": "A truthful entrance and a truthful exit",
  "who": "Prophet Muhammad ﷺ",
  "cats": [
   "knowledge",
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 80,
    "pre": "وَقُل",
    "dua": "رَّبِّ أَدْخِلْنِى مُدْخَلَ صِدْقٍ وَأَخْرِجْنِى مُخْرَجَ صِدْقٍ وَٱجْعَل لِّى مِن لَّدُنكَ سُلْطَٰنًا نَّصِيرًا",
    "ur": "اور کہو کہ اے پروردگار مجھے (مدینے میں) اچھی طرح داخل کیجیو اور (مکے سے) اچھی طرح نکالیو۔ اور اپنے ہاں سے زور وقوت کو میرا مددگار بنائیو",
    "en": "And say, \"My Lord, cause me to enter a sound entrance and to exit a sound exit and grant me from Yourself a supporting authority.\""
   }
  ]
 },
 {
  "id": "21:87",
  "s": 21,
  "title": "There is no god but You, glory be to You",
  "who": "Yunus (AS)",
  "cats": [
   "protection",
   "forgiveness"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 87,
    "pre": "وَذَا ٱلنُّونِ إِذ ذَّهَبَ مُغَٰضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِى ٱلظُّلُمَٰتِ أَن",
    "dua": "لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ",
    "ur": "اور ذوالنون (کو یاد کرو) جب وہ (اپنی قوم سے ناراض ہو کر) غصے کی حالت میں چل دیئے اور خیال کیا کہ ہم ان پر قابو نہیں پاسکیں گے۔ آخر اندھیرے میں (خدا کو) پکارنے لگے کہ تیرے سوا کوئی معبود نہیں۔ تو پاک ہے (اور) بےشک میں قصوروار ہوں",
    "en": "And [mention] the man of the fish, when he went off in anger and thought that We would not decree [anything] upon him. And he called out within the darknesses, \"There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.\""
   }
  ]
 },
 {
  "id": "21:83",
  "s": 21,
  "title": "Harm has touched me",
  "who": "Ayyub (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 83,
    "pre": "۞ وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُۥٓ",
    "dua": "أَنِّى مَسَّنِىَ ٱلضُّرُّ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ",
    "ur": "اور ایوب کو (یاد کرو) جب انہوں نے اپنے پروردگار سے دعا کی کہ مجھے ایذا ہو رہی ہے اور تو سب سے بڑھ کر رحم کرنے والا ہے",
    "en": "And [mention] Job, when he called to his Lord, \"Indeed, adversity has touched me, and you are the Most Merciful of the merciful.\""
   }
  ]
 },
 {
  "id": "28:21",
  "s": 28,
  "title": "Save me from the wrongdoing people",
  "who": "Musa (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 21,
    "pre": "فَخَرَجَ مِنْهَا خَآئِفًا يَتَرَقَّبُ ۖ قَالَ",
    "dua": "رَبِّ نَجِّنِى مِنَ ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "ur": "موسٰی وہاں سے ڈرتے ڈرتے نکل کھڑے ہوئے کہ دیکھیں (کیا ہوتا ہے) اور دعا کرنے لگے کہ اے پروردگار مجھے ظالم لوگوں سے نجات دے۔",
    "en": "So he left it, fearful and anticipating [apprehension]. He said, \"My Lord, save me from the wrongdoing people.\""
   }
  ]
 },
 {
  "id": "28:24",
  "s": 28,
  "title": "I am in need of whatever good You send",
  "who": "Musa (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 24,
    "pre": "فَسَقَىٰ لَهُمَا ثُمَّ تَوَلَّىٰٓ إِلَى ٱلظِّلِّ فَقَالَ",
    "dua": "رَبِّ إِنِّى لِمَآ أَنزَلْتَ إِلَىَّ مِنْ خَيْرٍ فَقِيرٌ",
    "ur": "تو موسٰی نے اُن کے لئے (بکریوں کو) پانی پلا دیا پھر سائے کی طرف چلے گئے۔ اور کہنے لگے کہ پروردگار میں اس کا محتاج ہوں کہ تو مجھ پر اپنی نعمت نازل فرمائے",
    "en": "So he watered [their flocks] for them; then he went back to the shade and said, \"My Lord, indeed I am, for whatever good You would send down to me, in need.\""
   }
  ]
 },
 {
  "id": "29:30",
  "s": 29,
  "title": "Help me against the corrupters",
  "who": "Lut (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 30,
    "pre": "قَالَ",
    "dua": "رَبِّ ٱنصُرْنِى عَلَى ٱلْقَوْمِ ٱلْمُفْسِدِينَ",
    "ur": "لوط نے کہا کہ اے میرے پروردگار ان مفسد لوگوں کے مقابلے میں مجھے نصرت عنایت فرما",
    "en": "He said, \"My Lord, support me against the corrupting people.\""
   }
  ]
 },
 {
  "id": "4:75",
  "s": 4,
  "title": "Take us out and send us a helper",
  "who": "The oppressed",
  "cats": [
   "protection"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 75,
    "pre": "وَمَا لَكُمْ لَا تُقَٰتِلُونَ فِى سَبِيلِ ٱللَّهِ وَٱلْمُسْتَضْعَفِينَ مِنَ ٱلرِّجَالِ وَٱلنِّسَآءِ وَٱلْوِلْدَٰنِ ٱلَّذِينَ يَقُولُونَ",
    "dua": "رَبَّنَآ أَخْرِجْنَا مِنْ هَٰذِهِ ٱلْقَرْيَةِ ٱلظَّالِمِ أَهْلُهَا وَٱجْعَل لَّنَا مِن لَّدُنكَ وَلِيًّا وَٱجْعَل لَّنَا مِن لَّدُنكَ نَصِيرًا",
    "ur": "اور تم کو کیا ہوا ہے کہ خدا کی راہ میں اور اُن بےبس مردوں اور عورتوں اور بچوں کی خاطر نہیں لڑتے جو دعائیں کیا کرتے ہیں کہ اے پروردگار ہم کو اس شہر سے جس کے رہنے والے ظالم ہیں نکال کر کہیں اور لے جا۔ اور اپنی طرف سے کسی کو ہمارا حامی بنا۔ اور اپنی ہی طرف سے کسی کو ہمارا مددگار مقرر فرما",
    "en": "And what is [the matter] with you that you fight not in the cause of Allah and [for] the oppressed among men, women, and children who say, \"Our Lord, take us out of this city of oppressive people and appoint for us from Yourself a protector and appoint for us from Yourself a helper?\""
   }
  ]
 },
 {
  "id": "7:89",
  "s": 7,
  "title": "Judge between us in truth",
  "who": "Shu'ayb (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 89,
    "pre": "قَدِ ٱفْتَرَيْنَا عَلَى ٱللَّهِ كَذِبًا إِنْ عُدْنَا فِى مِلَّتِكُم بَعْدَ إِذْ نَجَّىٰنَا ٱللَّهُ مِنْهَا ۚ وَمَا يَكُونُ لَنَآ أَن نَّعُودَ فِيهَآ إِلَّآ أَن يَشَآءَ ٱللَّهُ رَبُّنَا ۚ وَسِعَ رَبُّنَا كُلَّ شَىْءٍ عِلْمًا ۚ عَلَى ٱللَّهِ تَوَكَّلْنَا ۚ",
    "dua": "رَبَّنَا ٱفْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِٱلْحَقِّ وَأَنتَ خَيْرُ ٱلْفَٰتِحِينَ",
    "ur": "اگر ہم اس کے بعد کہ خدا ہمیں اس سے نجات بخش چکا ہے تمہارے مذہب میں لوٹ جائیں تو بےشک ہم نے خدا پر جھوٹ افتراء باندھا۔ اور ہمیں شایاں نہیں کہ ہم اس میں لوٹ جائیں ہاں خدا جو ہمارا پروردگار ہے وہ چاہے تو (ہم مجبور ہیں) ۔ ہمارے پروردگار کا علم ہر چیز پر احاطہ کیے ہوئے ہے۔ ہمارا خدا ہی پر بھروسہ ہے۔ اے پروردگار ہم میں اور ہماری قوم میں انصاف کے ساتھ فیصلہ کردے اور تو سب سے بہتر فیصلہ کرنے والا ہے",
    "en": "We would have invented against Allah a lie if we returned to your religion after Allah had saved us from it. And it is not for us to return to it except that Allah, our Lord, should will. Our Lord has encompassed all things in knowledge. Upon Allah we have relied. Our Lord, decide between us and our people in truth, and You are the best of those who give decision.\""
   }
  ]
 },
 {
  "id": "10:85-86",
  "s": 10,
  "title": "Do not make us a trial, save us",
  "who": "The people of Musa (AS)",
  "cats": [
   "protection"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 85,
    "pre": "فَقَالُوا۟ عَلَى ٱللَّهِ تَوَكَّلْنَا",
    "dua": "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلْقَوْمِ ٱلظَّٰلِمِينَ",
    "ur": "تو وہ بولے کہ ہم خدا ہی پر بھروسہ رکھتے ہیں۔ اے ہمارے پروردگار ہم کو ظالم لوگوں کے ہاتھ سے آزمائش میں نہ ڈال",
    "en": "So they said, \"Upon Allah do we rely. Our Lord, make us not [objects of] trial for the wrongdoing people"
   },
   {
    "a": 86,
    "pre": "",
    "dua": "وَنَجِّنَا بِرَحْمَتِكَ مِنَ ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "ur": "اور اپنی رحمت سے قوم کفار سے نجات بخش",
    "en": "And save us by Your mercy from the disbelieving people.\""
   }
  ]
 },
 {
  "id": "20:45",
  "s": 20,
  "title": "We fear he will transgress",
  "who": "Musa & Harun (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 45,
    "pre": "قَالَا",
    "dua": "رَبَّنَآ إِنَّنَا نَخَافُ أَن يَفْرُطَ عَلَيْنَآ أَوْ أَن يَطْغَىٰ",
    "ur": "دونوں کہنے لگے کہ ہمارے پروردگار ہمیں خوف ہے کہ ہم پر تعدی کرنے لگے یا زیادہ سرکش ہوجائے",
    "en": "They said, \"Our Lord, indeed we are afraid that he will hasten [punishment] against us or that he will transgress.\""
   }
  ]
 },
 {
  "id": "23:97",
  "s": 23,
  "title": "Refuge from the whispers of the devils",
  "who": "Prophet Muhammad ﷺ",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 97,
    "pre": "وَقُل",
    "dua": "رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَٰتِ ٱلشَّيَٰطِينِ",
    "ur": "اور کہو کہ اے پروردگار! میں شیطانوں کے وسوسوں سے تیری پناہ مانگتا ہو",
    "en": "And say, \"My Lord, I seek refuge in You from the incitements of the devils,"
   }
  ]
 },
 {
  "id": "23:94",
  "s": 23,
  "title": "Do not place me among the wrongdoers",
  "who": "Prophet Muhammad ﷺ",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 94,
    "pre": "",
    "dua": "رَبِّ فَلَا تَجْعَلْنِى فِى ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "ur": "تو اے پروردگار مجھے (اس سے محفوظ رکھیئے اور) ان ظالموں میں شامل نہ کیجیئے",
    "en": "My Lord, then do not place me among the wrongdoing people.\""
   }
  ]
 },
 {
  "id": "11:47",
  "s": 11,
  "title": "I seek refuge in You",
  "who": "Nuh (AS)",
  "cats": [
   "protection",
   "forgiveness"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 47,
    "pre": "قَالَ",
    "dua": "رَبِّ إِنِّىٓ أَعُوذُ بِكَ أَنْ أَسْـَٔلَكَ مَا لَيْسَ لِى بِهِۦ عِلْمٌ ۖ وَإِلَّا تَغْفِرْ لِى وَتَرْحَمْنِىٓ أَكُن مِّنَ ٱلْخَٰسِرِينَ",
    "ur": "نوح نے کہا پروردگار میں تجھ سے پناہ مانگتا ہوں کہ ایسی چیز کا تجھ سے سوال کروں جس کی حقیقت مجھے معلوم نہیں۔ اور اگر تو مجھے نہیں بخشے گا اور مجھ پر رحم نہیں کرے گا تو میں تباہ ہوجاؤں گا",
    "en": "[Noah] said, \"My Lord, I seek refuge in You from asking that of which I have no knowledge. And unless You forgive me and have mercy upon me, I will be among the losers.\""
   }
  ]
 },
 {
  "id": "23:29",
  "s": 23,
  "title": "Let me land at a blessed place",
  "who": "Nuh (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 29,
    "pre": "وَقُل",
    "dua": "رَّبِّ أَنزِلْنِى مُنزَلًا مُّبَارَكًا وَأَنتَ خَيْرُ ٱلْمُنزِلِينَ",
    "ur": "اور (یہ بھی) دعا کرنا کہ اے پروردگار ہم کو مبارک جگہ اُتاریو اور تو سب سے بہتر اُتارنے والا ہے",
    "en": "And say, 'My Lord, let me land at a blessed landing place, and You are the best to accommodate [us].' \""
   }
  ]
 },
 {
  "id": "9:59",
  "s": 9,
  "title": "Allah is sufficient for us",
  "who": "The believers",
  "cats": [
   "protection"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 59,
    "pre": "وَلَوْ أَنَّهُمْ رَضُوا۟ مَآ ءَاتَىٰهُمُ ٱللَّهُ وَرَسُولُهُۥ وَقَالُوا۟",
    "dua": "حَسْبُنَا ٱللَّهُ سَيُؤْتِينَا ٱللَّهُ مِن فَضْلِهِۦ وَرَسُولُهُۥٓ إِنَّآ إِلَى ٱللَّهِ رَٰغِبُونَ",
    "ur": "اور اگر وہ اس پر خوش رہتے جو خدا اور اس کے رسول نے ان کو دیا تھا۔ اور کہتے کہ ہمیں خدا کافی ہے اور خدا اپنے فضل سے اور اس کے پیغمبر (اپنی مہربانی سے) ہمیں (پھر) دیں گے۔ اور ہمیں تو خدا ہی کی خواہش ہے (تو ان کے حق میں بہتر ہوتا)",
    "en": "If only they had been satisfied with what Allah and His Messenger gave them and said, \"Sufficient for us is Allah; Allah will give us of His bounty, and [so will] His Messenger; indeed, we are desirous toward Allah,\" [it would have been better for them]."
   }
  ]
 },
 {
  "id": "5:114",
  "s": 5,
  "title": "Send us a table spread from heaven",
  "who": "Isa (AS)",
  "cats": [
   "protection"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 114,
    "pre": "قَالَ عِيسَى ٱبْنُ مَرْيَمَ ٱللَّهُمَّ",
    "dua": "رَبَّنَآ أَنزِلْ عَلَيْنَا مَآئِدَةً مِّنَ ٱلسَّمَآءِ تَكُونُ لَنَا عِيدًا لِّأَوَّلِنَا وَءَاخِرِنَا وَءَايَةً مِّنكَ ۖ وَٱرْزُقْنَا وَأَنتَ خَيْرُ ٱلرَّٰزِقِينَ",
    "ur": "(تب) عیسیٰ بن مریم نے دعا کی کہ اے ہمارے پروردگار! ہم پر آسمان سے خوان نازل فرما کہ ہمارے لیے (وہ دن) عید قرار پائے یعنی ہمارے اگلوں اور پچھلوں (سب) کے لیے اور وہ تیری طرف سے نشانی ہو اور ہمیں رزق دے تو بہتر رزق دینے والا ہے",
    "en": "Said Jesus, the son of Mary, \"O Allah, our Lord, send down to us a table [spread with food] from the heaven to be for us a festival for the first of us and the last of us and a sign from You. And provide for us, and You are the best of providers.\""
   }
  ]
 },
 {
  "id": "2:127-128",
  "s": 2,
  "title": "Accept from us, show us our rites",
  "who": "Ibrahim & Ismail (AS)",
  "cats": [
   "gratitude"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 127,
    "pre": "وَإِذْ يَرْفَعُ إِبْرَٰهِـۧمُ ٱلْقَوَاعِدَ مِنَ ٱلْبَيْتِ وَإِسْمَٰعِيلُ",
    "dua": "رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ",
    "ur": "اور جب ابراہیم اور اسمٰعیل بیت الله کی بنیادیں اونچی کر رہے تھے (تو دعا کئے جاتے تھے کہ) اے پروردگار، ہم سے یہ خدمت قبول فرما۔ بےشک تو سننے والا (اور) جاننے والا ہے",
    "en": "And [mention] when Abraham was raising the foundations of the House and [with him] Ishmael, [saying], \"Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing."
   },
   {
    "a": 128,
    "pre": "",
    "dua": "رَبَّنَا وَٱجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَآ أُمَّةً مُّسْلِمَةً لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَآ ۖ إِنَّكَ أَنتَ ٱلتَّوَّابُ ٱلرَّحِيمُ",
    "ur": "اے پروردگار، ہم کو اپنا فرمانبردار بنائے رکھیو۔ اور ہماری اولاد میں سے بھی ایک گروہ کو اپنا مطیع بنائے رہیو، اور (پروردگار) ہمیں طریق عبادت بتا اور ہمارے حال پر (رحم کے ساتھ) توجہ فرما۔ بے شک تو توجہ فرمانے والا مہربان ہے",
    "en": "Our Lord, and make us Muslims [in submission] to You and from our descendants a Muslim nation [in submission] to You. And show us our rites and accept our repentance. Indeed, You are the Accepting of repentance, the Merciful."
   }
  ]
 },
 {
  "id": "12:101",
  "s": 12,
  "title": "Let me die a Muslim, join me with the righteous",
  "who": "Yusuf (AS)",
  "cats": [
   "gratitude",
   "hereafter"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 101,
    "pre": "۞ رَبِّ قَدْ ءَاتَيْتَنِى مِنَ ٱلْمُلْكِ وَعَلَّمْتَنِى مِن تَأْوِيلِ ٱلْأَحَادِيثِ ۚ",
    "dua": "فَاطِرَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ أَنتَ وَلِىِّۦ فِى ٱلدُّنْيَا وَٱلْـَٔاخِرَةِ ۖ تَوَفَّنِى مُسْلِمًا وَأَلْحِقْنِى بِٱلصَّٰلِحِينَ",
    "ur": "(جب یہ سب باتیں ہولیں تو یوسف نے خدا سے دعا کی کہ) اے میرے پروردگار تو نے مجھ کو حکومت سے بہرہ دیا اور خوابوں کی تعبیر کا علم بخشا۔ اے آسمانوں اور زمین کے پیدا کرنے والے تو ہی دنیا اور آخرت میں میرا کارساز ہے۔ تو مجھے (دنیا سے) اپنی اطاعت (کی حالت) میں اٹھائیو اور (آخرت میں) اپنے نیک بندوں میں داخل کیجیو",
    "en": "My Lord, You have given me [something] of sovereignty and taught me of the interpretation of dreams. Creator of the heavens and earth, You are my protector in this world and in the Hereafter. Cause me to die a Muslim and join me with the righteous.\""
   }
  ]
 },
 {
  "id": "14:38",
  "s": 14,
  "title": "You know what we hide and what we show",
  "who": "Ibrahim (AS)",
  "cats": [
   "gratitude"
  ],
  "prophet": true,
  "ayahs": [
   {
    "a": 38,
    "pre": "",
    "dua": "رَبَّنَآ إِنَّكَ تَعْلَمُ مَا نُخْفِى وَمَا نُعْلِنُ ۗ وَمَا يَخْفَىٰ عَلَى ٱللَّهِ مِن شَىْءٍ فِى ٱلْأَرْضِ وَلَا فِى ٱلسَّمَآءِ",
    "ur": "اے پروردگار جو بات ہم چھپاتے اور جو ظاہر کرتے ہیں تو سب جانتا ہے۔ اور خدا سے کوئی چیز مخفی نہیں (نہ) زمین میں نہ آسمان میں",
    "en": "Our Lord, indeed You know what we conceal and what we declare, and nothing is hidden from Allah on the earth or in the heaven."
   }
  ]
 },
 {
  "id": "2:201",
  "s": 2,
  "title": "Good in this world and the next",
  "who": "The believers",
  "cats": [
   "hereafter"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 201,
    "pre": "وَمِنْهُم مَّن يَقُولُ",
    "dua": "رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْـَٔاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ",
    "ur": "اور بعضے ایسے ہیں کہ دعا کرتے ہیں کہ پروردگار ہم کو دنیا میں بھی نعمت عطا فرما اور آخرت میں بھی نعمت بخشیو اور دوزخ کے عذاب سے محفوظ رکھیو",
    "en": "But among them is he who says, \"Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.\""
   }
  ]
 },
 {
  "id": "3:191-194",
  "s": 3,
  "title": "You did not create this in vain",
  "who": "People of understanding",
  "cats": [
   "hereafter",
   "forgiveness"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 191,
    "pre": "ٱلَّذِينَ يَذْكُرُونَ ٱللَّهَ قِيَٰمًا وَقُعُودًا وَعَلَىٰ جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِى خَلْقِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ",
    "dua": "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَٰطِلًا سُبْحَٰنَكَ فَقِنَا عَذَابَ ٱلنَّارِ",
    "ur": "جو کھڑے اور بیٹھے اور لیٹے (ہر حال میں) خدا کو یاد کرتے اور آسمان اور زمین کی پیدائش میں غور کرتے (اور کہتے ہیں) کہ اے پروردگار! تو نے اس (مخلوق) کو بے فائدہ نہیں پیدا کیا تو پاک ہے تو (قیامت کے دن) ہمیں دوزخ کے عذاب سے بچائیو",
    "en": "Who remember Allah while standing or sitting or [lying] on their sides and give thought to the creation of the heavens and the earth, [saying], \"Our Lord, You did not create this aimlessly; exalted are You [above such a thing]; then protect us from the punishment of the Fire."
   },
   {
    "a": 192,
    "pre": "",
    "dua": "رَبَّنَآ إِنَّكَ مَن تُدْخِلِ ٱلنَّارَ فَقَدْ أَخْزَيْتَهُۥ ۖ وَمَا لِلظَّٰلِمِينَ مِنْ أَنصَارٍ",
    "ur": "اے پروردگار جس کو تو نے دوزخ میں ڈالا اسے رسوا کیا اور ظالموں کا کوئی مددگار نہیں",
    "en": "Our Lord, indeed whoever You admit to the Fire - You have disgraced him, and for the wrongdoers there are no helpers."
   },
   {
    "a": 193,
    "pre": "",
    "dua": "رَّبَّنَآ إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِى لِلْإِيمَٰنِ أَنْ ءَامِنُوا۟ بِرَبِّكُمْ فَـَٔامَنَّا ۚ رَبَّنَا فَٱغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّـَٔاتِنَا وَتَوَفَّنَا مَعَ ٱلْأَبْرَارِ",
    "ur": "اے پروردگارہم نے ایک ندا کرنے والے کو سنا کہ ایمان کے لیے پکار رہا تھا (یعنی) اپنے پروردگار پر ایمان لاؤ تو ہم ایمان لے آئے اے پروردگار ہمارے گناہ معاف فرما اور ہماری برائیوں کو ہم سے محو کر اور ہم کو دنیا سے نیک بندوں کے ساتھ اٹھا",
    "en": "Our Lord, indeed we have heard a caller calling to faith, [saying], 'Believe in your Lord,' and we have believed. Our Lord, so forgive us our sins and remove from us our misdeeds and cause us to die with the righteous."
   },
   {
    "a": 194,
    "pre": "",
    "dua": "رَبَّنَا وَءَاتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ ٱلْقِيَٰمَةِ ۗ إِنَّكَ لَا تُخْلِفُ ٱلْمِيعَادَ",
    "ur": "اے پروردگار تو نے جن جن چیزوں کے ہم سے اپنے پیغمبروں کے ذریعے سے وعدے کیے ہیں وہ ہمیں عطا فرما اور قیامت کے دن ہمیں رسوا نہ کیجو کچھ شک نہیں کہ تو خلاف وعدہ نہیں کرتا",
    "en": "Our Lord, and grant us what You promised us through Your messengers and do not disgrace us on the Day of Resurrection. Indeed, You do not fail in [Your] promise.\""
   }
  ]
 },
 {
  "id": "7:47",
  "s": 7,
  "title": "Do not place us with the wrongdoers",
  "who": "People of the Heights",
  "cats": [
   "hereafter"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 47,
    "pre": "۞ وَإِذَا صُرِفَتْ أَبْصَٰرُهُمْ تِلْقَآءَ أَصْحَٰبِ ٱلنَّارِ قَالُوا۟",
    "dua": "رَبَّنَا لَا تَجْعَلْنَا مَعَ ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "ur": "اور جب ان کی نگاہیں پلٹ کر اہل دوزخ کی طرف جائیں گی تو عرض کریں گے کہ اے ہمارے پروردگار ہم کو ظالم لوگوں کے ساتھ شامل نہ کیجیو",
    "en": "And when their eyes are turned toward the companions of the Fire, they say, \"Our Lord, do not place us with the wrongdoing people.\""
   }
  ]
 },
 {
  "id": "25:65-66",
  "s": 25,
  "title": "Avert from us the punishment of Hell",
  "who": "Servants of the Most Merciful",
  "cats": [
   "hereafter"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 65,
    "pre": "وَٱلَّذِينَ يَقُولُونَ",
    "dua": "رَبَّنَا ٱصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا",
    "ur": "اور جو دعا مانگتے رہتے ہیں کہ اے پروردگار دوزخ کے عذاب کو ہم سے دور رکھیو کہ اس کا عذاب بڑی تکلیف کی چیز ہے",
    "en": "And those who say, \"Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering;"
   },
   {
    "a": 66,
    "pre": "",
    "dua": "إِنَّهَا سَآءَتْ مُسْتَقَرًّا وَمُقَامًا",
    "ur": "اور دوزخ ٹھیرنے اور رہنے کی بہت بری جگہ ہے",
    "en": "Indeed, it is evil as a settlement and residence.\""
   }
  ]
 },
 {
  "id": "40:7-9",
  "s": 40,
  "title": "Your mercy encompasses all things",
  "who": "The angels around the Throne",
  "cats": [
   "hereafter",
   "forgiveness",
   "parents"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 7,
    "pre": "ٱلَّذِينَ يَحْمِلُونَ ٱلْعَرْشَ وَمَنْ حَوْلَهُۥ يُسَبِّحُونَ بِحَمْدِ رَبِّهِمْ وَيُؤْمِنُونَ بِهِۦ وَيَسْتَغْفِرُونَ لِلَّذِينَ ءَامَنُوا۟",
    "dua": "رَبَّنَا وَسِعْتَ كُلَّ شَىْءٍ رَّحْمَةً وَعِلْمًا فَٱغْفِرْ لِلَّذِينَ تَابُوا۟ وَٱتَّبَعُوا۟ سَبِيلَكَ وَقِهِمْ عَذَابَ ٱلْجَحِيمِ",
    "ur": "جو لوگ عرش کو اٹھائے ہوئے اور جو اس کے گردا گرد (حلقہ باندھے ہوئے) ہیں (یعنی فرشتے) وہ اپنے پروردگار کی تعریف کے ساتھ تسبیح کرتے رہتے ہیں اور مومنوں کے لئے بخشش مانگتے رہتے ہیں۔ کہ اے ہمارے پروردگار تیری رحمت اور تیرا علم ہر چیز کو احاطہ کئے ہوئے ہے تو جن لوگوں نے توبہ کی اور تیرے رستے پر چلے ان کو بخش دے اور دوزخ کے عذاب سے بچالے",
    "en": "Those [angels] who carry the Throne and those around it exalt [Allah] with praise of their Lord and believe in Him and ask forgiveness for those who have believed, [saying], \"Our Lord, You have encompassed all things in mercy and knowledge, so forgive those who have repented and followed Your way and protect them from the punishment of Hellfire."
   },
   {
    "a": 8,
    "pre": "",
    "dua": "رَبَّنَا وَأَدْخِلْهُمْ جَنَّٰتِ عَدْنٍ ٱلَّتِى وَعَدتَّهُمْ وَمَن صَلَحَ مِنْ ءَابَآئِهِمْ وَأَزْوَٰجِهِمْ وَذُرِّيَّٰتِهِمْ ۚ إِنَّكَ أَنتَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    "ur": "اے ہمارے پروردگار ان کو ہمیشہ رہنے کے بہشتوں میں داخل کر جن کا تونے ان سے وعدہ کیا ہے اور جو ان کے باپ دادا اور ان کی بیویوں اور ان کی اولاد میں سے نیک ہوں ان کو بھی۔ بےشک تو غالب حکمت والا ہے",
    "en": "Our Lord, and admit them to gardens of perpetual residence which You have promised them and whoever was righteous among their fathers, their spouses and their offspring. Indeed, it is You who is the Exalted in Might, the Wise."
   },
   {
    "a": 9,
    "pre": "",
    "dua": "وَقِهِمُ ٱلسَّيِّـَٔاتِ ۚ وَمَن تَقِ ٱلسَّيِّـَٔاتِ يَوْمَئِذٍ فَقَدْ رَحِمْتَهُۥ ۚ وَذَٰلِكَ هُوَ ٱلْفَوْزُ ٱلْعَظِيمُ",
    "ur": "اور ان کو عذابوں سے بچائے رکھ۔ اور جس کو تو اس روز عذابوں سے بچا لے گا تو بےشک اس پر مہربانی فرمائی اور یہی بڑی کامیابی ہے",
    "en": "And protect them from the evil consequences [of their deeds]. And he whom You protect from evil consequences that Day - You will have given him mercy. And that is the great attainment.\""
   }
  ]
 },
 {
  "id": "66:11",
  "s": 66,
  "title": "Build me a house near You in Paradise",
  "who": "Asiya, wife of Pharaoh",
  "cats": [
   "hereafter"
  ],
  "prophet": false,
  "ayahs": [
   {
    "a": 11,
    "pre": "وَضَرَبَ ٱللَّهُ مَثَلًا لِّلَّذِينَ ءَامَنُوا۟ ٱمْرَأَتَ فِرْعَوْنَ إِذْ قَالَتْ",
    "dua": "رَبِّ ٱبْنِ لِى عِندَكَ بَيْتًا فِى ٱلْجَنَّةِ وَنَجِّنِى مِن فِرْعَوْنَ وَعَمَلِهِۦ وَنَجِّنِى مِنَ ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "ur": "اور مومنوں کے لئے (ایک) مثال (تو) فرعون کی بیوی کی بیان فرمائی کہ اس نے خدا سے التجا کی کہ اے میرے پروردگار میرے لئے بہشت میں اپنے پاس ایک گھر بنا اور مجھے فرعون اور اس کے اعمال (زشت مآل) سے نجات بخش اور ظالم لوگوں کے ہاتھ سے مجھ کو مخلصی عطا فرما",
    "en": "And Allah presents an example of those who believed: the wife of Pharaoh, when she said, \"My Lord, build for me near You a house in Paradise and save me from Pharaoh and his deeds and save me from the wrongdoing people.\""
   }
  ]
 }
];
