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

/* delay */

// (time in milliseconds)
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/* allow random from to */

function randomFromTo(from, to, decimal){
    if (decimal) {
        //return decimal value if (..,..,true)
        return Math.random() * (to - from + 1) + from;
    }
    else {
        //return integar
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
}
