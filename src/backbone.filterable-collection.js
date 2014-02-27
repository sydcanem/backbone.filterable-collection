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

	initialize: function() {},

	/**
	 * Models that were filtered out of the collection
	 * @type {Backbone}
	 */
	excludedModels: new Backbone.Collection(),

	/**
	 * Filters the collection's models
	 * @param  {Function} iterator
	 * @return {null}
	 */
	filter : function( iterator ) {
		var excludes = [];
		var includes = [];
		var that = this;

		_.each(this.models, function( model, index ) {
			if (iterator.call(that, model, index, this.models)) {
				includes.push(model);
			} else {
				excludes.push(model);
			}
		});

		// Emits reset to re-render view if used in Marionette.Collectview;
		this.reset(includes);
		this.excludedmodels.reset(excludes);
	},

	restore : function() {},
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