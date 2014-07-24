Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {
  Meteor.subscribe('messages');
  Meteor.subscribe('otherUsers');
  Meteor.subscribe('userPresence');

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.messagesList.events({
    'submit form': function(event, template) {
      event.preventDefault();
      var field = template.$('input[type=text]');

      Messages.insert({
        userId: Meteor.userId(),
        createdAt: new Date(),
        message: field.val()
      });

      field.val('');
    }
  });

  Template.messagesList.helpers({
    messages: function() {
      return Messages.find({}, { sort: { createdAt: 1 }, limit: 10 });
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

  Template.usersList.helpers({
    presences: function() {
      return Presences.find({}, { sort: { username: -1 }});
    }
  });

  Presence.state = function() {
    return {
      username: Meteor.user() ? Meteor.user().username : 'Anonymous'
    };
  };
}

if (Meteor.isServer) {
  Meteor.publish('otherUsers', function() {
    return Meteor.users.find({}, { fields: { username: true }});
  });

  Meteor.publish('messages', function() {
    return Messages.find({}, { sort: { createdAt: -1 }, limit: 10 });
  });

  Meteor.publish('userPresence', function() {
    return Presences.find({}, { fields: { state: true, userId: true }});
  });

  Messages.allow({
    insert: function (userId, doc) {
      return true;
    }
  });
}
