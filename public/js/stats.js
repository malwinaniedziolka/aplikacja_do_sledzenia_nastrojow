// Aktywacja przycisków żeby zmieniały kolor po kliknięciu
const buttons = document.querySelectorAll('.button1');
buttons.forEach((button) => {
	button.addEventListener('click', () => {
		buttons.forEach((btn) => btn.classList.remove('button1--active'));
		button.classList.add('button1--active');
	});
});

let chart;

// Grupowanie według daty
function groupByDate(entries, type) {
	const grouped = {};

	entries.forEach((entry) => {
		const dateObj = new Date(entry.date);

		let key;
		if (type === 'year') {
			// Grupowanie po miesiącach: YYYY-MM
			key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
				2,
				'0'
			)}`;
		} else {
			// Grupowanie po dniach: YYYY-MM-DD
			key = dateObj.toISOString().split('T')[0];
		}
		//Pokazywanie średniej arytmetycznej z miesięcy w statystykach rocznych
		if (!grouped[key]) grouped[key] = [];
		grouped[key].push(Number(entry.rating));
	});

	return Object.entries(grouped)
		.map(([date, ratings]) => ({
			date,
			avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
		}))
		.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderChart(type, weekEntries, monthEntries, yearEntries) {
	const dataMap = {
		week: weekEntries,
		month: monthEntries,
		year: yearEntries,
	};

	const grouped = groupByDate(dataMap[type], type);
	let labels;

	if (type === 'week') {
		labels = grouped.map((e) => {
			const d = new Date(e.date);
			return d.toLocaleDateString('en-US', { weekday: 'long' }); //Poniedziałek, Wtorek ...
		});
	} else if (type === 'month') {
		labels = grouped.map((e) => {
			const d = new Date(e.date);
			return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }); //31 maja, 29 maja ...
		});
	} else if (type === 'year') {
		labels = grouped.map((e) => {
			const [year, month] = e.date.split('-');
			return new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
				month: 'long',
			}); //Styczeń, Luty ...
		});
	}

	const data = grouped.map((e) => e.avgRating);
	const ctx = document.getElementById('statsChart').getContext('2d');

	if (chart) chart.destroy();

	chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					label: 'Średni nastrój',
					data,
					borderColor: '#43334c',
					backgroundColor: '#43334c30',
					tension: 0.4,
				},
			],
		},
		options: {
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					suggestedMax: 5,
				},
			},
		},
	});
}

// Inicjalizacja po załadowaniu strony
window.addEventListener('DOMContentLoaded', () => {
	const weekEntries = JSON.parse(
		document.getElementById('weekData').textContent
	);
	const monthEntries = JSON.parse(
		document.getElementById('monthData').textContent
	);
	const yearEntries = JSON.parse(
		document.getElementById('yearData').textContent
	);

	// domyślny widok — obecny tydzień
	renderChart('week', weekEntries, monthEntries, yearEntries);
	document.getElementById('btn-week').classList.add('button1--active');

	// obsługa przycisków
	document.getElementById('btn-week').addEventListener('click', () => {
		renderChart('week', weekEntries, monthEntries, yearEntries);
	});
	document.getElementById('btn-month').addEventListener('click', () => {
		renderChart('month', weekEntries, monthEntries, yearEntries);
	});
	document.getElementById('btn-year').addEventListener('click', () => {
		renderChart('year', weekEntries, monthEntries, yearEntries);
	});
});
