var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var background1,backgroundImage

var sun,sunImage

var chicken;

function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  groundImage = loadImage("ground.png");
  
  sunImage = loadImage("sun.png")
  
  cloudImage = loadImage("cloud-1.png");
  
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  
  backgroundImage = loadImage("backgroundImg.png")
   
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  

}

function setup() {
  createCanvas(windowWidth,windowHeight);
  

  background1 = createSprite(width/2,height/2,234,23)
  background1.addImage(backgroundImage)
  background1.scale = 5
  
 
  
  sun = createSprite(width-80,100,234,234)
  sun.addImage(sunImage)
  sun.scale = 0.3


  ground = createSprite(width/2,height + 50,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2
  
    trex = createSprite(50,height-100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.12;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-90,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  score = 0;
  
    var cloud = createSprite(250,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  
    var cloud = createSprite(width,380,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
}

function draw() {
   drawSprites();
  chicken = Math.round(random(60,200))

  textSize(20)
  text("Score: "+ score,width/20,50);
  

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= height-160) {
        trex.velocityY = -17;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     
        if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  
 


 
}

function reset(){
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running",trex_running)
  score = 0
  ground.x = ground.width/2
  
  
  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-140,10,40);
   obstacle.velocityX = -(6 + score/100);
   var Chickenman = -(6 + score/100) 
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        obstacle.scale = 0.5
        obstacle.setCollider("rectangle",0,0,70,50)
              break;
      case 2: obstacle.addImage(obstacle2);
        obstacle.scale = 0.5
        
        obstacle.setCollider("rectangle",0,0,70,50)
              break;
      case 3: obstacle.addImage(obstacle3);
        obstacle.y = height-165
        obstacle.scale = 0.2
        
        
        obstacle.setCollider("rectangle",0,0,70,50)
              break;
      case 4: obstacle.addImage(obstacle4);
        obstacle.scale = 0.2
        obstacle.setCollider("rectangle",-10,-10,70,50)
        obstacle.y = height-165
              break;
              default:break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = width/Chickenman;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % chicken === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(60,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    var Chickenman = -(6 + score/100)
    
     //assign lifetime to the variable
    cloud.lifetime = width/Chickenman;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

