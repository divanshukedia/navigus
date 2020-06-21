var express=require('express')
var bodyParser=require('body-parser')
var mongoose=require('mongoose');
var passport =require('passport')
var passportLocalMongoose=require('passport-local-mongoose')
var LocalStrategy=require('passport-local')
mongoose.connect("mongodb://localhost:27017/navigus",{ useNewUrlParser: true,useUnifiedTopology: true});
var UserSchema=new mongoose.Schema({
    username : String,
    name: String,
    password : String,
    avatar: String
});
UserSchema.plugin(passportLocalMongoose);
user=mongoose.model('Userr',UserSchema);

var pageSchema=new mongoose.Schema({
    pagename: String,
    currentuser:[{type:mongoose.Schema.Types.ObjectId,ref:"Userr",unique:true}],
    alluser:[{type:mongoose.Schema.Types.ObjectId,ref:"Userr",unique:true}]
});


page=mongoose.model('defaultpage1',pageSchema);
// page.create({pagename:"default_page"},function(err,data){
//     if(err){
//         console.log("errori")
//     }
//     else{
//         console.log("Success")
//         console.log(data)
//      }
// });
 var app=express()
app.use(bodyParser.urlencoded({extended:true}));


app.use(require('express-session')({
    secret:'smarter and better',
    resave:false,
    saveUninitialized:false
    }));
    
app.use(passport.initialize());
    
app.use(passport.session());
    
passport.use(new LocalStrategy(user.authenticate()));
    
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.set('view engine','ejs')
app.get('/',function(req,res){
    res.render('show',{currentUser:req.user})
});
app.get('/register',function(req,res){
    res.render('register',{currentUser:req.user})
});
app.get('/login',function(req,res){
    res.render('login',{currentUser:req.user})
});
app.post('/register',function(req,res){
    user.register(new user({username:req.body.username,name:req.body.name,avatar:req.body.avatar}),req.body.password,function(err,user){
        if(err){
            console.log(err)
            return res.render('register',{currentUser:req.user})
        }
        passport.authenticate("local")(req,res,function(){res.redirect('/presence')});
    });
});
function isloggedin(req,res,next){
    if(req.isAuthenticated()){return next();}
    res.redirect('/error',{currentUser:req.user})
}
app.get('/error',function(req,res){
    res.render('error',{currentUser:req.user})
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/')
})
app.post('/login',passport.authenticate("local",{
    successRedirect:"/presence",
    failureRedirect:'/error'
}),function(req,res){
});
var idd='5eeee8fad459101253a83ce8';
app.get('/presence',isloggedin,function(req,res){
    var current=req.user
    page.findById(idd,function(err,found){
        if(err){console.log('errorrr')}
        else{
            var isInArray =false
            console.log(isInArray)
            if(!isInArray){
                user.findById(current._id,function(err,fid){
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date+' '+time;
                console.log(dateTime)
                // console.log(fid)
                found.alluser.push(fid)
                found.save()


                });
                    
                }
            }
        })
        page.findById(idd).populate("alluser").exec(function(err,found){
            if(err){
                console.log(err)}
            else{
                res.render("presence",{page:found,currentUser:req.user});
            }
    });
    });

app.listen(3003,()=>console.log('connected'));