//CORE

async function initProject() {
    var json = await readJSONFile("script/sources.json");
    var imgs = json.chapters[0].subChapters[0];//.medias;

    subChapter = new SubChapter(imgs);
    await subChapter.load();

    window.addEventListener("wheel", scrollHandler, false);
    window.addEventListener("keydown", scrollHandler, false);

    await subChapter.play();
    console.log("Done !");
}

function createMedia(media) {
    if(Array.isArray(media)) {
        return new MultiMedia(media);
    }

    const type = media.type;
    if (type === "img") {
        return new Img(media);
    }
    else if (type === "video") {
        return new Video(media);
    }
    else {
        throw(new Error("Wrong or unspecified media type for '" + media.title + "'"));
    }
}


function scrollHandler(e) {
    function changeDirection() {
        subChapter.reverse();
        window.dispatchEvent(new Event("reverse"));
    }
    if (e.deltaY > 0 || e.keyCode == "40") {
        if (!paused && direction === -1) {
            direction = 1;
            changeDirection();
        }
    }
    else if (e.deltaY < 0 || e.keyCode == "38") {
        if (!paused && direction === 1) {
            direction = -1;
            changeDirection();
        }
    }
    else if (e.keyCode == "32") {
        if (!paused) {
            paused = true;
            console.log("pause");
            subChapter.pause();
            window.dispatchEvent(new Event("pause"));
        }
        else {
            paused = false;
            console.log("play");
            subChapter.resume();
            window.dispatchEvent(new Event("resume"));
        }
    }
    else {
        console.log("no effect");
        return;
    }
    e.preventDefault();
    console.log(direction);
}

//GLOBALS

var subChapter;
var direction = 1;
var paused = false;


// ACTION

initProject();
