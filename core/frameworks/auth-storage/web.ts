import Cookies from "js-cookie";
import { type IAuthStorage } from "@core/frameworks/auth-storage/interface";

export class AuthStorage implements IAuthStorage {
  private readonly ACCESS_TOKEN_KEY = "access_token";

  public setTokens(accessToken: string, expiresIn: number): void {
    const expiresDate = new Date(Date.now() + expiresIn * 1000);
    Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
      expires: expiresDate,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });
  }

  public async getAccessToken(): Promise<string | null> {
    let token: string | null;

    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      token = (await cookies()).get(this.ACCESS_TOKEN_KEY)?.value ?? null;
    } else {
      token = Cookies.get(this.ACCESS_TOKEN_KEY) ?? null;
    }

    return token;
  }

  public removeTokens(): void {
    Cookies.remove(this.ACCESS_TOKEN_KEY, { path: "/" });
  }
}
