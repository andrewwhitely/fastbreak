import { NextResponse } from "next/server"
import { testApiKey } from "@/lib/api"

export async function GET() {
  try {
    const apiKey = process.env.BALLDONTLIE_API_KEY

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: "API key not found in environment variables" })
    }

    const isValid = await testApiKey(apiKey)

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "API key is valid" : "API key is invalid or API is unavailable",
    })
  } catch (error) {
    console.error("Error testing API key:", error)
    return NextResponse.json({ valid: false, error: "Error testing API key" }, { status: 500 })
  }
}

