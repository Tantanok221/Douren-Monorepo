export interface CloudflareImageResponse {
  result: Result;
  success: boolean;
  errors: any[];
  messages: any[];
}

interface Result {
  id: string;
  filename: string;
  uploaded: string;  // Date string in ISO format
  requireSignedURLs: boolean;
  variants: string[];
}
