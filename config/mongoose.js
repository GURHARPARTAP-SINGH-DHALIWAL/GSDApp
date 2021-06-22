const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/chat_app');
mongoose.set('useCreateIndex', true);

const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error Connecting to mongoDB"));

db.once('open',function(){
    console.log('Connected to Database :: MongoDB');
});
module.exports=db;
