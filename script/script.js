//CORE

async function initProject() {
    var json = await readJSONFile("script/sources.json");
    var imgs = json.chapters[2];//.subChapters[0].medias;

    chapter = new Chapter(imgs);
    await chapter.load();

    await chapter.play();
    console.log("Done !");
}

function initEvent() {
    window.addEventListener("wheel", scrollHandler, false);
    window.addEventListener("keydown", scrollHandler, false);
    document.getElementById("actions-buttons").addEventListener("click", playerOnClick);
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
    else if (type === "sound") {
        return new Audio(media, urn);
    }
    else {
        throw(new Error("Wrong or unspecified media type for '" + media.title + "'"));
    }
}

function changeDirection(dir) {
    if (!paused && direction !== dir) {
        chapter.reverse();
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
            console.log("pause");
            chapter.pause();
            window.dispatchEvent(new Event("pause"));
            document.getElementById("pause").src = "medias/ui/play.png";
            document.getElementById("pause").id = "play";
        }
        else {
            paused = false;
            console.log("play");
            chapter.resume();
            window.dispatchEvent(new Event("resume"));
            document.getElementById("play").src = "medias/ui/pause.png";
            document.getElementById("play").id = "pause";
        }
    }
    else {
        console.log("no effect");
        return;
    }
    e.preventDefault();
    console.log(direction);
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
        chapter.pause();
        window.dispatchEvent(new Event("pause"));
        document.getElementById("pause").src = "medias/ui/play.png";
        document.getElementById("pause").id = "play";
        console.log("pause");
    }
    else if (paused && button == "play") {
        paused = false;
        chapter.resume();
        window.dispatchEvent(new Event("resume"));
        document.getElementById("play").src = "medias/ui/pause.png";
        document.getElementById("play").id = "pause";
        console.log("play");
    }
    else if (button == "mute") {
        document.querySelectorAll("audio").forEach(audio => audio.muted = true);
        document.getElementById("mute").src = "medias/ui/notmute.png";
        document.getElementById("mute").id = "unmute";
        console.log("mute");
    }
    else if (button == "unmute") {
        document.querySelectorAll("audio").forEach(audio => audio.muted = false);
        document.getElementById("unmute").src = "medias/ui/mute.png";
        document.getElementById("unmute").id = "mute";
        console.log("unmute");
    }
}

//GLOBALS

var subChapter;
var chapter;
var direction = 1;
var paused = false;


// ACTION

initEvent();
initProject();
