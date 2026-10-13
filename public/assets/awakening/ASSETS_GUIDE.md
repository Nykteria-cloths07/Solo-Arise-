# Anime Awakening Asset Directory Guide

This folder structure supports custom audio, voice clips, background tracks, and video clips for the Anime Awakening Cinematic Intro experience.

## Directory Structure:
- `/public/assets/awakening/voices/` -> Prerecorded character voice clips / battle cries (.mp3, .wav, .ogg)
  - `shadow_hunter_roar.mp3`
  - `saiyan_warrior_roar.mp3`
  - `cursed_king_roar.mp3`
  - `iron_discipline_roar.mp3`
- `/public/assets/awakening/music/` -> Phonk background music edits (.mp3)
  - `dark_phonk_awakening.mp3`
- `/public/assets/awakening/sound-effects/` -> Impact risers, bass drops, thunder strikes
- `/public/assets/awakening/characters/` -> Custom full-body character renders / frames
- `/public/assets/awakening/backgrounds/` -> Atmospheric anime background loops

## Built-In High Fidelity Synthesis Fallback:
If no external `.mp3` files are present, the built-in `phonkAudioEngine.ts` automatically synthesizes:
1. 808 Sub-bass drift drops
2. Synced Cowbell Phonk melodic progression
3. Guttural warrior battle roar acoustics via multi-harmonic formant wave synthesis
4. Seismic camera shake impacts and heartbeat pulses

Everything works out of the box with zero external dependencies!
