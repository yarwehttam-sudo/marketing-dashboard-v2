// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const NOTION_DATABASE_ID = "410f33a7-f6c2-402d-849f-8b085c6110e6";
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";

interface ContactFormData {
  name: string;
  phone?: string;
  email: string;
  message?: string;
  state?: string;
  monthlyBill?: number | string;
  productInterest?: string[];
}

async function createNotionLead(data: ContactFormData) {
  const productOptions = (data.productInterest ?? [])
    .filter((p) => ["Solar Panels", "Home Battery", "EV Charger"].includes(p))
    .map((name) => ({ name }));

  const billNumber =
    typeof data.monthlyBill === "number"
      ? data.monthlyBill
      : data.monthlyBill
        ? parseFloat(String(data.monthlyBill).replace(/[^0-9.]/g, ""))
        : undefined;

  const properties: Record<string, unknown> = {
    "Contact Name": { title: [{ text: { content: data.name } }] },
    Email: { email: data.email },
    Phone: { phone_number: data.phone || null },
    Notes: { rich_text: [{ text: { content: data.message || "" } }] },
    State: { rich_text: [{ text: { content: data.state || "" } }] },
    "Lead Source": { select: { name: "Website" } },
    "Pipeline Stage": { select: { name: "New Lead" } },
    Priority: { select: { name: "Warm" } },
  };

  if (billNumber && !isNaN(billNumber)) {
    properties["Monthly Electric Bill"] = { number: billNumber };
  }

  if (productOptions.length > 0) {
    properties["Product Interest"] = { multi_select: productOptions };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({ parent: { database_id: NOTION_DATABASE_ID }, properties }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Notion API error:", JSON.stringify(error, null, 2));
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body: ContactFormData = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const emailResult = await resend.emails.send({
      from: "SR Energy Website <noreply@srenergy.us>",
      to: ["JoinUs@SREnergy.US"],
      subject: `New Lead: ${body.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone || "N/A"}</p>
        <p><strong>State:</strong> ${body.state || "N/A"}</p>
        <p><strong>Monthly Electric Bill:</strong> ${body.monthlyBill || "N/A"}</p>
        <p><strong>Product Interest:</strong> ${body.productInterest?.join(", ") || "N/A"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${body.message || "No message provided."}</p>
      `,
    });

    let notionResult;
    try {
      notionResult = await createNotionLead(body);
    } catch (notionError) {
      console.error("Failed to create Notion lead:", notionError);
      return NextResponse.json({ success: true, warning: "Lead saved via email but Notion sync failed." });
    }

    return NextResponse.json({
      success: true,
      emailId: emailResult.data?.id,
      notionPageId: notionResult?.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
