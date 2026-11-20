// этот скрипт создаёт файл со стилями, похожий на готовую библиотеку
const fs = require('fs');
 
let css = '';
 
for (let i = 1; i <= 2000; i++) {
  css = css +
    '.ui-block-' + i + ' {\n' +
    '  margin: ' + (i % 20) + 'px;\n' +
    '  padding: ' + (i % 12) + 'px;\n' +
    '  border-radius: ' + (i % 8) + 'px;\n' +
    '  font-size: ' + (12 + i % 6) + 'px;\n' +
    '  line-height: 1.' + (i % 9) + ';\n' +
    '}\n\n';
}
 
// а это единственное правило, которое нам пригодится
css = css +
  '.btn-primary {\n' +
  '  background: #2c6e2f;\n' +
  '  color: #ffffff;\n' +
  '  border: none;\n' +
  '  padding: 8px 16px;\n' +
  '  border-radius: 4px;\n' +
  '  cursor: pointer;\n' +
  '}\n';
 
fs.writeFileSync('public/theme.css', css);
console.log('Файл public/theme.css создан');
