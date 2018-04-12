export function updateBasket() {
  let count = document.getElementById('basket-count');

  let text = basketText();
  if (count.innerText !== text) {
    count.innerText = text;
  }
}

function basketText() {
  let content = basketContent();
  return content ? `(${content.length})` : '(0)';
}

function basketContent() {
  let basket = localStorage.getItem('basket');
  return basket ? JSON.parse(decodeURIComponent(basket)) : basket;
}
