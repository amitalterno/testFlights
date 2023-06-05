sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, Filter, FilterOperator) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            flightQuery(oComponent, skip, top) {
                try {
                    return new Promise(function (resolve, reject) {
                        oComponent.getModel("ODataModel").read("/FlightCollection", {
                            urlParameters: {
                                "$skip": skip,
                                "$top": top,
                                "$expand": "FlightCarrier,flightbooking"
                            },
                            success: function (data) {
                                resolve(data)
                            },
                            error: function (error) {
                                reject(error);
                            }
                        });
                    });
                } catch (err) { console.log(err) }
            },
            getFlightDetail(oComponent, flightId) {
                return new Promise(function (resolve, reject) {
                    oComponent.getModel("ODataModel").metadataLoaded().then(() => {
                        const key = oComponent.getModel("ODataModel").createKey("/FlightCollection", flightId);
                        // const aFilters = Object.keys(flightId).map((key) => {
                        //     return new Filter(key, FilterOperator.EQ, flightId[key])
                        // });
                        oComponent.getModel("ODataModel").read(key, {
                            // filters: aFilters,
                            urlParameters: {
                                "$expand": "FlightCarrier,flightbooking"
                            },
                            success: function (data) {
                                resolve(data)
                            },
                            error: function (error) {
                                reject(error);
                            }
                        });
                    }).catch((error) => {
                        reject(error)
                    });
                })
            }
        }

    });