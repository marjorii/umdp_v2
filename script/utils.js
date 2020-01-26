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

/* random pick function */

function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/* shuffle function */

function shuffle(array) {
    let remaining = array.length;
    while (remaining > 0) {
        let index = Math.floor(Math.random() * remaining--);
        let temp = array[remaining];
        array[remaining] = array[index]
        array[index] = temp;
    }
    return array;
}

function randomNumbers(n, maxn) {
    var numbers = []
    while (numbers.length < n) {
        let number = Math.floor(Math.random() * maxn);
        if (!numbers.includes(number)) numbers.push(number);
    }
    return numbers;
}

/* reverse sleep */

function reversableSleep(duration) {
    // this function has its own "direction" variable
    return new Promise (resolve => {
        const _this = this;
        function reverse() {
            clearTimeout(timeOut);
            saveState();
            //ternary condition (if smthg === smthg ?(do) this :(else do) this;)
            selfDirection = selfDirection === 1 ? -1 : 1;
            timeOut = setTimeout(resolver, selfDirection === 1 ? duration - totalSpent : totalSpent);
        }

        function pause() {
            clearTimeout(timeOut);
            saveState();
            window.removeEventListener("reverse", reverse);
            window.removeEventListener("pause", pause);
            window.addEventListener("resume", resume);
        }

        function resume() {
            start = performance.now();
            window.removeEventListener("resume", resume);
            window.addEventListener("reverse", reverse);
            window.addEventListener("pause", pause);
            timeOut = setTimeout(resolver, selfDirection === 1 ? duration - totalSpent : totalSpent);
        }

        function saveState() {
            var now = performance.now();
            var timeSpent = now - start;
            start = now;
            totalSpent += selfDirection === 1 ? timeSpent : -timeSpent;
        }

        function resolver() {
            window.removeEventListener("pause", pause);
            window.removeEventListener("reverse", reverse);
            resolve();
        }

        var totalSpent = 0;
        var selfDirection = 1;
        var start = performance.now();
        var paused = false;
        var timeOut = setTimeout(resolver, duration);
        window.addEventListener("reverse", reverse);
        window.addEventListener("pause", pause);
    });
}
