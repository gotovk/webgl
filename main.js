let loadCount = 2;

function loaded() {
  loadCount--;
  if (loadCount == 0) {
    initialize();
  } else if (loadCount < 0) {
    console.log('loadCount < 0!!!');
  }
}

function phyllotaxis(radius) {
  var theta = Math.PI * (3 - Math.sqrt(5));
  return function(i) {
    var r = radius * Math.sqrt(i), a = theta * i;
    return [
      width / 2 + r * Math.cos(a),
      height / 2 + r * Math.sin(a)
    ];
  };
}

const avatarsTexturesBank = d3.range(40).map(i => {
  const row = i % 16;
  const col = Math.floor(i / 16);
  return [row / 16, col / 12, 1 / 16];
});

let gephiNoverlap = [];

d3.json('https://raw.githubusercontent.com/gotovk/gotovk.github.io/master/assets/graph.json').then((data) => {
  gephiNoverlap = data;
  loaded();
})

function semaphore(sel) {
  const arc = d3.arc();
  
  arc({
    innerRadius: 0,
    outerRadius: 100,
    startAngle: 0,
    endAngle: Math.PI / 2
  });
}

function initialize() {
  lowSVGG.append('rect').attr('fill', 'orange')
    .attr('x', 10).attr('y', 10)
    .attr('width', 100).attr('height', 100);
  const ph = phyllotaxis(10);
  avatarsTextures = [];
  /*
  avatarsCoords = d3.range(20000).map(i => {
    const [x, y] = ph(i);
    avatarsTextures.push(avatarsTexturesBank[Math.floor(Math.random() * 36)]);
    return [x, y, 10 * (0.5 + Math.random())];
  });
  */
  avatarsCoords = gephiNoverlap.map(({id, radius, x, y}, i) => {
    avatarsTextures.push(avatarsTexturesBank[Math.floor(Math.random() * 36)]);
    return [x, y, radius * 2.3];
  });
}

function update() {
  lowSVGG.attr('transform', transform);
  upSVGG.attr('transform', transform);
}

window.onload = function() {
  initialize();
}

window.onkeydown = function(e) {
  const key = e.key;
  console.log('key', key);
}