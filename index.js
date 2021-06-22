const express=require('express');
const path=require('path');
const port=8000;

const app=express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'Views'));

app.get('/',function(req,res){
    return res.render('home');
});


app.listen(port,function(err){
    if(err){
        console.log('Error in Starting ');
        return ;
    }
    console.log('Server has started');
});