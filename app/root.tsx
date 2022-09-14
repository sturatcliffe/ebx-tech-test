import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { FormEvent } from "react";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const navigate = useNavigate();
  const params = useParams();

  const { owner, repo } = params;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { owner, repo } = Object.fromEntries(new FormData(e.currentTarget));
    navigate(`/${owner}/${repo}/contributors`);
  };

  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div>
          <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            <div className="flex flex-grow flex-col overflow-y-auto bg-gray-800 pt-5">
              <div className="flex flex-1 flex-col">
                <form className="space-y-6 px-2" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="owner"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Owner
                    </label>
                    <div className="mt-1">
                      <input
                        id="owner"
                        name="owner"
                        type="text"
                        autoComplete="owner"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={owner}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="repo"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Repository
                    </label>
                    <div className="mt-1">
                      <input
                        id="repo"
                        name="repo"
                        type="text"
                        autoComplete="repo"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={repo}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      View contributors
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col md:pl-64">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
