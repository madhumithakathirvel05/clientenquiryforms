
const allowedServices = new Set([
  "Website Development",
  "E-commerce Website",
  "Website Redesign",
  "SEO and Online Presence",
  "Other"
]);

const allowedBudgets = new Set([
  "Below ₹5,000",
  "₹5,000–₹15,000",
  "₹15,000–₹30,000",
  "₹30,000+",
  "Not decided yet"
]);

function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return Response.json(
      { error: "Database is not configured yet." },
      { status: 503 }
    );
  }

  let body;

  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/json")) {
      return Response.json(
        { error: "Please submit the form using JSON." },
        { status: 415 }
      );
    }

    const rawBody = await request.text();

    if (rawBody.length > 12000) {
      return Response.json(
        { error: "Your submission is too large." },
        { status: 413 }
      );
    }

    body = JSON.parse(rawBody);
  } catch {
    return Response.json(
      { error: "Invalid submission format." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Invalid enquiry details." },
      { status: 400 }
    );
  }

  const name = cleanString(body.name, 100);
  const email = cleanString(body.email, 254).toLowerCase();
  const phone = cleanString(body.phone, 20);
  const service = cleanString(body.service, 80);
  const budget = cleanString(body.budget, 40);
  const message = cleanString(body.message, 3000);

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const phoneDigits = phone.replace(/\D/g, "");

  if (
    !name ||
    !validEmail ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15 ||
    !allowedServices.has(service) ||
    (budget !== "" && !allowedBudgets.has(budget)) ||
    !message
  ) {
    return Response.json(
      { error: "Please check the required fields and try again." },
      { status: 400 }
    );
  }

  try {
    const result = await env.DB.prepare(`
      INSERT INTO enquiries
        (name, email, phone, service, budget, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
      .bind(name, email, phone, service, budget || null, message)
      .run();

    if (!result.success) {
      throw new Error("Database insert failed");
    }

    return Response.json(
      {
        success: true,
        message: "Enquiry submitted successfully."
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "We couldn't save your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
