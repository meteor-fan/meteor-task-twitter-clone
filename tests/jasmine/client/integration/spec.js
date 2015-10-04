/* jshint undef: true, unused: true, latedef: true */
/* jshint quotmark: single, eqeqeq: true, camelcase: true */
/* jshint browser: true */

/* global describe, it, expect, Meteor, Blaze, Template, Mongo, Posts */
/* global beforeAll */

var LOCALE_TEXTS = {
  'ja:Title': 'タイトル',
  'ja:The HTML title is "Twitter Clone"': 'HTMLタイトルが"Twitter Clone"である',
  'ja:The H1 title is "Twitter Clone"': 'H1タイトルが"Twitter Clone"である',
  'ja:Twitter authentication': 'Twitter認証',
  'ja:accounts-twitter package is loaded': 'accounts-twitterパッケージが読み込まれている',
  'ja:accounts-ui package is loaded': 'accounts-uiパッケージが読み込まれている',
  'ja:The login button is displayed': 'ログインボタンが表示されている',
  'ja:Collection': 'コレクション',
  'ja:The "Posts" is defined': '"Posts"が定義されている',
  'ja:The "Posts" is a Mongo.Collection': '"Posts"がMongo.Collectionである',
  'ja:New post form': '新規投稿フォーム',
  'ja:An input field in a form with "new-post" class is displayed': '"new-post"クラスを持つFORMにINPUTフィールドが表示されている',
  'ja:An event handler for "submit .new-post" is defined': '"submit .new-post"のイベントハンドラが定義されている',
  'ja:Submitting the form adds a new item in the "Posts"': 'フォーム投稿すると"Posts"にアイテムが一つ追加される',
  'ja:Adding new posts': '新規投稿追加',
  'ja:The new item has "text" property which is the form text': 'その新しいアイテムは"text"というプロパティを持ち、フォームのテキストが入っている',
  'ja:The new item has "createdAt" property of type "Date"': 'その新しいアイテムは"createdAt"というプロパティを持ち、"Date"の型である',
  'ja:The new item has "owner" property which is the userId': 'その新しいアイテムは"owner"というプロパティを持ち、userIdが入っている',
  'ja:Showing posts': '投稿の表示',
  'ja:"posts" helper is defined': '"posts"ヘルパーが定義されている',
  'ja:Posts are shown in UL with "posts" class': '投稿がULタグ("posts"クラス付き)で表示されている',
'ja:Permission check': '権限の確認',
  'ja:Submitting the form fails to add a new item in the "Posts"': 'ログアウト時はフォーム投稿しても"Posts"にアイテムは追加されない'
};

function t(str) {
  var lang = navigator.language.slice(0, 2);
  return LOCALE_TEXTS[lang + ':' + str] || str;
}

describe(t('Title'), function() {
  'use strict';

  it(t('The HTML title is "Twitter Clone"'), function() {
    expect(document.title).toEqual('Twitter Clone');
  });

  it(t('The H1 title is "Twitter Clone"'), function() {
    expect(document.querySelector('body > h1').textContent).toEqual('Twitter Clone');
  });
});

describe(t('Twitter authentication'), function() {
  'use strict';

  it(t('accounts-twitter package is loaded'), function() {
    expect(Meteor.loginWithTwitter).toBeDefined();
  });

  it(t('accounts-ui package is loaded'), function() {
    expect(Blaze._globalHelpers.loginButtons).toBeDefined();
  });

  it(t('The login button is displayed'), function() {
    expect(document.querySelector('#login-buttons')).not.toBeNull();
  });
});

describe(t('Collection'), function() {
  'use strict';

  it(t('The "Posts" is defined'), function() {
    expect(Posts).toBeDefined();
  });

  it(t('The "Posts" is a Mongo.Collection'), function() {
    expect(Posts instanceof Mongo.Collection).toBe(true);
  });
});

describe(t('New post form'), function() {
  'use strict';

  it(t('An input field in a form with "new-post" class is displayed'), function() {
    expect(document.querySelector('form.new-post input')).not.toBeNull();
  });

  it(t('An event handler for "submit .new-post" is defined'), function() {
    var found = false;
    Object.keys(Template).forEach(function(key) {
      var view = Template[key];
      if (!view) return;
      if (!view instanceof Blaze.Template) return;
      if (!view.__eventMaps) return;
      if (!view.__eventMaps[0]) return;
      if (view.__eventMaps[0]['submit .new-post']) {
        found = true;
      }
    });
    expect(found).toBe(true);
  });
});

describe(t('Adding new posts'), function() {
  'use strict';

  beforeAll(function(done) {
    Meteor.call('clearAllPosts', function() {
      if (Meteor.userId()) return done();
      Meteor.loginWithTwitter({
        loginStyle: 'redirect'
      }, done);
    });
  });

  it(t('Submitting the form adds a new item in the "Posts"'), function(done) {
    expect(Posts.find({}).count()).toBe(0);
    document.querySelector('form.new-post input').value = 'test post';
    var event = document.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    document.querySelector('form.new-post').dispatchEvent(event);
    setTimeout(function() {
      expect(Posts.find({}).count()).toBe(1);
      done();
    }, 100);
  });

  it(t('The new item has "text" property which is the form text'), function() {
    expect(Posts.find({}).fetch()[0].text).toBeDefined();
    expect(Posts.find({}).fetch()[0].text === 'test post').toBe(true);
  });

  it(t('The new item has "createdAt" property of type "Date"'), function() {
    expect(Posts.find({}).fetch()[0].createdAt).toBeDefined();
    expect(Posts.find({}).fetch()[0].createdAt instanceof Date).toBe(true);
  });

  it(t('The new item has "owner" property which is the userId'), function() {
    expect(Posts.find({}).fetch()[0].owner).toBeDefined();
    expect(Posts.find({}).fetch()[0].owner === Meteor.userId()).toBe(true);
  });
});

describe(t('Showing posts'), function() {
  'use strict';

  beforeAll(function(done) {
    Meteor.call('clearAllPostsAndAddDummyPosts', done);
  });

  it(t('"posts" helper is defined'), function() {
    var found = false;
    Object.keys(Template).forEach(function(key) {
      var view = Template[key];
      if (!view) return;
      if (!view instanceof Blaze.Template) return;
      if (!view.__helpers) return;
      if (view.__helpers[' posts']) {
        found = true;
      }
    });
    expect(found).toBe(true);
  });

  it(t('Posts are shown in UL with "posts" class'), function() {
    expect(document.querySelector('ul.posts')).not.toBeNull();
    expect(document.querySelectorAll('ul.posts li').length).toBe(3);
  });
});

describe(t('Permission check'), function() {
  'use strict';

  beforeAll(function(done) {
    Meteor.call('clearAllPosts', function() {
      if (!Meteor.userId()) return done();
      Meteor.logout(done);
    });
  });

  it(t('Submitting the form fails to add a new item in the "Posts"'), function(done) {
    expect(Posts.find({}).count()).toBe(0);
    document.querySelector('form.new-post input').value = 'test post';
    var event = document.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    document.querySelector('form.new-post').dispatchEvent(event);
    setTimeout(function() {
      expect(Posts.find({}).count()).toBe(0);
      done();
    }, 100);
  });
});
