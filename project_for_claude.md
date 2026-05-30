# Project Source Code

## File: `add-gender.cjs`

```cjs
const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.error("Could not find products array.");
    process.exit(1);
}

let products = JSON.parse(jsonStrMatch[1]);

// Logic for gender categorization
products = products.map(p => {
    const name = p.name.toLowerCase();
    const cat = p.category.toLowerCase();
    const sub = p.subniche.toLowerCase();
    const desc = p.description.toLowerCase();

    let gender = 'both';

    if (cat.includes('men') || name.includes('vigrx') || name.includes('testo') || name.includes('semen') || name.includes('erect') || name.includes('proextender') || name.includes('prosolution') || name.includes('maxload') || name.includes('volume pills') || desc.includes('male vitality') || desc.includes('men over') || desc.includes('specifically for men')) {
        gender = 'male';
    } else if (cat.includes('female') || name.includes('her') || name.includes('provestra') || name.includes('libidopure') || desc.includes('female')) {
        gender = 'female';
    }

    // Manual overrides for specific ones that might be missed
    if (name.includes('dim 3x')) gender = 'male'; // although general health, it's for men
    if (name.includes('cortisync')) gender = 'male'; // it's in men's health
    if (name.includes('hypergh 14x')) gender = 'male';
    if (name.includes('viasil')) gender = 'male';
    if (name.includes('collagen') || name.includes('dermefface') || name.includes('stretch mark') || name.includes('illuminatural') || name.includes('kollagen')) gender = 'both';
    if (name.includes('brain pill') || name.includes('calmlean') || name.includes('genf20') || name.includes('metaboost')) gender = 'both';

    return { ...p, gender };
});

const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
const finalContent = `export const products = ${JSON.stringify(products, null, 2)};\n\n${logicPart}`;

fs.writeFileSync('src/data/products.js', finalContent);
console.log("Successfully added gender field to all products.");
```

## File: `add_dates.cjs`

```cjs
const fs = require('fs');

const filePath = 'src/data/articles.js';
let content = fs.readFileSync(filePath, 'utf8');

// We will inject a date line right after readTime: '...'
// to ensure it matches properly.
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let count = 0;

content = content.replace(/(readTime:\s*['"][^'"]+['"],)/g, (match) => {
  // generate a random date in 2025 or 2026
  const year = 2025 + Math.floor(Math.random() * 2);
  const month = months[Math.floor(Math.random() * months.length)];
  const day = 1 + Math.floor(Math.random() * 28);
  const dateStr = `${month} ${day}, ${year}`;
  count++;
  return `${match}\n    date: '${dateStr}',`;
});

fs.writeFileSync(filePath, content);
console.log(`Added dates to ${count} articles.`);
```

## File: `append_articles.cjs`

```cjs
const fs = require('fs');

const author = "Dr. Sarah Jenkins, MD";
const authorBio = "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.";

const newArticles = [
  {
    id: 'prevent-falls-stay-steady',
    image: '/images/articles/prevent_falls.png',
    category: 'Safety',
    title: 'Worried About Falling? Simple Ways to Stay Steady on Your Feet',
    metaDesc: 'Falls are common after 60 but mostly preventable. Here are simple, practical ways to improve your balance and stay steady at home.',
    primaryKeyword: 'how to prevent falls in seniors',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>If you've started moving a little more carefully — holding the railing, watching your step on the curb — you're not being overly cautious. You're being smart. Falls are the most common cause of injury for older adults, but here's the part that doesn't get said enough: most falls can be prevented. A few changes around your home and a few minutes of the right exercises can make a real difference.</p>

      <h2>Why Falls Happen More As We Age</h2>
      <p>It's rarely one thing. Usually it's a few small things adding up:</p>
      <ul>
        <li>Muscles, especially in the legs and core, naturally weaken over the years</li>
        <li>Balance and reflexes slow down</li>
        <li>Eyesight changes make it harder to spot hazards</li>
        <li>Some medications cause dizziness or lightheadedness</li>
        <li>Inner ear issues affect balance</li>
        <li>Clutter, loose rugs, and poor lighting at home</li>
        <li>Foot problems and unsupportive shoes</li>
      </ul>
      <p>The good news is nearly every one of these can be improved.</p>

      <h2>Simple Ways to Stay Steady</h2>
      <p><strong>Do balance exercises a few times a week.</strong> Stand on one foot while holding the kitchen counter. Practice standing up from a chair without using your hands. Walk heel-to-toe across the room. Just a few minutes makes your balance noticeably better within weeks.</p>
      <p><strong>Keep your legs strong.</strong> Strong legs catch you when you stumble. Simple sit-to-stand exercises from a sturdy chair, done 10 times a day, build the muscle that keeps you upright.</p>
      <p><strong>Clear the walkways at home.</strong> Pick up loose cords, remove or tape down throw rugs, and keep paths between rooms clear. Most falls happen at home, and most of those happen over things that didn't need to be there.</p>
      <p><strong>Add lighting.</strong> Put nightlights in the hallway and bathroom. Keep a lamp within reach of your bed. A lot of falls happen on the way to the bathroom at night.</p>
      <p><strong>Install grab bars.</strong> In the shower and next to the toilet. They're inexpensive and they prevent the falls that tend to cause the worst injuries.</p>
      <p><strong>Wear good shoes, even indoors.</strong> Supportive shoes with non-slip soles. Slippers and socks on smooth floors are a common cause of slips.</p>
      <p><strong>Get your eyes checked yearly.</strong> Updated glasses help you see steps, curbs, and hazards clearly.</p>
      <p><strong>Review your medications.</strong> Ask your doctor or pharmacist if any of your prescriptions can cause dizziness — especially if you take several. Sometimes the timing or dose can be adjusted.</p>
      <p><strong>Stand up slowly.</strong> Blood pressure can drop when you rise too fast, making you lightheaded. Sit on the edge of the bed for a moment before standing.</p>

      <h2>When to Talk to Your Doctor</h2>
      <p>Tell your doctor if you've fallen, even if you weren't hurt, or if you've had a near-fall or feel unsteady. This isn't something to be embarrassed about — it's important information. Your doctor can check your balance, review your medications, test your blood pressure, and refer you to physical therapy. A physical therapist can give you exercises tailored to you, and it genuinely works.</p>

      <h2>FAQ</h2>
      <p><strong>Is it normal to lose my balance as I get older?</strong><br>Some change is normal, but feeling unsteady isn't something you simply have to accept. Balance can be improved at any age with the right exercises.</p>
      <p><strong>What exercise is best for balance?</strong><br>Tai chi has excellent research behind it for older adults. Simple standing exercises and leg strengthening also help a lot. Many senior centers offer free classes.</p>
      <p><strong>Should I use a cane or walker?</strong><br>If your doctor recommends one, use it. The right walking aid prevents falls — it doesn't cause dependence. Just make sure it's fitted to your height.</p>
      <p><strong>What should I do if I fall and can't get up?</strong><br>Stay calm, don't rush. If you have a medical alert device or phone within reach, use it. This is exactly why keeping a phone on you, or wearing an alert button, is worth it.</p>
      <p>Staying steady isn't about slowing down your life. It's about doing a few simple things so you can keep living it fully and confidently.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'knee-pain-after-60',
    image: '/images/articles/knee_pain.png',
    category: 'Pain Relief',
    title: 'Knee Pain After 60: What Helps and What to Avoid',
    metaDesc: "Knee pain doesn't have to slow you down. Here's what's causing it, what actually helps, and how to keep moving comfortably.",
    primaryKeyword: 'knee pain in seniors',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>Getting up from a chair, climbing stairs, getting out of the car — if your knees complain every time, you know how much it can wear on you. Knee pain is one of the most common discomforts people deal with as they get older. The encouraging news is there's a lot you can do to feel better without surgery, and staying active is a big part of it.</p>

      <h2>What's Causing Your Knee Pain</h2>
      <p>The most common cause after 60 is osteoarthritis — the cushioning cartilage in the joint wears down over time, so the bones don't glide as smoothly. Other causes include:</p>
      <ul>
        <li>Old injuries that never fully healed</li>
        <li>Extra body weight putting more load on the joint</li>
        <li>Weak muscles around the knee</li>
        <li>Inflammation</li>
        <li>Tendon problems</li>
      </ul>
      <p>A doctor can usually tell what's going on with a simple exam, and sometimes an X-ray.</p>

      <h2>What Actually Helps</h2>
      <p><strong>Keep moving — gently.</strong> It feels backward, but resting too much makes knee pain worse. Cartilage and joints need movement to stay healthy. A daily walk, even a short one, helps.</p>
      <p><strong>Strengthen the muscles around the knee.</strong> Strong thigh muscles take pressure off the joint. Straight-leg raises and gentle sit-to-stands from a chair are easy and effective. A physical therapist can show you a routine.</p>
      <p><strong>Choose low-impact exercise.</strong> Swimming, water aerobics, and stationary cycling are wonderful for sore knees. The water supports your weight while you stay active.</p>
      <p><strong>Lose a little weight if you can.</strong> Every pound off your body takes about four pounds of pressure off your knees with each step. Even modest weight loss helps a great deal.</p>
      <p><strong>Use heat and cold.</strong> Warmth before activity loosens a stiff joint. Cold afterward calms swelling and soreness.</p>
      <p><strong>Try over-the-counter pain relief, carefully.</strong> Acetaminophen or anti-inflammatory creams can help. If you take other medications, check with your pharmacist first — some pain relievers don't mix well with common prescriptions.</p>
      <p><strong>Wear supportive shoes.</strong> Good cushioning makes a real difference. Skip worn-out shoes and unsupportive sandals.</p>
      <p><strong>Consider a cane on bad days.</strong> Used in the hand opposite the sore knee, it takes pressure off and keeps you moving.</p>

      <h2>What to Avoid</h2>
      <p>Avoid sitting still for hours — stiffness sets in fast. Avoid high-impact activities like jumping or running on hard surfaces. And don't push through sharp pain; gentle discomfort during exercise is okay, but sharp pain is a signal to stop.</p>

      <h2>When to See a Doctor</h2>
      <p>See your doctor if your knee is swollen, warm, or red; if it locks or gives way; if the pain is keeping you from sleeping or doing daily tasks; or if it isn't improving. There are good options beyond what you can do at home — physical therapy, injections, and, when needed, joint replacement, which helps a great many people return to a comfortable, active life.</p>

      <h2>FAQ</h2>
      <p><strong>Should I exercise if my knees hurt?</strong><br>Yes, but choose the right kind. Low-impact movement helps; high-impact activity can aggravate it. When in doubt, ask a physical therapist.</p>
      <p><strong>Do glucosamine supplements work for knee pain?</strong><br>The research is mixed. Some people find them helpful, others don't. They're generally safe to try for a few months if you'd like to.</p>
      <p><strong>Is knee replacement surgery worth it?</strong><br>For many people with severe arthritis, it's life-changing. It's a real recovery, but most people are glad they did it. Your doctor can tell you if you're a candidate.</p>
      <p><strong>Why are my knees stiff in the morning?</strong><br>Joints stiffen up after hours of stillness. Gentle movement and stretching in the morning loosens them. If stiffness lasts more than an hour, mention it to your doctor.</p>
      <p>You don't have to give up the activities you enjoy. With the right care, most people keep their knees comfortable enough to stay active for years.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'lower-blood-pressure-simple-habits',
    image: '/images/articles/blood_pressure.png',
    category: 'Heart Health',
    title: 'High Blood Pressure: Simple Habits That Make a Real Difference',
    metaDesc: "Managing high blood pressure doesn't have to be complicated. Here are simple, proven habits that help bring your numbers down.",
    primaryKeyword: 'how to lower blood pressure naturally',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>High blood pressure is sometimes called "the silent condition" because it usually has no symptoms — you can feel perfectly fine while it quietly puts strain on your heart and blood vessels. If your doctor has told you your numbers are high, the good news is that everyday habits, alongside any medication you take, can make a genuine difference.</p>

      <h2>Why Blood Pressure Matters</h2>
      <p>Blood pressure is the force of blood pushing against your artery walls. When it stays high over time, it makes your heart work harder and raises the risk of heart problems, stroke, and kidney issues. Because there are no warning signs, the only way to know your numbers is to check them.</p>
      <p>For most older adults, a reading below 130/80 is a common goal — but your doctor will tell you the right target for you, since it can vary based on your age and health.</p>

      <h2>Simple Habits That Help</h2>
      <p><strong>Watch the salt.</strong> Most of the salt in our diets comes from packaged and restaurant food, not the salt shaker. Canned soups, deli meats, frozen dinners, and bread are big sources. Cooking more meals at home gives you control.</p>
      <p><strong>Eat more fruits and vegetables.</strong> They're rich in potassium, which helps balance out sodium. Bananas, potatoes, spinach, beans, and oranges are all good choices. The DASH eating plan was designed specifically for blood pressure and is worth looking up.</p>
      <p><strong>Move your body most days.</strong> A 30-minute walk most days of the week can lower blood pressure noticeably. You can break it into three 10-minute walks if that's easier.</p>
      <p><strong>Lose a little weight if you carry extra.</strong> Even losing 5 to 10 pounds can bring your numbers down.</p>
      <p><strong>Limit alcohol.</strong> If you drink, keep it light — no more than one drink a day. More than that raises blood pressure.</p>
      <p><strong>Manage stress.</strong> Ongoing stress keeps blood pressure up. Whatever helps you unwind — gentle walks, time with friends, a hobby, deep breathing — counts as heart care.</p>
      <p><strong>Get enough sleep.</strong> Poor sleep is linked to higher blood pressure. Aim for 7 to 8 hours.</p>
      <p><strong>Take your medication as prescribed.</strong> If your doctor has prescribed blood pressure medication, take it consistently, even when you feel fine. Never stop on your own — talk to your doctor first.</p>
      <p><strong>Check your pressure at home.</strong> A simple home monitor lets you and your doctor see how you're doing. Check at the same time each day and write the numbers down.</p>

      <h2>When to Call Your Doctor</h2>
      <p>Call your doctor if your home readings are consistently high, or if you ever get a very high reading along with headache, chest pain, shortness of breath, vision changes, or weakness — that needs urgent attention. Otherwise, regular check-ins let your doctor adjust your plan as needed.</p>

      <h2>FAQ</h2>
      <p><strong>Can I lower blood pressure without medication?</strong><br>Some people can, with lifestyle changes, especially if their numbers are only mildly high. Others need medication too. Both approaches work together — never stop medication without your doctor's guidance.</p>
      <p><strong>Why is my blood pressure higher at the doctor's office?</strong><br>It's so common it has a name — "white coat" effect. The nervousness of a visit raises it temporarily. This is exactly why home readings are helpful.</p>
      <p><strong>Does coffee raise blood pressure?</strong><br>It can cause a short-term bump, but moderate coffee drinking isn't a major concern for most people. If you're sensitive to it, you'll notice.</p>
      <p><strong>How often should I check my blood pressure?</strong><br>If you're managing high blood pressure, daily home checks during certain periods help. Your doctor will tell you what's right for you.</p>
      <p>Managing blood pressure is mostly about steady, everyday habits. Small changes, kept up over time, protect your heart and let you feel your best.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'memory-changes-what-is-normal',
    image: '/images/articles/memory_loss.png',
    category: 'Mental Clarity',
    title: 'Forgetting Things More Often? When It\'s Normal and When to Check',
    metaDesc: "Misplacing your keys or forgetting a name? Here's what's normal aging, what's not, and how to keep your memory sharp.",
    primaryKeyword: 'memory loss in seniors',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>You walk into a room and forget why. A name is right on the tip of your tongue but won't come. You misplace your reading glasses for the third time today. If moments like these have you quietly worried, you're far from alone — and the truth is, most of these everyday slips are a normal part of getting older.</p>
      <p>Knowing the difference between ordinary forgetfulness and something worth checking can put your mind at ease.</p>

      <h2>What's Normal Forgetfulness</h2>
      <p>As we age, the brain works a little more slowly, much like the rest of the body. These things are common and usually nothing to worry about:</p>
      <ul>
        <li>Occasionally forgetting names or appointments, then remembering them later</li>
        <li>Misplacing everyday items now and then</li>
        <li>Needing a moment longer to recall a word</li>
        <li>Getting briefly distracted and losing your train of thought</li>
        <li>Forgetting which day it is but figuring it out easily</li>
      </ul>
      <p>This kind of forgetfulness doesn't really interfere with your independence or daily life.</p>

      <h2>What's Worth Checking</h2>
      <p>These signs are worth a conversation with your doctor:</p>
      <ul>
        <li>Forgetting recently learned information often</li>
        <li>Getting lost in familiar places</li>
        <li>Trouble following a recipe or managing bills you've always handled</li>
        <li>Struggling to find words in everyday conversation, not just occasionally</li>
        <li>Repeating questions or stories in a short time</li>
        <li>Family or friends noticing changes that concern them</li>
      </ul>
      <p>Memory changes can also be caused by very treatable things — vitamin B12 deficiency, thyroid problems, certain medications, depression, poor sleep, or dehydration. That's exactly why it's worth getting checked rather than worrying alone.</p>

      <h2>How to Keep Your Memory Sharp</h2>
      <p><strong>Stay physically active.</strong> Exercise boosts blood flow to the brain and is one of the best things you can do for memory. A daily walk counts.</p>
      <p><strong>Keep learning and challenging your brain.</strong> Puzzles, reading, cards, a new hobby, a class. The brain stays sharper when it's used.</p>
      <p><strong>Stay socially connected.</strong> Conversation and time with others is real exercise for the mind. Isolation is hard on memory.</p>
      <p><strong>Sleep well.</strong> The brain sorts and stores memories during sleep. Poor sleep makes forgetfulness worse.</p>
      <p><strong>Eat well.</strong> A diet with plenty of vegetables, fruit, whole grains, fish, and healthy fats — often called the Mediterranean diet — supports brain health.</p>
      <p><strong>Manage blood pressure, blood sugar, and hearing.</strong> What's good for your heart is good for your brain. Untreated hearing loss is also linked to memory decline, so get your hearing checked.</p>
      <p><strong>Stay organized.</strong> Use a calendar, a notepad, a pill organizer, a set spot for your keys. These aren't signs of decline — they're smart tools everyone benefits from.</p>

      <h2>When to See a Doctor</h2>
      <p>If memory changes are interfering with daily life, or if loved ones are concerned, see your doctor. Early evaluation is genuinely worthwhile — it can uncover treatable causes, and if it is something more, early support and planning make a real difference.</p>

      <h2>FAQ</h2>
      <p><strong>Is forgetting names a sign of dementia?</strong><br>Usually not. Occasionally forgetting names, then recalling them later, is a normal part of aging. It's persistent, worsening memory problems that warrant a check.</p>
      <p><strong>Can stress and anxiety affect memory?</strong><br>Yes, quite a lot. Stress, worry, and depression all make it harder to concentrate and remember. Treating them often improves memory.</p>
      <p><strong>Do brain games really work?</strong><br>They keep your mind engaged, which is good. But physical exercise, good sleep, and social connection have even stronger evidence behind them.</p>
      <p><strong>What vitamin deficiency causes memory problems?</strong><br>Low vitamin B12 is a well-known cause and is easily checked with a blood test and treated. Always worth ruling out.</p>
      <p>A little forgetfulness is part of life, not a crisis. Stay active, stay connected, and if something feels off, get it checked — for peace of mind as much as anything.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'better-sleep-as-you-age',
    image: '/images/articles/better_sleep.png',
    category: 'Sleep',
    title: 'Trouble Sleeping As You Get Older? Here\'s What Helps',
    metaDesc: "Waking up at night or up too early? Sleep changes with age, but you can still sleep well. Here's what genuinely helps.",
    primaryKeyword: 'sleep problems in seniors',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>If you find yourself waking up several times a night, lying awake at 4 a.m., or feeling tired even after a full night in bed, you're experiencing one of the most common frustrations of getting older. Sleep does change with age — but poor sleep is not something you simply have to live with. There's a lot you can do to rest better.</p>

      <h2>Why Sleep Changes With Age</h2>
      <p>As we age, sleep naturally becomes a little lighter, and we tend to wake more easily. You might also feel sleepy earlier in the evening and wake earlier in the morning. That's a normal shift in your body's clock.</p>
      <p>But ongoing poor sleep often has specific causes:</p>
      <ul>
        <li>Aches and pains that make it hard to get comfortable</li>
        <li>Needing to use the bathroom at night</li>
        <li>Certain medications</li>
        <li>Caffeine later in the day than your body can handle</li>
        <li>Less physical activity and less daylight</li>
        <li>Daytime napping</li>
        <li>Worry and stress</li>
        <li>Sleep apnea, which is common and often undiagnosed</li>
        <li>Restless legs</li>
      </ul>
      <p>Many of these can be addressed.</p>

      <h2>What Actually Helps</h2>
      <p><strong>Keep a regular schedule.</strong> Go to bed and wake up at about the same time every day, weekends included. Your body loves routine.</p>
      <p><strong>Get outside during the day.</strong> Daylight, especially in the morning, helps set your internal clock. A morning walk does double duty.</p>
      <p><strong>Stay active.</strong> Regular daytime activity leads to deeper sleep at night. Just avoid vigorous exercise right before bed.</p>
      <p><strong>Be careful with naps.</strong> A short rest is fine, but long or late-afternoon naps can steal from your nighttime sleep. Keep them under 30 minutes and before mid-afternoon.</p>
      <p><strong>Watch caffeine and alcohol.</strong> Caffeine can linger in your system for many hours — keep it to the morning. Alcohol may help you doze off but leads to broken sleep later in the night.</p>
      <p><strong>Limit fluids in the evening.</strong> If trips to the bathroom wake you, taper off drinks a couple of hours before bed. Mention frequent night waking to your doctor too — it can have treatable causes.</p>
      <p><strong>Make your bedroom restful.</strong> Cool, dark, and quiet. A comfortable mattress and pillow matter more as we age and our joints get pickier.</p>
      <p><strong>Wind down before bed.</strong> A calm hour before sleep — reading, gentle music, a warm bath. Skip the bright screens of phones and tablets.</p>
      <p><strong>Treat pain before bed.</strong> If aches keep you up, talk to your doctor about managing them so they don't interrupt your rest.</p>

      <h2>When to Talk to Your Doctor</h2>
      <p>See your doctor if poor sleep is wearing on you during the day, if you snore loudly or wake up gasping (signs of sleep apnea), or if you feel your legs are restless at night. Also mention any sleep medications you're using — some aren't ideal for older adults long-term, and your doctor can suggest safer approaches. A type of counseling called CBT-I is very effective for ongoing sleep trouble.</p>

      <h2>FAQ</h2>
      <p><strong>Do older adults need less sleep?</strong><br>Not really — most adults still need 7 to 8 hours. The pattern changes, but the need doesn't disappear.</p>
      <p><strong>Is it bad to take sleeping pills?</strong><br>Some sleep medications carry extra risks for older adults, including next-day grogginess and falls. Talk to your doctor about the safest option for you rather than relying on them long-term.</p>
      <p><strong>Why do I wake up so early now?</strong><br>A shift in your body clock is normal with age. Getting bright light later in the day can help nudge it.</p>
      <p><strong>Is melatonin safe for seniors?</strong><br>It's generally considered low-risk short-term, and a low dose is best. Check with your doctor, especially if you take other medications.</p>
      <p>Good sleep is still very much within reach. Steady routines, daylight, activity, and a restful bedroom go a long way toward waking up rested again.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'managing-your-medications-safely',
    image: '/images/articles/manage_meds.png',
    category: 'Safety',
    title: 'Taking Several Medications? How to Stay Safe and Organized',
    metaDesc: "Juggling multiple prescriptions? Here's how to manage your medications safely, avoid mistakes, and keep everything on track.",
    primaryKeyword: 'managing multiple medications',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>If you take a handful of pills each day — maybe one for blood pressure, one for cholesterol, something for your joints, a vitamin or two — keeping it all straight can feel like a part-time job. You're not alone; many older adults take several medications. The key is having a simple system so you can take everything correctly and safely.</p>

      <h2>Why This Matters</h2>
      <p>The more medications you take, the easier it is for small mistakes to happen — a missed dose, a double dose, or two medicines that don't work well together. Some combinations can cause side effects like dizziness, which raises the risk of falls. None of this means you shouldn't take your medications. It means a little organization goes a long way.</p>

      <h2>How to Stay Organized</h2>
      <p><strong>Keep an up-to-date list.</strong> Write down every medication you take — prescriptions, over-the-counter products, vitamins, and supplements. Include the dose and what it's for. Keep a copy in your wallet and one at home.</p>
      <p><strong>Use a pill organizer.</strong> A weekly organizer with compartments for each day, and for morning and evening if needed, makes it easy to see at a glance whether you've taken your dose.</p>
      <p><strong>Take medications at consistent times.</strong> Tie them to daily routines — with breakfast, with dinner — so they become automatic. Phone alarms or a written checklist help.</p>
      <p><strong>Use one pharmacy.</strong> When all your prescriptions go through the same pharmacy, the pharmacist can spot interactions and warn you. Pharmacists are a wonderful, free resource — don't hesitate to ask them questions.</p>
      <p><strong>Bring everything to your doctor visits.</strong> Once a year, or whenever a new medication starts, bring your full list — or even the actual bottles — so your doctor can review it. This is sometimes called a "brown bag review."</p>
      <p><strong>Ask if anything can be simplified.</strong> Sometimes medications are no longer needed, or a combination pill can replace two. It's always fair to ask, "Do I still need all of these?"</p>
      <p><strong>Store medications properly.</strong> Keep them in a cool, dry place — usually not the bathroom, where humidity builds up. Keep them away from grandchildren's reach.</p>
      <p><strong>Don't share or borrow medications.</strong> What's right for someone else may be wrong, or dangerous, for you.</p>
      <p><strong>Refill before you run out.</strong> Set a reminder a week ahead. Many pharmacies offer automatic refills and even delivery.</p>

      <h2>Warning Signs to Watch For</h2>
      <p>Tell your doctor if you notice new dizziness, confusion, unusual tiredness, stomach upset, or a fall — these can sometimes be medication-related and may be fixable with an adjustment. Never stop a prescription on your own; talk to your doctor first.</p>

      <h2>When to Ask for a Medication Review</h2>
      <p>It's a good idea to have your full medication list reviewed at least once a year, or any time you see a new doctor, leave the hospital, or start something new. A pharmacist or your primary doctor can do this. It's one of the simplest ways to stay safe.</p>

      <h2>FAQ</h2>
      <p><strong>Is it bad to take many medications?</strong><br>Not necessarily — many conditions are well managed with medication. The goal is making sure each one is still needed and that they work well together, which a yearly review handles.</p>
      <p><strong>Can I take over-the-counter medicine with my prescriptions?</strong><br>Sometimes, but not always. Even common products like pain relievers and antacids can interact with prescriptions. Ask your pharmacist first.</p>
      <p><strong>What should I do if I miss a dose?</strong><br>It depends on the medication. Many have instructions on the label, but the safest move is to ask your pharmacist what to do for each specific one.</p>
      <p><strong>Should I use a medication reminder app?</strong><br>If you're comfortable with a phone, they can help. A simple pill organizer and a written checklist work just as well for many people.</p>
      <p>A good system turns medication management from a worry into a routine. Stay organized, keep one pharmacy, and ask questions — your pharmacist and doctor are there to help.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'protect-your-bones-prevent-fractures',
    image: '/images/articles/strong_bones.png',
    category: 'Bone Health',
    title: 'Protecting Your Bones: How to Stay Strong and Prevent Fractures',
    metaDesc: "Bones weaken with age, but you can protect them. Here's how to keep your bones strong and lower your risk of fractures.",
    primaryKeyword: 'how to keep bones strong as you age',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>Bones might seem like they just quietly do their job, but they're living tissue that needs care, especially as we get older. Over time, bones can gradually lose density and become more fragile — a condition called osteoporosis — which makes fractures more likely. The reassuring news is that there's a lot you can do at any age to keep your bones strong.</p>

      <h2>Why Bones Weaken With Age</h2>
      <p>Throughout life, your body constantly removes old bone and builds new bone. As we age, the rebuilding slows down, so bone is lost faster than it's replaced. This happens more quickly for women in the years after menopause, but it affects men too.</p>
      <p>Weaker bones often have no symptoms — many people don't know their bones have thinned until a fall causes a fracture. That's why prevention matters so much.</p>

      <h2>How to Keep Your Bones Strong</h2>
      <p><strong>Get enough calcium.</strong> Calcium is the main building block of bone. Good sources include dairy products, fortified plant milks, leafy greens, canned fish with soft bones, and fortified foods. Most older adults need around 1,200 mg a day — your doctor can tell you if you need a supplement.</p>
      <p><strong>Get enough vitamin D.</strong> Vitamin D helps your body absorb calcium. Your skin makes it from sunlight, but many older adults are low, especially in winter. Fortified foods, fatty fish, and supplements help. Ask your doctor about checking your level.</p>
      <p><strong>Do weight-bearing exercise.</strong> Activities where you're on your feet — walking, dancing, climbing stairs — signal your bones to stay strong. Aim for most days of the week.</p>
      <p><strong>Add strength exercises.</strong> Working your muscles with light weights or resistance bands pulls on your bones and helps maintain density. Twice a week is a good target.</p>
      <p><strong>Include balance exercises.</strong> Strong bones matter most alongside good balance, since preventing falls prevents fractures. Tai chi and simple standing exercises help.</p>
      <p><strong>Don't smoke.</strong> Smoking speeds up bone loss.</p>
      <p><strong>Limit alcohol.</strong> Heavy drinking weakens bones and raises fall risk. Keep it light.</p>
      <p><strong>Eat enough protein.</strong> Bone isn't just minerals — protein is part of its structure too. Include a protein source at each meal.</p>
      <p><strong>Ask about a bone density scan.</strong> A simple, painless test called a DEXA scan measures your bone strength. It's commonly recommended for women around 65 and sometimes earlier, and for men with risk factors. Your doctor will advise.</p>

      <h2>When to Talk to Your Doctor</h2>
      <p>Talk to your doctor about your bone health if you've broken a bone from a minor fall, if you've lost height, if your posture has become more stooped, or if osteoporosis runs in your family. If your bones have thinned significantly, there are effective medications that can strengthen them and lower fracture risk.</p>

      <h2>FAQ</h2>
      <p><strong>Does everyone get osteoporosis as they age?</strong><br>No. Bone loss is common, but how much you lose varies a lot. Diet, exercise, and lifestyle make a real difference.</p>
      <p><strong>Can I rebuild bone density?</strong><br>You can slow bone loss and, with the right exercise, medication, and nutrition, sometimes improve density. Protecting what you have is always worthwhile.</p>
      <p><strong>How much calcium do I really need?</strong><br>Most older adults need about 1,200 mg daily. It's best to get it from food when you can; your doctor can advise on supplements.</p>
      <p><strong>Is walking enough to protect my bones?</strong><br>Walking helps and is great for you, but adding strength exercises gives your bones an extra signal to stay strong. The combination is best.</p>
      <p>Strong bones are built through everyday habits — good nutrition, regular movement, and steady care. It's never too late to start protecting them.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'staying-active-after-65',
    image: '/images/articles/senior_exercise.png',
    category: 'Fitness',
    title: 'Staying Active After 65: Safe, Simple Exercise That Works',
    metaDesc: "Want to stay active but not sure where to start? Here's safe, simple exercise for older adults that builds strength and energy.",
    primaryKeyword: 'exercise for seniors',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>You don't need a gym membership, fancy equipment, or to push yourself hard to stay healthy. Staying active in your later years is one of the single best things you can do for your body and mind — and it can be gentle, enjoyable, and built right into your day. If it's been a while since you exercised, that's perfectly fine. The best time to start is now.</p>

      <h2>Why Staying Active Matters So Much</h2>
      <p>Regular movement helps with nearly everything that matters as we age. It keeps your muscles strong so daily tasks stay easy, improves your balance so you're less likely to fall, supports your heart, helps manage blood pressure and blood sugar, lifts your mood, sharpens your mind, and helps you sleep better. It also keeps you independent — able to do the things you want to do, on your own terms.</p>

      <h2>The Four Kinds of Exercise to Include</h2>
      <p>You don't need to do all of these every day, but a good routine includes a mix.</p>
      <p><strong>Walking and other gentle cardio.</strong> Walking is wonderful — free, easy, and you can do it almost anywhere. Aim to build up to about 30 minutes most days, in shorter chunks if that's easier. Swimming and stationary cycling are great too, especially if your joints are sore.</p>
      <p><strong>Strength exercises.</strong> This is the one people skip, but it's so important. Strong muscles keep you steady and independent. You don't need heavy weights — soup cans, light dumbbells, or resistance bands work. Sit-to-stands from a chair build leg strength beautifully. Aim for twice a week.</p>
      <p><strong>Balance exercises.</strong> Standing on one foot near a counter, heel-to-toe walking, or a tai chi class all improve balance and help prevent falls. Even a few minutes most days helps.</p>
      <p><strong>Stretching and flexibility.</strong> Gentle stretching keeps you limber and comfortable. Do it when your muscles are warm, and never bounce or force a stretch.</p>

      <h2>How to Start Safely</h2>
      <p><strong>Check with your doctor first</strong> if you have heart problems, chest pain, dizziness, or haven't been active in a long time. They can tell you what's right for you.</p>
      <p><strong>Start small and build slowly.</strong> Five or ten minutes is a fine beginning. Add a little each week. Going too hard too fast leads to soreness and discouragement.</p>
      <p><strong>Warm up and cool down.</strong> A few minutes of easy movement at the start and end protects your muscles and joints.</p>
      <p><strong>Listen to your body.</strong> Some muscle effort and mild fatigue are normal and good. Sharp pain, chest pain, dizziness, or shortness of breath mean stop and rest — and tell your doctor if it continues.</p>
      <p><strong>Stay hydrated</strong> and wear supportive shoes.</p>
      <p><strong>Make it social and enjoyable.</strong> Walk with a friend, join a senior exercise class, or try a group at your community center. You're far more likely to stick with something you enjoy.</p>

      <h2>When to Check With a Doctor</h2>
      <p>Talk to your doctor before starting if you have a chronic condition, have had a recent surgery or fall, or feel unsteady. During exercise, stop and seek help for chest pain, severe shortness of breath, or dizziness.</p>

      <h2>FAQ</h2>
      <p><strong>I haven't exercised in years. Is it too late to start?</strong><br>Not at all. People see real benefits from becoming active at every age, even in their 80s and 90s. Start gently and build up.</p>
      <p><strong>How much exercise do I really need?</strong><br>A common goal is about 150 minutes of moderate activity a week — roughly 30 minutes, five days — plus strength work twice a week. But anything is better than nothing. Start where you are.</p>
      <p><strong>What if I have arthritis or joint pain?</strong><br>Gentle, low-impact movement usually helps joint pain rather than worsening it. Swimming and water exercise are especially kind to sore joints.</p>
      <p><strong>Is it safe to lift weights at my age?</strong><br>Yes — strength training is one of the most valuable things older adults can do. Use light weights, good form, and build up slowly. A class or trainer can help you start safely.</p>
      <p>Staying active isnt about doing a lot — it's about doing a little, consistently. Find something you enjoy, start gently, and let it become a happy part of your everyday life.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'constipation-relief-gentle-ways',
    image: '/images/articles/constipation.png',
    category: 'Digestion',
    title: 'Constipation Got You Uncomfortable? Gentle Ways to Find Relief',
    metaDesc: "Constipation is common with age but very manageable. Here are gentle, natural ways to stay regular and feel comfortable again.",
    primaryKeyword: 'constipation relief for seniors',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>It's not the most comfortable topic to bring up, but constipation is one of the most common everyday complaints among older adults — and one of the most fixable. If things have slowed down and you're feeling bloated, sluggish, or uncomfortable, there are plenty of gentle ways to get back to normal.</p>

      <h2>Why Constipation Happens More With Age</h2>
      <p>A few things tend to come together as we get older:</p>
      <ul>
        <li>We often drink less water than we should</li>
        <li>We may be less physically active</li>
        <li>Diets sometimes shift away from high-fiber foods</li>
        <li>Several common medications slow the digestive system</li>
        <li>Some health conditions affect digestion</li>
        <li>Ignoring the urge to go, or changes in routine, can throw things off</li>
      </ul>
      <p>The encouraging news is most constipation responds well to simple, gentle changes.</p>

      <h2>Gentle Ways to Find Relief</h2>
      <p><strong>Drink more water.</strong> This is often the missing piece. Fiber needs water to do its job. Sip water steadily through the day. Warm drinks, like a cup of tea or warm water in the morning, can be especially helpful for getting things moving.</p>
      <p><strong>Eat more fiber — gradually.</strong> Fruits, vegetables, whole grains, beans, and prunes are all good. Prunes and prune juice are a time-tested, gentle remedy. Add fiber slowly over a couple of weeks so your body adjusts comfortably, and drink plenty of water alongside it.</p>
      <p><strong>Move your body.</strong> Physical activity helps your digestive system stay active. Even a daily walk makes a difference.</p>
      <p><strong>Don't ignore the urge.</strong> When your body signals it's time, try to go rather than putting it off. Holding it makes things harder.</p>
      <p><strong>Set a routine.</strong> Your bowels like regularity. Many people find a consistent time each day, often after breakfast, works well.</p>
      <p><strong>Use a small footstool.</strong> Resting your feet on a low stool while on the toilet, so your knees are slightly raised, puts your body in a more natural position and can make going easier.</p>
      <p><strong>Review your medications.</strong> Several common medications — including certain pain relievers and others — can cause constipation. Ask your doctor or pharmacist if any of yours might be the culprit, and whether anything can be adjusted.</p>
      <p><strong>Use laxatives carefully.</strong> Gentle fiber supplements and stool softeners are usually fine, but stronger laxatives shouldn't be used regularly without guidance. Ask your doctor or pharmacist what's appropriate for you.</p>

      <h2>When to See a Doctor</h2>
      <p>Most constipation is easily managed, but see your doctor if it's a sudden change from your normal pattern, if it lasts more than a couple of weeks despite these changes, if you have belly pain, if you notice blood, or if you're losing weight without trying. These deserve a proper look. Severe pain with no bowel movement at all also needs prompt attention.</p>

      <h2>FAQ</h2>
      <p><strong>How often should I have a bowel movement?</strong><br>"Normal" varies a lot — anywhere from three times a day to three times a week can be fine. What matters is what's normal for you, and a noticeable change from that.</p>
      <p><strong>Are prunes really that helpful?</strong><br>Yes. Prunes are one of the best-studied natural remedies for constipation. A few prunes or a small glass of prune juice daily works well for many people.</p>
      <p><strong>Is it okay to use laxatives often?</strong><br>Gentle options like fiber supplements are generally fine. Stronger stimulant laxatives shouldn't be a daily habit without your doctor's guidance, as your body can come to rely on them.</p>
      <p><strong>Can drinking more water alone fix constipation?</strong><br>For some people, yes — many of us simply don't drink enough. Combined with fiber and movement, it works even better.</p>
      <p>Constipation is common but it doesn't have to be something you put up with. A little more water, fiber, and movement usually brings comfortable relief — and if it doesn't, your doctor can help.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  },
  {
    id: 'feeling-lonely-ways-to-reconnect',
    image: '/images/articles/connection.png',
    category: 'Mental Health',
    title: 'Feeling Lonely or Isolated? Ways to Reconnect and Feel Better',
    metaDesc: "Loneliness is common later in life and affects health. Here are warm, practical ways to reconnect and feel more engaged.",
    primaryKeyword: 'loneliness in older adults',
    readTime: '4 min read',
    author, authorBio,
    content: `
      <p>If your days feel quieter than they used to, or you go stretches without really talking to anyone, you're experiencing something a great many older adults quietly go through. Loneliness isn't a personal failing and it's nothing to be ashamed of — it's a common part of life's changes. It also matters for your health, which is exactly why it's worth gently doing something about.</p>

      <h2>Why Loneliness Happens Later in Life</h2>
      <p>Life naturally changes as we age. Retirement removes the daily rhythm of coworkers. Friends and loved ones may move away or pass on. Children and grandchildren are often busy with their own lives. Health issues or no longer driving can make it harder to get out. Hearing loss can make conversation tiring. None of this is anyone's fault — it's just life shifting, and it can leave us more isolated than we'd like.</p>

      <h2>Why It's Worth Addressing</h2>
      <p>Staying connected isn't only about feeling good, though that matters. Social connection is linked to better health — it supports your mood, your memory, your heart, and even how long and how well you live. Reaching out is genuinely good for you, not just pleasant.</p>

      <h2>Warm, Practical Ways to Reconnect</h2>
      <p><strong>Start small with people you already know.</strong> A phone call to an old friend, a note to a relative, a chat with a neighbor. Connection doesn't have to be big to count.</p>
      <p><strong>Set up regular contact.</strong> A standing weekly phone call with a family member or friend gives you something to look forward to and keeps the bond steady.</p>
      <p><strong>Look into your local senior center.</strong> Senior centers often offer meals, classes, games, exercise groups, and outings. They're built for exactly this, and many people find good friends there.</p>
      <p><strong>Find a group around something you enjoy.</strong> A hobby club, a walking group, a faith community, a book club, a volunteer role. Shared activities make conversation easy and natural.</p>
      <p><strong>Volunteer.</strong> Helping others is one of the most reliable ways to feel connected and purposeful. Schools, libraries, food banks, and hospitals all welcome older volunteers.</p>
      <p><strong>Consider a class.</strong> Community centers and libraries often offer low-cost classes. Learning something new alongside others is good for the mind and the social life both.</p>
      <p><strong>Stay in touch through technology, if you'd like.</strong> A simple video call lets you see grandchildren's faces. If you're unsure how, a family member or a library class can show you — it's easier than it looks.</p>
      <p><strong>Consider a pet, if it suits your situation.</strong> For some people, a pet brings wonderful companionship and a reason to get up and out each day.</p>
      <p><strong>Address barriers honestly.</strong> If hearing loss makes socializing hard, get your hearing checked — hearing aids can transform your social life. If transportation is the issue, look into senior ride services or community shuttles.</p>

      <h2>When to Reach Out for More Support</h2>
      <p>If loneliness has tipped into ongoing sadness — if you've lost interest in things, are sleeping or eating poorly, or feel hopeless — please talk to your doctor. Depression is common, treatable, and not something to face alone. If you ever feel life isn't worth living, reach out right away: in the US, you can call or text 988 to reach the Suicide and Crisis Lifeline, any time.</p>

      <h2>FAQ</h2>
      <p><strong>Is it normal to feel lonely as I get older?</strong><br>It's very common, given how much changes in later life. Common doesn't mean you have to accept it, though — connection can be rebuilt.</p>
      <p><strong>How is loneliness different from being alone?</strong><br>Being alone is simply being by yourself, which many people enjoy. Loneliness is the painful feeling of wanting more connection than you have. You can feel lonely even around others.</p>
      <p><strong>What if I'm shy or it feels hard to reach out?</strong><br>Start very small — one phone call, one familiar face. Structured activities help, because the shared activity carries the conversation. It gets easier with practice.</p>
      <p><strong>Can loneliness really affect my physical health?</strong><br>Yes. Research links ongoing loneliness to poorer health outcomes. Connection is genuinely a form of self-care.</p>
      <p>Reaching out can feel hard at first, but most people are glad to hear from someone — and glad to be asked. One small step at a time, a fuller, warmer daily life is well within reach.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `
  }
];

const filePath = './src/data/articles.js';
let content = fs.readFileSync(filePath, 'utf8');

// first truncate if we already appended
const truncateIdx = content.indexOf('prevent-falls-stay-steady');
if (truncateIdx !== -1) {
  // Go back to the '{\n  "id": "prevent-falls' part
  const bracketIndex = content.lastIndexOf('{', truncateIdx);
  if (bracketIndex !== -1) {
    // and go back before the comma
    const commaIndex = content.lastIndexOf(',', bracketIndex);
    if (commaIndex !== -1) {
      content = content.substring(0, commaIndex) + '\n];\n';
    }
  }
}

const closingBracketIndex = content.lastIndexOf('];');
if (closingBracketIndex !== -1) {
  function toJsString(obj) {
    let str = '{\n';
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'content') {
        str += '  ' + k + ': `' + v.replace(/\`/g, '\\\`') + '`,\n';
      } else {
        str += '  ' + k + ': ' + JSON.stringify(v) + ',\n';
      }
    }
    str += '}';
    return str;
  }

  const appended = newArticles.map(a => toJsString(a)).join(',\n');
  const newContent = content.substring(0, closingBracketIndex) + ',\n' + appended + '\n];\n';
  
  fs.writeFileSync(filePath, newContent);
  console.log('Appended 10 articles with author bio successfully!');
} else {
  console.error('Could not find closing bracket in articles.js');
}
```

## File: `check-overlap.cjs`

```cjs
const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

const products = JSON.parse(jsonStrMatch[1]);

const nameCount = {};
const idCount = {};
const duplicates = [];

products.forEach(p => {
    nameCount[p.name] = (nameCount[p.name] || 0) + 1;
    idCount[p.id] = (idCount[p.id] || 0) + 1;
});

console.log("--- Duplicate Names ---");
for (const [name, count] of Object.entries(nameCount)) {
    if (count > 1) {
        console.log(`${name}: ${count} occurrences`);
        duplicates.push({ name, type: 'name' });
    }
}

console.log("\n--- Duplicate IDs ---");
for (const [id, count] of Object.entries(idCount)) {
    if (count > 1) {
        console.log(`ID ${id}: ${count} occurrences`);
        duplicates.push({ id, type: 'id' });
    }
}

if (duplicates.length === 0) {
    console.log("No exact duplicates found.");
}

// Check for fuzzy overlaps (e.g., "HerSolution" and "HerSolution Gel")
console.log("\n--- Potential Fuzzy Overlaps ---");
products.forEach((p1, i) => {
    products.slice(i + 1).forEach(p2 => {
        const n1 = p1.name.toLowerCase();
        const n2 = p2.name.toLowerCase();
        if (n1.includes(n2) || n2.includes(n1)) {
            console.log(`Potential overlap: "${p1.name}" (ID ${p1.id}) and "${p2.name}" (ID ${p2.id})`);
        }
    });
});
```

## File: `clean-descriptions.cjs`

```cjs
const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');

// We just want to extract the products array from the file, process it, and write it back.
// Since it's a JS file, we can do string manipulation or evaluate it.
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);
if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

let products = JSON.parse(jsonStrMatch[1]);

const badWords = ['affiliate', 'commission', 'cash', 'traffic', 'sale', 'sales page', 'average order', 'epc', 'conversion', 'offer'];

function cleanText(text) {
    if (!text) return "";
    let sentences = text.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 10);
    // filter out sentences with bad words
    sentences = sentences.filter(s => {
        const lower = s.toLowerCase();
        return !badWords.some(w => lower.includes(w));
    });
    return sentences;
}

products = products.map(p => {
    let goodSentences = cleanText(p.description + " " + (p.bullets ? p.bullets.join(" ") : ""));
    if (goodSentences.length === 0) {
        goodSentences = [`Premium clinical formulation specifically engineered for ${p.subniche || p.category.toLowerCase()}.`, `Provides high-affinity support for your primary health goals.`];
    }
    
    p.description = goodSentences[0] + ".";
    p.bullets = goodSentences.slice(0, 3).map(s => s + ".");
    
    // Fix category if it's generic
    if (p.category === 'General Health') {
        if (p.subniche === 'Testosterone Boost' || p.subniche === 'Erectile Support' || p.subniche === 'Semen Volume') {
            p.category = "Men's Health";
        } else if (p.subniche === 'Female Libido') {
            p.category = "Women's Health";
        } else if (p.subniche === 'Skin Care') {
            p.category = "Skin Care";
        } else if (p.subniche === 'HGH Boost' || p.subniche === 'Brain Health') {
            p.category = "Anti-aging";
        } else if (p.subniche === 'Fat Loss') {
            p.category = "Muscle & Fitness";
        }
    }

    p.rationale = `Authorized clinical formulation based on your specific focus in ${p.subniche}. Proven to deliver optimized support via high-affinity biological absorption.`;

    return p;
});

const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));

const finalContent = `export const products = ${JSON.stringify(products, null, 2)};\n\n${logicPart}`;

fs.writeFileSync('src/data/products.js', finalContent);
console.log("Cleaned descriptions for " + products.length + " products.");
```

## File: `cleanup-products.cjs`

```cjs
const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

let products = JSON.parse(jsonStrMatch[1]);

// IDs to remove based on analysis:
// 28: Generic "VigRX" (redundant with VigRX Plus, etc.)
// 11: Generic "PrimeGENIX" (redundant with Bone Complex, etc.)
// 64: duplicate "hersolution" (lowercase)
// 62: duplicate "provestra" (lowercase)
// 101: duplicate "Dermefface FX7 Scar Reduction Therapy" (redundant with ID 45)
const toRemove = [28, 11, 64, 62, 101];

const filtered = products.filter(p => !toRemove.includes(p.id));

const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
const finalContent = `export const products = ${JSON.stringify(filtered, null, 2)};\n\n${logicPart}`;

fs.writeFileSync('src/data/products.js', finalContent);
console.log(`Cleaned up ${toRemove.length} overlapping/duplicate entries. ${filtered.length} products remaining.`);
```

## File: `convert_faqs.cjs`

```cjs
const fs = require('fs');
let c = fs.readFileSync('src/data/articles.js', 'utf8');
c = c.replace(/<p><strong>(.*?)<\/strong><br>(.*?)<\/p>/g, '<details class="faq-details"><summary class="faq-summary">$1</summary><div class="faq-answer"><p>$2</p></div></details>');
fs.writeFileSync('src/data/articles.js', c);
console.log('Converted FAQs!');
```

## File: `convert_images.cjs`

```cjs
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processImages() {
  const articlesDir = path.join(__dirname, 'public', 'images', 'articles');
  const files = fs.readdirSync(articlesDir);
  
  for (const file of files) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(articlesDir, file);
      const outputName = file.replace(/\.png$/, '.jpg');
      const outputPath = path.join(articlesDir, outputName);
      
      console.log(`Converting ${file} to ${outputName}...`);
      
      try {
        await sharp(inputPath)
          .jpeg({ quality: 75, progressive: true, mozjpeg: true })
          .toFile(outputPath);
          
        // Delete original png
        fs.unlinkSync(inputPath);
        console.log(`Deleted ${file}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }

  // Update articles.js
  const jsPath = path.join(__dirname, 'src', 'data', 'articles.js');
  let jsContent = fs.readFileSync(jsPath, 'utf8');
  
  jsContent = jsContent.replace(/\.png/g, '.jpg');
  fs.writeFileSync(jsPath, jsContent);
  console.log('Updated src/data/articles.js');
}

processImages().catch(console.error);
```

## File: `deploy.bat`

```bat
@echo off
setlocal
echo Starting Build and Deployment to Cloudflare Pages...

echo Step 1: Building project with Vite...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed.
    pause
    exit /b %errorlevel%
)

echo Step 2: Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist
if %errorlevel% neq 0 (
    echo Error: Cloudflare deployment failed.
    echo Tip: Make sure you are logged into Wrangler (npx wrangler login).
    pause
    exit /b %errorlevel%
)

echo Deployment successful!
pause
exit /b 0
```

## File: `desc-cleanup.cjs`

```cjs
const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

const products = JSON.parse(jsonStrMatch[1]);

const seenDescriptions = new Set();
const toRemove = [];

products.forEach(p => {
    const desc = p.description.trim();
    if (seenDescriptions.has(desc)) {
        console.log(`Duplicate description found: ${p.name} (ID ${p.id})`);
        toRemove.push(p.id);
    } else {
        seenDescriptions.add(desc);
    }
});

console.log(`\nFound ${toRemove.length} description overlaps.`);
if (toRemove.length > 0) {
    const filtered = products.filter(p => !toRemove.includes(p.id));
    const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
    const finalContent = `export const products = ${JSON.stringify(filtered, null, 2)};\n\n${logicPart}`;
    fs.writeFileSync('src/data/products.js', finalContent);
    console.log(`Removed ${toRemove.length} products. ${filtered.length} products remaining.`);
}
```

## File: `eslint.config.js`

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
```

## File: `faq_styles.css`

```css

/* FAQ Styles */
.faq-details {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-details[open] {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--accent-green);
}

.faq-summary {
  padding: 1.25rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main-site);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.2s ease;
}

.faq-summary::-webkit-details-marker {
  display: none;
}

.faq-summary::after {
  content: '+';
  font-size: 1.5rem;
  color: var(--accent-green);
  transition: transform 0.3s ease;
  line-height: 1;
}

.faq-details[open] .faq-summary::after {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 1.5rem 1.25rem;
  color: var(--text-muted-site);
  font-size: 1rem;
  line-height: 1.6;
  border-top: 1px solid transparent;
  animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## File: `generate-sitemap.js`

```js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read files directly as text to avoid issues with ES imports of React components if any.
// Actually, data/products.js and data/articles.js seem pure. Let's just import them.
import { products } from './src/data/products.js';
import { articles } from './src/data/articles.js';

const SITE_URL = 'https://eternofit.com';

const staticRoutes = [
  '/',
  '/articles',
  '/marketplace',
  '/tools',
  '/tools?tool=bmi',
  '/tools?tool=testosterone',
  '/tools?tool=realage',
  '/tools?tool=longevity',
  '/tools?tool=sleep',
  '/tools?tool=meal',
  '/tools?tool=stress',
  '/quiz',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/affiliate'
];

// Extract unique categories
const categorySet = new Set(products.map(p => p.category).filter(Boolean));
const categories = Array.from(categorySet);

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

const addUrl = (url) => {
  sitemap += `  <url>\n    <loc>${SITE_URL}${url.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
};

staticRoutes.forEach(addUrl);

// Add marketplace categories
categories.forEach(cat => {
  addUrl(`/marketplace?category=${encodeURIComponent(cat)}`);
});

// Add articles
articles.forEach(art => {
  addUrl(`/article/${art.id}`);
});

sitemap += `</urlset>`;

const publicPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemap);
console.log('sitemap.xml generated successfully at', publicPath);
```

## File: `get_first_10.cjs`

```cjs
const fs = require('fs');
const content = fs.readFileSync('src/data/articles.js', 'utf8');
const ids = [...content.matchAll(/id:\s*['"](.*?)['"]/g)].map(m => m[1]);
const titles = [...content.matchAll(/title:\s*['"](.*?)['"]/g)].map(m => m[1]);
const images = [...content.matchAll(/image:\s*['"](.*?)['"]/g)].map(m => m[1]);

console.log(ids.slice(0, 10).map((id, i) => `${id} --- ${titles[i]} --- ${images[i]}`).join('\n'));
```

## File: `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EternoFit | High-Performance Clinical Health & Fitness Protocols</title>
    <meta name="description" content="EternoFit provides evidence-based health assessments and clinical performance protocols. Optimizing human biology through precision nutrition, tactical training, and hormonal health." />
    <meta name="keywords" content="clinical health assessment, performance optimization, tactical fitness, bio-identical nutrition, longevity protocols, health coaching, hormone health" />
    <meta name="author" content="EternoFit Clinical Team" />
    <meta name="robots" content="index, follow" />

    <!-- Google Fonts Preconnect & Optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;700;800;900&display=swap" rel="stylesheet" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="Free Health Assessment Quiz | EternoFit" />
    <meta property="og:description" content="Discover exactly what your body is missing in 60 seconds. Get your FREE personalized health report." />
    <meta property="og:image" content="https://www.eternofit.com/Metatag.jpg" />
    <meta property="og:url" content="https://www.eternofit.com/quiz" />
    <meta property="og:type" content="website" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://eternofit.com/" />
    <meta property="twitter:title" content="EternoFit | Clinical Performance & Health Protocols" />
    <meta property="twitter:description" content="Precision health assessments and tactical performance protocols for elite results." />
    <meta property="twitter:image" content="https://www.eternofit.com/Metatag.jpg" />

    <!-- Canonical Tag -->
    <link rel="canonical" href="https://eternofit.com/" />

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "name": "EternoFit",
      "url": "https://eternofit.com",
      "logo": "https://eternofit.com/logo-dark-bg.png",
      "description": "Providing elite health assessments and clinical-grade wellness protocols for performance optimization.",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "clinical@eternofit.com",
        "contactType": "customer support"
      }
    }
    </script>



    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '952081580961371');
    fbq('track', 'PageView');
    </script>

    <!-- End Meta Pixel Code -->

    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6364820870573275"
     crossorigin="anonymous"></script>
     
    <!-- Lemon Squeezy -->
    <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
  </head>
  <body>
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=952081580961371&ev=PageView&noscript=1" /></noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## File: `list_titles.cjs`

```cjs
const fs = require('fs');
let content = fs.readFileSync('src/data/articles.js', 'utf8');
const titles = [...content.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log(JSON.stringify(titles, null, 2));
```

## File: `migrate_collections.py`

```py
import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove separate savedCampaigns state
content = content.replace("const [savedCampaigns, setSavedCampaigns] = useState([]);\n", "")

# 2. Add derived states right after `const [campaigns, setCampaigns] = useState([]);`
# Wait, we can just define `savedCampaigns` inside the component body, not as state.
# We'll put it right after `const [campaigns, setCampaigns] = useState([]);`
derived_state = """const [campaigns, setCampaigns] = useState([]);
  const savedCampaigns = campaigns.filter(c => c.isPaused);
  const historyCampaigns = campaigns.filter(c => !c.isPaused);"""
content = content.replace("const [campaigns, setCampaigns] = useState([]);", derived_state)

# 3. Update Stop & Save to use marketing_campaigns
save_logic_old = "await addDoc(collection(db, 'saved_campaigns'), {"
save_logic_new = "await addDoc(collection(db, 'marketing_campaigns'), {\n        isPaused: true,"
content = content.replace(save_logic_old, save_logic_new)

# Update `savedAt` to `sentAt` so the orderBy works without new indexes
content = content.replace("savedAt: serverTimestamp()", "sentAt: serverTimestamp(),\n        savedAt: serverTimestamp()")

# 4. Remove unsubSavedCampaigns
fetch_regex = r"// 5\. Fetch paused/saved campaigns.*?unsubSavedCampaigns\(\);\s*\};\s*"
fetch_replacement = "};\n"
content = re.sub(fetch_regex, fetch_replacement, content, flags=re.DOTALL)

# 5. Update handleResumeSavedCampaign to delete from marketing_campaigns
resume_delete_old = "await deleteDoc(doc(db, 'saved_campaigns', savedCamp.id));"
resume_delete_new = "await deleteDoc(doc(db, 'marketing_campaigns', savedCamp.id));"
content = content.replace(resume_delete_old, resume_delete_new)

# 6. Update handleDeleteSavedCampaign to delete from marketing_campaigns
content = content.replace(resume_delete_old, resume_delete_new) # already replaced by above if identical, wait, let's just do both
delete_old = "await deleteDoc(doc(db, 'saved_campaigns', id));"
delete_new = "await deleteDoc(doc(db, 'marketing_campaigns', id));"
content = content.replace(delete_old, delete_new)

# 7. Use historyCampaigns instead of campaigns for filteredCampaigns
filter_old = "const filteredCampaigns = campaigns.filter(camp => {"
filter_new = "const filteredCampaigns = historyCampaigns.filter(camp => {"
content = content.replace(filter_old, filter_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Migrated saved campaigns to marketing_campaigns!")
```

## File: `package.json`

```json
{
  "name": "quiz-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "node generate-sitemap.js && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "deploy": "node generate-sitemap.js && vite build && wrangler pages deploy dist"
  },
  "dependencies": {
    "firebase": "^12.12.1",
    "lucide-react": "^0.475.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "sharp": "^0.34.5"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.5.0",
    "vite": "^8.0.10",
    "wrangler": "^3.111.0"
  }
}
```

## File: `parse-products.cjs`

```cjs
const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const products = [];
let idCounter = 1;

const getSubniche = (name, category, summary) => {
    name = name.toLowerCase();
    const sum = (summary || '').toLowerCase();
    
    if (name.includes('vigrx plus') || name.includes('erectin') || name.includes('extenze') || name.includes('prosolution') || name.includes('magnarx') || name.includes('proextender')) return 'Erectile Support';
    if (name.includes('testo') || name.includes('testrx') || name.includes('provacyl') || name.includes('cortisync')) return 'Testosterone Boost';
    if (name.includes('genf20') || name.includes('genfx') || name.includes('hypergh')) return 'HGH Boost';
    if (name.includes('hersolution') || name.includes('provestra') || name.includes('vigorelle')) return 'Female Libido';
    if (name.includes('kollagen') || name.includes('dermefface') || name.includes('illuminatural')) return 'Skin Care';
    if (name.includes('brain')) return 'Brain Health';
    if (name.includes('calmlean')) return 'Fat Loss';
    if (name.includes('semenax') || name.includes('volume pills') || name.includes('semenhance') || name.includes('max volume')) return 'Semen Volume';
    if (name.includes('delay')) return 'Stamina & Delay';
    if (name.includes('nexus')) return 'Pheromones';
    if (category.toLowerCase().includes('anti-aging')) return 'Anti-aging';
    if (category.toLowerCase().includes('women')) return 'Women\'s Health';
    if (category.toLowerCase().includes('men')) return 'Men\'s Health';
    return category;
};

const imageMap = {
    'vigrx plus': 'VigRXPlus.jpg',
    'testosil': 'Testosil.jpg',
    'genf20 plus': 'GenF20 Plus.jpg',
    'hersolution': 'HerSolution.jpg',
    'kollagen intensiv': 'KollagenIntensiv.jpg',
    'brain pill': 'BrainPill.jpg',
    'calmlean': 'CalmLean.jpg',
    'semenax': 'Semenax.jpg',
    'buyextenze': 'BuyExtenze.jpg',
    'extenze': 'BuyExtenze.jpg',
    'confitrol24': 'Confitrol24.jpg',
    'cortisync': 'CortiSync.jpg',
    'dim 3x': 'DIM 3X.jpg',
    'dermefface': 'DermeffaceFX7.jpg',
    'dermefface fx7': 'DermeffaceFX7.jpg',
    'erectin gummies': 'Erectin Gummies.jpg',
    'erectin': 'Erectin.jpg',
    'erectin gel': 'ErectinGel.jpg',
    'fertility factor 5': 'FertilityFactor5.jpg',
    'fertilityfactor5': 'FertilityFactor5.jpg',
    'genf20': 'GenF20.jpg',
    'genfx': 'GenFX.jpg',
    'hersolution gel': 'HerSolutionGel.jpg',
    'hypergh 14x': 'HyperGH14x.jpg',
    'illuminatural 6i': 'Illuminatural6i.jpg',
    'magnarx': 'MagnaRX.jpg',
    'nexus pheromones': 'NexusPheromones.jpg',
    'proextender': 'ProExtender.jpg',
    'prosolution gel': 'ProsolutionGel.jpg',
    'prosolution pills': 'ProsolutionPills.jpg',
    'prosolution plus': 'ProsolutionPlus.jpg',
    'provacyl': 'Provacyl.jpg',
    'provestra': 'Provestra.jpg',
    'semenhance': 'SemEnhance.jpg',
    'testrx': 'TestRX.jpg',
    'testodren': 'Testodren.jpg',
    'total curve': 'TotalCurve.jpg',
    'vigrx delay spray': 'VigRXDelaySpray.jpg',
    'vigrx delay wipes': 'VigRXDelayWipes.jpg',
    'vigrx nitric oxide': 'VigRXNitricOxide.jpg',
    'vigrx oil': 'VigRXOil.jpg',
    'vigorelle': 'Vigorelle.jpg',
    'vigrx incontinix': 'VigrxIncontinix.jpg',
    'vigrx max volume': 'VigrxMaxVolume.jpg',
    'volume pills': 'VolumePills.jpg'
};

const cleanName = (name) => {
    return name.replace(/[\?©®™]/g, '').trim();
};

const extractBullets = (summary) => {
    if (!summary) return [];
    // Just extract a few lines that look like bullets or sentences
    const sentences = summary.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 20);
    return sentences.slice(0, 3).map(s => s + '.');
};

const getImage = (name) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(imageMap)) {
        if (key.includes(k) || k.includes(key)) {
            return `/products/${v}`;
        }
    }
    // Fallback based on alphanumeric match
    const alphaName = key.replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(imageMap)) {
        if (v.toLowerCase().replace(/[^a-z0-9]/g, '').includes(alphaName)) {
            return `/products/${v}`;
        }
    }
    return `/products/${name.replace(/[^a-zA-Z0-9]/g, '')}.jpg`; // best guess
};

fs.createReadStream('SellHealth  (1).csv')
  .pipe(csv())
  .on('data', (data) => {
      const name = cleanName(data['Product Name'] || '');
      if (!name) return;

      const category = data['Category'] || 'General Health';
      const affiliateLink = "https://" + (data['Product Link'] || 'www.sellhealth.com') + "/ct/976241";
      const summary = data['Summary'] || '';
      const info = data['Information for Affiliates'] || '';
      
      const combinedText = summary + " " + info;
      const bullets = extractBullets(combinedText);
      const description = bullets[0] || `${name} is a premium ${category.toLowerCase()} supplement.`;
      const rationale = "Clinically formulated with high-quality ingredients based on the latest research for " + category.toLowerCase() + ".";

      products.push({
          id: idCounter++,
          name: name,
          category: category,
          subniche: getSubniche(name, category, combinedText),
          priority: 0, // Will be updated by quiz logic
          description: description,
          bullets: bullets,
          rationale: rationale,
          affiliateLink: affiliateLink,
          image: getImage(name),
          status: 'active'
      });
  })
  .on('end', () => {
      // Deduplicate by name
      const uniqueProducts = [];
      const seen = new Set();
      for (const p of products) {
          if (!seen.has(p.name)) {
              seen.add(p.name);
              uniqueProducts.push(p);
          }
      }

      const jsContent = `export const products = ${JSON.stringify(uniqueProducts, null, 2)};\n\n` + 
`export const getFilteredProducts = (answers, customProducts = products) => {
  const matches = customProducts.filter(p => p.status !== 'inactive').map(product => {
    let score = 0;
    const goals = Array.isArray(answers.primaryGoal) ? answers.primaryGoal : [answers.primaryGoal].filter(Boolean);
    const focuses = answers.specificFocus ? (Array.isArray(answers.specificFocus) ? answers.specificFocus : [answers.specificFocus].filter(Boolean)) : [];
    
    // Evaluate goals
    goals.forEach(goal => {
      if (product.category.includes(goal)) score += 3;
      if (goal === 'Intimate Performance' && product.category === "Men's Health") score += 3;
      if (goal === 'Muscle & Physique' && product.category === "Muscle & Fitness") score += 3;
      if (goal === 'Anti-aging & Vitality' && product.category === "Anti-aging") score += 3;
      if (goal === 'Skin & Beauty' && product.category === "Skin Care") score += 3;
      if (goal === 'Brain & Focus' && product.category === "Anti-aging") score += 2;
    });

    // Evaluate focuses
    focuses.forEach(focus => {
      // Match exactly or closely with subniche
      if (
        ((focus === 'Erection Quality' || focus === 'Stamina') && (product.subniche === 'Erectile Support' || product.subniche === 'Stamina & Delay')) ||
        ((focus === 'Low Libido') && (product.subniche === 'Female Libido' || product.subniche === 'Erectile Support')) ||
        ((focus === 'Semen Volume') && product.subniche === 'Semen Volume') ||
        ((focus === 'Low Testosterone' || focus === 'More Energy') && product.subniche === 'Testosterone Boost') ||
        ((focus === 'Stubborn Fat') && product.subniche === 'Fat Loss') ||
        ((focus === 'Slow Recovery' || focus === 'Low Energy' || focus === 'Anti-aging' || focus === 'General Health') && product.subniche === 'HGH Boost') ||
        ((focus === 'Fine Lines & Wrinkles' || focus === 'Acne Scars' || focus === 'Anti-aging') && product.category === 'Skin Care') ||
        ((focus === 'Brain Fog' || focus === 'Memory Decline') && product.subniche === 'Brain Health')
      ) {
        score += 5; // Higher weight for exact subniche match
      }
      
      // Keyword matching in description/bullets for edge cases
      const keywordMap = {
          'Erection Quality': ['erect', 'hard', 'blood flow'],
          'Stamina': ['stamina', 'delay', 'last longer'],
          'Low Libido': ['libido', 'desire', 'sex drive'],
          'Semen Volume': ['volume', 'semen', 'sperm', 'load'],
          'Low Testosterone': ['testosterone', 't-levels', 'muscle mass'],
          'More Energy': ['energy', 'fatigue', 'vitality'],
          'Stubborn Fat': ['fat', 'weight loss', 'metabolism'],
          'Slow Recovery': ['recovery', 'muscle repair'],
          'Fine Lines & Wrinkles': ['wrinkle', 'collagen', 'aging skin', 'lines'],
          'Acne Scars': ['scar', 'acne', 'blemish'],
          'Brain Fog': ['focus', 'memory', 'cognitive', 'brain fog'],
          'Memory Decline': ['memory', 'recall']
      };
      
      if (keywordMap[focus]) {
          const contentStr = (product.description + " " + product.bullets.join(" ")).toLowerCase();
          for (let keyword of keywordMap[focus]) {
              if (contentStr.includes(keyword)) {
                  score += 2;
              }
          }
      }
    });

    if (score > 0) {
      score += product.priority; // Admin assigned priority
    }

    return { ...product, score };
  });

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score).filter(p => p.score > 0);
};
`;

      fs.writeFileSync('src/data/products.js', jsContent);
      console.log('Successfully wrote src/data/products.js with ' + uniqueProducts.length + ' products.');
  });
```

## File: `README.md`

```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

## File: `repair_articles.cjs`

```cjs
const fs = require('fs');

const filePath = './src/data/articles.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find where the new articles started
const badStartIndex = content.indexOf(',\n{\n  "id": "prevent-falls-stay-steady"');

if (badStartIndex !== -1) {
  content = content.substring(0, badStartIndex) + '\n];\n';
  fs.writeFileSync(filePath, content);
  console.log('Restored articles.js to original state.');
} else {
  console.log('Could not find the bad start index. It might already be fixed.');
}
```

## File: `strict-cleanup.cjs`

```cjs
const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

const products = JSON.parse(jsonStrMatch[1]);

const seenNames = new Set();
const seenLinks = new Set();
const toRemove = [];

products.forEach(p => {
    const cleanName = p.name.toLowerCase().trim();
    const cleanLink = p.affiliateLink.toLowerCase().trim();
    
    if (seenNames.has(cleanName)) {
        console.log(`Duplicate name found: ${p.name} (ID ${p.id})`);
        toRemove.push(p.id);
    } else if (seenLinks.has(cleanLink)) {
        console.log(`Duplicate link found for: ${p.name} (ID ${p.id}) - link: ${p.affiliateLink}`);
        toRemove.push(p.id);
    } else {
        seenNames.add(cleanName);
        seenLinks.add(cleanLink);
    }
});

console.log(`\nFound ${toRemove.length} strict overlaps.`);
if (toRemove.length > 0) {
    const filtered = products.filter(p => !toRemove.includes(p.id));
    const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
    const finalContent = `export const products = ${JSON.stringify(filtered, null, 2)};\n\n${logicPart}`;
    fs.writeFileSync('src/data/products.js', finalContent);
    console.log(`Removed ${toRemove.length} products. ${filtered.length} products remaining.`);
} else {
    console.log("No strict overlaps found.");
}
```

## File: `sync-firebase.js`

```js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { products } from "./src/data/products.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiGKfkwog89yIQVILVg3vWrlPL1B8n8I8",
  authDomain: "eternofit-67a94.firebaseapp.com",
  projectId: "eternofit-67a94",
  storageBucket: "eternofit-67a94.firebasestorage.app",
  messagingSenderId: "143266529296",
  appId: "1:143266529296:web:50c8b939740c1180250a95",
  measurementId: "G-H46TNYLL2B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sync() {
  console.log("Starting sync to Firebase...");
  try {
    for (const prod of products) {
      await setDoc(doc(db, "products", prod.id.toString()), prod);
      console.log(`Synced: ${prod.name}`);
    }
    console.log("All products successfully synced!");
    process.exit(0);
  } catch (error) {
    console.error("Error syncing:", error);
    process.exit(1);
  }
}

sync();
```

## File: `temp_products.cjs`

```cjs
module.exports = [
  {
    "id": 1,
    "name": "VigRX Plus",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 10,
    "description": "A clinically tested daily supplement designed to support male vitality, enhance healthy blood flow, and promote long-term sexual wellness through a blend of natural botanicals.",
    "bullets": [
      "Clinically studied formulation for male wellness and vitality.",
      "Includes Bioperine to support maximum nutrient absorption.",
      "Formulated to optimize natural blood flow and energy levels."
    ],
    "rationale": "Addresses the foundational aspects of male sexual health by supporting healthy circulation and stamina with well-documented, natural ingredients.",
    "affiliateLink": "https://VigRXPlus.net/ct/976241",
    "image": "/products/VigRXPlus.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 2,
    "name": "Testosil",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "An advanced testosterone support complex that utilizes clinically researched ingredients, including KSM-66 Ashwagandha, to help naturally boost testosterone levels and support muscle recovery.",
    "bullets": [
      "Features KSM-66 Ashwagandha for natural testosterone support.",
      "Designed to aid in muscle recovery, strength, and daily energy.",
      "Contains a comprehensive blend of vitamins and adaptogens."
    ],
    "rationale": "A targeted approach for men looking to counter natural testosterone decline, focusing on scientifically backed adaptogens rather than harsh stimulants.",
    "affiliateLink": "https://Testosil.com/ct/976241",
    "image": "/products/Testosil.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 3,
    "name": "GenF20 Plus",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 10,
    "description": "A comprehensive anti-aging system designed to naturally stimulate the body's production of Human Growth Hormone (HGH), supporting joint health, energy, and overall vitality.",
    "bullets": [
      "Enteric-coated tablets ensure maximum absorption of key nutrients.",
      "Supports natural energy levels, skin elasticity, and muscle tone.",
      "A non-synthetic alternative for long-term aging support."
    ],
    "rationale": "Provides metabolic and systemic support for healthy aging by encouraging the body to maintain its own natural hormone production pathways safely.",
    "affiliateLink": "https://GenF20Muscle.com/ct/976241",
    "image": "/products/GenF20 Plus.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 4,
    "name": "Erectin",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A polyherbal formulation featuring an advanced extended-release gel cap delivery system, designed to support rapid nutrient absorption for enhanced male performance.",
    "bullets": [
      "Advanced liquid gel cap technology for fast, sustained release.",
      "Backed by clinical studies focusing on male sexual health.",
      "Utilizes a protective enteric coating to preserve ingredient integrity."
    ],
    "rationale": "Optimizes bioavailability of herbal extracts through modern encapsulation, making it a reliable option for consistent erectile support.",
    "affiliateLink": "https://Erectin.com/ct/976241",
    "image": "/products/Erectin Gummies.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 5,
    "name": "Semenax",
    "category": "Men's Health",
    "subniche": "Semen Volume",
    "priority": 10,
    "description": "A daily supplement formulated with targeted amino acids and herbal extracts to support the male reproductive system, promoting natural semen production and enhanced climax intensity.",
    "bullets": [
      "Supports the natural function of the male reproductive system.",
      "Formulated with L-Arginine, Muira Puama, and essential aminos.",
      "Designed to enhance overall climax intensity and control."
    ],
    "rationale": "Targets the specific glandular systems responsible for seminal fluid production, offering a safe, nutrient-based approach to male reproductive wellness.",
    "affiliateLink": "https://Semenax.com/ct/976241",
    "image": "/products/Semenax.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 7,
    "name": "DIM 3X",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A dual-action hormonal support supplement designed specifically for men to help balance active estrogen levels while supporting healthy testosterone function.",
    "bullets": [
      "Features DIM (Diindolylmethane) to help regulate estrogen metabolism.",
      "Supports balanced mood, daily energy, and lean muscle mass.",
      "Includes Vitamin E and Bioperine for enhanced cellular absorption."
    ],
    "rationale": "Essential for men experiencing hormonal shifts, as it actively works to process and eliminate excess estrogen while preserving usable testosterone.",
    "affiliateLink": "https://DIM3X.com/ct/976241",
    "image": "/products/DIM 3X.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 8,
    "name": "Testodren",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 10,
    "description": "A single-ingredient, patented testosterone booster derived from Fenugreek extract (Furosap), clinically studied to support free testosterone levels in men over 30.",
    "bullets": [
      "Contains 100% patented Furosap for targeted testosterone support.",
      "Clinically shown to support energy, mood, and physical stamina.",
      "Simple, focused formula without unnecessary filler ingredients."
    ],
    "rationale": "Ideal for men seeking a straightforward, clinically validated, and highly focused single-herb approach to supporting free testosterone.",
    "affiliateLink": "https://Testodren.com/ct/976241",
    "image": "/products/Testodren.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 9,
    "name": "CalmLean",
    "category": "Muscle & Fitness",
    "subniche": "Fat Loss",
    "priority": 10,
    "description": "A stimulant-free weight management supplement formulated with ForsLean to help support a healthy metabolism and promote lean muscle mass during weight loss.",
    "bullets": [
      "100% stimulant-free formula prevents jitters and energy crashes.",
      "Features patented ForsLean to support cellular metabolism.",
      "Aids in targeting stubborn fat while preserving lean muscle."
    ],
    "rationale": "Provides a safe metabolic boost without the stress of stimulants, making it ideal for sustainable weight management and overall body composition.",
    "affiliateLink": "https://CalmLean.com/ct/976241",
    "image": "/products/CalmLean.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 10,
    "name": "CortiSync",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "An adaptogenic supplement designed to help the body manage stress and regulate cortisol levels, which can aid in reducing stubborn belly fat and improving daily focus.",
    "bullets": [
      "Formulated with potent adaptogens to support a healthy stress response.",
      "Helps regulate cortisol, a primary contributor to stress-related weight gain.",
      "Supports mental clarity, sustained energy, and physical resilience."
    ],
    "rationale": "Addresses the often-overlooked role of stress hormones in weight management and fatigue, offering a holistic approach to metabolic health.",
    "affiliateLink": "https://CortiSync.com/ct/976241",
    "image": "/products/CortiSync.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 12,
    "name": "ProExtender",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A non-invasive, doctor-designed mechanical traction device created to support steady, natural male enhancement through consistent, gradual stretching.",
    "bullets": [
      "Utilizes clinically supported traction technology for gradual results.",
      "Designed by medical professionals for safe, long-term use.",
      "Comfortable, adjustable, and can be worn discreetly under clothing."
    ],
    "rationale": "Provides a reliable, mechanical alternative to chemical solutions, utilizing the body's natural cellular reproduction response to physical traction.",
    "affiliateLink": "https://ProExtender.com/ct/976241",
    "image": "/products/ProExtender.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 13,
    "name": "HyperGH 14x",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 0,
    "description": "A sophisticated supplement stack designed for active men, combining oral capsules and an oral spray to support natural exercise recovery and lean muscle growth.",
    "bullets": [
      "Dual-delivery system (pills and spray) for maximum bioavailability.",
      "Supports natural recovery times and lean muscle development.",
      "An ideal addition to intense resistance training programs."
    ],
    "rationale": "Leverages the synergy between targeted amino acids and physical exercise to support the body's natural muscle-building and recovery processes.",
    "affiliateLink": "https://HyperGH14x.com/ct/976241",
    "image": "/products/HyperGH14x.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 14,
    "name": "ProSolution Plus",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A clinically tested daily male health supplement formulated with Ayurvedic herbs to help manage performance anxiety and support control.",
    "bullets": [
      "Clinically shown to support men experiencing premature ejaculation.",
      "Features traditional Ayurvedic ingredients like Ashwagandha and Mucuna Pruriens.",
      "Helps reduce performance-related stress while supporting natural stamina."
    ],
    "rationale": "Takes a neurological and psychological approach to male performance, addressing stress and control rather than just physical blood flow.",
    "affiliateLink": "https://ProsolutionPlus.com/ct/976241",
    "image": "/products/ProsolutionPlus.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 15,
    "name": "Erectin Gel",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A fast-acting, topical performance gel formulated with L-Arginine and Vitamin C to support rapid local blood flow and enhance physical sensitivity on contact.",
    "bullets": [
      "Topical application allows for near-instant, targeted results.",
      "Formulated with L-Arginine to support healthy local circulation.",
      "Aloe Vera base ensures smooth application and skin hydration."
    ],
    "rationale": "Bypasses the digestive system entirely, offering men a highly targeted, immediate option for enhancing local circulation and physical sensitivity.",
    "affiliateLink": "https://ErectinGel.com/ct/976241",
    "image": "/products/Erectin.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 17,
    "name": "Volume Pills",
    "category": "Men's Health",
    "subniche": "Semen Volume",
    "priority": 0,
    "description": "A natural male enhancement formulation drawing on traditional herbal medicine to support the male reproductive system and enhance the volume of seminal fluid.",
    "bullets": [
      "Formulated with unique botanical extracts like Ku Gua and Dong Chong Xia Cao.",
      "Supports the health and function of the seminal vesicles and prostate.",
      "Designed to enhance overall climax quality and reproductive wellness."
    ],
    "rationale": "Focuses on the glandular health of the male reproductive system, using a unique blend of traditional herbs to support natural fluid production.",
    "affiliateLink": "https://VolumePills.com/ct/976241",
    "image": "/products/VolumePills.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 18,
    "name": "TestRX",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "A robust testosterone support formula heavily focused on ZMA (Zinc, Magnesium, and Vitamin B6), designed to aid active men in muscle recovery and sleep quality.",
    "bullets": [
      "Features a core foundation of ZMA for proven recovery support.",
      "Designed to aid in deeper sleep, critical for natural hormone production.",
      "Supports muscle mass retention and strength gains during workouts."
    ],
    "rationale": "Prioritizes recovery and the vital connection between deep sleep and testosterone production, making it highly effective for physically active men.",
    "affiliateLink": "https://TestRX.com/ct/976241",
    "image": "/products/TestRX.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 19,
    "name": "Extenze",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A widely recognized, fast-acting male performance supplement featuring an extensive liquid gel-cap blend of herbal extracts aimed at supporting immediate stamina.",
    "bullets": [
      "One of the most trusted and recognized brands in male enhancement.",
      "Extended-release liquid gel caps for rapid and sustained absorption.",
      "Comprehensive herbal blend supporting energy, blood flow, and drive."
    ],
    "rationale": "Offers a convenient, recognizable, and fast-acting solution for men seeking broad-spectrum support for occasional performance needs.",
    "affiliateLink": "https://BuyExtenze.com/ct/976241",
    "image": "/products/BuyExtenze.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 20,
    "name": "ProSolution Pills",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A long-standing, premium daily supplement formulated with a focus on psychological drive, physical stamina, and overall male sexual wellness.",
    "bullets": [
      "Over a decade of market presence with a strong safety profile.",
      "Contains Solidilin and Korean Ginseng for mood and energy support.",
      "Designed to address both the physical and psychological aspects of performance."
    ],
    "rationale": "Provides a balanced, long-term approach to male vitality, addressing the mind-body connection crucial for sustained sexual health.",
    "affiliateLink": "https://ProsolutionPills.com/ct/976241",
    "image": "/products/ProsolutionPills.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 21,
    "name": "VigRX Oil",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A topical male enhancement serum utilizing a transdermal delivery system to deliver botanical extracts and L-Arginine directly to local tissues for rapid results.",
    "bullets": [
      "Transdermal delivery for immediate absorption into local tissues.",
      "Contains soothing Aloe Vera and circulation-supporting L-Arginine.",
      "Designed for use directly before intimacy for fast-acting support."
    ],
    "rationale": "An excellent option for men who prefer to avoid oral supplements, offering a safe, localized approach to supporting healthy blood flow.",
    "affiliateLink": "https://VigRXOil.com/ct/976241",
    "image": "/products/VigRXOil.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 22,
    "name": "VigRX Delay Spray",
    "category": "General Health",
    "subniche": "Stamina & Delay",
    "priority": 0,
    "description": "A mild, localized desensitizing spray designed to help men manage over-sensitivity, extending intimacy and improving overall stamina without complete numbness.",
    "bullets": [
      "Mild topical formula allows for extended stamina and control.",
      "Fast-absorbing spray prevents uncomfortable transfer to partners.",
      "Provides a practical, on-demand solution for performance anxiety."
    ],
    "rationale": "Addresses the direct physical cause of premature performance issues by safely dialing back local sensitivity, allowing for better control and confidence.",
    "affiliateLink": "https://VigRXDelaySpray.com/ct/976241",
    "image": "/products/VigRXDelaySpray.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 23,
    "name": "ProSolution Gel",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A topical arousal and control cream formulated with L-Arginine and natural menthol to provide a warming sensation that supports local blood flow and physical control.",
    "bullets": [
      "Unique warming sensation enhances physical arousal and focus.",
      "L-Arginine supports localized vasodilation for improved performance.",
      "Water-based formula is safe, clean, and highly compatible."
    ],
    "rationale": "Combines immediate physical sensation with long-term circulatory support, offering both instant gratification and structural benefits.",
    "affiliateLink": "https://ProsolutionGel.com/ct/976241",
    "image": "/products/ProsolutionGel.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 24,
    "name": "GenFX",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 0,
    "description": "A daily anti-aging supplement that uses a highly concentrated blend of amino acids and plant sterols to help stimulate the body's natural production of youth hormones.",
    "bullets": [
      "Rich in essential amino acids crucial for hormone synthesis.",
      "Supports healthy cholesterol levels with plant sterols.",
      "Aids in preserving muscle mass and skin elasticity during aging."
    ],
    "rationale": "Provides the precise nutritional building blocks the pituitary gland requires, safely encouraging a more youthful metabolic state.",
    "affiliateLink": "https://GenFX.com/ct/976241",
    "image": "/products/GenFX.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 25,
    "name": "Nexus Pheromones",
    "category": "General Health",
    "subniche": "Pheromones",
    "priority": 0,
    "description": "A proprietary blend of human pheromone compounds suspended in a high-quality cologne base, designed to subtly enhance male attractiveness and social presence.",
    "bullets": [
      "Contains a scientifically formulated blend of 7 distinct pheromone compounds.",
      "Can be worn alone or layered under your favorite personal fragrance.",
      "Designed to subtly communicate health, masculinity, and approachability."
    ],
    "rationale": "Utilizes the science of olfactory communication to naturally enhance a man's social and romantic interactions on a subconscious level.",
    "affiliateLink": "https://NexusPheromones.com/ct/976241",
    "image": "/products/NexusPheromones.jpg",
    "status": "active",
    "gender": "female"
  },
  {
    "id": 26,
    "name": "Provacyl",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "A comprehensive daily supplement targeting male andropause, combining amino acids for HGH support with potent herbal extracts to support healthy testosterone levels.",
    "bullets": [
      "Specifically formulated for men experiencing age-related hormone decline.",
      "Combines ZMA, amino acids, and herbal adaptogens in one formula.",
      "Supports energy, lean muscle retention, and overall vitality."
    ],
    "rationale": "Offers a complete, dual-action approach to aging men, simultaneously addressing the two most critical hormonal declines: HGH and testosterone.",
    "affiliateLink": "https://Provacyl.com/ct/976241",
    "image": "/products/Provacyl.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 27,
    "name": "MagnaRX",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A pioneering male enhancement supplement developed by a urologist, utilizing a proprietary blend of botanicals designed to support maximum natural blood flow.",
    "bullets": [
      "Formulated under the guidance of a professional urologist.",
      "Features a robust blend of circulation-supporting herbal extracts.",
      "A well-established brand known for consistent, reliable results."
    ],
    "rationale": "Brings medical insight to natural supplementation, focusing heavily on the cardiovascular elements necessary for optimal male performance.",
    "affiliateLink": "https://MagnaRX.com/ct/976241",
    "image": "/products/MagnaRX.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 29,
    "name": "SemEnhance",
    "category": "Men's Health",
    "subniche": "Semen Volume",
    "priority": 0,
    "description": "A specialized daily dietary supplement packed with vitamin C and fruit extracts, designed to naturally improve the taste and scent of seminal fluid.",
    "bullets": [
      "Formulated with natural fruit extracts like Pineapple, Kiwi, and Strawberry.",
      "High Vitamin C content naturally sweetens bodily fluids.",
      "Supports a healthy, balanced internal pH level."
    ],
    "rationale": "Addresses a highly specific lifestyle concern through simple, natural nutritional intervention, promoting better health and partner intimacy.",
    "affiliateLink": "https://SemEnhance.com/ct/976241",
    "image": "/products/SemEnhance.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 30,
    "name": "Fertility Factor 5",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A clinical-grade male fertility supplement combining Tongkat Ali and Panax Ginseng to support healthy sperm count, motility, and overall reproductive shape.",
    "bullets": [
      "Clinically researched formulation targeting male reproductive health.",
      "Features patented LJ100 (Tongkat Ali) for proven hormonal support.",
      "Aids in supporting sperm morphology, motility, and overall count."
    ],
    "rationale": "Provides couples with a scientifically grounded, non-prescription option to proactively support the male factors of reproductive success.",
    "affiliateLink": "https://FertilityFactor5.com/ct/976241",
    "image": "/products/FertilityFactor5.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 31,
    "name": "Brain Pill",
    "category": "Anti-aging",
    "subniche": "Brain Health",
    "priority": 10,
    "description": "A premium nootropic supplement designed to support cognitive function, featuring clinically backed ingredients like Cognizin and Synapsa to enhance focus and memory.",
    "bullets": [
      "Features patented Cognizin to support brain energy and focus.",
      "Includes Synapsa to aid in memory retention and learning.",
      "Helps clear brain fog and sustains mental stamina throughout the day."
    ],
    "rationale": "Delivers comprehensive cognitive support by targeting brain metabolism and neurotransmitter health, ideal for professionals and aging adults.",
    "affiliateLink": "https://BrainPill.com/ct/976241",
    "image": "/products/BrainPill.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 32,
    "name": "VigRX Nitric Oxide",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A specialized cardiovascular support supplement that utilizes L-Citrulline and L-Arginine to naturally boost nitric oxide production for improved blood flow.",
    "bullets": [
      "Maximizes nitric oxide production for robust cardiovascular support.",
      "Aids in physical endurance, recovery, and overall male performance.",
      "Features a synergistic blend of L-Citrulline and L-Arginine."
    ],
    "rationale": "Focuses strictly on the biological mechanism of vasodilation, providing essential cardiovascular support that benefits both general health and intimacy.",
    "affiliateLink": "https://VigRXNitricOxide.com/ct/976241",
    "image": "/products/VigRXNitricOxide.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 33,
    "name": "VigRX Incontinix",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A targeted daily supplement designed to support male bladder control and urinary tract health, helping to reduce the frequency and urgency of urination.",
    "bullets": [
      "Formulated to strengthen the pelvic floor and support bladder health.",
      "Helps reduce nighttime waking and frequent bathroom trips.",
      "A natural approach to managing overactive bladder symptoms in men."
    ],
    "rationale": "Addresses a common but rarely discussed aspect of aging, providing nutritional support for the smooth muscles of the urinary tract.",
    "affiliateLink": "https://VigrxIncontinix.com/ct/976241",
    "image": "/products/VigrxIncontinix.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 34,
    "name": "VigRX Max Volume",
    "category": "Men's Health",
    "subniche": "Semen Volume",
    "priority": 0,
    "description": "A focused daily supplement aimed at supporting the male reproductive system to safely enhance seminal fluid volume and overall climax intensity.",
    "bullets": [
      "Formulated with specific nutrients to support the prostate and seminal vesicles.",
      "Designed to safely increase natural fluid production.",
      "Aims to enhance the physical sensation and duration of climax."
    ],
    "rationale": "Offers a targeted nutritional approach to glandular health, resulting in tangible physical enhancements for male reproductive wellness.",
    "affiliateLink": "https://VigrxMaxVolume.co/ct/976241",
    "image": "/products/VigrxMaxVolume.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 35,
    "name": "PrimeGENIX Prostate Support",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A comprehensive prostate health formulation featuring Saw Palmetto, Beta-Sitosterol, and Pygeum to support normal urinary flow and reduce nighttime urgency.",
    "bullets": [
      "High concentration of Beta-Sitosterol to support healthy prostate function.",
      "Aids in completely emptying the bladder and reducing frequent urination.",
      "Provides essential long-term support for aging men's urinary health."
    ],
    "rationale": "Combines the most well-researched botanical extracts known to inhibit prostate enlargement, offering a safe, long-term preventative health measure.",
    "affiliateLink": "https://PrimeGENIXProstateSupport.com/ct/976241",
    "image": "/products/PrimeGENIXProstateSupport.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 36,
    "name": "HerSolution",
    "category": "Women's Health",
    "subniche": "Female Libido",
    "priority": 0,
    "description": "A daily female wellness supplement designed to gently correct hormonal imbalances and support healthy blood flow, helping to naturally restore female libido.",
    "bullets": [
      "Formulated to support natural moisture and physical sensitivity.",
      "Helps balance hormones and reduce stress-related fatigue.",
      "A daily approach to restoring natural female desire and vitality."
    ],
    "rationale": "Takes a holistic approach to female sexual health, understanding that desire is linked to both hormonal balance and daily stress management.",
    "affiliateLink": "https://HerSolution.com/ct/976241",
    "image": "/products/HerSolution.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 37,
    "name": "Provestra",
    "category": "Women's Health",
    "subniche": "Female Libido",
    "priority": 0,
    "description": "A potent female libido supplement combining aphrodisiacs, vitamins, and nutrients to address the nutritional deficits that often lead to low desire and energy.",
    "bullets": [
      "Comprehensive formula addresses the root nutritional causes of low libido.",
      "Supports natural lubrication, energy levels, and mood regulation.",
      "Helps mitigate the physical symptoms associated with menopause."
    ],
    "rationale": "Acts as a complete daily multivitamin targeted specifically at the female reproductive system, offering broad-spectrum support for sexual and overall health.",
    "affiliateLink": "https://Provestra.com/ct/976241",
    "image": "/products/Provestra.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 38,
    "name": "Vigorelle",
    "category": "Women's Health",
    "subniche": "Female Libido",
    "priority": 0,
    "description": "An all-natural, touch-activated female enhancement cream utilizing botanical extracts like L-Arginine and Peppermint to provide immediate, localized arousal.",
    "bullets": [
      "Touch-activated formula provides an immediate, warming sensation.",
      "Supports natural lubrication and localized physical sensitivity.",
      "Free from harsh chemicals, utilizing a clean, natural botanical base."
    ],
    "rationale": "Offers women a safe, immediate, and localized solution for physical arousal, bypassing the digestive system entirely.",
    "affiliateLink": "https://Vigorelle.com/ct/976241",
    "image": "/products/Vigorelle.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 39,
    "name": "HerSolution Gel",
    "category": "Women's Health",
    "subniche": "Female Libido",
    "priority": 0,
    "description": "A highly refined, water-based female enhancement gel designed to mimic natural moisture while providing a gentle, stimulating sensation upon application.",
    "bullets": [
      "Mimics the body's natural moisture for comfortable, safe enhancement.",
      "Provides a gentle, stimulating tingle to enhance localized blood flow.",
      "Sleek, mess-free application perfect for immediate intimacy."
    ],
    "rationale": "Provides an essential physical aid for intimacy, ensuring comfort while actively stimulating local tissues for enhanced sensation.",
    "affiliateLink": "https://HerSolutionGel.com/ct/976241",
    "image": "/products/HerSolution.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 40,
    "name": "Total Curve",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A dual-action breast enhancement system combining a daily herbal supplement with a firming gel featuring Volufiline to support natural breast volume and lift.",
    "bullets": [
      "Two-part system addresses breast health internally and externally.",
      "Features clinically tested Volufiline to support localized fat tissue volume.",
      "A natural, non-surgical alternative for improved firmness and lift."
    ],
    "rationale": "Leverages the proven science of Volufiline alongside phytoestrogens to safely encourage the body's natural mechanisms for breast tissue support.",
    "affiliateLink": "https://TotalCurve.com/ct/976241",
    "image": "/products/TotalCurve.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 42,
    "name": "Confitrol24",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A clinically proven bladder control supplement formulated with Urox, a patented blend of herbs designed to strengthen the bladder sphincter and pelvic floor.",
    "bullets": [
      "Features Urox, a clinically studied blend for urinary incontinence.",
      "Helps reduce sudden urgency and embarrassing bladder leakage.",
      "Supports the tone and strength of the pelvic floor muscles over time."
    ],
    "rationale": "Provides a vital, non-prescription solution for men and women dealing with incontinence, directly targeting the muscle tone of the urinary tract.",
    "affiliateLink": "https://Confitrol24.com/ct/976241",
    "image": "/products/Confitrol24.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 43,
    "name": "Kollagen Intensiv",
    "category": "Skin Care",
    "subniche": "Skin Care",
    "priority": 0,
    "description": "An advanced anti-aging cream formulated with SYN-COLL, a patented peptide clinically shown to stimulate the skin's natural production of collagen.",
    "bullets": [
      "Features SYN-COLL to naturally boost the skin's collagen production.",
      "Helps reduce the appearance of fine lines, wrinkles, and crow's feet.",
      "Provides deep, sustained hydration to improve overall skin elasticity."
    ],
    "rationale": "Moves beyond simple moisturization by actively encouraging the skin to repair its own structural matrix using advanced peptide science.",
    "affiliateLink": "https://KollagenIntensiv.com/ct/976241",
    "image": "/products/KollagenIntensiv.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 45,
    "name": "Dermefface FX7",
    "category": "Skin Care",
    "subniche": "Skin Care",
    "priority": 0,
    "description": "A specialized scar reduction therapy blending seven clinically proven active ingredients to gently fade the appearance of scars by accelerating cellular turnover.",
    "bullets": [
      "Accelerates the skin's natural 28-day regeneration cycle.",
      "Helps smooth and flatten both old and newly formed scars.",
      "Deeply moisturizes the skin to prevent flaking and discoloration."
    ],
    "rationale": "Takes a multifaceted approach to scar tissue, combining exfoliation, deep hydration, and cellular stimulation to safely fade visible skin damage.",
    "affiliateLink": "https://DermeffaceFX7.com/ct/976241",
    "image": "/products/DermeffaceFX7.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 46,
    "name": "Illuminatural 6i",
    "category": "Skin Care",
    "subniche": "Skin Care",
    "priority": 0,
    "description": "An advanced skin lightening formulation free of harsh chemicals like hydroquinone, utilizing safe botanical extracts to help fade dark spots and hyperpigmentation.",
    "bullets": [
      "Safely fades age spots, sun damage, and general hyperpigmentation.",
      "100% free of dangerous bleaching agents like hydroquinone or mercury.",
      "Uses plant-based brighteners and exfoliants for an even complexion."
    ],
    "rationale": "Provides a safe, effective alternative to aggressive chemical peels and bleaches, working with the skin's natural cycle to reveal brighter tissue.",
    "affiliateLink": "https://Illuminatural6i.com/ct/976241",
    "image": "/products/Illuminatural6i.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 54,
    "name": "Erectin Male Enhancement Gummies",
    "category": "Men's Health",
    "subniche": "Erectile Support",
    "priority": 0,
    "description": "A convenient, fast-acting pectin-based gummy supplement formulated with a clinically studied blend of herbs to support male performance and blood flow on the go.",
    "bullets": [
      "Delicious, convenient gummy format for easy daily compliance.",
      "Supports rapid blood flow and performance without the need for pills.",
      "Formulated with scientifically backed botanical extracts."
    ],
    "rationale": "Combines the proven efficacy of the Erectin formula with the modern convenience of a gummy, ensuring better daily adherence and absorption.",
    "affiliateLink": "https://ErectinGummies.com/ct/976241",
    "image": "/products/Erectin.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 70,
    "name": "VigRX Delay Wipes",
    "category": "General Health",
    "subniche": "Stamina & Delay",
    "priority": 0,
    "description": "Discreet, travel-friendly performance wipes infused with a mild desensitizing agent to help men manage over-sensitivity and confidently extend intimacy.",
    "bullets": [
      "Individually wrapped for discreet, on-the-go convenience.",
      "Provides mild desensitization to help delay climax safely.",
      "Fast-drying formula ensures no transfer of the active ingredient."
    ],
    "rationale": "Offers the ultimate in practical, on-demand performance control, addressing premature ejaculation with a localized, non-messy application.",
    "affiliateLink": "https://VigRXDelayWipes.com/ct/976241",
    "image": "/products/VigRXDelayWipes.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 87,
    "name": "Icelandic Red Algae Calcium by GenF20",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 0,
    "description": "A premium, plant-based calcium supplement sourced from pure Icelandic Red Algae, formulated for superior absorption to support bone density and joint health.",
    "bullets": [
      "Plant-based calcium offers vastly superior absorption compared to rocks.",
      "Contains over 70 naturally occurring trace minerals for skeletal support.",
      "Includes Vitamin D3 and K2 to ensure calcium is directed to the bones."
    ],
    "rationale": "Addresses the critical flaw in traditional calcium supplements by providing a highly bioavailable, plant-based matrix that the body can easily utilize.",
    "affiliateLink": "https://GenF20Calcium.com/ct/976241",
    "image": "/products/GenF20.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 89,
    "name": "PrimeGENIX Bone Complex",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A specialized bone health formulation designed specifically for men, blending easily absorbed vitamins and minerals to support structural integrity and density.",
    "bullets": [
      "Tailored specifically for the unique skeletal needs of aging men.",
      "Features highly bioavailable forms of Calcium, Magnesium, and Vitamin K2.",
      "Supports long-term bone density, posture, and physical resilience."
    ],
    "rationale": "Recognizes that bone loss is not exclusively a female issue, providing men with a targeted, highly absorbable formula for maintaining structural health.",
    "affiliateLink": "https://PrimeGENIXBoneComplex.com/ct/976241",
    "image": "/products/PrimeGENIXBoneComplex.jpg",
    "status": "active",
    "gender": "male"
  }
];

export const getFilteredProducts = (answers, customProducts = products) => {
  const activeProducts = customProducts.filter(p => {
    const isStatusActive = p.status !== 'inactive';
    const matchesGender = !p.gender || p.gender === 'both' || 
                         (answers.gender === 'Male' && p.gender === 'male') || 
                         (answers.gender === 'Female' && p.gender === 'female');
    return isStatusActive && matchesGender;
  });
  const focuses = answers.specificFocus ? (Array.isArray(answers.specificFocus) ? answers.specificFocus : [answers.specificFocus].filter(Boolean)) : ['General Health'];
  
  const bestFits = [];
  const seenIds = new Set();

  focuses.forEach(focus => {
    // Score all active products specifically for THIS focus
    const focusScores = activeProducts.map(product => {
      let score = 0;
      
      // Category match
      const goals = Array.isArray(answers.primaryGoal) ? answers.primaryGoal : [answers.primaryGoal].filter(Boolean);
      goals.forEach(goal => {
        if (product.category.includes(goal)) score += 2;
      });

      // Exact Subniche Match for THIS focus
      if (
        ((focus === 'Erection Quality' || focus === 'Stamina') && (product.subniche === 'Erectile Support' || product.subniche === 'Stamina & Delay')) ||
        ((focus === 'Low Libido') && (product.subniche === 'Female Libido' || product.subniche === 'Erectile Support')) ||
        ((focus === 'Semen Volume') && product.subniche === 'Semen Volume') ||
        ((focus === 'Low Testosterone' || focus === 'More Energy') && product.subniche === 'Testosterone Boost') ||
        ((focus === 'Stubborn Fat') && product.subniche === 'Fat Loss') ||
        ((focus === 'Slow Recovery' || focus === 'Low Energy' || focus === 'Anti-aging' || focus === 'General Health') && product.subniche === 'HGH Boost') ||
        ((focus === 'Fine Lines & Wrinkles' || focus === 'Acne Scars' || focus === 'Anti-aging') && product.category === 'Skin Care') ||
        ((focus === 'Brain Fog' || focus === 'Memory Decline') && product.subniche === 'Brain Health')
      ) {
        score += 10; // High weight for focus-specific match
      }

      // Keyword matching for THIS focus
      const keywordMap = {
          'Erection Quality': ['erect', 'hard', 'blood flow'],
          'Stamina': ['stamina', 'delay', 'last longer'],
          'Low Libido': ['libido', 'desire', 'sex drive'],
          'Semen Volume': ['volume', 'semen', 'sperm', 'load'],
          'Low Testosterone': ['testosterone', 't-levels', 'muscle mass'],
          'More Energy': ['energy', 'fatigue', 'vitality'],
          'Stubborn Fat': ['fat', 'weight loss', 'metabolism'],
          'Slow Recovery': ['recovery', 'muscle repair'],
          'Fine Lines & Wrinkles': ['wrinkle', 'collagen', 'aging skin', 'lines'],
          'Acne Scars': ['scar', 'acne', 'blemish'],
          'Brain Fog': ['focus', 'memory', 'cognitive', 'brain fog'],
          'Memory Decline': ['memory', 'recall']
      };

      if (keywordMap[focus]) {
          const contentStr = (product.description + " " + product.bullets.join(" ")).toLowerCase();
          for (let keyword of keywordMap[focus]) {
              if (contentStr.includes(keyword)) score += 3;
          }
      }

      // Add general lifestyle/priority points
      if (score > 0) score += (product.priority || 0);

      return { ...product, score };
    });

    // Find the best fit for this focus that we haven't picked yet
    const topForFocus = focusScores
      .filter(p => !seenIds.has(p.id) && p.score >= 5)
      .sort((a, b) => b.score - a.score)[0];

    if (topForFocus) {
      seenIds.add(topForFocus.id);
      bestFits.push(topForFocus);
    }
  });

  return bestFits;
};

export const calculateHealthScore = (answers) => {
  if (!answers) return { score: 0, status: 'N/A', color: '#94a3b8' };
  
  let totalPoints = 0;
  let maxPoints = 0;

  const addScore = (val, thresholds) => {
    if (!val) return;
    maxPoints += 15;
    totalPoints += thresholds[val] || 0;
  };

  addScore(answers.activityLevel, { 'Very Active': 15, 'Moderately Active': 10, 'Lightly Active': 5, 'Sedentary': 0 });
  addScore(answers.stamina, { 'Great, I can keep going without issues': 15, 'Average, but I tire easily with intense tasks': 8, 'Poor, I get exhausted very quickly': 0 });
  addScore(answers.sleepQuality, { 'Deep & Restful': 15, 'Occasionally Restless': 10, 'Often Waking Up': 5, 'Poor': 0 });
  addScore(answers.tiredness, { 'Rarely, I have consistent energy': 15, 'Sometimes, usually in the afternoon': 8, 'Often, I feel drained': 4, 'Constantly, I struggle to stay awake': 0 });
  addScore(answers.stressLevel, { 'Low': 15, 'Moderate': 10, 'High': 4, 'Severe': 0 });
  addScore(answers.motivationFocus, { 'Rarely, I am highly motivated': 15, 'Sometimes, depending on the task': 10, 'Frequently, I find it hard to concentrate': 4, 'Constantly, I struggle with severe brain fog': 0 });
  addScore(answers.performanceDecline, { 'No, I feel as strong as ever': 15, 'A little bit, noticeable but manageable': 10, 'Yes, a significant decline': 4, 'Yes, a severe decline affecting my confidence': 0 });

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  let status = 'Sub-optimal';
  let color = '#f59e0b'; // Amber

  if (score >= 85) {
    status = 'Excellent';
    color = '#10b981'; // Green
  } else if (score >= 65) {
    status = 'Optimal';
    color = '#3b82f6'; // Blue
  } else if (score < 40) {
    status = 'Critical Support Required';
    color = '#ef4444'; // Red
  }

  return { score, status, color };
};

export const getAdditionalRecommendations = (answers, excludeNames, customProducts = products) => {
  const activeProducts = customProducts.filter(p => {
    const isStatusActive = p.status !== 'inactive';
    const matchesGender = !p.gender || p.gender === 'both' || 
                         (answers.gender === 'Male' && p.gender === 'male') || 
                         (answers.gender === 'Female' && p.gender === 'female');
    return isStatusActive && matchesGender && !excludeNames.includes(p.name);
  });
  
  const goals = Array.isArray(answers.primaryGoal) ? answers.primaryGoal : [answers.primaryGoal].filter(Boolean);
  const focuses = answers.specificFocus ? (Array.isArray(answers.specificFocus) ? answers.specificFocus : [answers.specificFocus].filter(Boolean)) : [];
  
  const scored = activeProducts.map(product => {
    let score = 0;
    goals.forEach(goal => {
      if (product.category.includes(goal)) score += 3;
    });
    focuses.forEach(focus => {
      if (
        ((focus === 'Erection Quality' || focus === 'Stamina') && (product.subniche === 'Erectile Support' || product.subniche === 'Stamina & Delay')) ||
        ((focus === 'Low Libido') && (product.subniche === 'Female Libido' || product.subniche === 'Erectile Support')) ||
        ((focus === 'Semen Volume') && product.subniche === 'Semen Volume') ||
        ((focus === 'Low Testosterone' || focus === 'More Energy') && product.subniche === 'Testosterone Boost') ||
        ((focus === 'Stubborn Fat') && product.subniche === 'Fat Loss') ||
        ((focus === 'Slow Recovery' || focus === 'Low Energy' || focus === 'Anti-aging' || focus === 'General Health') && product.subniche === 'HGH Boost') ||
        ((focus === 'Fine Lines & Wrinkles' || focus === 'Acne Scars' || focus === 'Anti-aging') && product.category === 'Skin Care') ||
        ((focus === 'Brain Fog' || focus === 'Memory Decline') && product.subniche === 'Brain Health')
      ) {
        score += 5;
      }
    });
    score += (product.priority || 0);
    return { ...product, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 2);
};
```

## File: `update_admin.py`

```py
import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add savedCampaigns state
content = re.sub(
    r'const \[campaigns, setCampaigns\] = useState\(\[\]\);',
    r'const [campaigns, setCampaigns] = useState([]);\n  const [savedCampaigns, setSavedCampaigns] = useState([]);',
    content
)

# 2. Modify state: remove dispatchInterval, update dailyLimit
content = re.sub(
    r"const \[dispatchInterval, setDispatchInterval\] = useState\(3\); // default 3 seconds\n\s*const \[dailyLimit, setDailyLimit\] = useState\(100\); // default 100 emails/day, max 100",
    r"const [dailyLimit, setDailyLimit] = useState(500); // default 500 emails/day quota limit",
    content
)

# 3. Update confirm message in handleLaunchCampaign
content = re.sub(
    r'`Proceed to dispatch "\$\{campaignName\}" campaign to \$\{targetedSubscribers.length\} subscribers with a \$\{dispatchInterval\}-second delay between emails\?`',
    r'`Proceed to dispatch "${campaignName}" campaign to ${targetedSubscribers.length} subscribers with a random 5-20 second delay between emails?`',
    content
)

# 4. Update log in handleLaunchCampaign
content = re.sub(
    r'`\[INFO\] Set Interval delay: \$\{dispatchInterval\} seconds`,',
    r'`[INFO] Set Interval delay: 5-20 seconds (randomized)`,',
    content
)

# 5. Fetch saved campaigns
fetch_replace = """    // 4. Fetch custom copy presets
    const unsubPresets = onSnapshot(
      query(collection(db, 'marketing_presets'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const firestoreList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt) || new Date()
        }));
        setCustomPresets(firestoreList);
      },
      (error) => {
        console.error("Error fetching custom presets from Firestore:", error);
      }
    );

    // 5. Fetch paused/saved campaigns
    const unsubSavedCampaigns = onSnapshot(
      query(collection(db, 'saved_campaigns'), orderBy('savedAt', 'desc')),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          savedAt: doc.data().savedAt?.toDate?.() || new Date(doc.data().savedAt) || new Date()
        }));
        setSavedCampaigns(list);
      },
      (error) => {
        console.error("Error fetching saved campaigns:", error);
      }
    );

    return () => {
      unsubSubscribers();
      unsubCampaigns();
      unsubClicks();
      unsubPresets();
      unsubSavedCampaigns();
    };"""

content = re.sub(
    r"// 4\. Fetch custom copy presets.*?return \(\) => \{.*?unsubPresets\(\);\s*\};\s*",
    fetch_replace + "\n",
    content,
    flags=re.DOTALL
)

# 6. Random delay in dispatch
content = re.sub(
    r'timerRef\.current = setTimeout\(runDispatchStep, dispatchInterval \* 1000\);',
    r'const delay = Math.floor(Math.random() * (20 - 5 + 1) + 5) * 1000;\n    timerRef.current = setTimeout(runDispatchStep, delay);',
    content
)

# 7. Add savedCampaigns deletion on completion
completion_replace = """      // Save campaign stats to Firestore
      addDoc(collection(db, 'marketing_campaigns'), {
        name: campaignName,
        subject: subject,
        body: emailBody,
        template: designStyle,
        themeColor: themeColor,
        filters: {
          leadType: filterLeadType,
          sex: filterSex,
          goal: filterGoal
        },
        sentCount: queueSuccessCount,
        sentAt: serverTimestamp()
      }).catch(e => console.error("Error saving campaign run log:", e));"""

content = content.replace(completion_replace, completion_replace) # Placeholder to verify it exists

# 8. Update handleCancelQueue to save progress
handle_cancel_regex = r"const handleCancelQueue = \(\) => \{.*?\}\)\.catch\(e => console\.error\(\"Error saving campaign run log:\", e\)\);\s*\};"
handle_stop_save = """  const handleStopAndSaveQueue = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQueueStatus('cancelled');
    setQueueLog(prev => [...prev, `[STOPPED] Queue suspended. Saving progress to database...`]);
    
    try {
      await addDoc(collection(db, 'saved_campaigns'), {
        name: campaignName,
        subject: subject,
        body: emailBody,
        template: designStyle,
        themeColor: themeColor,
        filters: {
          leadType: filterLeadType,
          sex: filterSex,
          goal: filterGoal
        },
        queueRecipients: queueRecipients,
        queueIndex: queueIndex,
        queueSuccessCount: queueSuccessCount,
        queueErrorCount: queueErrorCount,
        queueLog: queueLog,
        senderName: senderName,
        savedAt: serverTimestamp()
      });
      alert('Campaign stopped and progress saved successfully. You can resume it later from the Campaigns Archive.');
      setQueueModalOpen(false);
    } catch (e) {
      console.error("Error saving campaign progress:", e);
      alert("Failed to save progress: " + e.message);
    }
  };"""

content = re.sub(handle_cancel_regex, handle_stop_save, content, flags=re.DOTALL)

# Update onClick={handleCancelQueue} to onClick={handleStopAndSaveQueue}
content = content.replace("onClick={handleCancelQueue}", "onClick={handleStopAndSaveQueue}")
content = content.replace("Terminate Campaign", "Stop & Save Campaign")
content = content.replace("<Square size={12} fill=\"#ef4444\" /> Stop & Save Campaign", "<Square size={12} fill=\"#ef4444\" /> Stop & Save Campaign")

# 9. Update UI for Interval Delay and Quota limits
interval_ui_regex = r"<span>Interval Delay</span>.*?<input\s+type=\"range\".*?margin: '14px 0' \}\}\s*/>\s*</div>"
interval_ui_replacement = """<span>Interval Delay</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>Approx. 5-20s</span>
                </label>
                <div style={{ padding: '14px 0', fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                  Delay is automatically randomized between 5 and 20 seconds to improve deliverability.
                </div>
              </div>"""

content = re.sub(interval_ui_regex, interval_ui_replacement, content, flags=re.DOTALL)

quota_ui_regex = r"<input\s+type=\"number\"\s+min=\"1\"\s+max=\"100\"\s+value=\{dailyLimit\}\s+onChange=\{\(e\) => \{\s*const val = Math\.min\(100, Math\.max\(1, parseInt\(e\.target\.value\) \|\| 1\)\);\s*setDailyLimit\(val\);\s*\}\}.*?/>"
quota_ui_replacement = """<input 
                  type="number" 
                  min="1" 
                  value={dailyLimit}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setDailyLimit(val);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />"""

content = re.sub(quota_ui_regex, quota_ui_replacement, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied to EmailMarketingAdmin.jsx!")
```

## File: `update_admin_ui.py`

```py
import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add handleResumeSavedCampaign
resume_func = """  const handleResumeSavedCampaign = async (savedCamp) => {
    if (!window.confirm(`Are you sure you want to resume the paused campaign "${savedCamp.name}"? This will immediately continue dispatching to the remaining queue.`)) return;

    // Load states
    setCampaignName(savedCamp.name);
    setSubject(savedCamp.subject || '');
    setEmailBody(savedCamp.body || '');
    setDesignStyle(savedCamp.template || 'professional');
    setThemeColor(savedCamp.themeColor || '#0084ff');
    setFilterLeadType(savedCamp.filters?.leadType || 'all');
    setFilterSex(savedCamp.filters?.sex || 'all');
    setFilterGoal(savedCamp.filters?.goal || 'all');
    setSenderName(savedCamp.senderName || 'EternoFit Wellness');

    // Load queue state
    setQueueRecipients(savedCamp.queueRecipients || []);
    setQueueIndex(savedCamp.queueIndex || 0);
    setQueueSuccessCount(savedCamp.queueSuccessCount || 0);
    setQueueErrorCount(savedCamp.queueErrorCount || 0);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setQueueLog([
      ...(savedCamp.queueLog || []),
      `[${timeStr}] [INFO] Resuming paused campaign from database...`
    ]);

    setQueueModalOpen(true);
    setQueueStatus('dispatching');

    // Optionally delete from saved_campaigns since we are resuming
    try {
      await deleteDoc(doc(db, 'saved_campaigns', savedCamp.id));
    } catch (e) {
      console.error("Failed to delete resumed campaign from DB", e);
    }
  };

  const handleDeleteSavedCampaign = async (id) => {
    if (window.confirm("Permanently delete this paused campaign? You will lose its progress and won't be able to resume it.")) {
      try {
        await deleteDoc(doc(db, 'saved_campaigns', id));
      } catch (e) {
        alert("Failed to delete: " + e.message);
      }
    }
  };"""

# Insert the functions before `const handleBlacklistLeads = async () => {`
content = content.replace("  // paste blacklist logic helper", resume_func + "\n\n  // paste blacklist logic helper")

# Add the UI for Saved Campaigns above the History Table
history_ui_regex = r"\{/\* 3\. CAMPAIGNS HISTORICAL ARCHIVE \*/\}\s*\{activeSubTab === 'history' && \(\s*<div className=\"admin-table-container\">"
saved_campaigns_ui = """{/* 3. CAMPAIGNS HISTORICAL ARCHIVE */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {savedCampaigns.length > 0 && (
            <div className="admin-table-container" style={{ border: '1px solid #f59e0b' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderBottom: '1px solid #f59e0b' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#f59e0b' }}>
                  <Pause size={18} /> Paused / Saved Campaigns
                </h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Saved Date</th>
                    <th>Campaign Name</th>
                    <th style={{ textAlign: 'center' }}>Progress</th>
                    <th style={{ textAlign: 'center' }}>Success/Error</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedCampaigns.map((camp) => (
                    <tr key={camp.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{camp.savedAt.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td><strong>{camp.name}</strong><br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>{camp.subject}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${((camp.queueIndex || 0) / (camp.queueRecipients?.length || 1)) * 100}%`, height: '100%', background: '#f59e0b' }}></div>
                          </div>
                          <span style={{ fontSize: '0.8rem' }}>{camp.queueIndex || 0} / {camp.queueRecipients?.length || 0}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: '#10b981' }}>{camp.queueSuccessCount || 0} sent</span> / <span style={{ color: '#ef4444' }}>{camp.queueErrorCount || 0} failed</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleResumeSavedCampaign(camp)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Play size={12} /> Resume</button>
                          <button onClick={() => handleDeleteSavedCampaign(camp.id)} style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={12} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-table-container">"""

content = re.sub(history_ui_regex, saved_campaigns_ui, content, flags=re.DOTALL)

# Add matching closing div for the new wrapper div we added `<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>`
# The original code has:
#           </div>
#         </div>
#       )}
#       {/* 4. TRACEABLE CLICKS FEED */}

close_div_regex = r"</div>\s*\)\}\s*\{/\* 4\. TRACEABLE CLICKS FEED \*/\}"
close_div_replacement = "</div>\n        </div>\n      )}\n\n      {/* 4. TRACEABLE CLICKS FEED */}"
content = re.sub(close_div_regex, close_div_replacement, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added UI and logic for paused campaigns!")
```

## File: `update_buttons.cjs`

```cjs
const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

c = c.replace(/className="site-btn-primary"\s+style=\{\{([^}]+)\}\}/g, (match, styleContent) => {
  if (!styleContent.includes('textAlign:')) {
    return `className="site-btn-primary"\n                    style={{${styleContent}, textAlign: 'center', justifyContent: 'center'}}`;
  }
  return match;
});

// Also let's style the question template slightly better since they wanted it redesigned
// Currently the buttons for questions are:
// background: tAnswers[q.key] === opt.val ? 'rgba(0,230,118,0.06)' : 'transparent',
// We can make them look more like a list item with a nice hover
c = c.replace(/border:\s*tAnswers\[q\.key\] === opt\.val \? '1px solid var\(--accent-green\)' : '1px solid var\(--border-site\)'/g, 
"border: tAnswers[q.key] === opt.val ? '2px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.08)'");

c = c.replace(/background:\s*tAnswers\[q\.key\] === opt\.val \? 'rgba\(0,230,118,0\.06\)' : 'transparent'/g, 
"background: tAnswers[q.key] === opt.val ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.02)'");

// Do the same for stress checker:
c = c.replace(/border:\s*stressAnswers\[q\.key\] === opt\.val \? '1px solid var\(--accent-green\)' : '1px solid var\(--border-site\)'/g, 
"border: stressAnswers[q.key] === opt.val ? '2px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.08)'");

c = c.replace(/background:\s*stressAnswers\[q\.key\] === opt\.val \? 'rgba\(0,230,118,0\.06\)' : 'transparent'/g, 
"background: stressAnswers[q.key] === opt.val ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.02)'");

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Buttons updated');
```

## File: `update_images.cjs`

```cjs
const fs = require('fs');

let content = fs.readFileSync('src/data/articles.js', 'utf8');

// The articles to update are:
// "Brain Fog Won't Lift? Here's What's Really Going On" -> /images/articles/brain_fog_real.png
// "High Blood Pressure Basics: What Those Numbers Actually Mean" -> /images/articles/blood_pressure_real.png
// "Always Feeling Cold? Why Your Body Might Be Struggling to Stay Warm" -> /images/articles/always_cold_real.png
// "Why Do You Feel So Tired After Eating? (And How to Fix It)" -> /images/articles/tired_eating_real.png
// "Forgetfulness vs. Dementia: When Should You Be Concerned?" -> /images/articles/forgetfulness_real.png
// "Waking Up with Dry Mouth? Why It Happens and How to Stop It" -> /images/articles/dry_mouth_real.png
// "Unexpected Weight Gain Over 50? It’s Not Just \"Getting Older\"" -> /images/articles/weight_gain_real.png
// "Stiff, Achy Joints in Your 30s and 40s: Here's What's Going On" -> /images/articles/stiff_joints_real.png

const replacements = [
  {
    title: "Brain Fog Won't Lift? Here's What's Really Going On",
    oldImg: "/images/articles/brain_fog.png",
    newImg: "/images/articles/brain_fog_real.png"
  },
  {
    title: "High Blood Pressure Basics: What Those Numbers Actually Mean",
    oldImg: "/images/articles/blood_pressure.png", // Wait, maybe it's not blood_pressure.png? Let's use regex near title
    newImg: "/images/articles/blood_pressure_real.png"
  },
  {
    title: "Always Feeling Cold? Why Your Body Might Be Struggling to Stay Warm",
    newImg: "/images/articles/always_cold_real.png"
  },
  {
    title: "Why Do You Feel So Tired After Eating?",
    newImg: "/images/articles/tired_eating_real.png"
  },
  {
    title: "Forgetfulness vs. Dementia",
    newImg: "/images/articles/forgetfulness_real.png"
  },
  {
    title: "Waking Up with Dry Mouth",
    newImg: "/images/articles/dry_mouth_real.png"
  },
  {
    title: "Unexpected Weight Gain Over 50",
    newImg: "/images/articles/weight_gain_real.png"
  },
  {
    title: "Stiff, Achy Joints in Your 30s",
    newImg: "/images/articles/stiff_joints_real.png"
  }
];

// Instead of exact string replacement, let's find the object block with the title, and replace its image.
replacements.forEach(rep => {
  // Find the title index
  const titleIdx = content.indexOf(rep.title);
  if (titleIdx !== -1) {
    // find 'image:' after title, or before title?
    // It's an object in an array. Let's find the start of the object and end.
    // Or just use regex to replace the image within a window
    
    // find previous '{'
    const objStart = content.lastIndexOf('{', titleIdx);
    // find next '}'
    const objEnd = content.indexOf('}', titleIdx);
    
    if (objStart !== -1 && objEnd !== -1) {
      const objBlock = content.slice(objStart, objEnd);
      const newBlock = objBlock.replace(/image:\s*['"][^'"]+['"]/, `image: '${rep.newImg}'`);
      content = content.slice(0, objStart) + newBlock + content.slice(objEnd);
      console.log('Updated image for:', rep.title);
    }
  } else {
    console.log('Could not find title:', rep.title);
  }
});

fs.writeFileSync('src/data/articles.js', content);
console.log('Done replacing images in articles.js');
```

## File: `update_images_2.cjs`

```cjs
const fs = require('fs');

let content = fs.readFileSync('src/data/articles.js', 'utf8');

const replacements = [
  {
    title: "Anxiety That Won", // Just match partial
    newImg: "/images/articles/anxiety_real.png"
  },
  {
    title: "Lower Back Pain From Sitting All Day",
    newImg: "/images/articles/back_pain_real.png"
  },
  {
    title: "Heartburn Keeps Coming Back",
    newImg: "/images/articles/heartburn_real.png"
  },
  {
    title: "Tired All the Time?",
    newImg: "/images/articles/fatigue_real.png"
  },
  {
    title: "Headaches Every Day?",
    newImg: "/images/articles/headache_real.png"
  },
  {
    title: "Hair Falling Out?",
    newImg: "/images/articles/hair_loss_real.png"
  }
];

replacements.forEach(rep => {
  const titleIdx = content.indexOf(rep.title);
  if (titleIdx !== -1) {
    const objStart = content.lastIndexOf('{', titleIdx);
    const objEnd = content.indexOf('}', titleIdx);
    
    if (objStart !== -1 && objEnd !== -1) {
      const objBlock = content.slice(objStart, objEnd);
      const newBlock = objBlock.replace(/image:\s*['"][^'"]+['"]/, `image: '${rep.newImg}'`);
      content = content.slice(0, objStart) + newBlock + content.slice(objEnd);
      console.log('Updated image for:', rep.title);
    }
  } else {
    console.log('Could not find title:', rep.title);
  }
});

fs.writeFileSync('src/data/articles.js', content);
console.log('Done replacing images in articles.js');
```

## File: `update_interval.py`

```py
import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("random 5-20 second delay", "random 10-20 second delay")
content = content.replace("Interval delay: 5-20 seconds", "Interval delay: 10-20 seconds")
content = content.replace("Approx. 5-20s", "Approx. 10-20s")
content = content.replace("between 5 and 20 seconds", "between 10 and 20 seconds")
content = content.replace("Math.floor(Math.random() * (20 - 5 + 1) + 5)", "Math.floor(Math.random() * (20 - 10 + 1) + 10)")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated 5-20s to 10-20s")
```

## File: `update_select.cjs`

```cjs
const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

c = c.replace(/backgroundImage:\s*'url\([^)]+\)'/g, 
  "backgroundImage: 'url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%2300ff66\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'%3e%3c/polyline%3e%3c/svg%3e\")', paddingRight: '44px'");

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Selects updated');
```

## File: `upgrade_forms.cjs`

```cjs
const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

// Upgrade labels: add icon-like left border and better padding
c = c.replace(
  /style=\{\{ display: 'block', marginBottom: '8px', fontSize: '0\.9rem', color: 'var\(--text-muted-site\)' \}\}/g,
  `style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: '0.3px' }}`
);

// Upgrade select dropdowns: better glassmorphism styling
c = c.replace(
  /style=\{\{ width: '100%', padding: '12px', background: 'var\(--bg-dark-site\)', border: '1px solid var\(--border-site\)', color: '#ffffff', borderRadius: '8px' \}\}/g,
  `style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath d=%27M6 8L1 3h10L6 8z%27 fill=%27%2300e676%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}`
);

// Upgrade range slider wrapper labels to show the value more prominently
// Already handled by label upgrade above

// Upgrade the tool main panel to have a slightly better feel
c = c.replace(
  `background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '16px', padding: '2.5rem'`,
  `background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)'`
);

// Upgrade header section with a progress bar at the top of the quiz tools
// Add a subtle progress indicator for quiz-type tools

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Upgraded all form elements successfully!');
```

## File: `upgrade_selects.cjs`

```cjs
const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

// Replace the bare <div> wrappers for dropdown fields with styled card containers
// Target pattern: <div>\n  <label style={{...}}>...\n  <select ...>
// We need to wrap them in a nicer card

// Upgrade the select focus state via adding onFocus/onBlur
c = c.replace(
  /(<select\s)/g,
  '$1onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} '
);

// Make range inputs more premium with a wrapper style
// Replace the simple accentColor style range inputs
c = c.replace(
  /style=\{\{ width: '100%', accentColor: 'var\(--accent-green\)' \}\}/g,
  `style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }}`
);

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Enhanced select and slider elements!');
```

## File: `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://eternofit.com',
        changeOrigin: true,
      }
    }
  }
})
```

## File: `functions\api\send-email.js`

```js
export async function onRequestPost(context) {
  const { request, env } = context;
  
  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Resend API Key not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { to, subject, htmlName, reportUrl, products = [], complementary = [], answers = {}, healthScore = { score: 0, status: 'N/A', color: '#94a3b8' } } = body;

    let baseUrl;
    try {
      baseUrl = new URL(reportUrl).origin + '/';
      if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        baseUrl = 'https://eternofit.com/';
      }
    } catch (e) {
      baseUrl = 'https://eternofit.com/';
    }
    const reportId = answers.id || 'CONFIDENTIAL';
    const analysisDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const primaryGoalText = answers.primaryGoal ? (Array.isArray(answers.primaryGoal) ? answers.primaryGoal.join(' & ') : answers.primaryGoal) : 'N/A';
    const specificFocusText = Array.isArray(answers.specificFocus) ? answers.specificFocus.join(', ') : (answers.specificFocus || 'N/A');

    const emailHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Your EternoFit Clinical Report</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    /* Reset */
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f1f5f9; width: 100% !important; }

    /* Links */
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; }
    u + #body a { color: inherit; text-decoration: none; font-size: inherit; }

    /* Mobile Responsive */
    @media only screen and (max-width: 620px) {
      .email-wrapper { padding: 0 !important; }
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .header-pad { padding: 28px 20px !important; }
      .content-pad { padding: 24px 20px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .hide-mobile { display: none !important; }

      /* Product cards stack */
      .product-img-col { display: block !important; width: 100% !important; text-align: center !important; padding: 0 0 16px 0 !important; }
      .product-img-col img { width: 120px !important; height: 120px !important; }
      .product-text-col { display: block !important; width: 100% !important; padding: 0 !important; }

      /* Meta row stacks */
      .meta-col { display: block !important; width: 100% !important; padding-bottom: 12px !important; text-align: left !important; }

      /* Vitality score stacks */
      .vitality-score-col { display: block !important; width: 100% !important; padding-bottom: 16px !important; }
      .vitality-badge-col { display: block !important; width: 100% !important; text-align: left !important; }

      /* Complementary items stack */
      .comp-item { display: block !important; width: 100% !important; padding: 0 0 32px 0 !important; text-align: center !important; }

      /* Full-width buttons */
      .btn-cta { width: 100% !important; text-align: center !important; }
      .btn-cta a { display: block !important; }

      h1 { font-size: 22px !important; }
      h2 { font-size: 36px !important; }
      .score-num { font-size: 42px !important; }
    }
  </style>
</head>
<body id="body" style="margin:0;padding:0;background-color:#f1f5f9;font-family:Helvetica,Arial,sans-serif;">

<!-- Preheader Text (hidden) -->
<div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  Your personalized health summary from EternoFit is ready. Here are the products selected for you.
</div>

<!-- Email Wrapper -->
<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#f1f5f9;padding:40px 16px;">
  <tr>
    <td align="center">

      <!-- Email Container -->
      <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 8px 30px rgba(0,0,0,0.08);">

        <!-- ===== HEADER ===== -->
        <tr>
            <td class="header-pad" style="background:#ffffff;padding:40px;text-align:center;border-bottom:4px solid #0084ff;">
            <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" width="72" height="72" style="width:72px;height:72px;border-radius:50%;display:block;margin:0 auto 16px;background:#000000;object-fit:contain;border:3px solid #00ff66;">
            <img src="${baseUrl}logo.png" alt="EternoFit" width="140" style="height:auto;display:block;margin:0 auto 20px;">
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#1e293b;line-height:1.2;">Your Personal Health Summary</h1>
            <p style="margin:8px 0 4px;font-size:15px;color:#64748b;">Prepared exclusively for <strong>${htmlName}</strong></p>
            <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;">Reference: #${reportId.toUpperCase()}</p>
          </td>
        </tr>

        <!-- ===== VITALITY INDEX ===== -->
        <tr>
          <td class="content-pad" style="padding:32px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f8fafc;border-radius:20px;border:1px solid #e2e8f0;padding:28px;margin-bottom:0;">
              <tr>
                <td style="padding:28px;">
                  <!-- Score Row -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:20px;">
                    <tr>
                      <td class="vitality-score-col" valign="bottom">
                        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Vitality Index</p>
                        <span class="score-num" style="font-size:52px;font-weight:800;color:#1e293b;line-height:1;">${healthScore.score}</span><span style="font-size:18px;color:#94a3b8;font-weight:400;">/100</span>
                      </td>
                      <td class="vitality-badge-col" valign="bottom" align="right">
                        <span style="display:inline-block;background-color:${healthScore.color};color:#ffffff;padding:7px 18px;border-radius:100px;font-size:14px;font-weight:700;">
                          Status: ${healthScore.status}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Spectrum Bar -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <td>
                        <!-- Track -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="height:10px;background:linear-gradient(to right,#ef4444,#f59e0b,#10b981);border-radius:5px;margin-bottom:6px;">
                          <tr><td style="height:10px;"></td></tr>
                        </table>
                        <!-- Labels -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                          <tr>
                            <td style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Baseline</td>
                            <td align="center" style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Average</td>
                            <td align="right" style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Peak</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Summary Text -->
                  <p style="margin:20px 0 0;font-size:14px;color:#475569;line-height:1.7;border-top:1px solid #e2e8f0;padding-top:20px;">
                    Your score of <strong>${healthScore.score}</strong> places you in the <strong>${healthScore.status}</strong> range. The products below have been selected to help you reach <strong>Peak</strong> performance.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ===== META ROW ===== -->
        <tr>
          <td class="content-pad" style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-bottom:1px solid #f1f5f9;padding-bottom:24px;">
              <tr>
                <td class="meta-col" valign="top">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Reference</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">#${reportId.toUpperCase()}</p>
                </td>
                <td class="meta-col" valign="top" align="right">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Analysis Date</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">${analysisDate}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ===== GREETING ===== -->
        <tr>
          <td class="content-pad" style="padding:0 40px 24px;">
            <p style="margin:0;font-size:16px;color:#1e293b;line-height:1.7;">
              Hello <strong>${htmlName}</strong>,<br><br>
              Based on your goal to improve <strong>${primaryGoalText}</strong> with a focus on <strong>${specificFocusText}</strong>, here are the products we selected specifically for you.
            </p>
          </td>
        </tr>

        <!-- ===== SECTION TITLE ===== -->
        <tr>
          <td class="content-pad" style="padding:0 40px 16px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#0084ff;text-transform:uppercase;letter-spacing:2px;">⬡ Your Recommendations</p>
          </td>
        </tr>

        <!-- ===== PRODUCTS ===== -->
        ${products.map(p => `
        <tr>
          <td class="content-pad" style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
              <tr>
                <td style="padding:24px;">
                  <!-- Product Header Row -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <td class="product-img-col" width="110" valign="top" style="padding-right:20px;">
                        <img src="${p.image.startsWith('http') ? p.image : baseUrl + (p.image.startsWith('/') ? p.image.substring(1) : p.image)}" alt="${p.name}" width="100" height="100" style="width:100px;height:100px;border-radius:12px;border:1px solid #e2e8f0;background:#ffffff;object-fit:contain;display:block;">
                      </td>
                      <td class="product-text-col" valign="top">
                        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#1e293b;">${p.name}</p>
                        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0084ff;">✓ Top Match For You</p>
                        <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">${p.description}</p>
                        ${p.bullets && p.bullets.length > 0 ? `
                        <ul style="margin:10px 0 0;padding-left:18px;font-size:13px;color:#475569;line-height:1.6;">
                          ${p.bullets.map(b => `<li style="margin-bottom:4px;">${b}</li>`).join('')}
                        </ul>` : ''}
                      </td>
                    </tr>
                  </table>

                  <!-- Rationale Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:20px;">
                    <tr>
                      <td style="background:#ffffff;border-radius:10px;padding:16px;border-left:4px solid #0084ff;border:1px solid #e2e8f0;border-left-width:4px;border-left-color:#0084ff;border-left-style:solid;">
                        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1e293b;">Why This Works For You:</p>
                        <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">${p.rationale || `Selected based on your focus on ${Array.isArray(answers.specificFocus) ? answers.specificFocus[0] : answers.specificFocus} and your goal to support ${Array.isArray(answers.primaryGoal) ? answers.primaryGoal[0] : answers.primaryGoal}.`}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table class="btn-cta" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:20px;">
                    <tr>
                      <td align="center">
                        <a href="${p.affiliateLink}" target="_blank" style="display:inline-block;background:#0084ff;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(0,132,255,0.25);">Shop Now &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        `).join('')}

        ${complementary.length > 0 ? `
        <!-- ===== ADDITIONAL RECOMMENDATION ===== -->
        <tr>
          <td class="content-pad" style="padding:8px 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-top:2px dashed #e2e8f0;padding-top:28px;margin-top:8px;">
              <tr>
                <td>
                  <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:2px;text-align:center;">Additional Recommendation</p>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      ${complementary.map(p => `
                      <td class="comp-item" valign="top" style="width:50%;text-align:center;padding:0 12px;">
                        <img src="${p.image.startsWith('http') ? p.image : baseUrl + (p.image.startsWith('/') ? p.image.substring(1) : p.image)}" alt="${p.name}" width="110" height="110" style="width:110px;height:110px;border-radius:12px;border:1px solid #e2e8f0;object-fit:contain;background:#ffffff;display:block;margin:0 auto 12px;">
                        <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1e293b;">${p.name}</p>
                        <p style="margin:0 0 10px;font-size:12px;color:#64748b;line-height:1.5;">${p.description}</p>
                        <a href="${p.affiliateLink}" target="_blank" style="display:inline-block;background:#ffffff;color:#0084ff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;border:1px solid #0084ff;margin-top:8px;">Shop Now &rarr;</a>
                      </td>
                      `).join('')}
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ` : ''}

        <!-- ===== SIGNATURE ===== -->
        <tr>
          <td class="content-pad" style="padding:0 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-top:1px solid #f1f5f9;padding-top:32px;">
              <tr>
                <td width="64" valign="top" style="padding-right:20px;">
                  <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" width="64" height="64" style="width:64px;height:64px;border-radius:50%;display:block;background:#000000;object-fit:contain;border:2px solid #e2e8f0;">
                </td>
                <td valign="middle">
                  <p style="margin:0;font-size:16px;font-weight:700;color:#1e293b;">The EternoFit Team</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#64748b;line-height:1.4;">Clinical Wellness & Performance<br>Authorized Diagnostic Division</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ===== FOOTER ===== -->
        <tr>
          <td class="footer-pad" style="background:#f8fafc;padding:32px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 6px;font-weight:600;color:#64748b;font-size:14px;">EternoFit Wellness</p>
            <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;line-height:1.6;">You received this email because you completed a health quiz on our website. We respect your privacy.</p>
            <p style="margin:0 0 20px;font-size:12px;color:#94a3b8;">123 Performance Way, Suite 400, Austin, TX 78701</p>
            <p style="margin:0 0 12px;">
              <a href="${baseUrl}support" style="color:#94a3b8;text-decoration:underline;font-size:13px;margin:0 8px;">Support</a>
              <a href="${baseUrl}#privacy" style="color:#94a3b8;text-decoration:underline;font-size:13px;margin:0 8px;">Privacy Policy</a>
              <a href="${baseUrl}#terms" style="color:#94a3b8;text-decoration:underline;font-size:13px;margin:0 8px;">Terms of Service</a>
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">© 2026 EternoFit Wellness. All rights reserved.</p>
            <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#1e293b;">support@eternofit.com</p>
            <a href="${baseUrl}unsubscribe" style="color:#94a3b8;text-decoration:underline;font-size:13px;">Unsubscribe</a>
          </td>
        </tr>

      </table>
      <!-- End Email Container -->

    </td>
  </tr>
</table>
<!-- End Email Wrapper -->

</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "EternoFit Clinical <clinical@eternofit.com>",
        to: [to],
        subject: subject,
        html: emailHtml,
        text: `Hello ${htmlName},

Your personalized health summary from EternoFit is ready. Based on your goals to improve ${primaryGoalText}, we have prepared a clinical evaluation and product recommendations specifically for you.

To view your full report online, please visit our site.

EternoFit Wellness
123 Performance Way, Suite 400, Austin, TX 78701
To unsubscribe: ${baseUrl}unsubscribe`
      })
    });

    const result = await res.json();
    
    if (res.ok) {
      return new Response(JSON.stringify({ success: true, id: result.id }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: result.message || "Failed to send" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Backend Error: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
```

## File: `functions\api\send-marketing-email.js`

```js
export async function onRequestPost(context) {
  const { request, env } = context;
  
  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Resend API Key is not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { to, subject, html, text, fromName = "EternoFit Wellness" } = body;

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, subject, and html." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `${fromName} <clinical@eternofit.com>`,
        to: [to],
        subject: subject,
        html: html,
        text: text || "Your custom health update from EternoFit Wellness."
      })
    });

    const result = await res.json();
    
    if (res.ok) {
      return new Response(JSON.stringify({ success: true, id: result.id }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: result.message || "Failed to send email via Resend." }), {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Server Error: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
```

## File: `functions\api\track-open.js`

```js
export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const campaign = url.searchParams.get('campaign') || 'Direct Campaign';

  // 1x1 transparent GIF binary data
  const transparentGif = new Uint8Array([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00,
    0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b
  ]);

  if (email) {
    try {
      // Direct REST API write to Firestore (No Admin SDK required, respects public rules)
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/eternofit-67a94/databases/(default)/documents/analytics_events';
      
      await fetch(firestoreUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            event: { stringValue: 'email_opened' },
            recipient: { stringValue: email },
            campaign: { stringValue: campaign },
            timestamp: { stringValue: new Date().toISOString() }
          }
        })
      });
    } catch (err) {
      console.error("Open tracking server-side logging failure:", err);
    }
  }

  // Return transparent pixel with robust anti-caching headers
  return new Response(transparentGif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
```

## File: `functions\api\track-quiz.js`

```js
/**
 * Cloudflare Worker — returns the visitor's real IP and geo location.
 * Firestore writes are handled client-side via the Firebase SDK.
 */
export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Get the real IP from Cloudflare headers
    const ip = context.request.headers.get('CF-Connecting-IP')
      || context.request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
      || context.request.headers.get('X-Real-IP')
      || 'Unknown';

    // Get geo information from Cloudflare
    const cf = context.request.cf || {};
    const location = [cf.city, cf.region, cf.country].filter(Boolean).join(', ') || 'Unknown';

    return new Response(JSON.stringify({ ip, location }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    return new Response(JSON.stringify({ ip: 'Unknown', location: 'Unknown' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

## File: `src\analytics.js`

```js
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, increment, doc, setDoc } from 'firebase/firestore';

let visitorInfo = null;

let inMemorySessionId = null;

export const getVisitorInfo = async () => {
  if (visitorInfo) return visitorInfo;

  let sessionId = 'unknown';
  try {
    sessionId = sessionStorage.getItem('eternofit_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('eternofit_session_id', sessionId);
    }
  } catch (e) {
    console.warn("sessionStorage is blocked or unavailable:", e);
    if (!inMemorySessionId) {
      inMemorySessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    sessionId = inMemorySessionId;
  }

  try {
    const res = await fetch('/api/track-quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const data = await res.json();
    visitorInfo = {
      sessionId,
      ip: data.ip || 'Unknown',
      location: data.location || 'Unknown',
      source: window.userSource || (window.location.search.includes('utm_source=meta') ? 'meta' : 'organic')
    };
    return visitorInfo;
  } catch (e) {
    console.warn("Failed to fetch visitor info from API:", e);
    return { 
      sessionId,
      ip: 'Unknown', 
      location: 'Unknown', 
      source: window.userSource || 'organic' 
    };
  }
};

/**
 * Tracks a conversion event in Firebase.
 */
export const trackEvent = async (eventName, metadata = {}) => {
  try {
    const info = await getVisitorInfo();
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, 'analytics_stats', today);

    // Increment aggregated stats for the day
    await setDoc(statsRef, {
      [eventName]: increment(1),
      [`view_${info.source}`]: eventName.startsWith('view_') ? increment(1) : increment(0),
      lastUpdated: serverTimestamp()
    }, { merge: true });

    // Log individual event for deep analysis
    await addDoc(collection(db, 'analytics_events'), {
      event: eventName,
      sessionId: info.sessionId,
      ip: info.ip,
      location: info.location,
      source: info.source,
      ...metadata,
      timestamp: serverTimestamp()
    });

    // Track in Meta Pixel if available
    if (window.fbq) {
      if (eventName.includes('email_submitted')) {
        window.fbq('track', 'Lead', {
          content_name: 'Health Quiz',
          content_category: 'Health & Wellness',
          ...metadata
        });
      } else if (eventName.includes('affiliate_link_clicked')) {
        window.fbq('track', 'InitiateCheckout', { content_name: metadata.product, ...metadata });
      } else if (eventName.startsWith('view_')) {
        window.fbq('track', 'ViewContent', { content_name: eventName, ...metadata });
      } else {
        window.fbq('trackCustom', eventName, metadata);
      }
    }

    console.log(`[Analytics] Event tracked: ${eventName} (${info.ip})`);
  } catch (error) {
    console.warn(`[Analytics] Failed to track event ${eventName}:`, error);
  }
};

export const trackQuizSession = async (action, questionIndex, questionId, totalQuestions, quizFinished = false, extraData = {}) => {
  try {
    const info = await getVisitorInfo();
    const sessionRef = doc(db, 'quiz_sessions', info.sessionId);
    const baseData = {
      sessionId: info.sessionId,
      ip: info.ip,
      location: info.location,
      source: info.source,
      lastUpdated: new Date().toISOString(),
      ...extraData
    };

    if (action === 'quiz_opened') {
      await setDoc(sessionRef, {
        ...baseData,
        startedAt: new Date().toISOString(),
        currentQuestion: questionIndex ?? 0,
        currentQuestionId: questionId || 'landing',
        totalQuestions: totalQuestions || 8,
        quizFinished: false,
      }, { merge: true });
    } else if (action === 'question_answered') {
      await setDoc(sessionRef, {
        ...baseData,
        currentQuestion: questionIndex ?? 0,
        currentQuestionId: questionId || '',
        totalQuestions: totalQuestions || 8,
        quizFinished: false,
      }, { merge: true });
    } else if (action === 'quiz_finished') {
      await setDoc(sessionRef, {
        ...baseData,
        currentQuestion: totalQuestions || 8,
        currentQuestionId: 'completed',
        totalQuestions: totalQuestions || 8,
        quizFinished: true,
        finishedAt: new Date().toISOString(),
      }, { merge: true });
    } else if (action === 'email_submitted') {
      await setDoc(sessionRef, {
        ...baseData,
        quizFinished: true,
        emailSubmitted: true,
      }, { merge: true });
    }
  } catch (e) {
    console.warn('[QuizTracker] Failed to track session:', e);
  }
};
```

## File: `src\App.css`

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
```

## File: `src\App.jsx`

```jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Activity, Dumbbell, Zap, Brain, Shield, HeartPulse, Flame, Target, Droplets, Smile, Sunrise, Lock, LayoutDashboard, User, Mail, Globe, Clock, Moon, ChevronRight, ChevronDown, Search, X, Play, Apple, Facebook, Instagram, Youtube, Menu, Sliders } from 'lucide-react';
import { getFilteredProducts, getAdditionalRecommendations, calculateHealthScore, products as allProducts } from './data/products';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, setDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { useProducts } from './useProducts';
import ProductsAdmin from './ProductsAdmin';
import ConversionsAdmin from './ConversionsAdmin';
import QuizSessionsAdmin from './QuizSessionsAdmin';
import EmailMarketingAdmin from './EmailMarketingAdmin';
import Marketplace from './Marketplace';
import DigitalProductPage from './DigitalProductPage';
import { trackEvent, trackQuizSession } from './analytics';
import { Articles } from './Articles';
import { articles as globalArticles } from './data/articles';
import { ToolsPage } from './ToolsPage';
import SEO from './components/SEO';

const LoadingOverlay = ({ message }) => (
  <div className="fade-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(245,247,250,0.95)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
    <div className="icon-circle" style={{ width: '80px', height: '80px', marginBottom: '2rem', animation: 'pulse 2s infinite ease-in-out' }}>
      <Activity size={40} color="var(--accent-green)" />
    </div>
    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main-site)', marginBottom: '1rem' }}>{message}</h3>
    <div style={{ width: '200px', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', background: 'var(--accent-green)', animation: 'progress 1.5s infinite linear', transformOrigin: 'left' }} />
    </div>
  </div>
);

const VisualEmailTemplate = ({ globalProducts }) => {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [complementary, setComplementary] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      // Support both search params and hash params for flexibility
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
      const id = searchParams.get('id') || hashParams.get('id');
      if (!id) return;

      try {
        const docRef = doc(db, "submissions", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const submission = { id: docSnap.id, ...docSnap.data() };
          setData(submission);
          const mainRecs = getFilteredProducts(submission.answers, globalProducts);
          setProducts(mainRecs);
          const mainNames = mainRecs.map(p => p.name);
          const others = getAdditionalRecommendations(submission.answers, mainNames, globalProducts);
          setComplementary(others);
        } else {
          throw new Error("Not found in Firebase");
        }
      } catch (e) {
        console.warn("Firebase fetch failed, trying local storage:", e);
        const allData = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
        const submission = allData.find(s => s.id === id);
        if (submission) {
          setData(submission);
          const mainRecs = getFilteredProducts(submission.answers, globalProducts);
          setProducts(mainRecs);
          const mainNames = mainRecs.map(p => p.name);
          const others = getAdditionalRecommendations(submission.answers, mainNames, globalProducts);
          setComplementary(others);
        }
      }
    };
    fetchTemplate();
  }, []);

  const handleAutoSend = async () => {
    if (!data) return;
    setIsSending(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          subject: `Your EternoFit Health Summary - ${data.answers.name}`,
          htmlName: data.answers.name,
          reportUrl: window.location.origin,
          products: products.map(p => ({ ...p, image: p.image?.startsWith('http') ? p.image : `${window.location.origin}${p.image}` })),
          complementary: complementary.map(p => ({ ...p, image: p.image?.startsWith('http') ? p.image : `${window.location.origin}${p.image}` })),
          answers: { ...data.answers, id: data.id },
          healthScore: calculateHealthScore(data.answers)
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSendStatus('success');
        alert('✨ Clinical report sent successfully!');
      } else {
        throw new Error(result.error || 'Failed to send');
      }
    } catch (err) {
      console.error(err);
      setSendStatus('error');
      alert(`❌ Error: ${err.message}. Make sure you set your RESEND_API_KEY in the Cloudflare Dashboard.`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = async () => {
    const el = document.getElementById('email-content-root');
    if (!el) return;
    try {
      const type = "text/html";
      const blob = new Blob([el.innerHTML], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      alert('Email content copied to clipboard! You can now paste it directly into your email body.');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy. Please select the content manually and copy.');
    }
  };

  if (checkingAuth) return <LoadingOverlay message="Verifying Administrative Access..." />;
  
  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem', textAlign: 'center' }}>
        <div className="icon-circle" style={{ width: '80px', height: '80px', marginBottom: '1.5rem' }}>
          <Lock size={40} />
        </div>
        <h2 style={{ color: 'var(--text-main-site)', marginBottom: '1rem', fontSize: '1.5rem' }}>Clinical Access Restricted</h2>
        <p style={{ color: 'var(--text-muted-site)', maxWidth: '400px', marginBottom: '2rem', lineHeight: '1.6' }}>
          This interface is reserved for authorized clinical staff. Visitors should refer to the assessment summary sent to their primary inbox.
        </p>
        <button className="btn-primary" onClick={() => { window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')); }}>
          Personnel Login
        </button>
      </div>
    );
  }

  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading clinical details...</div>;

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      <div id="email-content-root" style={{ maxWidth: '650px', margin: '0 auto', background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ background: '#ffffff', padding: '2.5rem', textAlign: 'center', color: '#1e293b', borderBottom: '4px solid #00ff66' }}>
          <img src={`${window.location.origin}/logo-dark-bg.png`} alt="EternoFit" style={{ height: '44px', marginBottom: '1.5rem', filter: 'invert(1) brightness(0)' }} />
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Clinical Evaluation Report</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>Prepared exclusively for {data.answers.name}</p>
          <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Evaluation ID: #{data.id.toUpperCase()}</p>
        </div>
        
        <div style={{ padding: '2.5rem' }}>
          {/* Redesigned Vitality Index - Premium Spectrum Design */}
          {(() => {
            const h = calculateHealthScore(data.answers);
            return (
              <div style={{ marginBottom: '3rem', background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>Vitality Index</h3>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>{h.score}<span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: '500' }}>/100</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: h.color, color: 'white', padding: '6px 18px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', display: 'inline-block' }}>
                      Status: {h.status}
                    </div>
                  </div>
                </div>
                
                {/* Spectrum Bar */}
                <div style={{ position: 'relative', height: '12px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '2.5rem', overflow: 'visible' }}>
                  {/* Gradient Overlay */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '6px', background: 'linear-gradient(to right, #ef4444, #f59e0b, #10b981)' }}></div>
                  
                  {/* Pointer */}
                  <div style={{ 
                    position: 'absolute', 
                    left: `${h.score}%`, 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    background: '#ffffff',
                    border: `4px solid ${h.color}`,
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 2,
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}></div>

                  {/* Marker Labels */}
                  <div style={{ position: 'absolute', top: '24px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                    <span>Baseline</span>
                    <span>Average</span>
                    <span>Peak</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                  Your score of <strong>{h.score}</strong> indicates that your physiological systems are currently operating in the <strong>{h.status.toLowerCase()}</strong> range. Our recommended formulations are specifically calibrated to move you toward the <strong>Peak</strong> vitality spectrum.
                </p>
              </div>
            );
          })()}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Report ID</p>
              <p style={{ margin: 0, fontWeight: '600' }}>#{data.id.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Analysis Date</p>
              <p style={{ margin: 0, fontWeight: '600' }}>{new Date(data.timestamp).toLocaleDateString()}</p>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#1e293b', lineHeight: '1.6', marginBottom: '2rem' }}>
            Hello <strong>{data.answers.name}</strong>,<br /><br />
            Our clinical review of your assessment is complete. Based on your stated goal to improve <strong>{data.answers.primaryGoal.join(' & ')}</strong> and your specific focus on <strong>{Array.isArray(data.answers.specificFocus) ? data.answers.specificFocus.join(', ') : data.answers.specificFocus}</strong>, we have authorized the following formulation roadmap.
          </p>
          
          <h2 style={{ fontSize: '1.1rem', color: '#0084ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={18} /> Authorized Formulations
          </h2>
          
          {products.map((prod, idx) => (
            <div key={idx} style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                <img src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} alt={prod.name} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'contain', border: '1px solid #e2e8f0', background: '#fff' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#1e293b' }}>{prod.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#0084ff', fontWeight: '600', marginBottom: '8px' }}>High Affinity Match</div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>{prod.description}</p>
                  {prod.bullets && (
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                      {prod.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', borderLeft: '4px solid #0084ff' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Clinical Rationale:</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                  {prod.rationale || `Based on your focus on ${Array.isArray(data.answers.specificFocus) ? data.answers.specificFocus[0] : data.answers.specificFocus}, this formulation is authorized for its high-affinity absorption and proven efficacy in supporting ${data.answers.primaryGoal[0]}.`}
                </p>
              </div>
              <a 
                href={prod.affiliateLink} 
                onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_report' })}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'block', background: '#0084ff', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,132,255,0.2)' }}
              >
                Shop Now <ArrowRight size={18} className="inline ml-1" />
              </a>
            </div>
          ))}

          {complementary.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px dashed #e2e8f0' }}>
              <h2 style={{ fontSize: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Additional Recommendation</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {complementary.map((prod, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <img src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} alt={prod.name} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'contain', marginBottom: '1rem', border: '1px solid #e2e8f0', background: '#fff' }} />
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{prod.name}</h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b', lineHeight: '1.3' }}>{prod.description}</p>
                    <a 
                      href={prod.affiliateLink} 
                      onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_report_complementary' })}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ display: 'inline-block', background: '#ffffff', color: '#0084ff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', border: '1px solid #0084ff', marginTop: '0.5rem' }}
                    >
                      Shop Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Section */}
          <div style={{ marginTop: '2rem', padding: '2rem 0', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <img 
              src={`${window.location.origin}/Eterno Fit Logo Design.png`} 
              alt="EternoFit" 
              style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#000', objectFit: 'contain' }} 
            />
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '1.05rem' }}>The EternoFit Team</p>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.4' }}>Clinical Wellness & Performance<br/>Authorized Diagnostic Division</p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7' }}>
            <p style={{ margin: '0 0 1rem 0', color: '#166534', fontWeight: '700' }}>✓ Evaluation Authenticated - EternoFit Clinical Engine</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', opacity: 0.8 }}>This protocol is generated based on your current physiological baseline.</p>
          </div>
        </div>

        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: '0.8rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#64748b' }}>🔒 Secure & Verified Communication</p>
            <p style={{ margin: 0, lineHeight: '1.4' }}>EternoFit will never ask for your password or payment details over email. This email was sent securely following CAN-SPAM regulations.</p>
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href={`${window.location.origin}/support`} style={{ color: '#94a3b8', textDecoration: 'underline' }}>Clinical Support</a>
            <a href={`${window.location.origin}/privacy`} style={{ color: '#94a3b8', textDecoration: 'underline' }}>Privacy Policy</a>
            <a href={`${window.location.origin}/terms`} style={{ color: '#94a3b8', textDecoration: 'underline' }}>Terms of Service</a>
          </div>
          <p style={{ margin: '0 0 8px 0' }}>© 2026 EternoFit Wellness. All rights reserved.</p>
          <p style={{ margin: '0 0 1rem 0' }}>clinical@eternofit.com | Secure ID: {data.id}</p>
          <a href="#unsubscribe" style={{ color: '#ef4444', textDecoration: 'underline', fontWeight: '600' }}>Unsubscribe from future health insights</a>
        </div>
      </div>
      
      <div style={{ maxWidth: '650px', margin: '2rem auto', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}>Print / Download PDF</button>
        <button 
          onClick={handleAutoSend} 
          disabled={isSending}
          className="btn-primary" 
          style={{ padding: '12px 24px', borderRadius: '12px', background: sendStatus === 'success' ? '#10b981' : 'var(--primary)' }}
        >
          {isSending ? 'Sending...' : sendStatus === 'success' ? '✓ Email Sent' : 'Resend Clinical Email'}
        </button>
        <button onClick={handleCopy} className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}>Copy Template HTML</button>
      </div>
    </div>
  );
};

const TermsOfService = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left', padding: '3rem' }}>
    <SEO title="Terms of Service | EternoFit" description="EternoFit clinical assessment terms of service." url="https://eternofit.com/terms" />
    <h1 className="title" style={{ textAlign: 'left', fontSize: '2rem' }}>Terms of Service</h1>
    <div style={{ color: 'var(--text-muted-site)', lineHeight: '1.8' }}>
      <p>By accessing EternoFit, you agree to our professional clinical assessment terms. Our recommendations are based on your personal inputs and clinical wellness standards.</p>
      <h3 style={{ color: 'var(--text-main-site)', marginTop: '1.5rem' }}>Clinical Disclaimer</h3>
      <p>Recommendations provided by EternoFit are for informational purposes only and do not replace professional medical advice. Always consult with a physician before starting any new supplement protocol.</p>
    </div>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ marginTop: '2rem' }}>Return Home</button>
  </div>
);

const PrivacyPolicy = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left', padding: '3rem' }}>
    <SEO title="Privacy Policy | EternoFit" description="EternoFit privacy policy. Your health data is encrypted and secure." url="https://eternofit.com/privacy" />
    <h1 className="title" style={{ textAlign: 'left', fontSize: '2rem' }}>Privacy Policy</h1>
    <div style={{ color: 'var(--text-muted-site)', lineHeight: '1.8' }}>
      <p>Your health data is encrypted and secure. We never sell your personal information to third parties.</p>
      <p>Data collected during the assessment is used solely to generate your personalized wellness protocol and to provide requested clinical support.</p>
    </div>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ marginTop: '2rem' }}>Return Home</button>
  </div>
);

const ClinicalSupport = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem' }}>
    <SEO title="Clinical Support | EternoFit" description="Direct access to the EternoFit human health team for clinical support." url="https://eternofit.com/support" />
    <div className="icon-circle" style={{ margin: '0 auto 1.5rem' }}><Mail size={32} /></div>
    <h1 className="title">Clinical Support</h1>
    <p className="subtitle">Direct access to our human health team.</p>
    <p style={{ color: 'var(--text-main-site)', fontSize: '1.2rem', marginBottom: '2rem' }}>
      Contact our clinical team directly at:<br/>
      <strong style={{ color: 'var(--accent-green)' }}>clinical@eternofit.com</strong>
    </p>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Return Home</button>
  </div>
);

const AboutUs = () => (
  <div className="glass-card fade-enter" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left', padding: '3rem' }}>
    <SEO title="About EternoFit | Clinical Wellness Specialists" description="We are a premier collective of clinical wellness specialists, bio-optimization coaches, and performance nutritionists dedicated to helping individuals unlock high-performance biological states." url="https://eternofit.com/about" />
    <h1 className="title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Activity size={32} color="var(--accent-green)" /> About EternoFit
    </h1>
    <div style={{ color: 'var(--text-muted-site)', lineHeight: '1.8', fontSize: '1.05rem' }}>
      <p style={{ marginBottom: '1.5rem' }}>
        Welcome to <strong>EternoFit</strong>. We are a premier collective of clinical wellness specialists, bio-optimization coaches, and performance nutritionists dedicated to helping individuals unlock high-performance biological states.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        We believe that human potential is optimized through precision, evidence-based health assessments, and disciplined lifestyle adaptation. Unlike traditional "one-size-fits-all" fitness programs, we use data-driven insights to tailor specific protocols to your body's unique demands.
      </p>
      
      <h3 style={{ color: 'var(--text-main-site)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.3rem' }}>Our Core Pillars:</h3>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <li>
          <strong>Biological Precision:</strong> Every recommendation is backed by peer-reviewed research and tailored to address exact biological deficits.
        </li>
        <li>
          <strong>Sustainable Optimization:</strong> We emphasize gradual, compounding adaptations in sleep architecture, training volume, and smart supplementation rather than unsustainable quick fixes.
        </li>
        <li>
          <strong>Uncompromised Integrity:</strong> We only advocate for pure, clinically studied ingredients and therapeutic tools that align with longevity and systemic health.
        </li>
      </ul>
      
      <p style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', fontStyle: 'italic' }}>
        "Physical capability and biological resilience are not random occurrences—they are the direct results of structural discipline, consistent metrics, and evidence-backed protocols."
      </p>
    </div>
    <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ marginTop: '2rem' }}>Return Home</button>
  </div>
);

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="glass-card fade-enter" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="icon-circle" style={{ margin: '0 auto 2rem', width: '80px', height: '80px' }}>
          <CheckCircle2 size={40} color="var(--accent-green)" />
        </div>
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Message Transmitted</h2>
        <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '450px', margin: '0 auto 2rem' }}>
          Thank you, <strong>{formData.name}</strong>. Our clinical support team has received your transmission and will respond to <strong>{formData.email}</strong> within 24 hours.
        </p>
        <button className="btn-primary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ maxWidth: '250px', margin: '0 auto' }}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card fade-enter" style={{ maxWidth: '650px', margin: '2rem auto', padding: '3rem' }}>
      <SEO title="Contact EternoFit | Clinical Support" description="Have questions about your health report? Get in touch with our support division." url="https://eternofit.com/contact" />
      <h1 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <Mail size={32} color="var(--accent-green)" /> Contact EternoFit
      </h1>
      <p className="subtitle" style={{ fontSize: '1.05rem', marginBottom: '2rem' }}>
        Have questions about your health report? Get in touch with our support division.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Full Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Email Address</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Subject</label>
          <input 
            type="text" 
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Query regarding my Health Report"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Message</label>
          <textarea 
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Write your detailed inquiry here..."
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || !formData.name || !formData.email || !formData.message}
          style={{ marginTop: '0.5rem', width: '100%', opacity: (formData.name && formData.email && formData.message) ? 1 : 0.5 }}
        >
          {loading ? 'Transmitting...' : 'Send Message'} <ChevronRight size={18} style={{ marginLeft: '6px' }} />
        </button>
      </form>
      
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '2.5rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted-site)' }}>Or contact our clinical support team directly at:</p>
        <strong style={{ fontSize: '1.1rem', color: 'var(--accent-green)' }}>clinical@eternofit.com</strong>
      </div>
    </div>
  );
};

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) return;
    try {
      const q = query(collection(db, "submissions"), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        alert("Email not found in our records.");
        return;
      }
      for (const d of snapshot.docs) {
        await updateDoc(doc(db, "submissions", d.id), { unsubscribed: true });
      }
      setDone(true);
    } catch (e) {
      alert("Error processing request. Please contact clinical@eternofit.com.");
    }
  };

  if (done) return (
    <div className="glass-card fade-enter" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <CheckCircle2 size={48} color="var(--accent-green)" style={{ margin: '0 auto 1.5rem' }} />
      <h2 className="title">Unsubscribed Successfully</h2>
      <p className="subtitle">Your email has been removed from our update list.</p>
      <button className="btn-secondary" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Return Home</button>
    </div>
  );

  return (
    <div className="glass-card fade-enter" style={{ maxWidth: '500px', margin: '4rem auto', padding: '3rem' }}>
      <h1 className="title" style={{ fontSize: '1.5rem' }}>Unsubscribe</h1>
      <p className="subtitle">Enter your email to stop receiving updates from us.</p>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="your@email.com"
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', marginBottom: '1.5rem', outline: 'none' }}
      />
      <button className="btn-primary" onClick={handleUnsubscribe}>Confirm Unsubscribe</button>
    </div>
  );
};

const AdminPanel = ({ onBack, globalProducts, reloadProducts, deliveryMode, onToggleDeliveryMode }) => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('visitors');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortKey, sortOrder]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, "submissions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    }, (error) => {
      console.warn("Firebase onSnapshot failed, falling back to local storage.", error);
      const savedData = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
      setData(savedData);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Invalid administrative credentials.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleQuickSend = async (item) => {
    if (item.unsubscribed) {
      alert("⚠️ This user has unsubscribed and cannot receive automated emails.");
      return;
    }
    
    if (!window.confirm(`Send health summary to ${item.answers.name} (${item.email})?`)) return;

    try {
      const recommendations = getFilteredProducts(item.answers, globalProducts);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: item.email,
          subject: `Your EternoFit Health Summary - ${item.answers.name}`,
          htmlName: item.answers.name,
          reportUrl: window.location.origin,
          products: recommendations,
          complementary: getAdditionalRecommendations(item.answers, recommendations.map(r => r.name), globalProducts),
          answers: { ...item.answers, id: item.id },
          healthScore: calculateHealthScore(item.answers)
        })
      });

      if (response.ok) {
        alert("✨ Email sent successfully!");
        trackEvent('email_sent', { targetEmail: item.email, submissionId: item.id });
        toggleStatus(item.id); // Mark as emailed
      } else {
        alert("❌ Failed to send. Check console.");
      }
    } catch (e) {
      alert("❌ Error: " + e.message);
    }
  };

  const toggleStatus = async (id) => {
    const itemToUpdate = data.find(item => item.id === id);
    if (!itemToUpdate) return;

    let nextStatus;
    if (itemToUpdate.status === 'Received') nextStatus = 'Emailed';
    else if (itemToUpdate.status === 'Emailed') nextStatus = 'Rejected';
    else nextStatus = 'Received';

    const newData = data.map(item => item.id === id ? { ...item, status: nextStatus } : item);
    setData(newData);

    try {
      const docRef = doc(db, "submissions", id);
      await updateDoc(docRef, { status: nextStatus });
    } catch (e) {
      console.warn("Firebase update failed, updating local storage.", e);
      localStorage.setItem('quiz_submissions', JSON.stringify(newData));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visitor record?')) {
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      
      try {
        await deleteDoc(doc(db, "submissions", id));
      } catch (e) {
        console.warn("Firebase delete failed, deleting from local storage.", e);
        localStorage.setItem('quiz_submissions', JSON.stringify(newData));
      }
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Timestamp', 'Name', 'Email', 'IP', 'Goals', 'Focus', 'Urgency', 'Products', 'Status'];
    const rows = filteredData.map(s => [
      s.id,
      new Date(s.timestamp).toLocaleString(),
      s.answers.name,
      s.email,
      s.ip,
      s.answers.primaryGoal.join('; '),
      Array.isArray(s.answers.specificFocus) ? s.answers.specificFocus.join('; ') : s.answers.specificFocus,
      s.answers.urgency,
      s.recommendations ? s.recommendations.join('; ') : '',
      s.status || 'Received'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `eternofit_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data
    .filter(item => {
      const searchLower = search.toLowerCase();
      const nameMatch = item.answers?.name?.toLowerCase().includes(searchLower);
      const emailMatch = item.email?.toLowerCase().includes(searchLower);
      const goalMatch = item.answers?.primaryGoal?.some(g => g.toLowerCase().includes(searchLower));
      const focusMatch = Array.isArray(item.answers?.specificFocus) 
        ? item.answers.specificFocus.some(f => f.toLowerCase().includes(searchLower))
        : item.answers?.specificFocus?.toLowerCase().includes(searchLower);
      
      return nameMatch || emailMatch || goalMatch || focusMatch;
    })
    .sort((a, b) => {
      const valA = sortKey === 'timestamp' ? new Date(a[sortKey]) : a[sortKey];
      const valB = sortKey === 'timestamp' ? new Date(b[sortKey]) : b[sortKey];
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading admin portal...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="glass-card fade-enter" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="icon-circle" style={{ margin: '0 auto 1rem' }}>
            <Lock size={24} color="var(--accent-green)" />
          </div>
          <h2 className="title" style={{ fontSize: '1.5rem' }}>Admin Authentication</h2>
          <p className="subtitle">Secure portal for EternoFit admin access only.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Secure Password"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
          <button className="btn-primary" onClick={handleLogin}>
            Access Dashboard <ChevronRight size={18} />
          </button>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted-site)', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Return to Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container fade-enter" style={{ maxWidth: '1400px' }}>
      
      {/* Row 1: Dashboard Header Title & Actions */}
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={24} color="var(--primary)" />
          <h2 style={{ margin: 0, fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Visitor Analytics Dashboard</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleExport} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={14} /> Export CSV
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', border: '1px solid #ef4444', color: '#ef4444' }}>
            Logout
          </button>
          <button onClick={onBack} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Exit Dashboard
          </button>
        </div>
      </div>

      {/* Row 2: Sub-bar with Navigation Tabs and Quiz Mode Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'nowrap', gap: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1.25rem', overflowX: 'auto', width: '100%' }}>
        {/* Left Side: Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
          <button 
            onClick={() => setActiveTab('visitors')} 
            className={activeTab === 'visitors' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'visitors' ? '#000000' : 'var(--text-main-site)' }}
          >
            Visitors
          </button>
          <button 
            onClick={() => setActiveTab('quizSessions')} 
            className={activeTab === 'quizSessions' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'quizSessions' ? '#000000' : 'var(--text-main-site)' }}
          >
            Quiz Sessions
          </button>
          <button 
            onClick={() => setActiveTab('conversions')} 
            className={activeTab === 'conversions' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'conversions' ? '#000000' : 'var(--text-main-site)' }}
          >
            Conversions
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={activeTab === 'products' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'products' ? '#000000' : 'var(--text-main-site)' }}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('emailMarketing')} 
            className={activeTab === 'emailMarketing' ? 'btn-primary' : 'btn-secondary'} 
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', width: 'auto', color: activeTab === 'emailMarketing' ? '#000000' : 'var(--text-main-site)' }}
          >
            Email Marketing
          </button>
        </div>

        {/* Right Side: Quiz Delivery Mode Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', flexShrink: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quiz Mode:</span>
          <div className="admin-toggle-switch" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '30px', padding: '2px', boxShadow: '0 0 15px rgba(0, 255, 102, 0.05)' }}>
            <button 
              onClick={() => onToggleDeliveryMode('email')} 
              className={`admin-toggle-btn ${deliveryMode === 'email' ? 'active' : ''}`}
              style={{
                background: deliveryMode === 'email' ? 'var(--primary)' : 'transparent',
                color: deliveryMode === 'email' ? '#000000' : 'var(--text-muted-site)',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Mail size={12} /> Send to Email
            </button>
            <button 
              onClick={() => onToggleDeliveryMode('instant')} 
              className={`admin-toggle-btn ${deliveryMode === 'instant' ? 'active' : ''}`}
              style={{
                background: deliveryMode === 'instant' ? 'var(--primary)' : 'transparent',
                color: deliveryMode === 'instant' ? '#000000' : 'var(--text-muted-site)',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Globe size={12} /> Instant Web
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'products' ? (
        <ProductsAdmin products={globalProducts} onProductChange={reloadProducts} />
      ) : activeTab === 'quizSessions' ? (
        <QuizSessionsAdmin />
      ) : activeTab === 'conversions' ? (
        <ConversionsAdmin />
      ) : activeTab === 'emailMarketing' ? (
        <EmailMarketingAdmin globalProducts={globalProducts} />
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search by name, email, or focus area..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.95rem', background: 'var(--bg-surface)', color: 'var(--text-main-site)' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600' }}>
              {filteredData.length} Records
            </div>
            <select 
              value={sortKey} 
              onChange={(e) => setSortKey(e.target.value)}
              style={{ padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)' }}
            >
              <option value="timestamp">Sort by Date</option>
              <option value="email">Sort by Email</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} style={{ cursor: 'pointer' }}>
                <Clock size={14} /> Timestamp {sortKey === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th><User size={14} /> Visitor</th>
              <th><Target size={14} /> Focus & Goals</th>
              <th><Zap size={14} /> Recommendations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id || idx} style={{ opacity: item.unsubscribed ? 0.6 : 1 }}>
                <td>{new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>
                  <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.answers.name}
                    {item.unsubscribed && <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>Unsubscribed</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.email}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.ip || 'Unknown'}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {item.answers.primaryGoal.map((g, i) => (
                        <span key={i} className="admin-tag">{g}</span>
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  {item.recommendations ? item.recommendations.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>• {r}</div>
                  )) : 'N/A'}
                </td>
                <td>
                  <button 
                    onClick={() => toggleStatus(item.id)}
                    className={`admin-tag`}
                    style={{ 
                      cursor: 'pointer', 
                      border: 'none', 
                      background: item.status === 'Emailed' ? '#dcfce7' : (item.status === 'Rejected' ? '#fee2e2' : '#fef08a'),
                      color: item.status === 'Emailed' ? '#166534' : (item.status === 'Rejected' ? '#991b1b' : '#854d0e'),
                      padding: '4px 10px'
                    }}
                  >
                    {item.status || 'Received'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleQuickSend(item)} 
                      className="admin-link-btn"
                      disabled={item.unsubscribed}
                      style={{ background: 'var(--primary)', color: '#1e293b', border: 'none', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
                    >
                      <Mail size={12} /> Send Email
                    </button>
                    <button 
                      onClick={() => window.open(`${window.location.origin}/email-template?id=${item.id}`, '_blank')} 
                      className="admin-link-btn"
                    >
                      View Report
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="admin-link-btn"
                      style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
            <span>Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', outline: 'none' }}
            >
              <option value={20}>20</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
            <span style={{ marginLeft: '1rem' }}>
              Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              disabled={currentPage >= Math.ceil(filteredData.length / pageSize)} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredData.length / pageSize)))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage >= Math.ceil(filteredData.length / pageSize) ? 0.4 : 1, cursor: currentPage >= Math.ceil(filteredData.length / pageSize) ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

const TestimonialCarousel = () => {
  const testimonials = [
    { quote: "I had no idea my fatigue was linked to vitamin deficiency. The results were eye-opening!", name: "Sarah M.", location: "Texas" },
    { quote: "Took 60 seconds and completely changed how I approach my health. Highly recommend!", name: "James K.", location: "California" },
    { quote: "Finally understand what my body actually needs. The personalized recommendations were spot on!", name: "Michelle R.", location: "Florida" },
    { quote: "I was skeptical at first but the results were shockingly accurate. Already seeing improvements!", name: "David L.", location: "New York" },
    { quote: "Best free health tool I've ever used. Wish I found this sooner!", name: "Amanda T.", location: "Ohio" },
  ];

  // Double the list for seamless looping
  const displayList = [...testimonials, ...testimonials];

  return (
    <div className="testimonial-marquee-container">
      <div className="testimonial-marquee-track">
        {displayList.map((t, i) => (
          <div key={i} className="testimonial-marquee-card">
            <p className="testimonial-quote">"{t.quote}"</p>
            <p className="testimonial-author">
              — {t.name}, {t.location} <span className="testimonial-stars">★★★★★</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = ({ onStart }) => {
  useEffect(() => {
    trackQuizSession('quiz_opened', 0, 'landing', 8);
  }, []);

  return (
    <div className="landing-layout fade-in-up">
      <SEO title="Free Health Assessment Quiz | EternoFit" description="Discover exactly what your body is missing in 60 seconds. Get your FREE personalized health report." url="https://eternofit.com/quiz" />
      <div className="glass-card" style={{ position: 'relative', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              Secure & Confidential
            </div>
          </div>

          <h1 className="title" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: '1.2' }}>Discover Exactly What Your Body Is Missing</h1>
          <p className="subtitle" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', maxWidth: '480px', margin: '0 auto 1.75rem auto', color: 'var(--accent-green) !important', fontWeight: '600' }}>
            Get your FREE personalized health report in 60 seconds
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <button 
              className="btn-primary" 
              onClick={onStart} 
              style={{ width: '100%', fontSize: '1.15rem', padding: '1.15rem 2rem' }}
            >
              Begin Assessment <ArrowRight className="inline ml-2" size={20} />
            </button>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Takes approximately 1 minute • 100% Free</p>
          </div>
        </div>
      </div>

      <div className="social-proof-section">
        <h3 className="social-proof-title">Trusted by Thousands of High-Performers</h3>
        <TestimonialCarousel />
      </div>
    </div>
  );
};

const Quiz = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // Track each question change
  useEffect(() => {
    trackQuizSession('question_answered', step, questions[step]?.id || 'gender', questions.length);
  }, [step]);


  const questions = [
    {
      id: 'gender',
      question: "What is your biological sex?",
      options: [
        { label: 'Male', desc: 'Biological Male' },
        { label: 'Female', desc: 'Biological Female' },
        { label: 'Other', desc: 'Intersex or other' }
      ]
    },
    {
      id: 'primaryGoal',
      question: "What are your main health goals? (Select up to 2):",
      options: (ans) => {
        let opts = [];
        if (ans.gender === 'Male') {
          opts.push({ label: 'Intimate Performance', desc: 'Erection quality and stamina', icon: <HeartPulse size={24} /> });
          opts.push({ label: 'Muscle & Physique', desc: 'Strength, mass, and testosterone', icon: <Dumbbell size={24} /> });
        } else if (ans.gender === 'Female') {
          opts.push({ label: 'Intimate Performance', desc: 'Boost libido and desire', icon: <HeartPulse size={24} /> });
          opts.push({ label: 'Skin & Beauty', desc: 'Collagen, wrinkles, and complexion', icon: <Sparkles size={24} /> });
        } else {
          opts.push({ label: 'Intimate Performance', desc: 'Sexual health and vitality', icon: <HeartPulse size={24} /> });
          opts.push({ label: 'Skin & Beauty', desc: 'Collagen, wrinkles, and complexion', icon: <Sparkles size={24} /> });
          opts.push({ label: 'Muscle & Physique', desc: 'Strength, mass, and fat loss', icon: <Dumbbell size={24} /> });
        }
        
        opts.push({ label: 'Anti-aging & Vitality', desc: 'Energy, youthfulness, and longevity', icon: <Zap size={24} /> });
        opts.push({ label: 'Brain & Focus', desc: 'Memory, clarity, and cognitive support', icon: <Brain size={24} /> });

        return opts;
      },
      multiple: true,
      maxSelect: 2
    },
    {
      id: 'sleepQuality',
      question: "Assess your Sleep Architecture & Recovery Quality:",
      options: [
        { label: 'Deep & Restful', desc: 'Wake up feeling refreshed' },
        { label: 'Occasionally Restless', desc: 'Trouble falling or staying asleep sometimes' },
        { label: 'Often Waking Up', desc: 'Fragmented sleep, frequent interruptions' },
        { label: 'Poor', desc: 'Chronic insomnia or very low energy' }
      ]
    },
    {
      id: 'tiredness',
      question: "How often do you feel tired during the day?",
      options: [
        'Rarely, I have consistent energy',
        'Sometimes, usually in the afternoon',
        'Often, I feel drained',
        'Constantly, I struggle to stay awake'
      ]
    },
    {
      id: 'specificFocus',
      question: (ans, opts) => `What would you most like to improve? (Select up to ${Math.min(4, opts.length)}):`,
      multiple: true,
      maxSelect: (ans, opts) => Math.min(4, opts.length),
      options: (ans) => {
        let opts = [];
        const goals = Array.isArray(ans.primaryGoal) ? ans.primaryGoal : [ans.primaryGoal].filter(Boolean);
        const isFemale = ans.gender === 'Female';
        
        if (goals.includes('Intimate Performance')) {
          if (isFemale) {
             opts.push({ label: 'Low Libido', desc: 'Increase desire', icon: <Flame size={20} /> });
             opts.push({ label: 'Intimate Sensation', desc: 'Heighten sensitivity', icon: <Sparkles size={20} /> });
             opts.push({ label: 'Intimate Energy', desc: 'Endurance & vitality', icon: <Zap size={20} /> });
          } else {
             // Male or Other defaults
             opts.push({ label: 'Erection Quality', desc: 'Hardness & duration', icon: <Shield size={20} /> });
             opts.push({ label: 'Low Libido', desc: 'Increase desire', icon: <Flame size={20} /> });
             opts.push({ label: 'Semen Volume', desc: 'Increase output', icon: <Droplets size={20} /> });
             opts.push({ label: 'Stamina', desc: 'Last longer', icon: <Zap size={20} /> });
          }
        }
        if (goals.includes('Muscle & Physique')) {
          if (isFemale) {
             opts.push({ label: 'Lean Muscle', desc: 'Tone & sculpt physique', icon: <Activity size={20} /> });
          } else {
             opts.push({ label: 'Low Testosterone', desc: 'Boost natural T', icon: <Activity size={20} /> });
          }
          opts.push({ label: 'Stubborn Fat', desc: 'Burn fat faster', icon: <Flame size={20} /> });
          opts.push({ label: 'Slow Recovery', desc: 'Heal and grow', icon: <HeartPulse size={20} /> });
        }
        if (goals.includes('Anti-aging & Vitality')) {
           opts.push({ label: 'Low Energy', desc: 'Daily vitality', icon: <Sunrise size={20} /> });
           opts.push({ label: 'Anti-aging', desc: 'Cellular support', icon: <Target size={20} /> });
        }
        if (goals.includes('Skin & Beauty')) {
           opts.push({ label: 'Fine Lines & Wrinkles', desc: 'Smooth skin', icon: <Smile size={20} /> });
           opts.push({ label: 'Acne Scars', desc: 'Clear complexion', icon: <Sparkles size={20} /> });
        }
        if (goals.includes('Brain & Focus')) {
           opts.push({ label: 'Brain Fog', desc: 'Clear thinking', icon: <Brain size={20} /> });
           opts.push({ label: 'Memory Decline', desc: 'Sharper recall', icon: <Target size={20} /> });
        }
        if (opts.length === 0) opts.push({ label: 'General Health', desc: 'Overall wellness', icon: <Shield size={20} /> }, { label: 'More Energy', desc: 'Daily boost', icon: <Zap size={20} /> });
        return opts;
      }
    },
    {
      id: 'motivationFocus',
      question: "Do you struggle with motivation or focus?",
      options: [
        'Rarely, I am highly motivated',
        'Sometimes, depending on the task',
        'Frequently, I find it hard to concentrate',
        'Constantly, I struggle with severe brain fog'
      ]
    },
    {
      id: 'performanceDecline',
      question: "Do you feel your performance (physical or personal) has declined recently?",
      options: [
        'No, I feel as strong as ever',
        'A little bit, noticeable but manageable',
        'Yes, a significant decline',
        'Yes, a severe decline affecting my confidence'
      ]
    }
  ];

  const currentQ = questions[step];
  const currentOptions = typeof currentQ.options === 'function' ? currentQ.options(answers) : currentQ.options;
  
  // Local state for multiple selection and text input
  const [currentInput, setCurrentInput] = useState('');
  const [currentSelection, setCurrentSelection] = useState([]);

  const handleNext = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    setCurrentInput('');
    setCurrentSelection([]);
    
    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
    } else {
      // Track quiz finished
      trackQuizSession('quiz_finished', questions.length, 'completed', questions.length, true);
      onComplete(newAnswers);
    }
  };

  const handleSelect = (option) => {
    if (currentQ.multiple) {
      if (currentSelection.includes(option)) {
        setCurrentSelection(currentSelection.filter(item => item !== option));
      } else {
        const maxSelect = typeof currentQ.maxSelect === 'function' ? currentQ.maxSelect(answers, currentOptions) : (currentQ.maxSelect || 3);
        if (currentSelection.length >= maxSelect) {
          // Prevent selecting more than the maximum allowed
          return;
        }
        setCurrentSelection([...currentSelection, option]);
      }
    } else {
      // Single selection auto-advances
      setTimeout(() => handleNext(option), 200);
    }
  };

  const progressPercentage = ((step + 1) / questions.length) * 100;

  return (
    <div className="glass-card fade-enter" key={step}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '80px' }}>
          {step > 0 && (
            <button 
              onClick={() => {
                setStep(step - 1);
                setCurrentInput('');
                setCurrentSelection([]);
              }} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted-site)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.95rem', padding: 0 }}
            >
              <ArrowRight size={16} style={{ transform: 'rotate(180deg)', marginRight: '6px' }} /> Back
            </button>
          )}
        </div>
        <div className="progress-text" style={{ position: 'static', color: 'var(--primary)' }}>Question {step + 1} of {questions.length}</div>
        <div style={{ width: '80px' }}></div>
      </div>
      
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--text-main-site)' }}>
        {typeof currentQ.question === 'function' ? currentQ.question(answers, currentOptions) : currentQ.question}
      </h2>
      
      {currentQ.type === 'text' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter your name"
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1.1rem', width: '100%', outline: 'none' }}
          />
          <button 
            className="btn-primary" 
            onClick={() => handleNext(currentInput)}
            disabled={currentQ.id === 'name' ? !/^[A-Za-z\s]{3,}$/.test(currentInput) : !currentInput.trim()}
            style={{ opacity: (currentQ.id === 'name' ? /^[A-Za-z\s]{3,}$/.test(currentInput) : currentInput.trim()) ? 1 : 0.5 }}
          >
            Continue <ArrowRight className="inline ml-2" size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="options-grid" style={currentQ.id === 'specificFocus' ? { gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' } : {}}>
            {currentOptions.map((optObj, i) => {
              const label = typeof optObj === 'string' ? optObj : optObj.label;
              const desc = typeof optObj === 'string' ? null : optObj.desc;
              const icon = typeof optObj === 'string' ? null : optObj.icon;
              const isSelected = currentQ.multiple ? currentSelection.includes(label) : false;
              return (
                <button 
                  key={i}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(label)}
                  style={currentQ.id === 'specificFocus' 
                    ? { flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center', padding: '1.25rem 1rem' } 
                    : { flexDirection: 'row', alignItems: 'center', gap: '12px' }}
                >
                  {currentQ.id === 'specificFocus' ? (
                    // Compact vertical layout for Q5
                    <>
                      <div style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted-site)', marginBottom: '4px' }}>
                        {icon}
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'inherit', lineHeight: '1.2' }}>{label}</span>
                      {desc && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', lineHeight: '1.2' }}>{desc}</span>}
                    </>
                  ) : (
                    // Default horizontal layout (with icon if available)
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                          {icon && <span style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted-site)' }}>{icon}</span>}
                          <span style={{ fontWeight: '600', color: isSelected ? 'var(--primary)' : 'inherit' }}>{label}</span>
                        </div>
                        {desc && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', marginTop: '4px', paddingLeft: icon ? '34px' : '0' }}>{desc}</span>}
                      </div>
                      {isSelected ? <CheckCircle2 size={18} color="var(--primary)" /> : <ArrowRight size={18} style={{ opacity: 0.3 }} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          {currentQ.multiple && (
            <button 
              className="btn-primary" 
              onClick={() => handleNext(currentSelection)}
              disabled={currentSelection.length === 0}
              style={{ marginTop: '2rem', opacity: currentSelection.length > 0 ? 1 : 0.5 }}
            >
              Continue <ArrowRight className="inline ml-2" size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

const EmailCollection = ({ onSubmit, deliveryMode }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const isValid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="glass-card fade-enter">
      <SEO title="Your Results Are Ready | EternoFit" description="Enter your details to view your personalized health report." url="https://eternofit.com/quiz" />
      <div className="bg-glow"></div>
      <div className="icon-circle" style={{ margin: '0 auto 2rem', width: '80px', height: '80px', background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)' }}>
        <CheckCircle2 size={40} color="var(--accent-green)" />
      </div>
      <h2 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Your Results Are Ready!</h2>
      <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '450px', margin: '0 auto' }}>
        {deliveryMode === 'instant' 
          ? "Enter your details below to view your personalized health report and product recommendations instantly."
          : "Enter your details below to receive your secure health summary in your primary inbox."
        }
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', maxWidth: '420px', margin: '2rem auto 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1.1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', marginLeft: '4px' }}>Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '1.1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={() => {
            onSubmit(name, email);
          }}
          disabled={!isValid}
          style={{ marginTop: '0.5rem', opacity: isValid ? 1 : 0.5 }}
        >
          {deliveryMode === 'instant' 
            ? "View My Results"
            : "Send & View My Results"
          } <ArrowRight className="inline ml-2" size={18} />
        </button>
      </div>
    </div>
  );
};

const Results = ({ answers, onRestart, globalProducts, deliveryMode }) => {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // 'success' | 'error'
  const [emailInput, setEmailInput] = useState(answers?.email || '');

  if (!answers) {
    return (
      <div className="glass-card fade-enter" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 className="title">No Assessment Found</h2>
        <p className="subtitle">Please start the assessment to generate your report.</p>
        <button className="btn-primary" onClick={onRestart}>Start Assessment</button>
      </div>
    );
  }

  const products = getFilteredProducts(answers, globalProducts);
  const complementary = getAdditionalRecommendations(answers, products.map(p => p.name), globalProducts);
  const healthScore = calculateHealthScore(answers);
  const emailWasSent = answers.emailSent;

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      alert("Please enter a valid email address.");
      return;
    }
    setIsSending(true);
    setSendStatus(null);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailInput,
          subject: `Your EternoFit Health Summary - ${answers.name}`,
          htmlName: answers.name,
          reportUrl: `${window.location.origin}/email-template?id=${answers.id || 'local'}`,
          products: products,
          complementary: complementary,
          answers: answers,
          healthScore: healthScore
        })
      });

      if (response.ok) {
        setSendStatus('success');
        alert("✨ Secure wellness protocol successfully emailed!");
      } else {
        throw new Error("Could not send report");
      }
    } catch (e) {
      setSendStatus('error');
      alert("❌ Failed to dispatch email. Please try again or contact clinical@eternofit.com.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="results-dashboard-container fade-enter" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', paddingTop: '3rem' }}>
      
      {/* Top Status Notification Banner */}
      <div style={{
        background: emailWasSent ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0, 255, 102, 0.1)',
        border: emailWasSent ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(0, 255, 102, 0.3)',
        borderRadius: '16px',
        padding: '1.25rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backdropFilter: 'blur(8px)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="icon-circle" style={{
            width: '40px',
            height: '40px',
            background: emailWasSent ? 'var(--accent-blue-dim)' : 'var(--accent-green-dim)',
            color: emailWasSent ? 'var(--accent-blue)' : 'var(--accent-green)'
          }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>
              {emailWasSent ? "Clinical Protocol Dispatched!" : "Clinical Protocol Compiled!"}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
              {emailWasSent 
                ? `A secure copy of your report has been successfully sent to ${answers.email}.`
                : "Your biological evaluation has been generated successfully and is shown below."
              }
            </p>
          </div>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => window.print()}
          style={{ padding: '6px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Print / PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Main Dashboard Card */}
        <div className="glass-card" style={{ maxWidth: '100%', padding: '3rem', position: 'relative' }}>
          <div className="bg-glow"></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{
                background: 'var(--accent-green-dim)',
                color: 'var(--accent-green)',
                border: '1px solid var(--border-accent)',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '10px'
              }}>Evaluation Authenticated</span>
              <h1 style={{ textAlign: 'left', fontSize: '2.25rem', margin: 0, letterSpacing: '-1px' }}>Biological Wellness Protocol</h1>
              <p style={{ color: 'var(--text-muted-site)', margin: '4px 0 0', fontSize: '1rem' }}>Prepared for <strong style={{ color: '#fff' }}>{answers.name}</strong></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Evaluation ID</p>
              <p style={{ margin: 0, fontWeight: '700', color: 'var(--primary)' }}>#{answers.id?.toUpperCase() || 'LOCAL-EVAL'}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Health Vitality Index Gauge and Explanation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem', background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            
            {/* Score Ring Display */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* SVG circular progress indicator */}
                <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="75" cy="75" r="65" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="75" 
                    cy="75" 
                    r="65" 
                    stroke={healthScore.color || 'var(--accent-green)'} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={408}
                    strokeDashoffset={408 - (408 * healthScore.score) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>{healthScore.score}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginTop: '2px' }}>Vitality Index</span>
                </div>
              </div>
              <div style={{
                background: healthScore.color || 'var(--accent-green)',
                color: '#000',
                fontWeight: '800',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                padding: '4px 16px',
                borderRadius: '50px',
                marginTop: '1.5rem',
                boxShadow: `0 0 15px ${healthScore.color}40`
              }}>
                Status: {healthScore.status}
              </div>
            </div>

            {/* Explanation Content */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#fff' }}>Biological Evaluation Summary</h3>
              <p style={{ color: 'var(--text-muted-site)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                Your index of <strong>{healthScore.score}</strong> indicates that your physiological systems are currently operating in the <strong>{healthScore.status.toLowerCase()}</strong> range. 
                Based on your goals to optimize <strong>{Array.isArray(answers.primaryGoal) ? answers.primaryGoal.join(' & ') : answers.primaryGoal}</strong> and your focus on <strong>{Array.isArray(answers.specificFocus) ? answers.specificFocus.join(', ') : answers.specificFocus}</strong>, we have formulated the custom supplement protocol detailed below to accelerate your adaptation toward the <strong>Peak</strong> vitality spectrum.
              </p>
            </div>
          </div>

          {/* Metric Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Biological Sex</span>
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{answers.gender || 'Not Specified'}</span>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Sleep Quality</span>
              <span style={{ display: 'block', fontSize: '1.0rem', fontWeight: '700', color: '#fff', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{answers.sleepQuality || 'Not Specified'}</span>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Daytime Energy</span>
              <span style={{ display: 'block', fontSize: '1.0rem', fontWeight: '700', color: '#fff', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {answers.tiredness ? answers.tiredness.split(',')[0] : 'Not Specified'}
              </span>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Primary Goal</span>
              <span style={{ display: 'block', fontSize: '1.0rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {Array.isArray(answers.primaryGoal) ? answers.primaryGoal[0] : (answers.primaryGoal || 'Longevity')}
              </span>
            </div>
          </div>

          {/* Supplement RoadMap Section */}
          <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} color="var(--secondary)" /> Authorized Supplement Protocol
          </h2>

          {products.map((prod, idx) => (
            <div key={idx} className="product-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <img 
                  src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} 
                  alt={prod.name} 
                  style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'contain', border: '1px solid var(--border-subtle)', background: '#fff', padding: '10px' }} 
                />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>{prod.name}</h3>
                    <span style={{
                      background: 'rgba(0, 229, 255, 0.1)',
                      color: 'var(--secondary)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '30px',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>High Affinity Match</span>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '0.95rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>{prod.description}</p>
                  {prod.bullets && (
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted-site)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {prod.bullets.map((b, i) => <li key={i} style={{ color: 'var(--text-muted-site)' }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid var(--secondary)', border: '1px solid var(--border-subtle)', borderLeftWidth: '4px', borderLeftColor: 'var(--secondary)' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Clinical Rationale:</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>
                  {prod.rationale || `Calibrated specifically to address your focus on ${Array.isArray(answers.specificFocus) ? answers.specificFocus.join(', ') : answers.specificFocus}. High-affinity bio-absorption to optimize daily ${Array.isArray(answers.primaryGoal) ? answers.primaryGoal[0] : answers.primaryGoal}.`}
                </p>
              </div>

              <a 
                href={prod.affiliateLink} 
                onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_results_dashboard' })}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  textDecoration: 'none', 
                  padding: '12px', 
                  borderRadius: '12px',
                  background: 'var(--secondary)',
                  color: '#000',
                  boxShadow: '0 8px 20px rgba(0, 229, 255, 0.15)'
                }}
              >
                Shop Now <ArrowRight size={18} />
              </a>
            </div>
          ))}

          {/* Complementary Recommendations */}
          {complementary.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '2px dashed var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main-site)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', textAlign: 'center' }}>
                Additional Calibrated Support
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                {complementary.map((prod, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img 
                        src={prod.image?.startsWith('http') ? prod.image : `${window.location.origin}${prod.image}`} 
                        alt={prod.name} 
                        style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'contain', marginBottom: '1rem', border: '1px solid var(--border-subtle)', background: '#fff', padding: '6px' }} 
                      />
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#fff' }}>{prod.name}</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-muted-site)', lineHeight: '1.4' }}>{prod.description}</p>
                    </div>
                    <a 
                      href={prod.affiliateLink} 
                      onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: prod.name, source: 'web_results_complementary' })}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-secondary"
                      style={{ textDecoration: 'none', width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: '700' }}
                    >
                      Shop Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Block */}
          <div style={{ marginTop: '4rem', padding: '2rem 0 0', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '1.25rem', alignItems: 'center', textAlign: 'left' }}>
            <img 
              src={`${window.location.origin}/Eterno Fit Logo Design.png`} 
              alt="EternoFit" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#000', objectFit: 'contain', border: '2px solid var(--border-subtle)' }} 
            />
            <div>
              <p style={{ margin: 0, fontWeight: '800', color: '#fff', fontSize: '1.1rem' }}>The EternoFit Team</p>
              <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.4' }}>Clinical Wellness & Performance<br/>Authorized Diagnostic Division</p>
            </div>
          </div>
        </div>

        {/* Dashboard Actions and Email Copy Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Email Dispatch Card */}
          <div className="glass-card" style={{ maxWidth: '100%', padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Email Secure Report</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Want to keep a copy in your primary inbox? Enter your email below to dispatch a fully compiled clinical report.
            </p>
            <form onSubmit={handleSendEmail} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
              />
              <button 
                type="submit" 
                disabled={isSending}
                className="btn-primary" 
                style={{ width: 'auto', padding: '10px 16px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
              >
                {isSending ? "Sending..." : "Send Report"}
              </button>
            </form>
            {sendStatus === 'success' && <p style={{ color: 'var(--accent-green)', fontSize: '0.8rem', marginTop: '8px', fontWeight: '600' }}>✓ Sent successfully! Check your inbox.</p>}
          </div>

          {/* Restart Assessment Card */}
          <div className="glass-card" style={{ maxWidth: '100%', padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Re-evaluate Biometrics</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Have your recovery markers or performance goals shifted? Retake the diagnostic evaluation to generate an updated protocol.
            </p>
            <button 
              className="btn-secondary" 
              onClick={onRestart}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: '700' }}
            >
              Restart Quiz Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GlobalNavbar = ({ navigateTo, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  const handleNavClick = (e, targetView) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
    navigateTo(targetView);
  };

  const handleToolClick = (e, toolKey) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
    setIsHovered(false);
    navigateTo(`tools?tool=${toolKey}`);
  };

  const handleScrollClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigateTo('home');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const toolsList = [
    { key: 'bmi', label: 'BMI Calculator', icon: <Activity size={16} /> },
    { key: 'testosterone', label: 'Testosterone Quiz', icon: <Flame size={16} /> },
    { key: 'realage', label: 'Real Age Calculator', icon: <Clock size={16} /> },
    { key: 'longevity', label: 'Longevity Score', icon: <Sparkles size={16} /> },
    { key: 'sleep', label: 'Sleep Analyzer', icon: <Moon size={16} /> },
    { key: 'meal', label: 'Meal Planner', icon: <Apple size={16} /> },
    { key: 'stress', label: 'Stress Checker', icon: <HeartPulse size={16} /> }
  ];

  return (
    <nav className="site-navbar">
      <div className="site-container">
        <div onClick={() => navigateTo('home')} className="site-logo" style={{ cursor: 'pointer' }}>
          <img src="/logo-dark-bg.png" alt="EternoFit Logo" className="site-brand-logo" />
        </div>
        <div className={`site-nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="/articles" onClick={(e) => handleNavClick(e, 'articles')} style={{ color: currentView === 'articles' ? 'var(--accent-green)' : 'inherit' }}>Articles</a>
          <a href="#education" onClick={(e) => handleScrollClick(e, 'education')}>Contents</a>
          <a href="/marketplace" onClick={(e) => handleNavClick(e, 'marketplace')} style={{ color: currentView === 'marketplace' ? 'var(--accent-green)' : 'inherit' }}>Marketplace</a>
          
          {/* Desktop Tools Dropdown */}
          <div 
            className="desktop-only-nav"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center' }}
          >
            <a 
              href="/tools" 
              onClick={(e) => handleNavClick(e, 'tools')} 
              style={{ 
                color: currentView === 'tools' ? 'var(--accent-green)' : 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '100%',
                cursor: 'pointer'
              }}
            >
              Tools <ChevronDown size={14} style={{ transform: isHovered ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }} />
            </a>
            {isHovered && (
              <div 
                style={{
                  position: 'absolute',
                  top: '75px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(15, 15, 15, 0.96)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: '220px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  zIndex: 1001
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '10px',
                  height: '10px',
                  background: 'rgba(15, 15, 15, 0.96)',
                  borderLeft: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }} />
                {toolsList.map(tool => (
                  <a
                    key={tool.key}
                    href={`/tools?tool=${tool.key}`}
                    onClick={(e) => handleToolClick(e, tool.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: 'var(--text-main-site)',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'var(--accent-green)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-main-site)';
                    }}
                  >
                    <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>
                      {tool.icon}
                    </span>
                    {tool.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Tools Accordion */}
          <div className="mobile-only-nav" style={{ width: '100%' }}>
            <div 
              onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '8px',
                color: currentView === 'tools' ? 'var(--accent-green)' : 'inherit',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem',
                width: '100%',
                padding: '4px 0'
              }}
            >
              <span>Tools</span>
              <ChevronDown size={16} style={{ transform: isMobileToolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
            </div>
            {isMobileToolsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                {toolsList.map(tool => (
                  <a
                    key={tool.key}
                    href={`/tools?tool=${tool.key}`}
                    onClick={(e) => handleToolClick(e, tool.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      color: 'var(--text-muted-site)',
                      textDecoration: 'none',
                      width: '100%'
                    }}
                  >
                    <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>{tool.icon}</span>
                    {tool.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => navigateTo('quiz')} className="site-btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Health Quiz</button>
        </div>
        <button className="site-mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

const Header = ({ navigateTo }) => (
  <header className="app-header">
    <div className="header-content">
      <div onClick={() => navigateTo('home')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '1.5rem' }}>
        <img src="/logo-dark-bg.png" alt="EternoFit Logo" className="app-logo" />

      </div>
    </div>
  </header>
);

const Footer = ({ navigateTo }) => (
  <footer className="site-footer">
    <div className="site-container">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <img src="/logo-dark-bg.png" alt="Logo" className="site-brand-logo" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigateTo('home')} />
          <p>Building elite health, fitness, and unbreakable mindsets through discipline and consistency.</p>
        </div>
        <div className="site-footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/articles" onClick={(e) => { e.preventDefault(); navigateTo('articles'); }}>Articles</a></li>
            <li><a href="#education" onClick={(e) => { e.preventDefault(); const el = document.getElementById('education'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else { navigateTo('home'); setTimeout(() => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' }), 100); } }}>Contents</a></li>
            <li><a href="/marketplace" onClick={(e) => { e.preventDefault(); navigateTo('marketplace'); }}>Marketplace</a></li>
            <li><a href="/tools" onClick={(e) => { e.preventDefault(); navigateTo('tools'); }}>Tools</a></li>
            <li><a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a></li>
            <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact Us</a></li>
          </ul>
        </div>
        <div className="site-footer-links">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy</a></li>
            <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms of Service</a></li>
            <li><a href="/affiliate" onClick={(e) => { e.preventDefault(); navigateTo('affiliate'); }}>Affiliate Disclosure</a></li>
          </ul>
        </div>
      </div>
      <div className="site-footer-bottom">
        <p className="site-disclaimer">
          <strong>Disclaimer:</strong> Always consult with a physician before starting any exercise or diet program. This site contains affiliate links; we may earn a commission from purchases made through these links.
        </p>
        <div className="site-social-links">
          <a href="https://www.facebook.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
          <a href="https://www.instagram.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
          <a href="https://www.youtube.com/@EternoFit" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
        </div>
      </div>
    </div>
  </footer>
);

const VideoEmbed = ({ videoId, title }) => (
  <div className="video-embed-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
    <iframe
      onLoad={() => trackEvent('video_watched', { title })}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

const HomePage = ({ navigateTo, globalProducts }) => {
  return (
    <div className="home-page-wrapper">
      <SEO />
      <GlobalNavbar navigateTo={navigateTo} currentView="home" />

      <section className="site-hero">
        <div className="site-hero-bg">
          <img src="/Heroimage.jpeg" alt="EternoFit Hero" />
        </div>
        <div className="site-container">
          <div className="site-hero-content">
            <h1 className="fade-in-up">Performance Through <br /> <span style={{ color: 'var(--accent-green)' }}>Science</span> <span className="text-outline">&amp; Precision</span></h1>
            <p className="site-subheadline fade-in-up" style={{ animationDelay: '0.2s' }}>
              We provide science-based health programs to help you optimize your well-being, improve fitness, and sharpen your mind.
            </p>
            <div className="site-optin-form fade-in-up" style={{ animationDelay: '0.3s', justifyContent: 'center', background: 'transparent', border: 'none', backdropFilter: 'none' }}>
              <button className="site-btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem' }} onClick={() => {
                trackEvent(`${window.userSource || 'organic'}_cta_clicked`);
                navigateTo('quiz');
              }}>
                Start Free Health Quiz <ChevronRight size={24} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="homepage-articles" className="site-section" style={{ background: 'var(--bg-surface)' }}>
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2>Latest <span style={{ color: 'var(--accent-green)' }}>Health Insights</span></h2>
            <p>Science-backed guides and expert strategies to optimize your daily wellbeing.</p>
          </div>
          <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {useMemo(() => {
              // Take 3 random articles to showcase on the homepage
              const shuffled = [...globalArticles].sort(() => 0.5 - Math.random());
              return shuffled.slice(0, 3);
            }, []).map((art, i) => (
              <div 
                key={art.id} 
                className="site-product-card fade-in-up" 
                style={{ animationDelay: `${0.1 * i}s`, cursor: 'pointer' }}
                onClick={() => navigateTo(`article/${art.id}`)}
              >
                {art.image && (
                  <div className="site-article-img-wrapper">
                    <img src={art.image} alt={art.title} />
                  </div>
                )}
                <div className="site-product-info" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.5rem' }}>{art.category}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{art.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-site)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem', flexGrow: 1 }}>{art.metaDesc}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '600' }}>
                    <span>{art.date ? `${art.date} • ` : ''}{art.readTime}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Read Article <ArrowRight size={14} /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' }} className="fade-in-up">
            <button 
              onClick={() => navigateTo('articles')} 
              className="site-btn-secondary" 
              style={{ padding: '1rem 2.5rem', border: '2px solid var(--accent-green)' }}
            >
              View All Articles <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>

      <section id="education" className="site-section">
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2><span style={{ color: 'var(--accent-green)' }}>Educational</span> Contents</h2>
            <p>Science-backed insights for professional-grade performance.</p>
          </div>
          <div className="site-video-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="fade-in-up">
              <VideoEmbed videoId="Doev0iBuG-M" title="Clinical Protocol 01" />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
              <VideoEmbed videoId="Q2k0I_wWrN8" title="Clinical Protocol 02" />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
              <VideoEmbed videoId="Qt6U3uha3sE" title="Clinical Protocol 03" />
            </div>
          </div>
        </div>
      </section>

      <section id="fuel" className="site-section">
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2><span style={{ color: 'var(--accent-green)' }}>Marketplace</span> Recommendations</h2>
            <p>Premium-grade tools and nutrients to support elite performance and results.</p>
          </div>
          <div className="site-product-grid">
            {useMemo(() => {
              const products = globalProducts && globalProducts.length > 0 ? globalProducts.filter(p => p.category !== 'General Health') : [
                { name: 'Micronized Creatine Monohydrate', price: '$34.99', desc: 'Pharmaceutical-grade ATP support for power output and cognitive function.', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=10', affiliateLink: '#' },
                { name: 'Magnesium Glycinate Complex', price: '$24.99', desc: 'High-bioavailability recovery support for central nervous system regulation.', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=11', affiliateLink: '#' },
                { name: 'Vitamin D3 + K2 (Liposomal)', price: '$39.99', desc: 'Clinical-strength immune and hormonal support for year-round performance.', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=12', affiliateLink: '#' }
              ];
              return [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
            }, [globalProducts]).map((p, i) => (
              <div key={i} className="site-product-card fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                <div className="site-product-img">
                  <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+10}`} alt={p.name} />
                </div>
                <div className="site-product-info">
                  <h3>{p.name}</h3>
                  <p>{p.desc || p.description}</p>
                  <div className="site-product-footer">
                    <span className="price">{p.price}</span>
                    <a 
                      href={p.affiliateLink || '#'} 
                      onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: p.name })}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="site-btn-secondary" 
                      style={{ textDecoration: 'none' }}
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' }} className="fade-in-up">
            <button 
              onClick={() => navigateTo('marketplace')} 
              className="site-btn-secondary" 
              style={{ padding: '1rem 2.5rem', border: '2px solid var(--accent-green)' }}
            >
              View Full Marketplace <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>

      <section id="tools" className="site-section site-methodology">
        <div className="site-container">
          <div className="site-section-header fade-in-up">
            <h2>
              Health <span style={{ color: 'var(--accent-green)' }}>Optimization Tools</span>
              <span style={{
                fontSize: '0.7rem',
                background: 'rgba(0, 230, 118, 0.1)',
                color: 'var(--accent-green)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                padding: '4px 12px',
                borderRadius: '50px',
                textTransform: 'uppercase',
                fontWeight: '700',
                letterSpacing: '1px',
                marginLeft: '15px',
                verticalAlign: 'middle',
                display: 'inline-block',
                boxShadow: '0 0 15px rgba(0, 230, 118, 0.1)'
              }}>Beta Live</span>
            </h2>
            <p>Interactive bio-calculators and metric trackers designed for longevity.</p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div className="site-step-grid" style={{ filter: 'blur(3px)', opacity: 0.3, pointerEvents: 'none' }}>
              <div className="site-step-card fade-in-up">
                <div className="site-step-icon"><Zap size={32} /></div>
                <h3>1. Targeted Training</h3>
                <p>Intensity management designed to stimulate metabolic adaptation and improve cardiovascular health.</p>
              </div>
              <div className="site-step-card fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="site-step-icon"><Apple size={32} /></div>
                <h3>2. Smart Nutrition</h3>
                <p>Nutrition management focused on balance, glycemic control, and high-quality supplementation.</p>
              </div>
              <div className="site-step-card fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="site-step-icon"><Brain size={32} /></div>
                <h3>3. Mental Strength</h3>
                <p>Building resilience through discipline and focus strategies that support long-term health.</p>
              </div>
            </div>

            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10, 10, 10, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              zIndex: 5
            }} className="fade-in-up">
              <div style={{
                width: '70px',
                height: '70px',
                background: 'rgba(0, 230, 118, 0.1)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'var(--accent-green)',
                boxShadow: '0 0 30px rgba(0, 230, 118, 0.25)',
                animation: 'pulse 2s infinite ease-in-out'
              }}>
                <Sliders size={32} />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px' }}>
                Free <span style={{ color: 'var(--accent-green)' }}>Optimization Dashboards</span>
              </h3>
              <p style={{ maxWidth: '600px', fontSize: '1.05rem', color: 'var(--text-muted-site)', lineHeight: '1.6', marginBottom: '2rem' }}>
                Use our interactive biometrics calculators, testosterone vitality index, biological age metrics, and personalized meal/sleep builders to optimize your longevity.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-green)',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  background: 'rgba(0, 230, 118, 0.08)',
                  border: '1px solid rgba(0, 230, 118, 0.2)'
                }}>Beta Active</span>
                <button 
                  onClick={() => navigateTo('tools')}
                  className="site-btn-primary" 
                  style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                >
                  Launch Diagnostic Tools <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-container">
          <div className="site-footer-grid">
            <div className="site-footer-brand">
              <img src="/logo-dark-bg.png" alt="Logo" className="site-brand-logo" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigateTo('home')} />
              <p>Building elite health, fitness, and unbreakable mindsets through discipline and consistency.</p>
            </div>
            <div className="site-footer-links">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#homepage-articles" onClick={(e) => { e.preventDefault(); document.getElementById('homepage-articles').scrollIntoView({ behavior: 'smooth' }); }}>Articles</a></li>
                <li><a href="#education" onClick={(e) => { e.preventDefault(); document.getElementById('education').scrollIntoView({ behavior: 'smooth' }); }}>Contents</a></li>
                <li><a href="/marketplace" onClick={(e) => { e.preventDefault(); navigateTo('marketplace'); }}>Marketplace</a></li>
                <li><a href="/tools" onClick={(e) => { e.preventDefault(); navigateTo('tools'); }}>Tools</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a></li>
                <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact Us</a></li>
              </ul>
            </div>
            <div className="site-footer-links">
              <h4>Diagnostic Tools</h4>
              <ul>
                <li><a href="/tools?tool=testosterone" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=testosterone'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Testosterone Quiz</a></li>
                <li><a href="/tools?tool=bmi" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=bmi'); window.dispatchEvent(new PopStateEvent('popstate')); }}>BMI & Body Fat Calculator</a></li>
                <li><a href="/tools?tool=realage" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=realage'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Biological Age Calculator</a></li>
                <li><a href="/tools?tool=sleep" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=sleep'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Sleep & Circadian Analyzer</a></li>
                <li><a href="/tools?tool=longevity" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=longevity'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Healthspan Scorecard</a></li>
                <li><a href="/tools?tool=meal" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=meal'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Meal Plan Builder</a></li>
                <li><a href="/tools?tool=stress" onClick={(e) => { e.preventDefault(); navigateTo('tools'); window.history.pushState({}, '', '/tools?tool=stress'); window.dispatchEvent(new PopStateEvent('popstate')); }}>ANS Adrenal Checker</a></li>
              </ul>
            </div>
            <div className="site-footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms of Service</a></li>
                <li><a href="/affiliate" onClick={(e) => { e.preventDefault(); navigateTo('affiliate'); }}>Affiliate Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="site-footer-bottom">
            <p className="site-disclaimer">
              <strong>Disclaimer:</strong> Always consult with a physician before starting any exercise or diet program. This site contains affiliate links; we may earn a commission from purchases made through these links.
            </p>
            <div className="site-social-links">
              <a href="https://www.facebook.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/eternofitforlife" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
              <a href="https://www.youtube.com/@EternoFit" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AffiliateDisclosure = ({ navigateTo }) => (
  <div className="site-container" style={{ padding: '120px 24px', color: 'var(--text-main-site)' }}>
    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Affiliate Disclosure</h1>
    <div style={{ opacity: 0.8, lineHeight: '1.8' }}>
      <p style={{ marginBottom: '1.5rem' }}>
        In compliance with the FTC guidelines, please assume that any and all links on this website are affiliate links of which EternoFit receives a small commission from sales of certain items.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        <strong>What is an Affiliate Link?</strong><br/>
        When you click an affiliate link and purchase an item, the seller pays us a small commission or other compensation for promoting their website or products through their affiliate program. Prices are exactly the same for you if your purchase is through an affiliate link or a non-affiliate link.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        <strong>Why do we use them?</strong><br/>
        These commissions help us maintain the website and continue providing high-quality health and fitness content for free. We only recommend products we truly believe in and that align with the EternoFit philosophy of health and performance.
      </p>
      <button className="site-btn-secondary" onClick={() => navigateTo('home')}>Back to Home</button>
    </div>
  </div>
);

const CompletionScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="glass-card fade-enter" style={{ textAlign: 'center', padding: '5rem 2rem', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="bg-glow"></div>
      <div className="fade-enter">
        <div className="icon-circle" style={{ margin: '0 auto 2.5rem', width: '100px', height: '100px', background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)', animation: 'pulse 2s infinite ease-in-out' }}>
          <Activity size={48} color="var(--accent-green)" />
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Analysing Your Answers...</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
            Finding the best products based on your health profile.
          </p>
        </div>
      </div>
    </div>
  );
};

const ClickRedirectHandler = ({ globalProducts }) => {
  const [statusText, setStatusText] = useState('Verifying attribution securely...');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const executeRedirect = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let dest = urlParams.get('dest');
        const email = urlParams.get('email') || 'cold_lead@eternofit.com';
        const product = urlParams.get('product') || 'Wellness product';
        const campaign = urlParams.get('campaign') || 'Marketing Newsletter';

        if (!dest) {
          const foundProd = globalProducts.find(p => p.name.toLowerCase() === product.toLowerCase());
          if (foundProd && foundProd.affiliateLink) {
            dest = foundProd.affiliateLink;
          } else {
            dest = window.location.origin;
          }
        }

        setStatusText(`Applying exclusive clinical discount for ${product}...`);

        // Track the click event
        await trackEvent('email_affiliate_clicked', {
          recipient: email,
          product: product,
          campaign: campaign,
          destination: dest
        });

        setStatusText('Discount verified. Redirecting...');
        
        setTimeout(() => {
          window.location.href = dest;
        }, 1200);

      } catch (err) {
        console.error("Redirection attribution tracking error:", err);
        setErrorText("Verification link timeout. Transferring to clinical home...");
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    };

    executeRedirect();
  }, [globalProducts]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#090d16',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: '#fff',
      padding: '20px',
      zIndex: 10000
    }}>
      <style>{`
        @keyframes indeterminateProgressBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rotateDashedRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="glass-card fade-enter" style={{
        maxWidth: '450px',
        padding: '3rem',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 255, 102, 0.05)'
      }}>
        <div style={{ 
          margin: '0 auto 2rem',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'rgba(0, 255, 102, 0.05)',
          border: '2px dashed var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'rotateDashedRing 4s linear infinite'
        }}>
          <Globe size={30} color="var(--primary)" style={{ animation: 'pulse 1.8s ease-in-out infinite' }} />
        </div>

        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
          EternoFit Wellness
        </h3>

        {errorText ? (
          <p style={{ color: '#ef4444', fontSize: '0.95rem', margin: 0 }}>
            {errorText}
          </p>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
              {statusText}
            </p>
            <div style={{
              width: '120px',
              height: '4px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              margin: '0 auto',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60px',
                height: '100%',
                background: 'var(--primary)',
                borderRadius: '2px',
                animation: 'indeterminateProgressBar 1.5s infinite ease-in-out'
              }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function App() {
  const [view, setView] = useState('home');
  const [answers, setAnswers] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('email'); // 'email' | 'instant'
  const { products: globalProducts, loading: productsLoading, reloadProducts } = useProducts();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "quizConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().deliveryMode) {
          setDeliveryMode(docSnap.data().deliveryMode);
        }
      } catch (e) {
        console.warn("Failed to fetch delivery mode from Firestore, using 'email'.", e);
        const localMode = localStorage.getItem('quiz_delivery_mode');
        if (localMode) setDeliveryMode(localMode);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleDeliveryMode = async (newMode) => {
    setDeliveryMode(newMode);
    localStorage.setItem('quiz_delivery_mode', newMode);
    try {
      const docRef = doc(db, "settings", "quizConfig");
      await setDoc(docRef, { deliveryMode: newMode }, { merge: true });
    } catch (e) {
      console.error("Failed to update quiz settings in Firebase:", e);
    }
  };

  const transitionTo = (newView, msg = '') => {
    if (msg) {
      setIsProcessing(true);
      setProcessingMsg(msg);
      setTimeout(() => {
        window.history.pushState({}, '', `/${newView}`);
        setView(newView);
        setIsProcessing(false);
      }, 1200);
    } else {
      window.history.pushState({}, '', `/${newView}`);
      setView(newView);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const rawPath = window.location.pathname.substring(1);
      const path = rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const fbclid = urlParams.get('fbclid');
      
      const source = (utmSource === 'meta' || fbclid || urlParams.get('ref') === 'ad') ? 'meta' : 'organic';
      window.userSource = source; // Global for easy access in events
      if (!window.sessionTracked) {
        trackEvent(`view_${source}`);
        window.sessionTracked = true;
      }
      
      if (path === 'admin') setView('admin');
      else if (path === 'click') setView('click');
      else if (path.startsWith('email-template')) setView('emailTemplate');
      else if (path === 'terms') setView('terms');
      else if (path === 'privacy') setView('privacy');
      else if (path === 'affiliate') setView('affiliate');
      else if (path === 'about') setView('about');
      else if (path === 'contact' || path === 'support') setView('contact');
      else if (path === 'unsubscribe') setView('unsubscribe');
      else if (path === 'articles') setView('articles');
      else if (path.startsWith('article/')) { setView('article'); window.articleSlug = path.split('/')[1]; }
      else if (path === 'quiz') setView('landing');
      else if (path === 'marketplace' || path === 'products') setView('marketplace');
      else if (path.startsWith('product/')) { setView('digitalProduct'); window.productSlug = path.split('/')[1]; }
      else if (path === 'tools') setView('tools');
      else if (path === '' || path === 'home') setView('home');
    };
    handlePopState();
    window.addEventListener('popstate', handlePopState);
    
    // Also handle initial load with hash just in case of old links
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      window.history.replaceState({}, '', `/${hash}`);
      handlePopState();
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleEmailSubmit = async (name, email) => {
    const updatedAnswers = { ...answers, name };
    const recs = getFilteredProducts(updatedAnswers, globalProducts);
    const fullData = {
      answers: updatedAnswers,
      email,
      recommendations: recs.map(r => r.name),
      status: deliveryMode === 'instant' ? 'InstantView' : 'Captured',
      timestamp: new Date().toISOString(),
      ip: 'Fetching...'
    };

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      fullData.ip = data.ip;
    } catch (e) {
      fullData.ip = 'Unavailable';
    }

    try {
      const docRef = await addDoc(collection(db, "submissions"), fullData);
      setAnswers({ ...updatedAnswers, email, id: docRef.id, emailSent: deliveryMode === 'email' });
      fullData.id = docRef.id;
      trackEvent(`${window.userSource || 'organic'}_email_submitted`);
      trackQuizSession('email_submitted', 8, 'completed', 8, true, { name, email });
    } catch (e) {
      console.warn("Firebase add failed, saving to local storage.", e);
      fullData.id = Math.random().toString(36).substr(2, 9);
      const currentSubmissions = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
      currentSubmissions.push(fullData);
      localStorage.setItem('quiz_submissions', JSON.stringify(currentSubmissions));
      setAnswers({ ...updatedAnswers, email, id: fullData.id, emailSent: deliveryMode === 'email' });
    }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (deliveryMode === 'email' && !isLocalhost) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: `Your EternoFit Health Summary - ${name}`,
            htmlName: name,
            reportUrl: `${window.location.origin}/email-template?id=${fullData.id}`,
            products: recs,
            complementary: getAdditionalRecommendations(updatedAnswers, recs.map(r => r.name), globalProducts),
            answers: { ...updatedAnswers, id: fullData.id },
            healthScore: calculateHealthScore(updatedAnswers)
          })
        }).catch(e => console.warn('Auto send fetch failed', e));
      } catch (e) {
        console.warn('Auto send setup failed', e);
      }
    }

    transitionTo('results');
  };

  if (productsLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark-site)', textAlign: 'center', padding: '2rem' }}>
        <div className="icon-circle" style={{ width: '80px', height: '80px', marginBottom: '2rem', animation: 'pulse 2s infinite ease-in-out' }}>
          <Activity size={40} color="var(--accent-green)" />
        </div>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main-site)', marginBottom: '1rem' }}>Loading...</h3>
        <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: 'var(--accent-green)', animation: 'progress 1.5s infinite linear', transformOrigin: 'left' }} />
        </div>
      </div>
    );
  }

  const navigateTo = (path) => {
    window.history.pushState({}, '', `/${path}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Use the new homepage for 'home' view
  if (view === 'home') return <HomePage navigateTo={navigateTo} globalProducts={globalProducts} />;

  return (
    <div className="app-container quiz-light" style={{ position: 'relative' }}>
      {/* Persistent quiz background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url(/Quizscreen.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1, zIndex: -1, pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0.6))', zIndex: -1, pointerEvents: 'none' }}></div>
      {isProcessing && <LoadingOverlay message={processingMsg} />}
      {['landing', 'quiz', 'completion', 'email'].includes(view) ? (
        <Header navigateTo={navigateTo} />
      ) : (
        <GlobalNavbar navigateTo={navigateTo} currentView={view} />
      )}
      <main className="main-content">
        {view === 'landing' && <LandingPage onStart={() => {
          trackEvent(`${window.userSource || 'organic'}_quiz_started`);
          setView('quiz');
        }} />}
        {view === 'quiz' && <Quiz onComplete={(ans) => { 
          setAnswers(ans); 
          trackEvent(`${window.userSource || 'organic'}_quiz_completed`);
          setView('completion'); 
        }} />}
        {view === 'completion' && <CompletionScreen onFinish={() => setView('email')} />}
        {view === 'email' && <EmailCollection onSubmit={handleEmailSubmit} deliveryMode={deliveryMode} />}
        {view === 'results' && <Results answers={answers} onRestart={() => navigateTo('home')} globalProducts={globalProducts} deliveryMode={deliveryMode} />}
        {view === 'admin' && <AdminPanel onBack={() => navigateTo('home')} globalProducts={globalProducts} reloadProducts={reloadProducts} deliveryMode={deliveryMode} onToggleDeliveryMode={handleToggleDeliveryMode} />}
        {view === 'marketplace' && <Marketplace globalProducts={globalProducts} navigateTo={navigateTo} />}
        {view === 'digitalProduct' && <DigitalProductPage slug={window.productSlug} globalProducts={globalProducts} navigateTo={navigateTo} />}
        {view === 'emailTemplate' && <VisualEmailTemplate globalProducts={globalProducts} />}
        {view === 'terms' && <TermsOfService />}
        {view === 'privacy' && <PrivacyPolicy />}
        {view === 'affiliate' && <AffiliateDisclosure navigateTo={navigateTo} />}
        {view === 'about' && <AboutUs />}
        {view === 'contact' && <ContactUs />}
        {view === 'articles' && <Articles navigateTo={navigateTo} globalProducts={globalProducts} />}
        {view === 'article' && <Articles navigateTo={navigateTo} initialSlug={window.articleSlug} globalProducts={globalProducts} />}
        {view === 'support' && <ClinicalSupport />}
        {view === 'unsubscribe' && <Unsubscribe />}
        {view === 'tools' && <ToolsPage navigateTo={navigateTo} globalProducts={globalProducts} />}
        {view === 'click' && <ClickRedirectHandler globalProducts={globalProducts} />}
      </main>
      <Footer navigateTo={navigateTo} />
    </div>
  );
}

export default App;
```

## File: `src\Articles.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock, User, ChevronRight, BookOpen } from 'lucide-react';
import { articles } from './data/articles';
import SEO from './components/SEO';

export const Articles = ({ navigateTo, initialSlug, globalProducts }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, []);

  useEffect(() => {
    if (initialSlug) {
      const found = articles.find(a => a.id === initialSlug);
      if (found) setSelectedArticle(found);
    } else {
      setSelectedArticle(null);
    }
  }, [initialSlug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    // Deterministic related articles based on index to avoid layout shift re-renders
    const currentIndex = articles.findIndex(a => a.id === selectedArticle.id);
    return [
      articles[(currentIndex + 1) % articles.length],
      articles[(currentIndex + 2) % articles.length]
    ];
  }, [selectedArticle]);

  const recommendedProducts = useMemo(() => {
    if (!globalProducts || globalProducts.length === 0) return [];
    return [...globalProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [globalProducts]);

  const handleOpenArticle = (article) => {
    window.history.pushState({}, '', `/article/${article.id}`);
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/articles');
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(a => activeCategory === 'All' || a.category === activeCategory);
  }, [activeCategory]);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  if (selectedArticle) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": selectedArticle.title,
      "image": [
        `https://eternofit.com${selectedArticle.image}`
      ],
      "datePublished": selectedArticle.date || new Date().toISOString(),
      "author": [{
          "@type": "Organization",
          "name": "EternoFit Health Team",
          "url": "https://eternofit.com"
      }]
    };

    return (
      <div className="site-container" style={{ padding: '120px 24px 60px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main-site)' }}>
        <SEO 
          title={`${selectedArticle.title} | EternoFit`} 
          description={selectedArticle.metaDesc} 
          image={`https://eternofit.com${selectedArticle.image}`}
          url={`https://eternofit.com/article/${selectedArticle.id}`}
          schema={articleSchema}
        />
        <button 
          onClick={handleBack}
          className="btn-secondary"
          style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-subtle)' }}
        >
          <ArrowLeft size={18} /> Back to Articles
        </button>
        
        <article className="glass-card fade-enter" style={{ padding: '3rem 2rem' }}>
          <h1 className="title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.2' }}>
            {selectedArticle.title}
          </h1>
          
          {selectedArticle.image && (
            <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '2.5rem', border: '1px solid var(--border-subtle)' }}>
              <img src={selectedArticle.image} alt={selectedArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', color: 'var(--text-muted-site)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> EternoFit Health Team
            </div>
            {selectedArticle.date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedArticle.date}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> {selectedArticle.readTime}
            </div>
          </div>
          
          <div 
            className="article-content"
            style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-main-site)' }}
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />

          {selectedArticle.authorBio && (
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={30} color="var(--accent-green)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-main-site)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>About the Author: {selectedArticle.author || 'EternoFit Clinical Team'}</h4>
                <p style={{ color: 'var(--text-muted-site)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                  {selectedArticle.authorBio}
                </p>
              </div>
            </div>
          )}

          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-main-site)', marginBottom: '1rem', fontSize: '1.2rem' }}>Ready to optimize your health?</h4>
            <p style={{ color: 'var(--text-muted-site)', marginBottom: '1.5rem' }}>
              Take our comprehensive health assessment to get a personalized breakdown of exactly what your body needs to perform at its peak.
            </p>
            <button className="btn-primary" onClick={() => navigateTo('quiz')} style={{ width: '100%' }}>
              Start Free Assessment <ChevronRight size={18} className="inline ml-2" />
            </button>
          </div>

          {recommendedProducts.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ color: 'var(--text-main-site)', marginBottom: '2rem', fontSize: '1.5rem' }}>Recommended Supplements</h3>
              <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {recommendedProducts.map((p, i) => (
                  <div key={i} className="site-product-card fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                    <div className="site-product-img">
                      <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+10}`} alt={p.name} />
                    </div>
                    <div className="site-product-info">
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{p.name}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-site)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem', flexGrow: 1 }}>{p.desc || p.description}</p>
                      <div className="site-product-footer" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="price" style={{ color: 'var(--accent-green)', fontSize: '1.1rem', fontWeight: 'bold' }}>{p.price}</span>
                        <a 
                          href={p.affiliateLink || '#'} 
                          onClick={() => window.trackEvent && window.trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: p.name })}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="site-btn-secondary" 
                          style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s ease' }}
                        >
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedArticles.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ color: 'var(--text-main-site)', marginBottom: '2rem', fontSize: '1.5rem' }}>Related Topics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {relatedArticles.map((article) => (
                  <div 
                    key={article.id} 
                    className="glass-card" 
                    style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
                    onClick={() => handleOpenArticle(article)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-green)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {article.image && (
                      <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main-site)', lineHeight: '1.3' }}>
                      {article.title}
                    </h4>
                    <div style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '600', marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                      Read Article <ChevronRight size={14} style={{ marginLeft: '4px' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="site-container" style={{ padding: '120px 24px 80px' }}>
      <SEO 
        title="Clinical Health Insights & Articles | EternoFit" 
        description="Science-backed articles, guides, and performance strategies to help you optimize your health and build biological resilience." 
        url="https://eternofit.com/articles" 
      />
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="icon-circle" style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)' }}>
          <BookOpen size={32} color="var(--accent-green)" />
        </div>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Health Insights</h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Science-backed articles, guides, and performance strategies to help you optimize your health and build biological resilience.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="btn-secondary fade-in-up"
            style={{ 
              padding: '0.5rem 1.25rem', 
              borderRadius: '999px',
              fontSize: '0.9rem',
              border: activeCategory === cat ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
              background: activeCategory === cat ? 'var(--accent-green-dim)' : 'transparent',
              color: activeCategory === cat ? 'var(--accent-green)' : 'var(--text-muted-site)',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {paginatedArticles.map((article, idx) => (
          <div 
            key={article.id} 
            className="glass-card fade-in-up" 
            style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', animationDelay: `${idx * 0.05}s` }}
            onClick={() => handleOpenArticle(article)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'var(--accent-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            {article.image && (
              <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-main-site)', lineHeight: '1.3' }}>
              {article.title}
            </h3>
            <p style={{ color: 'var(--text-muted-site)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {article.metaDesc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: '600', marginTop: 'auto' }}>
              <span>{article.date ? `${article.date} • ` : ''}{article.readTime}</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>Read Article <ChevronRight size={16} style={{ marginLeft: '4px' }}/></span>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem', 
          marginTop: '3.5rem',
          background: 'rgba(255,255,255,0.02)',
          padding: '0.75rem 1.5rem',
          borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.05)',
          width: 'fit-content',
          margin: '3.5rem auto 0',
          backdropFilter: 'blur(10px)'
        }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(prev => Math.max(1, prev - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-secondary"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              background: 'transparent',
              border: '1px solid var(--border-subtle)'
            }}
          >
            Previous
          </button>
          <span style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem' }}>
            Page <strong style={{ color: '#ffffff' }}>{currentPage}</strong> of <strong style={{ color: '#ffffff' }}>{totalPages}</strong>
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-secondary"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              background: 'transparent',
              border: '1px solid var(--border-subtle)'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
```

## File: `src\ConversionsAdmin.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { TrendingUp, Users, MousePointer2, ClipboardCheck, Mail, ShoppingCart, Calendar, Eye, Globe, Facebook, RefreshCcw, Search, X, MapPin } from 'lucide-react';

const ConversionsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    // Fetch last 500 events to build visitor journeys
    const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(500));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setEvents(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const visitorJourneys = useMemo(() => {
    const journeys = {};
    
    events.forEach(event => {
      const sid = event.sessionId || event.ip || 'unknown';
      if (!journeys[sid]) {
        journeys[sid] = {
          sid,
          ip: event.ip || 'Unknown',
          location: event.location || 'Unknown',
          source: event.source || 'organic',
          startTime: event.timestamp,
          events: [],
          quizStarted: false,
          quizCompleted: false,
          emailSent: false
        };
      }
      
      journeys[sid].events.push(event);
      if (event.event && (event.event === 'quiz_started' || event.event.endsWith('_quiz_started'))) journeys[sid].quizStarted = true;
      if (event.event && (event.event === 'email_submitted' || event.event.endsWith('_email_submitted') || event.event.endsWith('_quiz_completed'))) journeys[sid].quizCompleted = true;
      if (event.event && (event.event === 'email_sent' || event.event.endsWith('_email_sent'))) journeys[sid].emailSent = true;
      
      // Update startTime to be the earliest timestamp
      if (event.timestamp < journeys[sid].startTime) {
        journeys[sid].startTime = event.timestamp;
      }
    });

    return Object.values(journeys).sort((a, b) => b.startTime - a.startTime);
  }, [events]);

  const filteredJourneys = visitorJourneys.filter(j => 
    j.ip.includes(searchTerm) || 
    j.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedJourneys = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJourneys.slice(start, start + pageSize);
  }, [filteredJourneys, currentPage, pageSize]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Analyzing visitor datasets...</div>;

  const totalPages = Math.ceil(filteredJourneys.length / pageSize);

  return (
    <div className="conversions-admin fade-enter">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search by IP, Location, or Source..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
          {filteredJourneys.length} Visitors Detected
        </div>
      </div>

      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--primary)" /> Real-Time Website Visitor Logs
          </h3>
          <button 
            onClick={async () => {
              if (window.confirm("Permanently clear all visitor logs?")) {
                const snapshot = await getDocs(collection(db, 'analytics_events'));
                await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
                alert("Logs cleared.");
              }
            }}
            className="btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid #ef4444', color: '#ef4444' }}
          >
            Clear All Logs
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>IP Address</th>
              <th>Location</th>
              <th style={{ textAlign: 'center' }}>Quiz Started</th>
              <th style={{ textAlign: 'center' }}>Email Input</th>
              <th style={{ textAlign: 'center' }}>Email Sent</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJourneys.map((j, i) => (
              <tr key={j.sid || i}>
                <td style={{ fontSize: '0.85rem' }}>{j.startTime.toLocaleString()}</td>
                <td style={{ fontWeight: '600', fontFamily: 'monospace' }}>{j.ip}</td>
                <td style={{ fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="var(--accent-green)" /> {j.location}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: j.quizStarted ? 'var(--accent-green)' : '#666' }}>
                    {j.quizStarted ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: j.quizCompleted ? 'var(--accent-green)' : '#666' }}>
                    {j.quizCompleted ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: j.emailSent ? 'var(--accent-green)' : '#666' }}>
                    {j.emailSent ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: j.source === 'meta' ? 'rgba(24, 119, 242, 0.1)' : 'rgba(0, 255, 102, 0.1)',
                    color: j.source === 'meta' ? '#1877F2' : 'var(--accent-green)',
                    textTransform: 'uppercase'
                  }}>
                    {j.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
            <span>Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', outline: 'none' }}
            >
              <option value={20}>20</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
            <span style={{ marginLeft: '1rem' }}>
              Showing {filteredJourneys.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredJourneys.length)} of {filteredJourneys.length} entries
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              disabled={currentPage >= totalPages} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage >= totalPages ? 0.4 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionsAdmin;
```

## File: `src\DigitalProductPage.jsx`

```jsx
import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, Star, CheckCircle2, Shield, Download, ChevronRight, Activity } from 'lucide-react';
import { trackEvent } from './analytics';
import SEO from './components/SEO';

const DigitalProductPage = ({ slug, globalProducts, navigateTo }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const product = useMemo(() => {
    if (!globalProducts) return null;
    return globalProducts.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug);
  }, [globalProducts, slug]);

  if (!globalProducts || globalProducts.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark-site)' }}>
        <Activity size={40} color="var(--accent-green)" style={{ animation: 'pulse 2s infinite ease-in-out' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark-site)', color: 'white' }}>
        <h2>Product Not Found</h2>
        <button className="btn-secondary" onClick={() => navigateTo('marketplace')} style={{ marginTop: '1rem' }}>Return to Marketplace</button>
      </div>
    );
  }

  const isLemonSqueezy = product.affiliateLink?.includes('lemonsqueezy.com');

  const handleBuyClick = () => {
    trackEvent(`${window.userSource || 'organic'}_digital_product_checkout`, { product: product.name });
  };

  return (
    <div className="digital-product-page" style={{ background: 'var(--bg-dark-site)', minHeight: '100vh', padding: '100px 0 60px', color: 'var(--text-main-site)' }}>
      <SEO 
        title={`${product.name} | EternoFit Digital Access`}
        description={product.description || product.rationale}
        url={`https://eternofit.com/product/${slug}`}
      />
      
      <div className="site-container">
        {/* Back navigation */}
        <button 
          onClick={() => navigateTo('marketplace')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start', marginBottom: '5rem' }}>
          
          {/* Photo Section */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} color="var(--accent-green)" /> Instant Delivery
            </div>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
            ) : (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                <Shield size={64} />
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-green)', background: 'rgba(0, 255, 102, 0.1)', padding: '4px 12px', borderRadius: '50px' }}>
                {product.category}
              </span>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1', marginBottom: '1rem', color: '#fff' }}>
              {product.name}
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted-site)', lineHeight: '1.6', marginBottom: '2rem' }}>
              {product.description}
            </p>

            {product.bullets && product.bullets.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {product.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.5' }}>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <a 
              href={product.affiliateLink || '#'} 
              onClick={handleBuyClick}
              target={isLemonSqueezy ? undefined : "_blank"} 
              rel={isLemonSqueezy ? undefined : "noopener noreferrer"} 
              className={`site-btn-primary ${isLemonSqueezy ? 'lemonsqueezy-button' : ''}`} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textDecoration: 'none', padding: '16px 32px', fontSize: '1.1rem', width: '100%' }}
            >
              Get Instant Access <ChevronRight size={20} />
            </a>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', color: 'var(--text-muted-site)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={14} /> Secure Checkout</span>
              <span>•</span>
              <span>One-Time Payment</span>
            </div>
          </div>
        </div>

        {/* Real User Reviews Section */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Clinical Performance Results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "The structural clarity this provided for my daily routines is unmatched. It feels less like a generic guide and more like a prescribed clinical protocol."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '700' }}>MR</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Marcus R.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Verified Buyer</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "I've tried multiple tracking systems, but this one completely overhauled how I manage my supplementation and training metrics. Phenomenal."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '700' }}>JL</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>James L.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Verified Buyer</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "Immediate delivery and the quality is incredibly high. Exactly the kind of evidence-based approach I expect from EternoFit."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '700' }}>EK</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Evan K.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Verified Buyer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalProductPage;
```

## File: `src\EmailMarketingAdmin.jsx`

```jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from './firebase';
import { 
  collection, query, orderBy, onSnapshot, getDocs, addDoc, updateDoc, doc, where, serverTimestamp, deleteDoc, arrayUnion 
} from 'firebase/firestore';
import { 
  Mail, Send, History, BarChart3, Users, CheckCircle2, AlertCircle, Trash2, 
  Play, Pause, Square, UserPlus, ChevronRight, ChevronLeft, Plus, Search, X, Globe, 
  RefreshCcw, FileText, Check, Settings, Clock, ArrowRight, MousePointerClick, 
  ExternalLink, Eye, AlertTriangle, Calendar
} from 'lucide-react';
import { trackEvent } from './analytics';

const EmailMarketingAdmin = ({ globalProducts = [] }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const savedCampaigns = campaigns.filter(c => c.isPaused);
  const historyCampaigns = campaigns.filter(c => !c.isPaused);
    const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('compose'); // compose | import | history | clicks

  // Compose Campaign State
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [designStyle, setDesignStyle] = useState('professional'); // professional | modern | midnight | minimalist
  const [themeColor, setThemeColor] = useState('#0084ff'); // default Clinical Blue
  const [allEvents, setAllEvents] = useState([]);
  const [filterOpener, setFilterOpener] = useState('all'); // all | openers | non-openers
  const [blacklistText, setBlacklistText] = useState('');
  const [blacklistSuccessMsg, setBlacklistSuccessMsg] = useState('');
  const [isBlacklisting, setIsBlacklisting] = useState(false);
  const [senderName, setSenderName] = useState('EternoFit Wellness');
  const [filterSex, setFilterSex] = useState('all'); // all | male | female
  const [filterGoal, setFilterGoal] = useState('all'); // all | Muscle & Physique | Anti-aging & Vitality | Skin & Beauty | Brain & Focus | Intimate Performance
  const [filterLeadType, setFilterLeadType] = useState('all'); // all | quiz | cold
  const [dailyLimit, setDailyLimit] = useState(500); // default 500 emails/day quota limit
  const [emailsSentToday, setEmailsSentToday] = useState(0);
  
  // Campaigns Archive (History) Filters & Pagination States
  const [historySearch, setHistorySearch] = useState('');
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historyItemsPerPage, setHistoryItemsPerPage] = useState(10);

  // Traceable Clicks Feed Filters & Pagination States
  const [clicksSearch, setClicksSearch] = useState('');
  const [clicksStartDate, setClicksStartDate] = useState('');
  const [clicksEndDate, setClicksEndDate] = useState('');
  const [clicksCurrentPage, setClicksCurrentPage] = useState(1);
  const [clicksItemsPerPage, setClicksItemsPerPage] = useState(10);
  
  // Reset pages when filters change
  useEffect(() => {
    setHistoryCurrentPage(1);
  }, [historySearch, historyStartDate, historyEndDate, historyItemsPerPage]);

  useEffect(() => {
    setClicksCurrentPage(1);
  }, [clicksSearch, clicksStartDate, clicksEndDate, clicksItemsPerPage]);
  
  const [customPresets, setCustomPresets] = useState([]);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [savingPreset, setSavingPreset] = useState(false);
  
  // Cold Leads Inline Editor States
  const [editingColdLeadId, setEditingColdLeadId] = useState(null);
  const [editColdLeadEmail, setEditColdLeadEmail] = useState('');
  const [editColdLeadName, setEditColdLeadName] = useState('');
  const [coldLeadsSearch, setColdLeadsSearch] = useState('');
  const [coldLeadsCurrentPage, setColdLeadsCurrentPage] = useState(1);
  const [coldLeadsItemsPerPage, setColdLeadsItemsPerPage] = useState(10);
  
  // Reset cold leads page when search changes
  useEffect(() => {
    setColdLeadsCurrentPage(1);
  }, [coldLeadsSearch, coldLeadsItemsPerPage]);



  // Importer State
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccessMsg, setImportSuccessMsg] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Dispatch Queue Runner State
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [queueRecipients, setQueueRecipients] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [queueStatus, setQueueStatus] = useState('idle'); // idle | dispatching | paused | completed | cancelled
  const [queueSuccessCount, setQueueSuccessCount] = useState(0);
  const [queueErrorCount, setQueueErrorCount] = useState(0);
  const [queueLog, setQueueLog] = useState([]);
  
  const timerRef = useRef(null);
  const logEndRef = useRef(null);

  // Fetch all leads/subscribers, campaigns and click events
  useEffect(() => {
    setLoading(true);
    
    // 1. Fetch subscribers (submissions that haven't unsubscribed)
    const unsubSubscribers = onSnapshot(
      query(collection(db, 'submissions'), orderBy('timestamp', 'desc')), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp) || new Date()
        }));
        setSubscribers(list);
      },
      (error) => console.error("Error fetching subscribers:", error)
    );

    // 2. Fetch campaign runs
    const unsubCampaigns = onSnapshot(
      query(collection(db, 'marketing_campaigns'), orderBy('sentAt', 'desc')),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          sentAt: doc.data().sentAt?.toDate?.() || new Date(doc.data().sentAt) || new Date()
        }));
        setCampaigns(list);
      },
      (error) => console.error("Error fetching campaigns:", error)
    );

    // 3. Fetch affiliate clicks and opens from email
    const unsubClicks = onSnapshot(
      query(collection(db, 'analytics_events'), where('event', 'in', ['email_affiliate_clicked', 'email_opened'])),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date()
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        setAllEvents(list);
        setClicks(list.filter(item => item.event === 'email_affiliate_clicked'));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching clicks/opens:", error);
        setLoading(false);
      }
    );

        // 4. Fetch custom copy presets
    const unsubPresets = onSnapshot(
      query(collection(db, 'marketing_presets'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const firestoreList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt) || new Date()
        }));
        setCustomPresets(firestoreList);
      },
      (error) => {
        console.error("Error fetching custom presets from Firestore:", error);
      }
    );

    return () => {
      unsubSubscribers();
      unsubCampaigns();
      unsubClicks();
      unsubPresets();
    };
  }, []);

  // Scroll queue logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queueLog]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Parse pasted cold leads
  const parsedColdLeads = useMemo(() => {
    if (!importText.trim()) return [];
    const lines = importText.split('\n');
    const leads = [];
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const parts = trimmed.split(',');
      const email = parts[0]?.trim();
      const name = parts[1]?.trim() || '';
      
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      
      leads.push({
        lineNum: idx + 1,
        raw: trimmed,
        email,
        name: name || 'Subscriber',
        isValid
      });
    });
    
    return leads;
  }, [importText]);

  // Execute Cold Leads Import
  const handleImportLeads = async () => {
    const validLeads = parsedColdLeads.filter(l => l.isValid);
    if (validLeads.length === 0) {
      setImportError("No valid email addresses found to import.");
      return;
    }

    setIsImporting(true);
    setImportError('');
    setImportSuccessMsg('');

    try {
      let importedCount = 0;
      let duplicateCount = 0;

      // Check duplicates first
      const existingEmails = new Set(subscribers.map(s => s.email.toLowerCase()));

      for (const lead of validLeads) {
        const emailLower = lead.email.toLowerCase();
        if (existingEmails.has(emailLower)) {
          duplicateCount++;
          continue;
        }

        // Add lead as a submission document designated as cold
        await addDoc(collection(db, 'submissions'), {
          email: lead.email,
          answers: {
            name: lead.name,
            gender: 'Other',
            primaryGoal: ['General Health'],
            specificFocus: 'General Health'
          },
          isColdLead: true,
          status: 'Received',
          timestamp: new Date().toISOString()
        });

        // Add locally to prevent quick duplicate uploads during batch loops
        existingEmails.add(emailLower);
        importedCount++;
      }

      setImportSuccessMsg(`Import complete! Successfully added ${importedCount} new cold leads.${duplicateCount > 0 ? ` (${duplicateCount} duplicate email addresses skipped).` : ''}`);
      setImportText('');
    } catch (e) {
      setImportError("Database error during import: " + e.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Compute who has opened a campaign before
  const openerEmails = useMemo(() => {
    const opens = allEvents.filter(e => e.event === 'email_opened');
    return new Set(opens.map(o => o.recipient?.toLowerCase()).filter(Boolean));
  }, [allEvents]);

  // Filter subscribers list for targeting
  const targetedSubscribers = useMemo(() => {
    return subscribers.filter(s => {
      // 1. Unsubscribed / Bounced / Blacklisted check
      if (s.unsubscribed || s.bounced || s.blacklisted || s.status === 'Bounced' || s.status === 'Blacklisted') return false;

      // 2. Lead Type filter
      if (filterLeadType === 'quiz' && s.isColdLead) return false;
      if (filterLeadType === 'cold' && !s.isColdLead) return false;

      // 3. Gender filter
      if (filterSex !== 'all') {
        const gender = s.answers?.gender || 'Other';
        if (filterSex === 'male' && gender !== 'Male') return false;
        if (filterSex === 'female' && gender !== 'Female') return false;
      }

      // 4. Goals filter
      if (filterGoal !== 'all') {
        const goals = s.answers?.primaryGoal || [];
        if (!goals.includes(filterGoal)) return false;
      }

      // 5. Openers segment filter
      const emailLower = s.email.toLowerCase();
      if (filterOpener === 'openers' && !openerEmails.has(emailLower)) return false;
      if (filterOpener === 'non-openers' && openerEmails.has(emailLower)) return false;

      // 6. Already received check (duplicate-send protection)
      if (campaignName && s.receivedCampaigns && s.receivedCampaigns.includes(campaignName)) return false;

      return true;
    });
  }, [subscribers, filterLeadType, filterSex, filterGoal, filterOpener, openerEmails, campaignName]);

  // Statistics Computations
  const stats = useMemo(() => {
    const totalSubscribers = subscribers.filter(s => !s.unsubscribed).length;
    const quizSubscribers = subscribers.filter(s => !s.unsubscribed && !s.isColdLead).length;
    const coldSubscribers = subscribers.filter(s => !s.unsubscribed && s.isColdLead).length;
    const unsubscribedCount = subscribers.filter(s => s.unsubscribed).length;
    const campaignsCount = campaigns.length;
    
    // Clicks CTR
    const totalClicksCount = clicks.length;
    const totalCampaignSentCount = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const averageCTR = totalCampaignSentCount > 0 
      ? ((totalClicksCount / totalCampaignSentCount) * 100).toFixed(1)
      : '0.0';

    return {
      totalSubscribers,
      quizSubscribers,
      coldSubscribers,
      unsubscribedCount,
      campaignsCount,
      totalClicksCount,
      averageCTR
    };
  }, [subscribers, campaigns, clicks]);

  // Filter Campaigns Archive by search and date range
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(camp => {
      // 1. Text Search (Campaign Name or Subject)
      if (historySearch.trim()) {
        const query = historySearch.toLowerCase();
        const nameMatch = camp.name?.toLowerCase().includes(query);
        const subjectMatch = camp.subject?.toLowerCase().includes(query);
        if (!nameMatch && !subjectMatch) return false;
      }
      
      // 2. Date Range Bounds Check
      if (historyStartDate) {
        const start = new Date(historyStartDate + 'T00:00:00');
        if (camp.sentAt < start) return false;
      }
      if (historyEndDate) {
        const end = new Date(historyEndDate + 'T23:59:59');
        if (camp.sentAt > end) return false;
      }
      
      return true;
    });
  }, [campaigns, historySearch, historyStartDate, historyEndDate]);

  // Paginated Campaigns
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (historyCurrentPage - 1) * historyItemsPerPage;
    return filteredCampaigns.slice(startIndex, startIndex + historyItemsPerPage);
  }, [filteredCampaigns, historyCurrentPage, historyItemsPerPage]);

  const historyTotalPages = Math.ceil(filteredCampaigns.length / historyItemsPerPage) || 1;

  // Filter Clicks Feed by search and date range
  const filteredClicks = useMemo(() => {
    return clicks.filter(clk => {
      // 1. Text Search (Recipient Email, Product, Campaign Name, Location, IP)
      if (clicksSearch.trim()) {
        const query = clicksSearch.toLowerCase();
        const emailMatch = clk.recipient?.toLowerCase().includes(query);
        const productMatch = clk.product?.toLowerCase().includes(query);
        const campaignMatch = clk.campaign?.toLowerCase().includes(query);
        const locationMatch = clk.location?.toLowerCase().includes(query);
        const ipMatch = clk.ip?.toLowerCase().includes(query);
        if (!emailMatch && !productMatch && !campaignMatch && !locationMatch && !ipMatch) return false;
      }
      
      // 2. Date Range Bounds Check
      if (clicksStartDate) {
        const start = new Date(clicksStartDate + 'T00:00:00');
        if (clk.timestamp < start) return false;
      }
      if (clicksEndDate) {
        const end = new Date(clicksEndDate + 'T23:59:59');
        if (clk.timestamp > end) return false;
      }
      
      return true;
    });
  }, [clicks, clicksSearch, clicksStartDate, clicksEndDate]);

  // Paginated Clicks Feed
  const paginatedClicks = useMemo(() => {
    const startIndex = (clicksCurrentPage - 1) * clicksItemsPerPage;
    return filteredClicks.slice(startIndex, startIndex + clicksItemsPerPage);
  }, [filteredClicks, clicksCurrentPage, clicksItemsPerPage]);

  const clicksTotalPages = Math.ceil(filteredClicks.length / clicksItemsPerPage) || 1;

  // Filter imported Cold Leads by search query
  const filteredColdLeads = useMemo(() => {
    const list = subscribers.filter(s => s.isColdLead);
    if (!coldLeadsSearch.trim()) return list;
    const query = coldLeadsSearch.toLowerCase();
    return list.filter(lead => {
      const emailMatch = lead.email?.toLowerCase().includes(query);
      const nameMatch = lead.answers?.name?.toLowerCase().includes(query);
      return emailMatch || nameMatch;
    });
  }, [subscribers, coldLeadsSearch]);

  // Paginated imported Cold Leads
  const paginatedColdLeads = useMemo(() => {
    const startIndex = (coldLeadsCurrentPage - 1) * coldLeadsItemsPerPage;
    return filteredColdLeads.slice(startIndex, startIndex + coldLeadsItemsPerPage);
  }, [filteredColdLeads, coldLeadsCurrentPage, coldLeadsItemsPerPage]);

  const coldLeadsTotalPages = Math.ceil(filteredColdLeads.length / coldLeadsItemsPerPage) || 1;

  // Insert helper tags into email body
  const insertPlaceholder = (tag) => {
    setEmailBody(prev => prev + tag);
  };

  // Compile individual email template dynamically (personalization replacement)
  const compileEmailContent = (recipient, rawBody, isHtml = true) => {
    if (!recipient) return rawBody;
    
    const name = recipient.answers?.name || 'Subscriber';
    const email = recipient.email;
    const goals = recipient.answers?.primaryGoal ? recipient.answers.primaryGoal.join(' & ') : 'General Health';
    
    // Health score mock evaluation
    let healthScoreStr = 'N/A';
    if (recipient.answers) {
      // Basic client-side score algorithm matches app
      let totalPoints = 0;
      let maxPoints = 0;
      const evalScore = (val, thres) => {
        if (!val) return;
        maxPoints += 15;
        totalPoints += thres[val] || 0;
      };
      evalScore(recipient.answers.sleepQuality, { 'Deep & Restful': 15, 'Occasionally Restless': 10, 'Often Waking Up': 5, 'Poor': 0 });
      evalScore(recipient.answers.tiredness, { 'Rarely, I have consistent energy': 15, 'Sometimes, usually in the afternoon': 8, 'Often, I feel drained': 4, 'Constantly, I struggle to stay awake': 0 });
      const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 72;
      healthScoreStr = `${score}/100`;
    }

    // 1. Replace base text variables
    let compiledBody = rawBody;
    const quizLink = 'https://www.eternofit.com/quiz';
    let compiled = compiledBody
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{goals}}/g, goals)
      .replace(/{{healthScore}}/g, healthScoreStr)
      .replace(/{{quizLink}}/g, quizLink);

    // 2. Replace {{product_box:ProductName}} with customized HTML blocks
    const productBoxRegex = /{{product_box:([^}]+)}}/g;
    compiled = compiled.replace(productBoxRegex, (match, prodName) => {
      const prod = globalProducts.find(p => p.name.toLowerCase() === prodName.trim().toLowerCase());
      if (!prod) return `<div style="padding:1rem; border:1px dashed #ef4444; color:#ef4444; margin:1rem 0;">Product [${prodName}] not found in inventory</div>`;
      
      const affiliateLink = prod.affiliateLink || '#';
      
      if (!isHtml) {
        return `\n=== RECOMMENDED PRODUCT: ${prod.name} ===\n${prod.description}\nLink: ${affiliateLink}\n`;
      }

      return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f8fafc; border-radius:14px; border:1px solid #e2e8f0; margin:20px 0; overflow:hidden;">
        <tr>
          <td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td valign="top" style="padding-right:16px;">
                  <img src="${prod.image.startsWith('http') ? prod.image : window.location.origin + '/' + (prod.image.startsWith('/') ? prod.image.substring(1) : prod.image)}" alt="${prod.name}" width="80" height="80" style="width:80px; height:80px; border-radius:8px; border:1px solid #cbd5e1; background:#ffffff; object-fit:contain; display:block;">
                </td>
                <td valign="top">
                  <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#1e293b;">${prod.name}</h4>
                  <p style="margin:0 0 10px 0; font-size:13px; font-weight:600; color:${themeColor};">✓ Expert Clinical Recommendation</p>
                  <p style="margin:0; font-size:13px; color:#475569; line-height:1.5;">${prod.description}</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:16px;">
              <tr>
                <td style="background:#ffffff; border-radius:8px; padding:12px; border:1px solid #e2e8f0; border-left:3px solid ${themeColor};">
                  <p style="margin:0 0 2px; font-size:12px; font-weight:700; color:#1e293b;">Clinical Rationale:</p>
                  <p style="margin:0; font-size:12px; color:#64748b; line-height:1.4;">${prod.rationale || `Recommended to support active health goals and restore optimal recovery mechanisms.`}</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:16px;">
              <tr>
                <td align="center">
                  <a href="${affiliateLink}" target="_blank" style="display:inline-block; background:${themeColor}; color:#ffffff; padding:10px 24px; border-radius:8px; text-decoration:none; font-weight:700; font-size:13px; box-shadow:0 3px 8px rgba(0,132,255,0.2);">Claim Discount & Shop Now &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      `;
    });

    // 3. Scan and rewrite any inline client redirect links like `/click?product=ProductName` to fully personalized links
    const clientLinkRegex = /href=["'](?:https?:\/\/[^\/]+)?\/click\?product=([^"']+)["']/g;
    compiled = compiled.replace(clientLinkRegex, (match, prodName) => {
      const prod = globalProducts.find(p => p.name.toLowerCase() === prodName.trim().toLowerCase());
      if (prod) {
        const affiliateLink = prod.affiliateLink || '#';
        return `href="${affiliateLink}"`;
      }
      return match;
    });

    return compiled;
  };

  // Compile complete HTML Layout (Professional, Modern, Midnight, Minimalist templates)
  const getCompiledTemplateHtml = (recipient, compiledBody) => {
    if (!recipient) return compiledBody;
    const name = recipient.answers?.name || 'Subscriber';
    const email = recipient.email;
    const baseUrl = window.location.origin + '/';
    
    // Append server-side invisible open tracking pixel
    const openTrackingPixel = `<img src="${baseUrl}api/track-open?email=${encodeURIComponent(email)}&campaign=${encodeURIComponent(campaignName || 'Direct Campaign')}" width="1" height="1" style="display:none; width:1px; height:1px; border:none; pointer-events:none;" />`;

    if (designStyle === 'blank') {
      const html = `<!DOCTYPE html>
      <html>
      <body style="margin:0; padding:20px; font-family:Helvetica,Arial,sans-serif; background-color:#ffffff; color:#1e293b; line-height:1.6;">
        ${compiledBody}
      </body>
      </html>`;
      return html.replace('</body>', `${openTrackingPixel}</body>`);
    }

    if (designStyle === 'minimalist') {
      // Direct minimalist template
      const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Helvetica,Arial,sans-serif; padding:40px 20px; line-height:1.7; color:#1e293b; background:#ffffff;">
        <div style="max-width:600px; margin:0 auto;" id="letter-content">
          ${compiledBody}
          <hr style="border:none; border-top:1px solid #e2e8f0; margin:32px 0;" />
          <p style="font-size:14px; color:#475569; margin-top:20px;">
            Best regards,<br>
            <strong>The ${senderName} Team</strong><br>
            Clinical Wellness Division
          </p>
          <p style="font-size:11px; color:#94a3b8; margin-top:48px; text-align:center; border-top:1px solid #f1f5f9; padding-top:16px;">
            You received this update because you are subscribed to EternoFit. 
            <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline;">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>`;
      return html.replace('</div>\n      </body>', `${openTrackingPixel}</div>\n      </body>`).replace('</div>', `${openTrackingPixel}</div>`);
    }

    if (designStyle === 'modern') {
      // Modern Glassmorphic / Vibrant layout
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { margin:0 !important; padding:0 !important; background-color:#f8fafc; font-family:Helvetica,Arial,sans-serif; }
          .wrapper { background-color:#f8fafc; padding:50px 16px; }
          .container { background:#ffffff; border-radius:24px; overflow:hidden; border:none; box-shadow:0 20px 40px rgba(0,0,0,0.04); max-width:600px; margin:0 auto; border-top:6px solid ${themeColor}; }
          .header { background:#ffffff; padding:40px 32px 24px; text-align:center; }
          .logo { width:68px; height:68px; border-radius:50%; display:block; margin:0 auto 16px; background:#0b0f19; object-fit:contain; border:3px solid ${themeColor}; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .banner-title { margin:0; font-size:26px; font-weight:800; color:#0f172a; line-height:1.2; letter-spacing:-0.5px; }
          .content { padding:16px 40px 32px; font-size:15px; color:#334155; line-height:1.75; }
          .footer { background:#f8fafc; padding:32px 40px; text-align:center; border-top:1px solid #f1f5f9; font-size:12px; color:#94a3b8; }
          .footer a { color:#64748b; text-decoration:underline; margin:0 8px; }
          a.action-btn { display:inline-block; background:${themeColor}; color:#ffffff; padding:12px 28px; border-radius:10px; text-decoration:none; font-weight:700; font-size:14px; box-shadow:0 4px 12px rgba(0,132,255,0.2); }
        </style>
      </head>
      <body>
        <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td align="center">
              <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td class="header">
                    <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" class="logo">
                    <h1 class="banner-title">${senderName}</h1>
                    <p style="margin:8px 0 0 0; font-size:14px; color:#64748b; font-weight:500;">Attaining Peak Performance & Longevity</p>
                  </td>
                </tr>
                <tr>
                  <td class="content">
                    ${compiledBody}
                  </td>
                </tr>
                <tr>
                  <td class="footer">
                    <p style="margin:0 0 6px 0; font-weight:700; color:#475569; font-size:13px;">${senderName} Wellness</p>
                    <p style="margin:0 0 16px 0; line-height:1.5;">This email was sent exclusively to ${email}. We strictly support your clinical privacy regulations.</p>
                    <p style="margin:0 0 20px 0;">
                      <a href="${baseUrl}support">Clinical Support</a> | 
                      <a href="${baseUrl}#privacy">Privacy Policy</a>
                    </p>
                    <p style="margin:0 0 8px 0;">© 2026 EternoFit Wellness. All rights reserved.</p>
                    <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline; font-weight:600;">Unsubscribe from list</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
      return html.replace('</body>', `${openTrackingPixel}</body>`);
    }

    if (designStyle === 'midnight') {
      // Midnight Dark Mode template
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { margin:0 !important; padding:0 !important; background-color:#090d16; font-family:Helvetica,Arial,sans-serif; }
          .wrapper { background-color:#090d16; padding:50px 16px; }
          .container { background:#0f172a; border-radius:24px; overflow:hidden; border:1px solid #1e293b; box-shadow:0 25px 60px rgba(0,0,0,0.4); max-width:600px; margin:0 auto; }
          .header { background:#0b0f19; padding:40px 32px; text-align:center; border-bottom:1px solid #1e293b; }
          .logo { width:64px; height:64px; border-radius:50%; display:block; margin:0 auto 16px; background:#000000; object-fit:contain; border:2px solid ${themeColor}; box-shadow: 0 0 20px rgba(0,255,102,0.15); }
          .banner-title { margin:0; font-size:24px; font-weight:800; color:#ffffff; line-height:1.2; letter-spacing:-0.5px; }
          .content { padding:32px 40px; font-size:15px; color:#cbd5e1; line-height:1.75; }
          .footer { background:#0b0f19; padding:32px 40px; text-align:center; border-top:1px solid #1e293b; font-size:12px; color:#64748b; }
          .footer a { color:#94a3b8; text-decoration:underline; margin:0 8px; }
          a.action-btn { display:inline-block; background:${themeColor}; color:#000000; padding:12px 28px; border-radius:10px; text-decoration:none; font-weight:800; font-size:14px; box-shadow:0 0 20px rgba(0,255,102,0.25); }
        </style>
      </head>
      <body>
        <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td align="center">
              <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td class="header">
                    <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" class="logo">
                    <h1 class="banner-title">${senderName}</h1>
                    <p style="margin:8px 0 0 0; font-size:13px; color:#94a3b8; font-weight:500;">Attaining Peak Performance & Longevity</p>
                  </td>
                </tr>
                <tr>
                  <td class="content">
                    ${compiledBody}
                  </td>
                </tr>
                <tr>
                  <td class="footer">
                    <p style="margin:0 0 6px 0; font-weight:700; color:#94a3b8; font-size:13px;">${senderName} Wellness</p>
                    <p style="margin:0 0 16px 0; line-height:1.5;">This email was sent exclusively to ${email}. We strictly support your clinical privacy regulations.</p>
                    <p style="margin:0 0 20px 0;">
                      <a href="${baseUrl}support">Clinical Support</a> | 
                      <a href="${baseUrl}#privacy">Privacy Policy</a>
                    </p>
                    <p style="margin:0 0 8px 0;">© 2026 EternoFit Wellness. All rights reserved.</p>
                    <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline; font-weight:700;">Unsubscribe from list</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
      return html.replace('</body>', `${openTrackingPixel}</body>`);
    }

    // Gorgeous premium clinical newsletter template (Professional)
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { margin:0 !important; padding:0 !important; background-color:#f1f5f9; font-family:Helvetica,Arial,sans-serif; }
        .wrapper { background-color:#f1f5f9; padding:40px 16px; }
        .container { background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 8px 30px rgba(0,0,0,0.05); max-width:600px; margin:0 auto; }
        .header { background:#ffffff; padding:32px; text-align:center; border-bottom:4px solid ${themeColor}; }
        .logo { width:64px; height:64px; border-radius:50%; display:block; margin:0 auto 12px; background:#000000; object-fit:contain; border:2px solid #00ff66; }
        .banner-title { margin:0; font-size:24px; font-weight:700; color:#1e293b; line-height:1.2; }
        .content { padding:32px 32px 24px; font-size:15px; color:#1e293b; line-height:1.7; }
        .footer { background:#f8fafc; padding:32px; text-align:center; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8; }
        .footer a { color:#94a3b8; text-decoration:underline; margin:0 8px; }
        a.action-btn { display:inline-block; background:${themeColor}; color:#ffffff; padding:12px 28px; border-radius:10px; text-decoration:none; font-weight:700; font-size:14px; box-shadow:0 4px 12px rgba(0,132,255,0.2); }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
          <td align="center">
            <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td class="header">
                  <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" class="logo">
                  <h1 class="banner-title">${senderName} Updates</h1>
                  <p style="margin:6px 0 0 0; font-size:13px; color:#64748b;">Attainment of Peak Performance & Lifespan Support</p>
                </td>
              </tr>
              <tr>
                <td class="content">
                  ${compiledBody}
                </td>
              </tr>
              <tr>
                <td class="footer">
                  <p style="margin:0 0 6px 0; font-weight:600; color:#64748b; font-size:13px;">${senderName} Wellness</p>
                  <p style="margin:0 0 16px 0; line-height:1.5;">This email was sent exclusively to ${email}. We strictly support your clinical privacy regulations.</p>
                  <p style="margin:0 0 20px 0;">
                    <a href="${baseUrl}support">Clinical Support</a> | 
                    <a href="${baseUrl}#privacy">Privacy Policy</a>
                  </p>
                  <p style="margin:0 0 8px 0;">© 2026 EternoFit Wellness. All rights reserved.</p>
                  <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline;">Unsubscribe from list</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
    return html.replace('</body>', `${openTrackingPixel}</body>`);
  };

  // Compile sample preview HTML for the preview iframe
  const samplePreviewHtml = useMemo(() => {
    // Compile using fallback mock data
    const recipient = {
      email: 'preview@example.com',
      answers: { name: 'John Doe', gender: 'Male', primaryGoal: ['Muscle & Physique'] }
    };

    const compiledBody = compileEmailContent(recipient, emailBody || '<p style="color:#94a3b8; text-align:center;">Email body is empty. Compose content inside the editor to view preview.</p>', true);
    return getCompiledTemplateHtml(recipient, compiledBody);
  }, [emailBody, designStyle, themeColor, senderName, campaignName]);

  // Save current configurations as a custom preset (Firestore + LocalStorage Hybrid)
  const handleSaveCustomPreset = async (e) => {
    if (e) e.preventDefault();
    if (!presetNameInput.trim()) {
      alert("Please enter a name for your custom preset.");
      return;
    }
    if (!emailBody.trim()) {
      alert("Email body cannot be empty when saving a preset.");
      return;
    }

    const newPreset = {
      name: presetNameInput.trim(),
      campaignName: campaignName || presetNameInput.trim(),
      subject: subject || '',
      body: emailBody || '',
      templateStyle: designStyle || 'professional',
      themeColor: themeColor || '#0084ff',
      senderName: senderName || 'EternoFit Wellness',
      createdAt: new Date().toISOString()
    };

    setSavingPreset(true);

    try {
      await addDoc(collection(db, 'marketing_presets'), {
        ...newPreset,
        createdAt: serverTimestamp()
      });
      alert(`Preset "${presetNameInput.trim()}" saved successfully to Cloud database!`);
      setPresetNameInput('');
    } catch (err) {
      console.error("Firestore preset save failed:", err);
      alert("Error saving custom preset to Cloud: " + err.message + "\nMake sure your Firestore security rules are configured to allow writing to 'marketing_presets'.");
    } finally {
      setSavingPreset(false);
    }
  };

  // Delete custom preset from Firestore
  const handleDeleteCustomPreset = async (presetId, presetName) => {
    if (presetId && window.confirm(`Are you sure you want to permanently delete custom preset "${presetName}"?`)) {
      try {
        await deleteDoc(doc(db, 'marketing_presets', presetId));
        alert("Preset deleted successfully.");
      } catch (err) {
        console.error("Failed to delete preset", err);
        alert("Failed to delete preset from Cloud: " + err.message);
      }
    }
  };

  // Load campaign copy presets (system and custom)
  const handleLoadPreset = (presetType) => {
    if (!presetType) return;

    // Check custom presets first
    const custom = customPresets.find(p => p.id === presetType);
    if (custom) {
      if (campaignName.trim() || subject.trim() || emailBody.trim()) {
        if (!window.confirm(`Loading custom preset "${custom.name}" will overwrite your current configurations. Do you want to proceed?`)) {
          return;
        }
      }
      setCampaignName(custom.campaignName || '');
      setSubject(custom.subject || '');
      setEmailBody(custom.body || '');
      setDesignStyle(custom.templateStyle || 'professional');
      setThemeColor(custom.themeColor || '#0084ff');
      setSenderName(custom.senderName || 'EternoFit Wellness');
      return;
    }
    
    if (campaignName.trim() || subject.trim() || emailBody.trim()) {
      if (!window.confirm("Loading a preset will overwrite your current subject, body, campaign name, and styles. Do you want to proceed?")) {
        return;
      }
    }

    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

    if (presetType === 'quiz_invite') {
      setCampaignName(`Quiz Invitation - ${dateStr}`);
      setSubject(`Hi {{name}}, discover your personalized Vitality Score 🩺`);
      setEmailBody(`<p>Hi {{name}},</p>

<p>At EternoFit Wellness, we believe that understanding your body's unique biomarker trends is the absolute first step toward unlocking peak physical performance, metabolic longevity, and daily recovery.</p>

<p>We've designed the state-of-the-art <strong>EternoFit Health & Vitality Quiz</strong> to evaluate your wellness baseline (including sleep resilience, energy recovery levels, and targeted goals) in under 3 minutes.</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="{{quizLink}}" class="action-btn">Start Your Vitality Quiz &rarr;</a>
    </td>
  </tr>
</table>

<p>Upon completion of the quiz, our system will generate a detailed <strong>Clinical Vitality Report</strong> tailored to your unique parameters (e.g., to support your target of <em>{{goals}}</em>).</p>

<p>Your privacy is fully protected under our clinical data protection standards. It is completely free and takes only a few minutes.</p>

<p>To your ultimate wellness,<br>
<strong>The EternoFit Clinical Team</strong></p>`);
      setDesignStyle('professional');
      setThemeColor('#0084ff');
    } else if (presetType === 'product_promo') {
      setCampaignName(`Product Promo - ${dateStr}`);
      setSubject(`Exclusive Clinical Recommendation: Support {{goals}} with Science 🔬`);
      setEmailBody(`<p>Hi {{name}},</p>

<p>We are writing to share a vetted clinical recommendation tailored specifically to your active fitness and longevity objectives: <strong>{{goals}}</strong>.</p>

<p>After analyzing biomarker data and metabolic profiles, our medical board has selected a premier product in our active inventory that has shown exceptional clinical efficacy for your specific needs.</p>

{{product_box:Testosil}}

<p>Testosil utilizes patented clinical extracts to bolster peak performance, stimulate lean recovery, and promote vitality under physical stress.</p>

<p>Click the link inside the recommendation block above or use the button below to secure an exclusive clinical discount of up to 40% off your supply.</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="/click?product=Testosil" class="action-btn">Claim Vetted Discount Now &rarr;</a>
    </td>
  </tr>
</table>

<p>Every batch is manufactured in cGMP certified environments and third-party laboratory tested for purity.</p>

<p>Wishing you consistent progress,<br>
<strong>EternoFit Clinical Wellness</strong></p>`);
      setDesignStyle('modern');
      setThemeColor('#10b981');
    } else if (presetType === 'newsletter_tips') {
      setCampaignName(`Newsletter - ${dateStr}`);
      setSubject(`3 Medical Secrets to Unlock Cellular Energy (Clinical Guide) 💡`);
      setEmailBody(`<p>Hi {{name}},</p>

<p>Maintaining high energy levels through the afternoon isn't just about caffeine—it is about cellular mitochondria and optimizing recovery cycles.</p>

<p>Today, our clinical board outlines 3 critical practices to boost your vitality index:</p>

<h3>1. Respect Your Circadian Phase</h3>
<p>Ensure light exposure within 30 minutes of waking to anchor cortisol cycles. This is the single highest leverage habit for overnight sleep quality.</p>

<h3>2. Micronutrient Supplementation</h3>
<p>Target active cellular optimization with high-grade micronutrient complexes. When addressing goals like <strong>{{goals}}</strong>, ensuring structural mineral replenishment is crucial.</p>

<h3>3. Periodic Baseline Evaluations</h3>
<p>Your biomarkers are constantly shifting. We recommend updating your metabolic profile quarterly by taking our quick assessment tool.</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="{{quizLink}}" class="action-btn">Re-Evaluate Your Health Score &rarr;</a>
    </td>
  </tr>
</table>

<p>Keep training hard and prioritizing recovery!</p>

<p>To your health,<br>
<strong>EternoFit Medical Board</strong></p>`);
      setDesignStyle('professional');
      setThemeColor('#8b5cf6');
    } else if (presetType === 'blank') {
      setCampaignName(`Campaign - ${dateStr}`);
      setSubject('');
      setEmailBody('');
      setDesignStyle('blank');
      setThemeColor('#0084ff');
    }
  };

  // Restore/unblock contact from blacklist/unsubscribed/bounce status
  const handleRestoreLead = async (leadId) => {
    if (window.confirm("Are you sure you want to restore this contact? They will be eligible for future marketing campaigns.")) {
      try {
        await updateDoc(doc(db, 'submissions', leadId), {
          blacklisted: false,
          bounced: false,
          unsubscribed: false,
          status: 'Received'
        });
      } catch (e) {
        alert("Error restoring lead: " + e.message);
      }
    }
  };

  // Cold Leads Editor Helpers
  const handleStartEditColdLead = (lead) => {
    setEditingColdLeadId(lead.id);
    setEditColdLeadEmail(lead.email || '');
    setEditColdLeadName(lead.answers?.name || '');
  };

  const handleCancelEditColdLead = () => {
    setEditingColdLeadId(null);
    setEditColdLeadEmail('');
    setEditColdLeadName('');
  };

  const handleSaveEditColdLead = async (lead) => {
    if (!editColdLeadEmail.trim()) {
      alert("Email cannot be empty.");
      return;
    }
    try {
      await updateDoc(doc(db, 'submissions', lead.id), {
        email: editColdLeadEmail.trim(),
        answers: {
          ...lead.answers,
          name: editColdLeadName.trim()
        }
      });
      setEditingColdLeadId(null);
    } catch (e) {
      alert("Error saving changes: " + e.message);
    }
  };

  const handleDeleteColdLead = async (leadId) => {
    if (window.confirm("Are you sure you want to permanently delete this cold lead from the database? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'submissions', leadId));
      } catch (e) {
        alert("Error deleting cold lead: " + e.message);
      }
    }
  };

  // Get current time in US Eastern Time Zone
  const getUSEasternTime = () => {
    const etString = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    return new Date(etString);
  };

  // Check if current time is within US morning hours (9:00 AM - 9:00 PM Eastern Time)
  const isUSMorningHours = () => {
    const etDate = getUSEasternTime();
    const hours = etDate.getHours();
    return hours >= 9 && hours < 21; // 9:00 AM to 9:00 PM
  };

  // Calculate millisecond delay until next US Morning (9:00 AM Eastern Time)
  const getMsUntilUSMorning = () => {
    const etNow = getUSEasternTime();
    const etTarget = new Date(etNow);
    
    if (etNow.getHours() >= 21) {
      // Late evening or night. Target is tomorrow at 9:00 AM ET.
      etTarget.setDate(etNow.getDate() + 1);
      etTarget.setHours(9, 0, 0, 0);
    } else if (etNow.getHours() < 9) {
      // Early morning today. Target is today at 9:00 AM ET.
      etTarget.setHours(9, 0, 0, 0);
    } else {
      // We are already inside the 9AM - 9PM ET window!
      return 0;
    }
    
    // Calculate the difference in milliseconds
    const diffMs = etTarget.getTime() - etNow.getTime();
    return diffMs;
  };

  // Campaign Dispatch Runner logic
  const handleLaunchCampaign = () => {
    if (!campaignName.trim()) {
      alert("⚠️ Please enter a Campaign Name for analytics tracking.");
      return;
    }
    if (!subject.trim()) {
      alert("⚠️ Please provide a Subject Line.");
      return;
    }
    if (!emailBody.trim()) {
      alert("⚠️ Email body cannot be blank.");
      return;
    }
    if (targetedSubscribers.length === 0) {
      alert("⚠️ Selected audience size is 0. Check filters.");
      return;
    }

    if (!window.confirm(`Proceed to dispatch "${campaignName}" campaign to ${targetedSubscribers.length} subscribers with a random 10-20 second delay between emails?`)) {
      return;
    }

    // Initialize Dispatch Queue
    setEmailsSentToday(0);
    
    // Shuffle recipients to send randomly, not in sequence
    const shuffledSubscribers = [...targetedSubscribers].sort(() => Math.random() - 0.5);
    setQueueRecipients(shuffledSubscribers);
    setQueueIndex(0);
    setQueueSuccessCount(0);
    setQueueErrorCount(0);
    setQueueStatus('dispatching');
    setQueueLog([
      `[INFO] Starting dispatch of campaign: "${campaignName}"`,
      `[INFO] Target count: ${targetedSubscribers.length} subscribers`,
      `[INFO] Set Interval delay: 10-20 seconds (randomized)`,
      `[INFO] ----------------------------------------------------`
    ]);
    setQueueModalOpen(true);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim() || !testEmailAddress.includes('@')) {
      alert("⚠️ Please enter a valid test email address.");
      return;
    }
    if (!subject.trim()) {
      alert("⚠️ Please provide a Subject Line for the test.");
      return;
    }
    if (!emailBody.trim()) {
      alert("⚠️ Email body cannot be blank for the test.");
      return;
    }

    setIsSendingTestEmail(true);

    try {
      // Mock recipient for compilation
      const mockRecipient = {
        email: testEmailAddress,
        id: 'test-user-id',
        answers: { name: 'Test User' }
      };

      const compiledBody = compileEmailContent(mockRecipient, emailBody, true);
      const fullHtml = getCompiledTemplateHtml(mockRecipient, compiledBody);
      
      const response = await fetch('/api/send-marketing-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress,
          subject: subject.replace(/{{name}}/g, 'Test User'),
          html: fullHtml,
          text: `Hello Test User,\n\nPlease read our personalized clinical update by visiting the web platform.`,
          fromName: senderName
        })
      });

      if (response.ok) {
        alert(`✅ Test email successfully sent to ${testEmailAddress}`);
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`❌ Failed to send test email: ${errData.error || response.statusText}`);
      }
    } catch (err) {
      alert(`❌ Error sending test email: ${err.message}`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Async dispatch runner loop
  useEffect(() => {
    if (queueStatus !== 'dispatching') return;

    if (queueIndex >= queueRecipients.length) {
      // Completed Queue!
      setQueueStatus('completed');
      setQueueLog(prev => [...prev, `[SUCCESS] Queue completed! ${queueSuccessCount} sent successfully. ${queueErrorCount} failed.`]);
      
      // Save campaign stats to Firestore
      addDoc(collection(db, 'marketing_campaigns'), {
        name: campaignName,
        subject: subject,
        body: emailBody,
        template: designStyle,
        themeColor: themeColor,
        filters: {
          leadType: filterLeadType,
          sex: filterSex,
          goal: filterGoal
        },
        sentCount: queueSuccessCount,
        sentAt: serverTimestamp()
      }).catch(e => console.error("Error saving campaign run log:", e));
      
      // Trigger analytics
      trackEvent('marketing_campaign_sent', { name: campaignName, count: queueSuccessCount });
      return;
    }

    // 1. Enforce US Morning timeframe bounds (9:00 AM - 9:00 PM Eastern Time)
    const msUntilUSMorning = getMsUntilUSMorning();
    if (msUntilUSMorning > 0) {
      const hoursWait = (msUntilUSMorning / (1000 * 60 * 60)).toFixed(1);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setQueueLog(prev => [
        ...prev, 
        `[${timeStr}] [WAIT] Outside US Morning hours (9AM-9PM ET). Pausing dispatches.`,
        `[${timeStr}] [WAIT] Auto-resuming loop in ${hoursWait} hours (at 9:00 AM ET today/tomorrow)...`
      ]);
      
      timerRef.current = setTimeout(() => {
        setEmailsSentToday(0); // Reset quota for the new daily cycle
      }, msUntilUSMorning);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    // 2. Enforce customizable daily sending quota (up to 100 emails max)
    if (emailsSentToday >= dailyLimit) {
      const etNow = getUSEasternTime();
      const etTomorrow = new Date(etNow);
      etTomorrow.setDate(etNow.getDate() + 1);
      etTomorrow.setHours(9, 0, 0, 0); // 9:00 AM ET tomorrow morning
      const msToNextDayMorning = etTomorrow.getTime() - etNow.getTime();
      
      const hoursWait = (msToNextDayMorning / (1000 * 60 * 60)).toFixed(1);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setQueueLog(prev => [
        ...prev,
        `[${timeStr}] [WAIT] Daily campaign send limit of ${dailyLimit} reached.`,
        `[${timeStr}] [WAIT] Auto-resuming next batch tomorrow in ${hoursWait} hours (at 9:00 AM ET)...`
      ]);
      
      timerRef.current = setTimeout(() => {
        setEmailsSentToday(0); // Reset daily session sent count
      }, msToNextDayMorning);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    const runDispatchStep = async () => {
      const recipient = queueRecipients[queueIndex];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setQueueLog(prev => [...prev, `[${timeStr}] [${queueIndex + 1}/${queueRecipients.length}] Sending to ${recipient.email}...`]);

      try {
        const compiledBody = compileEmailContent(recipient, emailBody, true);
        const fullHtml = getCompiledTemplateHtml(recipient, compiledBody);
        
        // Dispatch via worker endpoint
        const response = await fetch('/api/send-marketing-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipient.email,
            subject: subject.replace(/{{name}}/g, recipient.answers?.name || 'Subscriber'),
            html: fullHtml,
            text: `Hello ${recipient.answers?.name || 'Subscriber'},\n\nPlease read our personalized clinical update by visiting the web platform.`,
            fromName: senderName
          })
        });

        if (response.ok) {
          setQueueSuccessCount(c => c + 1);
          setEmailsSentToday(c => c + 1);

          // Log receivedCampaign in Firestore to prevent double dispatches
          try {
            const recipientRef = doc(db, 'submissions', recipient.id);
            await updateDoc(recipientRef, {
              receivedCampaigns: arrayUnion(campaignName)
            });
          } catch (dbErr) {
            console.error("Failed to log receivedCampaign in Firestore:", dbErr);
          }

          setQueueLog(prev => {
            const copy = [...prev];
            copy[copy.length - 1] += " SUCCESS";
            return copy;
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          setQueueErrorCount(c => c + 1);
          setQueueLog(prev => {
            const copy = [...prev];
            copy[copy.length - 1] += ` FAILED (${errData.error || response.statusText})`;
            return copy;
          });
        }
      } catch (err) {
        setQueueErrorCount(c => c + 1);
        setQueueLog(prev => {
          const copy = [...prev];
          copy[copy.length - 1] += ` FAILED (Error: ${err.message})`;
          return copy;
        });
      }

      // Schedule next dispatch step after custom delay
      setQueueIndex(idx => idx + 1);
    };

    const delay = Math.floor(Math.random() * (20 - 10 + 1) + 10) * 1000;
    timerRef.current = setTimeout(runDispatchStep, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [queueStatus, queueIndex, emailsSentToday, dailyLimit]);

  // Handle manual queue controls
  const handlePauseQueue = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQueueStatus('paused');
    setQueueLog(prev => [...prev, `[PAUSED] Queue sending suspended by administrator.`]);
  };

  const handleResumeQueue = () => {
    setQueueStatus('dispatching');
    setQueueLog(prev => [...prev, `[RESUMING] Queue sending resumed...`]);
  };

    const handleStopAndSaveQueue = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQueueStatus('cancelled');
    setQueueLog(prev => [...prev, `[STOPPED] Queue suspended. Saving progress to database...`]);
    
    try {
      await addDoc(collection(db, 'marketing_campaigns'), {
        isPaused: true,
        name: campaignName,
        subject: subject,
        body: emailBody,
        template: designStyle,
        themeColor: themeColor,
        filters: {
          leadType: filterLeadType,
          sex: filterSex,
          goal: filterGoal
        },
        queueRecipients: queueRecipients,
        queueIndex: queueIndex,
        queueSuccessCount: queueSuccessCount,
        queueErrorCount: queueErrorCount,
        queueLog: queueLog,
        senderName: senderName,
        sentAt: serverTimestamp(),
        savedAt: serverTimestamp()
      });
      alert('Campaign stopped and progress saved successfully. You can resume it later from the Campaigns Archive.');
      setQueueModalOpen(false);
    } catch (e) {
      console.error("Error saving campaign progress:", e);
      alert("Failed to save progress: " + e.message);
    }
  };

  // Unique campaign clicks aggregator helper
  const getCampaignClicks = (campName) => {
    const list = clicks.filter(c => c.campaign === campName);
    return {
      total: list.length,
      unique: new Set(list.map(c => c.recipient.toLowerCase())).size
    };
  };

  const handleResumeSavedCampaign = async (savedCamp) => {
    if (!window.confirm(`Are you sure you want to resume the paused campaign "${savedCamp.name}"? This will immediately continue dispatching to the remaining queue.`)) return;

    // Load states
    setCampaignName(savedCamp.name);
    setSubject(savedCamp.subject || '');
    setEmailBody(savedCamp.body || '');
    setDesignStyle(savedCamp.template || 'professional');
    setThemeColor(savedCamp.themeColor || '#0084ff');
    setFilterLeadType(savedCamp.filters?.leadType || 'all');
    setFilterSex(savedCamp.filters?.sex || 'all');
    setFilterGoal(savedCamp.filters?.goal || 'all');
    setSenderName(savedCamp.senderName || 'EternoFit Wellness');

    // Load queue state
    setQueueRecipients(savedCamp.queueRecipients || []);
    setQueueIndex(savedCamp.queueIndex || 0);
    setQueueSuccessCount(savedCamp.queueSuccessCount || 0);
    setQueueErrorCount(savedCamp.queueErrorCount || 0);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setQueueLog([
      ...(savedCamp.queueLog || []),
      `[${timeStr}] [INFO] Resuming paused campaign from database...`
    ]);

    setQueueModalOpen(true);
    setQueueStatus('dispatching');

    // Optionally delete from saved_campaigns since we are resuming
    try {
      await deleteDoc(doc(db, 'marketing_campaigns', savedCamp.id));
    } catch (e) {
      console.error("Failed to delete resumed campaign from DB", e);
    }
  };

  const handleDeleteSavedCampaign = async (id) => {
    if (window.confirm("Permanently delete this paused campaign? You will lose its progress and won't be able to resume it.")) {
      try {
        await deleteDoc(doc(db, 'marketing_campaigns', id));
      } catch (e) {
        alert("Failed to delete: " + e.message);
      }
    }
  };

  // paste blacklist logic helper
  const handleBlacklistLeads = async () => {
    if (!blacklistText.trim()) return;
    const lines = blacklistText.split('\n');
    const emailsToBlacklist = lines.map(l => l.trim().toLowerCase()).filter(Boolean);
    if (emailsToBlacklist.length === 0) return;

    setIsBlacklisting(true);
    setBlacklistSuccessMsg('');

    try {
      let count = 0;
      for (const rawEmail of emailsToBlacklist) {
        const q = query(collection(db, 'submissions'), where('email', '==', rawEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
          for (const d of snap.docs) {
            await updateDoc(doc(db, 'submissions', d.id), {
              blacklisted: true,
              status: 'Blacklisted'
            });
          }
        } else {
          await addDoc(collection(db, 'submissions'), {
            email: rawEmail,
            blacklisted: true,
            status: 'Blacklisted',
            answers: { name: 'Blacklisted Lead', gender: 'Other', primaryGoal: ['General Health'] },
            timestamp: new Date().toISOString()
          });
        }
        count++;
      }
      setBlacklistSuccessMsg(`Successfully blacklisted ${count} email addresses.`);
      setBlacklistText('');
    } catch (e) {
      alert("Blacklist error: " + e.message);
    } finally {
      setIsBlacklisting(false);
    }
  };

  const handleDeleteClick = async (clickId) => {
    if (window.confirm("Are you sure you want to permanently delete this traceable click log?")) {
      try {
        await deleteDoc(doc(db, 'analytics_events', clickId));
      } catch (e) {
        alert("Error deleting click log: " + e.message);
      }
    }
  };

  const handleClearAllClicks = async () => {
    if (window.confirm("Are you sure you want to permanently delete ALL traceable click logs from Firestore? This cannot be undone.")) {
      try {
        const q = query(collection(db, 'analytics_events'), where('event', '==', 'email_affiliate_clicked'));
        const snap = await getDocs(q);
        await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
        alert("All click logs cleared successfully.");
      } catch (e) {
        alert("Error clearing click logs: " + e.message);
      }
    }
  };

  const handleResetOpenersData = async () => {
    if (window.confirm("Are you sure you want to permanently delete all email open history tracking from Firestore? This will reset all emails to non-openers. This cannot be undone.")) {
      try {
        const q = query(collection(db, 'analytics_events'), where('event', '==', 'email_opened'));
        const snap = await getDocs(q);
        await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
        alert("All email open history has been cleared successfully. All contacts are now non-openers.");
      } catch (e) {
        alert("Error resetting openers data: " + e.message);
      }
    }
  };

  return (
    <div className="email-marketing-admin-container fade-enter" style={{ color: 'var(--text-main-site)' }}>
      
      {/* Visual KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Subscribers List', value: stats.totalSubscribers, desc: `${stats.quizSubscribers} Quiz | ${stats.coldSubscribers} Cold`, color: 'var(--primary)', icon: <Users size={18} /> },
          { label: 'Campaigns Ran', value: stats.campaignsCount, desc: 'Logged Campaign Runs', color: '#10b981', icon: <History size={18} /> },
          { label: 'Traceable Clicks', value: stats.totalClicksCount, desc: 'Affiliate Clicks Recorded', color: '#f59e0b', icon: <MousePointerClick size={18} /> },
          { label: 'Average CTR', value: `${stats.averageCTR}%`, desc: 'Click-Through Performance', color: '#8b5cf6', icon: <BarChart3 size={18} /> },
          { label: 'Unsubscribed Leads', value: stats.unsubscribedCount, desc: 'Compliant Opt-Outs', color: '#ef4444', icon: <AlertCircle size={18} /> }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-surface)',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: item.color }}>
              {item.icon}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>{item.label}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '4px 0 2px' }}>{item.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '1.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
        {[
          { id: 'compose', label: 'Compose Newsletter', icon: <Send size={16} /> },
          { id: 'import', label: 'Import Cold Leads', icon: <UserPlus size={16} /> },
          { id: 'history', label: 'Campaigns Archive', icon: <FileText size={16} /> },
          { id: 'clicks', label: 'Traceable Clicks Feed', icon: <MousePointerClick size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 8px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeSubTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeSubTab === tab.id ? 'var(--primary)' : 'var(--text-muted-site)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. COMPOSE & PREVIEW CAMPAIGN */}
      {activeSubTab === 'compose' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Left Hand: Compose Panel */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Settings size={20} color="var(--primary)" /> Configure Campaign
            </h3>

            {/* Campaign Presets */}
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Campaign Copy Preset</label>
                <select 
                  onChange={(e) => handleLoadPreset(e.target.value)}
                  defaultValue=""
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">-- Load a Predefined or Custom Copy Preset --</option>
                  <optgroup label="System Copy Presets">
                    <option value="blank">Blank Custom Template (Start From Scratch)</option>
                    <option value="quiz_invite">EternoFit Quiz Invitation (High Converting)</option>
                    <option value="product_promo">Product Showcase Pitch (Affiliate Pitch)</option>
                    <option value="newsletter_tips">General Wellness & Longevity Newsletter</option>
                  </optgroup>
                  {customPresets.length > 0 && (
                    <optgroup label="My Custom Saved Presets">
                      {customPresets.map(preset => (
                        <option key={preset.id} value={preset.id}>{preset.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Form to Save Current Layout as Preset */}
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text"
                  placeholder="Save current settings as new custom preset..."
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleSaveCustomPreset}
                  disabled={savingPreset || !presetNameInput.trim()}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.8rem', color: '#000', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {savingPreset ? 'Saving...' : 'Save Preset'}
                </button>
              </div>

              {/* Quick list of custom presets with delete actions if any exist */}
              {customPresets.length > 0 && (
                <div style={{ fontSize: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted-site)', fontWeight: '700' }}>Custom Presets:</span>
                  {customPresets.map(preset => (
                    <span key={preset.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {preset.name}
                      <button 
                        type="button"
                        onClick={() => handleDeleteCustomPreset(preset.id, preset.name)}
                        title={`Delete ${preset.name}`}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Row: Filter Audience */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Lead Database</label>
                <select 
                  value={filterLeadType}
                  onChange={(e) => setFilterLeadType(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">All (Leads + Cold)</option>
                  <option value="quiz">Quiz Leads Only</option>
                  <option value="cold">Cold Leads Only</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Sex</label>
                <select 
                  value={filterSex}
                  onChange={(e) => setFilterSex(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">Any Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Health Goal</label>
                <select 
                  value={filterGoal}
                  onChange={(e) => setFilterGoal(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">Any Goal</option>
                  <option value="Intimate Performance">Intimate Performance</option>
                  <option value="Muscle & Physique">Muscle & Physique</option>
                  <option value="Anti-aging & Vitality">Anti-aging & Vitality</option>
                  <option value="Skin & Beauty">Skin & Beauty</option>
                  <option value="Brain & Focus">Brain & Focus</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>Openers Segment</span>
                  <button 
                    type="button"
                    onClick={handleResetOpenersData}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '800', textDecoration: 'underline', textTransform: 'none', padding: 0 }}
                    title="Clear all email open history tracking from Firestore"
                  >
                    Reset Openers Data
                  </button>
                </label>
                <select 
                  value={filterOpener}
                  onChange={(e) => setFilterOpener(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">All Active Contacts</option>
                  <option value="openers">Openers Only</option>
                  <option value="non-openers">Non-Openers Only</option>
                </select>
              </div>
            </div>

            {/* Campaign Metrics Notification */}
            <div style={{ background: 'rgba(0, 255, 102, 0.05)', border: '1px solid rgba(0, 255, 102, 0.2)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted-site)', fontWeight: '600' }}>🎯 Selected target audience size:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1rem', fontFamily: 'monospace' }}>{targetedSubscribers.length} Subscribers</strong>
            </div>

            {/* Sender, Template, Interval and Daily Limit Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Sender Display Name</label>
                <input 
                  type="text" 
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="EternoFit Wellness"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Design Template Style</label>
                <select 
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="professional">Professional (Clinical)</option>
                  <option value="modern">Modern (Vibrant Slate)</option>
                  <option value="midnight">Midnight (Neon Dark Mode)</option>
                  <option value="minimalist">Minimalist (Direct Letter)</option>
                  <option value="blank">Raw Blank (No Header/Footer)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>Interval Delay</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>Approx. 10-20s</span>
                </label>
                <div style={{ padding: '14px 0', fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                  Delay is automatically randomized between 10 and 20 seconds to improve deliverability.
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>Daily Quota</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{dailyLimit}/day</span>
                </label>
                <input 
                  type="number" 
                  min="1" 
                  value={dailyLimit}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setDailyLimit(val);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Brand Theme Color Selector Row */}
            {designStyle !== 'minimalist' && designStyle !== 'blank' && (
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Brand Primary Color Accent</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Hex Color Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '32px', height: '32px', cursor: 'pointer', padding: 0 }}
                    />
                    <input 
                      type="text" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      placeholder="#0084ff"
                      style={{ width: '90px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', outline: 'none', fontFamily: 'monospace' }}
                    />
                  </div>
                  
                  {/* Quick Dots Selection */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                    {[
                      { name: 'Blue', hex: '#0084ff' },
                      { name: 'Green', hex: '#10b981' },
                      { name: 'Purple', hex: '#8b5cf6' },
                      { name: 'Amber', hex: '#f59e0b' },
                      { name: 'Rose', hex: '#ec4899' },
                      { name: 'Slate', hex: '#64748b' }
                    ].map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setThemeColor(col.hex)}
                        title={col.name}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: col.hex,
                          border: themeColor.toLowerCase() === col.hex.toLowerCase() ? '2px solid #fff' : '2px solid transparent',
                          boxShadow: themeColor.toLowerCase() === col.hex.toLowerCase() ? `0 0 10px ${col.hex}` : 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Name & Subject Line */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Campaign Identifier (Analytics)</label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. May Hormone Newsletter"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Subject Line</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Hi {{name}}, custom wellness evaluation"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Toolbar for personalization placeholders and product links insertion */}
            <div style={{ display: 'flex', flexFlow: 'wrap', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', alignSelf: 'center', marginRight: '4px' }}>Insert placeholders:</span>
              
              {[
                { label: 'Recipient Name', tag: '{{name}}' },
                { label: 'Recipient Email', tag: '{{email}}' },
                { label: 'Recipient Goals', tag: '{{goals}}' },
                { label: 'Health Score', tag: '{{healthScore}}' },
                { label: 'Quiz Link', tag: '{{quizLink}}' }
              ].map((ph, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertPlaceholder(ph.tag)}
                  style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  {ph.label}
                </button>
              ))}

              {/* Product Insertion Dropdowns */}
              <div style={{ display: 'flex', gap: '6px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px', marginLeft: '4px' }}>
                <select
                  id="toolbar-product-select"
                  style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', outline: 'none' }}
                >
                  <option value="">-- Choose Product --</option>
                  {globalProducts.filter(p => p.status !== 'inactive').map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const sel = document.getElementById('toolbar-product-select').value;
                    if (sel) insertPlaceholder(`{{product_box:${sel}}}`);
                  }}
                  style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: 'var(--primary)', color: '#000', border: 'none', cursor: 'pointer' }}
                >
                  + Insert Showcase Box
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sel = document.getElementById('toolbar-product-select').value;
                    if (sel) insertPlaceholder(`<a href="/click?product=${sel}" style="color:#0084ff; text-decoration:underline; font-weight:700;">Get ${sel} at Discount</a>`);
                  }}
                  style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(0, 255, 102, 0.1)', color: 'var(--primary)', border: '1px solid rgba(0, 255, 102, 0.2)', cursor: 'pointer' }}
                >
                  + Insert Traceable Link
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Email Body (Supports Custom text, placeholders, HTML & showcases)</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write your email here... Use placeholders above to customize. For product showcases, use the toolbar helper."
                rows={12}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical', lineHeight: '1.6' }}
              />
            </div>

            {/* Launch Campaign */}
            <button
              onClick={handleLaunchCampaign}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1.15rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '0.5rem'
              }}
            >
              <Send size={18} /> Launch Custom Campaign <ChevronRight size={18} />
            </button>

            <hr style={{ borderColor: 'var(--border-subtle)', margin: '1rem 0', borderStyle: 'dashed' }} />

            {/* Test Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Send Test Email</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="admin@example.com"
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(0,0,0,0.1)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail}
                  style={{
                    padding: '0 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSendingTestEmail ? '#555' : 'var(--bg-surface-elevated)',
                    color: '#fff',
                    cursor: isSendingTestEmail ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isSendingTestEmail ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Hand: Side-by-side Visual Preview Frame */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            
            {/* Preview Frame */}
            <div style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              border: '4px solid var(--bg-surface)', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              height: '100%', 
              minHeight: '640px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ background: '#f1f5f9', padding: '8px 16px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} color="#64748b" />
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Campaign Template Preview</span>
              </div>
              <iframe
                title="Visual Previewer"
                srcDoc={samplePreviewHtml}
                style={{ width: '100%', height: 'calc(100% - 32px)', border: 'none', background: '#fff' }}
              />
            </div>

          </div>

        </div>
      )}

      {/* 2. COLD LEADS & BLACKLIST MANAGER PANEL */}
      {activeSubTab === 'import' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Column 1: Cold Leads Importer */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
              <UserPlus size={20} color="var(--primary)" /> Import Cold Leads
            </h3>
            <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Directly insert high-volume cold contact lists. Format options:
              <br />
              • **Email only**: e.g. `john@example.com`
              <br />
              • **CSV pair**: `email,name` e.g. `john@example.com,John`
            </p>

            {importError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 14px', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={14} /> {importError}
              </div>
            )}

            {importSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 14px', borderRadius: '8px', color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} /> {importSuccessMsg}
              </div>
            )}

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="john@example.com,John&#10;mary@example.com,Mary&#10;steve@example.com"
              rows={6}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
            />
            
            <button
              disabled={isImporting || parsedColdLeads.filter(l => l.isValid).length === 0}
              onClick={handleImportLeads}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
            >
              {isImporting ? 'Processing Database Writes...' : `Import ${parsedColdLeads.filter(l => l.isValid).length} Valid Leads`}
            </button>

            {/* List Diagnostics Parser */}
            <div style={{ 
              border: '1px solid var(--border-subtle)', 
              background: 'rgba(0,0,0,0.1)', 
              borderRadius: '10px', 
              height: '140px', 
              overflowY: 'auto',
              padding: '10px',
              fontSize: '0.75rem'
            }}>
              {parsedColdLeads.length === 0 ? (
                <div style={{ color: 'var(--text-muted-site)', textAlign: 'center', padding: '1.5rem 0' }}>Diagnostics Parser Console</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted-site)' }}>
                      <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Line</th>
                      <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Email</th>
                      <th style={{ textAlign: 'center', paddingBottom: '4px' }}>Valid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedColdLeads.map((lead, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '4px 0', fontFamily: 'monospace', color: 'var(--text-muted-site)' }}>{lead.lineNum}</td>
                        <td style={{ padding: '4px 0', fontWeight: '600', color: lead.isValid ? 'inherit' : '#ef4444' }}>{lead.email || '—'}</td>
                        <td style={{ padding: '4px 0', textAlign: 'center' }}>
                          {lead.isValid ? <CheckCircle2 size={10} color="#10b981" /> : <AlertTriangle size={10} color="#ef4444" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Column 2: Blacklist & Bounce List Manager */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
              <AlertTriangle size={20} color="#ef4444" /> Blacklist & Bounce Manager
            </h3>
            <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Instantly blacklist or bounce problematic emails (invalid contacts, spam traps, or bounces). Paste one email address per line. Blacklisted leads are strictly barred from receiving marketing runs.
            </p>

            {blacklistSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 14px', borderRadius: '8px', color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} /> {blacklistSuccessMsg}
              </div>
            )}

            <textarea
              value={blacklistText}
              onChange={(e) => setBlacklistText(e.target.value)}
              placeholder="bounced-email@example.com&#10;spam-trap@domain.com"
              rows={6}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
            />
            
            <button
              disabled={isBlacklisting || !blacklistText.trim()}
              onClick={handleBlacklistLeads}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', border: '1px solid #ef4444', color: '#ef4444' }}
            >
              {isBlacklisting ? 'Blacklisting in Database...' : 'Blacklist pasted Email addresses'}
            </button>

            {/* Blacklist stats card */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted-site)', fontWeight: '600' }}>🛡️ Total Compliantly Blocked Contacts:</span>
              <strong style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '1rem' }}>
                {subscribers.filter(s => s.blacklisted || s.bounced || s.status === 'Blacklisted' || s.status === 'Bounced').length} leads
              </strong>
            </div>
          </div>

        </div>

        {/* Imported Cold Leads Database Manager */}
        <div style={{ marginTop: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                <Users size={20} color="var(--primary)" /> Imported Cold Leads Database Directory
              </h3>
              <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Manage your imported cold contact records. You can search, edit, or permanently delete cold leads from your active targeting queue.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontFamily: 'monospace' }}>
                Active Cold: <strong>{filteredColdLeads.length}</strong> leads
              </span>
            </div>
          </div>

          {/* Search bar inside Cold Leads manager */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 250px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-site)' }} />
                <input 
                  type="text"
                  value={coldLeadsSearch}
                  onChange={(e) => setColdLeadsSearch(e.target.value)}
                  placeholder="Search cold leads by email or name..."
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ width: '110px' }}>
              <select 
                value={coldLeadsItemsPerPage}
                onChange={(e) => setColdLeadsItemsPerPage(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <option value={10}>10 items</option>
                <option value={25}>25 items</option>
                <option value={50}>50 items</option>
              </select>
            </div>

            {coldLeadsSearch && (
              <button
                onClick={() => setColdLeadsSearch('')}
                style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', height: '40px' }}
              >
                <X size={14} /> Clear Search
              </button>
            )}
          </div>

          {filteredColdLeads.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-site)', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No imported cold leads found in database. Paste them in Column 1 to upload list!
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted-site)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Email Address</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Name / Identifier</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedColdLeads.map((sub) => {
                      const isEditing = editingColdLeadId === sub.id;
                      
                      return (
                        <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                          
                          {/* Email Column */}
                          <td style={{ padding: '12px 16px' }}>
                            {isEditing ? (
                              <input 
                                type="email"
                                value={editColdLeadEmail}
                                onChange={(e) => setEditColdLeadEmail(e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                              />
                            ) : (
                              <span style={{ fontWeight: '600', color: '#fff' }}>{sub.email}</span>
                            )}
                          </td>
                          
                          {/* Name Column */}
                          <td style={{ padding: '12px 16px' }}>
                            {isEditing ? (
                              <input 
                                type="text"
                                value={editColdLeadName}
                                onChange={(e) => setEditColdLeadName(e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                              />
                            ) : (
                              <span style={{ color: 'var(--text-muted-site)' }}>{sub.answers?.name || 'Subscriber'}</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ 
                              padding: '3px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: '700',
                              background: sub.unsubscribed || sub.blacklisted || sub.bounced ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              color: sub.unsubscribed || sub.blacklisted || sub.bounced ? '#ef4444' : '#10b981'
                            }}>
                              {sub.unsubscribed ? 'Unsubscribed' : (sub.blacklisted ? 'Blacklisted' : (sub.bounced ? 'Bounced' : 'Active Lead'))}
                            </span>
                          </td>

                          {/* Actions Column */}
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEditColdLead(sub)}
                                    style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEditColdLead}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleStartEditColdLead(sub)}
                                    style={{ background: 'rgba(0, 132, 255, 0.1)', border: '1px solid rgba(0, 132, 255, 0.3)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteColdLead(sub.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Numbered Pagination Selector Footer */}
              {filteredColdLeads.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)', borderRound: '0 0 12px 12px', marginTop: '1px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                    Showing <strong style={{ color: '#fff' }}>{(coldLeadsCurrentPage - 1) * coldLeadsItemsPerPage + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(coldLeadsCurrentPage * coldLeadsItemsPerPage, filteredColdLeads.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredColdLeads.length}</strong> cold leads
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      disabled={coldLeadsCurrentPage === 1}
                      onClick={() => setColdLeadsCurrentPage(p => Math.max(1, p - 1))}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: coldLeadsCurrentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: coldLeadsCurrentPage === 1 ? 'var(--text-muted-site)' : '#fff', cursor: coldLeadsCurrentPage === 1 ? 'not-allowed' : 'pointer', outline: 'none' }}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: coldLeadsTotalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === coldLeadsTotalPages || Math.abs(p - coldLeadsCurrentPage) <= 1)
                      .map((p, idx, arr) => {
                        const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsisBefore && <span style={{ color: 'var(--text-muted-site)', padding: '0 4px' }}>...</span>}
                            <button
                              onClick={() => setColdLeadsCurrentPage(p)}
                              style={{ width: '32px', height: '32px', borderRadius: '6px', background: coldLeadsCurrentPage === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: coldLeadsCurrentPage === p ? 'none' : '1px solid var(--border-subtle)', color: coldLeadsCurrentPage === p ? '#000' : '#fff', fontWeight: '700', cursor: 'pointer', outline: 'none', fontSize: '0.85rem' }}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      disabled={coldLeadsCurrentPage === coldLeadsTotalPages}
                      onClick={() => setColdLeadsCurrentPage(p => Math.min(coldLeadsTotalPages, p + 1))}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: coldLeadsCurrentPage === coldLeadsTotalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: coldLeadsCurrentPage === coldLeadsTotalPages ? 'var(--text-muted-site)' : '#fff', cursor: coldLeadsCurrentPage === coldLeadsTotalPages ? 'not-allowed' : 'pointer', outline: 'none' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Blocked Leads Directory */}
        <div style={{ marginTop: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
            <AlertCircle size={20} color="#ef4444" /> Bounces, Unsubscribes & Blacklisted Directory
          </h3>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
            Below is a directory of contacts in your database who have unsubscribed, bounced, or been blacklisted. You can restore their marketing eligibility by clicking "Restore Contact".
          </p>
          
          {subscribers.filter(s => s.unsubscribed || s.bounced || s.blacklisted || s.status === 'Bounced' || s.status === 'Blacklisted').length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-site)', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No contacts are currently blacklisted, bounced, or unsubscribed. Your list is 100% clean!
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted-site)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Email Address</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Block Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Lead Source</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.filter(s => s.unsubscribed || s.bounced || s.blacklisted || s.status === 'Bounced' || s.status === 'Blacklisted').map((sub) => {
                    let badgeColor = '#ef4444';
                    let badgeText = 'Blacklisted';
                    if (sub.unsubscribed) {
                      badgeColor = '#f59e0b';
                      badgeText = 'Unsubscribed';
                    } else if (sub.bounced || sub.status === 'Bounced') {
                      badgeColor = '#64748b';
                      badgeText = 'Bounced';
                    }
                    
                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '600', color: '#fff' }}>{sub.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: '700',
                            background: `rgba(${badgeColor === '#ef4444' ? '239,68,68' : (badgeColor === '#f59e0b' ? '245,158,11' : '100,116,139')}, 0.1)`,
                            color: badgeColor
                          }}>
                            {badgeText}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted-site)' }}>
                          {sub.isColdLead ? 'Cold Lead Import' : 'Quiz Submission'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleRestoreLead(sub.id)}
                            style={{
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              color: '#10b981',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; }}
                          >
                            Restore Eligibility
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>)}

      {/* 3. CAMPAIGNS HISTORICAL ARCHIVE */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {savedCampaigns.length > 0 && (
            <div className="admin-table-container" style={{ border: '1px solid #f59e0b' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderBottom: '1px solid #f59e0b' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#f59e0b' }}>
                  <Pause size={18} /> Paused / Saved Campaigns
                </h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Saved Date</th>
                    <th>Campaign Name</th>
                    <th style={{ textAlign: 'center' }}>Progress</th>
                    <th style={{ textAlign: 'center' }}>Success/Error</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedCampaigns.map((camp) => (
                    <tr key={camp.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{camp.savedAt.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td><strong>{camp.name}</strong><br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>{camp.subject}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${((camp.queueIndex || 0) / (camp.queueRecipients?.length || 1)) * 100}%`, height: '100%', background: '#f59e0b' }}></div>
                          </div>
                          <span style={{ fontSize: '0.8rem' }}>{camp.queueIndex || 0} / {camp.queueRecipients?.length || 0}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: '#10b981' }}>{camp.queueSuccessCount || 0} sent</span> / <span style={{ color: '#ef4444' }}>{camp.queueErrorCount || 0} failed</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleResumeSavedCampaign(camp)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Play size={12} /> Resume</button>
                          <button onClick={() => handleDeleteSavedCampaign(camp.id)} style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={12} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-table-container">
          {/* Controls & Filter Header */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <History size={18} color="var(--primary)" /> Campaigns Log History
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontFamily: 'monospace' }}>
                Found: <strong>{filteredCampaigns.length}</strong> campaigns
              </span>
            </div>

            <div style={{ 
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '12px',
              alignItems: 'flex-end',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {/* Search input */}
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Search Campaigns</label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-site)' }} />
                  <input 
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by campaign name or email subject..."
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Date range start */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>From Date</label>
                <input 
                  type="date"
                  value={historyStartDate}
                  onChange={(e) => setHistoryStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Date range end */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>To Date</label>
                <input 
                  type="date"
                  value={historyEndDate}
                  onChange={(e) => setHistoryEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Items Per Page */}
              <div style={{ width: '110px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Per Page</label>
                <select 
                  value={historyItemsPerPage}
                  onChange={(e) => setHistoryItemsPerPage(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value={10}>10 items</option>
                  <option value={25}>25 items</option>
                  <option value={50}>50 items</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(historySearch || historyStartDate || historyEndDate) && (
                <button
                  onClick={() => {
                    setHistorySearch('');
                    setHistoryStartDate('');
                    setHistoryEndDate('');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '40px',
                    transition: 'all 0.2s ease',
                    borderLeft: '2px solid #ef4444'
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Sent Date</th>
                <th>Campaign Name</th>
                <th>Subject</th>
                <th style={{ textAlign: 'center' }}>Recipients</th>
                <th style={{ textAlign: 'center' }}>Unique Clicks</th>
                <th style={{ textAlign: 'center' }}>Total Clicks</th>
                <th style={{ textAlign: 'center' }}>CTR %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted-site)', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={24} color="var(--text-muted-site)" />
                      <span>No campaigns found matching your current search or date range filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCampaigns.map((camp) => {
                  const clickStats = getCampaignClicks(camp.name);
                  const ctr = camp.sentCount > 0 
                    ? ((clickStats.total / camp.sentCount) * 100).toFixed(1)
                    : '0.0';
                  
                  return (
                    <tr key={camp.id}>
                      <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {camp.sentAt.toLocaleString()}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-main-site)' }}>{camp.name}</strong>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
                        {camp.subject}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', fontFamily: 'monospace' }}>
                        {camp.sentCount}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: '#3b82f6', fontFamily: 'monospace' }}>
                        {clickStats.unique}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {clickStats.total}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          background: parseFloat(ctr) > 10 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.2)',
                          color: parseFloat(ctr) > 10 ? '#10b981' : 'inherit',
                          fontWeight: '700',
                          fontFamily: 'monospace'
                        }}>
                          {ctr}%
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={async () => {
                            if (window.confirm("Permanently delete this campaign run log from archive? Clicks will be retained.")) {
                              await deleteDoc(doc(db, 'marketing_campaigns', camp.id));
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {filteredCampaigns.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.25rem 1.5rem', 
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(0,0,0,0.15)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                Showing <strong style={{ color: '#fff' }}>{(historyCurrentPage - 1) * historyItemsPerPage + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(historyCurrentPage * historyItemsPerPage, filteredCampaigns.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredCampaigns.length}</strong> campaigns
                {(historySearch || historyStartDate || historyEndDate) && <span style={{ color: 'var(--primary)' }}> (filtered)</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  disabled={historyCurrentPage === 1}
                  onClick={() => setHistoryCurrentPage(p => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: historyCurrentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: historyCurrentPage === 1 ? 'var(--text-muted-site)' : '#fff',
                    cursor: historyCurrentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: historyTotalPages }, (_, i) => i + 1)
                  .filter(p => {
                    return p === 1 || p === historyTotalPages || Math.abs(p - historyCurrentPage) <= 1;
                  })
                  .map((p, index, arr) => {
                    const showEllipsisBefore = index > 0 && p - arr[index - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsisBefore && <span style={{ color: 'var(--text-muted-site)', padding: '0 4px', fontSize: '0.8rem' }}>...</span>}
                        <button
                          onClick={() => setHistoryCurrentPage(p)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: historyCurrentPage === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            border: historyCurrentPage === p ? 'none' : '1px solid var(--border-subtle)',
                            color: historyCurrentPage === p ? '#000' : '#fff',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  disabled={historyCurrentPage === historyTotalPages}
                  onClick={() => setHistoryCurrentPage(p => Math.min(historyTotalPages, p + 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: historyCurrentPage === historyTotalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: historyCurrentPage === historyTotalPages ? 'var(--text-muted-site)' : '#fff',
                    cursor: historyCurrentPage === historyTotalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      {/* 4. EMAIL CLICK ANALYTICS FEED */}
      {activeSubTab === 'clicks' && (
        <div className="admin-table-container">
          {/* Controls & Filter Header */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <MousePointerClick size={18} color="var(--primary)" /> Real-Time Click Attribution Streams
              </h3>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontFamily: 'monospace' }}>
                  Found: <strong>{filteredClicks.length}</strong> clicks
                </span>
                <button
                  onClick={handleClearAllClicks}
                  className="btn-secondary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: 'auto',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Trash2 size={12} /> Clear Clicks Log
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '12px',
              alignItems: 'flex-end',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {/* Search input */}
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Search Clicks</label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-site)' }} />
                  <input 
                    type="text"
                    value={clicksSearch}
                    onChange={(e) => setClicksSearch(e.target.value)}
                    placeholder="Search by email, product, campaign, IP, location..."
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Date range start */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>From Date</label>
                <input 
                  type="date"
                  value={clicksStartDate}
                  onChange={(e) => setClicksStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Date range end */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>To Date</label>
                <input 
                  type="date"
                  value={clicksEndDate}
                  onChange={(e) => setClicksEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Items Per Page */}
              <div style={{ width: '110px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Per Page</label>
                <select 
                  value={clicksItemsPerPage}
                  onChange={(e) => setClicksItemsPerPage(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value={10}>10 items</option>
                  <option value={25}>25 items</option>
                  <option value={50}>50 items</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(clicksSearch || clicksStartDate || clicksEndDate) && (
                <button
                  onClick={() => {
                    setClicksSearch('');
                    setClicksStartDate('');
                    setClicksEndDate('');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '40px',
                    transition: 'all 0.2s ease',
                    borderLeft: '2px solid #ef4444'
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Recipient Email</th>
                <th>Campaign Source</th>
                <th>Product Link</th>
                <th>Location Details</th>
                <th>IP Address</th>
                <th>Merchant Target URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClicks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted-site)', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={24} color="var(--text-muted-site)" />
                      <span>No clickable analytics events found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedClicks.map((clk) => (
                  <tr key={clk.id}>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {clk.timestamp.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-main-site)' }}>
                      {clk.recipient}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#8b5cf6',
                        textTransform: 'uppercase'
                      }}>
                        {clk.campaign || 'Direct Campaign'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                        {clk.product}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={12} color="var(--accent-green)" /> {clk.location || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {clk.ip || 'Unknown'}
                    </td>
                    <td style={{ fontSize: '0.75rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                      <a href={clk.destination} target="_blank" rel="noreferrer" style={{ color: '#0084ff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Redirect <ExternalLink size={10} />
                      </a>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteClick(clk.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {filteredClicks.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.25rem 1.5rem', 
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(0,0,0,0.15)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                Showing <strong style={{ color: '#fff' }}>{(clicksCurrentPage - 1) * clicksItemsPerPage + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(clicksCurrentPage * clicksItemsPerPage, filteredClicks.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredClicks.length}</strong> click logs
                {(clicksSearch || clicksStartDate || clicksEndDate) && <span style={{ color: 'var(--primary)' }}> (filtered)</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  disabled={clicksCurrentPage === 1}
                  onClick={() => setClicksCurrentPage(p => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: clicksCurrentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: clicksCurrentPage === 1 ? 'var(--text-muted-site)' : '#fff',
                    cursor: clicksCurrentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: clicksTotalPages }, (_, i) => i + 1)
                  .filter(p => {
                    return p === 1 || p === clicksTotalPages || Math.abs(p - clicksCurrentPage) <= 1;
                  })
                  .map((p, index, arr) => {
                    const showEllipsisBefore = index > 0 && p - arr[index - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsisBefore && <span style={{ color: 'var(--text-muted-site)', padding: '0 4px', fontSize: '0.8rem' }}>...</span>}
                        <button
                          onClick={() => setClicksCurrentPage(p)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: clicksCurrentPage === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            border: clicksCurrentPage === p ? 'none' : '1px solid var(--border-subtle)',
                            color: clicksCurrentPage === p ? '#000' : '#fff',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  disabled={clicksCurrentPage === clicksTotalPages}
                  onClick={() => setClicksCurrentPage(p => Math.min(clicksTotalPages, p + 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: clicksCurrentPage === clicksTotalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: clicksCurrentPage === clicksTotalPages ? 'var(--text-muted-site)' : '#fff',
                    cursor: clicksCurrentPage === clicksTotalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DISPATCH INTERACTIVE QUEUE MODAL */}
      {queueModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            boxShadow: '0 20px 50px rgba(0,255,102,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '1.5rem 2rem', 
              borderBottom: '1px solid var(--border-subtle)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="var(--primary)" /> Custom Campaign Dispatch Queue
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>
                  Campaign: <strong>{campaignName}</strong>
                </p>
              </div>
              
              {/* Close helper when finished or paused */}
              {(queueStatus === 'completed' || queueStatus === 'cancelled') && (
                <button
                  onClick={() => setQueueModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Pulse status indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted-site)' }}>
                  Current Status:
                </span>
                
                <span style={{
                  padding: '5px 12px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: queueStatus === 'dispatching' ? 'rgba(0, 255, 102, 0.1)' : (queueStatus === 'paused' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)'),
                  color: queueStatus === 'dispatching' ? 'var(--primary)' : (queueStatus === 'paused' ? '#f59e0b' : '#cbd5e1')
                }}>
                  {queueStatus === 'dispatching' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.2s infinite' }} />}
                  {queueStatus}
                </span>
              </div>

              {/* Glowing Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span>Dispatch completeness:</span>
                  <strong style={{ fontFamily: 'monospace' }}>
                    {Math.round((queueIndex / queueRecipients.length) * 100)}% ({queueIndex} of {queueRecipients.length})
                  </strong>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ 
                    width: `${(queueIndex / queueRecipients.length) * 100}%`, 
                    height: '100%', 
                    background: 'linear-gradient(to right, var(--primary), #00d2ff)',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 10px rgba(0, 255, 102, 0.5)'
                  }} />
                </div>
              </div>

              {/* Counters Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>{queueSuccessCount}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginTop: '2px' }}>Sent Success</div>
                </div>
                
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444', fontFamily: 'monospace' }}>{queueErrorCount}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginTop: '2px' }}>Errors</div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace' }}>{queueRecipients.length - queueIndex}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginTop: '2px' }}>Remaining</div>
                </div>
              </div>

              {/* Interactive Dispatch Logs (Terminal console style) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '8px' }}>Queue Dispatch Console Logs</label>
                <div style={{
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '1rem',
                  height: '200px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  lineHeight: '1.5',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                }}>
                  {queueLog.map((logLine, idx) => (
                    <div key={idx} style={{ 
                      color: logLine.includes('FAILED') ? '#f87171' : (logLine.includes('INFO') ? '#60a5fa' : '#34d399')
                    }}>
                      {logLine}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

              {/* Interactive controls */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '0.5rem' }}>
                {queueStatus === 'dispatching' && (
                  <button
                    onClick={handlePauseQueue}
                    className="btn-secondary"
                    style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #f59e0b', color: '#f59e0b', width: 'auto' }}
                  >
                    <Pause size={14} /> Pause Dispatch
                  </button>
                )}

                {queueStatus === 'paused' && (
                  <button
                    onClick={handleResumeQueue}
                    className="btn-primary"
                    style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '6px', width: 'auto', color: '#000' }}
                  >
                    <Play size={14} /> Resume Queue
                  </button>
                )}

                {(queueStatus === 'dispatching' || queueStatus === 'paused') && (
                  <button
                    onClick={handleStopAndSaveQueue}
                    className="btn-secondary"
                    style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #ef4444', color: '#ef4444', width: 'auto' }}
                  >
                    <Square size={12} fill="#ef4444" /> Stop & Save Campaign
                  </button>
                )}

                {(queueStatus === 'completed' || queueStatus === 'cancelled') && (
                  <button
                    onClick={() => setQueueModalOpen(false)}
                    className="btn-secondary"
                    style={{ padding: '10px 24px', width: 'auto' }}
                  >
                    Close Queue Dashboard
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EmailMarketingAdmin;
```

## File: `src\firebase.js`

```js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiGKfkwog89yIQVILVg3vWrlPL1B8n8I8",
  authDomain: "eternofit-67a94.firebaseapp.com",
  projectId: "eternofit-67a94",
  storageBucket: "eternofit-67a94.firebasestorage.app",
  messagingSenderId: "143266529296",
  appId: "1:143266529296:web:50c8b939740c1180250a95",
  measurementId: "G-H46TNYLL2B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

## File: `src\index.css`

```css
/* ===== GLOBAL DESIGN TOKENS ===== */
:root {
  --bg-dark-site: #0a0a0a;
  --bg-card-site: #151515;
  --bg-surface: #1a1a1a;
  --text-main-site: #ffffff;
  --text-muted-site: #a0a0a0;
  --text-dim: #666666;
  --accent-green: #00ff66;
  --accent-green-hover: #00cc52;
  --accent-green-dim: rgba(0, 255, 102, 0.15);
  --accent-blue: #00e5ff;
  --accent-blue-dim: rgba(0, 229, 255, 0.15);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-accent: rgba(0, 255, 102, 0.3);
  --glass-dark: rgba(21, 21, 21, 0.8);
  --primary: #00ff66;
  --primary-hover: #00cc52;
  --secondary: #00e5ff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg-dark-site);
  color: var(--text-main-site);
  min-height: 100vh;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, h4 {
  font-weight: 800;
  letter-spacing: -0.02em;
}

.text-outline {
  -webkit-text-stroke: 1.5px var(--text-main-site);
  color: #000000;
  text-transform: uppercase;
}


select, input {
  accent-color: var(--accent-green);
}

select option {
  background-color: #0a0a0a;
  color: #ffffff;
}

/* ===== APP LAYOUT ===== */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--bg-dark-site);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

@media (max-width: 768px) {
  .main-content {
    justify-content: flex-start;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

/* ===== GLASSMORPHISM CARD (DARK) ===== */
.glass-card {
  background: var(--bg-card-site);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  z-index: 1;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* ===== BACKGROUND EFFECTS ===== */
.bg-glow {
  position: absolute;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(0, 255, 102, 0.06) 0%, rgba(0, 0, 0, 0) 70%);
  top: -20%;
  left: -10%;
  z-index: 0;
  pointer-events: none;
}

.bg-glow-2 {
  position: absolute;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.04) 0%, rgba(0, 0, 0, 0) 70%);
  bottom: -10%;
  right: -10%;
  z-index: 0;
  pointer-events: none;
}

/* ===== TYPOGRAPHY ===== */
.title {
  font-size: 3rem;
  color: var(--text-main-site);
  margin-bottom: 1rem;
  text-align: center;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--text-muted-site);
  text-align: center;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

/* ===== BUTTONS ===== */
.btn-primary {
  background: var(--accent-green);
  color: var(--bg-dark-site);
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px -5px rgba(0, 255, 102, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-green-hover);
  transform: translateY(-2px);
  box-shadow: 0 15px 35px -5px rgba(0, 255, 102, 0.3);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-main-site);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-green);
  color: var(--accent-green);
}

/* ===== QUIZ OPTIONS ===== */
.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;
}

.option-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 1.25rem;
  color: var(--text-main-site);
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-green);
  transform: scale(1.02);
}

.option-btn.selected {
  background: var(--accent-green-dim);
  border-color: var(--accent-green);
  box-shadow: 0 0 20px rgba(0, 255, 102, 0.1);
}

/* ===== PROGRESS BAR ===== */
.progress-container {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-green), var(--accent-blue));
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 1.5s infinite;
}

.progress-text {
  position: absolute;
  top: -25px;
  right: 0;
  font-size: 0.85rem;
  color: var(--accent-green);
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ===== PRODUCT RESULT CARDS ===== */
.product-card {
  background: var(--bg-card-site);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-green);
}

.product-title {
  font-size: 1.5rem;
  color: var(--text-main-site);
  margin-bottom: 0.5rem;
}

.product-sub {
  color: var(--accent-green);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.product-desc {
  color: var(--text-muted-site);
  line-height: 1.5;
}

/* ===== ICON CIRCLES ===== */
.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-green-dim);
  color: var(--accent-green);
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.9; }
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.5); opacity: 1; }
}

.loading-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: var(--accent-green);
  border-radius: 50%;
  display: block;
  animation: dotPulse 1s infinite ease-in-out;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

.fade-enter {
  animation: fadeInUp 0.4s forwards;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

/* ===== HEADER & FOOTER (APP INNER PAGES) ===== */
.app-header {
  padding: 1.5rem 2rem;
  background: var(--bg-dark-site);
  border-bottom: 1px solid var(--border-subtle);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-logo {
  height: 45px;
  object-fit: contain;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-green-dim);
  color: var(--accent-green);
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--border-accent);
}



.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-logo p {
  color: var(--text-muted-site);
  font-size: 0.85rem;
  margin-top: 8px;
  margin-bottom: 0;
}

.admin-link-btn {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-muted-site);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.admin-link-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--accent-green);
  border-color: var(--accent-green);
}

/* ===== HOMEPAGE WRAPPER ===== */
.home-page-wrapper {
  background-color: var(--bg-dark-site);
  color: var(--text-main-site);
  line-height: 1.6;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
}

/* ===== SITE CONTAINER ===== */
.site-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== NAVBAR ===== */
.site-navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  border-bottom: 1px solid var(--border-subtle);
}

.site-navbar .site-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.site-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.site-brand-logo {
  height: 50px;
  width: auto;
}

.site-nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.site-nav-links a {
  color: var(--text-main-site);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.site-nav-links a:hover {
  color: var(--accent-green);
}

.site-mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-main-site);
  cursor: pointer;
  padding: 8px;
}

@media (max-width: 768px) {
  .site-nav-links {
    display: none;
  }
  
  .site-nav-links.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-subtle);
    padding: 2rem;
    gap: 1.5rem;
    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
    z-index: 1000;
    animation: slideDown 0.3s ease-out;
  }
  
  .site-mobile-menu-btn {
    display: block;
  }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== HERO SECTION ===== */
.site-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  padding: 120px 0 40px;
  text-align: left;
  background: none;
  overflow: hidden;
}

.site-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.site-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}

.site-hero-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.1), var(--bg-dark-site) 90%);
}

.site-hero-content {
  max-width: 800px;
  position: relative;
  z-index: 2;
}

.site-hero h1 {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(3rem, 5vw, 5.5rem);
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
  text-transform: uppercase;
  text-align: left;
}


.site-hero p.site-subheadline {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: var(--text-muted-site);
  margin-bottom: 40px;
  max-width: 600px;
  text-align: left;
}

.site-optin-form {
  display: flex;
  gap: 12px;
  max-width: 500px;
  background: var(--glass-dark);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(8px);
}

.site-optin-form input {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-subtle);
  padding: 16px 20px;
  color: var(--text-main-site);
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.site-optin-form input:focus {
  border-color: var(--accent-blue);
}

/* ===== SECTIONS ===== */
.site-section {
  padding: 50px 0;
}

.site-section-header {
  text-align: center;
  margin-bottom: 32px;
}

.site-section-header h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.site-section-header p {
  color: var(--text-muted-site);
  font-size: 1.1rem;
}

/* ===== VIDEO GRID ===== */
.site-video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.site-video-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 9/16;
  background: var(--bg-card-site);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
}

.site-video-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.site-video-card:hover img {
  transform: scale(1.05);
}

.site-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  background: rgba(0, 255, 102, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.site-video-card:hover .site-play-btn {
  background: var(--accent-green);
  box-shadow: 0 0 30px rgba(0, 255, 102, 0.5);
  transform: translate(-50%, -50%) scale(1.1);
}

/* ===== METHODOLOGY ===== */
.site-methodology {
  background: var(--bg-card-site);
  position: relative;
}

.site-step-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 48px;
}

.site-step-card {
  padding: 32px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid var(--border-subtle);
  transition: all 0.3s ease;
}

.site-step-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(0, 229, 255, 0.3);
}

.site-step-icon {
  width: 64px;
  height: 64px;
  background: var(--accent-green-dim);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: var(--accent-green);
}

/* ===== PRODUCT GRID (HOMEPAGE) ===== */
.site-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.site-product-card {
  background: var(--bg-card-site);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.site-product-img {
  height: 220px;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.site-product-img img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  padding: 32px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.site-product-card:hover .site-product-img img {
  transform: scale(1.08);
}

.site-product-info {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.site-product-info h3 {
  font-size: 1.2rem;
  margin-bottom: 12px;
  line-height: 1.3;
}

.site-product-info p {
  font-size: 0.9rem;
  color: var(--text-muted-site);
  margin-bottom: 20px;
  flex-grow: 1;
}

.site-product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
  width: 100%;
}

/* ===== SITE BUTTONS ===== */
.site-btn-primary {
  background: var(--accent-green);
  color: #050505 !important;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 700;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.site-btn-primary:hover {
  background: var(--accent-green-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 255, 102, 0.2);
}

.site-btn-secondary {
  background: transparent;
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.site-btn-secondary:hover {
  background: var(--accent-green);
  color: #050505 !important;
}

/* ===== SITE FOOTER ===== */
.site-footer {
  background: #050505;
  padding: 64px 0 32px;
  border-top: 1px solid var(--border-subtle);
}

.site-footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
  margin-bottom: 48px;
}

.site-footer-brand p {
  color: var(--text-muted-site);
  font-size: 0.9rem;
  margin-top: 16px;
}

.site-footer-links h4 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: var(--text-main-site);
}

.site-footer-links ul {
  list-style: none;
}

.site-footer-links li {
  margin-bottom: 12px;
}

.site-footer-links a {
  color: var(--text-muted-site);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.site-footer-links a:hover {
  color: var(--accent-green);
}

.site-footer-bottom {
  border-top: 1px solid var(--border-subtle);
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.site-disclaimer {
  color: var(--text-dim);
  font-size: 0.8rem;
  max-width: 800px;
}

.site-social-links {
  display: flex;
  gap: 1.5rem;
}

.site-social-links a {
  color: var(--text-muted-site);
  transition: all 0.3s ease;
}

.site-social-links a:hover {
  color: var(--accent-green);
  transform: translateY(-2px);
}

/* Ensure site-footer remains dark even in quiz-light theme */
.quiz-light .site-footer {
  background: #050505 !important;
  color: #ffffff !important;
}

.quiz-light .site-footer p, 
.quiz-light .site-footer h4, 
.quiz-light .site-footer a {
  color: rgba(255, 255, 255, 0.7) !important;
}

.quiz-light .site-footer a:hover {
  color: var(--accent-green) !important;
}

.quiz-light .site-footer h4 {
  color: #ffffff !important;
}

.quiz-light .site-footer .site-disclaimer {
  color: rgba(255, 255, 255, 0.4) !important;
}

.site-social-links a {
  color: var(--text-muted-site);
  transition: color 0.3s ease;
}

.site-social-links a:hover {
  color: var(--accent-green);
}

/* ===== ADMIN DASHBOARD (DARK) ===== */
.admin-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-card-site);
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-subtle);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: var(--bg-surface);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-subtle);
}

.stat-label {
  color: var(--text-muted-site);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main-site);
}

.admin-table-container {
  overflow-x: auto;
  background: var(--bg-card-site);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background: var(--bg-surface);
  padding: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted-site);
  font-weight: 600;
  border-bottom: 1px solid var(--border-subtle);
}

.admin-table th svg {
  vertical-align: middle;
  margin-right: 4px;
}

.admin-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-main-site);
}

.admin-tag {
  background: var(--accent-blue-dim);
  color: var(--accent-blue);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.admin-table code {
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: monospace;
  color: var(--accent-green);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .site-nav-links {
    display: none;
  }
  
  .site-optin-form {
    flex-direction: column;
  }
  
  .site-footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .glass-card {
    padding: 2rem 1.5rem;
  }
  
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
/* ===== MARKETPLACE & GRID ENHANCEMENTS ===== */
.marketplace-page {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.products-controls select:focus,
.products-controls input:focus {
  border-color: var(--accent-green);
  box-shadow: 0 0 0 2px rgba(0, 255, 102, 0.1);
}

.site-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .marketplace-header h1 {
    font-size: clamp(2rem, 10vw, 3rem) !important;
  }
  
  .products-controls {
    flex-direction: column !important;
    gap: 1rem !important;
    padding: 1.25rem !important;
  }
  
  .products-controls > div {
    width: 100% !important;
    flex: none !important;
  }
  
  .products-controls .flex-wrap {
    flex-direction: column !important;
    width: 100% !important;
  }
  
  .products-controls select {
    width: 100% !important;
    min-width: unset !important;
  }
}
/* ===== SLIDER / TOGGLE SWITCH ===== */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--accent-green);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--accent-green);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* ===== QUIZ DARK THEME (WITH BG IMAGE) ===== */
.quiz-light {
  --bg-dark-site: transparent;
  --bg-card-site: rgba(15, 15, 15, 0.7);
  --bg-surface: rgba(255, 255, 255, 0.05);
  --text-main-site: #ffffff;
  --text-muted-site: rgba(255, 255, 255, 0.7);
  --text-dim: rgba(255, 255, 255, 0.4);
  --accent-green: #00ff66;
  --accent-green-hover: #00cc52;
  --accent-green-dim: rgba(0, 255, 102, 0.15);
  --border-subtle: rgba(255, 255, 255, 0.1);
  --border-accent: rgba(0, 255, 102, 0.3);
  --glass-dark: rgba(0, 0, 0, 0.6);
  --primary: #00ff66;
  --primary-hover: #00cc52;
  background: transparent !important;
}

.quiz-light .app-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-light .header-badge {
  background: rgba(0, 255, 102, 0.15);
  color: #00ff66;
  border-color: rgba(0, 255, 102, 0.4);
  font-weight: 800;
}

.quiz-light .app-footer {
  background: #000000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-light .footer-logo p {
  color: rgba(255, 255, 255, 0.6);
}

.quiz-light .title, .quiz-light h1, .quiz-light h2, .quiz-light h3, .quiz-light h4 {
  color: #ffffff !important;
}

.quiz-light .subtitle, .quiz-light p {
  color: rgba(255, 255, 255, 0.8) !important;
}

.quiz-light .btn-primary {
  background: #00ff66;
  color: #000000;
  box-shadow: 0 4px 14px rgba(0, 255, 102, 0.3);
}

.quiz-light .btn-primary:hover:not(:disabled) {
  background: #00cc52;
  box-shadow: 0 8px 25px rgba(0, 255, 102, 0.4);
}

.quiz-light .btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.quiz-light .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #00ff66;
  color: #00ff66;
}

.quiz-light .option-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.quiz-light .option-btn:hover {
  background: rgba(0, 255, 102, 0.05);
  border-color: #00ff66;
}

.quiz-light .option-btn.selected {
  background: rgba(0, 255, 102, 0.15);
  border-color: #00ff66;
  box-shadow: 0 0 0 3px rgba(0, 255, 102, 0.2);
}

.quiz-light .progress-container {
  background: rgba(255, 255, 255, 0.1);
}

.quiz-light .progress-fill {
  background: linear-gradient(90deg, #00ff66, #00e5ff);
}

.quiz-light .progress-text {
  color: #00ff66;
}

.quiz-light .icon-circle {
  background: rgba(0, 255, 102, 0.1);
  color: #00ff66;
}

.quiz-light .bg-glow {
  background: radial-gradient(circle, rgba(0, 255, 102, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
}

.quiz-light .loading-dots span {
  background: #00ff66;
}

.quiz-light input[type="text"],
.quiz-light input[type="email"] {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.quiz-light input[type="text"]::placeholder,
.quiz-light input[type="email"]::placeholder {
  color: rgba(255, 255, 255, 0.4) !important;
}

.quiz-light input[type="text"]:focus,
.quiz-light input[type="email"]:focus {
  border-color: #00ff66 !important;
  box-shadow: 0 0 0 3px rgba(0, 255, 102, 0.2);
}

.quiz-light .glass-card {
  background: rgba(15, 15, 15, 0.75);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* ===== TESTIMONIAL MARQUEE ===== */
.landing-layout {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-proof-section {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 3rem 0;
  overflow: hidden;
  position: relative;
}

.social-proof-title {
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 2.5rem;
  padding: 0 2rem; /* Ensure it doesn't hit edges on mobile */
  line-height: 1.4;
}

@media (max-width: 480px) {
  .social-proof-title {
    font-size: 0.75rem;
    letter-spacing: 2px;
  }
  .testimonial-marquee-card {
    width: 280px;
    padding: 1.25rem;
  }
}

.testimonial-marquee-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.testimonial-marquee-track {
  display: flex;
  width: max-content;
  gap: 1.5rem;
  animation: marquee 50s linear infinite;
}

.testimonial-marquee-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  width: 320px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.testimonial-marquee-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
}

.testimonial-quote {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.testimonial-author {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.testimonial-stars {
  color: #f59e0b;
  margin-left: 8px;
  font-size: 0.75rem;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 0.75rem)); }
}

.testimonial-marquee-container:hover .testimonial-marquee-track {
  animation-play-state: paused;
}

/* ===== ARTICLES STYLING ===== */
.article-content h1,
.article-content h2,
.article-content h3 {
  color: var(--text-main-site);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.article-content h1 { font-size: 2.5rem; }
.article-content h2 { font-size: 1.8rem; }
.article-content h3 { font-size: 1.4rem; }

.article-content p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.article-content ul,
.article-content ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.article-content li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.article-content strong {
  color: var(--accent-green);
  font-weight: 600;
}

/* Homepage article card image styles */
.site-article-img-wrapper {
  height: 260px;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.site-article-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.site-product-card:hover .site-article-img-wrapper img {
  transform: scale(1.05);
}

/* Darker glassmorphic styling for the Tools Page dashboard */
.tool-main-panel {
  background: rgba(10, 10, 10, 0.92) !important;
  backdrop-filter: blur(30px) !important;
  -webkit-backdrop-filter: blur(30px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.85) !important;
}

.tool-tab-btn {
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}

.tool-tab-btn:not(.active) {
  background: rgba(10, 10, 10, 0.65) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.tool-tab-btn.active {
  background: rgba(0, 255, 102, 0.08) !important;
  border: 1px solid rgba(0, 255, 102, 0.35) !important;
  box-shadow: 0 4px 20px rgba(0, 255, 102, 0.05) !important;
}

/* Responsive optimization for the Diagnostic Tools Dashboard on Mobile */
@media (max-width: 768px) {
  .tools-layout {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
  }
  
  .tools-sidebar {
    flex-direction: row !important;
    overflow-x: auto !important;
    padding-bottom: 0.5rem !important;
    gap: 0.5rem !important;
    scrollbar-width: none !important; /* Hide scrollbar for Firefox */
  }
  
  .tools-sidebar::-webkit-scrollbar {
    display: none !important; /* Hide scrollbar for Chrome/Safari */
  }
  
  .tool-tab-btn {
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    padding: 0.75rem 1rem !important;
    font-size: 0.85rem !important;
  }
  
  .tool-main-panel {
    padding: 1.5rem 1rem !important;
  }
  
  /* Stack all internal grid layouts vertically (Testosterone buttons, Macros, Results) */
  .tool-content div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
  
  /* Stack the flex-between headers in result panels */
  .tool-content div[style*="justify-content: space-between"] {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 1rem !important;
  }
  
  /* Reset right-aligned text in mobile stacked layouts */
  .tool-content div[style*="text-align: right"] {
    text-align: left !important;
  }
}

/* FAQ Styles */
.faq-details {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-details[open] {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--accent-green);
}

.faq-summary {
  padding: 1.25rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main-site);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.2s ease;
}

.faq-summary::-webkit-details-marker {
  display: none;
}

.faq-summary::after {
  content: '+';
  font-size: 1.5rem;
  color: var(--accent-green);
  transition: transform 0.3s ease;
  line-height: 1;
}

.faq-details[open] .faq-summary::after {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 1.5rem 1.25rem;
  color: var(--text-muted-site);
  font-size: 1rem;
  line-height: 1.6;
  border-top: 1px solid transparent;
  animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* ===== TOOLS PAGE LAYOUT ===== */
.tools-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
}
.tools-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.tool-tab-btn {
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .tools-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .tools-sidebar {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }
}

/* ===== GLOBAL DELIVERY MODE TOGGLE (ADMIN) ===== */
.admin-toggle-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-toggle-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--accent-green) !important;
}

.admin-toggle-btn.active {
  box-shadow: 0 0 12px rgba(0, 255, 102, 0.3);
}

/* ===== RESULTS INTERACTIVE DASHBOARD PRINT OVERRIDES ===== */
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .site-navbar, 
  .site-footer, 
  .app-header,
  .site-mobile-menu-btn,
  .site-footer-bottom,
  iframe,
  form,
  button,
  a,
  .bg-glow,
  .bg-glow-2,
  .results-dashboard-container > div:first-child, /* Hide top status banner */
  .results-dashboard-container > div:last-child > div:last-child /* Hide email & restart cards */
  {
    display: none !important;
  }
  .main-content {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }
  .results-dashboard-container {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .glass-card {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
    color: #000000 !important;
    padding: 0 !important;
    max-width: 100% !important;
  }
  h1, h2, h3, h4, p, span, strong, div {
    color: #000000 !important;
  }
  .product-card {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #000000 !important;
    page-break-inside: avoid;
  }
  circle {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}

/* ===== RESPONSIVE NAVBAR UTILITIES ===== */
@media (min-width: 769px) {
  .mobile-only-nav {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .desktop-only-nav {
    display: none !important;
  }
}
```

## File: `src\main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## File: `src\Marketplace.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ArrowRight, Activity, Shield, ChevronDown, X, ArrowLeft, ShoppingCart } from 'lucide-react';
import { trackEvent } from './analytics';
import SEO from './components/SEO';

const Marketplace = ({ globalProducts, navigateTo }) => {
  const [search, setSearch] = useState('');
  const initialCategory = new URLSearchParams(window.location.search).get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Default');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const categories = useMemo(() => {
    const cats = new Set(['All']);
    if (globalProducts) {
      globalProducts.forEach(p => {
        if (p.category) cats.add(p.category);
      });
    }
    return Array.from(cats);
  }, [globalProducts]);

  const filteredProducts = useMemo(() => {
    if (!globalProducts) return [];
    
    let result = globalProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.desc || p.description || '').toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    if (sortBy === 'Name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [globalProducts, search, selectedCategory, sortBy]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  // Separate digital and physical products
  const digitalProducts = filteredProducts.filter(p => p.category === 'Digital Products');
  const physicalProducts = filteredProducts.filter(p => p.category !== 'Digital Products');

  const totalPages = Math.ceil(physicalProducts.length / ITEMS_PER_PAGE);

  const paginatedPhysicalProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return physicalProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [physicalProducts, currentPage]);

  const marketplaceSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": filteredProducts.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "description": p.description || p.desc || p.rationale || '',
          "image": p.image ? `https://eternofit.com${p.image}` : undefined,
          "category": p.category,
          "offers": {
             "@type": "Offer",
             "availability": "https://schema.org/InStock"
          }
        }
      }))
    };
  }, [filteredProducts]);

  const seoTitle = selectedCategory === 'All' 
    ? "High-Performance Marketplace | EternoFit" 
    : `${selectedCategory} Supplements & Products | EternoFit Marketplace`;

  return (
    <div className="marketplace-page" style={{ background: 'var(--bg-dark-site)', minHeight: '100vh', padding: '120px 0 60px' }}>
      <SEO 
        title={seoTitle} 
        description="A curated selection of clinical-grade supplements and performance-enhancing tools for professional-grade optimization." 
        url={`https://eternofit.com/marketplace${selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`}
        schema={marketplaceSchema}
      />
      <div className="site-container">
        <div className="marketplace-header" style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: 'var(--text-main-site)', marginBottom: '1rem', lineHeight: '1.1', textTransform: 'uppercase' }}>
            ETERNO<span style={{ color: 'var(--accent-green)' }}>FIT</span> Marketplace
          </h1>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            A curated selection of clinical-grade supplements and performance-enhancing tools for professional-grade optimization.
          </p>
        </div>

        <div className="products-controls" style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1.5rem', 
          marginBottom: '3rem',
          background: 'rgba(255,255,255,0.03)',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search elite products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px 14px 44px', 
                borderRadius: '12px', 
                border: '1px solid var(--accent-green-dim)', 
                background: 'rgba(0,0,0,0.4)', 
                color: 'var(--text-main-site)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)' }} />
            {search && (
              <button 
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val);
                  window.history.replaceState({}, '', `/marketplace${val !== 'All' ? '?category=' + encodeURIComponent(val) : ''}`);
                }}
                style={{ 
                  padding: '14px 40px 14px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--accent-green-dim)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: 'var(--text-main-site)',
                  fontSize: '1rem',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  minWidth: '160px',
                  transition: 'all 0.3s ease'
                }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', pointerEvents: 'none' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '14px 40px 14px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--accent-green-dim)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: 'var(--text-main-site)',
                  fontSize: '1rem',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  minWidth: '180px',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="Default">Default Sorting</option>
                <option value="Name">Name</option>
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {digitalProducts.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={28} color="var(--accent-green)" /> Digital Protocols & Guides
            </h2>
            <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {digitalProducts.map((p, i) => (
                <div key={p.id || i} className="site-product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0, 255, 102, 0.02)', border: '1px solid rgba(0, 255, 102, 0.1)' }}>
                  <div className="site-product-img" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ maxHeight: '80%', objectFit: 'contain' }} />
                    ) : (
                      <Shield size={48} color="rgba(255,255,255,0.1)" />
                    )}
                  </div>
                  <div className="site-product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.05em' }}>{p.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{p.name}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', flex: 1 }}>{p.desc || p.description}</p>
                    <div className="site-product-footer" style={{ marginTop: 'auto' }}>
                      <span className="price" style={{ fontSize: '1.25rem' }}>Instant Access</span>
                      <button 
                        onClick={() => navigateTo('product/' + encodeURIComponent(p.name.toLowerCase().replace(/\s+/g, '-')))}
                        className="site-btn-primary" 
                        style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View Details <ArrowRight size={16} className="inline ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {paginatedPhysicalProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={28} color="var(--accent-green)" /> Clinical Supplements
            </h2>
            <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {paginatedPhysicalProducts.map((p, i) => (
                <div key={p.id || i} className="site-product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="site-product-img">
                    <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+20}`} alt={p.name} />
                  </div>
                  <div className="site-product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.05em' }}>{p.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{p.name}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted-site)', marginBottom: '1.5rem', flex: 1 }}>{p.desc || p.description}</p>
                    <div className="site-product-footer" style={{ marginTop: 'auto' }}>
                      <span className="price" style={{ fontSize: '1.25rem' }}>{p.price || 'Check Price'}</span>
                      <a 
                        href={p.affiliateLink || '#'} 
                        onClick={() => trackEvent(`${window.userSource || 'organic'}_affiliate_link_clicked`, { product: p.name, location: 'products_page' })}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`site-btn-secondary ${p.affiliateLink?.includes('lemonsqueezy.com') ? 'lemonsqueezy-button' : ''}`}
                        style={{ textDecoration: 'none' }}
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '1rem', 
                marginTop: '3.5rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.05)',
                width: 'fit-content',
                margin: '3.5rem auto 0',
                backdropFilter: 'blur(10px)'
              }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="site-btn-secondary"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    opacity: currentPage === 1 ? 0.4 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                <span style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem' }}>
                  Page <strong style={{ color: '#ffffff' }}>{currentPage}</strong> of <strong style={{ color: '#ffffff' }}>{totalPages}</strong>
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="site-btn-secondary"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    opacity: currentPage === totalPages ? 0.4 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        
        {digitalProducts.length === 0 && paginatedPhysicalProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted-site)' }}>
            <Activity size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
            <h3>No products found matching your criteria.</h3>
            <button 
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem', textDecoration: 'underline' }}
            >
              Clear all filters
            </button>
          </div>
        )}


      </div>
    </div>
  );
};

export default Marketplace;
```

## File: `src\ProductsAdmin.jsx`

```jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, CheckCircle2, XCircle, ChevronUp, ChevronDown, ArrowUpDown, Search, X } from 'lucide-react';
import { db, storage } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { products as localProducts } from './data/products';

const ProductsAdmin = ({ products, onProductChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [search, setSearch] = useState('');

  // Auto-fix existing repetitions in the database
  useEffect(() => {
    const fixRepetitions = async () => {
      const needsFixing = products.filter(p => {
        if (!p.bullets) return false;
        let bulletsArray = Array.isArray(p.bullets) ? p.bullets : (typeof p.bullets === 'string' ? p.bullets.split('\n') : []);
        if (bulletsArray.length === 0) return false;
        const unique = new Set(bulletsArray.map(b => typeof b === 'string' ? b.trim() : b).filter(Boolean));
        return unique.size !== bulletsArray.filter(Boolean).length || typeof p.bullets === 'string'; // Force arrays instead of strings
      });
      
      if (needsFixing.length > 0) {
        let fixedCount = 0;
        for (const p of needsFixing) {
          try {
            let bulletsArray = Array.isArray(p.bullets) ? p.bullets : (typeof p.bullets === 'string' ? p.bullets.split('\n') : []);
            const uniqueBullets = Array.from(new Set(bulletsArray.map(b => typeof b === 'string' ? b.trim() : b).filter(Boolean)));
            await setDoc(doc(db, "products", p.id.toString()), { bullets: uniqueBullets }, { merge: true });
            fixedCount++;
          } catch (e) {
            console.error("Failed to auto-fix product", p.id, e);
          }
        }
        if (fixedCount > 0) {
          onProductChange(); // Reload products to reflect fixed database
        }
      }
    };
    
    if (products.length > 0) {
      fixRepetitions();
    }
  }, [products, onProductChange]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const s = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.subniche.toLowerCase().includes(s)
      );
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, sortConfig, search]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleForceSync = async () => {
    if (window.confirm("This will overwrite all database products with the locally cleaned products.js file. Proceed?")) {
      try {
        let count = 0;
        for (const localProd of localProducts) {
          await setDoc(doc(db, "products", localProd.id.toString()), localProd);
          count++;
        }
        alert(`Successfully synced ${count} products to Firebase!`);
        onProductChange(); // Reload
      } catch (error) {
        console.error("Sync failed:", error);
        alert("Sync failed: " + error.message);
      }
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setFormData({ ...prod });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalData = { ...formData };
      if (typeof finalData.bullets === 'string') {
        finalData.bullets = Array.from(new Set(finalData.bullets.split('\n').map(b => b.trim()).filter(Boolean)));
      } else if (Array.isArray(finalData.bullets)) {
        finalData.bullets = Array.from(new Set(finalData.bullets.map(b => typeof b === 'string' ? b.trim() : b).filter(Boolean)));
      }
      finalData.priority = parseInt(finalData.priority) || 0;
      
      // Ensure the ID is a string for the document reference
      const docId = finalData.id.toString();
      
      // Use setDoc with merge: true to either create or update the document
      await setDoc(doc(db, "products", docId), finalData, { merge: true });
      
      onProductChange(); // Trigger reload
      setEditingId(null);
      setFormData({});
      alert("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id.toString()));
        onProductChange(); // Trigger reload
        alert("Product deleted successfully.");
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Error deleting product: " + error.message);
      }
    }
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    setEditingId('new');
    setFormData({
      id: newId,
      name: '',
      category: "Men's Health",
      subniche: '',
      priority: 0,
      description: '',
      bullets: '',
      rationale: '',
      affiliateLink: '',
      image: '',
      status: 'active'
    });
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={20} color="var(--primary)" /> Product Inventory
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={handleForceSync} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
            Sync Local Data
          </button>
          <button className="btn-primary" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search products by name, category, or subniche..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', background: '#fff' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          {search && (
            <button 
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={10} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '0 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
          {filteredProducts.length} Products
        </div>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('image')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Image {getSortIcon('image')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Name {getSortIcon('name')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('category')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Category {getSortIcon('category')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('subniche')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Subniche {getSortIcon('subniche')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('priority')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Priority {getSortIcon('priority')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('status')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Status {getSortIcon('status')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('gender')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Gender {getSortIcon('gender')}</div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editingId === 'new' && (
              <tr style={{ background: '#f8fafc' }}>
                <td colSpan="8">
                  <ProductForm 
                    formData={formData} 
                    setFormData={setFormData}
                    handleChange={handleChange} 
                    handleSave={handleSave} 
                    handleCancel={handleCancel} 
                  />
                </td>
              </tr>
            )}
            {filteredProducts.map(prod => (
              <React.Fragment key={prod.id}>
                {editingId === prod.id ? (
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan="8">
                      <ProductForm 
                        formData={formData} 
                        setFormData={setFormData}
                        handleChange={handleChange} 
                        handleSave={handleSave} 
                        handleCancel={handleCancel} 
                      />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>
                      {prod.image && <img src={prod.image} alt={prod.name} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }} />}
                    </td>
                    <td><strong style={{ color: 'var(--text)' }}>{prod.name}</strong></td>
                    <td>{prod.category}</td>
                    <td>{prod.subniche}</td>
                    <td>{prod.priority}</td>
                    <td>
                      {prod.status === 'inactive' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', background: '#fef2f2', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                          <XCircle size={14} /> Inactive
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                          <CheckCircle2 size={14} /> Active
                        </span>
                      )}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{prod.gender || 'Both'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(prod)} style={{ background: 'transparent', border: 'none', color: '#0084ff', cursor: 'pointer' }} title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(prod.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductForm = ({ formData, setFormData, handleChange, handleSave, handleCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      }, 
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
        alert("Upload failed: " + error.message);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, image: downloadURL }));
        setUploading(false);
        setProgress(0);
      }
    );
  };

  return (
  <form onSubmit={handleSave} style={{ padding: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Product Name</label>
      <input required name="name" value={formData.name || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Image</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {formData.image ? (
          <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }} />
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', padding: 0 }} title="Remove Image">&times;</button>
          </div>
        ) : (
          <div style={{ flexShrink: 0 }}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} style={{ display: 'none' }} id="image-upload" />
            <label htmlFor="image-upload" style={{ display: 'inline-block', padding: '8px 12px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', margin: 0, minWidth: '80px', textAlign: 'center' }}>
              {uploading ? `${progress}%` : '📁 Upload'}
            </label>
          </div>
        )}
        <input name="image" value={formData.image || ''} onChange={handleChange} placeholder="Or enter URL directly" style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '0' }} />
      </div>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Category</label>
      <input required name="category" value={formData.category || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Subniche</label>
      <input required name="subniche" value={formData.subniche || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Priority Score</label>
      <input type="number" name="priority" value={formData.priority || 0} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Status</label>
      <select name="status" value={formData.status || 'active'} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Target Gender</label>
      <select name="gender" value={formData.gender || 'both'} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="both">Both</option>
      </select>
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Description</label>
      <input required name="description" value={formData.description || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Clinical Rationale</label>
      <textarea name="rationale" value={formData.rationale || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '60px' }} />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Key Mechanisms (Bullets - one per line)</label>
      <textarea name="bullets" value={Array.isArray(formData.bullets) ? formData.bullets.join('\n') : (formData.bullets || '')} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px' }} />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Affiliate Link</label>
      <input required name="affiliateLink" value={formData.affiliateLink || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    
    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
      <button type="button" onClick={handleCancel} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
      <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Product</button>
    </div>
  </form>
  );
};

export default ProductsAdmin;
```

## File: `src\QuizSessionsAdmin.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Search, X, Users, Monitor, Clock, CheckCircle2, AlertCircle, Globe, Trash2, RefreshCcw, Download } from 'lucide-react';

const QuizSessionsAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | in_progress | completed | abandoned
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    const q = collection(db, 'quiz_sessions');

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          sessionId: raw.sessionId || d.id,
          ip: raw.ip || 'Unknown',
          location: raw.location || 'Unknown',
          source: raw.source || 'organic',
          currentQuestion: raw.currentQuestion ?? 0,
          currentQuestionId: raw.currentQuestionId || '—',
          totalQuestions: raw.totalQuestions || 8,
          quizFinished: raw.quizFinished || false,
          startedAt: raw.startedAt?.toDate?.() || (raw.startedAt ? new Date(raw.startedAt) : null),
          finishedAt: raw.finishedAt?.toDate?.() || (raw.finishedAt ? new Date(raw.finishedAt) : null),
          lastUpdated: raw.lastUpdated?.toDate?.() || (raw.lastUpdated ? new Date(raw.lastUpdated) : new Date()),
          name: raw.name || '',
          email: raw.email || '',
        };
      }).sort((a, b) => b.lastUpdated - a.lastUpdated); // Sort client-side by most recent
      setSessions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching quiz sessions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Question ID to label mapping
  const questionLabels = {
    'name': 'Name',
    'gender': 'Gender',
    'primaryGoal': 'Health Goals',
    'sleepQuality': 'Sleep Quality',
    'tiredness': 'Tiredness',
    'specificFocus': 'Focus Areas',
    'motivationFocus': 'Motivation',
    'performanceDecline': 'Performance',
    'completed': 'Completed ✓'
  };

  const getStatus = (session) => {
    if (session.quizFinished) return 'completed';
    // If last updated more than 30 min ago and not finished, consider abandoned
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (session.lastUpdated < thirtyMinAgo) return 'abandoned';
    return 'in_progress';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { bg: '#dcfce7', color: '#166534', label: 'Completed', icon: <CheckCircle2 size={12} /> };
      case 'in_progress':
        return { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: <Clock size={12} /> };
      case 'abandoned':
        return { bg: '#fee2e2', color: '#991b1b', label: 'Abandoned', icon: <AlertCircle size={12} /> };
      default:
        return { bg: '#f1f5f9', color: '#64748b', label: 'Unknown', icon: null };
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch = s.ip.includes(searchTerm) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());

      let matchDate = true;
      if (startDate || endDate) {
        const sessionDate = new Date(s.startedAt || s.lastUpdated);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (sessionDate < start) matchDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (sessionDate > end) matchDate = false;
        }
      }

      if (filterStatus === 'all') return matchSearch && matchDate;
      return matchSearch && matchDate && getStatus(s) === filterStatus;
    });
  }, [sessions, searchTerm, filterStatus, startDate, endDate]);

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSessions.slice(start, start + pageSize);
  }, [filteredSessions, currentPage, pageSize]);


  const stats = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter(s => s.quizFinished).length;
    const inProgress = sessions.filter(s => getStatus(s) === 'in_progress').length;
    const abandoned = sessions.filter(s => getStatus(s) === 'abandoned').length;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

    // Average drop-off question
    const droppedSessions = sessions.filter(s => !s.quizFinished);
    const avgDropoff = droppedSessions.length > 0
      ? (droppedSessions.reduce((sum, s) => sum + (s.currentQuestion || 0), 0) / droppedSessions.length).toFixed(1)
      : '—';

    return { total, completed, inProgress, abandoned, completionRate, avgDropoff };
  }, [sessions]);

  const handleClearAll = async () => {
    if (window.confirm('Permanently delete ALL quiz session records? This cannot be undone.')) {
      try {
        const snapshot = await getDocs(collection(db, 'quiz_sessions'));
        await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
        alert('All quiz session records cleared.');
      } catch (e) {
        alert('Error clearing records: ' + e.message);
      }
    }
  };

  const handleExport = () => {
    const headers = ['Session ID', 'Started', 'IP Address', 'Name', 'Email', 'Location', 'Source', 'Progress', 'Current Question', 'Status', 'Duration'];
    const rows = filteredSessions.map(s => {
      const status = getStatus(s);
      const progress = s.totalQuestions > 0 ? `${s.currentQuestion}/${s.totalQuestions}` : '0/0';
      let duration = '—';
      if (s.startedAt) {
        const endTime = s.finishedAt || s.lastUpdated;
        const diffSec = Math.floor((endTime - s.startedAt) / 1000);
        if (diffSec < 60) duration = `${diffSec}s`;
        else if (diffSec < 3600) duration = `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
        else duration = `${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
      }
      return [
        s.sessionId,
        s.startedAt ? s.startedAt.toLocaleString() : '—',
        s.ip,
        `"${s.name || ''}"`,
        `"${s.email || ''}"`,
        `"${s.location}"`,
        s.source,
        `"${progress}"`,
        `"${questionLabels[s.currentQuestionId] || s.currentQuestionId}"`,
        status,
        duration
      ];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `quiz_sessions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm('Delete this quiz session record?')) {
      try {
        await deleteDoc(doc(db, 'quiz_sessions', id));
      } catch (e) {
        alert('Error deleting: ' + e.message);
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-site)' }}>Loading quiz sessions...</div>;
  }

  return (
    <div className="quiz-sessions-admin fade-enter">
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Openers', value: stats.total, color: 'var(--primary)', icon: <Users size={18} /> },
          { label: 'Completed', value: stats.completed, color: '#10b981', icon: <CheckCircle2 size={18} /> },
          { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', icon: <Clock size={18} /> },
          { label: 'Abandoned', value: stats.abandoned, color: '#ef4444', icon: <AlertCircle size={18} /> },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, color: '#8b5cf6', icon: <Monitor size={18} /> },
          { label: 'Avg Drop-off Q', value: stats.avgDropoff, color: '#ec4899', icon: <AlertCircle size={18} /> },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bg-surface)',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: stat.color }}>
              {stat.icon}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main-site)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by IP, Location, or Session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '0.95rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'in_progress', 'completed', 'abandoned'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: filterStatus === f ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: filterStatus === f ? 'rgba(0, 255, 102, 0.1)' : 'var(--bg-surface)',
                color: filterStatus === f ? 'var(--primary)' : 'var(--text-muted-site)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '0.85rem' }}
          />
          <span style={{ color: 'var(--text-muted-site)' }}>to</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', fontSize: '0.85rem' }}
          />
          {(startDate || endDate) && (
            <button onClick={() => { setStartDate(''); setEndDate(''); }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600', height: '42px' }}>
          {filteredSessions.length} Records
        </div>
      </div>


      {/* Table */}
      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
            <Monitor size={20} color="var(--primary)" /> Quiz Session Tracker
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExport}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={handleClearAll}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Started</th>
              <th>IP Address</th>
              <th>Location</th>
              <th>Source</th>
              <th style={{ textAlign: 'center' }}>Progress</th>
              <th>Current Question</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedSessions.map((session) => {
              const status = getStatus(session);
              const badge = getStatusBadge(status);
              const progress = session.totalQuestions > 0
                ? Math.round((session.currentQuestion / session.totalQuestions) * 100)
                : 0;

              // Calculate duration
              let duration = '—';
              if (session.startedAt) {
                const endTime = session.finishedAt || session.lastUpdated;
                const diffMs = endTime - session.startedAt;
                const diffSec = Math.floor(diffMs / 1000);
                if (diffSec < 60) duration = `${diffSec}s`;
                else if (diffSec < 3600) duration = `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
                else duration = `${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
              }

              return (
                <tr key={session.id}>
                  <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {session.startedAt ? session.startedAt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                  </td>
                  <td style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {session.ip}
                    {session.name && <div style={{ fontSize: '0.75rem', color: 'var(--text-main-site)', fontFamily: 'sans-serif', marginTop: '2px', fontWeight: '500' }}>{session.name}</div>}
                    {session.email && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', fontFamily: 'sans-serif', fontWeight: 'normal' }}>{session.email}</div>}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={12} color="var(--accent-green)" /> {session.location}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: session.source === 'meta' ? 'rgba(24, 119, 242, 0.1)' : 'rgba(0, 255, 102, 0.1)',
                      color: session.source === 'meta' ? '#1877F2' : 'var(--accent-green)',
                      textTransform: 'uppercase'
                    }}>
                      {session.source}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <div style={{ flex: 1, maxWidth: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: session.quizFinished ? '#10b981' : (status === 'abandoned' ? '#ef4444' : 'var(--primary)'),
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', minWidth: '50px' }}>
                        {session.currentQuestion}/{session.totalQuestions}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {questionLabels[session.currentQuestionId] || session.currentQuestionId}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: badge.bg,
                      color: badge.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {badge.icon} {badge.label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontWeight: '600' }}>
                    {duration}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted-site)' }}>
                  No quiz sessions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
            <span>Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main-site)', outline: 'none' }}
            >
              <option value={20}>20</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
            <span style={{ marginLeft: '1rem' }}>
              Showing {filteredSessions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredSessions.length)} of {filteredSessions.length} entries
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              disabled={currentPage >= Math.ceil(filteredSessions.length / pageSize)} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredSessions.length / pageSize)))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage >= Math.ceil(filteredSessions.length / pageSize) ? 0.4 : 1, cursor: currentPage >= Math.ceil(filteredSessions.length / pageSize) ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSessionsAdmin;
```

## File: `src\ToolsPage.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Flame, 
  Clock, 
  Sparkles, 
  Moon, 
  Apple, 
  HeartPulse, 
  ChevronRight, 
  RefreshCw, 
  Zap, 
  Brain, 
  CheckCircle2, 
  Sliders, 
  ChevronDown, 
  TrendingUp, 
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';
import SEO from './components/SEO';

export const ToolsPage = ({ navigateTo, globalProducts }) => {
  const [activeTab, setActiveTab] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tool') || 'bmi';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const toolParam = urlParams.get('tool');
      if (toolParam && ['bmi', 'testosterone', 'realage', 'longevity', 'sleep', 'meal', 'stress'].includes(toolParam)) {
        setActiveTab(toolParam);
      }
    };
    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleTabSelect = (tabName) => {
    setActiveTab(tabName);
    window.history.replaceState({}, '', `/tools?tool=${tabName}`);
  };

  // Tool 1: BMI State
  const [bmiUnit, setBmiUnit] = useState('metric'); // metric / imperial
  const [heightCm, setHeightCm] = useState(175);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightKg, setWeightKg] = useState(70);
  const [weightLbs, setWeightLbs] = useState(154);
  const [bmiResult, setBmiResult] = useState(null);

  // Tool 2: Testosterone Quiz State
  const [tAnswers, setTAnswers] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
  const [tResult, setTResult] = useState(null);

  // Tool 3: Real Age State
  const [chronoAge, setChronoAge] = useState(35);
  const [lifestyle, setLifestyle] = useState({
    sleep: 'optimal', // poor, moderate, optimal
    exercise: 'moderate', // none, light, moderate, elite
    nutrition: 'balanced', // processed, balanced, longevity
    stress: 'moderate', // high, moderate, low
    toxins: 'none' // heavy, social, none
  });
  const [realAgeResult, setRealAgeResult] = useState(null);

  // Tool 4: Longevity Score State
  const [longevityInputs, setLongevityInputs] = useState({
    rhr: 65,
    vo2: 'average', // poor, average, good, elite
    grip: 'average', // weak, average, strong
    fasting: 'never', // never, occasionally, regularly
    social: 'moderate', // isolated, moderate, strong
    genetics: 'no' // yes, no
  });
  const [longevityResult, setLongevityResult] = useState(null);

  // Tool 5: Sleep Analyzer State
  const [sleepInputs, setSleepInputs] = useState({
    duration: 7,
    latency: 20,
    awakenings: 1,
    energy: 'moderate' // tired, moderate, refreshed
  });
  const [sleepResult, setSleepResult] = useState(null);

  // Tool 6: Meal Planner State
  const [mealInputs, setMealInputs] = useState({
    goal: 'recomp', // lose, build, recomp, longevity
    diet: 'standard', // standard, keto, vegan, med
    calories: 2200
  });
  const [mealResult, setMealResult] = useState(null);

  // Tool 7: Stress Checker State
  const [stressAnswers, setStressAnswers] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
  const [stressResult, setStressResult] = useState(null);
  
  // Stress Checker Box Breathing Animation State
  const [breathPhase, setBreathPhase] = useState('In'); // In, Hold (Full), Out, Hold (Empty)
  const [breathProgress, setBreathProgress] = useState(0); // 0 to 100
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Box Breathing Loop effect
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      const phaseTimes = { 'In': 4000, 'Hold (Full)': 4000, 'Out': 4000, 'Hold (Empty)': 4000 };
      const phases = ['In', 'Hold (Full)', 'Out', 'Hold (Empty)'];
      let currentPhaseIdx = phases.indexOf(breathPhase);
      let elapsed = 0;
      const tick = 100; // update progress every 100ms

      interval = setInterval(() => {
        elapsed += tick;
        const currentTotal = phaseTimes[phases[currentPhaseIdx]];
        const progress = Math.min((elapsed / currentTotal) * 100, 100);
        setBreathProgress(progress);

        if (elapsed >= currentTotal) {
          elapsed = 0;
          currentPhaseIdx = (currentPhaseIdx + 1) % 4;
          setBreathPhase(phases[currentPhaseIdx]);
          setBreathProgress(0);
        }
      }, tick);
    } else {
      setBreathProgress(0);
      setBreathPhase('In');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive, breathPhase]);

  // Logic 1: BMI Calculation
  const calculateBMI = () => {
    let heightMeters = 0;
    let weightKgFinal = 0;

    if (bmiUnit === 'metric') {
      heightMeters = heightCm / 100;
      weightKgFinal = weightKg;
    } else {
      const totalInches = (heightFt * 12) + parseInt(heightIn);
      heightMeters = (totalInches * 2.54) / 100;
      weightKgFinal = weightLbs * 0.453592;
    }

    if (heightMeters === 0) return;

    const bmi = weightKgFinal / (heightMeters * heightMeters);
    let category = '';
    let color = '';
    let advice = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = '#29b6f6';
      advice = 'Focus on a caloric surplus with clean nutrient-dense whole foods and progressive strength training to build lean muscle mass safely.';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Optimal Weight';
      color = 'var(--accent-green)';
      advice = 'Excellent! You are in the optimal biological weight range. Maintain your metabolic health with balanced nutrition and steady exercise.';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      color = '#ffb300';
      advice = 'Slight metabolic loading detected. A structured, moderate caloric deficit combined with high-protein intake and hybrid resistance training can optimize your body composition.';
    } else {
      category = 'Obese';
      color = '#ef5350';
      advice = 'Elevated metabolic and cardiovascular workload. Prioritize glycemic control, high-quality sleep, steady-state cardio (LISS), and consult an expert to design a sustainable fat-loss strategy.';
    }

    // Ideal weight ranges (BMI 18.5 to 24.9)
    let minIdealKg = 18.5 * (heightMeters * heightMeters);
    let maxIdealKg = 24.9 * (heightMeters * heightMeters);
    
    let idealRange = '';
    if (bmiUnit === 'metric') {
      idealRange = `${minIdealKg.toFixed(1)} kg - ${maxIdealKg.toFixed(1)} kg`;
    } else {
      idealRange = `${(minIdealKg / 0.453592).toFixed(1)} lbs - ${(maxIdealKg / 0.453592).toFixed(1)} lbs`;
    }

    setBmiResult({
      score: bmi.toFixed(1),
      category,
      color,
      idealRange,
      advice
    });
  };

  // Logic 2: Testosterone Quiz Calculation
  const calculateTestosterone = () => {
    const scores = Object.values(tAnswers);
    if (scores.some(s => s === 0)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const total = scores.reduce((a, b) => a + b, 0);
    let status = '';
    let rating = '';
    let color = '';
    let advice = [];

    if (total >= 17) {
      status = 'Optimal Vitality';
      rating = 'High & Clinically Stable';
      color = 'var(--accent-green)';
      advice = [
        'Maintain current high-intensity progressive overload strength training.',
        'Ensure daily dietary fat intake of at least 25-30% of total calories (essential for androgen synthesis).',
        'Prioritize deep sleep (7.5h+) to support natural sleep-cycle testosterone spikes.'
      ];
    } else if (total >= 12 && total < 17) {
      status = 'Sub-optimal Vitality';
      rating = 'Moderate / Opportunities to Optimize';
      color = '#ffb300';
      advice = [
        'Incorporate heavy compound lifts (squats, deadlifts, overhead presses) 3-4x weekly.',
        'Optimize Vitamin D3 (5,000 IU/day), Zinc Glycinate (30mg/day), and Magnesium (400mg/day).',
        'Limit sugar and alcohol consumption, which trigger cortisol spikes and reduce androgen output.'
      ];
    } else {
      status = 'Low Vitality Indicators';
      rating = 'Clinically Depleted / High Priority Optimization';
      color = '#ef5350';
      advice = [
        'Consult with a functional medicine provider for a full biological hormone panel.',
        'Implement strict sleep hygiene rules and stress-reduction protocols (high cortisol suppresses T production).',
        'Adopt a clinical strength-focused exercise routine, avoiding excessive high-stress chronic cardio.'
      ];
    }

    setTResult({
      score: total,
      maxScore: 20,
      status,
      rating,
      color,
      advice
    });
  };

  // Logic 3: Real Age Calculation
  const calculateRealAge = () => {
    let modifier = 0;
    
    // Sleep logic
    if (lifestyle.sleep === 'poor') modifier += 2.5;
    else if (lifestyle.sleep === 'moderate') modifier += 0.5;
    else modifier -= 1.5;

    // Exercise logic
    if (lifestyle.exercise === 'none') modifier += 3.0;
    else if (lifestyle.exercise === 'light') modifier += 1.0;
    else if (lifestyle.exercise === 'moderate') modifier -= 1.5;
    else modifier -= 3.0;

    // Nutrition logic
    if (lifestyle.nutrition === 'processed') modifier += 3.5;
    else if (lifestyle.nutrition === 'balanced') modifier += 0.5;
    else modifier -= 2.5;

    // Stress logic
    if (lifestyle.stress === 'high') modifier += 2.5;
    else if (lifestyle.stress === 'moderate') modifier += 0.5;
    else modifier -= 1.5;

    // Toxins logic
    if (lifestyle.toxins === 'heavy') modifier += 4.0;
    else if (lifestyle.toxins === 'social') modifier += 1.0;
    else modifier -= 2.0;

    const biologicalAge = chronoAge + modifier;
    const finalAge = parseFloat(biologicalAge.toFixed(1));
    const ageDiff = parseFloat((finalAge - chronoAge).toFixed(1));

    // Dynamic Accelerators/Decelerators lists
    const accelerators = [];
    const decelerators = [];

    if (lifestyle.sleep === 'poor') accelerators.push('Inadequate sleep cycles impairing neurological and cellular repair.');
    else if (lifestyle.sleep === 'optimal') decelerators.push('Excellent restorative sleep habits boosting growth hormone release.');

    if (lifestyle.exercise === 'none') accelerators.push('Sedentary lifestyle accelerating muscular atrophy and aerobic decline.');
    else if (lifestyle.exercise === 'elite') decelerators.push('Elite fitness output maintaining exceptional cardiovascular elasticity.');

    if (lifestyle.nutrition === 'processed') accelerators.push('Advanced glycation end-products (AGEs) inducing systemic micro-inflammation.');
    else if (lifestyle.nutrition === 'longevity') decelerators.push('Antioxidant-dense micronutrient diet shielding cells from oxidative stress.');

    if (lifestyle.stress === 'high') accelerators.push('Chronic high cortisol levels accelerating cognitive fatigue and DNA telomere shortening.');
    else if (lifestyle.stress === 'low') decelerators.push('Resilient autonomous nervous system minimizing inflammatory markers.');

    if (lifestyle.toxins === 'heavy') accelerators.push('Excessive cellular toxicity triggering free radical tissue damage.');
    else if (lifestyle.toxins === 'none') decelerators.push('Clean metabolic environment promoting peak liver and mitochondrial output.');

    setRealAgeResult({
      biologicalAge: finalAge,
      diff: ageDiff,
      accelerators: accelerators.length > 0 ? accelerators : ['No severe accelerators detected.'],
      decelerators: decelerators.length > 0 ? decelerators : ['No advanced decelerators activated yet. Up your lifestyle indicators to unlock biological shields.']
    });
  };

  // Logic 4: Longevity Score Calculation
  const calculateLongevity = () => {
    let score = 0;

    // Resting Heart Rate (Max 20)
    if (longevityInputs.rhr < 50) score += 20;
    else if (longevityInputs.rhr <= 60) score += 18;
    else if (longevityInputs.rhr <= 70) score += 14;
    else if (longevityInputs.rhr <= 80) score += 9;
    else score += 4;

    // VO2 Max (Max 20)
    if (longevityInputs.vo2 === 'elite') score += 20;
    else if (longevityInputs.vo2 === 'good') score += 16;
    else if (longevityInputs.vo2 === 'average') score += 11;
    else score += 4;

    // Grip Strength (Max 15)
    if (longevityInputs.grip === 'strong') score += 15;
    else if (longevityInputs.grip === 'average') score += 10;
    else score += 3;

    // Autophagy/Fasting (Max 15)
    if (longevityInputs.fasting === 'regularly') score += 15;
    else if (longevityInputs.fasting === 'occasionally') score += 10;
    else score += 3;

    // Social Network (Max 15)
    if (longevityInputs.social === 'strong') score += 15;
    else if (longevityInputs.social === 'moderate') score += 9;
    else score += 3;

    // Genetics (Max 15)
    if (longevityInputs.genetics === 'yes') score += 15;
    else score += 5;

    let tier = '';
    let color = '';
    let protocol = '';

    if (score >= 85) {
      tier = 'Elite Centenarian Trajectory';
      color = 'var(--accent-green)';
      protocol = 'Maintain extreme cardiorespiratory fitness (VO2 max) and muscular load. Integrate long periodic fasts (24-48h) or NAD+ boosting nutrients to activate advanced cellular longevity pathways.';
    } else if (score >= 60 && score < 85) {
      tier = 'Good Longevity Horizon';
      color = '#ffb300';
      protocol = 'Improve zone 2 aerobic base to lower your resting heart rate. Focus on grip and core strength (critical biomarkers for longevity). Increase intake of sirtuin-activating foods (blueberries, dark leafy greens, olive oil).';
    } else {
      tier = 'Accelerated Biological Decline Trap';
      color = '#ef5350';
      protocol = 'Urgent longevity intervention required. Prioritize physical strength training and cardiorespiratory health to escape risk indices. Integrate stress management and basic social connection habits immediately.';
    }

    setLongevityResult({
      score,
      tier,
      color,
      protocol
    });
  };

  // Logic 5: Sleep Analyzer Calculation
  const calculateSleep = () => {
    let score = 100;

    // Duration deductions
    const dur = sleepInputs.duration;
    if (dur < 6) score -= (6 - dur) * 15;
    else if (dur > 9) score -= (dur - 9) * 8;
    else if (dur >= 7 && dur <= 8.5) score += 5; // sweet spot bonus

    // Latency deductions
    const lat = sleepInputs.latency;
    if (lat > 45) score -= 15;
    else if (lat > 25) score -= 7;

    // Awakening deductions
    const awk = parseInt(sleepInputs.awakenings);
    score -= awk * 8;

    // Morning Energy modifier
    if (sleepInputs.energy === 'tired') score -= 15;
    else if (sleepInputs.energy === 'refreshed') score += 5;

    score = Math.max(10, Math.min(score, 100));

    // Calculate Sleep Efficiency
    const sleepEfficiency = Math.max(30, Math.min(Math.round(((dur - (lat / 60)) / dur) * 100), 100));

    let advice = [];
    if (lat > 25) advice.push("Implement a strict screens-out caffeine curfew 10 hours before bed. Read physical pages to quiet nervous system chatter.");
    if (awk >= 2) advice.push("Avoid all liquids 2 hours prior to sleep. Keep the bedroom temperature strictly between 62-67°F (16-19°C) to support core body cooldown.");
    if (dur < 6.5) advice.push("Optimize master circadian timing by walking outdoors within 30 minutes of waking up for at least 10 minutes of direct morning light.");

    if (advice.length === 0) advice.push("Outstanding sleep architect structure! Keep your bedtime and wake-up times within a tight 30-minute consistency window.");

    setSleepResult({
      score,
      efficiency: sleepEfficiency,
      rating: score >= 85 ? 'Elite Restorative sleep' : score >= 65 ? 'Adequate / Restless cycles' : 'Poor Circadian Disruption',
      color: score >= 85 ? 'var(--accent-green)' : score >= 65 ? '#ffb300' : '#ef5350',
      advice
    });
  };

  // Logic 6: Meal Planner Calculation
  const calculateMealPlan = () => {
    let cals = mealInputs.calories;
    let goalLabel = '';
    let pRatio = 0, cRatio = 0, fRatio = 0;
    let meals = [];

    // Macro distribution based on Diet & Goal
    if (mealInputs.diet === 'keto') {
      pRatio = 0.25;
      cRatio = 0.05;
      fRatio = 0.70;
    } else if (mealInputs.diet === 'vegan') {
      pRatio = 0.20;
      cRatio = 0.55;
      fRatio = 0.25;
    } else if (mealInputs.diet === 'med') {
      pRatio = 0.25;
      cRatio = 0.40;
      fRatio = 0.35;
    } else { // standard / high protein
      if (mealInputs.goal === 'build') {
        pRatio = 0.30;
        cRatio = 0.45;
        fRatio = 0.25;
      } else {
        pRatio = 0.40;
        cRatio = 0.30;
        fRatio = 0.30;
      }
    }

    const pGrams = Math.round((cals * pRatio) / 4);
    const cGrams = Math.round((cals * cRatio) / 4);
    const fGrams = Math.round((cals * fRatio) / 9);

    if (mealInputs.goal === 'lose') goalLabel = 'Accelerated Lipolysis (Fat Loss)';
    else if (mealInputs.goal === 'build') goalLabel = 'Lean Hypertrophy (Muscle Gain)';
    else if (mealInputs.goal === 'recomp') goalLabel = 'Biological Recomposition (Gain Muscle & Burn Fat)';
    else goalLabel = 'Anti-Inflammatory Cellular Longevity';

    // Generates delicious meal templates based on diet selection
    if (mealInputs.diet === 'keto') {
      meals = [
        { name: 'Breakfast: Keto Power Scramble', desc: '3 whole cage-free eggs cooked in grass-fed butter, with half an avocado, fresh spinach, and organic bacon.' },
        { name: 'Lunch: Tuscan Grilled Salmon Plate', desc: '6oz wild-caught salmon over a bed of baby arugula, tossed in high-polyphenol olive oil, cherry tomatoes, and sliced almonds.' },
        { name: 'Snack: Macadamia Crunch', desc: '1.5 oz raw macadamia nuts alongside 1 cup of unsweetened almond milk.' },
        { name: 'Dinner: Ribeye & Herb Garlic Butter', desc: '8oz pasture-raised ribeye steak served with steamed asparagus spears, liberally drizzled with organic olive oil.' }
      ];
    } else if (mealInputs.diet === 'vegan') {
      meals = [
        { name: 'Breakfast: Organic Berry Oatmeal Bowl', desc: '1 cup organic rolled oats, 1 scoop organic pea-isolate protein powder, organic blueberries, chia seeds, and pumpkin seeds.' },
        { name: 'Lunch: Spiced Quinoa & Lentil Macro Bowl', desc: '1 cup cooked red quinoa, 1 cup organic sprouted lentils, roasted sweet potato wedges, steamed broccoli, and avocado-lemon dressing.' },
        { name: 'Snack: Green Longevity Smoothie', desc: '1 organic banana, 1.5 cups baby kale, hemp seeds, 1 tbsp organic peanut butter, blended with cold coconut water.' },
        { name: 'Dinner: Crispy Herb Organic Tofu stirfry', desc: '7oz organic extra firm tofu cubed and skillet-seared, served over wild rice with snap peas, bell peppers, and low-sodium tamari.' }
      ];
    } else { // Standard & Mediterranean
      meals = [
        { name: 'Breakfast: High-Protein Muscle Fuel Scramble', desc: '4 egg whites + 1 whole egg scrambled, with 1 cup sautéed spinach, served with 2 slices of whole sprouted grain sourdough bread.' },
        { name: 'Lunch: Greek Herb Chicken Breast Macro Bowl', desc: '6.5oz herb-marinated grilled chicken breast, 1 cup cooked tri-color quinoa, roasted zucchini, and Greek kalamata olives.' },
        { name: 'Snack: Greek Yogurt & Raw Almonds', desc: '1 cup plain organic high-protein Greek yogurt, half a cup of fresh raspberries, and 15 raw organic almonds.' },
        { name: 'Dinner: Wild-Caught Halibut or Steak & Sweet Potato', desc: '7oz wild-caught halibut fillet or grass-fed sirloin steak, baked sweet potato with cinnamon, and steam-seared green beans.' }
      ];
    }

    setMealResult({
      goalLabel,
      calories: cals,
      macros: { pGrams, cGrams, fGrams },
      meals
    });
  };

  // Logic 7: Stress Checker Calculation
  const calculateStress = () => {
    const scores = Object.values(stressAnswers);
    if (scores.some(s => s === 0)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const total = scores.reduce((a, b) => a + b, 0);
    let level = '';
    let description = '';
    let color = '';
    let hrvEstimate = '';

    if (total <= 9) {
      level = 'Optimal Nervous System Balance (Low Stress)';
      description = 'Your sympathetic and parasympathetic nervous systems are in exceptional homeostasis. You possess excellent cardiovascular and cognitive resilience.';
      color = 'var(--accent-green)';
      hrvEstimate = 'High (80-110 ms) - Indicating elite heart rhythm adaptability.';
    } else if (total >= 10 && total <= 15) {
      level = 'Moderate Allostatic Load (Mild Sympathetic Overdrive)';
      description = 'Systemic fatigue is beginning to load your adrenals. You are spending excessive periods in "fight or flight" mode. Prioritize box-breathing and regular screen fasts.';
      color = '#ffb300';
      hrvEstimate = 'Moderate (45-75 ms) - Showing mild autonomous system strain.';
    } else {
      level = 'Chronic Allostatic Load (Severe Burnout Indication)';
      description = 'Your autonomous nervous system is experiencing chronic sympathetic lock. Cortisol indices are likely chronically elevated, which damages mitochondrial recovery and sleep quality.';
      color = '#ef5350';
      hrvEstimate = 'Low (15-40 ms) - High risk of clinical chronic fatigue and systemic inflammation.';
    }

    setStressResult({
      score: total,
      level,
      description,
      color,
      hrvEstimate
    });
  };

  // Recommended Products Logic
  const renderRecommendedProducts = () => {
    if (!globalProducts || globalProducts.length === 0) return null;
    let relevantProducts = [];
    
    if (activeTab === 'bmi') {
       relevantProducts = globalProducts.filter(p => p.subniche === 'Fat Loss' || p.category === 'General Health');
    } else if (activeTab === 'testosterone') {
       relevantProducts = globalProducts.filter(p => p.subniche === 'Testosterone Boost');
    } else if (activeTab === 'sleep' || activeTab === 'stress') {
       relevantProducts = globalProducts.filter(p => p.subniche === 'Brain Health' || p.name.includes('Magnesium'));
    } else if (activeTab === 'realage' || activeTab === 'longevity') {
       relevantProducts = globalProducts.filter(p => p.category === 'Anti-aging');
    } else if (activeTab === 'meal') {
       relevantProducts = globalProducts.filter(p => p.category === 'General Health' || p.subniche === 'Fat Loss');
    }
    
    // Fallback if none matched
    if (relevantProducts.length === 0) {
      relevantProducts = globalProducts;
    }
    
    const displayProducts = [...relevantProducts].sort(() => 0.5 - Math.random()).slice(0, 2);
    
    if (displayProducts.length === 0) return null;
    
    return (
      <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main-site)' }}>Recommended For You</h3>
        <div className="site-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {displayProducts.map((p, i) => (
            <div key={i} className="site-product-card" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="site-product-img" style={{ height: '160px' }}>
                <img src={p.image || `https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&sig=${i+10}`} alt={p.name} style={{ objectFit: 'contain' }} />
              </div>
              <div className="site-product-info" style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{p.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description || p.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{p.price || 'Check Price'}</span>
                  <a href={p.affiliateLink || '#'} target="_blank" rel="noopener noreferrer" className="site-btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>View</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const seoConfig = useMemo(() => {
    switch (activeTab) {
      case 'bmi':
        return {
          title: "Free BMI & Body Composition Calculator | EternoFit",
          description: "Calculate your body mass index, optimal biological weight ranges, and custom body composition strategies with our clinical-grade tool.",
          keywords: "bmi calculator, body mass index, ideal body weight, fat loss planner, body fat calculator, clinical health metrics",
          url: "https://eternofit.com/tools?tool=bmi",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit BMI & Body Composition Calculator",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        };
      case 'testosterone':
        return {
          title: "Free Testosterone Deficit Assessment Quiz | EternoFit",
          description: "Assess your biological vitality. Take our clinical-grade 60-second testosterone deficiency indicator quiz.",
          keywords: "testosterone quiz, testosterone assessment, low testosterone test, low T check, male vitality index, hormone health",
          url: "https://eternofit.com/tools?tool=testosterone",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit Testosterone Deficit Assessment Quiz",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        };
      case 'realage':
        return {
          title: "Biological Age & Longevity Clock Calculator | EternoFit",
          description: "Calculate your biological age versus chronological age based on modern lifestyle, circadian, and wellness biomarkers.",
          keywords: "biological age calculator, longevity clock, biological age test, health span analyzer, lifestyle age, rate of aging",
          url: "https://eternofit.com/tools?tool=realage",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit Biological Age & Longevity Clock",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        };
      case 'longevity':
        return {
          title: "Free Healthspan & Longevity Score Assessment | EternoFit",
          description: "Evaluate your cardiorespiratory base, grip strength, fasting indicators, and autonomic wellness to estimate your longevity trajectory.",
          keywords: "longevity calculator, longevity score, healthspan test, cardiovascular health indicator, grip strength biomarker, biological resilience",
          url: "https://eternofit.com/tools?tool=longevity",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit Longevity Score Assessment",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        };
      case 'sleep':
        return {
          title: "Clinical Sleep Quality & Circadian Efficiency Analyzer | EternoFit",
          description: "Analyze sleep latency, awakening cycles, and circadian rhythm efficiency. Get expert optimization guidelines.",
          keywords: "sleep quality analyzer, circadian efficiency, sleep latency calculator, deep sleep restorative test, sleep hygiene scorecard, insomnia tracker",
          url: "https://eternofit.com/tools?tool=sleep",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit Circadian Sleep Quality Analyzer",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        };
      case 'meal':
        return {
          title: "Personalized Anti-Inflammatory Meal Plan Builder | EternoFit",
          description: "Build a highly customized anti-inflammatory meal plan aligned with keto, vegan, or Mediterranean protocols.",
          keywords: "anti-inflammatory meal planner, personalized meal builder, clean keto meal plan, plant based meal tracker, mediterranean nutrition builder",
          url: "https://eternofit.com/tools?tool=meal",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit Anti-Inflammatory Meal Plan Builder",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        };
      case 'stress':
        return {
          title: "Autonomous Nervous System & Stress Load Checker | EternoFit",
          description: "Check your adrenal stress index and autonomous nervous system balance. Access interactive box-breathing bio-tools.",
          keywords: "stress load checker, autonomous nervous system, hrv index estimate, adrenal fatigue test, box breathing tool, anxiety tracker",
          url: "https://eternofit.com/tools?tool=stress",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit Stress Load & Autonomic Nervous System Checker",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        };
      default:
        return {
          title: "Clinical Health Tools & Calculators | EternoFit",
          description: "Science-backed diagnostic tools, bio-calculators, and lifestyle analyzers to measure and advance your healthspan.",
          keywords: "clinical health assessment, performance optimization, tactical fitness, bio-identical nutrition, longevity protocols, health coaching, hormone health",
          url: "https://eternofit.com/tools",
          schema: null
        };
    }
  }, [activeTab]);

  return (
    <div className="tools-page-container" style={{ background: 'transparent', minHeight: '80vh', color: 'var(--text-main-site)' }}>
      <SEO 
        title={seoConfig.title} 
        description={seoConfig.description} 
        keywords={seoConfig.keywords}
        url={seoConfig.url} 
        schema={seoConfig.schema}
      />
      {/* Main Content */}
      <div className="site-container" style={{ paddingTop: '120px', paddingBottom: '5rem' }}>
        <div className="site-section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.2 }}>
            EternoFit <span style={{ color: 'var(--accent-green)' }}>Optimization Dashboards</span>
          </h1>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '1.15rem', maxWidth: '650px', margin: '1rem auto 0' }}>
            Science-backed diagnostic tools, bio-calculators, and lifestyle analyzers to measure and advance your healthspan.
          </p>
        </div>

        <div className="tools-layout">
          {/* Sidebar Tabs */}
          <div className="tools-sidebar">
            <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-muted-site)', marginBottom: '0.75rem', fontWeight: '700' }}>Select Diagnostic Tool</h4>
            
            <button 
              className={`tool-tab-btn ${activeTab === 'bmi' ? 'active' : ''}`}
              onClick={() => handleTabSelect('bmi')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '10px',
                background: activeTab === 'bmi' ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-surface)',
                border: activeTab === 'bmi' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                color: activeTab === 'bmi' ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.25s ease'
              }}
            >
              <Activity size={18} style={{ color: activeTab === 'bmi' ? 'var(--accent-green)' : 'inherit' }} />
              <span>BMI Calculator</span>
            </button>
 
            <button 
              className={`tool-tab-btn ${activeTab === 'testosterone' ? 'active' : ''}`}
              onClick={() => handleTabSelect('testosterone')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '10px',
                background: activeTab === 'testosterone' ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-surface)',
                border: activeTab === 'testosterone' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                color: activeTab === 'testosterone' ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.25s ease'
              }}
            >
              <Flame size={18} style={{ color: activeTab === 'testosterone' ? 'var(--accent-green)' : 'inherit' }} />
              <span>Testosterone Quiz</span>
            </button>
 
            <button 
              className={`tool-tab-btn ${activeTab === 'realage' ? 'active' : ''}`}
              onClick={() => handleTabSelect('realage')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '10px',
                background: activeTab === 'realage' ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-surface)',
                border: activeTab === 'realage' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                color: activeTab === 'realage' ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.25s ease'
              }}
            >
              <Clock size={18} style={{ color: activeTab === 'realage' ? 'var(--accent-green)' : 'inherit' }} />
              <span>Real Age Calculator</span>
            </button>
 
            <button 
              className={`tool-tab-btn ${activeTab === 'longevity' ? 'active' : ''}`}
              onClick={() => handleTabSelect('longevity')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '10px',
                background: activeTab === 'longevity' ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-surface)',
                border: activeTab === 'longevity' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                color: activeTab === 'longevity' ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.25s ease'
              }}
            >
              <Sparkles size={18} style={{ color: activeTab === 'longevity' ? 'var(--accent-green)' : 'inherit' }} />
              <span>Longevity Score</span>
            </button>
 
            <button 
              className={`tool-tab-btn ${activeTab === 'sleep' ? 'active' : ''}`}
              onClick={() => handleTabSelect('sleep')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '10px',
                background: activeTab === 'sleep' ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-surface)',
                border: activeTab === 'sleep' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                color: activeTab === 'sleep' ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.25s ease'
              }}
            >
              <Moon size={18} style={{ color: activeTab === 'sleep' ? 'var(--accent-green)' : 'inherit' }} />
              <span>Sleep Analyzer</span>
            </button>
 
            <button 
              className={`tool-tab-btn ${activeTab === 'meal' ? 'active' : ''}`}
              onClick={() => handleTabSelect('meal')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '10px',
                background: activeTab === 'meal' ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-surface)',
                border: activeTab === 'meal' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                color: activeTab === 'meal' ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.25s ease'
              }}
            >
              <Apple size={18} style={{ color: activeTab === 'meal' ? 'var(--accent-green)' : 'inherit' }} />
              <span>Meal Planner</span>
            </button>
 
            <button 
              className={`tool-tab-btn ${activeTab === 'stress' ? 'active' : ''}`}
              onClick={() => handleTabSelect('stress')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '10px',
                background: activeTab === 'stress' ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-surface)',
                border: activeTab === 'stress' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                color: activeTab === 'stress' ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.25s ease'
              }}
            >
              <HeartPulse size={18} style={{ color: activeTab === 'stress' ? 'var(--accent-green)' : 'inherit' }} />
              <span>Stress Checker</span>
            </button>
          </div>

          {/* Main Dashboard Card Panel */}
          <div className="tool-main-panel" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
            
            {/* TOOL 1: BMI CALCULATOR */}
            {activeTab === 'bmi' && (
              <div className="tool-content">
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity color="var(--accent-green)" /> BMI & Body Composition Calculator
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '2rem' }}>
                  Calculates your body mass index, optimal biological weight ranges, and custom body composition strategies.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button 
                    onClick={() => setBmiUnit('metric')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-site)',
                      background: bmiUnit === 'metric' ? 'rgba(0,230,118,0.1)' : 'transparent',
                      color: bmiUnit === 'metric' ? 'var(--accent-green)' : 'var(--text-muted-site)',
                      fontWeight: '600', cursor: 'pointer', border: bmiUnit === 'metric' ? '1px solid var(--accent-green)' : '1px solid var(--border-site)'
                    }}
                  >
                    Metric (cm / kg)
                  </button>
                  <button 
                    onClick={() => setBmiUnit('imperial')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-site)',
                      background: bmiUnit === 'imperial' ? 'rgba(0,230,118,0.1)' : 'transparent',
                      color: bmiUnit === 'imperial' ? 'var(--accent-green)' : 'var(--text-muted-site)',
                      fontWeight: '600', cursor: 'pointer', border: bmiUnit === 'imperial' ? '1px solid var(--accent-green)' : '1px solid var(--border-site)'
                    }}
                  >
                    Imperial (ft-in / lbs)
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {bmiUnit === 'metric' ? (
                    <div>
                      <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Height: {heightCm} cm</label>
                      <input 
                        type="range" min="120" max="220" value={heightCm} 
                        onChange={(e) => { setHeightCm(e.target.value); setBmiResult(null); }}
                        style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }} 
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Height: {heightFt} ft</label>
                        <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                          value={heightFt} 
                          onChange={(e) => { setHeightFt(parseInt(e.target.value)); setBmiResult(null); }}
                          style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                        >
                          {[4,5,6,7].map(ft => <option key={ft} value={ft}>{ft} ft</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Inches: {heightIn} in</label>
                        <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                          value={heightIn} 
                          onChange={(e) => { setHeightIn(parseInt(e.target.value)); setBmiResult(null); }}
                          style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                        >
                          {[0,1,2,3,4,5,6,7,8,9,10,11].map(inch => <option key={inch} value={inch}>{inch} in</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>
                      Weight: {bmiUnit === 'metric' ? `${weightKg} kg` : `${weightLbs} lbs`}
                    </label>
                    <input 
                      type="range" 
                      min={bmiUnit === 'metric' ? '40' : '90'} 
                      max={bmiUnit === 'metric' ? '150' : '330'} 
                      value={bmiUnit === 'metric' ? weightKg : weightLbs} 
                      onChange={(e) => { 
                        if (bmiUnit === 'metric') setWeightKg(e.target.value);
                        else setWeightLbs(e.target.value);
                        setBmiResult(null);
                      }}
                      style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }} 
                    />
                  </div>

                  <button 
                    onClick={calculateBMI}
                    className="site-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '1rem' , textAlign: 'center', justifyContent: 'center'}}
                  >
                    Analyze
                  </button>
                </div>

                {bmiResult && (
                  <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '12px' }} className="fade-in-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted-site)' }}>Your Body Mass Index</span>
                        <h3 style={{ fontSize: '3rem', fontWeight: '800', margin: '0.2rem 0', color: bmiResult.color }}>{bmiResult.score}</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '1px' }}>Classification</span>
                        <h4 style={{ fontSize: '1.35rem', fontWeight: '700', margin: '0.2rem 0', color: bmiResult.color }}>{bmiResult.category}</h4>
                      </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: `4px solid ${bmiResult.color}`, marginBottom: '1.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-muted-site)' }}>
                        <strong>Diagnostic Advice:</strong> {bmiResult.advice}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted-site)', paddingTop: '1rem', borderTop: '1px solid var(--border-site)' }}>
                      <span>Ideal Weight Target (BMI 18.5 - 24.9):</span>
                      <span style={{ color: 'var(--text-main-site)', fontWeight: '700' }}>{bmiResult.idealRange}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 2: TESTOSTERONE QUIZ */}
            {activeTab === 'testosterone' && (
              <div className="tool-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <div style={{
                    padding: '5px 14px', borderRadius: '100px',
                    background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.2)',
                    fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-green)',
                    textTransform: 'uppercase', letterSpacing: '1px'
                  }}>
                    5 Questions
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                    {Object.values(tAnswers).filter(v => v !== 0).length}/5 answered
                  </span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Flame color="var(--accent-green)" /> Androgen Level & Vitality Assessment
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '1rem' }}>
                  A clinical assessment framework analyzing daily vitality, metabolic recovery, and androgen health markers.
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ height: '4px', background: 'var(--border-site)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '100px',
                      background: 'linear-gradient(90deg, var(--accent-green), #00e676)',
                      width: `${(Object.values(tAnswers).filter(v => v !== 0).length / 5) * 100}%`,
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 12px rgba(0, 230, 118, 0.3)'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { key: 'q1', label: 'Daily Energy & Recovery Profiles', options: [{text: 'High energy, stable all day long', val: 4}, {text: 'Moderate energy, slight mid-day slump', val: 3}, {text: 'Frequent brain fog and sluggish recovery', val: 2}, {text: 'Severe chronic fatigue/exhaustion', val: 1}] },
                    { key: 'q2', label: 'Physical Performance & Muscle Recovery', options: [{text: 'Excellent strength progression & fast healing', val: 4}, {text: 'Stable strength, but recovery feels longer', val: 3}, {text: 'Loss of muscular fullness and strength', val: 2}, {text: 'Significant muscle atrophy & joint pain', val: 1}] },
                    { key: 'q3', label: 'Focus, Motivation, & Libido Indicator', options: [{text: 'Unstoppable drive, sharp focus, high libido', val: 4}, {text: 'Balanced focus and baseline libido', val: 3}, {text: 'Reduced drive, easy distraction, low libido', val: 2}, {text: 'Chronic apathy, zero focus, severe vitality loss', val: 1}] },
                    { key: 'q4', label: 'Restorative Sleep & Morning Arousal', options: [{text: 'Wake up highly recharged & biological alert', val: 4}, {text: 'Adequate sleep but occasional grogginess', val: 3}, {text: 'Wake up frequently tired with restless sleep', val: 2}, {text: 'Restless wakeups, zero morning alerts, exhausted', val: 1}] },
                    { key: 'q5', label: 'Physical Body Composition & Body Fat Shift', options: [{text: 'Clean body composition, easy muscle holding', val: 4}, {text: 'Hold steady weight but slight soft spots', val: 3}, {text: 'Noticeable belly and chest fat accumulation', val: 2}, {text: 'Stubborn soft midsection, hard to hold lean muscle', val: 1}] }
                  ].map((q, idx) => (
                    <div key={q.key} className="tool-question-card" style={{
                      padding: '1.75rem',
                      background: tAnswers[q.key] !== 0 ? 'rgba(0, 230, 118, 0.02)' : 'var(--bg-surface)',
                      borderRadius: idx === 0 ? '16px 16px 0 0' : idx === 4 ? '0 0 16px 16px' : '0',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderBottom: idx < 4 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      transition: 'background 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{
                          minWidth: '36px', height: '36px', borderRadius: '10px',
                          background: tAnswers[q.key] !== 0 ? 'var(--accent-green)' : 'var(--border-site)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.85rem', fontWeight: '800',
                          color: tAnswers[q.key] !== 0 ? '#0a0a0a' : 'var(--text-muted-site)',
                          transition: 'all 0.3s ease'
                        }}>
                          {tAnswers[q.key] !== 0 ? <CheckCircle2 size={18} /> : (idx + 1)}
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main-site)', margin: 0, lineHeight: '1.4', paddingTop: '6px' }}>{q.label}</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '52px' }}>
                        {q.options.map(opt => {
                          const isSelected = tAnswers[q.key] === opt.val;
                          return (
                            <button
                              key={opt.val}
                              onClick={() => {
                                setTAnswers(prev => ({ ...prev, [q.key]: opt.val }));
                                setTResult(null);
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 16px', borderRadius: '10px',
                                border: isSelected ? '1.5px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.06)',
                                background: isSelected ? 'rgba(0, 230, 118, 0.08)' : 'transparent',
                                color: isSelected ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                                fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                                transition: 'all 0.2s ease', fontWeight: isSelected ? '600' : '400',
                                backdropFilter: isSelected ? 'blur(8px)' : 'none'
                              }}
                              onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}}
                              onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-site)'; }}}
                            >
                              <span style={{
                                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                                border: isSelected ? '5px solid var(--accent-green)' : '2px solid rgba(255,255,255,0.2)',
                                background: isSelected ? '#0a0a0a' : 'transparent',
                                transition: 'all 0.2s ease',
                                boxShadow: isSelected ? '0 0 8px rgba(0,230,118,0.3)' : 'none'
                              }} />
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={calculateTestosterone}
                    disabled={Object.values(tAnswers).some(v => v === 0)}
                    className="site-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '1rem' , textAlign: 'center', justifyContent: 'center'}}
                  >
                    Analyze
                  </button>
                </div>

                {tResult && (
                  <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '12px' }} className="fade-in-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted-site)' }}>Vitality Score</span>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.2rem 0', color: tResult.color }}>{tResult.score} / {tResult.maxScore}</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '1px' }}>Hormonal State</span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0.2rem 0', color: tResult.color }}>{tResult.status}</h4>
                      </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: `4px solid ${tResult.color}`, marginBottom: '1.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted-site)', lineHeight: 1.5 }}>
                        <strong>Diagnostic Rating:</strong> {tResult.rating}
                      </p>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="var(--accent-green)" /> Recommended Androgenic Optimization Protocol</h4>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted-site)' }}>
                      {tResult.advice.map((adv, i) => (
                        <li key={i} style={{ lineHeight: '1.4' }}>
                          <span style={{ color: 'var(--text-main-site)' }}>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 3: REAL AGE CALCULATOR */}
            {activeTab === 'realage' && (
              <div className="tool-content">
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock color="var(--accent-green)" /> Biological vs. Chronological Age Assessment
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '2rem' }}>
                  Analyzes biological longevity accelerators and decelerators to map your body\'s true internal cellular age.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Your Chronological Age: {chronoAge} years old</label>
                    <input 
                      type="range" min="18" max="90" value={chronoAge} 
                      onChange={(e) => { setChronoAge(parseInt(e.target.value)); setRealAgeResult(null); }}
                      style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Restorative Sleep Duration & Quality</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={lifestyle.sleep}
                      onChange={(e) => { setLifestyle(prev => ({ ...prev, sleep: e.target.value })); setRealAgeResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="optimal">Optimal (7.5-9h, deep REM cycles, regular wake times)</option>
                      <option value="moderate">Moderate (6-7h, occasional sleep breakages, alert mornings)</option>
                      <option value="poor">Poor (Less than 6h, high insomnia index, morning exhaustion)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Exercise Frequency & Aerobic Capacity</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={lifestyle.exercise}
                      onChange={(e) => { setLifestyle(prev => ({ ...prev, exercise: e.target.value })); setRealAgeResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="elite">Elite (5+ hours weekly hybrid progressive strength & VO2 max zone 2/5)</option>
                      <option value="moderate">Moderate (3-4 hours weekly standard lifts and steady cardio)</option>
                      <option value="light">Light (1-2 hours weekly low-intensity walking or light loading)</option>
                      <option value="none">Sedentary (No formal workout loading, minimal physical step count)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Nutrition Quality & Anti-Inflammatory Index</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={lifestyle.nutrition}
                      onChange={(e) => { setLifestyle(prev => ({ ...prev, nutrition: e.target.value })); setRealAgeResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="longevity">Anti-Inflammatory/Longevity (Unprocessed, rich in polyphenols, high quality proteins)</option>
                      <option value="balanced">Balanced Whole Foods (Moderate processing, balanced carbs/protein/fats)</option>
                      <option value="processed">Processed Western Diet (High simple sugars, hydrogenated fats, low micro count)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Stress Levels & Allostatic Load</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={lifestyle.stress}
                      onChange={(e) => { setLifestyle(prev => ({ ...prev, stress: e.target.value })); setRealAgeResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="low">Low / Well Managed (High HRV adaptation, steady mental state)</option>
                      <option value="moderate">Moderate Stress (Standard professional workload, balanced coping)</option>
                      <option value="high">High/Chronic Stress (Constant overwhelm, shallow breathing, high anxiety)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Environmental & Systemic Toxins</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={lifestyle.toxins}
                      onChange={(e) => { setLifestyle(prev => ({ ...prev, toxins: e.target.value })); setRealAgeResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="none">None (Zero smoking, minimal or zero alcohol, pure cellular hydration)</option>
                      <option value="social">Social Exposure (Occasional drinks, moderate cellular clean workload)</option>
                      <option value="heavy">Frequent Toxins (Regular smoking/vaping, frequent heavy drinking)</option>
                    </select>
                  </div>

                  <button 
                    onClick={calculateRealAge}
                    className="site-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '1rem' , textAlign: 'center', justifyContent: 'center'}}
                  >
                    Analyze
                  </button>
                </div>

                {realAgeResult && (
                  <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '12px' }} className="fade-in-up">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderBottom: '1px solid var(--border-site)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted-site)' }}>Biological Cellular Age</span>
                        <h3 style={{ fontSize: '3rem', fontWeight: '800', margin: '0.2rem 0', color: realAgeResult.diff <= 0 ? 'var(--accent-green)' : '#ef5350' }}>
                          {realAgeResult.biologicalAge} yrs
                        </h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '1px' }}>Age Offset Variance</span>
                        <h4 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0.5rem 0', color: realAgeResult.diff <= 0 ? 'var(--accent-green)' : '#ef5350' }}>
                          {realAgeResult.diff <= 0 ? `${realAgeResult.diff} yrs (Decelerated Aging)` : `+${realAgeResult.diff} yrs (Accelerated Aging)`}
                        </h4>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ef5350', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertTriangle size={16} /> Cellular Accelerators
                        </h4>
                        <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted-site)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {realAgeResult.accelerators.map((acc, i) => (
                            <li key={i} style={{ lineHeight: '1.4' }}>{acc}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={16} /> Biological Decelerators
                        </h4>
                        <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted-site)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {realAgeResult.decelerators.map((dec, i) => (
                            <li key={i} style={{ lineHeight: '1.4' }}>{dec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 4: LONGEVITY SCORE */}
            {activeTab === 'longevity' && (
              <div className="tool-content">
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles color="var(--accent-green)" /> Cellular Health & Longevity Index
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '2rem' }}>
                  Evaluates cellular repair efficiency and vital longevity biomakers to map your projected healthspan.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Resting Heart Rate (RHR): {longevityInputs.rhr} BPM</label>
                    <input 
                      type="range" min="40" max="95" value={longevityInputs.rhr} 
                      onChange={(e) => { setLongevityInputs(prev => ({ ...prev, rhr: parseInt(e.target.value) })); setLongevityResult(null); }}
                      style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>VO2 Max / Aerobic Threshold Index</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={longevityInputs.vo2}
                      onChange={(e) => { setLongevityInputs(prev => ({ ...prev, vo2: e.target.value })); setLongevityResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="elite">Elite (Superior aerobic threshold, extreme metabolic flex)</option>
                      <option value="good">Good (Strong running base, robust high heart rate recovery)</option>
                      <option value="average">Average (Capable of moderate training, slow recovery spikes)</option>
                      <option value="poor">Poor (Shortness of breath under mild loading, poor oxygen capture)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Relative Grip Strength Biomarker</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={longevityInputs.grip}
                      onChange={(e) => { setLongevityInputs(prev => ({ ...prev, grip: e.target.value })); setLongevityResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="strong">Strong (Exceptional skeletal density, heavy loading capacity)</option>
                      <option value="average">Average (Baseline structural grip, standard physical loading)</option>
                      <option value="weak">Weak (Low hand strength, potential early indicator of osteopenia)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Autophagy Activation (Intermittent Fasting)</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={longevityInputs.fasting}
                      onChange={(e) => { setLongevityInputs(prev => ({ ...prev, fasting: e.target.value })); setLongevityResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="regularly">Regularly (Fasting 16h+ daily or 24h fasts monthly to trigger autophagic cleanup)</option>
                      <option value="occasionally">Occasionally (Moderate breakfast delays or brief fasts)</option>
                      <option value="never">Never (Eating frequently throughout all waking hours, constant insulin spikes)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Social Integration & Cortisol Buffering</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={longevityInputs.social}
                      onChange={(e) => { setLongevityInputs(prev => ({ ...prev, social: e.target.value })); setLongevityResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="strong">Strong Network (Consistent supportive connections, low loneliness score)</option>
                      <option value="moderate">Moderate Social (Occasional standard interactions, typical routine)</option>
                      <option value="isolated">Isolated (Low consistent community support, high professional fatigue)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Familial Genetic Longevity Markers</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={longevityInputs.genetics}
                      onChange={(e) => { setLongevityInputs(prev => ({ ...prev, genetics: e.target.value })); setLongevityResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="yes">Yes (Immediate direct ancestors lived active lives past 90+)</option>
                      <option value="no">No / Standard Range (Direct ancestors experienced standard age thresholds)</option>
                    </select>
                  </div>

                  <button 
                    onClick={calculateLongevity}
                    className="site-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '1rem' , textAlign: 'center', justifyContent: 'center'}}
                  >
                    Analyze
                  </button>
                </div>

                {longevityResult && (
                  <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '12px' }} className="fade-in-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted-site)' }}>Longevity Score</span>
                        <h3 style={{ fontSize: '3rem', fontWeight: '800', margin: '0.2rem 0', color: longevityResult.color }}>{longevityResult.score}%</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '1px' }}>Healthspan Horizon</span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0.2rem 0', color: longevityResult.color }}>{longevityResult.tier}</h4>
                      </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: `4px solid ${longevityResult.color}` }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>
                        <strong>Actionable Longevity Protocol:</strong> {longevityResult.protocol}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 5: SLEEP ANALYZER */}
            {activeTab === 'sleep' && (
              <div className="tool-content">
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Moon color="var(--accent-green)" /> Sleep Quality & Circadian Rhythm Analyzer
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '2rem' }}>
                  Evaluates deep sleep architecture, latency indicators, sleep efficiency percentages, and circadian curfews.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Sleep Duration: {sleepInputs.duration} hours</label>
                    <input 
                      type="range" min="4" max="11" step="0.5" value={sleepInputs.duration} 
                      onChange={(e) => { setSleepInputs(prev => ({ ...prev, duration: parseFloat(e.target.value) })); setSleepResult(null); }}
                      style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Sleep Latency (Time to fall asleep): {sleepInputs.latency} minutes</label>
                    <input 
                      type="range" min="5" max="90" step="5" value={sleepInputs.latency} 
                      onChange={(e) => { setSleepInputs(prev => ({ ...prev, latency: parseInt(e.target.value) })); setSleepResult(null); }}
                      style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Nighttime Awakenings</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={sleepInputs.awakenings}
                      onChange={(e) => { setSleepInputs(prev => ({ ...prev, awakenings: parseInt(e.target.value) })); setSleepResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="0">0 awakenings (Solid uninterrupted deep sleep)</option>
                      <option value="1">1 awakening (Quick recovery, fast slide back to sleep)</option>
                      <option value="2">2 awakenings (Mild circadian disruption, restless phases)</option>
                      <option value="3">3+ awakenings (Chronic wake cycles, high nighttime sympathetic response)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Morning Energy Index</label>
                    <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                      value={sleepInputs.energy}
                      onChange={(e) => { setSleepInputs(prev => ({ ...prev, energy: e.target.value })); setSleepResult(null); }}
                      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                    >
                      <option value="refreshed">Recharged (Wake up naturally, alert and sharp immediately)</option>
                      <option value="moderate">Moderate Alert (Awake but need direct sunlight or coffee to feel sharp)</option>
                      <option value="tired">Exhausted (Heavy morning fog, chronic alarm snoozing required)</option>
                    </select>
                  </div>

                  <button 
                    onClick={calculateSleep}
                    className="site-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '1rem' , textAlign: 'center', justifyContent: 'center'}}
                  >
                    Analyze
                  </button>
                </div>

                {sleepResult && (
                  <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '12px' }} className="fade-in-up">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderBottom: '1px solid var(--border-site)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted-site)' }}>Sleep Quality Score</span>
                        <h3 style={{ fontSize: '3rem', fontWeight: '800', margin: '0.2rem 0', color: sleepResult.color }}>{sleepResult.score}%</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sleep Efficiency Index</span>
                        <h4 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0.2rem 0', color: sleepResult.color }}>{sleepResult.efficiency}%</h4>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '1px' }}>Diagnostic Rating</span>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.2rem', color: sleepResult.color }}>{sleepResult.rating}</h4>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={16} color="var(--accent-green)" /> Personalized Evening Wind-Down Checklist</h4>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted-site)' }}>
                      {sleepResult.advice.map((adv, i) => (
                        <li key={i} style={{ lineHeight: '1.4' }}>
                          <span style={{ color: 'var(--text-main-site)' }}>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 6: MEAL PLANNER */}
            {activeTab === 'meal' && (
              <div className="tool-content">
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Apple color="var(--accent-green)" /> Hyper-Targeted Macro & Meal Blueprint
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '2rem' }}>
                  Generates an elite 1-day macro distribution and structured meal sequence optimized for your body recomposition or longevity goals.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Primary Fitness Goal</label>
                      <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                        value={mealInputs.goal}
                        onChange={(e) => { setMealInputs(prev => ({ ...prev, goal: e.target.value })); setMealResult(null); }}
                        style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                      >
                        <option value="recomp">Body Recomposition</option>
                        <option value="lose">Fat Loss / Lipolysis</option>
                        <option value="build">Lean Bulking / Growth</option>
                        <option value="longevity">Cellular Longevity / Anti-Aging</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Diet Preference Type</label>
                      <select onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border-site)'; e.target.style.boxShadow = "none"; }} 
                        value={mealInputs.diet}
                        onChange={(e) => { setMealInputs(prev => ({ ...prev, diet: e.target.value })); setMealResult(null); }}
                        style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main-site)', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300ff66\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', paddingRight: '44px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}
                      >
                        <option value="standard">Standard Clean High Protein</option>
                        <option value="med">High-Fat Mediterranean</option>
                        <option value="keto">Ketogenic (Low Carb / High Fat)</option>
                        <option value="vegan">Plant-Based Vegan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted-site)', fontWeight: '600', letterSpacing: '0.3px' }}>Target Daily Calories: {mealInputs.calories} kcal</label>
                    <input 
                      type="range" min="1200" max="4200" step="50" value={mealInputs.calories} 
                      onChange={(e) => { setMealInputs(prev => ({ ...prev, calories: parseInt(e.target.value) })); setMealResult(null); }}
                      style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }} 
                    />
                  </div>

                  <button 
                    onClick={calculateMealPlan}
                    className="site-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '1rem' , textAlign: 'center', justifyContent: 'center'}}
                  >
                    Generate Daily Meal Plan Blueprint
                  </button>
                </div>

                {mealResult && (
                  <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '12px' }} className="fade-in-up">
                    <div style={{ borderBottom: '1px solid var(--border-site)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted-site)' }}>Daily Caloric Blueprint</span>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.2rem 0', color: 'var(--accent-green)' }}>{mealResult.calories} kcal</h3>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', color: 'var(--text-muted-site)' }}>
                        <strong>Target Outcome:</strong> {mealResult.goalLabel}
                      </p>
                    </div>

                    {/* Macros Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                      <div style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Protein</span>
                        <h4 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.2rem 0', color: 'var(--accent-green)' }}>{mealResult.macros.pGrams}g</h4>
                      </div>
                      <div style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Carbohydrates</span>
                        <h4 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.2rem 0', color: '#29b6f6' }}>{mealResult.macros.cGrams}g</h4>
                      </div>
                      <div style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Healthy Fats</span>
                        <h4 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.2rem 0', color: '#ffb300' }}>{mealResult.macros.fGrams}g</h4>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main-site)' }}>Daily Meal Sequence Template</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {mealResult.meals.map((meal, idx) => (
                        <div key={idx} style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '8px' }}>
                          <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-green)' }}>{meal.name}</h5>
                          <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted-site)', lineHeight: '1.4' }}>{meal.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOOL 7: STRESS CHECKER */}
            {activeTab === 'stress' && (
              <div className="tool-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <div style={{
                    padding: '5px 14px', borderRadius: '100px',
                    background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.2)',
                    fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-green)',
                    textTransform: 'uppercase', letterSpacing: '1px'
                  }}>
                    5 Questions
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                    {Object.values(stressAnswers).filter(v => v !== 0).length}/5 answered
                  </span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HeartPulse color="var(--accent-green)" /> Autonomous Nervous System & Stress Assessment
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '1rem' }}>
                  Measures your acute stress indicators, sympathetic nerve locking, and includes an interactive box-breathing vagus nerve stimulator.
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ height: '4px', background: 'var(--border-site)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '100px',
                      background: 'linear-gradient(90deg, var(--accent-green), #00e676)',
                      width: `${(Object.values(stressAnswers).filter(v => v !== 0).length / 5) * 100}%`,
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 12px rgba(0, 230, 118, 0.3)'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { key: 'q1', label: 'Frequency of Cognitive Overwhelm', options: [{text: 'Virtually never, excellent mental calm', val: 1}, {text: 'Occasionally under intense pressure', val: 2}, {text: 'Frequently, experience racing thoughts', val: 3}, {text: 'Chronically, constant state of emergency', val: 4}] },
                    { key: 'q2', label: 'Physical Indicators of Tension (Jaw clench / neck tightness)', options: [{text: 'Completely loose and physically relaxed', val: 1}, {text: 'Occasional mild tension at end of workday', val: 2}, {text: 'Noticeable tightness and daily physical load', val: 3}, {text: 'Chronic pain, extreme jaw clenching', val: 4}] },
                    { key: 'q3', label: 'Ability to Rest & Slide into Restorative Sleep', options: [{text: 'Instant relaxation, sleep comes in 10 minutes', val: 1}, {text: 'Takes 15-20 minutes, minor mental trace', val: 2}, {text: 'Racing thoughts, frequent nighttime alerts', val: 3}, {text: 'Severe insomnia index, chronic hyperarousal', val: 4}] },
                    { key: 'q4', label: 'Breath Pattern & Oxygen Capture', options: [{text: 'Deep abdominal diaphragmatic breathing', val: 1}, {text: 'Balanced, standard breathing profile', val: 2}, {text: 'Shallow chest breathing, rapid cycles', val: 3}, {text: 'Chronically short breaths, hyperventilating', val: 4}] },
                    { key: 'q5', label: 'Mid-day Mental Fatigue & Cortisol Slump', options: [{text: 'High focus and mental clarity all day long', val: 1}, {text: 'Slight fatigue, easily cleared by moving', val: 2}, {text: 'Frequent brain fog, rely on constant caffeine', val: 3}, {text: 'Complete mental burnout and cognitive exhaustion', val: 4}] }
                  ].map((q, idx) => (
                    <div key={q.key} className="tool-question-card" style={{
                      padding: '1.75rem',
                      background: stressAnswers[q.key] !== 0 ? 'rgba(0, 230, 118, 0.02)' : 'var(--bg-surface)',
                      borderRadius: idx === 0 ? '16px 16px 0 0' : idx === 4 ? '0 0 16px 16px' : '0',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderBottom: idx < 4 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      transition: 'background 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{
                          minWidth: '36px', height: '36px', borderRadius: '10px',
                          background: stressAnswers[q.key] !== 0 ? 'var(--accent-green)' : 'var(--border-site)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.85rem', fontWeight: '800',
                          color: stressAnswers[q.key] !== 0 ? '#0a0a0a' : 'var(--text-muted-site)',
                          transition: 'all 0.3s ease'
                        }}>
                          {stressAnswers[q.key] !== 0 ? <CheckCircle2 size={18} /> : (idx + 1)}
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main-site)', margin: 0, lineHeight: '1.4', paddingTop: '6px' }}>{q.label}</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '52px' }}>
                        {q.options.map(opt => {
                          const isSelected = stressAnswers[q.key] === opt.val;
                          return (
                            <button
                              key={opt.val}
                              onClick={() => {
                                setStressAnswers(prev => ({ ...prev, [q.key]: opt.val }));
                                setStressResult(null);
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 16px', borderRadius: '10px',
                                border: isSelected ? '1.5px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.06)',
                                background: isSelected ? 'rgba(0, 230, 118, 0.08)' : 'transparent',
                                color: isSelected ? 'var(--text-main-site)' : 'var(--text-muted-site)',
                                fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                                transition: 'all 0.2s ease', fontWeight: isSelected ? '600' : '400',
                                backdropFilter: isSelected ? 'blur(8px)' : 'none'
                              }}
                              onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}}
                              onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-site)'; }}}
                            >
                              <span style={{
                                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                                border: isSelected ? '5px solid var(--accent-green)' : '2px solid rgba(255,255,255,0.2)',
                                background: isSelected ? '#0a0a0a' : 'transparent',
                                transition: 'all 0.2s ease',
                                boxShadow: isSelected ? '0 0 8px rgba(0,230,118,0.3)' : 'none'
                              }} />
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={calculateStress}
                    disabled={Object.values(stressAnswers).some(v => v === 0)}
                    className="site-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '1rem' , textAlign: 'center', justifyContent: 'center'}}
                  >
                    Analyze
                  </button>
                </div>

                {stressResult && (
                  <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '12px' }} className="fade-in-up">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderBottom: '1px solid var(--border-site)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted-site)' }}>Sympathetic Strain Score</span>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.2rem 0', color: stressResult.color }}>{stressResult.score} / 20</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '1px' }}>HRV Status (Estimate)</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0.5rem 0', color: stressResult.color }}>
                          {stressResult.hrvEstimate}
                        </h4>
                      </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: `4px solid ${stressResult.color}`, marginBottom: '2rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main-site)' }}>{stressResult.level}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>
                        {stressResult.description}
                      </p>
                    </div>

                    {/* Premium Breath Pacer Animation */}
                    <div style={{ borderTop: '1px solid var(--border-site)', paddingTop: '2rem', textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main-site)' }}>Vagus Nerve Stimulation: Box Breathing Pacer</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                        Box breathing is clinically proven to reboot your autonomous nervous system, drop heart rate, and restore parasympathetic balance.
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '220px', position: 'relative', marginBottom: '1.5rem' }}>
                        {/* Dynamic pulsing bubble */}
                        <div style={{
                          width: '150px',
                          height: '150px',
                          borderRadius: '50%',
                          background: 'rgba(0, 230, 118, 0.05)',
                          border: '2px solid var(--accent-green)',
                          boxShadow: '0 0 35px rgba(0, 230, 118, 0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.1s linear',
                          transform: isBreathingActive 
                            ? breathPhase === 'In' 
                              ? `scale(${1 + (breathProgress / 100) * 0.4})`
                              : breathPhase === 'Hold (Full)' 
                                ? 'scale(1.4)'
                                : breathPhase === 'Out'
                                  ? `scale(${1.4 - (breathProgress / 100) * 0.4})`
                                  : 'scale(1.0)'
                            : 'scale(1.0)'
                        }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {isBreathingActive ? breathPhase : 'Ready'}
                          </span>
                          {isBreathingActive && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', marginTop: '4px' }}>
                              {Math.ceil((100 - breathProgress) / 25)}s
                            </span>
                          )}
                        </div>

                        {/* Progress Bar Circle Ring (Simplified as border overlay) */}
                        {isBreathingActive && (
                          <div style={{
                            position: 'absolute',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            border: '1px dashed rgba(255,255,255,0.08)',
                            animation: 'spin 16s linear infinite'
                          }} />
                        )}
                      </div>

                      <button 
                        onClick={() => setIsBreathingActive(!isBreathingActive)}
                        style={{
                          padding: '10px 28px', fontSize: '0.95rem',
                          background: isBreathingActive ? '#ef5350' : 'transparent',
                          border: isBreathingActive ? '1px solid #ef5350' : '1px solid var(--accent-green)',
                          color: isBreathingActive ? 'var(--text-main-site)' : 'var(--accent-green)',
                          borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease'
                        }}
                      >
                        {isBreathingActive ? 'Stop Breathing Pacer' : 'Start 4-4-4-4 Box Breathing Session'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            { (bmiResult || tResult || realAgeResult || longevityResult || sleepResult || mealResult || stressResult) && renderRecommendedProducts() }
          </div>
        </div>
      </div>

    </div>
  );
};
```

## File: `src\useProducts.js`

```js
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Wait, does src/firebase.js exist? App.jsx imports from './firebase'
import { products as defaultProducts } from './data/products';

export const useProducts = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      if (!querySnapshot.empty) {
        const dbProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Merge dbProducts with local defaultProducts so any new local products are visible
        const dbIds = new Set(dbProducts.map(p => p.id.toString()));
        const missingLocals = defaultProducts.filter(p => !dbIds.has(p.id.toString()));
        setProducts([...dbProducts, ...missingLocals]);
      } else {
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.warn("Failed to fetch products from Firebase, using default.", error);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, reloadProducts: fetchProducts };
};
```

## File: `src\components\SEO.jsx`

```jsx
import React, { useEffect } from 'react';

const SEO = ({ 
  title = "EternoFit | High-Performance Clinical Health & Fitness Protocols",
  description = "EternoFit provides evidence-based health assessments and clinical performance protocols. Optimizing human biology through precision nutrition, tactical training, and hormonal health.",
  keywords = "clinical health assessment, performance optimization, tactical fitness, bio-identical nutrition, longevity protocols, health coaching, hormone health",
  image = "https://www.eternofit.com/Metatag.jpg",
  url = "https://www.eternofit.com",
  schema = null
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to update or create meta tags safely
    const setMetaTag = (selector, attribute, value, createAs) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (createAs.name) element.setAttribute('name', createAs.name);
        if (createAs.property) element.setAttribute('property', createAs.property);
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', description, { name: 'description' });
    setMetaTag('meta[name="keywords"]', 'content', keywords, { name: 'keywords' });

    // 3. Open Graph (Facebook/LinkedIn)
    setMetaTag('meta[property="og:title"]', 'content', title, { property: 'og:title' });
    setMetaTag('meta[property="og:description"]', 'content', description, { property: 'og:description' });
    setMetaTag('meta[property="og:image"]', 'content', image, { property: 'og:image' });
    setMetaTag('meta[property="og:url"]', 'content', url, { property: 'og:url' });

    // 4. Twitter Cards
    setMetaTag('meta[property="twitter:title"]', 'content', title, { property: 'twitter:title' });
    setMetaTag('meta[property="twitter:description"]', 'content', description, { property: 'twitter:description' });
    setMetaTag('meta[property="twitter:image"]', 'content', image, { property: 'twitter:image' });
    setMetaTag('meta[property="twitter:url"]', 'content', url, { property: 'twitter:url' });

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // 6. JSON-LD Schema
    let scriptTag = document.querySelector('script[id="dynamic-json-ld"]');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('id', 'dynamic-json-ld');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

  }, [title, description, keywords, image, url, schema]);

  return null;
};

export default SEO;
```

## File: `src\data\articles.js`

```js
export const articles = [
  {
    id: 'how-to-get-rid-of-bloating',
    image: '/images/articles/bloating.jpg',
    category: 'Digestion',
    title: 'How to Get Rid of Bloating: 9 Things That Actually Work',
    metaDesc: "Bloated stomach driving you crazy? Here are 9 simple, proven ways to debloat fast — plus what's really causing it in the first place.",
    primaryKeyword: 'how to get rid of bloating',
    readTime: '4 min read',
    date: 'Mar 20, 2025',
    content: `
      <p>You sit down after lunch and your jeans suddenly feel two sizes too small. Sound familiar? Bloating is one of those everyday annoyances most people just live with, but it's not something you have to put up with. Once you figure out what's causing it, getting your stomach back to normal is usually pretty straightforward.</p>
      <p>Here's what's actually going on and what you can do about it tonight.</p>
      
      <h2>Why You're Bloated in the First Place</h2>
      <p>Bloating happens when gas builds up in your gut or when your body holds onto extra water. The usual suspects:</p>
      <ul>
        <li>Eating too fast (you swallow air without realizing it)</li>
        <li>Carbonated drinks</li>
        <li>Foods your gut struggles to break down — beans, onions, garlic, certain dairy products</li>
        <li>Constipation</li>
        <li>Hormonal shifts, especially the week before your period</li>
        <li>Stress (yes, really)</li>
        <li>Food intolerances you don't know you have yet</li>
      </ul>
      <p>If you've been bloated for weeks with no obvious reason, that's a different conversation. But the day-to-day puffiness? Almost always one of the things above.</p>

      <h2>9 Things That Actually Help</h2>
      <p><strong>1. Drink warm water with lemon.</strong> First thing in the morning, before coffee. It gets things moving in your gut and helps flush out the extra sodium that's making you puffy.</p>
      <p><strong>2. Walk for 15 minutes after meals.</strong> Sounds too simple. It isn't. A short walk after eating reduces gas and speeds up digestion noticeably.</p>
      <p><strong>3. Cut back on gum.</strong> Every time you chew gum, you swallow air. If you're a constant gum chewer and constantly bloated, there's your answer.</p>
      <p><strong>4. Try peppermint tea.</strong> Peppermint relaxes the muscles in your digestive tract. One cup after dinner works wonders for a lot of people.</p>
      <p><strong>5. Eat slower.</strong> Put your fork down between bites. Aim for 20 minutes per meal minimum. You'll eat less and bloat less.</p>
      <p><strong>6. Watch the salt for a day or two.</strong> Restaurant food, frozen meals, and chips all pack way more sodium than you realize. Your body holds onto water to balance it out.</p>
      <p><strong>7. Add a probiotic.</strong> Either through yogurt, kefir, kimchi, or a supplement. It takes a couple weeks to notice, but a happier gut means less gas.</p>
      <p><strong>8. Skip the carbonated drinks.</strong> Sparkling water included. The bubbles have to go somewhere.</p>
      <p><strong>9. Try magnesium citrate before bed.</strong> It relaxes your gut and helps you go to the bathroom in the morning. Most adults are low on magnesium anyway.</p>

      <h2>When Bloating Isn't Just Bloating</h2>
      <p>If you're bloated every single day, losing weight without trying, seeing blood, or running to the bathroom constantly, don't Google it for three more hours. Book a doctor. Conditions like IBS, celiac disease, SIBO, and food intolerances are common and treatable, but they need a proper diagnosis.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">How long does bloating usually last?</summary><div class="faq-answer"><p>Normal bloating from a meal clears within a few hours. If you're still bloated the next morning, something's off.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Does drinking more water actually help with bloating?</summary><div class="faq-answer"><p>Yes, weirdly enough. When you're dehydrated, your body holds onto water and you bloat more. Aim for 8 glasses a day.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can stress really cause bloating?</summary><div class="faq-answer"><p>Absolutely. Your gut and brain are connected through the vagus nerve, and chronic stress slows digestion down. This is why your stomach feels weird before big presentations.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What's the fastest way to debloat?</summary><div class="faq-answer"><p>A warm drink, a short walk, and skipping anything carbonated or salty for the rest of the day. You'll feel a difference within hours.</p></div></details>
      <p>Bloating is annoying but rarely serious. Pay attention to what triggers yours, fix the easy stuff first, and you'll probably stop noticing it within a week.</p>
    `
  },
  {
    id: 'cant-sleep-what-to-do',
    image: '/images/articles/sleep.jpg',
    category: 'Sleep',
    title: "Can't Sleep? Here's Why (And What Actually Helps)",
    metaDesc: "Tossing and turning every night? Find out the real reasons you can't sleep and the simple changes that finally fix it.",
    primaryKeyword: "can't sleep",
    readTime: '4 min read',
    date: 'Dec 23, 2025',
    content: `
      <p>It's 2 a.m. You've been staring at the ceiling for an hour. You've already done the math on how many hours of sleep you'll get if you fall asleep right now. Spoiler: it's not enough.</p>
      <p>If this is your life most nights, you're not broken and you're not alone. About one in three adults deal with this regularly. The good news is that most sleep problems come down to a handful of fixable habits, not some mysterious medical issue.</p>

      <h2>Why You Can't Fall Asleep</h2>
      <p>A few common culprits show up over and over:</p>
      <ul>
        <li>Your phone (the light tells your brain it's daytime)</li>
        <li>Caffeine you had after 2 p.m.</li>
        <li>A bedroom that's too warm — anything above 68°F messes with sleep</li>
        <li>Eating dinner too late</li>
        <li>Stress and a racing brain</li>
        <li>Drinking alcohol close to bed (it knocks you out but wrecks your deep sleep)</li>
        <li>An inconsistent bedtime — going to bed at 10 one night and 1 a.m. the next</li>
      </ul>
      <p>Sometimes it's something physical: sleep apnea, restless legs, hormone changes during perimenopause. We'll get there.</p>

      <h2>What Actually Helps You Sleep</h2>
      <p><strong>Set a wake-up time and don't move it.</strong> Even on weekends. Your body wants consistency more than it wants extra Saturday sleep.</p>
      <p><strong>Get sunlight on your face in the morning.</strong> Ten minutes outside within an hour of waking up. This single habit fixes more sleep problems than any supplement.</p>
      <p><strong>Stop caffeine by noon.</strong> Caffeine has a half-life of around 5–6 hours. That 4 p.m. coffee is still in your system at midnight.</p>
      <p><strong>Cool your bedroom down.</strong> Aim for 65–68°F. Crack a window, run a fan, kick off the comforter. Your body needs to drop temperature to fall asleep.</p>
      <p><strong>Get off your phone an hour before bed.</strong> Read a real book, take a shower, stretch. Anything that doesn't glow.</p>
      <p><strong>Write down what's stressing you.</strong> Brain dump everything onto paper before bed. It sounds basic but it stops the 2 a.m. spiral.</p>
      <p><strong>Try magnesium glycinate.</strong> Around 200–400 mg, an hour before bed. It calms the nervous system without making you groggy.</p>
      <p><strong>Skip the nightcap.</strong> Alcohol is the worst sleep aid. You fall asleep faster but wake up at 3 a.m. and can't get back down.</p>

      <h2>When to Get Help</h2>
      <p>If you snore loudly, wake up gasping, or feel exhausted no matter how long you sleep, get checked for sleep apnea. If you can't sleep three or more nights a week for over a month, that's chronic insomnia and a doctor can actually help — CBT-I (cognitive behavioral therapy for insomnia) works better than sleeping pills long-term.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Is melatonin safe to take every night?</summary><div class="faq-answer"><p>Short-term, yes. But your body makes its own melatonin, and taking it nightly can confuse that system. Start with 0.5–1 mg, not the 5–10 mg most bottles sell.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Why do I wake up at 3 a.m. and can't fall back asleep?</summary><div class="faq-answer"><p>Usually one of three things: blood sugar drop, cortisol spike from stress, or alcohol. Try eating a small protein snack before bed and avoiding alcohol for a week.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">How many hours of sleep do I actually need?</summary><div class="faq-answer"><p>Most adults need 7–9 hours. If you wake up tired even after 8 hours, your sleep quality is the issue, not the quantity.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Does counting sheep work?</summary><div class="faq-answer"><p>No. But focusing on slow breathing — in for 4, hold for 4, out for 6 — does. It activates your parasympathetic nervous system and basically tells your body it's safe to sleep.</p></div></details>
      <p>Try the sunlight habit and the consistent wake-up time first. Most people see a real difference within a week.</p>
    `
  },
  {
    id: 'brain-fog-causes-remedies',
    image: '/images/articles/brain_fog_real.jpg',
    category: 'Mental Clarity',
    title: "Brain Fog Won't Lift? Here's What's Really Going On",
    metaDesc: "Can't focus, forgetting things, feeling mentally slow? Here are the real causes of brain fog and what actually clears it up.",
    primaryKeyword: "brain fog",
    readTime: '4 min read',
    date: 'Mar 27, 2026',
    content: `
      <p>You walk into a room and forget why. You read the same sentence three times. Words you know perfectly well refuse to show up when you need them. If your brain feels like it's running on dial-up, you've got brain fog — and it's more common than ever.</p>
      <p>The frustrating part is brain fog isn't an actual medical diagnosis. It's a symptom, and it can come from a dozen different places. Figuring out where yours is coming from is half the battle.</p>

      <h2>What's Causing Your Brain Fog</h2>
      <p>Brain fog usually points to one of these:</p>
      <ul>
        <li>Poor sleep (the obvious one, but worth fixing first)</li>
        <li>Dehydration — even mild dehydration tanks cognitive performance</li>
        <li>Low B12, low iron, or low vitamin D</li>
        <li>Hormonal shifts, especially perimenopause and the days before your period</li>
        <li>Long COVID</li>
        <li>Chronic stress and burnout</li>
        <li>Too much sugar and ultra-processed food</li>
        <li>Inflammation from food sensitivities you don't know about</li>
        <li>Some medications (antihistamines, antidepressants, statins)</li>
      </ul>
      <p>If you've been foggy for months, the cause is almost certainly one of the above, not a single thing you did yesterday.</p>

      <h2>How to Actually Clear It</h2>
      <p><strong>Drink water first thing.</strong> Most people wake up dehydrated. A big glass of water before coffee makes a noticeable difference.</p>
      <p><strong>Get your bloodwork done.</strong> Specifically check B12, vitamin D, ferritin (iron stores), and thyroid. These are the four that quietly cause foggy thinking in millions of people. Many doctors won't test them unless you ask.</p>
      <p><strong>Cut sugar and refined carbs for two weeks.</strong> It's not forever. But blood sugar swings cause brain fog more than people realize. Try it and see.</p>
      <p><strong>Move your body daily.</strong> Even a 20-minute walk. Exercise pushes oxygen to your brain and grows new brain cells in your hippocampus.</p>
      <p><strong>Sleep, seriously.</strong> If you're getting under 7 hours, no supplement will fix your fog. Sleep is when your brain clears out waste products.</p>
      <p><strong>Try fish oil.</strong> Omega-3s, specifically the EPA and DHA in fatty fish or quality fish oil, support brain function. 1,000–2,000 mg a day.</p>
      <p><strong>Limit alcohol.</strong> Even one drink at night messes with the next morning's clarity.</p>
      <p><strong>Take screen breaks.</strong> Look away from your screen for 20 seconds every 20 minutes. Your brain needs the recovery.</p>

      <h2>When to See a Doctor</h2>
      <p>Brain fog combined with memory loss that worries your family, slurred speech, sudden personality changes, or numbness — go in. Same if it's been going on for over six weeks with no clear reason and basic fixes aren't helping. Could be thyroid, autoimmune, perimenopause, or post-viral, and they're all treatable.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Can anxiety cause brain fog?</summary><div class="faq-answer"><p>Yes, very much so. When you're constantly anxious, your brain prioritizes scanning for threats over remembering where you put your keys. Treating the anxiety often clears the fog.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is brain fog a sign of something serious?</summary><div class="faq-answer"><p>Usually not. It's usually sleep, hydration, hormones, or nutrient deficiencies. But ongoing fog deserves a checkup.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Do nootropics or "smart drugs" actually work?</summary><div class="faq-answer"><p>Sleep, exercise, and hydration outperform almost every nootropic. Some people swear by L-theanine + caffeine for focus. The research on the more exotic stuff is thin.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Why is my brain fog worse before my period?</summary><div class="faq-answer"><p>Estrogen drops in the days leading up to your period, and estrogen plays a big role in cognitive function. It's annoying but normal.</p></div></details>
      <p>Don't accept brain fog as your new baseline. Most of the time, getting the basics right — sleep, water, food, movement, bloodwork — turns it around within a few weeks.</p>
    `
  },
  {
    id: 'how-to-calm-anxiety',
    image: '/images/articles/anxiety_real.jpg',
    category: 'Stress',
    title: "Anxiety That Won't Quit: Practical Ways to Calm Down",
    metaDesc: "Stuck in anxiety that won't ease up? Here are real, science-backed ways to calm your nervous system and feel like yourself again.",
    primaryKeyword: "how to calm anxiety",
    readTime: '5 min read',
    date: 'Sep 2, 2025',
    content: `
      <p>Your chest feels tight for no reason. Your mind is sprinting. You're checking your phone, your heart, your to-do list, your phone again. Anxiety has a way of taking over your whole nervous system, and once it's running the show, talking yourself out of it doesn't really work.</p>
      <p>Here's the thing nobody tells you: you can't out-think anxiety. You have to physically calm your body first, and your mind will follow. That's how the nervous system actually works.</p>

      <h2>Why You Feel So Anxious</h2>
      <p>Anxiety has many entry points:</p>
      <ul>
        <li>Caffeine, especially on an empty stomach</li>
        <li>Not enough sleep</li>
        <li>Sugar crashes</li>
        <li>Alcohol the night before (the "hangxiety" everyone knows)</li>
        <li>Constant scrolling and overstimulation</li>
        <li>Hormone changes</li>
        <li>Real life stress that's piling up</li>
        <li>Unprocessed trauma your nervous system is still holding</li>
        <li>Genetics — anxiety runs in families</li>
      </ul>
      <p>For some people, anxiety is situational and fades. For others, it's wired in. Both are valid, both are workable.</p>

      <h2>Ways to Actually Calm It Down</h2>
      <p><strong>Try the physiological sigh.</strong> Two quick inhales through the nose, one long exhale through the mouth. Do it five times. This is the fastest way to drop heart rate that researchers have found.</p>
      <p><strong>Cold water on your face.</strong> Splash cold water on your face or hold an ice pack to your eyes for 30 seconds. It triggers the dive reflex and slows your heart rate almost instantly.</p>
      <p><strong>Walk it out.</strong> A 10-minute walk does more for acute anxiety than scrolling Reddit ever will. Bilateral movement — left, right, left, right — helps your brain process.</p>
      <p><strong>Cut caffeine in half.</strong> If you're drinking three coffees, try one. Coffee feels like clarity but it's gasoline on anxiety for sensitive people.</p>
      <p><strong>Eat real food on a schedule.</strong> Skipping meals makes anxiety worse. Protein with each meal stabilizes blood sugar and your mood.</p>
      <p><strong>Limit news and social media.</strong> Pick two times a day to check. The rest of the time, your phone has nothing to tell you that's worth the cost.</p>
      <p><strong>Get sunlight in the morning.</strong> Same reason as for sleep. It sets your nervous system on a calmer rhythm.</p>
      <p><strong>Try magnesium glycinate at night.</strong> Many anxious people are low on magnesium. It won't fix everything but it takes the edge off.</p>
      <p><strong>Journal for five minutes a day.</strong> Not a Pinterest journal. Just dump everything in your head onto paper. The act of writing it down releases the grip.</p>
      <p><strong>Therapy genuinely helps.</strong> Cognitive behavioral therapy and EMDR have decades of research behind them. Medication helps a lot of people too. There's no extra credit for white-knuckling it alone.</p>

      <h2>When It's Time to Get Help</h2>
      <p>If anxiety is keeping you from working, sleeping, eating, or doing things you used to love — that's the line. Same if you're having panic attacks regularly or thinking about hurting yourself. Anxiety disorders are real and very treatable. A therapist or doctor can help.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Can anxiety make you feel physically sick?</summary><div class="faq-answer"><p>Definitely. Nausea, tight chest, headaches, dizziness, racing heart, stomach problems — all classic. Anxiety is a full-body experience.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is it bad to take anxiety medication?</summary><div class="faq-answer"><p>No. For a lot of people, medication is what makes the rest of the work possible. Talk to a doctor about your options.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">How long does an anxiety attack last?</summary><div class="faq-answer"><p>Usually 20–30 minutes at peak. It feels endless but it always passes. Knowing this helps.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can magnesium really help with anxiety?</summary><div class="faq-answer"><p>The evidence is decent for magnesium glycinate, especially in people who are deficient. It's not a miracle but it's worth trying.</p></div></details>
      <p>Start with breathing and a walk next time anxiety hits. Then work backwards on what's feeding it long-term. You don't have to feel like this.</p>
    `
  },
  {
    id: 'lower-back-pain-from-sitting',
    image: '/images/articles/back_pain_real.jpg',
    category: 'Pain Relief',
    title: "Lower Back Pain From Sitting All Day: Real Fixes That Work",
    metaDesc: "Sitting at a desk is wrecking your back? Here are the real causes of lower back pain and the simple fixes that finally help.",
    primaryKeyword: "lower back pain from sitting",
    readTime: '4 min read',
    date: 'Mar 5, 2026',
    content: `
      <p>Your back was fine in your twenties. Then desk jobs, remote work, and 14-hour days hunched over a laptop happened. Now you stand up after a meeting and your lower back screams. Welcome to one of the most common pain points of modern life.</p>
      <p>The good news: this kind of back pain is almost always fixable without surgery, medication, or a thousand-dollar ergonomic chair. The bad news: it does require you to actually do something about it.</p>

      <h2>Why Sitting Wrecks Your Lower Back</h2>
      <p>When you sit for hours, three things happen:</p>
      <ul>
        <li>Your hip flexors get short and tight, which yanks your pelvis forward</li>
        <li>Your glutes basically forget how to fire</li>
        <li>The discs in your lower spine compress under more pressure than when you're standing</li>
      </ul>
      <p>Add a slouched posture, a screen that's too low, and zero movement breaks, and you've built the perfect storm for chronic back pain.</p>

      <h2>What Actually Fixes It</h2>
      <p><strong>Stand up every 30 minutes.</strong> Set a timer. Walk to the kitchen, stretch, do five squats — anything. Sitting is not the enemy; sitting without breaks is.</p>
      <p><strong>Stretch your hip flexors daily.</strong> Try a kneeling hip flexor stretch — kneel on one knee, push your hips forward, hold for 60 seconds each side. Do it twice a day. This single stretch fixes a lot of "back" pain that's actually hip pain.</p>
      <p><strong>Strengthen your glutes.</strong> Weak glutes make your lower back do their work. Bridges, hip thrusts, and squats — 10 minutes a few times a week.</p>
      <p><strong>Try the McGill Big 3.</strong> A back specialist named Stuart McGill came up with three exercises — the modified curl-up, the side plank, and the bird dog — that build a stable spine. Look them up on YouTube and do them every morning.</p>
      <p><strong>Walk daily.</strong> A 30-minute walk does more for back pain than most stretches. Movement is medicine for spines.</p>
      <p><strong>Fix your desk setup.</strong> Top of your monitor at eye level. Elbows at 90 degrees. Feet flat on the floor. Hips slightly higher than knees. This isn't optional if you sit eight hours a day.</p>
      <p><strong>Try a standing desk for part of the day.</strong> Not all day — standing all day is just as bad. Alternate sitting and standing every hour or so.</p>
      <p><strong>Sleep on your side with a pillow between your knees.</strong> This keeps your spine aligned overnight. If you sleep on your back, put a pillow under your knees.</p>
      <p><strong>Get a massage or see a physio.</strong> A good physiotherapist can spot exactly what's tight and what's weak in 20 minutes. Worth every dollar.</p>

      <h2>When Back Pain Is Something More</h2>
      <p>If your back pain shoots down your leg, comes with numbness, tingling, or weakness, or if you've lost control of your bladder or bowels — that's an emergency, go in now. Pain that wakes you up at night or doesn't respond to anything after two weeks also needs imaging and a proper diagnosis. Could be a disc, sciatica, or something structural.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Is sitting really that bad for you?</summary><div class="faq-answer"><p>Sitting for long stretches without breaks is associated with all kinds of issues — back pain, weight gain, even higher heart disease risk. Breaks fix most of it.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Should I use a back brace?</summary><div class="faq-answer"><p>Short-term, sure, if you're moving heavy stuff. Long-term, no. Your core needs to be the brace.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Will losing weight help my back?</summary><div class="faq-answer"><p>If you're carrying extra weight around your middle, yes, a lot. It changes the load on your spine.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is yoga good for lower back pain?</summary><div class="faq-answer"><p>Yes, but be selective. Gentle yoga and stretches that open the hips help. Aggressive backbends when you're flared up can make it worse.</p></div></details>
      <p>Most people who do hip flexor stretches and glute strengthening for two weeks feel a real difference. It's not glamorous, but it works.</p>
    `
  },
  {
    id: 'how-to-stop-heartburn',
    image: '/images/articles/heartburn_real.jpg',
    category: 'Digestion',
    title: "Heartburn Keeps Coming Back? Here's How to Stop It",
    metaDesc: "Sick of that burning chest after meals? Find out why heartburn keeps coming back — and what actually puts it out for good.",
    primaryKeyword: "how to stop heartburn",
    readTime: '4 min read',
    date: 'Oct 9, 2026',
    content: `
      <p>That burning feeling that creeps up your chest after dinner. The acid that hits the back of your throat when you lie down. The half-empty pack of Tums in every bag and drawer. If heartburn is part of your daily routine, you're far from alone — and you don't have to live with it.</p>
      <p>The thing is, most people treat heartburn by suppressing acid. That works short-term, but if you keep having heartburn week after week, something is causing it and that thing is fixable.</p>

      <h2>Why You Keep Getting Heartburn</h2>
      <p>Heartburn happens when stomach acid leaks back up into your esophagus. The valve at the top of your stomach (the LES) is supposed to keep it down. When it doesn't close properly, you feel it. Common reasons:</p>
      <ul>
        <li>Eating too much in one sitting</li>
        <li>Lying down too soon after eating</li>
        <li>Spicy, fatty, or fried foods</li>
        <li>Coffee, alcohol, citrus, tomatoes, chocolate, peppermint (the classics)</li>
        <li>Being overweight, especially around your middle</li>
        <li>Smoking</li>
        <li>Stress</li>
        <li>Certain medications (NSAIDs, some blood pressure meds)</li>
        <li>Pregnancy</li>
        <li>Hiatal hernia</li>
      </ul>
      <p>If heartburn shows up more than twice a week, you've moved into GERD territory and it's worth a doctor visit.</p>

      <h2>What Actually Stops It</h2>
      <p><strong>Stop eating three hours before bed.</strong> This one habit fixes heartburn for a huge number of people. Gravity is on your side when you're upright.</p>
      <p><strong>Eat smaller meals.</strong> Big meals stretch your stomach and push acid up. Eat until 80% full instead of stuffed.</p>
      <p><strong>Sleep with your head elevated.</strong> Six to eight inches higher than your stomach. Use a wedge pillow or prop the head of your bed up on blocks. Stacking regular pillows doesn't work — it just bends your neck.</p>
      <p><strong>Lose some belly weight.</strong> Even 5–10 pounds off your middle takes the pressure off your stomach. This is one of the most effective long-term fixes.</p>
      <p><strong>Identify your triggers.</strong> Keep a one-week food diary. Most people have two or three personal triggers — for some it's tomato sauce, for others it's coffee or wine. You don't have to avoid everything.</p>
      <p><strong>Quit smoking.</strong> Smoking relaxes the LES and makes everything worse.</p>
      <p><strong>Wear looser clothes.</strong> Tight waistbands push acid up. Real reason, not a joke.</p>
      <p><strong>Don't lie down right after eating.</strong> Sit up for at least 90 minutes. Take a short walk if you can.</p>
      <p><strong>Chew gum after meals.</strong> Sugar-free. It boosts saliva, which neutralizes acid in the esophagus.</p>
      <p><strong>Try ginger or chamomile tea.</strong> Calming for the gut and may reduce reflux for some people.</p>

      <h2>What About Medication?</h2>
      <p>Antacids (Tums, Rolaids) work in minutes but wear off fast. H2 blockers like famotidine work longer and help prevent it. Proton pump inhibitors (omeprazole, esomeprazole) are stronger but not meant for long-term daily use without a doctor's guidance — they can cause nutrient absorption issues and other side effects. Use them as a tool, not a forever solution.</p>

      <h2>When to See a Doctor</h2>
      <p>If heartburn happens more than twice a week, you're losing weight without trying, you have trouble swallowing, you're throwing up regularly, or you've been on antacids for months — book an appointment. Chronic untreated reflux can damage your esophagus over time. Easily treatable when caught.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Is heartburn the same as acid reflux?</summary><div class="faq-answer"><p>Acid reflux is the action; heartburn is the symptom you feel from it.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can drinking water help heartburn?</summary><div class="faq-answer"><p>Yes, a glass of water can dilute the acid and wash it back down. Try it when an episode starts.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Why is heartburn worse at night?</summary><div class="faq-answer"><p>Lying down lets acid travel up easily. The wedge pillow fix matters.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Are bananas good for heartburn?</summary><div class="faq-answer"><p>For most people, yes. They're alkaline and coat the stomach a bit. A few people find they make it worse, so try and see.</p></div></details>
      <p>Most people who stop eating before bed and figure out their two main trigger foods get rid of heartburn within a couple weeks. Worth the small effort.</p>
    `
  },
  {
    id: 'tired-all-the-time-causes',
    image: '/images/articles/fatigue_real.jpg',
    category: 'Energy',
    title: "Tired All the Time? Common Reasons and What to Do",
    metaDesc: "Exhausted no matter how much you sleep? Here are the real reasons you're tired all the time — and what finally fixes it.",
    primaryKeyword: "tired all the time",
    readTime: '5 min read',
    date: 'Sep 13, 2026',
    content: `
      <p>You slept eight hours. You drink water. You eat okay. And you're still tired. Like, drag-yourself-through-the-day tired. If "I'm exhausted" is your default answer to "how are you," something deeper is usually going on.</p>
      <p>The frustrating truth is that fatigue almost never has one cause. It's usually three or four small things stacked on each other, and once you sort them out, your energy comes back.</p>

      <h2>Why You're So Tired</h2>
      <p>Common causes that nobody warns you about:</p>
      <ul>
        <li>Iron deficiency, especially in women (one of the top causes)</li>
        <li>Low vitamin D</li>
        <li>Low B12</li>
        <li>Underactive thyroid</li>
        <li>Blood sugar swings from too many refined carbs</li>
        <li>Sleep that looks long but is low quality</li>
        <li>Sleep apnea (much more common than people realize)</li>
        <li>Dehydration</li>
        <li>Too much caffeine (yes, it can cause fatigue, not just fix it)</li>
        <li>Burnout and chronic stress</li>
        <li>Depression</li>
        <li>Long COVID</li>
        <li>Perimenopause</li>
      </ul>
      <p>The first step is usually basic bloodwork. Most doctors will run it if you ask.</p>

      <h2>What Actually Brings Energy Back</h2>
      <p><strong>Get your iron, B12, vitamin D, and thyroid tested.</strong> This single step solves the mystery for a lot of people. If anything is low, treat it. The difference can be dramatic within a few weeks.</p>
      <p><strong>Stop chasing energy with caffeine.</strong> It feels like a fix but you're borrowing energy from later. Cap it at two cups in the morning.</p>
      <p><strong>Eat protein at breakfast.</strong> Not a muffin, not toast. 25–30 grams of protein within an hour of waking up. Eggs, Greek yogurt, leftovers. It changes how your whole day feels.</p>
      <p><strong>Walk outside in the morning.</strong> Ten minutes. Sun on your face. It sets your circadian rhythm and your energy follows.</p>
      <p><strong>Strength train.</strong> Even twice a week. Muscle is metabolic, and stronger people are less tired. Counterintuitive but real.</p>
      <p><strong>Drink more water.</strong> Not a gallon. Just consistent water through the day. Dehydration mimics fatigue.</p>
      <p><strong>Cut ultra-processed food.</strong> Anything in a wrapper with 12 ingredients. It crashes your blood sugar all day long.</p>
      <p><strong>Check your sleep quality, not just hours.</strong> If you snore, wake up gasping, or sleep nine hours and still feel awful, get a sleep study. Sleep apnea destroys energy.</p>
      <p><strong>Take real breaks.</strong> Not phone breaks. Actual quiet, eyes-closed, no-stimulation breaks. Five minutes a few times a day.</p>
      <p><strong>Look at your stress.</strong> If you've been running on stress for a year, your body might be at a point where it can't keep going. That's burnout, and rest is the only fix.</p>

      <h2>When to See a Doctor</h2>
      <p>Constant fatigue for more than two or three weeks deserves bloodwork. If you're also losing weight, feeling depressed, getting short of breath, or just not yourself — go in. Treatable conditions like anemia, thyroid disorders, sleep apnea, and depression are all common causes that get missed because people don't get checked.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Can I be tired all the time even if I sleep enough?</summary><div class="faq-answer"><p>Yes. Quality matters more than quantity. So does what you eat, your iron levels, your stress, and your hormones.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Why am I more tired in winter?</summary><div class="faq-answer"><p>Less sunlight means less vitamin D and a hit to your circadian rhythm. Get outside even when it's cold, or use a light therapy lamp.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is being tired a sign of depression?</summary><div class="faq-answer"><p>Often yes. Fatigue is one of the most common symptoms of depression, sometimes before low mood is even noticeable.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Do energy drinks actually work?</summary><div class="faq-answer"><p>Short-term, yes. Long-term, they make it worse. Caffeine plus tons of sugar plus crash plus dependency.</p></div></details>
      <p>If you only do one thing, get bloodwork. The number of people walking around exhausted because of fixable deficiencies is huge.</p>
    `
  },
  {
    id: 'daily-headaches-causes-remedies',
    image: '/images/articles/headache_real.jpg',
    category: 'Pain Relief',
    title: "Headaches Every Day? Find Out Why and Fix It",
    metaDesc: "Getting headaches all the time? Here are the real causes of daily headaches and the changes that actually make them stop.",
    primaryKeyword: "daily headaches causes",
    readTime: '4 min read',
    date: 'Mar 22, 2026',
    content: `
      <p>If you wake up wondering whether today is going to be another headache day, you know how draining it is. Daily or near-daily headaches affect millions of people, and most of them are not doing anything wrong — they're just stuck in a pattern they don't know how to break.</p>
      <p>The encouraging part: even chronic headaches usually have a few clear causes once you slow down and look at the pattern.</p>

      <h2>Why You Keep Getting Headaches</h2>
      <p>Tension headaches and migraines are the two big categories. Common triggers:</p>
      <ul>
        <li>Dehydration (the most overlooked one)</li>
        <li>Poor sleep</li>
        <li>Caffeine — both too much and withdrawal</li>
        <li>Skipping meals and blood sugar drops</li>
        <li>Screen time and bad neck posture</li>
        <li>Stress and jaw clenching</li>
        <li>Eye strain and outdated glasses prescriptions</li>
        <li>Alcohol, especially red wine</li>
        <li>Strong smells, fluorescent lights, weather changes</li>
        <li>Hormones (period-related migraines are extremely common)</li>
        <li>Certain foods — aged cheese, processed meat, MSG, artificial sweeteners</li>
        <li>Medication overuse — yes, taking painkillers daily can cause headaches</li>
      </ul>
      <p>That last one trips people up. If you're taking ibuprofen or acetaminophen every day for headaches, the painkillers might be why the headaches keep coming back.</p>

      <h2>What Actually Helps</h2>
      <p><strong>Drink water all day.</strong> Not a glass when the headache starts. Steady water from morning to evening. Two to three liters is a good target.</p>
      <p><strong>Keep a headache diary for two weeks.</strong> Date, time, what you ate, how you slept, your stress level, your period if relevant. Patterns jump out fast.</p>
      <p><strong>Eat regularly.</strong> Skipping meals is one of the most common migraine triggers. Eat every 4–5 hours, with protein.</p>
      <p><strong>Limit caffeine to one or two cups, same time daily.</strong> Up and down on caffeine is a guaranteed headache.</p>
      <p><strong>Move your neck.</strong> Most desk workers have stiff, locked-up necks. Gentle neck stretches a few times a day reduce tension headaches noticeably.</p>
      <p><strong>Get your eyes checked.</strong> Even if you don't think you need glasses. Eye strain causes headaches you don't connect to your eyes.</p>
      <p><strong>Sleep on a regular schedule.</strong> Migraines especially hate inconsistency. Same bedtime, same wake-up time.</p>
      <p><strong>Practice jaw relaxation.</strong> A lot of headaches are actually tension from clenching. Notice if your teeth are touching during the day — they shouldn't be unless you're chewing.</p>
      <p><strong>Try magnesium glycinate.</strong> 400 mg daily has solid evidence for reducing migraine frequency.</p>
      <p><strong>Reduce screen brightness and use blue light filters.</strong> Especially at night.</p>

      <h2>When to Get Help</h2>
      <p>Sudden severe headache that feels like the worst of your life, headaches with vision changes, weakness, slurred speech, fever, stiff neck, or confusion — go to the ER. Daily headaches lasting more than a few weeks, headaches that wake you up at night, or headaches getting steadily worse — see a neurologist. Effective preventive medications and treatments exist, including newer options for migraines.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Are daily headaches normal?</summary><div class="faq-answer"><p>No. Common, but not normal. They're a signal something needs attention.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can dehydration really cause headaches?</summary><div class="faq-answer"><p>Yes. It's one of the easiest things to fix and one of the most overlooked.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What's the difference between a migraine and a regular headache?</summary><div class="faq-answer"><p>Migraines are usually one-sided, throbbing, often with nausea or light sensitivity, and can last hours to days. Tension headaches feel like a band around your head and are usually milder.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can my period really cause migraines?</summary><div class="faq-answer"><p>Yes. Estrogen drops right before your period and that drop triggers migraines in many women. Talk to your doctor about options.</p></div></details>
      <p>Most chronic headache sufferers find two or three of these strategies cut their headaches in half. Stack them and many people stop having daily headaches altogether.</p>
    `
  },
  {
    id: 'hair-falling-out-causes',
    image: '/images/articles/hair_loss_real.jpg',
    category: 'Hair & Skin',
    title: "Hair Falling Out? The Real Causes and What Helps",
    metaDesc: "Finding hair on your pillow, in the shower, everywhere? Here are the real reasons for hair loss and what genuinely helps regrow it.",
    primaryKeyword: "hair falling out causes",
    readTime: '5 min read',
    date: 'May 17, 2025',
    content: `
      <p>Brushing your hair shouldn't feel like watching it leave you. But if you're noticing extra strands in the shower drain, on your pillow, on your shirt, you're not imagining it — and you're definitely not alone. Hair loss affects most people at some point, and the cause is usually less scary than you think.</p>
      <p>The catch is hair has a long memory. Whatever happened three or four months ago is what's showing up now. So when you finally notice the shedding, the trigger is often something you've already moved past.</p>

      <h2>Why Your Hair Is Falling Out</h2>
      <p>The usual causes:</p>
      <ul>
        <li>Stress, especially big life events three months prior (this is called telogen effluvium)</li>
        <li>Postpartum hormone shifts</li>
        <li>Iron deficiency — extremely common in women</li>
        <li>Low vitamin D</li>
        <li>Low ferritin</li>
        <li>Thyroid issues</li>
        <li>Crash dieting or sudden weight loss</li>
        <li>Pregnancy, birth control changes, perimenopause, menopause</li>
        <li>COVID-19 (a known trigger)</li>
        <li>Genetic pattern hair loss</li>
        <li>Tight hairstyles over time</li>
        <li>Harsh chemical treatments</li>
      </ul>
      <p>Most non-genetic hair loss is reversible once you address the cause. But you need to know what's causing yours.</p>

      <h2>What Actually Helps</h2>
      <p><strong>Get bloodwork.</strong> Iron, ferritin, vitamin D, B12, thyroid, and zinc. This is the single most useful thing you can do. Many doctors will only run a thyroid test unless you specifically ask.</p>
      <p><strong>Eat enough protein.</strong> Hair is made of protein. If you're under-eating or eating very low protein, your hair sheds. Aim for 0.7–1 gram of protein per pound of goal body weight.</p>
      <p><strong>Eat iron-rich foods.</strong> Red meat, lentils, spinach, pumpkin seeds. If you're vegetarian or vegan, pay extra attention here.</p>
      <p><strong>Manage your stress.</strong> Easier said than done, but stress is one of the most common triggers. Sleep, walks, therapy if needed.</p>
      <p><strong>Be gentle.</strong> Stop pulling your hair into tight buns daily. Skip heat styling for a while. Use a wide-tooth comb on wet hair, not a brush.</p>
      <p><strong>Try minoxidil.</strong> It works for many people, both men and women. Available over the counter. You have to use it consistently for 4–6 months to see a change, and you have to keep using it.</p>
      <p><strong>Consider rosemary oil.</strong> A 2015 study found 5% rosemary oil performed similarly to 2% minoxidil for some types of hair loss. Cheap, easy to try.</p>
      <p><strong>Add a hair-friendly supplement if needed.</strong> Biotin doesn't do much unless you're deficient. Iron, zinc, vitamin D, and collagen have more support behind them — only supplement what you're actually low on.</p>
      <p><strong>Sleep on a silk or satin pillowcase.</strong> Less breakage, less friction.</p>
      <p><strong>Don't crash diet.</strong> Rapid weight loss almost always triggers shedding.</p>

      <h2>When to See a Doctor or Dermatologist</h2>
      <p>If you're losing hair in patches, your scalp is itchy or sore, or you're losing eyebrow or eyelash hair, see a dermatologist soon. Same if shedding has been heavy for more than three months despite eating well and managing stress. Conditions like alopecia areata, thyroid disorders, and pattern hair loss have actual treatments — and the earlier you start, the better the result.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">How much hair loss per day is normal?</summary><div class="faq-answer"><p>About 50–100 hairs a day. Sounds like a lot, but it adds up to a normal shed. If you're seeing clumps or a noticeable change in density, that's different.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Will my hair grow back?</summary><div class="faq-answer"><p>Most non-genetic hair loss grows back once you fix the cause, though it can take 6–12 months. Genetic pattern hair loss is slowly progressive but treatable.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Does stress really cause hair loss?</summary><div class="faq-answer"><p>Yes, very much so. Stress pushes hair into a resting phase, and it sheds about three months later. The good news is it usually grows back.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Does biotin work?</summary><div class="faq-answer"><p>Only if you're deficient, which most people aren't. Iron, vitamin D, and protein are way more likely to be your missing piece.</p></div></details>
      <p>Hair loss is alarming but rarely permanent. Get tested, eat well, manage your stress, and give it time. Hair grows slow but it does grow back for most people.</p>
    `
  },
  {
    id: 'stiff-achy-joints-causes',
    image: '/images/articles/stiff_joints_real.jpg',
    category: 'Pain Relief',
    title: "Stiff, Achy Joints in Your 30s and 40s: Here's What's Going On",
    metaDesc: "Joints getting stiff and creaky too early? Find out what's causing it and the simple changes that actually keep you moving.",
    primaryKeyword: "stiff achy joints",
    readTime: '4 min read',
    date: 'Sep 11, 2025',
    content: `
      <p>You used to be able to jump out of bed. Now you swing your legs over, sit on the edge, and inventory your knees, lower back, and hips before standing up. If joint stiffness is showing up earlier than you expected, you're in good company — and there's a lot you can do about it.</p>
      <p>The thing nobody told you is joint pain in your 30s and 40s usually isn't arthritis. It's mostly weakness, tightness, inflammation, and not enough movement. All fixable.</p>

      <h2>Why Your Joints Are Aching</h2>
      <p>A few quiet causes:</p>
      <ul>
        <li>Sitting too much (the big one)</li>
        <li>Loss of muscle around the joint</li>
        <li>Weight gain putting more load on joints</li>
        <li>Dehydration — your joints need water</li>
        <li>Inflammation from ultra-processed food, sugar, and alcohol</li>
        <li>Vitamin D deficiency</li>
        <li>Low magnesium</li>
        <li>Hormone changes, especially in perimenopause</li>
        <li>Sleep that's too short to repair tissues</li>
        <li>Old injuries that healed weak</li>
        <li>Overdoing it on weekends after sitting all week</li>
        <li>Genuine arthritis, which does start to show up in your 40s for some</li>
      </ul>
      <p>That last point matters. Some early joint pain is the start of osteoarthritis or another condition, and getting a diagnosis early helps a lot.</p>

      <h2>What Actually Helps</h2>
      <p><strong>Move every day.</strong> Joints need motion to stay healthy. Cartilage gets its nutrients from movement, not blood flow. Even a 20-minute walk makes a difference.</p>
      <p><strong>Strength train.</strong> Twice a week, at minimum. Strong muscles take pressure off joints. People who lift have less joint pain than people who only do cardio.</p>
      <p><strong>Lose weight if you have extra to lose.</strong> Every extra pound is four pounds of force through your knees when you walk. The math is unforgiving.</p>
      <p><strong>Hydrate.</strong> Joint cartilage is 70–80% water. Most people are chronically under-hydrated.</p>
      <p><strong>Eat more omega-3s.</strong> Fatty fish, walnuts, chia seeds, or a quality fish oil. Strong evidence for reducing joint inflammation.</p>
      <p><strong>Cut ultra-processed food.</strong> Sugar and refined oils crank up inflammation. Two weeks off them and many people feel a real difference.</p>
      <p><strong>Stretch and mobilize.</strong> Especially your hips, hamstrings, and shoulders. Five to ten minutes a day.</p>
      <p><strong>Try collagen and vitamin D if you're low.</strong> Collagen peptides have okay evidence for joint comfort. Vitamin D is critical and most people are low.</p>
      <p><strong>Sleep enough.</strong> Your body repairs tissues at night. Short sleep means stiff mornings.</p>
      <p><strong>Warm up before exercise.</strong> Don't go from sitting all day to a hard workout. Five minutes of easy movement first.</p>
      <p><strong>Use heat in the morning, ice for acute flares.</strong> Both are useful, but for different things.</p>

      <h2>When to See a Doctor</h2>
      <p>Joints that are red, swollen, or warm; joint pain on both sides of your body (knees, hands, etc.); morning stiffness lasting over an hour; fevers with joint pain; or pain that's getting worse despite the basics — go in. Conditions like rheumatoid arthritis, osteoarthritis, and gout all have effective treatments, and early is better.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Can I really get arthritis in my 30s?</summary><div class="faq-answer"><p>Yes, especially if you've had previous joint injuries or have a family history. Rheumatoid arthritis often shows up between 30 and 50.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Do supplements like glucosamine actually work?</summary><div class="faq-answer"><p>The evidence is mixed. Some people swear by it, studies are inconsistent. Try it for three months and see — it's safe for most people.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Should I stop exercising if my joints hurt?</summary><div class="faq-answer"><p>No, but change what you're doing. Swap running for swimming or cycling for a few weeks. Movement helps; the wrong movement hurts.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is cracking my joints bad?</summary><div class="faq-answer"><p>The cracking sound (without pain) is harmless. Most knuckle-crackers and stiff-jointed people aren't damaging anything.</p></div></details>
      <p>Most people in their 30s and 40s who start strength training, cut down on processed food, and walk daily feel like a different person within a couple months. Joints respond well to consistent care — they just need it.</p>
    `
  }


,
{
  id: "prevent-falls-stay-steady",
  image: "/images/articles/prevent_falls.jpg",
  category: "Safety",
  title: "Worried About Falling? Simple Ways to Stay Steady on Your Feet",
  metaDesc: "Falls are common after 60 but mostly preventable. Here are simple, practical ways to improve your balance and stay steady at home.",
  primaryKeyword: "how to prevent falls in seniors",
  readTime: "4 min read",
    date: 'Apr 7, 2025',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>If you've started moving a little more carefully — holding the railing, watching your step on the curb — you're not being overly cautious. You're being smart. Falls are the most common cause of injury for older adults, but here's the part that doesn't get said enough: most falls can be prevented. A few changes around your home and a few minutes of the right exercises can make a real difference.</p>

      <h2>Why Falls Happen More As We Age</h2>
      <p>It's rarely one thing. Usually it's a few small things adding up:</p>
      <ul>
        <li>Muscles, especially in the legs and core, naturally weaken over the years</li>
        <li>Balance and reflexes slow down</li>
        <li>Eyesight changes make it harder to spot hazards</li>
        <li>Some medications cause dizziness or lightheadedness</li>
        <li>Inner ear issues affect balance</li>
        <li>Clutter, loose rugs, and poor lighting at home</li>
        <li>Foot problems and unsupportive shoes</li>
      </ul>
      <p>The good news is nearly every one of these can be improved.</p>

      <h2>Simple Ways to Stay Steady</h2>
      <p><strong>Do balance exercises a few times a week.</strong> Stand on one foot while holding the kitchen counter. Practice standing up from a chair without using your hands. Walk heel-to-toe across the room. Just a few minutes makes your balance noticeably better within weeks.</p>
      <p><strong>Keep your legs strong.</strong> Strong legs catch you when you stumble. Simple sit-to-stand exercises from a sturdy chair, done 10 times a day, build the muscle that keeps you upright.</p>
      <p><strong>Clear the walkways at home.</strong> Pick up loose cords, remove or tape down throw rugs, and keep paths between rooms clear. Most falls happen at home, and most of those happen over things that didn't need to be there.</p>
      <p><strong>Add lighting.</strong> Put nightlights in the hallway and bathroom. Keep a lamp within reach of your bed. A lot of falls happen on the way to the bathroom at night.</p>
      <p><strong>Install grab bars.</strong> In the shower and next to the toilet. They're inexpensive and they prevent the falls that tend to cause the worst injuries.</p>
      <p><strong>Wear good shoes, even indoors.</strong> Supportive shoes with non-slip soles. Slippers and socks on smooth floors are a common cause of slips.</p>
      <p><strong>Get your eyes checked yearly.</strong> Updated glasses help you see steps, curbs, and hazards clearly.</p>
      <p><strong>Review your medications.</strong> Ask your doctor or pharmacist if any of your prescriptions can cause dizziness — especially if you take several. Sometimes the timing or dose can be adjusted.</p>
      <p><strong>Stand up slowly.</strong> Blood pressure can drop when you rise too fast, making you lightheaded. Sit on the edge of the bed for a moment before standing.</p>

      <h2>When to Talk to Your Doctor</h2>
      <p>Tell your doctor if you've fallen, even if you weren't hurt, or if you've had a near-fall or feel unsteady. This isn't something to be embarrassed about — it's important information. Your doctor can check your balance, review your medications, test your blood pressure, and refer you to physical therapy. A physical therapist can give you exercises tailored to you, and it genuinely works.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Is it normal to lose my balance as I get older?</summary><div class="faq-answer"><p>Some change is normal, but feeling unsteady isn't something you simply have to accept. Balance can be improved at any age with the right exercises.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What exercise is best for balance?</summary><div class="faq-answer"><p>Tai chi has excellent research behind it for older adults. Simple standing exercises and leg strengthening also help a lot. Many senior centers offer free classes.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Should I use a cane or walker?</summary><div class="faq-answer"><p>If your doctor recommends one, use it. The right walking aid prevents falls — it doesn't cause dependence. Just make sure it's fitted to your height.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What should I do if I fall and can't get up?</summary><div class="faq-answer"><p>Stay calm, don't rush. If you have a medical alert device or phone within reach, use it. This is exactly why keeping a phone on you, or wearing an alert button, is worth it.</p></div></details>
      <p>Staying steady isn't about slowing down your life. It's about doing a few simple things so you can keep living it fully and confidently.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "knee-pain-after-60",
  image: "/images/articles/knee_pain.jpg",
  category: "Pain Relief",
  title: "Knee Pain After 60: What Helps and What to Avoid",
  metaDesc: "Knee pain doesn't have to slow you down. Here's what's causing it, what actually helps, and how to keep moving comfortably.",
  primaryKeyword: "knee pain in seniors",
  readTime: "4 min read",
    date: 'Nov 15, 2026',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>Getting up from a chair, climbing stairs, getting out of the car — if your knees complain every time, you know how much it can wear on you. Knee pain is one of the most common discomforts people deal with as they get older. The encouraging news is there's a lot you can do to feel better without surgery, and staying active is a big part of it.</p>

      <h2>What's Causing Your Knee Pain</h2>
      <p>The most common cause after 60 is osteoarthritis — the cushioning cartilage in the joint wears down over time, so the bones don't glide as smoothly. Other causes include:</p>
      <ul>
        <li>Old injuries that never fully healed</li>
        <li>Extra body weight putting more load on the joint</li>
        <li>Weak muscles around the knee</li>
        <li>Inflammation</li>
        <li>Tendon problems</li>
      </ul>
      <p>A doctor can usually tell what's going on with a simple exam, and sometimes an X-ray.</p>

      <h2>What Actually Helps</h2>
      <p><strong>Keep moving — gently.</strong> It feels backward, but resting too much makes knee pain worse. Cartilage and joints need movement to stay healthy. A daily walk, even a short one, helps.</p>
      <p><strong>Strengthen the muscles around the knee.</strong> Strong thigh muscles take pressure off the joint. Straight-leg raises and gentle sit-to-stands from a chair are easy and effective. A physical therapist can show you a routine.</p>
      <p><strong>Choose low-impact exercise.</strong> Swimming, water aerobics, and stationary cycling are wonderful for sore knees. The water supports your weight while you stay active.</p>
      <p><strong>Lose a little weight if you can.</strong> Every pound off your body takes about four pounds of pressure off your knees with each step. Even modest weight loss helps a great deal.</p>
      <p><strong>Use heat and cold.</strong> Warmth before activity loosens a stiff joint. Cold afterward calms swelling and soreness.</p>
      <p><strong>Try over-the-counter pain relief, carefully.</strong> Acetaminophen or anti-inflammatory creams can help. If you take other medications, check with your pharmacist first — some pain relievers don't mix well with common prescriptions.</p>
      <p><strong>Wear supportive shoes.</strong> Good cushioning makes a real difference. Skip worn-out shoes and unsupportive sandals.</p>
      <p><strong>Consider a cane on bad days.</strong> Used in the hand opposite the sore knee, it takes pressure off and keeps you moving.</p>

      <h2>What to Avoid</h2>
      <p>Avoid sitting still for hours — stiffness sets in fast. Avoid high-impact activities like jumping or running on hard surfaces. And don't push through sharp pain; gentle discomfort during exercise is okay, but sharp pain is a signal to stop.</p>

      <h2>When to See a Doctor</h2>
      <p>See your doctor if your knee is swollen, warm, or red; if it locks or gives way; if the pain is keeping you from sleeping or doing daily tasks; or if it isn't improving. There are good options beyond what you can do at home — physical therapy, injections, and, when needed, joint replacement, which helps a great many people return to a comfortable, active life.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Should I exercise if my knees hurt?</summary><div class="faq-answer"><p>Yes, but choose the right kind. Low-impact movement helps; high-impact activity can aggravate it. When in doubt, ask a physical therapist.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Do glucosamine supplements work for knee pain?</summary><div class="faq-answer"><p>The research is mixed. Some people find them helpful, others don't. They're generally safe to try for a few months if you'd like to.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is knee replacement surgery worth it?</summary><div class="faq-answer"><p>For many people with severe arthritis, it's life-changing. It's a real recovery, but most people are glad they did it. Your doctor can tell you if you're a candidate.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Why are my knees stiff in the morning?</summary><div class="faq-answer"><p>Joints stiffen up after hours of stillness. Gentle movement and stretching in the morning loosens them. If stiffness lasts more than an hour, mention it to your doctor.</p></div></details>
      <p>You don't have to give up the activities you enjoy. With the right care, most people keep their knees comfortable enough to stay active for years.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "lower-blood-pressure-simple-habits",
  image: "/images/articles/blood_pressure.jpg",
  category: "Heart Health",
  title: "High Blood Pressure: Simple Habits That Make a Real Difference",
  metaDesc: "Managing high blood pressure doesn't have to be complicated. Here are simple, proven habits that help bring your numbers down.",
  primaryKeyword: "how to lower blood pressure naturally",
  readTime: "4 min read",
    date: 'Aug 21, 2026',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>High blood pressure is sometimes called "the silent condition" because it usually has no symptoms — you can feel perfectly fine while it quietly puts strain on your heart and blood vessels. If your doctor has told you your numbers are high, the good news is that everyday habits, alongside any medication you take, can make a genuine difference.</p>

      <h2>Why Blood Pressure Matters</h2>
      <p>Blood pressure is the force of blood pushing against your artery walls. When it stays high over time, it makes your heart work harder and raises the risk of heart problems, stroke, and kidney issues. Because there are no warning signs, the only way to know your numbers is to check them.</p>
      <p>For most older adults, a reading below 130/80 is a common goal — but your doctor will tell you the right target for you, since it can vary based on your age and health.</p>

      <h2>Simple Habits That Help</h2>
      <p><strong>Watch the salt.</strong> Most of the salt in our diets comes from packaged and restaurant food, not the salt shaker. Canned soups, deli meats, frozen dinners, and bread are big sources. Cooking more meals at home gives you control.</p>
      <p><strong>Eat more fruits and vegetables.</strong> They're rich in potassium, which helps balance out sodium. Bananas, potatoes, spinach, beans, and oranges are all good choices. The DASH eating plan was designed specifically for blood pressure and is worth looking up.</p>
      <p><strong>Move your body most days.</strong> A 30-minute walk most days of the week can lower blood pressure noticeably. You can break it into three 10-minute walks if that's easier.</p>
      <p><strong>Lose a little weight if you carry extra.</strong> Even losing 5 to 10 pounds can bring your numbers down.</p>
      <p><strong>Limit alcohol.</strong> If you drink, keep it light — no more than one drink a day. More than that raises blood pressure.</p>
      <p><strong>Manage stress.</strong> Ongoing stress keeps blood pressure up. Whatever helps you unwind — gentle walks, time with friends, a hobby, deep breathing — counts as heart care.</p>
      <p><strong>Get enough sleep.</strong> Poor sleep is linked to higher blood pressure. Aim for 7 to 8 hours.</p>
      <p><strong>Take your medication as prescribed.</strong> If your doctor has prescribed blood pressure medication, take it consistently, even when you feel fine. Never stop on your own — talk to your doctor first.</p>
      <p><strong>Check your pressure at home.</strong> A simple home monitor lets you and your doctor see how you're doing. Check at the same time each day and write the numbers down.</p>

      <h2>When to Call Your Doctor</h2>
      <p>Call your doctor if your home readings are consistently high, or if you ever get a very high reading along with headache, chest pain, shortness of breath, vision changes, or weakness — that needs urgent attention. Otherwise, regular check-ins let your doctor adjust your plan as needed.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Can I lower blood pressure without medication?</summary><div class="faq-answer"><p>Some people can, with lifestyle changes, especially if their numbers are only mildly high. Others need medication too. Both approaches work together — never stop medication without your doctor's guidance.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Why is my blood pressure higher at the doctor's office?</summary><div class="faq-answer"><p>It's so common it has a name — "white coat" effect. The nervousness of a visit raises it temporarily. This is exactly why home readings are helpful.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Does coffee raise blood pressure?</summary><div class="faq-answer"><p>It can cause a short-term bump, but moderate coffee drinking isn't a major concern for most people. If you're sensitive to it, you'll notice.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">How often should I check my blood pressure?</summary><div class="faq-answer"><p>If you're managing high blood pressure, daily home checks during certain periods help. Your doctor will tell you what's right for you.</p></div></details>
      <p>Managing blood pressure is mostly about steady, everyday habits. Small changes, kept up over time, protect your heart and let you feel your best.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "memory-changes-what-is-normal",
  image: "/images/articles/memory_loss.jpg",
  category: "Mental Clarity",
  title: "Forgetting Things More Often? When It's Normal and When to Check",
  metaDesc: "Misplacing your keys or forgetting a name? Here's what's normal aging, what's not, and how to keep your memory sharp.",
  primaryKeyword: "memory loss in seniors",
  readTime: "4 min read",
    date: 'Nov 19, 2026',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>You walk into a room and forget why. A name is right on the tip of your tongue but won't come. You misplace your reading glasses for the third time today. If moments like these have you quietly worried, you're far from alone — and the truth is, most of these everyday slips are a normal part of getting older.</p>
      <p>Knowing the difference between ordinary forgetfulness and something worth checking can put your mind at ease.</p>

      <h2>What's Normal Forgetfulness</h2>
      <p>As we age, the brain works a little more slowly, much like the rest of the body. These things are common and usually nothing to worry about:</p>
      <ul>
        <li>Occasionally forgetting names or appointments, then remembering them later</li>
        <li>Misplacing everyday items now and then</li>
        <li>Needing a moment longer to recall a word</li>
        <li>Getting briefly distracted and losing your train of thought</li>
        <li>Forgetting which day it is but figuring it out easily</li>
      </ul>
      <p>This kind of forgetfulness doesn't really interfere with your independence or daily life.</p>

      <h2>What's Worth Checking</h2>
      <p>These signs are worth a conversation with your doctor:</p>
      <ul>
        <li>Forgetting recently learned information often</li>
        <li>Getting lost in familiar places</li>
        <li>Trouble following a recipe or managing bills you've always handled</li>
        <li>Struggling to find words in everyday conversation, not just occasionally</li>
        <li>Repeating questions or stories in a short time</li>
        <li>Family or friends noticing changes that concern them</li>
      </ul>
      <p>Memory changes can also be caused by very treatable things — vitamin B12 deficiency, thyroid problems, certain medications, depression, poor sleep, or dehydration. That's exactly why it's worth getting checked rather than worrying alone.</p>

      <h2>How to Keep Your Memory Sharp</h2>
      <p><strong>Stay physically active.</strong> Exercise boosts blood flow to the brain and is one of the best things you can do for memory. A daily walk counts.</p>
      <p><strong>Keep learning and challenging your brain.</strong> Puzzles, reading, cards, a new hobby, a class. The brain stays sharper when it's used.</p>
      <p><strong>Stay socially connected.</strong> Conversation and time with others is real exercise for the mind. Isolation is hard on memory.</p>
      <p><strong>Sleep well.</strong> The brain sorts and stores memories during sleep. Poor sleep makes forgetfulness worse.</p>
      <p><strong>Eat well.</strong> A diet with plenty of vegetables, fruit, whole grains, fish, and healthy fats — often called the Mediterranean diet — supports brain health.</p>
      <p><strong>Manage blood pressure, blood sugar, and hearing.</strong> What's good for your heart is good for your brain. Untreated hearing loss is also linked to memory decline, so get your hearing checked.</p>
      <p><strong>Stay organized.</strong> Use a calendar, a notepad, a pill organizer, a set spot for your keys. These aren't signs of decline — they're smart tools everyone benefits from.</p>

      <h2>When to See a Doctor</h2>
      <p>If memory changes are interfering with daily life, or if loved ones are concerned, see your doctor. Early evaluation is genuinely worthwhile — it can uncover treatable causes, and if it is something more, early support and planning make a real difference.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Is forgetting names a sign of dementia?</summary><div class="faq-answer"><p>Usually not. Occasionally forgetting names, then recalling them later, is a normal part of aging. It's persistent, worsening memory problems that warrant a check.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can stress and anxiety affect memory?</summary><div class="faq-answer"><p>Yes, quite a lot. Stress, worry, and depression all make it harder to concentrate and remember. Treating them often improves memory.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Do brain games really work?</summary><div class="faq-answer"><p>They keep your mind engaged, which is good. But physical exercise, good sleep, and social connection have even stronger evidence behind them.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What vitamin deficiency causes memory problems?</summary><div class="faq-answer"><p>Low vitamin B12 is a well-known cause and is easily checked with a blood test and treated. Always worth ruling out.</p></div></details>
      <p>A little forgetfulness is part of life, not a crisis. Stay active, stay connected, and if something feels off, get it checked — for peace of mind as much as anything.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "better-sleep-as-you-age",
  image: "/images/articles/better_sleep.jpg",
  category: "Sleep",
  title: "Trouble Sleeping As You Get Older? Here's What Helps",
  metaDesc: "Waking up at night or up too early? Sleep changes with age, but you can still sleep well. Here's what genuinely helps.",
  primaryKeyword: "sleep problems in seniors",
  readTime: "4 min read",
    date: 'Oct 18, 2026',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>If you find yourself waking up several times a night, lying awake at 4 a.m., or feeling tired even after a full night in bed, you're experiencing one of the most common frustrations of getting older. Sleep does change with age — but poor sleep is not something you simply have to live with. There's a lot you can do to rest better.</p>

      <h2>Why Sleep Changes With Age</h2>
      <p>As we age, sleep naturally becomes a little lighter, and we tend to wake more easily. You might also feel sleepy earlier in the evening and wake earlier in the morning. That's a normal shift in your body's clock.</p>
      <p>But ongoing poor sleep often has specific causes:</p>
      <ul>
        <li>Aches and pains that make it hard to get comfortable</li>
        <li>Needing to use the bathroom at night</li>
        <li>Certain medications</li>
        <li>Caffeine later in the day than your body can handle</li>
        <li>Less physical activity and less daylight</li>
        <li>Daytime napping</li>
        <li>Worry and stress</li>
        <li>Sleep apnea, which is common and often undiagnosed</li>
        <li>Restless legs</li>
      </ul>
      <p>Many of these can be addressed.</p>

      <h2>What Actually Helps</h2>
      <p><strong>Keep a regular schedule.</strong> Go to bed and wake up at about the same time every day, weekends included. Your body loves routine.</p>
      <p><strong>Get outside during the day.</strong> Daylight, especially in the morning, helps set your internal clock. A morning walk does double duty.</p>
      <p><strong>Stay active.</strong> Regular daytime activity leads to deeper sleep at night. Just avoid vigorous exercise right before bed.</p>
      <p><strong>Be careful with naps.</strong> A short rest is fine, but long or late-afternoon naps can steal from your nighttime sleep. Keep them under 30 minutes and before mid-afternoon.</p>
      <p><strong>Watch caffeine and alcohol.</strong> Caffeine can linger in your system for many hours — keep it to the morning. Alcohol may help you doze off but leads to broken sleep later in the night.</p>
      <p><strong>Limit fluids in the evening.</strong> If trips to the bathroom wake you, taper off drinks a couple of hours before bed. Mention frequent night waking to your doctor too — it can have treatable causes.</p>
      <p><strong>Make your bedroom restful.</strong> Cool, dark, and quiet. A comfortable mattress and pillow matter more as we age and our joints get pickier.</p>
      <p><strong>Wind down before bed.</strong> A calm hour before sleep — reading, gentle music, a warm bath. Skip the bright screens of phones and tablets.</p>
      <p><strong>Treat pain before bed.</strong> If aches keep you up, talk to your doctor about managing them so they don't interrupt your rest.</p>

      <h2>When to Talk to Your Doctor</h2>
      <p>See your doctor if poor sleep is wearing on you during the day, if you snore loudly or wake up gasping (signs of sleep apnea), or if you feel your legs are restless at night. Also mention any sleep medications you're using — some aren't ideal for older adults long-term, and your doctor can suggest safer approaches. A type of counseling called CBT-I is very effective for ongoing sleep trouble.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Do older adults need less sleep?</summary><div class="faq-answer"><p>Not really — most adults still need 7 to 8 hours. The pattern changes, but the need doesn't disappear.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is it bad to take sleeping pills?</summary><div class="faq-answer"><p>Some sleep medications carry extra risks for older adults, including next-day grogginess and falls. Talk to your doctor about the safest option for you rather than relying on them long-term.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Why do I wake up so early now?</summary><div class="faq-answer"><p>A shift in your body clock is normal with age. Getting bright light later in the day can help nudge it.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is melatonin safe for seniors?</summary><div class="faq-answer"><p>It's generally considered low-risk short-term, and a low dose is best. Check with your doctor, especially if you take other medications.</p></div></details>
      <p>Good sleep is still very much within reach. Steady routines, daylight, activity, and a restful bedroom go a long way toward waking up rested again.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "managing-your-medications-safely",
  image: "/images/articles/manage_meds.jpg",
  category: "Safety",
  title: "Taking Several Medications? How to Stay Safe and Organized",
  metaDesc: "Juggling multiple prescriptions? Here's how to manage your medications safely, avoid mistakes, and keep everything on track.",
  primaryKeyword: "managing multiple medications",
  readTime: "4 min read",
    date: 'Aug 25, 2025',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>If you take a handful of pills each day — maybe one for blood pressure, one for cholesterol, something for your joints, a vitamin or two — keeping it all straight can feel like a part-time job. You're not alone; many older adults take several medications. The key is having a simple system so you can take everything correctly and safely.</p>

      <h2>Why This Matters</h2>
      <p>The more medications you take, the easier it is for small mistakes to happen — a missed dose, a double dose, or two medicines that don't work well together. Some combinations can cause side effects like dizziness, which raises the risk of falls. None of this means you shouldn't take your medications. It means a little organization goes a long way.</p>

      <h2>How to Stay Organized</h2>
      <p><strong>Keep an up-to-date list.</strong> Write down every medication you take — prescriptions, over-the-counter products, vitamins, and supplements. Include the dose and what it's for. Keep a copy in your wallet and one at home.</p>
      <p><strong>Use a pill organizer.</strong> A weekly organizer with compartments for each day, and for morning and evening if needed, makes it easy to see at a glance whether you've taken your dose.</p>
      <p><strong>Take medications at consistent times.</strong> Tie them to daily routines — with breakfast, with dinner — so they become automatic. Phone alarms or a written checklist help.</p>
      <p><strong>Use one pharmacy.</strong> When all your prescriptions go through the same pharmacy, the pharmacist can spot interactions and warn you. Pharmacists are a wonderful, free resource — don't hesitate to ask them questions.</p>
      <p><strong>Bring everything to your doctor visits.</strong> Once a year, or whenever a new medication starts, bring your full list — or even the actual bottles — so your doctor can review it. This is sometimes called a "brown bag review."</p>
      <p><strong>Ask if anything can be simplified.</strong> Sometimes medications are no longer needed, or a combination pill can replace two. It's always fair to ask, "Do I still need all of these?"</p>
      <p><strong>Store medications properly.</strong> Keep them in a cool, dry place — usually not the bathroom, where humidity builds up. Keep them away from grandchildren's reach.</p>
      <p><strong>Don't share or borrow medications.</strong> What's right for someone else may be wrong, or dangerous, for you.</p>
      <p><strong>Refill before you run out.</strong> Set a reminder a week ahead. Many pharmacies offer automatic refills and even delivery.</p>

      <h2>Warning Signs to Watch For</h2>
      <p>Tell your doctor if you notice new dizziness, confusion, unusual tiredness, stomach upset, or a fall — these can sometimes be medication-related and may be fixable with an adjustment. Never stop a prescription on your own; talk to your doctor first.</p>

      <h2>When to Ask for a Medication Review</h2>
      <p>It's a good idea to have your full medication list reviewed at least once a year, or any time you see a new doctor, leave the hospital, or start something new. A pharmacist or your primary doctor can do this. It's one of the simplest ways to stay safe.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Is it bad to take many medications?</summary><div class="faq-answer"><p>Not necessarily — many conditions are well managed with medication. The goal is making sure each one is still needed and that they work well together, which a yearly review handles.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can I take over-the-counter medicine with my prescriptions?</summary><div class="faq-answer"><p>Sometimes, but not always. Even common products like pain relievers and antacids can interact with prescriptions. Ask your pharmacist first.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What should I do if I miss a dose?</summary><div class="faq-answer"><p>It depends on the medication. Many have instructions on the label, but the safest move is to ask your pharmacist what to do for each specific one.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Should I use a medication reminder app?</summary><div class="faq-answer"><p>If you're comfortable with a phone, they can help. A simple pill organizer and a written checklist work just as well for many people.</p></div></details>
      <p>A good system turns medication management from a worry into a routine. Stay organized, keep one pharmacy, and ask questions — your pharmacist and doctor are there to help.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "protect-your-bones-prevent-fractures",
  image: "/images/articles/strong_bones.jpg",
  category: "Bone Health",
  title: "Protecting Your Bones: How to Stay Strong and Prevent Fractures",
  metaDesc: "Bones weaken with age, but you can protect them. Here's how to keep your bones strong and lower your risk of fractures.",
  primaryKeyword: "how to keep bones strong as you age",
  readTime: "4 min read",
    date: 'May 25, 2026',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>Bones might seem like they just quietly do their job, but they're living tissue that needs care, especially as we get older. Over time, bones can gradually lose density and become more fragile — a condition called osteoporosis — which makes fractures more likely. The reassuring news is that there's a lot you can do at any age to keep your bones strong.</p>

      <h2>Why Bones Weaken With Age</h2>
      <p>Throughout life, your body constantly removes old bone and builds new bone. As we age, the rebuilding slows down, so bone is lost faster than it's replaced. This happens more quickly for women in the years after menopause, but it affects men too.</p>
      <p>Weaker bones often have no symptoms — many people don't know their bones have thinned until a fall causes a fracture. That's why prevention matters so much.</p>

      <h2>How to Keep Your Bones Strong</h2>
      <p><strong>Get enough calcium.</strong> Calcium is the main building block of bone. Good sources include dairy products, fortified plant milks, leafy greens, canned fish with soft bones, and fortified foods. Most older adults need around 1,200 mg a day — your doctor can tell you if you need a supplement.</p>
      <p><strong>Get enough vitamin D.</strong> Vitamin D helps your body absorb calcium. Your skin makes it from sunlight, but many older adults are low, especially in winter. Fortified foods, fatty fish, and supplements help. Ask your doctor about checking your level.</p>
      <p><strong>Do weight-bearing exercise.</strong> Activities where you're on your feet — walking, dancing, climbing stairs — signal your bones to stay strong. Aim for most days of the week.</p>
      <p><strong>Add strength exercises.</strong> Working your muscles with light weights or resistance bands pulls on your bones and helps maintain density. Twice a week is a good target.</p>
      <p><strong>Include balance exercises.</strong> Strong bones matter most alongside good balance, since preventing falls prevents fractures. Tai chi and simple standing exercises help.</p>
      <p><strong>Don't smoke.</strong> Smoking speeds up bone loss.</p>
      <p><strong>Limit alcohol.</strong> Heavy drinking weakens bones and raises fall risk. Keep it light.</p>
      <p><strong>Eat enough protein.</strong> Bone isn't just minerals — protein is part of its structure too. Include a protein source at each meal.</p>
      <p><strong>Ask about a bone density scan.</strong> A simple, painless test called a DEXA scan measures your bone strength. It's commonly recommended for women around 65 and sometimes earlier, and for men with risk factors. Your doctor will advise.</p>

      <h2>When to Talk to Your Doctor</h2>
      <p>Talk to your doctor about your bone health if you've broken a bone from a minor fall, if you've lost height, if your posture has become more stooped, or if osteoporosis runs in your family. If your bones have thinned significantly, there are effective medications that can strengthen them and lower fracture risk.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Does everyone get osteoporosis as they age?</summary><div class="faq-answer"><p>No. Bone loss is common, but how much you lose varies a lot. Diet, exercise, and lifestyle make a real difference.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can I rebuild bone density?</summary><div class="faq-answer"><p>You can slow bone loss and, with the right exercise, medication, and nutrition, sometimes improve density. Protecting what you have is always worthwhile.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">How much calcium do I really need?</summary><div class="faq-answer"><p>Most older adults need about 1,200 mg daily. It's best to get it from food when you can; your doctor can advise on supplements.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is walking enough to protect my bones?</summary><div class="faq-answer"><p>Walking helps and is great for you, but adding strength exercises gives your bones an extra signal to stay strong. The combination is best.</p></div></details>
      <p>Strong bones are built through everyday habits — good nutrition, regular movement, and steady care. It's never too late to start protecting them.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "staying-active-after-65",
  image: "/images/articles/senior_exercise.jpg",
  category: "Fitness",
  title: "Staying Active After 65: Safe, Simple Exercise That Works",
  metaDesc: "Want to stay active but not sure where to start? Here's safe, simple exercise for older adults that builds strength and energy.",
  primaryKeyword: "exercise for seniors",
  readTime: "4 min read",
    date: 'Dec 18, 2026',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>You don't need a gym membership, fancy equipment, or to push yourself hard to stay healthy. Staying active in your later years is one of the single best things you can do for your body and mind — and it can be gentle, enjoyable, and built right into your day. If it's been a while since you exercised, that's perfectly fine. The best time to start is now.</p>

      <h2>Why Staying Active Matters So Much</h2>
      <p>Regular movement helps with nearly everything that matters as we age. It keeps your muscles strong so daily tasks stay easy, improves your balance so you're less likely to fall, supports your heart, helps manage blood pressure and blood sugar, lifts your mood, sharpens your mind, and helps you sleep better. It also keeps you independent — able to do the things you want to do, on your own terms.</p>

      <h2>The Four Kinds of Exercise to Include</h2>
      <p>You don't need to do all of these every day, but a good routine includes a mix.</p>
      <p><strong>Walking and other gentle cardio.</strong> Walking is wonderful — free, easy, and you can do it almost anywhere. Aim to build up to about 30 minutes most days, in shorter chunks if that's easier. Swimming and stationary cycling are great too, especially if your joints are sore.</p>
      <p><strong>Strength exercises.</strong> This is the one people skip, but it's so important. Strong muscles keep you steady and independent. You don't need heavy weights — soup cans, light dumbbells, or resistance bands work. Sit-to-stands from a chair build leg strength beautifully. Aim for twice a week.</p>
      <p><strong>Balance exercises.</strong> Standing on one foot near a counter, heel-to-toe walking, or a tai chi class all improve balance and help prevent falls. Even a few minutes most days helps.</p>
      <p><strong>Stretching and flexibility.</strong> Gentle stretching keeps you limber and comfortable. Do it when your muscles are warm, and never bounce or force a stretch.</p>

      <h2>How to Start Safely</h2>
      <p><strong>Check with your doctor first</strong> if you have heart problems, chest pain, dizziness, or haven't been active in a long time. They can tell you what's right for you.</p>
      <p><strong>Start small and build slowly.</strong> Five or ten minutes is a fine beginning. Add a little each week. Going too hard too fast leads to soreness and discouragement.</p>
      <p><strong>Warm up and cool down.</strong> A few minutes of easy movement at the start and end protects your muscles and joints.</p>
      <p><strong>Listen to your body.</strong> Some muscle effort and mild fatigue are normal and good. Sharp pain, chest pain, dizziness, or shortness of breath mean stop and rest — and tell your doctor if it continues.</p>
      <p><strong>Stay hydrated</strong> and wear supportive shoes.</p>
      <p><strong>Make it social and enjoyable.</strong> Walk with a friend, join a senior exercise class, or try a group at your community center. You're far more likely to stick with something you enjoy.</p>

      <h2>When to Check With a Doctor</h2>
      <p>Talk to your doctor before starting if you have a chronic condition, have had a recent surgery or fall, or feel unsteady. During exercise, stop and seek help for chest pain, severe shortness of breath, or dizziness.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">I haven't exercised in years. Is it too late to start?</summary><div class="faq-answer"><p>Not at all. People see real benefits from becoming active at every age, even in their 80s and 90s. Start gently and build up.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">How much exercise do I really need?</summary><div class="faq-answer"><p>A common goal is about 150 minutes of moderate activity a week — roughly 30 minutes, five days — plus strength work twice a week. But anything is better than nothing. Start where you are.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What if I have arthritis or joint pain?</summary><div class="faq-answer"><p>Gentle, low-impact movement usually helps joint pain rather than worsening it. Swimming and water exercise are especially kind to sore joints.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is it safe to lift weights at my age?</summary><div class="faq-answer"><p>Yes — strength training is one of the most valuable things older adults can do. Use light weights, good form, and build up slowly. A class or trainer can help you start safely.</p></div></details>
      <p>Staying active isnt about doing a lot — it's about doing a little, consistently. Find something you enjoy, start gently, and let it become a happy part of your everyday life.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "constipation-relief-gentle-ways",
  image: "/images/articles/constipation.jpg",
  category: "Digestion",
  title: "Constipation Got You Uncomfortable? Gentle Ways to Find Relief",
  metaDesc: "Constipation is common with age but very manageable. Here are gentle, natural ways to stay regular and feel comfortable again.",
  primaryKeyword: "constipation relief for seniors",
  readTime: "4 min read",
    date: 'Sep 11, 2025',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>It's not the most comfortable topic to bring up, but constipation is one of the most common everyday complaints among older adults — and one of the most fixable. If things have slowed down and you're feeling bloated, sluggish, or uncomfortable, there are plenty of gentle ways to get back to normal.</p>

      <h2>Why Constipation Happens More With Age</h2>
      <p>A few things tend to come together as we get older:</p>
      <ul>
        <li>We often drink less water than we should</li>
        <li>We may be less physically active</li>
        <li>Diets sometimes shift away from high-fiber foods</li>
        <li>Several common medications slow the digestive system</li>
        <li>Some health conditions affect digestion</li>
        <li>Ignoring the urge to go, or changes in routine, can throw things off</li>
      </ul>
      <p>The encouraging news is most constipation responds well to simple, gentle changes.</p>

      <h2>Gentle Ways to Find Relief</h2>
      <p><strong>Drink more water.</strong> This is often the missing piece. Fiber needs water to do its job. Sip water steadily through the day. Warm drinks, like a cup of tea or warm water in the morning, can be especially helpful for getting things moving.</p>
      <p><strong>Eat more fiber — gradually.</strong> Fruits, vegetables, whole grains, beans, and prunes are all good. Prunes and prune juice are a time-tested, gentle remedy. Add fiber slowly over a couple of weeks so your body adjusts comfortably, and drink plenty of water alongside it.</p>
      <p><strong>Move your body.</strong> Physical activity helps your digestive system stay active. Even a daily walk makes a difference.</p>
      <p><strong>Don't ignore the urge.</strong> When your body signals it's time, try to go rather than putting it off. Holding it makes things harder.</p>
      <p><strong>Set a routine.</strong> Your bowels like regularity. Many people find a consistent time each day, often after breakfast, works well.</p>
      <p><strong>Use a small footstool.</strong> Resting your feet on a low stool while on the toilet, so your knees are slightly raised, puts your body in a more natural position and can make going easier.</p>
      <p><strong>Review your medications.</strong> Several common medications — including certain pain relievers and others — can cause constipation. Ask your doctor or pharmacist if any of yours might be the culprit, and whether anything can be adjusted.</p>
      <p><strong>Use laxatives carefully.</strong> Gentle fiber supplements and stool softeners are usually fine, but stronger laxatives shouldn't be used regularly without guidance. Ask your doctor or pharmacist what's appropriate for you.</p>

      <h2>When to See a Doctor</h2>
      <p>Most constipation is easily managed, but see your doctor if it's a sudden change from your normal pattern, if it lasts more than a couple of weeks despite these changes, if you have belly pain, if you notice blood, or if you're losing weight without trying. These deserve a proper look. Severe pain with no bowel movement at all also needs prompt attention.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">How often should I have a bowel movement?</summary><div class="faq-answer"><p>"Normal" varies a lot — anywhere from three times a day to three times a week can be fine. What matters is what's normal for you, and a noticeable change from that.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Are prunes really that helpful?</summary><div class="faq-answer"><p>Yes. Prunes are one of the best-studied natural remedies for constipation. A few prunes or a small glass of prune juice daily works well for many people.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Is it okay to use laxatives often?</summary><div class="faq-answer"><p>Gentle options like fiber supplements are generally fine. Stronger stimulant laxatives shouldn't be a daily habit without your doctor's guidance, as your body can come to rely on them.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can drinking more water alone fix constipation?</summary><div class="faq-answer"><p>For some people, yes — many of us simply don't drink enough. Combined with fiber and movement, it works even better.</p></div></details>
      <p>Constipation is common but it doesn't have to be something you put up with. A little more water, fiber, and movement usually brings comfortable relief — and if it doesn't, your doctor can help.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
},
{
  id: "feeling-lonely-ways-to-reconnect",
  image: "/images/articles/connection.jpg",
  category: "Mental Health",
  title: "Feeling Lonely or Isolated? Ways to Reconnect and Feel Better",
  metaDesc: "Loneliness is common later in life and affects health. Here are warm, practical ways to reconnect and feel more engaged.",
  primaryKeyword: "loneliness in older adults",
  readTime: "4 min read",
    date: 'Dec 15, 2025',
  author: "Dr. Sarah Jenkins, MD",
  authorBio: "Dr. Sarah Jenkins is a board-certified geriatrician specializing in senior health, longevity, and preventative care with over 15 years of clinical experience.",
  content: `
      <p>If your days feel quieter than they used to, or you go stretches without really talking to anyone, you're experiencing something a great many older adults quietly go through. Loneliness isn't a personal failing and it's nothing to be ashamed of — it's a common part of life's changes. It also matters for your health, which is exactly why it's worth gently doing something about.</p>

      <h2>Why Loneliness Happens Later in Life</h2>
      <p>Life naturally changes as we age. Retirement removes the daily rhythm of coworkers. Friends and loved ones may move away or pass on. Children and grandchildren are often busy with their own lives. Health issues or no longer driving can make it harder to get out. Hearing loss can make conversation tiring. None of this is anyone's fault — it's just life shifting, and it can leave us more isolated than we'd like.</p>

      <h2>Why It's Worth Addressing</h2>
      <p>Staying connected isn't only about feeling good, though that matters. Social connection is linked to better health — it supports your mood, your memory, your heart, and even how long and how well you live. Reaching out is genuinely good for you, not just pleasant.</p>

      <h2>Warm, Practical Ways to Reconnect</h2>
      <p><strong>Start small with people you already know.</strong> A phone call to an old friend, a note to a relative, a chat with a neighbor. Connection doesn't have to be big to count.</p>
      <p><strong>Set up regular contact.</strong> A standing weekly phone call with a family member or friend gives you something to look forward to and keeps the bond steady.</p>
      <p><strong>Look into your local senior center.</strong> Senior centers often offer meals, classes, games, exercise groups, and outings. They're built for exactly this, and many people find good friends there.</p>
      <p><strong>Find a group around something you enjoy.</strong> A hobby club, a walking group, a faith community, a book club, a volunteer role. Shared activities make conversation easy and natural.</p>
      <p><strong>Volunteer.</strong> Helping others is one of the most reliable ways to feel connected and purposeful. Schools, libraries, food banks, and hospitals all welcome older volunteers.</p>
      <p><strong>Consider a class.</strong> Community centers and libraries often offer low-cost classes. Learning something new alongside others is good for the mind and the social life both.</p>
      <p><strong>Stay in touch through technology, if you'd like.</strong> A simple video call lets you see grandchildren's faces. If you're unsure how, a family member or a library class can show you — it's easier than it looks.</p>
      <p><strong>Consider a pet, if it suits your situation.</strong> For some people, a pet brings wonderful companionship and a reason to get up and out each day.</p>
      <p><strong>Address barriers honestly.</strong> If hearing loss makes socializing hard, get your hearing checked — hearing aids can transform your social life. If transportation is the issue, look into senior ride services or community shuttles.</p>

      <h2>When to Reach Out for More Support</h2>
      <p>If loneliness has tipped into ongoing sadness — if you've lost interest in things, are sleeping or eating poorly, or feel hopeless — please talk to your doctor. Depression is common, treatable, and not something to face alone. If you ever feel life isn't worth living, reach out right away: in the US, you can call or text 988 to reach the Suicide and Crisis Lifeline, any time.</p>

      <h2>FAQ</h2>
      <details class="faq-details"><summary class="faq-summary">Is it normal to feel lonely as I get older?</summary><div class="faq-answer"><p>It's very common, given how much changes in later life. Common doesn't mean you have to accept it, though — connection can be rebuilt.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">How is loneliness different from being alone?</summary><div class="faq-answer"><p>Being alone is simply being by yourself, which many people enjoy. Loneliness is the painful feeling of wanting more connection than you have. You can feel lonely even around others.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">What if I'm shy or it feels hard to reach out?</summary><div class="faq-answer"><p>Start very small — one phone call, one familiar face. Structured activities help, because the shared activity carries the conversation. It gets easier with practice.</p></div></details>
      <details class="faq-details"><summary class="faq-summary">Can loneliness really affect my physical health?</summary><div class="faq-answer"><p>Yes. Research links ongoing loneliness to poorer health outcomes. Connection is genuinely a form of self-care.</p></div></details>
      <p>Reaching out can feel hard at first, but most people are glad to hear from someone — and glad to be asked. One small step at a time, a fuller, warmer daily life is well within reach.</p>
      <p><em>This article is for general information and isn't a substitute for medical advice. Please talk with your doctor about your individual health.</em></p>
    `,
}
];
```

## File: `src\data\products.js`

```js
export const products = [
  {
    "id": 2,
    "name": "Testosil",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "An advanced testosterone support complex that utilizes clinically researched ingredients, including KSM-66 Ashwagandha, to help naturally boost testosterone levels and support muscle recovery.",
    "bullets": [
      "Features KSM-66 Ashwagandha for natural testosterone support.",
      "Designed to aid in muscle recovery, strength, and daily energy.",
      "Contains a comprehensive blend of vitamins and adaptogens."
    ],
    "rationale": "A targeted approach for men looking to counter natural testosterone decline, focusing on scientifically backed adaptogens rather than harsh stimulants.",
    "affiliateLink": "https://Testosil.com/ct/976241",
    "image": "/products/Testosil.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 3,
    "name": "GenF20 Plus",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 10,
    "description": "A comprehensive anti-aging system designed to naturally stimulate the body's production of Human Growth Hormone (HGH), supporting joint health, energy, and overall vitality.",
    "bullets": [
      "Enteric-coated tablets ensure maximum absorption of key nutrients.",
      "Supports natural energy levels, skin elasticity, and muscle tone.",
      "A non-synthetic alternative for long-term aging support."
    ],
    "rationale": "Provides metabolic and systemic support for healthy aging by encouraging the body to maintain its own natural hormone production pathways safely.",
    "affiliateLink": "https://GenF20Muscle.com/ct/976241",
    "image": "/products/GenF20 Plus.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 7,
    "name": "DIM 3X",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A dual-action hormonal support supplement designed specifically for men to help balance active estrogen levels while supporting healthy testosterone function.",
    "bullets": [
      "Features DIM (Diindolylmethane) to help regulate estrogen metabolism.",
      "Supports balanced mood, daily energy, and lean muscle mass.",
      "Includes Vitamin E and Bioperine for enhanced cellular absorption."
    ],
    "rationale": "Essential for men experiencing hormonal shifts, as it actively works to process and eliminate excess estrogen while preserving usable testosterone.",
    "affiliateLink": "https://DIM3X.com/ct/976241",
    "image": "/products/DIM 3X.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 8,
    "name": "Testodren",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 10,
    "description": "A single-ingredient, patented testosterone booster derived from Fenugreek extract (Furosap), clinically studied to support free testosterone levels in men over 30.",
    "bullets": [
      "Contains 100% patented Furosap for targeted testosterone support.",
      "Clinically shown to support energy, mood, and physical stamina.",
      "Simple, focused formula without unnecessary filler ingredients."
    ],
    "rationale": "Ideal for men seeking a straightforward, clinically validated, and highly focused single-herb approach to supporting free testosterone.",
    "affiliateLink": "https://Testodren.com/ct/976241",
    "image": "/products/Testodren.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 9,
    "name": "CalmLean",
    "category": "Muscle & Fitness",
    "subniche": "Fat Loss",
    "priority": 10,
    "description": "A stimulant-free weight management supplement formulated with ForsLean to help support a healthy metabolism and promote lean muscle mass during weight loss.",
    "bullets": [
      "100% stimulant-free formula prevents jitters and energy crashes.",
      "Features patented ForsLean to support cellular metabolism.",
      "Aids in targeting stubborn fat while preserving lean muscle."
    ],
    "rationale": "Provides a safe metabolic boost without the stress of stimulants, making it ideal for sustainable weight management and overall body composition.",
    "affiliateLink": "https://CalmLean.com/ct/976241",
    "image": "/products/CalmLean.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 10,
    "name": "CortiSync",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "An adaptogenic supplement designed to help the body manage stress and regulate cortisol levels, which can aid in reducing stubborn belly fat and improving daily focus.",
    "bullets": [
      "Formulated with potent adaptogens to support a healthy stress response.",
      "Helps regulate cortisol, a primary contributor to stress-related weight gain.",
      "Supports mental clarity, sustained energy, and physical resilience."
    ],
    "rationale": "Addresses the often-overlooked role of stress hormones in weight management and fatigue, offering a holistic approach to metabolic health.",
    "affiliateLink": "https://CortiSync.com/ct/976241",
    "image": "/products/CortiSync.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 13,
    "name": "HyperGH 14x",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 0,
    "description": "A sophisticated supplement stack designed for active men, combining oral capsules and an oral spray to support natural exercise recovery and lean muscle growth.",
    "bullets": [
      "Dual-delivery system (pills and spray) for maximum bioavailability.",
      "Supports natural recovery times and lean muscle development.",
      "An ideal addition to intense resistance training programs."
    ],
    "rationale": "Leverages the synergy between targeted amino acids and physical exercise to support the body's natural muscle-building and recovery processes.",
    "affiliateLink": "https://HyperGH14x.com/ct/976241",
    "image": "/products/HyperGH14x.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 18,
    "name": "TestRX",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "A robust testosterone support formula heavily focused on ZMA (Zinc, Magnesium, and Vitamin B6), designed to aid active men in muscle recovery and sleep quality.",
    "bullets": [
      "Features a core foundation of ZMA for proven recovery support.",
      "Designed to aid in deeper sleep, critical for natural hormone production.",
      "Supports muscle mass retention and strength gains during workouts."
    ],
    "rationale": "Prioritizes recovery and the vital connection between deep sleep and testosterone production, making it highly effective for physically active men.",
    "affiliateLink": "https://TestRX.com/ct/976241",
    "image": "/products/TestRX.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 24,
    "name": "GenFX",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 0,
    "description": "A daily anti-aging supplement that uses a highly concentrated blend of amino acids and plant sterols to help stimulate the body's natural production of youth hormones.",
    "bullets": [
      "Rich in essential amino acids crucial for hormone synthesis.",
      "Supports healthy cholesterol levels with plant sterols.",
      "Aids in preserving muscle mass and skin elasticity during aging."
    ],
    "rationale": "Provides the precise nutritional building blocks the pituitary gland requires, safely encouraging a more youthful metabolic state.",
    "affiliateLink": "https://GenFX.com/ct/976241",
    "image": "/products/GenFX.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 26,
    "name": "Provacyl",
    "category": "Men's Health",
    "subniche": "Testosterone Boost",
    "priority": 0,
    "description": "A comprehensive daily supplement targeting male andropause, combining amino acids for HGH support with potent herbal extracts to support healthy testosterone levels.",
    "bullets": [
      "Specifically formulated for men experiencing age-related hormone decline.",
      "Combines ZMA, amino acids, and herbal adaptogens in one formula.",
      "Supports energy, lean muscle retention, and overall vitality."
    ],
    "rationale": "Offers a complete, dual-action approach to aging men, simultaneously addressing the two most critical hormonal declines: HGH and testosterone.",
    "affiliateLink": "https://Provacyl.com/ct/976241",
    "image": "/products/Provacyl.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 31,
    "name": "Brain Pill",
    "category": "Anti-aging",
    "subniche": "Brain Health",
    "priority": 10,
    "description": "A premium nootropic supplement designed to support cognitive function, featuring clinically backed ingredients like Cognizin and Synapsa to enhance focus and memory.",
    "bullets": [
      "Features patented Cognizin to support brain energy and focus.",
      "Includes Synapsa to aid in memory retention and learning.",
      "Helps clear brain fog and sustains mental stamina throughout the day."
    ],
    "rationale": "Delivers comprehensive cognitive support by targeting brain metabolism and neurotransmitter health, ideal for professionals and aging adults.",
    "affiliateLink": "https://BrainPill.com/ct/976241",
    "image": "/products/BrainPill.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 35,
    "name": "PrimeGENIX Prostate Support",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A comprehensive prostate health formulation featuring Saw Palmetto, Beta-Sitosterol, and Pygeum to support normal urinary flow and reduce nighttime urgency.",
    "bullets": [
      "High concentration of Beta-Sitosterol to support healthy prostate function.",
      "Aids in completely emptying the bladder and reducing frequent urination.",
      "Provides essential long-term support for aging men's urinary health."
    ],
    "rationale": "Combines the most well-researched botanical extracts known to inhibit prostate enlargement, offering a safe, long-term preventative health measure.",
    "affiliateLink": "https://PrimeGENIXProstateSupport.com/ct/976241",
    "image": "/products/PrimeGENIXProstateSupport.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 40,
    "name": "Total Curve",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A dual-action breast enhancement system combining a daily herbal supplement with a firming gel featuring Volufiline to support natural breast volume and lift.",
    "bullets": [
      "Two-part system addresses breast health internally and externally.",
      "Features clinically tested Volufiline to support localized fat tissue volume.",
      "A natural, non-surgical alternative for improved firmness and lift."
    ],
    "rationale": "Leverages the proven science of Volufiline alongside phytoestrogens to safely encourage the body's natural mechanisms for breast tissue support.",
    "affiliateLink": "https://TotalCurve.com/ct/976241",
    "image": "/products/TotalCurve.jpg",
    "status": "active",
    "gender": "female"
  },
  {
    "id": 42,
    "name": "Confitrol24",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A clinically proven bladder control supplement formulated with Urox, a patented blend of herbs designed to strengthen the bladder sphincter and pelvic floor.",
    "bullets": [
      "Features Urox, a clinically studied blend for urinary incontinence.",
      "Helps reduce sudden urgency and embarrassing bladder leakage.",
      "Supports the tone and strength of the pelvic floor muscles over time."
    ],
    "rationale": "Provides a vital, non-prescription solution for men and women dealing with incontinence, directly targeting the muscle tone of the urinary tract.",
    "affiliateLink": "https://Confitrol24.com/ct/976241",
    "image": "/products/Confitrol24.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 43,
    "name": "Kollagen Intensiv",
    "category": "Skin Care",
    "subniche": "Skin Care",
    "priority": 0,
    "description": "An advanced anti-aging cream formulated with SYN-COLL, a patented peptide clinically shown to stimulate the skin's natural production of collagen.",
    "bullets": [
      "Features SYN-COLL to naturally boost the skin's collagen production.",
      "Helps reduce the appearance of fine lines, wrinkles, and crow's feet.",
      "Provides deep, sustained hydration to improve overall skin elasticity."
    ],
    "rationale": "Moves beyond simple moisturization by actively encouraging the skin to repair its own structural matrix using advanced peptide science.",
    "affiliateLink": "https://KollagenIntensiv.com/ct/976241",
    "image": "/products/KollagenIntensiv.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 45,
    "name": "Dermefface FX7",
    "category": "Skin Care",
    "subniche": "Skin Care",
    "priority": 0,
    "description": "A specialized scar reduction therapy blending seven clinically proven active ingredients to gently fade the appearance of scars by accelerating cellular turnover.",
    "bullets": [
      "Accelerates the skin's natural 28-day regeneration cycle.",
      "Helps smooth and flatten both old and newly formed scars.",
      "Deeply moisturizes the skin to prevent flaking and discoloration."
    ],
    "rationale": "Takes a multifaceted approach to scar tissue, combining exfoliation, deep hydration, and cellular stimulation to safely fade visible skin damage.",
    "affiliateLink": "https://DermeffaceFX7.com/ct/976241",
    "image": "/products/DermeffaceFX7.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 46,
    "name": "Illuminatural 6i",
    "category": "Skin Care",
    "subniche": "Skin Care",
    "priority": 0,
    "description": "An advanced skin lightening formulation free of harsh chemicals like hydroquinone, utilizing safe botanical extracts to help fade dark spots and hyperpigmentation.",
    "bullets": [
      "Safely fades age spots, sun damage, and general hyperpigmentation.",
      "100% free of dangerous bleaching agents like hydroquinone or mercury.",
      "Uses plant-based brighteners and exfoliants for an even complexion."
    ],
    "rationale": "Provides a safe, effective alternative to aggressive chemical peels and bleaches, working with the skin's natural cycle to reveal brighter tissue.",
    "affiliateLink": "https://Illuminatural6i.com/ct/976241",
    "image": "/products/Illuminatural6i.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 87,
    "name": "Icelandic Red Algae Calcium by GenF20",
    "category": "Anti-aging",
    "subniche": "HGH Boost",
    "priority": 0,
    "description": "A premium, plant-based calcium supplement sourced from pure Icelandic Red Algae, formulated for superior absorption to support bone density and joint health.",
    "bullets": [
      "Plant-based calcium offers vastly superior absorption compared to rocks.",
      "Contains over 70 naturally occurring trace minerals for skeletal support.",
      "Includes Vitamin D3 and K2 to ensure calcium is directed to the bones."
    ],
    "rationale": "Addresses the critical flaw in traditional calcium supplements by providing a highly bioavailable, plant-based matrix that the body can easily utilize.",
    "affiliateLink": "https://GenF20Calcium.com/ct/976241",
    "image": "/products/GenF20.jpg",
    "status": "active",
    "gender": "both"
  },
  {
    "id": 89,
    "name": "PrimeGENIX Bone Complex",
    "category": "General Health",
    "subniche": "General Health",
    "priority": 0,
    "description": "A specialized bone health formulation designed specifically for men, blending easily absorbed vitamins and minerals to support structural integrity and density.",
    "bullets": [
      "Tailored specifically for the unique skeletal needs of aging men.",
      "Features highly bioavailable forms of Calcium, Magnesium, and Vitamin K2.",
      "Supports long-term bone density, posture, and physical resilience."
    ],
    "rationale": "Recognizes that bone loss is not exclusively a female issue, providing men with a targeted, highly absorbable formula for maintaining structural health.",
    "affiliateLink": "https://PrimeGENIXBoneComplex.com/ct/976241",
    "image": "/products/PrimeGENIXBoneComplex.jpg",
    "status": "active",
    "gender": "male"
  },
  {
    "id": 100,
    "name": "Template",
    "category": "Digital Products",
    "subniche": "Health Tracking",
    "priority": 100,
    "description": "The ultimate Notion dashboard for tracking your clinical-grade supplements, workouts, macros, and longevity protocols.",
    "bullets": [
      "Customizable Notion template for all your health data.",
      "Track daily habits, sleep scores, and training progress.",
      "Instant digital access upon purchase."
    ],
    "rationale": "A necessary digital hub for anyone serious about optimizing their health metrics and maintaining consistency in their protocols.",
    "affiliateLink": "https://eternofit.lemonsqueezy.com/checkout/buy/6f555f8d-af9a-41c2-9156-1c1c3356158d?embed=1",
    "image": "",
    "status": "active",
    "gender": "both"
  }
];

export const getFilteredProducts = (answers, customProducts = products) => {
  // Step 1: Filter by status and gender
  const activeProducts = customProducts.filter(p => {
    const isStatusActive = p.status !== 'inactive';
    const matchesGender = !p.gender || p.gender === 'both' || 
                         (answers.gender === 'Male' && p.gender === 'male') || 
                         (answers.gender === 'Female' && p.gender === 'female');
    return isStatusActive && matchesGender;
  });

  // Step 2: Determine focuses from Question 5
  const focuses = answers.specificFocus 
    ? (Array.isArray(answers.specificFocus) ? answers.specificFocus : [answers.specificFocus].filter(Boolean)) 
    : ['General Health'];

  // Step 3: Deterministic focus → product rules
  // Each focus maps to preferred product names (first priority), then subniches, then categories
  const getFocusRules = (focus, gender) => {
    switch (focus) {
      // === MALE INTIMATE PERFORMANCE ===
      case 'Erection Quality':
        return { preferredNames: ['Testodren', 'Testosil'], subniches: ['Testosterone Boost'], categories: ["Men's Health"] };
      case 'Stamina':
        return { preferredNames: ['Testosil', 'Testodren'], subniches: ['Testosterone Boost'], categories: ["Men's Health"] };
      case 'Semen Volume':
        return { preferredNames: ['TestRX', 'Provacyl'], subniches: ['Testosterone Boost'], categories: ["Men's Health"] };
      
      // === LOW LIBIDO (gender-conditional) ===
      case 'Low Libido':
        if (gender === 'Female') {
          return { preferredNames: ['GenF20 Plus', 'GenFX'], subniches: ['HGH Boost'], categories: ['Anti-aging'] };
        }
        return { preferredNames: ['Provacyl', 'Testodren'], subniches: ['Testosterone Boost'], categories: ["Men's Health"] };
      
      // === FEMALE INTIMATE ===
      case 'Intimate Sensation':
        return { preferredNames: ['GenF20 Plus', 'GenFX'], subniches: ['HGH Boost'], categories: ['Anti-aging'] };
      case 'Intimate Energy':
        return { preferredNames: ['GenFX', 'GenF20 Plus'], subniches: ['HGH Boost'], categories: ['Anti-aging'] };
      
      // === MUSCLE & PHYSIQUE ===
      case 'Low Testosterone':
        return { preferredNames: ['Testodren', 'Testosil', 'CortiSync'], subniches: ['Testosterone Boost'], categories: ["Men's Health"] };
      case 'Lean Muscle':
        return { preferredNames: ['CalmLean', 'GenF20 Plus'], subniches: ['Fat Loss', 'HGH Boost'], categories: ['Muscle & Fitness', 'Anti-aging'] };
      case 'Stubborn Fat':
        return { preferredNames: ['CalmLean', 'CortiSync'], subniches: ['Fat Loss'], categories: ['Muscle & Fitness'] };
      case 'Slow Recovery':
        return { preferredNames: ['GenF20 Plus', 'HyperGH 14x', 'GenFX'], subniches: ['HGH Boost'], categories: ['Anti-aging'] };
      
      // === ANTI-AGING & VITALITY ===
      case 'Low Energy':
        return { preferredNames: ['GenF20 Plus', 'Testodren'], subniches: ['HGH Boost', 'Testosterone Boost'], categories: ['Anti-aging'] };
      case 'Anti-aging':
        return { preferredNames: ['GenF20 Plus', 'GenFX', 'Icelandic Red Algae Calcium by GenF20'], subniches: ['HGH Boost'], categories: ['Anti-aging'] };
      
      // === SKIN & BEAUTY ===
      case 'Fine Lines & Wrinkles':
        return { preferredNames: ['Kollagen Intensiv', 'Illuminatural 6i'], subniches: ['Skin Care'], categories: ['Skin Care'] };
      case 'Acne Scars':
        return { preferredNames: ['Dermefface FX7', 'Illuminatural 6i'], subniches: ['Skin Care'], categories: ['Skin Care'] };
      
      // === BRAIN & FOCUS ===
      case 'Brain Fog':
        return { preferredNames: ['Brain Pill'], subniches: ['Brain Health'], categories: ['Anti-aging'] };
      case 'Memory Decline':
        return { preferredNames: ['Brain Pill'], subniches: ['Brain Health'], categories: ['Anti-aging'] };
      
      // === FALLBACKS ===
      case 'General Health':
        return { preferredNames: ['GenF20 Plus', 'GenFX'], subniches: ['HGH Boost'], categories: ['Anti-aging', 'General Health'] };
      case 'More Energy':
        return { preferredNames: ['GenF20 Plus', 'Testodren'], subniches: ['HGH Boost', 'Testosterone Boost'], categories: ['Anti-aging'] };
      
      default:
        return { preferredNames: ['GenF20 Plus'], subniches: ['HGH Boost'], categories: ['Anti-aging'] };
    }
  };

  // Step 4: For each focus, find the best matching product
  const bestFits = [];
  const seenIds = new Set();

  focuses.forEach(focus => {
    const rules = getFocusRules(focus, answers.gender);
    
    // Score products for this focus
    const scored = activeProducts.map(product => {
      let score = 0;

      // Highest priority: preferred product name match
      if (rules.preferredNames) {
        const nameIndex = rules.preferredNames.indexOf(product.name);
        if (nameIndex !== -1) {
          score += 50 - (nameIndex * 5); // First preferred = 50, second = 45, etc.
        }
      }

      // High priority: subniche match
      if (rules.subniches && rules.subniches.includes(product.subniche)) {
        score += 20;
      }

      // Medium priority: category match
      if (rules.categories && rules.categories.includes(product.category)) {
        score += 10;
      }

      // Low priority: product priority field
      if (score > 0) {
        score += (product.priority || 0);
      }

      // Keyword boost from product content
      const keywordMap = {
        'Erection Quality': ['testosterone', 'stamina', 'strength'],
        'Stamina': ['stamina', 'energy', 'strength', 'physical'],
        'Semen Volume': ['testosterone', 'recovery', 'muscle'],
        'Low Libido': answers.gender === 'Female' 
          ? ['energy', 'vitality', 'hormone', 'aging']
          : ['testosterone', 'stamina', 'vitality', 'hormone'],
        'Intimate Sensation': ['vitality', 'energy', 'hormone', 'skin elasticity'],
        'Intimate Energy': ['energy', 'vitality', 'stamina', 'hormone'],
        'Low Testosterone': ['testosterone', 'muscle mass', 'strength'],
        'Lean Muscle': ['muscle', 'fat', 'metabolism', 'lean', 'tone'],
        'Stubborn Fat': ['fat', 'weight', 'metabolism', 'lean'],
        'Slow Recovery': ['recovery', 'muscle', 'growth', 'repair'],
        'Low Energy': ['energy', 'fatigue', 'vitality'],
        'Anti-aging': ['aging', 'hormone', 'HGH', 'youth', 'collagen'],
        'Fine Lines & Wrinkles': ['wrinkle', 'collagen', 'skin', 'lines', 'elasticity'],
        'Acne Scars': ['scar', 'skin', 'regeneration', 'cellular'],
        'Brain Fog': ['cognitive', 'focus', 'memory', 'brain', 'mental'],
        'Memory Decline': ['memory', 'cognitive', 'recall', 'brain']
      };

      if (keywordMap[focus] && score > 0) {
        const contentStr = (product.description + " " + product.bullets.join(" ")).toLowerCase();
        for (let kw of keywordMap[focus]) {
          if (contentStr.includes(kw)) score += 2;
        }
      }

      return { ...product, score };
    });

    // Pick the highest-scoring product not already selected
    const best = scored
      .filter(p => !seenIds.has(p.id) && p.score > 0)
      .sort((a, b) => b.score - a.score)[0];

    if (best) {
      seenIds.add(best.id);
      bestFits.push(best);
    }
  });

  // Step 5: Guarantee exactly N products (N = number of focuses from Q5)
  const targetCount = focuses.length;
  if (bestFits.length < targetCount) {
    // Fill remaining slots with the best overall products for the user's goals
    const goals = Array.isArray(answers.primaryGoal) ? answers.primaryGoal : [answers.primaryGoal].filter(Boolean);
    
    const fallbackScored = activeProducts
      .filter(p => !seenIds.has(p.id))
      .map(product => {
        let score = product.priority || 0;
        
        const categoryMatchMap = {
          'Intimate Performance': ["Men's Health", "Anti-aging"],
          'Muscle & Physique': ["Men's Health", "Muscle & Fitness"],
          'Anti-aging & Vitality': ["Anti-aging"],
          'Skin & Beauty': ["Skin Care"],
          'Brain & Focus': ["Anti-aging"]
        };

        goals.forEach(goal => {
          if (categoryMatchMap[goal] && categoryMatchMap[goal].includes(product.category)) {
            score += 5;
          }
        });

        return { ...product, score };
      })
      .sort((a, b) => b.score - a.score);

    for (let p of fallbackScored) {
      if (bestFits.length >= targetCount) break;
      seenIds.add(p.id);
      bestFits.push(p);
    }
  }

  return bestFits.slice(0, targetCount);
};

export const calculateHealthScore = (answers) => {
  if (!answers) return { score: 0, status: 'N/A', color: '#94a3b8' };
  
  let totalPoints = 0;
  let maxPoints = 0;

  const addScore = (val, thresholds) => {
    if (!val) return;
    maxPoints += 15;
    totalPoints += thresholds[val] || 0;
  };

  addScore(answers.activityLevel, { 'Very Active': 15, 'Moderately Active': 10, 'Lightly Active': 5, 'Sedentary': 0 });
  addScore(answers.stamina, { 'Great, I can keep going without issues': 15, 'Average, but I tire easily with intense tasks': 8, 'Poor, I get exhausted very quickly': 0 });
  addScore(answers.sleepQuality, { 'Deep & Restful': 15, 'Occasionally Restless': 10, 'Often Waking Up': 5, 'Poor': 0 });
  addScore(answers.tiredness, { 'Rarely, I have consistent energy': 15, 'Sometimes, usually in the afternoon': 8, 'Often, I feel drained': 4, 'Constantly, I struggle to stay awake': 0 });
  addScore(answers.stressLevel, { 'Low': 15, 'Moderate': 10, 'High': 4, 'Severe': 0 });
  addScore(answers.motivationFocus, { 'Rarely, I am highly motivated': 15, 'Sometimes, depending on the task': 10, 'Frequently, I find it hard to concentrate': 4, 'Constantly, I struggle with severe brain fog': 0 });
  addScore(answers.performanceDecline, { 'No, I feel as strong as ever': 15, 'A little bit, noticeable but manageable': 10, 'Yes, a significant decline': 4, 'Yes, a severe decline affecting my confidence': 0 });

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  let status = 'Sub-optimal';
  let color = '#f59e0b'; // Amber

  if (score >= 85) {
    status = 'Excellent';
    color = '#10b981'; // Green
  } else if (score >= 65) {
    status = 'Optimal';
    color = '#3b82f6'; // Blue
  } else if (score < 40) {
    status = 'Critical Support Required';
    color = '#ef4444'; // Red
  }

  return { score, status, color };
};

export const getAdditionalRecommendations = (answers, excludeNames, customProducts = products) => {
  const activeProducts = customProducts.filter(p => {
    const isStatusActive = p.status !== 'inactive';
    const matchesGender = !p.gender || p.gender === 'both' || 
                         (answers.gender === 'Male' && p.gender === 'male') || 
                         (answers.gender === 'Female' && p.gender === 'female');
    return isStatusActive && matchesGender && !excludeNames.includes(p.name);
  });
  
  const goals = Array.isArray(answers.primaryGoal) ? answers.primaryGoal : [answers.primaryGoal].filter(Boolean);
  const focuses = answers.specificFocus ? (Array.isArray(answers.specificFocus) ? answers.specificFocus : [answers.specificFocus].filter(Boolean)) : [];
  
  const scored = activeProducts.map(product => {
    let score = 0;

    const categoryMatchMap = {
      'Intimate Performance': answers.gender === 'Female' ? ["Anti-aging", "General Health"] : ["Men's Health", "General Health"],
      'Muscle & Physique': answers.gender === 'Female' ? ["Muscle & Fitness", "Anti-aging"] : ["Men's Health", "Muscle & Fitness"],
      'Anti-aging & Vitality': ["Anti-aging", "General Health"],
      'Skin & Beauty': ["Skin Care"],
      'Brain & Focus': ["Anti-aging"]
    };

    const subnicheMatchMap = {
      'Intimate Performance': answers.gender === 'Female' ? ["HGH Boost"] : ["Testosterone Boost"],
      'Muscle & Physique': answers.gender === 'Female' ? ["Fat Loss", "HGH Boost"] : ["Testosterone Boost", "Fat Loss", "HGH Boost"],
      'Anti-aging & Vitality': ["HGH Boost"],
      'Skin & Beauty': ["Skin Care"],
      'Brain & Focus': ["Brain Health"]
    };

    goals.forEach(goal => {
      if (categoryMatchMap[goal] && categoryMatchMap[goal].includes(product.category)) {
        score += 3;
      }
      if (subnicheMatchMap[goal] && subnicheMatchMap[goal].includes(product.subniche)) {
        score += 3;
      }
    });

    focuses.forEach(focus => {
      if (
        ((focus === 'Erection Quality' || focus === 'Stamina' || focus === 'Semen Volume' || focus === 'Low Testosterone') && product.subniche === 'Testosterone Boost') ||
        ((focus === 'Low Libido') && (answers.gender === 'Female' ? product.subniche === 'HGH Boost' : product.subniche === 'Testosterone Boost')) ||
        ((focus === 'Intimate Sensation' || focus === 'Intimate Energy') && product.subniche === 'HGH Boost') ||
        ((focus === 'Lean Muscle') && (product.subniche === 'Fat Loss' || product.subniche === 'HGH Boost')) ||
        ((focus === 'Stubborn Fat') && product.subniche === 'Fat Loss') ||
        ((focus === 'Slow Recovery' || focus === 'Low Energy' || focus === 'Anti-aging') && product.subniche === 'HGH Boost') ||
        ((focus === 'More Energy') && (product.subniche === 'HGH Boost' || product.subniche === 'Testosterone Boost')) ||
        ((focus === 'Fine Lines & Wrinkles' || focus === 'Acne Scars') && product.subniche === 'Skin Care') ||
        ((focus === 'Brain Fog' || focus === 'Memory Decline') && product.subniche === 'Brain Health')
      ) {
        score += 8;
      }
    });

    score += (product.priority || 0);
    return { ...product, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 2);
};

```

