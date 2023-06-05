sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/BindingMode',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    './InitPage'
], function (Controller, BindingMode, JSONModel, FeedItem, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("project1.controller.Heatmap", {

        dataPath: "/sap/opu/odata/IWFND/RMTSAMPLEFLIGHT/FlightCollection?$top=550",

        dataPointStyle: {
            "rules": [
                {
                    "dataContext":
                        { "Revenue": { min: 0 } },
                    "properties": {
                        "color": "#189e4e"
                    },
                    "displayName": "Success"
                },
                {
                    "dataContext":
                        { "Revenue": { min: 50 } },
                    "properties": {
                        "color": "#bb0000"
                    },
                    "displayName": "Error"
                },
                {
                    "dataContext":
                        { "Revenue": { min: 150 } },
                    "properties": {
                        "color": "#f9bc45"
                    },
                    "displayName": "Schedule"
                },
                {
                    "dataContext":
                        { "Revenue": { min: 350 } },
                    "properties": {
                        "color": "#a2a2a2"
                    },
                    "displayName": "Terminated"
                }
            ]
        },

        settingsModel: {
            color: {
                name: "Color",
                defaultSelected: 1,
                values: [{
                    name: "3 Sections",
                    value: [{
                        "feed": "color",
                        "type": "color",
                        "numOfSegments": 4,
                        "palette": ["#189e4e", "#bb0000", "#f9bc45", "#a2a2a2"]
                    }]
                }]

            }
        },
        onInit: function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            let formatPattern = ChartFormatter.DefaultPattern;
            let oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(oModel);
            let oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    background: {
                        border: {
                            top: {
                                visible: false
                            },
                            bottom: {
                                visible: false
                            },
                            left: {
                                visible: false
                            },
                            right: {
                                visible: false
                            }
                        }
                    },
                    dataLabel: {
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: false
                    },
                    // dataPointStyle: this.dataPointStyle

                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis2: {
                    title: {
                        visible: false
                    }
                },
                legend: {
                    visible: false,
                    formatString: formatPattern.SHORTFLOAT,
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: false
                }
            });
            let dataModel = new JSONModel(this.dataPath);
            oVizFrame.setModel(dataModel);
            let oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
        }
    });

    return Controller;

});