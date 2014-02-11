App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter;

//router

App.Router.map(function() {
  this.resource('users', function(){
    this.resource('user', { path: '/:user_id'}, function(){
      this.route('edit');
    });
    this.route('create');
  });
});

//routes

App.IndexRoute = Ember.Route.extend({

});

App.UsersRoute = Ember.Route.extend({
  model: function(){
    return this.store.find('user');
  }
});

App.UserRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});

App.UserEditRoute = Ember.Route.extend({
  model: function(){
    return this.modelFor('user');
  }
});

App.UsersCreateRoute = Ember.Route.extend({
  model: function(){
    // the model for this route is a new empty Ember.Object
    return Ember.Object.create({});
    }
  });

//model

App.User = DS.Model.extend({
  name: DS.attr(),
  email: DS.attr(),
  bio: DS.attr(),
  avatarURL: DS.attr(),
  creationDate: DS.attr()

});

//fixtures

// App.User.FIXTURES = [{
//   id: 1,
//   name: 'Sponge Bob',
//   email: 'bob@sponge.com',
//   bio: 'Lorem ispum dolor sit amet in voluptate fugiat nulla pariatur.',
//   avatarUrl: 'http://jkneb.github.io/ember-crud/assets/images/avatars/sb.jpg',
//   creationDate: 'Mon, 26 Aug 2013 20:23:43 GMT'
// }, {
//   id: 2,
//   name: 'John David',
//   email: 'john@david.com',
//   bio: 'Lorem ispum dolor sit amet in voluptate fugiat nulla pariatur.',
//   avatarUrl: 'http://jkneb.github.io/ember-crud/assets/images/avatars/jk.jpg',
//   creationDate: 'Fri, 07 Aug 2013 10:10:10 GMT'
// }
// ];


//controllers

App.UsersController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  usersCount: function(){
    return this.get('model.length');
  }.property('@each')
});

App.UserController = Ember.ObjectController.extend({
  // the deleteMode property is false by default
  deleteMode: false,

  actions: {
    delete: function(){
      // our delete method now only toggles deleteMode's value
      this.toggleProperty('deleteMode');
    },
    cancelDelete: function(){
      // set deleteMode back to false
      this.set('deleteMode', false);
    },
    confirmDelete: function(){
      // this tells Ember-Data to delete the current user
      this.get('model').deleteRecord();
      this.get('model').save();
      // and then go to the users route
      this.transitionToRoute('users');
      // set deleteMode back to false
      this.set('deleteMode', false);
    },
    // the edit method remains the same
    edit: function(){
      this.transitionToRoute('user.edit');
    }
  }
});

App.UserEditController = Ember.ObjectController.extend({
  actions: {
    save: function(){
      var user = this.get('model');
      // this will tell Ember-Data to save/persist the new record
      user.save();
      // then transition to the current user
      this.transitionToRoute('user', user);
    }
  }
});

App.UsersCreateController = Ember.ObjectController.extend({
  actions: {
    save: function(){
      // just before saving, we set the creationDate
      this.get('model').set('creationDate', new Date());

      // create a record and save it to the store
      var newUser = this.store.createRecord('user', this.get('model'));
      newUser.save();

      // redirects to the user itself
      this.transitionToRoute('user', newUser);
    }
  }
});


//helpers

Ember.Handlebars.helper('formatDate', function(date){
  return moment(date).fromNow();
});

















