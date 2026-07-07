
const BASE_URL = "https://jsonplaceholder.typicode.com";

async function fetchJSON(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

async function fetchAllData() {
  const [users, posts, todos] = await Promise.all([
    fetchJSON("/users"),
    fetchJSON("/posts"),
    fetchJSON("/todos"),
  ]);
  return { users, posts, todos };
}

function buildUserRecords(users, posts, todos) {
  return users
    .map((user) => {
      const userPosts = posts.filter((post) => post.userId === user.id);
      const userTodos = todos.filter((todo) => todo.userId === user.id);
      const completedTodos = userTodos.filter((todo) => todo.completed).length;
      const openTodos = userTodos.length - completedTodos;

      return {
        name: user.name,
        email: user.email,
        city: user.address.city,
        postCount: userPosts.length,
        completedTodos,
        openTodos,
      };
    })
    .sort((a, b) => {
      if (b.postCount !== a.postCount) return b.postCount - a.postCount;
      return a.name.localeCompare(b.name);
    });
}

function computeSummary(records) {
  const totals = records.reduce(
    (acc, record) => {
      acc.totalPosts += record.postCount;
      if (record.completedTodos > acc.maxCompleted) {
        acc.maxCompleted = record.completedTodos;
        acc.topCompleter = record.name;
      }
      return acc;
    },
    { totalPosts: 0, maxCompleted: -1, topCompleter: null }
  );

  const totalUsers = records.length;
  const averagePosts = totalUsers === 0 ? 0 : totals.totalPosts / totalUsers;

  return {
    totalUsers,
    totalPosts: totals.totalPosts,
    averagePosts,
    topCompleter: totals.topCompleter,
  };
}

function padColumn(value, width) {
  const str = String(value);
  if (str.length >= width) return `${str.slice(0, width - 1)} `;
  return str + " ".repeat(width - str.length);
}

const COLUMNS = [
  { key: "name", label: "Name", width: 22 },
  { key: "email", label: "Email", width: 28 },
  { key: "city", label: "City", width: 16 },
  { key: "postCount", label: "Posts", width: 7 },
  { key: "completedTodos", label: "Done", width: 7 },
  { key: "openTodos", label: "Open", width: 7 },
];

function printReport(records, summary) {
  const headerLine = COLUMNS.map((col) => padColumn(col.label, col.width)).join("");
  console.log(headerLine);
  console.log("-".repeat(headerLine.length));

  records.forEach((record) => {
    const line = COLUMNS.map((col) => padColumn(record[col.key], col.width)).join("");
    console.log(line);
  });

  console.log("\nSummary");
  console.log("-------");
  console.log(`Total users: ${summary.totalUsers}`);
  console.log(`Total posts: ${summary.totalPosts}`);
  console.log(`Average posts per user: ${summary.averagePosts.toFixed(2)}`);
  console.log(`Most completed todos: ${summary.topCompleter}`);
}

async function main() {
  try {
    const { users, posts, todos } = await fetchAllData();
    const records = buildUserRecords(users, posts, todos);
    const summary = computeSummary(records);
    printReport(records, summary);
  } catch (error) {
    console.error(
      "Sorry, something went wrong while fetching data. Please check your internet connection and try again."
    );
    console.error(`Details: ${error.message}`);
    process.exitCode = 1;
  }
}

main();