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
		  "systemIntent":{
			  "intent": "actions.intent.OPTION",
				"data": {
					"@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
					"carouselBrowse": {
          "items": [
            {
              "title": "Option one title",
              "description": "Option one description",
              "footer": "Option one footer",
              "image": {
                "url": "http://imageOneUrl.com",
                "accessibilityText": "Image description for screen readers"
              },
              "openUrlAction": {
                "url": "https://optionOneUrl"
              }
            },
            {
              "title": "Option two title",
              "description": "Option two description",
              "footer": "Option two footer",
              "image": {
                "url": "http://imageTwoUrl.com",
                "accessibilityText": "Image description for screen readers"
              },
              "openUrlAction": {
                "url": "https://optionTwoUrl"
              }
            }
          ]
        }
				}	              
		  }
		}
	  }
	},
	employees:{
		"39781":{ph:"8500050085",name:"B+Hari+Prasad%2c"},
		"39754":{ph:"9626649195",name:"V+Hari+Krishna%2c"}
	},
	
	"smsApi":"http://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=ZY2nHm2RiIC&MobileNo=phonenumber&SenderID=TESTIN&Message=Dear+name+the+OTP+to+reset+your+password+is+Otpnumber%2c+valid+only+for+the+next+30++minutes.&ServiceName=TEMPLATE_BASED" 
}



