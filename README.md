
# GDG Action

This action for the Google Assistant provides information about a [Google Developer Group](https://developers.google.com/groups).

## Content
This app uses [Meetup API](https://www.meetup.com/meetup_api/) to get the data of the GDG.

## Localization

This app uses the [i18n-node](https://github.com/mashpie/i18n-node) library to provide responses in several languages. The responses are listed in the `locales` directory.

## Translation
This app uses [Cloud Translation API](https://cloud.google.com/translate/docs/) to translate the data from the meetup api, when the user's language does not match the GDG's primary language. [Pricing Infomation](https://cloud.google.com/translate#translation-api-pricing).

*Note*: If this is your first Action you published, you'll be added to the [Google Assistant Devloper Community Program](https://developers.google.com/actions/community/overview) where it credits the account associated with your Action with up to $200 of Google Cloud services a month (applicable to Cloud Translate fees) - for a full year!

## Setup Instructions

### Configuration
The following values need to be configured in the `functions/config.js` file:
1. `gdgId`: unique identifier for the GDG on Meetup (e.g. `google-developer-group-san-francisco` for `https://www.meetup.com/google-developer-group-san-francisco/`)
1. `gdgName`: short name for the GDG (e.g. `GDG San Francisco`)
1. `meetupKey`: Meetup API key retrieved from https://secure.meetup.com/meetup_api/key/
1. `appLocal`:  GDG's two character language code from https://developers.google.com/actions/localization/languages-locales (e.g. `en`)

Do not do `projectId`.

### Dialogflow restore
1. Use this link to get to the [Actions on Google Console](https://console.actions.google.com/?inviteCode=gdgaction) to add a new project with a name of your choosing and click *Create Project*.
1. Scroll down to the *More Options* section, and click on the *Conversational* card.
1. On the left navigation menu under *BUILD*, click on *Actions*. Click on *Add Your First Action* and choose your app's language(s).
1. Select *Custom intent*, click *BUILD*. This will open a Dialogflow console.
1. Click *CREATE*.
1. Click on the gear icon to see the project settings.
1. Select *Export and Import*.
1. Select *Restore from zip*. Follow the directions to restore from the `gdg.zip` in this repo.
1. Click *Save*.

### Configuration
The following values need to be configured in the `functions/config.js` file:
1. `projectId`:  Your Project ID

### Enable Cloud Translation API
1. [Select the Cloud Platform project](https://console.cloud.google.com/project) (this should match your Actions on Google project ID). Click *Activate*.
1. Enable billing for your project.
1. [Enable the Cloud Translation API](https://console.developers.google.com/apis/api/translate.googleapis.com/overview?project=). Make sure that it matches the Actions on Google project ID (it may take a few seconds).

### Firebase CLI
1. Deploy the fulfillment webhook provided in the functions folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
   1. Follow the instructions to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). Make sure to select the project that you have previously generated in the Actions on Google Console and to reply `N` when asked to overwrite existing files by the Firebase CLI.
   1. Run `firebase deploy --only functions` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (gdg): https://${REGION}-${PROJECT}.cloudfunctions.net/gdg`
1. Go back to the Dialogflow console and select *Fulfillment* from the left navigation menu. Enable *Webhook*, set the value of *URL* to the `Function URL` from the previous step, then click *Save*.


### Confirm/Add invite code
1. Open the [Actions on Google Console](https://actions-console.google.com/?inviteCode=gdgaction), on the left navigation menu next to *Overview*, click on the *gear* and select *Project settings*.
1. Under *Invite Codes* confirm or add `gdgaction` and click *SAVE*.

### Test on the Actions on Google simulator
1. Open [Dialogflow's *Integrations* page]((https://console.dialogflow.com/api-client/#/agent//integrations)), from the left navigation menu and open the *Integration Settings* menu for Actions on Google.
1. Enable *Auto-preview changes* and Click *Test*. This will open the Actions on Google simulator.
1. Click *View* to open the Actions on Google simulator.
1. Type `Talk to my test app` in the simulator, or say `OK Google, talk to my test app` to any Actions on Google enabled device signed into your developer account.

## Deployment
1. In the [Actions on Google Console](https://console.actions.google.com), under *SETUP*,  click on *Invocation*. Populate the information for each language (the name, ie. GDG San Fransico). Disregard any messaging about matching to the invocation, since we'll add that later, if it does not save, add empty space at the end.  
1. Under *DEPLOY*,  click on *Directory information* and populate the information for *each* language.
	- **Description** Suggested Directory information for descriptions [here](resources.md) for all languages
	- **Images**: Follow the [GDG Naming and Logo Guides](https://developers.google.com/programs/community/gdg/resources/)
	- **Contact details**: Provided your email, you do not need to add a company.
	- **Privacy and Consent**: Follow the "Need help creating a Privacy Policy?". This Action does not save any user data. Make sure that you have this verbiage in every language in the same document. You do not need Terms of Service link.
	- **Additional Information | Catetgory** Social & Communication
	Click Save.
1. Under *DEPLOY*,  click on *Release* and submit the Action for production release.

# Share your Action
Share the [link to your Action](https://developers.google.com/actions/deploy/action-links) via social media using the [#GDGAoG](https://twitter.com/search?f=tweets&q=%23GDGAoG).

For more detailed information on deployment, see the [documentation](https://developers.google.com/actions/dialogflow/deploy-fulfillment).

See the developer guide and release notes at [https://developers.google.com/actions/](https://developers.google.com/actions/) for more details.

### Translation Support
We are looking to translate this Action into all available languages.

### References & Issues
+ Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google), [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/) or [Support](https://developers.google.com/actions/support/).
+ For bugs, please report an issue on Github.
+ Actions on Google [Webhook Boilerplate Template](https://github.com/actions-on-google/dialogflow-webhook-boilerplate-nodejs).
+ [Codelabs](https://codelabs.developers.google.com/?cat=Assistant) for Actions on Google.
+ Actions on Google [Documentation](https://developers.google.com/actions/extending-the-assistant).
+ More info on deploying with [Firebase](https://developers.google.com/actions/dialogflow/deploy-fulfillment).

## Make Contributions
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
