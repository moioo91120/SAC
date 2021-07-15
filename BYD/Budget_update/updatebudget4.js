(function()  {
    let _shadowRoot;
    let _id;
    let _score;

    let div;
    let Ar = [];
    let widgetName;
	
	
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
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
            UI5(this);
			console.log("chicked");
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
	
	
	
    function UI5(that) {
        var that_ = that;
        var restAPIURL = "https://www.google.com";

        sap.ui.getCore().attachInit(function() {
            "use strict";

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

        });
    }
})();