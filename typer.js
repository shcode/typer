var Word = Backbone.Model.extend({
	move: function() {
		this.set({y:this.get('y') + (this.get('speed')/5)});
	}
});

var Words = Backbone.Collection.extend({
	model:Word
});

var WordView = Backbone.View.extend({
	initialize: function() {
		$(this.el).css({position:'absolute'});
		var string = this.model.get('string');
		var letter_width = 25;
		var word_width = string.length * letter_width;
		if(this.model.get('x') + word_width > $(window).width()) {
			this.model.set({x:$(window).width() - word_width});
		}
		for(var i = 0;i < string.length;i++) {
			$(this.el)
				.append($('<div>')
					.css({
						width:letter_width + 'px',
						padding:'5px 2px',
						'border-radius':'4px',
						'background-color':'#fff',
						border:'1px solid #ccc',
						'text-align':'center',
						float:'left'
					})
					.text(string.charAt(i).toUpperCase()));
		}
		
		this.listenTo(this.model, 'remove', this.remove);
		
		this.render();
	},
	
	render:function() {
		$(this.el).css({
			top:this.model.get('y') + 'px',
			left:this.model.get('x') + 'px'
		});
		var highlight = this.model.get('highlight');
		$(this.el).find('div').each(function(index,element) {
			if(index < highlight) {
				$(element).css({'font-weight':'bolder','background-color':'#aaa',color:'#fff'});
			} else {
				$(element).css({'font-weight':'normal','background-color':'#fff',color:'#000'});
			}
		});
	}
});

var TyperView = Backbone.View.extend({
	initialize: function() {
		var wrapper = $('<div>')
			.css({
				position:'fixed',
				top:'0',
				left:'0',
				width:'100%',
				height:'100%'
			});
		this.wrapper = wrapper;
		
		var self = this;
		var text_input = $('<input>')
			.addClass('form-control')
			.css({
				'border-radius':'4px',
				position:'absolute',
				bottom:'0',
				'min-width':'80%',
				width:'80%',
				'margin-bottom':'10px',
				'z-index':'1000'
			}).keyup(function() {
				var words = self.model.get('words');
				var to_be_deducted = false;
				var cancel_deduction = false;
				for(var i = 0;i < words.length;i++) {
					var word = words.at(i);
					var typed_string = $(this).val();
					var string = word.get('string');
					if(string.toLowerCase().indexOf(typed_string.toLowerCase()) == 0) {
						word.set({highlight:typed_string.length});
						if(typed_string.length == string.length) {
							self.model.defaults.score += string.length;
							$(this).val('');
						}
						cancel_deduction = true;
					} else {
						if (word.get('highlight') !== 0 || word.get('highlight') !== undefined) {
							to_be_deducted = true;
						}
						word.set({highlight:0});
					}
				}

				if (!cancel_deduction && to_be_deducted) {
					self.model.defaults.score -= 1;
				}
			});
		
		text_input.attr('disabled', 'disabled');
		
		var button_wrapper = $('<div>')
			.css({
				position: 'absolute',
				bottom: 0,
				'margin-bottom': '10px',
				'margin-left': '10px',
			});

		var start_button = $('<button>')
			.addClass('start-button')
			.on('click', function(){
				if ($(this).text() == "Start") {
					self.model.start();
					self.model.defaults.score = 0;
					pause_button.removeAttr('disabled');
					text_input.removeAttr('disabled').focus();
					$(this).removeClass('btn-success');
					$(this).addClass('btn-danger');
					$(this).text('Stop');
				} else {
					self.model.stop();
					pause_button.attr('disabled', 'disabled');
					text_input.attr('disabled', 'disabled');
					$(this).removeClass('btn-danger');
					$(this).addClass('btn-success');
					$(this).text('Start');
				}
			});

		start_button.addClass('btn btn-success')
			.text('Start');

		var pause_button = $('<button>')
			.addClass('pause-button')
			.css({
				'margin-left': '10px'
			})
			.on('click', function(){
				if ($(this).text() == "Pause") {
					self.model.pause();
					start_button.attr('disabled', 'disabled');
					text_input.attr('disabled', 'disabled');
					$(this).removeClass('btn-warning');
					$(this).addClass('btn-primary');
					$(this).text('Resume');
				} else {
					self.model.start();
					start_button.removeAttr('disabled');
					text_input.removeAttr('disabled').focus();
					$(this).removeClass('btn-primary');
					$(this).addClass('btn-warning');
					$(this).text('Pause');
				}
			});
		
		pause_button.addClass('btn btn-warning')
			.text('Pause')
			.attr('disabled', 'disabled');

		var score_label = $('<div id="score">')
			.css({
				position: 'absolute',
				bottom: 0,
				right: 0,
				'margin-bottom': '10px',
				'margin-right': '10px',
				border: '1px solid',
				'backgroud-color': 'white',
				'text-align': 'center',
				'width': '50px',
				'font-size': '24px'
			});

		$(this.el)
			.append(wrapper
				.append($('<form>')
					.attr({
						role:'form'
					})
					.submit(function() {
						return false;
					})
					.append(button_wrapper
						.append(start_button)
						.append(pause_button)						
					)
					.append(text_input)
					.append(score_label)));
		
		text_input.css({left:((wrapper.width() - text_input.width()) / 2) + 'px'});
		text_input.focus();

		score_label.text(self.model.defaults.score);
		
		this.listenTo(this.model, 'change', this.render);
	},
	
	render: function() {
		var model = this.model;
		var words = model.get('words');

		$('#score').text(model.defaults.score);
		
		for(var i = 0;i < words.length;i++) {
			var word = words.at(i);
			if(!word.get('view')) {
				var word_view_wrapper = $('<div>');
				this.wrapper.append(word_view_wrapper);
				word.set({
					view:new WordView({
						model: word,
						el: word_view_wrapper
					})
				});
			} else {
				word.get('view').render();
			}
		}
	},
});

var Typer = Backbone.Model.extend({
	defaults:{
		max_num_words:10,
		min_distance_between_words:50,
		words:new Words(),
		min_speed:1,
		max_speed:5,
		score: 0
	},
	
	initialize: function() {
		var interval;
		new TyperView({
			model: this,
			el: $(document.body)
		});
	},

	start: function() {
		var animation_delay = 10;
		var self = this;
		interval = setInterval(function() {
			self.iterate();
		},animation_delay);
	},

	stop: function() {
		this.pause();
		var words = this.get('words');

		while(first = words.first()) {
			first.destroy();
		}		
	},

	pause: function() {
		clearInterval(interval);
	},
	
	iterate: function() {
		var words = this.get('words');
		if(words.length < this.get('max_num_words')) {
			var top_most_word = undefined;
			for(var i = 0;i < words.length;i++) {
				var word = words.at(i);
				if(!top_most_word) {
					top_most_word = word;
				} else if(word.get('y') < top_most_word.get('y')) {
					top_most_word = word;
				}
			}
			
			if(!top_most_word || top_most_word.get('y') > this.get('min_distance_between_words')) {
				var random_company_name_index = this.random_number_from_interval(0,company_names.length - 1);
				var string = company_names[random_company_name_index];
				var filtered_string = '';
				for(var j = 0;j < string.length;j++) {
					if(/^[a-zA-Z()]+$/.test(string.charAt(j))) {
						filtered_string += string.charAt(j);
					}
				}
				
				var word = new Word({
					x:this.random_number_from_interval(0,$(window).width()),
					y:0,
					string:filtered_string,
					speed:this.random_number_from_interval(this.get('min_speed'),this.get('max_speed'))
				});
				words.add(word);
			}
		}
		
		var words_to_be_removed = [];
		for(var i = 0;i < words.length;i++) {
			var word = words.at(i);
			word.move();
			
			if(word.get('y') > $(window).height() || word.get('move_next_iteration')) {
				words_to_be_removed.push(word);
			}
			
			if(word.get('highlight') && word.get('string').length == word.get('highlight')) {
				word.set({move_next_iteration:true});
			}
		}
		
		for(var i = 0;i < words_to_be_removed.length;i++) {
			words.remove(words_to_be_removed[i]);
		}
		
		$(window).on('resize', function(){
			for(var i = 0;i < words.length;i++) {
				var word = words.at(i);
				var word_width = word.get('string').length * 25;
				if (word.get('x') + word_width > $(window).width()){
					word.set({x: $(window).width() - word_width});
				}
			}
		});

		this.trigger('change');
	},
	
	random_number_from_interval: function(min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
});