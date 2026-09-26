# Handy fork: post-processing profiles

This fork adds **post-processing profiles**: tabs on the Post Processing settings
page, each a full, independent copy of the post-processing settings (provider,
base URL, API key, model, prompts, selected prompt) with its own global shortcut.

- `Default` always exists, cannot be deleted, and uses the original
  "Transcribe with post-processing" shortcut (`transcribe_with_post_process`).
  `--toggle-post-process` and `SIGUSR1` trigger this profile. Its label is
  "Default" in the current UI language until renamed.
- `+` adds `<localized Default> 1`, `2`, … (lowest free number) with
  fresh-install defaults and no shortcut assigned. Resetting a new profile's
  shortcut clears it again.
- Double-click a tab to rename it (Enter saves, Esc cancels). Clearing the
  Default tab's name restores its localized label.
- History records which profile processed each entry, shows it next to the
  date, and a retry reuses that profile (older entries use Default; entries of
  a deleted profile are retried without post-processing).
- `×` deletes a profile (after confirmation) and unregisters its shortcut.
- The global "Post-processing" toggle still enables/disables all profiles.

Existing data is migrated on first launch: settings schema 2 → 3 (the old flat
`post_process_*` keys become the `Default` profile) and history database
migration 5 (adds `post_process_profile_id`).

> **Upgrading is one-way.** The build shares its data folder with official
> Handy (`com.pais.handy`). After the migrations, official Handy 0.9.x no
> longer finds its post-processing settings and refuses the newer history
> database. Back up `~/Library/Application Support/com.pais.handy/` first if
> you might go back.

## Build (macOS)

```bash
bun install
mkdir -p src-tauri/resources/models
curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx

HANDY_DISABLE_UPDATER=1 CMAKE_POLICY_VERSION_MINIMUM=3.5 \
  bun run tauri build --bundles app --config '{"bundle":{"createUpdaterArtifacts":false}}'
# → src-tauri/target/release/bundle/macos/Handy.app
```

- `HANDY_DISABLE_UPDATER=1` **at build time** bakes the updater lock into the
  binary, so the official release can never replace the fork (the "Check for
  updates" toggle shows as locked). Without it, turn off "Check for Updates"
  in the Debug settings (`Cmd+Shift+D`) instead.
- `createUpdaterArtifacts: false` skips updater signing, which needs the
  upstream private key.
- With Xcode older than 15.3 (macOS 14.0 SDK) the final link fails on
  `_OBJC_CLASS_$_MLComputePlan` (ONNX Runtime needs the macOS 14.4+ SDK). If
  the Command Line Tools ship a newer SDK, link against it:
  `RUSTFLAGS="-C link-arg=-isysroot -C link-arg=/Library/Developer/CommandLineTools/SDKs/MacOSX15.1.sdk"`.
- The build is ad-hoc signed: grant Microphone and Accessibility on first run.
