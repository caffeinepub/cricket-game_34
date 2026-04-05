# Cricket Blast — Version 8 Upgrade

## Current State
- Full pre-match flow: landing → mode select → team select → player select → toss → walk-on → game
- IPL mode (10 franchises) and International mode (8 teams)
- Canvas-based gameplay with bowling type selector, 9 fielders, umpire, DRS, IPL logo on sixes
- Bot bowling (when player bats) and bot batting (when player bowls)
- Player photos from Wikipedia, celebrations at 50/100, camera toggle (label only)
- IPL auction every 20 matches (cosmetic, no gameplay effect)
- Practice Nets mode

## Requested Changes (Diff)

### Add
- Web Audio API sound effects: bat crack on hit, crowd roar on six/four, wicket sound on dismissal, ambient crowd noise loop, countdown beeps
- Real camera view differences: broadcast (current default), side-on (shift canvas draw to side angle with different vanishing point), batter's eye (looking down pitch toward bowler)
- Second batsman (non-striker) visible at non-striker end on canvas
- Delivery speed variation: bouncer = faster (900ms), spin = slower (1300ms), swing/inswing/outswing = normal (1100ms); visual speed label on delivery
- Over-by-over bowler selection: after each completed over, a small overlay lets player pick who bowls the next over from the team's bowlers (same bowler cannot bowl two consecutive overs in T20)
- Fielder reaction animations: when a shot is hit, the nearest fielder sprints toward the ball direction for 600ms
- Visual delivery differences: bouncer ball rises higher arc, spin ball has tighter arc + visual spin marker, swing deliveries curve more noticeably

### Modify
- Fix `target` bug in App.tsx: use `useState` with initializer so target is stable for the whole match
- Fix difficulty: pass difficulty from LandingPage through App.tsx to CricketGame properly
- Fix toss logic bug: when player loses toss, opposition bowls (player bats) - fix the message/code contradiction
- Fix fielder jersey colors: fielders should use opposing team's jersey color, not the player's team
- Update version label from "v5.0" to "v8.0" in ModeSelector
- Remove all dead code: unused ShotType system, COMMENTARY record, unused GameMode/Player types, _pendingWicket state
- Improve walk-on animation: show players on a simple ground/pitch background instead of plain gradient strip, better fielder spread
- Make IPL auction functional: won players are added to the player's team lineup for next match (stored in localStorage)
- Improve bot bowling: bot picks delivery types with weighted variety (not purely random) and increases variety over overs
- Add powerplay restrictions: fielding circle enforced visually with fewer outfield fielders in first 6 overs

### Remove
- Dead `ShotType`/`resolveShotOutcome`/`SHOT_WEIGHTS`/`COMMENTARY` dead code from cricket.ts and types/game.ts
- Unused `_pendingWicket` state variable
- Conflicting `GameMode` and `Player` types from types/game.ts (keep App.tsx string union definitions inline)

## Implementation Plan

1. **App.tsx fixes**: Stable `target` via useState initializer, pass `difficulty` from landing page through to CricketGame, fix toss logic (ensure `batFirst=true` when player wins and chooses bat, and when player loses and opp chooses bowl)
2. **Sound system**: Create `src/utils/soundEngine.ts` using Web Audio API — generate synthetic sounds procedurally (no audio files needed): bat crack (short attack noise burst), crowd roar (filtered noise swell), wicket (descending tone), ambient crowd (looping filtered noise at low volume), six swell (ascending crowd + bell)
3. **Camera views**: In `drawScene`, add a `cameraView` parameter that actually shifts vanishing points and player positions. Broadcast = current (top-down trapezoid). Side-on = wide trapezoid from left side, players shifted right. Batter's eye = bowl looking down pitch, bowler at far end small, batsman not drawn.
4. **Second batsman**: Add non-striker batsman sprite at the opposite crease end, with non-striker player name from lineup
5. **Delivery speed**: Map each DeliveryType to a ball duration; show a speed label ("FAST!", "SPIN", "SWING") during delivery
6. **Over-by-over bowler selector**: After 6 balls complete an over, show a modal overlay with team bowlers to pick next bowler; enforce no consecutive overs rule
7. **Fielder animations**: Track last shot direction; nearest fielder animates toward that direction during ball flight
8. **Fielder jersey fix**: Use opposition team jerseyColor for all 9 fielders
9. **IPL Auction integration**: Save won players to localStorage `iplWonPlayers`; in PlayerSelect, show won players with a special badge; allow swapping won players into lineup
10. **Dead code removal**: Clean up types/game.ts, cricket.ts of all unused exports
11. **Walk-on improvement**: Draw a simple pitch/ground behind the players in WalkOnAnimation
12. **Version label update**: Change v5.0 to v8.0 in ModeSelector
13. **Difficulty fix**: LandingPage passes difficulty up, App stores it, CricketGame receives it and applies weights
