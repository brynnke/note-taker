const express = require('express');
const path = require('path');
const fs = require('fs');
const util =require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/notes', async (req, res) => {
    const notes = await readFileAsync('db/db.json', 'utf-8');
    res.json(JSON.parse(notes));
})


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    // array 
    req.body.id = notes.length.toString();
  
    if (!validateNOTES(req.body)) {
      res.status(400).send('The note is not properly formatted.');
    } else {
      const notes = createNewNote(req.body, notes);
      res.json(notes);
    }
  });

app.get('/*', (req, res) => {
res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });