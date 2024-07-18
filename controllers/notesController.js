const Note = require('../models/Note');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Function to strip Zero Width Space characters
const stripZeroWidthSpace = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, '');

// @desc Get all notes 
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean();

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' });
    }

    // Add username to each note before sending the response 
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, username: user?.username || 'Unknown' };
    }));

    res.json(notesWithUser);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    let { user, title, text } = req.body;

    // Strip Zero Width Space characters
    user = stripZeroWidthSpace(user);
    title = stripZeroWidthSpace(title);
    text = stripZeroWidthSpace(text);

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findById(user).exec();
    if (!existingUser) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    // Create and store the new note
    const note = await Note.create({ user: existingUser._id, title, text });
    if (note) {
        return res.status(201).json({ message: 'New note created' });
    } else {
        return res.status(400).json({ message: 'Invalid note data received' });
    }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    let { id, user, title, text, completed } = req.body;

    // Strip Zero Width Space characters
    id = stripZeroWidthSpace(id);
    user = stripZeroWidthSpace(user);
    title = stripZeroWidthSpace(title);
    text = stripZeroWidthSpace(text);

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();
    res.json(`'${updatedNote.title}' updated`);
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    let { id } = req.body;

    // Strip Zero Width Space characters
    id = stripZeroWidthSpace(id);

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' });
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    const result = await note.deleteOne();
    const reply = `Note '${result.title}' with ID ${result._id} deleted`;
    res.json(reply);
});

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
};
