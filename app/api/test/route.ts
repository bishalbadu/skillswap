export async function GET() {
  return Response.json({
    jwt: process.env.JWT_SECRET || "NOT LOADED",
    loaded: !!process.env.JWT_SECRET,
    length: process.env.JWT_SECRET?.length || 0
  });
}
