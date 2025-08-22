declare module 'bindings' {
  function bindings(name: {
    bindings: string;
    path: string;
  }): any;

  export = bindings;
}
