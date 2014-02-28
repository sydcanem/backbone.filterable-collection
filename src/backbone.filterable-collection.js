/**
 * Backbone FilterableCollection
 * Version 0.1.0
 *
 * https://github.com/sydcanem/Backbone.FilterableCollection
 */
(function (root, factory) {
	if (typeof exports === 'object' && typeof require === 'function') {
		module.exports = factory(require("underscore"), require("backbone"));
	} else if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["underscore","backbone"], function(_, Backbone) {
			// Use global variables if the locals are undefined.
			return factory(_ || root._, Backbone || root.Backbone);
		});
	} else {
		// RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
		factory(_, Backbone);
	}
}(this, function(_, Backbone) {
	
	Backbone.FilterableCollection = Backbone.Collection.extend({
		
		constructor : function( options ) {
			Backbone.Collection.apply(this, arguments);
			// Storing original models after server sync for reference
			this.listenTo( this, "sync", this._setOriginal );
			// Storing original models if models are not from server
			// this event is unbinded if either "sync" or initial "reset" is called
			this.listenToOnce( this, "reset", this._setOriginal );
		},

		original : new Backbone.Collection(),
		excludedModels : new Backbone.Collection(),
		
		/**
		 * Filters the collection's models
		 * @param  {Function} iterator
		 * @return {null}
		 */
		filter : function( iterator ) {
			var excludes = [];
			var includes = [];
			var that = this;

			_.each(this.original.models, function( model, index ) {
				if (iterator.call(that, model, index, this.models)) {
					includes.push(model);
				} else {
					excludes.push(model);
				}
			});

			// emits reset to re-render view if used in marionette.collectview;
			this.reset(includes);
			this.excludedModels.reset(excludes);
		},

		_restore : function() {
			this.excludedModels.reset([]);
			this.reset( this.original.models );
		},

		_setOriginal : function( collection ) {
			this.original.reset( collection.models );
			this.excludedModels.reset([]);
			this.stopListening(this, "reset");
		},

		include : function() {},
		exclude : function() {},

		/**
		 * Performs filter on this.models based on the passed models
		 * @param  {Backbone.Model} models Backbone models that is to be included
		 * @return {null}
		 */
		filterItems : function( models ) {
			var excludes = [];
			var includes = [];
			var that = this;

			this.each( function( model ) {
				if ( _.contains( models, model )) {
					includes.push( model );
				} else {
					excludes.push( model );
				}
			});

			// Emits reset to re-render view if used in Marionette.Collectview;
			this.reset( includes );
			this.excludedModels.reset( excludes );
		}
	});
	
return Backbone.FilterableCollection;
}));
