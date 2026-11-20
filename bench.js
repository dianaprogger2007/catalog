// отправляет серверу много запросов подряд и меряет время
const COUNT = 1000;
const ADDRESS = 'http://localhost:3000/api/products?page=';
 
async function main() {
  const start = performance.now();
 
  for (let i = 0; i < COUNT; i++) {
    const page = i % 250 + 1;
    const response = await fetch(ADDRESS + page);
    await response.text();
  }
 
  const time = performance.now() - start;
  const average = (time / COUNT).toFixed(2);
  const perSecond = Math.round(COUNT / time * 1000);
 
  console.log(COUNT + ' запросов за ' + Math.round(time) + ' мс');
  console.log('в среднем ' + average + ' мс на запрос');
  console.log('примерно ' + perSecond + ' запросов в секунду');
}
 
main();
