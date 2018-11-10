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

addLayer(lowSVG.node());
addLayer(webglCanvas);
addLayer(upSVG.node());

const regl = createREGL(webglCanvas);

let transform = d3.zoomIdentity;

upSVG.call(d3.zoom().on('zoom', () => {
  transform = d3.event.transform;
}));

window.addEventListener('load', () => {
  regl.frame(() => {
    update();
    webglUpdate();
  });  
})
