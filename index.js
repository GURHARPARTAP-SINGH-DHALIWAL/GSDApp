const express=require('express');
const path=require('path');
const port=8000;
const db=require('./config/mongoose');
const User=require('./models/user');
const cookieparser=require('cookie-parser');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

const app=express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'Views'));

app.use(express.static('assets'));
app.use(express.urlencoded());
app.use(cookieparser());

app.use(session({
    name:'GSDCHapp',
    secret:'DevelopThisApp',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*50)
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.get('/',passport.checkAuthentication,function(req,res){
    
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

app.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/sign-in'}
),function(req,res){
    return res.redirect('/');
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