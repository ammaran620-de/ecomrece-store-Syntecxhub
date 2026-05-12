import AWS from "aws-sdk";

// Configure AWS with credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();

export const generateSignedDownloadUrl = (fileKey: string, expiresInMinutes: number = 60 * 24): string => {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  
  // Create a signed URL for a secure digital product download
  // This URL will expire after the specified time
  const signedUrl = s3.getSignedUrl("getObject", {
    Bucket: bucket,
    Key: fileKey,
    Expires: expiresInMinutes * 60, // S3 expects seconds
    ResponseContentDisposition: `attachment; filename="${fileKey.split('/').pop()}"`,
  });

  return signedUrl;
};
