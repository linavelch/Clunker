Posts = new Mongo.Collection('posts');
Profiles = new Mongo.Collection('profiles');

Router.route('/posts',function() {
  this.render('posts');
  this.layout('posts');
});

Router.route('/', function() {
	this.render('');
	this.layout('layouttwo');
});

Router.route('/listings', function() {
	this.render('listings');
	this.layout('layout');
   {
  name: 'listings'
}
});

Router.route('/profile', function(){
	this.render('Your_profile');
	this.layout('user')
});

Router.route('/signup', function() {
   this.render('signup');
   this.layout('layout');
});

if (Meteor.isClient) {
  Meteor.subscribe("posts");

  Template.posts.events({
    'submit form':function(event) {
     event.preventDefault();

      var destinationBox = $(event.target).find('textarea[name=destination]');
      var destination = destinationBox.val();

      var monthBox = $(event.target).find('select[name=DOBMonth]');
      var month = monthBox.val();

      var dayBox = $(event.target).find('select[name=DOBDay]');
      var day = dayBox.val();

      var timeBox = $(event.target).find('select[name=DOBTime]');
      var time = timeBox.val();

      var ampmBox = $(event.target).find('select[name=DOBAmPm]');
      var ampm = ampmBox.val();

      var nameBox = $(event.target).find('input[name=userName]');
      var name = nameBox.val();

      var unixBox = $(event.target).find('input[name=unix]');
      var unix = unixBox.val();

      var phoneBox = $(event.target).find('input[name=phoneNumber]');
      var phoneNumber = phoneBox.val();

      var priceBox = $(event.target).find('input[name=price]');
      var price = priceBox.val();

      Posts.insert({destination: destination, month: month, day: day, time: time, ampm: ampm, name: name, unix: unix, phone: phoneNumber, price: price });

      destinationBox.val('');
      monthBox.val('');
      dayBox.val('');
      timeBox.val('');
      ampmBox.val('');
      nameBox.val('');
      unixBox.val('');
      phoneBox.val('');
      priceBox.val('');

      Router.go('/listings')
    }
  });

  Template.listings.events({
    'click .delete':function(e) {
      e.preventDefault();
      var currentPostId = this._id;
      Posts.remove(currentPostId);

      /*'click .catch':function(event) {
       event.preventDefault();
       var inc = 0;
       var currentPostId = this._id;
       inc = inc + 1;
       if ( inc > 3 ) {
         Posts.remove(currentPostId);
         }
       }*/
     }
  });

  Template.signup.events({
    'submit form': function(event) {
      event.preventDefault();
      var fullNameVar = event.target.fullName.value;
      var emailVar = event.target.signupEmail.value;
      var passwordVar = event.target.signupPassword.value;
      var phoneVar= event.target.phoneNumber.value;
      var classYearVar= event.target.classYear.value;
      var offerRideVar=event.target.choices.value;
      var makeModelVar=event.target.carModel.value;
      var mpgVar=event.target.mpg.value;
      Accounts.createUser({
        name:fullNameVar,
        email: emailVar,
        phoneNumber: phoneVar,
        password: passwordVar,
        class:classYearVar,
        offering:offerRideVar,
        carType:makeModelVar,
        mpg:mpgVar,
      });
      Router.go('/profile')
    }
  });

  Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.loginEmail.value;
      var passwordVar = event.target.loginPassword.value;
      Meteor.loginWithPassword(emailVar, passwordVar);
      Router.go('/listings')
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
  });

Meteor.subscribe("profiles");

  Template.user.helpers({
  	'nameVar': function() {
  		return Meteor.user().profile.fullName;
  	},
    'emailVar': function() {
  		return Meteor.user().profile.signupEmail;
  	},
  	'phoneVar': function() {
  		return Meteor.user().profile.phoneNumber;
  	},
    'classYearVar': function() {
  		return Meteor.user().profile.classYear;
  	},
  	'makeModelVar': function() {
  		return Meteor.user().profile.carModel;
  	},
  	'mpgVar': function() {
  		return Meteor.user().profile.mpg;
  	}
  });
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
