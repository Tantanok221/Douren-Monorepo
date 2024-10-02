import {describe, expect, test} from "vitest";
import {app} from "../index";

const MOCK_ENV = {
  DEV_ENV: "dev"
};

describe("Test Event Routes", () => {
  test("GET /event/:eventId/artist", async () => {
    const res = await app.request("/event/2/artist?sort=Author_Main(Author),asc&page=1&searchtable=Author_Main.Author&tag=原創");
    expect(res.status).toBe(200);
    let resJson:any = await res.json();
    const payload = resJson.data
    expect(payload.length).toBeLessThanOrEqual(40)
  });
  let createdId: string
  test.sequential("POST /event/artist", async () => {
      const res = await app.request("/event/artist", {
        method: "POST",
        body: JSON.stringify({
          "boothName": "dummy2",
          "artistId": 1279,
          "eventId": 2
        }),
        headers: new Headers({'Content-Type': 'application/json'}),
      }, MOCK_ENV)
      expect(res.status).toBe(201)
      const resJson:any = await res.json()
      createdId = resJson[0].uuid
    console.log(resJson[0])
    }
  )
  test.sequential("PUT /event/artist", async () => {
    console.log(createdId)
    const res = await app.request(`/event/artist`, {
      method: "PUT",
      body: JSON.stringify({
        "boothName": "dummy3",
        "uuid": createdId,
        "artistId": 1279,
        "eventId": 2
      }),
      headers: new Headers({'Content-Type': 'application/json'}),
    }, MOCK_ENV)
    expect(res.status).toBe(200)
    const resJson:any = await res.json()
    expect(resJson[0].boothName).toBe("dummy3")

  })
  test.sequential("DELETE /event/:eventId/artist/:artistId", async () => {
    const res = await app.request(`/event/2/artist/${createdId}`, {
      method: "DELETE"
    }, MOCK_ENV)
    expect(res.status).toBe(200)
    const data = await res.json()
    console.log(data)
    return
  })
})
