import { createSSRApp, Component, Plugin } from 'vue';
import { renderToString } from 'vue/server-renderer';
import hypernova, { serialize } from 'hypernova';
import { Plugins } from './typings';

async function renderServerSide(
  component: Component,
  props: Record<string, unknown>,
  plugins: { plugin: Plugin; options: [] }[],
  name: string,
) {
  const app = createSSRApp(component, props);

  plugins.forEach(({
    plugin,
    options,
  }) => {
    app.use(plugin, ...options);
  });

  const contents = await renderToString(app);

  return serialize(name, contents, props);
}

export const renderVue = (
  name: string,
  component: Component,
  plugins: Plugins = [],
): void => hypernova({
  server() {
    return async (props: Record<string, unknown>): Promise<string> => renderServerSide(
      component,
      props,
      plugins,
      name,
    );
  },

  client() {
    throw new Error('Use hypernova-vue instead');
  },
});

export const renderVuex = (
  name: string,
  ComponentDefinition: Component,
  createStore: () => Plugin,
): void => hypernova({
  server() {
    return async (propsData: Record<string, unknown>): Promise<string> => {
      const store = createStore();

      return renderServerSide(
        ComponentDefinition,
        propsData,
        [{ plugin: store, options: [] }],
        name,
      );
    };
  },

  client() {
    throw new Error('Use hypernova-vue instead');
  },
});
