sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project1/model/models"

], function (
    Controller,
    models) {
    "use strict";

    return Controller.extend("project1.controller.flightDetails", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            // alert(lib.version);
            oRouter.getRoute("routeForDetails").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: async function (oEvent) {
            const flightId = oEvent.getParameter("arguments")
            flightId.fldate = new Date(Date.UTC(flightId.fldate.split("-")[0], Number(flightId.fldate.split("-")[1]) - 1, flightId.fldate.split("-")[2]))
            this.getOwnerComponent().getModel("viewModel").setProperty("/busy", true)
            const flight = await models.getFlightDetail(this.getOwnerComponent(), flightId)
            flight.arrival = new Date(flight.flightDetails.arrivalTime.ms).toISOString().slice(11, 16)
            flight.departure = new Date(flight.flightDetails.departureTime.ms).toISOString().slice(11, 16)
            // flight[0].flightArray = [{
            //     name: 'V131',
            //     origin: { city: 'Paris', latitude: 48.8567, longitude: 2.3510 },
            //     destination: { city: 'Toronto', latitude: 43.8163, longitude: -79.4287 },
            //     state: 0,
            //     color: '#F60'
            // },]
            this.getOwnerComponent().getModel("flightDetailsModel").setData(flight);
            this.getOwnerComponent().getModel("viewModel").setProperty("/busy", false)
        }
    })
});