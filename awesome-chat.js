Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {

  Meteor.subscribe('allMessages');
  Meteor.subscribe('otherUsers');

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.messagesList.events({
    'submit form': function(event, template) {
      event.preventDefault();

      Messages.insert({
        userId: Meteor.userId(),
        createdAt: new Date(),
        message: template.find('input[type=text]').value
      });
    }
  });

  Template.messagesList.helpers({
    messages: function() {
      return Messages.find({}, { sort: { createdAt: 1 }});
    },
    loaded: function() {
      return bookSearchHandle.ready();
    }
  });

  Template.messageItem.helpers({
    user: function() {
      return Meteor.users.findOne(this.userId);
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('otherUsers', function() {
    return Meteor.users.find({}, { fields: { username: true }});
  });
  Meteor.publish('allMessages', function() {
    return Messages.find();
  });
}
