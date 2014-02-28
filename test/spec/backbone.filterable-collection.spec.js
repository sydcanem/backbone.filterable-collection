describe('Backbone.FilterableCollection', function () {
	it('should be an instance of Backbone.FilterableCollection', function () {
		var filterable = new Backbone.FilterableCollection();
		filterable.should.be.an.instanceof( Backbone.FilterableCollection );
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
		it('should be an instance of Backbone.Collection', function () {
			filterable._excludedModels.should.be.an.instanceof(Backbone.Collection);
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
