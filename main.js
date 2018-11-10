function initialize() {
  lowSVGG.append('rect').attr('fill', 'orange')
    .attr('x', 10).attr('y', 10)
    .attr('width', 100).attr('height', 100);
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