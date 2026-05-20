const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class DuneRerollAppV2 extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
		    id: "reroll-app-window",
		    classes: ["dune2d20", "app", "reroll"],
		    window :{
			    //frame: true,
			    title: "dune2d20.app.reroll",
          resizable: true,
			    //controls : [ {action: "close", visible: false } ]
		    },
		    position:{
			      width: 400,
			      height: "auto"
		    },
        tag: 'form',
        form: {
            handler: DuneRerollAppV2.submitHandler,
            submitOnChange: false,
            closeOnSubmit: true
        },
		    actions: {
      		  checkDice: DuneRerollAppV2.checkDiceHandler
    	  }
    }

    static PARTS = {
  		  form: {
    		    template: "systems/dune2d20/templates/apps/reroll-app-v2.hbs"
  		  }
	  }

    constructor(actor, initialRoll, options) {
        super();
        this.actor = actor;
        this.initialRoll = initialRoll;
        this.resolve = options.resolve;

        this.mustReroll = false;
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.initialRoll = this.initialRoll;
        context.configData = CONFIG.dune2d20;

        return context;
    }

    static checkDiceHandler(event, target) {
		    event.preventDefault();

        const index = target.dataset.index;
        this.initialRoll[index].select = !this.initialRoll[index].select;
        this.render();
    }

    static async submitHandler(event, form, formData) {
        this.mustReroll = this.initialRoll.some(die => die.select == true);
        this.render();
    }
    
    close(options) {
		    super.close(options);
        if (this.mustReroll) this.resolve(this.initialRoll);
        else this.resolve(false);
	  }

    static open(actor, initialRoll) {
        return new Promise( (resolve) => {
            const dialog = new this(actor, initialRoll, { resolve });
            dialog.render(true);
        });
    }
}


//export default class DuneRerollFormApplicationOld extends FormApplication {
    /*
    constructor(actor, initialRoll, options) {
      super();
      this.actor = actor;
      this.initialRoll = initialRoll;
      this.resolve = options.resolve;

      this.mustReroll = false;
    }
    */

    /*
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ['dune2d20','app','reroll'],
        popOut: true,
        template: "systems/dune2d20/templates/apps/reroll-app.html",
        id: "reroll-app",
        title: game.i18n.localize("dune2d20.app.reroll"),
        height: 'auto',
        width: 400,
        resizable: true
      });
    }
      */
  
    /*
    getData() {
      // Send data to the template
      return {
        initialRoll: this.initialRoll,
        configData: CONFIG.dune2d20
      };
    }
      */
  
    /* NOT TREATED
    activateListeners(html) {
      super.activateListeners(html);

      html.find('.check').click(this._onCheckRerollDie.bind(this));
    }
  
    async _onCheckRerollDie(event) {
        event.preventDefault();
        
        const element = event.currentTarget;
        const index = element.dataset.index;
        this.initialRoll[index].select = !this.initialRoll[index].select;
        this.render();
    }

    async _updateObject(event, formData) {
        this.mustReroll = this.initialRoll.some(die => die.select == true);
        this.render();
    }
        */

    /*
  close(options) {
		super.close(options);
    if (this.mustReroll) this.resolve(this.initialRoll);
    else this.resolve(false);
	}

  static open(actor, initialRoll) {
    return new Promise( (resolve) => {
      const dialog = new this(actor, initialRoll, { resolve });
      dialog.render(true);
    });
  }
    */
//}


//window.DuneRerollFormApplication = DuneRerollFormApplication;