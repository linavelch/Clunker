Router.route('/listings', function() {
	this.render('listings');
	this.layout('layout');
   {
  name: 'listings.show'
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
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
}
