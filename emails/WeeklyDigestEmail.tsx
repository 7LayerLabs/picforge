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

interface WeeklyDigestEmailProps {
  userName?: string;
  totalTransformations: number;
  favoritePrompts: string[];
  topImages?: {
    originalUrl: string;
    transformedUrl: string;
    prompt: string;
  }[];
  weekStart: string;
  weekEnd: string;
}

export const WeeklyDigestEmail = ({
  userName,
  totalTransformations,
  favoritePrompts,
  topImages = [],
  weekStart,
  weekEnd,
}: WeeklyDigestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your PicForge weekly recap - {String(totalTransformations)} transformations this week!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Week in Transformations</Heading>

          <Text style={dateRange}>
            {weekStart} - {weekEnd}
          </Text>

          <Text style={text}>
            Hey{userName ? ` ${userName}` : ''},
          </Text>

          <Text style={text}>
            Here&apos;s a look at your creative journey this week on PicForge.
          </Text>

          <Section style={statsBox}>
            <Section style={statItem}>
              <Text style={statNumber}>{totalTransformations}</Text>
              <Text style={statLabel}>Transformations</Text>
            </Section>
            <Section style={statItem}>
              <Text style={statNumber}>{favoritePrompts.length}</Text>
              <Text style={statLabel}>Favorites Saved</Text>
            </Section>
          </Section>

          {topImages.length > 0 && (
            <>
              <Heading as="h2" style={h2}>
                Your Best Transformations This Week
              </Heading>

              <Text style={text}>
                These are your most creative transformations from the past 7 days:
              </Text>

              {topImages.map((image, index) => (
                <Section key={index} style={imageSection}>
                  <Text style={imageLabel}>Transformation #{index + 1}</Text>
                  <Text style={promptText}>&quot;{image.prompt}&quot;</Text>
                  <Section style={imageGrid}>
                    <Img
                      src={image.originalUrl}
                      alt="Original"
                      style={gridImage}
                    />
                    <Text style={arrowText}>→</Text>
                    <Img
                      src={image.transformedUrl}
                      alt="Transformed"
                      style={gridImage}
                    />
                  </Section>
                </Section>
              ))}

              <Section style={ctaSection}>
                <Button style={button} href="https://pic-forge.com/profile">
                  View All My Images
                </Button>
              </Section>
            </>
          )}

          {favoritePrompts.length > 0 && (
            <>
              <Hr style={hr} />

              <Heading as="h2" style={h2}>
                Your Favorite Prompts This Week
              </Heading>

              <Section style={promptList}>
                {favoritePrompts.slice(0, 5).map((prompt, index) => (
                  <Text key={index} style={promptItem}>
                    {prompt}
                  </Text>
                ))}
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Trending This Week
          </Heading>

          <Text style={text}>
            Check out what&apos;s hot in the PicForge community:
          </Text>

          <Text style={trendItem}>
            <strong>New in Prompt Library:</strong> 25+ fresh Banksy-style art prompts
          </Text>

          <Text style={trendItem}>
            <strong>Most Popular:</strong> &quot;Turn into a zombie&quot; is trending again
          </Text>

          <Text style={trendItem}>
            <strong>Feature Spotlight:</strong> Lock Composition for iterative edits
          </Text>

          <Section style={ctaSection}>
            <Button style={buttonSecondary} href="https://pic-forge.com/prompts">
              Browse Prompts
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Keep the creativity flowing! Can&apos;t wait to see what you make next week.
          </Text>

          <Text style={signature}>
            - The PicForge Team
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You&apos;re receiving weekly digests because you&apos;re a PicForge user.
            <br />
            <Link href="https://pic-forge.com/profile" style={link}>Manage preferences</Link> | <Link href="https://pic-forge.com/profile" style={link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WeeklyDigestEmail;

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
  margin: '0 0 16px',
  padding: '0',
  textAlign: 'center' as const,
};

const dateRange = {
  color: '#666666',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 32px',
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

const statsBox = {
  display: 'flex',
  justifyContent: 'space-around',
  backgroundColor: '#f9fafb',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  padding: '32px 16px',
  margin: '24px 0',
};

const statItem = {
  textAlign: 'center' as const,
  flex: '1',
};

const statNumber = {
  color: '#14b8a6',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1',
};

const statLabel = {
  color: '#666666',
  fontSize: '14px',
  margin: '8px 0 0',
};

const imageSection = {
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
};

const imageLabel = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const promptText = {
  color: '#14b8a6',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '0 0 16px',
};

const imageGrid = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
};

const gridImage = {
  width: '45%',
  maxWidth: '200px',
  borderRadius: '8px',
  border: '2px solid #e5e7eb',
};

const arrowText = {
  color: '#14b8a6',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const promptList = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #14b8a6',
  borderRadius: '8px',
  padding: '24px',
  margin: '16px 0',
};

const promptItem = {
  color: '#065f46',
  fontSize: '14px',
  margin: '0 0 8px',
  paddingLeft: '20px',
  position: 'relative' as const,
};

const trendItem = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
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

const buttonSecondary = {
  backgroundColor: '#ffffff',
  border: '2px solid #14b8a6',
  borderRadius: '6px',
  color: '#14b8a6',
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
