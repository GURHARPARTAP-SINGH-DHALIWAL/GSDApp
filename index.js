const express=require('express');
const path=require('path');
const port=8000;
const db=require('./config/mongoose');
const User=require('./models/user');
const cookieparser=require('cookie-parser');

const app=express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'Views'));

app.use(express.static('assets'));
app.use(express.urlencoded());
app.use(cookieparser());


app.get('/',function(req,res){
    return res.render('home');
});
app.post('/create',function(req,res){
    User.findOne({username:req.body.username},function(err,user){
        if(err){console.log("Error in finding user in signing up");return ;}
        if(!user)
        {
            User.create(req.body,function(err,user){
                console.log(user);
                return res.redirect('/sign-in');
            });
        }
        else
        {
            res.redirect('/sign-in');
        }
    });
});
app.get('/sign-in',function(req,res){
    return res.render('sign_in');
});
app.get('/sign-up',function(req,res){
    return res.render('sign_up');
});


app.listen(port,function(err){
    if(err){
        console.log('Error in Starting ');
        return ;
    }
    console.log('Server has started');
});