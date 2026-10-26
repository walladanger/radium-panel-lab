import { PRODUCT_NAME } from './brand';

describe('brand', () => {
  describe('PRODUCT_NAME', () => {
    it('is exactly "Radium Panel Lab Studio"', () => {
      expect(PRODUCT_NAME).toStrictEqual('Radium Panel Lab Studio');
    });
  });
});
