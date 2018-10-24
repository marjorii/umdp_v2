//OBJECTS

/* Img */

function Img(options) {
    //constructor
    this.title = options.title;
    this.elem = undefined;
    this.uri = options.uri;
    this.loaded = false;
    this.playState = undefined;
    this.anim = undefined;
    this.ready = false;
}

Object.defineProperties(Img.prototype, {
    playState: {
        get: function() {
            if (this.anim) {
                if (this.anim.currentTime === 0 && ["paused", "pending"].includes(this.anim.playState)) {
                    return "waiting";
                }
                return this.anim.playState;
            }
            return undefined;
        }
    }
});

Img.prototype.load = function() {
    return new Promise ((resolve, reject) => {
        this.elem = new Image();
        this.elem.onload = () => {
            resolve();
            this.loaded = true;
        };
        this.elem.onerror = () => {
            reject(new Error("Couldn't find " + this.uri));
        };
        this.elem.src = this.uri;
    });
};

Img.prototype.init = function() {
    // create animation
    this.createAnimation();
    //Add elem to DOM
    document.getElementById('container').prepend(this.elem);
    // hide on click
    this.elem.addEventListener("click", () => this.elem.classList.add("hide"));
    this.ready = true;
};

Img.prototype.play = function() {
    if(!this.ready) {
        this.init();
    }
    if (this.playState === "finished" || this.playState === "waiting") {
        if (direction === this.anim.playbackRate) {
            this.anim.play();
        } else {
        this.anim.reverse();
        }
    }
    this.elem.classList.remove("hide");
};

Img.prototype.reverse = function() {
    if (this.playState === "running") {
        if (this.anim.playbackRate === direction) {
            this.anim.reverse();
            this.elem.classList.remove("hide");
        }
    }
};
Img.prototype.pause = function() {
    this.anim.pause();
};
Img.prototype.resume = function() {
    this.anim.play();
};

Img.prototype.createAnimation = function() {
    var width = this.elem.width;
    var height = this.elem.height;
    var maxX = window.innerWidth;
    var maxY = window.innerHeight;
    var scale = 1;
    var endX = width + (width * ((scale -1) / 2));
    var endY = height + (height * ((scale - 1) / 2));
    var pos = {
        startX: (maxX - width) / 2,
        // startX: (maxX - width) / 2 + randomFromTo(-100, 100),
        startY: (maxY - height) / 2,
        endX: randomPick([-endX, endX + (maxX - width)]),
        endY: randomFromTo(-endY, endY + (maxY - height)),
        // endXBis: randomFromTo(-endX, endX + (maxX - width)),
        // endYBis: randomPick([-endY, endY + (maxY - height)])
    };
    // var number = Math.random();
    // console.log("number", number);
    // if (number <= 0.5) {
    //     pos.endX = pos.endX;
    //     pos.endY = pos.endY;
    //     console.log("number <= 0.5");
    // } else if (number > 0.5) {
    //     pos.endX = pos.endXBis;
    //     pos.endY = pos.endYBis;
    //     console.log("number > 0.5");
    // }

    var distX = pos.endX - pos.startX;
    var distY = pos.endY - pos.startY;
    var stepScale = scale / 30;
    var actualScale = 0;

    var keyframes = [];

    for (var i = 0; i <= 90; i += 3) {
        var realI = i / 90;
        var stepX = Math.pow(realI, 4) * distX + pos.startX;
        var stepY = Math.pow(realI, 4) * distY + pos.startY;
        var step = {
            transform: "translate(" + stepX + "px, " + stepY + "px) scale(" + actualScale + ")",
            offset: realI
        }
        actualScale += stepScale;
        keyframes.push(step);
    }

    // var animspeed = randomPick([10000, 15000, 20000]);

    var options = {
        duration: 14000,
        easing: "ease-in",
        iterations: 1,
        direction: "normal",
        fill: "both"
    };
    // options.duration = animspeed;
    this.anim = this.elem.animate(keyframes, options);
    this.anim.pause();
}


/* Video */

function Video(options) {
    this.title = options.title;
    this.elem = undefined;
    this.uri = options.uri;
    this.uriReverse = this.uri.replace(".ogg", "-reverse.ogg");
    this.loaded = false;
    this.playState = undefined;
    this.ready = false;
}

Object.defineProperties(Video.prototype, {
    playState: {
        get: function() {
            let video = this.elem;
            if (video.currentTime > 0 && !video.paused) return "running";
            else if (video.ended || video.played.length === 0) return "finished";
            else if (video.paused) return "paused";
            else return undefined;
        }
    }
});

Video.prototype.load = function() {
    return new Promise ((resolve, reject) => {
        this.elem = document.createElement("video");
        this.elem.oncanplaythrough = () => {
            resolve();
            this.loaded = true;
        };
        this.elem.onerror = () => {
            reject(new Error("Couldn't find " + this.uri));
        };
        this.elem.src = this.uri;
    });
};

Video.prototype.init = function() {
    // this.vidIn();
    document.getElementById("mediatable").append(this.elem);
    this.ready = true;
};

Video.prototype.play = function() {
    if(!this.ready) {
        this.init();
    }
    if (direction === 1 && this.elem.src !== this.uri) {
        this.elem.src = this.uri;
    } else if (direction === -1 && this.elem.src !== this.uriReverse) {
        this.elem.src = this.uriReverse;
    }
    this.elem.play();
};
Video.prototype.reverse = function() {
    if (direction === 1) {
        this.elem.src = this.uriReverse;
    } else {
        this.elem.src = this.uri;
    }
    this.elem.play();
};
Video.prototype.pause = function() {
};
Video.prototype.resume = function() {
};


/* Audio */

function Audio(options) {
    this.title = options.title;
    this.elem = undefined;
    this.uri = options.uri;
    this.uriReverse = this.uri.replace(".ogg", "-reverse.ogg");
    this.loaded = false;
    this.playState = undefined;
    this.ready = false;
}

// Object.defineProperties(Audio.prototype, {
//     playState: {
//         get: function() {
//             let audio = this.elem;
//             //FIXME (playstate troubles in subChapter between running medias (audio) and paused medias (img) so set "running" to "playing" on line beneath)
//             if (audio.currentTime > 0 && !audio.paused) return "running";
//             else if (audio.ended || audio.played.length === 0) return "finished";
//             else if (audio.paused) return "paused";
//             else return undefined;
//         }
//     }
// });

Audio.prototype.load = function() {
    return new Promise ((resolve, reject) => {
        this.elem = document.createElement("audio");
        this.elem.oncanplaythrough = () => {
            resolve();
            this.loaded = true;
        };
        this.elem.onerror = () => {
            reject(new Error("Couldn't find " + this.uri));
        };
        this.elem.src = this.uri;
    });
};

Audio.prototype.init = function() {
    document.getElementById("mediatable").append(this.elem);
    this.ready = true;
    this.elem.onended = () => {
        this.playState = "finished";
    };
};

Audio.prototype.play = function() {
    if(!this.ready) {
        this.init();
    }
    if (direction === 1 && this.elem.src !== this.uri) {
        this.elem.src = this.uri;
    } else if (direction === -1 && this.elem.src !== this.uriReverse) {
        this.elem.src = this.uriReverse;
    }
    this.playState = "running";
    this.elem.currentTime = 0;
    this.elem.volume = 1;
    this.elem.play();
    this.fadeTimeOut = setTimeout(() => {
        this.fadeOut();
    }, randomPick([8000, 16000, 24000]));
};

Audio.prototype.fadeOut = function() {
    return new Promise((resolve, reject) => {
        if (this.elem.volume) {
            var volume = 1;
            var step = 0.05;
            this.elem.volume = volume;
            var iAudio = setInterval(() => {
                volume -= step;
                this.elem.volume = volume.toFixed(1);
                if (this.elem.volume <= 0) {
                    clearInterval(iAudio);
                    this.playState = "finished";
                    this.elem.pause();
                    resolve();
                };
            }, 150);
        }
    });
};

Audio.prototype.reverse = function() {
    if (direction === 1) {
        this.elem.src = this.uriReverse;
    } else {
        this.elem.src = this.uri;
    }
    this.elem.play();
};
Audio.prototype.pause = function() {
    this.playState = "paused";
    clearTimeout(this.fadeTimeOut);
};
Audio.prototype.resume = async function() {
    this.playState = "running";
    await this.fadeOut();
    this.elem.pause();
    this.elem.currentTime = 0;
};


/* Multimedia */

function MultiMedia(medias) {
    var [img, ...others] = medias;
    this.img = new Img(img);
    this.medias = others.map(media => createMedia(media));
    this.loaded = false;
    this.ready = false;
    if (img.hasOwnProperty("pause")) {
        this.suspend = img.pause;
    }
}

Object.defineProperties(MultiMedia.prototype, {
    playState: {
        get: function() {
            return this.img.playState;
        }
    }
});

MultiMedia.prototype.load = function() {
    return new Promise ((resolve, reject) => {
        Promise.all([...this.medias.map(media => media.load()), this.img.load()])
        .then(() => {
            this.loaded = true;
            resolve();
        }).catch(err => reject(err));
    });
    // return Promise.all([this.img.load(), ...this.medias.map(media => media.load())]);
};

MultiMedia.prototype.init = function() {
    this.medias.forEach(media => media.init());
    this.img.init();
    this.ready = true;
};

MultiMedia.prototype.play = function() {
    if (!this.ready) this.init();
    this.medias.forEach(other => {
        other.elem.classList.remove("ended");
        other.elem.classList.remove("hide");
    });
    this.medias.forEach(media => media.play());
    this.img.play();
    this.img.anim.onfinish = () => {
        this.medias.forEach(async (other) => {
            other.elem.pause();
            other.elem.classList.add("ended");
            await delay(2000);
            other.elem.classList.add("hide");
        });
    };
};
MultiMedia.prototype.reverse = function() {
    this.img.reverse();
    this.medias.forEach(media => media.reverse());
};
MultiMedia.prototype.pause = function() {
    this.img.pause();
    // this.medias.forEach(media => media.pause());
};
MultiMedia.prototype.resume = function() {
    this.img.resume();
    this.medias.forEach(other => other.elem.classList.add("ended"));
    // this.medias.forEach(media => media.resume());
};
