/**
 * Backbone FilterableCollection
 * Version 0.1.3
 *
 * https://github.com/sydcanem/Backbone.FilterableCollection
 */
( function ( root, factory ) {
	if ( typeof exports === 'object' && typeof require === 'function' ) {
		module.exports = factory( require( "underscore" ), require( "backbone" ) );
	} else if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "underscore", "backbone" ], function ( _, Backbone ) {
			// Use global variables if the locals are undefined.
			return factory( _ || root._, Backbone || root.Backbone );
		} );
	} else {
		// RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
		factory( _, Backbone );
	}
}( this, function ( _, Backbone ) {

	Backbone.FilterableCollection = Backbone.Collection.extend( {

		constructor: function ( options ) {
			// Set original models
			this.listenTo( this, "reset:original", this._setOriginal );

			Backbone.Collection.apply( this, arguments );
		},

		/**
		 * Array of models as reference
		 */
		_original: [],

		/**
		 * Array of models that were excluded during filtering
		 */
		_excludedModels: [],

		/**
		 * filters the collection's models
		 * @param  {Function} iterator
		 * @return {null}
		 */
		filter: function ( iterator ) {
			var excludes = [];
			var includes = [];
			var that = this;

			// this._original is empty, that means we're on our first filtering
			// so use this.models instead
			var collection = this._original.length ? this._original : this.models;

			_.each( collection, function ( model, index ) {
				if ( iterator.call( that, model, index, collection ) ) {
					includes.push( model );
				} else {
					excludes.push( model );
				}
			} );

			this._excludedModels = excludes;
			this._resetModels( includes );
		},

		/**
		 * Restore this.models to original
		 */
		_restore: function () {
			this._excludedModels = [];
			this.reset( this._original );
		},

		/**
		 * Resetting models after filter and filterItems
		 */
		_resetModels: function ( models ) {
			this.trigger( 'reset:original', models );
			this.reset( models );
		},

		/**
		 * Sets a reference attribute collection (this._original)
		 * @param {Backbone.Collection} collection
		 */
		_setOriginal: function ( models ) {
			// Merge excludes models with new models
			this._original = this._excludedModels.concat( models );
			// emptying excludedModels for next filtering
			this._excludedModels = [];
		},

		include: function () {},
		exclude: function () {},

		/**
		 * Performs filter on this.models based on the passed models
		 * @param  {Backbone.Model} models Backbone models that is to be included
		 * @return {null}
		 */
		filterItems: function ( models ) {
			var excludes = [];
			var includes = [];
			var collection = this._original.length ? this._original : this.models;

			_.each( collection, function ( model ) {
				if ( _.contains( models, model ) ) {
					includes.push( model );
				} else {
					excludes.push( model );
				}
			} );

			this._excludedModels = excludes;
			this._resetModels( includes );
		}
	} );


	return Backbone;
} ) );
