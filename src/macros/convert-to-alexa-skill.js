const util = require("util");

module.exports = function convertToAlexaSkill(arc, cloudformation, stage) {
  // Events in Architect only trigger based on SNS — change our event to trigger
  // based on an Alexa skill
  cloudformation.Resources.CapitalCitiesSkill.Properties.Events.CapitalCitiesSkillEvent = {
    Type: "AlexaSkill",
    Properties: {
      SkillId: "amzn1.ask.skill.c63b45f9-5e33-4271-8386-bfe42c60117b",
    },
  };
  delete cloudformation.Resources.CapitalCitiesSkillTopic;
  delete cloudformation.Resources.CapitalCitiesSkillTopicParam;

  // Remove the SNS policy and topic since we don't need it
  cloudformation.Resources.Role.Properties.Policies = cloudformation.Resources.Role.Properties.Policies.filter(
    (policy) => policy.PolicyName !== "ArcSimpleNotificationServicePolicy"
  );
  delete cloudformation.Outputs.CapitalCitiesSkillSnsTopic;

  //console.log(util.inspect(cloudformation, { depth: null }));

  return cloudformation;
};
