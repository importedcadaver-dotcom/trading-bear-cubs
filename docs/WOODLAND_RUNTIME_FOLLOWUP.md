# Woodland runtime follow-up

## Base and generated output

The starting commit was PR #26 at `b568200`, which contains PR #23's ribbon mouse and tutorial changes. Both PRs were open and targeted `main` at `42a1ca3` when work started. The root `index.html` is generated from the ten ordered layers, the HTML template, and shared economy helpers. Archived releases are outside the runtime cleanup.

## Live entry points

| Entry | Before | After |
| --- | --- | --- |
| Scene drawing | 10 reassignments, including the v3 switch to the world renderer | One draw entry calls the world, movement, placed amenities, family and hazard, action effect, transfer, actor-activity, encounter, and day passes, in order. The superseded v1 clearing scene and v2 scene wrapper were removed. The v1 terrain and stall primitives still draw the post. |
| Interface rendering | 7 reassignments | One entry calls the core trade and inventory rendering, care, location, tutorial, day details, nearby help, needs, and accessibility. The earlier passes still update real DOM consumers. |
| Settlement | 6 reassignments | Named functions retain the proximity and personal-offer rules, tutorial progression, scene-specific policy, settlement, and completed-trade effects. The staged trade button still intercepts the final confirmation, and the legacy fallback still uses the same authoritative entry. |
| Item actions | 5 reassignments | Named functions retain item transfer effects, story item handling, location and proximity checks, and base inventory behavior. Backpack, hotbar, and context controls continue to call one item-action entry. |

The obsolete v1 canvas pointer listener and its target array were removed. The world-layer pointer listener still owns ground, object, and actor hit testing. Keyboard movement and the contextual Talk and Trade buttons remain available. The save entry still writes browser state and the morning recovery snapshot. Settings export/import, migration, and backups remain in place.

Legacy navigation, scene actions, classic menus and related CSS remain where removing the DOM would require tracing and migrating their existing startup bindings or fallback actions. This pass does not establish parity for removing all hidden UI. Only the four named entry points were consolidated; other layer overrides remain.

## Browser replay

Start a fresh cub. Speak to Mama, eat, then talk to Pebble. Ask Fern about the trail and barter. Investigate the car, search the picnic spot, report to Mama, and sleep. On day two, search the picnic litter before investigating the car and report the discovery. On day three, stay by the den, choose to comfort Pebble when you hear the branch, and sleep.

The dedicated rare cases seed location, inventory state or random state as needed. The human rescue regression reloads after calling Mama before completing the rescue. The Silverfin regression verifies that movement resumes after reaching safety.
