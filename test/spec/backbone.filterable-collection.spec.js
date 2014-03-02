describe( 'Backbone.FilterableCollection', function () {
	it( 'should be an instance of Backbone.FilterableCollection', function () {
		var filterable = new Backbone.FilterableCollection();
		filterable.should.be.an.instanceof( Backbone.FilterableCollection );
	});

	it('should be an instance of Backbone.Collection', function() {
		var filterable = new Backbone.FilterableCollection();
		filterable.should.be.an.instanceof( Backbone.Collection );
	});

	describe('should work well when extended', function() {
		var filterable;

		before(function() {
			var ExtendedCollection = Backbone.FilterableCollection.extend({
				initialize: function() {},
				returnTrue: function() { return true; },
				returnFalse: function() { return false; }
			});
			
			filterable = new ExtendedCollection();
		});

		it('should have the defined attributes', function() {
			filterable.should.have.property('_original');
			filterable.should.have.property('_excludedModels');
		});
		
		it('should have the defined methods', function(){
			filterable.should.have.property('filterItems');
			filterable.should.have.property('_restore');
			filterable.should.have.property('_setOriginal');
			filterable.should.have.property('filter');
		});

		it('extensions should work as expected', function() {
			filterable.returnTrue().should.equal( true );
			filterable.returnFalse().should.equal( false );
		});
	});

	describe('original models attribute', function() {
		var filterable;

		before(function(){
			filterable = new Backbone.FilterableCollection();
		});
		
		it('should have models on collection "reset"', function() {
			var testData = [{'id': 1}, {'id':2}, {'id':3}];
			filterable.reset(testData);
			
			filterable._original.should.have.length(3);
		});

		it('should not change model count on next reset', function() {
			var testData = [{'id': 1}, {'id':2}];
			
			filterable.reset(testData);
			filterable._original.should.have.length(3);
			filterable.should.have.length(2);
		});
	});

	describe('excludedModels attribute', function () {
		var filterable;

		before(function () {
			filterable = new Backbone.FilterableCollection();
		});

		it('should have models if method filterItems is called', function () {
			var testData = [{'id': 1}, {'id':2}, {'id':3}];
			filterable.reset(testData);

			var includes = [];
			includes.push( filterable.findWhere({'id':1}) );
			includes.push( filterable.findWhere({'id':2}) );

			filterable.filterItems( includes );
			filterable._excludedModels.should.have.length(1);
		});

		it('should have models if method filter is called', function () {
			var testData = [{'id': 1}, {'id':2}, {'id':3}];
			filterable.reset(testData);

			function iterator(model) {
				return model.get('id') === 1;
			}

			filterable.filter(iterator);
			filterable._excludedModels.should.have.length(2);
		});

		it('should have no models when _restore is called ', function() {
			filterable._restore();
			filterable._excludedModels.should.have.length(0);
		});

	});
});
