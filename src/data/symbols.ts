import { SymbolItem } from '../types';

export const SYMBOLS: SymbolItem[] = [
  // --- HEARTS ---
  { id: 'sym-h1', char: '♡', name: { ko: '빈 하트', en: 'White Heart Suit', ja: '白抜きハート', 'zh-hans': '空心爱心', 'zh-hant': '空心愛心', es: 'Corazón blanco', fr: 'Cœur blanc', de: 'Weißes Herz' }, category: 'heart' },
  { id: 'sym-h2', char: '♥', name: { ko: '검은 하트', en: 'Black Heart Suit', ja: '黒ハート', 'zh-hans': '实心爱心', 'zh-hant': '實心愛心', es: 'Corazón negro', fr: 'Cœur noir', de: 'Schwarzes Herz' }, category: 'heart' },
  { id: 'sym-h3', char: '❤', name: { ko: '굵은 하트', en: 'Heavy Black Heart', ja: '太いハート', 'zh-hans': '加粗爱心', 'zh-hant': '加粗愛心', es: 'Corazón relleno', fr: 'Cœur épais', de: 'Kräftiges Herz' }, category: 'heart' },
  { id: 'sym-h4', char: '❥', name: { ko: '회전된 하트', en: 'Rotated Heart', ja: '傾いたハート', 'zh-hans': '倾斜爱心', 'zh-hant': '傾斜愛心', es: 'Corazón inclinado', fr: 'Cœur penché', de: 'Geneigtes Herz' }, category: 'heart' },
  { id: 'sym-h5', char: '❣', name: { ko: '하트 느낌표', en: 'Heart Exclamation', ja: 'ハート感嘆符', 'zh-hans': '心形感叹号', 'zh-hant': '心形感嘆號', es: 'Exclamación de corazón', fr: 'Point d’exclamation cœur', de: 'Herz-Ausrufezeichen' }, category: 'heart' },
  { id: 'sym-h6', char: '❦', name: { ko: '꽃잎 하트 (플로레트)', en: 'Floral Heart', ja: '花のハート', 'zh-hans': '花卉心形', 'zh-hant': '花卉心形', es: 'Corazón floral', fr: 'Cœur fleuri', de: 'Florales Herz' }, category: 'heart' },
  { id: 'sym-h7', char: 'ღ', name: { ko: '조지아 문자 하트', en: 'Georgian Letter Ghani', ja: 'グルジア文字ハート', 'zh-hans': '格鲁吉亚爱心', 'zh-hant': '格魯吉亞愛心', es: 'Letra georgiana de corazón', fr: 'Caractère géorgien cœur', de: 'Georgischer Herzbuchstabe' }, category: 'heart' },
  { id: 'sym-h8', char: 'ɞ', name: { ko: '양날개 하트', en: 'Open Back Unrounded Vowel', ja: '羽のハート', 'zh-hans': '双翼爱心', 'zh-hant': '雙翼愛心', es: 'Corazón alado', fr: 'Cœur ailé', de: 'Flügelherz' }, category: 'heart' },
  { id: 'sym-h9', char: 'ෆ', name: { ko: '미얀마 글자 하트', en: 'Myanmar Sign Heart', ja: 'ミャンマー文字ハート', 'zh-hans': '缅甸心形符号', 'zh-hant': '緬甸心形符號', es: 'Signo birmano de corazón', fr: 'Signe birman cœur', de: 'Birmanisches Herzzeichen' }, category: 'heart' },
  { id: 'sym-h10', char: 'ᥫ᭡', name: { ko: '인스타 감성 하트', en: 'Aesthetic Insta Heart', ja: 'インスタイメージハート', 'zh-hans': 'Ins网感爱心', 'zh-hant': 'Ins美學愛心', es: 'Corazón estético', fr: 'Cœur esthétique', de: 'Ästhetisches Herz' }, category: 'heart' },

  // --- STARS ---
  { id: 'sym-s1', char: '★', name: { ko: '검은 별 (속 찬 별)', en: 'Black Star', ja: '黒星', 'zh-hans': '实心五角星', 'zh-hant': '實心五角星', es: 'Estrella negra', fr: 'Étoile noire', de: 'Schwarzer Stern' }, category: 'star' },
  { id: 'sym-s2', char: '☆', name: { ko: '하얀 별 (빈 별)', en: 'White Star', ja: '白星', 'zh-hans': '空心五角星', 'zh-hant': '空心五角星', es: 'Estrella blanca', fr: 'Étoile blanche', de: 'Weißer Stern' }, category: 'star' },
  { id: 'sym-s3', char: '✦', name: { ko: '검은 네모 별', en: 'Black Four Pointed Star', ja: '4つ角の黒星', 'zh-hans': '四角闪烁星', 'zh-hant': '四角閃爍星', es: 'Estrella de cuatro puntas', fr: 'Étoile à 4 pointes', de: 'Vierzackiger Stern' }, category: 'star' },
  { id: 'sym-s4', char: '✧', name: { ko: '하얀 네모 별', en: 'White Four Pointed Star', ja: '4つ角の白星', 'zh-hans': '四角空心星', 'zh-hant': '四角空心星', es: 'Estrella de 4 puntas blanca', fr: 'Étoile 4 pointes blanche', de: 'Weißer 4-zackiger Stern' }, category: 'star' },
  { id: 'sym-s5', char: '✪', name: { ko: '원 안의 별', en: 'Circled Star', ja: '丸囲み星', 'zh-hans': '圆圈五角星', 'zh-hant': '圓圈五角星', es: 'Estrella en círculo', fr: 'Étoile cerclée', de: 'Kreisstern' }, category: 'star' },
  { id: 'sym-s6', char: '✫', name: { ko: '둥근 별', en: 'Open Centre Black Star', ja: '丸みを帯びた星', 'zh-hans': '空心点缀星', 'zh-hant': '空心點綴星', es: 'Estrella centrada', fr: 'Étoile centrée', de: 'Stern mit offenem Kern' }, category: 'star' },
  { id: 'sym-s7', char: '✬', name: { ko: '빛나는 별', en: 'Pinwheel Star', ja: 'ピンウィール星', 'zh-hans': '光芒五角星', 'zh-hant': '光芒五角星', es: 'Estrella resplandeciente', fr: 'Étoile rayonnante', de: 'Leuchtender Stern' }, category: 'star' },
  { id: 'sym-s8', char: '✯', name: { ko: '그림자 별', en: 'Shadowed Star', ja: '影付き星', 'zh-hans': '带阴影的星', 'zh-hant': '帶陰影的星', es: 'Estrella con sombra', fr: 'Étoile ombrée', de: 'Schattierter Stern' }, category: 'star' },
  { id: 'sym-s9', char: '✰', name: { ko: '외곽선 별', en: 'Shadowed White Star', ja: '袋文字の星', 'zh-hans': '立体轮廓星', 'zh-hant': '立體輪廓星', es: 'Estrella contorneada', fr: 'Étoile détourée', de: 'Umrandeter Stern' }, category: 'star' },
  { id: 'sym-s10', char: '✶', name: { ko: '여섯 갈래 별', en: 'Six Pointed Star', ja: '六光星', 'zh-hans': '六芒闪星', 'zh-hant': '六芒閃星', es: 'Estrella de seis puntas', fr: 'Étoile à 6 branches', de: 'Sechszackiger Stern' }, category: 'star' },

  // --- FLOWERS ---
  { id: 'sym-f1', char: '✿', name: { ko: '검은 꽃', en: 'Black Florette', ja: '黒い小花', 'zh-hans': '黑色花朵', 'zh-hant': '黑色花朵', es: 'Flor negra', fr: 'Fleur noire', de: 'Schwarze Blüte' }, category: 'flower' },
  { id: 'sym-f2', char: '❀', name: { ko: '하얀 꽃', en: 'White Florette', ja: '白い小花', 'zh-hans': '白色花朵', 'zh-hant': '白色花朵', es: 'Flor blanca', fr: 'Fleur blanche', de: 'Weiße Blüte' }, category: 'flower' },
  { id: 'sym-f3', char: '❁', name: { ko: '여덟 잎 꽃', en: 'Eight Petalled Outlined Florette', ja: '八弁の小花', 'zh-hans': '八瓣花朵', 'zh-hant': '八瓣花朵', es: 'Flor de ocho pétalos', fr: 'Fleur à 8 pétales', de: 'Achtblättrige Blüte' }, category: 'flower' },
  { id: 'sym-f4', char: '✾', name: { ko: '여섯 잎 꽃', en: 'Six Petalled Florette', ja: '六弁の小花', 'zh-hans': '六瓣花朵', 'zh-hant': '六瓣花朵', es: 'Flor de seis pétalos', fr: 'Fleur à 6 pétales', de: 'Sechsblättrige Blüte' }, category: 'flower' },
  { id: 'sym-f5', char: '✽', name: { ko: '눈꽃 무늬', en: 'Snowflake Florette', ja: 'スノーフレーク花', 'zh-hans': '雪花花饰', 'zh-hant': '雪花花飾', es: 'Copo floral', fr: 'Flocon floral', de: 'Schneeflockenblume' }, category: 'flower' },
  { id: 'sym-f6', char: 'ꕤ', name: { ko: '바이 문자 꽃', en: 'Vai Syllable Flower', ja: 'ヴァイ文字花', 'zh-hans': '瓦伊花纹', 'zh-hant': '瓦伊花紋', es: 'Flor silábica Vai', fr: 'Fleur Vai', de: 'Vai-Blumensymbol' }, category: 'flower' },
  { id: 'sym-f7', char: 'ꕥ', name: { ko: '바이 큰 꽃', en: 'Vai Large Flower', ja: 'ヴァイ大輪花', 'zh-hans': '瓦伊大花朵', 'zh-hant': '瓦伊大花朵', es: 'Flor grande Vai', fr: 'Grande fleur Vai', de: 'Große Vai-Blüte' }, category: 'flower' },
  { id: 'sym-f8', char: '𖧷', name: { ko: '감성 꽃 기호', en: 'Aesthetic Flower Bloom', ja: 'エステティック花', 'zh-hans': '唯美小花', 'zh-hant': '唯美小花', es: 'Flor estética', fr: 'Fleur douce', de: 'Zarte Blüte' }, category: 'flower' },

  // --- ARROWS ---
  { id: 'sym-a1', char: '→', name: { ko: '오른쪽 화살표', en: 'Right Arrow', ja: '右矢印', 'zh-hans': '右箭头', 'zh-hant': '右箭頭', es: 'Flecha derecha', fr: 'Flèche droite', de: 'Pfeil rechts' }, category: 'arrow' },
  { id: 'sym-a2', char: '←', name: { ko: '왼쪽 화살표', en: 'Left Arrow', ja: '左矢印', 'zh-hans': '左箭头', 'zh-hant': '左箭頭', es: 'Flecha izquierda', fr: 'Flèche gauche', de: 'Pfeil links' }, category: 'arrow' },
  { id: 'sym-a3', char: '↑', name: { ko: '위쪽 화살표', en: 'Up Arrow', ja: '上矢印', 'zh-hans': '上箭头', 'zh-hant': '上箭頭', es: 'Flecha arriba', fr: 'Flèche haut', de: 'Pfeil oben' }, category: 'arrow' },
  { id: 'sym-a4', char: '↓', name: { ko: '아래쪽 화살표', en: 'Down Arrow', ja: '下矢印', 'zh-hans': '下箭头', 'zh-hant': '下箭頭', es: 'Flecha abajo', fr: 'Flèche bas', de: 'Pfeil unten' }, category: 'arrow' },
  { id: 'sym-a5', char: '↔', name: { ko: '좌우 양방향 화살표', en: 'Left Right Arrow', ja: '左右両方向矢印', 'zh-hans': '左右箭头', 'zh-hant': '左右箭頭', es: 'Flecha horizontal', fr: 'Flèche bidirectionnelle', de: 'Doppelpfeil horizontal' }, category: 'arrow' },
  { id: 'sym-a6', char: '↗', name: { ko: '오른쪽 위 화살표', en: 'North East Arrow', ja: '右上矢印', 'zh-hans': '右上箭头', 'zh-hant': '右上箭頭', es: 'Flecha diagonal arriba derecha', fr: 'Flèche haut-droite', de: 'Pfeil oben-rechts' }, category: 'arrow' },
  { id: 'sym-a7', char: '➔', name: { ko: '굵은 오른쪽 화살표', en: 'Heavy Right Arrow', ja: '太い右矢印', 'zh-hans': '加粗右箭头', 'zh-hant': '加粗右箭頭', es: 'Flecha derecha gruesa', fr: 'Flèche droite grasse', de: 'Dicker Pfeil rechts' }, category: 'arrow' },
  { id: 'sym-a8', char: '➤', name: { ko: '화살촉 화살표', en: 'Arrowhead Right', ja: '矢尻右矢印', 'zh-hans': '箭头尾形', 'zh-hant': '箭頭尾形', es: 'Punta de flecha derecha', fr: 'Pointe de flèche', de: 'Pfeilspitze' }, category: 'arrow' },
  { id: 'sym-a9', char: '⇄', name: { ko: '교차 화살표', en: 'Rightwards Arrow Over Leftwards', ja: '交差矢印', 'zh-hans': '交换箭头', 'zh-hant': '交換箭頭', es: 'Flechas opuestas', fr: 'Flèches superposées', de: 'Gegenläufige Pfeile' }, category: 'arrow' },

  // --- MATH ---
  { id: 'sym-m1', char: '±', name: { ko: '플러스 마이너스', en: 'Plus-Minus Sign', ja: 'プラスマイナス', 'zh-hans': '正负号', 'zh-hant': '正負號', es: 'Más o menos', fr: 'Plus ou moins', de: 'Plusminus' }, category: 'math' },
  { id: 'sym-m2', char: '×', name: { ko: '곱하기', en: 'Multiplication Sign', ja: '掛ける', 'zh-hans': '乘号', 'zh-hant': '乘號', es: 'Signo de multiplicación', fr: 'Signe multiplier', de: 'Malzeichen' }, category: 'math' },
  { id: 'sym-m3', char: '÷', name: { ko: '나누기', en: 'Division Sign', ja: '割る', 'zh-hans': '除号', 'zh-hant': '除號', es: 'Signo de división', fr: 'Signe diviser', de: 'Geteiltzeichen' }, category: 'math' },
  { id: 'sym-m4', char: '≈', name: { ko: '거의 같음 (근사치)', en: 'Almost Equal To', ja: 'ニアリーイコール', 'zh-hans': '约等于', 'zh-hant': '約等於', es: 'Aproximadamente igual', fr: 'Presque égal', de: 'Ungefähr gleich' }, category: 'math' },
  { id: 'sym-m5', char: '≠', name: { ko: '같지 않음', en: 'Not Equal To', ja: '等しくない', 'zh-hans': '不等于', 'zh-hant': '不等於', es: 'No igual a', fr: 'Différent de', de: 'Ungleich' }, category: 'math' },
  { id: 'sym-m6', char: '≤', name: { ko: '작거나 같음', en: 'Less-Than or Equal To', ja: '小なりイコール', 'zh-hans': '小于等于', 'zh-hant': '小於等於', es: 'Menor o igual', fr: 'Inférieur ou égal', de: 'Kleiner gleich' }, category: 'math' },
  { id: 'sym-m7', char: '≥', name: { ko: '크거나 같음', en: 'Greater-Than or Equal To', ja: '大なりイコール', 'zh-hans': '大于等于', 'zh-hant': '大於等於', es: 'Mayor o igual', fr: 'Supérieur ou égal', de: 'Größer gleich' }, category: 'math' },
  { id: 'sym-m8', char: '∞', name: { ko: '무한대', en: 'Infinity', ja: '無限大', 'zh-hans': '无穷大', 'zh-hant': '無窮大', es: 'Infinito', fr: 'Infini', de: 'Unendlich' }, category: 'math' },
  { id: 'sym-m9', char: '√', name: { ko: '루트 (제곱근)', en: 'Square Root', ja: '平方根', 'zh-hans': '平方根', 'zh-hant': '平方根', es: 'Raíz cuadrada', fr: 'Racine carrée', de: 'Quadratwurzel' }, category: 'math' },
  { id: 'sym-m10', char: '∑', name: { ko: '시그마 (총합)', en: 'N-Ary Summation', ja: '総和記号', 'zh-hans': '求和符号', 'zh-hant': '求和符號', es: 'Sumatorio', fr: 'Somme', de: 'Summenzeichen' }, category: 'math' },

  // --- BRACKETS ---
  { id: 'sym-b1', char: '【 】', name: { ko: '굵은 네모 괄호', en: 'Black Lenticular Brackets', ja: '隅付き括弧', 'zh-hans': '黑方头括号', 'zh-hant': '黑方頭括號', es: 'Corchetes lenticulares negros', fr: 'Crochets lenticulaires pleins', de: 'Schwarze eckige Klammern' }, category: 'bracket' },
  { id: 'sym-b2', char: '『 』', name: { ko: '이중 낫표', en: 'White Corner Brackets', ja: '二重鍵括弧', 'zh-hans': '双书名号', 'zh-hant': '雙引號', es: 'Comillas de esquina dobles', fr: 'Guillemets japonais doubles', de: 'Doppelte Eckklammern' }, category: 'bracket' },
  { id: 'sym-b3', char: '「 」', name: { ko: '단일 낫표', en: 'Corner Brackets', ja: '鍵括弧', 'zh-hans': '单书名号', 'zh-hant': '單引號', es: 'Comillas de esquina simples', fr: 'Guillemets japonais simples', de: 'Einfache Eckklammern' }, category: 'bracket' },
  { id: 'sym-b4', char: '《 》', name: { ko: '이중 꺾쇠 괄호', en: 'Double Angle Brackets', ja: '二重山括弧', 'zh-hans': '书名号', 'zh-hant': '書名號', es: 'Paréntesis angulares dobles', fr: 'Chevrons doubles', de: 'Doppelte spitze Klammern' }, category: 'bracket' },
  { id: 'sym-b5', char: '〈 〉', name: { ko: '단일 꺾쇠 괄호', en: 'Single Angle Brackets', ja: '山括弧', 'zh-hans': '单书名号角', 'zh-hant': '單書名號角', es: 'Paréntesis angulares simples', fr: 'Chevrons simples', de: 'Einfache spitze Klammern' }, category: 'bracket' },
  { id: 'sym-b6', char: '〔 〕', name: { ko: '거북이 등딱지 괄호', en: 'Tortoise Shell Brackets', ja: '亀甲括弧', 'zh-hans': '六角括号', 'zh-hant': '六角括號', es: 'Corchetes caparazón de tortuga', fr: 'Parenthèses carapace de tortue', de: 'Schildkrötenklammern' }, category: 'bracket' },

  // --- DECORATIONS ---
  { id: 'sym-d1', char: '༺ ༻', name: { ko: '티베트 장식 날개', en: 'Tibetan Ornaments', ja: 'チベット装飾', 'zh-hans': '藏式装饰翼', 'zh-hant': '藏式裝飾翼', es: 'Adorno tibetano', fr: 'Ornements tibétains', de: 'Tibetische Verzierungen' }, category: 'decorations' },
  { id: 'sym-d2', char: '꧁ ꧂', name: { ko: '자바 꽃잎 장식', en: 'Javanese Left/Right Swash', ja: 'ジャワ文字装飾', 'zh-hans': '爪哇花体装饰', 'zh-hant': '爪哇花體裝飾', es: 'Florituras javanesas', fr: 'Fioritures javanaises', de: 'Javanische Schwünge' }, category: 'decorations' },
  { id: 'sym-d3', char: '⋆｡°✩', name: { ko: '밤하늘 별무리', en: 'Night Sky Star Dust', ja: '夜空の星屑', 'zh-hans': '星空碎钻', 'zh-hant': '星空碎鑽', es: 'Polvo de estrellas', fr: 'Poussière d’étoiles', de: 'Sternenstaub' }, category: 'decorations' },
  { id: 'sym-d4', char: 'ੈ✩‧₊˚', name: { ko: '감성 유성 효과', en: 'Shooting Star Wave', ja: '流れ星ウェーブ', 'zh-hans': '流星波浪', 'zh-hant': '流星波浪', es: 'Ola de estrella fugaz', fr: 'Onde d’étoile filante', de: 'Sternschnuppenwelle' }, category: 'decorations' },
  { id: 'sym-d5', char: '♬', name: { ko: '연결된 16분 음표', en: 'Sixteenth Notes', ja: '連桁付き16分音符', 'zh-hans': '双十六分音符', 'zh-hant': '雙十六分音符', es: 'Notas musicales unidas', fr: 'Doubles croches reliées', de: 'Verbundene Sechzehntelnoten' }, category: 'decorations' },
  { id: 'sym-d6', char: '♪', name: { ko: '8분 음표', en: 'Eighth Note', ja: '8分音符', 'zh-hans': '八分音符', 'zh-hant': '八分音符', es: 'Corchea', fr: 'Croche', de: 'Achtelnote' }, category: 'decorations' },
  { id: 'sym-d7', char: '♨', name: { ko: '온천 기호', en: 'Hot Springs', ja: '温泉マーク', 'zh-hans': '温泉标志', 'zh-hant': '溫泉標誌', es: 'Aguas termales', fr: 'Sources chaudes', de: 'Heiße Quellen' }, category: 'decorations' },
  { id: 'sym-d8', char: '☯', name: { ko: '음양 태극', en: 'Yin Yang', ja: '陰陽 (太極)', 'zh-hans': '阴阳太极', 'zh-hant': '陰陽太極', es: 'Yin Yang', fr: 'Yin et Yang', de: 'Yin und Yang' }, category: 'decorations' },
];
