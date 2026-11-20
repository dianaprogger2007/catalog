// этот скрипт создаёт большой каталог для опытов
const fs = require('fs');
 
const COUNT = 5000;
const names = ['Кресло', 'Стол', 'Лампа', 'Полка', 'Стул', 'Коврик',
               'Ваза', 'Зеркало', 'Корзина', 'Часы', 'Подушка', 'Пуф'];
 
const products = [];
 
for (let i = 1; i <= COUNT; i++) {
  products.push({
    id: i,
    name: names[i % names.length] + ' № ' + i,
    price: 500 + i * 7,
    img: 'img/' + (i % 3 + 1) + '.jpg'
  });
}
 
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log('Создан каталог из ' + COUNT + ' товаров');
