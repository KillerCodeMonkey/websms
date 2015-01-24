/*
 * BinaryMessage module
 * https://github.com/KillerCodeMonkey/websms
 *
 * Copyright (c) 2015 "KillerCodeMonkey" Bengt Weiße
 * Licensed under the MIT license.
 * https://github.com/KillerCodeMonkey/websms/blob/master/LICENSE
 */
'use strict';
var util = require('util');
var Message = require('./message');

/***
   * BinaryMessage
   *
   * @param {Array} message - messageContent - segments of base64 strings (binary encoded to base64)
   *                          Example: ["BQAD/AIBWnVzYW1tZW4=", "BQAD/AICZ2Vmw7xndC4="]
   * @param {Array} addresses - recipientAddressList Example: ['4367612345678','4369912345678']
   * @param {boolean} userDataHeaderPresent
   * @return {Object} BinaryMessage Object
*/
var BinaryMessage = function (message, addresses, userDataHeaderPresent, opts) {
    Message.call(this, addresses, opts);
    userDataHeaderPresent = userDataHeaderPresent === true ? true : false;

    if (!this.error && this._checkMessage(message)) {
        this.data.messageContent = message;
    }
    this.setUserDataHeaderPresent(userDataHeaderPresent);
};
util.inherits(BinaryMessage, Message);

BinaryMessage.prototype._checkMessage = function (message) {
    var valid = true;

    if (message === undefined || message === null || !message.length || !util.isArray(message)) {
        // put error object on message object.
        this.error = {
            'cause': 'invalidMessage',
            'message': 'empty message or not of type string'
        };
        valid = false;
    }

    return valid;
};

/***
   * BinaryMessage.getMessageContent
   *
   * @return {string} messageContent
*/
BinaryMessage.prototype.getMessageContent = function () {
    return this.data.messageContent;
};

/***
   * BinaryMessage.getUserDataHeaderPresent
   *
   * @return {boolean} userDataHeaderPresent
*/
BinaryMessage.prototype.getUserDataHeaderPresent = function () {
    return this.data.userDataHeaderPresent;
};

/***
   * BinaryMessage.setUserDataHeaderPresent
   *
   * @param {boolean} userDataHeaderPresent
   * @return {boolean} userDataHeaderPresent
*/
BinaryMessage.prototype.setUserDataHeaderPresent = function (userDataHeaderPresent) {
    if (userDataHeaderPresent !== undefined && typeof userDataHeaderPresent === 'boolean') {
        this.data.userDataHeaderPresent = userDataHeaderPresent;
        return userDataHeaderPresent;
    }
    return;
};

module.exports = BinaryMessage;