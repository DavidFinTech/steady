// A few sample characters on the home page, to show what the maker can do.
(() => {
  const A = window.STEADY_AVATAR;
  const host = document.getElementById('home-characters');
  if (!host) return;
  const samples = [
    { skin: 7, hair: 3, hairColor: 0, eyes: 7, mouth: 1, outfit: 3, outfitColor: 2, card: 0 },
    { skin: 4, head: 3, headColor: 5, eyes: 4, mouth: 0, brows: 4, outfit: 6, outfitColor: 6, card: 2 },
    { skin: 2, hair: 13, hairColor: 2, eyes: 1, mouth: 6, glasses: 2, beard: 5, outfit: 4, outfitColor: 0, card: 1 },
    { skin: 6, head: 4, headColor: 0, eyes: 0, beard: 4, hairColor: 0, mouth: 0, outfit: 5, outfitColor: 4, card: 3 },
    { skin: 0, hair: 6, hairColor: 9, eyes: 2, mouth: 7, glasses: 1, outfit: 0, outfitColor: 3, card: 4 }
  ];
  host.innerHTML = samples.map(sample => `<span class="avatar">${A.svg(sample)}</span>`).join('');
})();
