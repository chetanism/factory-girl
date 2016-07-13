import Factory from '../../src';
import { User, Address, PhoneNumber, SequenceTest } from './dummyModels';

Factory.define('PhoneNumber', PhoneNumber, {
  type: 'mobile',
  number: '1234567890',
});

Factory.define('PhoneNumber2', PhoneNumber, function (buildOptions) {
  const attrs = {
    type: 'mobile',
    number: Factory.seq('PhoneNumber2.number', n => `1234567890-${n}`),
  };

  if (buildOptions.landline) {
    attrs.type = 'landline';
  }

  return attrs;
});

Factory.define('Address', Address, {
  id: Factory.seq('Address.id', n => `address_${n}_id`),
  street: Factory.seq('Address.street', n => `street-${n}`),
  laneNo: Factory.sequence('Address.laneNo'),
  landlineNumber: Factory.assocAttrs('PhoneNumber2', {}, { landline: true }),
});

Factory.define('User', User, {
  name: Factory.chance('name'),
  email: Factory.seq('User.email', n => `user${n}@email.com`),
  mobile: Factory.assocAttrsMany('PhoneNumber', 2, null, {
    number: Factory.seq('User.mobile', n => `123456-${n}`),
  }),
  address: Factory.assocMany('Address', 3, 'id'),
  bio: Factory.chance('paragraph', { sentences: 2 }),
});

Factory.define('SequenceTest1', SequenceTest, {
  seq1: Factory.sequence(),
  seq2: Factory.sequence(),
  seq3: Factory.sequence('SequenceTest1.seq3'),
});

Factory.define('SequenceTest2', SequenceTest, () => ({
  seq1: Factory.sequence(),
  seq2: Factory.sequence(),
  seq3: Factory.sequence('SequenceTest2.seq3'),
}));
