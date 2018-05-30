import HelloWorld from '@/components/HelloWorld';

describe('HelloWorld', () => {
  it('should render correct contents', () => {
    expect(element.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your App');
  });
});
