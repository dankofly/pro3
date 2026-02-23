#!/usr/bin/env node
/**
 * Auto-translate de.json → en.json + nl.json using Claude API.
 *
 * Usage: node scripts/translate.mjs
 * Requires: ANTHROPIC_API_KEY environment variable
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = resolve(__dirname, '../src/i18n');

const TARGETS = [
  { locale: 'en', file: 'en.json', language: 'English' },
  { locale: 'nl', file: 'nl.json', language: 'Dutch (Netherlands)' },
];

const SYSTEM_PROMPT = `You are a professional translator for a paragliding tandem flight business website (Tandemflug Lienz, East Tyrol, Austria).

Rules:
- Translate ALL string values from German to the target language
- Keep JSON keys EXACTLY as they are (never translate keys)
- Keep HTML tags like <strong>, <br> etc. intact
- Keep placeholders like {year} intact
- Keep proper nouns: "Tandemflug Lienz", "KOFLY", "Airpark Lienzer Dolomiten", "Zettersfeld", "Hochstein", "Steinermandl", "Drautal"
- Keep URLs unchanged
- Keep emoji characters unchanged
- Geographic names: translate generic terms (Tal→Valley, Fluss→River) but keep proper names (Lienz, Osttirol, Kals)
- Use a natural, friendly, informal tone (like addressing tourists)
- For Dutch: use "je/jij" (informal you)
- For English: casual but professional
- Return ONLY valid JSON, no explanation or markdown`;

async function translate(deContent, targetLanguage) {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Translate the following German JSON to ${targetLanguage}. Return ONLY the translated JSON:\n\n${deContent}`,
      },
    ],
  });

  const text = response.content[0].text.trim();

  // Strip markdown code fences if present
  const jsonStr = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  // Validate JSON
  JSON.parse(jsonStr);
  return jsonStr;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  const dePath = resolve(i18nDir, 'de.json');
  const deContent = readFileSync(dePath, 'utf-8');

  console.log('Source: de.json loaded');

  for (const target of TARGETS) {
    console.log(`Translating → ${target.language} (${target.file})...`);
    try {
      const translated = await translate(deContent, target.language);
      const targetPath = resolve(i18nDir, target.file);
      writeFileSync(targetPath, translated + '\n', 'utf-8');
      console.log(`  ✓ ${target.file} written`);
    } catch (err) {
      console.error(`  ✗ ${target.file} failed:`, err.message);
      process.exit(1);
    }
  }

  console.log('Done — all translations updated.');
}

main();
