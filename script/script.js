//CORE
async function initProject() {
    var json = await readJSONFile("script/sources.json");
    json = createUrls(json);
    allChapter = new AllChapter(json);

    if (window.location.href.split("#")[1] !== "hidebox") {
        document.getElementById("white-block").classList.remove("hide");
        document.getElementById("box").classList.remove("hide");
        document.querySelector("#intro a").addEventListener("click", () => {
            document.getElementById("white-block").classList.add("fade");
            document.getElementById("load").classList.add("fadeBis");
            setTimeout(() => {
                document.getElementById("white-block").classList.add("hide");
            }, 1000);
            document.getElementById("box").classList.add("hide");
        });
    } else {
        document.getElementById("load").classList.add("opacity");
    }
    await allChapter.load();
    document.getElementById("load").classList.add("hide");
    document.getElementById("start").classList.remove("hide");
    initEvent();
}

function initEvent() {
    document.getElementById("start").addEventListener("click", () => {
        window.addEventListener("keydown", scrollHandler, false);
        document.querySelector("main").classList.remove("hide");
        document.getElementById("load-page").classList.add("hide");
        allChapter.play();
    });
}
function rebootLoadPage() {
    document.querySelector("main").classList.add("hide");
    document.getElementById("load-page").classList.remove("hide");
    direction = 1;
    window.removeEventListener("keydown", scrollHandler, false);
}

function createMedia(media, urn) {
    if(Array.isArray(media)) {
        return new MultiMedia(media, urn);
    }
    const type = media.type;
    if (type === "img") {
        return new Img(media, urn);
    }
    else if (type === "video") {
        return new Video(media, urn);
    }
    else if (type === "audio") {
        return new Audio(media, urn);
    }
    else {
        throw(new Error("Wrong or unspecified media type for '" + media.title + "'"));
    }
}

function changeDirection(dir) {
    if (!paused && direction !== dir) {
        allChapter.reverse();
        window.dispatchEvent(new Event("reverse"));
        direction = dir;
    }
}

function scrollHandler(e) {
    //down arrow: forward
    if (e.deltaY > 0 || e.keyCode == "40") {
        if (!forbidden) changeDirection(1);
    }
    //up arrow: backward
    else if (e.deltaY < 0 || e.keyCode == "38") {
        if (!forbidden) changeDirection(-1);
    }
    //space: play/pause
    else if (e.keyCode == "32") {
        if (!paused) {
            paused = true;
            allChapter.pause();
            window.dispatchEvent(new Event("pause"));
        }
        else {
            paused = false;
            allChapter.resume();
            window.dispatchEvent(new Event("resume"));
        }
    }
    //escape: shuffle
    else if (e.keyCode == "27") {
        window.location.href = window.location.href.split("#")[0] + "#hidebox";
        window.location.reload();
    }
    else {
        return;
    }
    e.preventDefault();
    // console.log(direction);
}

function createUrls(data) {
    function buildUrl(media, chapter) {
        if (media.type === "img" && media.title.match(/.(jpg|jpeg|png)$/i)) {
            media.uri = ["medias", media.type, chapter, media.title].join("/");
        }
        else if (media.type === "img" && media.title.match(/.(gif)$/i)) {
            media.uri = ["medias", media.type, "gif", media.title].join("/");
        }
        else if (media.type === "video" || media.type === "audio") {
            media.uri = ["medias", media.type, chapter, media.title].join("/");
        }
        return media;
    }
    var occur = {};
    var randomInt = randomFromTo(0, 2);
    for (var r = 0; r < randomInt; r++) {
        var temp = data.chapters.shift();
        data.chapters.push(temp);
    }
    return data.chapters.map(chapter => {
        var sMix = shuffle(chapter.audio);
        chapter.subChapters = chapter.subChapters.map(subChapter => {
            var toRemove = randomNumbers(Math.floor(subChapter.medias.length/2), subChapter.medias.length - 1)
            subChapter.medias = subChapter.medias.filter((media, index) => {
                return !toRemove.includes(index);
            });
            if (subChapter.int) {
                var pickedNumber = randomFromTo(1, 2);
                for (var g = 0; g < pickedNumber; g++) {
                    var pick = randomPick(data.gifs);
                    var pickedRange = randomFromTo(0, subChapter.medias.length);
                    subChapter.medias.splice(pickedRange, 0, pick);
                }
                pickedNumber = randomFromTo(subChapter.int[0], subChapter.int[1]);
                for (var s = 0; s < pickedNumber; s++) {
                    pick = chapter.audio.shift();
                    pickedRange = randomFromTo(0, subChapter.medias.length);
                    subChapter.medias.splice(pickedRange, 0, pick);
                }
            }
            return subChapter.medias.map(media => {
                if (Array.isArray(media)) {
                    return media.map(med => {
                        return buildUrl(med, chapter.urn);
                    });
                }
                return buildUrl(media, chapter.urn);
            });
        });
        return chapter;
    });
}

//GLOBALS
var allChapter;
var direction = 1;
var paused = false;
var forbidden = false;

// ACTION
window.onload = () => {
    initProject();
};
