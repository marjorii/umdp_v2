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

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

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

/* constructeur */
function Img(options) {
    this.title = options.title;
    this.elem = undefined;
    this.uri = "medias/img/medium/1-norvege/" + this.title;
    this.loaded = false;
}

/* prototypes */

/* load */
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

/* init */
Img.prototype.init = function() {
    return new Promise (async (resolve, reject) => {
        // if this.loaded isn't true
        if(!this.loaded) {
            console.log("Image loading !");
            await this.load();
        }
        document.getElementById('container').prepend(this.elem);
        console.log("Image added to DOM !");
        // hide on click
        this.elem.addEventListener("click", () => this.elem.style.display = "none");
        // this.elem.onclick = function() {
        //     this.style.display = "none";
        // };
        resolve();
    });
};

/* animate */
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
        iterations: 1,
        fill: "forwards"
    };
    this.anim = this.elem.animate(keyframes, options);
    this.anim.onfinish = () => {
        console.log("Animation finished !");
    };
}


//CORE

async function initProject() {
    var json = await readJSONFile("script/sources.json");
    var imgs = json.chapters[0].subChapters[0].medias;
    console.log(imgs);
    // method map = array method (return a new array), cf. forEach() but with return
    imgs = imgs.map( (img) => {
        if(Array.isArray(img))  {
            img = img[0];
        }
        return new Img(img);
    });

    // Promise.all waits for every promises [in an array]
    await Promise.all(imgs.map((img) => {
        return img.load();
    }));

    console.log(imgs);
    for(var i=0; i<imgs.length; i++) {
        imgs[i]._animate();
        await imgs[i].init();
        await delay(2000);
    }
    console.log("Done !");
}

initProject();
