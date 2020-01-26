/* Subchapter */

function SubChapter(jsonOBJ) {
    //constructor (first letter = maj)
    this.index = 0;
    this.medias = jsonOBJ.map( media => createMedia(media));
    this.playState = undefined;
    // this.medias = jsonOBJ.medias.map( media => {
    //     if(Array.isArray(media)) {
    //         return new MultiMedia(media[1]);
    //     }
    //     return new Img(media);
    // });
}

Object.defineProperties(SubChapter.prototype, {
    playState: {
        get: function() {
            var running = this.medias.some(media => {
                return media.playState === "running";
            });
            var paused = this.medias.some(media => {
                return media.playState === "paused";
            });
            if (running) {
                return "running";
            }
            else if (paused) {
                return "paused";
            }
            return undefined;
        }
    }
});

SubChapter.prototype.load = function() {
    return Promise.all(this.medias.map(media => {
        return media.load();
    }));
};

SubChapter.prototype.play = function() {
    return new Promise ((resolve, reject) => {
        var _this = this;
        async function playMedia(orientation) {
            if (orientation) {
                _this.index = orientation === 1 ? 0 : _this.medias.length -1;
            }
            var media = _this.medias[_this.index];
            if (media) {
                media.play();
                await reversableSleep(media.hasOwnProperty("suspend") && media.suspend === direction ? 16000 : 4000);
                _this.index = _this.findLastStopped(direction === -1);
                playMedia();
            }
            else {
                resolve();
            }
        }
        playMedia(direction);
    });
};

SubChapter.prototype.reverse = function() {
    this.medias.forEach(media => {
        if (media.playState === "running") {
            media.reverse();
        }
    });
};

SubChapter.prototype.pause = function() {
    this.medias.forEach(media => {
        if (media.playState === "running") {
            media.pause();
        }
    });
};

SubChapter.prototype.resume = function() {
    this.medias.forEach(media => {
        if (media.playState === "paused") {
            media.resume();
        }
    });
};

SubChapter.prototype.findLastStopped = function (reversed) {
    var medias = reversed ? this.medias.slice(0).reverse() : this.medias;
    var startIndex = reversed ? medias.length - 1 - this.index : this.index;
    var newIndex =  medias.findIndex((media, index) => {
        return index > startIndex && media.playState !== "running";
    });
    return reversed ? medias.length - 1 - newIndex : newIndex;
};


/* Chapter */

function Chapter(jsonOBJ) {
    this.index = 0;
    this.text = randomPick(jsonOBJ.text);
    this.urn = jsonOBJ.urn;
    this.subChapters = jsonOBJ.subChapters.map(subChapter => {
        return new SubChapter(subChapter, jsonOBJ.urn);
    });
    this.direction = 1;
    this.textIndex = 0;
}

Object.defineProperties(Chapter.prototype, {
    playState: {
        get: function() {
            var running = this.subChapters.some(subChapter => {
                return subChapter.playState === "running";
            });
            var paused = this.subChapters.some(subChapter => {
                return subChapter.playState === "paused";
            });
            if (running) {
                return "running";
            }
            else if (paused) {
                return "paused";
            }
            return undefined;
        }
    }
});

Chapter.prototype.load = function() {
    return Promise.all(this.subChapters.map(subChapter => {
        return subChapter.load();
    }));
};

Chapter.prototype.play = function() {
    return new Promise((resolve, reject) => {
        var _this = this;
        n = 0;
        async function playSubChapter(orientation) {
            if (orientation) {
                _this.textIndex = direction === 1 ? 0 : _this.text.length -1;
                _this.index = orientation === 1 ? 0 : _this.subChapters.length -1;
                await _this.textDisplay(_this.textIndex);
            }
            else {
                _this.index = _this.findLastStopped(direction === -1);
            }
            var subChapter = _this.subChapters[_this.index];
            if (subChapter) {
                await subChapter.play();
                await _this.textDisplay(_this.textIndex);
                playSubChapter();
            }
            else {
                resolve();
            }
        }
        playSubChapter(direction);
    });
};

Chapter.prototype.textDisplay = function(index) {
    return new Promise (async(resolve, reject) => {
        forbidden = true;
        console.log(this.text[index]);
        this.textIndex += direction;
        var duration = this.text[index].length * 215;
        await reversableSleep(duration < 1000 ? 1000 : duration);
        resolve();
        forbidden = false;
    });
};

Chapter.prototype.reverse = function() {
    this.subChapters.forEach(subChapter => {
        if (subChapter.playState === "running") {
            subChapter.reverse();
        }
    });
    this.textIndex += direction * -1;
};
Chapter.prototype.pause = function() {
    this.subChapters.forEach(subChapter => {
        if (subChapter.playState === "running") {
            subChapter.pause();
        }
    });
};
Chapter.prototype.resume = function() {
    this.subChapters.forEach(subChapter => {
        if (subChapter.playState === "paused") {
            subChapter.resume();
        }
    });
};

Chapter.prototype.findLastStopped = function (reversed) {
    var subChapters = reversed ? this.subChapters.slice(0).reverse() : this.subChapters;
    var startIndex = reversed ? subChapters.length - 1 - this.index : this.index;
    var newIndex =  subChapters.findIndex((subChapter, index) => {
        return index > startIndex && subChapter.playState !== "running";
    });
    return reversed ? subChapters.length - 1 - newIndex : newIndex;
};


/* AllChapter */

function AllChapter(jsonOBJ) {
    this.index = 0;
    this.chapters = jsonOBJ.map(chapter => {
        return new Chapter(chapter);
    });
    this.init();
}

AllChapter.prototype.init = function() {
    // this.chapters.forEach((chap, index) => {
    //     var subNumber = chap.urn === "1-norvege" ? 8 : 4;
    //     for (var n = 0; n < subNumber; n++) {
    //         if (n === 0) {
    //             console.log("Chapitre " + (index + 1));
    //         }
    //     }
    // });
};

AllChapter.prototype.load = function() {
    // return Promise.all(this.chapters.map(chapter => {
    //     console.log("Chapter loaded !");
    //     return chapter.load();
    // }));
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < this.chapters.length; i++) {
            for (let j = 0; j < this.chapters[i].subChapters.length; j++) {
                await this.chapters[i].subChapters[j].load();
                if (i === 0 && j === 1) {
                    resolve();
                }
            }
        }
    });
};

AllChapter.prototype.play = function() {
    var _this = this;
    async function playChapter(orientation) {
        if (orientation) {
            _this.index = orientation === 1 ? 0 : _this.chapters.length -1;
        }
        else {
            _this.index = _this.findLastStopped(direction === -1);
            if (direction === -1 && _this.index === 3) {
                return rebootLoadPage();
            }
            else if (direction === 1 && _this.index === -1) {
                _this.index = 0;
            }
        }
        var chapter = _this.chapters[_this.index];
        if (chapter) {
            console.log("Chapitre " + (_this.index + 1));
            await chapter.play();
            await reversableSleep(15000);
            playChapter();
        }
    }
    playChapter(direction);
};

AllChapter.prototype.reverse = function() {
    this.chapters.forEach(chapter => {
        if (chapter.playState === "running") {
            chapter.reverse();
        }
    });
};
AllChapter.prototype.pause = function() {
    this.chapters.forEach(chapter => {
        if (chapter.playState === "running") {
            chapter.pause();
        }
    });
};
AllChapter.prototype.resume = function() {
    this.chapters.forEach(chapter => {
        if (chapter.playState === "paused") {
            chapter.resume();
        }
    });
};

AllChapter.prototype.findLastStopped = function (reversed) {
    var chapters = reversed ? this.chapters.slice(0).reverse() : this.chapters;
    var startIndex = reversed ? chapters.length - 1 - this.index : this.index;
    var newIndex = chapters.findIndex((chapter, index) => {
        return index > startIndex && chapter.playState !== "running";
    });
    return reversed ? chapters.length - 1 - newIndex : newIndex;
};
