/**
 * Made with q5!
 * https://q5js.org
 */
await Canvas(800,800);
angleMode(degrees)
let circlesDistance;
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
q5.draw = function () {
  circlesDistance = 600;
  lengthA1 = 300;
  lengthA2 = 300;
  lengthB1 = 300;
  lengthB2 = 300;
  circleAX = -300;
  circleAY = -circlesDistance/2;
  circleBX = -300;
  circleBY = circlesDistance/2
  targetX = mouseX;
  targetY = mouseY;
  angleA = atan((targetX - circleAX) / (targetY - circleAY)) + acos((sqrt((circleAX - targetX) ** 2 + (circleAY - targetY) ** 2) ** 2 + lengthA1 ** 2 - lengthA2 ** 2) / (2 * sqrt((circleAX - targetX) ** 2 + (circleAY - targetY) ** 2) * lengthA1))
  angleB = atan((targetX - circleBX) / (targetY - circleBY)) - acos((sqrt((circleBX - targetX) ** 2 + (circleBY - targetY) ** 2) ** 2 + lengthB1 ** 2 - lengthB2 ** 2) / (2 * sqrt((circleBX - targetX) ** 2 + (circleBY - targetY) ** 2) * lengthB1)) + 180 //TODO: figure our why i needed to subtract the angle and add 180...
  background('gray');
  noStroke();
  fill(255,0,0);
  circle(circleAX,circleAY,40);
  fill(0,0,255);
  circle(circleBX, circleBY, 40);
  fill(0,255,0);
  circle(targetX,targetY,40);
  stroke('black');
  strokeWeight(0);
  line(circleAX, circleAY, targetX, targetY);
  line(circleBX, circleBY, targetX, targetY);// direct lines
  stroke(255,255,0)
  strokeWeight(2)
  line(circleAX,circleAY,circleAX+(lengthA1*sin(angleA)),circleAY+(lengthA1*cos(angleA)))//segments 1
  line(circleBX,circleBY,circleBX+(lengthB1*sin(angleB)),circleBY+(lengthB1*cos(angleB)))
  line(circleAX+(lengthA1*sin(angleA)),circleAY+(lengthA1*cos(angleA)),targetX,targetY) //segments 2
  line(circleBX+(lengthB1*sin(angleB)),circleBY+(lengthB1*cos(angleB)), targetX, targetY)
  log(angleA)
  log(angleB)
}
