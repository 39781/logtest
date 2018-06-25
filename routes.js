var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	

var Otps ={};
router.get('/close',function(req,res){
	res.redirect('close.html');
})

router.post('/botHandler',function(req, res){		
	var responseObj = JSON.parse(JSON.stringify(config.responseObj));
	var actionName = req.body.queryResult.action;
	switch(actionName){
		case 'input.welcome':func = welcome;break;
		case 'input.verifyOtp': func = verifyOtp;break;
	}
	func(req.body,responseObj)
	.then(function(result){
		console.log(result);
		res.json(result).end();
	})
	
	/*
	
	*/
	
});	


router.post('/validateUser',function(req, res){
	var emps = config.employees;
	currentSession = req.body.sess;
	console.log(typeof(emps[req.body.username]));
	if(typeof(emps[req.body.username])!='undefined'){
		var smsApi = config.smsApi.replace('phonenumber',emps[req.body.username].ph);	
		smsApi = smsApi.replace('Otpnumber',45627);
		smsApi = smsApi.replace('name',emps[req.body.username].name);
		Otps[req.body.sess] = 45627;
		console.log(smsApi,emps[req.body.username].ph);
		request(smsApi,function(error,response,body){
			console.log(error,body);
			res.status(200);
			res.json({status:true}).end();
		});		
	}else{
		console.log('fail');
		res.status(400);
		res.json({status:false}).end();
	}		
});
var welcome = function(req, responseObj){
	return new Promise(function(resolve,reject){
		simpleResponse(responseObj, "Hi I'm Hema !. I can help you to manage your leaves,search an employee, account recovery and create or track your service tickets. Please login to begin.")
		.then(function(result){
			var buttons = [
			  {
				"title": "Login",
				"openUrlAction": {
				  "url": "https://logintests.herokuapp.com/login.html?convId="+req.originalDetectIntentRequest.payload.conversation.conversationId
				}
			  }
			]
			return basicCard(result,"Please login to Help you", buttons);
		})
		.then(function(result){
			resolve(result);		
		})
	});
}

var loginSucess = function(responseObj){
	return new Promise(function(resolve,reject){
		simpleResponse(responseObj, "Login success")
		.then(function(result){		
			return listItem(result,"Kindly select the service category");	
		})
		.then(function(result){
			console.log(JSON.stringify(result));
			resolve(result);
		})
	});
};

var verifyOtp = function(req,responseObj){
	return new Promise(function(resolve,reject){
		console.log(req.originalDetectIntentRequest.payload.conversation.conversationId);
		console.log(JSON.stringify(Otps));
		console.log(req.queryResult.parameters.otp);
		if(Otps[req.originalDetectIntentRequest.payload.conversation.conversationId]==req.queryResult.parameters.otp){		
			loginSucess(responseObj)
			.then(function(result){				
				resolve(result);
			})		
		}else{
			simpleResponse(responseObj, "Invalid OTP : please enter valid password")
			.then(function(result){
				resolve(result);				
			});		
		}
	});
}
var listItem = function (response, responseText){
	return new Promise(function(resolve,reject){
		response.payload.google.richResponse.items.push({
		"listSelect": {
			  "title": responseText,
			  "items": [
				{
				  "info": {
					"key": "HR Self Service"
				  },
				  "title": "HR Self Service",
				  "description": "for Leave management, Employee Search",
				  "image": {}
				},
				{
				  "info": {
					"key": "IT Self Service"
				  },
				  "title": "IT Self Service",
				  "description": "For : Account recovery , Help desk",
				  "image": {}
				}
			  ]
			}
		});
		resolve(response);
	});
}
var simpleResponse = function(response, responseText){
	return new Promise(function(resolve,reject){
		response.payload.google.richResponse.items.push({
			"simpleResponse": {
				"textToSpeech": responseText,
				"displayText": responseText
			}
		});	
		resolve(response);
	})
			
}
var basicCard = function(response,text, buttons){
	return new Promise(function(resolve,reject){		
		response.payload.google.richResponse.items.push(
			{"basicCard": {
			  "formattedText": text,			 
			  "buttons": buttons,
			   "image": {},
			}		
		});		
	resolve(response);
	});
}


module.exports = router;





