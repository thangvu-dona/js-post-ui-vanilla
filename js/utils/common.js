export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength)}…`; 
}

export function setFieldValue(form, selector, value) {
  if (!form) return;

  const field = form.querySelector(selector);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imgUrl) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.style.backgroundImage = `url("${imgUrl}")`;
}

export function randomNumber(n) {
  if (n<=0) return -1;

  const random = Math.random() * n;
  return Math.round(random);
}