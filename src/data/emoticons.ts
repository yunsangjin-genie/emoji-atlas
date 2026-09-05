import { EmoticonItem } from '../types';

export const EMOTICONS: EmoticonItem[] = [
  // --- CUTE ---
  { id: 'emo-c1', text: '(｡♥‿♥｡)', name: { ko: '하트 뿅뿅', en: 'Heart Eyes Hug', ja: 'ハートの瞳', 'zh-hans': '眼冒爱心', 'zh-hant': '眼冒愛心', es: 'Ojos de corazón', fr: 'Yeux en cœur', de: 'Herzaugen' }, category: 'cute' },
  { id: 'emo-c2', text: '(づ｡◕‿‿◕｡)づ', name: { ko: '포옹해주기', en: 'Give me a hug', ja: 'ぎゅーっと抱っこ', 'zh-hans': '求抱抱', 'zh-hant': '求抱抱', es: 'Abrazo tierno', fr: 'Câlin tout doux', de: 'Kuschelige Umarmung' }, category: 'cute' },
  { id: 'emo-c3', text: '(✿◠‿◠)', name: { ko: '꽃미소', en: 'Flower smile', ja: 'お花スマイル', 'zh-hans': '鲜花微笑', 'zh-hant': '鮮花微笑', es: 'Sonrisa con flor', fr: 'Sourire fleuri', de: 'Blumenlächeln' }, category: 'cute' },
  { id: 'emo-c4', text: '(´｡• ᵕ •｡`)', name: { ko: '순수한 볼터치', en: 'Soft blush', ja: 'ほんのり照れ笑い', 'zh-hans': '害羞脸红', 'zh-hant': '害羞臉紅', es: 'Rubor suave', fr: 'Rougeur timide', de: 'Sanftes Erröten' }, category: 'cute' },
  { id: 'emo-c5', text: '(๑>ᴗ<๑)', name: { ko: '깜찍한 윙크', en: 'Playful wink', ja: 'ウインク笑顔', 'zh-hans': '调皮眨眼', 'zh-hant': '調皮眨眼', es: 'Guiño juguetón', fr: 'Clin d’œil mignon', de: 'Freches Zwinkern' }, category: 'cute' },
  { id: 'emo-c6', text: '(◍•ᴗ•◍)', name: { ko: '방긋방긋', en: 'Cheerful babyface', ja: 'にっこり', 'zh-hans': '笑盈盈', 'zh-hant': '笑盈盈', es: 'Cara risueña', fr: 'Sourire radieux', de: 'Strahlemann' }, category: 'cute' },

  // --- FUNNY ---
  { id: 'emo-f1', text: '¯\\_(ツ)_/¯', name: { ko: '어쩔티비 (어깨 으쓱)', en: 'Shrug', ja: '肩をすくめる', 'zh-hans': '耸肩 (怪我咯)', 'zh-hant': '聳肩 (怪我囉)', es: 'Encogimiento de hombros', fr: 'Haussement d’épaules', de: 'Achselzucken' }, category: 'funny' },
  { id: 'emo-f2', text: '( ͡° ͜ʖ ͡°)', name: { ko: '음흉한 레니 페이스', en: 'Lenny face', ja: 'レニーフェイス (ニヤリ)', 'zh-hans': '滑稽脸 (Lenny)', 'zh-hant': '滑稽臉 (Lenny)', es: 'Cara de pillo', fr: 'Visage malicieux', de: 'Schelmisches Grinsen' }, category: 'funny' },
  { id: 'emo-f3', text: '(╯°□°）╯︵ ┻━┻', name: { ko: '밥상 뒤엎기', en: 'Table flip', ja: 'ちゃぶ台返し', 'zh-hans': '掀桌狂暴', 'zh-hant': '掀桌狂暴', es: 'Lanzar mesa', fr: 'Renverser la table', de: 'Tisch umwerfen' }, category: 'funny' },
  { id: 'emo-f4', text: '┬─┬ノ( º _ ºノ)', name: { ko: '조용히 상 내려놓기', en: 'Put table back', ja: 'ちゃぶ台を戻す', 'zh-hans': '默默放好桌子', 'zh-hant': '默默放好桌子', es: 'Colocar la mesa', fr: 'Remettre la table', de: 'Tisch hinstellen' }, category: 'funny' },
  { id: 'emo-f5', text: '( ﾟдﾟ)', name: { ko: '충격과 공포', en: 'Stunned shock', ja: '愕然・ポカン', 'zh-hans': '目瞪口呆', 'zh-hant': '目瞪口呆', es: 'Atónito y boquiabierto', fr: 'Ébahi sous le choc', de: 'Fassungslos' }, category: 'funny' },

  // --- LOVE ---
  { id: 'emo-l1', text: '(♡´▽`♡)', name: { ko: '사랑에 빠진 미소', en: 'Blissful love', ja: '愛に満ちた笑顔', 'zh-hans': '沉浸爱河', 'zh-hant': '沉浸愛河', es: 'Enamorado feliz', fr: 'Amour comblé', de: 'Glücklich verliebt' }, category: 'love' },
  { id: 'emo-l2', text: '( ˘ ³˘)♥', name: { ko: '입술 쪽 (뽀뽀)', en: 'Kiss with heart', ja: 'チュッ(投げキッス)', 'zh-hans': '亲亲飞吻', 'zh-hant': '親親飛吻', es: 'Beso con amor', fr: 'Bisou cœur', de: 'Küsschen mit Herz' }, category: 'love' },
  { id: 'emo-l3', text: '(っ˘з(˘⌣˘ )', name: { ko: '다정한 포옹과 키스', en: 'Sweet couple kiss', ja: '恋人同士のキス', 'zh-hans': '依偎接吻', 'zh-hant': '依偎接吻', es: 'Beso en pareja', fr: 'Baiser tendre', de: 'Zärtlicher Kuss' }, category: 'love' },
  { id: 'emo-l4', text: '(⁄ ⁄•⁄ω⁄•⁄ ⁄)', name: { ko: '부끄부끄 홍조', en: 'Super flushed', ja: '真っ赤になって照れる', 'zh-hans': '羞红了脸', 'zh-hant': '羞紅了臉', es: 'Muy sonrojado', fr: 'Très rouge de pudeur', de: 'Tiefrot errötet' }, category: 'love' },

  // --- ANGRY ---
  { id: 'emo-a1', text: '(╬ Ò ‸ Ó)', name: { ko: '분노 폭발', en: 'Furious anger', ja: '激怒マーク', 'zh-hans': '青筋暴起大怒', 'zh-hant': '青筋暴起大怒', es: 'Furia total', fr: 'Fureur explosive', de: 'Wutentbrannt' }, category: 'angry' },
  { id: 'emo-a2', text: '(ノಠ益ಠ)ノ', name: { ko: '분노의 절규', en: 'Rage roar', ja: '怒りの咆哮', 'zh-hans': '狂怒咆哮', 'zh-hant': '狂怒咆哮', es: 'Grito de rabia', fr: 'Hurlement de colère', de: 'Wutschrei' }, category: 'angry' },
  { id: 'emo-a3', text: 'ヽ(`Д´)ﾉ', name: { ko: '발을 동동 구르는 화냄', en: 'Temper tantrum', ja: 'キーッと怒る', 'zh-hans': '气急败坏', 'zh-hant': '氣急敗壞', es: 'Berrinche', fr: 'Crise de colère', de: 'Wutanfall' }, category: 'angry' },

  // --- SAD ---
  { id: 'emo-s1', text: '(｡•́︿•̀｡)', name: { ko: '시무룩한 슬픔', en: 'Downcast and pouty', ja: 'しょんぼり悲しい', 'zh-hans': '委屈难过', 'zh-hant': '委屈難過', es: 'Triste y decaído', fr: 'Triste et abattu', de: 'Niedergeschlagen' }, category: 'sad' },
  { id: 'emo-s2', text: '( Ĭ ^ Ĭ )', name: { ko: '눈물 찔끔', en: 'Tear drop sniffing', ja: 'ぐすん(涙目)', 'zh-hans': '抽泣掉泪', 'zh-hant': '抽泣掉淚', es: 'Lloriqueo', fr: 'Reniflement triste', de: 'Schniefen' }, category: 'sad' },
  { id: 'emo-s3', text: '(╥﹏╥)', name: { ko: '폭풍 눈물', en: 'Streaming tears', ja: '大粒の涙', 'zh-hans': '泪如雨下', 'zh-hant': '淚如雨下', es: 'Ríos de lágrimas', fr: 'Torrent de larmes', de: 'Tränenbach' }, category: 'sad' },
  { id: 'emo-s4', text: '(ಥ﹏ಥ)', name: { ko: '오열하는 슬픔', en: 'Heavy sobbing', ja: '号泣', 'zh-hans': '悲恸痛哭', 'zh-hant': '悲慟痛哭', es: 'Llanto desconsolado', fr: 'Gros sanglots', de: 'Schluchzend' }, category: 'sad' },

  // --- GREETING ---
  { id: 'emo-g1', text: '(・∀・)ノ', name: { ko: '안녕! 반가워', en: 'Friendly hello', ja: 'やあ！こんにちは', 'zh-hans': '你好招手', 'zh-hant': '你好招手', es: 'Hola amigable', fr: 'Coucou sympa', de: 'Hallo und Winken' }, category: 'greeting' },
  { id: 'emo-g2', text: '( ´ ▽ ` )ﾉ', name: { ko: '밝은 손인사', en: 'Sunny wave', ja: '元気に手を振る', 'zh-hans': '活力挥手', 'zh-hant': '活力揮手', es: 'Saludo alegre', fr: 'Salut chaleureux', de: 'Fröhlicher Gruß' }, category: 'greeting' },
  { id: 'emo-g3', text: '＼(＾▽＾)／', name: { ko: '두 팔 벌려 환영', en: 'Open arm welcome', ja: '両手を広げて歓迎', 'zh-hans': '张开双臂欢迎', 'zh-hant': '張開雙臂歡迎', es: 'Bienvenida con brazos abiertos', fr: 'Bienvenue à bras ouverts', de: 'Herzliches Willkommen' }, category: 'greeting' },

  // --- THANKS ---
  { id: 'emo-t1', text: '(人\'v`*)', name: { ko: '두 손 모아 고마워', en: 'Humble thanks', ja: '感謝感激', 'zh-hans': '合十感谢', 'zh-hant': '合十感謝', es: 'Gracias de corazón', fr: 'Merci de tout cœur', de: 'Dankbar die Hände gefaltet' }, category: 'thanks' },
  { id: 'emo-t2', text: 'm(_ _)m', name: { ko: '정중한 넙죽 절 (사과/감사)', en: 'Bowing deeply', ja: '土下座・平伏', 'zh-hans': '躬身致谢', 'zh-hant': '躬身致謝', es: 'Reverencia profunda', fr: 'Salutation respectueuse', de: 'Tiefe Verbeugung' }, category: 'thanks' },
  { id: 'emo-t3', text: '(*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ', name: { ko: '꽃을 든 정중한 감사', en: 'Polite flower gratitude', ja: '丁寧なお辞儀とお花', 'zh-hans': '持花致敬感恩', 'zh-hant': '持花致敬感恩', es: 'Agradecimiento formal con flor', fr: 'Merci raffiné avec fleur', de: 'Höfliche Dankbarkeit' }, category: 'thanks' },

  // --- CHEERING ---
  { id: 'emo-ch1', text: '(๑˃̵ᴗ˂̵)و', name: { ko: '아자아자 화이팅!', en: 'Yes we can! Fist pump', ja: 'よしっ！ガッツポーズ', 'zh-hans': '握拳加油！', 'zh-hant': '握拳加油！', es: '¡Sí se puede! Puño al aire', fr: 'On y va ! Poing levé', de: 'Tschaka! Faustballen' }, category: 'cheering' },
  { id: 'emo-ch2', text: '٩(๑❛ᴗ❛๑)۶', name: { ko: '신나는 만세 응원', en: 'Hooray cheer', ja: 'わーい！応援', 'zh-hans': '欢呼万岁', 'zh-hant': '歡呼萬歲', es: '¡Viva! ¡Ánimo!', fr: 'Hourra ! Encouragement', de: 'Hurra! Jubel' }, category: 'cheering' },
  { id: 'emo-ch3', text: 'ᕦ(ò_óˇ)ᕤ', name: { ko: '알통 불끈 힘내자', en: 'Flexing muscle power', ja: '筋肉モリモリ気合い', 'zh-hans': '秀出肌肉加油', 'zh-hant': '秀出肌肉加油', es: 'Sacando músculo', fr: 'Montrer ses muscles', de: 'Muskeln anspannen' }, category: 'cheering' },
  { id: 'emo-ch4', text: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', name: { ko: '마법의 꽃가루 응원', en: 'Casting magical cheer', ja: '魔法のキラキラ応援', 'zh-hans': '撒出魔法小彩条', 'zh-hant': '撒出魔法小彩條', es: 'Esparciendo polvos mágicos', fr: 'Lancer des paillettes magiques', de: 'Magischen Glanz streuen' }, category: 'cheering' },
];
