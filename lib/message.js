/*
 * Message module
 * https://github.com/KillerCodeMonkey/websms
 *
 * Copyright (c) 2015 "KillerCodeMonkey" Bengt Weiße
 * Licensed under the MIT license.
 * https://github.com/KillerCodeMonkey/websms/blob/master/LICENSE
 */
'use strict';
var util = require('util');

/***
   * Message
   *
   * @param {Array} addresses - recipientAddressList
   * @return {Object} Message
*/
var Message = function (addresses, opts) {
    this.data = {};
    opts = opts || {};
    this.errors = [];

    var key;
    for (key in this.defaults) {
        if (this.defaults.hasOwnProperty(key)) {
            this.data[key] = opts[key] || this.defaults[key];
        }
    }

    if (this._checkAddresses(addresses)) {
        this.data.recipientAddressList = addresses;
    }
};

Message.prototype.defaults = {
    'recipientAddressList': [],
    'senderAddress': undefined,
    'senderAddressType': undefined,
    'sendAsFlashSms': undefined,
    'notificationCallbackUrl': undefined,
    'clientMessageId': undefined,
    'priority': undefined
};

Message.prototype.availableSenderAddressTypes = {
    'national': true,
    'international': true,
    'alphanumeric': true,
    'shortcode': true
};

/***
   * getSenderAddress
   *
   * @return {string} containing senderAddress of Message
*/
Message.prototype.getSenderAddress = function () {
    return this.data.senderAddress;
};

/***
   * Set sender_address
   *  available sender address is dependend on user account
   *
   * @param {string} senderAddress
   * @return {string} senderAddress set
   * @exception ParameterValidationException
*/
Message.prototype.setSenderAddress = function (senderAddress) {
    if (typeof senderAddress === 'string' || senderAddress === undefined) {
        this.data.senderAddress = senderAddress;
        return senderAddress;
    }
    return;
};

/***
   * getSenderAddressType
   *
   * @return {string} containing one of ['national', 'international', 'alphanumeric' or 'shortcode']
*/
Message.prototype.getSenderAddressType = function () {
    return this.data.senderAddressType;
};

/***
   * setSenderAddressType
   *
   * @param {string} senderAddressType
   * @return {string} senderAddressType set (one of ['national', 'international', 'alphanumeric' or 'shortcode'])
   * @exception ParameterValidationException
*/
Message.prototype.setSenderAddressType = function (type) {
    if (this.availableSenderAddressTypes[type]) {
        this.data.senderAddressType = type;
        return type;
    }
    return;
};

/***
   * getSendAsFlashSms
   *
   * @return {boolean}
*/
Message.prototype.getSendAsFlashSms = function () {
    return this.data.sendAsFlashSms;
};

/***
   * setSendAsFlashSms
   *
   * @param {boolean} sendAsFlashSms
   * @return {boolean}
   * @exception ParameterValidationException
*/
Message.prototype.setSendAsFlashSms = function (sendAsFlashSms) {
    if (sendAsFlashSms === undefined || typeof sendAsFlashSms === 'boolean') {
        this.data.sendAsFlashSms = sendAsFlashSms;
        return sendAsFlashSms;
    }
    return;
};

/***
   * getNotificationCallbackUrl
   *
   * @return {string} notificationCallbackUrl
*/
Message.prototype.getNotificationCallbackUrl = function () {
    return this.data.notificationCallbackUrl;
};

/***
   * setNotificationCallbackUrl
   *
   * @param {string} notificationCallbackUrl: string of notification callback URI
   *                 customers URI that listens for delivery report notifications
   *                 or replies for this message
   * @return {string} notificationCallbackUrl set
   * @exception ParameterValidationException
*/
Message.prototype.setNotificationCallbackUrl = function (notificationCallbackUrl) {
    if (notificationCallbackUrl === undefined || typeof notificationCallbackUrl === 'string') {
        this.data.notificationCallbackUrl = notificationCallbackUrl;
        return notificationCallbackUrl;
    }
    return;
};

/***
   * getClientMessageId
   *
   * @return {string} clientMessageId set for this Message object
*/
Message.prototype.getClientMessageId = function () {
    return this.data.clientMessageId;
};

/***
   * setClientMessageId
   *
   * @param {string} clientMessageId: string with message id for this message.
   *                 This message id is returned with the response to the send request
   *                 and used for notifications
   * @return {string} clientMessageId set
   * @exception ParameterValidationException
*/
Message.prototype.setClientMessageId = function (clientMessageId) {
    if (clientMessageId === undefined || typeof clientMessageId === 'string') {
        this.data.clientMessageId = clientMessageId;
        return clientMessageId;
    }
    return;
};

/***
   * getPriority
   *
   * @return {number} priority set for this Message object
*/
Message.prototype.getPriority = function () {
    return this.data.priority;
};

/***
   * setPriority
   *
   * @param {number} priority: message priority as integer (1 to 9)
   *                 (level height must be supported by account settings)
   * @return {string} priority set
   * @exception ParameterValidationException
*/
Message.prototype.setPriority = function (priority) {
    if (priority === undefined || typeof priority === 'number') {
        this.data.priority = priority;
        return priority;
    }
    return;
};

Message.prototype._checkAddresses = function (addresses) {
    var valid = true;

    // Used internally to check validity of recipient_address_list (array of string)
    if (!addresses || !addresses.length || !util.isArray(addresses)) {
        valid = false;
        this.error = {
            'cause': 'missingAddresses',
            'message': 'there has to be at least one recipient phone number'
        };
    } else {
        var i = 0;
        for (i; i < addresses.length; i = i + 1) {
            if (!/^\d{1,15}$/.test(addresses[i])) {
                valid = false;
                this.error = {
                    'cause': 'invalidNumber',
                    'message': 'phone numbers should contain max. 15 digits'
                };
                break;
            }
        }
    }

    return valid;
};

/***
   * getData
   *
   * @return (Object) containing representation of message object set (only set/defined values)
*/
Message.prototype.getData = function () {
    var keys = Object.keys(this.data);
    var data = {};
    var i = keys.length - 1;

    for (i; i >= 0; i = i - 1) {
        if (this.data[keys[i]] !== undefined) {
            data[keys[i]] = this.data[keys[i]];
        }
    }
    return data;
};

module.exports = Message;