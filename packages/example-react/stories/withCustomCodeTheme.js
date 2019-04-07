import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from '../components/Button';

import ButtonReadme from '../components/Button/README.md';

const GlobalCodeThemeMD = `
# Global Code Theme

You can set a code theme globally by adding \`codeTheme\` value to \`addParameters\`
at \`config.js\`.

\`\`\`
import { addParameters, addDecorator, configure } from '@storybook/react';
import { addReadme } from 'storybook-readme';

addParameters({
  readme: {
    // You can set the global code theme here. 
    codeTheme: 'dracula'
  }
});

addDecorator(addReadme);

function loadStories() {
  require('../stories');
}

configure(loadStories, module);

\`\`\`

Full lists of themes are at https://highlightjs.org/static/demo/.
To be used with storybook-readme, naming of the code theme should be used in one of these styles. [codeTheme names](https://github.com/tuchk4/storybook-readme/tree/master/packages/storybook-readme/src/styles/codeThemes)
\`\`\`
ex) 'Dracula' -> 'dracula'
    'Atelier Sulphurpool Dark' -> 'atelier-sulphurpool-dark'
    'Xt 256' -> 'xt256'
\`\`\`
`
storiesOf('Custom Code Theme', module)
  .addParameters({
    readme: {
      content: GlobalCodeThemeMD,
      sidebar: ButtonReadme,
    },
  })
  .add('Global(all stories)', () => null)