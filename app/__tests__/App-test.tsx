/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import {reduxRender} from '../src/app/utils/TestUtils';
import {waitFor} from '@testing-library/react-native';

test('renders correctly', async () => {
  await waitFor(() =>
      reduxRender(<App/>)
  );
});
