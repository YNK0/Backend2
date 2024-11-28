const mongoose = require('mongoose');
require('dotenv').config();


const url = process.env.URL;

mongoose.set('strictQuery', false);
try {
    mongoose.connect(url);
} catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
}

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
});

noteSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Note = mongoose.model('Note', noteSchema);

const getAll = async () => {
    return await Note.find({});
};

const updateNote = async (id, newNote) => {
    return await Note.findByIdAndUpdate (id, newNote, {new: true});
}

const getNote = async (id) => {
    return await Note.findById(id );
}

const addNote = async (note) => {
    const newNote = new Note({
        content: note.content,
        important: note.important || false
    });

    return await newNote.save();
}

module.exports = {
    getAll,
    updateNote,
    getNote,
    addNote
};