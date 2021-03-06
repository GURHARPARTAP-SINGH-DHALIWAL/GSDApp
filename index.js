const express=require('express');
const path=require('path');
const port=8000;
const db=require('./config/mongoose');
const User=require('./models/user');
const cookieparser=require('cookie-parser');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
// const MongoStore=require('connect-mongo')(session);
const MongoStore=require('connect-mongo')(session);
const Post=require('./models/post');

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
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    function(err)
    {
        console.log(err||'MongoStore Setup ok');
    }
    
    
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.get('/',passport.checkAuthentication,async function(req,res){
    let post=await Post.find({}).populate('user').sort('-createdAt');

    return res.render('home',{
        posts:post
    });
    
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

app.post('/create-post',function(req,res){
   
 
    Post.create({content:req.body.content,
                user:req.user._id
    },function(err,post){
        if(err){console.log(err);return ;}
        console.log(post);
        return res.redirect('back');
    });
});
app.get('/sign-in',function(req,res){
    if(req.isAuthenticated())
    return res.redirect('/');
    return res.render('sign_in');
});

app.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/sign-in'}
),function(req,res){
    return res.redirect('/');
});
app.get('/sign-up',function(req,res){
    if(req.isAuthenticated())
    return res.redirect('/');
    return res.render('sign_up');
});

app.get('/sign-out',function(req,res){
    req.logout();
    return res.redirect('/sign-in');
});
app.listen(port,function(err){
    if(err){
        console.log('Error in Starting ');
        return ;
    }
    console.log('Server has started');
});