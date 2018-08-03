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


//OBJECTS

/* constructeur */
function Img(options) {
    this.title = options.title;
    this.elem = undefined;
    this.uri = "medias/img/medium/1-norvege/" + this.title;
    this.loaded = false;
}

/* prototypes */
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
    return new Promise (async (resolve, reject) => {
        // if this.loaded isn't true
        if(!this.loaded) {
            console.log("Image loading !");
            await this.load();
        }
        document.getElementById('container').prepend(this.elem);
        console.log("Image added to DOM !");
        resolve();
    });
}
Img.prototype.animate = function() {

}

//CORE

async function initProject() {
    var json = await readJSONFile("script/sources.json");
    var imgs = json.chapters[0].subChapters[0].medias;
    console.log(imgs);
    // method map = array method, cf. forEach() but with return
    imgs = imgs.map( (img) => {
        if(Array.isArray(img))  {
            img = img[0];
        }
        return new Img(img);
    });

    console.log(imgs);
    // cf. for loop
    imgs.forEach(async (img) => {
        await img.init();
    });
    console.log("Done !");
}

initProject();
