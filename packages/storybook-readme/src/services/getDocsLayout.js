import transformEmojis from './transformEmojis';
import marked from './marked';
import getPropsTables from './getPropsTables';
import { validatePropTables } from './getPropsTables/validatePropTables';
import { getConfig } from './config';

import {
  LAYOUT_TYPE_MD,
  LAYOUT_TYPE_PROPS_TABLE,
  LAYOUT_TYPE_STORY,
  LAYOUT_TYPE_HEADER_MD,
  LAYOUT_TYPE_FOOTER_MD,
  MARKER_HIDDEN,
  MARKER_STORY,
  MARKER_PROPS_TABLE,
} from '../const';

const isMultipleStories = story => {
  if (
    story &&
    story.props &&
    story.props.children &&
    story.props.children.type &&
    story.props.children.type.name === 'MultipleStories' // &&
    // story.props.children.props.stories === 'is an array of react renderable~'
  ) {
    return true;
  }
  return false;
};

function split(md, story, config) {
  const isMultiple = isMultipleStories(story);
  let multipleStories = isMultiple ? story.props.children.props.stories : [];
  return (
    md
      /**
       * Should replace <!-- --> with custom placeholders to allow default md/html comments
       */
      .replace(/<!-- STORY -->/gi, `___{{${LAYOUT_TYPE_STORY}}}___`)
      .replace(MARKER_PROPS_TABLE, `___{{${LAYOUT_TYPE_PROPS_TABLE}}}___`)
      .split(/___{{|}}___/)
      // .split(/<!--|-->/)
      .filter(p => p.trim().length !== 0)
      .map(part => {
        switch (part.trim()) {
          case LAYOUT_TYPE_STORY: {
            if (isMultiple) {
              const firstElement = multipleStories.shift();
              return {
                type: LAYOUT_TYPE_STORY,
                content: firstElement,
              };
            }

            return {
              type: LAYOUT_TYPE_STORY,
              content: story,
            };
          }
          case LAYOUT_TYPE_PROPS_TABLE:
            return {
              type: LAYOUT_TYPE_PROPS_TABLE,
              content: getPropsTables({
                story,
                config,
              }),
            };

          default:
            return {
              type: LAYOUT_TYPE_MD,
              // content: marked(part),
              content: part,
            };
        }
      })
  );
}

function processMd(md) {
  return marked(transformEmojis(md.replace(MARKER_HIDDEN, '')));
}

export default function getDocsLayout({
  md,
  story,
  excludePropTables,
  includePropTables,
}) {
  const mdAsArray = Array.isArray(md) ? [...md] : [md];
  // const mdWithEmojis = mdAsArray.map(md => transformEmojis(md));
  const mdWithEmojis = mdAsArray.map(processMd);

  const main = mdWithEmojis[0];
  const propTables = validatePropTables(excludePropTables, includePropTables);
  const layout = [...split(main, story, propTables)];

  mdWithEmojis.slice(1).map(md => {
    layout.push(...split(md, story, propTables));
  });

  if (layout.findIndex(p => p.type === LAYOUT_TYPE_STORY) === -1) {
    layout.push({
      type: LAYOUT_TYPE_STORY,
      content: story,
    });
  }

  const config = getConfig();
  if (config.footer) {
    layout.push({
      type: LAYOUT_TYPE_FOOTER_MD,
      content: processMd(config.footer),
    });
  }

  if (config.header) {
    layout.unshift({
      type: LAYOUT_TYPE_HEADER_MD,
      content: processMd(config.header),
    });
  }

  return layout;
}
