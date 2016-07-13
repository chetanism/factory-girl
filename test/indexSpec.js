import { expect } from 'chai';
import Factory from '../src';
import ObjectAdapter from '../src/adapters/ObjectAdapter';
import './test-helper/dummyFactories';
import asyncFunction from './test-helper/asyncFunction';

describe('index', function () {
  Factory.setAdapter(new ObjectAdapter);
  beforeEach(function () {
    Factory.cleanUp();
  });

  describe('PhoneNumber factory', function () {
    it('can get attrs', asyncFunction(async function () {
      const attrs = await Factory.attrs('PhoneNumber');
      expect(attrs).to.be.eql({
        type: 'mobile',
        number: '1234567890',
      });
    }));

    it('can override attrs', asyncFunction(async function () {
      const attrs = await Factory.attrs('PhoneNumber', { number: '0987654321' });
      expect(attrs).to.be.eql({
        type: 'mobile',
        number: '0987654321',
      });
    }));

    it('can override attrs with generators as well',
      asyncFunction(async function () {
        const attrs = await Factory.attrs(
          'PhoneNumber', {
            alternate: Factory.assocAttrs('PhoneNumber'),
          }
        );
        expect(attrs.alternate).to.be.eql({
          type: 'mobile',
          number: '1234567890',
        });
      })
    );

    it('can get multiple attrs', asyncFunction(async function () {
      const attrs = await Factory.attrsMany(
        'PhoneNumber', 3, {
          number: Factory.seq('PhoneNumber.override', n => `123-${n}`),
        }
      );
      expect(attrs).to.be.an('array');
      expect(attrs).to.have.lengthOf(3);
    }));

    it('can use chance generator', asyncFunction(async function () {
      const attrs = await Factory.attrs('User');
      expect(attrs.bio).to.exist;
    }));
  });

  describe('sequences', function () {
    it('works with sequences in object initialiser',
      asyncFunction(async function () {
        const seqTest1A = await Factory.build('SequenceTest1');
        const seqTest1B = await Factory.build('SequenceTest1');

        expect(seqTest1A.seq1).to.be.equal(1);
        expect(seqTest1A.seq2).to.be.equal(1);
        expect(seqTest1A.seq3).to.be.equal(1);

        expect(seqTest1B.seq1).to.be.equal(2);
        expect(seqTest1B.seq2).to.be.equal(2);
        expect(seqTest1B.seq3).to.be.equal(2);

        // As per current implementation
        // expect(seqTest1A.seq1).to.be.equal(1);
        // expect(seqTest1A.seq2).to.be.equal(2);
        // expect(seqTest1A.seq3).to.be.equal(1);
        //
        // expect(seqTest1B.seq1).to.be.equal(3);
        // expect(seqTest1B.seq2).to.be.equal(4);
        // expect(seqTest1B.seq3).to.be.equal(2);
      })
    );

    it('works with sequences in function initialiser',
      asyncFunction(async function () {
        const seqTest1A = await Factory.build('SequenceTest2');
        const seqTest1B = await Factory.build('SequenceTest2');

        expect(seqTest1A.seq1).to.be.equal(1);
        expect(seqTest1A.seq2).to.be.equal(1);
        expect(seqTest1A.seq3).to.be.equal(1);

        expect(seqTest1B.seq1).to.be.equal(2);
        expect(seqTest1B.seq2).to.be.equal(2);
        expect(seqTest1B.seq3).to.be.equal(2);

        // As per current implementation
        // expect(seqTest1A.seq1).to.be.equal(1);
        // expect(seqTest1A.seq2).to.be.equal(2);
        // expect(seqTest1A.seq3).to.be.equal(1);
        //
        // expect(seqTest1B.seq1).to.be.equal(3);
        // expect(seqTest1B.seq2).to.be.equal(4);
        // expect(seqTest1B.seq3).to.be.equal(2);
      })
    );
  });
});
