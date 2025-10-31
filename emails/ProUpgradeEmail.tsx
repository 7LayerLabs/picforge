import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ProUpgradeEmailProps {
  userName?: string;
  subscriptionId: string;
  planName: string;
  amount: string;
}

export const ProUpgradeEmail = ({
  userName,
  subscriptionId,
  planName = 'Pro',
  amount = '$9.00',
}: ProUpgradeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to PicForge Pro - Unlimited creativity starts now!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to PicForge Pro!</Heading>

          <Text style={text}>
            Hey{userName ? ` ${userName}` : ''},
          </Text>

          <Section style={successBox}>
            <Text style={successEmoji}>
              🎉
            </Text>
            <Text style={successText}>
              You&apos;re Now a Pro User
            </Text>
          </Section>

          <Text style={text}>
            Congratulations! You&apos;ve upgraded to <strong>{planName}</strong> and unlocked unlimited image transformations.
          </Text>

          <Heading as="h2" style={h2}>
            What You Get with Pro:
          </Heading>

          <Section style={featureList}>
            <Text style={featureItem}>
              <strong>Unlimited Daily Transformations</strong> - Generate as many images as you want, whenever you want
            </Text>
            <Text style={featureItem}>
              <strong>No Watermarks</strong> - All images are clean and professional quality
            </Text>
            <Text style={featureItem}>
              <strong>Priority Processing</strong> - Skip the queue and get results faster
            </Text>
            <Text style={featureItem}>
              <strong>Early Access</strong> - Be the first to try new features and effects
            </Text>
            <Text style={featureItem}>
              <strong>Premium Support</strong> - Get help from our team when you need it
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://pic-forge.com">
              Start Creating Without Limits
            </Button>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Make the Most of Your Pro Subscription:
          </Heading>

          <Text style={text}>
            Now that you have unlimited access, here are some pro tips to maximize your creativity:
          </Text>

          <Text style={tipItem}>
            <strong>1. Batch Processing</strong> - Transform entire photo libraries at once with 21 powerful effects
          </Text>

          <Text style={tipItem}>
            <strong>2. Experiment Freely</strong> - Try wild prompts without worrying about limits
          </Text>

          <Text style={tipItem}>
            <strong>3. Build Collections</strong> - Create themed galleries of transformations
          </Text>

          <Text style={tipItem}>
            <strong>4. Use Lock Composition</strong> - Make iterative edits while preserving the original vibe
          </Text>

          <Text style={tipItem}>
            <strong>5. Share Your Work</strong> - Submit your best creations to our <Link href="https://pic-forge.com/showcase" style={link}>Showcase Gallery</Link>
          </Text>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Subscription Details:
          </Heading>

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Plan:</strong> {planName}
            </Text>
            <Text style={detailRow}>
              <strong>Amount:</strong> {amount}/month
            </Text>
            <Text style={detailRow}>
              <strong>Subscription ID:</strong> {subscriptionId}
            </Text>
            <Text style={detailRow}>
              <strong>Next Billing:</strong> One month from today
            </Text>
          </Section>

          <Text style={text}>
            You can manage your subscription anytime from your <Link href="https://pic-forge.com/profile" style={link}>profile page</Link>.
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Thank you for supporting PicForge! We can&apos;t wait to see what you create.
          </Text>

          <Text style={signature}>
            - The PicForge Team
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You&apos;re receiving this because you upgraded to PicForge Pro.
            <br />
            <Link href="https://pic-forge.com/profile/emails" style={link}>Manage preferences</Link> | <Link href="https://pic-forge.com/profile" style={link}>View subscription</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ProUpgradeEmail;

const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const h1 = {
  color: '#000000',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
  padding: '0',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const successBox = {
  backgroundColor: '#d1fae5',
  border: '2px solid #10b981',
  padding: '32px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const successEmoji = {
  color: '#10b981',
  fontSize: '64px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1',
};

const successText = {
  color: '#065f46',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0 0',
};

const featureList = {
  margin: '0 0 24px',
};

const featureItem = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 12px',
  paddingLeft: '20px',
};

const tipItem = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  padding: '20px',
  borderRadius: '8px',
  margin: '16px 0',
};

const detailRow = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#14b8a6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const hr = {
  borderColor: '#e5e5e5',
  margin: '32px 0',
};

const link = {
  color: '#14b8a6',
  textDecoration: 'underline',
};

const signature = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '24px 0 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};
