import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAI } from "openai"

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


export async function POST(request: Request) {
  const { photo } = await request.json()

  const output = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "system",
        content:
          `You are cyber security expert. You have to recognize the type of attack and give a very detailed respone as follows:
1. Description of the Attack
- Nature of the Attack: Explain what the attack entails and how it is typically executed.
- Common Techniques: Detail the common techniques or methods used in the attack (e.g., phishing emails, malware, DDoS attacks).
2. Risk Classification
- Threat Level: Indicate the severity of the attack (low, medium, high).
- Potential Impact: Describe the potential consequences, such as data theft, financial loss, or operational disruption.
- Targeted Entities: Identify common targets of the attack (individuals, businesses, government agencies)
3. Mitigation Tips
- General Practices: Provide general security practices like regular updates and patches, employee training, etc.
- Technical Measures: Detail technical measures such as firewalls, intrusion detection systems, and anti-malware software.
- Response Strategies: Outline incident response strategies in case an attack occurs, including backup and restore procedures
.`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: photo ?? '',
            },
          }
        ]
      },
    ],
    max_tokens: 1000,
  })

  const visionOutput = output.choices[0].message.content

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    response_format: { "type": "json_object" },
    messages: [
      {
        role: "system",
        content:
          `You are a threat classifier. You have to classify the threat level of the attack given and give a json respone as follows:
          {
            "descriptionOfTheAttack": {
              "natureOfTheAttack": "Explain what the attack entails and how it is typically executed.",
              "commonTechniques": "Detail the common techniques or methods used in the attack (e.g., phishing emails, malware, DDoS attacks)."
            },
            "riskClassification": {
              "threatLevel": "Indicate the severity of the attack (low, medium, high).",
              "potentialImpact": "Describe the potential consequences, such as data theft, financial loss, or operational disruption.",
              "targetedEntities": "Identify common targets of the attack (individuals, businesses, government agencies)."
            },
            "mitigationTips": {
              "generalPractices": "Provide general security practices like regular updates and patches, employee training, etc.",
              "technicalMeasures": "Detail technical measures such as firewalls, intrusion detection systems, and anti-malware software.",
              "responseStrategies": "Outline incident response strategies in case an attack occurs, including backup and restore procedures."
            }
          }`
      },
      {
        role: "user",
        content: `${visionOutput}`,
      },
    ],
    max_tokens: 1000,
    stream: true,
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
