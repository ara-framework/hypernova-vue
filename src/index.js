import vue from 'vue';
import hypernova, { load } from 'hypernova';
import { findNode, getData } from 'nova-helpers';

const { document } = global;

export const Vue = vue;

export { load } from 'hypernova';

export const mountComponent = (Component, node, data) => {
  const vm = new Component({
    propsData: data,
  });

  if (!node.firstChild) {
    node.appendChild(document.createElement('div'));
  }

  vm.$mount(node.children[0]);

  return vm;
};

export const renderInPlaceholder = (name, Component, id) => {
  const node = findNode(name, id);
  const data = getData(name, id);

  if (node && data) {
    return mountComponent(Component, node, data);
  }

  return null;
};

export const loadById = (name, id) => {
  const node = findNode(name, id);
  const data = getData(name, id);

  if (node && data) {
    return {
      node,
      data,
    };
  }

  return null;
};

export const renderVue = (name, Component) => hypernova({
  server() {
    throw new Error('Use hypernova-vue/server instead');
  },

  client() {
    const payloads = load(name);
    if (payloads) {
      payloads.forEach((payload) => {
        const { node, data: propsData } = payload;

        mountComponent(Component, node, propsData);
      });
    }

    return Component;
  },
});


export const renderVuex = (name, ComponentDefinition, createStore) => hypernova({
  server() {
    throw new Error('Use hypernova-vue/server instead');
  },

  client() {
    const payloads = load(name);
    if (payloads) {
      payloads.forEach((payload) => {
        const { node, data } = payload;
        const { propsData, state } = data;

        const store = createStore();

        const Component = Vue.extend({
          ...ComponentDefinition,
          store,
        });

        const vm = mountComponent(Component, node, propsData);

        vm.$store.replaceState(state);
      });
    }

    return ComponentDefinition;
  },
});
