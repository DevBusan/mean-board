// Post.js

var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    comments: [{
        writer: { type: String },
        memo: { type: String },
        email: { type: String },
        writeDate: { type: Date, default: Date.now }
    }],
    count:{ type:Number, default: 0 },
    like :{ type:Number, default: 0 },
    attach:[{
        uuid: { type:String },
        filename: { type:String },
        path: {type:String}
    }]
});

postSchema.virtual('createdDate').get(function() {
    return getDate(this.createdAt);
});

postSchema.virtual('createdTime').get(function() {
    return getTime(this.createdAt);
});

postSchema.virtual('updatedDate').get(function() {
    return getDate(this.updatedAt);
});

postSchema.virtual('updatedTime').get(function() {
    return getTime(this.updatedAt);
});

var Post = mongoose.model('post', postSchema);

function getDate(dateObj) {
    if (dateObj instanceof Date) {
        return dateObj.getFullYear() + '-' + get2Digits(dateObj.getMonth() + 1) + '-' + get2Digits(dateObj.getDate());
    }
}

function getTime(dateObj) {
    if (dateObj instanceof Date) {
        return get2Digits(dateObj.getHours()) + ":" + get2Digits(dateObj.getMinutes()) + ":" + get2Digits(dateObj.getSeconds());
    }
}

function get2Digits(num) {
    return ("0" + num).slice(-2);
}

module.exports = Post;