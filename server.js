// const
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const PORT = process.env.PORT || 3001;
const app = express();

// .use

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes

app.get('/api/notes', async (req, res) => {
    const notes = await readFileAsync('db/db.json', 'utf-8');
    res.json(JSON.parse(notes));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// function for creating a new note 

function createNewNotes(body, notesArray) {
    const newNotes = body;
    if(!Array.isArray(notesArray))
        notesArray = [];
    
        if (notesArray.length === 0)
            notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0] ++;

    notesArray.push(newNotes);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNotes;
}

app.post('/api/notes', (req, res) => {
    const newNotes = createNewNotes(req.body, allNotes);
    res.json(newNotes);
});

function deleteNotes(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++){
        let note = notesArray [i];

        if(note.id == id) {
            notesArray.splice(i,1);
            fs.writeFileAsync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
        }
    }
}

app.delete('/api/notes/:id', (req,res) => {
    deleteNotes(req.params.id, allNotes);
    res.json(true);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});