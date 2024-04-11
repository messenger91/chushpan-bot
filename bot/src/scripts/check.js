const { contents } = require('../data/contents_202404022338.json')


let stats = {

}

for (const content of contents) {
    
    if (!stats[content.filesize]) {
        stats[content.filesize] = 0
    }
    ++stats[content.filesize]
}

let sortable = [];
for (var vehicle in stats) {
    sortable.push([vehicle, stats[vehicle]]);
}

sortable.sort(function(a, b) {
    return a[1] - b[1];
});
console.log('sortable', sortable.reverse())