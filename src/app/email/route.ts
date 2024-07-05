import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import env from "@/env";

// eslint-disable-next-line import/prefer-default-export
export async function POST(_: NextRequest): Promise<NextResponse> {
  const email = "hoge@gmail.com";
  const name = "fuga";
  const subject = "piyo";
  const text = "moge";

  try {
    const transporter = nodemailer.createTransport({
      auth: {
        pass: env.NODEMAILER_AUTH_PASS,
        user: env.NODEMAILER_AUTH_USER,
      },
      port: 465,
      secure: true,
      service: "gmail",
    });

    await transporter.verify();

    await transporter.sendMail({
      replyTo: `"${name}" <${email}>`,
      subject: `【Higa Production 公式サイト】${subject}`,
      text,
      to: env.NODEMAILER_AUTH_USER,
    });

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
