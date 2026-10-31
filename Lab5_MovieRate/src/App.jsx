import { useEffect, useState } from 'react'
import './App.css'

const MAX_STARS = 5

function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="Star rating">
      {Array.from({ length: MAX_STARS }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'star on' : 'star off'}
          onClick={() => onChange(n === value ? 0 : n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          {n <= value ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  )
}

function App() {
  const [movies, setMovies] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('movies')) || []
    } catch {
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('movies', JSON.stringify(movies))
    } catch {
      // storage unavailable, ignore
    }
  }, [movies])

  function addMovie(e) {
    e.preventDefault()
    const name = title.trim()
    if (!name) return
    setMovies([
      { id: Date.now(), title: name, rating, review: review.trim() },
      ...movies,
    ])
    setTitle('')
    setRating(0)
    setReview('')
  }

  function removeMovie(id) {
    setMovies(movies.filter((m) => m.id !== id))
  }

  function updateMovie(id, changes) {
    setMovies(movies.map((m) => (m.id === id ? { ...m, ...changes } : m)))
  }

  return (
    <div className="app">
      <h1>🎬 Movies Watchlist</h1>

      <form className="card add-form" onSubmit={addMovie}>
        <input
          type="text"
          placeholder="Movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="row">
          <span>Your rating:</span>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <textarea
          placeholder="Write a short review (optional)"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button type="submit" className="primary" disabled={!title.trim()}>
          Add movie
        </button>
      </form>

      {movies.length === 0 ? (
        <p className="empty">No movies yet. Add the first one you watched!</p>
      ) : (
        <ul className="movie-list">
          {movies.map((m) => (
            <li key={m.id} className="card movie">
              <div className="movie-header">
                <h2>{m.title}</h2>
                <button
                  className="danger"
                  onClick={() => removeMovie(m.id)}
                  aria-label={`Remove ${m.title}`}
                >
                  Remove
                </button>
              </div>

              <div className="stars-display">
                {m.rating > 0 ? (
                  <>
                    <span className="emoji-stars">{'⭐'.repeat(m.rating)}</span>
                    <span className="count">
                      {m.rating} / {MAX_STARS} star{m.rating > 1 ? 's' : ''}
                    </span>
                  </>
                ) : (
                  <span className="count">Not rated yet</span>
                )}
              </div>

              <div className="row">
                <span>Change rating:</span>
                <StarPicker
                  value={m.rating}
                  onChange={(n) => updateMovie(m.id, { rating: n })}
                />
              </div>

              <textarea
                placeholder="Add a review..."
                rows={2}
                value={m.review}
                onChange={(e) => updateMovie(m.id, { review: e.target.value })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
