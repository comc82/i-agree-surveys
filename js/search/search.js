var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();


$('.search').keyup(function() {
  delay(function() {
  
	  var srchInput = $('.search').val();
	  srchInput = srchInput.replace(/ /g, '|');
	  if (srchInput[srchInput.length - 1] == '|') {
		srchInput = srchInput.replace(/\|/, '');
	  }
	  if (((/\|/gm).test(srchInput)) || (srchInput.length === 0)) {
		$('#q-show-matching-quests').addClass("hidden");
		$('#q-show-all-quests').removeClass("hidden");
	  } else {
		$('#q-show-matching-quests').removeClass("hidden");
		$('#q-show-all-quests').addClass("hidden");
	  }
	  var regex = new RegExp('(?=[^\\s])' + srchInput, 'ig');
	  var sorted = '';
	  var results = [],
	  sortedResultNames = [];
	  $.getJSON('js/questionList.json?v0.1', function(data) {
		$.each(data, function(key, val) { // index, obj
		  if (val.questionText.search(regex) != -1) { // If regex matches elements
			results.push(val);
			sortedResultNames.push(val);
		  } 
		});
		if (sortedResultNames.length !== 0) {
			$.each(sortedResultNames, function(i, obj) {
			  sorted += '<li>'+obj.questionText+
			  				'<br/>'+
			  				'<a href="#/" class="pure-button button-small pure-button-primary q-add-to-survey" data-question-id="'+obj.questionId+'" data-exp-answer="'+obj.questionExpAnswer+'" data-question-text="'+obj.questionText+'">Add to Survey</a>'+
			  			'</li>';
			});
		} else {
			sorted += '<li>No results matching your search criteria</li>';
		}


		$('.results').hide().html(sorted).fadeIn(200);

	  });

  
  }, 300);
  
  
  
  
  
});
