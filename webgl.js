const dpi = window.devicePixelRatio;

webglCanvas.style.width = width;
webglCanvas.style.height = height;
webglCanvas.width = Math.round(width * dpi);
webglCanvas.height = Math.round(height * dpi);

let avatarsCoords = [];
let avatarsTextures = [];

let drawAvatars = () => {};

const avatars = new Image();
avatars.crossOrigin = "Anonymous";
avatars.src = 'https://i.imgur.com/EaxS9EB.jpg';
// avatars.src = './avatars/comp1.jpg';

const setupCamera2d = regl({
  uniforms: {
    cam: () => [
      transform.x,
      transform.y,
      transform.k,
    ],
    screen: [width, height],
    dpi,
  }
});

function makeDrawAvatars(avatars) {
  return regl({
    frag: `
      precision mediump float;
      uniform sampler2D texture;
      uniform float textureRatio;
      varying vec3 v_textureCoords;
      void main() {
        vec2 pc = gl_PointCoord;
        float d = length(pc - 0.5);
        if (d > 0.5) {
          discard;
        } else if ((0.5 - d) / 0.5 < 0.04) {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
          return;
        }
        float tx0 = v_textureCoords.x;
        float ty0 = v_textureCoords.y;
        float tw = v_textureCoords.z;
        float th = tw / textureRatio;
        vec2 uv = vec2(tx0 + pc.x * tw, ty0 + pc.y * th);
        gl_FragColor = texture2D(texture, uv);
      }`,

    vert: `
      precision mediump float;
      uniform float dpi;
      uniform vec3 cam;
      uniform vec2 screen;
      attribute vec3 position;
      attribute vec3 textureCoords;
      varying vec3 v_textureCoords;
      void main() {
        vec2 pos = vec2((cam.x + position.x * cam.z) / screen.x * 2.0 - 1.0, 1.0 - (cam.y + position.y * cam.z) / screen.y * 2.0);
        gl_Position = vec4(pos, 0, 1.0);
        gl_PointSize = position.z * dpi * cam.z;
        v_textureCoords = textureCoords;
      }`,

    attributes: {
      position: regl.prop('avatarsCoords'),
      textureCoords: regl.prop('avatarsTextures'),
      /*[
        [0, 0 / 12, 1 / 16],
        [0, 1 / 12, 1 / 16],
        [0, 2 / 12, 1 / 16],
      ],*/
    },

    uniforms: {
      texture: regl.texture({
        data: avatars,
        mag: 'linear',
      }),
      textureRatio: 12 / 16,
    },
  
    primitive: 'points',
    count: (ctx, props) => props.avatarsCoords.length,
  });
}

avatars.onload = function() {
  drawAvatars = makeDrawAvatars(avatars);
  loaded();
}

function webglUpdate() {
  setupCamera2d({}, () => {
    drawAvatars({avatarsCoords, avatarsTextures});
  });
}