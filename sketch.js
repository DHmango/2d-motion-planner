/**
* Made with q5!
* https://q5js.org
*/
//i need to add labels. Also; vvvvv
await Canvas();//maybe the best overlay would actually be seeing how close the intersection points of the circles are (too high is bad, too low is also bad) Or, it could just be like combine the good overlays
angleMode(degrees)
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
let fineness = createSlider(3,32,4,0.5); // anything less than ~3 for a ~1000x1000 grid is super slow
let lengthA1Input = createInput(350,'number'); // I know this is dumb but i had some problem and didn't want to debug it
let lengthA2Input = createInput(350,'number');
let lengthB1Input = createInput(350,'number');
let lengthB2Input = createInput(350,'number');
let circleAXInput = createInput(-300,'number'); // I know this is dumb but i had some problem and didn't want to debug it
let circleAYInput = createInput(-300,'number');
let circleBXInput = createInput(-300,'number');
let circleBYInput = createInput(300,'number');
lengthA1Input.position(width-100,0).size(100)
lengthA2Input.position(width-100,20).size(100)
lengthB1Input.position(width-100,40).size(100)
lengthB2Input.position(width-100,60).size(100)
circleAXInput.position(width-100,80).size(100)
circleAYInput.position(width-100,100).size(100)
circleBXInput.position(width-100,120).size(100)
circleBYInput.position(width-100,140).size(100)
aCC.position(width-100,160)
bCC.position(width-80,160)
definitenessOverlay.position(width-40,160)
fineness.position(width-100,180)
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
  strokeWeight(1.5)
  if (definitenessOverlay.checked){
    beginShape()
    noStroke()
    for (let x = -halfWidth; x <= halfWidth; x+=fineness.val()){
      for(let y = -halfHeight; y <= halfHeight; y+=fineness.val()){
        setPositions(x,y);
        fill(norm(dist(nodeAX,nodeAY,nodeBX,nodeBY),0,lengthA2+lengthB2))
        square(x,y,fineness.val())
      }
    }
    endShape()
  }
  setPositions(targetX,targetY)
  noStroke();
  fill(255,0,0);
  circle(circleAX, circleAY,40);
  fill(0,0,255);
  circle(circleBX, circleBY, 40);
  fill(0,255,0);
  circle(targetX, targetY,40);
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
}