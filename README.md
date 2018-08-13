# GDG Action

This action for the Google Assistant provides information about a [Google Developer Group](https://developers.google.com/groups).

## Content
This app uses [Meetup API](https://www.meetup.com/meetup_api/) to get the data of the GDG.

## Localization

This app uses the [i18n-node](https://github.com/mashpie/i18n-node) library to provide
responses in several languages. The responses are listed in the `locales` directory.

## Translation
This app uses [Cloud Translation API](https://cloud.google.com/translate/docs/) to translate the data from the meetup api, when the user's language does not match the GDG's primary language. [Pricing Infomation](https://cloud.google.com/translate#translation-api-pricing).

## Setup Instructions

### Configuration
The following values need to be configured in the `config.js` file:
1. `gdgId`: unique identifier for the GDG on Meetup (e.g. `google-developer-group-san-francisco` for `https://www.meetup.com/google-developer-group-san-francisco/`)
1. `gdgName`: short name for the GDG (e.g. `GDG San Francisco`)
1. `meetupKey`: Meetup API key retrieved from https://secure.meetup.com/meetup_api/key/
1. `appLocal`:  GDG's two character language code from https://developers.google.com/actions/localization/languages-locales (e.g. `en`)

Choose one of the two options listed below for setup. You only need to complete one of the two options below to setup this sample.

### Option 1: Add to Dialogflow (recommended)
Click on the **Add to Dialogflow** button below and follow the prompts to create a new agent:
<!-- TODO: Create One Click -->

[![Silly Name Maker](https://storage.googleapis.com/dialogflow-oneclick/deploy.svg "Silly Name Maker")](https://console.dialogflow.com/api-client/oneclick?templateUrl=https%3A%2F%2Fstorage.googleapis.com%2Fdialogflow-oneclick%2Fsilly-name-agent.zip&agentName=ActionsOnGoogleSillyNameMakerSample)

### Option 2: Dialogflow restore and Firebase CLI
1. Use the [Actions on Google Console](https://console.actions.google.com) to add a new project with a name of your choosing and click *Create Project*.
1. Click *Skip*, located on the top right to skip over category selection menu.
1. On the left navigation menu under *BUILD*, click on *Actions*. Click on *Add Your First Action* and choose your app's language(s).
1. Select *Custom intent*, click *BUILD*. This will open a Dialogflow console. Click *CREATE*.
1. Click on the gear icon to see the project settings.
1. Select *Export and Import*.
1. Select *Restore from zip*. Follow the directions to restore from the `gdg.zip` in this repo.
1. Deploy the fulfillment webhook provided in the functions folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
   1. Follow the instructions to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). Make sure to select the project that you have previously generated in the Actions on Google Console and to reply `N` when asked to overwrite existing files by the Firebase CLI.
   1. Run `firebase deploy --only functions` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (gdg): https://${REGION}-${PROJECT}.cloudfunctions.net/gdg`
1. Go back to the Dialogflow console and select *Fulfillment* from the left navigation menu. Enable *Webhook*, set the value of *URL* to the `Function URL` from the previous step, then click *Save*.

### Cloud Translation API
1.  Follow the steps for [Creating a service account](https://cloud.google.com/docs/authentication/production#creating_a_service_account).

### Test on the Actions on Google simulator
1. Open [Dialogflow's *Integrations* page]((https://console.dialogflow.com/api-client/#/agent//integrations)), from the left navigation menu and open the *Integration Settings* menu for Actions on Google.
1. Enable *Auto-preview changes* and Click *Test*. This will open the Actions on Google simulator.
1. Click *View* to open the Actions on Google simulator.
1. Type `Talk to my test app` in the simulator, or say `OK Google, talk to my test app` to any Actions on Google enabled device signed into your developer account.

## Deployment
1. In the [Actions on Google Console](https://console.actions.google.com), under *SETUP*,  click on *Invocation*. Populate the  information for each language. 
1. Under *DEPLOY*,  click on *Directory information* and populate the information for each language.
	- Suggested verbiage for descriptions [here](additional-languages/directory-suggestions.md)
	- **NOTE**: Follow the [GDG Naming and Logo Guides](https://developers.google.com/programs/community/gdg/resources/)
1. Under *DEPLOY*,  click on *Release* and submit the Action for production release.

# Share your Action
Share the [link to your Action](https://developers.google.com/actions/deploy/action-links) via social media using the [#GDGAoG](https://twitter.com/search?f=tweets&q=%23GDGAoG).

For more detailed information on deployment, see the [documentation](https://developers.google.com/actions/dialogflow/deploy-fulfillment).

See the developer guide and release notes at [https://developers.google.com/actions/](https://developers.google.com/actions/) for more details.


## References and How to report bugs
* Actions on Google documentation: [https://developers.google.com/actions/](https://developers.google.com/actions/).
* If you find any issues, please open a bug here on GitHub.
* Questions are answered on [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google).

## How to make contributions?
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

### Translation Support
We are looking to translate this Action into all available languages. More information [here](additional-languages/README.md). 

## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).

## Google+
Actions on Google Developers Community on Google+ [https://g.co/actionsdev](https://g.co/actionsdev).
