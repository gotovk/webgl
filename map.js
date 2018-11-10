let mapData = null;
let bloodStationsData = null;
let regionsCirclesData = null;

function drawRegions(sel) {
  const s = sel.selectAll('.region').data(mapData);
  const makeD = ({vertices}) => 'M' + vertices.map(([x, y]) => x + ',' + y).join('L') + 'Z';
  s.enter().append('path').attr('class', 'region').attr('d', makeD).attr('fill', "black");
}

function drawRegionsCircles(sel) {
  const s = sel.selectAll('.region').data(regionsCirclesData);
  const makeD = ({cx, cy, r}) => circlePath(cx, cy, r, 0, 72);
  s.enter().append('path').attr('class', 'region').attr('d', makeD).attr('fill', "black");
}

function drawBloodStations(sel) {
  const s = sel.selectAll('.station').data(bloodStationsData);
  const p = d3.geoAzimuthalEquidistant().rotate([-100, -54]).scale(900).translate([620, 500]);
  s.enter().append('circle').attr('class', 'station')
    .attr('opacity', 0.5).attr('r', 1).attr('fill', "red")
    .attr('cx', ({lat, lng}) => p([lng, lat])[0] + (Math.random() - 0.5) * 15)
    .attr('cy', ({lat, lng}) => p([lng, lat])[1] + (Math.random() - 0.5) * 15);
}

function loadMap() {
  loadCount++;
  // https://raw.githubusercontent.com/gotovk/gotovk.github.io/master/assets/regions.json
  d3.json('https://raw.githubusercontent.com/gotovk/gotovk.github.io/master/assets/regions.json').then(data => {
    mapData = data;
    loaded();
  });
  loadCount++;
  d3.json('https://gist.githubusercontent.com/pallada-92/3ab5e08b3cf828a59fb43cfa8afa3465/raw/fa044e88df1466f272a195ef72ac4ff52fefcf79/bloodstations.json').then(data => {
    bloodStationsData = data.data.blood_stations;
    loaded();
  });
  loadCount++;
  d3.json('https://gist.githubusercontent.com/pallada-92/8ac29621f32c64a0f8f9aae672df0440/raw/93cf6f08c32d76ffac544667d23cbbdaf9dec29e/regions_circles.json').then(data => {
    regionsCirclesData = data;
    loaded();
  });
  
}

function fixTitle(title) {
  if (title === 'Удмуртcкая Республика') {
    return 'Удмуртская Республика';
  }
  if (title === 'Чувашская Республика — Чувашия') {
    return 'Чувашская Республика';
  }
  return title;
}

function mapInitialize() {
  const mapDataByTitle = R.indexBy(item => item.title, mapData);
  bloodStationsData.forEach(item => {
    item.region = item.city.region && item.city.region.title;
    if ((item.region in mapDataByTitle)) {
      // console.log('IN', item.region);
    }
    delete item.city;
  });
  regionsCirclesData = mapData.map(({title}) => {
    const {cx, cy, dx, dy, r} = regionsCirclesData[fixTitle(title)];
    const sc = 1.92951;
    return {cx: cx + dx / sc, cy: cy + dy / sc, r, title};
  });
}