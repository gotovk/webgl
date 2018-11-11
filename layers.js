document.body.style.overflow = 'hidden';
document.body.style.margin = '0px';
document.body.style.padding = '0px';

const root = document.getElementById('root');

const width = Math.round(window.innerWidth);
const height = Math.round(window.innerHeight);

function addLayer(elem) {
  elem.style.position = 'absolute';
  elem.style.top = '0px';
  elem.style.left = '0px';
  root.appendChild(elem);
}

function makeSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const sel = d3.select(svg).attr('viewBox', `0 0 ${width} ${height}`);
  return sel;
}

const lowSVG = makeSVG();
const lowSVGG = lowSVG.append('g');
const webglCanvas = document.createElement('canvas');
const upSVG = makeSVG();
const upSVGG = upSVG.append('g');
const rightPanel = document.createElement('div');
rightPanel.style.position = 'absolute';
rightPanel.style.top = '0px';
rightPanel.style.bottom = '0px';
rightPanel.style.right = '0px';
rightPanel.style.width = '400px';
rightPanel.style.display = 'block';
rightPanel.style.background = 'rgba(0, 0, 0, 0.5)';
rightPanel.style.color = 'white';
rightPanel.style.padding = '15px';
rightPanel.style.fontFamily = 'Arial';

const semaphoreBlood = [
  ['I', '+'],
  ['II', '+'],
  ['III', '+'],
  ['IV', '+'],
  ['I', '-'],
  ['II', '-'],
  ['III', '-'],
  ['IV', '-'],
];

function updatePanel(stationNo) {
  const station = bloodStationsData[stationNo];
  const { semaphore, r1 } = station;
  console.log('updatePanel');
  let html = `<div style="font-size: 25px; margin-top: 0px; margin-bottom: 15px">Пункт сдачи крови №${stationNo}</div>`;
  semaphoreBlood.forEach(([num, resus]) => {
    const numNo = {'I': 0, 'II': 1, 'III': 2, 'IV': 3}[num];
    const resusNo = {'+': 0, '-': 1}[resus];
    const color = bloodColors[numNo][resusNo];
    html += `<div style="text-baseline: middle; line-height: 2; height: 50px;"><div style="text-align: right; padding-right: 15px; display: inline-block; width: 70px; font-size: 25px; color: ${color}">
      ${num}${resus}
    </div>`;
    html += `<div style="display: inline-block; font-size: 25px; margin-top: 15px">`
    if (semaphore[numNo][resusNo]) {
      html += `<input type="button" value="Нужна кровь. Записаться на сдачу" style="width: 300px; cursor: pointer; background: blue; display: inline-block; padding: 5px; font-weight: bold; color: white; border: none; border-radius: 5px">`;
    } else {
      html += `<input type="button" value="Узнать, когда можно сдавать кровь" style="width: 300px; cursor: pointer; background: gray; display: inline-block; padding: 5px; font-weight: bold; color: white; border: none; border-radius: 5px">`;
    }
    html += `</div></div>`;
  });
  html += '<div style="margin-left: 85px">';
  html += `<input type="button" value="Задать вопрос на форуме" style="margin-top: 60px; width: 300px; cursor: pointer; background: green; display: block; padding: 5px; font-weight: bold; color: white; border: none; border-radius: 5px">`;
  html += '<div style="margin: 10px; font-size: 15px; color: lightgreen">';
  html += `Вступайте в сообщество доноров центра сдачи крови №${stationNo}. Нас уже ${Math.round(r1 * r1)}!`;
  html += '</div>';
  html += '</div>';
  html += '<div style="margin-left: 85px">';
  html += `<input type="button" value="Сообщить о неточности" style="margin-top: 60px; width: 300px; cursor: pointer; background: gray; display: inline-block; padding: 5px; font-weight: bold; color: white; border: none; border-radius: 5px">`;
  html += '</div>';
  rightPanel.innerHTML = html;
}

addLayer(lowSVG.node());
addLayer(webglCanvas);
addLayer(upSVG.node());
root.appendChild(rightPanel);

const regl = createREGL(webglCanvas);

let transform = d3.zoomIdentity;

upSVG.call(d3.zoom().on('zoom', () => {
  transform = d3.event.transform;
  webglNeedsUpdate = true;
}));

window.addEventListener('load', () => {
  loaded();
});
