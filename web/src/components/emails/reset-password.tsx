import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

const ResetPasswordEmail = ({
  firstName,
  resetLink,
}: {
  firstName: string;
  resetLink: string;
}) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Reset your Smart Energy Dashboard password</Preview>
        <Body className="bg-[#f6f9fc] font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[20px] mx-auto my-0 max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-[#1f2937] mb-[24px] mt-[16px]">
                Reset Your Password
              </Heading>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                Hello, {firstName}
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[24px]">
                We received a request to reset your password for your Smart
                Energy Dashboard account. Click the button below to create a new
                password:
              </Text>

              <Section className="text-center mb-[24px]">
                <Button
                  className="bg-[#0f766e] rounded-[8px] text-white font-bold py-[12px] px-[24px] no-underline text-center box-border"
                  href={resetLink}
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                This link will expire in 24 hours for security reasons.
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                If you didn&apos;t request a password reset, please ignore this
                email or contact support if you&apos;re concerned about your
                account&apos;s security.
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[24px]">
                If the button above doesn&apos;t work, copy and paste this link
                into your browser:
              </Text>
              <Text className="text-[14px] leading-[24px] text-[#6b7280] break-all mb-[24px]">
                {resetLink}
              </Text>
            </Section>

            <Section className="border-t border-solid border-[#e5e7eb] pt-[24px] mt-[24px]">
              <Text className="text-[14px] text-[#6b7280] m-0">
                © {new Date().getFullYear()} Smart Energy Dashboard. All rights
                reserved.
              </Text>
              <Text className="text-[14px] text-[#6b7280] m-0">
                123 Energy Street, Sheffield, UK
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  firstName: "Jed",
  resetLink:
    "https://smartenergydashboard.com/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
};

export default ResetPasswordEmail;
