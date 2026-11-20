// показывает, насколько сжимается каждый файл сайта
const fs = require('fs');
const zlib = require('zlib');
 
const files = [
  'products.json',
  'public/index.html',
  'public/script.js',
  'public/style.css',
  'public/theme.css',
  'public/img/1.jpg'
];
 
for (let i = 0; i < files.length; i++) {
  const data = fs.readFileSync(files[i]);
  const packed = zlib.gzipSync(data);
 
  console.log(files[i] + ': ' + data.length + ' -> ' + packed.length + ' байт');
}
// очень маленький ответ
const small = Buffer.from('Файл не найден');
console.log('маленький ответ: ' + small.length + ' -> ' +
            zlib.gzipSync(small).length + ' байт');

for (let i = 0; i < files.length; i++) {
  const data = fs.readFileSync(files[i]);
  const packed = zlib.gzipSync(data);
  const savings = Math.round((1 - packed.length / data.length) * 100);

  console.log(
    files[i] + ': ' + data.length + ' -> ' + packed.length +
    ' байт, экономия ' + savings + '%'
  );
}
// сравниваем уровни сжатия на самом большом файле
const big = fs.readFileSync('public/theme.css');
const levels = [1, 6, 9];
 
for (let i = 0; i < levels.length; i++) {
  const start = performance.now();
  let packed;
 
  // сжимаем сто раз, чтобы время было заметно
  for (let k = 0; k < 100; k++) {
    packed = zlib.gzipSync(big, { level: levels[i] });
  }
 
  const time = Math.round(performance.now() - start);
  console.log('уровень ' + levels[i] + ': ' + packed.length +
              ' байт, сто сжатий за ' + time + ' мс');
}
