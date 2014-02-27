describe('Backbone.FilterableCollection', function () {
	it('should be an instance of Backbone.FilterableCollection', function () {
		var filterable = new Backbone.FilterableCollection();
		filterable.should.be.an.instanceof( Backbone.FilterableCollection );
	});

	describe('excludedModels attribute', function () {
		var filterable;
		before(function () {
			filterable = new Backbone.FilterableCollection();
		});
		it('should be an instance of Backbone.Collection', function () {
			filterable.excludedModels.should.be.an.instanceof(Backbone.Collection);
		});
		it('should have models if method filterItems is called', function () {
			var testData = [{'id': 1}, {'id':2}, {'id':3}];
			filterable.reset(testData);

			var includes = [];
			includes.push( filterable.findWhere({'id':1}) );
			includes.push( filterable.findWhere({'id':2}) );

			filterable.filterItems( includes );
			filterable.excludedModels.should.have.length(1);
		});
		it('should have models if method filter is called', function () {
			var testData = [{'id': 1}, {'id':2}, {'id':3}];
			filterable.reset(testData);

			function iterator(model) {
				return model.get('id') === 1;
			}

			filterable.filter(iterator);
			filterable.excludedModels.should.have.length(2);
		});
	});
});