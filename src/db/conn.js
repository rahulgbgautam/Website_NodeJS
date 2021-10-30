const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/register_login",{
	useNewUrlParser:true,
	useUnifiedTopology:true,
	// useCreateIndex:true
}).then(()=>{
	console.log("connection success");
}).catch((e)=>{
	console.log(`connection failed due to ${e}`);
});