const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ticketSchema = require('../../TicketSchema');

const defaultTodoSchema = new Schema({
  todos: [
    {
      daysDue: { type: Number, default: 0 },
      todo: ticketSchema,
    },
  ],
});

module.exports = defaultTodoSchema;
