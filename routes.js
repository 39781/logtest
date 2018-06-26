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
	
	console.log(actionName);
	switch(actionName){
		case 'input.welcome':func = welcome;break;
		case 'input.verifyOtp': func = verifyOtp;break;
		case 'input.unknown':func = defaultFallBack;break;
		case 'input.employee_search': func =  employeeSearch2;break;
	}
	func(req.body,responseObj)
	.then(function(result){
		console.log(result);
		console.log(JSON.stringify(result));
		res.json(result).end();
	})
	
	
	
});	


router.post('/validateUser',function(req, res){
	var emps = config.employees
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
		responseObj= {
				"fulfillmentText": '',
				"followupEventInput":{
					"name":"mainMenu",
					"parameters":{ 
						session:req.originalDetectIntentRequest.payload.conversation.conversationId
					}
				}
			}
			resolve(responseObj);
		/*simpleResponse(responseObj, "Hi I'm Hema !. I can help you to manage your leaves,search an employee, account recovery and create or track your service tickets. Please login to begin.")
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
			var chips = [{title:"Account Recovery"}];										
			return suggestions(result,chips);
		})
		.then(function(result){
			resolve(result);		
		})*/
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
		var evnt = '';
		if(req.queryResult.queryText.indexOf('HR')>=0){
			evnt = 'HRService';
		}else if(req.queryResult.queryText.indexOf('IT')>=0){
			evnt = 'ITService';
		}else if(req.queryResult.queryText.indexOf('Meeting')>=0){
			evnt = 'MeetingService'
		}else{
			evnt = 'fallback'
		}
		console.log(JSON.stringify(req),req.queryResult.queryText,evnt);
		response= {
				"fulfillmentText": '',
				"followupEventInput":{
					"name":evnt,
					"parameters":{  						
					}
				}
			}
		resolve(response);		
	});
}

var employeeSearch1 = function(req, response){
	return new Promise(function(resolve,reject){
		var empSearchAPI = config.empSearchAPI;
		var inputText = req.queryResult.queryText;
		if(isNaN(inputText)){
			empSearchAPI = empSearchAPI+'name='+inputText;
		}else{
			empSearchAPI = empSearchAPI+'id='+inputText;
		}
		request(empSearchAPI,function(error,response,body){
			if(error){
				resolve(employeeInfo({status:'error'}));
			}else{
				resolve(employeeInfo(body));
			}
		});
	});
}
var employeeSearch2 = function(req, response){
	return new Promise(function(resolve,reject){
		var empSearchAPI = config.empSearchAPI;
		var inputText = req.queryResult.queryText;	
		switch(inputText.toLowerCase()){
			case '13328':case 'ABHISHEK  ARRAWATIA':resolve(employeeInfo({"employeeid":"13328","employeedetails":[{"employeename":"ABHISHEK  ARRAWATIA","department":"Competency Dev-Java","dateofjoining":"07-08-2006","officialmail":"13328_#Test@hexaware.com","location":"US","mobileno":"18572722326","officialphone":"8804"}]},response));break;
			case '15540':case 'ABHISHEK  MISHRA':resolve(employeeInfo({"employeeid":"15540","employeedetails":[{"employeename":"ABHISHEK  MISHRA","department":"Competency Dev-BIBA","dateofjoining":"17-09-2007","officialmail":"15540_#Test@hexaware.com","location":"US","mobileno":"9987772731","officialphone":"22045"}]},response));break;
			default:resolve(employeeInfo({status:'error'}));break;
		}
	});
}
var employeeInfo = function(empObj,response){
	if(typeof(empObj.status)=='undefined'){
		var empData = "Employee Id: "+empObj.employeeid+"\n\rEmployee Name : "+empObj.employeedetails[0].employeename+"\n\rMobile no : "+empObj.employeedetails[0].mobileno;		
	}else{
		var empData = "Employee details Not Found";
	}
	simpleResponse(response, empData)
	.then(function(result){
		return result;
	});
}
module.exports = router;





