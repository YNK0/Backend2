const express = require('express');
const cors = require('cors');
const app = express();


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

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
];

app.get('/', (_req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
});

app.get('/api/notes', (_req, res) => {
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

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0;
    return maxId + 1;
};

app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false
    };

    notes = [...notes, note];
    res.json(note);
});

app.put('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const note = notes.find(note => note.id === id);
    if (!note) {
        return res.status(404).end();
    }

    const updatedNote = {
        ...note,
        important: body.important
    };

    notes = notes.map(note => note.id !== id ? note : updatedNote);
    res.json(updatedNote);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});