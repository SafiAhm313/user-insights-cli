
# user-insights-cli

A command-line tool that fetches data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
(a free fake API, no key required) and prints a report on each user: their post count,
completed todos, and open todos — sorted by post count, with summary statistics.

## Requirements

- Node.js 18 or higher (needed for the built-in `fetch` API)

Check your version:

```bash
node -v
```

## Setup

1. Clone this repository:

```bash
   git clone https://github.com/SafiAhm313/user-insights-cli.git
   cd user-insights-cli
```

2. No dependencies to install — this project uses only built-in Node.js features
   (native `fetch`, ES modules).

## Running the report

```bash
npm start
```

This prints an aligned report of all users (name, email, city, post count, completed
todos, open todos), sorted by post count descending (ties broken alphabetically by
name), followed by a summary:

- Total users
- Total posts
- Average posts per user
- The user with the most completed todos

## How it works

- `fetchAllData()` fetches `/users`, `/posts`, and `/todos` **concurrently** using
  `Promise.all`, rather than three sequential requests.
- `buildUserRecords()` combines the three datasets into one record per user using
  only array methods (`map`, `filter`) — no `for` or `while` loops.
- `computeSummary()` calculates totals and the top todo-completer with a single
  `reduce` pass.
- Network failures (bad URL, no connection, non-2xx response) are caught in `main()`,
  which prints a friendly error message and exits with a non-zero status code.

## Testing the error path

To confirm error handling works, temporarily break `BASE_URL` in `index.js` to an
invalid path, run `npm start`, and confirm:

- A friendly error message prints (not a raw stack trace)
- The exit code is non-zero:

```bash
  npm start; echo "Exit code: $?"
```

Revert `BASE_URL` afterward.

## Project structure

```
user-insights-cli/
├── index.js       # main script
├── package.json   # ES module config, npm start script
└── README.md
```