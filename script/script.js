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


function scrollHandler(e) {
    function changeDirection() {
        subChapter.reverse();
        window.dispatchEvent(new Event("reverse"));
    }
    if (e.deltaY > 0 || e.keyCode == "40") {
        if (direction === -1) {
            direction = 1;
            changeDirection();
        }
    }
    else if (e.deltaY < 0 || e.keyCode == "38") {
        if (direction === 1) {
            direction = -1;
            changeDirection();
        }
    }
    else if (e.keyCode == "32") {
        console.log("pause");
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


// ACTION

initProject();
