/* Season 1 · The Wonder Map.
   To open an episode's stamp: set released: true once the video is public.
   Magic words are stored only as a fingerprint (sha256 of "manchas:" + WORD in capitals), never as plain text.
   Episode codes follow S01EXX. */
window.SEASON = {
  code: "S01",
  title: "The Wonder Map",
  lands: [
    { id: "tour", name: "The Tour", icon: "balloon", color: "#B8433A", fill: "#E9B7A9",
      blurb: "One stop in every land.", reward: "Tour Explorer certificate + Manchas phone wallpaper",
      eps: [
        { ep: "S01E01", title: "Hot air balloon", released: false, word: "793c6af6c367f057abadea63b4bfa32fa73d040075932a2f3c3d02263c30abd0" },
        { ep: "S01E02", title: "Airbags",         released: false, word: "58a37fff2d0f69edb73273a893ec5e9cbbe5afbdc5bc8249c96e86b8326843f8" },
        { ep: "S01E03", title: "Salty sea",       released: false, word: "c9a4ed84c6eed0b4e7f040e321453074912d12d1f482b6c68185f17f7110c34c" },
        { ep: "S01E04", title: "Dog noses",       released: false, word: "0ed19a5dbf372119086ccc0f0722094fd17814b920a01e4ba0a301831866f744" }
      ] },
    { id: "living", name: "Living Things", icon: "leaf", color: "#77864A", fill: "#A9B67A",
      blurb: "Expedition 1 · the garden", reward: "Garden Explorer certificate + wallpaper",
      eps: [
        { ep: "S01E05", title: "We have arrived!", special: true, released: false, word: "4e18ef87a248a746b74685396729384955a1c73604910b5cd24c033330f66453" },
        { ep: "S01E06", title: "Which way is up?", released: false, word: "77b0e002c7cd39187a3111b45492cf57f509b57312fb573fef2531a863065b73" },
        { ep: "S01E07", title: "A tree made of air" },
        { ep: "S01E08", title: "Leaves change colour" },
        { ep: "S01E09", title: "Bees and honey" },
        { ep: "S01E10", title: "Caterpillar to butterfly" },
        { ep: "S01E11", title: "How birds fly" },
        { ep: "S01E12", title: "Fish breathe water" },
        { ep: "S01E13", title: "Why cats purr" },
        { ep: "S01E14", title: "Why we yawn" },
        { ep: "S01E15", title: "Why we sleep" },
        { ep: "S01E16", title: "What we found", special: true }
      ] },
    { id: "sky", name: "Sky & Planet", icon: "sky", color: "#6F98B3", fill: "#C9DCE6",
      blurb: "Expedition 2 · coming later", reward: "Sky Explorer certificate + wallpaper", range: [17, 28] },
    { id: "sparks", name: "Pushes & Sparks", icon: "bulb", color: "#C8962A", fill: "#F2C85B",
      blurb: "Expedition 3 · coming later", reward: "Spark Explorer certificate + wallpaper", range: [29, 40] },
    { id: "machines", name: "Clever Machines", icon: "gear", color: "#6B3F26", fill: "#C9A68C",
      blurb: "Expedition 4 · coming later", reward: "Machines Explorer certificate + wallpaper", range: [41, 52] }
  ],
  finale: { ep: "S01E53", title: "We made it!" }
};
