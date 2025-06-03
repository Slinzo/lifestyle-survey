document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('results-container');

  try {
    const res = await fetch('/results');
    if (!res.ok) throw new Error("Failed to fetch results");

    const data = await res.json();

    if (data.length === 0) {
      container.innerHTML = `<p>No survey data available yet.</p>`;
      return;
    }

      const total = data.length;
      const ages = data.map(d => d.age);
      const avgAge = (ages.reduce((a, b) => a + b, 0) / total).toFixed(1);
      const oldest = Math.max(...ages);
      const youngest = Math.min(...ages);
  
      // Percentages for favorite foods
      const countFood = (keyword) =>
        data.filter(d => d.food.toLowerCase().includes(keyword)).length;
  
      const pizzaPercent = ((countFood("pizza") / total) * 100).toFixed(1);
      const pastaPercent = ((countFood("pasta") / total) * 100).toFixed(1);
      const papPercent = ((countFood("pap and wors") / total) * 100).toFixed(1);
  
      // Average ratings
      const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  
      const watchMoviesAvg = avg(data.map(d => d.watchMovies));
      const listenRadioAvg = avg(data.map(d => d.listenRadio));
      const eatOutAvg = avg(data.map(d => d.eatOut));
      const watchTVAvg = avg(data.map(d => d.watchTV));
  
      container.innerHTML = `
        <table border="1" cellpadding="10" cellspacing="0" class="results-table">
          <tr><th>Total Surveys</th><td>${total}</td></tr>
          <tr><th>Average Age</th><td>${avgAge}</td></tr>
          <tr><th>Oldest Participant</th><td>${oldest}</td></tr>
          <tr><th>Youngest Participant</th><td>${youngest}</td></tr>
          <tr><th>% Who Like Pizza</th><td>${pizzaPercent}%</td></tr>
          <tr><th>% Who Like Pasta</th><td>${pastaPercent}%</td></tr>
          <tr><th>% Who Like Pap and Wors</th><td>${papPercent}%</td></tr>
          <tr><th>Avg Rating - Watch Movies</th><td>${watchMoviesAvg}</td></tr>
          <tr><th>Avg Rating - Listen to Radio</th><td>${listenRadioAvg}</td></tr>
          <tr><th>Avg Rating - Eat Out</th><td>${eatOutAvg}</td></tr>
          <tr><th>Avg Rating - Watch TV</th><td>${watchTVAvg}</td></tr>
        </table>
      `;

    } catch (error) {
      container.innerHTML = `<p style="color: red;">Unable to load results at this time.</p>`;
      console.error("Error loading results:", error);
    }
  });  
  
  