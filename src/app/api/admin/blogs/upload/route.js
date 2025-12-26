import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file" }), { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = Date.now() + "-" + file.name;
  const path = join(process.cwd(), "public/uploads", filename);

  await writeFile(path, buffer);

  return new Response(JSON.stringify({ filename }), { status: 200 });
}
