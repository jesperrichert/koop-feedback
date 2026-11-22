export async function auth() {
    const authIdCookie = await cookieStore.get("authId")
    if (!authIdCookie) window.location.href = "/"

    return authIdCookie?.value ?? ""
}