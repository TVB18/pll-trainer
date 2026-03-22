// ============================================================================
// PLL Trainer
// Geherordende en uitgebreid becommentarieerde LEERVERSIE (Nederlands)
// ============================================================================
// Doel van dit document:
// - de huidige werking behouden
// - functies logisch groeperen
// - de flow van de app zichtbaar maken
// - JS-specifieke patronen uitleggen waar dat nuttig is
// - ongebruikte / oude / dubbele code NIET verwijderen, maar uitcommentariëren
//
// Gebruiksidee:
// - dit bestand = leer- en referentieversie
// - je actieve bestand = werkversie die later verder opgeschoond kan worden
//
// Belangrijk:
// - deze versie probeert gedrag niet te wijzigen
// - daarom blijven ook enkele oudere/legacy stukken zichtbaar in commentaar


// ============================================================================
// 1) STATISCHE DATA
// ============================================================================
// In deze sectie staat de vaste referentiedata van de app:
// - de lijst met PLL's
// - de teksthints per case / AUF
// - de lay-out van het antwoordgrid
//
// Deze data verandert niet tijdens runtime.

const PLL = [
// Edge-only
{ name: "Ua", alg: "M2' U' M' U2' M U' M2'" },
{ name: "Ub", alg: "M2' U M' U2' M U M2'" },
{ name: "H",  alg: "M2' U' M2' U2' M2' U' M2'" },
{ name: "Z",  alg: "M U2' M2' U2' M U' M2' U' M2'2" },

// Corner-only
{ name: "Aa", alg: "x R2' D2' R U R' D2' R U' R x'" },
{ name: "Ab", alg: "x R' U R' D2' R U' R' D2' R2' x'" },
{ name: "E",  alg: "x' D R U R' D' R U' R' D R U' R' D' R U R' x y'" },

// Adjacent corner swap
{ name: "T",  alg: "F R U' R' U R U R2' F' R U R U' R'" },
{ name: "F",  alg: "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'" },
{ name: "Jb", alg: "R U R2' F' R U R U' R' F R U' R'" },
{ name: "Ja", alg: "L' R' U2' R U R' U2' L U' R y'" },

// Diagonal corner swap
{ name: "V",  alg: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'" },
{ name: "Y",  alg: "F R' F' R U R U' R' F R U' R' U R U R' F'" },
{ name: "Na", alg: "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'" },
{ name: "Nb", alg: "F r' F' r U r U' r2' D' F r U r' F' D r" },

// G perms
{ name: "Ga", alg: "R' U' R D' U R2' U R' U R U' R U' R2' D" },
{ name: "Gb", alg: "R2' U R' U R' U' R U' R2' D U' R' U R D'" },
{ name: "Gc", alg: "D' R U R' U' D R2' U' R U' R' U R' U R2'" },
{ name: "Gd", alg: "R2' U' R U' R U R' U R2' D' U R U' R' D" },

// R perms
{ name: "Ra", alg: "R U2' R D R' U R D' R' U' R' U R U R' y'" },
{ name: "Rb", alg: "R' U R U R' U' R' D' R U R' D R U2' R" }
];

const HINTS = {
  Ua: {
	"": "3Bar + Adjacent Headlights",
	"U": "Adjacent Headlights + Adjacent Headlights (Edge moves to right)",
	"U2": "Adjacent Headlights + Opposite Headlights (Edge moves to right)",
	"U'": "Opposite Headlights + 3Bar"
  },
  Ub: {
	"": "3Bar + Opposite Headlights",
	"U": "Opposite Headlights + Adjacent Headlights (Edge moves to left)",
	"U2": "Opposite Headlights + Opposite Headlights (Edge moves to left)",
	"U'": "Adjacent Headlights + 3Bar"
  },
  H: {
	"": "Opposite Headlights + Opposite Headlights",
	"U": "Opposite Headlights + Opposite Headlights",
	"U2": "Opposite Headlights + Opposite Headlights (Edge moves to left)",
	"U'": "Opposite Headlights + Opposite Headlights"
  },
  Z: {
	"": "Adjacent Headlights + Adjacent Headlighst (2 kleuren)",
	"U": "Adjacent Headlights + Adjacent Headlights (4 kleuren)",
	"U2": "Adjacent Headlights + Adjacent Headlights (2 kleuren)",
	"U'": "Adjacent Headlights + Adjacent Headlights (4 kleuren)"
  },

  Aa: {
	"": "Opposite Outer bar + Bookends + 4 kleuren",
	"U": "No checkers + Adjacent Headlights",
	"U2": "Adjacent Headlights (4 checkers) + Adjacent Outer bar",
	"U'": "Adjacent Inner bar + Opposite Inner bar + Bookends"
  },
  Ab: {
	"": "Adjacent Outer bar + Adjacent Headlights (4checkers)",
	"U": "Adjacent Headlights + no checkers",
	"U2": "Bookends + 4 kleuren + Bookends + (Out2Bar + O)",
	"U'": "Opposite Inner bar + Adjacent Inner bar + Bookends"
  },
  E: {
	"": "No Bookends + no checkers",
	"U": "No Bookends + no checkers",
	"U2": "No Bookends + no checkers",
	"U'": "No Bookends + no checkers"
  },

  T: {
	"": "Adjacent Outer bar + Bookends + 4 kleuren",
	"U": "4 kleuren + Bookends + Adjacent Outer bar",
	"U2": "In2Ba-Adj + Opposite Headlights",
	"U'": "Opposite Headlights + Adjacent Inner bar"
  },
  F: {
	"": "3Bar + 4 kleuren",
	"U": "Bookends + 4 checkers",
	"U2": "Bookends + 4 checkers",
	"U'": "4 kleuren + 3Bar"
  },
  Jb: {
	"": "Adjacent Inner bar + Opposite Outer bar) + Bookends",
	"U": "Opposite Inner bar + Adjacent Outer bar + Bookends",
	"U2": "Adjacent Inner bar + 3Bar",
	"U'": "3Bar + Adjacent Outer bar"
  },
  Ja: {
	"": "Adjacent Outer bar + 3Bar",
	"U": "3Bar + Adjacent Inner bar",
	"U2": "Adjacent Outer bar + Opposite Inner bar + Bookends",
	"U'": "Opposite Outer bar + Adjacent Inner bar + Bookends"
  },

  V: {
	"": "Opposite Outer bar + no Bookends",
	"U": "No Bookends + inner checkers",
	"U2": "No Bookends + Opposite Outer bar",
	"U'": "No Bookends + inner checkers"
  },
  Y: {
	"": "Opposite Outer bar + Opposite corner + Opposite Outer bar",
	"U": "Opposite Inner bar + no Bookends",
	"U2": "No Bookends + outer checkers",
	"U'": "No Bookends + Opposite Inner bar"
  },
  Na: {
	"": "Opposite Inner bar + Opposite Outer bar + no Bookends",
	"U": "Opposite Inner bar + Opposite Outer bar + no Bookends",
	"U2": "Opposite Inner bar + Opposite Outer bar + no Bookends",
	"U'": "Opposite Inner bar + Opposite Outer bar + no Bookends"
  },
  Nb: {
	"": "Opposite Outer bar + Opposite Inner bar + no Bookends",
	"U": "Opposite Outer bar + Opposite Inner bar + no Bookends",
	"U2": "Opposite Outer bar + Opposite Inner bar + no Bookends",
	"U'": "Opposite Outer bar + Opposite Inner bar + no Bookends"
  },

  Ga: {
	"": "Adjacent Inner bar + Bookends",
	"U": "Bookends + Opp(Corner + Edge)",
	"U2": "Right(Adjacent Headlights + 4 checkers)",
	"U'": "Adjacent Headlights + corner + Outer Bar (no checkers)"
  },
  Gb: {
	"": "Right(Opposite Outer bar + Bookends)",
	"U": "Opposite Inner bar + Bookends",
	"U2": "Right(Opposite Headlights)) + 3 kleuren (5 div checkers; seq 2Bar)",
	"U'": "Opposite Headlights + 4 kleuren (non-seq 2Bar)"
  },
  Gc: {
	"": "Bookends + Opp(Edge + Corner)",
	"U": "Bookends + Adjacent Inner bar",
	"U2": "Out2Bar + corner + Adjacent Headlight no checkers)",
	"U'": "Adjacent Headlights + 4 checkers"
  },
  Gd: {
	"": "Bookends + Opposite Inner bar",
	"U": "Opposite Outer bar + Bookends",
	"U2": "Right(Opposite Headlights + 4 kleuren; non-seq 2Bar)",
	"U'": "Opposite Headlights + 3 kleuren (5 div checkers; seq 2Bar)"
  },

  Ra: {
	"": "Adjacent Headlights + In2Bar",
	"U": "Adjacent Outer bar + Bookends + 3 kleuren + div corner)",
	"U2": "Bookends + 4 kleuren + 2xAdj",
	"U'": "Right(Adjacent Headlights) + 5 checkers"
  },
  Rb: {
	"": "Adjacent Headlights + 5 checkers",
	"U": "Bookends + 4 kleuren + Right(2xAdj)",
	"U2": "Bookends + Adjacent Outer bar + 3 kleuren + div corner",
	"U'": "Adjacent Inner bar + Adjacent Headlights"
  }
};

const ANSWER_GRID = [
	["Aa", "Ab", null,  "E", "F"],
	["Ga", "Gb", "Gc",  "Gd",  null],
	["H", null, "Ja",  "Jb",  null],
	["Na", "Nb", null,  "Ra",  "Rb"],
	["T", null, "Ua", "Ub", null],
	["V", "Y", "Z", null, null]
];


// ============================================================================
// 2) CONFIGURATIECONSTANTEN
// ============================================================================
// Vaste instellingen van de app. Dit is geen runtime-state.

const REVEAL_AFTER_MS = 15000;
const STORAGE_KEY = "pllTrainerStats_v1";
const ROUND_SIZE = 10;

// Oud / momenteel niet actief
//const APP_DATA_KEY = "pllTrainerAppData_v1";


// ============================================================================
// 3) DEFAULT FACTORIES
// ============================================================================
// Waarom functies en geen losse objecten?
// Omdat objecten in JS referentietypes zijn. Als je gewoon één object zou
// hergebruiken, kan state onbedoeld gedeeld worden. Een factory geeft telkens
// een verse kopie terug.

const defaultStats = () => ({
	attempts: 0,
	correct: 0,
	incorrect: 0,
	timeouts: 0,
	streak: 0,
	bestStreak: 0,
	sumTimeAllMs: 0,
	sumTimeCorrectMs: 0,
	perCase: {},
	perCaseAuf: {}
});

function defaultSettings() {
	return {
		roundSize: ROUND_SIZE
	};
}

function defaultStoredData() {
	return {
		stats: defaultStats(),
		roundHistory: [],
		attemptHistory: [],
		settings: defaultSettings()
	};
}
/*
// Legacy: nog nuttig als referentie, maar vandaag niet actief in de hoofdfow
function defaultAppData() {
	return {
		roundHistory: []
	};
}
*/


// ============================================================================
// 4) PERSISTENCE / LOCAL STORAGE
// ============================================================================
// Deze sectie leest en schrijft data naar localStorage.
// localStorage bewaart alleen strings, dus objecten worden via JSON
// geserialiseerd (JSON.stringify) en terug ingelezen (JSON.parse).

/*
// Oude, eenvoudigere laadfunctie. Niet meer de hoofdroute sinds storedData.
function loadStats() {
	try {
	  const raw = localStorage.getItem(STORAGE_KEY);
	  if (!raw) return defaultStats();
	  const obj = JSON.parse(raw);
	  return { ...defaultStats(), ...obj };
	} catch {
	  return defaultStats();
	}
}
*/

function saveStats() {
	storedData.stats = stats;
	saveStoredData();
}

function loadStoredData() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return defaultStoredData();

		const obj = JSON.parse(raw);

		return {
			...defaultStoredData(),
			...obj,
			stats: {
				...defaultStats(),
				...(obj.stats || {})
			},
			settings: {
				...defaultSettings(),
				...(obj.settings || {})
			}
		};
	} catch {
		return defaultStoredData();
	}
}

function saveStoredData() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
}

/*
// Legacy persistence: nu niet actief, maar bewaard voor vergelijking.
function saveAppData() {
	localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));
}

function loadAppData() {
	try {
		const raw = localStorage.getItem(APP_DATA_KEY);
		if (!raw) return defaultAppData();

		const obj = JSON.parse(raw);
		return {
			...defaultAppData(),
			...obj
		};
	} catch {
		return defaultAppData();
	}
}
*/


// ============================================================================
// 5) RUNTIME STATE
// ============================================================================
// Deze variabelen stellen de huidige toestand van de app voor:
// - welke case nu actief is
// - welke timers lopen
// - welke ronde bezig is
// - of we in review mode zitten

let currentCase = null;
let lastCaseName = null;
let revealTimerId = null;
let startPerf = null;
let answered = false;
let roundIndex = 0;
let roundResults = [];
let currentAuf = "";   // De huidige AUF bewaren zodat de juiste hint getoond wordt.
let previousRoundMistakeCases = [];
let lastRoundSummary = null;
let lastRoundResults = [];
let currentCubeYRotation = "";

// Huidige actieve storage-model
let storedData = loadStoredData();
let stats = storedData.stats;
let roundHistory = storedData.roundHistory;
let settings = storedData.settings;
let attemptHistory = storedData.attemptHistory || [];

let hintTimerId = null;
let progressIntervalId = null;
let hintVisible = false;
let reviewQueue = []; // vb. ["Nb|U2", "V|", "Ga|U'"]
let currentReviewItem = null;
let isReviewRound = false;

/*
// Oude initiatiepad - niet meer actief sinds storedData de centrale bron is.
let stats = loadStats();
let appData = loadAppData();
let roundHistory = appData.roundHistory;
*/


// ============================================================================
// 6) ALGEMENE HELPERS
// ============================================================================
// Kleine hulpfuncties die op meerdere plaatsen gebruikt worden.

function shuffle(arr) {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function getPllByName(name) {
	return PLL.find(p => p.name === name) || null;
}

function msToSec(ms) {
	return (ms / 1000).toFixed(2);
}

function formatAuf(auf) {
	return auf === "" ? "no AUF" : auf;
}

function formatAufLabel(auf) {
	return auf === "" ? "0" : auf;
}


// ============================================================================
// 7) CASE/AUF KEY HELPERS
// ============================================================================
// Sommige data wordt opgeslagen per combinatie van case + AUF.
// Daarom wordt vaak een sleutel gemaakt zoals "Rb|U2".

function makeCaseAufKey(caseName, auf) {
	return `${caseName}|${auf ?? ""}`;
}

function parseCaseAufKey(key) {
	const [caseName, auf = ""] = key.split("|");
	return { case: caseName, auf };
}


// ============================================================================
// 8) STATS-MODEL HELPERS
// ============================================================================
// Hier zitten de functies die stats-objecten voorbereiden en uitlezen.
// De app gebruikt twee detailniveaus:
// - perCase    : algemene case-statistiek (heatmap, per-case tabel)
// - perCaseAuf : case + AUF-statistiek (top fails, review)

function ensurePerCase(name) {
	if (!stats.perCase[name]) {
		stats.perCase[name] = {
			attempts: 0,
			correct: 0,
			incorrect: 0,
			timeouts: 0,
			sumTimeAllMs: 0,
			sumTimeCorrectMs: 0
		};
	}
	return stats.perCase[name];
}

function ensurePerCaseAuf(caseName, auf) {
	const key = makeCaseAufKey(caseName, auf);

	if (!stats.perCaseAuf[key]) {
		stats.perCaseAuf[key] = {
			case: caseName,
			auf: auf ?? "",
			attempts: 0,
			correct: 0,
			incorrect: 0,
			timeouts: 0,
			sumTimeAllMs: 0,
			sumTimeCorrectMs: 0
		};
	}

	return stats.perCaseAuf[key];
}

function getPerCaseRows() {
	return PLL.map(c => {
		const pc = stats.perCase?.[c.name] || {
			attempts: 0,
			correct: 0,
			incorrect: 0,
			timeouts: 0,
			sumTimeAllMs: 0,
			sumTimeCorrectMs: 0
		};

		const accuracy = pc.attempts ? pc.correct / pc.attempts : null;
		const avgCorrectMs = pc.correct ? pc.sumTimeCorrectMs / pc.correct : null;

		return {
			name: c.name,
			attempts: pc.attempts,
			correct: pc.correct,
			incorrect: pc.incorrect,
			timeouts: pc.timeouts,
			accuracy,
			avgCorrectMs
		};
	});
}

function sortWorstToBest(rows) {
	return rows.slice().sort((a, b) => {
		const aHasData = a.accuracy !== null;
		const bHasData = b.accuracy !== null;

		if (aHasData !== bHasData) return aHasData ? -1 : 1;

		if (!aHasData && !bHasData) {
			return a.name.localeCompare(b.name);
		}

		if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;

		const aTime = a.avgCorrectMs ?? -1;
		const bTime = b.avgCorrectMs ?? -1;
		if (aTime !== bTime) return bTime - aTime;

		if (a.attempts !== b.attempts) return b.attempts - a.attempts;

		return a.name.localeCompare(b.name);
	});
}

function getWorstCases(count) {
	const rows = sortWorstToBest(getPerCaseRows());
	return rows.slice(0, count).map(r => r.name);
}

function getTopFailCaseAufRows(limit = 5) {
	const rows = Object.values(stats.perCaseAuf || {})
		.map(item => {
			const fails = (item.incorrect || 0) + (item.timeouts || 0);
			return {
				case: item.case,
				auf: item.auf,
				attempts: item.attempts || 0,
				correct: item.correct || 0,
				incorrect: item.incorrect || 0,
				timeouts: item.timeouts || 0,
				fails
			};
		})
		.filter(item => item.fails > 0)
		.sort((a, b) => {
			if (b.fails !== a.fails) return b.fails - a.fails;
			if (b.attempts !== a.attempts) return b.attempts - a.attempts;
			return a.case.localeCompare(b.case);
		})
		.slice(0, limit);

	return rows;
}

function getHeatmapInfo(caseName) {
	const pc = stats.perCase?.[caseName];

	if (!pc || pc.attempts < 3) {
		return {
			className: "heat-neutral",
			title: `${caseName}: not enough data yet`
		};
	}

	const accuracy = pc.correct / pc.attempts;
	const accPct = (accuracy * 100).toFixed(0);
	const avgCorrect = pc.correct ? msToSec(pc.sumTimeCorrectMs / pc.correct) : "-";

	let className = "heat-good";
	if (accuracy < 0.60) {
		className = "heat-bad";
	} else if (accuracy < 0.85) {
		className = "heat-mid";
	}

	return {
		className,
		title: `${caseName}: ${accPct}% correct (${pc.correct}/${pc.attempts}), avg correct ${avgCorrect}s`
	};
}

function getAufHeatmapInfo(caseName, auf) {
	const key = makeCaseAufKey(caseName, auf);
	const item = stats.perCaseAuf?.[key];

	if (!item || item.attempts < 2) {
		return {
			className: "heat-neutral",
			label: "—",
			title: `${caseName} / ${formatAuf(auf)}: not enough data yet`
		};
	}

	const accuracy = item.correct / item.attempts;
	const accPct = Math.round(accuracy * 100);
	const avgCorrect = item.correct ? msToSec(item.sumTimeCorrectMs / item.correct) : "-";

	let className = "heat-good";
	if (accuracy < 0.60) {
		className = "heat-bad";
	} else if (accuracy < 0.85) {
		className = "heat-mid";
	}

	return {
		className,
		label: `${accPct}%`,
		title: `${caseName} / ${formatAuf(auf)}: ${accPct}% correct (${item.correct}/${item.attempts}), timeouts ${item.timeouts}, avg correct ${avgCorrect}s`
	};
}

function getLastRoundResultForCase(caseName) {
	if (!lastRoundResults || lastRoundResults.length === 0) return null;

	const matches = lastRoundResults.filter(r => r.case === caseName);
	if (matches.length === 0) return null;

	return matches[matches.length - 1];
}

function pushAttemptHistory({ ok, timeMs, timeout, caseName, auf }) {
	attemptHistory.push({
		ok,
		timeout,
		timeMs,
		case: caseName,
		auf: auf ?? "",
		ts: Date.now()
	});

	// Hou de historiek begrensd zodat localStorage niet blijft groeien
	if (attemptHistory.length > 500) {
		attemptHistory = attemptHistory.slice(-500);
	}

	storedData.attemptHistory = attemptHistory;
}


// ============================================================================
// 9) TRAININGSSET-SELECTIE
// ============================================================================
// Deze functies bepalen uit welke cases de trainer mag kiezen.
// De dropdown bepaalt de modus, en de modus bepaalt de toegestane case-lijst.

function getMistakesFromPreviousRound() {
	return previousRoundMistakeCases;
}

/*
// Oude versie: werkte zonder reviewQueue-logica bovenaan.
function getTrainingCaseNames() {
	const mode = document.getElementById("trainingMode")?.value || "all";

	if (mode === "worst5") return getWorstCases(5);
	if (mode === "worst8") return getWorstCases(8);
	if (mode === "mistakes") {
		const mistakes = getMistakesFromPreviousRound();
		return mistakes.length > 0 ? mistakes : PLL.map(p => p.name);
	}

	return PLL.map(p => p.name);
}
*/

function getTrainingCaseNames() {
	if (isReviewRound && Array.isArray(reviewQueue) && reviewQueue.length > 0) {
		return reviewQueue.slice();
	}

	const mode = document.getElementById("trainingMode")?.value || "all";

	if (mode === "worst5") return getWorstCases(5);
	if (mode === "worst8") return getWorstCases(8);
	if (mode === "mistakes") {
		const mistakes = getMistakesFromPreviousRound();
		return mistakes.length > 0 ? mistakes : PLL.map(p => p.name);
	}

	return PLL.map(p => p.name);
}

function pickRandomCaseAvoidRepeat() {
	const allowedNames = getTrainingCaseNames();
	const candidates = PLL.filter(p => allowedNames.includes(p.name));

	if (candidates.length === 0) return PLL[0];
	if (candidates.length === 1) return candidates[0];

	let c;
	do {
		c = candidates[Math.floor(Math.random() * candidates.length)];
	} while (c.name === lastCaseName);

	return c;
}

function randomAuf() {
	const aufOptions = ["", "U", "U2", "U'"];
	return aufOptions[Math.floor(Math.random() * aufOptions.length)];
}

function randomCubeYRotation() {
	const options = ["", "y", "y2", "y'"];
	return options[Math.floor(Math.random() * options.length)];
}


// ============================================================================
// 10) HINT- EN ROTATIEHELPERS
// ============================================================================
// Alles wat te maken heeft met hinttekst, hintvisuals en AUF/rotatieconversies.

function getHint(caseId, auf = "") {
	return HINTS[caseId]?.[auf] || HINTS[caseId]?.[""] || "No hint defined";
}

function getAufKey(auf) {
	if (auf === "") return "0";
	if (auf === "U'") return "Up";
	return auf;
}

function getAufKeyforHint(auf) {
	// Algoritmes zijn gespiegeld; daarom krijgt de hintvisual soms een andere mapping.
	if (auf === "") return "0";
	if (auf == "U") return "Up";
	if (auf === "U'") return "U";
	return auf;
}

function getHintVisualPath(caseName, auf) {
	return `hints/${caseName}_${getAufKey(auf)}.svg`;
}

function aufToDegrees(auf) {
	if (auf === "") return 0;
	if (auf === "U") return 90;
	if (auf === "U2") return 180;
	if (auf === "U'") return 270;
	return 0;
}

function degreesToAufKey(deg) {
	const normalized = ((deg % 360) + 360) % 360;

	if (normalized === 0) return "0";
	if (normalized === 90) return "U";
	if (normalized === 180) return "U2";
	if (normalized === 270) return "Up";

	return "0";
}

function getEffectiveHintAufKey(auf, rotationOffset) {
	const aufDeg = aufToDegrees(auf);
	const totalDeg = aufDeg + rotationOffset;
	return degreesToAufKey(totalDeg);
}


// ============================================================================
// 11) VISUALCUBE URL-OPBOUW
// ============================================================================
// Deze functie bouwt de URL voor de cube-renderer op.
// Handig JS-patroon: eerst een array opbouwen, daarna join(" ") gebruiken.

/*
// Oude helper, niet meer actief.
function randomRotation() {
	const offsets = [0, 90, 180, 270];
	const offset = offsets[Math.floor(Math.random() * offsets.length)];
	return `y${45 + offset}x-34`;
}

function randomRotationInfo() {
	const offsets = [0, 90, 180, 270];
	const offset = offsets[Math.floor(Math.random() * offsets.length)];
	return {
		offset,
		value: `y${45 + offset}x-34`
	};
}
*/

function visualcubeUrl(alg, auf = "", cubeYRotation = "") {
	const parts = [];

	if (cubeYRotation) parts.push(cubeYRotation);
	parts.push(alg);
	if (auf) parts.push(auf);

	const fullAlg = parts.join(" ");
	console.log("full Alg:", fullAlg);

	const base = "http://localhost:8080/visualcube.php";
	const params = new URLSearchParams({
		fmt: "svg",
		pzl: "3",
		size: "240",
		alg: fullAlg
	});

	const showLL = document.getElementById("toggleLL").checked;
	if (showLL) params.append("stage", "ll");

	return `${base}?${params.toString()}`;
}


// ============================================================================
// 12) TIMERS EN UI-STATE HELPERS
// ============================================================================
// Deze functies beheren het tijdsverloop van één case:
// - halftime hint
// - volledige timeout
// - progress bar
// - tonen/verbergen van hintpanelen

function clearRevealTimer() {
	if (revealTimerId !== null) {
		clearTimeout(revealTimerId);
		revealTimerId = null;
	}
}

function clearHintTimer() {
	if (hintTimerId !== null) {
		clearTimeout(hintTimerId);
		hintTimerId = null;
	}
}

function clearProgressBarTimer() {
	if (progressIntervalId !== null) {
		clearInterval(progressIntervalId);
		progressIntervalId = null;
	}
}

function clearAllCaseTimers() {
	clearRevealTimer();
	clearHintTimer();
	clearProgressBarTimer();
}

function setHintVisible(visible) {
	hintVisible = visible;

	const hintBox = document.getElementById("hintBox");
	const hintVisualBox = document.getElementById("hintVisualBox");

	if (hintBox) hintBox.style.display = visible ? "" : "none";
	if (hintVisualBox) hintVisualBox.style.display = visible ? "" : "none";
}

function resetProgressBar() {
	const bar = document.getElementById("timerBar");
	if (!bar) return;

	bar.style.width = "100%";
	bar.classList.remove("warning");
}

function startProgressBar() {
	const bar = document.getElementById("timerBar");
	if (!bar) return;

	resetProgressBar();

	const totalMs = REVEAL_AFTER_MS;
	const warningMs = totalMs / 2;
	const startedAt = performance.now();

	clearProgressBarTimer();

	progressIntervalId = setInterval(() => {
		const elapsed = performance.now() - startedAt;
		const remaining = Math.max(0, totalMs - elapsed);
		const pct = (remaining / totalMs) * 100;

		bar.style.width = `${pct}%`;

		if (elapsed >= warningMs) {
			bar.classList.add("warning");
		}

		if (remaining <= 0) {
			clearProgressBarTimer();
		}
	}, 50);
}

function revealHintMidway() {
	if (!currentCase || answered || hintVisible) return;

	setHintVisible(true);

	const bar = document.getElementById("timerBar");
	if (bar) bar.classList.add("warning");
}

function scheduleAutoReveal() {
	console.log("scheduleAutoReveal start");
	clearAllCaseTimers();

	hintTimerId = setTimeout(() => {
		console.log("HALFWAY fired at", REVEAL_AFTER_MS / 2);
		revealHintMidway();
	}, REVEAL_AFTER_MS / 2);

	revealTimerId = setTimeout(() => {
		console.log("FULL timeout fired at", REVEAL_AFTER_MS);
		onTimeoutReveal();
	}, REVEAL_AFTER_MS);

	startProgressBar();
}

/*
// Oudere eenvoudige timeoutversie, zonder hint-halftime en zonder progressbar.
function scheduleAutoReveal() {
	clearRevealTimer();
	revealTimerId = setTimeout(onTimeoutReveal, REVEAL_AFTER_MS);
}
*/

function setButtonsEnabled(enabled) {
	document.querySelectorAll("#answers button").forEach(b => b.disabled = !enabled);
}

function setCubeResultState(state = "neutral") {
	const cube = document.getElementById("cube");
	if (!cube) return;

	cube.classList.remove("cube-neutral", "cube-correct", "cube-wrong", "cube-timeout");

	if (state === "correct") {
		cube.classList.add("cube-correct");
	} else if (state === "wrong") {
		cube.classList.add("cube-wrong");
	} else if (state === "timeout") {
		cube.classList.add("cube-timeout");
	} else {
		cube.classList.add("cube-neutral");
	}
	console.log("cube state:", state, cube.className);
}


// ============================================================================
// 13) RENDERFUNCTIES
// ============================================================================
// Deze functies beslissen niet WAT de state is, maar tonen de huidige state in de DOM.
// Dat onderscheid is belangrijk:
// - logica bepaalt de toestand
// - renderfuncties tonen die toestand

function renderTrainingSetInfo() {
	const box = document.getElementById("trainingSetInfo");
	if (!box) return;

	const mode = document.getElementById("trainingMode")?.value || "all";

	if (isReviewRound) {
		const labels = reviewQueue.map(key => {
			const item = parseCaseAufKey(key);
			return `${item.case} (${formatAuf(item.auf)})`;
		});
		box.innerHTML = `<b>Active set:</b> Review missed AUFs<br>${labels.join(", ")}`;
		return;
	}

	const names = getTrainingCaseNames();

	const labels = {
		all: "All PLL",
		worst5: "Worst 5",
		worst8: "Worst 8",
		mistakes: "Mistakes from previous round"
	};

	box.innerHTML = `<b>Active set:</b> ${labels[mode]}<br>${names.join(", ")}`;
}

function renderStats(lastLine = null) {
	const acc = stats.attempts ? (100 * stats.correct / stats.attempts) : 0;
	const avgAll = stats.attempts ? (stats.sumTimeAllMs / stats.attempts) : 0;
	const avgCorrect = stats.correct ? (stats.sumTimeCorrectMs / stats.correct) : 0;

	document.getElementById("stats").innerHTML = `
		<div class="stat-grid">
			<div class="stat-pill">
				<div class="stat-label">Total</div>
				<div class="stat-value">${stats.attempts}</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Accuracy</div>
				<div class="stat-value">${acc.toFixed(1)}%</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Correct</div>
				<div class="stat-value">✅ ${stats.correct}</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Incorrect</div>
				<div class="stat-value">❌ ${stats.incorrect}</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Timeouts</div>
				<div class="stat-value">⏱️ ${stats.timeouts}</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Streak</div>
				<div class="stat-value">${stats.streak}</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Best</div>
				<div class="stat-value">${stats.bestStreak}</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Avg all</div>
				<div class="stat-value">${msToSec(avgAll)}s</div>
			</div>

			<div class="stat-pill stat-pill-wide">
				<div class="stat-label">Avg correct</div>
				<div class="stat-value">${msToSec(avgCorrect)}s</div>
			</div>
		</div>

		${lastLine ? `<div class="stat-last">${lastLine}</div>` : ""}
	`;
}

function renderRoundBox() {
	const box = document.getElementById("roundBox");
	const left = ROUND_SIZE - roundIndex;

	if (roundIndex < ROUND_SIZE) {
		box.innerHTML = `<b>Round:</b> ${roundIndex}/${ROUND_SIZE} &nbsp; <b>Left:</b> ${left}`;
		return;
	}

	const correct = roundResults.filter(r => r.ok).length;
	const timeouts = roundResults.filter(r => r.timeout).length;
	const avg = roundResults.length ? (roundResults.reduce((s,r)=>s+r.timeMs,0)/roundResults.length) : 0;
	const avgCorrect = correct ? (roundResults.filter(r=>r.ok).reduce((s,r)=>s+r.timeMs,0)/correct) : 0;
	const accuracy = roundResults.length ? correct / roundResults.length : 0;

	roundHistory.push({
		round: roundHistory.length + 1,
		accuracy: accuracy
	});

	storedData.roundHistory = roundHistory;
	saveStoredData();

	previousRoundMistakeCases = Array.from(
		new Set(
			roundResults
				.filter(r => !r.ok)
				.map(r => makeCaseAufKey(r.case, r.auf))
		)
	);

	const missedList = previousRoundMistakeCases.length
		? previousRoundMistakeCases
			.map(key => {
				const item = parseCaseAufKey(key);
				return `${item.case} (${formatAuf(item.auf)})`;
			})
			.join(", ")
		: "None 🎉";

	lastRoundResults = [...roundResults];
	lastRoundSummary = {
		total: roundResults.length,
		correct,
		incorrect: roundResults.filter(r => !r.ok && !r.timeout).length,
		timeouts,
		avg,
		avgCorrect
	};

	box.innerHTML = `
		<div class="stat-grid">

			<div class="stat-pill score">
				<div class="stat-label">Score</div>
				<div class="stat-value">${correct}/${roundResults.length}</div>
			</div>

			<div class="stat-pill time">
				<div class="stat-label">Timeouts</div>
				<div class="stat-value">⏱️ ${timeouts}</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Avg all</div>
				<div class="stat-value">${msToSec(avg)}s</div>
			</div>

			<div class="stat-pill">
				<div class="stat-label">Avg correct</div>
				<div class="stat-value">${msToSec(avgCorrect)}s</div>
			</div>

		</div>

		<div class="stat-last">
			<b>${isReviewRound ? "Review complete" : "Round complete"}</b><br>
			<b>Missed:</b> ${missedList}

			<div class="round-actions">
				${
					previousRoundMistakeCases.length > 0 && !isReviewRound
						? `<button id="reviewMistakes">Review</button>`
						: ""
				}
				<button id="newRound">
					${isReviewRound ? "Back" : "New round"}
				</button>
			</div>
		</div>
	`;
	
	renderAccuracyGraph();

	const newRoundBtn = document.getElementById("newRound");
	if (newRoundBtn) {
		newRoundBtn.addEventListener("click", () => startNormalRound());
	}

	const reviewBtn = document.getElementById("reviewMistakes");
	if (reviewBtn) {
		reviewBtn.addEventListener("click", () => startReviewRound());
	}
}

function renderPerCaseTable() {
	for (const c of PLL) ensurePerCase(c.name);

	const rows = PLL.map(c => {
		const pc = stats.perCase[c.name];
		const acc = pc.attempts ? (pc.correct / pc.attempts) : null;
		const avgAll = pc.attempts ? (pc.sumTimeAllMs / pc.attempts) : null;
		const avgCorrect = pc.correct ? (pc.sumTimeCorrectMs / pc.correct) : null;

		return {
			name: c.name,
			attempts: pc.attempts,
			correct: pc.correct,
			incorrect: pc.incorrect,
			timeouts: pc.timeouts,
			acc,
			avgAll,
			avgCorrect
		};
	});

	rows.sort((a, b) => {
		const aHas = a.acc !== null;
		const bHas = b.acc !== null;
		if (aHas !== bHas) return aHas ? -1 : 1;

		if (!aHas && !bHas) return a.name.localeCompare(b.name);
		if (a.acc !== b.acc) return a.acc - b.acc;

		const aT = a.avgCorrect ?? -1;
		const bT = b.avgCorrect ?? -1;
		if (aT !== bT) return bT - aT;

		if (a.attempts !== b.attempts) return b.attempts - a.attempts;
		return a.name.localeCompare(b.name);
	});

	const html = `
		<div style="font-weight:700; margin-bottom:6px; color:#f8fafc;">Per-case stats (worst → best)</div>
		<div style="max-height: 540px; overflow:auto; border:1px solid #374151; border-radius:14px; background:#0f172a;">
		  <table style="width:100%; border-collapse:collapse; font-size:14px; color:#e5e7eb;">
			<thead>
				<tr style="position:sticky; top:0; background:#172033;">
					<th style="text-align:left; padding:8px; border-bottom:1px solid #334155;">PLL</th>
					<th style="text-align:center; padding:8px; border-bottom:1px solid #334155;">Last</th>
					<th style="text-align:right; padding:8px; border-bottom:1px solid #334155;">Acc</th>
					<th style="text-align:right; padding:8px; border-bottom:1px solid #334155;">Avg</th>
					<th style="text-align:right; padding:8px; border-bottom:1px solid #334155;">A</th>
					<th style="text-align:right; padding:8px; border-bottom:1px solid #334155;">C</th>
					<th style="text-align:right; padding:8px; border-bottom:1px solid #334155;">T</th>
				</tr>
			</thead>
			<tbody>
				${rows.map(r => {
					const accTxt = r.acc === null ? "—" : (100 * r.acc).toFixed(0) + "%";
					const avgTxt = r.avgAll === null ? "—" : msToSec(r.avgAll) + "s";

					const last = getLastRoundResultForCase(r.name);
					let lastIcon = "";
					let lastTitle = "";

					if (last) {
						if (last.timeout) {
							lastIcon = "⏱";
							lastTitle = "Timeout in last round";
						} else if (last.ok) {
							lastIcon = "✅";
							lastTitle = "Correct in last round";
						} else {
							lastIcon = `❌ (${last.picked})`;
							lastTitle = `Wrong in last round (picked ${last.picked})`;
						}
					}

					return `
					  <tr>
						<td style="padding:8px; border-bottom:1px solid #243041;"><b>${r.name}</b></td>
						<td style="padding:8px; border-bottom:1px solid #243041; text-align:center;" title="${lastTitle}">${lastIcon}</td>
						<td style="padding:8px; border-bottom:1px solid #243041; text-align:right;">${accTxt}</td>
						<td style="padding:8px; border-bottom:1px solid #243041; text-align:right;">${avgTxt}</td>
						<td style="padding:8px; border-bottom:1px solid #243041; text-align:right;">${r.attempts}</td>
						<td style="padding:8px; border-bottom:1px solid #243041; text-align:right;">${r.correct}</td>
						<td style="padding:8px; border-bottom:1px solid #243041; text-align:right;">${r.timeouts}</td>
					  </tr>
					`;
				}).join("")}
			</tbody>
		  </table>
		</div>
		<div style="font-size:12px; margin-top:6px; opacity:0.8; color:#94a3b8;">
			Columns: Acc=accuracy, Avg=avg time (all), A=attempts, C=correct, T=timeouts
		</div>
	`;

	document.getElementById("perCaseBox").innerHTML = html;
}

function renderHint() {
	const hintBox = document.getElementById("hintText");
	const debugBox = document.getElementById("debugText");
	const img = document.getElementById("hintVisualImg");

	if (!currentCase) {
		if (hintBox) hintBox.textContent = "No hint available";
		if (img) img.removeAttribute("src");
		if (debugBox) debugBox.textContent = "No current case";
		return;
	}

	const hintText = getHint(currentCase.name, currentAuf);
	if (hintBox) hintBox.textContent = hintText;

	if (img && currentCase) {
		const effectiveAufKey = getEffectiveHintAufKey(currentAuf);
		img.src = getHintVisualPath(currentCase.name, currentAuf);
		img.alt = `${currentCase.name} ${effectiveAufKey} hint`;
	}

	if (debugBox) {
		debugBox.innerHTML = `
			<div><b>Case:</b> ${currentCase.name}</div>
			<div><b>AUF:</b> ${currentAuf === "" ? "(none)" : currentAuf}</div>
			<div><b>Y rotation:</b> ${currentCubeYRotation === "" ? "(none)" : currentCubeYRotation}</div>
			<div><b>Alg:</b> ${currentCase.alg}</div>
			<div><b>Full alg:</b> ${[currentCubeYRotation, currentCase.alg, currentAuf].filter(Boolean).join(" ")}</div>
			<div><b>Hint:</b> ${hintText}</div>
			<div><b>Hint file:</b> ${getHintVisualPath(currentCase.name, currentAuf)}</div>
		`;
	}
}

function renderAnswerButtons() {
	const container = document.getElementById("answers");
	container.innerHTML = "";

	for (let row = 0; row < ANSWER_GRID.length; row++) {
		for (let col = 0; col < ANSWER_GRID[row].length; col++) {
			const cellValue = ANSWER_GRID[row][col];

			if (!cellValue) {
				const emptyCell = document.createElement("div");
				emptyCell.style.gridColumn = (col + 1).toString();
				emptyCell.style.gridRow = (row + 1).toString();
				container.appendChild(emptyCell);
				continue;
			}

			const pll = getPllByName(cellValue);
			if (!pll) {
				const invalidCell = document.createElement("div");
				invalidCell.textContent = "?";
				invalidCell.title = `Unknown PLL: ${cellValue}`;
				invalidCell.style.gridColumn = (col + 1).toString();
				invalidCell.style.gridRow = (row + 1).toString();
				invalidCell.style.display = "flex";
				invalidCell.style.alignItems = "center";
				invalidCell.style.justifyContent = "center";
				invalidCell.style.border = "1px solid red";
				container.appendChild(invalidCell);
				continue;
			}

			const btn = document.createElement("button");
			btn.type = "button";
			btn.textContent = pll.name;
			btn.style.gridColumn = (col + 1).toString();
			btn.style.gridRow = (row + 1).toString();
			btn.style.padding = "6px 0";
			btn.style.cursor = "pointer";

			const heat = getHeatmapInfo(pll.name);
			btn.classList.add("answer-btn", heat.className);
			btn.title = heat.title;

			btn.addEventListener("click", () => submitAnswer(pll.name));
			container.appendChild(btn);
		}
	}
}

function renderAccuracyGraph() {
	const canvas = document.getElementById("accuracyCanvas");
	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	const w = canvas.width;
	const h = canvas.height;
	ctx.clearRect(0, 0, w, h);

	if (roundHistory.length === 0) {
		ctx.font = "14px sans-serif";
		ctx.fillStyle = "#94a3b8";
		ctx.fillText("No round data yet", 20, 30);
		return;
	}

	const left = 35;
	const right = 10;
	const top = 10;
	const bottom = 25;
	const plotW = w - left - right;
	const plotH = h - top - bottom;

	ctx.strokeStyle = "#64748b";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(left, top);
	ctx.lineTo(left, h - bottom);
	ctx.lineTo(w - right, h - bottom);
	ctx.stroke();

	ctx.fillStyle = "#94a3b8";
	ctx.font = "12px sans-serif";
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";

	[0, 0.5, 1].forEach(val => {
		const y = top + (1 - val) * plotH;
		ctx.fillText(`${Math.round(val * 100)}%`, left - 6, y);
		ctx.strokeStyle = "#243041";
		ctx.beginPath();
		ctx.moveTo(left, y);
		ctx.lineTo(w - right, y);
		ctx.stroke();
	});

	const n = roundHistory.length;
	const stepX = n === 1 ? 0 : plotW / (n - 1);

	ctx.strokeStyle = "#22d3ee";
	ctx.lineWidth = 2;
	ctx.beginPath();

	roundHistory.forEach((item, i) => {
		const x = left + i * stepX;
		const y = top + (1 - item.accuracy) * plotH;
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	});
	ctx.stroke();

	ctx.fillStyle = "#22d3ee";
	roundHistory.forEach((item, i) => {
		const x = left + i * stepX;
		const y = top + (1 - item.accuracy) * plotH;
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, Math.PI * 2);
		ctx.fill();
	});

	ctx.fillStyle = "#94a3b8";
	ctx.font = "11px sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	roundHistory.forEach((item, i) => {
		const x = left + i * stepX;
		ctx.fillText(item.round.toString(), x, h - bottom + 6);
	});
}

function renderTopFailsChart() {
	const canvas = document.getElementById("topFailsCanvas");
	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	const w = canvas.width;
	const h = canvas.height;
	ctx.clearRect(0, 0, w, h);

	const rows = getTopFailCaseAufRows(5);

	if (rows.length === 0) {
		ctx.font = "14px sans-serif";
		ctx.fillStyle = "#94a3b8";
		ctx.fillText("No fail data yet", 20, 30);
		return;
	}

	const left = 78;
	const right = 16;
	const top = 14;
	const rowH = 18;
	const gap = 4;
	const plotW = w - left - right;
	const maxFails = Math.max(...rows.map(r => r.fails), 1);

	rows.forEach((row, i) => {
		const y = top + i * (rowH + gap);
		const barW = (row.fails / maxFails) * plotW;

		ctx.font = "12px sans-serif";
		ctx.fillStyle = "#94a3b8";
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillText(row.case, left - 8, y + rowH / 2);

		ctx.fillStyle = "#0b1220";
		ctx.fillRect(left, y, plotW, rowH);

		ctx.fillStyle = i === 0 ? "#dc2626" : "#f97316";
		ctx.fillRect(left, y, barW, rowH);

		ctx.fillStyle = "#94a3b8";
		ctx.textAlign = "left";
		ctx.fillText(String(row.fails), left + barW + 6, y + rowH / 2);
	});
}

function renderTopFailPatterns() {
	const box = document.getElementById("topFailPatterns");
	if (!box) return;

	const rows = getTopFailCaseAufRows(5);

	if (rows.length === 0) {
		box.innerHTML = `
			<div style="font-size:13px; opacity:0.75;">
				No fail patterns yet.
			</div>
		`;
		return;
	}

	box.innerHTML = `
		<div class="card-title" style="font-weight:700; margin-bottom:6px;">Top fail patterns</div>
		<div class="top-fail-list">
			${rows.map((row, idx) => `
				<div class="top-fail-row" title="${getHint(row.case, row.auf)}">
					<div class="top-fail-rank">#${idx + 1}</div>
					<div class="top-fail-case">${row.case}</div>
					<div class="top-fail-count">${row.fails}x</div>
					<img
						class="top-fail-thumb"
						src="${getHintVisualPath(row.case, row.auf)}"
						alt="${row.case} ${formatAufLabel(row.auf)}"
					/>
				</div>
			`).join("")}
		</div>
	`;
}

function renderAufHeatmap() {
	const box = document.getElementById("aufHeatmapBox");
	if (!box) return;

	const aufs = ["", "U", "U2", "U'"];

	let html = "";

	// Header row
	html += `<div></div>`;
	aufs.forEach(auf => {
		html += `<div class="auf-head">${formatAufLabel(auf)}</div>`;
	});

	// One row per PLL
	PLL.forEach(pll => {
		html += `<div class="auf-row-label">${pll.name}</div>`;

		aufs.forEach(auf => {
			const info = getAufHeatmapInfo(pll.name, auf);
			const key = makeCaseAufKey(pll.name, auf);

			html += `
				<div
					class="auf-cell ${info.className} is-clickable"
					data-case="${pll.name}"
					data-auf="${auf}"
					data-case-auf="${key}"
					data-title="${info.title.replace(/"/g, "&quot;")}"
				>
					<img
						class="auf-cell-thumb"
						src="${getHintVisualPath(pll.name, auf)}"
						alt="${pll.name} ${formatAufLabel(auf)}"
					/>
					<div class="auf-cell-value">${info.label}</div>
				</div>
			`;
		});
	});

	box.innerHTML = html;

	// Klik op een cel start review van precies die combinatie
	box.querySelectorAll(".auf-cell.is-clickable").forEach(cell => {
		cell.addEventListener("click", (e) => {
			e.stopPropagation();

			const caseName = cell.dataset.case;
			const auf = cell.dataset.auf ?? "";
			const title = cell.dataset.title ?? "";
			const key = makeCaseAufKey(caseName, auf);

			if (aufZoomCurrentKey === key) {
				hideAufZoomPopup();
				return;
			}

			showAufZoomPopup({
				caseName,
				auf,
				title,
				anchorEl: cell
			});
		});
	});
}

function renderRollingAverageChart(windowSize = 20) {
	const canvas = document.getElementById("rollingAvgCanvas");
	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	const w = canvas.width;
	const h = canvas.height;
	ctx.clearRect(0, 0, w, h);

	if (!attemptHistory || attemptHistory.length === 0) {
		ctx.font = "14px sans-serif";
		ctx.fillStyle = "#94a3b8";
		ctx.fillText("No solve data yet", 20, 30);
		return;
	}

	// Alleen echte pogingen met tijd meenemen
	const times = attemptHistory
		.filter(item => typeof item.timeMs === "number" && item.timeMs > 0)
		.map(item => item.timeMs / 1000);

	if (times.length === 0) {
		ctx.font = "14px sans-serif";
		ctx.fillStyle = "#94a3b8";
		ctx.fillText("No solve data yet", 20, 30);
		return;
	}

	// Rolling average berekenen
	const points = times.map((_, i) => {
		const start = Math.max(0, i - windowSize + 1);
		const slice = times.slice(start, i + 1);
		const avg = slice.reduce((sum, v) => sum + v, 0) / slice.length;
		return {
			xIndex: i + 1,
			value: avg
		};
	});

	const left = 38;
	const right = 10;
	const top = 10;
	const bottom = 25;
	const plotW = w - left - right;
	const plotH = h - top - bottom;

	const minY = Math.min(...points.map(p => p.value));
	const maxY = Math.max(...points.map(p => p.value));
	const rangeY = Math.max(0.25, maxY - minY);

	const yMin = Math.max(0, minY - rangeY * 0.15);
	const yMax = maxY + rangeY * 0.15;

	// assen
	ctx.strokeStyle = "#64748b";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(left, top);
	ctx.lineTo(left, h - bottom);
	ctx.lineTo(w - right, h - bottom);
	ctx.stroke();

	// hulplijnen en y-labels
	ctx.fillStyle = "#94a3b8";
	ctx.font = "12px sans-serif";
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";

	[0, 0.5, 1].forEach(t => {
		const value = yMin + (yMax - yMin) * (1 - t);
		const y = top + t * plotH;

		ctx.fillText(`${value.toFixed(1)}s`, left - 6, y);
		ctx.strokeStyle = "#243041";
		ctx.beginPath();
		ctx.moveTo(left, y);
		ctx.lineTo(w - right, y);
		ctx.stroke();
	});

	const stepX = points.length === 1 ? 0 : plotW / (points.length - 1);

	// lijn
	ctx.strokeStyle = "#60a5fa";
	ctx.lineWidth = 2;
	ctx.beginPath();

	points.forEach((point, i) => {
		const x = left + i * stepX;
		const y = top + ((yMax - point.value) / (yMax - yMin)) * plotH;

		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	});

	ctx.stroke();

	// punten
	ctx.fillStyle = "#60a5fa";
	points.forEach((point, i) => {
		const x = left + i * stepX;
		const y = top + ((yMax - point.value) / (yMax - yMin)) * plotH;

		ctx.beginPath();
		ctx.arc(x, y, 2.5, 0, Math.PI * 2);
		ctx.fill();
	});

	// x-labels: eerste, midden, laatste
	ctx.fillStyle = "#94a3b8";
	ctx.font = "11px sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	const labelIndexes = [...new Set([
		0,
		Math.floor((points.length - 1) / 2),
		points.length - 1
	])];

	labelIndexes.forEach(i => {
		const x = left + i * stepX;
		ctx.fillText(String(points[i].xIndex), x, h - bottom + 6);
	});
}

// Deze functie tekent een staafdiagram met de nauwkeurigheid per case, van slechtste naar beste.
function renderCaseAccuracyChart() {
	const canvas = document.getElementById("caseAccuracyCanvas");
	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	const w = canvas.width;
	const h = canvas.height;
	ctx.clearRect(0, 0, w, h);

	const rows = sortWorstToBest(getPerCaseRows());

	if (rows.length === 0) {
		ctx.font = "14px sans-serif";
		ctx.fillStyle = "#94a3b8";
		ctx.fillText("No case data yet", 20, 30);
		return;
	}

	const left = 34;
	const right = 10;
	const top = 12;
	const bottom = 42;

	const plotW = w - left - right;
	const plotH = h - top - bottom;

	// assen
	ctx.strokeStyle = "#64748b";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(left, top);
	ctx.lineTo(left, h - bottom);
	ctx.lineTo(w - right, h - bottom);
	ctx.stroke();

	// y-labels + hulplijnen
	ctx.fillStyle = "#94a3b8";
	ctx.font = "11px sans-serif";
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";

	[0, 0.5, 1].forEach(val => {
		const y = top + (1 - val) * plotH;
		ctx.fillText(`${Math.round(val * 100)}%`, left - 6, y);

		ctx.strokeStyle = "#243041";
		ctx.beginPath();
		ctx.moveTo(left, y);
		ctx.lineTo(w - right, y);
		ctx.stroke();
	});

	const barCount = rows.length;
	const stepX = plotW / barCount;
	const barW = Math.max(8, stepX * 0.62);

	rows.forEach((row, i) => {
		const acc = row.accuracy ?? 0;
		const x = left + i * stepX + (stepX - barW) / 2;
		const barH = acc * plotH;
		const y = h - bottom - barH;

		let fill = "#475569"; // geen data
		/*if (row.attempts > 0) {
			if (acc < 0.60) fill = "#ef4444";
			else if (acc < 0.85) fill = "#f59e0b";
			else fill = "#22c55e";
		}*/
		if (row.attempts === 0) {
			fill = "rgba(71, 85, 105, 0.45)";
		} else if (acc < 0.60) {
			fill = "rgba(239, 68, 68, 0.55)";
		} else if (acc < 0.85) {
			fill = "rgba(245, 158, 11, 0.55)";
		} else {
			fill = "rgba(34, 197, 94, 0.55)";
		}

		// bar
		ctx.fillStyle = fill;
		ctx.fillRect(x, y, barW, barH);

		ctx.strokeStyle =
			row.attempts === 0
				? "rgba(71, 85, 105, 0.8)"
				: acc < 0.60
					? "rgba(239, 68, 68, 0.9)"
					: acc < 0.85
						? "rgba(245, 158, 11, 0.9)"
						: "rgba(34, 197, 94, 0.9)";

		ctx.strokeRect(x, y, barW, barH);

		// x-label
		ctx.save();
		ctx.translate(x + barW / 2, h - bottom + 12);
		ctx.rotate(-Math.PI / 6);
		ctx.fillStyle = "#94a3b8";
		ctx.font = "11px sans-serif";
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillText(row.name, 0, 0);
		ctx.restore();
	});
}

function hideAnswerUI() {
	document.getElementById("answerBox").textContent = "";
	document.getElementById("revealHint").textContent = `Answer hidden (auto-timeout in ${(REVEAL_AFTER_MS / 1000).toFixed(0)}s)`;
}

function showAnswerUI(prefix = "Answer:") {
	if (!currentCase) return;
	document.getElementById("answerBox").textContent = `${prefix} ${currentCase.name}`;
	document.getElementById("revealHint").textContent = "";
}

let aufZoomCurrentKey = null;

// Deze functie verbergt de AUF zoom popup.
function hideAufZoomPopup() {
	const popup = document.getElementById("aufZoomPopup");
	if (!popup) return;
	popup.hidden = true;
	aufZoomCurrentKey = null;
}

// Deze functie toont een popup met een vergrote hint-visual en extra info.
function showAufZoomPopup({ caseName, auf, title, anchorEl }) {
	const popup = document.getElementById("aufZoomPopup");
	const img = document.getElementById("aufZoomImg");
	const text = document.getElementById("aufZoomText");
	const reviewBtn = document.getElementById("aufZoomReviewBtn");

	if (!popup || !img || !text || !reviewBtn || !anchorEl) return;

	const key = makeCaseAufKey(caseName, auf);
	aufZoomCurrentKey = key;

	img.src = getHintVisualPath(caseName, auf);
	img.alt = `${caseName} ${formatAufLabel(auf)}`;
	text.textContent = title;

	const rect = anchorEl.getBoundingClientRect();
	const popupWidth = 190;
	const popupHeight = 150;
	const margin = 12;

	let left = rect.right + margin;
	let top = rect.top - 4;

	// Als er rechts te weinig plaats is, toon links van de cel
	if (left + popupWidth > window.innerWidth - 12) {
		left = rect.left - popupWidth - margin;
	}

	// Als er onderaan te weinig plaats is, wat hoger schuiven
	if (top + popupHeight > window.innerHeight - 12) {
		top = Math.max(12, window.innerHeight - popupHeight - 12);
	}

	popup.style.left = `${Math.max(12, left)}px`;
	popup.style.top = `${Math.max(12, top)}px`;
	popup.hidden = false;

	reviewBtn.onclick = () => {
		if (!aufZoomCurrentKey) return;
		hideAufZoomPopup();
		isReviewRound = true;
		reviewQueue = [aufZoomCurrentKey];
		startNewRound();
	};
}


// ============================================================================
// 14) POGING REGISTREREN
// ============================================================================
// Dit is één van de kernfuncties van de app.
// Hier wordt na elk antwoord / timeout de state bijgewerkt:
// - globale stats
// - perCase stats
// - perCaseAuf stats
// - rondevoortgang
// - dashboard-rerendering

function recordAttempt({ ok, timeMs, timeout, picked }) {
	stats.attempts += 1;
	stats.sumTimeAllMs += timeMs;

	const pc = ensurePerCase(currentCase.name);
	pc.attempts += 1;
	pc.sumTimeAllMs += timeMs;

	if (timeout) {
		pc.timeouts += 1;
		pc.incorrect += 1;
	} else if (ok) {
		pc.correct += 1;
		pc.sumTimeCorrectMs += timeMs;
	} else {
		pc.incorrect += 1;
	}

	const pca = ensurePerCaseAuf(currentCase.name, currentAuf);
	pca.attempts += 1;
	pca.sumTimeAllMs += timeMs;

	if (timeout) {
		pca.timeouts += 1;
		pca.incorrect += 1;
	} else if (ok) {
		pca.correct += 1;
		pca.sumTimeCorrectMs += timeMs;
	} else {
		pca.incorrect += 1;
	}

	if (timeout) {
		stats.timeouts += 1;
		stats.incorrect += 1;
		stats.streak = 0;
	} else if (ok) {
		stats.correct += 1;
		stats.sumTimeCorrectMs += timeMs;
		stats.streak += 1;
		if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak;
	} else {
		stats.incorrect += 1;
		stats.streak = 0;
	}

	saveStats();

	roundResults.push({
		ok,
		timeout,
		timeMs,
		case: currentCase?.name ?? "?",
		auf: currentAuf ?? "",
		picked: picked ?? null
	});
	roundIndex += 1;

	pushAttemptHistory({
		ok,
		timeMs,
		timeout,
		caseName: currentCase?.name ?? "?",
		auf: currentAuf ?? ""
	});

	const lastLine =
		timeout
			? `<b>Last:</b> ⏱️ timeout on <b>${currentCase.name}</b> (15.00s)`
			: `<b>Last:</b> ${ok ? "✅" : "❌"} picked <b>${picked}</b>, answer <b>${currentCase.name}</b> in <b>${msToSec(timeMs)}s</b>`;

	renderStats(lastLine);
	renderRoundBox();
	renderPerCaseTable();
	renderTrainingSetInfo();
	renderTopFailsChart();
	renderTopFailPatterns();
	renderRollingAverageChart();
	renderCaseAccuracyChart();
	renderAufHeatmap();
}


// ============================================================================
// 15) CASE FLOW / SPELVERLOOP
// ============================================================================
// Flow op hoog niveau:
// initApp()
//   -> startNewRound()
//      -> nextCase()
//         -> cube renderen + hint voorbereiden + timers starten
// gebruiker antwoordt / timeout
//   -> recordAttempt()
//   -> volgende case of ronde-einde

function onTimeoutReveal() {
	if (!currentCase || answered) return;

	clearAllCaseTimers();
	setHintVisible(true);

	const timeMs = REVEAL_AFTER_MS;
	showAnswerUI("Time’s up. Answer:");
	setButtonsEnabled(false);
	setCubeResultState("timeout");

	recordAttempt({ ok: false, timeMs, timeout: true, picked: null });
	document.getElementById("revealHint").textContent = "Click Next to continue";
}

function submitAnswer(pickedName) {
	if (!currentCase || startPerf === null || answered) return;

	answered = true;
	clearAllCaseTimers();

	const timeMs = performance.now() - startPerf;
	const ok = pickedName === currentCase.name;

	setCubeResultState(ok ? "correct" : "wrong");
	recordAttempt({ ok, timeMs, timeout: false, picked: pickedName });

	if (roundIndex >= ROUND_SIZE) {
		setButtonsEnabled(false);
		showAnswerUI("Round finished. Last answer was:");
		return;
	}

	setTimeout(() => {
		nextCase();
	}, 500);
}

function nextCase() {
	clearRevealTimer();
	answered = false;

	if (roundIndex >= ROUND_SIZE) {
		setButtonsEnabled(false);
		return;
	}

	if (isReviewRound && reviewQueue.length > 0) {
		const key = reviewQueue[roundIndex] || reviewQueue[reviewQueue.length - 1];
		const item = parseCaseAufKey(key);

		currentCase = getPllByName(item.case);
		currentAuf = item.auf;
		currentReviewItem = item;
	} else {
		currentCase = pickRandomCaseAvoidRepeat();
		currentAuf = randomAuf();
		currentReviewItem = null;
	}

	currentCubeYRotation = randomCubeYRotation();
	lastCaseName = currentCase.name;

	const cubeUrl = visualcubeUrl(currentCase.alg, currentAuf, currentCubeYRotation);
	console.log("Cube URL:", cubeUrl);
	document.getElementById("cube").src = cubeUrl;
	setCubeResultState("neutral");

	hintVisible = false;
	renderHint();
	setHintVisible(false);
	resetProgressBar();
	startPerf = performance.now();

	hideAnswerUI();
	setButtonsEnabled(true);
	scheduleAutoReveal();

	renderAnswerButtons();
	renderRoundBox();
}

function startNewRound() {
	clearRevealTimer();
	roundIndex = 0;
	roundResults = [];
	document.getElementById("answerBox").textContent = "";
	document.getElementById("revealHint").textContent = "";
	setButtonsEnabled(true);
	nextCase();
}

function startNormalRound() {
	isReviewRound = false;
	reviewQueue = null;
	startNewRound();
}

function startReviewRound() {
	if (!previousRoundMistakeCases || previousRoundMistakeCases.length === 0) return;

	isReviewRound = true;
	reviewQueue = previousRoundMistakeCases.slice();
	startNewRound();
}


// ============================================================================
// 16) UI EVENT WIRING
// ============================================================================
// Hier koppel je HTML-elementen aan functies.
// Belangrijk JS-concept:
// addEventListener voert een functie niet direct uit,
// maar registreert een callback die later wordt aangeroepen.

document.getElementById("revealNow").addEventListener("click", () => {
	// Handmatig tonen telt NIET als timeout.
	showAnswerUI("Answer:");
});

document.getElementById("nextBtn").addEventListener("click", () => {
	if (roundIndex >= ROUND_SIZE) return;
	nextCase();
});

document.getElementById("toggleLL").addEventListener("change", () => {
	if (!currentCase) return;
	document.getElementById("cube").src = visualcubeUrl(currentCase.alg, currentAuf, currentCubeYRotation);
});

document.getElementById("resetStats").addEventListener("click", () => {
	storedData = defaultStoredData();
	stats = storedData.stats;
	roundHistory = storedData.roundHistory;
	attemptHistory = storedData.attemptHistory;
	settings = storedData.settings;
	roundHistory = [];

	saveStoredData();

	renderStats();
	renderPerCaseTable();
	renderAccuracyGraph();
	renderTopFailsChart();
	renderTopFailPatterns();
	renderRollingAverageChart();
	renderCaseAccuracyChart();
	renderAufHeatmap();
});

const trainingModeEl = document.getElementById("trainingMode");
if (trainingModeEl) {
	trainingModeEl.addEventListener("change", () => {
		renderTrainingSetInfo();
		nextCase();
	});
}


// ============================================================================
// 17) APP STARTUP
// ============================================================================
// Dit is het instappunt van de app.
// Opstartflow:
// 1) stats tonen
// 2) knoppen renderen
// 3) een nieuwe ronde starten
// 4) extra panelen initialiseren

function initApp() {
	renderStats();
	renderAnswerButtons();
	startNewRound();
	renderTrainingSetInfo();
	renderAccuracyGraph();
	renderRollingAverageChart();
	renderCaseAccuracyChart();
	renderAufHeatmap();
}

document.addEventListener("click", (e) => {
	const popup = document.getElementById("aufZoomPopup");
	if (!popup || popup.hidden) return;

	// klik binnen popup → niks doen
	if (popup.contains(e.target)) return;

	// klik op cel → wordt al door cel-handler afgehandeld
	if (e.target.closest(".auf-cell")) return;

	hideAufZoomPopup();
});

// Escape-toets sluit de popup ook
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		hideAufZoomPopup();
	}
});

initApp();

