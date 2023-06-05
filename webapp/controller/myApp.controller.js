
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "project1/model/models",
        "sap/ui/model/json/JSONModel",
        'sap/m/MessageToast'
    ],  /**
          * 
          * @param {typeop sap.ui.core.mvc.Controller} Controller 
          */
    function (Controller,
        MessageToast,
        models, JSONModel) {
        'use strict';

        return Controller.extend("project1.controller.myApp", {
            onInit: async function () {
                const clicks = 0;
                const flights = await models.flightQuery(this.getOwnerComponent(), clicks, 20)
                this.getOwnerComponent().getModel("flightsModel").setData(flights);
                this.getOwnerComponent().getModel("clicksModel").setData({ clicks });
            },
            addMore: async function () {
                const clicks = this.getOwnerComponent().getModel("clicksModel").getData()
                let counter = 20 + clicks.clicks
                counter !== 0 && console.log("0")
                this.getOwnerComponent().getModel("clicksModel").setData({ clicks: counter });
                let skip = this.getOwnerComponent().getModel("clicksModel").getData()
                const flights1 = this.getOwnerComponent().getModel("flightsModel").getData()
                this.getOwnerComponent().getModel("viewModel").setProperty("/busy", true)
                const flights = await models.flightQuery(this.getOwnerComponent(), skip.clicks, 20)
                this.getOwnerComponent().getModel("viewModel").setProperty("/busy", false)
                let t = flights1.results.concat(flights.results)
                //let t = flights.results
                this.getOwnerComponent().getModel("flightsModel").setData({ results: t });
            },
            onFlightClick: async function (oEvent) {
                let oItem = oEvent.getSource();
                let temp = oItem.getBindingContext("flightsModel").getObject();
                let { carrid, connid, fldate } = temp
                fldate = `${new Date(fldate).getFullYear()}-${new Date(fldate).getMonth() + 1}-${new Date(fldate).getDate()}`
                this.getOwnerComponent().getRouter().navTo("routeForDetails", {
                    carrid, connid, fldate
                });
            },
            navToGraph(oEvent) {

                this.getOwnerComponent().getRouter().navTo("graphFlights");
            }
        });
    })