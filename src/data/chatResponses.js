function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maybeAddDisclaimer(lang) {
  const disclaimers = {
    en: [
      "If these feelings feel overwhelming or long-lasting, it might really help to talk to a licensed mental health professional.",
      "Remember, I can give suggestions, but I’m not a replacement for a qualified therapist or doctor.",
      "If this situation feels serious or unsafe, please consider reaching out to a professional or local support service."
    ],
    ua: [
      "Якщо ці відчуття стають надто сильними або тривалими, варто звернутися до кваліфікованого спеціаліста.",
      "Я можу дати лише рекомендації, але не замінюю психолога чи лікаря.",
      "Якщо ситуація здається серйозною або небезпечною — будь ласка, зверніться до фахівця або місцевої служби підтримки."
    ]
  };

  return Math.random() < 0.3 ? " " + randomItem(disclaimers[lang]) : "";
}

export function getAssistantReply(message, lang = "ua") {
  const text = message.toLowerCase();

  const responses = {

    stress: {
      en: [
        "It sounds like you're carrying a lot right now. Stress builds up quietly. What’s been weighing on you the most lately?",
        "Stress often shows up when we try to handle everything alone. Would it help to break things into smaller pieces?",
        "Pause with me for a second. Take a slow breath in… and out. What part of today felt the hardest?"
      ],
      ua: [
        "Схоже, зараз на вас багато навантаження. Що саме найбільше тисне останнім часом?",
        "Стрес часто з’являється, коли ми намагаємось впоратись з усім самі. Можливо, варто розбити це на менші кроки?",
        "Зробімо паузу. Повільний вдих… і видих. Яка частина дня була найскладнішою?"
      ]
    },

    anxiety: {
      en: [
        "Anxiety often comes from uncertainty. What exactly feels uncertain right now?",
        "When anxiety appears, your body is trying to protect you. What thoughts are repeating in your head?",
        "Let’s ground you. Name 3 things you can see right now."
      ],
      ua: [
        "Тривога часто виникає через невизначеність. Що саме зараз здається невизначеним?",
        "Коли з’являється тривога, тіло намагається вас захистити. Які думки повторюються?",
        "Давайте трохи заземлимось. Назвіть 3 речі, які ви бачите прямо зараз."
      ]
    },

    motivation: {
      en: [
        "You don’t need motivation. You need a tiny first step. What is one small action you can take today?",
        "Motivation follows action, not the other way around. What’s the smallest version of your goal?",
        "Sometimes we wait to 'feel ready'. What if you start before you feel ready?"
      ],
      ua: [
        "Вам не потрібна мотивація. Потрібен маленький перший крок. Яку одну дію можна зробити сьогодні?",
        "Мотивація приходить після дії. Яка найменша версія вашої цілі?",
        "Ми часто чекаємо, поки будемо «готові». А що, якщо почати раніше?"
      ]
    },

    sleep: {
      en: [
        "Sleep struggles often connect to racing thoughts. What usually keeps your mind active at night?",
        "Try a simple ritual: dim lights, no screens, slow breathing. Would you like a quick wind-down routine?",
        "Your body loves rhythm. Do you go to bed at roughly the same time?"
      ],
      ua: [
        "Проблеми зі сном часто пов’язані з активними думками. Що зазвичай не дає вам заснути?",
        "Спробуйте ритуал: приглушене світло, без екранів, повільне дихання. Хочете коротку вечірню рутину?",
        "Організм любить ритм. Ви лягаєте спати приблизно в один і той самий час?"
      ]
    },

    overthinking: {
      en: [
        "Overthinking feeds on 'what if'. What is actually happening right now?",
        "If your thoughts had a volume button, how loud would they be right now?",
        "Are these thoughts helpful or just repetitive?"
      ],
      ua: [
        "Надмірні думки живляться «а якщо». А що відбувається реально зараз?",
        "Якби у ваших думок була гучність, наскільки гучно вони звучать?",
        "Ці думки допомагають вам чи просто повторюються?"
      ]
    },

    sadness: {
      en: [
        "I’m sorry you’re feeling this way. Sadness can feel heavy. Do you want to tell me what happened?",
        "Sometimes sadness needs space, not fixing. When did this start?",
        "Are you feeling more tired, empty, or emotional?"
      ],
      ua: [
        "Мені шкода, що вам так. Сум може бути дуже важким. Хочете розповісти, що сталося?",
        "Іноді суму потрібен простір, а не виправлення. Коли це почалось?",
        "Ви більше відчуваєте втому, спустошення чи емоційність?"
      ]
    },

    burnout: {
      en: [
        "Burnout often feels like emotional exhaustion. Do you feel drained even after rest?",
        "When was the last time you truly relaxed without guilt?",
        "What would ‘doing less’ look like for you this week?"
      ],
      ua: [
        "Вигорання часто проявляється як емоційне виснаження. Ви відчуваєте втому навіть після відпочинку?",
        "Коли ви востаннє відпочивали без почуття провини?",
        "Як виглядав би варіант «робити менше» цього тижня?"
      ]
    },

    default: {
      en: [
        "I’m here with you. Tell me a bit more about what’s going on.",
        "That sounds important. I’m listening.",
        "Can you describe how you’re feeling in one sentence?"
      ],
      ua: [
        "Я поруч. Розкажіть трохи більше.",
        "Це звучить важливо. Я слухаю.",
        "Опишіть свій стан одним реченням."
      ]
    },
    breakup: {
  en: [
    "I’m really sorry. Being left can feel like your world shifted suddenly. What hurts the most right now — missing them, or feeling rejected?",
    "Breakups can shake your sense of stability. It’s okay if you feel lost. Do you feel more sadness, anger, or emptiness?",
    "When someone leaves, it doesn’t mean you weren’t enough. It just means the situation wasn’t right. Do you want to tell me what happened?"
  ],
  ua: [
    "Мені дуже шкода. Коли тебе покидають, здається ніби світ різко змінився. Що болить найбільше — сум за людиною чи відчуття відкинутості?",
    "Розрив стосунків може сильно вибити з рівноваги. Це нормально, що ви почуваєтесь розгублено. Більше суму, злості чи порожнечі?",
    "Те, що хтось пішов, не означає, що з вами щось не так. Хочете розповісти, що сталося?"
  ]
},
feeling_bad: {
  en: [
    "I’m really sorry you’re feeling this way. When you say 'I feel bad', is it more emotional pain, physical exhaustion, or something else?",
    "Thank you for saying that. Sometimes just admitting 'I feel bad' is hard. What happened today?",
    "I’m here. You don’t have to carry it alone. Can you describe the feeling a bit more?"
  ],
  ua: [
    "Мені шкода, що вам так. Коли ви кажете «мені погано», це більше про емоції, втому чи щось інше?",
    "Дякую, що сказали це. Іноді навіть визнати «мені погано» непросто. Що сталося сьогодні?",
    "Я поруч. Вам не потрібно тримати це в собі. Опишіть це трохи детальніше."
  ]
},lonely: {
  en: [
    "Loneliness can feel heavy, even in a room full of people. Do you feel alone physically or emotionally?",
    "Feeling lonely doesn’t mean you are unimportant. When did you last feel connected to someone?",
    "Would it help to reach out to one person today, even just with a small message?"
  ],
  ua: [
    "Самотність може бути важкою навіть серед людей. Ви більше відчуваєте фізичну чи емоційну самотність?",
    "Самотність не означає, що ви не важливі. Коли ви востаннє відчували зв’язок з кимось?",
    "Можливо, сьогодні варто написати хоча б одній людині?"
  ]
},anger: {
  en: [
    "Anger usually protects something deeper. What do you feel underneath it?",
    "It’s okay to feel angry. The question is: what triggered it?",
    "Would it help to release some of that tension physically — a walk, push-ups, deep breathing?"
  ],
  ua: [
    "Злість часто захищає щось глибше. Що ви відчуваєте під нею?",
    "Злитись — нормально. Що саме стало тригером?",
    "Можливо, варто фізично випустити напругу — прогулянка, вправи, глибоке дихання?"
  ]
},fear: {
  en: [
    "Fear often tries to prepare us for danger. What exactly are you afraid might happen?",
    "Is this fear about something happening now, or something that might happen?",
    "Let’s slow it down. On a scale from 1 to 10, how intense is this fear?"
  ],
  ua: [
    "Страх намагається підготувати нас до небезпеки. Чого саме ви боїтесь?",
    "Цей страх про щось, що відбувається зараз, чи про можливий сценарій?",
    "Давайте сповільнимось. По шкалі від 1 до 10 — наскільки сильний цей страх?"
  ]
},crisis: {
  en: [
    "I’m really concerned reading this. If you are thinking about harming yourself or feel unsafe, please contact local emergency services or a crisis hotline immediately.",
    "You matter more than this moment. Please reach out to a trusted person or a professional right now."
  ],
  ua: [
    "Мене турбує те, що ви написали. Якщо у вас є думки про самопошкодження або ви почуваєтесь у небезпеці — негайно зверніться до екстрених служб або на гарячу лінію.",
    "Ваше життя має цінність. Будь ласка, зверніться до близької людини або спеціаліста прямо зараз."
  ]
},
frustration: {
  en: [
    "That sounds really frustrating. When things don’t go the way we expect, it can feel like losing control. What exactly feels 'not right' right now?",
    "It’s exhausting when reality doesn’t match expectations. Is it one specific situation or everything at once?",
    "I hear irritation and maybe disappointment too. Are you more angry at the situation or at yourself?"
  ],
  ua: [
    "Це звучить як сильне роздратування. Коли реальність не збігається з очікуваннями, здається ніби втрачаєш контроль. Що саме зараз «не так»?",
    "Виснажує, коли все йде не за планом. Це одна конкретна ситуація чи відчуття, що все одночасно валиться?",
    "Я чую злість і, можливо, розчарування. Ви більше злитесь на ситуацію чи на себе?"
  ]
},
mood_patterns: {
  en: [
    "Mood patterns often follow triggers. Have you noticed if your mood shifts more because of people, workload, or lack of rest?",
    "Your mood isn’t random — it usually responds to something. Do your emotional lows happen at specific times of day?",
    "Let’s observe it together. When you feel good, what’s usually present? When you feel low, what’s missing?"
  ],
  ua: [
    "Патерни настрою зазвичай мають тригери. Ви помічали, що більше впливає — люди, навантаження чи нестача відпочинку?",
    "Настрій рідко буває випадковим — він на щось реагує. Чи є певний час доби, коли стає гірше?",
    "Спробуймо проаналізувати. Коли вам добре — що тоді є у вашому житті? А коли погано — чого бракує?"
  ]
},need_motivation: {
  en: [
    "You don’t need a burst of motivation — you need momentum. What’s one action that takes less than 5 minutes?",
    "Start small. Tiny progress beats perfect planning. What can you begin right now?",
    "Future you will thank present you for even a small step today."
  ],
  ua: [
    "Вам не потрібен вибух мотивації — вам потрібен рух. Який крок займе менше 5 хвилин?",
    "Почніть з малого. Маленький прогрес краще за ідеальний план. Що можна зробити прямо зараз?",
    "Майбутній ви подякує сьогоднішньому навіть за невеликий крок."
  ]
},today_stress: {
  en: [
    "If today feels overwhelming, let’s shrink it. What is the one thing that truly must be done today?",
    "Stress today doesn’t define your whole life. What part of it can you control right now?",
    "Take one slow breath. Today is just 24 hours — not forever."
  ],
  ua: [
    "Якщо сьогодні все здається надто складним — звузимо фокус. Що справді потрібно зробити саме сьогодні?",
    "Сьогоднішній стрес — це не все ваше життя. На що ви можете вплинути прямо зараз?",
    "Зробіть повільний вдих. Сьогодні — це лише 24 години, не назавжди."
  ]
},how_anxiety: {
  en: [
    "First, slow your breathing. Inhale for 4, hold for 4, exhale for 6. Repeat 5 times.",
    "Anxiety lives in the future. Bring yourself to the present — what can you physically feel right now?",
    "Write down the worst-case scenario. Then ask: how likely is it really?"
  ],
  ua: [
    "Спочатку сповільніть дихання: вдих на 4, пауза на 4, видих на 6. Повторіть 5 разів.",
    "Тривога живе в майбутньому. Поверніться в теперішній момент — що ви фізично відчуваєте зараз?",
    "Запишіть найгірший сценарій. А тепер чесно: наскільки він імовірний?"
  ]
},emotional_exhaustion: {
  en: [
    "Emotional exhaustion often comes from long-term pressure. Have you been ‘holding it together’ for too long?",
    "Do you feel tired even after rest? That’s often a sign of emotional overload.",
    "What have you been tolerating silently lately?"
  ],
  ua: [
    "Емоційне виснаження часто виникає через довгий внутрішній тиск. Ви занадто довго «трималися»?",
    "Ви відчуваєте втому навіть після відпочинку? Це ознака емоційного перевантаження.",
    "Що ви останнім часом мовчки терпите?"
  ]
},calm_now: {
  en: [
    "Look around and name 5 things you see, 4 things you hear, 3 things you feel physically.",
    "Place your hand on your chest. Breathe slowly. Your body needs safety signals.",
    "Unclench your jaw. Drop your shoulders. Slow breath in… slow breath out."
  ],
  ua: [
    "Озирніться і назвіть 5 речей, які бачите, 4 — які чуєте, 3 — які фізично відчуваєте.",
    "Покладіть руку на груди. Повільне дихання. Вашому тілу потрібен сигнал безпеки.",
    "Розслабте щелепу. Опустіть плечі. Повільний вдих… і повільний видих."
  ]
},improve_sleep: {
  en: [
    "Go to bed and wake up at the same time — even on weekends.",
    "Avoid screens at least 60 minutes before sleep.",
    "If your mind races, write your thoughts down before bed."
  ],
  ua: [
    "Лягайте спати і прокидайтесь в один і той самий час — навіть у вихідні.",
    "Уникайте екранів за 60 хвилин до сну.",
    "Якщо думки не дають спати — запишіть їх перед сном."
  ]
},low_productivity: {
  en: [
    "Low productivity often hides exhaustion. Are you tired or avoiding something?",
    "Instead of doing everything, choose one priority task.",
    "Productivity drops when perfectionism rises. Are you expecting too much from yourself?"
  ],
  ua: [
    "Непродуктивність часто приховує втому. Ви виснажені чи уникаєте чогось?",
    "Замість «зробити все» — оберіть одну пріоритетну задачу.",
    "Продуктивність падає, коли росте перфекціонізм. Ви не надто багато від себе очікуєте?"
  ]
},breathing_exercise: {
  en: [
    "Try box breathing: inhale 4 — hold 4 — exhale 4 — hold 4. Repeat 4 times.",
    "Inhale deeply through your nose, exhale slowly through your mouth. Focus only on air moving.",
    "Count each exhale from 1 to 10 slowly."
  ],
  ua: [
    "Спробуйте квадратне дихання: вдих 4 — пауза 4 — видих 4 — пауза 4. Повторіть 4 рази.",
    "Глибокий вдих через ніс, повільний видих через рот. Зосередьтесь лише на повітрі.",
    "Повільно рахуйте кожен видих від 1 до 10."
  ]
},stop_overthinking: {
  en: [
    "Ask yourself: is this a problem to solve or just a thought to observe?",
    "Schedule ‘worry time’ — 10 minutes later. Not now.",
    "Shift from thinking to action. What tiny action breaks the loop?"
  ],
  ua: [
    "Запитайте себе: це проблема, яку треба вирішити, чи просто думка?",
    "Відкладіть «час для переживань» на 10 хвилин пізніше. Не зараз.",
    "Перейдіть від думок до дії. Яка маленька дія розірве цикл?"
  ]
}
  };

  let category = "default";

  if (text.includes("stress") || text.includes("стрес")) category = "stress";
  else if (text.includes("anxiety") || text.includes("трив")) category = "anxiety";
  else if (text.includes("motivation") || text.includes("мотивац")) category = "motivation";
  else if (text.includes("sleep") || text.includes("сон")) category = "sleep";
  else if (text.includes("overthinking") || text.includes("думк")) category = "overthinking";
  else if (text.includes("sad") || text.includes("сум")) category = "sadness";
  else if (text.includes("burnout") || text.includes("вигоран")) category = "burnout";
  else if (text.includes("мені погано") || text.includes("i feel bad")) category = "feeling_bad";
else if (text.includes("патерн")) category = "mood_patterns";
else if (text.includes("потрібна мотивація")) category = "need_motivation";
else if (text.includes("сьогодні") && text.includes("стрес")) category = "today_stress";
else if (text.includes("як впоратися") && text.includes("трив")) category = "how_anxiety";
else if (text.includes("емоційно виснаж")) category = "emotional_exhaustion";
else if (text.includes("заспокоїтися")) category = "calm_now";
else if (text.includes("покращити") && text.includes("сон")) category = "improve_sleep";
else if (text.includes("непродуктив")) category = "low_productivity";
else if (text.includes("дихальн")) category = "breathing_exercise";
else if (text.includes("надмірн") || text.includes("overthink")) category = "stop_overthinking";
else if (text.includes("покин") || text.includes("break up") || text.includes("left me")) category = "breakup";

else if (text.includes("самот") || text.includes("lonely")) category = "lonely";

else if (text.includes("злий") || text.includes("angry") || text.includes("злість")) category = "anger";

else if (text.includes("страш") || text.includes("fear") || text.includes("боюсь")) category = "fear";

else if (
  text.includes("не хочу жити") ||
  text.includes("kill myself") ||
  text.includes("суїцид") ||
  text.includes("harm myself")
) category = "crisis";

else if (
  text.includes("бісить") ||
  text.includes("дратує") ||
  text.includes("все не так") ||
  text.includes("annoy") ||
  text.includes("frustrat")
) category = "frustration";
  const reply = randomItem(responses[category][lang]);

  return reply + maybeAddDisclaimer(lang);
}