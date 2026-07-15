// user-insights-cli: fetches users, posts, and todos, then prints a sorted report.
import { ApiUser, ApiPost, ApiTodo, UserRecord, Summary } from "./types";
import { groupBy } from "./utils";

const BASE_URL = "https://jsonplaceholder.typicode.com";

interface CliOptions {
  minPosts: number;
}

function parseCliOptions(args: string[]): Required<CliOptions> {
  const options: Partial<CliOptions> = {};

  const flagIndex = args.indexOf("--min-posts");
  if (flagIndex !== -1) {
    const raw = args[flagIndex + 1];
    const parsed = Number(raw);

    if (raw === undefined || raw.trim() === "" || Number.isNaN(parsed)) {
      console.error(`Invalid value for --min-posts: "${raw}". Expected a number.`);
      process.exit(1);
    }

    options.minPosts = parsed;
  }

  return { minPosts: options.minPosts ?? 0 };
}

async function fetchJSON<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

async function fetchAllData() {
  const [users, posts, todos] = await Promise.all([
    fetchJSON<ApiUser[]>("/users"),
    fetchJSON<ApiPost[]>("/posts"),
    fetchJSON<ApiTodo[]>("/todos"),
  ]);
  return { users, posts, todos };
}

function buildUserRecords(
  users: ApiUser[],
  posts: ApiPost[],
  todos: ApiTodo[]
): UserRecord[] {
  const postsByUser = groupBy(posts, (post: ApiPost) => String(post.userId));
  const todosByUser = groupBy(todos, (todo: ApiTodo) => String(todo.userId));

  return users
    .map((user: ApiUser) => {
      const userPosts = postsByUser[String(user.id)] ?? [];
      const userTodos = todosByUser[String(user.id)] ?? [];
      const completedTodos = userTodos.filter((todo: ApiTodo) => todo.completed).length;
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
    .sort((a: UserRecord, b: UserRecord) => {
      if (b.postCount !== a.postCount) return b.postCount - a.postCount;
      return a.name.localeCompare(b.name);
    });
}

function computeSummary(records: UserRecord[]): Summary {
  const totals = records.reduce(
    (
      acc: { totalPosts: number; maxCompleted: number; topCompleter: string | null },
      record: UserRecord
    ) => {
      acc.totalPosts += record.postCount;
      if (record.completedTodos > acc.maxCompleted) {
        acc.maxCompleted = record.completedTodos;
        acc.topCompleter = record.name;
      }
      return acc;
    },
    { totalPosts: 0, maxCompleted: -1, topCompleter: null as string | null }
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

function padColumn(value: string | number, width: number): string {
  const str = String(value);
  if (str.length >= width) return `${str.slice(0, width - 1)} `;
  return str + " ".repeat(width - str.length);
}

const COLUMNS: { key: keyof UserRecord; label: string; width: number }[] = [
  { key: "name", label: "Name", width: 22 },
  { key: "email", label: "Email", width: 28 },
  { key: "city", label: "City", width: 16 },
  { key: "postCount", label: "Posts", width: 7 },
  { key: "completedTodos", label: "Done", width: 7 },
  { key: "openTodos", label: "Open", width: 7 },
];

function printReport(records: UserRecord[], summary: Summary) {
  const headerLine = COLUMNS.map((col) => padColumn(col.label, col.width)).join("");
  console.log(headerLine);
  console.log("-".repeat(headerLine.length));
  records.forEach((record: UserRecord) => {
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
  const options = parseCliOptions(process.argv.slice(2));

  try {
    const { users, posts, todos } = await fetchAllData();
    const allRecords = buildUserRecords(users, posts, todos);
    const records = allRecords.filter((record) => record.postCount >= options.minPosts);
    const summary = computeSummary(records);
    printReport(records, summary);
  } catch (error: unknown) {
    console.error(
      "Sorry, something went wrong while fetching data. Please check your internet connection and try again."
    );
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Details: ${message}`);
    process.exitCode = 1;
  }
}

main();