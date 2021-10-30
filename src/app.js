require('dotenv').config()
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const auth = require("./middleware/auth");
var cookieParser = require('cookie-parser');
const saltRounds = 10;
const app = express();
const port = process.env.PORT||8000;
require("./db/conn");
const Register = require("./models/register");


const static_path = path.join(__dirname,"../public/");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

// app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.use(cookieParser());
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

// console.log("secret key"+process.env.SECRET_KEY);


const securePassword = async (password) => {
	bpassword = await bcrypt.hash(password,12);
	console.log(`password is ${bpassword}`);
}



securePassword("admin@123");

app.get("/",(req,res) => {
	res.render("index")
});

app.get("/secret",auth,(req,res) => {
	// console.log(`our cookie is ${req.cookies.jwt}`);
	res.render("secret")
});

app.get("/logout",auth,async (req,res) => {
	try{
		res.clearCookie("jwt");
		// req.user.tokens
		console.log("logout successfully");
		res.render("login");

	}catch(error){
		console.log(error);
	}

});

app.get("/register",(req,res) => {
	res.render("register")
});

app.get("/contact-us",(req,res) => {
	res.render("contact")
});

app.post("/registration",async (req,res) => {
	// res.render("register")
	// res.write("working good.")
	try{
		// res.send(req.body)
		let password = req.body.password;
		let confirm_password = req.body.confirm_password;
		if(password===confirm_password){
			// console.log("cdsj");
			const registerEmployee = new Register({
				name:req.body.name,
				email:req.body.email,
				password:req.body.password,
				confirm_password:req.body.confirm_password
			})

			console.log("success" + registerEmployee);
			const token = await registerEmployee.generateAuthToken();
			console.log("token is" + token);
			res.cookie("jwt",token,{
				expires:new Date(Date.now()+30000),
				httpOnly:true
			});
			// console.log()
			const registered = await registerEmployee.save();
			res.status(201).render("index");
		}else{
			res.send("Please enter same password.")	
		}

	}catch(error){
		res.status(400).send(error)
	}
});

app.get("/login",(req,res) => {
	res.render("login")
});

app.post("/login",async (req,res) => {
	try{

		let email = req.body.email;
		let password = req.body.password;
		let user = await Register.findOne({email:email});
		let isMatch = await bcrypt.compare(password,user.password);
		const token = await user.generateAuthToken();
		console.log("login token is" + token);
		res.cookie("jwt",token,{
				expires:new Date(Date.now()+100000),
				httpOnly:true
			});
		console.log(isMatch);
		if(isMatch){
			res.status(201).render("index")
		}else{
			res.send("invalid password");
		}
		
	}catch(error){
			res.status(400).send("Enter valid email or password.")
	}

});

app.listen(port,() => {
	console.log(`listening from port no${port}`);
});