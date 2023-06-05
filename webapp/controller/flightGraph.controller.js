sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project1/model/models",
    'sap/ui/model/BindingMode',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
], function (
    Controller, models, BindingMode, JSONModel, FlattenedDataset, FeedItem, ChartFormatter, Format
) {
    "use strict";

    return Controller.extend("project1.controller.flightGraph", {
        /**
         * @override
         */
        settingsModel: {
            name: "Chart Type",
            defaultSelected: "0",
            values: [{
                key: "1",
                name: "Column Chart",
                vizType: "timeseries_column",
                json: "/column/medium.json",
                value: ["PRICE"],
                dataset: {
                    dimensions: [{
                        name: 'Date',
                        value: "{fldatde}",
                        dataType: 'date'
                    }],
                    measures: [{
                        name: 'PRICE',
                        value: '{PRICE}'
                    }],
                    data: {
                        path: "/results"
                    }
                },
                vizProperties: {
                    plotArea: {
                        dataLabel: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                            visible: false
                        },
                        window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint"
                        }
                    },
                    valueAxis: {
                        label: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
                        },
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    }
                }
            }]
        },

        onInit: async function () {
            this.getOwnerComponent().getModel("viewModel").setProperty("/busy", true)
            const flights = await models.flightQuery(this.getOwnerComponent(), 0, 20)
            this.getOwnerComponent().getModel("viewModel").setProperty("/busy", false)
            this.getOwnerComponent().getModel("flightsModel").setData(flights);
        },/**
         * @override
         */
        onAfterRendering: function () {
            var oVizFrame = this.getView().byId("idVizFrame");
            // var oValueFormat = this.byId("columnChart").getModel("i18n").getResourceBundle().getText("DATE_FORMAT");
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: 'SEATSMAX',
                    value: "{SEATSMAX}"
                }],
                measures: [{
                    name: 'price',
                    value: "{PRICE}"
                }],
                data: {
                    path: "/"
                }
            });
            oVizFrame.setDataset(oDataset);

        }
    }
    );
});
