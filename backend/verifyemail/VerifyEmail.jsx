import { Html, Body, Container, Text } from '@react-email/components';

export default function VerificationEmail({ username , code }) {
  return (
    <Html>
      <Body style={{ fontFamily: 'Arial', backgroundColor: '#f9f9f9' }}>
        <Container style={{ padding: '20px' }}>
            <Text style={{ fontSize: '16px' }}>thanks for registering {username}</Text>
          <Text style={{ fontSize: '16px' }}>Your verification code is:</Text>
          <Text style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '4px' }}>{code}</Text>
          <Text style={{ fontSize: '14px', color: '#666' }}>This code expires in 10 minutes.</Text>
        </Container>
      </Body>
    </Html>
  );
}