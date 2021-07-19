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
        <button id="updatebudget"><span id="__button6-img" data-sap-ui="__button6-img" role="presentation" aria-hidden="true" data-sap-ui-icon-content="\xe03f" class="sapUiIcon sapMBtnCustomIcon sapMBtnIcon sapMBtnIconLeft" style="font-family: 'SAP\2dicons';"></span>Valider les budgets</button>
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
			
			var restAPIURL = "https://cnomkebfcc866f.eu2.hana.ondemand.com/sac/public/sac.xsjs/ValidateBudget";
			$.ajax({
				url: restAPIURL,
				type: 'GET',
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
        }

        connectedCallback() {
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
	
    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

	

})();