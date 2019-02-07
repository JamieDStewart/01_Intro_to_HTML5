var canvas = null;
var context = null;
var img = null;

function main(){
    setup();

    img = new Image();
    img.onload = onImageLoad;
    img.src = "./images/arknoid_pster_720x.jpg"
}

function onImageLoad(){
    console.log("Image Loaded!");
    context.drawImage(img, 10,10);
}

function setup(){
    canvas = document.getElementById("main_canvas");
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth* 0.75;
    canvas.height = window.innerHeight * 0.9;
    canvas.style = "border:1px solid #000000;";
}