# Introduction

An updated proof of concept Web editor for smart contract modeling using [DasContract](https://github.com/CCMiResearch/DasContract) v2.0 visual domain specific language.

This is the result of my Computer Science degree thesis project.



Production build: https://das-contract-editor.herokuapp.com



This application is fully written on React. Primarily, it integrates the functionality of bpmn-js and dmn-js, for modeling purposes, alongside with react-jsonschema-form and react-codemirror, for user input; and lastly, react-resizable and react-dropzone to improve usability.



## Dependencies

The main dependencies used are listed.



### Basic

- State management: [React Redux](https://react-redux.js.org)
- Routing: [Reach Router](https://reach.tech/router/)
- UI design: [Bootstrap 5](https://getbootstrap.com) and [Font Awesome](https://fontawesome.com) icons
- Testing: [Jest](https://jestjs.io), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Enzyme](https://enzymejs.github.io/enzyme/)
- Documentation: [JSDoc](https://jsdoc.app)

### Domain specific

- BPMN: [bpmn-js](https://bpmn.io/toolkit/bpmn-js/), [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel) and [bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint)
- DMN: [dmn-js](https://bpmn.io/toolkit/dmn-js/)
- Forms: [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io/) and [react-codemirror](https://uiwjs.github.io/react-codemirror/)

### Others

- Resizable components: [react-resizable](https://github.com/react-grid-layout/react-resizable)
- Dropzone for file load: [react-dropzone](https://react-dropzone.js.org)



## How to run and build

1. Install the dependencies: yarn install

2. Deploy the development server: yarn start

To generate the production build: yarn build