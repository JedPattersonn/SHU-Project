import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

const OTPEmail = ({ otp, firstName }: { otp: string; firstName: string }) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Your Smart Energy Dashboard verification code</Preview>
        <Body className="bg-[#f6f9fc] font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[20px] mx-auto my-0 max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-[#1f2937] mb-[24px] mt-[16px]">
                Verification Code
              </Heading>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                Hello, {firstName}
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[24px]">
                Please use the following verification code to access your Smart
                Energy Dashboard:
              </Text>

              <Section className="bg-[#f3f4f6] rounded-[8px] py-[24px] px-[24px] text-center mb-[24px]">
                <Text className="text-[32px] font-bold tracking-[5px] text-[#111827] m-0">
                  {otp}
                </Text>
              </Section>

              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                This code will expire in 10 minutes for security reasons.
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[24px]">
                If you didn&apos;t request this code, please ignore this email
                or contact support if you&apos;re concerned about your
                account&apos;s security.
              </Text>
            </Section>

            <Section className="border-t border-solid border-[#e5e7eb] pt-[24px] mt-[24px]">
              <Text className="text-[14px] text-[#6b7280] m-0">
                © {new Date().getFullYear()} Smart Energy Dashboard. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OTPEmail;
