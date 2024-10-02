import {describe, expect, test} from "vitest";
import {app} from "../index";
import {create} from "node:domain";

const MOCK_ENV = {
  DEV_VARS: "dev"
};

describe("Test Artist Routes", () => {
  test("GET /artist", async () => {
    const res = await app.request("/artist?sort=Author_Main(Author),asc&page=1&searchtable=Author_Main.Author");
    let [resJson]: any[] = await res.json();
    expect(res.status).toBe(200);
    const payload = resJson.data
    expect(payload.length).toBe(40)
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
      const [data]: any[] = await res.json()
      expect(res.status).toBe(200)
      createdId = data?.uuid
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
    const [resJson]:any[] = await res.json()
    expect(resJson.author).toBe("dummy3")

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
