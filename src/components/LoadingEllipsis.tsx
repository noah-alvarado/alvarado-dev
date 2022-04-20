// source: https://github.com/loadingio/css-spinner

import { Component } from 'solid-js';

const LoadingEllipsis: Component = () => {
  return (
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  );
};

export default LoadingEllipsis;
