(function() {
  var MdTestUI, Search, Test, Tests,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  MdTestUI = {};

  MdTestUI.App = new Marionette.Application();

  MdTestUI.App.on('start', function() {
    this.layout = new MdTestUI.View.Root();
    this.router = new MdTestUI.Router({
      controller: new MdTestUI.Controller()
    });
    return Backbone.history.start({
      pushState: true
    });
  });

  MdTestUI.Controller = (function(superClass) {
    extend(Controller, superClass);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.index = function() {
      var search, tests, view;
      console.log("route index");
      search = new Search();
      tests = new Tests();
      tests.fetch();
      search.on('change:title', function(model, value) {
        console.log(value);
        return tests.fetch({
          data: {
            title: value
          }
        });
      });
      view = new MdTestUI.View.IndexRoot({
        search_model: search,
        tests_collection: tests
      });
      return MdTestUI.App.layout.main.show(view);
    };

    Controller.prototype.new_test = function() {
      var test, view;
      console.log("route new_test");
      test = new Test();
      view = new MdTestUI.View.TestEditRoot({
        test_model: test
      });
      return MdTestUI.App.layout.main.show(view);
    };

    Controller.prototype.test = function(id) {
      var test, view;
      console.log("route test");
      test = new Test({
        id: id
      });
      test.fetch();
      view = new MdTestUI.View.TestRoot({
        test_model: test
      });
      return MdTestUI.App.layout.main.show(view);
    };

    Controller.prototype.edit_test = function(id) {
      var test, view;
      console.log("route edit_test");
      test = new Test({
        id: id
      });
      test.fetch();
      view = new MdTestUI.View.TestEditRoot({
        test_model: test
      });
      return MdTestUI.App.layout.main.show(view);
    };

    return Controller;

  })(Marionette.Object);

  MdTestUI.Router = (function(superClass) {
    extend(Router, superClass);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      '': 'index',
      'test': 'new_test',
      'test/:id': 'test',
      'test/:id/edit': 'edit_test'
    };

    return Router;

  })(Marionette.AppRouter);

  MdTestUI.View = {};

  MdTestUI.View.Root = (function(superClass) {
    extend(Root, superClass);

    function Root() {
      return Root.__super__.constructor.apply(this, arguments);
    }

    Root.prototype.el = 'body';

    Root.prototype.regions = {
      main: "main"
    };

    return Root;

  })(Marionette.LayoutView);

  MdTestUI.View.IndexRoot = (function(superClass) {
    extend(IndexRoot, superClass);

    function IndexRoot() {
      return IndexRoot.__super__.constructor.apply(this, arguments);
    }

    IndexRoot.prototype.template = "#index-root";

    IndexRoot.prototype.regions = {
      search: ".search",
      tests: ".tests"
    };

    IndexRoot.prototype.ui = {
      new_test: '.new-test'
    };

    IndexRoot.prototype.events = {
      'click @ui.new_test': function() {
        return MdTestUI.App.router.navigate('test', true);
      }
    };

    IndexRoot.prototype.initialize = function(arg) {
      this.search_model = arg.search_model, this.tests_collection = arg.tests_collection;
    };

    IndexRoot.prototype.onShow = function() {
      this.search.show(new MdTestUI.View.IndexSearch({
        model: this.search_model
      }));
      return this.tests.show(new MdTestUI.View.IndexTests({
        collection: this.tests_collection
      }));
    };

    return IndexRoot;

  })(Marionette.LayoutView);

  MdTestUI.View.TestRoot = (function(superClass) {
    extend(TestRoot, superClass);

    function TestRoot() {
      return TestRoot.__super__.constructor.apply(this, arguments);
    }

    TestRoot.prototype.template = "#test-root";

    TestRoot.prototype.regions = {
      view: ".view"
    };

    TestRoot.prototype.ui = {
      index: '.index'
    };

    TestRoot.prototype.events = {
      'click @ui.index': function() {
        return MdTestUI.App.router.navigate('', true);
      }
    };

    TestRoot.prototype.initialize = function(arg) {
      this.test_model = arg.test_model;
    };

    TestRoot.prototype.onShow = function() {
      return this.view.show(new MdTestUI.View.TestView({
        model: this.test_model
      }));
    };

    return TestRoot;

  })(Marionette.LayoutView);

  MdTestUI.View.TestEditRoot = (function(superClass) {
    extend(TestEditRoot, superClass);

    function TestEditRoot() {
      return TestEditRoot.__super__.constructor.apply(this, arguments);
    }

    TestEditRoot.prototype.template = "#test-edit-root";

    TestEditRoot.prototype.regions = {
      edit: ".edit",
      view: ".view"
    };

    TestEditRoot.prototype.ui = {
      index: '.index'
    };

    TestEditRoot.prototype.events = {
      'click @ui.index': function() {
        return MdTestUI.App.router.navigate('', true);
      }
    };

    TestEditRoot.prototype.initialize = function(arg) {
      this.test_model = arg.test_model;
    };

    TestEditRoot.prototype.onShow = function() {
      this.edit.show(new MdTestUI.View.TestEdit({
        model: this.test_model
      }));
      return this.view.show(new MdTestUI.View.TestView({
        model: this.test_model
      }));
    };

    return TestEditRoot;

  })(Marionette.LayoutView);

  MdTestUI.View.TestEdit = (function(superClass) {
    extend(TestEdit, superClass);

    function TestEdit() {
      return TestEdit.__super__.constructor.apply(this, arguments);
    }

    TestEdit.prototype.template = "#test-edit";

    TestEdit.prototype.bindings = {
      '.errors': {
        observe: 'errors',
        update: function($el, errors, model) {
          var error;
          console.log(errors);
          return $el.html((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = errors.length; i < len; i++) {
              error = errors[i];
              results.push($("<li>" + error + "</li>"));
            }
            return results;
          })());
        }
      },
      '.title': {
        observe: 'title'
      },
      '.description': {
        observe: 'description'
      },
      '.test': {
        observe: 'test'
      }
    };

    TestEdit.prototype.ui = {
      submit: '.submit'
    };

    TestEdit.prototype.events = {
      'click @ui.submit': function() {
        return this.model.save(null, {
          success: function(model, response) {
            return MdTestUI.App.router.navigate("test/" + response.id, true);
          },
          error: function(model, response) {
            return model.set('errors', response.responseJSON.errors);
          }
        });
      }
    };

    TestEdit.prototype.onShow = function() {
      return this.stickit();
    };

    return TestEdit;

  })(Marionette.ItemView);

  MdTestUI.View.TestView = (function(superClass) {
    extend(TestView, superClass);

    function TestView() {
      return TestView.__super__.constructor.apply(this, arguments);
    }

    TestView.prototype.template = "#test-view";

    TestView.prototype.bindings = {
      '.title': {
        observe: 'title'
      },
      '.description': {
        observe: 'description'
      },
      '.test': {
        observe: 'test'
      }
    };

    TestView.prototype.ui = {
      edit: '.edit'
    };

    TestView.prototype.events = {
      'click @ui.edit': function() {
        return MdTestUI.App.router.navigate("test/" + this.model.id + "/edit", true);
      }
    };

    TestView.prototype.onShow = function() {
      return this.stickit();
    };

    return TestView;

  })(Marionette.ItemView);

  MdTestUI.View.IndexSearch = (function(superClass) {
    extend(IndexSearch, superClass);

    function IndexSearch() {
      return IndexSearch.__super__.constructor.apply(this, arguments);
    }

    IndexSearch.prototype.template = "#index-search";

    IndexSearch.prototype.bindings = {
      '.title': {
        observe: 'title'
      }
    };

    IndexSearch.prototype.onShow = function() {
      return this.stickit();
    };

    return IndexSearch;

  })(Marionette.ItemView);

  MdTestUI.View.IndexTest = (function(superClass) {
    extend(IndexTest, superClass);

    function IndexTest() {
      return IndexTest.__super__.constructor.apply(this, arguments);
    }

    IndexTest.prototype.tagName = 'li';

    IndexTest.prototype.template = "#index-test";

    IndexTest.prototype.bindings = {
      '.title': {
        observe: 'title'
      }
    };

    IndexTest.prototype.events = {
      'click': function() {
        return MdTestUI.App.router.navigate("test/" + this.model.id, true);
      }
    };

    IndexTest.prototype.onShow = function() {
      return this.stickit();
    };

    return IndexTest;

  })(Marionette.ItemView);

  MdTestUI.View.IndexTests = (function(superClass) {
    extend(IndexTests, superClass);

    function IndexTests() {
      return IndexTests.__super__.constructor.apply(this, arguments);
    }

    IndexTests.prototype.tagName = 'ul';

    IndexTests.prototype.childView = MdTestUI.View.IndexTest;

    return IndexTests;

  })(Marionette.CollectionView);

  Search = (function(superClass) {
    extend(Search, superClass);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.defaults = {
      title: ''
    };

    return Search;

  })(Backbone.Model);

  Test = (function(superClass) {
    extend(Test, superClass);

    function Test() {
      return Test.__super__.constructor.apply(this, arguments);
    }

    Test.prototype.urlRoot = '/tests';

    return Test;

  })(Backbone.Model);

  Tests = (function(superClass) {
    extend(Tests, superClass);

    function Tests() {
      return Tests.__super__.constructor.apply(this, arguments);
    }

    Tests.prototype.model = Test;

    Tests.prototype.url = '/tests';

    return Tests;

  })(Backbone.Collection);

  $(function() {
    MdTestUI.App.start();
    return window.a = MdTestUI.App;
  });

}).call(this);
