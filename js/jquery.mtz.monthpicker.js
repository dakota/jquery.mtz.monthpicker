/*
 * jQuery UI Monthpicker 2.0.0
 *
 * @licensed MIT <see below>
 * @licensed GPL <see below>
 *
 * @author Luciano Costa
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

/**
 * MIT License
 * Copyright (c) 2011, Luciano Costa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * GPL LIcense
 * Copyright (c) 2011, Luciano Costa
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the 
 * Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License 
 * for more details.
 * 
 * You should have received a copy of the GNU General Public License along 
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 (function ($) {

	$.widget('mtz.monthpicker', {
		options: {
			pattern: 'mm/yyyy',
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			selected: new Date(),
			maxDate: null,
			minDate: null,
			appendTo: 'body',
			allowEmpty: false,
			emptyText: 'All months and years',
			select: function() {},
			disabled: {}
		},
		_create: function() {
			this.widgetElementElement = null;
			
			this.refresh();
		},
		_setOption: function(key, value) {
			
			$.Widget.prototype._setOption.apply( this, arguments );	
		},
		_disableMonths: function() {
			var 
				selectedYear = this.widgetElement.find('.mtz-monthpicker-years').val(),
				minMonth = 1,
				maxMonth = 12,
				month = 1,
				disable = false;
			
			if(selectedYear == this._maxYear) {
				maxMonth = this.options.maxDate.getMonth()+1;
			}
			
			if(selectedYear == this._minYear) {
				minMonth = this.options.minDate.getMonth()+1;
			}
			
			this.widgetElement.find('.mtz-monthpicker-month').addClass('ui-state-disabled');
			for(month=minMonth;month<=maxMonth;month++) {
				if(typeof this.options.disabled[selectedYear] !== 'undefined') {
					if($.inArray(month, this.options.disabled[selectedYear]) >= 0) {
						disable = true;
					}
				}

				if(!disable) {
					this.widgetElement.find('.mtz-monthpicker-month-'+month).removeClass('ui-state-disabled');
				}

				disable = false;
			}
		},
		_highlightSelected: function() {
			var selected = this.element.data('mtz.selected');
			
			this.widgetElement
					.find('.mtz-monthpicker-month')
						.removeClass('ui-state-active');						

			if(this.widgetElement.find('.mtz-monthpicker-years').val() == selected.year) {
				this.widgetElement
					.find('.mtz-monthpicker-month-' + selected.month)
						.addClass('ui-state-active');
			}
		},
		hide: function() {
			this.widgetElement.hide('fast');
		},
		show: function() {
			var self = this;
			
			this.widgetElement.show().position({
				my: 'left top',
				at: 'left bottom',
				of: this.element
			}).hide().show('fast');
			
			$(document).mousedown(function (e){
				if(!e.target.className || e.target.className.indexOf('mtz-monthpicker') < 0){
					self.hide();
				}
			});

			var selected = this.element.data('mtz.selected');
			this.widgetElement.find('.mtz-monthpicker-years').val(selected.year);

			this._highlightSelected();
		},
		refresh: function() {
			var
				container = $('<div class="ui-datepicker mtz-monthpicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" />'),
				header = $('<div class="ui-datepicker-header mtz-monthpicker mtz-monthpicker-header ui-widget-header ui-helper-clearfix ui-corner-all mtz-monthpicker" />'),
				combo = $('<select class="mtz-monthpicker mtz-monthpicker-years" />'),
				table = $('<table class="mtz-monthpicker mtz-monthpicker-table" />'),
				tbody = $('<tbody class="mtz-monthpicker mtz-monthpicker-tbody" />'),
				tr = $('<tr class="mtz-monthpicker mtz-monthpicker-row" />'),
				td = '';
				year = this.options.selected.getFullYear(),
				month = this.options.selected.getMonth()+1,
				option = null,
				i = 0;

			this._minYear = (new Date()).getFullYear() - 10;
			this._maxYear = (new Date()).getFullYear() + 10;
			
			if(this.options.maxDate) {
				this._maxYear = parseInt(this.options.maxDate.getFullYear());
			}
			
			if(this.options.minDate) {
				this._minYear = parseInt(this.options.minDate.getFullYear());
			}

			container.css({
				position:'absolute',
				zIndex:999999,
				whiteSpace:'no-wrap',
				width:'250px',
				overflow:'hidden',
				textAlign:'center'
			});

			// mount years combo
			for (i = this._minYear; i <= this._maxYear; i++) {
				var option = $('<option class="mtz-monthpicker mtz-monthpicker-year" />').attr('value',i).append(i);
				if (year === i) {
					option.attr('selected', 'selected');
				}
				combo.append(option);
			}
			header
				.append('<a href="#" class="mtz-monthpicker ui-datepicker-prev mtz-monthpicker-year-prev ui-corner-all" title="Prev"><span class="mtz-monthpicker ui-icon ui-icon-circle-triangle-w">Prev</span></a>')
				.append('<a href="#" class="mtz-monthpicker ui-datepicker-next mtz-monthpicker-year-next ui-corner-all" title="Next"><span class="mtz-monthpicker ui-icon ui-icon-circle-triangle-e">Next</span></a>')
				.append(combo)
				.appendTo(container);

			// mount months table
			for(i=1; i<=12; i++){
				td = $('<td class="mtz-monthpicker ui-state-default mtz-monthpicker-month mtz-monthpicker-month-'+i+'" style="padding:5px;cursor:pointer;" />').attr('data-month',i)
				
				td.append(this.options.monthNames[i-1]);
				tr.append(td).appendTo(tbody);
				if (i % 3 === 0) {
					tr = $('<tr class="mtz-monthpicker mtz-monthpicker-month-row" />'); 
				}
			}
			
			table.append(tbody).appendTo(container);

			if(this.widgetElement) {
				this.widgetElement.remove();
			}
			
			this.widgetElement = container.appendTo(this.options.appendTo).hide();
			
			if(this.options.allowEmpty === true) {
				$('<div class="mtz-monthpicker ui-datepicker-buttonpane ui-widget-content">\n\
					<button type="button" class="mtz-monthpicker mtz-montpicker-empty ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">' + 
						this.options.emptyText + 
					'</button></div>')
					.appendTo(this.widgetElement);
			}
			
			this.element.data('mtz.selected', {
				year: this.options.selected.getFullYear(),
				month: this.options.selected.getMonth()+1
			})
			.addClass('mtz-monthpicker');
			
			this._disableMonths();
			this._highlightSelected();
			this._buttonStatus();
			this._events();
		},
		_buttonStatus: function() {
			var combo = this.widgetElement.find('.mtz-monthpicker-years');
			
			if(combo.val() == this._minYear) {
				this.widgetElement
					.find('.mtz-monthpicker-year-prev')
						.addClass('ui-state-disabled')
					.end()
					.find('.mtz-monthpicker-year-next')
						.removeClass('ui-state-disabled');
			}
			else if(combo.val() == this._maxYear) {
				this.widgetElement
					.find('.mtz-monthpicker-year-prev')
						.removeClass('ui-state-disabled')
					.end()
					.find('.mtz-monthpicker-year-next')
						.addClass('ui-state-disabled');
			}
			else {
				this.widgetElement
					.find('.mtz-monthpicker-year-prev')
						.removeClass('ui-state-disabled')
					.end()
					.find('.mtz-monthpicker-year-next')
						.removeClass('ui-state-disabled');
			}			
		},
		_events: function() {
			var self = this,
				widget = this.widgetElement,
				combo = widget.find('.mtz-monthpicker-years');
			
			combo
				.bind('change.mtz', function() {
					self._buttonStatus();
					self._disableMonths();
					self._highlightSelected();
				});
			
			widget
				.find('.mtz-monthpicker-month, .mtz-monthpicker-header a, .mtz-montpicker-empty')
					.bind('mouseenter.mtz', function() { $(this).addClass('ui-state-hover');})
					.bind('mouseleave.mtz', function() { $(this).removeClass('ui-state-hover');})
				.end()
				.find('.mtz-monthpicker-year-prev')
					.bind('click.mtz', function() {
						var value = parseInt(combo.val());
						if(value > self._minYear) {
							combo.val(value - 1).change();
						}
					})
				.end()
				.find('.mtz-monthpicker-year-next')
					.bind('click.mtz', function() {
						var value = parseInt(combo.val());
						if(value < self._maxYear) {
							combo.val(value + 1).change();
						}
					})
				.end()
				.find('.mtz-monthpicker-month')
					.bind('click.mtz', function() {
						var $this = $(this);
						if(!$this.hasClass('ui-state-disabled')) {
							self.setDate($this.data('month'), combo.val());
						}
						self.hide();
					})
				.end()
				.find('.mtz-montpicker-empty')
					.bind('click.mtz', function() {
						self.setDate(null, null);
						self.hide();
					});
					
			this.element
				.bind('click.mtz', function() {
					self.show();
				});				
		},
		setDate: function(month, year) {
			this.element.data('mtz.selected', {
				month: month,
				year: year
			});
			
			this._trigger('select', 0, {selected: this.element.data('mtz.selected'), element: this.element});
		},
		destroy: function() {
			this.widgetElement.unbind('mtz').remove();
			this.element.unbind('mtz').removeClass('mtz-monthpicker').removeData('mtz.selected');
			$(document).unbind('mtz');
			
			$.Widget.prototype.destroy.call( this );
		}
	});
 })(jQuery);