
$(function () {
   flag = 0;
   stopinterval = null;
   duckSound = new Sound("Sounds/duck.mp3");
   golddoveSound = new Sound("Sounds/goldbird.mp3");
   blackdoveSound = new Sound("Sounds/blackbird.mp3");
   doveSound = new Sound("Sounds/bird.mp3");
   bumbsound = new Sound("Sounds/bumb.mp3");


   $("#sound").on("click", function () {
      if (flag == 1) {
         clearInterval(sounds);
         duckSound.pauseSound();
         flag = 0;
         this.src = "images/mute.png"
      }
      else {
         this.src = "images/volume.png";
         sounds = setInterval(function () {
            duckSound.playSound();
         }, 1000);
         flag = 1;
      }

   });
   var duckSound = new Sound("Sounds/duck.mp3");
   var level = localStorage.getItem("currentlevel");
   var position;
   var time;
   var score;
   playername = localStorage.getItem("currentplayer")
   labelName = $("#nameLabel");
   labelscore = $("#scoreLabel");
   labelName.text(playername);

   labelscore.html(`<p>Old score ${localStorage.getItem(playername)}</p>`);
   var goldbirdquantity = randomNumber(5, 10);
   var gbposition;
   var gbtime;
   var gmovement;
   for (let i = 0; i < goldbirdquantity; i++) {
      gbtime = randomNumber(1000, 120000);
      gbposition = randomNumber(50, parseInt($("body").css("height")) - 100);
      gmovement = randomNumber(100, parseInt($("body").css("width")) / 2);
      var goldbirdObj = new Birds(gbposition, gbtime, level, gmovement, 2);
      goldbirdObj.showw();
      goldbirdObj.setPosition();
      goldbirdObj.motion();
      goldbirdObj.clicked();


   }
   var blackbirdquantity = randomNumber(5, 10);
   var blposition;
   var bltime;
   var bmovment;
   for (let i = 0; i < blackbirdquantity; i++) {
      bltime = randomNumber(1000, 110000);
      blposition = randomNumber(50, parseInt($("body").css("height")) - 100);
      bmovment = randomNumber(100, parseInt($("body").css("width")) / 2);
      var blackbirdObj = new Birds(blposition, bltime, level, bmovment, 3);
      blackbirdObj.showw();
      blackbirdObj.setPosition();
      blackbirdObj.motion();
      blackbirdObj.clicked();

   }
   if (level == 2) {
      var bombspeed;
      var bombposition;
      var bombsize;
      var bombtime
      var bomba;
      let quantity = randomNumber(4, 10);
      for (let i = 0; i < quantity; i++) {
         bombspeed = randomNumber(8000, 11000);
         bombsize = randomNumber(20, 35);
         bombposition = randomNumber(10, parseInt($("body").css("width")) - 150);
         bombtime = randomNumber(1000, 110000);
         bomba = new Bomb(bombtime, bombposition, bombspeed, bombsize);
         bomba.clicked();
         bomba.setposition()
         bomba.showw();
         bomba.move();


      }
   };
   var position;
   var time;
   var move;
   var mainbirds = setInterval(function () {

      score = scoree(Birds.countbird + Bomb.killeddoves, Bomb.killedblackdovs + Birds.blcountbird, Bomb.killedgolddovs + Birds.countgoldbird);
      if (score != 0) {
         labelscore.text(score);
         localStorage.setItem(this.playername, score);
      }

      position = randomNumber(10, parseInt($("body").css("height")) - 100);
      move = randomNumber(100, parseInt($("body").css("width")) / 2);
      time = randomNumber(0, 10);
      var birdObj = new Birds(position, time, level, move, 1);
      birdObj.setPosition();
      birdObj.showw();
      birdObj.motion();
      birdObj.clicked();


   }, 300);

   //win if killing 20 dove in 1 minute

   var count = 0;
   setInterval(function () {
      count++;
      var stop = getwin(Birds.countbird + Bomb.killeddoves, count);
      if (stop == true) {
         clearInterval(mainbirds);
         clearInterval(sounds);
         duckSound.pauseSound();
         stopAllelement();
         return;
      }
   }, 1000);

   document.getElementById("closemodal").onclick=function(){
      $("#gameOverModel").css({ display: "none" });

   }

   // after 2 minute game ends

setTimeout(function () {

   $(".dove").stop().remove();
   sgameOverPopUp();
   clearInterval(sounds);
   clearInterval(stopinterval);
   clearInterval(mainbirds);
   duckSound.pauseSound();
}, 120000)

});




$("body").onmousemove = function (event) {
   this.css('cursor', 'url("images.cursor.jpg"), auto');
};

///////////////////////////////////////////////////
class Bomb {
   ////number of killed doves by bomb
   static killeddoves = 0;
   static killedgolddovs = 0;
   static killedblackdovs = 0


   constructor(time, position, speed, size) {
      this.time = time;
      this.position = position;
      this.speed = speed;
      this.size = size;
      this.divObject = $(`<img class='bomb' src='images/giphy.gif' style='width:${this.size + 10 + "px"}; height:${this.size + 10 + "px"} margin-top:"-20px" ;position:absolute'/>`);
   }
   setposition() {
      this.divObject.css({ "margin-left": this.position + "px" })
   }
   showw() {
      this.divObject.delay(this.time).queue(function (next) {
         $(this).appendTo("body");
         next();

      });


   }
   move() {
      this.divObject.animate({ marginTop: parseInt($("body").css("height")) - this.size + "px" }, this.speed, "linear", function () {
         $(this).fadeOut(100).remove();
      });
   }
   clicked() {
      var object = this;
      this.divObject.on("click", function (e) {
         window.playallSound(this);
         var x = e.clientX;
         var y = e.clientY;
         var dovs = document.querySelectorAll(".dove");
         var blackdovs = document.querySelectorAll(".bdove");
         var golddovs = document.querySelectorAll(".gdove");
         object.die(dovs, x, y, this);
         object.die(blackdovs, x, y, this);
         object.die(golddovs, x, y, this);



      });


   }

   die(diedobject, x, y, bombobj) {
      var ob = this;
      for (let n = 0; n < diedobject.length; n++) {
         if (Math.hypot((x - (diedobject[n].getBoundingClientRect().left + 100)), (y - (diedobject[n].getBoundingClientRect().top) + 80)) <= ob.size * 15) {
            diedobject[n].src = `images/${diedobject[n].className}.png`;
            diedobject[n].style.width = "80px";
            diedobject[n].style.height = "80px";
            bombobj.src = "images/tenor.gif";
            bombobj.style.width = ob.size * 10 + "px";
            bombobj.style.height = ob.size * 10 + "px";
            $(bombobj).off();
            $(bombobj).stop();
            $(bombobj).fadeOut(1000);
            $(diedobject[n]).off().stop().animate({ marginTop: `${parseInt($("body").css("height")) + "px"}` }, 2000, function () {
               $(bombobj).fadeOut(200).remove();
            });
            var killed = diedobject[n].className
            switch (killed) {
               case "dove":
                  Bomb.killeddoves += 1;
                  break;
               case "gdove":
                  Bomb.killedgolddovs += 1;
                  break;
               default:
                  Bomb.killedblackdovs += 1;
                  break;
            }

         }

      }

   }
}
///////////////////////////////////////////////////
class Sound {
   constructor(src) {
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");
      this.sound.style.display = "none";
      document.body.appendChild(this.sound);
   }

   playSound() {
      this.sound.play();
   }

   pauseSound() {
      this.sound.pause();
   }
}
//////////////////////////////////////////////
class Birds {
   static countbird = 0;
   static countgoldbird = 0;
   static blcountbird = 0;
   constructor(position, time, level, movement, type) {
      this.position = position;
      this.time = time;
      this.level = level;
      this.movement = movement;
      this.type = type;
      this.directiononlevel2 = 1;
      if (this.type == 1) {
         this.birdImg = $("<img class='dove' src='images/newbired.gif'  style='  width:70px ; height:70px ; position:absolute; margin-left:-100px'/>");
      }
      else if (this.type == 2) {
         this.birdImg = $("<img  class='gdove'src='images/gold.gif'style=' width:100px ; height:100px ; position:absolute; margin-left:-100px'/>");

      }
      else {
         this.birdImg = $("<img  class='bdove'src='images/black.gif'style=' width:100px ; height:100px ; position:absolute; margin-left:-100px'/>");

      }
      if (this.position >= (parseInt($("body").css("height")) - 150) / 2) {
         this.directiononlevel2 = 1;
      }
      else {
         this.directiononlevel2 = 0;
      }


   }



   showw() {

      this.birdImg.delay(this.time).queue(function (next) {
         $(this).appendTo("body");
         next();
      });

   }

   setPosition() {
      this.birdImg.css({ "margin-top": this.position + "px" });

   }

   motion() {

      if (this.level == 1) {
         this.birdImg.animate({ marginLeft: parseInt($("body").css("width")) + 50 + "px" }, 6000,function(){
            $(this).remove(); 
         })
      }
      else if (this.level == 2) {
         if (this.directiononlevel2 == 1) {
            this.birdImg.animate({ 'marginLeft': this.movement + 200 + "px", marginTop: parseInt($("body").css("height")) * -1 + 2 * this.position - 50 + "px" }, 2000, function () {
               $(this).animate({ marginTop: parseInt($("body").css("height")) + 50 + "px", marginLeft: parseInt($("body").css("width")) + 50 + "px" }, 2000, "linear", function () { $(this).fadeOut(200).remove() });
            })
         }
         else {
            this.birdImg.animate({ 'marginLeft': this.movement + 200 + "px", marginTop: (parseInt($("body").css("height")) - this.position + 50) + "px" },
               2000, "linear", function () {
                  $(this).animate({ 'marginLeft': parseInt($("body").css("width")) + 50 + "px", marginTop: "10px" }, 2000, "linear", function () {
                     $(this).fadeOut(200).remove()
                  });
               });
         }

      }

   }
   clicked() {
      var obj = this;
      this.birdImg.on("click", function () {
         $(this).off();
         if (obj.type == 1) {
            this.src = "images/dove.png";
            this.style.width = "80px";
            this.style.height = "80px";
            Birds.countbird += 1;
            window.playallSound(this);

         }
         else if (obj.type == 2) {
            this.src = "images/gdove.png";
            this.style.width = "100px";
            this.style.height = "100px";
            Birds.countgoldbird += 1;
            window.playallSound(this);
         }
         else if (obj.type == 3) {
            this.src = "images/bdove.png";
            this.style.width = "70px";
            this.style.height = "70px";
            Birds.blcountbird += 1;
            window.playallSound(this);
         }
         $(this).stop().animate({ marginTop: `${parseInt($("body").css("height")) + "px"}` }, 2000, function () { $(this).fadeOut(200).remove() });


      });



   }
}


//////////////////////////////////////////////////////////
function scoree(killedBirds, killedBlackBirds, killedGoldBirds) {
   return 5 * killedBirds + 10 * killedGoldBirds - 10 * killedBlackBirds;
}


function getwin(noOfBirds, duration) {

   if (noOfBirds >= 20 && duration <= 60) {

      $(".dove").stop().remove();
      $("#gameOverModel").css({ display: "block" });
      $("#loseorwin").text("You Win ۞");
      document.getElementById("gameOverGiv").src = "images/youwin.gif";
      
      return true;
    

   }
}

function gameOverPopUp() {

   var score = scoree(Birds.countbird + Bomb.killeddoves, Bomb.killedblackdovs + Birds.blcountbird, Bomb.killedgolddovs + Birds.countgoldbird);
   $("#gameOverModel").css({ display: "block" });
   $("#loseorwin").html(`<center>GAME OVER </br>
       Score ${score}<center/>`);
   document.getElementById("gameOverGiv").src = "images/gameover.gif";
   localStorage.setItem(this.playername, score);
}



function randomNumber(min, max) {

   return Math.floor(Math.random() * (max - min)) + min;

}

function stopAllelement() {

   this.stopinterval = setInterval(function () {
      $(".bomb").stop().remove();
      $(".gdove").stop().remove();
      $(".bdove").stop().remove();
      $(".dove").stop().remove();
   },
      30);
}

function playallSound(obj) {


   var type = obj.className;
   if (this.flag == 1) {
      switch (type) {
         case "dove":
            this.doveSound.playSound();
            break;
         case "bdove":
            this.blackdoveSound.playSound();
            break;
         case "gdove":
            this.golddoveSound.playSound();
            break;

         case "bomb":
            this.bumbsound.playSound();
            break;
      }
   }

}





















