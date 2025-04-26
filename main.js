const input = document.getElementById('input');
const preview = document.getElementById('preview');
const draftSelector = document.getElementById('draftSelector');

// GitHub Gist 配置
const gistId = '4191de8cc2f796158506f61f7c2d533f';
const token = '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';

function getKey() {
  return draftSelector.value; // draft_1, draft_2, ...
}

// 更新预览（本地预览，不影响云端）
function updatePreview() {
  preview.textContent = input.value;
}

// 插入符号
function insert(symbol) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const text = input.value;
  input.value = text.substring(0, start) + symbol + text.substring(end);
  input.selectionStart = input.selectionEnd = start + symbol.length;
  input.focus();
  updatePreview();
}

// 切换草稿时，从Gist加载对应内容
async function switchDraft() {
  const fileName = getKey() + '.txt'; // 比如 draft_1.txt
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: { 'Authorization': `token ${token}` }
    });
    const data = await response.json();
    const content = data.files[fileName]?.content || '';
    input.value = content;
    updatePreview();
    console.log(`✅ 成功读取草稿：${fileName}`);
  } catch (error) {
    console.error('❌ 加载草稿失败:', error);
    input.value = '';
    updatePreview();
  }
}

// 保存当前输入内容到Gist
async function update() {
  const fileName = getKey() + '.txt';
  const content = input.value;
  try {
    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          [fileName]: { content: content }
        }
      })
    });
    console.log(`✅ 成功保存草稿：${fileName}`);
  } catch (error) {
    console.error('❌ 保存草稿失败:', error);
  }
  updatePreview();
}

// 夜间模式
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// 导出文本
function exportText() {
  const blob = new Blob([input.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = getKey() + ".txt";
  link.href = window.URL.createObjectURL(blob);
  link.click();
}

// 清空当前草稿（清空输入框 + 云端也清空）
async function clearCurrent() {
  if (confirm("确定要清空当前草稿吗？此操作不可恢复。")) {
    input.value = "";
    update(); // 保存一个空内容到Gist
    updatePreview();
  }
}

input.addEventListener('input', update);

window.onload = () => {
  switchDraft();
  input.focus();
};