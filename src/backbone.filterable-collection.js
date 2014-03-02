/**
 * Backbone FilterableCollection
 * Version 0.1.0
 *
 * https://github.com/sydcanem/Backbone.FilterableCollection
 */
( function( root, factory ) {
	if ( typeof exports === 'object' && typeof require === 'function' ) {
		module.exports = factory( require( "underscore" ), require( "backbone" ) );
	} else if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "underscore", "backbone" ], function( _, Backbone ) {
			// Use global variables if the locals are undefined.
			return factory( _ || root._, Backbone || root.Backbone );
		} );
	} else {
		// RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
		factory( _, Backbone );
	}
}( this, function( _, Backbone ) {

	Backbone.FilterableCollection = Backbone.Collection.extend( {

		constructor: function( options ) {
			Backbone.Collection.apply( this, arguments );
			// Storing original models after server sync for reference
			this.listenTo( this, "sync", this._setOriginal );
			// Storing original models if models are not from server
			// this event is unbinded if either "sync" or initial "reset" is called
			this.listenToOnce( this, "reset", this._setOriginal );
		},

		/**
		 * Collection of models that initialized the collection
		 */
		_original: [],

		/**
		 * Collection of models that were excluded during filtering
		 */
		_excludedModels: [],

		/**
		 * filters the collection's models
		 * @param  {Function} iterator
		 * @return {null}
		 */
		filter: function( iterator ) {
			var excludes = [];
			var includes = [];
			var that = this;

			_.each( this._original, function( model, index ) {
				if ( iterator.call( that, model, index, this.models ) ) {
					includes.push( model );
				} else {
					excludes.push( model );
				}
			} );

			// emits reset to re-render view if used in marionette.collectview;
			this.reset( includes );
			this._excludedModels = excludes;
		},

		/**
		 * Restore this.models to original
		 */
		_restore: function() {
			this._excludedModels = [];
			this.reset( this._original );
		},

		/**
		 * Sets the original collection on "sync" or on first "reset" event
		 * @param {Backbone.Collection} collection
		 */
		_setOriginal: function( collection ) {
			this._original = collection.models;
			// Stop listening on succeding "reset" event
			this.stopListening( this, "reset", this._setOriginal );
		},

		include: function() {},
		exclude: function() {},

		/**
		 * Performs filter on this.models based on the passed models
		 * @param  {Backbone.Model} models Backbone models that is to be included
		 * @return {null}
		 */
		filterItems: function( models ) {
			var excludes = [];
			var includes = [];
			var that = this;

			_.each( this._original,  function( model ) {
				if ( _.contains( models, model ) ) {
					includes.push( model );
				} else {
					excludes.push( model );
				}
			} );

			// Emits reset to re-render view if used in Marionette.Collectview;
			this.reset( includes );
			this._excludedModels = excludes;
		}
	} );


	return Backbone.FilterableCollection;
} ) );
