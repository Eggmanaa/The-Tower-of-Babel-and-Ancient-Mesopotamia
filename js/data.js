// ============================================================
//  THE TOWER OF BABEL — all script, levels, questions, and asset ids
//  Voice ids map to  assets/audio/voice/<id>.mp3
//  Image names map to assets/images/<name>
//  If a file is missing the game falls back to text-to-speech /
//  a pixel-art placeholder, so everything still plays.
// ============================================================

const GAME_DATA = {

  title: [
    { who: 'narrator', voice: 'vo_title_01', text: 'The Tower of Babel! Press start to begin your adventure.' },
  ],

  // ---------- INTRO CINEMATIC ----------
  intro: [
    { who: 'narrator', voice: 'vo_intro_01', text: 'Long, long ago, in a land called Mesopotamia, the people built a very tall tower.' },
    { who: 'narrator', voice: 'vo_intro_02', text: 'Our Bible History Explorer is traveling back in time to see it!', fx: 'arrive' },
    { who: 'explorer', voice: 'vo_intro_03', text: 'Whoa! That tower is enormous!' },
    { who: 'priest',   voice: 'vo_intro_04', text: 'Welcome, traveler! Come, let me show you our great tower. We built it all by ourselves!', fx: 'priest-enter' },
    { who: 'explorer', voice: 'vo_intro_05', text: 'Hmm... that doesn\'t seem like a good idea.' },
    { who: 'priest',   voice: 'vo_intro_06', text: 'Nonsense! We will climb all the way to heaven and make a great name for ourselves. Follow me!' },
    { who: 'narrator', voice: 'vo_intro_07', text: 'Let\'s follow the priest up the tower. Tap on things to learn about them!' },
  ],

  // ---------- LEVELS ----------
  levels: [
    {
      id: 1,
      name: 'Foundation & Writing',
      priestIntro: { who: 'priest', voice: 'vo_l1_intro', text: 'This is the bottom of the tower. Look at all our wonderful things!' },
      items: [
        { id: 'tablet', name: 'Clay Tablet', icon: 'tablet', image: 'l1_tablet.jpg',
          voice: 'vo_l1_item_tablet',
          text: 'This is a clay tablet. People pressed a pointed stick into soft clay to make marks. This kind of writing is called cuneiform.' },
        { id: 'bronze', name: 'Bronze Figures', icon: 'vessel', image: 'l1_bronze.jpg',
          voice: 'vo_l1_item_bronze',
          text: 'These little figures are made of bronze. Workers melted metal and poured it into a mold to make shapes.' },
        { id: 'statue', name: 'Little Statue', icon: 'statue', image: 'l1_statue.jpg',
          voice: 'vo_l1_item_statue',
          text: 'This little statue is very old. People made statues of themselves to stand in the temple and pray.' },
      ],
      question: {
        voice: 'vo_l1_question', text: 'What was the writing system used in ancient Mesopotamia?',
        answers: [
          { voice: 'vo_l1_answer_a', text: 'Cuneiform', correct: true },
          { voice: 'vo_l1_answer_b', text: 'Crayons' },
          { voice: 'vo_l1_answer_c', text: 'Emojis' },
        ],
      },
    },
    {
      id: 2,
      name: 'Kings & Law',
      priestIntro: { who: 'priest', voice: 'vo_l2_intro', text: 'Up we go! Here you can see our mighty king.' },
      items: [
        { id: 'king', name: 'King Hammurabi', icon: 'king', image: 'l2_hammurabi.jpg',
          voice: 'vo_l2_item_statue',
          text: 'This is King Hammurabi. He was a very powerful king.' },
        { id: 'code', name: 'The Code of Hammurabi', icon: 'stele', image: 'l2_code.jpg',
          voice: 'vo_l2_item_code',
          text: 'King Hammurabi wrote a big list of rules on a tall stone so everyone could be treated fairly. It is called the Code of Hammurabi.' },
      ],
      question: {
        voice: 'vo_l2_question', text: 'Which king made a list of laws to help people be fair to each other?',
        answers: [
          { voice: 'vo_l2_answer_a', text: 'King Hammurabi', correct: true },
          { voice: 'vo_l2_answer_b', text: 'King Kong' },
          { voice: 'vo_l2_answer_c', text: 'The Burger King' },
        ],
      },
    },
    {
      id: 3,
      name: 'Epic Literature',
      priestIntro: { who: 'priest', voice: 'vo_l3_intro', text: 'Higher still! These carvings tell our greatest story.' },
      items: [
        { id: 'hero', name: 'Gilgamesh', icon: 'gilgamesh', image: 'l3_gilgamesh.jpg',
          voice: 'vo_l3_item_hero',
          text: 'This is Gilgamesh. He was a hero in a very long story called the Epic of Gilgamesh.' },
        { id: 'friend', name: 'Enkidu', icon: 'enkidu', image: 'l3_enkidu.jpg',
          voice: 'vo_l3_item_friend',
          text: 'This is Enkidu, Gilgamesh\'s best friend. Together they went on big adventures.' },
        { id: 'flood', name: 'The Flood Tablet', icon: 'flood', image: 'l3_flood.jpg',
          voice: 'vo_l3_item_flood',
          text: 'The story even tells about a great flood, just like the story of Noah in the Bible!' },
      ],
      question: {
        voice: 'vo_l3_question', text: 'What is the name of the famous story from ancient Mesopotamia?',
        answers: [
          { voice: 'vo_l3_answer_a', text: 'The Epic of Gilgamesh', correct: true },
          { voice: 'vo_l3_answer_b', text: 'The Three Little Pigs' },
          { voice: 'vo_l3_answer_c', text: 'Goodnight Moon' },
        ],
      },
    },
    {
      id: 4,
      name: 'People & Farming',
      priestIntro: { who: 'priest', voice: 'vo_l4_intro', text: 'Almost there! See how everyone has a job in our city.' },
      items: [
        { id: 'king', name: 'The King', icon: 'king', image: 'l4_king.jpg',
          voice: 'vo_l4_item_king',
          text: 'The king was at the top. He was in charge of everyone.' },
        { id: 'priest', name: 'A Priest', icon: 'priest', image: 'l4_priest.jpg',
          voice: 'vo_l4_item_priest',
          text: 'Priests worked in the temple.' },
        { id: 'worker', name: 'Farmers & Workers', icon: 'worker', image: 'l4_worker.jpg',
          voice: 'vo_l4_item_worker',
          text: 'Farmers and workers grew food and built the buildings.' },
        { id: 'slave', name: 'Slaves', icon: 'slave', image: 'l4_slave.jpg',
          voice: 'vo_l4_item_slave',
          text: 'Some people were slaves. They had to work very hard and were not free.' },
        { id: 'canal', name: 'Canals', icon: 'canal', image: 'l4_canal.jpg',
          voice: 'vo_l4_item_canal',
          text: 'Farmers dug long ditches called canals to bring river water to their fields so crops could grow.' },
      ],
      question: {
        voice: 'vo_l4_question', text: 'How did farmers get water to their fields?',
        answers: [
          { voice: 'vo_l4_answer_a', text: 'They dug canals from the river', correct: true },
          { voice: 'vo_l4_answer_b', text: 'They waited for it to snow' },
          { voice: 'vo_l4_answer_c', text: 'They used a garden hose' },
        ],
      },
    },
    {
      id: 5,
      name: 'Royal Tombs',
      priestIntro: { who: 'priest', voice: 'vo_l5_intro', text: 'This is the top of our tower! One last thing to show you.' },
      items: [
        { id: 'tomb', name: 'A Royal Tomb', icon: 'tomb', image: 'l5_tomb.jpg',
          voice: 'vo_l5_item_tomb',
          text: 'When a king died, he was buried in a big tomb with gold, jewelry, and musical instruments.' },
        { id: 'helpers', name: 'The King\'s Helpers', icon: 'helpers', image: 'l5_helpers.jpg',
          voice: 'vo_l5_item_helpers',
          text: 'Sadly, the king\'s servants were buried with him too. The people believed he would need helpers in the next life. The Bible teaches us that every person is precious to God.' },
        { id: 'lyre', name: 'The Golden Lyre', icon: 'lyre', image: 'l5_lyre.jpg',
          voice: 'vo_l5_item_lyre',
          text: 'This is a golden lyre, a kind of harp. It was found in a royal tomb.' },
      ],
      question: {
        voice: 'vo_l5_question', text: 'What did the people put in the king\'s tomb?',
        answers: [
          { voice: 'vo_l5_answer_a', text: 'Gold, treasures, and his helpers', correct: true },
          { voice: 'vo_l5_answer_b', text: 'A bicycle' },
          { voice: 'vo_l5_answer_c', text: 'Pizza' },
        ],
      },
    },
  ],

  // ---------- FINAL CINEMATIC ----------
  finale: [
    { who: 'priest',   voice: 'vo_end_01', text: 'Look! We did it! We reached the sky! Soon we will be as great as God himself!' },
    { who: 'narrator', voice: 'vo_end_02', text: 'Suddenly... thunder rumbled and lightning flashed!', fx: 'storm' },
    { who: 'explorer', voice: 'vo_end_03', text: 'I remember this from the Bible! God saw the tower, and He was not pleased.' },
    { who: 'narrator', voice: 'vo_end_04', text: 'God confused their language so they could not understand each other.', fx: 'thunder' },
    { who: 'priest',   voice: 'vo_end_05', text: 'Blib-blab-orpa-dee?! Snorf gabba wee! Fleeb norp!', fx: 'confused' },
    { who: 'explorer', voice: 'vo_end_06', text: 'He can\'t understand me anymore!' },
    { who: 'narrator', voice: 'vo_end_07', text: 'The priest ran away in fear, and the people scattered all over the earth.', fx: 'flee' },
    { who: 'narrator', voice: 'vo_end_08', text: 'That is why the tower is called Babel, because God mixed up their words.', fx: 'calm' },
  ],

  // ---------- FINAL THEOLOGY QUESTIONS ----------
  theology: [
    {
      voice: 'vo_q1_question', text: 'Can people climb up to reach God? Or does God have to come down to reach us?',
      answers: [
        { voice: 'vo_q1_answer_a', text: 'God has to reach us', correct: true },
        { voice: 'vo_q1_answer_b', text: 'We can climb up to God' },
      ],
    },
    {
      voice: 'vo_q2_question', text: 'How does God reach us?',
      answers: [
        { voice: 'vo_q2_answer_a', text: 'Through Jesus Christ', correct: true },
        { voice: 'vo_q2_answer_b', text: 'Through a very tall tower' },
      ],
    },
  ],

  victory: { who: 'narrator', voice: 'vo_end_09', text: 'That\'s right! God came down to us through Jesus. You did it, Explorer!' },

  // ---------- REUSABLE LINES ----------
  feedback: {
    correct: [
      { voice: 'vo_correct_01', text: 'That\'s right!' },
      { voice: 'vo_correct_02', text: 'Great job!' },
      { voice: 'vo_correct_03', text: 'You got it!' },
    ],
    wrong: [
      { voice: 'vo_wrong_01', text: 'Not quite. Try again!' },
      { voice: 'vo_wrong_02', text: 'Hmm, let\'s look around some more.' },
    ],
    hintTap:   { who: 'narrator', voice: 'vo_hint_tap',   text: 'Tap on the glowing things to learn about them.' },
    hintReady: { who: 'narrator', voice: 'vo_hint_ready', text: 'You\'ve found everything! Now answer the question.' },
    levelUp:   { who: 'priest',   voice: 'vo_levelup',    text: 'Come along! Up to the next level!' },
  },
};
