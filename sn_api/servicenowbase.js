
'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - IMS BI Chat Machine.
------------------------------------------------------------------- */


module.exports = function ServiceNowBase(){

    // Modules used for communication with ServiceNow instance.
    let GlideRecord = require('servicenow-rest').gliderecord;

    /*
    This module is the base class for communicating directly to service now with required config.
    */
    class ServiceNowBase extends GlideRecord {

        constructor(table_name) {

            // Loading required config
            let config = require('../config').servicenowValues;

            super(config.SN_INSTANCE_ID, table_name, config.SN_USERNAME, config.SN_PASSWORD, config.SN_API_VERSION);

            this.rowsLimit = config.SN_ROWS_LIMIT;
        }
    }

    return ServiceNowBase
}();