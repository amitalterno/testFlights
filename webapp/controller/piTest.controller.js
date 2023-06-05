
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "project1/model/models",
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        'sap/ui/model/Filter',
        'sap/ui/core/Fragment'
    ],  /**
          * 
          * @param {typeop sap.ui.core.mvc.Controller} Controller 
          */
    function (Controller, models, BindingMode, JSONModel, ChartFormatter, Format, Filter, ExportTypeCSV, Fragment) {
        'use strict';

        return Controller.extend("project1.controller.piTest", {

            dataPath: "/sap/opu/odata/IWFND/RMTSAMPLEFLIGHT/FlightCollection?$top=250",

            dataPointStyle: {
                "rules": [
                    {
                        "dataContext":
                            { "PRICE": 0 },
                        "properties": {
                            "color": "#ffffff"
                        },
                        "displayName": "Success"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 1, max: 100 } },
                        "properties": {
                            "color": "#3ba365"
                        },
                        "displayName": "Success"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 101, max: 200 } },
                        "properties": {
                            "color": "#65cf8f"
                        },
                        "displayName": "Success"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 201, max: 300 } },
                        "properties": {
                            "color": "#27b962"
                        },
                        "displayName": "Success"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 301, max: 400 } },
                        "properties": {
                            "color": "#189e4e"
                        },
                        "displayName": "Success"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 401, max: 500 } },
                        "properties": {
                            "color": "#e89d9d"
                        },
                        "displayName": "Error"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 501, max: 600 } },
                        "properties": {
                            "color": "#de6666"
                        },
                        "displayName": "Error"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 601, max: 700 } },
                        "properties": {
                            "color": "#bb0000"
                        },
                        "displayName": "Error"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 701, max: 800 } },
                        "properties": {
                            "color": "#f7d48f"
                        },
                        "displayName": "Schedule"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 801, max: 900 } },
                        "properties": {
                            "color": "#f9bc45"
                        },
                        "displayName": "Schedule"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 901, max: 1000 } },
                        "properties": {
                            "color": "#dadada"
                        },
                        "displayName": "Terminated"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 1001, max: 2000 } },
                        "properties": {
                            "color": "#cecece"
                        },
                        "displayName": "Terminated"
                    },
                    {
                        "dataContext":
                            { "PRICE": { min: 2001, max: 3000 } },
                        "properties": {
                            "color": "#b3b3b3"
                        },
                        "displayName": "Terminated"
                    }
                ]
            },
            // settingsModel: {
            //     color: {
            //         name: "Color",
            //         defaultSelected: 1,
            //         values: [{
            //             "feed": "color",
            //             "type": "color",
            //             "numOfSegments": 4,
            //             "palette": ["#189e4e", "#bb0000", "#f9bc45", "#a2a2a2"]
            //         }]
            //     }
            // },

            onInit: async function () {
                this.getOwnerComponent().getModel("viewModel").setProperty("/busy", true)
                const flights = await models.flightQuery(this.getOwnerComponent(), 0, 60)
                this.getOwnerComponent().getModel("flightsModel").setData(flights);
                this.getOwnerComponent().getModel("viewModel").setProperty("/messageCounter", `${flights.results.length}`)
                this.getOwnerComponent().getModel("viewModel").setProperty("/status", { res: [{ status: "Error" }, { status: "Success" }, { status: "Schedule" }, { status: "Cancelled" }] })
                this.getOwnerComponent().getModel("viewModel").setProperty("/date", `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`)
                const hours = new Date().getHours()
                const minutes = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : `${new Date().getMinutes()}`
                this.getOwnerComponent().getModel("viewModel").setProperty("/time", `${hours}:${minutes}`)
                const dashboards = { res: [{ name: "PIP", path: "/pip" }, { name: "DSP", path: "/dsp" }, { name: "PRD", path: "/prd" }, { name: "IPP", path: "/ipp" }, { name: "ERP", path: "/erp" }, { name: "SCPI", path: "/scpi" }, { name: "BODS", path: "/BODS" }] }
                this.getOwnerComponent().getModel("viewModel").setProperty("/dashboards", dashboards)
                this.getOwnerComponent().getModel("viewModel").setProperty("/today", new Date())
                this.getOwnerComponent().getModel("viewModel").setProperty("/minDate", new Date('January 1, 2000 00:00:00'))
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedFilter", "Today");
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedMonth", "Monthly")
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedYear", "Annually");
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedCustom", "Custom");
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedDaily", "Daily");
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedWeekly", "Weekly");
                this.getOwnerComponent().getModel("viewModel").setProperty("/isExp", "expiryDate");

                const last7Days = { days: [] }
                const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const now = new Date();
                for (let i = 1; i < 8; i++) {
                    let day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
                    last7Days.days.push({ day: weekday[day.getDay()], date: `${day.getMonth() + 1}/${day.getDate()}` })
                }

                this.getOwnerComponent().getModel("viewModel").setProperty("/last7Days", last7Days);

                Format.numericFormatter(ChartFormatter.getInstance());
                let formatPattern = ChartFormatter.DefaultPattern;
                // let oModel = new JSONModel(this.settingsModel);
                // oModel.setDefaultBindingMode(BindingMode.OneWay);
                // this.getView().setModel(oModel);
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
                            visible: true
                        },
                        dataPointStyle: this.dataPointStyle

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
                this.getOwnerComponent().getModel("viewModel").setProperty("/showMap", false);

                const dailyComboBox = this.byId("dailyComboBox");
                const weeklyComboBox = this.byId("weeklyComboBox");

                this._disableComboBoxInput(dailyComboBox);
                this._disableComboBoxInput(weeklyComboBox);

                this.getOwnerComponent().getModel("viewModel").setProperty("/busy", false)
            },
            onFilterRow: function (oEvent, sKey) {
                const oViewModel = this.getOwnerComponent().getModel("viewModel");
                oViewModel.setProperty("/SelectedFilter", sKey);
                oViewModel.setProperty("/SelectedMonth", "Monthly")
                oViewModel.setProperty("/SelectedYear", "Annually");
                oViewModel.setProperty("/SelectedCustom", "Custom");
                oViewModel.setProperty("/SelectedDaily", "Daily");
                this.getView().byId("weeklyComboBox").setSelectedKey(null);
                this.getView().byId("dailyComboBox").setSelectedKey(null);

            },
            openMonthlySelection: function (oEvent) {
                this.getView().byId("Monthly").openBy(oEvent.getSource().getDomRef());
                this.onFilterRow(oEvent, 'Monthly')
            },
            openAnnuallySelection: function (oEvent) {
                this.getView().byId("Annually").openBy(oEvent.getSource().getDomRef());
                this.onFilterRow(oEvent, 'Annually')
            },
            openDateRangeSelection: function (oEvent) {
                //this.getView().byId("Custom").openBy(oEvent.getSource().getDomRef());
                var oDateRangeSelection = new sap.m.DateRangeSelection({
                    dateValue: new Date(),
                    displayFormat: "yyyy/MM/dd - yyyy/MM/dd",

                });

                // Open DateRangeSelection control
                // Create Popover control
                var oPopover = new sap.m.Popover({
                    title: "Select Date Range",
                    content: oDateRangeSelection,
                    placement: sap.m.PlacementType.Auto,
                    modal: true,
                    verticalScrolling: false,
                    afterOpen: function () {
                        var oCalendar = oDateRangeSelection.getBinding("calendar")
                        if (oCalendar) {
                            oCalendar.openPicker();
                        }
                    },
                    afterClose: function () {
                        // Get selected date range and do something with it
                        var oSelectedDateRange = oDateRangeSelection.getDateValue()
                        console.log("Selected date range:", oSelectedDateRange);
                        oPopover.destroy();
                    }

                });
                // Open Popover control
                oPopover.openBy(oEvent.getSource());
                this.onFilterRow(oEvent, 'Custom')
            },
            handleMonthChange: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const d = new Date(sValue);
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedMonth", monthNames[d.getMonth()]);
            },
            handleYearChange: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                const d = new Date(sValue);
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedYear", d.getFullYear());
            },
            changeDateHandler: function (oEvent) {
                let sFrom = oEvent.getParameter("from");
                let sTo = oEvent.getParameter("to");
                this.getOwnerComponent().getModel("viewModel").setProperty("/SelectedCustom", `${new Date(sFrom).getMonth() + 1}/${new Date(sFrom).getDate()}/${new Date(sFrom).getFullYear()}-${new Date(sTo).getMonth() + 1}/${new Date(sTo).getDate()}/${new Date(sTo).getFullYear()}`);
            },
            handleSelectionChange: function (oEvent) {
                let changedItem = oEvent.getParameter("changedItem");
                let isSelected = oEvent.getParameter("selected");
            },
            handleSelectionFinish: function (oEvent) {
                let selectedItems = oEvent.getParameter("selectedItems");
            },
            goToDashboard: function (oEvent) {
                let selectedItemPath = oEvent.getParameter("selectedItem").getKey();
                //selectedItemPath=/ecc /pip /scpi
                //cross app navigation
                // this.getOwnerComponent().getRouter().navTo(selectedItemPath);
            },
            showMap: function (oEvent) {
                let switchMode = oEvent.getParameter("state");
                this.getOwnerComponent().getModel("viewModel").setProperty("/showMap", switchMode);
            },
            onSearch: function (oEvent) {

                // add filter for search
                // let aFilters = [];
                // let sQuery = oEvt.getSource().getValue();
                // if (sQuery && sQuery.length > 0) {
                //     let filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
                //     aFilters.push(filter);
                // }

                // update list binding
                let sSearchValue = oEvent.getSource().getValue();
                let oTable = this.getView().byId("table");
                let oBinding = oTable.getBinding("rows");
                let oFilter = new sap.ui.model.Filter("flightDetails/cityTo", sap.ui.model.FilterOperator.StartsWith, sSearchValue);
                oBinding.filter([oFilter]);

            },
            exportToExcel: function () {
                let oTable = this.getView().byId("table");
                // let oTablePersoController = new sap.ui.table.TablePersoController({
                //     table: oTable
                // });
                let exType = new sap.ui.core.util.ExportTypeCSV()

                exType.setSeparatorChar(",")
                let oExport = new sap.ui.core.util.Export({
                    exportType: exType,
                    models: oTable.getModel(),
                    rows: {
                        path: oTable.getBinding("rows")
                    }
                });

                // trigger the export
                oExport.saveFile().catch(function (oError) {
                    console.error("Error occurred while exporting data: " + oError);
                });
            },
            navToGraph(oEvent) {

                this.getOwnerComponent().getRouter().navTo("graphFlights");
            },
            refresh: function () {
                window.location.reload()
            },
            _disableComboBoxInput: function (oCombobox) {
                oCombobox.addEventDelegate({
                    onclick: () => {
                        oCombobox.open();
                    },
                    onkeydown: (e) => {
                        e.preventDefault();
                    },
                });
            },
            onSortTable: function () {
                let oTable = this.getView().byId("table"); // get a reference to the table
                let oBinding = oTable.getBinding("rows"); // get the binding object
                let aSorters = []; // create an array to store the sorters

                // create a sorter object for the "name" column in ascending order
                let oSorter = new sap.ui.model.Sorter("SEATSMAX", false);
                aSorters.push(oSorter); // add the sorter to the array

                // apply the sorters to the binding
                oBinding.sort(aSorters);
            },
            onTableRowPress: function (oEvent) {
                // Get the clicked table row
                let oRow = oEvent.getSource();
                // Create popover control
                let oPopover = new sap.m.Popover({
                    placement: sap.m.PlacementType.Auto,
                    content: new sap.ui.layout.form.SimpleForm({
                        content: [
                            new sap.m.Label({ text: "Field 1" }),
                            new sap.m.Input(),
                            new sap.m.Label({ text: "Field 2" }),
                            new sap.m.Input()
                        ]
                    })
                });

                // Open popover relative to clicked row
                oPopover.openBy(oRow);
            }
        });
    })