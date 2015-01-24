/*
 * TextMessage module
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
   * TextMessage
   *
   * @param {string} message - messageContent
   * @param {Array} addresses - recipientAddressList
   * @return {Object} TextMessage
*/
var TextMessage = function (message, addresses, opts) {
    Message.call(this, addresses, opts);

    if (!this.error && this._checkMessage(message)) {
        this.data.messageContent = message;
    }
};
util.inherits(TextMessage, Message);

TextMessage.prototype._checkMessage = function (message) {
    var valid = true;

    if (message === undefined || message === null || typeof message !== 'string' || message === '') {
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
   * TextMessage.getMessageContent
   *
   * @return {string} messageContent
*/
TextMessage.prototype.getMessageContent = function () {
    return this.data.messageContent;
};

module.exports = TextMessage;
