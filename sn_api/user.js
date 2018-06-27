
'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - IMS BI Chat Machine.
------------------------------------------------------------------- */


module.exports = function SysUserModule() {

    // ServiceNow Base class
    let ServiceNowBase = require('./servicenowbase');

    /*
    This module handles the ServiceNow sys_user table requests.
    */
    class SysUser extends ServiceNowBase {

        constructor() {
            super('sys_user');
        }

        // Get details of any user by SysId.
        getUserBySysId(sys_id) {
            this.setReturnFields('sys_id,title,name,mobile_phone,email');
            return this.get(sys_id)
        }

        // Get SysId of logged in user, this helps in querying current user related details.
        getLoggedInUser(){
            this.setReturnFields('sys_id,title,name,mobile_phone,email');
            this.addEncodedQuery(`user_name=${this.user}`);
            this.setLimit(this.rowsLimit);

            return this.query();
        }

        // Get ALl users name and sysid
        getUsers(){
            this.setReturnFields('sys_id,title,name,mobile_phone,email');
            this.addEncodedQuery(`active=true`);
            this.setLimit(1000);

            return this.query();
        }
    };

    return new SysUser();
}();