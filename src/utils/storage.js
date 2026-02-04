export const GameStorage = {
  saveScore(name, amount) {
    const scores = JSON.parse(localStorage.getItem('millionaire_scores') || '[]');
    scores.push({ name, amount, date: new Date().toLocaleDateString() });
    // Ordenar de mayor a menor y guardar los top 10
    scores.sort((a, b) => b.amount - a.amount);
    localStorage.setItem('millionaire_scores', JSON.stringify(scores.slice(0, 10)));
  },
  getScores() {
    return JSON.parse(localStorage.getItem('millionaire_scores') || '[]');
  }
};