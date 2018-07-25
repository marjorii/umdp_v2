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


//OBJECTS

function Img(options) {
  this.title = options.title;
  this.elem = undefined;
  this.uri = "medias/img/medium/1-norvege/" + this.title;
}
Img.prototype.load = function() {
  return new Promise ((resolve, reject) => {
    this.elem = new Image();
    this.elem.onload = () => {
      resolve();
    };
    this.elem.onerror = () => {
      reject(new Error("Couldn't find" + this.uri));
    };
    this.elem.src = this.uri;
  });
};



//CORE

async function init() {
  var json = await readJSONFile("script/sources.json");
  var jsonImg = json.chapters[0].subChapters[0].medias[0];
  var img = new Img(jsonImg);

  await img.load();
}

init();
