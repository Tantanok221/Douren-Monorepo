import {describe, expect, it} from "vitest";
import {processTagConditions} from "./processTagConditions";
import {ilike} from "drizzle-orm";
import {s} from "@pkg/database/db"
describe("Test processTagCondition",() =>{
    it("Should return the correct conditions", () =>{
        const output = processTagConditions("a,b")
        expect(output).toEqual([
            ilike(s.authorMain.tags,"%a%"),
            ilike(s.authorMain.tags,"%b%")
        ])
    })
    it("Should return nothing if theres no tag", () => {
        expect(processTagConditions("")).toEqual([])
    })
})