export default class DuneRerollFormApplication extends FormApplication {
    constructor(actor, initialRoll, options) {
      super();
      this.actor = actor;
      this.initialRoll = initialRoll;
      this.resolve = options.resolve;

      this.mustReroll = false;
    }
  
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
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
  
    getData() {
      // Send data to the template
      return {
        initialRoll: this.initialRoll,
        configData: CONFIG.dune2d20
      };
    }
  
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
  
window.DuneRerollFormApplication = DuneRerollFormApplication;