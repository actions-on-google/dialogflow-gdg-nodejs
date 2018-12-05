// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the dialogflow module from the client library.
const {
  dialogflow,
  BasicCard,
  Button,
  Image,
  Suggestions,
  SimpleResponse,
} = require('actions-on-google');

const config = require('./config');

const path = require('path');

// Class defining a Google Developer Group
const Gdg = require('./gdg').Gdg;

// Import the firebase-functions object from the Firebase Function npm module.
const functions = require('firebase-functions');

// Module to sanitize HTML and strip unwanted HTML tags
const sanitizeHtml = require('sanitize-html');

// Modules needed for localization
const i18n = require('i18n');
const moment = require('moment');

i18n.configure({
  directory: path.join(__dirname, '/locales'),
  objectNotation: true,
  fallbacks: {
    'it-IT': 'it',
    'es-419': 'es',
    'es-ES': 'es',
    'es-MX': 'es',
    'es-PE': 'es',
    'de-DE': 'de',
    'pt-BR': 'pt',
    'ja-JP': 'ja',
  },
});

// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');


// Instantiates a client
const translate = new Translate({
  projectId: config.projectId,
});


// Instantiate the Dialogflow client. Returns an instance of DialogflowApp.
const app = dialogflow({debug: true});

const speakPrefix = '<speak> ';
const speakSuffix = ' </speak>';

/** Handles the welcome intent. */
app.intent('Default Welcome Intent', (conv) => {
  // sets up the intent fullfillment tracking that matches to the
  // menu options, 0 is unfulfilled, 1 is fulfilled. This allows
  // suggestion chips to be customized to this conversation.
  conv.localize();
  conv.data.intentFullfilled = [0, 0, 0, 0, 0, 0];
  if (conv.user.last.seen) {
    let messageText = i18n.__('WELCOME_BACK_TEXT', config.gdgName);
    let messageSpeech = speakPrefix +
      i18n.__('WELCOME_BACK_SPEECH', config.gdgName) + speakSuffix;
    conv.ask(new SimpleResponse({
      'speech': messageSpeech,
      'text': messageText,
    }));
    setLastPrompt(conv, messageText);
  } else {
      let messageText = i18n.__('WELCOME_NEW_TEXT', config.gdgName);
      let messageSpeech = speakPrefix +
        i18n.__('WELCOME_NEW_SPEECH', config.gdgName) + speakSuffix;
      conv.ask(new SimpleResponse({
        'speech': messageSpeech,
        'text': messageText,
      }));
      setLastPrompt(conv, messageText);
  }
  conv.ask(new Suggestions(selectSuggestionChips(conv)));
});

/** Handles the Dialogflow intent named 'organizer'. */
app.intent('organizer', (conv) =>
  new Gdg(conv.data.gdgId).getOrganizer().then((organizer) => {
    conv.localize();
    recordIntentAndClearErrorCount(conv, 'organizer');
    let messageText = i18n.__('ORGANIZER_NAME', organizer.name);
    conv.ask(speakPrefix + messageText + speakSuffix);
    // Save the current prompt
    setLastPrompt(conv, messageText);
    // Show a photo of the organizer if the device has a display
    if (conv.screen) {
      if (organizer.photo) {
        conv.ask(new BasicCard({
          title: organizer.name,
          image: new Image({
            url: organizer.photo.photo_link,
            alt: organizer.name,
          }),
          display: 'WHITE',
        }));
      }
    }
    conv.ask(getSingleRandom(i18n.__('ANYTHING_ELSE')),
      new Suggestions(selectSuggestionChips(conv)));
  })
);

/** Handles the Dialogflow intent named 'event' */
app.intent('event', (conv) => {
  conv.localize();
  clearFallbackNoinput(conv);
  let messageText = i18n.__('EVENT');
  setLastPrompt(conv, messageText);
  conv.ask(
    speakPrefix + messageText + speakSuffix,
    // Selects the "next" and "last" event suggestion chips
    new Suggestions([i18n.__('SUGGESTIONS.MENU')[1],
      i18n.__('SUGGESTIONS.MENU')[2]]));
});

/** Handles the Dialogflow intent named 'next event'.
 * This intent is using async because there is a potentional of
 * utilizing translate which will need to use the await feature
 * to ensure that the translation happens before the message
 * is sent
 */
app.intent('next event', async (conv) => {
  const gdg = new Gdg(conv.data.gdgId);
  const event = await gdg.getNextEvent();
  conv.localize();
  recordIntentAndClearErrorCount(conv, 'next event');
  if (!event) {
    let messageText = i18n.__('NO_UPCOMING_EVENT');
    conv.ask(speakPrefix + messageText + speakSuffix);
    setLastPrompt(conv, messageText);
  } else {
    let eventDate = moment(event.local_date).format('LL');
    // if the user's locale is different the project
    // will translate the meetup content
    let userLocale = conv.user.locale.slice(0, 2);
    if (userLocale != config.appLocal) {
      event.name = await translator(event.name, userLocale);
      eventDate = await translator(eventDate, userLocale);
      conv.localize();
    }
    let messageText = i18n.__('NEXT_EVENT', {
      name: event.name,
      date: eventDate,
    });
    conv.ask(messageText);
    setLastPrompt(conv, messageText);
    if (conv.screen) {
        conv.ask(new BasicCard({
          text: event.name,
          buttons: new Button({
            title: event.name,
            url: event.link,
          }),
        }));
    }
  }
  conv.ask(
    getSingleRandom(i18n.__('ANYTHING_ELSE')),
      new Suggestions(selectSuggestionChips(conv))
      );
});

/** Handles the Dialogflow intent named 'last event'.
 * This intent is using async because there is a potentional of
 * utilizing translate which will need to use the await feature
 * to ensure that the translation happens before the message
 * is sent
 */
app.intent('last event', async (conv) => {
  const gdg = new Gdg(conv.data.gdgId);
  const event = await gdg.getNextEvent();
  conv.localize();
  recordIntentAndClearErrorCount(conv, 'last event');
  if (!event) {
    let messageText = i18n.__('NO_UPCOMING_EVENT');
    conv.ask(speakPrefix + messageText + speakSuffix);
      setLastPrompt(conv, messageText);
    } else {
      let eventDate = moment(event.local_date).format('LL');
      // if the user's locale is different the project
      // will translate the meetup content
      let userLocale = conv.user.locale.slice(0, 2);
      if (userLocale != config.appLocal) {
        event.name = await translator(event.name, userLocale);
        eventDate = await translator(eventDate, userLocale);
        conv.localize();
      }
      let messageText = i18n.__('LAST_EVENT', {
        name: event.name,
        date: eventDate,
      });
      conv.ask(messageText);
      setLastPrompt(conv, messageText);
      if (conv.screen) {
        conv.ask(new BasicCard({
          text: event.name,
          buttons: new Button({
            title: event.name,
            url: event.link,
          }),
        }));
      }
    }
    conv.ask(
      getSingleRandom(i18n.__('ANYTHING_ELSE')),
        new Suggestions(selectSuggestionChips(conv))
        );
});

/** Handles the Dialogflow intent named 'members'. */
app.intent('members', (conv) =>
  new Gdg(conv.data.gdgId).getMembers().then((members) => {
    conv.localize();
    recordIntentAndClearErrorCount(conv, 'members');
    let messageText = i18n.__('NUMBER_OF_MEMBERS', members);
    setLastPrompt(conv, messageText);
    conv.ask(
      speakPrefix + messageText + speakSuffix,
      getSingleRandom(i18n.__('ANYTHING_ELSE')),
      new Suggestions(selectSuggestionChips(conv))
    );
  })
);

/** Handles the Dialogflow intent named 'gdg'.
 * This intent is using async because there is a potentional of
 * utilizing translate which will need to use the await feature
 * to ensure that the translation happens before the message
 * is sent
 */
app.intent('gdg', async (conv) => {
  const gdg = new Gdg(conv.data.gdgId);
  // Developer Note: Check your meetup description to make sure
  // it makes sense!
  const description = await gdg.getDescription();
  conv.localize();
  recordIntentAndClearErrorCount(conv, 'gdg');
  // Description is HTML-formatted, let's strip all tags
  const sanitizedDescription = sanitizeHtml(description, {
    allowedTags: [],
    allowedAttributes: [],
  });
  let messageText = sanitizedDescription;
  // if the user's locale is different the project
  // will translate the meetup content
  let userLocale = conv.user.locale.slice(0, 2);
  if (userLocale != config.appLocal) {
    messageText = await translator(sanitizedDescription, userLocale);
  }
  conv.ask(messageText);
  setLastPrompt(conv, messageText);
  conv.ask(
    getSingleRandom(i18n.__('ANYTHING_ELSE')),
    new Suggestions(selectSuggestionChips(conv))
  );
});

/** Handles the Dialogflow intent named 'help' */
app.intent('help', (conv) => {
  conv.localize();
  recordIntentAndClearErrorCount(conv, 'help');
  let messageText = i18n.__('HELP');
  conv.ask(
    speakPrefix + messageText + speakSuffix,
    new Suggestions(selectSuggestionChips(conv))
  );
  setLastPrompt(conv, messageText);
});

/** Handles the Dialogflow intent named 'no input' */
app.intent('no input', (conv) => {
  conv.localize();
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    let messageText = i18n.__('REPROMPT_1');
    conv.ask(messageText);
    setLastPrompt(conv, messageText);
  } else if (repromptCount === 1) {
    let messageText = i18n.__('REPROMPT_2');
    conv.ask(
      messageText,
      new Suggestions(selectSuggestionChips(conv))
    );
    setLastPrompt(conv, messageText);
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
      conv.close(i18n.__('REPROMPT_FINAL'));
  }
});

/** Handles the Dialogflow intent named 'Default Fallback Intent' */
app.intent('Default Fallback Intent', (conv) => {
  conv.localize();
  if (!conv.data.fallbackCount) {
    conv.data.fallbackCount = 0;
  }
  conv.data.fallbackCount++;
  if (conv.data.fallbackCount === 1) {
    let messageText = i18n.__('FALLBACKPROMPT_1');
    setLastPrompt(conv, messageText);
    conv.ask(
      messageText,
      new Suggestions(selectSuggestionChips(conv))
    );
  } else if (conv.data.fallbackCount === 2) {
    let messageText = i18n.__('FALLBACKPROMPT_2_TEXT');
    let messageSpeech = speakPrefix +
      i18n.__('FALLBACKPROMPT_2_SPEECH') + speakSuffix;
    conv.ask(
      new SimpleResponse({
        'speech': messageSpeech,
        'text': messageText,
      }),
      new Suggestions(selectSuggestionChips(conv))
      );
      setLastPrompt(conv, messageText);
  } else {
    conv.data.fallbackCount = 0;
    let messageText = i18n.__('FALLBACKPROMPT_FINAL');
    conv.close(messageText);
  }
});

/** Handles the Dialogflow intent named 'repeat' */
app.intent('repeat', (conv) => {
  conv.localize();
  if (conv.data.lastPrompt) {
    let messageText = getSingleRandom(i18n.__('REPEAT_PREFIX')) +
      conv.data.lastPrompt;
    conv.ask(messageText);
  } else {
    let messageText =i18n.__('WELCOME_BASIC', config.gdgName);
    conv.ask(messageText);
  }
  conv.ask(new Suggestions(selectSuggestionChips(conv)));
});

/** Handles the Dialogflow intent named 'end' */
app.intent('end', (conv) => {
  conv.localize();
  let messageText = getSingleRandom(i18n.__('FAREWELL'));
  conv.close(messageText);
});


app.middleware((conv) => {
  // Keep an instance of the Gdg class in the conversation data
  conv.data.gdgId = config.gdgId;

  conv.localize = () => {
    i18n.setLocale(conv.user.locale);
    moment.locale(conv.user.locale);
  };
});

/** Returns a single random element from some array */
const getSingleRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Sets the last prompt message
 * @param {obj} conv, the conversation object.
 * @param {str} message, the message.
 * @return {null} none.
 */
function setLastPrompt(conv, message) {
  conv.data.lastPrompt = message;
  return null;
}


/**
 * Clears fallback and Noput attribut on conv
 * @param {obj} conv, the conversation object.
 * @return {null} none.
 */
function clearFallbackNoinput(conv) {
  conv.data.fallbackCount = null;
  conv.data.noInput = null;
  return null;
}


/**
 * Converstaional maintiance, where it clears
 * the error counter and records that that
 * particular intent has been selected.
 * @param {obj} conv, the conversation object.
 * @param num conv, the conversation object.
 * @return {null} none.
 */
function recordIntentAndClearErrorCount(conv, intentName) {
  clearFallbackNoinput(conv);
  recordsIntentFullfillment(conv, intentName);
  return null;
}


/**
 * Records which options the user has complete
 * @param {obj} conv, the conversation object.
 * @param num conv, the conversation object.
 * @return {null} none.
 */
function recordsIntentFullfillment(conv, intentName) {
  const convertIntentValue = {
    'gdg': 0,
    'next event': 1,
    'last event': 2,
    'members': 3,
    'organizer': 4,
    };

  conv.data.intentFullfilled[convertIntentValue[intentName]] = 1;
  return null;
}

/**
 * Selects suggestion chips
 * @param {obj} conv, the conversation object.
 * @return [] array of suggestion chips.
 */
function selectSuggestionChips(conv) {
  let suggestions = [];
  for (let i=0; i < conv.data.intentFullfilled.length; i++) {
    if (conv.data.intentFullfilled[i] === 0) {
      suggestions.push(i18n.__('SUGGESTIONS.MENU')[i]);
    }
    if (suggestions.length === 2) {
      return suggestions;
    }
  }
  return suggestions;
}

/**
 * Translates text for locale
 * @param {str} text, the string to translate.
 * @param {str} locale, the two letter locale code.
 * @return {str} the translated string.
 */
const translator = async (text, locale) => {
  const results = await translate.translate(text, locale);
  const translation = results[0];
  return translation;
};


// Set app as a Handlesr for incoming HTTPS requests.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
