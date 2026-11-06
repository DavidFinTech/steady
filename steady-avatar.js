// Draws profile characters from a short code. All artwork is fixed in this file,
// so a code from another person can only ever choose from these parts.
(() => {
  const SKIN = ['#fbe3d0', '#f6d3b5', '#eec39a', '#e0ac7e', '#cf9561', '#b87c4c', '#9c6339', '#7f4d2b', '#623a21', '#472a18'];
  const HAIR_COLORS = ['#17140f', '#3a2618', '#5e3c21', '#8a4a22', '#b5752f', '#dfb765', '#8d8f94', '#e8e6e1', '#2f6f9f', '#c75b86', '#3f8f70', '#6d55a8'];
  const EYE_COLORS = ['#2b1d14', '#5a3a1e', '#3f6b8c', '#3f7a5c', '#6b6f75'];
  const CLOTH = ['#185079', '#27658a', '#4f9a7c', '#275c49', '#c9503f', '#e29a3c', '#7a5aa6', '#2b2f36', '#f4f1ea', '#d9769a'];
  const CARDS = ['#e6f5fb', '#e6f0ea', '#f7ecd9', '#f8e2dd', '#ebe5f6', '#fbe7ef', '#dceaf3', '#cfe6da', '#185079', '#275c49'];
  const WORK = [{ label: 'None' }, { label: 'Delivery' }, { label: 'Rideshare' }, { label: 'Freelance' }, { label: 'Caregiving' }, { label: 'Trades' }, { label: 'Creative work' }];
  const HEADWEAR = [{ label: 'None' }, { label: 'Cap' }, { label: 'Beanie' }, { label: 'Hijab' }, { label: 'Turban' }, { label: 'Kufi' }, { label: 'Bike helmet' }, { label: 'Bandana' }, { label: 'Hard hat' }];

  const shade = (hex, amount) => {
    const n = parseInt(hex.slice(1), 16);
    const part = shift => Math.max(0, Math.min(255, Math.round(((n >> shift) & 255) * (1 + amount))));
    return `rgb(${part(16)},${part(8)},${part(0)})`;
  };

  const FACES = [
    '<ellipse cx="100" cy="92" rx="46" ry="50"/>',
    '<ellipse cx="100" cy="92" rx="41" ry="53"/>',
    '<rect x="57" y="42" width="86" height="100" rx="34"/>',
    '<path d="M55 80C55 52 76 41 100 41S145 52 145 80C145 112 122 141 100 143C78 141 55 112 55 80Z"/>',
    '<path d="M54 78C54 52 76 42 100 42S146 52 146 78C146 92 150 112 136 128C124 141 112 143 100 143S76 141 64 128C50 112 54 92 54 78Z"/>',
    '<path d="M58 76C58 52 78 41 100 41S142 52 142 76C142 100 136 116 124 130C114 141 108 143 100 143S86 141 76 130C64 116 58 100 58 76Z"/>'
  ];

  const CROP = 'M54 86C48 44 74 30 100 30S152 44 146 86C142 68 130 58 100 58S58 68 54 86Z';
  const CENTER_PART = 'M54 90C50 46 76 32 100 32C124 32 150 46 146 90C140 70 120 56 100 46C80 56 60 70 54 90Z';
  const curls = (points, color) => points.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join('');
  const path = (d, color, extra = '') => `<path d="${d}" fill="${color}" ${extra}/>`;
  const strand = (x1, y1, x2, y2, width, color) => `<path d="M${x1} ${y1}C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
  const HAIR = [
    { back: () => '', front: () => '' },
    { back: () => '', front: c => path(CROP, c) },
    { back: () => '', front: c => path('M54 88C46 42 76 28 104 30C134 30 154 48 146 88C142 72 134 62 122 56C100 66 72 62 62 66C58 72 56 80 54 88Z', c) },
    { back: c => `<circle cx="100" cy="72" r="64" fill="${c}"/>`, front: c => path('M56 80C58 60 78 52 100 52S142 60 144 80C152 46 128 34 100 34S48 46 56 80Z', c) },
    { back: c => curls([[58, 58, 18], [76, 40, 20], [100, 32, 22], [124, 40, 20], [142, 58, 18], [48, 78, 14], [152, 78, 14]], c),
      front: c => curls([[68, 56, 13], [86, 48, 13], [104, 46, 14], [122, 50, 13], [136, 62, 11], [58, 68, 9]], c) },
    { back: c => path('M48 80C44 36 74 26 100 26S156 36 152 80L158 168C140 176 60 176 42 168Z', c), front: c => path(CENTER_PART, c) },
    { back: c => path('M46 84C42 38 74 26 100 26S158 38 154 84C156 110 152 128 140 136H60C48 128 44 110 46 84Z', c), front: c => path('M54 84C50 44 76 32 100 32S150 44 146 84C132 70 70 70 54 84Z', c) },
    { back: c => path('M146 58C180 62 188 112 170 146C162 122 158 98 140 84Z', c), front: c => path(CROP, c) },
    { back: c => `<circle cx="100" cy="24" r="20" fill="${c}"/>`, front: c => path(CENTER_PART, c) },
    { back: () => '', front: c => path('M56 78C54 48 76 38 100 38S146 48 144 78C136 60 122 52 100 52S64 60 56 78Z', c, 'opacity=".62"') },
    { back: () => '', front: c => path('M56 80V34C56 26 64 20 72 20H128C136 20 144 26 144 34V80C138 66 126 58 100 58S62 66 56 80Z', c) },
    { back: c => [50, 150].map(x => strand(x, 70, x + (x < 100 ? -6 : 6), 166, 13, c) + `<circle cx="${x + (x < 100 ? -6 : 6)}" cy="172" r="7" fill="${shade(c, .35)}"/>`).join(''), front: c => path(CENTER_PART, c) },
    { back: c => [52, 66, 134, 148].map((x, i) => strand(x, 62, x + (i < 2 ? -6 : 6), 160 - (i % 2) * 14, 10, c)).join(''), front: c => path(CROP, c) + [72, 92, 112, 130].map(x => strand(x, 36, x, 58, 9, c)).join('') },
    { back: () => '', front: c => path('M54 86C50 52 66 40 78 38C84 20 130 14 146 32C154 42 150 66 146 86C142 70 134 60 116 58C96 64 70 62 62 68C58 74 56 80 54 86Z', c) }
  ];

  const pair = (gap, draw) => draw(-gap, -1) + draw(gap, 1);
  const EYES = [
    (gap, c) => pair(gap, x => `<ellipse cx="${x}" cy="0" rx="5.5" ry="6.5" fill="${c}"/><circle cx="${x + 1.8}" cy="-2.2" r="1.7" fill="#fff"/>`),
    (gap, c) => pair(gap, x => `<ellipse cx="${x}" cy="0" rx="9" ry="7.5" fill="#fff"/><circle cx="${x}" cy="0" r="5" fill="${c}"/><circle cx="${x + 1.6}" cy="-1.8" r="1.5" fill="#fff"/>`),
    (gap, c) => pair(gap, x => `<path d="M${x - 8} 3C${x - 4} -6 ${x + 4} -6 ${x + 8} 3" stroke="${c}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`),
    (gap, c) => pair(gap, (x, side) => `<path d="M${x - 10 * side} 2C${x - 5 * side} -7 ${x + 5 * side} -7 ${x + 10 * side} -2C${x + 4 * side} 5 ${x - 4 * side} 6 ${x - 10 * side} 2Z" fill="#fff" stroke="#2b1d14" stroke-width="1.6"/><circle cx="${x}" cy="-0.6" r="4.2" fill="${c}"/>`),
    (gap, c) => pair(gap, (x, side) => `<ellipse cx="${x}" cy="0" rx="6" ry="7" fill="${c}"/><circle cx="${x + 1.8}" cy="-2.4" r="1.8" fill="#fff"/><path d="M${x - 7 * side} -5C${x} -11 ${x + 6 * side} -9 ${x + 11 * side} -9" stroke="#2b1d14" stroke-width="2.4" stroke-linecap="round" fill="none"/>`),
    (gap, c) => pair(gap, x => `<path d="M${x - 9} -1H${x + 9}C${x + 8} 7 ${x - 8} 7 ${x - 9} -1Z" fill="#fff" stroke="#2b1d14" stroke-width="1.4"/><circle cx="${x}" cy="2" r="3.2" fill="${c}"/>`),
    (gap, c) => `<ellipse cx="${-gap}" cy="0" rx="5.5" ry="6.5" fill="${c}"/><circle cx="${-gap + 1.8}" cy="-2.2" r="1.7" fill="#fff"/><path d="M${gap - 8} 2C${gap - 4} -5 ${gap + 4} -5 ${gap + 8} 2" stroke="${c}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`,
    (gap, c) => pair(gap, x => `<circle cx="${x}" cy="0" r="7" fill="${c}"/><circle cx="${x + 2.4}" cy="-2.6" r="2.4" fill="#fff"/><circle cx="${x - 2.4}" cy="2.4" r="1.2" fill="#fff"/>`)
  ];
  const BROWS = [
    () => '',
    (gap, c) => pair(gap, x => `<path d="M${x - 10} 2C${x - 4} -4 ${x + 4} -4 ${x + 10} 2" stroke="${c}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`),
    (gap, c) => pair(gap, x => `<path d="M${x - 10} 0H${x + 10}" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`),
    (gap, c) => pair(gap, x => `<path d="M${x - 11} 1C${x - 4} -5 ${x + 4} -5 ${x + 11} 1" stroke="${c}" stroke-width="6" stroke-linecap="round" fill="none"/>`),
    (gap, c) => pair(gap, x => `<path d="M${x - 8} -3C${x - 3} -8 ${x + 3} -8 ${x + 8} -3" stroke="${c}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`),
    (gap, c) => pair(gap, (x, side) => `<path d="M${x - 10 * side} 3L${x + 10 * side} -3" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/>`)
  ];
  const NOSES = [
    c => `<path d="M-1 -7C-3 -1 -5 3 -2 5" stroke="${c}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`,
    c => `<ellipse cx="0" cy="2" rx="4" ry="3" fill="${c}"/>`,
    c => `<path d="M-7 3C-7 -2 -3 -3 0 -3S7 -2 7 3C5 6 -5 6 -7 3Z" fill="${c}"/>`,
    c => `<path d="M0 -8L-6 4H6Z" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`,
    c => `<path d="M-6 4C-3 7 3 7 6 4" stroke="${c}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`,
    c => `<circle cx="-3.5" cy="2" r="1.6" fill="${c}"/><circle cx="3.5" cy="2" r="1.6" fill="${c}"/>`
  ];
  const INK = '#7a2e2a';
  const MOUTHS = [
    () => `<path d="M-13 -2C-7 7 7 7 13 -2" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`,
    () => `<path d="M-15 -4H15C13 12 -13 12 -15 -4Z" fill="${INK}"/><path d="M-13 -4H13L11 1H-11Z" fill="#fff"/>`,
    () => `<ellipse cx="0" cy="1" rx="5" ry="6" fill="${INK}"/>`,
    () => `<path d="M-10 1H10" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`,
    () => `<path d="M-11 2C-3 4 7 3 13 -4" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`,
    () => `<path d="M-14 -3H14C14 16 -14 16 -14 -3Z" fill="${INK}"/><ellipse cx="0" cy="8" rx="7" ry="4" fill="#e77f7f"/>`,
    () => `<path d="M-6 0C-3 3 3 3 6 0" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    () => `<path d="M-12 -1C-6 -4 -2 -3 0 -2C2 -3 6 -4 12 -1C8 8 -8 8 -12 -1Z" fill="#c8605f"/>`
  ];
  const BEARDS = [
    () => '',
    c => path('M60 108C66 134 84 143 100 143S134 134 140 108C136 122 122 130 100 130S64 122 60 108Z', c, 'opacity=".32"'),
    c => path('M78 113C84 106 94 106 100 110C106 106 116 106 122 113C114 113 106 115 100 115S86 113 78 113Z', c),
    c => path('M86 128C90 124 110 124 114 128C114 138 108 145 100 145S86 138 86 128Z', c),
    c => path('M56 96C56 128 76 148 100 148S144 128 144 96C138 108 130 112 118 110C110 106 90 106 82 110C70 112 62 108 56 96ZM88 118C94 122 106 122 112 118C110 128 90 128 88 118Z', c, 'fill-rule="evenodd"'),
    c => path('M64 116C70 136 84 146 100 146S130 136 136 116C126 124 114 122 100 122S74 124 64 116Z', c),
  ];
  const lens = (gap, draw) => draw(100 - gap) + draw(100 + gap);
  const GLASSES = [
    () => '',
    (gap, y) => { const s = 'stroke="#2b2f36" stroke-width="2.6" fill="#fff" fill-opacity=".14"'; return lens(gap, x => `<circle cx="${x}" cy="${y}" r="12.5" ${s}/>`) + `<path d="M${100 - gap + 12} ${y}H${100 + gap - 12}" stroke="#2b2f36" stroke-width="2.6"/>`; },
    (gap, y) => { const s = 'stroke="#2b2f36" stroke-width="2.8" fill="#fff" fill-opacity=".14"'; return lens(gap, x => `<rect x="${x - 13}" y="${y - 9}" width="26" height="18" rx="4" ${s}/>`) + `<path d="M${100 - gap + 13} ${y}H${100 + gap - 13}" stroke="#2b2f36" stroke-width="2.8"/>`; },
    (gap, y) => { const color = '#b0413e'; return [-1, 1].map(side => { const x = 100 + side * gap; return `<path d="M${x - 13 * side} ${y - 3}L${x + 14 * side} ${y - 10}C${x + 15 * side} ${y + 4} ${x + 6 * side} ${y + 10} ${x - 2 * side} ${y + 9}C${x - 10 * side} ${y + 9} ${x - 13 * side} ${y + 3} ${x - 13 * side} ${y - 3}Z" stroke="${color}" stroke-width="2.8" fill="#fff" fill-opacity=".14"/>`; }).join('') + `<path d="M${100 - gap + 13} ${y - 2}H${100 + gap - 13}" stroke="${color}" stroke-width="2.8"/>`; },
    (gap, y) => lens(gap, x => `<rect x="${x - 14}" y="${y - 9}" width="28" height="19" rx="8" fill="#20252b"/>`) + `<path d="M${100 - gap + 14} ${y - 2}H${100 + gap - 14}" stroke="#20252b" stroke-width="3.2"/>`,
    (gap, y) => { const s = 'stroke="#a98a47" stroke-width="2.2" fill="#6f8ba0" fill-opacity=".3"'; return lens(gap, x => `<path d="M${x - 13} ${y - 8}H${x + 13}C${x + 15} ${y + 2} ${x + 8} ${y + 12} ${x} ${y + 11}C${x - 8} ${y + 12} ${x - 15} ${y + 2} ${x - 13} ${y - 8}Z" ${s}/>`) + `<path d="M${100 - gap + 13} ${y - 6}H${100 + gap - 13}" stroke="#a98a47" stroke-width="2.2"/>`; }
  ];

  const HIJAB_OUTER = 'M100 26C56 26 42 62 42 96C42 130 50 150 30 178C68 198 132 198 170 178C150 150 158 130 158 96C158 62 144 26 100 26Z';
  const HIJAB_FACE = 'M100 50C78 50 63 68 63 94C63 122 78 139 100 139S137 122 137 94C137 68 122 50 100 50Z';
  const HEADS = [
    { draw: () => '' },
    { draw: c => path('M52 72C52 38 76 26 100 26S148 38 148 72Z', c) + `<path d="M46 72H154C166 72 170 80 160 83H40C30 80 34 72 46 72Z" fill="${shade(c, -.22)}"/><circle cx="100" cy="27" r="4" fill="${shade(c, -.22)}"/>` },
    { draw: c => path('M50 74C48 36 74 22 100 22S152 36 150 74Z', c) + `<rect x="46" y="64" width="108" height="20" rx="8" fill="${shade(c, -.2)}"/>` + [66, 84, 100, 116, 134].map(x => `<path d="M${x} 66V82" stroke="${shade(c, -.36)}" stroke-width="2"/>`).join('') },
    { hideHair: true, draw: c => path(`${HIJAB_OUTER}${HIJAB_FACE}`, c, 'fill-rule="evenodd"') + `<path d="M66 128C80 156 120 160 150 148" stroke="${shade(c, -.2)}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M54 150C76 176 120 180 150 168" stroke="${shade(c, -.2)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
    { hideFront: true, draw: c => path('M50 72C42 36 72 18 104 18C136 18 158 40 150 72C136 62 66 62 50 72Z', c) + `<path d="M56 62C78 34 118 26 144 44M62 42C86 26 112 22 132 28M118 60C104 44 84 34 66 34" stroke="${shade(c, -.24)}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
    { hideFront: true, draw: c => path('M54 66C54 42 76 34 100 34S146 42 146 66C146 72 54 72 54 66Z', c) + `<path d="M56 62H144" stroke="${shade(c, -.2)}" stroke-width="3" stroke-dasharray="3 5"/>` },
    { draw: c => path('M46 76C42 36 72 20 100 20S158 36 154 76C154 82 46 82 46 76Z', c) + [72, 92, 112, 130].map(x => `<path d="M${x} 30L${x + (x - 100) * .12} 62" stroke="#20252b" stroke-width="5" stroke-linecap="round"/>`).join('') + '<path d="M58 80C60 112 72 136 88 146M142 80C140 112 128 136 112 146" stroke="#20252b" stroke-width="2.6" fill="none"/>' },
    { draw: c => path('M52 76C50 42 74 30 100 30S150 42 148 76C134 66 66 66 52 76Z', c) + `<path d="M146 62L170 52L164 72L172 88L146 76Z" fill="${shade(c, -.14)}"/><circle cx="76" cy="50" r="2.4" fill="#fff"/><circle cx="100" cy="42" r="2.4" fill="#fff"/><circle cx="124" cy="50" r="2.4" fill="#fff"/>` },
    { draw: c => path('M54 72C52 36 76 22 100 22S148 36 146 72Z', c) + `<rect x="90" y="18" width="20" height="54" rx="7" fill="${shade(c, -.14)}"/><rect x="40" y="68" width="120" height="11" rx="5.5" fill="${shade(c, -.18)}"/>` }
  ];

  const SHOULDERS = 'M26 200C26 168 58 152 82 149L118 149C142 152 174 168 174 200Z';
  const OUTFITS = [
    (c, skin) => path(SHOULDERS, c) + path('M72 152C78 172 122 172 128 152C122 142 78 142 72 152Z', shade(c, -.22)) + path('M84 149C88 162 112 162 116 149Z', skin) + `<path d="M92 168V186M108 168V186" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
    (c, skin) => path(SHOULDERS, c) + path('M80 149C84 170 116 170 120 149Z', skin),
    (c, skin) => path(SHOULDERS, c) + path('M86 149C90 160 110 160 114 149Z', skin) + '<path d="M82 148L100 168L88 176L74 154ZM118 148L100 168L112 176L126 154Z" fill="#fff"/>' + `<path d="M100 168V200" stroke="${shade(c, -.25)}" stroke-width="2"/>`,
    (c, skin) => path(SHOULDERS, c) + path('M86 149C90 160 110 160 114 149Z', skin) + `<path d="M100 158V200" stroke="${shade(c, -.3)}" stroke-width="3"/><path d="M32 186H168" stroke="#f4f1ea" stroke-width="6"/><path d="M32 186H168" stroke="#b6bcc2" stroke-width="2" stroke-dasharray="4 4"/>`,
    (c, skin) => path(SHOULDERS, c) + '<path d="M84 149L100 184L116 149Z" fill="#fff"/>' + path('M86 149C90 158 110 158 114 149Z', skin) + `<path d="M80 150L100 186L88 200H66L72 164ZM120 150L100 186L112 200H134L128 164Z" fill="${shade(c, -.2)}"/>`,
    (c, skin) => path(SHOULDERS, '#e8e6e1') + path('M84 149C88 164 112 164 116 149Z', skin) + `<path d="M62 158C76 166 86 172 92 200H62ZM138 158C124 166 114 172 108 200H138Z" fill="${c}"/><path d="M66 184H90M110 184H134" stroke="#f6e27a" stroke-width="6"/>`,
    (c, skin) => path(SHOULDERS, c) + path('M88 149C90 156 110 156 112 149Z', skin) + `<path d="M84 148C90 158 110 158 116 148" stroke="${shade(c, -.28)}" stroke-width="4" fill="none"/><path d="M100 156V192" stroke="${shade(c, -.28)}" stroke-width="3"/><circle cx="105" cy="166" r="1.8" fill="#fff"/><circle cx="105" cy="178" r="1.8" fill="#fff"/>`,
    (c, skin) => path(SHOULDERS, '#f4f1ea') + path('M84 149C88 164 112 164 116 149Z', skin) + `<path d="M76 168H124L128 200H72Z" fill="${c}"/><path d="M80 168L76 152M120 168L124 152" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`
  ];

  // Order matters: the code stores one character per field.
  const FIELDS = [
    ['face', FACES.length, 0], ['skin', SKIN.length, 3], ['hair', HAIR.length, 2], ['hairColor', HAIR_COLORS.length, 1],
    ['eyes', EYES.length, 0], ['eyeColor', EYE_COLORS.length, 0], ['brows', BROWS.length, 1], ['nose', NOSES.length, 0],
    ['mouth', MOUTHS.length, 0], ['beard', BEARDS.length, 0], ['glasses', GLASSES.length, 0], ['head', HEADS.length, 0],
    ['headColor', CLOTH.length, 0], ['outfit', OUTFITS.length, 0], ['outfitColor', CLOTH.length, 0], ['card', CARDS.length, 0],
    ['work', WORK.length, 0], ['eyeY', 9, 4], ['eyeSize', 9, 4], ['eyeGap', 9, 4], ['browY', 9, 4],
    ['noseY', 9, 4], ['noseSize', 9, 4], ['mouthY', 9, 4], ['mouthSize', 9, 4]
  ];
  const PATTERN = new RegExp(`^c1\\.[0-9a-z]{${FIELDS.length}}$`);
  const isCharacter = value => typeof value === 'string' && PATTERN.test(value);
  const defaults = () => Object.fromEntries(FIELDS.map(([key, , start]) => [key, start]));
  const encode = character => `c1.${FIELDS.map(([key, count, start]) => {
    const value = character[key];
    return (Number.isInteger(value) && value >= 0 && value < count ? value : start).toString(36);
  }).join('')}`;
  function decode(code) {
    if (!isCharacter(code)) return defaults();
    const letters = code.slice(3);
    return Object.fromEntries(FIELDS.map(([key, count, start], i) => {
      const value = parseInt(letters[i], 36);
      return [key, value < count ? value : start];
    }));
  }
  function random() {
    const pick = count => Math.floor(Math.random() * count);
    const character = defaults();
    for (const [key, count] of FIELDS) if (count !== 9) character[key] = pick(count);
    // Most people get a calm, everyday result rather than every extra at once.
    if (Math.random() < .65) character.beard = 0;
    if (Math.random() < .6) character.glasses = 0;
    if (Math.random() < .6) character.head = 0;
    character.work = 0;
    return character;
  }

  function svg(input, { viewBox = '0 0 200 200', title = '' } = {}) {
    const c = typeof input === 'string' ? decode(input) : { ...defaults(), ...input };
    const skin = SKIN[c.skin], hairColor = HAIR_COLORS[c.hairColor], head = HEADS[c.head];
    const offset = value => value - 4;
    const eyeY = 90 + offset(c.eyeY) * 2, eyeScale = 1 + offset(c.eyeSize) * .08, eyeGap = 19 + offset(c.eyeGap) * 1.5;
    const browY = eyeY - 16 + offset(c.browY) * 1.5;
    const noseY = 106 + offset(c.noseY) * 1.5, noseScale = 1 + offset(c.noseSize) * .12;
    const mouthY = 123 + offset(c.mouthY) * 1.4, mouthScale = 1 + offset(c.mouthSize) * .1;
    const hair = HAIR[c.hair];
    const parts = [
      `<rect width="200" height="200" fill="${CARDS[c.card]}"/>`,
      head.hideHair ? '' : hair.back(hairColor),
      `<rect x="82" y="124" width="36" height="36" rx="14" fill="${shade(skin, -.12)}"/>`,
      OUTFITS[c.outfit](CLOTH[c.outfitColor], shade(skin, -.12)),
      `<circle cx="53" cy="96" r="9" fill="${shade(skin, -.06)}"/><circle cx="147" cy="96" r="9" fill="${shade(skin, -.06)}"/>`,
      `<g fill="${skin}">${FACES[c.face]}</g>`,
      `<ellipse cx="70" cy="110" rx="8" ry="5" fill="#e77f7f" opacity=".22"/><ellipse cx="130" cy="110" rx="8" ry="5" fill="#e77f7f" opacity=".22"/>`,
      BEARDS[c.beard](hairColor),
      `<g transform="translate(100 ${noseY}) scale(${noseScale})">${NOSES[c.nose](shade(skin, -.28))}</g>`,
      `<g transform="translate(100 ${mouthY}) scale(${mouthScale})">${MOUTHS[c.mouth]()}</g>`,
      `<g transform="translate(100 ${eyeY})"><g class="av-eyes"><g transform="scale(${eyeScale})">${EYES[c.eyes](eyeGap / eyeScale, EYE_COLORS[c.eyeColor])}</g></g></g>`,
      `<g transform="translate(100 ${browY}) scale(${eyeScale})">${BROWS[c.brows](eyeGap / eyeScale, c.hair === 0 ? '#3a2618' : hairColor)}</g>`,
      GLASSES[c.glasses](eyeGap, eyeY),
      head.hideHair || head.hideFront ? '' : hair.front(hairColor),
      head.draw(CLOTH[c.headColor])
    ];
    const label = title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"';
    return `<svg class="av" viewBox="${viewBox}" ${label} xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
  }

  const escape = text => String(text ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  // Community avatars are either a character code or one of the older emoji.
  const html = value => isCharacter(value) ? svg(value) : escape(value);
  const workLabel = value => isCharacter(value) ? (WORK[decode(value).work].label === 'None' ? '' : WORK[decode(value).work].label) : '';

  const KEY = 'steady-profile';
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && isCharacter(saved.character)) return { character: saved.character, bio: String(saved.bio || '').slice(0, 280) };
    } catch (_) { /* private browsing or old data */ }
    return null;
  }
  function save(character, bio) {
    try { localStorage.setItem(KEY, JSON.stringify({ character: encode(character), bio: String(bio || '').slice(0, 280) })); return true; } catch (_) { return false; }
  }
  const clear = () => { try { localStorage.removeItem(KEY); } catch (_) { /* private browsing */ } };

  const api = { FIELDS, COUNTS: Object.fromEntries(FIELDS.map(([key, count]) => [key, count])), SKIN, HAIR_COLORS, EYE_COLORS, CLOTH, CARDS, WORK, HEADWEAR, PATTERN, isCharacter, defaults, encode, decode, random, svg, html, workLabel, load, save, clear };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.STEADY_AVATAR = api;
})();
