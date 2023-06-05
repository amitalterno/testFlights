/*global QUnit*/

sap.ui.define([
	"project1/controller/myApp.controller"
], function (Controller) {
	"use strict";

	QUnit.module("myApp Controller");

	QUnit.test("I should test the myApp controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
