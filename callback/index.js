import React from 'react';
import ReactDOM from 'react-dom';
import Callback from './callback';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faBars, faSpinner);

ReactDOM.render(
  <Callback/>,
  document.getElementById('root')
);
