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
    var pos = {
        startX: (maxX - width) / 2,
        startY: (maxY - height) / 2,
        endX: randomFromTo(-width * 1.5, maxY + width / 2),
        endY: randomFromTo(-height * 1.5, maxY + height / 2)
    };
    var keyframes = [
        {
            transform: "translate(" + pos.startX + "px, " + pos.startY + "px) scale(0)",
            offset: 0
        },
        {
            transform: "translate(" + pos.endX + "px, " + pos.endY + "px) scale(1.75)",
            offset: 1
        }
    ];

    var options = {
        duration: 10000,
        //easing: "",
        iterations: 1,
        direction: "normal",
        fill: "both"
    };
    this.anim = this.elem.animate(keyframes, options);
    this.anim.pause();
}


/* Video */

function Video(options) {
    this.title = options.title;
    this.elem = undefined;
    this.uri = options.uri;
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
    document.getElementById("mediatable").append(this.elem);
    this.ready = true;
};

Video.prototype.play = function() {
    if(!this.ready) {
        this.init();
    }
    this.elem.play();
};
Video.prototype.reverse = function() {
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
    this.playState = "running";
    this.elem.play();
    this.pAudio = setTimeout(() => {
        this.fade(-1);
    }, randomPick([8000, 16000, 24000]));
};

Audio.prototype.fade = function(dir) {
    return new Promise((resolve, reject) => {
        if (this.elem.volume) {
            var int = dir === 1 ? 0 : 1;
            var setVolume = dir === 1 ? 1 : 0;
            var speed = dir === 1 ? 0.05 : -0.05;
            this.elem.volume = int;
            this.iAudio = setInterval(() => {
                int += speed;
                this.elem.volume = int.toFixed(1);
                if ((dir === 1 && int.toFixed(1) >= setVolume) || (dir === -1 && int.toFixed(1) <= setVolume)) {
                    clearInterval(this.iAudio);
                    resolve();
                };
            }, 150);
        }
    });
};

Audio.prototype.reverse = function() {
};
Audio.prototype.pause = function() {
    this.playState = "paused";
    console.log(this.pAudio);
    clearTimeout(this.pAudio);
};
Audio.prototype.resume = async function() {
    this.playState = "running";
    await this.fade(-1);
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
        other.elem.classList.remove("hide");
    });
    this.medias.forEach(media => media.play());
    this.img.play();
    this.img.anim.onfinish = () => {
        this.medias.forEach(other => {
            other.elem.pause();
            other.elem.classList.add("hide");
        });
    };
};
MultiMedia.prototype.reverse = function() {
    this.img.reverse();
    // this.medias.forEach(media => media.reverse());
};
MultiMedia.prototype.pause = function() {
    this.img.pause();
    // this.medias.forEach(media => media.pause());
};
MultiMedia.prototype.resume = function() {
    this.img.resume();
    // this.medias.forEach(media => media.resume());
};
