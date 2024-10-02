import {describe, expect, test} from "vitest";
import {app} from "../index";

const MOCK_ENV = {
  DEV_ENV: "dev"
};

describe("Test Artist Routes", () => {
  test("GET /artist", async () => {
    const res = await app.request("/artist?sort=Author_Main(Author),asc&page=1&searchtable=Author_Main.Author");
    expect(res.status).toBe(200);
    let resJson:any = await res.json();
    const payload = resJson.data
    expect(payload.length).toBeLessThanOrEqual(40)
  });
  let createdId: string
  test.sequential("POST /artist", async () => {
      const res = await app.request("/artist", {
        method: "POST",
        body: JSON.stringify({
          "author": "dummy2"
        }),
        headers: new Headers({'Content-Type': 'application/json'}),
      }, MOCK_ENV)
      const resJson:any = await res.json()
      expect(res.status).toBe(200)
      createdId = resJson[0].uuid
    }
  )
  test.sequential("PUT /artist/:artistId", async () => {
    const res = await app.request(`/artist/${createdId}`, {
      method: "PUT",
      body: JSON.stringify({
        "author": "dummy3"
      }),
      headers: new Headers({'Content-Type': 'application/json'}),
    }, MOCK_ENV)
    expect(res.status).toBe(200)
    const resJson:any = await res.json()
    expect(resJson[0].author).toBe("dummy3")

  })
  test.sequential("DELETE /artist/:artistId", async () => {
    const res = await app.request(`/artist/${createdId}`, {
      method: "DELETE"
    }, MOCK_ENV)
    expect(res.status).toBe(200)
    const data = await res.json()
    console.log(data)
    return
  })
})
