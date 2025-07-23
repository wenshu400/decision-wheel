const templates = {
  lunch: ['沙县小吃', '黄焖鸡米饭', '火锅', '三明治', '寿司', '披萨'],
  weekend: ['宅家追剧', '爬山踏青', '逛街购物', '朋友聚会', '看电影', '咖啡馆发呆'],
  movie: ['动作片', '喜剧片', '科幻片', '恐怖片', '纪录片', '爱情片'],
  activity: ['打游戏', '看书', '健身', '学点新技能', '冥想', '散步']
};

const templateSelect = document.getElementById('template');
const optionsContainer = document.getElementById('options-container');
const addOptionBtn = document.getElementById('add-option');
const removeOptionBtn = document.getElementById('remove-option');
const spinBtn = document.getElementById('spin-btn');
const wheel = document.getElementById('wheel');
const resultDiv = document.getElementById('result');

let currentOptions = ['', ''];

function renderOptions() {
  optionsContainer.innerHTML = '';
  currentOptions.forEach(value => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'option-input';
    input.placeholder = '输入选项';
    input.value = value;
    input.addEventListener('input', updateOptionsFromInputs);
    optionsContainer.appendChild(input);
  });
}

function updateOptionsFromInputs() {
  const inputs = document.querySelectorAll('.option-input');
  currentOptions = Array.from(inputs).map(input => input.value.trim() || `选项${inputs.indexOf(input)+1}`);
  updateWheelColors();
}

function updateWheelColors() {
  const n = currentOptions.length;
  if (n === 0) return;

  const colors = [
    '#FF5252', '#FF9800', '#FFEB3B', '#8BC34A', '#03A9F4',
    '#9C27B0', '#E91E63', '#00BCD4', '#795548', '#607D8B',
    '#CDDC39', '#FFC107'
  ];

  let gradient = '';
  let anglePer = 360 / n;

  for (let i = 0; i < n; i++) {
    const start = (i * anglePer).toFixed(1);
    const end = ((i + 1) * anglePer).toFixed(1);
    gradient += `${colors[i % colors.length]} ${start}%, `;
    gradient += `${colors[(i + 1) % colors.length]} ${end}%, `;
  }
  gradient = gradient.slice(0, -2);

  wheel.style.background = `conic-gradient(${gradient})`;

  while (wheel.firstChild) {
    if (wheel.firstChild.tagName !== 'DIV') break;
    wheel.removeChild(wheel.firstChild);
  }

  currentOptions.forEach((text, i) => {
    const textEl = document.createElement('div');
    const angle = (i * anglePer + anglePer / 2) * (Math.PI / 180);
    const radius = 120;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    textEl.style.position = 'absolute';
    textEl.style.left = '50%';
    textEl.style.top = '50%';
    textEl.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%)) rotate(${angle + Math.PI/2}rad)`;
    textEl.style.color = 'white';
    textEl.style.fontWeight = 'bold';
    textEl.style.fontSize = '14px';
    textEl.style.textShadow = '1px 1px 2px black';
    textEl.style.pointerEvents = 'none';
    textEl.textContent = text;

    wheel.appendChild(textEl);
  });
}

addOptionBtn.addEventListener('click', () => {
  if (currentOptions.length >= 12) return alert('最多支持12个选项！');
  currentOptions.push('');
  renderOptions();
});

removeOptionBtn.addEventListener('click', () => {
  if (currentOptions.length <= 2) return alert('至少保留2个选项！');
  currentOptions.pop();
  renderOptions();
});

templateSelect.addEventListener('change', () => {
  const selected = templateSelect.value;
  if (selected === 'custom') {
    currentOptions = ['', ''];
  } else {
    currentOptions = templates[selected];
  }
  renderOptions();
  updateWheelColors();
});

let isSpinning = false;
spinBtn.addEventListener('click', () => {
  if (isSpinning) return;
  updateOptionsFromInputs();

  const n = currentOptions.length;
  if (n < 2) return alert('至少需要2个有效选项！');

  isSpinning = true;
  spinBtn.disabled = true;
  resultDiv.textContent = '';

  const randomIndex = Math.floor(Math.random() * n);
  const anglePer = 360 / n;
  const targetAngle = 1800 + (360 - (randomIndex * anglePer + anglePer / 2));

  wheel.style.transform = `rotate(${targetAngle}deg)`;

  setTimeout(() => {
    resultDiv.innerHTML = `<span style="color:#6200ea">最终选择：</span><br><span style="color:#e91e63; font-size:28px;">${currentOptions[randomIndex]}</span>`;
    isSpinning = false;
    spinBtn.disabled = false;
  }, 4000);
});

renderOptions();
updateWheelColors();
