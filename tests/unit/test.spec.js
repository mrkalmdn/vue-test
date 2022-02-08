import { shallowMount } from '@vue/test-utils';
import TestComponent from '@/views/TestComponent.vue';
import Child from '@/views/Child.vue';

describe('TestComponent.vue', () => {
  it('checks the p tag if it has a color style of red', () => {
    const wrapper = shallowMount(TestComponent);

    expect(wrapper.find('p').element.style.getPropertyValue('color')).toBe(
      'red'
    );
  });

  it('checks the TestComponent props', () => {
    const wrapper = shallowMount(TestComponent, {
      propsData: {
        item: {
          title: 'Title',
        },
      },
    });

    expect(wrapper.props().item.title).toBe('Title');
  });

  it('checks the props value of the Child component', () => {
    const wrapper = shallowMount(TestComponent);

    expect(wrapper.findComponent(Child).props().testProp).toBe('some-value');
  });

  it('checks the value of an href', () => {
    const wrapper = shallowMount(TestComponent);

    expect(wrapper.find('a').attributes('href')).toBe('https://google.com');
  });

  test('sanity test', () => {
    expect(true).toBe(true);
  });
});
