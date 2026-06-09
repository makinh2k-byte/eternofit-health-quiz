// Replace Unsplash image URLs with local /images/articles/ paths, targeted by article id.
import fs from 'fs';

const FILE = './src/data/articles.js';

const map = {
  'how-to-get-rid-of-bloating':        '/images/articles/bloating.jpg',
  'cant-sleep-what-to-do':             '/images/articles/sleep.jpg',
  'brain-fog-causes-remedies':         '/images/articles/brain_fog_real.jpg',
  'how-to-calm-anxiety':               '/images/articles/anxiety_real.jpg',
  'lower-back-pain-from-sitting':      '/images/articles/back_pain_real.jpg',
  'how-to-stop-heartburn':             '/images/articles/heartburn_real.jpg',
  'tired-all-the-time-causes':         '/images/articles/fatigue_real.jpg',
  'daily-headaches-causes-remedies':   '/images/articles/headache_real.jpg',
  'hair-falling-out-causes':           '/images/articles/hair_loss_real.jpg',
  'stiff-achy-joints-causes':          '/images/articles/stiff_joints_real.jpg',
  'prevent-falls-stay-steady':         '/images/articles/prevent_falls.jpg',
  'knee-pain-after-60':                '/images/articles/knee_pain.jpg',
  'lower-blood-pressure-simple-habits':'/images/articles/blood_pressure.jpg',
  'memory-changes-what-is-normal':     '/images/articles/memory_loss.jpg',
  'better-sleep-as-you-age':           '/images/articles/better_sleep.jpg',
  'managing-your-medications-safely':  '/images/articles/manage_meds.jpg',
  'protect-your-bones-prevent-fractures':'/images/articles/strong_bones.jpg',
  'staying-active-after-65':           '/images/articles/senior_exercise.jpg',
  'constipation-relief-gentle-ways':   '/images/articles/constipation.jpg',
  'feeling-lonely-ways-to-reconnect':  '/images/articles/connection.jpg',
  'adhd-signs-in-adults':              '/images/articles/adhd-adults.jpg',
  'adhd-focus-strategies':             '/images/articles/adhd-focus.jpg',
  'adhd-diet-and-nutrition':           '/images/articles/adhd-diet.jpg',
  'low-testosterone-signs':            '/images/articles/testosterone-signs.jpg',
  'how-to-boost-testosterone-naturally':'/images/articles/boost-testosterone.jpg',
  'why-not-losing-weight':             '/images/articles/weight-loss-plateau.jpg',
  'intermittent-fasting-guide':        '/images/articles/intermittent-fasting.jpg',
  'foods-for-fat-loss':                '/images/articles/fat-loss-foods.jpg',
  'cortisol-and-stress':               '/images/articles/cortisol-stress.jpg',
  'fix-sleep-schedule':                '/images/articles/fix-sleep.jpg',
  'hrv-explained':                     '/images/articles/hrv.jpg',
  'speed-up-metabolism':               '/images/articles/metabolism.jpg',
  'dopamine-and-adhd':                 '/images/articles/dopamine-adhd.jpg',
  'testosterone-sleep-connection':     '/images/articles/testosterone-sleep.jpg',
};

let src = fs.readFileSync(FILE, 'utf8');
let changed = 0;

for (const [id, localPath] of Object.entries(map)) {
  const idRe = new RegExp(`(id:\\s*['"]${id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}['"][\\s\\S]{0,200}?image:\\s*)(['"][^'"]+['"])`, 'm');
  const newSrc = src.replace(idRe, (_, before, _oldImg) => {
    changed++;
    return `${before}'${localPath}'`;
  });
  if (newSrc === src) {
    console.warn('No match for id:', id);
  }
  src = newSrc;
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`Done. Updated ${changed} image paths.`);
