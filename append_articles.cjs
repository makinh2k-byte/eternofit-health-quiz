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
