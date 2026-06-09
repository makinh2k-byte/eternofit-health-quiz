import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Info,
  Smile
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
      if (toolParam && ['bmi', 'testosterone', 'realage', 'longevity', 'sleep', 'meal', 'stress', 'adhd', 'mental'].includes(toolParam)) {
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

  // Tool 8: ADHD Screening State
  const [adhdAnswers, setAdhdAnswers] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 });
  const [adhdResult, setAdhdResult] = useState(null);

  // ADHD Toolkit — Sub-tool navigation
  const [adhdSubTool, setAdhdSubTool] = useState('screening');

  // Brain Dump
  const [brainDump, setBrainDump] = useState(() => { try { return localStorage.getItem('ef_braindump') || ''; } catch { return ''; } });

  // Pomodoro
  const [pomodoroMode, setPomodoroMode] = useState('work'); // 'work' | 'break'
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  // One Task
  const [oneTaskList, setOneTaskList] = useState(() => { try { return JSON.parse(localStorage.getItem('ef_onetasks') || '[]'); } catch { return []; } });
  const [oneTaskInput, setOneTaskInput] = useState('');

  // Task Breakdown
  const [bigTask, setBigTask] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  // Visual Timer
  const [visualDuration, setVisualDuration] = useState(10);
  const [visualRemaining, setVisualRemaining] = useState(600);
  const [visualRunning, setVisualRunning] = useState(false);

  // Daily Top 3
  const [topThree, setTopThree] = useState(() => { try { return JSON.parse(localStorage.getItem('ef_top3') || '["","",""]'); } catch { return ['','','']; } });

  // Quick Capture
  const [captureInput, setCaptureInput] = useState('');
  const [captureItems, setCaptureItems] = useState(() => { try { return JSON.parse(localStorage.getItem('ef_capture') || '[]'); } catch { return []; } });

  // Body Double Timer
  const [bdSession, setBdSession] = useState(25);
  const [bdElapsed, setBdElapsed] = useState(0);
  const [bdRunning, setBdRunning] = useState(false);

  // Habits
  const [habits, setHabits] = useState(() => { try { return JSON.parse(localStorage.getItem('ef_habits') || '[]'); } catch { return []; } });
  const [habitInput, setHabitInput] = useState('');

  // Ambient Sounds
  const [activeSound, setActiveSound] = useState(null);
  const audioCtxRef = useRef(null);
  const soundNodeRef = useRef(null);

  // Tool 7: Stress Checker State
  const [stressAnswers, setStressAnswers] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
  const [stressResult, setStressResult] = useState(null);

  // Tool 9: Mental Health Wellness State
  const [mentalAnswers, setMentalAnswers] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0, q10: 0 });
  const [mentalResult, setMentalResult] = useState(null);
  
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

  // ADHD Toolkit — localStorage persistence
  useEffect(() => { try { localStorage.setItem('ef_braindump', brainDump); } catch {} }, [brainDump]);
  useEffect(() => { try { localStorage.setItem('ef_onetasks', JSON.stringify(oneTaskList)); } catch {} }, [oneTaskList]);
  useEffect(() => { try { localStorage.setItem('ef_top3', JSON.stringify(topThree)); } catch {} }, [topThree]);
  useEffect(() => { try { localStorage.setItem('ef_capture', JSON.stringify(captureItems)); } catch {} }, [captureItems]);
  useEffect(() => { try { localStorage.setItem('ef_habits', JSON.stringify(habits)); } catch {} }, [habits]);

  // Pomodoro timer
  useEffect(() => {
    if (!pomodoroRunning) return;
    const id = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev <= 1) {
          adhdPlayBeep();
          if (pomodoroMode === 'work') { setPomodoroSessions(s => s + 1); setPomodoroMode('break'); return 5 * 60; }
          else { setPomodoroMode('work'); return 25 * 60; }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [pomodoroRunning, pomodoroMode]);

  // Visual timer
  useEffect(() => {
    if (!visualRunning) return;
    const id = setInterval(() => {
      setVisualRemaining(prev => {
        if (prev <= 1) { setVisualRunning(false); adhdPlayBeep(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [visualRunning]);

  // Body-double timer
  useEffect(() => {
    if (!bdRunning) return;
    const id = setInterval(() => {
      setBdElapsed(prev => {
        if (prev >= bdSession * 60) { setBdRunning(false); adhdPlayBeep(); return prev; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [bdRunning, bdSession]);

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
        'Implement strict sleep hygiene rules and stress-reduction strategies (high cortisol suppresses T production).',
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
    let plan = '';

    if (score >= 85) {
      tier = 'Elite Centenarian Trajectory';
      color = 'var(--accent-green)';
      plan = 'Maintain extreme cardiorespiratory fitness (VO2 max) and muscular load. Integrate long periodic fasts (24-48h) or NAD+ boosting nutrients to activate advanced cellular longevity pathways.';
    } else if (score >= 60 && score < 85) {
      tier = 'Good Longevity Horizon';
      color = '#ffb300';
      plan = 'Improve zone 2 aerobic base to lower your resting heart rate. Focus on grip and core strength (critical biomarkers for longevity). Increase intake of sirtuin-activating foods (blueberries, dark leafy greens, olive oil).';
    } else {
      tier = 'Accelerated Biological Decline Trap';
      color = '#ef5350';
      plan = 'Urgent longevity intervention required. Prioritize physical strength training and cardiorespiratory health to escape risk indices. Integrate stress management and basic social connection habits immediately.';
    }

    setLongevityResult({
      score,
      tier,
      color,
      plan
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

  // Logic 9: Mental Health Wellness Calculation
  const calculateMentalHealth = () => {
    const scores = Object.values(mentalAnswers);
    if (scores.some(s => s === 0)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Q1-Q5: lower score = better (1=never, 4=always) — invert for wellness
    // Q6-Q10: higher score = better (1=never, 4=always) — keep as-is
    const negativeScore = [mentalAnswers.q1, mentalAnswers.q2, mentalAnswers.q3, mentalAnswers.q4, mentalAnswers.q5].reduce((a, b) => a + b, 0); // 5–20
    const positiveScore = [mentalAnswers.q6, mentalAnswers.q7, mentalAnswers.q8, mentalAnswers.q9, mentalAnswers.q10].reduce((a, b) => a + b, 0); // 5–20

    // Normalise: negative inverted (20 - negativeScore) + positive, range 10–40 → map to 0–100
    const rawScore = (20 - negativeScore) + positiveScore;
    const wellnessScore = Math.round(((rawScore - 10) / 30) * 100);

    // Sub-dimension scores
    const moodScore = Math.round(((8 - (mentalAnswers.q1 + mentalAnswers.q2)) / 6) * 100);
    const anxietyScore = Math.round(((8 - (mentalAnswers.q3 + mentalAnswers.q4)) / 6) * 100);
    const resilienceScore = Math.round(((mentalAnswers.q5 === 0 ? 0 : (5 - mentalAnswers.q5)) + mentalAnswers.q6) / 7 * 100);
    const purposeScore = Math.round(((mentalAnswers.q7 + mentalAnswers.q8) / 8) * 100);
    const selfCareScore = Math.round(((mentalAnswers.q9 + mentalAnswers.q10 === 0 ? 0 : (5 - mentalAnswers.q10) + mentalAnswers.q9) ) / 7 * 100);

    let tier, color, summary, strategies;

    if (wellnessScore >= 75) {
      tier = 'Flourishing Mental Wellness';
      color = 'var(--accent-green)';
      summary = 'Your psychological resilience and emotional regulation are functioning at a high level. You demonstrate strong protective factors against stress, anxiety, and mood disruption. Maintain and deepen these habits.';
      strategies = [
        'Continue practicing gratitude journalling — even 3 sentences a day sustains neuroplastic changes in the prefrontal cortex.',
        'Invest in deepening social bonds. Strong relationships are the #1 predictor of psychological wellbeing.',
        'Explore advanced practices like breathwork, cold exposure, or meditation to further sharpen emotional regulation.'
      ];
    } else if (wellnessScore >= 50) {
      tier = 'Moderate Psychological Load';
      color = '#ffb300';
      summary = 'You have a functional baseline but are carrying moderate psychological strain in one or more areas. Targeted lifestyle interventions can significantly lift your mental wellbeing within 4–8 weeks.';
      strategies = [
        'Implement daily box breathing (4-4-4-4) to down-regulate your sympathetic nervous system and reduce cortisol.',
        'Limit social media to defined time windows — passive scrolling is clinically linked to increased anxiety and low mood.',
        'Prioritize 7–9 hours of consistent sleep. Poor sleep is the #1 amplifier of emotional reactivity and negative cognition.',
        'Consider Magnesium Glycinate (400mg) and Ashwagandha supplementation for cortisol and mood regulation support.'
      ];
    } else {
      tier = 'Elevated Psychological Distress';
      color = '#ef5350';
      summary = 'Your responses indicate significant psychological distress across mood, anxiety, or resilience dimensions. This is a meaningful signal worth taking seriously. We recommend speaking with a qualified mental health professional.';
      strategies = [
        'Reach out to a licensed therapist or counsellor. CBT (Cognitive Behavioural Therapy) has the strongest clinical evidence for anxiety and depression.',
        'Begin with small, non-negotiable daily movement — even a 15-minute walk produces measurable mood improvement via BDNF and endorphin release.',
        'Avoid alcohol and high-caffeine intake — both significantly worsen anxiety and disrupt the serotonin-dopamine systems.',
        'Connect with at least one trusted person in your life. Social isolation is both a symptom and amplifier of mental health challenges.'
      ];
    }

    setMentalResult({
      wellnessScore,
      tier,
      color,
      summary,
      strategies,
      dimensions: [
        { label: 'Mood', score: Math.max(0, Math.min(100, moodScore)) },
        { label: 'Anxiety', score: Math.max(0, Math.min(100, anxietyScore)) },
        { label: 'Resilience', score: Math.max(0, Math.min(100, resilienceScore)) },
        { label: 'Purpose', score: Math.max(0, Math.min(100, purposeScore)) },
        { label: 'Self-Care', score: Math.max(0, Math.min(100, selfCareScore)) },
      ]
    });
  };

  // ADHD Toolkit — Helper functions
  const adhdPlayBeep = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880; osc.type = 'sine';
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8);
    } catch {}
  };

  const adhdStartSound = (type) => {
    adhdStopSound();
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      if (type === 'brown') {
        const bufSize = 4096;
        const node = ctx.createScriptProcessor(bufSize, 1, 1);
        let last = 0;
        node.onaudioprocess = (e) => {
          const out = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufSize; i++) { const w = Math.random() * 2 - 1; out[i] = (last + 0.02 * w) / 1.02; last = out[i]; out[i] *= 3.5; }
        };
        node.connect(ctx.destination); soundNodeRef.current = node;
      } else if (type === 'white') {
        const bufSize = 4096;
        const node = ctx.createScriptProcessor(bufSize, 1, 1);
        node.onaudioprocess = (e) => { const out = e.outputBuffer.getChannelData(0); for (let i = 0; i < bufSize; i++) out[i] = (Math.random() * 2 - 1) * 0.25; };
        node.connect(ctx.destination); soundNodeRef.current = node;
      } else if (type === 'rain') {
        const bufSize = 4096;
        const node = ctx.createScriptProcessor(bufSize, 1, 1);
        let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
        node.onaudioprocess = (e) => {
          const out = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufSize; i++) {
            const w = Math.random() * 2 - 1;
            b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.96900*b2+w*0.1538520;
            b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
            out[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
          }
        };
        node.connect(ctx.destination); soundNodeRef.current = node;
      } else if (type === 'binaural') {
        const oscL = ctx.createOscillator(); const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2); const gain = ctx.createGain();
        gain.gain.value = 0.15;
        oscL.frequency.value = 200; oscR.frequency.value = 240;
        oscL.connect(merger, 0, 0); oscR.connect(merger, 0, 1);
        merger.connect(gain); gain.connect(ctx.destination);
        oscL.start(); oscR.start();
        soundNodeRef.current = { disconnect: () => { try { oscL.stop(); oscR.stop(); merger.disconnect(); } catch {} } };
      }
      setActiveSound(type);
    } catch (err) { console.error(err); }
  };

  const adhdStopSound = () => {
    try { if (soundNodeRef.current) { soundNodeRef.current.disconnect(); soundNodeRef.current = null; } } catch {}
    try { if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; } } catch {}
    setActiveSound(null);
  };

  const adhdFmtTime = (secs) => `${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;

  const adhdTodayKey = () => new Date().toDateString();

  const adhdCheckHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const today = adhdTodayKey();
      if (h.lastChecked === today) return h;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      return { ...h, lastChecked: today, streak: h.lastChecked === yesterday ? h.streak + 1 : 1 };
    }));
  };

  // Recommended Products Logic
  const renderRecommendedProducts = () => {
    if (!globalProducts || globalProducts.length === 0) return null;
    let relevantProducts = [];
    
    if (activeTab === 'bmi') {
       relevantProducts = globalProducts.filter(p => p.subniche === 'Fat Loss' || p.category === 'General Health');
    } else if (activeTab === 'testosterone') {
       relevantProducts = globalProducts.filter(p => p.subniche === 'Testosterone Boost');
    } else if (activeTab === 'mental') {
       relevantProducts = globalProducts.filter(p => p.subniche === 'Brain Health' || p.name === 'CortiSync' || p.name === 'Brain Pill');
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
          description: "Build a highly customized anti-inflammatory meal plan aligned with keto, vegan, or Mediterranean approaches.",
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
      case 'mental':
        return {
          title: "Mental Health Wellness Assessment | EternoFit",
          description: "Take our 10-question mental wellness assessment covering mood, anxiety, resilience, purpose, and self-care. Get personalised wellbeing strategies — not a clinical diagnosis.",
          keywords: "mental health test, mental wellness assessment, anxiety check, mood assessment, psychological wellbeing quiz, stress and depression indicator",
          url: "https://eternofit.com/tools?tool=mental",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit Mental Health Wellness Assessment",
            "operatingSystem": "All",
            "applicationCategory": "HealthApplication",
            "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
          }
        };
      case 'adhd':
        return {
          title: "Free ADHD Self-Screening Quiz | EternoFit",
          description: "Take our ASRS-based ADHD screening quiz to identify attention, focus, and executive function patterns. Educational tool — not a clinical diagnosis.",
          keywords: "adhd test, adhd quiz, adhd self assessment, adult adhd screening, focus test, attention deficit, executive function quiz",
          url: "https://eternofit.com/tools?tool=adhd",
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EternoFit ADHD Self-Screening Quiz",
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
          keywords: "clinical health assessment, performance optimization, tactical fitness, bio-identical nutrition, longevity programs, health coaching, hormone health",
          url: "https://eternofit.com/tools",
          schema: null
        };
    }
  }, [activeTab]);

  return (
    <div className="tools-page-container page-bg" style={{ minHeight: '80vh', color: 'var(--text-main-site)' }}>
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

        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
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

                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="var(--accent-green)" /> Recommended Testosterone Optimisation Plan</h4>
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
                        <strong>Actionable Longevity Plan:</strong> {longevityResult.plan}
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

            {/* TOOL 8: ADHD TOOLKIT */}
            {activeTab === 'adhd' && (
              <div className="tool-content">
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Brain color="var(--accent-green)" /> ADHD Toolkit
                </h2>
                <p style={{ color: 'var(--text-muted-site)', marginBottom: '1.5rem' }}>
                  Science-backed tools built for ADHD brains — screening, timers, capture, habits, and focus sounds.
                </p>

                {/* Sub-tool navigation */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { key: 'screening', label: '🧠 Screening' },
                    { key: 'braindump', label: '💭 Brain Dump' },
                    { key: 'pomodoro', label: '⏱ Pomodoro' },
                    { key: 'onetask', label: '🎯 One Task' },
                    { key: 'breakdown', label: '🔨 Breakdown' },
                    { key: 'timer', label: '⏳ Visual Timer' },
                    { key: 'top3', label: '📋 Top 3' },
                    { key: 'capture', label: '📥 Quick Capture' },
                    { key: 'bodydouble', label: '👥 Body Double' },
                    { key: 'habits', label: '🔥 Habits' },
                    { key: 'sounds', label: '🎧 Focus Sounds' },
                  ].map(t => (
                    <button key={t.key} onClick={() => setAdhdSubTool(t.key)} style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                      background: adhdSubTool === t.key ? 'rgba(0,230,118,0.15)' : 'transparent',
                      border: adhdSubTool === t.key ? '1px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.1)',
                      color: adhdSubTool === t.key ? 'var(--accent-green)' : 'var(--text-muted-site)',
                    }}>{t.label}</button>
                  ))}
                </div>

                {/* ── SCREENING ── */}
                {adhdSubTool === 'screening' && (() => {
                  const qs = [
                    { key: 'q1', text: 'How often do you have trouble wrapping up the final details of a project once the challenging parts have been done?' },
                    { key: 'q2', text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?' },
                    { key: 'q3', text: 'How often do you have problems remembering appointments or obligations?' },
                    { key: 'q4', text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?' },
                    { key: 'q5', text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?' },
                    { key: 'q6', text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?' },
                  ];
                  const opts = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];
                  const calcADHD = () => {
                    const score = Object.values(adhdAnswers).reduce((s,v) => s+v, 0);
                    let level, description, color, badge;
                    if (score <= 8) { level='Low Indicator'; color='#4caf50'; badge='Minimal Concern'; description='Your responses suggest minimal ADHD-related patterns. Focus challenges are likely within typical variation.'; }
                    else if (score <= 14) { level='Moderate Indicator'; color='#ffa726'; badge='Moderate Concern'; description='Some ADHD-related patterns are present. These may impact productivity. Consider discussing with a professional if they affect daily life.'; }
                    else { level='High Indicator'; color='#ef5350'; badge='Consult a Professional'; description='Your responses show significant ADHD-related patterns across multiple domains. Consulting a licensed clinician for formal evaluation is recommended.'; }
                    setAdhdResult({ score, level, description, color, badge });
                  };
                  return (
                    <div>
                      <div style={{ padding: '0.6rem 1rem', background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <AlertTriangle size={16} style={{ color: '#ffc107', marginTop: '2px', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>Educational screening tool — not a clinical diagnosis. Based on ASRS-v1.1.</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                        {qs.map((q, idx) => (
                          <div key={q.key}>
                            <p style={{ fontWeight: '600', marginBottom: '0.6rem', color: 'var(--text-main-site)', lineHeight: '1.5' }}><span style={{ color: 'var(--accent-green)', marginRight: '6px' }}>{idx+1}.</span>{q.text}</p>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {opts.map((opt, val) => (
                                <button key={val} onClick={() => setAdhdAnswers(p => ({...p, [q.key]: val}))} style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', background: adhdAnswers[q.key]===val ? 'rgba(0,230,118,0.15)' : 'transparent', border: adhdAnswers[q.key]===val ? '1px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.1)', color: adhdAnswers[q.key]===val ? 'var(--accent-green)' : 'var(--text-muted-site)' }}>{opt}</button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={calcADHD} style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', border: 'none', borderRadius: '10px', color: '#0a0f0a', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem' }}>Analyze My Responses</button>
                      {adhdResult && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${adhdResult.color}30` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                            <div><span style={{ fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Score</span><h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.2rem 0', color: adhdResult.color }}>{adhdResult.score} / 20</h3></div>
                            <div style={{ textAlign: 'right' }}><span style={{ fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Level</span><h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0.5rem 0', color: adhdResult.color }}>{adhdResult.badge}</h4></div>
                          </div>
                          <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: `4px solid ${adhdResult.color}` }}>
                            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: '700', color: 'var(--text-main-site)' }}>{adhdResult.level}</h4>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted-site)', lineHeight: '1.5' }}>{adhdResult.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* ── BRAIN DUMP ── */}
                {adhdSubTool === 'braindump' && (
                  <div>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Brain Dump Box</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '1rem' }}>Dump everything on your mind with zero structure. Clear the mental clutter. Auto-saved locally.</p>
                    <textarea
                      value={brainDump}
                      onChange={e => setBrainDump(e.target.value)}
                      placeholder="Just start typing… tasks, worries, ideas, random thoughts — everything goes here."
                      style={{ width: '100%', minHeight: '260px', padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-main-site)', fontSize: '0.95rem', lineHeight: '1.7', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-site)' }}>💾 Auto-saved · {brainDump.length} characters</span>
                      <button onClick={() => { if (window.confirm('Clear the brain dump?')) setBrainDump(''); }} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-muted-site)', fontSize: '0.8rem', cursor: 'pointer' }}>Clear</button>
                    </div>
                  </div>
                )}

                {/* ── POMODORO ── */}
                {adhdSubTool === 'pomodoro' && (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Pomodoro Focus Timer</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '2rem' }}>25-min work sprints + 5-min breaks. Browser alert sounds when each phase ends.</p>
                    <div style={{ display: 'inline-flex', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => { setPomodoroMode('work'); setPomodoroTime(25*60); setPomodoroRunning(false); }} style={{ padding: '8px 20px', background: pomodoroMode==='work' ? 'rgba(0,230,118,0.15)' : 'transparent', border: 'none', color: pomodoroMode==='work' ? 'var(--accent-green)' : 'var(--text-muted-site)', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>Work 25m</button>
                      <button onClick={() => { setPomodoroMode('break'); setPomodoroTime(5*60); setPomodoroRunning(false); }} style={{ padding: '8px 20px', background: pomodoroMode==='break' ? 'rgba(0,230,118,0.15)' : 'transparent', border: 'none', color: pomodoroMode==='break' ? 'var(--accent-green)' : 'var(--text-muted-site)', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>Break 5m</button>
                    </div>
                    <div style={{ margin: '0 auto 1.5rem', width: '180px', height: '180px', borderRadius: '50%', border: `5px solid ${pomodoroMode==='work' ? 'var(--accent-green)' : '#ffa726'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                      <span style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px', color: 'var(--text-main-site)' }}>{adhdFmtTime(pomodoroTime)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '2px' }}>{pomodoroMode}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      <button onClick={() => setPomodoroRunning(r => !r)} style={{ padding: '10px 28px', background: pomodoroRunning ? '#ef5350' : 'var(--accent-green)', border: 'none', borderRadius: '8px', color: pomodoroRunning ? '#fff' : '#0a0f0a', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' }}>{pomodoroRunning ? 'Pause' : 'Start'}</button>
                      <button onClick={() => { setPomodoroRunning(false); setPomodoroTime(pomodoroMode==='work'?25*60:5*60); }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-muted-site)', fontWeight: '700', cursor: 'pointer' }}>Reset</button>
                    </div>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem' }}>🍅 Sessions completed today: <strong style={{ color: 'var(--accent-green)' }}>{pomodoroSessions}</strong></p>
                  </div>
                )}

                {/* ── ONE TASK ── */}
                {adhdSubTool === 'onetask' && (
                  <div>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>One Task at a Time</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Add your tasks. The screen shows only the current one — hiding everything else to reduce overwhelm.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <input value={oneTaskInput} onChange={e => setOneTaskInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter' && oneTaskInput.trim()) { setOneTaskList(p => [...p, { id: Date.now(), text: oneTaskInput.trim(), done: false }]); setOneTaskInput(''); }}} placeholder="Add a task…" style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main-site)', fontSize: '0.9rem', outline: 'none' }} />
                      <button onClick={() => { if (oneTaskInput.trim()) { setOneTaskList(p => [...p, { id: Date.now(), text: oneTaskInput.trim(), done: false }]); setOneTaskInput(''); }}} style={{ padding: '10px 18px', background: 'var(--accent-green)', border: 'none', borderRadius: '8px', color: '#0a0f0a', fontWeight: '700', cursor: 'pointer' }}>Add</button>
                    </div>
                    {oneTaskList.filter(t => !t.done).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted-site)', fontSize: '0.9rem' }}>✅ No pending tasks — add one above!</div>
                    ) : (
                      <div>
                        <div style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '14px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted-site)', marginBottom: '0.75rem' }}>Focus on this now</p>
                          <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main-site)', marginBottom: '1.25rem', lineHeight: '1.4' }}>{oneTaskList.filter(t=>!t.done)[0]?.text}</p>
                          <button onClick={() => setOneTaskList(p => p.map((t,i) => i===p.findIndex(x=>!x.done) ? {...t, done:true} : t))} style={{ padding: '10px 24px', background: 'var(--accent-green)', border: 'none', borderRadius: '8px', color: '#0a0f0a', fontWeight: '800', cursor: 'pointer' }}>✓ Done — Next Task</button>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted-site)', textAlign: 'center' }}>{oneTaskList.filter(t=>!t.done).length} task{oneTaskList.filter(t=>!t.done).length!==1?'s':''} remaining · <button onClick={() => setOneTaskList(p => p.filter(t=>!t.done))} style={{ background:'none', border:'none', color:'var(--accent-green)', cursor:'pointer', fontSize:'0.78rem', textDecoration:'underline' }}>Clear done</button></p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TASK BREAKDOWN ── */}
                {adhdSubTool === 'breakdown' && (
                  <div>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Task Breakdown Tool</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Type a big overwhelming task, then break it into small concrete steps you can actually start.</p>
                    <input value={bigTask} onChange={e => setBigTask(e.target.value)} placeholder="What's the big task? e.g. 'Write monthly report'" style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-main-site)', fontSize: '0.95rem', outline: 'none', marginBottom: '1.25rem', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <input value={subtaskInput} onChange={e => setSubtaskInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter' && subtaskInput.trim()) { setSubtasks(p => [...p, { id: Date.now(), text: subtaskInput.trim(), done: false }]); setSubtaskInput(''); }}} placeholder="Add a step…" style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main-site)', fontSize: '0.9rem', outline: 'none' }} />
                      <button onClick={() => { if (subtaskInput.trim()) { setSubtasks(p => [...p, { id: Date.now(), text: subtaskInput.trim(), done: false }]); setSubtaskInput(''); }}} style={{ padding: '10px 18px', background: 'var(--accent-green)', border: 'none', borderRadius: '8px', color: '#0a0f0a', fontWeight: '700', cursor: 'pointer' }}>+ Step</button>
                    </div>
                    {bigTask && <p style={{ fontWeight: '700', color: 'var(--accent-green)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>🎯 {bigTask}</p>}
                    {subtasks.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {subtasks.map((s, i) => (
                          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px 14px', background: s.done ? 'rgba(0,230,118,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${s.done?'rgba(0,230,118,0.2)':'rgba(255,255,255,0.07)'}`, borderRadius: '8px' }}>
                            <button onClick={() => setSubtasks(p => p.map(x => x.id===s.id ? {...x, done:!x.done} : x))} style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${s.done?'var(--accent-green)':'rgba(255,255,255,0.2)'}`, background: s.done?'var(--accent-green)':'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0f0a', fontWeight: '800', fontSize: '0.7rem' }}>{s.done?'✓':''}</button>
                            <span style={{ flex: 1, fontSize: '0.9rem', color: s.done?'var(--text-muted-site)':'var(--text-main-site)', textDecoration: s.done?'line-through':'none' }}>{i+1}. {s.text}</span>
                            <button onClick={() => setSubtasks(p => p.filter(x => x.id!==s.id))} style={{ background: 'none', border: 'none', color: 'var(--text-muted-site)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                          </div>
                        ))}
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted-site)', marginTop: '0.5rem' }}>{subtasks.filter(s=>s.done).length}/{subtasks.length} steps done</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── VISUAL TIMER ── */}
                {adhdSubTool === 'timer' && (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Visual Countdown Timer</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>A shrinking colored bar makes time physically visible — great for time-blindness.</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <span style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem' }}>Duration (min):</span>
                      {[5,10,15,20,25,30].map(m => (
                        <button key={m} onClick={() => { if (!visualRunning) { setVisualDuration(m); setVisualRemaining(m*60); }}} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', background: visualDuration===m ? 'rgba(0,230,118,0.15)' : 'transparent', border: visualDuration===m ? '1px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.1)', color: visualDuration===m ? 'var(--accent-green)' : 'var(--text-muted-site)' }}>{m}</button>
                      ))}
                    </div>
                    <div style={{ margin: '0 auto 1.25rem', width: '100%', maxWidth: '400px' }}>
                      <div style={{ height: '28px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div style={{ height: '100%', width: `${(visualRemaining / (visualDuration*60)) * 100}%`, background: visualRemaining/(visualDuration*60) > 0.4 ? 'var(--accent-green)' : visualRemaining/(visualDuration*60) > 0.2 ? '#ffa726' : '#ef5350', borderRadius: '14px', transition: 'width 1s linear, background 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main-site)', letterSpacing: '-1px' }}>{adhdFmtTime(visualRemaining)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <button onClick={() => { if (visualRemaining > 0) setVisualRunning(r => !r); }} style={{ padding: '10px 28px', background: visualRunning ? '#ef5350' : 'var(--accent-green)', border: 'none', borderRadius: '8px', color: visualRunning?'#fff':'#0a0f0a', fontWeight: '800', cursor: 'pointer' }}>{visualRunning ? 'Pause' : 'Start'}</button>
                      <button onClick={() => { setVisualRunning(false); setVisualRemaining(visualDuration*60); }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-muted-site)', fontWeight: '700', cursor: 'pointer' }}>Reset</button>
                    </div>
                  </div>
                )}

                {/* ── DAILY TOP 3 ── */}
                {adhdSubTool === 'top3' && (
                  <div>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Daily Top 3 Planner</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Force yourself to pick only 3 priorities for today. Nothing else matters until these are done. Auto-saved.</p>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: topThree[i] ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.05)', border: `2px solid ${topThree[i]?'var(--accent-green)':'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--accent-green)', fontSize: '0.85rem', flexShrink: 0 }}>{i+1}</div>
                        <input value={topThree[i]} onChange={e => setTopThree(p => { const n=[...p]; n[i]=e.target.value; return n; })} placeholder={`Priority ${i+1}…`} style={{ flex: 1, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main-site)', fontSize: '0.9rem', outline: 'none' }} />
                      </div>
                    ))}
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted-site)', marginTop: '1rem' }}>💾 Auto-saved — still here when you come back.</p>
                  </div>
                )}

                {/* ── QUICK CAPTURE ── */}
                {adhdSubTool === 'capture' && (
                  <div>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Quick Capture Inbox</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Dump ideas fast — don't stop to organize. Sort them into categories when your brain is ready.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <input value={captureInput} onChange={e => setCaptureInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter' && captureInput.trim()) { setCaptureItems(p => [{ id:Date.now(), text:captureInput.trim(), tag:'inbox' }, ...p]); setCaptureInput(''); }}} placeholder="Quick thought, idea, task…" style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main-site)', fontSize: '0.9rem', outline: 'none' }} />
                      <button onClick={() => { if (captureInput.trim()) { setCaptureItems(p => [{ id:Date.now(), text:captureInput.trim(), tag:'inbox' }, ...p]); setCaptureInput(''); }}} style={{ padding: '10px 18px', background: 'var(--accent-green)', border: 'none', borderRadius: '8px', color: '#0a0f0a', fontWeight: '700', cursor: 'pointer' }}>Capture</button>
                    </div>
                    {captureItems.length === 0 ? <p style={{ color: 'var(--text-muted-site)', fontSize: '0.88rem', textAlign: 'center', padding: '2rem' }}>Your inbox is empty — start capturing!</p> : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {captureItems.map(item => (
                          <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px' }}>
                            <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-main-site)' }}>{item.text}</span>
                            {['inbox','todo','idea','later'].map(tag => (
                              <button key={tag} onClick={() => setCaptureItems(p => p.map(x => x.id===item.id ? {...x, tag} : x))} style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', background: item.tag===tag ? 'rgba(0,230,118,0.15)' : 'transparent', border: item.tag===tag ? '1px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.08)', color: item.tag===tag ? 'var(--accent-green)' : 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tag}</button>
                            ))}
                            <button onClick={() => setCaptureItems(p => p.filter(x => x.id!==item.id))} style={{ background: 'none', border: 'none', color: 'var(--text-muted-site)', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}>✕</button>
                          </div>
                        ))}
                        <button onClick={() => { if (window.confirm('Clear all captured items?')) setCaptureItems([]); }} style={{ alignSelf: 'flex-end', marginTop: '0.5rem', padding: '5px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-muted-site)', fontSize: '0.78rem', cursor: 'pointer' }}>Clear all</button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── BODY DOUBLE ── */}
                {adhdSubTool === 'bodydouble' && (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Body Double Focus Timer</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '0.75rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>Body doubling means focusing alongside another person — even virtually. Set your session, commit, and work.</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                      <span style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem' }}>Session length:</span>
                      {[15,25,45,60].map(m => (
                        <button key={m} onClick={() => { if (!bdRunning) { setBdSession(m); setBdElapsed(0); }}} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', background: bdSession===m?'rgba(0,230,118,0.15)':'transparent', border: bdSession===m?'1px solid var(--accent-green)':'1px solid rgba(255,255,255,0.1)', color: bdSession===m?'var(--accent-green)':'var(--text-muted-site)' }}>{m}m</button>
                      ))}
                    </div>
                    <div style={{ margin: '0 auto 1rem', width: '180px', height: '180px', borderRadius: '50%', border: `5px solid ${bdRunning?'var(--accent-green)':'rgba(255,255,255,0.1)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', transition: 'border-color 0.3s' }}>
                      <span style={{ fontSize: '2.6rem', fontWeight: '800', color: 'var(--text-main-site)', letterSpacing: '-1px' }}>{adhdFmtTime(bdElapsed)}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '2px' }}>/ {adhdFmtTime(bdSession*60)}</span>
                    </div>
                    <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto 1.5rem', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(bdElapsed/(bdSession*60))*100}%`, background: 'var(--accent-green)', borderRadius: '3px', transition: 'width 1s linear' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <button onClick={() => setBdRunning(r => !r)} style={{ padding: '10px 28px', background: bdRunning?'#ef5350':'var(--accent-green)', border: 'none', borderRadius: '8px', color: bdRunning?'#fff':'#0a0f0a', fontWeight: '800', cursor: 'pointer' }}>{bdRunning?'Pause':'Start Session'}</button>
                      <button onClick={() => { setBdRunning(false); setBdElapsed(0); }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-muted-site)', fontWeight: '700', cursor: 'pointer' }}>Reset</button>
                    </div>
                    {bdElapsed >= bdSession*60 && <p style={{ color: 'var(--accent-green)', fontWeight: '700', marginTop: '1.5rem', fontSize: '1.1rem' }}>🎉 Session complete! Great work.</p>}
                  </div>
                )}

                {/* ── HABITS ── */}
                {adhdSubTool === 'habits' && (
                  <div>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Habit & Streak Tracker</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Check off daily habits to build streaks. Saved locally so your progress persists between visits.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <input value={habitInput} onChange={e => setHabitInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter' && habitInput.trim()) { setHabits(p => [...p, { id: Date.now(), name: habitInput.trim(), streak: 0, lastChecked: null }]); setHabitInput(''); }}} placeholder="Add a habit (e.g. Take meds, 10-min walk)…" style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main-site)', fontSize: '0.9rem', outline: 'none' }} />
                      <button onClick={() => { if (habitInput.trim()) { setHabits(p => [...p, { id: Date.now(), name: habitInput.trim(), streak: 0, lastChecked: null }]); setHabitInput(''); }}} style={{ padding: '10px 18px', background: 'var(--accent-green)', border: 'none', borderRadius: '8px', color: '#0a0f0a', fontWeight: '700', cursor: 'pointer' }}>Add</button>
                    </div>
                    {habits.length === 0 ? <p style={{ color: 'var(--text-muted-site)', fontSize: '0.88rem', textAlign: 'center', padding: '2rem' }}>No habits yet — add one above!</p> : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {habits.map(h => {
                          const doneToday = h.lastChecked === adhdTodayKey();
                          return (
                            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px', background: doneToday?'rgba(0,230,118,0.07)':'rgba(255,255,255,0.03)', border: `1px solid ${doneToday?'rgba(0,230,118,0.25)':'rgba(255,255,255,0.07)'}`, borderRadius: '10px' }}>
                              <button onClick={() => adhdCheckHabit(h.id)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${doneToday?'var(--accent-green)':'rgba(255,255,255,0.2)'}`, background: doneToday?'var(--accent-green)':'transparent', cursor: doneToday?'default':'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0f0a', fontWeight: '800', fontSize: '0.8rem', flexShrink: 0 }} disabled={doneToday}>{doneToday?'✓':''}</button>
                              <span style={{ flex: 1, fontWeight: '600', color: doneToday?'var(--text-muted-site)':'var(--text-main-site)', textDecoration: doneToday?'line-through':'none', fontSize: '0.9rem' }}>{h.name}</span>
                              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: h.streak>=7?'#ffa726':h.streak>=3?'var(--accent-green)':'var(--text-muted-site)' }}>🔥 {h.streak}</span>
                              <button onClick={() => setHabits(p => p.filter(x => x.id!==h.id))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── FOCUS SOUNDS ── */}
                {adhdSubTool === 'sounds' && (
                  <div>
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Ambient Focus Sounds</h3>
                    <p style={{ color: 'var(--text-muted-site)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Generated in your browser — no downloads. Click to play/stop. Use headphones for binaural beats.</p>
                    <div style={{ padding: '0.6rem 1rem', background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>ℹ️ All sounds are generated using the Web Audio API. <strong style={{ color: '#ffc107' }}>Binaural beats require headphones</strong> to be effective.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {[
                        { key: 'brown', label: 'Brown Noise', desc: 'Deep rumble, like a strong waterfall. Best for blocking distractions and improving focus.', icon: '🌊' },
                        { key: 'white', label: 'White Noise', desc: 'Bright, steady hiss. Masks external sounds — good for busy or unpredictable environments.', icon: '📻' },
                        { key: 'rain', label: 'Pink Noise / Rain', desc: 'Soft, natural-feeling static. Relaxing without drowning alertness.', icon: '🌧️' },
                        { key: 'binaural', label: '40Hz Binaural Beats', desc: 'Gamma wave entrainment (headphones required). Associated with focused cognitive states.', icon: '🎧' },
                      ].map(s => (
                        <button key={s.key} onClick={() => activeSound===s.key ? adhdStopSound() : adhdStartSound(s.key)} style={{ padding: '1.25rem', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', background: activeSound===s.key ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeSound===s.key?'rgba(0,230,118,0.4)':'rgba(255,255,255,0.08)'}` }}>
                          <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{s.icon}</div>
                          <div style={{ fontWeight: '700', color: activeSound===s.key?'var(--accent-green)':'var(--text-main-site)', marginBottom: '0.3rem', fontSize: '0.92rem' }}>{s.label} {activeSound===s.key && <span style={{ fontSize: '0.72rem', background: 'rgba(0,230,118,0.2)', padding: '2px 7px', borderRadius: '10px', marginLeft: '4px' }}>▶ ON</span>}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted-site)', lineHeight: '1.4' }}>{s.desc}</div>
                        </button>
                      ))}
                    </div>
                    {activeSound && <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '600' }}>▶ Now playing: {activeSound === 'brown' ? 'Brown Noise' : activeSound === 'white' ? 'White Noise' : activeSound === 'rain' ? 'Pink Noise / Rain' : '40Hz Binaural Beats'} — click again to stop.</p>}
                  </div>
                )}

              </div>
            )}

            {/* TOOL 9: MENTAL HEALTH WELLNESS ASSESSMENT */}
            {activeTab === 'mental' && (() => {
              const mentalQuestions = [
                { id: 'q1', label: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?', reverse: true },
                { id: 'q2', label: 'How often have you felt little interest or pleasure in things you used to enjoy?', reverse: true },
                { id: 'q3', label: 'How often do you feel nervous, anxious, or on edge?', reverse: true },
                { id: 'q4', label: 'How often are you unable to stop or control worrying?', reverse: true },
                { id: 'q5', label: 'How often do you feel overwhelmed by daily tasks or responsibilities?', reverse: true },
                { id: 'q6', label: 'How well are you able to bounce back from setbacks or difficult situations?', reverse: false },
                { id: 'q7', label: 'How often do you feel meaningfully connected to the people around you?', reverse: false },
                { id: 'q8', label: 'How often do you feel a sense of purpose or meaning in your daily life?', reverse: false },
                { id: 'q9', label: 'How consistently do you practice self-care (sleep, movement, nutrition, rest)?', reverse: false },
                { id: 'q10', label: 'How often do you engage in negative self-talk or harsh self-criticism?', reverse: true },
              ];
              const reverseOpts = ['Never', 'Rarely', 'Sometimes', 'Often'];
              const forwardOpts = ['Never / Rarely', 'Sometimes', 'Often', 'Almost Always'];
              return (
                <div className="tool-content">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smile color="var(--accent-green)" /> Mental Health Wellness Assessment
                  </h2>
                  <p style={{ color: 'var(--text-muted-site)', marginBottom: '0.75rem' }}>
                    A 10-question evidence-informed wellbeing check covering mood, anxiety, resilience, purpose, and self-care.
                  </p>
                  <div style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--text-muted-site)' }}>
                    ⚠️ If you are experiencing a mental health crisis, please contact a qualified mental health professional or a crisis helpline immediately.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2rem' }}>
                    {mentalQuestions.map((q, idx) => {
                      const opts = q.reverse ? reverseOpts : forwardOpts;
                      return (
                        <div key={q.id}>
                          <p style={{ fontWeight: '600', color: 'var(--text-main-site)', marginBottom: '0.75rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            <span style={{ color: 'var(--accent-green)', fontWeight: '700', marginRight: '6px' }}>{idx + 1}.</span>{q.label}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                            {opts.map((opt, i) => {
                              const val = i + 1;
                              const selected = mentalAnswers[q.id] === val;
                              return (
                                <button
                                  key={i}
                                  onClick={() => { setMentalAnswers(prev => ({ ...prev, [q.id]: val })); setMentalResult(null); }}
                                  style={{
                                    padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease',
                                    background: selected ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.03)',
                                    border: selected ? '1px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.08)',
                                    color: selected ? 'var(--accent-green)' : 'var(--text-muted-site)',
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={calculateMentalHealth}
                      style={{ flex: 1, padding: '14px', background: 'var(--accent-green)', border: 'none', borderRadius: '10px', color: '#0a0f0a', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Analyse My Mental Wellness
                    </button>
                    <button
                      onClick={() => { setMentalAnswers({ q1:0,q2:0,q3:0,q4:0,q5:0,q6:0,q7:0,q8:0,q9:0,q10:0 }); setMentalResult(null); }}
                      style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-muted-site)', cursor: 'pointer' }}
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>

                  {mentalResult && (
                    <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: `1px solid ${mentalResult.color}40`, borderRadius: '16px' }}>
                      {/* Overall score */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ color: mentalResult.color, fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>{mentalResult.tier}</h3>
                          <p style={{ color: 'var(--text-muted-site)', fontSize: '0.88rem' }}>Wellness Score: <strong style={{ color: '#fff' }}>{mentalResult.wellnessScore}/100</strong></p>
                        </div>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `${mentalResult.color}18`, border: `3px solid ${mentalResult.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: mentalResult.color }}>
                          {mentalResult.wellnessScore}
                        </div>
                      </div>

                      {/* Dimension bars */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                        {mentalResult.dimensions.map((d, i) => (
                          <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.83rem' }}>
                              <span style={{ color: 'var(--text-muted-site)', fontWeight: '600' }}>{d.label}</span>
                              <span style={{ color: '#fff', fontWeight: '700' }}>{d.score}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${d.score}%`, background: d.score >= 70 ? 'var(--accent-green)' : d.score >= 45 ? '#ffb300' : '#ef5350', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <p style={{ color: 'var(--text-muted-site)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>{mentalResult.summary}</p>

                      {/* Strategies */}
                      <h4 style={{ fontWeight: '700', color: 'var(--text-main-site)', marginBottom: '0.75rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Actions</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {mentalResult.strategies.map((s, i) => (
                          <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-muted-site)', lineHeight: '1.55' }}>
                            <span style={{ color: 'var(--accent-green)', fontWeight: '800', flexShrink: 0 }}>→</span>
                            {s}
                          </li>
                        ))}
                      </ul>

                      <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                        This assessment is for general wellness awareness only and does not constitute a medical diagnosis. If you are concerned about your mental health, please consult a qualified professional.
                      </p>
                    </div>
                  )}

                  {mentalResult && renderRecommendedProducts()}
                </div>
              );
            })()}

            { (bmiResult || tResult || realAgeResult || longevityResult || sleepResult || mealResult || stressResult || adhdResult) && renderRecommendedProducts() }
          </div>
        </div>
      </div>

    </div>
  );
};
