let mapData = null;
let bloodStationsData = null;
let regionsCirclesData = null;

function drawRegions(sel) {
  const s = sel.selectAll('.region').data(mapData);
  const makeD = ({vertices}) => 'M' + vertices.map(([x, y]) => x + ',' + y).join('L') + 'Z';
  s.transition().duration(10000).attr('d', makeD);
  s.enter().append('path').attr('class', 'region').attr('d', makeD).attr('fill', "black");
}

function drawRegionsCircles(sel) {
  const s = sel.selectAll('.region').data(regionsCirclesData);
  const makeD = ({cx, cy, r, vertCount}) => circlePath(cx, cy, r, 0, vertCount);
  s.transition().duration(10000).attr('d', makeD);
  s.enter().append('path').attr('class', 'region').attr('d', makeD).attr('fill', "black");
}

function drawBloodStations(sel) {
  const s = sel.selectAll('.station').data(bloodStationsData);
  s.enter().append('circle').attr('class', 'station')
    .attr('opacity', 0.5).attr('r', 1).attr('fill', "red")
    .attr('cx', R.prop('x'))
    .attr('cy', R.prop('y'));
}

function drawBloodStationsCircles(sel) {
  const s = sel.selectAll('.station').data(bloodStationsData);
  s.transition().duration(10000)
    .attr('cx', R.prop('x1'))
    .attr('cy', R.prop('y1'))
    .attr('r', R.prop('r1'));
  s.enter().append('circle').attr('class', 'station')
    .attr('opacity', 0.5).attr('r', R.prop('r1')).attr('fill', "red")
    .attr('cx', R.prop('x1'))
    .attr('cy', R.prop('y1'));
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
  const regionsOrder = mapData.map(R.prop('title'));
  console.log(regionsOrder);
  const mapDataByTitle = R.indexBy(item => item.title, mapData);
  const p = d3.geoAzimuthalEquidistant().rotate([-100, -54]).scale(850).translate([600, 490]);
  bloodStationsData.forEach(item => {
    item.region = item.city.region && item.city.region.title;
    delete item.city;
    const geoPos = [item.lng, item.lat];
    const [x, y] = p(geoPos);
    item.x = x + (Math.random() - 0.5) * 15;
    item.y = y + (Math.random() - 0.5) * 15;
  });
  bloodStationsData = bloodStationsData.filter(item => {
    const {x, y} = item;
    let found = null;
    mapData.forEach(({title, vertices}) => {
      if (d3.polygonContains(vertices, [x, y])) {
        found = title;
      }
    });
    item.region = found;
    return found;
  });
  regionsCirclesData = mapData.map(({title}) => {
    const vertCount = mapDataByTitle[title].vertices.length;
    title = fixTitle(title);
    const {cx, cy, dx, dy, r} = regionsCirclesData[title];
    const sc = 1.92951;
    const population = r * r * 100;
    return {cx: cx + dx / sc, cy: cy + dy / sc, r, title, vertCount, population};
  });
  regionsCirclesData.forEach(item => {
    const { title, r: regionR, cx, cy } = item;
    const bloodStations = bloodStationsData.filter(R.propEq('region', title));
    bloodStations.forEach(station => {
      station.population = 1 + Math.random() * 5;
    });
    if (bloodStations.length === 0) {
      return;
    }
    const pack = d3.pack()
      .size([100, 100])
      .padding(3);
    const hierarchy = d3.hierarchy({
      children: bloodStations,
    }).sum(R.prop('population')).sort(function(a, b) { return b.population - a.population; });
    pack(hierarchy);
    console.log(hierarchy);
    hierarchy.children.forEach(({x, y, r, data}) => {
      data.x1 = cx + (x - 50) / 50 * regionR;
      data.y1 = cy + (y - 50) / 50 * regionR;
      data.r1 = r / 50 * regionR;
    });
  });
  /*
  bloodStationsData.forEach(station => {
    const { region } = station;
    const circlesData = regionsCirclesData[regionsOrder.indexOf(region)];
    station.x1 = circlesData.cx + random() * circlesData.r * 0.5;
    station.y1 = circlesData.cy + random() * circlesData.r * 0.5;
    station.r1 = 2;
  });
  */
}