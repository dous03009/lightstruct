
const input = document.getElementById('input');
const preview = document.getElementById('preview');
const draftSelector = document.getElementById('draftSelector');

function getKey() {
  return draftSelector.value;
}

function update() {
  const content = input.value;
  localStorage.setItem(getKey(), content);
  preview.textContent = content;
}

input.addEventListener('input', update);

function insert(symbol) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const text = input.value;
  input.value = text.substring(0, start) + symbol + text.substring(end);
  input.selectionStart = input.selectionEnd = start + symbol.length;
  input.focus();
  update();
}

function switchDraft() {
  const saved = localStorage.getItem(getKey()) || "";
  input.value = saved;
  update();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

window.onload = () => {
  switchDraft();
};
function exportText() {
  const blob = new Blob([input.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = getKey() + ".txt";
  link.href = window.URL.createObjectURL(blob);
  link.click();
}

function clearCurrent() {
  if (confirm("确定要清空当前草稿吗？此操作不可恢复。")) {
    localStorage.removeItem(getKey());
    input.value = "";
    update();
  }
}

input.focus();