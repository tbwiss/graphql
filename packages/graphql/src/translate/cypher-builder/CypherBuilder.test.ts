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

import * as CypherBuilder from "./CypherBuilder";

describe("CypherBuilder", () => {
    test("simple relation", () => {
        const movieNode = new CypherBuilder.Node({ alias: "this0", labels: ["Movie"] });
        const idParam = new CypherBuilder.Param("this2");

        const subQuery = new CypherBuilder.Query().create(movieNode, { id: idParam }).return(movieNode);
        // const query = new CypherBuilder.Query().call(subQuery).return(movieNode, ["id"], "this0");

        console.log(query.getCypher());
        //         expect(query.getCypher()).toMatchInlineSnapshot(`
        //     CALL {
        //         CREATE (this0:Movie)
        //             SET this0.id = $this0_id
        //         RETURN this0
        //     }
        //     RETURN this0 { .id } AS this0
        // `)
        //         expect(query.getParams()).toMatchInlineSnapshot()
    });
});
