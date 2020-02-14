
$(function () {
  var level = 1;
  var level1selection = $("#Level1");
  var level2selection = $("#Level2");
  level1selection.on("click", function () {
    level = 1;
  });
  level2selection.on("click", function () {
    level = 2;
  });
  var playbtn = $("#playbtn");
  var namee = document.getElementById("inputTxt");
  playbtn.on("click", function () {
    console.log("loloooooooooo");
    localStorage.setItem("currentplayer", namee.value);
    localStorage.setItem("currentlevel", level);

  });


});

