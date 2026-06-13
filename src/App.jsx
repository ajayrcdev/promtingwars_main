import { useState } from 'react'
import './App.css'

const PROMPTS = [
  { a: 'Explain quantum computing like I\'m 5', b: 'Explain quantum computing like I\'m a PhD student' },
  { a: 'Write a poem about a cat in space', b: 'Write a haiku about a dog on mars' },
  { a: 'Give me 5 creative date ideas under $20', b: 'Give me 5 creative date ideas over $500' },
  { a: 'Describe the color blue to a blind person', b: 'Describe the color red to a blind person' },
  { a: 'Write a tweet announcing a startup', b: 'Write a tweet announcing the same startup failed' },
  { a: 'Explain recursion in programming', b: 'Explain recursion in programming... recursively' },
  { a: 'Write a motivational quote for Monday', b: 'Write a realistic quote for Monday' },
  { a: 'Design a meal plan for a bodybuilder', b: 'Design a meal plan for a couch potato' },
  { a: 'Write a Tinder bio that will get matches', b: 'Write a Tinder bio that will NOT get matches' },
  { a: 'Give advice to your past self at 16', b: 'Give advice to your future self at 60' },
  { a: 'Explain why pineapple belongs on pizza', b: 'Explain why pineapple does NOT belong on pizza' },
  { a: 'Write a LinkedIn post about quitting your job', b: 'Write a LinkedIn post about being fired' },
]

function App() {
  const [pair, setPair] = useState(0)
  const [votes, setVotes] = useState({ a: 0, b: 0 })
  const [voted, setVoted] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [history, setHistory] = useState([])

  const current = PROMPTS[pair]

  function vote(choice) {
    if (voted) return
    setVoted(choice)
    setVotes(prev => ({ ...prev, [choice]: prev[choice] + 1 }))
    setHistory(prev => [...prev, { pair: pair + 1, choice, prompt: current[choice] }])
  }

  function next() {
    if (pair + 1 >= PROMPTS.length) {
      setShowResults(true)
      return
    }
    setPair(p => p + 1)
    setVoted(null)
  }

  function reset() {
    setPair(0)
    setVotes({ a: 0, b: 0 })
    setVoted(null)
    setShowResults(false)
    setHistory([])
  }

  if (showResults) {
    const winner = votes.a > votes.b ? 'A' : votes.b > votes.a ? 'B' : 'Tie'
    return (
      <div className="container">
        <div className="results-page">
          <h1>🏆 Results</h1>
          <div className="score-final">
            <div className="score-card winner-a">
              <h3>Prompt A</h3>
              <span className="score-num">{votes.a}</span>
            </div>
            <div className="vs-badge">VS</div>
            <div className="score-card winner-b">
              <h3>Prompt B</h3>
              <span className="score-num">{votes.b}</span>
            </div>
          </div>
          <h2>{winner === 'Tie' ? "It's a tie!" : `Prompt ${winner} wins!`}</h2>
          <div className="history">
            <h3>Battle History</h3>
            {history.map((h, i) => (
              <div key={i} className="history-item">
                <span className="round">#{h.pair}</span>
                <span>Chose <strong>Prompt {h.choice.toUpperCase()}</strong></span>
                <span className="prompt-text">"{h.prompt}"</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={reset}>Play Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1>⚔️ Prompting Wars</h1>
        <p className="subtitle">Which prompt is better? You decide.</p>
        <span className="round-badge">Round {pair + 1} of {PROMPTS.length}</span>
      </header>

      <div className="battle-arena">
        <button
          className={`card ${voted === 'a' ? 'chosen' : ''}`}
          onClick={() => vote('a')}
          disabled={!!voted}
        >
          <span className="card-label">Prompt A</span>
          <p className="card-text">{current.a}</p>
          {voted === 'a' && <span className="check">✓</span>}
        </button>

        <div className="vs">VS</div>

        <button
          className={`card ${voted === 'b' ? 'chosen' : ''}`}
          onClick={() => vote('b')}
          disabled={!!voted}
        >
          <span className="card-label">Prompt B</span>
          <p className="card-text">{current.b}</p>
          {voted === 'b' && <span className="check">✓</span>}
        </button>
      </div>

      {voted && (
        <div className="next-section">
          <button className="btn btn-primary" onClick={next}>
            {pair + 1 >= PROMPTS.length ? 'See Results' : 'Next Battle →'}
          </button>
        </div>
      )}
    </div>
  )
}

export default App
