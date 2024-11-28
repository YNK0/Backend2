const express = require('express');
const cors = require('cors');
const app = express();
const Note = require('./models/note');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const requestLogger = (req, _res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

let notes = [];

app.get('/', (_req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
});

app.get('/api/notes', async (_req, res) => {
    const notes = await Note.getAll();
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);

    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});

app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false
    };

    Note.addNote(note)
    .then(newNote => {
        res.json(newNote);
    }).catch(error => {
        console.error(error);
        res.status(500).end();
    });

});

app.put('/api/notes/:id', async (req, res) => {
    const id = (req.params.id);
    const note = await Note.getNote(id);

    if (!note) {
        return res.status(404).end();
    }

    const body = req.body;
    const newNote = {
        content: body.content,
        important: body.important
    };

    const updatedNote = await Note.updateNote(id, newNote);
    res.json(updatedNote);
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});