/*
 * Client module
 * https://github.com/KillerCodeMonkey/websms
 *
 * Copyright (c) 2015 "KillerCodeMonkey" Bengt Weiße
 * Licensed under the MIT license.
 * https://github.com/KillerCodeMonkey/websms/blob/master/LICENSE
 */
'use strict';

var https = require('https');
var os = require('os');
var TextMessage = require('./textMessage');
var BinaryMessage = require('./binaryMessage');

/***
   * Client
   *
   *    "Client" used to send Messages to api.websms.com gateway
   *
   *   Example:
   *        var client = new websms.Client('your_username', 'your_password');
   *        client.send(TextMessageObject, 1, true, function(errorObj, responseObj) { });
   * @param {string} username
   * @param {string} password
   * @return {Object} Client
*/
var Client = function (username, password) {
    this.version = '1.0.0';
    // initialize config
    this.config = {};
    // flag to avoid double callbacks
    this.finished = false;
    // error causes
    this.errorCauses = {
        'parameter': 'parameter',
        'authorization': 'authorization',
        'connection': 'connection',
        'api': 'api',
        'unknown': 'unknown'
    };

    // set config
    var key;
    for (key in this.defaults) {
        if (this.defaults.hasOwnProperty(key)) {
            this.config[key] = this.defaults[key];
        }
    }
    this.config.userAgent = 'nodejs SDK Client (v' + this.version + ', ' + os.type() + ',' + os.platform() + ',' + os.release() + ')';
    this.config.username = username;
    this.config.password = password;
};

Client.prototype.defaults = {
    username: undefined,
    password: undefined,
    host: 'api.websms.com',
    port: 443,
    contentType: 'application/json;charset=UTF-8',
    basePath: '/json/smsmessaging',
    binaryPath: '/binary',
    textPath: '/text'
};

  /***
   * Client.send
   *    send message object.
   *
   *    Example usage:
   *    sender.send( TextMessageObject,
   *                 1,
   *                 true,
   *                 function(errorObj, response) { },
   *                );
   *
   * @param {Object} messageObject  - Message Object (TextMessage or BinaryMessage)
   * @param {int} maxSmsPerMessage  - Amount (for text message)
   * @param {boolean} isTest        - set to false to really send SMS
   * @param {Function} callback     - function called when message was transferred or error occured. Params: cb(errorObj, response)
*/
Client.prototype.send = function (messageObject, maxSmsPerMessage, isTest, callback) {
    var message_path;
    var data;

    // reset finished flag to be reusable
    this.finished = false;

    if (!(this.isFunction(callback))) {
        console.log({
            'cause': this.errorCauses.parameter,
            'message': 'missing callback function'
        });
        return;
    }

    if (messageObject.error) {
        callback(messageObject.error, null);
        return;
    }

    if (!(messageObject instanceof TextMessage) && !(messageObject instanceof BinaryMessage)) {
        callback({
            'cause': this.errorCauses.parameter,
            'message': 'unknown type of message object'
        }, null);
        return;
    }
    data = messageObject.getData();

    if (isTest !== undefined) {
        if (typeof isTest !== 'boolean') {
            callback({
                'cause': this.errorCauses.parameter,
                'message': 'invalid type of parameter isTest - should be boolean'
            }, null);
            return;
        }
        data.test = isTest;
    }
    if (messageObject instanceof TextMessage) {
        if (maxSmsPerMessage !== undefined) {
            if (maxSmsPerMessage < 1 || maxSmsPerMessage > 256) {
                callback({
                    'cause': this.errorCauses.parameter,
                    'message': 'Number of maxSmsPerMessage has to be between 0 and 256'
                }, null);
                return;
            }
            data.maxSmsPerMessage = maxSmsPerMessage;
        }
        message_path = this.config.textPath;
    } else {
        message_path = this.config.binaryPath;
    }

    return this._post(message_path, data, callback);
};

/***
   * _post
   *    Internal function for https POST request to API
   *
   * @param {string} typePath   - endpoint path for text or binary
   * @param {Object} data   - content message data
   * @param {Function} callback   - callback function
*/
Client.prototype._post = function (typePath, data, callback) {
    var content = JSON.stringify(data);
    var opts = {
        path: this.config.basePath + typePath,
        method: 'POST',
        auth: this.config.username + ':' + this.config.password,
        host: this.config.host,
        port: this.config.port,
        headers: {
            'User-Agent': this.config.userAgent,
            "Content-Length": Buffer.byteLength(content, 'utf8'),
            'Content-Type': this.config.contentType
        }
    };

    var request = https.request(opts, this._responseCallback(callback));
    request.on('error', this._requestCallback(callback));
    request.write(content);
    request.end();
};

/***
    * _responseCallback
    *    Internal response callback function that will be attached to http response
    *
    * @param {Function} callback    - callback function
*/
Client.prototype._responseCallback = function (callback) {
    var self = this;

    return function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var isReadable = /json/.test(response.headers['content-type']);
            var msg = 'Internal Error';
            var cause;

            if (response.statusCode.toString() !== '200' || !isReadable) {
                // HTTP failed
                msg = "HTTP Connection failed, Server returned HTTP Status: " + response.statusCode;
                cause = self.errorCauses.parameter;
                if (response.statusCode.toString() === '401') {
                    msg = "HTTP Authentication failed, check username and password. HTTP Status: " + response.statusCode;
                    cause = self.errorCauses.authorization;
                } else if (response.statusCode.toString() === '400') {
                    msg = "HTTP Status 400 - Bad Request. Server couldnot understand Request/Content. " + str;
                    cause = self.errorCauses.unknown;
                } else if (!isReadable && response.statusCode.toString() === '200') {
                    msg = "HTTP Response is of unknown content-type '" + response.headers['content-type'] + "', Response body was: " + str;
                    cause = self.errorCauses.unknown;
                }
                if (!self.finished) {
                    self.finished = true;
                    callback({
                        'cause': cause,
                        'msg': msg
                    }, response);
                }
                return;
            }
            // HTTP success and isReadable
            var ApiResponse;
            try {
                ApiResponse = JSON.parse(str);
            } catch (err) {
                if (!self.finished) {
                    self.finished = true;
                    callback({
                        'cause': 'jsonParse',
                        'message': 'no valid json response'
                    }, response);
                }
                return;
            }
            if (ApiResponse.statusCode < 2000 || ApiResponse.statusCode > 2001) {
                // API failed
                if (!self.finished) {
                    self.finished = true;
                    msg = 'API statusCode: ' + ApiResponse.statusCode + ', statusMessage: ' + ApiResponse.statusMessage;
                    callback({
                        'cause': self.errorCauses.api,
                        'message': msg
                    }, ApiResponse);
                }
                return;
            }
            // success
            if (!self.finished) {
                self.finished = true;
                callback(null, ApiResponse);
            }
            return;
        });

        response.on('error', function (e) {
            console.log(e);
            if (!self.finished) {
                self.finished = true;
                callback({
                    'cause': self.errorCauses.connection,
                    'message': 'HTTPS Response error event: ' + e.message,
                }, response);
            }
        });

        response.on('close', function (e) {
            console.log(e);
            if (!self.finished) {
                self.finished = true;
                callback({
                    'cause': self.errorCauses.connection,
                    'message': 'HTTPS Response close event: ' + e.message,
                }, response);
            }
        });
    };
};

/***
   * _requestCallback
   *    Internal callback function attached to https request
   *    Used to handle error listener of request (when no response can occurr)
   *
   * @param {Function} callback - callback function
   * @param {Object} message - Message object (TextMessage or BinaryMessage)
*/
Client.prototype._requestCallback = function (callback) {
    var self = this;

    return function (e) {
        if (!self.finished) {
            self.finished = true;
            callback({
                'cause': self.errorCauses.connection,
                'message': 'HTTPS request error: ' + e.message
            }, null);
        }
    };
};

Client.prototype.isFunction = function (fUnction) {
    return !!(fUnction && fUnction.constructor && fUnction.call && fUnction.apply);
};

module.exports = Client;