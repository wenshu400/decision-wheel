// 模板数据
const templates = {
  lunch: ['沙县小吃', '黄焖鸡米饭', '火锅', '三明治', '寿司', '披萨'],
  weekend: ['宅家追剧', '爬山踏青', '逛街购物', '朋友聚会', '看电影', '咖啡馆发呆'],
  movie: ['动作片', '喜剧片', '科幻片', '恐怖片', '纪录片', '爱情片'],
  activity: ['打游戏', '看书', '健身', '学点新技能', '冥想', '散步']
};

// 获取 DOM 元素
const templateSelect = document.getElementById('template');
const optionsContainer = document.getElementById('options-container');
const addOptionBtn = document.getElementById('add-option');
const removeOptionBtn = document.getElementById('remove-option');
const spinBtn = document.getElementById('spin-btn');
const wheel = document.getElementById('wheel');
const resultDiv = document.getElementById('result');

let currentOptions = ['选项1', '选项2']; // 初始值

// 渲染输入框
function renderOptions() {
  optionsContainer.innerHTML = '';
  currentOptions.forEach(value => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'option-input';
    input.value = value;
    input.addEventListener('input', updateOptionsFromInputs);
    optionsContainer.appendChild(input);
  });
}

// 同步输入框内容
function updateOptionsFromInputs() {
  const inputs = document.querySelectorAll('.option-input');
  currentOptions = Array.from(inputs).map(input => input.value.trim() || `选项${inputs.indexOf(input)+1}`);
  updateWheelColors();
}

// 更新轮盘颜色和文字
function updateWheelColors() {
  const n = currentOptions.length;
  if (n === 0) return;

  const colors = ['#FF5252', '#FF9800', '#FFEB3B', '#8BC34A', '#03A9F4', '#9C27B0',
                  '#E91E63', '#00BCD4', '#795548', '#607D8B', '#CDDC39', '#FFC107'];

  let gradient = '';
  const anglePer = 360 / n;

  for (let i = 0; i < n; i++) {
    const start = (i * anglePer).toFixed(1);
    const end = ((i + 1) * anglePer).toFixed(1);
    gradient += `${colors[i % 12]} ${start}%, `;
    gradient += `${colors[(i + 1) % 12]} ${end}%, `;
  }
  gradient = gradient.slice(0, -2);

  wheel.style.background = `conic-gradient(${gradient})`;

  // 清除旧文字
  Array.from(wheel.children).forEach(child => {
    if (child.tagName === 'DIV' && !child.classList.contains('pointer')) {
      wheel.removeChild(child);
    }
  });

  // 添加新文字
  currentOptions.forEach((text, i) => {
    const angle = (i * 360 / n + 180 / n) * Math.PI / 180;
    const radius = 120;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const textEl = document.createElement('div');
    textEl.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(calc(${x}px - 50%), calc(${y}px - 50%)) rotate(${angle + Math.PI/2}rad);
      color: white;
      font-weight: bold;
      font-size: 14px;
      text-shadow: 1px 1px 2px black;
      pointer-events: none;
    `;
    textEl.textContent = text;
    wheel.appendChild(textEl);
  });
}

// 添加/删除选项
addOptionBtn.addEventListener('click', () => {
  if (currentOptions.length >= 12) return alert('最多12个选项！');
  currentOptions.push('新选项');
  renderOptions();
  updateWheelColors();
});

removeOptionBtn.addEventListener('click', () => {
  if (currentOptions.length <= 2) return alert('至少2个选项！');
  currentOptions.pop();
  renderOptions();
  updateWheelColors();
});

// 模板切换
templateSelect.addEventListener('change', () => {
  const key = templateSelect.value;
  if (key === 'custom') {
    currentOptions = ['选项1', '选项2'];
  } else {
    currentOptions = templates[key];
  }
  renderOptions();
  updateWheelColors();
});

// 旋转逻辑
let isSpinning = false;
spinBtn.addEventListener('click', () => {
  if (isSpinning) return;
  updateOptionsFromInputs();

  const n = currentOptions.length;
  if (n < 2) return alert('至少2个选项！');

  isSpinning = true;
  spinBtn.disabled = true;
  resultDiv.innerHTML = '';

  const randomIndex = Math.floor(Math.random() * n);
  const anglePer = 360 / n;
  const extra = 1800; // 5圈
  const targetAngle = extra + (360 - (randomIndex * anglePer + anglePer / 2));

  wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform = `rotate(${targetAngle}deg)`;

  setTimeout(() => {
    resultDiv.innerHTML = `<strong>最终选择：</strong><br><span style="color:#e91e63;font-size:28px">${currentOptions[randomIndex]}</span>`;
    isSpinning = false;
    spinBtn.disabled = false;
  }, 4000);
});

// 初始化
renderOptions();
updateWheelColors();
