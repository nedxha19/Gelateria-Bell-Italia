/* ============================================================================
   Gelateria Bell Italia — Menu Module (vanilla JS, no dependencies)
   Data-driven: change MENU and the whole UI re-renders. Illustrations are
   reusable, colour-parameterised inline SVGs (no image requests, no layout
   shift). Classic IIFE so it runs from file:// as well as a server.
   ========================================================================== */
(function () {
  "use strict";

  var CURRENCY = "L"; // Albanian Lek

  /* ---- Inline UI icons (single source of truth) --------------------------- */
  function stroked(paths) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>"
    );
  }
  var ICONS = {
    heart: stroked('<path d="M12 20.3l-1.4-1.3C5.4 14.3 2 11.2 2 7.5 2 4.9 4 3 6.5 3 8.3 3 9.8 3.9 12 6c2.2-2.1 3.7-3 5.5-3C20 3 22 4.9 22 7.5c0 3.7-3.4 6.8-8.6 11.5z"/>')
  };

  /* ---- Reusable SVG illustrations (colour-parameterised) ------------------- */
  function wrap(inner) {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + inner + "</svg>";
  }
  function fill(colors, n) {
    var out = [], src = colors || [];
    for (var i = 0; i < n; i++) out.push(src[i] || src[src.length - 1] || "#e8d8c6");
    return out;
  }

  var ART = {
    // Scooped ice cream in a glass cup
    cup: function (c) {
      var s = fill(c, 3);
      return wrap(
        '<rect x="60" y="6" width="6" height="34" rx="3" fill="#e7c9a0" transform="rotate(20 63 23)"/>' +
        '<circle cx="37" cy="34" r="15" fill="' + s[0] + '"/>' +
        '<circle cx="63" cy="34" r="15" fill="' + s[1] + '"/>' +
        '<circle cx="50" cy="25" r="16" fill="' + s[2] + '"/>' +
        '<path d="M28 46 h44 l-6 40 a6 6 0 0 1-6 5 H40 a6 6 0 0 1-6-5 Z" fill="#ffffff" fill-opacity=".85"/>' +
        '<path d="M28 46 h44 l-1.2 8 H29.2 Z" fill="#ffffff" fill-opacity=".55"/>'
      );
    },
    // Sundae in a coupe glass, cherry on top
    sundae: function (c) {
      var s = fill(c, 3);
      return wrap(
        '<circle cx="38" cy="37" r="13" fill="' + s[0] + '"/>' +
        '<circle cx="62" cy="37" r="13" fill="' + s[1] + '"/>' +
        '<circle cx="50" cy="29" r="14" fill="' + s[2] + '"/>' +
        '<path d="M50 16 q3-6 9-6" stroke="#5a7d33" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<circle cx="50" cy="18" r="6" fill="#e23b4f"/>' +
        '<path d="M26 46 Q50 78 74 46 Z" fill="#ffffff" fill-opacity=".85"/>' +
        '<rect x="46.5" y="75" width="7" height="12" fill="#ffffff" fill-opacity=".8"/>' +
        '<ellipse cx="50" cy="90" rx="17" ry="4.5" fill="#ffffff" fill-opacity=".85"/>'
      );
    },
    // Tall glass with straw (granita / smoothie / frappé)
    glass: function (c) {
      var s = fill(c, 1);
      return wrap(
        '<rect x="58" y="6" width="5" height="62" rx="2.5" fill="#ff6f91" transform="rotate(12 60 37)"/>' +
        '<path d="M34 22 h32 l-4 64 a5 5 0 0 1-5 4 H43 a5 5 0 0 1-5-4 Z" fill="#ffffff" fill-opacity=".16" stroke="#ffffff" stroke-opacity=".45" stroke-width="1.5"/>' +
        '<path d="M37 46 h26 l-3.4 40 a5 5 0 0 1-5 4 H45.4 a5 5 0 0 1-5-4 Z" fill="' + s[0] + '"/>' +
        '<ellipse cx="50" cy="22" rx="16" ry="4" fill="#ffffff" fill-opacity=".35"/>'
      );
    },
    // Beer mug with foam
    beer: function (c) {
      var s = fill(c, 1);
      return wrap(
        '<path d="M66 44 h8 a10 10 0 0 1 0 20 h-8" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="6"/>' +
        '<rect x="30" y="32" width="38" height="58" rx="6" fill="#ffffff" fill-opacity=".16" stroke="#ffffff" stroke-opacity=".45" stroke-width="1.5"/>' +
        '<path d="M33 46 h32 v38 a4 4 0 0 1-4 4 H37 a4 4 0 0 1-4-4 Z" fill="' + s[0] + '"/>' +
        '<path d="M31 44 q3-8 9-4 q4-9 11-3 q5-8 12 1 q3 9-5 9 H36 q-8 0-5-3 Z" fill="#fff7ec"/>' +
        '<circle cx="42" cy="62" r="2.4" fill="#ffffff" fill-opacity=".45"/>' +
        '<circle cx="52" cy="72" r="2" fill="#ffffff" fill-opacity=".4"/>' +
        '<circle cx="45" cy="80" r="1.6" fill="#ffffff" fill-opacity=".35"/>'
      );
    },
    // Cake slice — sponge base, cream filling, frosting cap, cherry on top
    cake: function (c) {
      var s = fill(c, 3);
      return wrap(
        '<ellipse cx="50" cy="88" rx="32" ry="5" fill="#000000" fill-opacity=".06"/>' +
        '<path d="M14 50 L86 26 L86 50 Z" fill="' + s[2] + '"/>' +
        '<path d="M14 50 L86 34 L86 42 Z" fill="' + s[1] + '"/>' +
        '<path d="M14 50 L86 50 L86 74 Z" fill="' + s[0] + '"/>' +
        '<path d="M16 51 Q50 39 84 27" stroke="#ffffff" stroke-opacity=".55" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="78" cy="29" r="5.5" fill="#e23b4f"/>' +
        '<circle cx="76.5" cy="26.5" r="1.6" fill="#ffffff" fill-opacity=".65"/>'
      );
    },
    // Coffee cup on a saucer with steam
    coffee: function (c) {
      var s = fill(c, 1);
      return wrap(
        '<path d="M44 34 q6-5 0-11 q-6-6 0-11" stroke="#ffffff" stroke-opacity=".35" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M56 34 q6-5 0-11 q-6-6 0-11" stroke="#ffffff" stroke-opacity=".35" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M70 46 a10 10 0 0 1 0 18" fill="none" stroke="#ffffff" stroke-opacity=".6" stroke-width="6"/>' +
        '<path d="M28 42 h44 l-4 24 a12 12 0 0 1-12 10 H44 a12 12 0 0 1-12-10 Z" fill="#ffffff" fill-opacity=".9"/>' +
        '<ellipse cx="50" cy="44" rx="20" ry="5" fill="' + s[0] + '"/>' +
        '<ellipse cx="50" cy="86" rx="28" ry="6" fill="#ffffff" fill-opacity=".8"/>'
      );
    }
  };

  /* ---- Menu data ---------------------------------------------------------- */
  var MENU = [
    {
      id: "embelsirat",
      label: "Embëlsirat",
      items: [
        { id: "rafaello", name: "Rafaello", sub: "Kokos & Bajame", price: 180, rating: 4.6, icon: "cake", colors: ["#f7f2e8", "#fff8ee", "#e8d9b0"], desc: "Tortë e bardhë me kokos të grimcuar dhe bajame, e mbushur me krem të lehtë vanilje. E ëmbël, e freskët dhe delikate." },
        { id: "gianduia", name: "Gianduia", sub: "Çokollatë & Lajthi", price: 170, rating: 4.7, icon: "cake", colors: ["#6b4226", "#a97449", "#4a2c1a"], desc: "Tortë kremoze me çokollatë gianduia dhe lajthi të pjekura. E pasur, e butë dhe me shije intensive arrash." },
        { id: "bueno", name: "Bueno", sub: "Wafer & Lajthi", price: 180, rating: 4.6, icon: "cake", colors: ["#f0d9a0", "#6b4226", "#e8c68a"], desc: "Tortë me shtresa wafer, krem lajthie dhe çokollatë qumështi. Krokante dhe kremoze njëkohësisht." },
        { id: "snickers", name: "Snickers", sub: "Karamel & Kikirikë", price: 180, rating: 4.6, icon: "cake", colors: ["#8a5a34", "#d99a3d", "#4a2c1a"], desc: "Tortë me karamel të shkrirë, kikirikë krokante dhe çokollatë të zezë. E ëmbël, me pak kripë për ekuilibër." },
        { id: "extremchoco", name: "Extremchoco me Akullore", sub: "Çokollatë & Akullore", price: 220, rating: 4.8, icon: "cake", colors: ["#3a2213", "#6b4226", "#1f130a"], desc: "Ëmbëlsirë intensive çokollate e servirur me top akulloreje çokollate. Për të vërtetët e çokollatës." },
        { id: "trileqe", name: "Trileçe", sub: "Tres Leches", price: 160, rating: 4.5, icon: "cake", colors: ["#fff8ee", "#f0e2c0", "#e8d9b0"], desc: "Pandispanjë e njomur në tre lloje qumështi, e mbuluar me krem të lehtë. Kremoze dhe jashtëzakonisht e butë." },
        { id: "soufle", name: "Soufflé me Akullore", sub: "Suflé & Akullore", price: 220, rating: 4.7, icon: "cake", colors: ["#6b4226", "#f7e4c4", "#4a2c1a"], desc: "Suflé i ngrohtë çokollate i servirur me top akulloreje vanilje. Kontrast i përsosur midis të ngrohtit dhe të ftohtit." },
        { id: "brownies", name: "Brownies", sub: "Çokollatë e Zezë", price: 150, rating: 4.7, icon: "cake", colors: ["#3a2213", "#6b4226", "#1f130a"], desc: "Kek i dendur çokollate me teksturë fudge. Intensiv, kremoz dhe me shije të thellë çokollate." },
        { id: "ekmek", name: "Ekmek", sub: "Kajmak & Karamel", price: 200, rating: 4.6, icon: "cake", colors: ["#e8c68a", "#fff8ee", "#d99a3d"], desc: "Ëmbëlsirë tradicionale me bazë krokante, kajmak të freskët dhe shurup karameli. E pasur, me kontrast teksturash." },
        { id: "kadaif", name: "Kadaif me Kajmak", sub: "Kadaif & Kajmak", price: 160, rating: 4.6, icon: "cake", colors: ["#d99a3d", "#fff8ee", "#c98a2e"], desc: "Fije kadaifi të pjekura mbi krem kajmaku të freskët. Krokante sipër, kremoze poshtë." },
        { id: "bakllavaarra", name: "Bakllava me Arra", sub: "Arra & Shurup", price: 150, rating: 4.7, icon: "cake", colors: ["#d99a3d", "#8a5a34", "#c98a2e"], desc: "Fletë krokante me arra të grimcuara dhe shurup mjalti. Klasiku ballkanik, i ëmbël dhe aromatik." },
        { id: "bakllavastika", name: "Bakllava me Stika", sub: "Fëstëk & Shurup", price: 200, rating: 4.8, icon: "cake", colors: ["#9ccc4f", "#d6e69a", "#7bb03a"], desc: "Bakllava me fëstëk të grimcuar dhe shurup të lehtë. Krokante dhe me shije delikate arrash." },
        { id: "cheesecakepylli", name: "Cheesecake me Fruta Pylli", sub: "Fruta Pylli", price: 250, rating: 4.7, icon: "cake", colors: ["#f3ece2", "#8e4fbf", "#e23b4f"], desc: "Cheesecake kremoz me sos frutash pylli të freskët. Ekuilibër i përsosur midis së ëmbëlës dhe së thartës." },
        { id: "cheesecakestika", name: "Cheesecake me Stika", sub: "Fëstëk", price: 250, rating: 4.6, icon: "cake", colors: ["#f3ece2", "#9ccc4f", "#d6e69a"], desc: "Cheesecake i butë me krem fëstëku dhe copëza fëstëku sipër. Kremoz, me shije arrash delikate." },
        { id: "zupe", name: "Zupe", sub: "Zuppa Inglese", price: 150, rating: 4.5, icon: "cake", colors: ["#ff7a8a", "#fff8ee", "#e23b4f"], desc: "Ëmbëlsirë italiane me shtresa pandispanje, krem vanilje dhe likor të lehtë. Tradicionale dhe elegante." },
        { id: "profiterol", name: "Profiterol", sub: "Çokollatë e Zezë", price: 170, rating: 4.7, icon: "cake", colors: ["#6b4226", "#f7e4c4", "#4a2c1a"], desc: "Topa brumi të mbushur me krem dhe të mbuluar me çokollatë të zezë të shkrirë. Klasik i pakohë." },
        { id: "pannacotta", name: "Panna Cotta", sub: "Krem Vanilje", price: 180, rating: 4.6, icon: "cake", colors: ["#f7e4c4", "#ffc59b", "#ffb843"], desc: "Krem i butë vanilje italian, i shërbyer me sos frutash. Teksturë e mëndafshtë që shkrihet menjëherë në gojë." },
        { id: "kremkaramel", name: "Krem Karamel", sub: "Karamel", price: 160, rating: 4.6, icon: "cake", colors: ["#e8c68a", "#d99a3d", "#8a5a34"], desc: "Puding vezësh me shurup karameli të errët. Kremoz, i lehtë dhe me aromë klasike vanilje." },
        { id: "oreobardhe", name: "Oreo e Bardhë", sub: "Oreo & Çokollatë e Bardhë", price: 180, rating: 4.6, icon: "cake", colors: ["#fff8ee", "#2b2b2b", "#e8d9b0"], desc: "Tortë kremoze me çokollatë të bardhë dhe copëza biskotash Oreo. Kontrast i bukur ngjyrash e shijesh." },
        { id: "oreozeze", name: "Oreo e Zezë", sub: "Oreo & Çokollatë e Zezë", price: 180, rating: 4.6, icon: "cake", colors: ["#2b2b2b", "#4a2c1a", "#1f130a"], desc: "Tortë e dendur me çokollatë të zezë dhe biskota Oreo të grimcuara. Intensive, me teksturë krokante brenda kremit." },
        { id: "milka", name: "Milka", sub: "Çokollatë Alpine", price: 180, rating: 4.6, icon: "cake", colors: ["#8e4fbf", "#c9a6e0", "#6a2fa0"], desc: "Tortë kremoze e frymëzuar nga çokollata Milka, e butë dhe qumështore. E ëmbël dhe e lehtë." },
        { id: "ferrerorocher", name: "Ferrero Rocher", sub: "Lajthi & Çokollatë", price: 180, rating: 4.8, icon: "cake", colors: ["#c98a2e", "#6b4226", "#f5b31f"], desc: "Tortë me lajthi të plota, krem gianduia dhe fletë ari çokollate. Elegante, me shije të pasur arrash." },
        { id: "mousegianduia", name: "Mousse Gianduia", sub: "Mousse Gianduia", price: 180, rating: 4.7, icon: "cake", colors: ["#6b4226", "#a97449", "#4a2c1a"], desc: "Mousse ajrore çokollate gianduia, kremoze dhe e lehtë. Shkrihet menjëherë me shije intensive lajthie." },
        { id: "moussepistachio", name: "Mousse Pistachio", sub: "Mousse Fëstëk", price: 200, rating: 4.7, icon: "cake", colors: ["#9ccc4f", "#d6e69a", "#7bb03a"], desc: "Mousse e lehtë fëstëku sicilian, kremoze dhe me ngjyrë jeshile natyrale. Delikate, shije autentike arrash." },
        { id: "boscaiola", name: "Boscaiola", sub: "Pyll i Zi", price: 180, rating: 4.6, icon: "cake", colors: ["#3a2213", "#e23b4f", "#6b4226"], desc: "Tortë çokollate në stilin 'pyll i zi', me qershi dhe krem të lehtë. E errët, me kontrast të bukur shijesh." },
        { id: "redvelvet", name: "Red Velvet", sub: "Kadife e Kuqe", price: 180, rating: 4.7, icon: "cake", colors: ["#b3182b", "#fff8ee", "#e23b4f"], desc: "Kek i kadifenjtë me ngjyrë të kuqe dhe krem djathi të lehtë. I butë, elegant dhe pak i ëmbël." },
        { id: "haribo", name: "Haribo", sub: "Kanaçe Sherbetlek", price: 220, rating: 4.3, icon: "cake", colors: ["#e23b4f", "#f5b31f", "#9ccc4f"], desc: "Përzgjedhje karamelesh xhelatinoze me shije frutash. Ngjyra plot jetë dhe shije nostalgjike." },
        { id: "macarons", name: "Macarons", sub: "Copë", price: 50, rating: 4.6, icon: "cake", colors: ["#ffb0bd", "#d6e69a", "#e9d3ae"], desc: "Biskota franceze bajamesh me mbushje kremi, të lehta dhe krokante jashtë. Në ngjyra dhe shije të ndryshme." },
        { id: "cookies", name: "Cookies", sub: "Copë", price: 50, rating: 4.5, icon: "cake", colors: ["#8a5a34", "#6b4226", "#e8c68a"], desc: "Biskota shtëpie me copëza çokollate, krokante nga jashtë dhe të buta brenda." },
        { id: "spaghettieis", name: "Spaghetti Eis", sub: "Akullore Spageti", price: 400, rating: 4.6, icon: "cake", colors: ["#fff8ee", "#e23b4f", "#f7e4c4"], desc: "Akullore vanilje e formuar si spageti, me sos luleshtrydhe dhe grimca bajamesh të bardha. Klasik gjerman argëtues." },
        { id: "spaghetticarbonara", name: "Spaghetti Carbonara", sub: "Akullore 'Carbonara'", price: 450, rating: 4.7, icon: "cake", colors: ["#fff8ee", "#e8d9b0", "#4a2c1a"], desc: "Krijim origjinal akulloreje që imiton pjatën e karbonares, me krem vanilje, 'kripë' bajamesh dhe 'piper' çokollate." },
        { id: "njeriudebore", name: "Njeriu i Dëborës", sub: "Special Dimri", price: 250, rating: 4.6, icon: "cake", colors: ["#fff8ee", "#e9f5ff", "#c9e6ff"], desc: "Ëmbëlsirë festive me formë njeriu bore, krem vanilje dhe kokos. Argëtuese për fëmijë dhe të rritur." },
        { id: "pinochio", name: "Pinochio", sub: "Special Fëmijësh", price: 220, rating: 4.5, icon: "cake", colors: ["#e8c68a", "#8a5a34", "#f5b31f"], desc: "Ëmbëlsirë krijuese e frymëzuar nga Pinoku, me akullore dhe garniturë ngjyrash. E preferuar nga fëmijët." },
        { id: "bigne", name: "Bignè", sub: "Copë", price: 50, rating: 4.5, icon: "cake", colors: ["#f7e4c4", "#fff8ee", "#e8d9b0"], desc: "Petull e vogël e mbushur me krem, e lehtë dhe ajrore. Klasik italian për çdo moment të ditës." },
        { id: "cokollatevogla", name: "Çokollata të Vogla", sub: "Copë", price: 30, rating: 4.4, icon: "cake", colors: ["#4a2c1a", "#6b4226", "#8a5a34"], desc: "Praline të vogla çokollate me mbushje të ndryshme. Të përsosura si përfundim i ëmbël në një kafshatë." },
        { id: "muffin", name: "Muffin", sub: "Copë", price: 70, rating: 4.4, icon: "cake", colors: ["#c9a27a", "#8a5a34", "#e8d9b0"], desc: "Muffin i butë shtëpie, i pjekur çdo mëngjes. Aromatik dhe ideal për t'u shoqëruar me kafe." },
        { id: "parisbrest", name: "Paris Brest", sub: "Krem Praline", price: 90, rating: 4.6, icon: "cake", colors: ["#c98a2e", "#e8c68a", "#6b4226"], desc: "Petull unaze me krem praline dhe bajame të thekura sipër. Klasik francez, kremoz dhe me shije arrash." },
        { id: "bignestika", name: "Bignè me Stika", sub: "Bignè & Fëstëk", price: 50, rating: 4.5, icon: "cake", colors: ["#9ccc4f", "#d6e69a", "#f7e4c4"], desc: "Petull e vogël e mbushur me krem fëstëku. E lehtë, delikate dhe me ngjyrë jeshile natyrale." }
      ]
    },
    {
      id: "kupat",
      label: "Kupat",
      items: [
        { id: "kupafruta", name: "Kupa me Fruta", sub: "Akullore & Fruta", price: 450, rating: 4.7, icon: "cup", colors: ["#ff7a8a", "#ffe066", "#9ccc4f"], desc: "Topa akulloreje të përzgjedhur me fruta të freskëta stinore sipër. Freskuese dhe plot ngjyra." },
        { id: "kupabanane", name: "Kupa Banane", sub: "Banane & Akullore", price: 400, rating: 4.6, icon: "cup", colors: ["#ffe066", "#f7e4c4", "#6b4226"], desc: "Feta banane të freskëta me topa akulloreje dhe krem çokollate. E ëmbël dhe kremoze." },
        { id: "kupaluleshtrydhe", name: "Kupa Luleshtrydhe", sub: "3 topa", price: 400, rating: 4.6, icon: "cup", colors: ["#ff7a8a", "#ffb0bd", "#ef476f"], desc: "Akullore luleshtrydheje me copëza frutash të freskëta. Freskuese dhe plot shije verore." },
        { id: "kupaluleshtrydhebanane", name: "Kupa Luleshtrydhe Banane", sub: "Luleshtrydhe & Banane", price: 450, rating: 4.7, icon: "cup", colors: ["#ff7a8a", "#ffe066", "#ffb0bd"], desc: "Akullore luleshtrydheje dhe banane, e kombinuar për një shije të freskët dhe kremoze." },
        { id: "kupalajthi", name: "Kupa Lajthi", sub: "Lajthi & Akullore", price: 450, rating: 4.7, icon: "cup", colors: ["#8a5a34", "#c98a2e", "#6b4226"], desc: "Akullore lajthie me copëza lajthie të pjekura sipër. E pasur, me aromë të thellë arrash." },
        { id: "kupaarra", name: "Kupa Arra", sub: "Arra & Akullore", price: 400, rating: 4.5, icon: "cup", colors: ["#8a5a34", "#d99a3d", "#4a2c1a"], desc: "Akullore me arra të grimcuara dhe shurup karameli. Krokante dhe kremoze njëkohësisht." },
        { id: "kupabajame", name: "Kupa Bajame", sub: "Bajame & Akullore", price: 400, rating: 4.6, icon: "cup", colors: ["#f0e2c0", "#d99a3d", "#e8d9b0"], desc: "Akullore me bajame të pjekura dhe copëza krokante sipër. E pasur, me shije delikate arrash." },
        { id: "kupadelizia", name: "Kupa Delizia", sub: "Speciale Shtëpie", price: 500, rating: 4.8, icon: "cup", colors: ["#f7e4c4", "#e23b4f", "#9ccc4f"], desc: "Kombinim special i shtëpisë me disa shije akulloreje, krem dhe garniturë. Përjetim i plotë ëmbëlsire." }
      ]
    },
    {
      id: "freskuese",
      label: "Freskuese",
      items: [
        { id: "ujegazpagaz", name: "Ujë me Gaz / pa Gaz", sub: "0.5L", price: 70, rating: 4.3, icon: "glass", colors: ["#cfeeff"], desc: "Ujë natyral, me gaz ose pa gaz, sipas preferencës." },
        { id: "frape", name: "Frapé", sub: "I ftohtë", price: 250, rating: 4.5, icon: "glass", colors: ["#c9a27a"], desc: "Kafe e ftohtë e shkumëzuar, freskuese dhe energjike." },
        { id: "nescafefreskuese", name: "Nescafe", sub: "E ftohtë", price: 180, rating: 4.5, icon: "glass", colors: ["#a97449"], desc: "Nescafe e ftohtë, e ëmbël dhe freskuese, ideale për verën." },
        { id: "nescafekanace", name: "Nescafe Kanaçe", sub: "Në Kanaçe", price: 250, rating: 4.4, icon: "glass", colors: ["#8a5a34"], desc: "Nescafe i ftohtë në kanaçe, praktik dhe gjithmonë gati për t'u shijuar në lëvizje." },
        { id: "bitter", name: "Bitter", sub: "Analkoolik", price: 130, rating: 4.3, icon: "glass", colors: ["#d9534f"], desc: "Pije e freskët me shije të thartë-hidhur, klasike si aperitiv." },
        { id: "pepsi", name: "Pepsi", sub: "0.33L", price: 160, rating: 4.4, icon: "glass", colors: ["#1b3a6b"], desc: "Pije e gazuar klasike, e ftohtë dhe freskuese." },
        { id: "fanta", name: "Fanta", sub: "0.33L", price: 160, rating: 4.4, icon: "glass", colors: ["#ff8a3d"], desc: "Pije e gazuar me shije portokalli, e ëmbël dhe freskuese." },
        { id: "orangelemonsoda", name: "Orange/Lemon Soda", sub: "0.33L", price: 160, rating: 4.4, icon: "glass", colors: ["#ffcf4d"], desc: "Sode citrusësh, e lehtë dhe freskuese, në shije portokalli ose limoni." },
        { id: "cajftohte", name: "Çaj i Ftohtë", sub: "0.33L", price: 160, rating: 4.4, icon: "glass", colors: ["#b98a4a"], desc: "Çaj i ftohtë, i lehtë dhe pak i ëmbël, freskues në çdo stinë." },
        { id: "tonik", name: "Tonik", sub: "Në kanaçe", price: 150, rating: 4.2, icon: "glass", colors: ["#dfe9c8"], desc: "Pije e gazuar me shije pak të hidhur, klasike si përzierëse." },
        { id: "redbull", name: "Red Bull", sub: "0.25L", price: 300, rating: 4.5, icon: "glass", colors: ["#1e3a8a"], desc: "Pije energjike klasike, freskuese dhe stimuluese." },
        { id: "b52", name: "B52", sub: "0.25L", price: 200, rating: 4.4, icon: "glass", colors: ["#2e2e2e"], desc: "Pije energjike alternative, e ftohtë dhe intensive." },
        { id: "lengportokalli", name: "Lëng Portokalli", sub: "I freskët", price: 220, rating: 4.6, icon: "glass", colors: ["#ffb03a"], desc: "Lëng portokalli i shtrydhur fresk, natyral dhe plot vitaminë C." },
        { id: "lemonade", name: "Lemonade", sub: "Shtëpie", price: 140, rating: 4.5, icon: "glass", colors: ["#f3e27a"], desc: "Limonadë shtëpiake e freskët, e ekuilibruar mes së ëmbëlës dhe së thartës." },
        { id: "cocacola", name: "Coca Cola", sub: "0.33L", price: 160, rating: 4.4, icon: "glass", colors: ["#7a1420"], desc: "Pije e gazuar klasike, e ftohtë dhe freskuese." },
        { id: "bravo", name: "Bravo", sub: "0.33L", price: 160, rating: 4.3, icon: "glass", colors: ["#e8622a"], desc: "Pije frutash e gazuar, e ëmbël dhe freskuese." },
        { id: "ujevitamina", name: "Ujë me Vitamina", sub: "0.5L", price: 130, rating: 4.4, icon: "glass", colors: ["#a3d9c9"], desc: "Ujë i pasuruar me vitamina, i lehtë dhe freskues." },
        { id: "milkshake", name: "Milkshake", sub: "Kremoz", price: 220, rating: 4.6, icon: "glass", colors: ["#f3ece2"], desc: "Pije kremoze akulloreje e përzier me qumësht, e trashë dhe e ëmbël. Klasike dhe gjithmonë e dashur." }
      ]
    },
    {
      id: "birra",
      label: "Birra",
      items: [
        { id: "heineken", name: "Heineken", sub: "Lager · 0.33L", price: 250, rating: 4.5, icon: "beer", colors: ["#f5b31f"], desc: "Lager premium hollandeze, e freskët dhe me shije të pastër malti." },
        { id: "korca", name: "Korça", sub: "Lager · 0.5L", price: 220, rating: 4.6, icon: "beer", colors: ["#c98a2e"], desc: "Birra tradicionale nga Korça, me histori mbi një shekull dhe shije autentike malti." }
      ]
    },
    {
      id: "barkafe",
      label: "Bar Kafe",
      items: [
        { id: "kafe", name: "Kafe", sub: "Turke/Ekspres", price: 90, rating: 4.6, icon: "coffee", colors: ["#4a2c1a"], desc: "Kafe e shkurtër, e trashë dhe intensive, e përgatitur sipas traditës." },
        { id: "makiato", name: "Makiato", sub: "Espresso & Shkumë", price: 90, rating: 4.6, icon: "coffee", colors: ["#6b4226"], desc: "Espresso e lehtë me pak qumësht të shkumëzuar sipër. Ekuilibër mes forcës dhe butësisë." },
        { id: "kakao", name: "Kakao", sub: "E Nxehtë", price: 160, rating: 4.5, icon: "coffee", colors: ["#7a4a2a"], desc: "Kakao e ngrohtë dhe kremoze, e ëmbël në masën e duhur. Ngushëlluese në çdo stinë." },
        { id: "kakaoftohte", name: "Kakao e Ftohtë", sub: "E Ftohtë", price: 180, rating: 4.5, icon: "coffee", colors: ["#6b4226"], desc: "Kakao kremoze e shërbyer e ftohtë mbi akull, e ëmbël dhe freskuese. E përsosur për ditët e nxehta." },
        { id: "kapucino", name: "Kapuçino", sub: "Me Shkumë Qumështi", price: 160, rating: 4.7, icon: "coffee", colors: ["#c9a27a"], desc: "Espresso e ekuilibruar me qumësht të shkumëzuar mëndafshi. Kremoz, i ngrohtë dhe klasik." },
        { id: "kapucinoftohte", name: "Kapuçino e Ftohtë", sub: "Espresso & Akull", price: 180, rating: 4.6, icon: "coffee", colors: ["#b58a5c"], desc: "Kapuçino i shkumëzuar, i shërbyer i ftohtë mbi akull. Kremoz dhe freskues, ideal për ditët e nxehta." },
        { id: "nescafengrohte", name: "Nescafe e Ngrohtë", sub: "E Nxehtë", price: 160, rating: 4.4, icon: "coffee", colors: ["#5a3a22"], desc: "Nescafe klasike e përgatitur e ngrohtë, e lehtë dhe aromatike." },
        { id: "affogato", name: "Affogato", sub: "Espresso & Akullore", price: 160, rating: 4.8, icon: "coffee", colors: ["#d8b78f"], desc: "Top akulloreje vanilje i 'mbytur' në espresso të nxehtë. Kontrast i shijshëm i të ftohtit me të nxehtin." },
        { id: "kafegjermane", name: "Kafe Gjermane", sub: "Speciale", price: 140, rating: 4.5, icon: "coffee", colors: ["#8a5a34"], desc: "Variant special kafeje me shkumë të pasur dhe teksturë kremoze." },
        { id: "qumeshtngrohte", name: "Qumësht i Ngrohtë", sub: "I Nxehtë", price: 90, rating: 4.2, icon: "coffee", colors: ["#f3ece2"], desc: "Qumësht i ngrohtë, i thjeshtë dhe ngushëllues, ideal për fëmijë dhe të rritur." },
        { id: "kremcokollate", name: "Krem Çokollatë", sub: "E Nxehtë", price: 200, rating: 4.6, icon: "coffee", colors: ["#4a2c1a"], desc: "Çokollatë e nxehtë kremoze, e dendur dhe intensive në shije." },
        { id: "americano", name: "Americano", sub: "Espresso & Ujë", price: 140, rating: 4.5, icon: "coffee", colors: ["#3a2213"], desc: "Espresso e holluar me ujë të nxehtë, më e lehtë dhe e gjatë se espresso klasike." },
        { id: "fredocaffe", name: "Fredo Caffè / Ice Coffee", sub: "E Ftohtë", price: 200, rating: 4.6, icon: "coffee", colors: ["#c9a27a"], desc: "Kafe e ftohtë e shkumëzuar, freskuese dhe intensive, ideale për ditët e nxehta." },
        { id: "caffelatte", name: "Caffè Latte", sub: "Me Qumësht", price: 150, rating: 4.6, icon: "coffee", colors: ["#cdaa80"], desc: "Kafe e gjatë me shumë qumësht të shkumëzuar, e butë dhe kremoze." },
        { id: "icelatte", name: "Ice Latte", sub: "E Ftohtë me Qumësht", price: 250, rating: 4.6, icon: "coffee", colors: ["#e0c9a6"], desc: "Latte e ftohtë me qumësht të shkumëzuar mbi akull, e lehtë dhe freskuese." },
        { id: "decaffeinato", name: "Decaffeinato", sub: "Pa Kafeinë", price: "90 / 120", rating: 4.4, icon: "coffee", colors: ["#a97449"], desc: "E njëjta shije espresso pa kafeinë, e lehtë dhe mund të shijohet në çdo orë." },
        { id: "cajbio", name: "Çaj Bio", sub: "Organik", price: 150, rating: 4.5, icon: "coffee", colors: ["#7bb03a"], desc: "Përzgjedhje çajrash organikë, natyralë dhe pa aditivë." },
        { id: "illycafe", name: "Illy Caffè", sub: "Përzierje Speciale", price: 120, rating: 4.6, icon: "coffee", colors: ["#3a2213"], desc: "Espresso premium nga përzierja e njohur italiane Illy, e pasur dhe me aromë të pastër." },
        { id: "eischocolatecaffe", name: "Eis Chocolate / Caffè", sub: "E Ftohtë me Akullore", price: 250, rating: 4.7, icon: "coffee", colors: ["#4a2c1a"], desc: "Kafe ose çokollatë e ftohtë e servirur me top akulloreje. Freskuese dhe kremoze, ideale për ditët e nxehta." }
      ]
    }
  ];

  /* ---- State -------------------------------------------------------------- */
  var state = { catId: MENU[0].id, favs: {} };

  function formatPrice(price) { return price == null ? "—" : price + " " + CURRENCY; }

  function category(id) { return MENU.find(function (c) { return c.id === id; }); }

  /* ---- DOM refs ----------------------------------------------------------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var refs = {};

  function cacheRefs() {
    ["rail", "grid"].forEach(function (k) { refs[k] = $('[data-gm="' + k + '"]'); });
  }

  /* ---- Rendering ---------------------------------------------------------- */
  function renderTabs() {
    // Built once. The liquid-fill on .gmenu-tab::before is a CSS transition
    // keyed off [aria-selected] — it only animates on an element that stays
    // in the DOM across the change, so tabs must be updated in place rather
    // than rebuilt (innerHTML churn would make every switch a hard cut).
    refs.rail.innerHTML = MENU.map(function (c) {
      return '<button class="gmenu-tab" role="tab" data-cat="' + c.id + '">' + c.label + "</button>";
    }).join("");
    updateTabsState();
  }

  function updateTabsState() {
    var tabs = refs.rail.querySelectorAll("[data-cat]");
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].dataset.cat === state.catId;
      tabs[i].setAttribute("aria-selected", on);
      tabs[i].tabIndex = on ? 0 : -1;
    }
  }

  function renderGrid() {
    var items = category(state.catId).items;
    refs.grid.dataset.cat = state.catId;
    refs.grid.innerHTML = items.map(function (it, idx) {
      var faved = !!state.favs[it.id];
      return (
        '<li class="gmenu-item" style="--i:' + idx + '">' +
          '<div class="gmenu-card">' +
            '<span class="gmenu-card__media">' + ART[it.icon](it.colors) + "</span>" +
            '<span class="gmenu-card__body">' +
              '<span class="gmenu-card__name">' + it.name + "</span>" +
              '<span class="gmenu-card__price">' + formatPrice(it.price) + "</span>" +
            "</span>" +
          "</div>" +
          '<button class="gmenu-fav" type="button" data-fav="' + it.id + '" ' +
            'aria-pressed="' + faved + '" aria-label="Shto te të preferuarat: ' + it.name + '">' +
            ICONS.heart +
          "</button>" +
        "</li>"
      );
    }).join("");
  }

  /* ---- Actions ------------------------------------------------------------ */
  function selectCategory(id, focusTab) {
    if (!category(id)) return;
    state.catId = id;
    updateTabsState();
    renderGrid();
    if (focusTab) { var t = $('[data-cat="' + id + '"]', refs.rail); if (t) t.focus(); }
  }

  function toggleFav(id, btn) {
    state.favs[id] = !state.favs[id];
    btn.setAttribute("aria-pressed", String(!!state.favs[id]));
  }

  /* ---- Events (delegated) ------------------------------------------------- */
  function bind() {
    refs.rail.addEventListener("click", function (e) {
      var t = e.target.closest("[data-cat]");
      if (t) selectCategory(t.dataset.cat);
    });

    // Roving-tabindex keyboard nav for the vertical tablist
    refs.rail.addEventListener("keydown", function (e) {
      var keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      var idx = MENU.findIndex(function (c) { return c.id === state.catId; });
      idx = (idx + keys[e.key] + MENU.length) % MENU.length;
      selectCategory(MENU[idx].id, true);
    });

    refs.grid.addEventListener("click", function (e) {
      var fav = e.target.closest("[data-fav]");
      if (fav) toggleFav(fav.dataset.fav, fav);
    });
  }

  /* ---- Init --------------------------------------------------------------- */
  function init() {
    cacheRefs();
    renderTabs();
    renderGrid();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
