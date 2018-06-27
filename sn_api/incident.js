
'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - IMS BI Chat Machine.
------------------------------------------------------------------- */


module.exports = function IncidentModule() {

    // ServiceNow Base class
    let ServiceNowBase = require('./servicenowbase');

    /*
    This module handles the ServiceNow incident table requests.
    */
    class Incident extends ServiceNowBase {

        constructor(config) {
            super('incident');

            this.sysUser = require('./user');
            this.sysUser.getLoggedInUser().then((result) => {
                this.loggedInUser = result[0];
            });
        }

        /**
        * Method call to get incident by id
        * @param  {integer} sys_id of the incident 
        * @return {object} Returns an object.
        */
        getIncidentBySysId(sys_id) {
            return this.get(sys_id);
        }

        /**
        * Get incidents by incident id
        * @param  {integer} incident_id id of the incident
        * @return {object} Returns a Promise object.
        */
        getIncidentByIncidentId(incident_id) {
            this.setReturnFields('sys_id,number,short_description,state,active,assigned_to');
            this.addEncodedQuery(`number=${incident_id}^caller_id=javascript:gs.getUserID()`);
            this.setLimit(1);

            return this.query();
        }

        /**
        * Get incident by short description
        * @param  {String} text shot description of the incident
        * @param  {Integer} page page no
        * @return {object} Returns a Promise object.
        */
        getIncidentsByShortDescription(text, page) {
            this.setReturnFields('sys_id,number,short_description,state,active');
            // removed condition ^active=true
            this.addEncodedQuery(`short_descriptionCONTAINS${text}^caller_id=javascript:gs.getUserID()^ORDERBYDESCsys_created_on`);
            this.setLimit(this.rowsLimit);

            if(page !== undefined && page > 1){
                this.setOffset(page * this.rowsLimit);
            }

            return this.query();
        }

        /**
        * Get active incidents
        * @param  {Integer} page page no
        * @return {object} Returns a Promise object.
        */
        getActiveIncidents(page) {
            this.setReturnFields('sys_id,number,short_description,state,active');
            // removed condition ^active=true
            this.addEncodedQuery(`caller_id=javascript:gs.getUserID()^ORDERBYDESCsys_created_on`);
            this.setLimit(this.rowsLimit);

            if(page !== undefined && page > 1) {
                this.setOffset(page * this.rowsLimit);
            }

            return this.query();
        }

        /**
        * Get active incidents
        * @param  {String} short_description short description of incident
        * @param  {String} urgency urgency of incident
        * @return {object} Returns a Promise object.
        */
        createIncident(short_description, urgency) {
            return this.insert({
                short_description: short_description,
                caller_id: this.loggedInUser.sys_id,
                urgency: urgency
            })
        }
    };

    return new Incident();
}();