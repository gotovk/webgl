let loadCount = 3;

let gephiNoverlap = [];

d3.json('https://raw.githubusercontent.com/gotovk/gotovk.github.io/master/assets/graph.json').then((data) => {
  gephiNoverlap = data;
  loaded();
})

function mod(x, m) {
  return ((x % m) + m) % m;
}

function initialize() {
  lowSVGG.append('rect').attr('fill', 'none')
    .attr('x', 10).attr('y', 10)
    .attr('width', 100).attr('height', 100);
  // lowSVGG.call(semaphore);
  lowSVGG.call(drawRegions);
  // upSVGG.call(drawRegionsCircles);
  //  upSVGG.call(drawBloodStations);
  // upSVGG.call(drawBloodStationsCircles);
  upSVGG.call(drawBloodStationsSemaphores);
  // upSVGG.call(drawBloodStationsCirclesSemaphores);
  // avatarsTextures = [];
  /*
  const ph = phyllotaxis(10);
  avatarsCoords = d3.range(20000).map(i => {
    const [x, y] = ph(i);
    avatarsTextures.push(avatarsTexturesBank[Math.floor(Math.random() * 36)]);
    return [x, y, 10 * (0.5 + Math.random())];
  });
  */
  // avatarsCoords = [];
  /*
  gephiNoverlap.forEach(({id, radius, x, y}, i) => {
    avatarsTextures.push(avatarsTexturesBank[Math.floor(Math.random() * 36)]);
    const coords = [x, y, radius * 2.3];
    const invGroup = inverseGroup(coords);
    if (invGroup === null) {
      return;
    }
    avatarsCoords.push(coords);
  });
  */
}

function update() {
  lowSVGG.attr('transform', transform);
  upSVGG.attr('transform', transform);
}

window.addEventListener('load', () => {
  loadMap();
})

window.onkeydown = function(e) {
  const key = e.key;
  console.log('key', key);
  if (key == '1') {
    mapClick(1);
  } else if (key == '2') {
    centersClick(1);
  } else if (key == '3') {
    peopleClick(1);
  } else if (key == '4') {
    rightPanel.style.display = 'none';
  }
}

function allLoaded() {
  mapInitialize();
  generateUsers();
  initialize();
  cycleInit();
}
