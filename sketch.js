const Engine=Matter.Engine;
const World=Matter.World;
const Bodies=Matter.Bodies;

var myEngine,myWorld;
var bg;
var ground;
var tank;
var turret;
var rotatedDegrees;
 var ball1,ball2,ball3,ball4,ball5;
 var bullet,bullets;
var balls=[],death=[];
var count=5;
var posx=0,posy=0;
var counter=0;
var fire,explosion;
var gameOver,gameOverImg;
var result="play",flag;

function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

function preload(){
    bg=loadImage("background.png")
    fire=loadSound("fire.mp3")
    explosion=loadSound("explosion.wav")
    gameOverImg=loadImage("gameover.png")
}
function setup()
{
    createCanvas(800,400);
    myEngine=Engine.create();
    myWorld=myEngine.world;

    
    ground=new Ground(600,390,1200,30)
    tank=new Tank(600,340,200,75)
    turret=new Turret(550,320,100,20)
    rotatedDegrees=0;
    bullets=[];
    death=[];
    for(var c=0;c<5;c++)
    {
      balls.push(new Ball(random(50,300),random(-1000,10),15));
    }
    for(var a=0;a<balls.length;a++)
    {
      death[a]=false;
    }

}
function draw()
{
    background(bg);
    Engine.update(myEngine);
    tank.display();
    ground.display();
    turret.display();
  
    //remove the ball when it is close
    for(var a=0;a<balls.length;a++)
    {
      if(balls[a].body.position.x<0 && death[a]===false && count!==0)
      {
        Matter.Body.setPosition(balls[a].body,{x:0,y:-1000});
        
        Matter.World.remove(myWorld,balls[a]);
      explosion.play();     
        count--;
 //       console.log("count is "+count);
 //       console.log("death is "+death[a])
        death[a]=true;
      }
      else 
      {
          balls[a].display();

     
          //move the ball closer
           if(balls[a].body.position.y>300 && death[a]===false)
              {
            //    console.log("increase "+balls[a]+" "+balls[a].body.position.x);
                  Matter.Body.setVelocity(balls[a].body,{x:2,y:-8});
              }
     //     }
        }
      }

      for(var x=0;x<balls.length;x++)
      {
        if(balls[x].body.position.x>=600)
        {
          result="loss"
        }
      }

      if(count===0)
      {
          result="win";
      }
      if(result==="win")
      {
        textAlign(CENTER);
        textSize(40);
        fill(0);
      text("You Win",300,180)
        gameOver=createSprite(300,130,30,30);
        gameOver.addImage("gameover",gameOverImg)
        gameOver.scale=0.3
   
      }
      else if(result==="loss")
      {
        textAlign(CENTER);
        textSize(40);
        fill(0);
      
        text("You Loose",300,180)
        gameOver=createSprite(300,130,30,30);
        gameOver.addImage("gameover",gameOverImg)
        gameOver.scale=0.3
        play();
      }

  
      if(keyDown(UP_ARROW) && rotatedDegrees<70)
      {
      
          turret.rotateUp();
          rotatedDegrees++;
      }  
      if(keyDown(DOWN_ARROW)&& rotatedDegrees >-25)
      {
          turret.rotateDown();
          rotatedDegrees--;
      }
      
      if(count===0)
      {
        result="win";
      }

      //To show Bullets on the screen
      for(var x = 0; x < bullets.length; x++)
      {
        if(bullets[x].body.position.y > 365)
        {
            Matter.World.remove(myWorld, bullets[x].body);
        }
        else
        {
            bullets[x].display();
        }
      }
    

  //    text(mouseX+" "+mouseY,mouseX,mouseY);
  drawSprites();
} //end of draw


function keyPressed()
{
    if(keyCode === 32 && counter<30)
      {
        var speed = baseClamp(rotatedDegrees/5, 4, 10);
        //console.log(rotatedDegrees);
        bullet = new Bullet(0, 0, 30, 10, rotatedDegrees, speed);
        Matter.Body.setPosition(bullet.body, {x: turret.body.position.x - 50, y: turret.body.position.y - rotatedDegrees/3});
        fire.play();
   
        counter++;
        bullets.push(bullet);
        
      }
       if(counter>=30 && keyCode===32) 
       {
          // console.log("You have exceeded the limit")
           console.log(counter);
          text("YOU HAVE EXCEEDED THE BULLET LIMIT",300,100);
          result="loss";
        }
   
  
}
