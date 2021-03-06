import { ObjectUtil } from "@marco-eckstein/js-utils";

import { Query } from "./query";
import { getShoppingTags } from "./shopping-tag";

export class ShoppingQuery extends Query {
    tags: { [key: string]: boolean; } = ObjectUtil.toMapObject(getShoppingTags(), true);

    constructor(props: any = null) {
        super(props);
        if (props) {
            this.tags = Object.assign({}, props.tags);
        }
    }
}
