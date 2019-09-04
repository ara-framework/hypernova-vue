import vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
import hypernova, { serialize } from 'hypernova';

export const Vue = vue;

export const renderVue = (name, Component) => hypernova({
  server() {
    return async (propsData) => {
      const vm = new Component({
        propsData,
      });

      const renderer = createRenderer();

      const contents = await renderer.renderToString(vm);

      return serialize(name, contents, propsData);
    };
  },

  client() {
    throw new Error('Use hypernova-vue instead');
  },
});


export const renderVuex = (name, ComponentDefinition, createStore) => hypernova({
  server() {
    return async (propsData) => {
      const store = createStore();

      const Component = Vue.extend({
        ...ComponentDefinition,
        store,
      });

      const vm = new Component({
        propsData,
      });

      const renderer = createRenderer();

      const contents = await renderer.renderToString(vm);

      return serialize(name, contents, { propsData, state: vm.$store.state });
    };
  },

  client() {
    throw new Error('Use hypernova-vue instead');
  },
});
