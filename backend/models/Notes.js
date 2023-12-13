const mongoose = require('mongoose')
const autoIncrement = require('mongoose-plugin-autoinc').autoIncrement

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },        
    },
    {
        timestamps: true
    }
)

noteSchema.plugin(autoIncrement, {
    model:"Notes",
    field: 'ticket',
    startAt: 500
})

module.exports = mongoose.model('Notes', noteSchema)