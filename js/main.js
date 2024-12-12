var app = (function() {
	var globalVariables = {
		btnRemoveClass:	".q-remove",
		mdlRemoveQuestion : "#modRemoveQuest",
		mdlAddEscEmail : '#modAddNewEscEmail',
		mdlSaveSurveyConfig : "#mdlSaveSurveyConfig",
		mdlCancelSurveyConfig : "#mdlCancelSurveyConfig",
		mdlAddNewQuestion : "#modAddNewQuestion",
		btnEditClass : ".q-edit",
		cboEscMethod: ".escMethod",
		cboEscEmail: ".escEmail",
		formQuestConfig : "#surveyConfig"
	};
	
	// Private Functions
	var _getIsEditing = function(objId) {
		if ($("#"+objId).hasClass("editing")) {
			return true;
		}
		return false;
	};
	var _getQuestionId = function(obj) {
		return obj.getAttribute("data-question-id");
	};

	// Public Functions
	
	var delay = (function(){
		  var timer = 0;
		  return function(callback, ms){
		    clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		  };
	})();
	
	var getIsAlreadyOnSurvey = function(obj) {
		var objId = _getQuestionId(obj);
		if (objId === "quest-new") {
			return false;
		}
		var elem = document.getElementById(objId);
		return elem !== null ? true : false;
	};
	
	var getQuestionCount = function() {
		return document.getElementsByClassName("q-single").length;
	};
	
	var addQuestionToSurvey = function(obj) {
		if (obj.dataset.questionText === "") {
			obj.dataset.questionText = $("#qText_quest-new").val();
		}
		var chkYes = "yes_"+obj.dataset.questionId;
		var chkNo = "no_"+obj.dataset.questionId;
		var template =	'<div class="q-single editing" id="'+obj.dataset.questionId+'">'+
							'<div class="pure-g">'+
								'<div class="pure-u-1 q-row">'+
									'<div class="q-number">1.</div>'+
									'<div class="q-text pure-control-group">'+
										'<label class="hidden" for="qText_'+obj.dataset.questionId+'">Question</label>'+
										'<span class="hidden"></span>'+
										'<textarea placeholder="1000 characters maximum" rows="3" class=" pure-u-1 pure-u-md-24-24 required-field" id="qText_'+obj.dataset.questionId+'" name="qText_'+obj.dataset.questionId+'" data-toggle="tooltip-txtArea" data-placement="top" title="<i class=\'icon-exclamation-circle\'></i> Ammend typos and punctuation errors only. <br/>Do not change the meaning of the question.">'+
											obj.dataset.questionText+
										'</textarea>'+
									'</div>'+
									'<div class="q-buttons">'+
										'<a href="#/" class="q-save icon-button pure-button-primary" title="Save" data-question-id="'+obj.dataset.questionId+'" data-toggle="tooltip" data-placement="top" aria-label="Save"><i class="icon-check"></i></a> '+
										/*
										'<a href="#/" class="q-edit icon-button" title="Edit" data-question-id="'+obj.dataset.questionId+'" data-toggle="tooltip" data-placement="top" aria-label="Edit"><i class="icon-pencil"></i></a> '+
										*/
										'<a href="#/" class="q-arrange icon-button q-handler" title="Click and drag to arrange" data-toggle="tooltip" data-placement="top" aria-label="Arrange"><i class="icon-arrows-v"></i></a> '+
										'<a href="#/" class="q-remove icon-button" title="Remove" data-question-id="'+obj.dataset.questionId+'" data-toggle="tooltip" data-placement="top" aria-label="Remove"><i class="icon-trash"></i></a> '+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="pure-g q-config">'+
								'<div class="pure-u-1 pure-u-md-9-24 q-conf-col">'+
									'<div class="pure-control-group">'+
										'<label class="" for="activeFrom_'+obj.dataset.questionId+'">Active From:</label> '+
										'<div class="pure-u-1 pure-u-md-12-24">'+
											'<div class="input-group date">'+
												'<input type="text" placeholder="mm/dd/yyyy" class="required-field input-group-control" id="activeFrom_'+obj.dataset.questionId+'" name="activeFrom_'+obj.dataset.questionId+'">'+
												'<span class="input-group-addon"><i class="icon-calendar"></i></span>'+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="pure-control-group">'+
										'<label class="" for="activeTo_'+obj.dataset.questionId+'">Active To:</label> '+
										'<div class="pure-u-1 pure-u-md-12-24">'+
											'<div class="input-group date">'+
												'<input type="text" placeholder="mm/dd/yyyy" class="required-field input-group-control" id="activeTo_'+obj.dataset.questionId+'" name="activeTo_'+obj.dataset.questionId+'">'+
												'<span class="input-group-addon"><i class="icon-calendar"></i></span>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="pure-u-1 pure-u-md-9-24 q-conf-col">'+
									'<div class="pure-control-group escMethodControl">'+
										'<label class="" for="escMethod_'+obj.dataset.questionId+'">Escalation Method:</label> '+
										'<div class="pure-u-1 pure-u-md-12-24">'+
											'<select id="escMethod_'+obj.dataset.questionId+'" class="pure-u-1 pure-u-md-21-24 escMethod required-field" name="escMethod_'+obj.dataset.questionId+'">'+
												'<option value="">Select</option>'+
												'<option value="escalation-email">Escalation Email</option>'+
												'<option value="email-hierarchy">Email Field Hierarchy</option>'+
											'</select>'+
										'</div>'+
									'</div>'+
									'<div class="pure-control-group hidden escEmailControl">'+
										'<label class="" for="escEmail_'+obj.dataset.questionId+'">Escalation Email:</label> '+
										'<div class="pure-u-1 pure-u-md-12-24">'+
											'<select id="escEmail_'+obj.dataset.questionId+'" class="pure-u-1 pure-u-md-21-24 escEmail required field" name="escEmail_'+obj.dataset.questionId+'">'+
												'<option value="">Select</option>'+
												'<option value="director@marcell.com">director@marcell.com</option>'+
												'<option value="info@marcell.com">info@marcell.com</option>'+
												'<option value="marcellteam@marcell.com">marcellteam@marcell.com</option>'+
												'<option value="new-esc-email">Add New Email</option>'+
											'</select>'+
											'</div>'+
									'</div>'+
								'</div>'+
								'<div class="pure-u-1 pure-u-md-6-24 q-conf-col">'+
									'<div class="pure-control-group">'+
										'<span class="label">Expected Answer:</span>'+
										'<label class="pure-radio">'+
											'<input id="yes_'+obj.dataset.questionId+'" type="radio" name="expectedAns_'+obj.dataset.questionId+'" class="required-field input-radio"> Yes'+
										'</label> '+
										'<label class="pure-radio">'+
											'<input id="no_'+obj.dataset.questionId+'" type="radio" name="expectedAns_'+obj.dataset.questionId+'" class="required-field input-radio"> No'+
										'</label>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
		$(template).prependTo('#qlist');
		if (obj.dataset.questionId === "quest-new") {
			console.log("is new");
			var isNewQuestionAlert = 	'<div style="background-color: #3A8ED6; color: #ebf4fb; padding: 5px 15px;">'+
											'<i class="icon-info-circle"></i> This new question will also be saved in the Question Bank.'+
										'</div>';
			$(isNewQuestionAlert).prependTo("#quest-new");
		} else {
			$(obj).text("Already Added").addClass("disabled");
			obj.setAttribute("data-is-added", "1");
			//showEditWarning();
		}
		
		if (obj.dataset.expAnswer === "Yes") {
			$("#"+chkYes).prop("checked", true);
		} else if (obj.dataset.expAnswer === "No") {
			$("#"+chkNo).prop("checked", true);
		}
		toastr.clear();
		toastr.success("Adding question to survey");
	};
	
	var removeQuestionFromSurvey = function(obj) {
		var objId = _getQuestionId(obj);
		var objText = $("#"+objId).find(".q-text").text();
		$("#"+objId).remove();
		$("#modRemoveQuest").modal('hide');
		$(".q-add-to-survey[data-question-id="+objId+"]").text("Add to Survey").removeClass("disabled")
		var btn = $(".q-add-to-survey[data-question-id="+objId+"]")[0];
		if (btn !== undefined) {
			btn.setAttribute("data-is-added", "");
		}
		//toastr.success("Question successfully removed!<br><br><div>"+objText+"</div>");
		toastr.clear();
		toastr.success("Removing question from survey");
	};
	
	var addNewEscalationEmail = function(obj) {
		var objId = _getQuestionId(obj);
		var objToPost = {};
		objToPost.name = $("#escEmailName").val();
		objToPost.email = $("#escEmail").val();
		
		$("#escEmail_"+objId+" :nth-child(1)").after(
			$('<option>', {
				value: objToPost.name,
				text: objToPost.email,
				selected: function() {
					return true;
				}
			})
		);
	};
	
	var openModal = function(modalId, obj) {
		switch (modalId) {
			case "#modRemoveQuest": 
				var objId = _getQuestionId(obj);
				var modQuestionText = document.getElementById("modQuestionText");
				document.getElementById("modBtnRemoveQuest").setAttribute("data-question-id", objId);
				if (objId === "quest-new") {
					modQuestionText.innerHTML = "";
				} else {
					if ($("#"+objId+" .q-text span").text().length > 0) {
						modQuestionText.innerHTML = $("#"+objId+" .q-text span").text();
					} else {
						modQuestionText.innerHTML = $("#"+objId+" .q-text textarea").val();
					}
				}
				break;
			case "#modAddNewEscEmail":
				var objId = obj.id.split("_");
				objId = objId[1];
				
				document.getElementById("modBtnCancelAddEscEmail").setAttribute("data-question-id", objId);
				document.getElementById("modBtnAddEscEmail").setAttribute("data-question-id", objId);
				break;
			default:
		}
		
		$(modalId).modal({
			backdrop: 'static',
			keyboard: false
		});
		$(modalId).on('show.bs.modal', function() {
			$(this).find('form').trigger('reset');
			$(this).validate().resetForm(); 
		})
	};
	
	// Edit Questions Functions
	var editQuestion = function(obj) {
		var objId = _getQuestionId(obj);
		var isEditing = _getIsEditing(objId);
		var saveTemplate = 	'<a href="#/" class="q-save icon-button pure-button-primary" title="Save" data-question-id="'+objId+'" data-toggle="tooltip" data-placement="top" aria-label="Save">'+
								'<i class="icon-check"></i>'+
							'</a>';
		if (!isEditing) {
			enableTextArea(objId);
			openConfigSection(objId);
			$("#"+objId+" .q-edit").tooltip('hide');
			$("#"+objId+" .q-edit").remove();
			$("#"+objId+" .q-buttons").prepend(saveTemplate);
			$("#"+objId+" textarea").focus();
		}
	};
	
	var openConfigSection = function(id) {
		var elem = document.getElementById(id);
		var sectConfig = $(elem).find(".q-config");
		sectConfig.removeClass("hidden");
		elem.className += " editing";
	};
	
	var closeConfigSection = function(selector) {
		$(selector).addClass("hidden");
	};
	
	var enableTextArea = function(id) {
		var qText = $("#"+id).find(".q-text");
		var qTextContent = qText.find("span");
		if ($("#"+id+" textarea").length === 0) {
			var qTextArea = document.createElement("textarea");
			qTextArea = $("<textarea>", {
				rows: "3",
				class: "pure-u-1 pure-u-md-24-24 required-field",
				id: "qText_"+id,
				val: qTextContent.text(),
				name : "qText_"+id,
				"data-toggle": "tooltip-txtArea",
				"data-placement": "top"
			});
			$(qTextArea).appendTo(qText);
		} else {
			var qTextArea = $("#"+id+" textarea");
			qTextArea.removeClass("hidden");
		}
		qTextContent.addClass("hidden");
	};
	
	var disableTextArea = function(selector) {
		$(selector).siblings("span").text($(selector).val()).removeClass("hidden");
		$(selector).addClass("hidden");
	};
	
	/*
	var showEditWarning = function() {
		var alertEditWarning = document.getElementById("editWarning");
		$(alertEditWarning).removeClass("hidden");
	};
	*/
	/*
	var showSaveQuestion = function(objId) {
		$("#"+objId+" a").removeClass("q-edit").addClass("q-save");
		$("#"+objId+" i").removeClass("icon-pencil").addClass("icon-check");
	}
	*/
	
	
	
	
	
	// Escalation email 
	var setEscalationEmail = function(obj) {
		var qId = obj.id.split("_");
		qId = qId[1];
		var selectedEscMethod = obj.value;
		var sectEscEmail = $("#"+qId).find(".escEmailControl");
		if (selectedEscMethod === "escalation-email") {
			sectEscEmail.removeClass("hidden");
		} else {
		
			sectEscEmail.addClass("hidden");
		}
	};
	
	var getIsNewEscEmail = function(obj) {
		if (obj.value === "new-esc-email") {
			return true;
		}
		return false;
	};
	
	
	// Search Functionality
	var getKeywords = function() {
		var srchInput = $('.search').val().trim().split(" ");
		var regexStart = "(?=.*\\b";
		var regexEnd = "\\b)";
		var testRegex = [];
		//srchInput = srchInput.replace(/ +/g, '|');
		if (srchInput) {
			for (var i = 0; i < srchInput.length; i++) {
				testRegex.push(regexStart+srchInput[i]+regexEnd);
			}
			return "^"+testRegex.join("")+".*$";
		}
	};
	
	var updateSearchLabels = function() {
		var srchInput = getKeywords();
		if ((srchInput.length === 0)) {
			$('#q-show-matching-quests').addClass("hidden");
			$('#q-show-all-quests').removeClass("hidden");
		} else {
			$('#q-show-matching-quests').removeClass("hidden");
			$('#q-show-all-quests').addClass("hidden");
		}
		
	};
	
	
	
	
	return {
		disableTextArea : disableTextArea,
		closeConfigSection : closeConfigSection,
		updateSearchLabels : updateSearchLabels,
		delay : delay,
		getKeywords : getKeywords,
		getQuestionCount : getQuestionCount,
		getIsAlreadyOnSurvey : getIsAlreadyOnSurvey,
		addQuestionToSurvey	: addQuestionToSurvey,
		removeQuestionFromSurvey : removeQuestionFromSurvey,
		openModal : openModal,
		editQuestion : editQuestion,
		//showEditWarning : showEditWarning,
		setEscalationEmail : setEscalationEmail,
		addNewEscalationEmail : addNewEscalationEmail,
		getIsNewEscEmail : getIsNewEscEmail,
		globalVariables : globalVariables
	}
})();

$(document).ready(function() {

	var submitIcon = $('.searchbox-icon');
    var inputBox = $('.searchbox-input');
    var searchBox = $('.searchbox');
    var isOpen = false;
			$("#modSearchNewEscEmail").on('click', function() {
                if(isOpen == false){
                    searchBox.addClass('searchbox-open');
                    inputBox.focus();
                    isOpen = true;
                } else {
                    searchBox.removeClass('searchbox-open');
                    inputBox.focusout();
                    isOpen = false;
                }
            });  
            submitIcon.mouseup(function(){
                    return false;
                });
            searchBox.mouseup(function(){
                    return false;
                });
            $(document).mouseup(function(){
                    if(isOpen == true){
                        $('.searchbox-icon').css('display','block');
                        submitIcon.click();
                    }
            });
	
	
	//Escalation
	var addTemplate = function(tempId, data, trigger) {
			$.get(tempId, function(template) {
				var renderSect = Mustache.render(template, data);
				displayTemplate(renderSect, data.isNew, trigger);
			});
		};
		var removeTemplate = function(trigger) {
			$(trigger).parents(".q-single").addClass("hidden");
		};
		
		var displayTemplate = function(elem, param, trigger) {
			if (param === undefined) {
				$(elem).prependTo("#mList");
			} else {
				$(trigger).parents(".q-single")
						  .addClass("hidden")
						  .html(elem)
						  .removeClass("hidden");
			}
		};
		var generateRandomId = function() {
			return Math.ceil(Math.random(1, 20)*100);
		};
		
		$(".q-add-to-escalation").on('click', function() {
			var randomId = generateRandomId();
			var data = {
				escNameId: "escName_"+randomId,
				escEmailId: "escEmail_"+randomId
			};
			addTemplate("templates/tpl-esc-email-new.html", data);
		});

		$("#mList").on('click', ".q-edit", function() {
			var randomId = generateRandomId();
			var data = {
				escName : $(this).parent().siblings(".esc-name").text().trim() || $(this).parent().siblings(".esc-name").find("input").val(),
				escEmail : $(this).parent().siblings(".esc-email").text().trim() || $(this).parent().siblings(".esc-email").find("input").val(),
				isNew : false,
				escNameId: "escName_"+randomId,
				escEmailId: "escEmail_"+randomId
			};
			var btnGroup = $(this).parent();
			addTemplate("templates/tpl-esc-email-existing.html", data, this);
			var saveTemplate = '<a href="#/" class="q-save icon-button pure-button-primary" title="Save" data-toggle="tooltip" data-placement="top"><i class="icon-check"></i></a>';
			$(btnGroup).prepend(saveTemplate);
			$(this).hide();
		});
		
		$("#mList").on('click', ".q-remove", function() {
			removeTemplate(this);
			toastr.success("Removing escalation email");
		});
		
		$("#mList").tooltip({
			selector: '[data-toggle="tooltip"]'
		});
		
		$("#mList").on('click', '.q-save', function() {
			var inputArr = $(this).parents(".q-single").find("input");
			inputArr.each(function() {
				$(this).rules("add", {
					required: true
				});
			});
			if ($("#editEscEmails").valid()) {
				inputArr.each(function() {
					$(this).parent().prepend("<span>"+$(this).val()+"</span>");
					$(this).hide();
				})
				toastr.success("Saving escalation email");
				var btnGroup = $(this).parent();
				var editTemplate = '<a href="#/" class="q-edit icon-button" title="Edit" data-toggle="tooltip" data-placement="top"><i class="icon-pencil"></i></a>';
				$(btnGroup).prepend(editTemplate);
				$(this).hide();
				btnGroup.find(".q-remove").hide();
			}
		});
		
		$("#editEscEmails").validate({
			errorElement: "small",
			errorPlacement: function(error, element) {
				error.insertAfter(element);
			},
			highlight: function(element) {
				$(element).closest(".pure-control-group").addClass("error");
			},
			unhighlight: function(element) {
				$(element).closest(".pure-control-group").removeClass("error");
			},
			submitHandler: function(form, event) {
				event.preventDefault();
				$("input[name*='escName_'], input[name*='escEmail_']").hide();
				var newName = $("input[name*='escName_']");
				var newEmail = $("input[name*='escEmail_']");
				
				newName.parents(".esc-name").prepend(newName.val());
				newEmail.parents(".esc-email").prepend(newEmail.val());
				newName.parents(".q-single").find(".icon-trash").removeClass("icon-trash").addClass("icon-pencil");
			}
		});
		
	/*	
		$("#modSearchNewEscEmail").click(function(e){
		  e.preventDefault();
		  $("#searchHidden").slideToggle();
		  $("#modSearchNewEscEmail").hide();
		});
	*/
	
		toastr.options = {
	//	  "target": "#qlist",
		  "positionClass": "toast-top-right",
		  "showDuration": "300",
		  "hideDuration": "1000",
		  "timeOut": "2000",
		};
	
	//Tutorial
	if (! localStorage.justOnce) {
			localStorage.setItem("justOnce", "true");
			$('#joyRideTipContent').joyride({
			  autoStart : false,
			  modal:true,
			  expose: true
			});
		}
		$( "#btnHelp" ).click(function() {
		  $('#joyRideTipContent').joyride({
			  autoStart : true,
			  modal:true,
			  expose: true
			});
		});
		
	var appCore = appCore || {};
	appCore = app;
	var qCount = appCore.getQuestionCount();
	var qListToTrack = [];

	var getActiveQuestions = function() {
		var activeqList = $(".q-single");
		$.each(activeqList, function(i, obj) {
			qListToTrack.push(obj.id);
			var elem = $(".q-add-to-survey[data-question-id="+obj.id+"]")[0];
			if (elem !== undefined) {
				elem.setAttribute("data-is-added", "1");
				$(elem).text("Already Added").addClass("disabled");
			}
			
		});
		console.log(qListToTrack);
		
	}
	/*
	
	 $('#q-slimScroll').slimScroll({
		height: '400px',
		color: '#8A8A8A',
		size: '15px',
		railBorderRadius: '1px',
		borderRadius: '0',
		useFixedHeight: true,
		fixedHeight: '200',
		distance: '0px',
		disableFadeOut : true,
		alwaysVisible: true,
		railOpacity: 1,
		railVisible: true,
        railColor: '#D6D6D6'
	 });
	 
	 */
	$('.chart').easyPieChart({
		easing: 'easeOutBounce',
		barColor: '#455a64',
		trackColor: '#c68b44',
		scaleColor: '#eee',
		lineCap: 'square',
		lineWidth: '8',
		size: '160',
		onStep: function (from, to, percent) {
			$(this.el).find('.percent').text(Math.round(percent));			    
		}
	});
	var chart = window.chart = $('.chart').data('easyPieChart');
	$('.js_update').on('click', function() {
		chart.update(Math.random()*200-100);
	});

	
	// Setting css class to show/hide spinner on ajaxing
	$(document).ajaxStart(function() {
		$("#q-dimmer").removeClass("hidden");
	});
	$(document).ajaxComplete(function() {
		$("#q-dimmer").addClass("hidden");
	});
	
	toastr.options = {
//	  "target": "#qlist",
	  "positionClass": "toast-top-right",
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "2000",
	}
	
	// Setting sortable handlers
	Sortable.create(qlist, {
		handle: '.q-handler',
		animation: 150,
		ghostClass: 'ghost',
		onUpdate: function (evt){
			setNumbering();
			toastr.success("Saving question order");
		}
	});
	// Seeting tooltips
	
	var setToolTip = function() {
		$('#qlist').tooltip({
			selector: '[data-toggle="tooltip"]',
			trigger: 'hover',
			delay: { 
				"show": 500
			}
		});
	};
	/*
	var setDatepicker = function() {
		$('.datepicker').datepicker({
			autoclose: true,
			todayHighlight: true,
			format: 'mm/dd/yyyy'
		});
	};
	*/
	var setNumbering = function() {
		$("#qlist .q-number").each(function(i) {
			$(this).text(i+1);
		})
	};
	
	var setEventAddToSurvey = function() {
			$(".q-add-to-survey").on('click', function() {
				var isAlreadyOnSurvey = appCore.getIsAlreadyOnSurvey(this);
				var objId = $(this).data("questionId");
				if (!isAlreadyOnSurvey) {
					appCore.addQuestionToSurvey(this);
					$("#"+objId+" textarea").focus();
					qListToTrack.push($(this).data("questionId"));
					console.log(qListToTrack);
					setToolTip();
					setNumbering();
					//setDatepicker();
					qCount++;
					$("#qCounter").text(qCount);
					if (qCount === 0) {
						$("#editWarning").addClass("hidden");
						$("#info").removeClass("hidden");
					} else {
						$("#info").addClass("hidden");
					}
				}
			})
	};	
	
	
	setToolTip();
	//setDatepicker();
	setNumbering();
	// Getting all questions from the question bank
	$.ajax({
		url: 'js/questionList.json?v0.1',
		data: {
			format: 'json'
		},
		error: function() {
			$('#info').html('<p>An error has occurred</p>');
		},
		dataType: 'json',
		success: function(data) {
			
			// This implements List.js
			var options = {
					valueNames: [ 
						'questionText',
						{ attr: 'data-exp-answer', name: 'questionExpAnswer' },
						{ attr: 'data-question-id', name: 'questionId' },
						{ attr: 'data-question-text', name: 'questionCopyText' }
						
					],
					item: '<li><span class="questionText"></span><br/><a href="#" class="pure-button pure-button-primary button-small q-add-to-survey questionId questionExpAnswer questionCopyText" data-is-added>Add to Survey</a></li>',
					page: 100,
					plugins: [ 
						ListFuzzySearch()
						//, ListPagination()  
					] 
				},
				values = data,
				//noItems = $('<li style="text-align:center; font-size: 14px;"><i class="icon-question-circle" style="font-size: 100px; color:#5F7A86"></i><br><br><strong>Bummer!</strong><br>The question you are looking for does not exist.<br><a href="#/" class="q-blank pure-button pure-button-primary" data-question-id="quest-new" data-question-text="" data-question-exp-answer="">Add New Question to the Bank</a></li>'),
				hackerList = new List('q-search-results', options, values);
				hackerList.on('updated', function(list) {
					if (list.searched && list.matchingItems.length == 0) {
						//$(list.list).append(noItems);
						$("#q-slimScroll").css("background-color","#F1F1F1");
						$("#q-show-matching-quests").addClass("hidden");
						$("#q-show-all-quests").addClass("hidden");
					} else if (list.searched && list.matchingItems.length != 0) {
						//noItems.detach();
						$("#q-slimScroll").css("background-color","#ffffff");
						$("#q-show-matching-quests").removeClass("hidden");
						$("#q-show-all-quests").addClass("hidden");
					} else if (list.searched != true) {
						//noItems.detach();
						$("#q-slimScroll").css("background-color","#ffffff");
						$("#q-show-matching-quests").addClass("hidden");
						$("#q-show-all-quests").removeClass("hidden");
					}
				});
				
			// ./This implements List.js
			
			
			
			
			/*
			var contentToAppend = "";
			var btnAddQuestToSurvey;
			$.each(data, function(i, obj){
				contentToAppend += 	'<li>'+obj.questionText+
										'<br/>'+
										'<a href="#/" class="pure-button pure-button-primary button-small q-add-to-survey" data-question-id="'+obj.questionId+'" data-exp-answer="'+obj.questionExpAnswer+'" data-question-text="'+obj.questionText+'" data-is-added="">Add to Survey</a>'+
									'</li>';
			});
			$(contentToAppend).hide().appendTo('#q-search-results ul').fadeIn(100);
			*/
			getActiveQuestions();
			setEventAddToSurvey();
			
			
			/*
			$('.search').keyup(function() {
				appCore.delay(function() {
					var keywords = appCore.getKeywords();
					var regex = new RegExp(keywords, 'ig');
					var results = [];
					var sorted = '';
					$.each(data, function(i, obj) { // index, obj
						  if (obj.questionText.search(regex) != -1) { // If regex matches elements
							results.push(obj);
						  } 
					});
					if (results.length !== 0) {
						$.each(results, function(i, obj) {
						  sorted += '<li>'+obj.questionText+
						  				'<br/>'+
						  				'<a href="#/" class="pure-button pure-button-primary button-small q-add-to-survey" data-question-id="'+obj.questionId+'" data-exp-answer="'+obj.questionExpAnswer+'" data-question-text="'+obj.questionText+'" data-is-added="">Add to Survey</a>'+
						  			'</li>';
						});
					} else {
						sorted += 	'<li>No results matching your search criteria</li>'+
									'<div style="padding-top: 25px; padding-bottom: 15px;">'+
										"Didn't find the question you wanted? <a href='#/' class='q-blank pure-button pure-button-primary' data-question-id='quest-new' data-question-text='' data-question-exp-answer=''>Add New Question</a>"+
									'</div>';
					}
					
					$('.results').hide().html(sorted).fadeIn(200);
					getActiveQuestions();
					setEventAddToSurvey();
					appCore.updateSearchLabels();
				}, 300);
			});
			*/
			
		},
		type: 'GET'
	});
	
	/*
	$(".q-blank").on('click', function() {
		appCore.addQuestionToSurvey(this);
		qListToTrack.push($(this).data("questionId"));
		console.log(qListToTrack);
		setToolTip();
		setNumbering();
		setDatepicker();
		qCount++;
		$("#qCounter").text(qCount);
		if (qCount === 0) {
			$("#editWarning").addClass("hidden");
			$("#info").removeClass("hidden");
		} else {
			$("#info").addClass("hidden");
		}
	});
	*/
	// Registering event for all q-remove buttons
	$("#qlist").on('click', appCore.globalVariables.btnRemoveClass, function() {
		appCore.openModal(appCore.globalVariables.mdlRemoveQuestion, this);
	});
	// Registering event for all q-edit buttons
	$("#qlist").on('click', appCore.globalVariables.btnEditClass, function() {
		appCore.editQuestion(this);
	});
	// Registering event for all escalation method selects
	$("#qlist").on('change', appCore.globalVariables.cboEscMethod, function() {
		appCore.setEscalationEmail(this);
	});
	// Registering event for all add new escalation email selects
	$("#qlist").on('change', appCore.globalVariables.cboEscEmail, function() {
		var isNewEscEmail = appCore.getIsNewEscEmail(this);
		if (isNewEscEmail) {
			appCore.openModal(appCore.globalVariables.mdlAddEscEmail, this);
		}	
	});
	$(".q-bank").on('click', '.q-blank', function() {
		appCore.openModal(appCore.globalVariables.mdlAddNewQuestion, this);
	});
	
	// Registering event for the remove button in remove modal
	$("#modBtnRemoveQuest").on('click', function() {
		appCore.removeQuestionFromSurvey(this);
		qListToTrack.splice($.inArray($(this).data("questionId"), qListToTrack), 1);
		console.log(qListToTrack);
		qCount--;
		setNumbering();
		$("#qCounter").text(qCount);
		if (qCount === 0) {
			$("#editWarning").addClass("hidden");
			$("#info").removeClass("hidden");
		} else {
			$("#info").addClass("hidden");
		}
	});
	// Initialize validators
	$("#surveyConfig").validate({
		errorElement: "small",
        errorPlacement: function(error, element) {
            if (element.hasClass("input-group-control")) {
                error.insertAfter($(element).closest(".input-group"));
            } else if (element.hasClass("input-radio")) {
				//element.after(error).after('<br/>');
            	error.appendTo($(element).closest(".pure-control-group"));
            } else {
            	error.insertAfter(element);
            }
        },
		highlight: function(element) {
			$(element).closest(".pure-control-group").addClass("error")
		},
		unhighlight: function(element) {
			$(element).closest(".pure-control-group").removeClass("error")
		},
		submitHandler: function(form, e) {
			appCore.closeConfigSection(".editing .q-config");
			appCore.disableTextArea(".editing textarea");
			toastr.success("Saving question changes");
			e.preventDefault();
		}
	});
	$("#addEscalationEmail").validate({
		rules: {
			escEmailName: {
				required: true
			},
			escEmail: {
				required: true,
				email: true
			}
		},
		errorElement: "small",
        errorPlacement: function(error, element) {
            if (element.hasClass("input-group-control")) {
                error.insertAfter($(element).closest(".input-group"));
            } else if (element.hasClass("input-radio")) {
				//element.after(error).after('<br/>');
            	error.appendTo($(element).closest(".pure-control-group"));
            } else {
            	error.insertAfter(element);
            }
        },
		highlight: function(element) {
			$(element).closest(".pure-control-group").addClass("error")
		},
		unhighlight: function(element) {
			$(element).closest(".pure-control-group").removeClass("error")
		},
		submitHandler: function(form, e) {
			appCore.closeConfigSection(".editing .q-config");
			appCore.disableTextArea(".editing textarea");
			toastr.success("Saving question changes");
			e.preventDefault();
		}
	});
	$("#addNewQuestion").validate({
		rules: {
			"qText_quest-new": {
				required: true
			},
			"expectedAns_quest-new": {
				required: true
			}
		},
		errorElement: "small",
        errorPlacement: function(error, element) {
            if (element.hasClass("input-group-control")) {
                error.insertAfter($(element).closest(".input-group"));
            } else if (element.hasClass("input-radio")) {
				//element.after(error).after('<br/>');
            	error.appendTo($(element).closest(".pure-control-group"));
            } else {
            	error.insertAfter(element);
            }
        },
		highlight: function(element) {
			$(element).closest(".pure-control-group").addClass("error")
		},
		unhighlight: function(element) {
			$(element).closest(".pure-control-group").removeClass("error")
		},
		submitHandler: function(form, e) {
			appCore.closeConfigSection(".editing .q-config");
			appCore.disableTextArea(".editing textarea");
			toastr.success("Saving question changes");
			e.preventDefault();
		}
	});
	
	// Registering event for the save all changes
	$("#surveyConfig").on('click','.q-save', function(e) {
		var qId = $(this).data("questionId");
		var editTemplate = 	'<a href="#/" class="q-edit icon-button" title="Edit" data-question-id="'+qId+'" data-toggle="tooltip" data-placement="top" aria-label="Edit">'+
								'<i class="icon-pencil"></i>'+
							'</a>';
		
		
		$(".required-field").not($("#"+qId)).each(function() {
			$(this).rules("remove");
		});
		$("#"+qId+" .required-field").each(function() {
			$(this).rules("add", {
				required: true
			});
		});

		var isSurveyValid = $("#surveyConfig").valid();
		if (isSurveyValid) {
			appCore.closeConfigSection("#"+qId+" .q-config");
			appCore.disableTextArea("#"+qId+" textarea");
			$("#"+qId+" .q-save").tooltip('hide');
			$("#"+qId+" .q-save").remove();
			$("#"+qId+" .q-buttons").prepend(editTemplate); 
			toastr.success("Saving question changes");
			$("#"+qId).removeClass("editing");
			/*
			appCore.openModal(appCore.globalVariables.mdlSaveSurveyConfig, this);
			*/
		}
	});
	// Registering event for the cancel all changes
	$("#surveyConfig").on('click','#q-cancelConfig', function() {
		appCore.openModal(appCore.globalVariables.mdlCancelSurveyConfig, this);
	});
	// Registering event for the save new escalation email
	$("#modBtnAddEscEmail").on('click', function() {
		var isSurveyValid = $("#addEscalationEmail").valid();
		if (isSurveyValid) {
			appCore.addNewEscalationEmail(this);
			$("#modAddNewEscEmail").modal('hide');
			$('#modAddNewEscEmail').on('hidden.bs.modal', function () {
				$(this).find('form').trigger('reset');
			})
		}
	});
	$("#modBtnCancelAddEscEmail").on('click', function() {
		var qId = this.dataset.questionId;
		$("#escEmail_"+qId).val("");
		$('#modAddNewEscEmail').on('hidden.bs.modal', function () {
			$(this).find('form').trigger('reset');
		})
	})
	
	$("#mdlBtnSaveSurveyConfig").on('click', function() {
		$("#mdlSaveSurveyConfig").modal("hide");
		$(appCore.globalVariables.formQuestConfig).submit();
	});

	$("body").tooltip({
		selector: '[data-toggle="tooltip-txtArea"]',
		trigger: 'focus',
		html: true,
		template: '<div class="tooltip warning" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		title: "<i class='icon-exclamation-circle'></i> Ammend typos and punctuation errors only.<br/>Do not change the meaning of the question."
	});

	$("#qlist").on('focus', '.input-group.date', function() {
		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			format: "mm/dd/yyyy"
		});
	});

	$("#qlist").on('click', '.input-group-addon', function() {
		$(this).prev().trigger("focus");
	});

	$("#modBtnAddNewQuestion").on('click', function() {
		var newQuestNumber = Math.floor(Math.random() * (100- 40) + 40);
		
		if ($("#addNewQuestion").valid()) {
			$(this)[0].setAttribute("data-question-id", newQuestNumber);
			$(this)[0].setAttribute("data-question-text", $(this).parents("form").find("textarea").val());
			if ($("#addToSurveyFlag").is(":checked")) {
				appCore.addQuestionToSurvey(this);
				qListToTrack.push($(this).data("questionId"));
				console.log(qListToTrack);
				setToolTip();
				setNumbering();
				//setDatepicker();
				qCount++;
				$("#qCounter").text(qCount);
				if (qCount === 0) {
					//$("#editWarning").addClass("hidden");
					$("#info").removeClass("hidden");
				} else {
					$("#info").addClass("hidden");
				}
				$(this).text("Add").removeClass("disabled");
			}
			$("#modAddNewQuestion").modal('hide');
			$(this).find('form').trigger('reset');
		}
	});
	
	$("#qCounter").text(qCount);

});


