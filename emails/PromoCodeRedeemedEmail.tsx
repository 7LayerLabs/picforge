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

interface PromoCodeRedeemedEmailProps {
  userName?: string;
  promoCode: string;
  tier: string;
}

export const PromoCodeRedeemedEmail = ({
  userName,
  promoCode,
  tier,
}: PromoCodeRedeemedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Promo code activated - You now have unlimited access!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You&apos;re All Set!</Heading>

          <Text style={text}>
            Hey{userName ? ` ${userName}` : ''},
          </Text>

          <Section style={successBox}>
            <Text style={successEmoji}>
              ✓
            </Text>
            <Text style={successText}>
              Promo Code Activated
            </Text>
            <Text style={codeText}>
              {promoCode}
            </Text>
          </Section>

          <Text style={text}>
            Welcome to the unlimited club! Your promo code has been successfully redeemed and you now have <strong>{tier}</strong> access.
          </Text>

          <Heading as="h2" style={h2}>
            What You Get Now:
          </Heading>

          <Section style={featureList}>
            <Text style={featureItem}>
              <strong>Unlimited Transformations</strong> - Generate as many images as you want, whenever you want
            </Text>
            <Text style={featureItem}>
              <strong>No Watermarks</strong> - All images are clean and professional
            </Text>
            <Text style={featureItem}>
              <strong>No Daily Limits</strong> - Never hit a wall again
            </Text>
            <Text style={featureItem}>
              <strong>Full Feature Access</strong> - Everything PicForge has to offer
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://pic-forge.com">
              Start Creating
            </Button>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Make the Most of Your Unlimited Access:
          </Heading>

          <Text style={text}>
            Now that you have unlimited transformations, here are some ideas to get the most out of PicForge:
          </Text>

          <Text style={tipItem}>
            <strong>1. Batch Processing</strong> - Transform entire photo libraries at once
          </Text>

          <Text style={tipItem}>
            <strong>2. Experiment Freely</strong> - Try wild prompts without worrying about limits
          </Text>

          <Text style={tipItem}>
            <strong>3. Build Collections</strong> - Create themed galleries of transformations
          </Text>

          <Text style={tipItem}>
            <strong>4. Share Your Work</strong> - Submit your best to our <Link href="https://pic-forge.com/showcase" style={link}>Showcase Gallery</Link>
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Questions or feedback? Hit reply - we love hearing from our unlimited users!
          </Text>

          <Text style={signature}>
            - The PicForge Team
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You&apos;re receiving this because you redeemed a promo code.
            <br />
            <Link href="https://pic-forge.com/profile/emails" style={link}>Manage preferences</Link> | <Link href="https://pic-forge.com/unsubscribe" style={link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PromoCodeRedeemedEmail;

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
  margin: '16px 0 8px',
};

const codeText = {
  color: '#10b981',
  fontSize: '18px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  backgroundColor: '#f0fdf4',
  padding: '8px 16px',
  borderRadius: '4px',
  display: 'inline-block',
  margin: '8px 0 0',
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
