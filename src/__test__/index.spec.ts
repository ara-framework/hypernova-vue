import Vue, { VNode } from 'vue';
import {
  loadById,
  mountComponent,
  renderInPlaceholder,
  renderVue,
} from '..';

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

    const app = Vue.extend({
      props: ['title'],
      render(h): VNode {
        return h('h1', {}, this.title);
      },
    });

    const node = document.getElementById('app');

    mountComponent(app, node, { title: 'Ara Framework' });

    expect(node.innerHTML).toEqual('<h1>Ara Framework</h1>');
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

    const app = Vue.extend({
      props: ['title'],
      render(h): VNode {
        return h('h1', {}, this.title);
      },
    });

    renderInPlaceholder('Example', app, 'd0a0b082-dad0-4bf2-ae4f-08eff16575b4');

    const expectedHTML = `
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><h1>Ara Framework</h1></div>
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

    const app = Vue.extend({
      props: ['title'],
      render(h): VNode {
        return h('h1', {}, this.title);
      },
    });

    renderVue('Example', app);

    const expectedHTML = `
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><h1>Ara Framework</h1></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b4"><!--{"title":"Ara Framework"}--></script>
      <div data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b5"><h1>Ara Framework 2</h1></div>
      <script type="application/json" data-hypernova-key="Example" data-hypernova-id="d0a0b082-dad0-4bf2-ae4f-08eff16575b5"><!--{"title":"Ara Framework 2"}--></script>
    `;

    expect(document.body.innerHTML).toEqual(expectedHTML);
  });
});
