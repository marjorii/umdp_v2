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
    this.animate();
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

Img.prototype.animate = function() {
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
