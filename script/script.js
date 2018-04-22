
jQuery(document).ready(function($) {

/* global variables */

var arrayImg = [];
var speed = 0;


/* load images from JSON -- JS */
function loadJSON(url, callback) { // ligne 1
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = JSON.parse(this.response)[0];
        callback(data);
      } else {
        // We reached our target server, but it returned an error
      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();
}


/* loop to read images + animation -- JS */

// addImageTag = callback
// imgUrls = data
function addImageTag(imgUrls) {
    // get and delete first image of array
    var url= imgUrls.shift();
    // undefined = when all the images are deleted
    if (url !== undefined) {
        // check if next element = video
        if (imgUrls[0].indexOf("/video/") > -1) {
            addVideoTag(imgUrls.shift());
        }
        // create image
        var imgTag = document.createElement("img");
        imgTag.setAttribute("src", url);
        imgTag.className = 'image';
        document.getElementById('container').prepend(imgTag);
        imageAnim(imgTag);
        setTimeout(function () {
            addImageTag(imgUrls);
        }, randomFromTo(1000, 3000));
    }
}

function addVideoTag(url) {
    var videoTag = document.createElement("video");
    videoTag.setAttribute("src", url);
    videoTag.className = 'video';
    document.getElementsByTagName("body")[0].prepend(videoTag);
    //lancer lecture video (on load ?)
}


// animate image
function imageAnim(imgTag) {
    var halfX = window.innerWidth /2;
    var halfY = window.innerHeight /2;
    //get img size
    var imgWidth = imgTag.width;
    var imgHeight = imgTag.height;
    var scale_start = 0;
    var scale_end = randomFromTo(3, 10, true);
    // img width x final img width (after scale) + half inner window width
    var maxWidth = imgWidth * scale_end + halfX;
    // minWidth = -variable (-maxWidth)
    var maxHeight = imgHeight * scale_end - halfY;
    var end = [randomFromTo(-maxWidth, maxWidth), randomFromTo(-maxHeight, maxHeight), 0];

    var keyframes = [
        {
            // opacity:1,
            transform: "translate3d(0px, 0px, 0px) scale(" + scale_start + ")",
            offset:0
        },
        {
            // opacity:0,
            transform: "translate3d(" + end.join('px,') + "px) scale(" + scale_end + ")",
            offset:1
        }
    ];

    var options = {
        duration: 15000,
        iterations: 1,
        fill: "forwards"
    };

    var anim = imgTag.animate(keyframes, options);
    anim.playbackRate = speed/10;
    //add image DOM element to begining of global array 'arrayImg'
    arrayImg.unshift(anim);
}

loadJSON("sources.json", addImageTag); // function(url, callback); (cf. line 1)


/* allow randomFromTo */

function randomFromTo(from, to, decimal){
  if (decimal) {
    //return decimal value if (..,..,true)
    return Math.random() * (to - from + 1) + from;
  }
  else {
    //return integar
    return Math.floor(Math.random() * (to - from + 1) + from);
  }
}


/* Check scroll direction with scroll + cursor keys -- JS */
/* /!\ e.keyCode isn't crossbrowser */

function checkScrollPos(e) {
    if (e.deltaY) {
        console.log("delta", e.deltaY);
    }
    if (e.deltaY > 0 || e.keyCode == '40') {
        console.log('forwards');
        speed += 1;
        }
    else if (e.deltaY < 0 || e.keyCode == '38') {
        console.log('backwards');
        speed -= 1;
    }
    else if (e.keyCode == '32') {
        console.log('pause');
        speed = 0;
    }
    else if (e.keyCode != '37' && e.keyCode != '39') {
        console.log('no effect');
        return;
    }
    e.preventDefault();
    changeAnimSpeed();
    console.log(speed);
}

window.addEventListener('wheel', checkScrollPos, false);
window.addEventListener('keydown', checkScrollPos, false);


/* change speed function -- JS */

function changeAnimSpeed() {
    for (var i=0; i < arrayImg.length; i++) {
        arrayImg[i].playbackRate = speed /10;
    }
}


// suppress image from DOM on click -- jQuery

$('#container').click(function(e){
    $(e.target).not($('#container')).fadeOut(2000);
});


});
