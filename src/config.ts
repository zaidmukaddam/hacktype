// Configuration: App
export const APP_NAME = "HackType"
export const BASE_URL = "https://hacktype.za16.co"

// Configuration: Metadata
// for SEO: title, description
export const title = `${APP_NAME} - AI Powered Vulnerability Detector`
export const description =
  "HackType is a tool that will help you identify the type of attacks, their risks and how to prevent them."

// Configuration: Metadata - OpenGraph
export const baseOpenGraphMetadata = {
  title,
  description,
  type: "website",
  url: BASE_URL,
  siteName: APP_NAME,
  images: ["/image.png"],
  locale: "en_US",
}

// Configuration: Metadata - Twitter
export const TWITTER_HANDLE = "@zaidmukaddam"
export const baseTwitterMetadata = {
  card: "summary_large_image",
  images: ["/image.png"],
  title,
  description,
  site: TWITTER_HANDLE,
  creator: TWITTER_HANDLE,
}