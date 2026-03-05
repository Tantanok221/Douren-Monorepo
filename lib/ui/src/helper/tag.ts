import { z } from "zod";
import { ZodTagObject } from "../stores/useTagFilter";

const ZodTagArray = z.array(ZodTagObject);
type ZodTagArrayType = z.infer<typeof ZodTagArray>;
export class ArrayTagHelper {
  tags: ZodTagArrayType;
  constructor(tag: ZodTagArrayType) {
    this.tags = tag;
  }

  toString() {
    return this.tags.map((x) => x.tag).join(",");
  }
}
