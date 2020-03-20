let vertexShaderSrc = `
precision highp float;

attribute vec2 aPosition;

void main(){
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

let fragmentShaderSrc = `

precision highp float;

uniform vec2 uViewport;
uniform vec4 mSize;

void main(){
  vec2 c = vec2(
    gl_FragCoord.x * (mSize.w - mSize.z) / uViewport.x + mSize.z,
    gl_FragCoord.y * (mSize.y - mSize.x) / uViewport.y + mSize.x
  );

  vec2 z = c;
  float iterations = 0.0;
  float maxIterations = 100.0;
  const int imaxIterations = 100;

  for(int i = 0; i < imaxIterations; i++){
    float t = 2.0 * z.x * z.y + c.y;
    z.x = z.x * z.x - z.y * z.y + c.x;
    z.y = t;

    if(z.x * z.x + z.y * z.y > 16.0){
      break;
    }

    iterations += 1.0;
  }
  float x = sqrt(iterations * 0.025);
  gl_FragColor = vec4(0.0 + x, 0.0 + x, 0.0 + x, 1.0);
}

`;


function Init(){
  var canvas = document.getElementById('canvas');
  var gl = canvas.getContext('webgl');
  if(!gl){
    gl = document.getElementById('canvas').getContext('webgl-experimental');
  }
  if(!gl){
    console.log("Your Browser doesn't support WebGL");
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);




  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSrc);
  gl.compileShader(vertexShader);

  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    console.error('Vertex Shader Compilation Error : ' + gl.getShaderInfoLog(vertexShader));
  }

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSrc);
  gl.compileShader(fragmentShader);

  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error('Fragment Shader Compilation Error : ' + gl.getShaderInfoLog(fragmentShader));
  }
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error('Could not compile WebGL program : ' + gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  var uniforms = {
    uViewport: gl.getUniformLocation(program, 'uViewport'),
    mSize: gl.getUniformLocation(program, 'mSize')
  }

  var uViewport = [canvas.width, canvas.height];
  var aspectRatio = canvas.width/canvas.height;
  var mSize = [-2.0, 2.0, -2.0*aspectRatio, 2.0*aspectRatio];

  const vertexData = [
    -1,  1,
    -1, -1,
     1, -1,

    -1,  1,
     1,  1,
     1, -1
  ];

  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  let aPositionLocation = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPositionLocation);
  gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

  var loop = function(){
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.uniform2fv(uniforms.uViewport, uViewport);
    gl.uniform4fv(uniforms.mSize, mSize);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  loop();
  function OnResize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    uViewport = [canvas.width, canvas.height];

    let oldRealRange = mSize[3] - mSize[2];
    mSize[3] = (mSize[1] -mSize[0])*(canvas.width/canvas.height) + mSize[2];
    let newRealRange = mSize[3] - mSize[2];

    mSize[2] -= (newRealRange - oldRealRange)/2;

    gl.viewport(0, 0, canvas.width, canvas.height);
    loop();
  };
  function OnMouseZoom(e){
    var imaginaryRange = mSize[1] - mSize[0];
    var newRange;
    if(e.deltaY < 0){
      newRange = imaginaryRange * 0.95;
    }else{
      newRange = imaginaryRange * 1.05;
    }
    var delta = newRange - imaginaryRange;
    mSize[0] -= delta/2;
    mSize[1] = mSize[0] + newRange;

    OnResize();
  }
  function OnMouseMove(e){
    if(e.buttons === 1){
      let iRange = mSize[1] - mSize[0];
      let rRange = mSize[3] - mSize[2];

      let iDelta = (e.movementY / canvas.height) * iRange;
      let rDelta = (e.movementX / canvas.width) * rRange;
      mSize[0] += iDelta;
      mSize[1] += iDelta;
      mSize[2] -= rDelta;
      mSize[3] -= rDelta;
      loop();
    }
  }
  window.addEventListener('resize', OnResize);
  window.addEventListener('wheel', OnMouseZoom);
  window.addEventListener('mousemove', OnMouseMove);
}
