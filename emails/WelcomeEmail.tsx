import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userName?: string;
  userEmail: string;
}

export const WelcomeEmail = ({
  userName,
  userEmail,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to PicForge - Where nothing is real anymore</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to PicForge</Heading>

          <Text style={text}>
            Hey{userName ? ` ${userName}` : ''},
          </Text>

          <Text style={text}>
            You just signed up for the most powerful AI image transformation platform on the internet. Zero artistic talent required.
          </Text>

          <Section style={calloutBox}>
            <Text style={calloutText}>
              <strong>(re)Imagine. Everything.</strong>
            </Text>
            <Text style={calloutSubtext}>
              Nothing is real anymore.
            </Text>
          </Section>

          <Heading as="h2" style={h2}>
            What You Can Do Right Now:
          </Heading>

          <Section style={featureList}>
            <Text style={featureItem}>
              <strong>Transform 20 images today</strong> - Free tier gets you started with 20 daily transformations
            </Text>
            <Text style={featureItem}>
              <strong>272+ AI prompts</strong> - Turn into zombies, Van Gogh paintings, Banksy art, and more
            </Text>
            <Text style={featureItem}>
              <strong>Lock Composition</strong> - Make iterative changes without losing your original vibe
            </Text>
            <Text style={featureItem}>
              <strong>Batch Processing</strong> - Transform 100+ images at once with 21 powerful effects
            </Text>
            <Text style={featureItem}>
              <strong>Transform Roulette</strong> - Spin the wheel for random transformations (320 prompts!)
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://pic-forge.com">
              Start Transforming Images
            </Button>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Quick Tips for Epic Results:
          </Heading>

          <Text style={text}>
            1. <strong>Use Lock Composition</strong> when making iterative edits to preserve your original image structure
          </Text>
          <Text style={text}>
            2. <strong>Try the Template Gallery</strong> - 110+ examples to inspire you
          </Text>
          <Text style={text}>
            3. <strong>Save favorites</strong> - Build your personal prompt library for quick access
          </Text>
          <Text style={text}>
            4. <strong>Check out Roast Mode</strong> - Let AI roast your photos (3 intensity levels)
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Got questions? Hit reply or check out our <Link href="https://pic-forge.com/tips" style={link}>Tips & Tricks</Link> page.
          </Text>

          <Text style={text}>
            Make them weird. Make them epic. Make them yours.
          </Text>

          <Text style={signature}>
            - The PicForge Team
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You&apos;re receiving this because you signed up at <Link href="https://pic-forge.com" style={link}>PicForge.com</Link>
            <br />
            <Link href="https://pic-forge.com/profile" style={link}>Manage preferences</Link> | <Link href="https://pic-forge.com/profile" style={link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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

const calloutBox = {
  backgroundColor: '#14b8a6',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const calloutText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const calloutSubtext = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0',
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
