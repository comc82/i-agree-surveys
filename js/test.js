var appTest = (function() {
	"use strict";
		var qListToTrack = [],
			counter;
			
		var _resolveData = function(template, obj) {
			var data;
			if (!obj.isNew) {
				data = _getTemplateData(obj.trigger);
			} else {
				data = {
					questionId: obj.Id,
					questionText: $("#qText_quest-new").val()
				}
			}
			var renderSect = Mustache.render(template, data);
			_appendTemplate(renderSect, obj.stickTo, obj.isFadeIn);
			_setNumbering();
		};

		var _getTemplate = function(obj) {
			$.ajax({
				url: obj.templateUrl,
				success: function(template) {
					_resolveData(template, obj);
				}
			})
		};
		
		var _getIsAlreadyOnSurvey = function(objId) {
			var elem = $("#"+objId);
			return elem.length > 0 ? true : false;
		};

		var _getTemplateData = function(obj) {
			var objData = $(obj).parent("li");
			return {
				questionId : $(objData).prop("id").split("_")[1],
				questionText : $(objData).children("span").text(),
				expAnswerYes : function() {
					return $(objData).data("expAnswer") === "Yes";
				},
				expAnswerNo : function() {
					return $(objData).data("expAnswer") === "No";
				}
			};
		};

		var addToSurvey = function(obj) {
			var isAlreadyOnSurvey = _getIsAlreadyOnSurvey(obj.Id);
			if(!isAlreadyOnSurvey) {
				_getTemplate(obj);
				
				if (!obj.isNew) {
					_disableAddButton(obj.trigger);
				}
				_showAlertMessage("#editWarning");
				counter++;
				_updateQuestionCounter(counter);
				
			}
		};
			
		var _disableAddButton = function(trigger) {
			var elem = $(trigger).parent("li")[0];
			elem.setAttribute("data-is-added", "1");
			$(trigger).text("Added").addClass("disabled");
		};
		
		var _enableAddButton = function(trigger) {
			var elem = $(trigger).data("question-id");
			elem = $("#q-bank_"+elem)[0];
			$(elem).find("a").text("Add to Survey").removeClass("disabled");
			elem.setAttribute("data-is-added", "");
		};
		
		var _showAlertMessage = function(messId) {
			$(messId).removeClass("hidden");
		};
		
		var _hideAlertMessage = function(messId) {
			$(messId).addClass("hidden");
		};

		var _appendTemplate = function(renderSect, stickTo, isFadeIn) {
			if (isFadeIn) {
				$(renderSect).hide().prependTo(stickTo).fadeIn();
			} else {
				$(renderSect).prependTo(stickTo);
			}
		};
		var _getActiveQuestions = function(className) {
			return $(className);
		};
		
		var _disableActiveQuestion = function(callback, className) {
			var activeqList = callback(className);
			$.each(activeqList, function(i, obj) {
				qListToTrack.push(obj.id);
				var elem = $("#q-bank_"+obj.id+"")[0];
				if (elem !== undefined) {
					elem.setAttribute("data-is-added", "1");
					$("#"+elem.id+" a").text("Added").addClass("disabled");
				}
			});
		};
		


		var _showQuestionBankSuccess = function(data) {
			var contentToAppend = "";
			$.each(data, function(i, obj){
				contentToAppend += '<li id="q-bank_'+obj.questionId+'" data-exp-answer="'+obj.questionExpAnswer+'" data-is-added="">'+
								       '<span>'+obj.questionText+'</span>'+
								       '<br/>'+
									   '<a href="#/" class="pure-button pure-button-primary button-small q-add-to-survey">Add to Survey</a>'+
								   '</li>';
			});
			_appendTemplate(contentToAppend, '#q-search-results ul', {isFadeIn: true, val: 100});
			_disableActiveQuestion(_getActiveQuestions, ".q-single");
			
		};
		
		var _showQuestionBankError = function() {
			$('#info').html('<p>An error has occurred</p>');
		};

		var getQuestionBank = function(obj) {
			$.ajax({
				url: obj.url,
				data: {
					format: obj.format
				},
				dataType: obj.dataType,
				error: _showQuestionBankError,
				success: _showQuestionBankSuccess,
				type: 'GET'
			});
		};
		
		var _setToolTip = function() {
			$('#qlist').tooltip({
				selector: '[data-toggle="tooltip"]',
				trigger: 'hover',
				delay: { 
					"show": 500
				}
			});
		};
		
		var _setDatepicker = function() {
			$('#qlist').on('focusin', '.datepicker', function() {
				$(this).datepicker({
					autoclose: true
				}).on('changeDate', function(ev) {
					if($(this).valid()){
						$(this).removeClass('error');   
					}
				});
			});
		};
		
		var _setSlimScroll = function() {
			$('#q-search-results').slimScroll({
				height: '400px',
				color: '#8A8A8A',
				size: '10px',
				railBorderRadius: '0px',
				borderRadius: '0px',
				useFixedHeight: true,
				fixedHeight: '200',
				distance: '0',
				disableFadeOut : true
			});
		};

		var _setToastr = function() {
			toastr.options = {
				"positionClass": "toast-top-right",
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "2000"
			};
		};
		
		var _setSortable = function() {
			Sortable.create(qlist, {
				handle: '.q-handler',
				animation: 150,
				ghostClass: 'ghost',
				onUpdate: function (evt){
					_setNumbering();
				}
			});
		};
		
		var _setNumbering = function() {
			$("#qlist .q-number").each(function(i) {
				$(this).text(i+1);
			});
		};
		var openModal = function(modalId) {
			$(modalId).modal({
				backdrop: 'static',
				keyboard: false
			});
		};
		
		var closeModal = function(modalId) {
			$(modalId).modal('hide');
		};
		
		var removeFromSurvey = function(obj) {
			openModal(obj.modalId);
			var objId = $(obj.trigger).data("question-id");
			$("#modBtnRemoveQuest").off('click').on('click', function(){
				$("#"+objId).remove();
				_enableAddButton(obj.trigger);
				_setNumbering();
				counter--;
				closeModal(obj.modalId);
				_updateQuestionCounter(counter);
			});
		};
		
		var editQuestion = function(obj) {
			var objId = $(obj.trigger).data("question-id");
			var isEditing = _getIsEditing(objId);
			if (!isEditing) {
				_enableTextArea(objId);
				_openConfigSection(objId);
				_showAlertMessage("#editWarning");
			}
		};
		var _enableTextArea = function(id) {
			var qText = $("#"+id).find(".q-text");
			var qTextContent = qText.find("span");
			var qTextArea = document.createElement("textarea");
			qTextArea = $("<textarea>", {
				rows: "3",
				class: "pure-u-1 pure-u-md-24-24 required",
				id: "qText_"+id,
				text: qTextContent.text(),
				name : "qText_"+id
			});
			qTextContent.addClass("hidden");
			$(qTextArea).appendTo(qText);
		};
		
		var _openConfigSection = function(id) {
			var elem = $("#"+id);
			var sectConfig = elem.find(".q-config");
			sectConfig.removeClass("hidden");
			elem.addClass("editing");
		};
		
		var _closeConfigSection = function(selector, callback) {
			$(selector).addClass("hidden");
			callback("#quest-new .q-new-style");
		};
	
		var _getIsEditing = function(objId) {
			if ($("#"+objId).hasClass("editing")) {
				return true;
			}
			return false;
		};
		
		var _updateQuestionCounter = function(counter) {
			$("#qCounter").text(counter);
			if (!(counter > 0)) {
				_hideAlertMessage("#editWarning");
				_showAlertMessage("#info");
			} else {
				_hideAlertMessage("#info");
			}
		};

		var _setFormValidator = function() {
			$.validator.setDefaults({
				focusInvalid: false,
				debug: true,
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
				}
			});
			/*
			$.validator.addClassRules("date", {
				required: true,
				minlength: 9
			});
			*/
		};
		
		var showEscalationEmail = function(obj) {
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
		
		var _getIsNewEscEmail = function(obj) {
			if (obj.value === "new-esc-email") {
				return true;
			}
			return false;
		};

		var copyNewEscalationEmail = function(obj) {
			var objId = obj.dataset.questionId;
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

		var addNewEscalationEmail = function(obj) {
			var qId = obj.id.split("_")[1];
			if(_getIsNewEscEmail(obj)) {
				//$("#addEscalationEmail").validate().resetForm();
				$("#addEscalationEmail")[0].reset();
				$("#modBtnAddEscEmail")[0].setAttribute("data-question-id", qId);
				$("#modBtnCancelAddEscEmail")[0].setAttribute("data-question-id", qId);
				openModal("#modAddNewEscEmail");
			}
		};

		var init = function() {
			_updateQuestionCounter(counter);
			_setSlimScroll();
			_setToolTip();
			_setDatepicker();
			_setToastr();
			_setSortable();
			_setNumbering();
			_setFormValidator();
		};
		
		counter = _getActiveQuestions(".q-single").length;
		
		return {
			// Core functions
			init : init,
			getQuestionBank : getQuestionBank,
			addToSurvey : addToSurvey,
			removeFromSurvey : removeFromSurvey,
			editQuestion : editQuestion,
			openModal : openModal,
			showEscalationEmail : showEscalationEmail,
			addNewEscalationEmail: addNewEscalationEmail,
			copyNewEscalationEmail : copyNewEscalationEmail
		};
	})();



	
	
	$(document).ready(function() {
		$(document).ajaxStart(function() {
			$("#q-dimmer").removeClass("hidden");
		});
		$(document).ajaxComplete(function() {
			$("#q-dimmer").addClass("hidden");
		});
		appTest.init();
		
		$("#addNewQuestion").validate();
		$("#surveyConfig").validate({
			submitHandler: function(form, event) {
				event.preventDefault();
				appTest.openModal("#mdlSaveSurveyConfig");
				$("#mdlBtnSaveSurveyConfig").on('click', function() {
					form.submit();
				})
			}
		});
		$("#addEscalationEmail").validate({
			submitHandler: function(form, event) {
				//event.preventDefault();
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
			}
		});
		
		appTest.getQuestionBank({
			url : 'js/questionList.json?v0.1',
			format: 'json',
			dataType: 'json'
		});
		$("#q-search-results").on('click', ".q-add-to-survey", function() {
			appTest.addToSurvey({
				templateUrl : "templates/tpl-quest-existing.html",
				stickTo : "#qlist",
				isFadeIn : false,
				Id: $(this).parent("li").prop("id").split("_")[1],
				trigger: this,
				isNew: false
			});
		});
		$("#qlist").on('click', '.q-remove', function() {
			appTest.removeFromSurvey({
				modalId : "#modRemoveQuest",
				trigger: this
			});
		});
		$("#qlist").on('click', '.q-edit', function() {
			appTest.editQuestion({
				trigger: this
			});
		});
		$("#qlist").on('change','.escMethod', function() {
			appTest.showEscalationEmail(this);
		});
		$("#qlist").on('change','.escEmail', function() {
			appTest.addNewEscalationEmail(this);
		});
		$(".q-blank").on('click', function() {
			$("#addNewQuestion")[0].reset();
			appTest.openModal("#modAddNewQuestion");
		})
		$("#modBtnAddEscEmail").on('click', function() {
			if ($("#addEscalationEmail").valid()) {
			
				appTest.copyNewEscalationEmail(this);
				$("#modAddNewEscEmail").modal("hide");
			}
		});
		$("#modBtnCancelAddEscEmail").on('click', function() {
			var id = $(this).data("question-id");
			$("#addNewQuestion")[0].reset();
			
			$("#escEmail_"+id+"").val("");
		});
		$("#modBtnAddNewQuestion").on('click', function() {
			if ($("#addNewQuestion").valid()) {
				if ($("#addToSurveyFlag").is(":checked")) {
					appTest.addToSurvey({
						templateUrl : "templates/tpl-quest-new.html",
						stickTo : "#qlist",
						isFadeIn : false,
						Id: function() {
							return "quest-"+Math.floor(Math.random() * (90 - 30 + 1)) + 30;
						}(),
						trigger: this,
						isNew: true
					});
				}
				$("#modAddNewQuestion").modal("hide");
			}
		})
		
		
	});