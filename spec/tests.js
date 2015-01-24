/*globals before, after, it, describe */
var websms = require('../index.js'),
    expect = require('expect.js'),
    TextMessage,
    Client,
    BinaryMessage;

describe('WebSMS', function () {
    describe('TextMessage', function () {
        it('create valid one', function (done) {
            TextMessage = new websms.TextMessage('Hey', ['1234']);
            expect(TextMessage.error).to.be(undefined);
            expect(TextMessage.data).to.be.an('object');
            expect(TextMessage.data.messageContent).to.be('Hey');
            expect(TextMessage.data.recipientAddressList).to.be.an('array');
            expect(TextMessage.data.recipientAddressList.length).to.be(1);
            expect(TextMessage.data.recipientAddressList[0]).to.be('1234');
            expect(TextMessage.data.senderAddress).to.be(undefined);
            expect(TextMessage.data.senderAddressType).to.be(undefined);
            expect(TextMessage.data.sendAsFlashSms).to.be(undefined);
            expect(TextMessage.data.notificationCallbackUrl).to.be(undefined);
            expect(TextMessage.data.clientMessageId).to.be(undefined);
            expect(TextMessage.data.priority).to.be(undefined);
            expect(TextMessage.availableSenderAddressTypes).to.be.an('object');
            expect(Object.keys(TextMessage.availableSenderAddressTypes).length).to.be(4);
            done();
        });
        it('getMessageContent', function (done) {
            expect(TextMessage.getMessageContent()).to.be('Hey');
            done();
        });
        it('set and get senderAddress', function (done) {
            TextMessage.setSenderAddress('01234');
            expect(TextMessage.getSenderAddress()).to.be('01234');
            done();
        });
        it('set and get senderAddressType', function (done) {
            TextMessage.setSenderAddressType(TextMessage.availableSenderAddressTypes[0]);
            expect(TextMessage.getSenderAddressType()).to.be(TextMessage.availableSenderAddressTypes[0]);
            done();
        });
        it('set and get sendAsFlashSms', function (done) {
            TextMessage.setSendAsFlashSms(true);
            expect(TextMessage.getSendAsFlashSms()).to.be(true);
            done();
        });
        it('set and get notificationCallbackUrl', function (done) {
            TextMessage.setNotificationCallbackUrl('hallo');
            expect(TextMessage.getNotificationCallbackUrl()).to.be('hallo');
            done();
        });
        it('set and get priority', function (done) {
            TextMessage.setPriority(1);
            expect(TextMessage.getPriority()).to.be(1);
            done();
        });
        it('set and get clientMessageId', function (done) {
            TextMessage.setClientMessageId('1');
            expect(TextMessage.getClientMessageId()).to.be('1');
            done();
        });
        it('create TextMessage with invalid phones', function (done) {
            var TextMessage2 = new websms.TextMessage('Hey', ['1234567891234567']);
            expect(TextMessage2.error).to.be.an('object');
            expect(TextMessage2.error.cause).to.be('invalidNumber');
            expect(TextMessage2.error.message).to.be('phone numbers should contain max. 15 digits');
            done();
        });
        it('create TextMessage without phones', function (done) {
            var TextMessage2 = new websms.TextMessage('Hey', []);
            expect(TextMessage2.error).to.be.an('object');
            expect(TextMessage2.error.cause).to.be('missingAddresses');
            expect(TextMessage2.error.message).to.be('there has to be at least one recipient phone number');
            done();
        });
        it('create TextMessage without message', function (done) {
            var TextMessage2 = new websms.TextMessage(null, ['12345']);
            expect(TextMessage2.error).to.be.an('object');
            expect(TextMessage2.error.cause).to.be('invalidMessage');
            expect(TextMessage2.error.message).to.be('empty message or not of type string');
            done();
        });
    });
    describe('BinaryMessage', function () {
        it('create valid one', function (done) {
            BinaryMessage = new websms.BinaryMessage(['BQAD/AIBWnVzYW1tZW4=', 'BQAD/AICZ2Vmw7xndC4='], ['1234']);
            expect(BinaryMessage.error).to.be(undefined);
            expect(BinaryMessage.data).to.be.an('object');
            expect(BinaryMessage.data.messageContent).to.be.an('array');
            expect(BinaryMessage.data.messageContent.length).to.be(2);
            expect(BinaryMessage.data.recipientAddressList).to.be.an('array');
            expect(BinaryMessage.data.recipientAddressList.length).to.be(1);
            expect(BinaryMessage.data.recipientAddressList[0]).to.be('1234');
            expect(BinaryMessage.data.senderAddress).to.be(undefined);
            expect(BinaryMessage.data.senderAddressType).to.be(undefined);
            expect(BinaryMessage.data.sendAsFlashSms).to.be(undefined);
            expect(BinaryMessage.data.notificationCallbackUrl).to.be(undefined);
            expect(BinaryMessage.data.clientMessageId).to.be(undefined);
            expect(BinaryMessage.data.priority).to.be(undefined);
            expect(BinaryMessage.availableSenderAddressTypes).to.be.an('object');
            expect(Object.keys(BinaryMessage.availableSenderAddressTypes).length).to.be(4);
            done();
        });
        it('getMessageContent', function (done) {
            expect(BinaryMessage.getMessageContent()).to.be.an('array');
            expect(BinaryMessage.getMessageContent().length).to.be(2);
            done();
        });
        it('set and get senderAddress', function (done) {
            BinaryMessage.setSenderAddress('01234');
            expect(BinaryMessage.getSenderAddress()).to.be('01234');
            done();
        });
        it('set and get senderAddressType', function (done) {
            BinaryMessage.setSenderAddressType(BinaryMessage.availableSenderAddressTypes[0]);
            expect(BinaryMessage.getSenderAddressType()).to.be(BinaryMessage.availableSenderAddressTypes[0]);
            done();
        });
        it('set and get sendAsFlashSms', function (done) {
            BinaryMessage.setSendAsFlashSms(true);
            expect(BinaryMessage.getSendAsFlashSms()).to.be(true);
            done();
        });
        it('set and get notificationCallbackUrl', function (done) {
            BinaryMessage.setNotificationCallbackUrl('hallo');
            expect(BinaryMessage.getNotificationCallbackUrl()).to.be('hallo');
            done();
        });
        it('set and get priority', function (done) {
            BinaryMessage.setPriority(1);
            expect(BinaryMessage.getPriority()).to.be(1);
            done();
        });
        it('set and get clientMessageId', function (done) {
            BinaryMessage.setClientMessageId('1');
            expect(BinaryMessage.getClientMessageId()).to.be('1');
            done();
        });
        it('create BinaryMessage with invalid phones', function (done) {
            var BinaryMessage2 = new websms.BinaryMessage(['Hey'], ['1234567891234567']);
            expect(BinaryMessage2.error).to.be.an('object');
            expect(BinaryMessage2.error.cause).to.be('invalidNumber');
            expect(BinaryMessage2.error.message).to.be('phone numbers should contain max. 15 digits');
            done();
        });
        it('create BinaryMessage without phones', function (done) {
            var BinaryMessage2 = new websms.BinaryMessage(['Hey'], []);
            expect(BinaryMessage2.error).to.be.an('object');
            expect(BinaryMessage2.error.cause).to.be('missingAddresses');
            expect(BinaryMessage2.error.message).to.be('there has to be at least one recipient phone number');
            done();
        });
        it('create BinaryMessage without message', function (done) {
            var BinaryMessage2 = new websms.BinaryMessage(null, ['12345']);
            expect(BinaryMessage2.error).to.be.an('object');
            expect(BinaryMessage2.error.cause).to.be('invalidMessage');
            expect(BinaryMessage2.error.message).to.be('empty message or not of type string');
            done();
        });
    });
});