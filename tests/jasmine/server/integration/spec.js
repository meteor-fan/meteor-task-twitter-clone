/* jshint undef: true, unused: true, latedef: true */
/* jshint quotmark: single, eqeqeq: true, camelcase: true */
/* jshint node: true */

/* global describe, it, expect, Mongo, Posts */

var LOCALE_TEXTS = {
  'ja:step03: Collection': 'step03: コレクション',
  'ja:The "Posts" is defined': '"Posts"が定義されている',
  'ja:The "Posts" is a Mongo.Collection': '"Posts"がMongo.Collectionである'
};

function t(str) {
  var lang = (process.env.LANG || '').slice(0, 2);
  return LOCALE_TEXTS[lang + ':' + str] || str;
}

describe(t('step03: Collection'), function() {
  'use strict';

  it(t('The "Posts" is defined'), function() {
    expect(Posts).toBeDefined();
  });

  it(t('The "Posts" is a Mongo.Collection'), function() {
    expect(Posts instanceof Mongo.Collection).toBe(true);
  });
});
