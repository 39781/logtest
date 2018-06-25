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
		case 'input.unknown':func = defaultFallBack;break;
	}
	func(req.body,responseObj)
	.then(function(result){
		console.log(result);
		console.log(JSON.stringify(result));
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
		console.log('login success');
		simpleResponse(responseObj, "Login success")
		.then(function(result){	
			console.log('simple response');
			var items = [
				{
				  "optionInfo": {
					"key": "HR",
					"synonyms": [
						"HR Self Service"
					]
				  },
				  "title": "HR Self Service",
				  "description": "for Leave management, Employee Search",				  
				},
				{
				  "optionInfo": {
					"key": "IT",
					"synonyms": [
						"IT Self Service"
					]
				  },
				  "title": "IT Self Service",
				  "description": "For : Account recovery , Help desk",				  
				},
				{
				  "optionInfo": {
					"key": "Meeting",
					"synonyms": [
						"Meeting Self Service"
					]
				  },
				  "title": "Meeting Self Service",
				  "description": "For : creating create, cancel and reschedule meeting",				  
				}
			  ];
			return listItem(result, "Kindly select the service category",items);	
		})
		.then(function(result){		
			var chips = [];							
			console.log('sugge');
			return suggestions(result, chips);
		})
		.then(function(result){	
			//console.log(JSON.stringify(result));
				console.log('leving log sucess');
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
					console.log('leveing verify OTp');
			//	console.log(JSON.stringify(result));			
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
var listItem = function (response,text, items){
	return new Promise(function(resolve,reject){		
		console.log(' list item');
			response.payload.google.systemIntent = {
				"intent": "actions.intent.OPTION",
				"data": {
					"@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
					"listSelect": {
					  "title": text,
					  "items": items
					}
				}
			}		
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

var suggestions = function(response, chips){
	console.log('suggestions');
	return new Promise(function(resolve,reject){		
		response.payload.google.richResponse.suggestions = chips;		
		//console.log(JSON.stringify(response));
		resolve(response);
	});	
}

var defaultFallBack = function(req, response){
	return new Promise(function(resolve,reject){
		response.payload.followupEvent = {
					name:"HRService",
					data:{},
			}
		resolve(response);		
	});
}
module.exports = router;





