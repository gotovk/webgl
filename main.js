let loadCount = 3;

function loaded() {
  loadCount--;
  if (loadCount == 0) {
    initialize();
    cycleInit();
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

function mod(x, m) {
  return ((x % m) + m) % m;
}

{
  const stats = [
    [40, 7], // I
    [34, 6], // II
    [8, 1], // III
    [3, 1], // IV
  ];
  const byNum = stats.map(R.sum);
  // console.log(R.sum(byNum));
  const relNum = byNum.map(R.multiply(1 / R.sum(byNum)));
  const angles = [];
  let a = 0;
  relNum.forEach(v => {
    const av = v * Math.PI * 2;
    angles.push([a, a + av]);
    a += av;
  });
  relResus = [1, 2, 3, 4].map(group => {
    const [pol, neg] = stats[group - 1];
    return neg / (pol + neg);
  });
  const radCoeff = 4;
  const innerRad = 30 * radCoeff;
  const outerRad = 100 * radCoeff;
  const gap = 1;
  /*
  const rads = [1, 2, 3, 4].map(group => {
    const r = relResus[group - 1];
    const thresh = innerRad + (outerRad - innerRad) * r;
    return [[innerRad, thresh - gap / 2], [thresh + gap / 2, outerRad]];
  });
  */
  const thresh = innerRad + (outerRad - innerRad) * 1 / 5;
  const rads = [[innerRad, thresh - gap / 2], [thresh + gap / 2, outerRad]];
  const inverseMargin = 0.0;

  function inverseGroup([x, y, r]) {
    r += inverseMargin;
    const dist = Math.sqrt(x * x + y * y);
    let resus = null;
    rads.forEach(([inner, outer], curResus) => {
      if (inner < dist - r && dist + r < outer) {
        resus = curResus;
      }
    });
    if (resus === null) {
      return null;
    }
    const angle = mod(Math.atan2(y, x) + Math.PI / 2, Math.PI * 2);
    const circleLen = 2 * Math.PI * dist;
    const angleRad = r / circleLen * 2 * Math.PI;
    let num = null;
    angles.forEach(([start, end], curNum) => {
      if (start < angle - angleRad && angle + angleRad < end) {
        num = curNum;
      }
    });
    if (num === null) {
      return null;
    }
    return [num, resus];
  }

  function semaphore(sel) {
    const arc = d3.arc().cornerRadius(3).padAngle(0.01);
    [0, 1].forEach(resus => [1, 2, 3, 4].forEach(group => {
      const [startAngle, endAngle] = angles[group - 1];
      const [innerRadius, outerRadius] = rads[resus];
      const d = arc({
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
      });
      let color = ['red', 'green', 'blue', 'orange'][group - 1];
      if (resus == 0) {
        color = d3.color(color).darker(2);
      }
      sel.append('path').attr('fill', 'none').attr('stroke', color).attr('d', d);
    }))
  }
}

function initialize() {
  lowSVGG.append('rect').attr('fill', 'none')
    .attr('x', 10).attr('y', 10)
    .attr('width', 100).attr('height', 100);
  lowSVGG.call(semaphore);
  avatarsTextures = [];
  /*
  const ph = phyllotaxis(10);
  avatarsCoords = d3.range(20000).map(i => {
    const [x, y] = ph(i);
    avatarsTextures.push(avatarsTexturesBank[Math.floor(Math.random() * 36)]);
    return [x, y, 10 * (0.5 + Math.random())];
  });
  */
  avatarsCoords = gephiNoverlap.map(({id, radius, x, y}, i) => {
    avatarsTextures.push(avatarsTexturesBank[Math.floor(Math.random() * 36)]);
    const coords = [x, y, radius * 2.3];
    const invGroup = inverseGroup(coords);
    return [coords[0], coords[1], coords[2] * (invGroup === null ? 0.0 : 1)];
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