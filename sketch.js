var PLAY = 1;
var END = 0;
var gameState = PLAY;

var unicorn, unicorn_running, unicorn_collided;
var ground, invisibleGround, groundImage

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var candy1, candy2, candy3, candy4, candy5;

var gameOver, restart;


localStorage["HighestScore"] = 0;

function preload(){
  unicorn_running =   loadAnimation("unicorn1.jpg","unicorn2.jpg","unicorn3.jpg");
  unicorn_collided = loadAnimation("unicorn_collided.jpg");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.jpg");
  obstacle2 = loadImage("obstacle2.jpg");
  obstacle3 = loadImage("obstacle3.jpg");
  obstacle4 = loadImage("obstacle4.jpg");
  obstacle5 = loadImage("obstacle5.jpg");  
  obstacle6 = loadImage("obstacle6.jpg");
  obstacle6.scale = 0.2;  

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  candy1 = loadImage("candy1.png");
  candy2 = loadImage("candy2.jpg");
  candy3 = loadImage("candy3.png");
  candy4 = loadImage("candy4.png");
  candy5 = loadImage("candy5.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  unicorn = createSprite(displayWidth-1250,displayHeight-70,20,50);
  
  unicorn.addAnimation("running", unicorn_running);
  unicorn.addAnimation("collided", unicorn_collided);
  unicorn.scale = 0.6;  

  ground = createSprite(displayWidth/2,displayHeight-20,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/2,displayHeight/2-50);
  gameOver.addImage(gameOverImg);

  
  restart = createSprite(displayWidth/2,displayHeight/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-10,width,15);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, 500,50);

  image(candy1,350,250,120,100);
  image(candy2,550,350,170,150);
  image(candy3,800,250,150,100);
  //image(candy2,550,350,170,150);
  //image(candy2,550,350,170,150);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(touches.length>0 || keyDown("space") && unicorn.y >= height- 120) {
      unicorn.velocityY = -14;
      touches = []
    }
  
    unicorn.velocityY = unicorn.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    unicorn.collide(invisibleGround);

    //if(camera.position.x % 15 === 0){
      spawnClouds();
    //}
    //if(frameCount % 70 === 0) {
      spawnObstacles();
    //}


  
    if(obstaclesGroup.isTouching(unicorn)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    unicorn.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    unicorn.changeAnimation("collided",unicorn_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 70 === 0) {
    var cloud = createSprite(camera.position.x + windowWidth/2, 120, 40,10);
    cloud.y = Math.round(random(80,180));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 700;
    
    //adjust the depth
    cloud.depth = unicorn.depth;
    unicorn.depth = unicorn.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 70 === 0) {
    var obstacle = createSprite(camera.position.x + windowWidth/2, displayHeight-40, 20, 30);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  unicorn.changeAnimation("running",unicorn_running)

  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}