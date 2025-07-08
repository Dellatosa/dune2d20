export class DuneResourcesTracker extends Application {

	constructor(options = {}) {
		super(options)
	}

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dune2d20", "app", "tracker"]
        });
    }

	get template() {
		return `systems/dune2d20/templates/apps/resources-tracker.html`;
	}
	
	getData(options) {
		const data = super.getData(options);
		data.isGM = game.user.isGM;

		data.momentumPool = game.settings.get("dune2d20", "momentumPool").value;
		data.threatPool = game.settings.get("dune2d20", "threatPool").value;

		return data;
	}
	
	activateListeners(html) {
		super.activateListeners(html);
		
		html.find(".plus").click(this._onTrackerPlus.bind(this));
		html.find(".minus").click(this._onTrackerMinus.bind(this));
		html.find(".reinit").click(this._onTrackerReinit.bind(this));

		html.find("#resources-tracker-drag").contextmenu(this._onRightClick.bind(this));

		// Set position
		let tracker = document.getElementById("resources-tracker");
		const trackerPos = game.user.getFlag("dune2d20", "resourcesTrackerPos");
		tracker.style.left = trackerPos.xPos;
		tracker.style.bottom = trackerPos.yPos;

		// Make the DIV element draggable:
		this._dragElement(tracker);
	}
	
	refresh() {
		this.render(true);
	}

	_onTrackerPlus(event) {
		event.preventDefault();

 		const poolName = event.currentTarget.dataset.pool.concat("Pool");

		const pool = game.settings.get("dune2d20", poolName);
		if (pool.value < pool.max) {
			game.settings.set("dune2d20", poolName, {max: pool.max, value: pool.value + 1});
		}
		
	}

	_onTrackerMinus(event) {
		event.preventDefault();

 		const poolName = event.currentTarget.dataset.pool.concat("Pool");

		const pool = game.settings.get("dune2d20", poolName);
		if (pool.value > 0) {
			game.settings.set("dune2d20", poolName, {max: pool.max, value: pool.value - 1});
		}
	}

	_onTrackerReinit(event) {
		event.preventDefault();

 		const poolName = event.currentTarget.dataset.pool.concat("Pool");

		const pool = game.settings.get("dune2d20", poolName);
		game.settings.set("dune2d20", poolName, {max: pool.max, value: 0});
	}

	_onRightClick(event) {
		const tracker = event.currentTarget.closest("#resources-tracker");
		const original = CONFIG.dune2d20.resourcesTrackerPos;
		tracker.style.left = original.xPos;
		tracker.style.bottom = original.yPos;
		game.user.setFlag("dune2d20", "resourcesTrackerPos", original);
	}

	_dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (document.getElementById("resources-tracker-drag")) {
		  // if present, the header is where you move the DIV from:
		  document.getElementById("resources-tracker-drag").onmousedown = dragMouseDown;
		} else {
		  // otherwise, move the DIV from anywhere inside the DIV:
		  elmnt.onmousedown = dragMouseDown;
		}
	  
		function dragMouseDown(e) {
		  e = e || window.event;
		  e.preventDefault();
		  // get the mouse cursor position at startup:
		  pos3 = e.clientX;
		  pos4 = e.clientY;
		  document.onmouseup = closeDragElement;
		  // call a function whenever the cursor moves:
		  document.onmousemove = elementDrag;
		}
	  
		function elementDrag(e) {
		  e = e || window.event;
		  e.preventDefault();
		  // calculate the new cursor position:
		  pos1 = pos3 - e.clientX;
		  pos2 = pos4 - e.clientY;
		  pos3 = e.clientX;
		  pos4 = e.clientY;
		  // set the element's new position:
		  elmnt.style.bottom = (elmnt.offsetParent.clientHeight - elmnt.offsetTop - elmnt.clientHeight + pos2) + "px";
		  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}
	  
		function closeDragElement() {
		  	// stop moving when mouse button is released:
		  	document.onmouseup = null;
		  	document.onmousemove = null;
		  	// Save position on appropriate User Flag
			const trackerPos = {};
			trackerPos.xPos = elmnt.style.left;
			trackerPos.yPos = elmnt.style.bottom;
			game.user.setFlag("dune2d20", "resourcesTrackerPos", trackerPos);
		}
	}
}