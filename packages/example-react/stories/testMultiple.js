import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from '../components/Button';

import TestMultipleReadme from './testMultipleReadme.md';

const MultipleStories = props => {
  return (
    <div>
      {props.stories.map((story, index) => (
        <story key={index} />
      ))}
    </div>
  );
};

storiesOf('Multiple stories in single Readme', module)
  .addParameters({
    readme: {
      content: TestMultipleReadme,
    },
  })
  .add('With a single Readme!', () => {
    return (
      <MultipleStories
        stories={[
          <Button label={'Hello Im Button 11111'} />,
          <Button label={'Hello Im Button 22222'} />,
          <Button label={'Hello Im Button 33333'} />,
          1234,
          555555,
        ]}
      />
    );
  });
