import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FormEvent, ReactNode, useState } from "react";
import { json } from "react-router";

interface Commit {
  sha: string;
  author: Author;
}

interface Author {
  name: string;
  email: string;
}

interface LoaderData {
  owner: string;
  repo: string;
  commits: Commit[];
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div className="py-20 px-16 text-center">
      <h2 className="font-semibold text-slate-900">Something went wrong...</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{error.message}</p>
    </div>
  );
};

export const loader: LoaderFunction = async ({ params }) => {
  const { owner, repo } = params;

  if (!owner || !repo) {
    throw new Error("Missing owner and/or repo route params.");
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits`
  );

  console.log(res);

  if (!res.ok) {
    throw new Error(
      "The specified github repo either does not exist, or is not public."
    );
  }

  const rawResponse = await res.json();

  const commits: Commit[] = rawResponse.map((item: any): Commit => {
    const {
      sha,
      commit: {
        author: { name, email },
      },
    } = item;

    if (!sha || !name || !email) {
      throw new Error("Invalid response from GitHub API.");
    }

    return {
      sha,
      author: {
        name,
        email,
      },
    };
  });

  return json<LoaderData>({
    owner,
    repo,
    commits,
  });
};

const highlightSearchTerm = (author: Author, searchTerm: string): ReactNode => {
  const text = `${author.name}<${author.email}>`;
  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === searchTerm.toLowerCase()
              ? "bg-yellow-200"
              : ""
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

export default function () {
  const { owner, repo, commits } = useLoaderData<LoaderData>();

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
        <div className="flex flex-1 justify-between px-4">
          <div className="flex flex-1">
            <div className="flex w-full md:ml-0">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setSearchTerm(e.currentTarget.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="py-6">
          <div className="px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Recent contributors for {owner}/{repo}
            </h1>
          </div>
          <div className="px-4 sm:px-6 md:px-8">
            <div className="py-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {commits.map((commit) => (
                <div
                  key={commit.sha}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  {highlightSearchTerm(commit.author, searchTerm)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
