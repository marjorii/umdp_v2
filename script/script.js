//UTILS

/* load JSON */

function readJSONFile(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", url);
        request.onload = () => {
            if (request.readyState === 4 && request.status == "200") {
                resolve(JSON.parse(request.responseText));
            }
        }
        request.onerror = () => reject(Error("Couldn't load " + url));
        request.send();
    });
}

/* delay */

// (time in milliseconds)
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/* allow random from to */

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


//OBJECTS

/* Img */
function Img(options) {
    //constructor
    this.title = options.title;
    this.elem = undefined;
    this.uri = "medias/img/medium/1-norvege/" + this.title;
    this.loaded = false;
    this.playState = undefined;
    this.anim = undefined;
    this.ready = false;
}

Img.prototype.load = function() {
    return new Promise ((resolve, reject) => {
        this.elem = new Image();
        this.elem.onload = () => {
            resolve();
            this.loaded = true;
            console.log("Image loaded !");
        };
        this.elem.onerror = () => {
            reject(new Error("Couldn't find" + this.uri));
        };
        this.elem.src = this.uri;
    });
};

Img.prototype.init = function() {
    // create animation
    this._animate();
    //Add elem to DOM
    document.getElementById('container').prepend(this.elem);
    console.log("Image added to DOM !");
    // hide on click
    this.elem.addEventListener("click", () => this.elem.style.display = "none");
    this.ready = "true";
    // this.elem.onclick = function() {
    //     this.style.display = "none";
    // };
    //     resolve();
    // });
};

// the underscore before animate is used to distinguish the name of the function from the function itself
// (_animate ≠ animate();)
Img.prototype._animate = function() {
    var width = this.elem.width;
    var height = this.elem.height;
    var maxX = window.innerWidth;
    var maxY = window.innerHeight;
    var pos = {
        startX: (maxX - width) / 2,
        startY: (maxY - height) /2,
        endX: randomFromTo(-width * 1.5, maxY + width / 2),
        endY: randomFromTo(-height * 1.5, maxY + height / 2)
    };
    var keyframes = [
        {
            transform: "translate(" + pos.startX + "px, " + pos.startY + "px) scale(0)",
            offset: 0
        },
        {
            transform: "translate(" + pos.endX + "px, " + pos.endY + "px) scale(2)",
            offset: 1
        }
    ];

    var options = {
        duration: 10000,
        //easing: "",
        iterations: 1,
        direction: "normal",
        fill: "forwards"
        // fill: "both"
    };
    this.anim = this.elem.animate(keyframes, options);
    this.playState = "running";
    this.anim.onfinish = () => {
        console.log("Animation finished !");
        this.playState = "finished";
    };
}


//CORE

async function initProject() {
    var json = await readJSONFile("script/sources.json");
    imgs = json.chapters[0].subChapters[0].medias;
    window.addEventListener("wheel", scrollHandler, false);
    window.addEventListener("keydown", scrollHandler, false);
    
    imgs = imgs.map( (img) => {
        if(Array.isArray(img))  {
            img = img[0];
        }
        return new Img(img);
    });
    await Promise.all(imgs.map((media) => {
        return media.load();
    }));

    for(var i=0; i<imgs.length; i++) {
        await imgs[i].init();
        await delay(2000);
    }
    console.log("Done !");
}


function scrollHandler(e) {
    function changeDirection() {
        for (const img of imgs) {
            if (img.playState === "running") {
                img.anim.reverse();
            }
        }
    }
    if (e.deltaY > 0 || e.keyCode == "40") {
        if (direction === -1) {
            direction = 1;
            changeDirection();
        }
    }
    else if (e.deltaY < 0 || e.keyCode == "38") {
        if (direction === 1) {
            direction = -1;
            changeDirection();
        }
    }
    else if (e.keyCode == "32") {
        console.log("pause");
    }
    else {
        console.log("no effect");
        return;
    }
    e.preventDefault();
    console.log(direction);
}

//GLOBALS

var imgs;
var direction = 1;


// ACTION

initProject();
