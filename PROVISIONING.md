# Provisioning the skill

If you ever need to remove the skill and recreate it,
then follow this guide.

## Provisioning AWS

Use Architect to deploy the app to AWS:

    npx arc deploy

This will create a CloudFormation stack, including a Lambda, to house the skill code.

## Connecting the Lambda to the Alexa skill

1. Log into the AWS Console, then navigate to Lambda.
2. You should see a lambda starting with "CapitalCitiesAlexaSkillStaging-CapitalCitiesSkill" — click on this.
3. Click the copy icon next to the ARN at the top of the page.
4. Go to the Alexa Console, then navigate to your skill.
5. Click on Endpoint in the sidebar,
   then paste the ARN in the "Default Region" field.
5. Click "Save Endpoints".
