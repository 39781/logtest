// Required config enviroment variables
const SN_INSTANCE_ID = process.env.instanceId || "dev18442";
const SN_USERNAME = "33238";//process.env.usernameServiceNow
const SN_PASSWORD = "abc123";//process.env.passwordServiceNow

// Settings
const SN_ROWS_LIMIT = 10;
const SN_API_VERSION = 'v2';

// Urgency Levels
const URGENCY_HIGH = 1;
const URGENCY_MEDIUM = 2;
const URGENCY_LOW = 3;


module.exports = {
	empSearchAPI:"http://localhost:8080/api/v1/employees/",
	accessToken:"c1504b59c90448029b6b4edf822e9559",	
	dialogFlowAPI:"https://api.api.ai/v1/query?v=20150910",
	responseObj: {
	  "payload": {
		"google": {			
		  "expectUserResponse": true,
		  "richResponse": {
			"items": [],
			"suggestions":[]
		  },		  
		}
	  }
	},
	servicenowValues:{
			// Environment Variables
			SN_INSTANCE_ID: SN_INSTANCE_ID,
			SN_USERNAME: SN_USERNAME,
			SN_PASSWORD: SN_PASSWORD,

			// Settings
			SN_ROWS_LIMIT: SN_ROWS_LIMIT,
			SN_API_VERSION: SN_API_VERSION,

			// Urgency Levels
			URGENCY: {
					HIGH: URGENCY_HIGH,
					MEDIUM: URGENCY_MEDIUM,
					LOW: URGENCY_LOW
			}
	},
	employees:{
		"39781":{ph:"8500050085",name:"B+Hari+Prasad%2c"},
		"39754":{ph:"9626649195",name:"V+Hari+Krishna%2c"}
	},
	
	"smsApi":"http://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=ZY2nHm2RiIC&MobileNo=phonenumber&SenderID=TESTIN&Message=Dear name, Your OTP for login verification is Otpnumber, this OTP is valid for only 30 minutes.&ServiceName=TEMPLATE_BASED" 
	
}


