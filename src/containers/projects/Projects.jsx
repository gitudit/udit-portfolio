import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import "./Project.css";
import Button from "../../components/button/Button";
import { openSource, socialMediaLinks } from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../loading/Loading";
import { githubGraphQL } from "../../lib/github";

const GithubRepoCard = lazy(() => import("../../components/githubRepoCard/GithubRepoCard"));

const pinnedReposQuery = (login) => `
  {
    user(login: "${login}") {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        totalCount
        edges {
          node {
            ... on Repository {
              name
              description
              forkCount
              stargazers {
                totalCount
              }
              url
              id
              diskUsage
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export default function Projects() {
  const { isDark } = useContext(StyleContext);
  const [repos, setRepos] = useState([]); // [] while loading, array of edges, or "Error"

  useEffect(() => {
    if (!openSource.display) return undefined;
    let alive = true;
    githubGraphQL(pinnedReposQuery(openSource.githubUserName), openSource.githubConvertedToken)
      .then((data) => {
        if (alive) setRepos(data.user.pinnedItems.edges);
      })
      .catch((error) => {
        console.error(error);
        console.error(
          "Because of this Error, nothing is shown in place of Projects section. Projects section not configured"
        );
        if (alive) setRepos("Error");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!openSource.display || typeof repos === "string") {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="main" id="opensource">
        <h1 className="project-title">Open Source Projects</h1>
        <div className="repo-cards-div-main">
          {repos.map((v) => {
            return <GithubRepoCard repo={v} key={v.node.id} isDark={isDark} />;
          })}
        </div>
        <Button text={"More Projects"} className="project-button" href={socialMediaLinks.github} newTab={true} />
      </div>
    </Suspense>
  );
}
