# Capital Cities

Capital Cities is a tiny Alexa skill that gives you the capital of any US state.

## Development

### Getting started

Run the setup script to install Node and development dependencies:

    bin/setup

### Updating the skill

The skill code is located in `events/capital-cities-skill/index.js`.

When you're done updating the code, run the following to redeploy the Lambda:

    npx arc deploy

### Adding a new dependency

Note that there are two levels of `package.json`s in this project:

1. a project-level file at `/package.json`,
   which holds development dependencies
2. a lambda-level file at `src/<type>/<lambda>/package.json`,
   which holds runtime dependencies for that lambda.

Adding a project-level dependency is pretty straightforward:
simply run:

    npm install --save-dev <package>

Adding a lambda-level dependency, however,
requires being inside the directory that holds the lambda code:

    (cd src/<type>/<lambda>; npm install <package>)

If you choose to modify a lambda-level `package.json` directly,
then you will want to run the following command
to run `npm install` for you:

    npx arc hydrate

## Provisioning the stack

See the [Provisioning](PROVISIONING.md) document.

## Architecture

* [Architect] for provisioning and deploying to AWS
* [AWS Lambda] for hosting the Alexa skill code
* [ask-sdk] for implementing the skill code
* Node.js (but you probably already knew that)

[Architect]: https://arc.codes
[AWS Lambda]: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
[ask-sdk]: https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/overview.html

## Author/License

© 2020 Elliot Winkler (<elliot.winkler@gmail.com>).
Released under the [un-license](LICENSE).
