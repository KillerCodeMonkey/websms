# websms.js
=========
Custom nodejs sdk for websms.com services

This module should be a better and stable implementation of the original websms.com sdk.
https://websms.com/

### It is a SMS text/binary messaging tool for node.js

`websms.js` module provides an easy-to-use API for sending SMS text and binary messages through websms.com API (`https://api.websms.com`).
 
Simple examples can be found in the `examples.js`.

#### Features:

 * Text Messages
 * Binary Messages
 * Confirmation of Delivery
 * Answers to SMS can be forwarded
 * Only usable in modules

See [websms.com](http://websms.com) website to [register](http://business.sms.at/get-started/online-anmeldung) for an account.

For general API specification of the server (nodejs independent) visit: [https://api.websms.com](https://api.websms.com)

Installation
------------

Install with `npm`:

```bash
$ npm install websms
```

Tests
----

Tests are runnable after running `npm install`. (mocha and expect.js as devDependencies)

```bash
$ mocha spec/tests
```

Usage
-----
1. require

  ```
  var websms = require('websms');
  ```
2. Create a client object (once)

  ```
  var client = new websms.Client(username, password);
  ```
3. Create a Message object (or many)

  ```
  var TextMessage = new websms.TextMessage(unicodeMessageText, recipientAddressList);
  ```
4. Send Message object over Client

  ```
  client.send(TextMessage, maxSmsPerMessage, isTest, callback);
  ```

#### Parameters explained:
 * __username__   : {string}username used in basic authentication. This is your websms.com account username
 * __password__   : {string} password used in basic authentication  This is your websms.com account password
 * __recipientAddressList__ : {Array} of strings containing message recipient mobile numbers (MSISDN) like ['4367612345678','4369912345678']
 * __unicodeMessageText__ : {string} messageContent string sent that will be included in JSON object and sent as charset utf-8 to API. Special characters should be escaped as unicode. Euro sign is \u20AC.
 * __maxSmsPerMessage__ : {Number} integer number 1-255 telling how many concatenated sms parts are the limit for sending this message. (in case the text is longer than what fits into multiple sms)
 * __isTest__ : {boolean} false to really send sms. true to just test interface connection and process
 * __callback__ : {Function} function that is called after success or error - parameter: error, response

----

Quick Message Construction
--------------------------

You don't need to use setter methods, it's also possible create a message with all properties at once:

    TextMessage = new websms.TextMessage(messageContent, recipientAddressList, {
           'senderAddress'           : "AlphanumericSender",
           'senderAddressType'       : 'alphanumeric',  // also possible values: 'shortcode', 'international', 'national
           'sendAsFlashSms'          : true,
           'priority'                : 1,
           'notificationCallbackUrl' : 'https://my_server_for_send_notification',
           'clientMessageId'         : "My custom message id"
        });

If there was an error during message creation -> you can find it on TextMessage.error (object with cause, message as keys).
If you not check this the Client.send method will do it and calling your sending callback with that error object.

Callback function format
------------------------
#### callback(error, response)

    function (error, response) {
        // error = {
        //   cause: String with error code 
        //   message: String with error message
        // }
        
        // repsonse = if request was successfully sent -> this is the response object
        var statusCode      = repsonse.statusCode;
        var statusMessage   = repsonse.statusMessage;
        var transferId      = repsonse.transferId;
        var clientMessageId = repsonse.clientMessageId;
    };

----

Classes
-------
#### Client
 > new websms.Client(*user, password*)
 
 ##### Methods/Functions
     Client.send(messageObject, maxSmsPerMessage, isTest, callback)
     
#### TextMessage
 > new websms.TextMessage(*messageContent, recipientAddressList, optionalOptions*)

 ##### Methods/Functions
     TextMessage.getMessageContent()

#### BinaryMessage
 > new websms.BinaryMessage(*messageContentSegments, recipientAddressList, userDataHeaderPresent, optionalOptions*)
 
 ##### Methods/Functions
     BinaryMessage.getMessageContent()
     BinaryMessage.getUserDataHeader()
     BinaryMessage.setUserDataHeader(userDataHeader)

#### Message
 > Base class for all messages  (every message inherits from Event.Emitter)

 ##### Methods/Functions
     Message.getRecipientAddressList()
     Message.getSenderAddress()
     Message.setSenderAddress(senderAddress)
     Message.getSenderAddressType()
     Message.setSenderAddressType(senderAddressType)
     Message.getSendAsFlashSms()
     Message.setSendAsFlashSms(sendAsFlashSms)
     Message.getNotificationCallbackUrl()
     Message.setNotificationCallbackUrl(notificationCallbackUrl)
     Message.getClientMessageId()
     Message.setClientMessageId(clientMessageId)
     Message.getPriority()
     Message.setPriority(priority)
