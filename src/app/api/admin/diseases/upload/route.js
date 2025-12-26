import fs from "fs";
import path from "path";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file" }), { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads/diseases");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "_" + file.name;

  fs.writeFileSync(path.join(uploadDir, filename), buffer);

  return new Response(JSON.stringify({ filename }), { status: 200 });
}
