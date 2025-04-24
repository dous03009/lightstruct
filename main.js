
const input = document.getElementById('input');
const preview = document.getElementById('preview');

function update() {
  const content = input.value;
  localStorage.setItem('lightstruct_text', content);
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

window.onload = () => {
  const saved = localStorage.getItem('lightstruct_text');
  if (saved) {
    input.value = saved;
    update();
  }
};

function exportText() {
  const blob = new Blob([input.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "lightstruct_export.txt";
  link.href = window.URL.createObjectURL(blob);
  link.click();
}
