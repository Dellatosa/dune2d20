const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class DuneResourcesTrackerV2 extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		id: "resources-tracker-window",
		classes: ["dune2d20", "app", "tracker"],
		window :{
			frame: true,
			title: "dune2d20.app.trackerTitle",
			controls : [ {action: "close", visible: false } ]
		},
		position:{
			width: 282,
			height: 180
		},
		actions: {
      		plus: DuneResourcesTrackerV2.plusHandler,
			minus: DuneResourcesTrackerV2.minusHandler,
			reinit : DuneResourcesTrackerV2.reinitHandler
    	}
  	}

	static PARTS = {
  		form: {
    		template: "systems/dune2d20/templates/apps/resources-tracker-v2.hbs"
  		}
	}
	
	async _preparePartContext(partId, context) {
		context.isGM = game.user.isGM;

		context.momentumPool = game.settings.get("dune2d20", "momentumPool").value;
		context.threatPool = game.settings.get("dune2d20", "threatPool").value;

		return context;
	}

	async _onPosition(position) {
		game.user.setFlag("dune2d20", "resourcesTrackerV2Pos", position);
	}
	
	refresh(position) {
		//console.log(position);
		this.render(true);
		if(position != null) {
			this.setPosition({left: position.left, top: position.top});
		}
	}

	static plusHandler(event, target) {
		event.preventDefault();

 		const poolName = target.dataset.pool.concat("Pool");

		const pool = game.settings.get("dune2d20", poolName);
		if (pool.value < pool.max) {
			game.settings.set("dune2d20", poolName, {max: pool.max, value: pool.value + 1});
		}
	}

	static minusHandler(event, target) {
		event.preventDefault();

 		const poolName = target.dataset.pool.concat("Pool");

		const pool = game.settings.get("dune2d20", poolName);
		if (pool.value > 0) {
			game.settings.set("dune2d20", poolName, {max: pool.max, value: pool.value - 1});
		}
	}

	static reinitHandler(event, target) {
		event.preventDefault();

 		const poolName = target.dataset.pool.concat("Pool");

		const pool = game.settings.get("dune2d20", poolName);
		game.settings.set("dune2d20", poolName, {max: pool.max, value: 0});
	}
}