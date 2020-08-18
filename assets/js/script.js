var support = (function () {
	if (!window.DOMParser) return false;
	var parser = new DOMParser();
	try {
		parser.parseFromString('x', 'text/html');
	} catch(err) {
		return false;
	}
	return true;
})();

var stringToHTML = function (str) {

	// If DOMParser is supported, use it
	if (support) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc.body;
	}

	// Otherwise, fallback to old-school method
	var dom = document.createElement('div');
	dom.innerHTML = str;
	return dom;

};

var request = new XMLHttpRequest();
request.open('GET', 'https://timeline.garlic.marvelous-tech.com/api/timeline/', true);

request.onload = function () {
  
  	var data = JSON.parse(this.response);

  	const timelines = document.getElementById('timelines');

	data.forEach((timeline) => {
		const timelineElement = document.createElement('div');
		timelineElement.setAttribute('class', 'timeline');

		const timelineName = document.createElement('div');
		timelineName.setAttribute('class', 'timeline-month');

		const total = document.createElement('span');

		if (timeline.threads.length > 1) {
			total.textContent = timeline.threads.length + " Entries" ;//timeline.length;
		} else {
			total.textContent = timeline.threads.length + " Entry" ;//timeline.length;
		}

		timelineName.textContent = timeline.name;
		timelineName.appendChild(total);

		timelineElement.appendChild(timelineName);
		
		timeline.threads.forEach((thread) => {
			const threadElement = document.createElement('div');
			threadElement.setAttribute('class', 'timeline-section');

			const dateElement = document.createElement('div');
			dateElement.setAttribute('class', 'timeline-date');

			dateElement.textContent = thread.name;

			threadElement.appendChild(dateElement);

			const row = document.createElement('div');
			row.setAttribute('class', 'row');

			thread.objects.forEach((object) => {
				const col = document.createElement('div');
				col.setAttribute('class', 'col-sm-4');

				const box = document.createElement('div');
				box.setAttribute('class', 'timeline-box');

				const boxTitle = document.createElement('div');
				boxTitle.setAttribute('class', 'box-title');

				var stateLogo = "<i ";

				if (object.is_done == true) {
					stateLogo = stateLogo + "class='fa fa-pencil text-success'>";
				}
				else {
					stateLogo = stateLogo + "class='fa fa-pencil text-danger'>";
				}
				
				stateLogo = stateLogo + "</i> " + object.name;

				boxTitle.innerHTML = stateLogo;

				const content = document.createElement('div');
				content.setAttribute('class', 'box-content');

				content.innerHTML = stringToHTML(object.description).innerHTML;

				const addedBy = document.createElement('div');
				addedBy.setAttribute('class', 'box-footer');
				addedBy.innerHTML = new Date(object.created).toDateString();

				box.appendChild(boxTitle);
				box.appendChild(content);
				box.appendChild(addedBy);

				col.appendChild(box);

				row.appendChild(col);

			});
			threadElement.appendChild(row);
			timelineElement.appendChild(threadElement);
		});

		timelines.appendChild(timelineElement);
	});
}

request.send();
