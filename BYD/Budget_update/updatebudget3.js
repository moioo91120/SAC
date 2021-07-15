(function()  {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <button id="updatebudget">Valider les budgets</button>
    `;

    customElements.define('com-sap-sample-helloworld1', class HelloWorld1 extends HTMLElement {


		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
			this._shadowRoot.getElementById("updatebudget").addEventListener("click", this._submit.bind(this));
            this._firstConnection = false;
            this.addEventListener("click", event => {
                console.log('click');
            });
		}

		_submit(e) {
			e.preventDefault();
            UI5(this);
			console.log("chicked");
		}


        //Fired when the widget is added to the html DOM of the page
        connectedCallback(){
            this._firstConnection = true;
            this.redraw();
        }

         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback(){
        
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

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller",
                "sap/m/MessageToast",
                "sap/m/MessageBox",
                "sap/m/BusyDialog"
            ], function(jQuery, Controller, MessageToast, MessageBox, BusyDialog) {
                "use strict";

                var busyDialog = (busyDialog) ? busyDialog : new BusyDialog({});

                return Controller.extend("myView.Template", {

                    onButtonPress: function(oEvent) {
                        var this_ = this;
                        var CLIENT_ID_str = '_client_id_';
                        var CLIENT_SECRET_str = '_client_secret';

						$.ajax({
                            type: 'POST',
                            url: "https://_url_token_/uaa-security/oauth/token",
                            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                            crossDomain:true,
                            cache : true, 
                            dataType: 'json',

                            success: function (data) {
                                console.log(data);

                            },
                            error: function (e) {
                                this_.runNext();
                                console.log(e.responseText);
                            }
                        });
                    },

                    wasteTime: function() {
                        busyDialog.open();
                    },

                    runNext: function() {
                        busyDialog.close();
                    },
                });
            });

        });
    }
})();