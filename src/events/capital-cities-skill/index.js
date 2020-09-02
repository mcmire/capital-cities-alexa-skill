const { getRequestType, getIntentName, getSlotValue, SkillBuilders } = require('ask-sdk-core');
const _ = require('lodash');
const CAPITALS_BY_STATE_NAME = _.reduce(
    require('datasets-us-states-names-capitals'),
    (obj, capital, stateName) => {
        const newObj = _.clone(obj);
        newObj[stateName.toLowerCase()] = capital;
        return newObj;
    },
    {}
);

function randomAnswerFrom(answers, numberOfTries) {
    if (numberOfTries > answers.length - 1) {
        const currentIndex = numberOfTries % answers.length;
        return _.sample(_.difference(answers, [answers[currentIndex]]));
    } else {
        return answers[numberOfTries];
    }
}

const launchRequestHandler = {
    canHandle(input) {
        return getRequestType(input.requestEnvelope) === 'LaunchRequest';
    },
    handle(input) {
        const output = "Welcome to Capitalpedia. You can ask me the capital of any US state and I'll tell you!";
        const reprompt = "Ask me for the capital of a US state and I'll give you the answer.";

        return input
            .responseBuilder
            .speak(output)
            .reprompt(reprompt)
            .getResponse();
    }
};

const lookUpCapitalIntentHandler = {
    canHandle(input) {
        return (
            getRequestType(input.requestEnvelope) === 'IntentRequest' &&
            getIntentName(input.requestEnvelope) === 'LookUpCapital'
        );
    },
    handle(input) {
        const state = getSlotValue(input.requestEnvelope, 'state');
        const sessionAttributes = input.attributesManager.getSessionAttributes();
        let numberOfTries = sessionAttributes.numberOfTries;
        if (numberOfTries == null) {
            numberOfTries = 0;
        }

        const capital = CAPITALS_BY_STATE_NAME[state.toLowerCase()];
        let output;

        if (capital != null) {
            output = `The capital of ${state} is ${capital}.<break time='0.5s' />Would you like to ask something else?`;
            input.attributesManager.setSessionAttributes(
                _.merge(
                    {},
                    sessionAttributes,
                    { numberOfTries: 0 }
                )
            );
        } else {
            output = randomAnswerFrom(
                [
                    `Hmm... ${state} doesn't sound like a US state to me. Maybe try again?`,
                    `Sorry, I'm not sure what ${state} is. Try another one?`,
                    `Hmm... I'm not familiar with that state. Maybe give me another one?`,
                ],
                numberOfTries
            );
            input.attributesManager.setSessionAttributes(
                _.merge(
                    {},
                    sessionAttributes,
                    { numberOfTries: numberOfTries + 1 }
                )
            );
        }

        const reprompt = "Ask me for the capital of a US state and I'll give you the answer.";

        return input
            .responseBuilder
            .speak(output)
            .reprompt(reprompt)
            .getResponse();
    }
};

const helpIntentHandler = {
    canHandle(input) {
        return getRequestType(input.requestEnvelope) === 'IntentRequest'
            && getIntentName(input.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(input) {
        const output = "I'm an Alexa skill that can tell you the capital of any US state. Isn't that neat? Go ahead and ask me now.";
        const reprompt = "Ask me for the capital of a US state and I'll give you the answer.";

        return input.responseBuilder
            .speak(output)
            .reprompt(reprompt)
            .getResponse();
    }
};

const noOrCancelOrStopIntentHandler = {
    canHandle(input) {
        return (
            getRequestType(input.requestEnvelope) === 'IntentRequest' &&
            (
                getIntentName(input.requestEnvelope) === 'AMAZON.NoIntent' ||
                getIntentName(input.requestEnvelope) === 'AMAZON.CancelIntent' ||
                getIntentName(input.requestEnvelope) === 'AMAZON.StopIntent'
            )
        );
    },
    handle(input) {
        const output = "Okay, thanks for playing!";

        return input.responseBuilder
            .speak(output)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const fallbackIntentHandler = {
    canHandle(input) {
        return (
            getRequestType(input.requestEnvelope) === 'IntentRequest' &&
            getIntentName(input.requestEnvelope) === 'AMAZON.FallbackIntent'
        );
    },
    handle(input) {
        const reprompt = "Ask me for the capital of a US state and I'll give you the answer."
        const output = `I'm sorry, I'm not sure what to do with that. ${reprompt}`;

        return input
            .responseBuilder
            .speak(output)
            .reprompt(reprompt)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const sessionEndedRequestHandler = {
    canHandle(input) {
        return getRequestType(input.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(input) {
        console.log(`~~~~ Session ended: ${JSON.stringify(input.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return input.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const errorHandler = {
    canHandle() {
        return true;
    },
    handle(input, error) {
        const output = "Oh dear... something seems to have gone wrong. There's not much more I can do now. Bye!";

        console.log(`~~~~ FATAL ERROR: ${JSON.stringify(error)}`);

        return input
            .responseBuilder
            .speak(output);
    }
};

exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        launchRequestHandler,
        lookUpCapitalIntentHandler,
        helpIntentHandler,
        noOrCancelOrStopIntentHandler,
        fallbackIntentHandler,
        sessionEndedRequestHandler
    )
    .addErrorHandlers(errorHandler)
    //.withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
