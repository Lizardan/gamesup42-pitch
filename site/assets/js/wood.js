/* Woodberry: meeting places and branching dialogue */
(() => {
  const stage = document.getElementById('woodStage');
  if (!stage) return;

  const places = {
    barn: { name: 'Амбар · ночь', intro: 'Аколют ждёт у амбара. В свете фонаря видно, как дрожат руки.' },
    cathedral: { name: 'Собор · утро', intro: 'Аколют стоит у собора. Колокол молчит, и это хуже любого звона.' }
  };

  const nodes = {
    start: (place) => ({
      text: places[place].intro,
      choices: [
        ['«Мне нужна помощь»', 'help', 10],
        ['«Кто тебя напугал?»', 'scared', 5],
        ['«Ты сам убил?»', 'accuse', -15]
      ]
    }),
    help: {
      text: '«Тогда слушай: утром у амбара видели человека в чужом плаще. Он шёл к собору.»',
      choices: [['«Запомнить»', 'end', 5], ['«Проверить»', 'end', 2]]
    },
    scared: {
      text: '«Не знаю. Но ночью в соборе пели, хотя двери были заперты.»',
      choices: [['«Я разберусь»', 'end', 6]]
    },
    accuse: {
      text: '«Нет. Я… я только нашёл тело.» Голос срывается.',
      choices: [['«Верю»', 'end', 10], ['«Не ври»', 'end', -10]]
    },
    end: {
      text: '«Приходи к полуночи. Я оставлю дверь открытой.»',
      choices: [['Начать заново', 'start', 0]]
    }
  };

  let place = 'barn';
  let trust = 40;

  const textEl = document.getElementById('woodText');
  const choicesEl = document.getElementById('woodChoices');
  const trustEl = document.getElementById('woodTrust');
  const placeEl = document.getElementById('woodPlace');

  function setTrust(delta) {
    trust = Math.max(0, Math.min(100, trust + delta));
    trustEl.style.width = trust + '%';
  }

  function render(key) {
    const node = typeof nodes[key] === 'function' ? nodes[key](place) : nodes[key];
    textEl.textContent = node.text;
    textEl.classList.remove('swap');
    void textEl.offsetWidth;
    textEl.classList.add('swap');
    choicesEl.innerHTML = '';
    node.choices.forEach(([label, next, delta]) => {
      const b = document.createElement('button');
      b.className = 'wood-choice';
      b.textContent = label;
      b.addEventListener('click', () => {
        setTrust(delta);
        render(next);
      });
      choicesEl.appendChild(b);
    });
  }

  function setPlace(next) {
    place = next;
    stage.dataset.place = next;
    placeEl.textContent = places[next].name;
    stage.querySelectorAll('.wood-bg').forEach((el) => {
      el.classList.toggle('on', el.dataset.place === next);
    });
    document.querySelectorAll('.wood-tab').forEach((b) => {
      b.classList.toggle('on', b.dataset.place === next);
    });
    trust = 40;
    trustEl.style.width = '40%';
    render('start');
  }

  document.querySelectorAll('.wood-tab').forEach((b) => {
    b.addEventListener('click', () => setPlace(b.dataset.place));
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          stage.classList.add('in');
          io.unobserve(stage);
        }
      });
    }, { threshold: 0.2 });
    io.observe(stage);
  } else {
    stage.classList.add('in');
  }

  setPlace('barn');
})();