const columns = [
  {
    name: 'launchCount',
    type: 'Int64',
    constraints: 'NOT NULL'
  },
  {
    name: 'launchTime',
    type: 'DateTime',
    constraints: 'NOT NULL'
  },
  {
    name: 'installDate',
    type: 'DateTime',
    constraints: 'NOT NULL'
  },
  {
    name: 'osVersion',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'deviceModel',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'deviceToken',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'deviceType',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'userId',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'tokenStatus',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'appId',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'ip',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'connection',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'appVersion',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'created',
    type: 'DateTime',
    constraints: 'NOT NULL'
  },
  {
    name: 'modified',
    type: 'DateTime',
    constraints: 'NOT NULL'
  },
  {
    name: 'status',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'subscriptions',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'timeZone',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'adId',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'tags',
    type: 'Array(String)',
    constraints: 'NOT NULL'
  },
  {
    name: 'event_purchase_firstOccurrence',
    type: 'DateTime',
    constraints: 'NOT NULL'
  },
  {
    name: 'event_purchase_lastOccurrence',
    type: 'DateTime',
    constraints: 'NOT NULL'
  },
  {
    name: 'event_purchase_count',
    type: 'Int64',
    constraints: 'NOT NULL'
  },
  {
    name: 'userInfo_name',
    type: 'String',
    constraints: 'NOT NULL'
  },
  {
    name: 'userInfo_birthday',
    type: 'DateTime',
    constraints: 'NOT NULL'
  },
  {
    name: 'userInfo_categories',
    type: 'String',
    constraints: 'NOT NULL'
  }
]

module.exports = { columns }
