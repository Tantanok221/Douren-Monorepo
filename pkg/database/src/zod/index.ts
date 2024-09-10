import * as authorMain from "./authorMain.js";
import * as authorMainRelations from "./authorMainRelations.js";
import * as authorProduct from "./authorProduct.js";
import * as authorProductRelations from "./authorProductRelations.js";
import * as event from "./event.js";
import * as eventRelations from "./eventRelations.js";
import * as eventDm from "./eventDm.js";
import * as eventDmRelations from "./eventDmRelations.js";
import * as owner from "./owner.js";
import * as tag from "./tag.js";
import * as authorTag from "./authorTag.js";

export const zodSchema = { authorMain, authorMainRelations, authorProduct, authorProductRelations, event, eventRelations, eventDm, eventDmRelations, owner, tag, authorTag };
