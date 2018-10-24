//CORE

async function initProject() {
    var json = await readJSONFile("script/sources.json");
    // var json = await readJSONFile("script/sources-test.json");
    json = createUrls(json);

    allChapter = new AllChapter(json);

    document.querySelector("#intro a").addEventListener("click", () => {
        document.getElementById("white-block").classList.add("fade");
        document.getElementById("load").classList.add("fadeBis");
        setTimeout(() => {
            document.getElementById("white-block").classList.add("hide");
        }, 1000);
        document.getElementById("box").classList.add("hide");
    });

    await allChapter.load();

    document.getElementById("load").classList.add("hide");
    document.getElementById("start").classList.remove("hide");

    initEvent();
}

function initEvent() {
    document.getElementById("start").addEventListener("click", () => {
        window.addEventListener("wheel", scrollHandler, false);
        window.addEventListener("keydown", scrollHandler, false);
        document.getElementById("actions-buttons").addEventListener("click", playerOnClick);
        document.querySelector("main").classList.remove("hide");
        document.getElementById("load-page").classList.add("hide");
        allChapter.play();
    });
}
function rebootLoadPage() {
    document.querySelector("main").classList.add("hide");
    document.getElementById("load-page").classList.remove("hide");
    direction = 1;
    window.removeEventListener("wheel", scrollHandler, false);
    window.removeEventListener("keydown", scrollHandler, false);
    document.getElementById("actions-buttons").removeEventListener("click", playerOnClick);
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
    if (e.deltaY > 0 || e.keyCode == "40") {
        changeDirection(1);
    }
    else if (e.deltaY < 0 || e.keyCode == "38") {
        changeDirection(-1);
    }
    else if (e.keyCode == "32") {
        if (!paused) {
            paused = true;
            allChapter.pause();
            window.dispatchEvent(new Event("pause"));
            document.getElementById("pause").src = "medias/ui/play.png";
            document.getElementById("pause").id = "play";
        }
        else {
            paused = false;
            allChapter.resume();
            window.dispatchEvent(new Event("resume"));
            document.getElementById("play").src = "medias/ui/pause.png";
            document.getElementById("play").id = "pause";
        }
    }
    else {
        return;
    }
    e.preventDefault();
    // console.log(direction);
}

function playerOnClick(e) {
    var button = e.target.id;
    if (button == "forward") {
        changeDirection(1);
    }
    else if (button == "backward") {
        changeDirection(-1);
    }
    else if (!paused && button == "pause") {
        paused = true;
        allChapter.pause();
        window.dispatchEvent(new Event("pause"));
        document.getElementById("pause").src = "medias/ui/play.png";
        document.getElementById("pause").id = "play";
    }
    else if (paused && button == "play") {
        paused = false;
        allChapter.resume();
        window.dispatchEvent(new Event("resume"));
        document.getElementById("play").src = "medias/ui/pause.png";
        document.getElementById("play").id = "pause";
    }
    else if (button == "mute") {
        document.querySelectorAll("audio").forEach(audio => audio.muted = true);
        document.getElementById("mute").src = "medias/ui/notmute.png";
        document.getElementById("mute").id = "unmute";
    }
    else if (button == "unmute") {
        document.querySelectorAll("audio").forEach(audio => audio.muted = false);
        document.getElementById("unmute").src = "medias/ui/mute.png";
        document.getElementById("unmute").id = "mute";
    }
    console.log(direction);
}

function createUrls(data) {
    function buildUrl(media, chapter) {
        if (media.type === "img" && media.title.match(/.(jpg|jpeg|png)$/i)) {
            media.uri = [url, "medias", media.type, chapter, media.title].join("/");
        }
        else if (media.type === "img" && media.title.match(/.(gif)$/i)) {
            media.uri = [url, "medias", media.type, "gif", media.title].join("/");
        }
        else if (media.type === "video" || media.type === "audio") {
            media.uri = [url, "medias", media.type, chapter, media.title].join("/");
        }
        return media;
    }
    var url = "https://autre.space/ressources/_marjo";
    var occur = {};

    var randomInt = randomFromTo(0, 2);
    for (var r = 0; r < randomInt; r++) {
        var temp = data.chapters.shift();
        data.chapters.push(temp);
    }

    return data.chapters.map(chapter => {
        var sMix = shuffle(chapter.audio);

        chapter.subChapters = chapter.subChapters.map(subChapter => {
            if (subChapter.int) {
                var pickedNumber = randomFromTo(1, 4);
                for (var g = 0; g < pickedNumber; g++) {
                    var pick = randomPick(data.gifs);
                    var pickedRange = randomFromTo(0, subChapter.medias.length);
                    subChapter.medias.splice(pickedRange, 0, pick);
                    // if (!occur.hasOwnProperty(pick.title)) {
                    //     occur[pick.title] = 1;
                    // }
                    // else {
                    //     occur[pick.title] += 1;
                    // }
                }

                var pickedNumber = randomFromTo(subChapter.int[0], subChapter.int[1]);
                for (var s = 0; s < pickedNumber; s++) {
                    pick = chapter.audio.shift();
                    pickedRange = randomFromTo(0, subChapter.medias.length);
                    subChapter.medias.splice(pickedRange, 0, pick);
                }
            } else {
                pickedNumber = 0;
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


// ACTION

window.onload = () => {
    var isMobile = false;
    if ( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
        document.getElementById("phone-page").classList.add("show");
        document.getElementById("load-page").classList.add("hide");
        document.querySelector("main").classList.add("hide");
    } else {
        isMobile = false;
        initProject();
    }
};
