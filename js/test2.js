(function() {
	this.Question = function() {
		this.btnRemove = null;
		this.btnArrange = null;
		this.btnEdit = null;
		
		var defaults = {
			className: "editing",
			expectedAnswer: "",
			questionText: "",
			questionId: "",
			stickTo: "qlist"
		}
		
		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = _extendDefaults(defaults, arguments[0]);
		}
		
		Question.prototype.add = function() {
			_buildTemplate.call(this);
		}
		
		Question.prototype.remove = function() {
			var _ = this;
			_.question.parentNode.removeChild(_.question);
		}
		
		Question.prototype.arrange = function() {
			console.log("arranging");
		}
		
		function _buildTemplate() {
			var xhr = new XMLHttpRequest(),
				_ = this;
			
			// Make template
			this.question = document.createElement("div");
			
			// Ajax call to get template
			xhr.open('GET', 'templates/tpl-quest-existing.html');
			xhr.send(null);
			xhr.onload = function(e) {
				var response = e.target.response,
					renderSect = Mustache.render(response, _.options),
					stickTo = document.getElementById(_.options.stickTo);
					
				_.question.innerHTML = renderSect;
				stickTo.insertBefore(_.question, stickTo.firstChild);
				_initializeEvents.call(_);
			}
		}
		
		function _initializeEvents() {
			this.btnRemove = document.getElementById("q-remove_"+this.options.questionId);
			this.btnArrange = document.getElementById("q-arrange_"+this.options.questionId);
			this.btnRemove.addEventListener('click', this.remove.bind(this));
			this.btnArrange.addEventListener('click', this.arrange.bind(this));
		}
		

		
		function _extendDefaults(source, properties){
			var property;
			for (property in properties) {
				if (properties.hasOwnProperty(property)) {
					source[property] = properties[property];
				}
			}
			return source;
		}
	}
}());


var btn = document.getElementsByClassName("q-blank");
btn[0].addEventListener('click', function() {
	var myQuest = new Question({
		className: "fuck",
		expectedAnswer: "sdasd",
		questionText: "new question",
		questionId: "quest-302"
	});
	myQuest.add();
});