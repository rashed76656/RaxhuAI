const fs = require('fs');

const md = fs.readFileSync('e:/Project/RaxhuAI/rashed-banglish-commands.md', 'utf-8');

let jsOut = `/* ============================================
   RaxhuAI — Banglish & Casual Commands
   Parsed automatically from rashed-banglish-commands.md
   ============================================ */

const BanglishCommands = {
`;

// Regex to capture markdown tables
const tableRegex = /\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*"([^"]+)"\s*\|\s*"([^"]+)"\s*\|/g;

let match;
while ((match = tableRegex.exec(md)) !== null) {
  const cmd = match[1].toLowerCase().trim();
  const expression = match[2] === 'boss' ? 'boss-mood' : match[2];
  const reply = match[3];
  const speech = match[4];
  
  jsOut += `  "${cmd}": { animation: "${expression}", effect: "none", response: "${reply}", speech: "${speech}" },\n`;
}

jsOut += `};

// Append to SecretCommands
Object.assign(SecretCommands, BanglishCommands);

// Expand HiddenKeywords
if (typeof HiddenKeywords !== 'undefined') {
  Object.assign(HiddenKeywords, {
`;

const hiddenRegex = /"([^"]+)":\s*\(\)=>\{\s*setChar\('([^']+)',(\d+)\);\s*showSpeech\("([^"]+)"\);\s*\}/g;

while ((match = hiddenRegex.exec(md)) !== null) {
  const word = match[1].toLowerCase();
  const anim = match[2] === 'boss' ? 'boss-mood' : match[2];
  const duration = match[3];
  const speechText = match[4];
  
  jsOut += `    "${word}": () => { AnimationController.setState("${anim}", {duration: ${duration}, lockDuration: ${duration}, force: true}); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("${speechText}"); },\n`;
}

jsOut += `  });\n}\n`;

fs.writeFileSync('e:/Project/RaxhuAI/js/banglish-commands.js', jsOut);
console.log("Successfully generated js/banglish-commands.js");
