// бегущие часы: по ним видно, отвечает страница или замерла
setInterval(function () {
  const now = new Date();
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  document.getElementById('clock').textContent =
    now.toLocaleTimeString() + '.' + ms;
}, 50);

// счётчики для панели справа внизу
let filterRuns = 0;
let scrollRuns = 0;
let cartCount = 0;

// сколько товаров просим за раз
const LIMIT = 20;
 
// какая страница уже загружена и сколько их всего
let page = 0;
let pages = 1;
 
// идёт ли сейчас загрузка
let loading = false;
 
// загружает следующую страницу и дописывает её карточки
function loadMore() {
  if (loading || page >= pages) {
    return;
  }
 
  loading = true;
  page = page + 1;
 
  const text = document.querySelector('#search').value;
const address = '/api/products?page=' + page + '&limit=' + LIMIT +
                '&search=' + encodeURIComponent(text);

 
  fetch(address)
    .then(function (response) {
      return response.json();
    })
    .then(function (answer) {
  pages = answer.pages;
  addCards(answer.items);
  fixHeights();

  const shown = document.querySelectorAll('.card').length;
  document.querySelector('#total').textContent =
    'Найдено: ' + answer.total + ', показано: ' + shown;

  const count = document.querySelectorAll('*').length;
  document.querySelector('#nodes').textContent =
    'Элементов на странице: ' + count;

  if (page >= pages) {
    document.querySelector('#more').style.display = 'none';
  }

  loading = false;
});
}
 
// первая страница при открытии сайта
loadMore();

// дописывает карточки в конец каталога
function addCards(products) {
  console.time('Построение карточек');
 
  const box = document.querySelector('.cards');
  let html = '';
 
  // собираем разметку для каждого товара
  for (let i = 0; i < products.length; i++) {
    const item = products[i];
 
    html = html +
      '<article class="card">' +
        '<img src="' + item.img + '" alt="' + item.name + '"' +
             ' width="600" height="450" loading="lazy">' +
        '<h2>' + item.name + '</h2>' +
        '<p class="price">' + item.price + ' руб.</p>' +
        '<button class="btn-primary" data-id="' + item.id + '">' +
          'В корзину</button>' +
      '</article>';
  }
 
  // дописываем всё разом, не трогая уже показанные карточки
  box.insertAdjacentHTML('beforeend', html);
 
  console.timeEnd('Построение карточек');
}


// закрепляет за каждой карточкой её текущую высоту
function fixHeights() {
  console.time('Высота карточек');

  const cards = document.querySelectorAll('.card');

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.minHeight = cards[i].offsetHeight + 'px';
  }

  console.timeEnd('Высота карточек');
}

// начинает каталог заново с первой страницы, уже с учётом поиска
function filterCards() {
  filterRuns = filterRuns + 1;
  document.querySelector('#filterRuns').textContent =
    'Поиск запускался: ' + filterRuns;
 
  document.querySelector('.cards').innerHTML = '';
  document.querySelector('#more').style.display = 'block';
  page = 0;
  pages = 1;
 
  loadMore();
}


// ждём паузу в наборе и только потом ищем
let searchTimer;

// запускаем поиск при каждом изменении поля
document.querySelector('#search').addEventListener('input', function () {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(filterCards, 300);
});

// показывает кнопку «Наверх», когда страница прокручена вниз
function onScroll() {
  scrollRuns++;
  document.querySelector('#scrollRuns').textContent =
    'Прокрутка обработана: ' + scrollRuns;

  const up = document.querySelector('#up');

  if (window.scrollY > 1000) {
    up.style.display = 'block';
  } else {
    up.style.display = 'none';
  }
}

// пропускаем вызовы, если с прошлого прошло меньше 200 мс
let lastScroll = 0;

// проверяем кнопку при каждой прокрутке
window.addEventListener('scroll', function () {
  const now = Date.now();

  if (now - lastScroll < 200) {
    return;
  }

  lastScroll = now;
  onScroll();
});

document.querySelector('#up').addEventListener('click', function () {
  window.scrollTo(0, 0);
});

// кладёт товар в корзину
function addToCart(id) {
  cartCount = cartCount + 1;
  document.querySelector('#cart').textContent = 'В корзине: ' + cartCount;
  console.log('Добавлен товар № ' + id);
}

// один обработчик на весь каталог
document.querySelector('.cards').addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-primary')) {
    addToCart(event.target.dataset.id);
    event.target.textContent = 'В корзине';
    event.target.disabled = true;
  }
});

document.querySelector('#handlers').textContent = 'Обработчиков кнопок: 1';

// кнопка «Показать ещё»
document.querySelector('#more').addEventListener('click', function () {
  loadMore();
});

// раз в секунду считаем, какие файлы пришли по сети, а какие из кеша
setInterval(function () {
  const files = performance.getEntriesByType('resource');
  let fromCache = 0;
  let bytes = 0;
 
  for (let i = 0; i < files.length; i++) {
    bytes = bytes + files[i].transferSize;
 
    if (files[i].transferSize === 0) {
      fromCache = fromCache + 1;
    }
  }
 
  document.querySelector('#fromCache').textContent =
    'Из кеша: ' + fromCache + ' из ' + files.length;
  document.querySelector('#loaded').textContent =
    'Скачано: ' + Math.round(bytes / 1024) + ' кБ';
}, 1000);

