const express = require('express');
const app = express();

// definition of materials
class Material {
    constructor(id, name, color, volume, cost, date) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.volume = volume;
        this.cost = cost;
        this.date = date;
    }
}

// map
var materials = new Map();
var lastestId = -1;

app.use('/get', (req, res) => {
    var id = req.query.id;
    var out = [];
    if (id) {
        // if array
        if (Array.isArray(id)) {
            id.forEach((id) => {
                var material = materials.get(parseInt(id));
                // if undefined
                if (material) {
                    out.push(material);
                } else {
                    out.push(new Material(parseInt(id), 'Error', 0, 0, 0, 0));
                }
            });
        } else { // if not array
            var material = materials.get(parseInt(id));
            if (material) {
                out.push(material);
            } else {
                out.push(new Material(parseInt(id), 'Error', 0, 0, 0, 0));
            }
        }
    } else {
        if (materials.length !== 0) {
            materials.forEach((material) => {
                out.push(material);
            });
        }
    }
    res.json(out);
});

app.use('/set', (req, res) => {
    // read id and status from query parameters
    var id = req.query.id;
    var name = req.query.name;
    var color = req.query.color;
    var volume = req.query.volume;
    var cost = req.query.cost;
    var date = req.query.date;
    // create new Material object
    var material;
    if (id) {
        var material = new Material(parseInt(id), name, color, volume, cost, date);
        // add it to Map
        materials.set(parseInt(id), material);
        //console.log(materials);
    } else {
        lastestId++;
        var material = new Material(lastestId, 'New Material', 0, 0, 0, 0);// add it to Map
        materials.set(lastestId, material);
    }
    // send it back to caller
    res.json(material);
});

app.use('/remove', (req, res) => {
    // read id and status from query parameters
    var id = req.query.id;
    if (id) {
        materials.delete(parseInt(id));
    } else {
        materials = new Map();
    }
    // send it back to caller
    res.json(materials);
});

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.render( __dirname + '/index.html');
});

// This starts the web server on port 3000. 
app.listen(3000, () => {
    console.log('Listening on port 3000');
});