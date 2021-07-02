# Actions on Google: GDG Sample

This sample demonstrates Actions on Google features for use on Google Assistant including localization ([i18n-node](https://github.com/mashpie/i18n-node)), conversation design, rich responses, and API integrations ([Cloud Translation API](https://cloud.google.com/translate/docs/) and [Meetup API](https://www.meetup.com/meetup_api/)) -- using the [Node.js client library](https://github.com/actions-on-google/actions-on-google-nodejs) and deployed on [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/). Generally, this Action provides information about [Google Developer Groups](https://developers.google.com/groups).

The [i18n-node](https://github.com/mashpie/i18n-node) library helps provide responses in several languages, which are contained in the `functions/locales` directory. Also, [Cloud Translation API](https://cloud.google.com/translate/docs/) translates data from Meetup API when the user's language does not match the GDG's primary language.

:warning: This code sample was built using Dialogflow. We now recommend using [Actions Builder or the Actions SDK](https://developers.google.com/assistant/conversational/overview) to develop, test, and deploy Conversational Actions.

**Attention: GDG Organizers**
This sample can be published on the Google Assistant platform (instructions below).

### Enable Billing
**Required for running this sample**

Cloud Translation API as well as Meetup API use will both require billing enabled in the Cloud Platform Console. For more info on Cloud Translation API, you can visit [Pricing Infomation](https://cloud.google.com/translate#translation-api-pricing). This sample uses Firebase Cloud Functions to make an HTTP request to a non-Google service(Meetup API), which will require an upgrade to a Firebase plan that allows for outbound networking, such as the [Blaze Plan](https://firebase.google.com/pricing/), also called Pay as you go.

## Setup Instructions
### Prerequisites
1. Node.js and NPM
    + We recommend installing using [NVM](https://github.com/creationix/nvm)
1. Install the [Firebase CLI](https://developers.google.com/assistant/actions/dialogflow/deploy-fulfillment)
    + We recommend using version 6.5.0, `npm install -g firebase-tools@6.5.0`
    + Run `firebase login` with your Google account

### Configuration
#### Actions Console
1. From the [Actions on Google Console](https://console.actions.google.com/?inviteCode=gdgaction), New project > **Create project** > under **More options** > **Conversational**
1. From the top menu under **Develop** > **Actions** (left nav) > **Add your first action** > **BUILD** (this will bring you to the Dialogflow console) > Select language and time zone > **CREATE**.
1. In the Dialogflow console, go to **Settings** ⚙ > **Export and Import** > **Restore from zip** using the `agent.zip` in this sample's directory.

#### Cloud Platform Console
1. In the [Google Cloud Platform console](https://console.cloud.google.com/), select your *Project ID* from the dropdown
1. From **Menu ☰** > **APIs & Services** > **Library** > select **Cloud Translation API** > **Enable**

#### Firebase Deployment
1. The following values need to be configured in the `functions/config.js` file:
    + `projectId`:  Your Project ID
    + `gdgId`: unique identifier for the GDG on Meetup (ex: `google-developer-group-san-francisco` for `https://www.meetup.com/google-developer-group-san-francisco/`)
    + `gdgName`: short name for the GDG (ex: `GDG San Francisco`)
    + `appLocal`: language code from https://developers.google.com/assistant/console/languages-locales (ex: `en`, `pt`, `ja`, `es`, `tr`)
1. On your local machine, in the `functions` directory, run `npm install`
1. Run `firebase deploy --project {PROJECT_ID}` to deploy the function
    + To find your **Project ID**: In [Dialogflow console](https://console.dialogflow.com/) under **Settings** ⚙ > **General** tab > **Project ID**.

#### Dialogflow Console
1. Return to the [Dialogflow Console](https://console.dialogflow.com) > select **Fulfillment** > **Enable** Webhook > Set **URL** to the **Function URL** that was returned after the deploy command > **SAVE**.
    ```
    Function URL (dialogflowFirebaseFulfillment): https://${REGION}-${PROJECT_ID}.cloudfunctions.net/dialogflowFirebaseFulfillment
    ```
1. From the left navigation menu, click **Integrations** > **Integration Settings** under Google Assistant > Enable **Auto-preview changes** > **Test** to open the Actions on Google simulator then say or type `Talk to my test app`.

### Running this Sample
+ You can test your Action on any Google Assistant-enabled device on which the Assistant is signed into the same account used to create this project. Just say or type, “OK Google, talk to my test app”.
+ You can also use the Actions on Google Console simulator to test most features and preview on-device behavior.

### Publish your Action on Google Assistant
1. In the [Actions on Google Console](https://console.actions.google.com) > from the top menu **Develop** > **Invocation** (left nav) > add in a **Display name** for each language. For ex: GDG San Francisco)
    + Disregard any messaging about matching to the invocation, since we'll add that later; if it does not save, add empty space at the end.
1. From the top menu **Deploy** > **Directory information** (left nav) and enter all the required information for **each** language > **SAVE**.
    + **Description** Suggested Directory information for descriptions [here](resources.md) for all languages
    + **Images**: Follow the [GDG Naming and Logo Guides](https://developers.google.com/programs/community/gdg/resources/)
    + **Privacy and Consent**: This Action does not save any user data. Make sure that you have this verbiage in every language contained in the same document.
1. Under **Deploy** > **Release** > **SUBMIT FOR PRODUCTION**.

### References & Issues
+ Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google), [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/) or [Support](https://developers.google.com/assistant/support).
+ For bugs, please report an issue on Github.
+ Actions on Google [Webhook Boilerplate Template](https://github.com/actions-on-google/dialogflow-webhook-boilerplate-nodejs).
+ [Codelabs](https://codelabs.developers.google.com/?cat=Assistant) for Actions on Google.
+ Actions on Google [Documentation](https://developers.google.com/assistant).
+ More info on deploying with [Firebase](https://developers.google.com/assistant/actions/dialogflow/deploy-fulfillment).

## Make Contributions
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).
We are looking to translate this Action into all available languages.

## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
