const mongoose = require("mongoose");
const autoincrement = require("mongoose-sequence")(mongoose)

//Schema
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //mongoDB gets created an updated timestamp using this options

  }
);

// Information for sequential field. It will create a separate collection called counter and use that to insert ticket# in Notes
noteSchema.plugin(autoincrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model("Notes", noteSchema);
