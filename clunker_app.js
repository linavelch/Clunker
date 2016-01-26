Posts = new Mongo.Collection('posts');

Router.route('/posts',function() {
  this.render('posts');
  this.layout('posts');
});

Router.route('/', function() {
	this.render('home');
	this.layout('layouttwo');
});

Router.route('/home', function() {
	this.render('home');
	this.layout('layout');
});


Router.route('/listings', function() {
	this.render('listings');
	this.layout('layout');
   {
  name: 'listings'
}
});

Router.route('/register', function() {
	this.render('register');
	this.layout('layout');
   {
  name: 'register.show'
}
});


if (Meteor.isClient) {
  Meteor.subscribe("posts");

  Template.posts.events({
    'submit form':function(event) {
     event.preventDefault();

      var destinationBox = $(event.target).find('textarea[name=destination]');
      var destination = destinationBox.val();

      var monthBox = $(event.target).find('input[name=DOBMonth]');
      var month = monthBox.val();

      var dayBox = $(event.target).find('input[name=DOBDay]');
      var day = dayBox.val();

      var timeBox = $(event.target).find('input[name=DOBTime]');
      var time = timeBox.val();

      var ampmBox = $(event.target).find('input[name=DOBAmPm]');
      var ampm = ampmBox.val();

      var nameBox = $(event.target).find('input[name=userName]');
      var name = nameBox.val();

      var unixBox = $(event.target).find('input[name=unix]');
      var unix = unixBox.val();

      var phoneBox = $(event.target).find('input[name=phoneNumber]');
      var phoneNumber = phoneBox.val();

      Posts.insert({destination: destination, month: month, day: day, time: time, ampm: ampm, name: name, unix: unix, phone: phoneNumber });

      destinationBox.val('');
      monthBox.val('');
      dayBox.val('');
      timeBox.val('');
      ampmBox.val('');
      nameBox.val('');
      unixBox.val('');
      phoneBox.val('');

      Router.go('/listings')
    }
  });

  Template.listings.events({
    'click .delete':function(e) {
      e.preventDefault();
      var currentPostId = this._id;
      Posts.remove(currentPostId);
    }
  });


  Template.signup.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.signupEmail.value;
      var passwordVar = event.target.signupPassword.value;
      Accounts.createUser({
        email: emailVar,
        password: passwordVar
      });
    }
  });
  Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.loginEmail.value;
      var passwordVar = event.target.loginPassword.value;
      Meteor.loginWithPassword(emailVar, passwordVar);
    if (false) {
      confirm('Wrong email or password!');
     }
  }
  });
  Template.settings.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
    }
  });
  Template.listings.helpers({
    listings: function() {
      return Posts.find();
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });

  Accounts.config({
    restrictCreationByEmailDomain: 'williams.edu',
    sendVerificationEmail: true
  });
  Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "Please Verify Your ClunkerU Account";
  };
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    var text = "Hello,\n\nThank you for registering to ClunkerU.\n\nTo complete your registration" +
    "and verify your ClunkerU account, please use the following link.\n\n" + url + "\n\n" +
               "Thank you,\nThe ClunkerU Team";
    return text;
  };
  Accounts.emailTemplates.from = "ClunkerU Accounts <no-reply@meteor.com>"

  Meteor.publish("posts", function () {
    return Posts.find();
  });
}
