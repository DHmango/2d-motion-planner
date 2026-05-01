/**
* Made with q5!
* https://q5js.org
*/
//i need to add labels. Also; vvvvv
await Canvas();
angleMode(degrees)
let goodness; //score for overlay

let circleAX;
let circleAY;
let circleBX;
let circleBY;

let lengthA1; // the first segment on A (red one)
let lengthA2;
let lengthB1;
let lengthB2;

let targetX;
let targetY;

let angleA; // the angle of the first segment from A
let angleB;

let nodeAX;
let nodeAY;
let nodeBX;
let nodeBY;

let aCC = createCheckbox('Segment A ccw',false); // should segments a go counterclockwise
let bCC = createCheckbox('Segment B ccw',true);
let definitenessOverlay = createCheckbox('overlay 1')
let betterOverlay = createCheckbox('overlay 2')
let precisionOverlay = createCheckbox('overlay 3')
let betterPrecisionOverlay = createCheckbox('overlay 4')
let nodesOverlay = createCheckbox('angles',false)
let fineness = createSlider(3,32,4,0.5); // anything less than ~3 for a ~1000x1000 grid is super slow

let lengthA1Input = createInput(350,'number'); // I know this is dumb but i had some problem and didn't want to debug it
let lengthA2Input = createInput(350,'number');
let lengthB1Input = createInput(350,'number');
let lengthB2Input = createInput(350,'number');

let circleAXInput = createInput(0,'number'); // I know this is dumb but i had some problem and didn't want to debug it
let circleAYInput = createInput(-300,'number');
let circleBXInput = createInput(0,'number');
let circleBYInput = createInput(300,'number');

let precisionTuner =createSlider(0,2,1,0.00001)
let photoMode = createCheckbox('hide stuff',false)
let allAngles = [];

lengthA1Input.position(width-100,0).size(100)
lengthA1Input.title = 'Segment A1 length'

lengthA2Input.position(width-100,20).size(100)
lengthA2Input.title = 'Segment A2 length'

lengthB1Input.position(width-100,40).size(100)
lengthB1Input.title = 'Segment B1 length'

lengthB2Input.position(width-100,60).size(100)
lengthB1Input.title = 'Segment B2 length'

circleAXInput.position(width-100,80).size(100)
circleAXInput.title = 'Circle A X coord'

circleAYInput.position(width-100,100).size(100)
circleAYInput.title = 'Circle A Y coord'

circleBXInput.position(width-100,120).size(100)
circleBXInput.title = 'Circle B X coord'

circleBYInput.position(width-100,140).size(100)
circleBYInput.title = 'Circle B Y coord'

aCC.position(width-104,160)
aCC.title = 'Red counterclockwise?'

bCC.position(width-92,160) 
bCC.title = 'Blue counterclockwise?'

definitenessOverlay.position(width-12,160)
definitenessOverlay.title = 'weird overlay... shows distance between nodes to help find bad points'

betterOverlay.position(width-24,160)
betterOverlay.title = 'shows angle between nodes to help find bad spots'

precisionOverlay.position(width-36,160)
precisionOverlay.title = 'intended to show how much changing the position affects an angle to indicate how accurate it would be'

betterPrecisionOverlay.position(width-48,160)
betterPrecisionOverlay.title = 'Better to show how much changing the position affects an angle to indicate how accurate it would be'

nodesOverlay.position(width-60,160)
nodesOverlay.title = 'Just shows the x coordinates of the nodes for each position in red/blue'

fineness.position(width-100,180)
fineness.title = 'how coarse the overlays are. right is coarser=less lag'

precisionTuner.position(width-100,200)
precisionTuner.title = 'adjusts bounds for one of the overlays'

photoMode.position(width-20, height-20)
photoMode.title = 'hide linkage stuff'

let setPositions = function (x,y) {
  angleA = acos((sqrt((circleAX - x) ** 2 + (circleAY - y) ** 2) ** 2 + lengthA1 ** 2 - lengthA2 ** 2) / (2 * sqrt((circleAX - x) ** 2 + (circleAY - y) ** 2) * lengthA1))
  if (aCC.checked){
    angleA = atan((x - circleAX) / (y - circleAY)) - angleA 
  } else{
    angleA = atan((x - circleAX) / (y - circleAY)) + angleA
  }
  if (y<circleAY){
    angleA=180+angleA;
  }
  angleB = acos((sqrt((circleBX - x) ** 2 + (circleBY - y) ** 2) ** 2 + lengthB1 ** 2 - lengthB2 ** 2) / (2 * sqrt((circleBX - x) ** 2 + (circleBY - y) ** 2) * lengthB1)) //TODO: figure our why i needed to subtract the angle and add 180...
  if (bCC.checked){
    angleB = atan((x - circleBX) / (y - circleBY)) - angleB 
  } else{
    angleB = atan((x - circleBX) / (y - circleBY)) + angleB
  }
  if (y<circleBY){
    angleB=180+angleB;
  }
  nodeAX = circleAX+(lengthA1*sin(angleA));
  nodeAY = circleAY+(lengthA1*cos(angleA));
  nodeBX = circleBX+(lengthB1*sin(angleB));
  nodeBY = circleBY+(lengthB1*cos(angleB));
}

q5.draw = function () {
  background(0.75)
  lengthA1 = Number(lengthA1Input.value);
  lengthA2 = Number(lengthA2Input.value);
  lengthB1 = Number(lengthB1Input.value);
  lengthB2 = Number(lengthB2Input.value);
  circleAX = Number(circleAXInput.value);
  circleAY = Number(circleAYInput.value);
  circleBX = Number(circleBXInput.value);
  circleBY = Number(circleBYInput.value);
  targetX = mouseX;
  targetY = mouseY;
  noStroke()
  if (definitenessOverlay.checked){
    noStroke()
    for (let x = -halfWidth; x <= halfWidth; x+=fineness.val()){
      for(let y = -halfHeight; y <= halfHeight; y+=fineness.val()){
        setPositions(x,y);
        goodness=norm(dist(nodeAX,nodeAY,nodeBX,nodeBY),0,lengthA2+lengthB2);
        fill(goodness**4,1-2*Math.abs(goodness-0.5)+goodness,goodness**4)//0->black=0,0,0 | 0.5->green=low,1,low | 1-> white = 1,1,1         
        square(x,y,fineness.val())
      }
    }
  } else if (betterOverlay.checked){
    noStroke()
    for (let x = -halfWidth; x <= halfWidth; x+=fineness.val()){
      for(let y = -halfHeight; y <= halfHeight; y+=fineness.val()){
        setPositions(x,y);
        goodness=norm(acos((lengthA2 ** 2 + lengthB2 ** 2 - dist(nodeAX,nodeAY,nodeBX,nodeBY) ** 2) / (2 * lengthA2 * lengthB2)),0,180);
        fill(goodness,1-2*Math.abs(goodness-0.5)+goodness,goodness)//0->black=0,0,0 | 0.5->green=low,1,low | 1-> white = 1,1,1         
        square(x,y,fineness.val())
      }
    }
  } else if (nodesOverlay.checked) {
    for (let x = -halfWidth; x <= halfWidth; x+=fineness.val()){
      for(let y = -halfHeight; y <= halfHeight; y+=fineness.val()){
        setPositions(x,y);
        fill(norm(nodeBX,-halfWidth,halfWidth),0,norm(nodeAX,-halfWidth,halfWidth))
        square(x,y,fineness.val())
      }
    }
  } else if (precisionOverlay.checked){
    noStroke()
    for (let x = -halfWidth; x <= halfWidth; x+=fineness.val()){
      allAngles[x]=[]
      for(let y = -halfHeight; y <= halfHeight; y+=fineness.val()){
        allAngles[x][y]=[]
        setPositions(x,y);
        allAngles[x][y][0] = angleA;
        allAngles[x][y][1] = angleB;
      }
    }
    for (let x = -halfWidth+fineness.val(); x <= halfWidth-fineness.val(); x+=fineness.val()){
      for(let y = -halfHeight+fineness.val(); y <= halfHeight-fineness.val(); y+=fineness.val()){
        goodness=norm(Math.abs((allAngles[x][y][0]-allAngles[x-fineness.val()][y][0])*(allAngles[x-fineness.val()][y][0]-allAngles[x][y-fineness.val()][0])*(allAngles[x][y][0]-allAngles[x-fineness.val()][y-fineness.val()][0])*(allAngles[x][y][0]-allAngles[x+fineness.val()][y][0])*(allAngles[x][y][0]-allAngles[x][y+fineness.val()][0])*(allAngles[x][y][0]-allAngles[x+fineness.val()][y+fineness.val()][0])*(allAngles[x][y][0]-allAngles[x-fineness.val()][y+fineness.val()][0])*(allAngles[x][y][0]-allAngles[x+fineness.val()][y-fineness.val()][0])*(allAngles[x][y][1]-allAngles[x-fineness.val()][y][1])*(allAngles[x-fineness.val()][y][1]-allAngles[x][y-fineness.val()][1])*(allAngles[x][y][1]-allAngles[x-fineness.val()][y-fineness.val()][1])*(allAngles[x][y][1]-allAngles[x+fineness.val()][y][1])*(allAngles[x][y][1]-allAngles[x][y+fineness.val()][1])*(allAngles[x][y][1]-allAngles[x+fineness.val()][y+fineness.val()][1])*(allAngles[x][y][1]-allAngles[x-fineness.val()][y+fineness.val()][1])*(allAngles[x][y][1]-allAngles[x+fineness.val()][y-fineness.val()][1])/fineness.val()**16),0,precisionTuner.val()*0.000001)
        fill(goodness)
        square(x,y,fineness.val())
      }
    }
  } else if (betterPrecisionOverlay.checked){
    noStroke()
    for (let x = -halfWidth; x <= halfWidth; x+=fineness.val()){
      allAngles[x]=[]
      for(let y = -halfHeight; y <= halfHeight; y+=fineness.val()){
        allAngles[x][y]=[]
        setPositions(x,y);
        allAngles[x][y][0] = angleA;
        allAngles[x][y][1] = angleB;
      }
    }
    for (let x = -halfWidth+fineness.val(); x <= halfWidth-fineness.val(); x+=fineness.val()){
      for(let y = -halfHeight+fineness.val(); y <= halfHeight-fineness.val(); y+=fineness.val()){
        goodness=norm(Math.abs(Math.abs(allAngles[x][y][0]-allAngles[x-fineness.val()][y][0])+Math.abs(allAngles[x-fineness.val()][y][0]-allAngles[x][y-fineness.val()][0])+Math.abs(allAngles[x][y][0]-allAngles[x-fineness.val()][y-fineness.val()][0])+Math.abs(allAngles[x][y][0]-allAngles[x+fineness.val()][y][0])+Math.abs(allAngles[x][y][0]-allAngles[x][y+fineness.val()][0])+Math.abs(allAngles[x][y][0]-allAngles[x+fineness.val()][y+fineness.val()][0])+Math.abs(allAngles[x][y][0]-allAngles[x-fineness.val()][y+fineness.val()][0])+Math.abs(allAngles[x][y][0]-allAngles[x+fineness.val()][y-fineness.val()][0])+Math.abs(allAngles[x][y][1]-allAngles[x-fineness.val()][y][1])+Math.abs(allAngles[x-fineness.val()][y][1]-allAngles[x][y-fineness.val()][1])+Math.abs(allAngles[x][y][1]-allAngles[x-fineness.val()][y-fineness.val()][1])+Math.abs(allAngles[x][y][1]-allAngles[x+fineness.val()][y][1])+Math.abs(allAngles[x][y][1]-allAngles[x][y+fineness.val()][1])+Math.abs(allAngles[x][y][1]-allAngles[x+fineness.val()][y+fineness.val()][1])+Math.abs(allAngles[x][y][1]-allAngles[x-fineness.val()][y+fineness.val()][1])+ Math.abs(allAngles[x][y][1]-allAngles[x+fineness.val()][y-fineness.val()][1])/(16*fineness.val()**16)),0,precisionTuner.val()*0.0000000000000000000000000000000000001)
        fill(goodness)
        square(x,y,fineness.val())
      }
    }
  } 
  if (!photoMode.checked){
    setPositions(targetX,targetY)
    noStroke();
    fill(255,0,0);
    circle(circleAX, circleAY,20);
    fill(0,0,255);
    circle(circleBX, circleBY, 20);
    fill(0,255,0);
    circle(targetX, targetY,20);
    stroke('black');
    strokeWeight(0.5);
    noFill()
    circle(circleAX, circleAY, (lengthA1+lengthA2)*2)
    circle(circleBX, circleBY, (lengthB1+lengthB2)*2)
    circle(nodeAX, nodeAY, lengthA2*2)
    circle(nodeBX, nodeBY, lengthB2*2)
    line(circleAX, circleAY, targetX, targetY);
    line(circleBX, circleBY, targetX, targetY);// direct lines
    stroke(255,255,0)
    strokeWeight(2)
    line(circleAX, circleAY, nodeAX, nodeAY)//segments 1
    line(circleBX, circleBY, nodeBX, nodeBY)
    line(nodeAX, nodeAY, targetX,targetY) //segments 2
    line(nodeBX, nodeBY, targetX, targetY)
    stroke(0)
    textWeight(2)
    textAlign(RIGHT)
    textSize(15)
    noFill()
    text('Hover over parameters to see what they do... or just try them out!',halfWidth-100,-halfHeight+20)
  }
}
