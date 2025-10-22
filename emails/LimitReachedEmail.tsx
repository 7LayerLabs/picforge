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

interface LimitReachedEmailProps {
  userName?: string;
  resetTime: string;
}

export const LimitReachedEmail = ({
  userName,
  resetTime,
}: LimitReachedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Daily limit reached - Upgrade for unlimited transformations</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Daily Limit Reached</Heading>

          <Text style={text}>
            Hey{userName ? ` ${userName}` : ''},
          </Text>

          <Section style={limitBox}>
            <Text style={limitEmoji}>
              20/20
            </Text>
            <Text style={limitText}>
              You&apos;ve used all your free transformations for today
            </Text>
          </Section>

          <Text style={text}>
            Looks like you&apos;re hooked! You&apos;ve maxed out your 20 daily transformations on the free tier.
          </Text>

          <Text style={text}>
            Your limit resets <strong>{resetTime}</strong>. Or keep the momentum going right now...
          </Text>

          <Heading as="h2" style={h2}>
            Never Hit a Limit Again
          </Heading>

          <Section style={benefitsBox}>
            <Text style={benefitItem}>
              <strong>Unlimited Daily Transformations</strong> - Generate as many images as you want
            </Text>
            <Text style={benefitItem}>
              <strong>No Watermarks</strong> - Clean, professional results
            </Text>
            <Text style={benefitItem}>
              <strong>Priority Processing</strong> - Skip the queue
            </Text>
            <Text style={benefitItem}>
              <strong>Early Access</strong> - Be first to try new features
            </Text>
          </Section>

          <Section style={pricingRow}>
            <Section style={pricingCard}>
              <Text style={pricingLabel}>Monthly</Text>
              <Text style={pricingAmount}>$9</Text>
              <Text style={pricingPer}>per month</Text>
              <Button style={button} href="https://pic-forge.com/profile">
                Get Pro
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Have a Promo Code?
          </Heading>

          <Text style={text}>
            Got a promo code? Redeem it on your <Link href="https://pic-forge.com/profile" style={link}>profile page</Link> for instant unlimited access.
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Questions? Hit reply or check out our <Link href="https://pic-forge.com/tips" style={link}>Tips & Tricks</Link> page.
          </Text>

          <Text style={footer}>
            You&apos;re receiving this because you reached your daily limit.
            <br />
            <Link href="https://pic-forge.com/profile" style={link}>Manage preferences</Link> | <Link href="https://pic-forge.com/profile" style={link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default LimitReachedEmail;

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

const limitBox = {
  backgroundColor: '#fee2e2',
  border: '2px solid #ef4444',
  padding: '32px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const limitEmoji = {
  color: '#ef4444',
  fontSize: '64px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1',
};

const limitText = {
  color: '#991b1b',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '16px 0 0',
};

const benefitsBox = {
  margin: '0 0 32px',
};

const benefitItem = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 12px',
  paddingLeft: '20px',
};

const pricingRow = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const pricingCard = {
  display: 'inline-block',
  backgroundColor: '#f0fdf4',
  border: '2px solid #14b8a6',
  padding: '32px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const pricingLabel = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const pricingAmount = {
  color: '#14b8a6',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1',
};

const pricingPer = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0 24px',
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
  width: '100%',
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
