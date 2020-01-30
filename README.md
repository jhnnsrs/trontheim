# Oslo
[![Netlify Status](https://api.netlify.com/api/v1/badges/7096184f-28d9-4309-a194-dea2d1d71799/deploy-status)](https://app.netlify.com/sites/arnheim/deploys)

### Idea

This is a basic implementation of the Oslo Frontend for the Arnheim Framework, that seeks to implement a working pipeline for the processing
and analysis of microscopic data. Arnheim uses Docker-Containers to ensure most of its workflow is as modular and scalable as
possible. This Repository contains
 * Oslo (the Frontend, react-based orchestrator of the modules)
 

### Prerequisites

As Oslo is based on react and therefore Node it needs a working Node installation running on your Machine
(detailed instructions found on [Node.js](https://nodejs.org/en/))


### Installing

Once this repository is cloned, cd into the parent directory and run

```
npm install
```

This should cause the initial installation of all required libraries through npm, (please be patient)

### Running

From now on you can run the project through 
```
npm start
```

The server should now bind on "localhost:3000"


### Accessing your local Bergen instance

Oslo is just the frontend for your Bergen instance, so in order to connect to your local server adjust the
endpoints.js in the "src/constants" to your needs, populate and Instance after you setup a new Oauth Application on your backend
(http://localhost/o/applications) (refer to [django-oauth-toolkit](https://django-oauth-toolkit.readthedocs.io/en/latest/rest-framework/getting_started.html) for more information)


### Testing and Documentation

So far Oslo does not provide unit-tests and is in desperate need of documentation,
please beware that you are using an Alpha-Version


### And coding style tests

Explain what these tests test and why

```
Give an example
```

### Build with

- [Stavanger](https://github.com/jhnnsrs/) - a yet to be released framework for redux, rxjs state management
- [React js ](https://facebook.github.io/react/)
- [Redux js ](http://redux.js.org/)
- [react-router-dom ](https://github.com/ReactTraining/react-router)
- [react-redux ](https://github.com/reactjs/react-redux)
- [react-router-dom ](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)
- [redux-observable ](https://redux-observable.js.org)
- [Rxjs - Rxjs v6](https://github.com/ReactiveX/rxjs)
- [reactstrap - Easy to use React Bootstrap 4 components](https://reactstrap.github.io/)
- [react-loadable - 5.4.0](https://github.com/jamiebuilds/react-loadable)


#### Features

- Scss
- [Domain-style](https://github.com/reactjs/redux/blob/master/docs/faq/CodeStructure.md) for code structure
- Bundle Size analysis
- Code splitting with [react-loadable](https://github.com/jamiebuilds/react-loadable)


## Roadmap

This is considered pre-Alpha so pretty much everything is still on the roadmap


### Adding new Node/Module/Feature

- Create a Module/Feature folder at `src/nodes`
like - - `src/nodes/MaxISP`
Feature folder must contain booststrap file named `index.js` and css file 'style.css' at root

Like -

- `src/nodes/MaxISP/index.js`
- `src/nodes/MaxISP/style.css`

Next as per need, add sub folders like -

- `src/home/actions/`
- `src/nodes/MaxISP/components/`

See reference implementations in the src/nodes directory


## Styling

we are using `scss` Preprocessor. Create a feature/domain specfic scss file, example - `src/home/style.scss`

After compilation the new corresponding CSS file next to it.
example - `src/home/style.css`

Finally you can import that css file in `LoginApp.js` file
example - `src/home/LoginApp.js` will import `src/home/style.css`

## Analyzing the Bundle Size

We can Analyze and debug JavaScript (or Sass or LESS) code bloat through source maps and [source-map-explorer](https://www.npmjs.com/package/source-map-explorer) great tool for this.

The source map explorer determines which file each byte in your minified code came from. It shows you a treemap visualization to help you debug where all the code is coming from.

To analyzing bundle, run command -

`$ npm run analyze` / `$ yarn analyze`




## Deployment

Contact the Developer before you plan to deploy this App, it is NOT ready for public release

## Versioning

There is not yet a working versioning profile in place, consider non-stable for every release 

## Authors

* **Johannes Roos ** - *Initial work* - [jhnnsrs](https://github.com/jhnnsrs)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is yet to be licensed. Consider Private 

## Acknowledgments

* EVERY single open-source project this library used (the list is too extensive so far)

