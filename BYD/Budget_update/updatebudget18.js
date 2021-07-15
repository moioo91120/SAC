(function()  {
    let _shadowRoot;
    let _id;
    let _score;

    let div;
    let Ar = [];
    let widgetName;
	
	
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
	    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <button id="updatebudget">Valider les budgets</button>
    `;

    customElements.define('com-sap-sample-helloworld1', class HelloWorld1 extends HTMLElement {


		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
			
            _id = createGuid();
            this._export_settings = {};
            this._export_settings.restapiurl = "";
            this._export_settings.score = "";
            this._export_settings.name = "";

			
			this._shadowRoot.getElementById("updatebudget").addEventListener("click", this._submit.bind(this));
            this._firstConnection = false;
            this._firstConnectionUI5 = 0;
			
		}

		_submit(e) {
			e.preventDefault();
            UI5(null, this);
			
			var restAPIURL = "https://www.google.com";
			$.ajax({
				url: restAPIURL,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded',
				success: function(data) {
					console.log(data);
				},
				error: function(e) {
					console.log("error: " + e);
				}
			});
		}
		
        onCustomWidgetAfterUpdate(changedProperties) {
            UI5(changedProperties, this);
        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }


         //When the custom widget is updated, the Custom Widget SDK framework executes this function first
		onCustomWidgetBeforeUpdate(oChangedProperties) {

		}

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
		onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection){
                this.redraw();
            }
        }
        
        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy(){
        }

        
        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
            redraw()
        }
        */

        redraw(){
        }
    });
	
	
	
    function UI5(changedProperties, that) {
        var that_ = that;
        var restAPIURL = "https://www.google.com";
		console.log("in UI5");
        div = document.createElement('div');
        widgetName = "mywidget";
        div.slot = "content_" + widgetName;
		
        if (that._firstConnectionUI5 === 0) {
            console.log("--First Time --");

            let div0 = document.createElement('div');
            //div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" height="100%" controllerName="myView.Template"><l:VerticalLayout class="sapUiContentPadding" width="100%"><l:content><Input id="input"  placeholder="Enter partner number..." liveChange=""/></l:content><Button id="buttonId" class="sapUiSmallMarginBottom" text="Get Score" width="150px" press=".onButtonPress" /></l:VerticalLayout></mvc:View></script>';
            //that_._shadowRoot.appendChild(div0);

            let div1 = document.createElement('div');
            div1.innerHTML = '<div id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"></slot></div>';
            that_._shadowRoot.appendChild(div1);


            var mapcanvas_divstr = that_._shadowRoot.getElementById('oView_' + widgetName);

            Ar.push({
                'id': widgetName,
                'div': mapcanvas_divstr
            });
            console.log(Ar);
        }
		
        sap.ui.getCore().attachInit(function() {
            "use strict";

			sap.ui.require([
                "jquery.sap.global",
				"sap/m/Button",
				"sap/m/MessageToast"
			], function (Button, MessageToast) {
				"use strict";

				new Button({
					text: "Ready...",
					press: function () {
						MessageToast.show("Hello World!");
						$.ajax({
							url: restAPIURL,
							type: 'POST',
							contentType: 'application/x-www-form-urlencoded',
							success: function(data) {
								console.log(data);

								that._firePropertiesChanged();
								this.settings = {};
								this.settings.score = "";

								that.dispatchEvent(new CustomEvent("onStart", {
									detail: {
										settings: this.settings
									}
								}));

							},
							error: function(e) {
								console.log("error: " + e);
							}
						});
					}
				});

			});
			
            console.log("widgetName:" + widgetName);
            var foundIndex = Ar.findIndex(x => x.id == widgetName);
            var divfinal = Ar[foundIndex].div;

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
			
			/*
            //### Controller ###
            sap.ui.require([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller",
                "sap/m/MessageToast",
                'sap/m/MessageBox'
            ], function(jQuery, Controller, MessageToast, MessageBox) {
                "use strict";
				
				
                return Controller.extend("myView.Template", {

                    onButtonPress: function(oEvent) {
                        var this_ = this;


						$.ajax({
							url: restAPIURL,
							type: 'POST',
							contentType: 'application/x-www-form-urlencoded',
							success: function(data) {
								console.log(data);

								that._firePropertiesChanged();
								this.settings = {};
								this.settings.score = "";

								that.dispatchEvent(new CustomEvent("onStart", {
									detail: {
										settings: this.settings
									}
								}));

							},
							error: function(e) {
								console.log("error: " + e);
							}
						});
                    },

                });

            });


			*/
        });
    }
	
    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();