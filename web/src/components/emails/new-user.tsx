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
  Link,
} from "@react-email/components";

const AccountCreationEmail = ({
  email,
  password,
  firstName,
}: {
  email: string;
  password: string;
  firstName: string;
}) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Your Smart Energy Dashboard account has been created</Preview>
        <Body className="bg-[#f6f9fc] font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[20px] mx-auto my-0 max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-[#1f2937] mb-[24px] mt-[16px]">
                Your Account is Ready
              </Heading>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                Hello, {firstName}
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[24px]">
                An administrator has created an account for you on the Smart
                Energy Dashboard.
              </Text>

              <Section className="bg-[#f3f4f6] rounded-[8px] py-[24px] px-[24px] mb-[24px]">
                <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px] font-bold">
                  Your login credentials:
                </Text>
                <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                  <span className="font-bold">Email:</span> {email}
                </Text>
                <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[0px]">
                  <span className="font-bold">Temporary Password:</span>{" "}
                  {password}
                </Text>
              </Section>

              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                <span className="font-bold text-[#ef4444]">Important:</span> For
                security reasons, please reset your password immediately after
                your first login.
              </Text>

              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[24px]">
                You can access the Smart Energy Dashboard by clicking the button
                below:
              </Text>

              <Section className="text-center mb-[24px]">
                <Link
                  href="http://localhost:3000/login"
                  className="bg-[#10b981] rounded-[8px] text-white font-bold no-underline text-center py-[12px] px-[20px] box-border inline-block"
                >
                  Login to Dashboard
                </Link>
              </Section>

              <Text className="text-[16px] leading-[24px] text-[#4b5563] mb-[12px]">
                If you have any questions or need assistance, please contact our
                support team.
              </Text>
            </Section>

            <Section className="border-t border-solid border-[#e5e7eb] pt-[24px] mt-[24px]">
              <Text className="text-[14px] text-[#6b7280] mb-[8px]">
                © {new Date().getFullYear()} Smart Energy Dashboard. All rights
                reserved.
              </Text>
              <Text className="text-[14px] text-[#6b7280] m-0">
                123 Energy Street, Green City, EC1 2PW
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AccountCreationEmail.PreviewProps = {
  firstName: "Alex",
  email: "alex@example.com",
  password: "TempPwd123!",
};

export default AccountCreationEmail;
