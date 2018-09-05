/* Subchapter */

function SubChapter(jsonOBJ) {
    //constructor (first letter = maj)
    this.medias = jsonOBJ.medias.map( media => {
        if(Array.isArray(media)) media = media[0];
        return new Img(media);
    });
}

SubChapter.prototype.load = function() {
    return Promise.all(this.medias.map(media => {
        return media.load();
    }));
};
