const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	confirm_password:{
		type:String,
		required:true
	},
	tokens:[{
		token:{
			type:String,
			required:true
		}
	}]
})

// genearting tokens
employeeSchema.methods.generateAuthToken = async function(){
	try{

		const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
		// console.log(`token is ${token}`);
		this.tokens = this.tokens.concat({token:token})
		await this.save();

		return token;		
	}catch(error){
		console.log(`error is ${error}`);			
	}

}


employeeSchema.pre("save",async function(next){
	if(this.isModified("password")){
		// const passwordHash = await bcrypt.hash(password,12);
		this.password = await bcrypt.hash(this.password,12);
		this.confirm_password = await bcrypt.hash(this.password,12);
		// this.confirm_password = undefined;
	}
	next();
})


const Register = new mongoose.model("user",employeeSchema);

module.exports = Register;