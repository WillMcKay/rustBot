# Combined In-Game Settings Modal — Design

**Date:** 2026-06-15
**Status:** Approved

## Goal

Merge the `/settings notifications` and `/settings ingame` modals into one modal,
add a per-toggle description to every setting, and separate the two groups with a
visual divider. Drop the two FCM toggles from this modal.

## Background

Settings are Discord slash-command modals built with discord.js 14.26 label
components (`LabelBuilder` + `CheckboxBuilder`). Four subcommands today:
`general`, `notifications`, `ingame`, `battlemetrics`
([src/commands/settings.js](../../../src/commands/settings.js)).

The `notifications` and `ingame` modals each hold 5 checkbox toggles. Combining them
naively as 10 individual checkboxes (+ divider) = 11 top-level modal components.
Discord's classic modal cap was 5 components; the exact ceiling under the new label
system is unverified offline, so a 10-checkbox modal risks rejection at open-time.

## Decision: CheckboxGroup, not individual checkboxes

Use `CheckboxGroupBuilder` — one component holds all toggles of a group as
selectable options, each with a `label` + `description`. This keeps the
at-a-glance checkbox UX, supports descriptions, and reduces the combined modal to
**3 top-level components** (well under any limit):

1. `Label("Notifications")` wrapping a `CheckboxGroup` (3 options)
2. `TextDisplay` divider
3. `Label("In-Game")` wrapping a `CheckboxGroup` (5 options)

Verified to build and serialize against discord.js 14.26.4.
Read back at submit via `interaction.fields.getCheckboxGroup(customId)` → array of
selected option values. Enabled = value present in the array.

## Modal layout

```
In-Game Settings
┌ Notifications ───────────────────────┐
│ ☑ Connection Notify                  │
│ ☑ AFK Notify                         │
│ ☑ Death Notify                       │
─────────── In-Game ───────────────────
┌ In-Game ─────────────────────────────┐
│ ☑ Smart Alarm Notify In-Game         │
│ ☑ Smart Switch Notify In-Game        │
│ ☑ Leader Command Enabled             │
│ ☐ Leader Command Only Paired         │
│ ☑ Vending Machine Notify In-Game     │
└──────────────────────────────────────┘
```

Each option's `default` is set from the current `generalSettings` value.

## Toggle → setting key → description

Notifications group (customId `SettingsNotifGroup`):

| Setting key | Label | Description |
|---|---|---|
| connectionNotify | Connection Notify | Teammate connect/disconnect posted to in-game chat |
| afkNotify | AFK Notify | Teammate going AFK or returning posted to in-game chat |
| deathNotify | Death Notify | Teammate deaths with grid location posted to in-game chat |

In-Game group (customId `SettingsInGameGroup`):

| Setting key | Label | Description |
|---|---|---|
| smartAlarmNotifyInGame | Smart Alarm Notify In-Game | Smart Alarm triggers posted to in-game team chat |
| smartSwitchNotifyInGameWhenChangedFromDiscord | Smart Switch Notify In-Game | Announce in-game when a switch is toggled from Discord |
| leaderCommandEnabled | Leader Command Enabled | Allow `!leader` to grant team leader in-game |
| leaderCommandOnlyForPaired | Leader Command Only Paired | Restrict `!leader` to paired users only |
| itemAvailableInVendingMachineNotifyInGame | Vending Machine Notify In-Game | Announce in-game when a tracked vending item restocks |

Divider `TextDisplay` content: `### ─────────── In-Game ───────────` (tunable).

## FCM toggles — removed from this modal only

`fcmAlarmNotificationEnabled` and `fcmAlarmNotificationEveryone` are dropped from the
modal. They remain:
- functional — read by [src/util/FcmListener.js:445](../../../src/util/FcmListener.js)
- editable — separate button toggle at
  [src/handlers/buttonHandler.js:164](../../../src/handlers/buttonHandler.js)
- defaulted in the template (`false`)

No field, listener, or button-handler changes.

## Files touched

- **[src/discordTools/discordModals.js](../../../src/discordTools/discordModals.js)**
  - Add a `checkboxGroupLabel(labelText, groupCustomId, options)` helper next to `boolLabel`.
  - Rewrite `getSettingsInGameModal` to build the two checkbox groups + divider.
  - Delete `getSettingsNotificationsModal`.
- **[src/handlers/modalHandler.js](../../../src/handlers/modalHandler.js)**
  - Merge the `SettingsNotifications` block into `SettingsInGame`.
  - Read both groups via `getCheckboxGroup`; set the 8 settings via `selected.includes(key)`.
  - Do not set the FCM fields.
- **[src/commands/settings.js](../../../src/commands/settings.js)**
  - Remove the `notifications` subcommand.
  - Update the `ingame` subcommand description to cover both groups.

## Out of scope

- The button-based settings embeds in `buttonHandler.js` (separate UI surface).
- The `general` and `battlemetrics` modals.
- Default-value changes (already flipped separately in the templates).

## Testing

- Unit: build `getSettingsInGameModal` for a fixture instance; assert 3 top-level
  components and that option `default` flags mirror `generalSettings`.
- Submit: simulate a `getCheckboxGroup` result; assert the 8 `generalSettings`
  keys are set correctly and FCM keys are untouched.
- Manual: open `/settings ingame` against the live bot, toggle items, submit,
  confirm persisted values and that the modal opens without an API error.
