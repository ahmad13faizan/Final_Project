export const formConfig = [
  {
    fieldName: "roleArn",
    label: "Paste the copied Role ARN below",
    placeholder: "Enter the IAM Role ARN",
    helperText: "Invalid IAM Role ARN format",
    type: "text"
  },
  {
    fieldName: "accountId",
    label: "Account ID",
    placeholder: "Enter the Account ID",
    helperText: "Invalid Account ID format",
    type: "text"
  },
  {
    fieldName: "accountName",
    label: "Account Name",
    placeholder: "Enter the Account Name",
    helperText: "Invalid Account Name format",
    type: "text"
  },
  {
    fieldName: "region",
    label: "AWS Region",
    placeholder: "Select AWS Region",
    helperText: "Region is required",
    type: "select",
    options: [
      { "value": "us-east-1", "label": "US East (N. Virginia)" },
      { "value": "us-east-2", "label": "US East (Ohio)" },
      { "value": "us-west-1", "label": "US West (N. California)" },
      { "value": "us-west-2", "label": "US West (Oregon)" },
      { "value": "af-south-1", "label": "Africa (Cape Town)" },
      { "value": "ap-east-1", "label": "Asia Pacific (Hong Kong)" },
      { "value": "ap-south-2", "label": "Asia Pacific (Hyderabad)" },
      { "value": "ap-southeast-3", "label": "Asia Pacific (Jakarta)" },
      { "value": "ap-southeast-4", "label": "Asia Pacific (Melbourne)" },
      { "value": "ap-south-1", "label": "Asia Pacific (Mumbai)" },
      { "value": "ap-northeast-3", "label": "Asia Pacific (Osaka)" },
      { "value": "ap-northeast-2", "label": "Asia Pacific (Seoul)" },
      { "value": "ap-southeast-1", "label": "Asia Pacific (Singapore)" },
      { "value": "ap-southeast-2", "label": "Asia Pacific (Sydney)" },
      { "value": "ap-southeast-7", "label": "Asia Pacific (Thailand)" },
      { "value": "ap-northeast-1", "label": "Asia Pacific (Tokyo)" },
      { "value": "ca-central-1", "label": "Canada (Central)" },
      { "value": "ca-west-1", "label": "Canada West (Calgary)" },
      { "value": "eu-central-1", "label": "Europe (Frankfurt)" },
      { "value": "eu-west-1", "label": "Europe (Ireland)" },
      { "value": "eu-west-2", "label": "Europe (London)" },
      { "value": "eu-south-1", "label": "Europe (Milan)" },
      { "value": "eu-west-3", "label": "Europe (Paris)" },
      { "value": "eu-south-2", "label": "Europe (Spain)" },
      { "value": "eu-north-1", "label": "Europe (Stockholm)" },
      { "value": "eu-central-2", "label": "Europe (Zurich)" },
      { "value": "il-central-1", "label": "Israel (Tel Aviv)" },
      { "value": "me-south-1", "label": "Middle East (Bahrain)" },
      { "value": "me-central-1", "label": "Middle East (UAE)" },
      { "value": "sa-east-1", "label": "South America (São Paulo)" },
      { "value": "cn-north-1", "label": "China (Beijing)" },
      { "value": "cn-northwest-1", "label": "China (Ningxia)" },
      { "value": "us-gov-east-1", "label": "AWS GovCloud (US-East)" },
      { "value": "us-gov-west-1", "label": "AWS GovCloud (US-West)" },
      { "value": "mx-central-1", "label": "Mexico (Central)" }
    ]
  }
];
