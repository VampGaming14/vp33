var dog,food,foodS;

var feedTimeHr,feedTimeMin,lastFeedHr,lastFeedMin;
var hour,minutes;

var gameState,readState,changeState;

var bedroomI,washroomI,gardenI;

function preload(){

    sadDog = loadImage("images/dogImg.png");
    happyDog = loadImage("images/dogImg1.png");
    lazyDog = loadImage("images/Lazy.png");  

    bedroomI = loadImage("images/BedRoom.png");
    washroomI = loadImage("images/Wash Room.png");
    gardenI= loadImage("images/Garden.png");
}
function setup(){

    database = firebase.database();

    var canvas = createCanvas(500,800);

    food = new Food(); 

    foodStock = database.ref("Food");
    foodStock.on("value",read)

    feedTimeHr = database.ref("Hour");
    feedTimeHr.on("value",function(data){

      lastFeedHr = data.val();
    })

    feedTimeMin = database.ref("Minutes");
    feedTimeMin.on("value",function(data){

      lastFeedMin = data.val();
    })
    
    readState = database.ref("gameState");
    readState.on("value",function(data){

      gameState = data.val();
    })

    dog = createSprite(250,600);
    dog.addImage(sadDog);
    dog.scale = 0.2;

    feed = createButton("Feed the Dog");
    feed.position(400,800);

    addFood = createButton("Add the Food");
    addFood.position(700,800);

    feed.mousePressed(feedDog)

    addFood.mousePressed(addMilk);

    hour = hour();
    minutes = minute();
}

function draw(){

    background("yellow")

    drawSprites();
     

    //console.log()

  fill("red");
  textSize(30);
  textFont(BOLD);

  if(hour>12){
  text("Feed Time: "+lastFeedHr%12+":"+lastFeedMin+" PM",100,50)
  }
  else if(hour==0){
    text("Feed Time: 12"+lastFeedMin+"AM",50,50)
  }
  else{
    text("Feed Time: "+lastFeedHr+":"+lastFeedMin+" AM",110,50)
  }
 
//Changing gameState
  if(gameState!="Hungry"){

    feed.hide();
    addFood.hide();
    
    //dog.remove();
  }else{

    feed.show();
    addFood.show();
    food.display();
    //dog.addImage(sadDog);
  }

  if(hour==(lastFeedHr+1)){
    updateState("Playing")
    var garden = createSprite(250,400);
    garden.addImage(gardenI);
  }
  else if(hour==(lastFeedHr+2)){
     updateState("Sleeping")
     var bedroom = createSprite(250,400);
     bedroom.addImage(bedroomI);
  }
  else if(hour==(lastFeedHr+3)){
    updateState("Bathing")
    var washroom = createSprite(250,400);
    washroom.addImage(washroomI)
  }
  else{
    updateState("Hungry")
    
  }
 
}

function feedDog(){

  if(foodS>0){
    dog.addImage(happyDog);

    foodS--

    database.ref("/").update({
    
      Food:foodS,
      Hour:hour,
      Minutes:minutes
    })

  }
}

function addMilk(){

    dog.addImage(sadDog);

    foodS++

    database.ref("/").update({
    
      Food:foodS,
  
})

}

function read(data){

    foodS = data.val();
   food.updateFood(foodS);
    
  }

  //Function to update gameState in database
  function updateState(state){

 database.ref("/").update({

  gameState:state
 })
  }
