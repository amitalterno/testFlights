sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * 
     * @param {typeop sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller, MessageToast) {
        'use strict';

        return Controller.extend("project1.controller.view1", {
            onInit: function () {

            },
            onclick: function () {
                MessageToast.show("clclclcl")
            }
        })

    });