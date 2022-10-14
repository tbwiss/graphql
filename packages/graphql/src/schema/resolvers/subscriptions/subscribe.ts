/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { on } from "events";
import { Neo4jGraphQLError } from "../../../classes";
import type Node from "../../../classes/Node";
import type { Context, NodeSubscriptionsEvent, RelationSubscriptionsEvent, SubscriptionsEvent } from "../../../types";
import { filterAsyncIterator } from "./filter-async-iterator";
import { SubscriptionAuth } from "./subscription-auth";
import type { SubscriptionContext } from "./types";
import { updateDiffFilter } from "./update-diff-filter";
import { subscriptionWhere } from "./where";

export function generateSubscriptionResolver(
    node: Node,
    type: "create" | "update" | "delete" | "connect" | "disconnect"
) {
    return (payload: [SubscriptionsEvent], context: Context): SubscriptionsEvent => {
        if (!payload) {
            throw new Neo4jGraphQLError("Payload is undefined. Can't call subscriptions resolver directly.");
        }
        if (["connect", "disconnect"].includes(type)) {
            const relationEventPayload = payload[0] as RelationSubscriptionsEvent;
            const relationFieldName = node.relationFields.find(
                (r) => r.type === relationEventPayload.relationshipName
            )?.fieldName;
            // TODO what if relationFieldName undefinecd
            const relationship = {
                [relationFieldName as string]: {
                    ...relationEventPayload.properties.relationship,
                },
            };
            // (payload[0] as any).relationship = relationship;
        }
        console.log("payload!", payload[0]);
        return payload[0];
    };
}

type SubscriptionArgs = {
    where?: Record<string, any>;
};

export function generateSubscribeMethod(node: Node, type: "create" | "update" | "delete" | "connect" | "disconnect") {
    return (_root: any, args: SubscriptionArgs, context: SubscriptionContext): AsyncIterator<[SubscriptionsEvent]> => {
        if (node.auth) {
            const authRules = node.auth.getRules(["SUBSCRIBE"]);
            for (const rule of authRules) {
                if (!SubscriptionAuth.validateAuthenticationRule(rule, context)) {
                    throw new Error("Error, request not authenticated");
                }
                if (!SubscriptionAuth.validateRolesRule(rule, context)) {
                    throw new Error("Error, request not authorized");
                }
            }
        }

        const iterable: AsyncIterableIterator<[SubscriptionsEvent]> = on(context.plugin.events, type);

        if (["create", "update", "delete"].includes(type)) {
            return filterAsyncIterator<[SubscriptionsEvent]>(iterable, (data) => {
                return (
                    (data[0] as NodeSubscriptionsEvent).typename === node.name &&
                    subscriptionWhere(args.where, data[0], node) &&
                    updateDiffFilter(data[0])
                );
            });
        }

        if (["connect", "disconnect"].includes(type)) {
            return filterAsyncIterator<[SubscriptionsEvent]>(iterable, (data) => {
                // TODO: filter out if no relationship of type data.relationshipName exists on node
                return (
                    (data[0] as RelationSubscriptionsEvent).toTypename === node.name ||
                    (data[0] as RelationSubscriptionsEvent).fromTypename === node.name
                );
            });
        }

        throw Error(`Invalid type in subscription: ${type}`);
    };
}
