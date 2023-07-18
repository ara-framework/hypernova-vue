import { Component } from 'vue';
import {
  loadById, mountComponent, renderInPlaceholder, renderVue,
} from '..';

interface ComponentProps {
  title: string
}

const component: Component<ComponentProps> = {
  props: ['title'],
  template: '<h1>{{ title }}</h1>',
};

describe('loadById', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should load payload by id', () => {
    document.body.innerHTML = `
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><!--{"title":"Ara Framework"}--></script>
    `;

    const payload = loadById('Example', 'd0a0b082-dad0-4bf2-ae4f-08eff16575b4');

    const { node, data } = payload;

    expect(node.getAttribute('data-hypernova-key')).toEqual('Example');
    expect(node.getAttribute('data-hypernova-id')).toEqual('d0a0b082-dad0-4bf2-ae4f-08eff16575b4');
    expect(data).toEqual({
      title: 'Ara Framework',
    });
  });

  test('should not load payload by id', () => {
    const payload = loadById('Example', 'd0a0b082-dad0-4bf2-ae4f-08eff16575b4');

    expect(payload).toBeNull();
  });
});

describe('mountComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should mount component correctly', () => {
    document.body.innerHTML = '<div id="app"><div>';

    const node = document.getElementById('app');

    mountComponent(component, node, { title: 'Ara Framework' });

    expect(node.innerHTML).toEqual('<h1>Ara Framework</h1>');
  });

  // TODO Does this really matter ?
  xtest('should mount component correctly ignoring html comments', () => {
    document.body.innerHTML = '<div id="app"><!-- Comment --><div>';

    const node = document.getElementById('app');

    mountComponent(component, node, { title: 'Ara Framework' });

    expect(node.innerHTML).toEqual('<!-- Comment --><h1>Ara Framework</h1>');
  });
});

describe('renderInPlaceholder', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render component in placeholder correctly', () => {
    document.body.innerHTML = `
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><!--{"title":"Ara Framework"}--></script>
    `;

    renderInPlaceholder('Example', component, 'd0a0b082-dad0-4bf2-ae4f-08eff16575b4');

    const expectedHTML = `
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4" data-v-app=""><h1>Ara Framework</h1></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><!--{"title":"Ara Framework"}--></script>
    `;
    expect(document.body.innerHTML).toEqual(expectedHTML);
  });
});

describe('renderVue', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render all the components in the body', () => {
    document.body.innerHTML = `
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><!--{"title":"Ara Framework"}--></script>
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b5"></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b5"><!--{"title":"Ara Framework 2"}--></script>
    `;

    renderVue('Example', component);

    const expectedHTML = `
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4" data-v-app=""><h1>Ara Framework</h1></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><!--{"title":"Ara Framework"}--></script>
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b5" data-v-app=""><h1>Ara Framework 2</h1></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b5"><!--{"title":"Ara Framework 2"}--></script>
    `;

    expect(document.body.innerHTML).toEqual(expectedHTML);
  });
});
