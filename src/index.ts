import Vue, { VueConstructor } from 'vue';
import hypernova, { load } from 'hypernova';
import { findNode, getData } from 'nova-helpers';
import { CombinedVueInstance } from 'vue/types/vue';

type HypernovaPayload = {
  node: HTMLElement;
  data: any;
}

type VueInstance = CombinedVueInstance<Vue, object, object, object, object>

type VueWithStoreInstance =
  CombinedVueInstance<Vue, object, object, object, object> & { $store: any };

export { default as Vue } from 'vue';

export { load } from 'hypernova';

export const mountComponent = (
  Component: VueConstructor,
  node: HTMLElement,
  data: any,
): VueInstance => {
  const vm = new Component({
    propsData: data,
  });

  if (!node.childElementCount) {
    node.appendChild(document.createElement('div'));
  }

  vm.$mount(node.children[0]);

  return vm;
};

export const renderInPlaceholder = (
  name: string,
  Component: VueConstructor,
  id: string,
): VueInstance => {
  const node: HTMLElement = findNode(name, id);
  const data: any = getData(name, id);

  if (node && data) {
    return mountComponent(Component, node, data);
  }

  return null;
};

export const loadById = (name: string, id: string): HypernovaPayload => {
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

export const renderVue = (name: string, Component: VueConstructor): void => hypernova({
  server() {
    throw new Error('Use hypernova-vue/server instead');
  },

  client() {
    const payloads = load(name);
    if (payloads) {
      payloads.forEach((payload: HypernovaPayload) => {
        const { node, data: propsData } = payload;

        mountComponent(Component, node, propsData);
      });
    }

    return Component;
  },
});

export const renderVuex = (
  name: string,
  ComponentDefinition: any,
  createStore: Function,
): void => hypernova({
  server() {
    throw new Error('Use hypernova-vue/server instead');
  },

  client() {
    const payloads = load(name);
    if (payloads) {
      payloads.forEach((payload: HypernovaPayload) => {
        const { node, data } = payload;
        const { propsData, state } = data;

        const store = createStore();
        store.replaceState(state);

        const Component: VueConstructor = Vue.extend({
          ...ComponentDefinition,
          store,
        });

        const vm = mountComponent(Component, node, propsData) as VueWithStoreInstance;
      });
    }

    return ComponentDefinition;
  },
});
