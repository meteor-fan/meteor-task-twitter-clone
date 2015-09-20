if (process.env.IS_MIRROR) {
  Meteor.methods({
    clearAllPosts: function() {
      Posts.remove({});
    },
    clearAllPostsAndAddDummyPosts: function() {
      Posts.remove({});
      Posts.insert({
        text: 'text1',
        owner: 1,
        createdAt: new Date()
      });
      Posts.insert({
        text: 'text2',
        owner: 1,
        createdAt: new Date()
      });
      Posts.insert({
        text: 'text3',
        owner: 1,
        createdAt: new Date()
      });
    }
  });
}
