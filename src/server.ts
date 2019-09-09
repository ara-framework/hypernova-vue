import Vue, { VueConstructor } from 'vue';
import { createRenderer } from 'vue-server-renderer';
import { serialize } from 'hypernova';
import * as hypernova from 'hypernova';
import { CombinedVueInstance } from 'vue/types/vue';


type VueWithStoreInstance = CombinedVueInstance<Vue, object, object, object, object> & { $store: any };

export { default as Vue } from 'vue';

export const renderVue = (name: string, Component: VueConstructor): void => hypernova({
  server() {
    return async (propsData: object): Promise<string> => {
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


export const renderVuex = (name: string, ComponentDefinition: any, createStore: Function): void => hypernova({
  server() {
    return async (propsData: object): Promise<string> => {
      const store = createStore();

      const Component = Vue.extend({
        ...ComponentDefinition,
        store,
      });

      const vm = (new Component({
        propsData,
      })) as VueWithStoreInstance;

      const renderer = createRenderer();

      const contents = await renderer.renderToString(vm);

      return serialize(name, contents, { propsData, state: vm.$store.state });
    };
  },

  client() {
    throw new Error('Use hypernova-vue instead');
  },
});
