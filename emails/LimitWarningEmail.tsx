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

interface LimitWarningEmailProps {
  userName?: string;
  remainingImages: number;
}

export const LimitWarningEmail = ({
  userName,
  remainingImages,
}: LimitWarningEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You have {String(remainingImages)} images left today - Don&apos;t miss out!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Heads Up!</Heading>

          <Text style={text}>
            Hey{userName ? ` ${userName}` : ''},
          </Text>

          <Section style={warningBox}>
            <Text style={warningNumber}>
              {remainingImages}
            </Text>
            <Text style={warningText}>
              images remaining today
            </Text>
          </Section>

          <Text style={text}>
            You&apos;ve been crushing it with PicForge! You&apos;re down to your last {remainingImages} transformations for today.
          </Text>

          <Text style={text}>
            Your daily limit resets in 24 hours, or you can upgrade now for unlimited transformations.
          </Text>

          <Heading as="h2" style={h2}>
            Want Unlimited Access?
          </Heading>

          <Section style={pricingBox}>
            <Text style={pricingText}>
              <strong>PicForge Pro</strong>
            </Text>
            <Text style={pricingPrice}>
              $9/month
            </Text>
            <Text style={pricingFeatures}>
              Unlimited daily transformations<br />
              No watermarks<br />
              Priority processing<br />
              Early access to new features
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://pic-forge.com/profile">
              Upgrade to Pro
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            <strong>Have a promo code?</strong> Head to your <Link href="https://pic-forge.com/profile" style={link}>profile page</Link> to redeem it for unlimited access.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You&apos;re receiving this because you&apos;re approaching your daily limit.
            <br />
            <Link href="https://pic-forge.com/profile" style={link}>Manage preferences</Link> | <Link href="https://pic-forge.com/profile" style={link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default LimitWarningEmail;

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

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  padding: '32px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const warningNumber = {
  color: '#f59e0b',
  fontSize: '64px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1',
};

const warningText = {
  color: '#92400e',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '8px 0 0',
};

const pricingBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #14b8a6',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const pricingText = {
  color: '#000000',
  fontSize: '20px',
  margin: '0 0 8px',
};

const pricingPrice = {
  color: '#14b8a6',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const pricingFeatures = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0',
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

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};
